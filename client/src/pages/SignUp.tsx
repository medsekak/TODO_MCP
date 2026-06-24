import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import useSignUp from '../hooks/useSignUp';




export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const { register, loading, error } = useSignUp();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('Nom complet:', username);
    console.log('Email:', email);
    console.log('Mot de passe:', password);

    await register(username, email, password);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 selection:bg-purple-500 selection:text-white">
      {/* Effets de lumière en arrière-plan */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Carte du Formulaire */}
      <div className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
        
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            Rejoins-nous
          </h1>
          <p className="text-sm text-slate-400">
            Crée ton compte et commence à t'organiser dès aujourd'hui.
          </p>
        </div>

        {/* Formulaire */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Nom complet */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Nom complet
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <User size={18} />
              </span>
              <input
                name="username"
                type="text"
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-800/40 border border-slate-700/60 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
              />
            </div>
          </div>

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
                name="email"
                type="email"
                placeholder="nom@exemple.com"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-800/40 border border-slate-700/60 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                <Lock size={18} />
              </span>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Au moins 8 caractères"
                className="w-full pl-11 pr-12 py-3.5 bg-slate-800/40 border border-slate-700/60 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm"
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
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group pt-4"
          >
            Créer mon compte
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer de la carte */}
        <p className="text-center text-sm text-slate-400 mt-8">
          Déjà un compte ?{' '}
          <a href="#" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors underline decoration-purple-500/40 underline-offset-4">
            Se connecter
          </a>
        </p>

      </div>
    </div>
  );
}