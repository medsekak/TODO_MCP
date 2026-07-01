// Service MCP autonome exposé en HTTP (Streamable HTTP, stateless).
// Passerelle de protocole SANS secret : lit le bearer todo_sk_… de chaque
// requête et le relaie au backend via api.js. Déployable séparément.

import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { buildServer } from "./build-server.js";

const PORT = process.env.PORT || process.env.MCP_PORT || 4000;

// Protection DNS-rebinding : activée seulement si ALLOWED_HOSTS est fourni
// (liste séparée par des virgules, ex : "todo-mcp.onrender.com").
const allowedHosts = process.env.ALLOWED_HOSTS
  ? process.env.ALLOWED_HOSTS.split(",").map((h) => h.trim())
  : undefined;

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.post("/mcp", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Clé API manquante (Authorization: Bearer todo_sk_…)" });
  }
  const apiKey = auth.slice(7);

  // Stateless : un serveur + un transport par requête.
  const server = buildServer(apiKey);
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    ...(allowedHosts ? { enableDnsRebindingProtection: true, allowedHosts } : {}),
  });

  res.on("close", () => {
    transport.close();
    server.close();
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("Erreur MCP :", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Erreur interne du service MCP" });
    }
  }
});

// Mode stateless : pas de session serveur → pas de flux GET/DELETE.
const methodNotAllowed = (_req, res) =>
  res.status(405).json({ error: "Méthode non supportée (service MCP stateless)" });
app.get("/mcp", methodNotAllowed);
app.delete("/mcp", methodNotAllowed);

app.listen(PORT, () => {
  console.log(`todo-mcp : service HTTP démarré sur le port ${PORT}`);
});