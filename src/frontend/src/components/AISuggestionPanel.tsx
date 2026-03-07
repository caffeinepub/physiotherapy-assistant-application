import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Clock,
  FlameKindling,
  Info,
  Sparkles,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CATEGORY_CONFIG } from "../data/therapyModalities";
import {
  type TherapySuggestion,
  type TherapySuggestionContext,
  suggestTherapies,
} from "../utils/therapySuggestionEngine";

interface AISuggestionPanelProps {
  context: TherapySuggestionContext;
  onPrescribe: (therapyId: string) => void;
}

const CONFIDENCE_CONFIG = {
  High: {
    label: "High Confidence",
    color: "oklch(0.68 0.18 155)",
    bg: "oklch(0.68 0.18 155 / 0.12)",
    border: "oklch(0.68 0.18 155 / 0.35)",
    text: "oklch(0.82 0.14 155)",
    glow: "oklch(0.68 0.18 155 / 0.3)",
    icon: CheckCircle2,
  },
  Moderate: {
    label: "Moderate",
    color: "oklch(0.68 0.20 250)",
    bg: "oklch(0.68 0.20 250 / 0.12)",
    border: "oklch(0.68 0.20 250 / 0.35)",
    text: "oklch(0.82 0.15 250)",
    glow: "oklch(0.68 0.20 250 / 0.3)",
    icon: Info,
  },
  Consider: {
    label: "Consider",
    color: "oklch(0.72 0.18 55)",
    bg: "oklch(0.72 0.18 55 / 0.12)",
    border: "oklch(0.72 0.18 55 / 0.35)",
    text: "oklch(0.85 0.14 60)",
    glow: "oklch(0.72 0.18 55 / 0.3)",
    icon: Info,
  },
} as const;

const PARAM_ICONS = {
  Frequency: Clock,
  Dosage: Zap,
  Intensity: FlameKindling,
  Duration: Clock,
} as const;

interface SuggestionCardProps {
  suggestion: TherapySuggestion;
  index: number;
  onPrescribe: (therapyId: string) => void;
}

function SuggestionCard({
  suggestion,
  index,
  onPrescribe,
}: SuggestionCardProps) {
  const confidence = CONFIDENCE_CONFIG[suggestion.confidenceLevel];
  const ConfidenceIcon = confidence.icon;
  const catConfig =
    CATEGORY_CONFIG[suggestion.category as keyof typeof CATEGORY_CONFIG];

  const params = [
    { label: "Frequency", value: suggestion.suggestedFrequency },
    { label: "Dosage", value: suggestion.suggestedDosage },
    { label: "Intensity", value: suggestion.suggestedIntensity },
    { label: "Duration", value: suggestion.suggestedDuration },
  ] as const;

  return (
    <motion.div
      data-ocid={`ai.suggest.item.${index + 1}`}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.35, ease: "easeOut" }}
      className="card-3d group rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden"
      style={{
        borderLeft: `2px solid ${confidence.color}`,
        boxShadow: `0 0 0 1px oklch(0.9 0.02 220 / 0.04) inset, 0 8px 24px oklch(0.05 0.05 240 / 0.4), 0 0 0 0 ${confidence.glow}`,
        transition: "box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 0 0 1px oklch(0.9 0.02 220 / 0.04) inset, 0 16px 40px oklch(0.05 0.05 240 / 0.6), 0 0 28px ${confidence.glow}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 0 0 1px oklch(0.9 0.02 220 / 0.04) inset, 0 8px 24px oklch(0.05 0.05 240 / 0.4), 0 0 0 0 ${confidence.glow}`;
      }}
    >
      {/* Subtle corner glow */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl opacity-20"
        style={{ background: confidence.color }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {/* Confidence badge */}
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
              style={{
                background: confidence.bg,
                border: `1px solid ${confidence.border}`,
                color: confidence.text,
              }}
            >
              <ConfidenceIcon className="h-3 w-3" />
              {confidence.label}
            </span>
            {/* Category badge */}
            {catConfig && (
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{
                  background: catConfig.bg,
                  border: `1px solid ${catConfig.border}`,
                  color: catConfig.text,
                }}
              >
                {suggestion.category}
              </span>
            )}
          </div>
          <h3 className="font-display text-sm font-bold leading-tight text-foreground">
            {suggestion.therapyName}
          </h3>
        </div>
      </div>

      {/* Rationale */}
      <p className="text-xs italic leading-relaxed text-muted-foreground relative z-10">
        {suggestion.rationale}
      </p>

      {/* Parameters grid */}
      <div className="grid grid-cols-2 gap-2 relative z-10">
        {params.map(({ label, value }) => {
          const ParamIcon = PARAM_ICONS[label as keyof typeof PARAM_ICONS];
          return (
            <div
              key={label}
              className="rounded-xl p-2.5"
              style={{
                background: confidence.bg,
                border: `1px solid ${confidence.border}`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <ParamIcon
                  className="h-3 w-3 shrink-0"
                  style={{ color: confidence.text }}
                />
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: confidence.text }}
                >
                  {label}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-foreground/80 line-clamp-3">
                {value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Safety note */}
      {suggestion.safetyNote && (
        <div className="rounded-xl border border-[oklch(0.72_0.18_55/0.35)] bg-[oklch(0.72_0.18_55/0.08)] p-3 relative z-10">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[oklch(0.85_0.14_60)]" />
            <p className="text-xs leading-relaxed text-[oklch(0.85_0.14_60)]">
              {suggestion.safetyNote}
            </p>
          </div>
        </div>
      )}

      {/* Prescribe button */}
      <Button
        data-ocid={`ai.suggest.prescribe_button.${index + 1}`}
        size="sm"
        onClick={() => onPrescribe(suggestion.therapyId)}
        className="w-full rounded-xl text-sm font-semibold gap-2 transition-all relative z-10"
        style={{
          background: confidence.bg,
          color: confidence.text,
          border: `1px solid ${confidence.border}`,
          boxShadow: `0 0 0 0 ${confidence.glow}`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            `0 0 20px ${confidence.glow}`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            `0 0 0 0 ${confidence.glow}`;
        }}
      >
        <Sparkles className="h-3.5 w-3.5" />
        Prescribe This Therapy
      </Button>
    </motion.div>
  );
}

function SuggestionSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.08 }}
      className="card-3d rounded-2xl p-5 flex flex-col gap-4"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-24 rounded-full bg-[oklch(0.25_0.03_240/0.5)]" />
        <Skeleton className="h-6 w-28 rounded-full bg-[oklch(0.25_0.03_240/0.5)]" />
      </div>
      <Skeleton className="h-4 w-full rounded-lg bg-[oklch(0.22_0.03_240/0.5)]" />
      <Skeleton className="h-4 w-3/4 rounded-lg bg-[oklch(0.22_0.03_240/0.5)]" />
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="h-16 rounded-xl bg-[oklch(0.22_0.03_240/0.5)]"
          />
        ))}
      </div>
      <Skeleton className="h-9 w-full rounded-xl bg-[oklch(0.22_0.03_240/0.5)]" />
    </motion.div>
  );
}

export default function AISuggestionPanel({
  context,
  onPrescribe,
}: AISuggestionPanelProps) {
  const [suggestions, setSuggestions] = useState<TherapySuggestion[] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const handleGetSuggestions = () => {
    setLoading(true);
    setHasRun(true);
    // Simulate brief AI "thinking" delay for UX feel
    setTimeout(() => {
      const results = suggestTherapies(context);
      setSuggestions(results);
      setLoading(false);
    }, 1200);
  };

  return (
    <div
      data-ocid="ai.suggest.panel"
      className="rounded-3xl border border-[oklch(0.72_0.17_195/0.2)] bg-[oklch(0.16_0.04_240/0.6)] backdrop-blur-md p-6 space-y-6 relative overflow-hidden"
      style={{
        boxShadow:
          "0 0 0 1px oklch(0.9 0.02 220 / 0.04) inset, 0 12px 40px oklch(0.05 0.05 240 / 0.5), 0 0 60px oklch(0.72 0.17 195 / 0.06)",
      }}
    >
      {/* Ambient glow orb */}
      <div
        className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-15"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.17 195 / 0.8) 0%, transparent 70%)",
        }}
      />

      {/* Panel header */}
      <div className="flex items-center justify-between gap-4 flex-wrap relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl icon-glow-teal"
            style={{
              background: "oklch(0.72 0.17 195 / 0.12)",
              border: "1px solid oklch(0.72 0.17 195 / 0.3)",
              boxShadow: "0 0 20px oklch(0.72 0.17 195 / 0.25)",
            }}
          >
            <Brain className="h-5 w-5 text-[oklch(0.85_0.12_195)]" />
          </div>
          <div>
            <h3
              className="font-display text-lg font-bold bg-clip-text text-transparent leading-tight"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.92 0.08 195) 0%, oklch(0.72 0.17 195) 40%, oklch(0.68 0.20 250) 100%)",
              }}
            >
              AI Therapy Recommendations
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Evidence-based suggestions tailored to this patient's profile
            </p>
          </div>
        </div>

        {/* Trigger button — always visible so clinician can re-run */}
        <Button
          data-ocid="ai.suggest.button"
          onClick={handleGetSuggestions}
          disabled={loading}
          className="btn-glow gap-2 rounded-xl bg-[oklch(0.72_0.17_195)] text-sm font-semibold text-[oklch(0.10_0.03_240)] hover:bg-[oklch(0.78_0.18_195)] shrink-0"
        >
          {loading ? (
            <>
              <Brain className="h-4 w-4 animate-pulse" />
              Analysing…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {hasRun ? "Re-analyse" : "Get AI Therapy Suggestions"}
            </>
          )}
        </Button>
      </div>

      {/* Context summary chips — shown after first run */}
      {hasRun && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 relative z-10"
        >
          {context.chiefComplaint && (
            <Badge className="rounded-full px-3 py-1 text-xs bg-[oklch(0.20_0.03_240/0.6)] border border-[oklch(0.4_0.04_240/0.3)] text-muted-foreground">
              Complaint: {context.chiefComplaint}
            </Badge>
          )}
          <Badge className="rounded-full px-3 py-1 text-xs bg-[oklch(0.20_0.03_240/0.6)] border border-[oklch(0.4_0.04_240/0.3)] text-muted-foreground">
            Pain: {context.painScore}/10
          </Badge>
          {context.redFlags.length > 0 && (
            <Badge className="rounded-full px-3 py-1 text-xs bg-[oklch(0.72_0.18_55/0.1)] border border-[oklch(0.72_0.18_55/0.3)] text-[oklch(0.85_0.14_60)]">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {context.redFlags.length} Red Flag
              {context.redFlags.length > 1 ? "s" : ""}
            </Badge>
          )}
        </motion.div>
      )}

      {/* Results area */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="skeletons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {[0, 1, 2].map((i) => (
              <SuggestionSkeleton key={i} index={i} />
            ))}
          </motion.div>
        )}

        {!loading && suggestions !== null && suggestions.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            data-ocid="ai.suggest.empty_state"
            className="card-3d flex flex-col items-center justify-center rounded-2xl py-12 text-center"
          >
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl icon-glow-teal">
              <Brain className="h-7 w-7 text-[oklch(0.72_0.17_195)]" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              No matching therapies found
            </p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              The current patient profile does not strongly match any therapy
              indications. Please record a chief complaint and assessment data.
            </p>
          </motion.div>
        )}

        {!loading && suggestions !== null && suggestions.length > 0 && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                {suggestions.length} therapies recommended — sorted by clinical
                relevance
              </p>
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-[oklch(0.72_0.17_195/0.1)] border border-[oklch(0.72_0.17_195/0.3)] text-[oklch(0.85_0.12_195)]">
                AI
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {suggestions.map((suggestion, idx) => (
                <SuggestionCard
                  key={suggestion.therapyId}
                  suggestion={suggestion}
                  index={idx}
                  onPrescribe={onPrescribe}
                />
              ))}
            </div>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl border border-[oklch(0.4_0.04_240/0.3)] bg-[oklch(0.20_0.03_240/0.5)] p-3"
            >
              <p className="text-xs text-muted-foreground text-center italic">
                AI therapy recommendations are clinical decision-support tools
                and do not replace the judgment of a licensed physiotherapist.
                Always confirm suitability with in-person evaluation.
              </p>
            </motion.div>
          </motion.div>
        )}

        {!hasRun && !loading && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10 gap-4 text-center"
          >
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: "oklch(0.72 0.17 195 / 0.08)",
                border: "1px solid oklch(0.72 0.17 195 / 0.2)",
                boxShadow: "0 0 30px oklch(0.72 0.17 195 / 0.15)",
              }}
            >
              <Sparkles className="h-8 w-8 text-[oklch(0.72_0.17_195)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                AI Therapy Engine Ready
              </p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                Click "Get AI Therapy Suggestions" to analyse this patient's
                profile and receive evidence-based therapy recommendations with
                personalised dosage and frequency.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
