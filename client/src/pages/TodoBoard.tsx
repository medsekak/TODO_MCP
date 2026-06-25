import { useMemo, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import { Ticket, TicketStatus } from "../types";
import { initialTickets } from "../data/tickets";
import TicketModal from "../components/TicketModal";
import useBoardStore from "../store/boardStore";

const COLUMNS: { id: TicketStatus; title: string; accent: string }[] = [
  { id: "todo", title: "À faire", accent: "text-slate-400" },
  { id: "in_progress", title: "En cours", accent: "text-indigo-400" },
  { id: "done", title: "Terminé", accent: "text-emerald-400" },
];

// État du modal : fermé, création (dans une colonne), ou édition d'un ticket.
type ModalState =
  | { mode: "closed" }
  | { mode: "create"; status: TicketStatus }
  | { mode: "edit"; ticket: Ticket };

const TodoBoard = () => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  const search = useBoardStore((s) => s.search);
  const statusFilter = useBoardStore((s) => s.statusFilter);

  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;

  // Colonnes visibles selon le filtre de statut.
  const visibleColumns = COLUMNS.filter(
    (c) => statusFilter === "all" || c.id === statusFilter,
  );

  // Filtre texte sur le titre et la description.
  const matchesSearch = (ticket: Ticket) =>
    !isSearching ||
    ticket.title.toLowerCase().includes(query) ||
    ticket.description.toLowerCase().includes(query);

  // Tickets regroupés par colonne, en conservant l'ordre du tableau.
  const ticketsByStatus = useMemo(() => {
    const groups: Record<TicketStatus, Ticket[]> = {
      todo: [],
      in_progress: [],
      done: [],
    };
    tickets.forEach((t) => groups[t.status].push(t));
    return groups;
  }, [tickets]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setTickets((prev) => {
      const groups: Record<TicketStatus, Ticket[]> = {
        todo: [],
        in_progress: [],
        done: [],
      };
      prev.forEach((t) => groups[t.status].push(t));

      const from = source.droppableId as TicketStatus;
      const to = destination.droppableId as TicketStatus;
      const [moved] = groups[from].splice(source.index, 1);
      groups[to].splice(destination.index, 0, { ...moved, status: to });

      return [...groups.todo, ...groups.in_progress, ...groups.done];
    });
  };

  const handleSave = (values: { title: string; description: string }) => {
    if (modal.mode === "create") {
      const newTicket: Ticket = {
        id: crypto.randomUUID(),
        title: values.title,
        description: values.description,
        status: modal.status,
      };
      setTickets((prev) => [...prev, newTicket]);
      toast.success("Ticket créé");
    } else if (modal.mode === "edit") {
      const { ticket } = modal;
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticket.id
            ? { ...t, title: values.title, description: values.description }
            : t,
        ),
      );
      toast.success("Ticket mis à jour");
    }
    setModal({ mode: "closed" });
  };

  const handleDelete = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    toast.success("Ticket supprimé");
  };

  return (
    <section className="flex flex-1 flex-col bg-slate-950 p-6 overflow-hidden">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-1 gap-5 overflow-x-auto">
          {visibleColumns.map((column) => {
            const columnTickets = ticketsByStatus[column.id].filter(matchesSearch);
            return (
              <div
                key={column.id}
                className="flex w-80 shrink-0 flex-col rounded-3xl bg-slate-900/50 border border-slate-800"
              >
                {/* En-tête de colonne */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                  <h2 className={`text-sm font-bold uppercase tracking-wider ${column.accent}`}>
                    {column.title}
                    <span className="ml-2 text-slate-600">{columnTickets.length}</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setModal({ mode: "create", status: column.id })}
                    className="text-slate-500 hover:text-indigo-400 transition-colors"
                    aria-label={`Ajouter un ticket dans ${column.title}`}
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Liste des tickets (zone de drop) */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 p-3 overflow-y-auto transition-colors ${
                        snapshot.isDraggingOver ? "bg-slate-800/30" : ""
                      }`}
                    >
                      {columnTickets.map((ticket, index) => (
                        <Draggable
                          key={ticket.id}
                          draggableId={ticket.id}
                          index={index}
                          isDragDisabled={isSearching}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              className={`group rounded-2xl border border-slate-800 bg-slate-900 p-3.5 shadow-sm transition-shadow ${
                                dragSnapshot.isDragging
                                  ? "shadow-lg ring-2 ring-indigo-500/40"
                                  : "hover:border-slate-700"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <span
                                  {...dragProvided.dragHandleProps}
                                  className={`mt-0.5 text-slate-600 ${
                                    isSearching
                                      ? "cursor-default opacity-40"
                                      : "cursor-grab hover:text-slate-400 active:cursor-grabbing"
                                  }`}
                                  aria-label="Déplacer"
                                >
                                  <GripVertical size={16} />
                                </span>

                                <div className="min-w-0 flex-1">
                                  <h3 className="text-sm font-semibold text-slate-100 break-words">
                                    {ticket.title}
                                  </h3>
                                  {ticket.description && (
                                    <p className="mt-1 text-xs text-slate-400 break-words">
                                      {ticket.description}
                                    </p>
                                  )}
                                </div>

                                {/* Actions (apparaissent au survol) */}
                                <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => setModal({ mode: "edit", ticket })}
                                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                                    aria-label="Modifier"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(ticket.id)}
                                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                                    aria-label="Supprimer"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {columnTickets.length === 0 && !snapshot.isDraggingOver && (
                        <p className="py-6 text-center text-xs text-slate-600">
                          {isSearching ? "Aucun résultat" : "Aucun ticket"}
                        </p>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {modal.mode !== "closed" && (
        <TicketModal
          ticket={modal.mode === "edit" ? modal.ticket : null}
          onClose={() => setModal({ mode: "closed" })}
          onSave={handleSave}
        />
      )}
    </section>
  );
};

export default TodoBoard;
