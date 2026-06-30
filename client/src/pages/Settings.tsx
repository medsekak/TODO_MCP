import { Settings as SettingsIcon } from "lucide-react";
import ApiKeysPanel from "../components/ApiKeysPanel";

// Page Settings : regroupe les réglages du compte (clés API pour le serveur MCP).
export default function Settings() {
  return (
    <section className="relative flex flex-1 flex-col overflow-y-auto bg-slate-950 px-6 py-10">
      {/* Halos lumineux d'arrière-plan (cohérent avec le board / profil) */}
      <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl"></div>
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl"></div>

      <div className="relative mx-auto w-full max-w-2xl space-y-6">
        {/* Titre de la page */}
        <header className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
            <SettingsIcon size={22} />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-3xl font-extrabold text-transparent">
              Réglages
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Gère tes clés d'accès pour connecter le serveur MCP.
            </p>
          </div>
        </header>

        {/* Gestion des clés API (pour connecter le serveur MCP) */}
        <ApiKeysPanel />
      </div>
    </section>
  );
}