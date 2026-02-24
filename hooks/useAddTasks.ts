
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../app/lib/supabase";

export function useAddTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: {
      title: string;
      description: string;
      column: string;
      priority?: string;
    }) => {
      const { title, description, column, priority } = task;
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title,
          description,
          status: column,
          ...(priority && { priority }),
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
