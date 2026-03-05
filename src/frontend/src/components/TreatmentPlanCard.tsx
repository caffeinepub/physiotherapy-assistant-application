import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, Lightbulb, Target, Zap } from "lucide-react";
import type { TreatmentPlan } from "../backend";

interface TreatmentPlanCardProps {
  plan: TreatmentPlan;
}

export default function TreatmentPlanCard({ plan }: TreatmentPlanCardProps) {
  const date = new Date(Number(plan.dateCreated) / 1000000);

  return (
    <div
      data-ocid="treatment_plan.card"
      className="card-3d rounded-2xl overflow-hidden"
    >
      {/* Card header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl icon-glow-green">
            <Activity className="h-4 w-4 text-[oklch(0.68_0.18_155)]" />
          </div>
          <div>
            <p className="font-display text-base font-semibold text-foreground">
              {plan.diagnosis}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {date.toLocaleDateString()} at {date.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <Badge className="rounded-lg border border-[oklch(0.68_0.18_155/0.3)] bg-[oklch(0.68_0.18_155/0.1)] text-xs font-semibold text-[oklch(0.75_0.14_155)]">
          Treatment Plan
        </Badge>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-[oklch(0.68_0.18_155/0.4)] to-transparent" />

      {/* Accordion */}
      <div className="px-5 pb-4">
        <Accordion type="single" collapsible className="w-full">
          {plan.impairments && (
            <AccordionItem
              value="impairments"
              className="border-b border-[oklch(0.68_0.18_155/0.1)]"
            >
              <AccordionTrigger
                data-ocid="plan.impairments.toggle"
                className="py-3 text-sm font-semibold hover:no-underline"
              >
                Identified Impairments
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <p className="text-sm text-foreground leading-relaxed">
                  {plan.impairments}
                </p>
              </AccordionContent>
            </AccordionItem>
          )}

          {plan.goals && (
            <AccordionItem
              value="goals"
              className="border-b border-[oklch(0.68_0.18_155/0.1)]"
            >
              <AccordionTrigger
                data-ocid="plan.goals.toggle"
                className="py-3 text-sm font-semibold hover:no-underline"
              >
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-[oklch(0.72_0.17_195)]" />
                  Patient Goals
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <p className="text-sm text-foreground leading-relaxed">
                  {plan.goals}
                </p>
              </AccordionContent>
            </AccordionItem>
          )}

          {plan.functionalLimitations && (
            <AccordionItem
              value="limitations"
              className="border-b border-[oklch(0.68_0.18_155/0.1)]"
            >
              <AccordionTrigger
                data-ocid="plan.limitations.toggle"
                className="py-3 text-sm font-semibold hover:no-underline"
              >
                Functional Limitations
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <p className="text-sm text-foreground leading-relaxed">
                  {plan.functionalLimitations}
                </p>
              </AccordionContent>
            </AccordionItem>
          )}

          {plan.interventions.length > 0 && (
            <AccordionItem
              value="interventions"
              className="border-b border-[oklch(0.68_0.18_155/0.1)]"
            >
              <AccordionTrigger
                data-ocid="plan.interventions.toggle"
                className="py-3 text-sm font-semibold hover:no-underline"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[oklch(0.78_0.18_75)]" />
                  Interventions ({plan.interventions.length})
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <ul className="space-y-1.5">
                  {plan.interventions.map((intervention, idx) => (
                    <li
                      key={intervention}
                      className="flex items-start gap-2 rounded-lg border border-[oklch(0.78_0.18_75/0.15)] bg-[oklch(0.78_0.18_75/0.06)] px-3 py-2 text-sm text-foreground"
                    >
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[oklch(0.78_0.18_75/0.2)] text-[10px] font-bold text-[oklch(0.78_0.18_75)]">
                        {idx + 1}
                      </span>
                      {intervention}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}

          {plan.recommendations.length > 0 && (
            <AccordionItem value="recommendations" className="border-none">
              <AccordionTrigger
                data-ocid="plan.recommendations.toggle"
                className="py-3 text-sm font-semibold hover:no-underline"
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-[oklch(0.68_0.20_250)]" />
                  Evidence-Based Recommendations ({plan.recommendations.length})
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <ul className="space-y-1.5">
                  {plan.recommendations.map((recommendation) => (
                    <li
                      key={recommendation}
                      className="flex items-start gap-2 rounded-lg border border-[oklch(0.68_0.20_250/0.15)] bg-[oklch(0.68_0.20_250/0.06)] px-3 py-2 text-sm text-foreground"
                    >
                      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[oklch(0.68_0.20_250)]" />
                      {recommendation}
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
