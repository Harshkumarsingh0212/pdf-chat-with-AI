import os
import shutil
from pathlib import Path

from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_classic.chains.question_answering import load_qa_chain

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
FAISS_INDEX_DIR = BASE_DIR / "faiss_index"

EMBEDDING_MODEL = "models/gemini-embedding-001"
# Pinned to a specific version rather than an auto-rolling "-latest" alias.
# "gemini-flash-latest" silently started pointing at the preview model
# "gemini-3.8-flash", which only has a 20-requests/day free quota and broke
# the app. "-lite" models get a much larger free-tier quota.
CHAT_MODEL = "gemini-3.1-flash-lite"
NO_ANSWER_MESSAGE = "answer is not available in the context"


class VectorStoreNotFoundError(RuntimeError):
    """Raised when a question is asked before any PDF has been indexed."""


class NoExtractableTextError(RuntimeError):
    """Raised when the uploaded PDF(s) contain no extractable text."""


def _require_api_key():
    if not os.environ.get("GOOGLE_API_KEY"):
        raise RuntimeError(
            "GOOGLE_API_KEY is not set. Add it to fastapi/.env before using the app."
        )


def get_pdf_text(path):
    text = ""
    for pdf in sorted(Path(path).glob("*.pdf")):
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    return text


def get_text_chunks(raw_text):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )
    return text_splitter.split_text(raw_text)


def get_vector_store(text_chunks):
    if not text_chunks:
        raise NoExtractableTextError(
            "No readable text was found in the uploaded PDF(s). They may be "
            "scanned images without OCR text."
        )
    _require_api_key()
    embeddings = GoogleGenerativeAIEmbeddings(model=EMBEDDING_MODEL)
    vector_store = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    vector_store.save_local(str(FAISS_INDEX_DIR))


def vector_store_exists():
    return (FAISS_INDEX_DIR / "index.faiss").exists()


def reset_vector_store():
    if FAISS_INDEX_DIR.exists():
        shutil.rmtree(FAISS_INDEX_DIR)


def _format_chat_history(chat_history):
    if not chat_history:
        return "No previous conversation."
    lines = []
    for turn in reversed(chat_history):
        question = turn.question if hasattr(turn, "question") else turn.get("question")
        answer = turn.answer if hasattr(turn, "answer") else turn.get("answer")
        lines.append(f"User: {question}\nAssistant: {answer}")
    return "\n".join(lines)


def get_conversation_chain_gemini():
    prompt_template = """
    The following question can be a standalone question or a follow up question based on the chat history.
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Chat History:\n{chat_history}\n
    Question: \n{question}\n

    Answer:
    """

    model = ChatGoogleGenerativeAI(model=CHAT_MODEL, temperature=0.3)

    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "chat_history", "question"])
    return load_qa_chain(model, chain_type="stuff", prompt=prompt)


def handle_user_input(user_input, chat_history):
    if not vector_store_exists():
        raise VectorStoreNotFoundError(
            "No PDF has been uploaded yet. Please upload a PDF before asking questions."
        )
    _require_api_key()

    embeddings = GoogleGenerativeAIEmbeddings(model=EMBEDDING_MODEL)
    vector_store = FAISS.load_local(
        str(FAISS_INDEX_DIR), embeddings, allow_dangerous_deserialization=True
    )
    docs = vector_store.similarity_search(user_input)

    chain = get_conversation_chain_gemini()
    response = chain.invoke(
        {
            "input_documents": docs,
            "chat_history": _format_chat_history(chat_history),
            "question": user_input,
        }
    )

    return response["output_text"]
