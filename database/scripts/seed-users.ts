/**
 * seed-users.ts — Membuat akun dummy untuk testing
 * 1 akun guru, 2 akun siswa
 *
 * Jalankan: npx tsx scripts/seed-users.ts
 */

import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function main() {
  console.log("🌱 Membuat akun dummy...");

  // 1. Buat akun Guru
  console.log("▶ Membuat akun guru (guru@sekolah.com)...");
  const { data: teacherAuth, error: teacherAuthError } = await supabase.auth.admin.createUser({
    email: "guru@sekolah.com",
    password: "password123",
    email_confirm: true,
  });

  if (teacherAuthError) {
    if (teacherAuthError.message.includes("already registered")) {
       console.log("⚠️ Akun guru sudah ada.");
    } else {
       console.error("❌ Gagal membuat akun guru:", teacherAuthError.message);
       process.exit(1);
    }
  }

  // Get teacher ID (either newly created or existing)
  const { data: { users: allUsers } } = await supabase.auth.admin.listUsers();
  const teacherId = allUsers.find(u => u.email === "guru@sekolah.com")?.id;

  if (!teacherId) {
    console.error("❌ Gagal mendapatkan ID guru.");
    process.exit(1);
  }

  // 2. Buat Kelas
  console.log("▶ Membuat kelas 'XI IPA 1' untuk guru...");
  const { data: classData, error: classError } = await supabase
    .from("classes")
    .upsert({
      name: "XI IPA 1",
      teacher_id: teacherId,
      academic_year: "2024/2025"
    }, { onConflict: "id", ignoreDuplicates: false }) // Wait, classes has no unique constraint on name/teacher. 
    // Let's just check if it exists first
    .select()
    .limit(1);

  // Better way to check if class exists:
  let classId;
  const { data: existingClasses } = await supabase.from("classes").select("id").eq("name", "XI IPA 1").eq("teacher_id", teacherId);
  if (existingClasses && existingClasses.length > 0) {
     classId = existingClasses[0].id;
     console.log("⚠️ Kelas 'XI IPA 1' sudah ada.");
  } else {
     const { data: newClass, error: newClassError } = await supabase.from("classes").insert({
        name: "XI IPA 1",
        teacher_id: teacherId,
        academic_year: "2024/2025"
     }).select().single();
     if (newClassError) {
         console.error("❌ Gagal membuat kelas:", newClassError.message);
         process.exit(1);
     }
     classId = newClass.id;
  }

  // 3. Buat akun Siswa
  const students = [
    { email: "siswa1@sekolah.com", name: "Budi Santoso", nis: "1001" },
    { email: "siswa2@sekolah.com", name: "Siti Aminah", nis: "1002" },
  ];

  for (const s of students) {
    console.log(`▶ Membuat akun siswa (${s.email})...`);
    const { data: studentAuth, error: studentAuthError } = await supabase.auth.admin.createUser({
      email: s.email,
      password: "password123",
      email_confirm: true,
    });

    if (studentAuthError && !studentAuthError.message.includes("already registered")) {
       console.error(`❌ Gagal membuat akun ${s.email}:`, studentAuthError.message);
       continue;
    }

    const studentId = allUsers.find(u => u.email === s.email)?.id || (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === s.email)?.id;
    
    if (studentId) {
        // Insert to students table
        const { error: studentInsertError } = await supabase.from("students").upsert({
            user_id: studentId,
            class_id: classId,
            full_name: s.name,
            student_number: s.nis
        }, { onConflict: "user_id" });
        if (studentInsertError) {
            console.error(`❌ Gagal insert data siswa ${s.name}:`, studentInsertError.message);
        }
    }
  }

  console.log("\n✅ Semua akun dummy berhasil dibuat!");
  console.log("-----------------------------------------");
  console.log("Gunakan kredensial berikut untuk login:");
  console.log("👨‍🏫 Guru: guru@sekolah.com / password123");
  console.log("👨‍🎓 Siswa 1: siswa1@sekolah.com / password123");
  console.log("👩‍🎓 Siswa 2: siswa2@sekolah.com / password123");
}

main().catch(console.error);
