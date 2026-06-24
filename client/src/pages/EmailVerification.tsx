import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import useVerifyEmail from '../hooks/useVerifyEmail';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { loading, error, success } = useVerifyEmail();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      {/* Effets lumineux */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl text-center">

        {/* ÉTAT 1 : Chargement */}
        {loading && (
          <div className="py-6 space-y-4">
            <Loader2 size={40} className="animate-spin text-indigo-400 mx-auto" />
            <h1 className="text-xl font-bold text-white">Vérification en cours...</h1>
            <p className="text-sm text-slate-400">Nous validons votre adresse email auprès de nos serveurs.</p>
          </div>
        )}

        {/* ÉTAT 2 : Succès */}
        {success && (
          <div className="py-6 space-y-5">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white mb-2">Email vérifié !</h1>
              <p className="text-sm text-slate-400">Votre compte est maintenant entièrement activé.</p>
            </div>
            <button
              onClick={() => navigate('/signin')}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              Accéder à mes tâches
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* ÉTAT 3 : Erreur */}
        {!loading && error && (
          <div className="py-6 space-y-5">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
              <XCircle size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white mb-2">Échec de la vérification</h1>
              <p className="text-sm text-rose-400/80">{error}</p>
            </div>
            <button
              onClick={() => navigate('/signin')}
              className="w-full py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-2xl transition-colors"
            >
              Retour à la page de connexion
            </button>
          </div>
        )}

      </div>
    </div>
  );
}