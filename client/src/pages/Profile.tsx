import React, { useEffect, useState } from "react";
import { User, Mail, Loader2, BadgeCheck, AlertCircle, CalendarDays } from "lucide-react";
import useProfile from "../hooks/useProfile";
import ApiKeysPanel from "../components/ApiKeysPanel";

// Initiales pour l'avatar (max 2 lettres), même logique que la Navbar.
const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function Profile() {
  const { profile, loading, saving, updateProfile } = useProfile();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Pré-remplit le formulaire dès que le profil est chargé.
  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setEmail(profile.email);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateProfile(username, email);
  };

  if (loading) {
    return (
      <section className="flex flex-1 items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="flex flex-1 items-center justify-center bg-slate-950 text-slate-400">
        Impossible de charger le profil.
      </section>
    );
  }

  const memberSince = new Date(profile.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isDirty = username !== profile.username || email !== profile.email;

  return (
    <section className="relative flex flex-1 flex-col overflow-y-auto bg-slate-950 px-6 py-10">
      {/* Halos lumineux d'arrière-plan */}
      <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl"></div>
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl"></div>

      <div className="relative mx-auto w-full max-w-2xl space-y-6">
        {/* Titre de la page */}
        <header>
          <h1 className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-3xl font-extrabold text-transparent">
            Mon profil
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Gère tes informations personnelles et tes clés d'accès.
          </p>
        </header>

        {/* Carte identité (bannière + avatar) */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40">
          <div className="h-24 bg-gradient-to-r from-indigo-600/40 via-purple-600/30 to-fuchsia-600/20"></div>
          <div className="-mt-12 flex flex-col items-start gap-4 px-6 pb-6 sm:flex-row sm:items-end">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-bold text-white shadow-lg shadow-indigo-500/30 ring-4 ring-slate-900">
              {getInitials(profile.username)}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-100">
                  {profile.username}
                </h2>
                {profile.is_verified && (
                  <BadgeCheck className="text-emerald-400" size={18} />
                )}
              </div>
              <p className="text-sm text-slate-400">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Carte infos */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            {profile.is_verified ? (
              <BadgeCheck className="shrink-0 text-emerald-400" size={22} />
            ) : (
              <AlertCircle className="shrink-0 text-amber-400" size={22} />
            )}
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Email
              </p>
              <p className="text-sm font-medium text-slate-200">
                {profile.is_verified ? "Vérifié" : "Non vérifié"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <CalendarDays className="shrink-0 text-indigo-400" size={22} />
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Membre depuis
              </p>
              <p className="text-sm font-medium text-slate-200">{memberSince}</p>
            </div>
          </div>
        </div>

        {/* Formulaire d'édition */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-300">
            Modifier mes informations
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Nom d'utilisateur */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-2xl border border-slate-700/60 bg-slate-800/40 py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Adresse Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full rounded-2xl border border-slate-700/60 bg-slate-800/40 py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || !isDirty}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </button>
          </form>
        </div>

        {/* Gestion des clés API (pour connecter le serveur MCP) */}
        <ApiKeysPanel />
      </div>
    </section>
  );
}
