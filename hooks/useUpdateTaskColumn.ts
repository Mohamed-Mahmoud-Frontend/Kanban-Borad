
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/app/lib/supabase";

export function useUpdateTaskColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, column }: { id: number; column: string }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ status: column })
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
