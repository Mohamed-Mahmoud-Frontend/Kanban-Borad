"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Task } from "@/app/store";
import type { ColumnId } from "@/app/lib/TodoColumns";
import DraggableTaskCard from "../Drag&Drop/DraggableTaskCard";

type ColumnConfig = { id: ColumnId; label: string; color: string };

type Props = {
  column: ColumnConfig;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
};  

   function TodoColumn({
  column,
  tasks,
  onAddTask,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex max-h-[500px] w-72 shrink-0 flex-col rounded-xl bg-[#e7e5e4]/80 p-3 transition-shadow ${
        isOver ? "ring-2 ring-[#3B82F6]/40" : ""
      }`}
    >
      <div className="mb-2 flex shrink-0 items-center gap-2">
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${column.color}`}
          aria-hidden
        />
        <span className="font-semibold text-[#27272a]">{column.label}</span>
        <span className="text-sm text-[#71717a]">{tasks.length}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-1 scroll-smooth">
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <DraggableTaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onAddTask(column.id)}
        className="mt-2 shrink-0 rounded-lg bg-[#f5f5f4] py-2.5 text-center text-sm text-[#71717a] transition-colors hover:bg-[#e7e5e4] hover:text-[#52525b]"
      >
        + Add task
      </button>
    </div>
  );
}

export default TodoColumn;