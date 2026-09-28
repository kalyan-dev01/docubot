import { api } from "./api";

// Maps 1:1 to docubot-backend/src/routes/documentRoutes.js
// NOTE: the backend processes the document (Node -> Python RAG service) synchronously
// inside the upload request, so there is no separate "status" polling endpoint -
// the response you get back from upload() already carries the final status
// ("ready" or "failed").
export const documentApi = {
  // GET /api/documents -> { success, count, data: [...] } (all of the current user's documents,
  // each populated with { chatbot: { _id, name } })
  list: () => api.get("/api/documents"),

  // POST /api/documents (multipart/form-data: "document" file + "chatbotId")
  upload: (chatbotId, file) => {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("chatbotId", chatbotId);
    return api.upload("/api/documents", formData);
  },

  // DELETE /api/documents/delete/:id
  remove: (id) => api.delete(`/api/documents/delete/${id}`),
};
