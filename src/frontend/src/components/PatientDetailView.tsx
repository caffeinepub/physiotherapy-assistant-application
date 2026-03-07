import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ArrowLeft,
  Calendar,
  FileText,
  FlameKindling,
  Mic,
  Plus,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useGetPatient,
  useGetPatientAssessments,
  useGetPatientTreatmentPlans,
} from "../hooks/useQueries";
import AddAssessmentDialog from "./AddAssessmentDialog";
import AddTreatmentPlanDialog from "./AddTreatmentPlanDialog";
import AssessmentCard from "./AssessmentCard";
import TherapyModalitiesTab from "./TherapyModalitiesTab";
import TreatmentPlanCard from "./TreatmentPlanCard";
import VoiceClinicalScribe from "./VoiceClinicalScribe";

interface PatientDetailViewProps {
  patientId: string;
  onBack: () => void;
}

interface InfoCardProps {
  title: string;
  value: string;
  iconGlow: string;
  iconColor: string;
  icon: React.ElementType;
  accentColor: string;
  accentHoverColor: string;
}

function InfoCard({
  title,
  value,
  iconGlow,
  iconColor,
  icon: Icon,
  accentColor,
  accentHoverColor,
}: InfoCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="card-3d rounded-2xl p-5 transition-all duration-200"
      style={{
        borderLeft: `2px solid ${hovered ? accentHoverColor : accentColor}`,
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        boxShadow: hovered
          ? `0 0 0 1px oklch(0.9 0.02 220 / 0.06) inset, 0 16px 40px oklch(0.05 0.05 240 / 0.7), 0 0 24px ${accentColor}`
          : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconGlow}`}
        >
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </p>
          <p className="mt-1 text-sm text-foreground leading-relaxed">
            {value || (
              <span className="italic text-muted-foreground">Not recorded</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

// Scroll reveal hook
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("section-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return ref;
}

export default function PatientDetailView({
  patientId,
  onBack,
}: PatientDetailViewProps) {
  const { data: patient } = useGetPatient(patientId);
  const { data: assessments } = useGetPatientAssessments(patientId);
  const { data: treatmentPlans } = useGetPatientTreatmentPlans(patientId);
  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [showAddTreatmentPlan, setShowAddTreatmentPlan] = useState(false);
  const [heroHovered, setHeroHovered] = useState(false);

  const assessmentRevealRef = useScrollReveal();
  const plansRevealRef = useScrollReveal();

  if (!patient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          data-ocid="patient.back_button"
          variant="ghost"
          onClick={onBack}
          className="mb-4 gap-2 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patients
        </Button>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Activity className="h-4 w-4 animate-spin" />
          Loading patient information...
        </div>
      </div>
    );
  }

  const initials =
    `${patient.firstName?.[0] ?? ""}${patient.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="page-enter relative min-h-[calc(100vh-8rem)]">
      {/* Ambient orbs — reduced opacity for performance */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full blur-3xl opacity-8"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.17 195 / 0.6) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-1/3 left-0 h-60 w-60 rounded-full blur-3xl opacity-6"
        style={{
          background:
            "radial-gradient(circle, oklch(0.68 0.2 250 / 0.5) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          data-ocid="patient.back_button"
          variant="ghost"
          onClick={onBack}
          className="group mb-6 gap-2 rounded-xl border border-[oklch(0.72_0.17_195/0.15)] bg-[oklch(0.20_0.04_240/0.5)] text-sm hover:bg-[oklch(0.24_0.04_240/0.7)] transition-all duration-200"
          style={{
            animation: "fade-slide-in 0.4s ease forwards",
          }}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Patients
        </Button>

        {/* Patient hero card with shimmer hover */}
        <div
          data-ocid="patient.profile.card"
          className="mb-6 relative overflow-hidden rounded-3xl border border-[oklch(0.72_0.17_195/0.2)] bg-gradient-to-br from-[oklch(0.20_0.04_238/0.95)] to-[oklch(0.16_0.03_242/0.95)] p-6 cursor-default"
          style={{
            boxShadow:
              "0 1px 0 oklch(0.90 0.02 220 / 0.08) inset, 0 8px 32px oklch(0.05 0.05 240 / 0.5), 0 0 40px oklch(0.72 0.17 195 / 0.08)",
            animation: "fade-slide-in 0.5s ease 0.1s forwards",
            opacity: 0,
          }}
          onMouseEnter={() => setHeroHovered(true)}
          onMouseLeave={() => setHeroHovered(false)}
        >
          {/* Shimmer sweep on hover */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, oklch(0.9 0.05 200 / 0.06) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              backgroundPosition: heroHovered ? "100% 0" : "-100% 0",
              transition: "background-position 0.6s ease",
            }}
          />
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl icon-glow-teal text-2xl font-bold font-display text-[oklch(0.72_0.17_195)]">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {patient.firstName} {patient.lastName}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="badge-neon rounded-full px-3 py-0.5 text-xs font-medium">
                  {patient.gender}
                </span>
                <span className="text-sm text-muted-foreground">
                  DOB: {patient.dateOfBirth}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div
          className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          style={{
            animation: "fade-slide-in 0.5s ease 0.2s forwards",
            opacity: 0,
          }}
        >
          <InfoCard
            title="Medical History"
            value={patient.medicalHistory || ""}
            icon={FileText}
            iconGlow="icon-glow-teal"
            iconColor="text-[oklch(0.72_0.17_195)]"
            accentColor="oklch(0.72 0.17 195 / 0.3)"
            accentHoverColor="oklch(0.72 0.17 195 / 0.8)"
          />
          <InfoCard
            title="Surgical History"
            value={patient.surgicalHistory || ""}
            icon={Activity}
            iconGlow="icon-glow-blue"
            iconColor="text-[oklch(0.68_0.20_250)]"
            accentColor="oklch(0.68 0.20 250 / 0.3)"
            accentHoverColor="oklch(0.68 0.20 250 / 0.8)"
          />
          <InfoCard
            title="Activity Goals"
            value={patient.activityGoals || ""}
            icon={Calendar}
            iconGlow="icon-glow-green"
            iconColor="text-[oklch(0.68_0.18_155)]"
            accentColor="oklch(0.68 0.18 155 / 0.3)"
            accentHoverColor="oklch(0.68 0.18 155 / 0.8)"
          />
          <InfoCard
            title="Contact Information"
            value={patient.contactInfo || ""}
            icon={User}
            iconGlow="icon-glow-purple"
            iconColor="text-[oklch(0.68_0.20_290)]"
            accentColor="oklch(0.68 0.20 290 / 0.3)"
            accentHoverColor="oklch(0.68 0.20 290 / 0.8)"
          />
        </div>

        <div className="divider-glow mb-6" />

        {/* Tabs */}
        <Tabs defaultValue="assessments" className="space-y-5">
          <TabsList
            data-ocid="patient.tabs"
            className="inline-flex gap-1 rounded-2xl border border-[oklch(0.72_0.17_195/0.15)] bg-[oklch(0.17_0.03_240/0.8)] p-1.5 backdrop-blur flex-wrap"
          >
            <TabsTrigger
              data-ocid="patient.assessments.tab"
              value="assessments"
              className="rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-[oklch(0.72_0.17_195)] data-[state=active]:text-[oklch(0.10_0.03_240)] data-[state=active]:shadow-glow data-[state=active]:scale-[1.03]"
            >
              Assessments
            </TabsTrigger>
            <TabsTrigger
              data-ocid="patient.treatment_plans.tab"
              value="treatment-plans"
              className="rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-[oklch(0.72_0.17_195)] data-[state=active]:text-[oklch(0.10_0.03_240)] data-[state=active]:shadow-glow data-[state=active]:scale-[1.03]"
            >
              Treatment Plans
            </TabsTrigger>
            <TabsTrigger
              data-ocid="patient.therapy_modalities.tab"
              value="therapy-modalities"
              className="flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-[oklch(0.72_0.17_195)] data-[state=active]:text-[oklch(0.10_0.03_240)] data-[state=active]:shadow-glow data-[state=active]:scale-[1.03]"
            >
              <FlameKindling className="h-4 w-4" />
              Therapy Modalities
            </TabsTrigger>
            <TabsTrigger
              data-ocid="patient.voice_scribe.tab"
              value="voice-scribe"
              className="flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-[oklch(0.72_0.17_195)] data-[state=active]:text-[oklch(0.10_0.03_240)] data-[state=active]:shadow-glow data-[state=active]:scale-[1.03]"
            >
              <Mic className="h-4 w-4" />
              Voice Scribe
            </TabsTrigger>
          </TabsList>

          {/* Assessments tab */}
          <TabsContent value="assessments" className="space-y-4">
            <div ref={assessmentRevealRef} className="section-hidden space-y-4">
              <div className="flex items-center justify-between">
                <h2
                  className="heading-underline font-display text-xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, oklch(0.85 0.12 195) 0%, oklch(0.72 0.17 195) 50%, oklch(0.68 0.2 250) 100%)",
                  }}
                >
                  Assessment History
                </h2>
                <Button
                  data-ocid="patient.add_assessment.button"
                  onClick={() => setShowAddAssessment(true)}
                  className="btn-glow gap-2 rounded-xl bg-[oklch(0.72_0.17_195)] text-sm font-semibold text-[oklch(0.10_0.03_240)] hover:bg-[oklch(0.78_0.18_195)]"
                >
                  <Plus className="h-4 w-4" />
                  New Assessment
                </Button>
              </div>

              {!assessments || assessments.length === 0 ? (
                <div
                  data-ocid="patient.assessments.empty_state"
                  className="card-3d flex flex-col items-center justify-center rounded-3xl py-16 text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl icon-glow-teal">
                    <Calendar className="h-8 w-8 text-[oklch(0.72_0.17_195)]" />
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    No assessments yet
                  </p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Create the first assessment for this patient to start
                    tracking their progress.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assessments.map((assessment, idx) => (
                    <div
                      key={assessment.id}
                      data-ocid={`patient.assessments.item.${idx + 1}`}
                      style={{
                        animation: "fade-slide-in 0.4s ease forwards",
                        animationDelay: `${idx * 0.06}s`,
                        opacity: 0,
                      }}
                    >
                      <AssessmentCard assessment={assessment} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Treatment plans tab */}
          <TabsContent value="treatment-plans" className="space-y-4">
            <div ref={plansRevealRef} className="section-hidden space-y-4">
              <div className="flex items-center justify-between">
                <h2
                  className="heading-underline font-display text-xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, oklch(0.80 0.16 155) 0%, oklch(0.68 0.18 155) 100%)",
                  }}
                >
                  Treatment Plans
                </h2>
                <Button
                  data-ocid="patient.add_plan.button"
                  onClick={() => setShowAddTreatmentPlan(true)}
                  className="btn-glow gap-2 rounded-xl bg-[oklch(0.72_0.17_195)] text-sm font-semibold text-[oklch(0.10_0.03_240)] hover:bg-[oklch(0.78_0.18_195)]"
                >
                  <Plus className="h-4 w-4" />
                  New Treatment Plan
                </Button>
              </div>

              {!treatmentPlans || treatmentPlans.length === 0 ? (
                <div
                  data-ocid="patient.plans.empty_state"
                  className="card-3d flex flex-col items-center justify-center rounded-3xl py-16 text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl icon-glow-green">
                    <FileText className="h-8 w-8 text-[oklch(0.68_0.18_155)]" />
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    No treatment plans yet
                  </p>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Create an evidence-based treatment plan tailored to this
                    patient's goals.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {treatmentPlans.map((plan, idx) => (
                    <div
                      key={plan.id}
                      data-ocid={`patient.plans.item.${idx + 1}`}
                      style={{
                        animation: "fade-slide-in 0.4s ease forwards",
                        animationDelay: `${idx * 0.06}s`,
                        opacity: 0,
                      }}
                    >
                      <TreatmentPlanCard plan={plan} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Therapy Modalities tab */}
          <TabsContent value="therapy-modalities" className="space-y-4">
            <TherapyModalitiesTab
              patientId={patientId}
              assessments={assessments}
              patient={patient}
            />
          </TabsContent>

          {/* Voice Scribe tab */}
          <TabsContent value="voice-scribe" className="space-y-4">
            <VoiceClinicalScribe />
          </TabsContent>
        </Tabs>

        <AddAssessmentDialog
          open={showAddAssessment}
          onOpenChange={setShowAddAssessment}
          patientId={patientId}
        />

        <AddTreatmentPlanDialog
          open={showAddTreatmentPlan}
          onOpenChange={setShowAddTreatmentPlan}
          patientId={patientId}
        />
      </div>
    </div>
  );
}
