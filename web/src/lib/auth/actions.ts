"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Server Actions untuk Supabase Auth
 * Dipakai dari form login di /login page
 */

/**
 * Login dengan email & password
 */
export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // Redirect setelah login berhasil
  // Cek apakah user adalah siswa
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: student } = await supabase
      .from("students")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (student) {
      redirect("/portal");
    }
  }

  redirect("/dashboard");
}

/**
 * Logout — hapus session
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Ambil user session saat ini (untuk Server Components)
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
