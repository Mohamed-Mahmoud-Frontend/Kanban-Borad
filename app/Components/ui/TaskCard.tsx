"use client";

import React from "react";
import { CiEdit, CiTrash } from "react-icons/ci";
import useTaskStore, { Task } from "@/app/store";
import { useDeleteTask } from "@/hooks/UseDeleteTasks";
import toast from "react-hot-toast";

function TaskCard({ task }: { task: Task }) {
  const setEditingTask = useTaskStore((s) => s.setEditingTask);
  const deleteTask = useDeleteTask();

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditingTask(task);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (typeof window !== "undefined" && window.confirm("حذف هذه المهمة؟")) {
      const taskTitle = task.title || "Task";
      deleteTask.mutate(task.id, {
        onSuccess: () => {
          toast.success(`Deleted "${taskTitle}".`);
        },
        onError: () => {
          toast.error(`Failed to delete "${taskTitle}".`);
        },
      });
    }
  }

  const priority = (task.priority || "medium").toLowerCase();

  const priorityStyles =
    priority === "high"
      ? "bg-red-500 text-white"
      : priority === "medium"
        ? "bg-[#F97316] text-white"
        : "bg-[#e7e5e4] text-[#52525b]";

  return (
    <div className="group flex h-[132px] flex-col rounded-lg bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <div className="min-h-0 flex-1 overflow-hidden">
        <h3 className="line-clamp-1 font-semibold text-[#27272a]">
          {task.title}
        </h3>
        {task.description && (
          <p className="mt-1 line-clamp-2 text-sm text-[#71717a]">
            {task.description}
          </p>
        )}
      </div>
      <div className="mt-3 flex shrink-0 items-center justify-between gap-2">
        <span
          className={`rounded px-2 py-0.5 text-xs font-medium uppercase ${priorityStyles}`}
        >
          {priority}
        </span>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={handleEdit}
            className="rounded p-1.5 text-[#71717a] transition-colors hover:bg-[#f5f5f4] hover:text-[#27272a]"
          >
            <CiEdit className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteTask.isPending}
            className="rounded p-1.5 text-[#71717a] transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <CiTrash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;