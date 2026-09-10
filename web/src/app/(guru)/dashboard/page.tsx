import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard Guru — MCP Inggris",
  description: "Ringkasan materi menunggu review dan nilai menunggu approve.",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Ambil materi berstatus draft
  const { data: materials, error: materialsError } = await supabase
    .from("materials")
    .select("*, class:classes(name), week:weeks(title, week_number)")
    .eq("status", "draft")
    .order("created_at", { ascending: false });

  // Ambil nilai berstatus draft (beserta data submission & student)
  const { data: grades, error: gradesError } = await supabase
    .from("grades")
    .select(`
      *,
      submission:submissions(
        answer,
        student:students(full_name),
        material:materials(title, class:classes(name))
      )
    `)
    .eq("status", "draft")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-semibold text-ink mb-8">
        Dashboard Guru
      </h1>

      <section className="mb-8">
        <h2 className="font-sans text-sm font-medium text-ink/60 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Materi Menunggu Review</span>
          <span className="bg-sage/20 text-sage-dark px-2 py-0.5 rounded-full text-xs">
            {materials?.length || 0}
          </span>
        </h2>
        
        {materialsError && (
          <div className="text-clay-dark bg-clay-light p-4 rounded-lg text-sm mb-4">
            Gagal mengambil data materi: {materialsError.message}
          </div>
        )}

        {materials && materials.length > 0 ? (
          <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-paper border-b border-ink/10">
                <tr>
                  <th className="px-4 py-3 font-medium text-ink/70">Materi</th>
                  <th className="px-4 py-3 font-medium text-ink/70">Kelas</th>
                  <th className="px-4 py-3 font-medium text-ink/70">Minggu</th>
                  <th className="px-4 py-3 font-medium text-ink/70">Skill</th>
                  <th className="px-4 py-3 font-medium text-ink/70">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {materials.map((m) => (
                  <tr key={m.id} className="hover:bg-paper/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-ink">{m.title}</td>
                    <td className="px-4 py-3 text-ink/70">{m.class?.name}</td>
                    <td className="px-4 py-3 text-ink/70">Mg. {m.week?.week_number}</td>
                    <td className="px-4 py-3 text-ink/70 capitalize">{m.skill_type}</td>
                    <td className="px-4 py-3">
                      <Link 
                        href={`/materi/${m.id}`}
                        className="text-sage-dark hover:text-sage transition-colors font-medium text-xs border border-sage-dark/30 hover:border-sage px-3 py-1.5 rounded-lg"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-ink/10 bg-white p-8 text-center">
            <p className="text-ink/50 text-sm">Tidak ada materi draft yang perlu di-review.</p>
            <p className="text-ink/40 text-xs mt-1">Gunakan Claude Desktop untuk membuat materi baru.</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-sans text-sm font-medium text-ink/60 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Nilai Menunggu Approve</span>
          <span className="bg-gold/20 text-gold-dark px-2 py-0.5 rounded-full text-xs">
            {grades?.length || 0}
          </span>
        </h2>

        {gradesError && (
          <div className="text-clay-dark bg-clay-light p-4 rounded-lg text-sm mb-4">
            Gagal mengambil data nilai: {gradesError.message}
          </div>
        )}

        {grades && grades.length > 0 ? (
          <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-paper border-b border-ink/10">
                <tr>
                  <th className="px-4 py-3 font-medium text-ink/70">Siswa</th>
                  <th className="px-4 py-3 font-medium text-ink/70">Materi</th>
                  <th className="px-4 py-3 font-medium text-ink/70">Skor AI</th>
                  <th className="px-4 py-3 font-medium text-ink/70">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {grades.map((g) => {
                  const submission = Array.isArray(g.submission) ? g.submission[0] : g.submission;
                  const student = Array.isArray(submission?.student) ? submission?.student[0] : submission?.student;
                  const material = Array.isArray(submission?.material) ? submission?.material[0] : submission?.material;
                  return (
                    <tr key={g.id} className="hover:bg-paper/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-ink">
                        {student?.full_name || "Unknown"}
                      </td>
                      <td className="px-4 py-3 text-ink/70">
                        {material?.title || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono bg-paper px-2 py-1 rounded text-ink font-medium">
                          {g.score}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link 
                          href={`/nilai/${g.id}`}
                          className="text-gold-dark hover:text-gold transition-colors font-medium text-xs border border-gold-dark/30 hover:border-gold px-3 py-1.5 rounded-lg"
                        >
                          Review & Approve
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-ink/10 bg-white p-8 text-center">
            <p className="text-ink/50 text-sm">Tidak ada nilai draft yang perlu di-approve.</p>
          </div>
        )}
      </section>
    </div>
  );
}
