import { api } from "./api";

// Maps to docubot-backend/src/routes/chatRoutes.js and publicChatRoutes.js
export const chatApi = {
  // POST /api/chatbots/:chatbotId/chat (authenticated - requires a "ready" document)
  // -> { success, question, response }
  ask: (chatbotId, question) =>
    api.post(`/api/chatbots/${chatbotId}/chat`, { question }),

  // POST /api/public/chatbots/:chatbotId/chat (no auth - requires chatbot.status === "active")
  // -> { success, question, response }
  askPublic: (chatbotId, question) =>
    api.post(`/api/public/chatbots/${chatbotId}/chat`, { question }, { auth: false }),
};
