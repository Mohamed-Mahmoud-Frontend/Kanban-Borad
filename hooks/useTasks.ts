
"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/app/lib/supabase";

export function useTasks() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data: rows, error } = await supabase.from("tasks").select("*");
      if (error) throw error;
      return rows ?? [];
    },
  });
  return { data, isLoading, isError };
}
