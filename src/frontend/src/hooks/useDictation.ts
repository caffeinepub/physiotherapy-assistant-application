import { useCallback, useEffect, useRef, useState } from "react";

// ─── Web Speech API types ────────────────────────────────────────────────────
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

export function getSpeechRecognition():
  | (new () => SpeechRecognitionInstance)
  | null {
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

// ─── Assessment field shape ──────────────────────────────────────────────────
export interface ParsedAssessmentFields {
  // Subjective
  chiefComplaint?: string;
  onsetHistory?: string;
  aggravatingFactors?: string;
  relievingFactors?: string;
  functionalLimitations?: string;
  // Objective
  rangeOfMotion?: string;
  muscleTesting?: string;
  neurologicalScreening?: string;
  cardiopulmonaryScreening?: string;
  gaitAssessment?: string;
  balanceAssessment?: string;
  // Red Flags
  redFlags?: string;
}

// ─── NLP keyword parser ──────────────────────────────────────────────────────
const FIELD_KEYWORDS: Record<keyof ParsedAssessmentFields, string[]> = {
  chiefComplaint: [
    "complaint",
    "pain",
    "hurt",
    "hurting",
    "problem",
    "comes in with",
    "presenting with",
    "chief",
    "reason",
    "ache",
    "aching",
    "discomfort",
  ],
  onsetHistory: [
    "onset",
    "started",
    "began",
    "ago",
    "since",
    "history",
    "week",
    "month",
    "year",
    "day",
    "duration",
    "when did",
    "how long",
  ],
  aggravatingFactors: [
    "worse",
    "aggravate",
    "aggravating",
    "increases",
    "worsens",
    "provokes",
    "when doing",
    "during",
    "exacerbated",
    "triggers",
  ],
  relievingFactors: [
    "better",
    "relieves",
    "relieving",
    "reduces",
    "rest",
    "ice",
    "heat",
    "improves",
    "eases",
    "alleviate",
    "alleviates",
  ],
  functionalLimitations: [
    "difficulty",
    "unable",
    "can't",
    "cannot",
    "limited",
    "limitation",
    "functional",
    "activities",
    "walking",
    "climbing",
    "dressing",
    "ADL",
    "activities of daily",
  ],
  rangeOfMotion: [
    "ROM",
    "range",
    "motion",
    "degrees",
    "flexion",
    "extension",
    "abduction",
    "adduction",
    "rotation",
    "limited range",
  ],
  muscleTesting: [
    "strength",
    "MMT",
    "muscle",
    "grade",
    "power",
    "weak",
    "weakness",
    "manual muscle",
  ],
  neurologicalScreening: [
    "reflex",
    "sensation",
    "neuro",
    "neurological",
    "coordination",
    "numbness",
    "tingling",
    "Babinski",
    "dermatomal",
  ],
  cardiopulmonaryScreening: [
    "BP",
    "blood pressure",
    "heart rate",
    "HR",
    "respiratory",
    "oxygen",
    "SpO2",
    "pulse",
    "saturation",
  ],
  gaitAssessment: [
    "gait",
    "limp",
    "antalgic",
    "stride",
    "step",
    "walks with",
    "ambulating",
  ],
  balanceAssessment: [
    "balance",
    "Romberg",
    "standing",
    "single leg",
    "stability",
    "sway",
    "TUG",
    "Tinetti",
    "Berg",
  ],
  redFlags: [
    "red flag",
    "refer",
    "urgent",
    "cauda",
    "cancer",
    "fracture",
    "fever",
    "night pain",
    "bilateral",
    "unexplained weight",
    "loss of bladder",
    "loss of bowel",
    "malignancy",
    "emergency",
  ],
};

function scoreFieldMatch(sentence: string, keywords: string[]): number {
  const lower = sentence.toLowerCase();
  return keywords.reduce((score, kw) => {
    return lower.includes(kw.toLowerCase()) ? score + 1 : score;
  }, 0);
}

export function parseTranscriptToFields(
  transcript: string,
): ParsedAssessmentFields {
  // Split by sentence-ending punctuation, or by common clinical dictation patterns
  const sentences = transcript
    .split(/[.!?]+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

  const fieldBuckets: Record<keyof ParsedAssessmentFields, string[]> = {
    chiefComplaint: [],
    onsetHistory: [],
    aggravatingFactors: [],
    relievingFactors: [],
    functionalLimitations: [],
    rangeOfMotion: [],
    muscleTesting: [],
    neurologicalScreening: [],
    cardiopulmonaryScreening: [],
    gaitAssessment: [],
    balanceAssessment: [],
    redFlags: [],
  };

  for (const sentence of sentences) {
    let bestField: keyof ParsedAssessmentFields | null = null;
    let bestScore = 0;

    for (const [field, keywords] of Object.entries(FIELD_KEYWORDS) as [
      keyof ParsedAssessmentFields,
      string[],
    ][]) {
      const score = scoreFieldMatch(sentence, keywords);
      if (score > bestScore) {
        bestScore = score;
        bestField = field;
      }
    }

    // Only assign if there's at least one keyword match
    if (bestField && bestScore > 0) {
      fieldBuckets[bestField].push(sentence);
    }
    // Unmatched sentences go to chiefComplaint as a fallback
    else {
      fieldBuckets.chiefComplaint.push(sentence);
    }
  }

  const result: ParsedAssessmentFields = {};
  for (const [field, bucket] of Object.entries(fieldBuckets) as [
    keyof ParsedAssessmentFields,
    string[],
  ][]) {
    if (bucket.length > 0) {
      result[field] = bucket.join(". ").trim();
    }
  }

  return result;
}

// ─── useDictation hook ───────────────────────────────────────────────────────
interface UseDictationReturn {
  isRecording: boolean;
  isSupported: boolean;
  interimTranscript: string;
  finalTranscript: string;
  error: string | null;
  startDictation: () => void;
  stopDictation: () => void;
  resetDictation: () => void;
}

export function useDictation(): UseDictationReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const transcriptAccumulator = useRef("");

  const SpeechRecognitionClass = getSpeechRecognition();
  const isSupported = SpeechRecognitionClass !== null;

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const startDictation = useCallback(() => {
    if (!SpeechRecognitionClass) return;
    setError(null);
    transcriptAccumulator.current = "";
    setFinalTranscript("");
    setInterimTranscript("");

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
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
      setInterimTranscript(interim);
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
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        setIsRecording((prev) => {
          if (prev) {
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
      setIsRecording(false);
    }
  }, [SpeechRecognitionClass]);

  const stopDictation = useCallback(() => {
    if (!recognitionRef.current) return;
    recognitionRef.current.onend = null;
    recognitionRef.current.stop();
    recognitionRef.current = null;

    const full = transcriptAccumulator.current.trim();
    setFinalTranscript(full);
    setInterimTranscript("");
    setIsRecording(false);
  }, []);

  const resetDictation = useCallback(() => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    transcriptAccumulator.current = "";
    setIsRecording(false);
    setFinalTranscript("");
    setInterimTranscript("");
    setError(null);
  }, []);

  return {
    isRecording,
    isSupported,
    interimTranscript,
    finalTranscript,
    error,
    startDictation,
    stopDictation,
    resetDictation,
  };
}
