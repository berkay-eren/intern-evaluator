import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { FORM_URL } from "@/lib/config";
import type { Recommendation } from "@/lib/types";
import { RecommendationBadge, ScoreBar } from "@/components/badges";

/** Her istekte taze veri; basvurular akmaya devam ediyor. */
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  score: number;
  recommendation: Recommendation;
  created_at: string;
  applications: {
    id: string;
    full_name: string;
    technologies: string | null;
  } | null;
};

const FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Tümü" },
  { value: "Evet", label: "Evet" },
  { value: "Belki", label: "Belki" },
  { value: "Hayir", label: "Hayır" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ oneri?: string }>;
}) {
  const { oneri } = await searchParams;
  const activeFilter = FILTERS.some((f) => f.value === oneri && f.value !== "")
    ? oneri!
    : "";

  let query = getSupabase()
    .from("evaluations")
    .select("id, score, recommendation, created_at, applications(id, full_name, technologies)")
    .order("score", { ascending: false });

  if (activeFilter) query = query.eq("recommendation", activeFilter);

  const { data, error } = await query;

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-xl font-semibold text-slate-900">Veri okunamadı</h1>
        <p className="mt-2 text-sm text-slate-600">{error.message}</p>
      </main>
    );
  }

  const rows = (data ?? []) as unknown as Row[];
  const counts = {
    Evet: rows.filter((r) => r.recommendation === "Evet").length,
    Belki: rows.filter((r) => r.recommendation === "Belki").length,
    Hayir: rows.filter((r) => r.recommendation === "Hayir").length,
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <header className="border-b border-slate-200 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Staj Başvuru Ön Değerlendirmesi
          </h1>
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Başvuru formu →
          </a>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Formdan gelen başvurular, CV metniyle birlikte Claude&apos;a gönderilip altı
          kriterlik bir rubric üzerinden puanlanıyor. Aday adı modele hiç gitmiyor;
          toplam puanı da modelin verdiği sayı değil, kriter puanlarını toplayan kod
          belirliyor. Bir adaya tıklayınca puanın hangi kanıta dayandığını görebilirsin.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <nav className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const isActive = f.value === activeFilter;
            return (
              <Link
                key={f.value || "all"}
                href={f.value ? `/?oneri=${f.value}` : "/"}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </nav>

        <p className="text-sm text-slate-500">
          {activeFilter
            ? `${rows.length} başvuru`
            : `${rows.length} başvuru · ${counts.Evet} Evet · ${counts.Belki} Belki · ${counts.Hayir} Hayır`}
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
          Bu filtreye uyan başvuru yok.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-2xl border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3 pr-4 font-medium">Aday</th>
                <th className="py-3 pr-4 font-medium">Skor</th>
                <th className="py-3 pr-4 font-medium">Öneri</th>
                <th className="py-3 pr-4 font-medium">Teknolojiler</th>
                <th className="py-3 font-medium">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const app = row.applications;
                return (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 align-middle transition hover:bg-slate-50"
                  >
                    <td className="py-4 pr-4">
                      {app ? (
                        <Link
                          href={`/basvuru/${app.id}`}
                          className="font-medium text-slate-900 underline-offset-4 hover:underline"
                        >
                          {app.full_name}
                        </Link>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <ScoreBar score={row.score} />
                    </td>
                    <td className="py-4 pr-4">
                      <RecommendationBadge value={row.recommendation} />
                    </td>
                    <td className="max-w-xs truncate py-4 pr-4 text-sm text-slate-600">
                      {app?.technologies ?? "—"}
                    </td>
                    <td className="py-4 text-sm whitespace-nowrap text-slate-500">
                      {formatDate(row.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
