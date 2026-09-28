const fs = require("fs");
const path = require("path");

const RAG_URL = process.env.RAG_URL;

const uploadToRAG = async (filePath, documentId) => {
    const formData = new FormData();

    const fileBuffer = await fs.promises.readFile(filePath);
    const blob = new Blob([fileBuffer]);

    formData.append(
        "file",
        blob,
        path.basename(filePath)
    );

    formData.append(
        "document_id",
        documentId
    );

    const response = await fetch(`${RAG_URL}/upload`, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `RAG upload failed: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};


const askRAG = async (question, documentId) => {
    const response = await fetch(`${RAG_URL}/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            question,
            document_id: documentId
        })
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `RAG question failed: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};


const deleteFromRAG = async (documentId) => {
    const response = await fetch(
        `${RAG_URL}/document?document_id=${encodeURIComponent(documentId)}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `RAG deletion failed: ${response.status} ${errorText}`
        );
    }

    return await response.json();
};

module.exports = {
    uploadToRAG,askRAG,deleteFromRAG
};