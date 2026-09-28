import { api } from "./api";

// Maps 1:1 to docubot-backend/src/routes/userRoutes.js
export const authApi = {
  // POST /user/signup -> { user: { id, name, email, token } }
  signup: (payload) => api.post("/user/signup", payload, { auth: false }),

  // POST /user/login -> { success, token }
  login: (payload) => api.post("/user/login", payload, { auth: false }),

  // GET /user/me -> { success, data: { id, name, email } }
  me: () => api.get("/user/me"),
};
