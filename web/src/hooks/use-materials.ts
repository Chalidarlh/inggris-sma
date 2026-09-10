"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Material } from "@/lib/types";

/**
 * Hook untuk mengambil daftar materi.
 * Encapsulate React Query + Supabase query dalam satu hook reusable.
 */
export function useMaterials(classId?: string) {
  const supabase = createClient();

  return useQuery<Material[]>({
    queryKey: ["materials", classId],
    queryFn: async () => {
      let query = supabase
        .from("materials")
        .select("*, week:weeks(*), class:classes(*)")
        .order("created_at", { ascending: false });

      if (classId) {
        query = query.eq("class_id", classId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    enabled: true,
  });
}

/**
 * Hook untuk mengambil satu materi berdasarkan ID.
 */
export function useMaterial(id: string) {
  const supabase = createClient();

  return useQuery<Material>({
    queryKey: ["materials", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materials")
        .select("*, week:weeks(*), class:classes(*)")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
