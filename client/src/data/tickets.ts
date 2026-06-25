import { Ticket } from "../types";

// ⚠️ Données temporaires en mémoire — à remplacer par un fetch API plus tard.
// Sert uniquement à amorcer le board côté frontend.
export const initialTickets: Ticket[] = [
  {
    id: "seed-1",
    title: "Configurer le projet",
    description: "Mettre en place Vite, Tailwind et la structure des dossiers.",
    status: "done",
  },
  {
    id: "seed-2",
    title: "Brancher l'authentification",
    description: "Login, register et vérification email côté backend.",
    status: "in_progress",
  },
  {
    id: "seed-3",
    title: "Construire le board de tickets",
    description: "Kanban à 3 colonnes avec drag & drop et CRUD.",
    status: "in_progress",
  },
  {
    id: "seed-4",
    title: "Connecter les tickets à l'API",
    description: "Remplacer ce tableau temporaire par les vraies données.",
    status: "todo",
  },
];
