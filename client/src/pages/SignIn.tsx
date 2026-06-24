import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import useSignIn from '../hooks/useSignIn';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useSignIn();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await login(email, password);
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      {/* Effets de lumière en arrière-plan */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Carte du Formulaire */}
      <div className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
    
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Bon retour !
          </h1>
          <p className="text-sm text-slate-400">
            Connecte-toi pour gérer tes tâches quotidiennes.
          </p>
        </div>

        {/* Formulaire */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Adresse Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                placeholder="nom@exemple.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-800/40 border border-slate-700/60 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Mot de passe
              </label>
              <a href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                Oublié ?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <Lock size={18} />
              </span>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3.5 bg-slate-800/40 border border-slate-700/60 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Bouton Submit */}
          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r align-middle from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group"
          >
            Se connecter
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer de la carte */}
        <p className="text-center text-sm text-slate-400 mt-8">
          Pas encore de compte ?{' '}
          <Link to="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors underline decoration-indigo-500/40 underline-offset-4">
            Créer un compte
          </Link>
        </p>

      </div>
    </div>
  );
}