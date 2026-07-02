import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import api from "../lib/api";
import { Ticket, TicketStatus } from "../types";

const parseError = (err: unknown, fallback: string): string => {
  if (!axios.isAxiosError(err)) return fallback;
  const data = err.response?.data;
  if (data?.errors && Array.isArray(data.errors)) {
    return data.errors[0]?.message ?? fallback;
  }
  return data?.message || fallback;
};

const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Chargement initial
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get<Ticket[]>("/tickets");
        setTickets(res.data);
      } catch (err) {
        console.error(err);
        toast.error(parseError(err, "Impossible de charger les tickets"));
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const createTicket = async (
    values: { title: string; description: string },
    status: TicketStatus,
  ) => {
    try {
      const res = await api.post<Ticket>("/tickets", { ...values, status });
      setTickets((prev) => [...prev, res.data]);
      toast.success("Ticket créé");
    } catch (err) {
      toast.error(parseError(err, "Échec de la création"));
    }
  };

  const updateTicket = async (
    id: string,
    values: { title: string; description: string },
  ) => {
    const previous = tickets;
    // Optimiste
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...values } : t)),
    );
    try {
      await api.patch(`/tickets/${id}`, values);
      toast.success("Ticket mis à jour");
    } catch (err) {
      setTickets(previous); // rollback
      toast.error(parseError(err, "Échec de la mise à jour"));
    }
  };

  // Le board est déjà réorganisé visuellement par le drag (setTickets dans
  // handleDragEnd) ; ici on persiste juste le statut, avec rollback sur échec.
  const moveTicket = async (
    id: string,
    status: TicketStatus,
    rollback: Ticket[],
  ) => {
    try {
      await api.patch(`/tickets/${id}`, { status });
    } catch (err) {
      setTickets(rollback);
      toast.error(parseError(err, "Échec du déplacement"));
    }
  };

  const deleteTicket = async (id: string) => {
    const previous = tickets;
    setTickets((prev) => prev.filter((t) => t.id !== id)); // optimiste
    try {
      await api.delete(`/tickets/${id}`);
      toast.success("Ticket supprimé");
    } catch (err) {
      setTickets(previous); // rollback
      toast.error(parseError(err, "Échec de la suppression"));
    }
  };

  return {
    tickets,
    setTickets,
    loading,
    createTicket,
    updateTicket,
    moveTicket,
    deleteTicket,
  };
};

export default useTickets;
