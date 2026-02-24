"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../app/lib/supabase";

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      column,
      priority,
    }: {
      id: number;
      title: string;
      description: string;
      column: string;
      priority?: string;
    }) => {
      const payload: {
        title: string;
        description: string;
        status: string;
        priority?: string;
      } = {
        title,
        description,
        status: column,
      };
      if (priority != null) payload.priority = priority;
      const { data, error } = await supabase
        .from("tasks")
        .update(payload)
        .eq("id", id)
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
