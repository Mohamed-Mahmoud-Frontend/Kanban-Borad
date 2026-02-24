"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useTasks } from "@/hooks/useTasks";
import { useUpdateTaskColumn } from "@/hooks/useUpdateTaskColumn";
import useTaskStore from "@/app/store";
import type { Task } from "@/app/store";
import { TODO_COLUMNS } from "@/app/lib/TodoColumns";
import KanbanColumn from "../Colums/TodoColumn";
import TaskModal from "../CardTask/TaskModal";
import { TbLayoutDashboard } from "react-icons/tb";
import { CiSearch } from "react-icons/ci";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const COLUMN_IDS = TODO_COLUMNS.map((c) => c.id);

function normalizeStatus(s: string | undefined): string {
  if (!s) return "todo";
  const v = s.toLowerCase().trim();
  if (v === "to do" || v === "todo" || v === "backlog") return "todo";
  if (v === "in progress" || v === "in_progress") return "in_progress";
  if (v === "in review" || v === "review") return "review";
  if (v === "done") return "done";
  return v;
}

function getTasksByColumn(tasks: Task[]): Record<string, Task[]> {
  const map: Record<string, Task[]> = {};
  COLUMN_IDS.forEach((id) => {
    map[id] = tasks.filter((t) => {
      const status = (t as { status?: string }).status ?? t.column;
      return normalizeStatus(status) === id;
    });
  });
  return map;
}
function Header() {
  const router = useRouter();
  const { data: tasks = [], isLoading, isError } = useTasks();
  const updateColumn = useUpdateTaskColumn();
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const setSearchQuery = useTaskStore((s) => s.setSearchQuery);
  const setIsAddingTaskOpen = useTaskStore((s) => s.setIsAddingTaskOpen);
  const setAddTaskColumn = useTaskStore((s) => s.setAddTaskColumn);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter(
      (t: Task) =>
        (t.title || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q)
    );
  }, [tasks, searchQuery]);

  const tasksByColumn = useMemo(
    () => getTasksByColumn(filtered as Task[]),
    [filtered]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || over.id === active.id) return;
    const taskIdStr = String(active.id);
    if (!taskIdStr.startsWith("task-")) return;
    const taskId = Number(taskIdStr.replace("task-", ""));
    if (Number.isNaN(taskId)) return;
    const newColumn = String(over.id);
    if (!(COLUMN_IDS as readonly string[]).includes(newColumn)) return;
    const task = (tasks as Task[]).find((t) => t.id === taskId);
    const taskStatus = (task as { status?: string })?.status ?? task?.column;
    if (normalizeStatus(taskStatus) === newColumn) return;
    const columnLabel =
      TODO_COLUMNS.find((c) => c.id === newColumn)?.label ?? newColumn;
    const taskTitle = task?.title ?? "Task";
    updateColumn.mutate({ id: taskId, column: newColumn }, {
      onSuccess: () => {
        toast.success(`Moved "${taskTitle}" to ${columnLabel}.`);
      },
      onError: () => {
        toast.error(`Could not move "${taskTitle}" to ${columnLabel}.`);
      },
    });
  };

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserEmail(user?.email ?? null);
    };
    loadUser();
  }, []);

  const userInitial =
    (currentUserEmail?.trim().charAt(0).toUpperCase() as string | undefined) ??
    undefined;

  const openAddTask = (columnId: string) => {
    setAddTaskColumn(columnId);
    setIsAddingTaskOpen(true);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(`Sign out failed: ${error.message}`);
      return;
    }
    setIsUserMenuOpen(false);
    toast.success("You have been signed out.");
    router.replace("/login");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f5f4]">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-[#e7e5e4] border-t-[#3B82F6]"
          aria-hidden
        />
        <p className="text-sm font-medium text-[#71717a]">Loading tasks...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f5f4]">
        <p className="text-sm font-medium text-red-600">Failed to load tasks</p>
      </div>
    );
  }

  const totalCount = (filtered as Task[]).length;

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-[#e7e5e4] bg-gray-200 px-6 py-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            
            <TbLayoutDashboard className="bg-blue-500 text-white rounded-md p-1" size={35} />
           <div className="flex flex-col ">

            <span className="text-lg flex items-center  font-bold tracking-tight text-[#27272a]">
            KANBAN BOARD
            </span>
          <span className="text-sm text-[#71717a]">{totalCount} tasks</span>
           </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a1a1aa]"
              aria-hidden
            >
              <CiSearch />
            </span>
            <input
              type="search"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 rounded-lg border border-[#e7e5e4] bg-gray-300 pl-9 pr-3 text-sm text-[#27272a] outline-none"
            />
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3B82F6] text-sm font-semibold text-white uppercase"
            >
              {userInitial ?? "U"}
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg border border-[#e7e5e4] bg-white py-1 shadow-lg">
                <div className="px-3 py-1 text-xs text-[#71717a]">
                  {currentUserEmail ?? "Unknown user"}
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-1 w-full px-3 py-1.5 text-left text-sm text-[#b91c1c] hover:bg-[#fef2f2]"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden px-4 py-4 scroll-smooth md:px-6">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex gap-4 pb-4">
            {TODO_COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasksByColumn[column.id] ?? []}
                onAddTask={openAddTask}
              />
            ))}
          </div>
        </DndContext>
      </main>
      <TaskModal />
    </div>
  );
}

export default Header;