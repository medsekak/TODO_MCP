import { Search, X } from "lucide-react";
import useBoardStore, { StatusFilter } from "../store/boardStore";

const FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "todo", label: "À faire" },
  { id: "in_progress", label: "En cours" },
  { id: "done", label: "Terminé" },
];

const TopBar = () => {
  const search = useBoardStore((s) => s.search);
  const setSearch = useBoardStore((s) => s.setSearch);
  const statusFilter = useBoardStore((s) => s.statusFilter);
  const setStatusFilter = useBoardStore((s) => s.setStatusFilter);

  return (
    <header className="flex flex-col gap-4 bg-slate-950 border-b border-slate-800 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-lg font-bold text-white">Mes tickets</h1>
        <p className="text-xs text-slate-500">
          Organise tes tâches en glissant les tickets entre les colonnes.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Barre de recherche */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un ticket…"
            className="w-full sm:w-64 pl-9 pr-9 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="Effacer la recherche"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filtres par statut */}
        <div className="flex items-center gap-1 rounded-2xl bg-slate-900 border border-slate-800 p-1">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setStatusFilter(filter.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === filter.id
                  ? "bg-indigo-500 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
