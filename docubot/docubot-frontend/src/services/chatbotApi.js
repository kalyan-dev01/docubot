import { api } from "./api";

// Maps 1:1 to docubot-backend/src/routes/chatbotRoutes.js
export const chatbotApi = {
  list: () => api.get("/api/chatbots"), // GET /api/chatbots -> { success, data: [...] }
  get: (id) => api.get(`/api/chatbots/${id}`), // GET /api/chatbots/:id -> { success, data }
  create: (payload) => api.post("/api/chatbots", payload), // POST /api/chatbots -> { success, message, data }
  update: (id, payload) => api.patch(`/api/chatbots/update/${id}`, payload), // PATCH /api/chatbots/update/:id
  remove: (id) => api.delete(`/api/chatbots/delete/${id}`), // DELETE /api/chatbots/delete/:id
};
