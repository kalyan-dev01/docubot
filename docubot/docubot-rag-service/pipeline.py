import logging
import os


# ==========================================================
# Logging Configuration
# ==========================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("huggingface_hub").setLevel(logging.WARNING)
logging.getLogger("transformers").setLevel(logging.WARNING)
logging.getLogger("sentence_transformers").setLevel(logging.WARNING)


# ==========================================================
# Project Imports
# ==========================================================

from pdf_processing import (
    detect_pdf_type,
    extract_pdf_pages,
    clean_page_text
)

from chunking import chunk_text

from embedding import embed_chunks

from vectore_store import (
    store_chunks,
    retrieve_chunks
)

from reranking import rerank_chunks

from generation import (
    build_prompt,
    build_context,
    call_llm
)

from config import RAGConfig


# ==========================================================
# Configuration
# ==========================================================

config = RAGConfig()


# ==========================================================
# INGESTION PIPELINE
# ==========================================================

def ingest(
    filepath: str,
    document_id: str
):

    logger.info(
        f"Starting ingestion: {filepath}"
    )

    logger.info(
        f"Ingestion document_id: {document_id}"
    )

    # ------------------------------------------------------
    # 1. Detect PDF type
    # ------------------------------------------------------

    pdf_type = detect_pdf_type(
        filepath
    )

    logger.info(
        f"Detected {filepath}:{pdf_type}"
    )

    if pdf_type == "Scanned":

        logger.warning(
            "Scanned PDF detected"
        )

    # ------------------------------------------------------
    # 2. Extract pages
    # ------------------------------------------------------

    pages = extract_pdf_pages(
        filepath
    )

    logger.info(
        f"Extracted {len(pages)} pages"
    )

    all_chunks = []

    # ------------------------------------------------------
    # 3. Process each page
    # ------------------------------------------------------

    for page in pages:

        cleaned_text = clean_page_text(
            page["text"]
        )

        # --------------------------------------------------
        # 4. Create chunks
        # --------------------------------------------------

        page_chunks = chunk_text(
            cleaned_text,
            config.chunk_size_tokens,
            config.chunk_overlap_tokens,
            page["page_number"]
        )

        logger.info(
            f"Created {len(page_chunks)} chunks "
            f"for page {page['page_number']}"
        )

        # --------------------------------------------------
        # 5. Add document metadata
        # --------------------------------------------------

        for chunk in page_chunks:

            chunk["document_id"] = document_id

            chunk["filepath"] = filepath

            chunk["filename"] = os.path.basename(
                filepath
            )

        all_chunks.extend(
            page_chunks
        )

    logger.info(
        f"Created {len(all_chunks)} total chunks"
    )

    # ------------------------------------------------------
    # 6. Generate embeddings
    # ------------------------------------------------------

    all_chunks = embed_chunks(
        all_chunks
    )

    logger.info(
        "Embeddings generated successfully"
    )

    # ------------------------------------------------------
    # 7. Store in vector database
    # ------------------------------------------------------

    store_chunks(
        all_chunks
    )

    logger.info(
        "PDF ingestion completed"
    )


# ==========================================================
# QUESTION / RAG PIPELINE
# ==========================================================

def ask(
    query: str,
    document_id: str
) -> str:

    logger.info(
        f"Processing query: {query}"
    )

    logger.info(
        f"Query document_id: {document_id}"
    )

    # ------------------------------------------------------
    # 1. Retrieve relevant chunks
    # ------------------------------------------------------

    retrieved_chunks = retrieve_chunks(
        query,
        document_id,
        config.top_k_retrieve
    )

    logger.info(
        f"Retrieved {len(retrieved_chunks)} chunks"
    )

    # ------------------------------------------------------
    # IMPORTANT:
    # Do not call the LLM when nothing was retrieved.
    # ------------------------------------------------------

    if not retrieved_chunks:

        logger.warning(
            f"No chunks found for document_id: "
            f"{document_id}"
        )

        return (
            "I couldn't find relevant information "
            "in the uploaded document."
        )

    # ------------------------------------------------------
    # 2. Rerank chunks
    # ------------------------------------------------------

    final_chunks = rerank_chunks(
        query,
        retrieved_chunks,
        config.top_k_final
    )

    logger.info(
        f"Selected {len(final_chunks)} final chunks"
    )

    # ------------------------------------------------------
    # Additional safety check
    # ------------------------------------------------------

    if not final_chunks:

        logger.warning(
            f"Reranker returned no chunks for "
            f"document_id: {document_id}"
        )

        return (
            "I couldn't find relevant information "
            "in the uploaded document."
        )

    # ------------------------------------------------------
    # 3. Build context
    # ------------------------------------------------------

    context = build_context(
        final_chunks
    )

    # ------------------------------------------------------
    # 4. Build LLM prompt
    # ------------------------------------------------------

    system_prompt, user_prompt = build_prompt(
        query,
        context
    )

    # ------------------------------------------------------
    # 5. Call LLM
    # ------------------------------------------------------

    answer = call_llm(
        system_prompt,
        user_prompt
    )

    logger.info(
        "Answer generated"
    )

    return answer