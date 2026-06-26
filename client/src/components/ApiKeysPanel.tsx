import React, { useState } from "react";
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Trash2,
  Loader2,
  TriangleAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import useApiKeys from "../hooks/useApiKeys";

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

export default function ApiKeysPanel() {
  const { keys, loading, generating, generateKey, revokeKey } = useApiKeys();

  const [name, setName] = useState("");
  // Clé fraîchement générée, affichée une seule fois (jamais re-récupérable).
  const [freshKey, setFreshKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    const key = await generateKey(name.trim());
    if (key) {
      setFreshKey(key);
      setCopied(false);
      setName("");
    }
  };

  const handleCopy = async () => {
    if (!freshKey) return;
    await navigator.clipboard.writeText(freshKey);
    setCopied(true);
    toast.success("Clé copiée");
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="mb-5 flex items-center gap-2">
        <KeyRound className="text-indigo-400" size={18} />
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Clés API
        </h2>
      </div>

      <p className="mb-5 text-sm text-slate-400">
        Génère une clé pour connecter un client externe (ex : le serveur MCP de
        Claude Code) à ton compte. Une clé donne accès à tes tickets sans ton
        mot de passe et reste révocable à tout moment.
      </p>

      {/* Formulaire de génération */}
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleGenerate}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la clé (ex : Claude Code)"
          maxLength={50}
          className="w-full rounded-2xl border border-slate-700/60 bg-slate-800/40 px-4 py-3.5 text-sm text-slate-200 placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <button
          type="submit"
          disabled={generating || !name.trim()}
          className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {generating ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Plus size={18} />
          )}
          Générer
        </button>
      </form>

      {/* Clé fraîchement générée — affichée une seule fois */}
      {freshKey && (
        <div className="mt-5 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-amber-400">
            <TriangleAlert size={16} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Copie-la maintenant — tu ne pourras plus la revoir
            </span>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto whitespace-nowrap rounded-xl bg-slate-950/60 px-3 py-2.5 font-mono text-xs text-slate-200">
              {freshKey}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2.5 text-xs font-medium text-slate-200 transition-colors hover:border-indigo-500 hover:text-indigo-400"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copiée" : "Copier"}
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Colle-la dans{" "}
            <code className="rounded bg-slate-800 px-1 py-0.5 font-mono text-slate-300">
              serveur/.env
            </code>{" "}
            →{" "}
            <code className="rounded bg-slate-800 px-1 py-0.5 font-mono text-slate-300">
              TODO_API_KEY=…
            </code>
          </p>
        </div>
      )}

      {/* Liste des clés existantes */}
      <div className="mt-6 space-y-2">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-indigo-500" size={22} />
          </div>
        ) : keys.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500">
            Aucune clé pour l'instant.
          </p>
        ) : (
          keys.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-200">
                  {key.name}
                </p>
                <p className="mt-0.5 font-mono text-xs text-slate-500">
                  {key.key_prefix}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Créée le {formatDate(key.created_at)} · Dernière utilisation :{" "}
                  {formatDate(key.last_used_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => revokeKey(key.id)}
                title="Révoquer la clé"
                className="flex shrink-0 items-center justify-center rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}