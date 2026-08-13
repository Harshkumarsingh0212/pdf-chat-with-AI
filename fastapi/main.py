from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from pydantic import BaseModel
from dotenv import load_dotenv
from chat import get_pdf_text, get_text_chunks, get_vector_store, handle_user_input

load_dotenv()

app = FastAPI()


class Chat(BaseModel):
    question: str
    answer: str


class Item(BaseModel):
    chat_history: list[Chat]
    question: str


UPLOAD_DIR = Path() / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

origins = ['*']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.post('/uploadfile/')
async def create_upload_file(file_uploads: list[UploadFile]):
    [f.unlink() for f in UPLOAD_DIR.glob("*") if f.is_file()]

    for file_upload in file_uploads:
        data = await file_upload.read()
        save_to = UPLOAD_DIR / file_upload.filename
        with open(save_to, 'wb') as f:
            f.write(data)

    raw_text = get_pdf_text(UPLOAD_DIR)
    text_chunks = get_text_chunks(raw_text)
    get_vector_store(text_chunks)

    return {"filenames": [f.filename for f in file_uploads]}


@app.post('/question/')
async def create_user_query(item: Item):
    question = item.question
    chat_history = item.chat_history

    answer = handle_user_input(question, chat_history)

    item.chat_history.insert(0, {'question': question, 'answer': answer})

    return {"chat_history": item.chat_history}
