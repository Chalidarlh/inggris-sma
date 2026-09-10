"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Grade } from "@/lib/types";

/**
 * Hook untuk mengambil daftar nilai (grades) yang belum di-approve.
 * Dipakai di dashboard guru untuk menampilkan nilai yang perlu ditinjau.
 */
export function usePendingGrades(classId?: string) {
  const supabase = createClient();

  return useQuery<Grade[]>({
    queryKey: ["grades", "pending", classId],
    queryFn: async () => {
      let query = supabase
        .from("grades")
        .select(
          "*, submission:submissions(*, material:materials(*), student:students(*))"
        )
        .eq("status", "draft")
        .order("created_at", { ascending: false });

      if (classId) {
        // Filter by class via nested relation
        query = query.eq("submission.material.class_id", classId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

/**
 * Hook untuk mengambil nilai seorang siswa (portal siswa).
 */
export function useMyGrades(studentId: string) {
  const supabase = createClient();

  return useQuery<Grade[]>({
    queryKey: ["grades", "student", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grades")
        .select(
          "*, submission:submissions(*, material:materials(*, week:weeks(*)))"
        )
        .eq("submission.student_id", studentId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!studentId,
  });
}

/**
 * Hook untuk mengambil satu grade berdasarkan ID.
 */
export function useGrade(id: string) {
  const supabase = createClient();

  return useQuery<Grade>({
    queryKey: ["grades", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grades")
        .select(
          "*, submission:submissions(*, material:materials(*, week:weeks(*)), student:students(*))"
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
