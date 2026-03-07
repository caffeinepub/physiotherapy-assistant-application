import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertTriangle,
  Calendar,
  ClipboardList,
  Scale,
} from "lucide-react";
import type { Assessment } from "../backend";

interface AssessmentCardProps {
  assessment: Assessment;
}

export default function AssessmentCard({ assessment }: AssessmentCardProps) {
  const date = assessment.dateCreated
    ? new Date(Number(assessment.dateCreated) / 1000000)
    : new Date();
  const hasRedFlags =
    Array.isArray(assessment.redFlags) && assessment.redFlags.length > 0;
  const hasScales =
    Array.isArray(assessment.clinicalScales) &&
    assessment.clinicalScales.length > 0;

  return (
    <div
      data-ocid="assessment.card"
      className="card-3d rounded-2xl overflow-hidden"
      style={{
        animation: "fade-slide-in 0.4s ease forwards",
      }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl icon-glow-teal">
            <ClipboardList className="h-4 w-4 text-[oklch(0.72_0.17_195)]" />
          </div>
          <div>
            <p className="font-display text-base font-semibold text-foreground">
              Assessment
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {date.toLocaleDateString()} at {date.toLocaleTimeString()}
            </p>
          </div>
        </div>
        {hasRedFlags && (
          <div
            className="animate-pulse"
            style={{
              animation: "glow-pulse 2s ease-in-out infinite",
            }}
          >
            <Badge
              variant="destructive"
              className="gap-1 rounded-lg text-xs font-semibold"
              style={{
                boxShadow:
                  "0 0 12px oklch(0.62 0.22 25 / 0.4), 0 0 24px oklch(0.62 0.22 25 / 0.2)",
              }}
            >
              <AlertTriangle className="h-3 w-3" />
              {assessment.redFlags.length} Red Flag
              {assessment.redFlags.length > 1 ? "s" : ""}
            </Badge>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="divider-glow mx-5" />

      {/* Accordion */}
      <div className="px-5 pb-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem
            value="subjective"
            className="border-b border-[oklch(0.72_0.17_195/0.1)] data-[state=open]:border-l-2 data-[state=open]:border-l-[oklch(0.72_0.17_195/0.6)] data-[state=open]:pl-2 transition-all duration-200"
          >
            <AccordionTrigger
              data-ocid="assessment.subjective.toggle"
              className="py-3 text-sm font-semibold hover:no-underline"
            >
              Subjective History
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-3">
              {assessment.subjectiveHistory?.chiefComplaint && (
                <div className="rounded-xl bg-[oklch(0.20_0.04_238/0.6)] p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Chief Complaint
                  </p>
                  <p className="text-sm text-foreground">
                    {assessment.subjectiveHistory.chiefComplaint}
                  </p>
                </div>
              )}
              {assessment.subjectiveHistory?.onsetHistory && (
                <div>
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Onset History
                  </p>
                  <p className="text-sm text-foreground">
                    {assessment.subjectiveHistory.onsetHistory}
                  </p>
                </div>
              )}
              {assessment.subjectiveHistory?.aggravatingFactors && (
                <div>
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Aggravating Factors
                  </p>
                  <p className="text-sm text-foreground">
                    {assessment.subjectiveHistory.aggravatingFactors}
                  </p>
                </div>
              )}
              {assessment.subjectiveHistory?.relievingFactors && (
                <div>
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Relieving Factors
                  </p>
                  <p className="text-sm text-foreground">
                    {assessment.subjectiveHistory.relievingFactors}
                  </p>
                </div>
              )}
              {assessment.subjectiveHistory?.functionalLimitations && (
                <div>
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Functional Limitations
                  </p>
                  <p className="text-sm text-foreground">
                    {assessment.subjectiveHistory.functionalLimitations}
                  </p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="objective"
            className="border-b border-[oklch(0.72_0.17_195/0.1)] data-[state=open]:border-l-2 data-[state=open]:border-l-[oklch(0.68_0.20_250/0.6)] data-[state=open]:pl-2 transition-all duration-200"
          >
            <AccordionTrigger
              data-ocid="assessment.objective.toggle"
              className="py-3 text-sm font-semibold hover:no-underline"
            >
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[oklch(0.68_0.20_250)]" />
                Objective Tests
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-3">
              {assessment.objectiveTest?.rangeOfMotion && (
                <div>
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Range of Motion
                  </p>
                  <p className="text-sm text-foreground">
                    {assessment.objectiveTest.rangeOfMotion}
                  </p>
                </div>
              )}
              {assessment.objectiveTest?.muscleTesting && (
                <div>
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Muscle Testing
                  </p>
                  <p className="text-sm text-foreground">
                    {assessment.objectiveTest.muscleTesting}
                  </p>
                </div>
              )}
              {assessment.objectiveTest?.neurologicalScreening && (
                <div>
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Neurological Screening
                  </p>
                  <p className="text-sm text-foreground">
                    {assessment.objectiveTest.neurologicalScreening}
                  </p>
                </div>
              )}
              {assessment.objectiveTest?.cardiopulmonaryScreening && (
                <div>
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Cardiopulmonary Screening
                  </p>
                  <p className="text-sm text-foreground">
                    {assessment.objectiveTest.cardiopulmonaryScreening}
                  </p>
                </div>
              )}
              {assessment.objectiveTest?.gaitAssessment && (
                <div>
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Gait Assessment
                  </p>
                  <p className="text-sm text-foreground">
                    {assessment.objectiveTest.gaitAssessment}
                  </p>
                </div>
              )}
              {assessment.objectiveTest?.balanceAssessment && (
                <div>
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Balance Assessment
                  </p>
                  <p className="text-sm text-foreground">
                    {assessment.objectiveTest.balanceAssessment}
                  </p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {hasScales && (
            <AccordionItem
              value="scales"
              className="border-b border-[oklch(0.72_0.17_195/0.1)] data-[state=open]:border-l-2 data-[state=open]:border-l-[oklch(0.68_0.18_155/0.6)] data-[state=open]:pl-2 transition-all duration-200"
            >
              <AccordionTrigger
                data-ocid="assessment.scales.toggle"
                className="py-3 text-sm font-semibold hover:no-underline"
              >
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-[oklch(0.68_0.18_155)]" />
                  Clinical Scales ({assessment.clinicalScales?.length ?? 0})
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pb-3">
                {(assessment.clinicalScales ?? []).map((scale) => (
                  <div
                    key={scale.name}
                    className="rounded-xl border border-[oklch(0.68_0.18_155/0.2)] bg-[oklch(0.68_0.18_155/0.07)] p-3"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {scale.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Score:{" "}
                      <span className="font-bold text-[oklch(0.68_0.18_155)]">
                        {Number(scale.score)}
                      </span>{" "}
                      &bull; {scale.interpretation}
                    </p>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )}

          {hasRedFlags && (
            <AccordionItem
              value="redflags"
              className="border-none data-[state=open]:border-l-2 data-[state=open]:border-l-[oklch(0.62_0.22_25/0.7)] data-[state=open]:pl-2 transition-all duration-200"
            >
              <AccordionTrigger
                data-ocid="assessment.redflags.toggle"
                className="py-3 text-sm font-semibold text-destructive hover:no-underline"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Red Flags ({assessment.redFlags?.length ?? 0})
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <ul className="space-y-1.5">
                  {(assessment.redFlags ?? []).map((flag) => (
                    <li
                      key={flag}
                      className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/8 px-3 py-2 text-sm text-destructive"
                    >
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {flag}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
}
