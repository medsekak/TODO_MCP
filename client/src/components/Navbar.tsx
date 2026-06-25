import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  ListTodo,
  Calendar,
  PieChart,
  Settings,
  LogOut,
  User,
  Loader2
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { logoutUser } from '../lib/api';

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Ferme le menu lors d'un clic en dehors du conteneur (avatar + popover)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutUser();      // efface le cookie serveur + reset du store
    navigate('/signin');     // cohérent avec la redirection de api.ts
  };

  return (
    <aside className="w-20 h-screen bg-slate-900 flex flex-col justify-between items-center py-6 text-slate-400 border-r border-slate-800">

      {/* 1. HAUT : Le Logo */}
      <div className="flex items-center justify-center text-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer">
        <CheckSquare size={32} strokeWidth={2.5} />
      </div>

      {/* 2. MILIEU : Les Icônes Nécessaires (Navigation) */}
      <nav className="flex flex-col gap-6 flex-1 justify-center w-full px-2">
        <button className="flex flex-col items-center justify-center py-3 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-all group relative">
          <ListTodo size={24} />
          <span className="text-[10px] mt-1 font-medium">Tâches</span>
        </button>

        <button className="flex flex-col items-center justify-center py-3 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-all group">
          <Calendar size={24} />
          <span className="text-[10px] mt-1 font-medium">Agenda</span>
        </button>

        <button className="flex flex-col items-center justify-center py-3 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-all group">
          <PieChart size={24} />
          <span className="text-[10px] mt-1 font-medium">Stats</span>
        </button>

        <button className="flex flex-col items-center justify-center py-3 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-all group">
          <Settings size={24} />
          <span className="text-[10px] mt-1 font-medium">Settings</span>
        </button>
      </nav>

      {/* 3. BAS : Profil Utilisateur & Logout */}
      <div ref={menuRef} className="relative flex flex-col items-center gap-4 w-full px-2 border-t border-slate-800 pt-4">
        {/* Icône User / Profil */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:ring-2 hover:ring-indigo-500 transition-all"
        >
          <User size={20} />
        </button>

        {/* Popover Profil */}
        {open && (
          <div className="absolute left-full bottom-0 ml-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-indigo-500/20 overflow-hidden z-50">
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-slate-100 truncate">
                {user?.username ?? 'Utilisateur'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email ?? ''}
              </p>
            </div>

            <div className="border-t border-slate-800">
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loggingOut ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <LogOut size={18} />
                )}
                <span className="font-medium">
                  {loggingOut ? 'Déconnexion…' : 'Déconnexion'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

    </aside>
  );
}
