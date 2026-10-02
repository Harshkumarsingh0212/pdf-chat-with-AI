# PDF Chat AI

A web app that lets you upload multiple PDFs and ask questions about their content using an LLM (Google Gemini).

The backend is built with **FastAPI** and handles PDF processing — documents are chunked and stored in a **FAISS** vector store for fast retrieval. When a user asks a question, the most relevant document chunks along with the full chat history are sent to Gemini as context, and the model generates a grounded response.

## Features

- Upload and query multiple PDFs at once
- Context-aware follow-up questions (chat history is preserved and used)
- Retrieval-augmented generation (RAG) using FAISS for relevant document lookup
- Clear error messages for invalid files, empty PDFs, or asking before uploading
- Modern, responsive chat UI with drag-and-drop upload, dark mode, and markdown-formatted answers
- Per-visitor session isolation — multiple people can use the same deployment at once without seeing or overwriting each other's documents

## Tech Stack

- **Backend:** FastAPI, LangChain, FAISS, Google Generative AI (Gemini)
- **Frontend:** React + Vite + Tailwind CSS (`frontend/`, recommended)
- **Legacy frontend:** Create React App (`react/pdf-qa/`, kept for reference)
- **Language:** Python 3.10+, JavaScript

## Installation

### Prerequisites

- Python 3.10+
- Node.js & npm

### 1. Backend setup

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Add your Google Gemini API key — create `fastapi/.env` (copy `fastapi/.env.example`):

```
GOOGLE_API_KEY=your_api_key_here
```

Start the FastAPI server:

```bash
cd fastapi
uvicorn main:app --reload
```

The backend runs at `http://127.0.0.1:8000/`.

### 2. Frontend setup (recommended)

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173/` and talks to the backend at `http://localhost:8000` by default. To point it elsewhere, copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL`.

## API Endpoints

Every endpoint below requires an `X-Session-Id` header (any string matching `^[a-zA-Z0-9_-]{8,64}$`, e.g. a UUID). The frontend generates and persists one automatically per browser (`frontend/src/lib/session.js`) — this is what keeps concurrent visitors' uploads and chat sessions isolated from each other on the backend. Requests without a valid header get a `400`.

### `GET /status/`

Returns `{"ready": true|false}` indicating whether *this session* has an indexed document.

### `POST /uploadfile/`

Uploads one or more PDF files scoped to the caller's session. Each file is validated, chunked, and stored in that session's own vector store. Replaces any previously uploaded documents *for that session only*. Returns the list of uploaded filenames.

### `POST /question/`

Submits a user question along with the existing chat history, scoped to the caller's session. The question, relevant document chunks, and chat history are passed to the LLM. Returns the updated chat history (newest entry first) with the model's answer.

### `DELETE /reset/`

Clears the caller's uploaded files and vector store, starting a fresh session.

## Environment Variables

You'll need a Google Gemini API key to run this project. Create a `.env` file in the `fastapi` directory with:

```
GOOGLE_API_KEY=your_api_key_here
```

> **Tip:** avoid pinning the model to a `-latest` alias (e.g. `gemini-flash-latest`). Google can silently roll that alias onto a new preview model with a much smaller free-tier quota, which will break the app with `429 RESOURCE_EXHAUSTED` errors. `fastapi/chat.py` pins `CHAT_MODEL` to a specific version for this reason — if you change it, pick a concrete version name from `genai.list_models()`, not an alias.

## Deploying to Render

This repo includes a [`render.yaml`](./render.yaml) Blueprint that deploys both services:

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. In the [Render dashboard](https://dashboard.render.com/), click **New +** → **Blueprint**, and select this repo. Render will read `render.yaml` and create two services:
   - `pdf-chat-backend` — the FastAPI app (Python web service)
   - `pdf-chat-frontend` — the built Vite app (static site)
3. Render will prompt you for the env vars marked `sync: false`:
   - On **pdf-chat-backend**: set `GOOGLE_API_KEY` to your real Gemini API key.
   - On **pdf-chat-frontend**: set `VITE_API_URL` to the backend's live URL once it's deployed (e.g. `https://pdf-chat-backend.onrender.com`). Vite bakes this in at *build* time, so if you change it later you need to trigger a new frontend deploy.
4. Deploy. The backend usually finishes first — grab its URL from the Render dashboard, set it as `VITE_API_URL` on the frontend service, then deploy the frontend.

### Known limitations

- **Ephemeral storage.** Render's free/standard web services use an ephemeral filesystem. Uploaded PDFs and FAISS indexes live under `fastapi/uploads/<session-id>/` and `fastapi/faiss_index/<session-id>/`, which persist only while the instance stays running — **they're wiped on every redeploy or restart**, and won't be shared across multiple instances if you scale up. For a personal/demo deployment this is fine. For production use with persistent documents, either attach a [Render Disk](https://render.com/docs/disks) to the backend service, or swap FAISS for a hosted vector store.
- **No automatic session cleanup.** Each visitor's session directory sticks around on disk until the instance restarts — there's no TTL/eviction. Fine for light personal use; if this sees sustained public traffic, add a periodic cleanup job (e.g. delete session folders older than N hours) to keep disk usage bounded.
- **Shared API quota.** All sessions on a deployment share the same `GOOGLE_API_KEY` and therefore the same Gemini free-tier quota — session isolation separates *documents and chat history*, not API usage limits.

## License

This project is open source and available under the MIT License.
