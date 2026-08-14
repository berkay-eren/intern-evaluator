import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase, createCvSignedUrl } from "@/lib/supabase";
import {
  CRITERION_LABELS,
  parseEvaluationJson,
  type Application,
  type Evaluation,
} from "@/lib/types";
import { RecommendationBadge, StatusPill } from "@/components/badges";

export const dynamic = "force-dynamic";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function Page({ params }: PageProps<"/basvuru/[id]">) {
  const { id } = await params;
  const supabase = getSupabase();

  const { data: application } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!application) notFound();
  const app = application as Application;

  // Bir basvuru yeniden degerlendirilebilir; en son degerlendirmeyi gosteriyoruz.
  const { data: evaluationRow } = await supabase
    .from("evaluations")
    .select("*")
    .eq("application_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const evaluation = evaluationRow as Evaluation | null;
  const details = evaluation ? parseEvaluationJson(evaluation.evaluation_json) : null;
  const cvHref = await createCvSignedUrl(app.cv_url);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <Link
        href="/"
        className="text-sm text-slate-500 underline-offset-4 hover:text-slate-900 hover:underline"
      >
        ← Tüm başvurular
      </Link>

      <header className="mt-6 border-b border-slate-200 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {app.full_name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {formatDateTime(app.created_at)}
            </p>
          </div>
          {evaluation && (
            <div className="flex items-center gap-3">
              <span className="font-mono text-3xl font-semibold tabular-nums text-slate-900">
                {evaluation.score}
                <span className="text-base font-normal text-slate-400">/100</span>
              </span>
              <RecommendationBadge value={evaluation.recommendation} />
            </div>
          )}
        </div>

        {app.technologies && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {app.technologies.split(",").map((tech) => (
              <span
                key={tech}
                className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        )}

        {cvHref && (
          <a
            href={cvHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm text-slate-700 underline underline-offset-4 hover:text-slate-900"
          >
            CV&apos;yi aç (PDF)
          </a>
        )}
      </header>

      {!evaluation || !details ? (
        <p className="mt-10 rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
          Bu başvuru için henüz bir değerlendirme kaydı yok.
        </p>
      ) : (
        <>
          <Section title="Gerekçe">
            <p className="text-sm leading-relaxed text-slate-700">{details.reasoning}</p>
          </Section>

          <Section title="Kriterler">
            <div className="divide-y divide-slate-100">
              {CRITERION_LABELS.map(({ key, label }) => {
                const c = details.criteria?.[key];
                if (!c) return null;
                const pct = c.max_score ? (c.score / c.max_score) * 100 : 0;
                return (
                  <div key={key} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-slate-900">{label}</h3>
                        <StatusPill status={c.status} />
                      </div>
                      <span className="shrink-0 font-mono text-sm tabular-nums text-slate-600">
                        {c.score}
                        <span className="text-slate-400">/{c.max_score}</span>
                      </span>
                    </div>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-800"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      {c.evidence}
                    </p>
                  </div>
                );
              })}
            </div>
          </Section>

          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            <BulletList title="Güçlü yanlar" items={details.strengths} accent="bg-emerald-400" />
            <BulletList title="Riskler ve eksikler" items={details.risks} accent="bg-rose-300" />
          </div>
        </>
      )}

      {app.description && (
        <Section title="Adayın başvuru metni">
          <div className="space-y-3 text-sm leading-relaxed whitespace-pre-line text-slate-700">
            {app.description}
          </div>
        </Section>
      )}

      {evaluation && (
        <footer className="mt-12 border-t border-slate-200 pt-5 text-xs text-slate-400">
          Model: {evaluation.model ?? "—"} · Rubric: {evaluation.rubric_version ?? "—"} ·
          Değerlendirme tarihi: {formatDateTime(evaluation.created_at)}
        </footer>
      )}
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletList({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: string;
}) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        {title}
      </h2>
      <ul className="space-y-2.5">
        {(items ?? []).map((item, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-slate-700">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${accent}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
