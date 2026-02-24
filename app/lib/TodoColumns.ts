export const TODO_COLUMNS = [
  { id: "todo" as const, label: "TO DO", color: "bg-[#3B82F6]" },
  { id: "in_progress" as const, label: "IN PROGRESS", color: "bg-[#F97316]" },
  { id: "review" as const, label: "IN REVIEW", color: "bg-[#A855F7]" },
  { id: "done" as const, label: "DONE", color: "bg-[#22C55E]" },
] as const;

export type ColumnId = (typeof TODO_COLUMNS)[number]["id"];
