import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Brain,
  ChevronDown,
  ChevronUp,
  Clock,
  Dumbbell,
  FlameKindling,
  Hand,
  Loader2,
  Search,
  Shield,
  Sparkles,
  Star,
  Thermometer,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Assessment, PatientProfile } from "../backend";
import {
  CATEGORY_CONFIG,
  type TherapyModality,
  therapyModalities,
} from "../data/therapyModalities";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddTreatmentPlan } from "../hooks/useQueries";
import type { TherapySuggestionContext } from "../utils/therapySuggestionEngine";
import AISuggestionPanel from "./AISuggestionPanel";

interface TherapyModalitiesTabProps {
  patientId: string;
  assessments?: Assessment[];
  patient?: PatientProfile | null;
}

type CategoryFilter =
  | "All"
  | "Electrotherapy"
  | "Exercise Therapy"
  | "Manual Therapy"
  | "Thermotherapy / Cryotherapy"
  | "Other Modalities";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Electrotherapy: Zap,
  "Exercise Therapy": Dumbbell,
  "Manual Therapy": Hand,
  "Thermotherapy / Cryotherapy": Thermometer,
  "Other Modalities": Star,
};

interface PrescribeDialogProps {
  modality: TherapyModality | null;
  patientId: string;
  onClose: () => void;
}

function PrescribeDialog({
  modality,
  patientId,
  onClose,
}: PrescribeDialogProps) {
  const { identity } = useInternetIdentity();
  const addTreatmentPlan = useAddTreatmentPlan();

  const [customDosage, setCustomDosage] = useState(modality?.dosage ?? "");
  const [customFrequency, setCustomFrequency] = useState(
    modality?.frequency ?? "",
  );
  const [customIntensity, setCustomIntensity] = useState(
    modality?.intensity ?? "",
  );
  const [customDuration, setCustomDuration] = useState(
    modality?.duration ?? "",
  );
  const [clinicianNotes, setClinicianNotes] = useState("");

  if (!modality) return null;

  const config =
    CATEGORY_CONFIG[modality.category as keyof typeof CATEGORY_CONFIG];

  const handleConfirm = () => {
    if (!identity || !modality) return;

    const interventions = [
      `Method: ${modality.method.split(".")[0].trim()}`,
      `Dosage: ${customDosage}`,
      `Frequency: ${customFrequency}`,
      `Intensity: ${customIntensity}`,
      `Duration: ${customDuration}`,
    ];
    if (clinicianNotes.trim()) {
      interventions.push(`Clinician Notes: ${clinicianNotes}`);
    }

    const recommendations = [
      ...modality.contraindications.map((c) => `Contraindication: ${c}`),
      ...modality.precautions.map((p) => `Precaution: ${p}`),
    ];

    addTreatmentPlan.mutate(
      {
        id: "",
        patientId,
        clinicianId: identity.getPrincipal(),
        dateCreated: BigInt(Date.now() * 1000000),
        diagnosis: modality.name,
        impairments: modality.method.slice(0, 200),
        goals: modality.indications.join("; "),
        functionalLimitations: "",
        interventions,
        recommendations,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={!!modality} onOpenChange={onClose}>
      <DialogContent
        data-ocid="therapy.prescribe.dialog"
        className="max-h-[90vh] overflow-y-auto rounded-3xl border-[oklch(0.72_0.17_195/0.2)] bg-[oklch(0.17_0.03_240/0.98)] backdrop-blur-xl sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold tracking-tight">
            Prescribe Therapy
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Customize and confirm the therapy prescription for this patient.
          </DialogDescription>
        </DialogHeader>

        {/* Modality name + category badge */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: config.bg,
            border: `1px solid ${config.border}`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: config.bg,
                border: `1px solid ${config.border}`,
                boxShadow: `0 0 16px ${config.glow}`,
              }}
            >
              {(() => {
                const Icon = CATEGORY_ICONS[modality.category] ?? FlameKindling;
                return (
                  <Icon className="h-5 w-5" style={{ color: config.text }} />
                );
              })()}
            </div>
            <div>
              <p
                className="font-display text-base font-bold"
                style={{ color: config.text }}
              >
                {modality.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {modality.category}
              </p>
            </div>
          </div>
        </div>

        {/* Editable fields */}
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="prescribe-dosage"
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                Dosage / Parameters
              </Label>
              <Textarea
                id="prescribe-dosage"
                data-ocid="therapy.prescribe.dosage.textarea"
                value={customDosage}
                onChange={(e) => setCustomDosage(e.target.value)}
                rows={3}
                className="input-3d resize-none text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="prescribe-frequency"
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                Frequency
              </Label>
              <Input
                id="prescribe-frequency"
                data-ocid="therapy.prescribe.frequency.input"
                value={customFrequency}
                onChange={(e) => setCustomFrequency(e.target.value)}
                className="input-3d text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="prescribe-intensity"
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                Intensity
              </Label>
              <Input
                id="prescribe-intensity"
                data-ocid="therapy.prescribe.intensity.input"
                value={customIntensity}
                onChange={(e) => setCustomIntensity(e.target.value)}
                className="input-3d text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="prescribe-duration"
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                Duration
              </Label>
              <Input
                id="prescribe-duration"
                data-ocid="therapy.prescribe.duration.input"
                value={customDuration}
                onChange={(e) => setCustomDuration(e.target.value)}
                className="input-3d text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="prescribe-notes"
              className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Clinician Notes (optional)
            </Label>
            <Textarea
              id="prescribe-notes"
              data-ocid="therapy.prescribe.notes.textarea"
              placeholder="Additional clinical notes, patient-specific modifications…"
              value={clinicianNotes}
              onChange={(e) => setClinicianNotes(e.target.value)}
              rows={2}
              className="input-3d resize-none text-sm"
            />
          </div>

          {/* Contraindications warning */}
          {modality.contraindications.length > 0 && (
            <div className="rounded-2xl border border-[oklch(0.62_0.22_25/0.3)] bg-[oklch(0.62_0.22_25/0.08)] p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.72_0.20_35)]" />
                <div>
                  <p className="text-xs font-bold text-[oklch(0.80_0.16_35)] uppercase tracking-widest mb-1">
                    Contraindications
                  </p>
                  <ul className="space-y-0.5">
                    {modality.contraindications.slice(0, 4).map((c) => (
                      <li
                        key={c}
                        className="text-xs text-[oklch(0.72_0.14_35)]"
                      >
                        • {c}
                      </li>
                    ))}
                    {modality.contraindications.length > 4 && (
                      <li className="text-xs text-muted-foreground">
                        +{modality.contraindications.length - 4} more
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            data-ocid="therapy.prescribe.cancel_button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-[oklch(0.72_0.17_195/0.2)]"
          >
            Cancel
          </Button>
          <Button
            data-ocid="therapy.prescribe.confirm_button"
            onClick={handleConfirm}
            disabled={addTreatmentPlan.isPending}
            className="btn-glow gap-2 rounded-xl bg-[oklch(0.72_0.17_195)] text-sm font-semibold text-[oklch(0.10_0.03_240)] hover:bg-[oklch(0.78_0.18_195)]"
          >
            {addTreatmentPlan.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {addTreatmentPlan.isPending ? "Saving…" : "Prescribe Therapy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface TherapyCardProps {
  modality: TherapyModality;
  index: number;
  onPrescribe: (modality: TherapyModality) => void;
}

function TherapyCard({ modality, index, onPrescribe }: TherapyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config =
    CATEGORY_CONFIG[modality.category as keyof typeof CATEGORY_CONFIG];
  const Icon = CATEGORY_ICONS[modality.category] ?? FlameKindling;
  const visibleIndications = modality.indications.slice(0, 3);
  const remainingCount = modality.indications.length - 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="card-3d group rounded-2xl p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-110"
          style={{
            background: config.bg,
            border: `1px solid ${config.border}`,
            boxShadow: `0 0 16px ${config.glow}`,
          }}
        >
          <Icon className="h-5 w-5" style={{ color: config.text }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge
              className="text-xs font-semibold rounded-full px-2.5 py-0.5 border-0"
              style={{
                background: config.bg,
                color: config.text,
                border: `1px solid ${config.border}`,
              }}
            >
              {modality.category}
            </Badge>
          </div>
          <h3 className="font-display text-sm font-bold leading-tight text-foreground">
            {modality.name}
          </h3>
        </div>
      </div>

      {/* Method preview */}
      <div>
        <p
          className={`text-xs leading-relaxed text-muted-foreground ${expanded ? "" : "line-clamp-3"}`}
        >
          {modality.method}
        </p>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-1 flex items-center gap-1 text-xs font-semibold transition-colors"
          style={{ color: config.text }}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3" /> Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" /> Read method
            </>
          )}
        </button>
      </div>

      {/* Dosage grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Dosage", value: modality.dosage, icon: Zap },
          { label: "Frequency", value: modality.frequency, icon: Clock },
          {
            label: "Intensity",
            value: modality.intensity,
            icon: FlameKindling,
          },
          { label: "Duration", value: modality.duration, icon: Clock },
        ].map(({ label, value, icon: ChipIcon }) => (
          <div
            key={label}
            className="rounded-xl p-2.5"
            style={{
              background: config.bg,
              border: `1px solid ${config.border}`,
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <ChipIcon className="h-3 w-3" style={{ color: config.text }} />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: config.text }}
              >
                {label}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-foreground/80 line-clamp-2">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Indications */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Shield className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Indications
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {visibleIndications.map((indication) => (
            <span
              key={indication}
              className="inline-flex items-center rounded-lg px-2 py-0.5 text-xs text-foreground/75 border border-[oklch(0.4_0.04_240/0.4)] bg-[oklch(0.20_0.03_240/0.6)]"
            >
              {indication}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="inline-flex items-center rounded-lg px-2 py-0.5 text-xs text-muted-foreground border border-[oklch(0.4_0.04_240/0.2)] bg-[oklch(0.20_0.03_240/0.4)]">
              +{remainingCount} more
            </span>
          )}
        </div>
      </div>

      {/* Prescribe button */}
      <Button
        data-ocid={`therapy.modality.prescribe_button.${index + 1}`}
        onClick={() => onPrescribe(modality)}
        size="sm"
        className="w-full rounded-xl text-sm font-semibold transition-all"
        style={{
          background: config.bg,
          color: config.text,
          border: `1px solid ${config.border}`,
          boxShadow: `0 0 0 0 ${config.glow}`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            `0 0 20px ${config.glow}`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            `0 0 0 0 ${config.glow}`;
        }}
      >
        <Sparkles className="mr-2 h-3.5 w-3.5" />
        Prescribe Therapy
      </Button>
    </motion.div>
  );
}

export default function TherapyModalitiesTab({
  patientId,
  assessments,
  patient,
}: TherapyModalitiesTabProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [prescribeModality, setPrescribeModality] =
    useState<TherapyModality | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(true);

  // Build AI suggestion context from available assessment data
  const aiContext: TherapySuggestionContext = {
    chiefComplaint: assessments?.[0]?.subjectiveHistory?.chiefComplaint ?? "",
    bodyPart: "",
    domain: "",
    painScore: (() => {
      const scale = assessments?.[0]?.clinicalScales?.find(
        (s) =>
          s.name.toLowerCase().includes("vas") ||
          s.name.toLowerCase().includes("nprs"),
      );
      return scale ? Number(scale.score) : 5;
    })(),
    functionalLimitations:
      assessments?.[0]?.subjectiveHistory?.functionalLimitations ?? "",
    redFlags: assessments?.[0]?.redFlags ?? [],
    clinicalScaleNames:
      assessments?.[0]?.clinicalScales?.map((s) => s.name) ?? [],
    postureDeviations: [],
    medicalHistory: patient?.medicalHistory ?? "",
  };

  const handleAIPrescribe = (therapyId: string) => {
    const modality = therapyModalities.find((m) => m.id === therapyId);
    if (modality) {
      setPrescribeModality(modality);
    }
  };

  const categories: CategoryFilter[] = [
    "All",
    "Electrotherapy",
    "Exercise Therapy",
    "Manual Therapy",
    "Thermotherapy / Cryotherapy",
    "Other Modalities",
  ];

  const filtered = therapyModalities.filter((m) => {
    const matchesCategory =
      activeCategory === "All" || m.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.indications.some((i) => i.toLowerCase().includes(q)) ||
      m.method.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* AI Recommendations toggle header */}
      <div className="flex flex-col gap-4">
        {/* Section toggle button */}
        <button
          type="button"
          data-ocid="ai.suggest.toggle"
          onClick={() => setShowAIPanel((v) => !v)}
          className="flex items-center justify-between w-full rounded-2xl px-5 py-3.5 text-left transition-all"
          style={{
            background: showAIPanel
              ? "oklch(0.72 0.17 195 / 0.08)"
              : "oklch(0.20 0.03 240 / 0.5)",
            border: showAIPanel
              ? "1px solid oklch(0.72 0.17 195 / 0.3)"
              : "1px solid oklch(0.4 0.04 240 / 0.25)",
            boxShadow: showAIPanel
              ? "0 0 20px oklch(0.72 0.17 195 / 0.1)"
              : "none",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{
                background: "oklch(0.72 0.17 195 / 0.12)",
                border: "1px solid oklch(0.72 0.17 195 / 0.3)",
              }}
            >
              <Brain className="h-4 w-4 text-[oklch(0.85_0.12_195)]" />
            </div>
            <div>
              <span
                className="font-display text-sm font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, oklch(0.92 0.08 195) 0%, oklch(0.72 0.17 195) 60%, oklch(0.68 0.20 250) 100%)",
                }}
              >
                AI Recommendations
              </span>
              <p className="text-xs text-muted-foreground mt-0.5">
                Personalised therapy suggestions based on patient profile
              </p>
            </div>
          </div>
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-transform"
            style={{
              background: "oklch(0.20 0.03 240 / 0.6)",
              border: "1px solid oklch(0.4 0.04 240 / 0.3)",
              transform: showAIPanel ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </button>

        {/* AI Panel collapsible */}
        <AnimatePresence>
          {showAIPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <AISuggestionPanel
                context={aiContext}
                onPrescribe={handleAIPrescribe}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="divider-glow" />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="font-display text-xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, oklch(0.85 0.12 195) 0%, oklch(0.72 0.17 195) 40%, oklch(0.68 0.2 250) 100%)",
            }}
          >
            Therapy Modalities
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Evidence-based therapies with dosage, method, and prescription
            details
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-ocid="therapy.search_input"
            placeholder="Search by name or indication…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-3d pl-9 text-sm rounded-xl"
          />
        </div>
      </div>

      {/* Category filter */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const config =
              cat !== "All"
                ? CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]
                : null;
            const CatIcon = cat !== "All" ? CATEGORY_ICONS[cat] : FlameKindling;

            return (
              <button
                key={cat}
                data-ocid="therapy.filter.tab"
                type="button"
                onClick={() => setActiveCategory(cat)}
                className="flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
                style={
                  isActive && config
                    ? {
                        background: config.bg,
                        color: config.text,
                        border: `1px solid ${config.border}`,
                        boxShadow: `0 0 16px ${config.glow}`,
                      }
                    : isActive && !config
                      ? {
                          background: "oklch(0.72 0.17 195 / 0.1)",
                          color: "oklch(0.85 0.12 195)",
                          border: "1px solid oklch(0.72 0.17 195 / 0.3)",
                          boxShadow: "0 0 16px oklch(0.72 0.17 195 / 0.25)",
                        }
                      : {
                          background: "oklch(0.20 0.03 240 / 0.6)",
                          color: "oklch(0.60 0.02 230)",
                          border: "1px solid oklch(0.4 0.04 240 / 0.3)",
                        }
                }
              >
                {cat !== "All" && CatIcon && (
                  <CatIcon className="h-3.5 w-3.5" />
                )}
                {cat === "All" ? "All Therapies" : cat}
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {therapyModalities.length} modalities
        {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
        {searchQuery ? ` matching "${searchQuery}"` : ""}
      </p>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-ocid="therapy.modalities.empty_state"
            className="card-3d flex flex-col items-center justify-center rounded-3xl py-16 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl icon-glow-teal">
              <Search className="h-8 w-8 text-[oklch(0.72_0.17_195)]" />
            </div>
            <p className="text-base font-semibold text-foreground">
              No modalities found
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try adjusting your search or changing the category filter.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {filtered.map((modality, idx) => (
              <TherapyCard
                key={modality.id}
                modality={modality}
                index={idx}
                onPrescribe={setPrescribeModality}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prescribe dialog */}
      <PrescribeDialog
        modality={prescribeModality}
        patientId={patientId}
        onClose={() => setPrescribeModality(null)}
      />
    </div>
  );
}
