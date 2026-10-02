import re
from pathlib import Path

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, UploadFile
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
# Each visitor's uploads live in their own subdirectory, named after their
# session ID, so concurrent users never see or overwrite each other's files.
UPLOAD_BASE_DIR = BASE_DIR / "uploads"
UPLOAD_BASE_DIR.mkdir(exist_ok=True)

# Client-generated session IDs (a UUID from crypto.randomUUID()) are used
# directly as filesystem directory names, so they're validated strictly
# against this pattern to rule out path traversal (e.g. "../../etc").
SESSION_ID_PATTERN = re.compile(r"^[a-zA-Z0-9_-]{8,64}$")

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


def get_session_id(x_session_id: str = Header(..., alias="X-Session-Id")) -> str:
    """Dependency that validates and returns the caller's session ID.

    Every data-touching endpoint depends on this so requests are always
    scoped to one visitor's own uploads/index and never leak into or
    collide with another visitor's session.
    """
    if not SESSION_ID_PATTERN.match(x_session_id):
        raise HTTPException(status_code=400, detail="Missing or invalid X-Session-Id header.")
    return x_session_id


def session_upload_dir(session_id: str) -> Path:
    upload_dir = UPLOAD_BASE_DIR / session_id
    upload_dir.mkdir(parents=True, exist_ok=True)
    return upload_dir


@app.get("/")
def read_root():
    return {"status": "ok"}


@app.get("/status/")
def get_status(session_id: str = Depends(get_session_id)):
    return {"ready": vector_store_exists(session_id)}


@app.post("/uploadfile/")
async def create_upload_file(
    file_uploads: list[UploadFile],
    session_id: str = Depends(get_session_id),
):
    if not file_uploads:
        raise HTTPException(status_code=400, detail="No files were uploaded.")

    for file_upload in file_uploads:
        if not (file_upload.filename or "").lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail=f"'{file_upload.filename}' is not a PDF file.",
            )

    upload_dir = session_upload_dir(session_id)
    for f in upload_dir.glob("*"):
        if f.is_file():
            f.unlink()

    for file_upload in file_uploads:
        data = await file_upload.read()
        if not data:
            raise HTTPException(status_code=400, detail=f"'{file_upload.filename}' is empty.")
        save_to = upload_dir / file_upload.filename
        with open(save_to, "wb") as f:
            f.write(data)

    try:
        raw_text = get_pdf_text(upload_dir)
        text_chunks = get_text_chunks(raw_text)
        get_vector_store(text_chunks, session_id)
    except NoExtractableTextError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF(s): {exc}") from exc

    return {"filenames": [f.filename for f in file_uploads]}


@app.post("/question/")
async def create_user_query(item: Item, session_id: str = Depends(get_session_id)):
    if not item.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        answer = handle_user_input(item.question, item.chat_history, session_id)
    except VectorStoreNotFoundError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to answer question: {exc}") from exc

    chat_history = [chat.model_dump() for chat in item.chat_history]
    chat_history.insert(0, {"question": item.question, "answer": answer})

    return {"chat_history": chat_history}


@app.delete("/reset/")
def reset(session_id: str = Depends(get_session_id)):
    upload_dir = session_upload_dir(session_id)
    for f in upload_dir.glob("*"):
        if f.is_file():
            f.unlink()
    reset_vector_store(session_id)
    return {"status": "reset"}
