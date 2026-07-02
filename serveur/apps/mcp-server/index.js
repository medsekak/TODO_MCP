// Point d'entrée stdio (confort de dev local, mono-utilisateur).
// La clé vient de l'env ; en production, utiliser plutôt http.js (multi-clients).
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildServer } from "./build-server.js";

const server = buildServer(process.env.TODO_API_KEY);

const transport = new StdioServerTransport();
await server.connect(transport);

// IMPORTANT : sur un transport stdio, stdout est réservé au protocole.
// Tout log de debug doit passer par stderr.
console.error("todo-mcp : serveur démarré (stdio)");