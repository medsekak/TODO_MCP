// Client HTTP minimal vers l'API REST du backend.
// Authentification par clé API (générée depuis la page Profile) : pas de login.
// Pour passer en distant plus tard : changer API_BASE_URL (rien d'autre à modifier).

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/api/v1";
const API_KEY = process.env.TODO_API_KEY;

async function request(method, path, body) {
  if (!API_KEY) {
    throw new Error(
      "TODO_API_KEY manquante : génère une clé dans la page Profile et expose-la au serveur MCP",
    );
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
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

export const listTodos = () => request("GET", "/tickets");
export const createTodo = (fields) => request("POST", "/tickets", fields);
export const updateTodo = (id, fields) => request("PATCH", `/tickets/${id}`, fields);
export const deleteTodo = (id) => request("DELETE", `/tickets/${id}`);