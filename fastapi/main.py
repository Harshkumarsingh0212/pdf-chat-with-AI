from fastapi import FastAPI, HTTPException, Depends, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import pickle
from pydantic import BaseModel
import os
import glob
from chat import get_pdf_text, get_text_chunks, get_vector_store, get_conversation_chain_gemini, handle_user_input



app = FastAPI()

class Chat(BaseModel):
    question: str
    answer: str
    
class Item(BaseModel):
    chat_history: list[Chat]
    question: str


UPLOAD_DIR = Path() / 'uploads'


origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)


@app.post('/uploadfile/')
async def create_upload_file(file_uploads: list[UploadFile]):
    [f.unlink() for f in Path(UPLOAD_DIR).glob("*") if f.is_file()] 
    
    for file_upload in file_uploads:
        data = await file_upload.read()
        print("done")
        save_to = UPLOAD_DIR / file_upload.filename
        with open(save_to, 'wb') as f:
            f.write(data)
            
    raw_text = get_pdf_text(UPLOAD_DIR)
    # # print(raw_text)
    text_chunks = get_text_chunks(raw_text)
    # # print(text_chunks)
    get_vector_store(text_chunks)
            
            
    return {"filenames": [f.filename for f in file_uploads]}



@app.post('/question/')
async def create_user_query(item: Item):
    question = item.question
    chat_history = item.chat_history
    
    print(question)
    print(chat_history)
    
    answer = ''
    answer = handle_user_input(question, chat_history)
    
    item.chat_history.insert(0,{'question':question,'answer': answer})
    
    return {"chat_history": item.chat_history}