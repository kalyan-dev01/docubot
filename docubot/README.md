# DocuBot

Monorepo with three services:

| Folder | What | Suggested host | Render "Root Directory" |
|---|---|---|---|
| `docubot-frontend` | React + Vite app | Vercel | `docubot-frontend` |
| `docubot-backend` | Node/Express + MongoDB API | Render | `docubot-backend` |
| `docubot-rag-service` | FastAPI RAG pipeline (Docker) | Render / VPS | `docubot-rag-service` |

Each folder has a `.env.example` listing the environment variables it needs.
Never commit real `.env` files.
