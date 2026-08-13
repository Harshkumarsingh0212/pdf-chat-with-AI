# PDF Chat AI

A web app that lets you upload multiple PDFs and ask questions about their content using an LLM (Google Gemini).

The backend is built with **FastAPI** and handles PDF processing — documents are chunked and stored in a **FAISS** vector store for fast retrieval. When a user asks a question, the most relevant document chunks along with the full chat history are sent to Gemini as context, and the model generates a grounded response.

## Features

- Upload and query multiple PDFs at once
- Context-aware follow-up questions (chat history is preserved and used)
- Retrieval-augmented generation (RAG) using FAISS for relevant document lookup

## Tech Stack

- **Backend:** FastAPI, LangChain, FAISS, Google Generative AI (Gemini)
- **Frontend:** React
- **Language:** Python 3.6+, JavaScript

## Installation

### Prerequisites

- Python 3.6+
- Node.js & npm

### 1. Clone the repository

```bash
git clone https://github.com/Harshkumarsingh0212/pdf-chat-ai.git
cd pdf-chat-ai
```

### 2. Backend setup

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
cd fastapi
uvicorn main:app --reload
```

The backend will be available at `http://127.0.0.1:8000/`.

### 3. Frontend setup

```bash
cd react/pdf-qa
npm install
npm run build
```

The frontend will be available at `http://127.0.0.1:3000/`.

## API Endpoints

### `POST /uploadfile/`

Uploads one or more PDF files. Each file is preprocessed and stored in the vector store for retrieval. Returns a JSON response with the list of uploaded filenames.

### `POST /question/`

Submits a user question. The question, along with relevant document chunks and chat history, is passed to the LLM. Returns a JSON response with the updated chat history, including the model's answer.

## Environment Variables

You'll need a Google Gemini API key to run this project. Create a `.env` file in the `fastapi` directory with:

```
GOOGLE_API_KEY=your_api_key_here
```

## License

This project is open source and available under the MIT License.
