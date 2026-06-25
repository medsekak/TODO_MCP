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

export type TicketStatus = "todo" | "in_progress" | "done";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
}