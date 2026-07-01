import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { listTodos, createTodo, updateTodo, deleteTodo } from "./api.js";

// Mêmes statuts que le backend (ticket.validator.js).
const STATUSES = ["todo", "in_progress", "done"];

// Formats de retour attendus par MCP.
const ok = (data) => ({
  content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
});
const fail = (err) => ({
  content: [{ type: "text", text: `Erreur : ${err.message}` }],
  isError: true,
});

// Fabrique un serveur MCP dont les outils utilisent `apiKey` (relayé au backend).
// Réutilisée par le transport HTTP (clé par requête) et le stdio local (clé d'env).
export function buildServer(apiKey) {
  const server = new McpServer({ name: "todo-mcp", version: "1.0.0" });

  server.registerTool(
    "list_todos",
    {
      title: "Lister les tâches",
      description:
        "Liste les tâches (todos) de l'utilisateur. Filtre optionnel par statut.",
      inputSchema: {
        status: z
          .enum(STATUSES)
          .optional()
          .describe("Filtrer par statut : todo, in_progress ou done"),
      },
    },
    async ({ status }) => {
      try {
        let todos = await listTodos(apiKey);
        if (status) todos = todos.filter((t) => t.status === status);
        return ok(todos);
      } catch (err) {
        return fail(err);
      }
    },
  );

  server.registerTool(
    "create_todo",
    {
      title: "Créer une tâche",
      description: "Crée une nouvelle tâche (todo).",
      inputSchema: {
        title: z.string().describe("Titre de la tâche"),
        description: z.string().optional().describe("Description (optionnelle)"),
        status: z.enum(STATUSES).optional().describe("Statut initial (défaut : todo)"),
      },
    },
    async ({ title, description, status }) => {
      try {
        const body = { title };
        if (description !== undefined) body.description = description;
        if (status !== undefined) body.status = status;
        return ok(await createTodo(body, apiKey));
      } catch (err) {
        return fail(err);
      }
    },
  );

  server.registerTool(
    "update_todo",
    {
      title: "Mettre à jour une tâche",
      description:
        "Modifie une tâche existante (titre, description et/ou statut) via son id.",
      inputSchema: {
        id: z.string().describe("id de la tâche à modifier"),
        title: z.string().optional().describe("Nouveau titre"),
        description: z.string().optional().describe("Nouvelle description"),
        status: z.enum(STATUSES).optional().describe("Nouveau statut"),
      },
    },
    async ({ id, ...fields }) => {
      try {
        return ok(await updateTodo(id, fields, apiKey));
      } catch (err) {
        return fail(err);
      }
    },
  );

  server.registerTool(
    "delete_todo",
    {
      title: "Supprimer une tâche",
      description: "Supprime une tâche via son id.",
      inputSchema: {
        id: z.string().describe("id de la tâche à supprimer"),
      },
    },
    async ({ id }) => {
      try {
        await deleteTodo(id, apiKey);
        return ok({ deleted: id });
      } catch (err) {
        return fail(err);
      }
    },
  );

  return server;
}
