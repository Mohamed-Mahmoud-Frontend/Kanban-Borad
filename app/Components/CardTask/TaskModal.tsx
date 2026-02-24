"use client";

import React, { useEffect, useState } from "react";
import useTaskStore from "@/app/store";
import { useAddTask } from "@/hooks/useAddTasks";
import { useUpdateTask } from "@/hooks/useUpdateTasks";
import { TODO_COLUMNS } from "@/app/lib/TodoColumns";
import toast from "react-hot-toast";

const PRIORITIES = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
] as const;

function normalizeStatus(s: string | undefined): string {
  if (!s) return "todo";
  const v = s.toLowerCase().trim();
  if (v === "to do" || v === "todo" || v === "backlog") return "todo";
  if (v === "in progress" || v === "in_progress") return "in_progress";
  if (v === "in review" || v === "review") return "review";
  if (v === "done") return "done";
  return v;
}

export default function TaskModal() {
  const isAddingOpen = useTaskStore((s) => s.isAddingTaskOpen);
  const addTaskColumn = useTaskStore((s) => s.addTaskColumn);
  const setIsAddingTaskOpen = useTaskStore((s) => s.setIsAddingTaskOpen);
  const setAddTaskColumn = useTaskStore((s) => s.setAddTaskColumn);
  const editingTask = useTaskStore((s) => s.editingTask);
  const setEditingTask = useTaskStore((s) => s.setEditingTask);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState<string>("todo");
  const [priority, setPriority] = useState<string>("medium");

  const addTask = useAddTask();
  const updateTask = useUpdateTask();

  const isEdit = editingTask !== null;
  const isOpen = isAddingOpen || isEdit;

  useEffect(() => {
    if (isEdit && editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || "");
      const rawStatus = (editingTask as { status?: string }).status ?? editingTask.column;
      setColumn(normalizeStatus(rawStatus) || "todo");
      setPriority(editingTask.priority || "medium");
    } else if (isAddingOpen) {
      setTitle("");
      setDescription("");
      setColumn(addTaskColumn || "todo");
      setPriority("medium");
    }
  }, [isEdit, isAddingOpen, addTaskColumn, editingTask]);

  const close = () => {
    setIsAddingTaskOpen(false);
    setAddTaskColumn(null);
    setEditingTask(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;

    if (isEdit && editingTask) {
      updateTask.mutate(
        {
          id: editingTask.id,
          title: t,
          description: description.trim(),
          column,
          priority,
        },
        {
          onSuccess: () => {
            toast.success(`Updated "${t}".`);
            close();
          },
          onError: () => {
            toast.error(`Failed to update "${t}".`);
          },
        }
      );
    } else {
      const columnLabel =
        TODO_COLUMNS.find((c) => c.id === column)?.label ?? column;
      addTask.mutate(
        {
          title: t,
          description: description.trim(),
          column,
          priority,
        },
        {
          onSuccess: () => {
            toast.success(`Added "${t}" to ${columnLabel}.`);
            close();
          },
          onError: () => {
            toast.error(`Failed to add "${t}" to ${columnLabel}.`);
          },
        }
      );
    }
  };

  if (!isOpen) return null;

  const pending = addTask.isPending || updateTask.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && close()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="task-modal-title" className="text-lg font-semibold text-[#27272a]">
          {isEdit ? "Edit task" : "Add task"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="task-title" className="mb-1 block text-sm font-medium text-[#52525b]">
              Title
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              className="w-full rounded-lg border border-[#e7e5e4] px-3 py-2 text-[#27272a] placeholder:text-[#a1a1aa] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label htmlFor="task-desc" className="mb-1 block text-sm font-medium text-[#52525b]">
              Description
            </label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
              className="w-full resize-none rounded-lg border border-[#e7e5e4] px-3 py-2 text-[#27272a] placeholder:text-[#a1a1aa] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label htmlFor="task-column" className="mb-1 block text-sm font-medium text-[#52525b]">
              Column
            </label>
            <select
              id="task-column"
              value={column}
              onChange={(e) => setColumn(e.target.value)}
              className="w-full rounded-lg border border-[#e7e5e4] px-3 py-2 text-[#27272a] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
            >
              {TODO_COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="task-priority" className="mb-1 block text-sm font-medium text-[#52525b]">
              Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg border border-[#e7e5e4] px-3 py-2 text-[#27272a] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={close}
              className="rounded-lg border border-[#e7e5e4] px-4 py-2 text-sm font-medium text-[#52525b] hover:bg-[#f5f5f4]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-50"
            >
              {pending ? "Saving…" : isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
