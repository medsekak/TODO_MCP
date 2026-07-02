// Client HTTP minimal vers l'API REST du backend.
// Auth par clé API (todo_sk_…) fournie PAR REQUÊTE : le service MCP ne détient
// aucun secret, il relaie la clé de l'appelant. API_BASE_URL pointe vers le backend.

const API_BASE_URL = process.env.API_BASE_URL

async function request(method, path, body, apiKey) {
  if (!apiKey) {
    throw new Error("Clé API manquante : fournis un header Authorization: Bearer todo_sk_…");
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null; // No Content (ex : DELETE)

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      data?.message || data?.errors?.[0]?.message || `Erreur HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const listTodos = (apiKey) => request("GET", "/api/v1/tickets", undefined, apiKey);
export const createTodo = (fields, apiKey) => request("POST", "/api/v1/tickets", fields, apiKey);
export const updateTodo = (id, fields, apiKey) =>
  request("PATCH", `/api/v1/tickets/${id}`, fields, apiKey);
export const deleteTodo = (id, apiKey) =>
  request("DELETE", `/api/v1/tickets/${id}`, undefined, apiKey);
