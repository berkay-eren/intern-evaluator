import type { Recommendation } from "@/lib/types";

const RECOMMENDATION_STYLES: Record<Recommendation, string> = {
  Evet: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  Belki: "bg-amber-50 text-amber-800 ring-amber-200",
  Hayir: "bg-rose-50 text-rose-800 ring-rose-200",
};

const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
  Evet: "Evet",
  Belki: "Belki",
  Hayir: "Hayır",
};

export function RecommendationBadge({ value }: { value: Recommendation }) {
  const style = RECOMMENDATION_STYLES[value] ?? "bg-slate-50 text-slate-700 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {RECOMMENDATION_LABELS[value] ?? value}
    </span>
  );
}

/** 0-100 skoru hem sayi hem ince bir bar olarak gosterir. */
export function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-emerald-500" : score >= 45 ? "bg-amber-500" : "bg-rose-400";
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 shrink-0 text-right font-mono text-sm font-semibold tabular-nums text-slate-900">
        {score}
      </span>
      <div className="h-1.5 w-full max-w-28 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: "kanitli" | "bilinmiyor" }) {
  return status === "kanitli" ? (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
      kanıtlı
    </span>
  ) : (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium text-slate-400 ring-1 ring-inset ring-slate-200">
      bilinmiyor
    </span>
  );
}
