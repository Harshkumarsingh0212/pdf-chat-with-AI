from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from chat import (
    NoExtractableTextError,
    VectorStoreNotFoundError,
    get_pdf_text,
    get_text_chunks,
    get_vector_store,
    handle_user_input,
    reset_vector_store,
    vector_store_exists,
)

load_dotenv()

app = FastAPI(title="PDF Chat AI")

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Chat(BaseModel):
    question: str
    answer: str


class Item(BaseModel):
    chat_history: list[Chat]
    question: str


@app.get("/")
def read_root():
    return {"status": "ok", "ready": vector_store_exists()}


@app.get("/status/")
def get_status():
    return {"ready": vector_store_exists()}


@app.post("/uploadfile/")
async def create_upload_file(file_uploads: list[UploadFile]):
    if not file_uploads:
        raise HTTPException(status_code=400, detail="No files were uploaded.")

    for file_upload in file_uploads:
        if not (file_upload.filename or "").lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail=f"'{file_upload.filename}' is not a PDF file.",
            )

    for f in UPLOAD_DIR.glob("*"):
        if f.is_file():
            f.unlink()

    for file_upload in file_uploads:
        data = await file_upload.read()
        if not data:
            raise HTTPException(status_code=400, detail=f"'{file_upload.filename}' is empty.")
        save_to = UPLOAD_DIR / file_upload.filename
        with open(save_to, "wb") as f:
            f.write(data)

    try:
        raw_text = get_pdf_text(UPLOAD_DIR)
        text_chunks = get_text_chunks(raw_text)
        get_vector_store(text_chunks)
    except NoExtractableTextError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF(s): {exc}") from exc

    return {"filenames": [f.filename for f in file_uploads]}


@app.post("/question/")
async def create_user_query(item: Item):
    if not item.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        answer = handle_user_input(item.question, item.chat_history)
    except VectorStoreNotFoundError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to answer question: {exc}") from exc

    chat_history = [chat.model_dump() for chat in item.chat_history]
    chat_history.insert(0, {"question": item.question, "answer": answer})

    return {"chat_history": chat_history}


@app.delete("/reset/")
def reset():
    for f in UPLOAD_DIR.glob("*"):
        if f.is_file():
            f.unlink()
    reset_vector_store()
    return {"status": "reset"}
