# DocuBot

Upload your PDFs, get an AI chatbot that answers questions from them, and share it with a public link or API.

DocuBot is a RAG (Retrieval-Augmented Generation) app made of three services:

| Folder | What it is | Stack | Default port |
|---|---|---|---|
| `docubot-frontend` | Web app (landing, auth, dashboard, chatbot management, test chat) | React 19, Vite, Tailwind CSS, React Router | 5173 |
| `docubot-backend` | REST API (auth, chatbots, documents, chat) | Node.js, Express, MongoDB (Mongoose), JWT, Multer | 5000 |
| `docubot-rag-service` | RAG pipeline (PDF parsing, chunking, embeddings, retrieval, reranking, generation) | Python, FastAPI, ChromaDB, sentence-transformers | 8000 |

## How it works

```
Browser (React)  ──►  Node/Express API  ──►  FastAPI RAG service  ──►  LLM API
                          │                        │
                       MongoDB                  ChromaDB
                  (users, chatbots,          (document vectors)
                     documents)
```

1. A user signs up and logs in. The backend issues a JWT.
2. The user creates a chatbot and uploads a PDF.
3. The backend saves the file and forwards it to the RAG service, which parses, chunks and embeds it into ChromaDB. Processing happens inside the upload request, so the response already carries the final status (`ready` or `failed`).
4. When a question is asked, the RAG service retrieves and reranks relevant chunks, then calls the LLM to generate an answer.
5. A published chatbot can be used by anyone through the public chat endpoint, with no login required.

## Features

- Email/password authentication with JWT and protected routes
- Chatbot create, edit, delete, publish and unpublish
- PDF upload with status tracking (`processing`, `ready`, `failed`) and deletion
- Chat against your own documents (authenticated test chat and public chat)
- Chatbot customization (title, welcome message, primary color) with a live preview
- Hosted public chat page at `/widget/:chatbotId`, plus a copy-paste API snippet
- Responsive dashboard with loading, empty and error states

## Project structure

```
docubot/
├── docubot-frontend/       React + Vite app
│   └── src/
│       ├── components/     Navbar, shared UI (Toast, Modal, ConfirmDialog, states)
│       ├── context/        AuthContext
│       ├── layouts/        DashboardLayout
│       ├── pages/          Home, Pricing, Login, Signup, PublicChat, app/*
│       ├── routes/         ProtectedRoute
│       └── services/       API client + authApi, chatbotApi, documentApi, chatApi
├── docubot-backend/        Express API
│   └── src/
│       ├── controllers/    auth, chatbot, document, chat, publicChat
│       ├── middleware/     auth (JWT), upload (Multer), errorHandler
│       ├── models/         User, Chatbot, Document
│       ├── routes/
│       └── services/       ragService (calls the RAG service)
└── docubot-rag-service/    FastAPI RAG pipeline
    ├── main.py             /upload, /ask, /document, /documents
    ├── pipeline.py         ingest + ask
    ├── chunking.py, embedding.py, reranking.py, generation.py
    ├── vectore_store.py    ChromaDB access
    └── Dockerfile
```

## Environment variables

Each service has a `.env.example`. Copy it to `.env` and fill it in. Never commit real `.env` files.

**`docubot-backend/.env`**

| Variable | Description |
|---|---|
| `mongourl` | MongoDB connection string (e.g. a MongoDB Atlas URI) |
| `secret` | Secret used to sign JWTs |
| `RAG_URL` | Base URL of the RAG service, e.g. `http://127.0.0.1:8000` |
| `PORT` | Optional. Defaults to `5000` |

**`docubot-rag-service/.env`**

| Variable | Description |
|---|---|
| `LLM_API_KEY` | API key for the LLM provider |
| `LLM_URL` | OpenAI-compatible chat completions URL, e.g. `https://api.inceptionlabs.ai/v1/chat/completions` |
| `LLM_MODEL_NAME` | Model name, e.g. `mercury-2.5` |
| `LLM_REASONING_EFFORT` | Optional. Defaults to `low` |

**`docubot-frontend/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend, e.g. `http://localhost:5000` |

## Run locally

You need Node.js 18+, Python 3.10+, and a MongoDB database. Start the services in this order, each in its own terminal.

**1. RAG service**

```bash
cd docubot-rag-service
python3 -m venv venv && source venv/bin/activate
pip install torch --index-url https://download.pytorch.org/whl/cpu   # CPU-only build, much smaller
pip install -r requirements.txt
cp .env.example .env    # then fill in your LLM key
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**2. Backend**

```bash
cd docubot-backend
npm install
cp .env.example .env    # then fill in mongourl, secret, RAG_URL
npm start
```

**3. Frontend**

```bash
cd docubot-frontend
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:5000
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173), sign up, create a chatbot, upload a PDF and ask a question in the **Test Chat** tab.

## Deployment

The services deploy independently. Deploy in this order, because each one needs the URL of the previous one.

| Service | Suggested host | Settings |
|---|---|---|
| RAG service | Render (Docker) or any VPS | Root Directory `docubot-rag-service`. Set the `LLM_*` variables. |
| Backend | Render (Node) | Root Directory `docubot-backend`, build `npm install`, start `npm start`. Set `mongourl`, `secret`, `RAG_URL`. Allow the host's IPs in MongoDB Atlas Network Access. |
| Frontend | Vercel | Root Directory `docubot-frontend`. Set `VITE_API_URL` to the backend URL **before** building. |

Notes:

- The RAG service loads embedding and reranking models, so it needs more memory than Render's 512 MB free tier reliably provides. A VPS with 2 GB+ RAM is safer.
- Free tiers sleep when idle, so the first request after a pause can take 30 to 60 seconds.

## API overview

All `/api/chatbots` and `/api/documents` routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/user/signup` | No | Create account |
| POST | `/user/login` | No | Log in, returns a JWT |
| GET | `/user/me` | Yes | Current user |
| GET | `/api/chatbots` | Yes | List chatbots |
| POST | `/api/chatbots` | Yes | Create chatbot |
| GET | `/api/chatbots/:id` | Yes | Get one chatbot |
| PATCH | `/api/chatbots/update/:id` | Yes | Update chatbot (including `status`) |
| DELETE | `/api/chatbots/delete/:id` | Yes | Delete chatbot |
| GET | `/api/documents` | Yes | List documents |
| POST | `/api/documents` | Yes | Upload a PDF (`multipart/form-data`: `document`, `chatbotId`) |
| DELETE | `/api/documents/delete/:id` | Yes | Delete document |
| POST | `/api/chatbots/:id/chat` | Yes | Ask a question (owner) |
| POST | `/api/public/chatbots/:id/chat` | No | Ask a question (chatbot must be `active`) |

Public chat example:

```bash
curl -X POST https://YOUR_BACKEND/api/public/chatbots/CHATBOT_ID/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is your refund policy?"}'
```

## Current limitations

- Only PDF files are supported.
- Answers do not include source citations, because the RAG service returns only the answer text.
- Analytics and billing are not implemented in the backend. Those pages are placeholders.
- Settings is read-only. There is no endpoint yet to change name, email or password, or to delete an account.
- There is no drop-in `<script>` widget. Use the hosted `/widget/:chatbotId` page or call the public API directly.
- The hosted widget page uses generic branding, because there is no public endpoint to fetch a chatbot's name and colors.
