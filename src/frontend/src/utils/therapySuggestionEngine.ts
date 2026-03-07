import { therapyModalities } from "../data/therapyModalities";

export interface TherapySuggestionContext {
  chiefComplaint: string;
  bodyPart: string;
  domain: string;
  painScore: number;
  functionalLimitations: string;
  redFlags: string[];
  clinicalScaleNames: string[];
  postureDeviations: string[];
  medicalHistory: string;
}

export interface TherapySuggestion {
  therapyId: string;
  therapyName: string;
  category: string;
  rationale: string;
  suggestedFrequency: string;
  suggestedDosage: string;
  suggestedIntensity: string;
  suggestedDuration: string;
  confidenceLevel: "High" | "Moderate" | "Consider";
  safetyNote?: string;
}

function inferDomain(keywords: string): string {
  if (
    /stroke|neuro|parkinson|spinal cord|hemiplegia|cerebrovascular|multiple sclerosis|ms\b|vestibular/.test(
      keywords,
    )
  ) {
    return "neurological";
  }
  if (
    /heart|cardiac|copd|asthma|pulmonary|respiratory|angina|cardio/.test(
      keywords,
    )
  ) {
    return "cardio";
  }
  if (
    /child|pediatric|cerebral palsy|developmental|infant|juvenile|peds/.test(
      keywords,
    )
  ) {
    return "pediatric";
  }
  if (
    /elderly|fall|geriatric|osteoporosis|dementia|frail|aging/.test(keywords)
  ) {
    return "geriatric";
  }
  return "orthopedic";
}

function tokenize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function customizeParameters(
  baseFrequency: string,
  baseDosage: string,
  baseIntensity: string,
  baseDuration: string,
  painScore: number,
  domain: string,
  category: string,
): { frequency: string; dosage: string; intensity: string; duration: string } {
  let frequency = baseFrequency;
  let dosage = baseDosage;
  let intensity = baseIntensity;
  let duration = baseDuration;

  if (painScore > 7) {
    // High pain — more frequent, start gentle
    if (category === "Electrotherapy") {
      frequency = "Daily or 5–7x/week in acute phase";
      intensity =
        "Start at sensory threshold only; increase gradually as pain reduces";
      duration = "15–20 min per session; course 3–4 weeks then reassess";
    } else if (category === "Exercise Therapy") {
      frequency = "3x/week; avoid consecutive days to allow recovery";
      intensity =
        "Low-moderate (RPE 10–12 Borg scale); prioritize pain-free range";
      dosage =
        "2 sets × 8–10 reps; short session 20–30 min; isometric focus initially";
    } else if (category === "Manual Therapy") {
      frequency = "3–4x/week in acute phase";
      intensity = "Grade I–II (pain-inhibition) only; avoid end-range loading";
      duration = "10–15 min per session; reassess after 3 sessions";
    } else if (category === "Thermotherapy / Cryotherapy") {
      frequency =
        "Cryotherapy: every 1–2h in acute phase; heat: defer until sub-acute";
      intensity = "Cold: CBAN sequence to numb; avoid heat in acute phase";
      duration = "15 min cold application; cycle 20 min on / 20 min off";
    }
  } else if (painScore >= 4) {
    // Moderate pain — standard protocol
    if (category === "Electrotherapy") {
      frequency = "3–4x/week; maintain consistently for best outcomes";
      intensity =
        "Comfortable sensory tingling; increase incrementally each session";
      duration = "20–30 min per session; course 4–6 weeks";
    } else if (category === "Exercise Therapy") {
      frequency = "3–5x/week with planned rest days";
      intensity = "Moderate (RPE 12–14 Borg); progress by 10% load per week";
      dosage = "3 sets × 10–15 reps; 45–60 min session including warm-up";
    } else if (category === "Manual Therapy") {
      frequency = "2–3x/week; combine with home exercise program";
      intensity = "Grade II–III; move into resistance without provoking pain";
      duration = "20–30 min per session; 6–8 sessions course";
    }
  } else {
    // Low pain / maintenance — lighter, less frequent
    if (category === "Exercise Therapy") {
      frequency = "2–3x/week maintenance; can include home program";
      intensity = "Light-moderate (RPE 10–12); focus on endurance and function";
      dosage = "2–3 sets × 15 reps; 30–45 min; emphasize functional tasks";
    } else if (category === "Manual Therapy") {
      frequency = "1–2x/week maintenance; taper as improvement continues";
      intensity = "Grade III–IV; work into end-range for mobility gains";
    }
  }

  // Domain-specific overrides
  if (domain === "neurological") {
    if (category === "Exercise Therapy") {
      frequency = "Daily or 5x/week — neuroplasticity requires high repetition";
      dosage =
        "High-rep low-load: 3–5 sets × 20–30 reps; task-specific practice";
      intensity =
        "Sub-maximal effort with focus on movement quality and coordination";
    }
    if (category === "Electrotherapy") {
      frequency = "Daily for NMES in first 4 weeks; 3–5x/week for TENS";
      intensity =
        "NMES: visible smooth contraction; TENS: sensory threshold only";
    }
  } else if (domain === "cardio") {
    if (category === "Exercise Therapy") {
      frequency = "3–5x/week; monitor HR and BP before/during/after";
      intensity = "Aerobic target: 40–70% HRR; RPE 11–14; Borg scale guided";
      dosage =
        "Start 10–15 min aerobic; progress by 5 min per week to 30–60 min";
    }
  } else if (domain === "geriatric") {
    if (category === "Exercise Therapy") {
      frequency = "3x/week; allow 48h recovery; incorporate functional tasks";
      intensity =
        "Low-moderate (RPE 10–13); avoid high-impact; fall-prevention focus";
      dosage = "2 sets × 10–12 reps; chair-based exercises initially";
    }
    if (category === "Electrotherapy") {
      intensity =
        "Low intensity; monitor sensation carefully due to reduced sensitivity";
    }
  } else if (domain === "pediatric") {
    if (category === "Exercise Therapy") {
      frequency = "Daily; integrate into play-based activities";
      intensity = "Fun, engaging, age-appropriate; avoid fatigue";
      dosage = "Short bursts 10–15 min; multiple sessions per day";
    }
  }

  return { frequency, dosage, intensity, duration };
}

function generateRationale(
  therapyName: string,
  category: string,
  domain: string,
  chiefComplaint: string,
  painScore: number,
  matchedIndications: string[],
): string {
  const painLevel =
    painScore > 7
      ? "high pain levels"
      : painScore >= 4
        ? "moderate pain"
        : "mild to manageable discomfort";
  const domainLabel =
    domain === "neurological"
      ? "neurological rehabilitation"
      : domain === "cardio"
        ? "cardiorespiratory rehabilitation"
        : domain === "pediatric"
          ? "pediatric physiotherapy"
          : domain === "geriatric"
            ? "geriatric rehabilitation"
            : "orthopedic management";

  if (matchedIndications.length > 0) {
    return `${therapyName} is directly indicated for ${matchedIndications[0].toLowerCase()}, which aligns with this patient's ${chiefComplaint || "chief complaint"} and ${painLevel}. Evidence supports this intervention in ${domainLabel}.`;
  }

  const categoryRationale: Record<string, string> = {
    Electrotherapy: `${therapyName} provides effective neuromodulation for ${painLevel} in ${chiefComplaint || "musculoskeletal conditions"}, supporting pain relief without mechanical loading.`,
    "Exercise Therapy": `${therapyName} targets the functional impairments and strengthening needs associated with ${chiefComplaint || "the presenting condition"} within ${domainLabel} guidelines.`,
    "Manual Therapy": `${therapyName} addresses joint mobility and soft tissue restrictions commonly contributing to ${chiefComplaint || "musculoskeletal dysfunction"} in ${domainLabel}.`,
    "Thermotherapy / Cryotherapy": `${therapyName} is appropriate for managing ${painLevel} and preparing tissues for further intervention in this ${domainLabel} case.`,
    "Other Modalities": `${therapyName} offers complementary benefits for ${chiefComplaint || "this presentation"}, supporting recovery within the ${domainLabel} framework.`,
  };

  return (
    categoryRationale[category] ??
    `${therapyName} is recommended based on clinical presentation and ${domainLabel} evidence.`
  );
}

export function suggestTherapies(
  context: TherapySuggestionContext,
): TherapySuggestion[] {
  const complaintText = tokenize(
    [
      context.chiefComplaint,
      context.bodyPart,
      context.functionalLimitations,
    ].join(" "),
  );
  const historyText = tokenize(context.medicalHistory);
  const redFlagText = tokenize(context.redFlags.join(" "));
  const allNegativeText = `${historyText} ${redFlagText}`;

  // Infer domain if not provided
  const domain =
    context.domain ||
    inferDomain(
      `${complaintText} ${historyText} ${tokenize(context.chiefComplaint)}`,
    );

  interface ScoredTherapy {
    therapy: (typeof therapyModalities)[0];
    score: number;
    matchedIndications: string[];
  }

  const scored: ScoredTherapy[] = therapyModalities.map((therapy) => {
    let score = 0;
    const matchedIndications: string[] = [];

    // +3 for indication keyword match
    for (const indication of therapy.indications) {
      const indicationLower = indication.toLowerCase();
      const indicationWords = indicationLower.split(/\s+/);
      const hasMatch = indicationWords.some(
        (word) => word.length > 3 && complaintText.includes(word),
      );
      if (hasMatch || complaintText.includes(indicationLower)) {
        score += 3;
        matchedIndications.push(indication);
      }
    }

    // +2 for domain-category alignment
    if (domain === "neurological") {
      if (therapy.category === "Exercise Therapy") score += 2;
      if (
        therapy.category === "Electrotherapy" &&
        ["nmes", "tens"].includes(therapy.id)
      )
        score += 2;
      if (
        therapy.id === "pnf" ||
        therapy.id === "gait-training" ||
        therapy.id === "balance-coordination"
      )
        score += 2;
    } else if (domain === "cardio") {
      if (therapy.category === "Exercise Therapy") score += 2;
      if (therapy.id === "hydrotherapy") score += 1;
    } else if (domain === "geriatric") {
      if (
        therapy.id === "balance-coordination" ||
        therapy.id === "gait-training"
      )
        score += 2;
      if (therapy.category === "Exercise Therapy") score += 1;
      if (therapy.category === "Thermotherapy / Cryotherapy") score += 1;
    } else if (domain === "pediatric") {
      if (therapy.category === "Exercise Therapy") score += 2;
      if (therapy.id === "hydrotherapy" || therapy.id === "gait-training")
        score += 1;
    } else {
      // orthopedic
      if (therapy.category === "Manual Therapy") score += 2;
      if (therapy.category === "Electrotherapy") score += 1;
      if (therapy.category === "Thermotherapy / Cryotherapy") score += 1;
    }

    // Pain score adjustments — electrotherapy and cryotherapy rank higher with high pain
    if (context.painScore > 7) {
      if (
        therapy.category === "Electrotherapy" &&
        ["tens", "ift"].includes(therapy.id)
      )
        score += 2;
      if (therapy.id === "cold-packs") score += 2;
    }

    // +1 for method keyword match
    const methodText = tokenize(therapy.method);
    const complaintWords = complaintText
      .split(/\s+/)
      .filter((w) => w.length > 4);
    if (complaintWords.some((w) => methodText.includes(w))) {
      score += 1;
    }

    // -5 for contraindication match against history / red flags
    for (const contra of therapy.contraindications) {
      const contraLower = contra.toLowerCase();
      const contraWords = contraLower.split(/\s+/).filter((w) => w.length > 4);
      if (contraWords.some((w) => allNegativeText.includes(w))) {
        score -= 5;
        break;
      }
    }

    return { therapy, score, matchedIndications };
  });

  // Sort by score descending, filter score > 0, take top 5
  const top5 = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const hasRedFlags = context.redFlags.length > 0;

  return top5.map(({ therapy, score, matchedIndications }) => {
    const confidenceLevel: "High" | "Moderate" | "Consider" =
      score >= 5 ? "High" : score >= 3 ? "Moderate" : "Consider";

    const { frequency, dosage, intensity, duration } = customizeParameters(
      therapy.frequency,
      therapy.dosage,
      therapy.intensity,
      therapy.duration,
      context.painScore,
      domain,
      therapy.category,
    );

    const rationale = generateRationale(
      therapy.name,
      therapy.category,
      domain,
      context.chiefComplaint,
      context.painScore,
      matchedIndications,
    );

    const suggestion: TherapySuggestion = {
      therapyId: therapy.id,
      therapyName: therapy.name,
      category: therapy.category,
      rationale,
      suggestedFrequency: frequency,
      suggestedDosage: dosage,
      suggestedIntensity: intensity,
      suggestedDuration: duration,
      confidenceLevel,
    };

    if (hasRedFlags) {
      suggestion.safetyNote =
        "Red flags noted — confirm medical clearance before starting this therapy.";
    }

    return suggestion;
  });
}
