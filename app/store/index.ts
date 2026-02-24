import { create } from "zustand";

export interface Task {
  id: number;
  title: string;
  description: string;
  column: string;
  priority?: string;
}

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
  isAddingTaskOpen: boolean;
  setIsAddingTaskOpen: (isAddingTaskOpen: boolean) => void;
  /** العمود الافتراضي عند فتح "إضافة مهمة" من عمود معيّن */
  addTaskColumn: string | null;
  setAddTaskColumn: (column: string | null) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
}

const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  isAddingTaskOpen: false,
  setIsAddingTaskOpen: (isAddingTaskOpen) => set({ isAddingTaskOpen }),
  addTaskColumn: null,
  setAddTaskColumn: (addTaskColumn) => set({ addTaskColumn }),
  editingTask: null,
  setEditingTask: (editingTask) => set({ editingTask }),
}));

export default useTaskStore;
