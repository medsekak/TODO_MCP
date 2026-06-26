export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
};

export interface LoginResponse {
  user: User;
  accessToken: string;
}

// Réponse de GET/PATCH /auth/me (champs réels renvoyés par le backend).
export interface Profile {
  id: string;
  username: string;
  email: string;
  created_at: string;
  is_verified: boolean;
}

export type TicketStatus = "todo" | "in_progress" | "done";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
}