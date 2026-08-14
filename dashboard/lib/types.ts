export type Recommendation = "Evet" | "Belki" | "Hayir";

export type CriterionKey =
  | "rest_api"
  | "llm_experience"
  | "agentic_mcp"
  | "learning_signals"
  | "bonus_tools"
  | "relevant_major";

export type Criterion = {
  score: number;
  max_score: number;
  status: "kanitli" | "bilinmiyor";
  evidence: string;
};

export type EvaluationJson = {
  score: number;
  recommendation: Recommendation;
  strengths: string[];
  risks: string[];
  reasoning: string;
  criteria: Record<CriterionKey, Criterion>;
};

export type Application = {
  id: string;
  created_at: string;
  full_name: string;
  technologies: string | null;
  description: string | null;
  cv_url: string | null;
  cv_text: string | null;
};

export type Evaluation = {
  id: string;
  created_at: string;
  application_id: string;
  score: number;
  recommendation: Recommendation;
  reasoning: string | null;
  evaluation_json: EvaluationJson | string;
  model: string | null;
  rubric_version: string | null;
};

/** Rubric kriterlerinin gosterim sirasi ve Turkce basliklari. */
export const CRITERION_LABELS: { key: CriterionKey; label: string }[] = [
  { key: "rest_api", label: "REST API bilgisi" },
  { key: "llm_experience", label: "LLM deneyimi" },
  { key: "agentic_mcp", label: "Agentic AI / MCP" },
  { key: "learning_signals", label: "Öğrenme sinyalleri" },
  { key: "bonus_tools", label: "Bonus araçlar" },
  { key: "relevant_major", label: "İlgili bölüm" },
];

/**
 * `evaluation_json` jsonb kolonundan geliyor ve normalde nesne olarak donuyor.
 * Bazi istemci/aktarim yollarinda string olarak gelebildigi icin ikisini de karsiliyoruz.
 */
export function parseEvaluationJson(
  value: EvaluationJson | string
): EvaluationJson {
  return typeof value === "string" ? (JSON.parse(value) as EvaluationJson) : value;
}
