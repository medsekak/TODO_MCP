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

// Clé API (métadonnées). La clé en clair n'est renvoyée qu'à la création.
export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  revoked: boolean;
}

// Réponse de POST /api-keys : métadonnées + clé en clair (affichée une seule fois).
export interface CreatedApiKey extends ApiKey {
  key: string;
}