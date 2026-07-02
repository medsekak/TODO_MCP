import { create } from "zustand";
import { TicketStatus } from "../types";

// "all" = aucune colonne masquée. Sinon on n'affiche que la colonne choisie.
export type StatusFilter = "all" | TicketStatus;

interface IBoard {
  search: string;
  statusFilter: StatusFilter;
  setSearch: (value: string) => void;
  setStatusFilter: (value: StatusFilter) => void;
}

const useBoardStore = create<IBoard>((set) => ({
  search: "",
  statusFilter: "all",
  setSearch: (value) => set({ search: value }),
  setStatusFilter: (value) => set({ statusFilter: value }),
}));

export default useBoardStore;
