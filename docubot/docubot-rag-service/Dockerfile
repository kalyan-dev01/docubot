FROM python:3.11-slim

WORKDIR /app

# System deps some of these libraries need to build/run (pymupdf, torch, chromadb)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install CPU-only torch first so pip doesn't pull the much larger CUDA build
# when resolving sentence-transformers' dependency on torch.
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Hugging Face Spaces requires a non-root user and expects the app on port 7860.
RUN useradd -m appuser && mkdir -p /app/uploads /app/chroma_db && chown -R appuser /app
USER appuser

EXPOSE 7860

# Most PaaS hosts (Render, Railway, etc.) inject a $PORT env var at runtime
# and route traffic to whatever port the app actually binds to. Hugging Face
# Spaces doesn't set $PORT, so the fallback matches its app_port (7860).
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-7860}"]
