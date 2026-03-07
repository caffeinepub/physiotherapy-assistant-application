import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Check, Loader2, Mic, MicOff, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type {
  ClinicalScale,
  PostureAssessmentReport,
  ProvisionalPhysioImpression,
} from "../backend";
import {
  type ParsedAssessmentFields,
  parseTranscriptToFields,
  useDictation,
} from "../hooks/useDictation";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddAssessment } from "../hooks/useQueries";
import ClinicalScaleForm from "./ClinicalScaleForm";
import PostureScreeningForm, {
  PostureReportDisplay,
} from "./PostureScreeningForm";

// ─── Animated recording dot ──────────────────────────────────────────────────
function RecordingDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
    </span>
  );
}

// ─── Waveform bars while recording ───────────────────────────────────────────
const waveBarStyle = (height: number, delay: number): React.CSSProperties => ({
  width: "3px",
  height: `${height * 20}px`,
  background: `oklch(0.72 0.17 195 / ${0.5 + height * 0.5})`,
  animation: `waveform-bar 0.8s ease-in-out ${delay}s infinite`,
  transformOrigin: "center",
  borderRadius: "9999px",
});

const WAVE_BARS: [number, number][] = [
  [0.7, 0],
  [1.0, 0.1],
  [0.55, 0.2],
  [0.9, 0.05],
  [0.65, 0.15],
];

function MiniWaveform() {
  return (
    <div className="flex items-center gap-0.5" style={{ height: "20px" }}>
      {WAVE_BARS.map(([h, d]) => (
        <div key={`wb-${d}`} style={waveBarStyle(h, d)} />
      ))}
    </div>
  );
}

// ─── Mic badge for auto-filled fields ────────────────────────────────────────
function VoiceBadge() {
  return (
    <span
      className="ml-1.5 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={{
        background: "oklch(0.72 0.17 195 / 0.15)",
        border: "1px solid oklch(0.72 0.17 195 / 0.4)",
        color: "oklch(0.85 0.12 195)",
      }}
    >
      <Mic className="h-2.5 w-2.5" />
      voice
    </span>
  );
}

// ─── Textarea with voice-fill highlight ─────────────────────────────────────
interface VoiceTextareaProps {
  id: string;
  placeholder: string;
  value: string;
  rows?: number;
  required?: boolean;
  isVoiceFilled: boolean;
  onChange: (val: string) => void;
}

function VoiceTextarea({
  id,
  placeholder,
  value,
  rows = 2,
  required,
  isVoiceFilled,
  onChange,
}: VoiceTextareaProps) {
  const [flash, setFlash] = useState(false);
  const prevVoiceFilled = useRef(false);

  useEffect(() => {
    if (isVoiceFilled && !prevVoiceFilled.current) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 1800);
      prevVoiceFilled.current = true;
      return () => clearTimeout(t);
    }
    if (!isVoiceFilled) {
      prevVoiceFilled.current = false;
    }
  }, [isVoiceFilled]);

  return (
    <Textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      rows={rows}
      style={{
        transition: "box-shadow 0.4s ease, border-color 0.4s ease",
        boxShadow: flash
          ? "0 0 0 2px oklch(0.72 0.17 195 / 0.5), 0 0 16px oklch(0.72 0.17 195 / 0.25)"
          : isVoiceFilled
            ? "0 0 0 1px oklch(0.72 0.17 195 / 0.3)"
            : undefined,
        borderColor: flash
          ? "oklch(0.72 0.17 195 / 0.8)"
          : isVoiceFilled
            ? "oklch(0.72 0.17 195 / 0.4)"
            : undefined,
      }}
    />
  );
}

// ─── Dictation Panel ─────────────────────────────────────────────────────────
interface DictationPanelProps {
  onFieldsFilled: (fields: ParsedAssessmentFields, transcript: string) => void;
}

function DictationPanel({ onFieldsFilled }: DictationPanelProps) {
  const {
    isRecording,
    isSupported,
    interimTranscript,
    finalTranscript,
    error,
    startDictation,
    stopDictation,
    resetDictation,
  } = useDictation();

  const [showSuccess, setShowSuccess] = useState(false);
  const [hasFilled, setHasFilled] = useState(false);
  const prevFinalRef = useRef("");

  // When recording stops and we have a new transcript, parse and fill fields
  const handleStop = useCallback(() => {
    stopDictation();
  }, [stopDictation]);

  // Watch transcript changes after stop
  useEffect(() => {
    if (
      !isRecording &&
      finalTranscript &&
      finalTranscript !== prevFinalRef.current
    ) {
      prevFinalRef.current = finalTranscript;
      const fields = parseTranscriptToFields(finalTranscript);
      const hasAnyField = Object.keys(fields).length > 0;
      if (hasAnyField) {
        onFieldsFilled(fields, finalTranscript);
        setHasFilled(true);
        setShowSuccess(true);
        const t = setTimeout(() => setShowSuccess(false), 4000);
        return () => clearTimeout(t);
      }
    }
  }, [isRecording, finalTranscript, onFieldsFilled]);

  const handleReset = () => {
    resetDictation();
    setHasFilled(false);
    setShowSuccess(false);
    prevFinalRef.current = "";
  };

  const displayTranscript =
    finalTranscript + (interimTranscript ? ` ${interimTranscript}` : "");

  if (!isSupported) {
    return (
      <div
        className="flex items-center gap-3 rounded-2xl p-4"
        style={{
          background: "oklch(0.18 0.03 240 / 0.6)",
          border: "1px solid oklch(0.4 0.05 240 / 0.3)",
        }}
      >
        <MicOff className="h-5 w-5 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Voice dictation requires Google Chrome or Microsoft Edge.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      data-ocid="assessment.dictation.panel"
      style={{
        background: isRecording
          ? "oklch(0.18 0.04 190 / 0.7)"
          : "oklch(0.17 0.03 240 / 0.6)",
        border: isRecording
          ? "1px solid oklch(0.72 0.17 195 / 0.5)"
          : "1px solid oklch(0.72 0.17 195 / 0.2)",
        boxShadow: isRecording
          ? "0 0 32px oklch(0.72 0.17 195 / 0.15), 0 4px 20px oklch(0.05 0.05 240 / 0.4)"
          : "0 2px 12px oklch(0.05 0.05 240 / 0.3)",
        transition: "all 0.4s ease",
      }}
    >
      {/* Top row: label + button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Mic button */}
          <button
            type="button"
            data-ocid={
              isRecording
                ? "assessment.dictation.stop.button"
                : "assessment.dictation.start.button"
            }
            onClick={isRecording ? handleStop : startDictation}
            aria-label={isRecording ? "Stop dictation" : "Start dictation"}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.72_0.17_195)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{
              background: isRecording
                ? "radial-gradient(circle at 35% 35%, oklch(0.85 0.2 195 / 0.5) 0%, oklch(0.65 0.17 195 / 0.4) 60%, oklch(0.45 0.12 200 / 0.5) 100%)"
                : "radial-gradient(circle at 35% 35%, oklch(0.80 0.15 200 / 0.25) 0%, oklch(0.60 0.13 195 / 0.2) 60%, oklch(0.35 0.08 205 / 0.3) 100%)",
              border: isRecording
                ? "1.5px solid oklch(0.72 0.17 195 / 0.8)"
                : "1.5px solid oklch(0.72 0.17 195 / 0.4)",
              boxShadow: isRecording
                ? "0 0 18px oklch(0.72 0.17 195 / 0.5), 0 0 36px oklch(0.72 0.17 195 / 0.2), inset 0 1px 0 oklch(0.9 0.1 200 / 0.25)"
                : "0 0 10px oklch(0.72 0.17 195 / 0.15), inset 0 1px 0 oklch(0.9 0.05 210 / 0.15)",
              transition: "all 0.3s ease",
            }}
          >
            {isRecording ? (
              <Square className="h-3.5 w-3.5 fill-[oklch(0.72_0.17_195)] text-[oklch(0.72_0.17_195)]" />
            ) : (
              <Mic className="h-4 w-4 text-[oklch(0.72_0.17_195)]" />
            )}

            {/* Ping ring when recording */}
            {isRecording && (
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  animation: "mic-ring 1.6s ease-out infinite",
                  border: "1.5px solid oklch(0.72 0.17 195 / 0.5)",
                }}
              />
            )}
          </button>

          {/* Label + status */}
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-sm font-semibold"
                style={{
                  color: isRecording
                    ? "oklch(0.85 0.12 195)"
                    : "oklch(0.72 0.17 195)",
                }}
              >
                {isRecording ? "Dictating…" : "Dictate Assessment"}
              </span>
              {isRecording && <RecordingDot />}
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              {isRecording
                ? "Speak your findings — fields will auto-fill when stopped"
                : "Press mic to start — voice auto-fills all assessment fields"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Waveform when recording */}
          {isRecording && <MiniWaveform />}

          {/* Reset button after fill */}
          {hasFilled && !isRecording && (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-[oklch(0.72_0.17_195/0.1)]"
              style={{ color: "oklch(0.65 0.08 220)" }}
            >
              Re-dictate
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          data-ocid="assessment.dictation.error_state"
          className="flex items-start gap-2 rounded-xl p-3"
          style={{
            background: "oklch(0.62 0.22 25 / 0.08)",
            border: "1px solid oklch(0.62 0.22 25 / 0.35)",
          }}
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[oklch(0.72_0.22_25)]" />
          <p className="text-xs text-[oklch(0.82_0.10_25)]">{error}</p>
        </div>
      )}

      {/* Live transcript preview */}
      {(isRecording || displayTranscript) && (
        <div
          className="rounded-xl p-3"
          style={{
            background: "oklch(0.13 0.03 240 / 0.8)",
            border: "1px solid oklch(0.4 0.05 240 / 0.25)",
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
            style={{ color: "oklch(0.55 0.08 220)" }}
          >
            {isRecording ? "Live Transcript" : "Transcript"}
          </p>
          <p
            className="font-mono text-xs leading-relaxed"
            style={{ color: "oklch(0.80 0.02 220)" }}
          >
            {finalTranscript || ""}
            {interimTranscript && (
              <span
                style={{ color: "oklch(0.55 0.05 200)", fontStyle: "italic" }}
              >
                {" "}
                {interimTranscript}
              </span>
            )}
            {isRecording && !displayTranscript && (
              <span
                style={{ color: "oklch(0.50 0.05 200)", fontStyle: "italic" }}
              >
                Listening…
              </span>
            )}
          </p>
        </div>
      )}

      {/* Success banner */}
      {showSuccess && (
        <div
          data-ocid="assessment.dictation.success_state"
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{
            background: "oklch(0.68 0.18 155 / 0.1)",
            border: "1px solid oklch(0.68 0.18 155 / 0.4)",
          }}
        >
          <Check className="h-3.5 w-3.5 shrink-0 text-[oklch(0.72_0.18_155)]" />
          <p className="text-xs font-medium text-[oklch(0.78_0.12_155)]">
            Fields filled from voice — review and edit as needed
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main dialog ─────────────────────────────────────────────────────────────
interface AddAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
}

export default function AddAssessmentDialog({
  open,
  onOpenChange,
  patientId,
}: AddAssessmentDialogProps) {
  const { identity } = useInternetIdentity();
  const addAssessment = useAddAssessment();

  const [subjective, setSubjective] = useState({
    chiefComplaint: "",
    onsetHistory: "",
    aggravatingFactors: "",
    relievingFactors: "",
    functionalLimitations: "",
  });

  const [objective, setObjective] = useState({
    rangeOfMotion: "",
    muscleTesting: "",
    neurologicalScreening: "",
    cardiopulmonaryScreening: "",
    gaitAssessment: "",
    balanceAssessment: "",
  });

  const [clinicalScales, setClinicalScales] = useState<ClinicalScale[]>([]);
  const [redFlags, setRedFlags] = useState("");
  const [postureReport, setPostureReport] =
    useState<PostureAssessmentReport | null>(null);
  const [provisionalImpression, setProvisionalImpression] =
    useState<ProvisionalPhysioImpression | null>(null);

  // Track which fields were auto-filled via voice
  const [voiceFilledFields, setVoiceFilledFields] = useState<Set<string>>(
    new Set(),
  );

  const handlePostureReportGenerated = (
    report: PostureAssessmentReport,
    impression?: ProvisionalPhysioImpression,
  ) => {
    setPostureReport(report);
    if (impression) {
      setProvisionalImpression(impression);
    }
  };

  // Called by DictationPanel when transcript is parsed
  const handleFieldsFilled = useCallback((fields: ParsedAssessmentFields) => {
    const filled = new Set<string>();

    setSubjective((prev) => {
      const next = { ...prev };
      if (fields.chiefComplaint) {
        next.chiefComplaint = prev.chiefComplaint
          ? `${prev.chiefComplaint}\n${fields.chiefComplaint}`
          : fields.chiefComplaint;
        filled.add("chiefComplaint");
      }
      if (fields.onsetHistory) {
        next.onsetHistory = prev.onsetHistory
          ? `${prev.onsetHistory}\n${fields.onsetHistory}`
          : fields.onsetHistory;
        filled.add("onsetHistory");
      }
      if (fields.aggravatingFactors) {
        next.aggravatingFactors = prev.aggravatingFactors
          ? `${prev.aggravatingFactors}\n${fields.aggravatingFactors}`
          : fields.aggravatingFactors;
        filled.add("aggravatingFactors");
      }
      if (fields.relievingFactors) {
        next.relievingFactors = prev.relievingFactors
          ? `${prev.relievingFactors}\n${fields.relievingFactors}`
          : fields.relievingFactors;
        filled.add("relievingFactors");
      }
      if (fields.functionalLimitations) {
        next.functionalLimitations = prev.functionalLimitations
          ? `${prev.functionalLimitations}\n${fields.functionalLimitations}`
          : fields.functionalLimitations;
        filled.add("functionalLimitations");
      }
      return next;
    });

    setObjective((prev) => {
      const next = { ...prev };
      if (fields.rangeOfMotion) {
        next.rangeOfMotion = prev.rangeOfMotion
          ? `${prev.rangeOfMotion}\n${fields.rangeOfMotion}`
          : fields.rangeOfMotion;
        filled.add("rangeOfMotion");
      }
      if (fields.muscleTesting) {
        next.muscleTesting = prev.muscleTesting
          ? `${prev.muscleTesting}\n${fields.muscleTesting}`
          : fields.muscleTesting;
        filled.add("muscleTesting");
      }
      if (fields.neurologicalScreening) {
        next.neurologicalScreening = prev.neurologicalScreening
          ? `${prev.neurologicalScreening}\n${fields.neurologicalScreening}`
          : fields.neurologicalScreening;
        filled.add("neurologicalScreening");
      }
      if (fields.cardiopulmonaryScreening) {
        next.cardiopulmonaryScreening = prev.cardiopulmonaryScreening
          ? `${prev.cardiopulmonaryScreening}\n${fields.cardiopulmonaryScreening}`
          : fields.cardiopulmonaryScreening;
        filled.add("cardiopulmonaryScreening");
      }
      if (fields.gaitAssessment) {
        next.gaitAssessment = prev.gaitAssessment
          ? `${prev.gaitAssessment}\n${fields.gaitAssessment}`
          : fields.gaitAssessment;
        filled.add("gaitAssessment");
      }
      if (fields.balanceAssessment) {
        next.balanceAssessment = prev.balanceAssessment
          ? `${prev.balanceAssessment}\n${fields.balanceAssessment}`
          : fields.balanceAssessment;
        filled.add("balanceAssessment");
      }
      return next;
    });

    if (fields.redFlags) {
      setRedFlags((prev) =>
        prev ? `${prev}\n${fields.redFlags}` : fields.redFlags!,
      );
      filled.add("redFlags");
    }

    setVoiceFilledFields(filled);
    // Clear highlighting after 6 seconds
    setTimeout(() => setVoiceFilledFields(new Set()), 6000);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Please log in to save an assessment.");
      return;
    }

    const redFlagsArray = redFlags
      .split("\n")
      .map((flag) => flag.trim())
      .filter((flag) => flag.length > 0);

    addAssessment.mutate(
      {
        id: "",
        patientId,
        clinicianId: identity.getPrincipal(),
        dateCreated: BigInt(Date.now() * 1000000),
        subjectiveHistory: subjective,
        objectiveTest: objective,
        clinicalScales,
        redFlags: redFlagsArray,
      },
      {
        onSuccess: () => {
          setSubjective({
            chiefComplaint: "",
            onsetHistory: "",
            aggravatingFactors: "",
            relievingFactors: "",
            functionalLimitations: "",
          });
          setObjective({
            rangeOfMotion: "",
            muscleTesting: "",
            neurologicalScreening: "",
            cardiopulmonaryScreening: "",
            gaitAssessment: "",
            balanceAssessment: "",
          });
          setClinicalScales([]);
          setRedFlags("");
          setPostureReport(null);
          setProvisionalImpression(null);
          setVoiceFilledFields(new Set());
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="assessment.dialog"
        className="max-h-[90vh] overflow-y-auto rounded-3xl border-[oklch(0.72_0.17_195/0.2)] bg-[oklch(0.17_0.03_240/0.98)] backdrop-blur-xl sm:max-w-3xl"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold tracking-tight">
            New Assessment
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complete a comprehensive patient assessment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── Dictation Panel ─ placed above tabs ─────────────────────── */}
          <DictationPanel onFieldsFilled={handleFieldsFilled} />

          <Tabs defaultValue="subjective" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger
                data-ocid="assessment.subjective.tab"
                value="subjective"
              >
                Subjective
              </TabsTrigger>
              <TabsTrigger
                data-ocid="assessment.objective.tab"
                value="objective"
              >
                Objective
              </TabsTrigger>
              <TabsTrigger data-ocid="assessment.posture.tab" value="posture">
                Posture
              </TabsTrigger>
              <TabsTrigger data-ocid="assessment.scales.tab" value="scales">
                Scales
              </TabsTrigger>
              <TabsTrigger data-ocid="assessment.flags.tab" value="flags">
                Red Flags
              </TabsTrigger>
            </TabsList>

            {/* ── Subjective ─────────────────────────────────────────── */}
            <TabsContent value="subjective" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">
                  Chief Complaint *
                  {voiceFilledFields.has("chiefComplaint") && <VoiceBadge />}
                </Label>
                <VoiceTextarea
                  id="chiefComplaint"
                  placeholder="Primary reason for visit"
                  value={subjective.chiefComplaint}
                  isVoiceFilled={voiceFilledFields.has("chiefComplaint")}
                  onChange={(val) =>
                    setSubjective((prev) => ({ ...prev, chiefComplaint: val }))
                  }
                  required
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="onsetHistory">
                  Onset History
                  {voiceFilledFields.has("onsetHistory") && <VoiceBadge />}
                </Label>
                <VoiceTextarea
                  id="onsetHistory"
                  placeholder="When and how symptoms began"
                  value={subjective.onsetHistory}
                  isVoiceFilled={voiceFilledFields.has("onsetHistory")}
                  onChange={(val) =>
                    setSubjective((prev) => ({ ...prev, onsetHistory: val }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aggravatingFactors">
                  Aggravating Factors
                  {voiceFilledFields.has("aggravatingFactors") && (
                    <VoiceBadge />
                  )}
                </Label>
                <VoiceTextarea
                  id="aggravatingFactors"
                  placeholder="Activities or positions that worsen symptoms"
                  value={subjective.aggravatingFactors}
                  isVoiceFilled={voiceFilledFields.has("aggravatingFactors")}
                  onChange={(val) =>
                    setSubjective((prev) => ({
                      ...prev,
                      aggravatingFactors: val,
                    }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relievingFactors">
                  Relieving Factors
                  {voiceFilledFields.has("relievingFactors") && <VoiceBadge />}
                </Label>
                <VoiceTextarea
                  id="relievingFactors"
                  placeholder="Activities or positions that improve symptoms"
                  value={subjective.relievingFactors}
                  isVoiceFilled={voiceFilledFields.has("relievingFactors")}
                  onChange={(val) =>
                    setSubjective((prev) => ({
                      ...prev,
                      relievingFactors: val,
                    }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="functionalLimitations">
                  Functional Limitations
                  {voiceFilledFields.has("functionalLimitations") && (
                    <VoiceBadge />
                  )}
                </Label>
                <VoiceTextarea
                  id="functionalLimitations"
                  placeholder="Impact on daily activities and function"
                  value={subjective.functionalLimitations}
                  isVoiceFilled={voiceFilledFields.has("functionalLimitations")}
                  onChange={(val) =>
                    setSubjective((prev) => ({
                      ...prev,
                      functionalLimitations: val,
                    }))
                  }
                  rows={2}
                />
              </div>
            </TabsContent>

            {/* ── Objective ──────────────────────────────────────────── */}
            <TabsContent value="objective" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rangeOfMotion">
                  Range of Motion
                  {voiceFilledFields.has("rangeOfMotion") && <VoiceBadge />}
                </Label>
                <VoiceTextarea
                  id="rangeOfMotion"
                  placeholder="Joint-specific ROM measurements"
                  value={objective.rangeOfMotion}
                  isVoiceFilled={voiceFilledFields.has("rangeOfMotion")}
                  onChange={(val) =>
                    setObjective((prev) => ({ ...prev, rangeOfMotion: val }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="muscleTesting">
                  Manual Muscle Testing
                  {voiceFilledFields.has("muscleTesting") && <VoiceBadge />}
                </Label>
                <VoiceTextarea
                  id="muscleTesting"
                  placeholder="Muscle strength grades (0-5)"
                  value={objective.muscleTesting}
                  isVoiceFilled={voiceFilledFields.has("muscleTesting")}
                  onChange={(val) =>
                    setObjective((prev) => ({ ...prev, muscleTesting: val }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neurologicalScreening">
                  Neurological Screening
                  {voiceFilledFields.has("neurologicalScreening") && (
                    <VoiceBadge />
                  )}
                </Label>
                <VoiceTextarea
                  id="neurologicalScreening"
                  placeholder="Reflexes, sensation, coordination"
                  value={objective.neurologicalScreening}
                  isVoiceFilled={voiceFilledFields.has("neurologicalScreening")}
                  onChange={(val) =>
                    setObjective((prev) => ({
                      ...prev,
                      neurologicalScreening: val,
                    }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardiopulmonaryScreening">
                  Cardiopulmonary Screening
                  {voiceFilledFields.has("cardiopulmonaryScreening") && (
                    <VoiceBadge />
                  )}
                </Label>
                <VoiceTextarea
                  id="cardiopulmonaryScreening"
                  placeholder="Heart rate, blood pressure, respiratory rate"
                  value={objective.cardiopulmonaryScreening}
                  isVoiceFilled={voiceFilledFields.has(
                    "cardiopulmonaryScreening",
                  )}
                  onChange={(val) =>
                    setObjective((prev) => ({
                      ...prev,
                      cardiopulmonaryScreening: val,
                    }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gaitAssessment">
                  Gait Assessment
                  {voiceFilledFields.has("gaitAssessment") && <VoiceBadge />}
                </Label>
                <VoiceTextarea
                  id="gaitAssessment"
                  placeholder="Gait pattern observations"
                  value={objective.gaitAssessment}
                  isVoiceFilled={voiceFilledFields.has("gaitAssessment")}
                  onChange={(val) =>
                    setObjective((prev) => ({ ...prev, gaitAssessment: val }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balanceAssessment">
                  Balance Assessment
                  {voiceFilledFields.has("balanceAssessment") && <VoiceBadge />}
                </Label>
                <VoiceTextarea
                  id="balanceAssessment"
                  placeholder="Static and dynamic balance findings"
                  value={objective.balanceAssessment}
                  isVoiceFilled={voiceFilledFields.has("balanceAssessment")}
                  onChange={(val) =>
                    setObjective((prev) => ({
                      ...prev,
                      balanceAssessment: val,
                    }))
                  }
                  rows={2}
                />
              </div>
            </TabsContent>

            {/* ── Posture ────────────────────────────────────────────── */}
            <TabsContent value="posture" className="space-y-4">
              {!postureReport ? (
                <PostureScreeningForm
                  patientId={patientId}
                  functionalLimitations={subjective.functionalLimitations}
                  onReportGenerated={handlePostureReportGenerated}
                />
              ) : (
                <div className="space-y-4">
                  <PostureReportDisplay
                    report={postureReport}
                    impression={provisionalImpression || undefined}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPostureReport(null);
                      setProvisionalImpression(null);
                    }}
                    className="w-full"
                  >
                    Generate New Assessment
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* ── Scales ────────────────────────────────────────────── */}
            <TabsContent value="scales" className="space-y-4">
              <ClinicalScaleForm
                clinicalScales={clinicalScales}
                onScalesChange={setClinicalScales}
              />
            </TabsContent>

            {/* ── Red Flags ─────────────────────────────────────────── */}
            <TabsContent value="flags" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="redFlags">
                  Red Flags
                  {voiceFilledFields.has("redFlags") && <VoiceBadge />}
                </Label>
                <VoiceTextarea
                  id="redFlags"
                  placeholder="Enter each red flag on a new line"
                  value={redFlags}
                  isVoiceFilled={voiceFilledFields.has("redFlags")}
                  onChange={(val) => setRedFlags(val)}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Document any concerning findings that may require immediate
                  attention or referral
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button
              data-ocid="assessment.cancel.button"
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="assessment.submit.button"
              type="submit"
              disabled={addAssessment.isPending}
            >
              {addAssessment.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Assessment
            </Button>
          </div>
        </form>

        {/* Keyframes for mic ring animation */}
        <style>{`
          @keyframes mic-ring {
            0%   { transform: scale(1);   opacity: 0.6; }
            100% { transform: scale(2.2); opacity: 0;   }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
