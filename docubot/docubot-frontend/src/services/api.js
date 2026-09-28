// Centralized API client for the DocuBot backend (docubot-backend).
// Every request automatically attaches the JWT (if present) and every
// response is normalized so callers get a consistent { data } / thrown Error shape.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TOKEN_KEY = "docubot_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Fired whenever a request comes back 401 so AuthContext can log the user out.
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

async function request(path, { method = "GET", body, isFormData = false, auth = true } = {}) {
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch (err) {
    throw new Error(
      "Could not reach the DocuBot server. Check that the backend is running and VITE_API_URL is correct.",
      { cause: err }
    );
  }

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Non-JSON response body (e.g. an HTML error page) - treat as empty.
  }

  if (res.status === 401) {
    onUnauthorized();
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.detail)) ||
      `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
  upload: (path, formData, opts) =>
    request(path, { ...opts, method: "POST", body: formData, isFormData: true }),
};

export { API_URL };
