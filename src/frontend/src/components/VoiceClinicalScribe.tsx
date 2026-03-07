import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Check,
  ClipboardCopy,
  Mic,
  MicOff,
  RefreshCw,
  Square,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Type augmentation for Web Speech API ────────────────────────────────────
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  return (
    ((window as unknown as Record<string, unknown>).SpeechRecognition as
      | (new () => SpeechRecognitionInstance)
      | undefined) ||
    ((window as unknown as Record<string, unknown>).webkitSpeechRecognition as
      | (new () => SpeechRecognitionInstance)
      | undefined) ||
    null
  );
}

// ─── SOAP Formatter ──────────────────────────────────────────────────────────
interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

function formatAsSoap(transcript: string): SoapNote {
  const lines = transcript
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const subjectiveKeywords = [
    "pain",
    "ache",
    "hurt",
    "discomfort",
    "complaint",
    "feel",
    "feels",
    "patient",
    "reports",
    "onset",
    "duration",
    "history",
    "symptom",
    "week",
    "month",
    "day",
    "ago",
    "started",
    "began",
    "worse",
    "better",
    "morning",
    "night",
    "walking",
    "sitting",
    "standing",
    "score",
    "VAS",
    "NRS",
    "functional",
    "limitation",
    "difficulty",
  ];

  const objectiveKeywords = [
    "ROM",
    "range",
    "motion",
    "strength",
    "MMT",
    "grade",
    "swelling",
    "oedema",
    "edema",
    "palpation",
    "tender",
    "reflex",
    "sensation",
    "balance",
    "gait",
    "posture",
    "measured",
    "observed",
    "test",
    "result",
    "degrees",
    "muscle",
    "tone",
    "spasm",
    "tightness",
    "assessment",
    "examination",
    "BP",
    "HR",
    "heart rate",
    "blood pressure",
    "oxygen",
  ];

  const assessmentKeywords = [
    "suggestive",
    "consistent",
    "likely",
    "impression",
    "diagnosis",
    "condition",
    "impairment",
    "dysfunction",
    "deficit",
    "findings",
    "indicate",
    "suggests",
    "conclude",
    "possible",
    "probable",
    "presentation",
    "pathology",
    "problem",
    "issue",
  ];

  const planKeywords = [
    "plan",
    "treatment",
    "therapy",
    "exercise",
    "ultrasound",
    "TENS",
    "electrotherapy",
    "massage",
    "mobilisation",
    "mobilization",
    "stretching",
    "strengthening",
    "session",
    "frequency",
    "times",
    "weeks",
    "prescribe",
    "recommend",
    "follow",
    "continue",
    "next",
    "refer",
    "review",
    "ice",
    "heat",
    "rest",
    "activity",
    "HEP",
    "home",
    "program",
  ];

  const subjective: string[] = [];
  const objective: string[] = [];
  const assessment: string[] = [];
  const plan: string[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();

    const subScore = subjectiveKeywords.filter((k) =>
      lower.includes(k.toLowerCase()),
    ).length;
    const objScore = objectiveKeywords.filter((k) =>
      lower.includes(k.toLowerCase()),
    ).length;
    const assScore = assessmentKeywords.filter((k) =>
      lower.includes(k.toLowerCase()),
    ).length;
    const planScore = planKeywords.filter((k) =>
      lower.includes(k.toLowerCase()),
    ).length;

    const maxScore = Math.max(subScore, objScore, assScore, planScore);

    if (maxScore === 0 || subScore === maxScore) {
      subjective.push(line);
    } else if (objScore === maxScore) {
      objective.push(line);
    } else if (assScore === maxScore) {
      assessment.push(line);
    } else {
      plan.push(line);
    }
  }

  return {
    subjective: subjective.join(". ").trim() || "No subjective data captured.",
    objective:
      objective.join(". ").trim() || "No objective findings documented.",
    assessment:
      assessment.join(". ").trim() || "Clinical impression pending review.",
    plan:
      plan.join(". ").trim() || "Treatment plan to be confirmed by clinician.",
  };
}

// ─── Recording Status Indicator ──────────────────────────────────────────────
function RecordingDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
    </span>
  );
}

// ─── SOAP Section Card ────────────────────────────────────────────────────────
interface SoapSectionProps {
  label: string;
  content: string;
  accentColor: string;
  borderColor: string;
  icon: string;
}

function SoapSection({
  label,
  content,
  accentColor,
  borderColor,
  icon,
}: SoapSectionProps) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "oklch(0.17 0.03 240 / 0.8)",
        border: `1px solid ${borderColor}`,
        boxShadow: `0 0 16px ${borderColor.replace("0.4)", "0.08)")}`,
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: accentColor }}
        >
          {label}
        </span>
      </div>
      <p className="font-mono text-sm leading-relaxed text-[oklch(0.85_0.01_220)]">
        {content}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
type RecordingState = "idle" | "recording" | "stopped";

export default function VoiceClinicalScribe() {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [interimText, setInterimText] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [soapNote, setSoapNote] = useState<SoapNote | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const transcriptAccumulator = useRef("");

  const SpeechRecognitionClass = getSpeechRecognition();
  const isSupported = SpeechRecognitionClass !== null;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const startRecording = useCallback(() => {
    if (!SpeechRecognitionClass) return;
    setError(null);
    transcriptAccumulator.current = "";
    setFinalTranscript("");
    setInterimText("");
    setSoapNote(null);

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setRecordingState("recording");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += `${result[0].transcript} `;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        transcriptAccumulator.current += final;
        setFinalTranscript(transcriptAccumulator.current);
      }
      setInterimText(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted") return;
      if (event.error === "no-speech") {
        setError(
          "No speech detected. Please speak clearly near your microphone.",
        );
      } else if (event.error === "not-allowed") {
        setError(
          "Microphone access denied. Please allow microphone permissions in your browser settings.",
        );
      } else {
        setError(`Transcription error: ${event.error}. Please try again.`);
      }
      setRecordingState("idle");
    };

    recognition.onend = () => {
      // If we're still supposed to be recording (e.g. browser auto-stopped),
      // restart to maintain continuous recording
      if (recognitionRef.current === recognition) {
        // Check if we intentionally stopped
        setRecordingState((prev) => {
          if (prev === "recording") {
            // Auto-restart
            try {
              recognition.start();
            } catch {
              // ignore restart errors
            }
          }
          return prev;
        });
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError("Failed to start voice recognition. Please try again.");
      setRecordingState("idle");
    }
  }, [SpeechRecognitionClass]);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    // Mark as stopped before calling stop() so onend doesn't restart
    recognitionRef.current.onend = null;
    recognitionRef.current.stop();
    recognitionRef.current = null;

    const fullTranscript = transcriptAccumulator.current.trim();
    setFinalTranscript(fullTranscript);
    setInterimText("");

    if (fullTranscript) {
      const note = formatAsSoap(fullTranscript);
      setSoapNote(note);
    }

    setRecordingState("stopped");
  }, []);

  const reset = useCallback(() => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    transcriptAccumulator.current = "";
    setRecordingState("idle");
    setFinalTranscript("");
    setInterimText("");
    setSoapNote(null);
    setError(null);
    setCopySuccess(false);
  }, []);

  const copyToClipboard = useCallback(async () => {
    if (!soapNote) return;
    const text = [
      "SOAP CLINICAL NOTE",
      "==================",
      "",
      "SUBJECTIVE:",
      soapNote.subjective,
      "",
      "OBJECTIVE:",
      soapNote.objective,
      "",
      "ASSESSMENT:",
      soapNote.assessment,
      "",
      "PLAN:",
      soapNote.plan,
      "",
      "---",
      "Note: Voice transcription is an aid and does not replace clinician review.",
      `Generated: ${new Date().toLocaleString()}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  }, [soapNote]);

  // ─── Unsupported browser fallback ───────────────────────────────────────────
  if (!isSupported) {
    return (
      <div className="card-3d flex flex-col items-center justify-center rounded-3xl px-8 py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl icon-glow-teal">
          <MicOff className="h-8 w-8 text-[oklch(0.72_0.17_195)]" />
        </div>
        <h3 className="font-display text-lg font-bold text-foreground">
          Voice Recording Not Supported
        </h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Your browser does not support the Web Speech API. Please use Google
          Chrome or Microsoft Edge for voice transcription.
        </p>
      </div>
    );
  }

  const displayTranscript =
    finalTranscript + (interimText ? ` ${interimText}` : "");
  const isRecording = recordingState === "recording";
  const isStopped = recordingState === "stopped";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Voice Clinical Scribe
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Speak your clinical notes — AI formats them into SOAP structure
          </p>
        </div>
        {(isStopped || isRecording) && (
          <Button
            data-ocid="voice_scribe.reset.button"
            variant="ghost"
            onClick={reset}
            className="gap-2 rounded-xl border border-[oklch(0.72_0.17_195/0.15)] text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div
          data-ocid="voice_scribe.error_state"
          className="flex items-start gap-3 rounded-2xl border border-[oklch(0.62_0.22_25/0.4)] bg-[oklch(0.62_0.22_25/0.08)] p-4"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.72_0.22_25)]" />
          <p className="text-sm text-[oklch(0.82_0.10_25)]">{error}</p>
        </div>
      )}

      {/* Microphone Control Panel */}
      <div
        className="card-3d flex flex-col items-center justify-center rounded-3xl py-10"
        style={{
          background: isRecording ? "oklch(0.18 0.04 190 / 0.6)" : undefined,
          border: isRecording
            ? "1px solid oklch(0.72 0.17 195 / 0.4)"
            : undefined,
          boxShadow: isRecording
            ? "0 0 48px oklch(0.72 0.17 195 / 0.2), 0 8px 32px oklch(0.05 0.05 240 / 0.5)"
            : undefined,
        }}
      >
        {/* Big mic button */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Animated ping rings when recording */}
          {isRecording && (
            <>
              <span
                className="absolute inline-flex h-36 w-36 rounded-full opacity-30"
                style={{
                  background: "transparent",
                  border: "2px solid oklch(0.72 0.17 195)",
                  animation: "mic-ring 1.8s ease-out infinite",
                }}
              />
              <span
                className="absolute inline-flex h-44 w-44 rounded-full opacity-15"
                style={{
                  background: "transparent",
                  border: "2px solid oklch(0.72 0.17 195)",
                  animation: "mic-ring 1.8s ease-out 0.4s infinite",
                }}
              />
              <span
                className="absolute inline-flex h-52 w-52 rounded-full opacity-10"
                style={{
                  background: "transparent",
                  border: "1px solid oklch(0.72 0.17 195)",
                  animation: "mic-ring 1.8s ease-out 0.8s infinite",
                }}
              />
            </>
          )}

          <button
            type="button"
            data-ocid={
              isRecording
                ? "voice_scribe.stop.button"
                : "voice_scribe.start.button"
            }
            onClick={isRecording ? stopRecording : startRecording}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.72_0.17_195)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{
              background: isRecording
                ? "linear-gradient(135deg, oklch(0.72 0.17 195 / 0.25) 0%, oklch(0.65 0.15 195 / 0.35) 100%)"
                : "linear-gradient(135deg, oklch(0.72 0.17 195 / 0.15) 0%, oklch(0.65 0.15 195 / 0.25) 100%)",
              border: isRecording
                ? "2px solid oklch(0.72 0.17 195 / 0.7)"
                : "2px solid oklch(0.72 0.17 195 / 0.35)",
              boxShadow: isRecording
                ? "0 0 32px oklch(0.72 0.17 195 / 0.5), 0 0 64px oklch(0.72 0.17 195 / 0.25), 0 8px 24px oklch(0.05 0.05 240 / 0.6)"
                : "0 0 16px oklch(0.72 0.17 195 / 0.2), 0 8px 24px oklch(0.05 0.05 240 / 0.4)",
            }}
          >
            {isRecording ? (
              <Square className="h-10 w-10 fill-[oklch(0.72_0.17_195)] text-[oklch(0.72_0.17_195)]" />
            ) : (
              <Mic className="h-10 w-10 text-[oklch(0.72_0.17_195)]" />
            )}
          </button>
        </div>

        {/* Status text */}
        <div className="flex items-center gap-2">
          {isRecording && <RecordingDot />}
          <span
            className="text-sm font-semibold"
            style={{
              color: isRecording
                ? "oklch(0.72 0.17 195)"
                : "oklch(0.58 0.02 230)",
            }}
          >
            {isRecording
              ? "Recording… speak your clinical notes"
              : isStopped
                ? "Recording complete — SOAP note generated below"
                : "Press the microphone to begin voice dictation"}
          </span>
        </div>

        {/* Live interim text */}
        {isRecording && interimText && (
          <p className="mt-3 max-w-lg px-4 text-center font-mono text-xs italic text-[oklch(0.60_0.05_200)]">
            {interimText}
          </p>
        )}
      </div>

      {/* Live Transcript */}
      {displayTranscript && (
        <div
          className="card-3d rounded-2xl p-5"
          data-ocid="voice_scribe.transcript.panel"
        >
          <div className="mb-3 flex items-center gap-2">
            {isRecording && <RecordingDot />}
            <span className="text-xs font-bold uppercase tracking-widest text-[oklch(0.72_0.17_195)]">
              {isRecording ? "Live Transcript" : "Raw Transcript"}
            </span>
          </div>
          <ScrollArea className="h-36">
            <p className="font-mono text-sm leading-relaxed text-[oklch(0.82_0.01_220)]">
              {finalTranscript}
              {interimText && (
                <span className="text-[oklch(0.58_0.05_200)] italic">
                  {" "}
                  {interimText}
                </span>
              )}
            </p>
          </ScrollArea>
        </div>
      )}

      {/* SOAP Note */}
      {isStopped && soapNote && (
        <div data-ocid="voice_scribe.soap_note.panel" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-foreground">
              Formatted SOAP Note
            </h3>
            <Button
              data-ocid="voice_scribe.copy.button"
              onClick={copyToClipboard}
              className="gap-2 rounded-xl text-sm font-semibold"
              style={{
                background: copySuccess
                  ? "oklch(0.68 0.18 155 / 0.15)"
                  : "oklch(0.72 0.17 195 / 0.12)",
                border: copySuccess
                  ? "1px solid oklch(0.68 0.18 155 / 0.5)"
                  : "1px solid oklch(0.72 0.17 195 / 0.3)",
                color: copySuccess
                  ? "oklch(0.78 0.15 155)"
                  : "oklch(0.72 0.17 195)",
                boxShadow: copySuccess
                  ? "0 0 16px oklch(0.68 0.18 155 / 0.2)"
                  : "0 0 12px oklch(0.72 0.17 195 / 0.12)",
              }}
            >
              {copySuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardCopy className="h-4 w-4" />
                  Copy Note
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <SoapSection
              label="Subjective"
              icon="🗣️"
              content={soapNote.subjective}
              accentColor="oklch(0.72 0.17 195)"
              borderColor="oklch(0.72 0.17 195 / 0.4)"
            />
            <SoapSection
              label="Objective"
              icon="📋"
              content={soapNote.objective}
              accentColor="oklch(0.68 0.20 250)"
              borderColor="oklch(0.68 0.20 250 / 0.4)"
            />
            <SoapSection
              label="Assessment"
              icon="🧠"
              content={soapNote.assessment}
              accentColor="oklch(0.75 0.20 300)"
              borderColor="oklch(0.75 0.20 300 / 0.4)"
            />
            <SoapSection
              label="Plan"
              icon="📅"
              content={soapNote.plan}
              accentColor="oklch(0.68 0.18 155)"
              borderColor="oklch(0.68 0.18 155 / 0.4)"
            />
          </div>

          {/* Success state */}
          <div
            data-ocid="voice_scribe.success_state"
            className="flex items-center gap-3 rounded-2xl border border-[oklch(0.68_0.18_155/0.3)] bg-[oklch(0.68_0.18_155/0.06)] px-4 py-3"
          >
            <Check className="h-4 w-4 shrink-0 text-[oklch(0.72_0.18_155)]" />
            <p className="text-sm text-[oklch(0.78_0.10_155)]">
              SOAP note generated. Review and edit before adding to patient
              record.
            </p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-xs text-muted-foreground">
        Voice transcription is an aid and does not replace clinician review.
        Always verify accuracy before documenting.
      </p>

      {/* Keyframes injected via style tag */}
      <style>{`
        @keyframes mic-ring {
          0% {
            transform: scale(0.85);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
