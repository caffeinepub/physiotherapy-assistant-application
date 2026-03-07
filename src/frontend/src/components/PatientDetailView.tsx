import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ArrowLeft,
  Calendar,
  FileText,
  FlameKindling,
  Plus,
  User,
} from "lucide-react";
import { useState } from "react";
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
}

function InfoCard({
  title,
  value,
  iconGlow,
  iconColor,
  icon: Icon,
}: InfoCardProps) {
  return (
    <div className="card-3d rounded-2xl p-5">
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

export default function PatientDetailView({
  patientId,
  onBack,
}: PatientDetailViewProps) {
  const { data: patient } = useGetPatient(patientId);
  const { data: assessments } = useGetPatientAssessments(patientId);
  const { data: treatmentPlans } = useGetPatientTreatmentPlans(patientId);
  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [showAddTreatmentPlan, setShowAddTreatmentPlan] = useState(false);

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
    <div className="relative min-h-[calc(100vh-8rem)]">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back */}
        <Button
          data-ocid="patient.back_button"
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2 rounded-xl border border-[oklch(0.72_0.17_195/0.15)] bg-[oklch(0.20_0.04_240/0.5)] text-sm hover:bg-[oklch(0.24_0.04_240/0.7)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Patients
        </Button>

        {/* Patient hero card */}
        <div
          data-ocid="patient.profile.card"
          className="mb-6 rounded-3xl border border-[oklch(0.72_0.17_195/0.2)] bg-gradient-to-br from-[oklch(0.20_0.04_238/0.95)] to-[oklch(0.16_0.03_242/0.95)] p-6"
          style={{
            boxShadow:
              "0 1px 0 oklch(0.90 0.02 220 / 0.08) inset, 0 8px 32px oklch(0.05 0.05 240 / 0.5), 0 0 40px oklch(0.72 0.17 195 / 0.08)",
          }}
        >
          <div className="flex items-center gap-5">
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
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            title="Medical History"
            value={patient.medicalHistory || ""}
            icon={FileText}
            iconGlow="icon-glow-teal"
            iconColor="text-[oklch(0.72_0.17_195)]"
          />
          <InfoCard
            title="Surgical History"
            value={patient.surgicalHistory || ""}
            icon={Activity}
            iconGlow="icon-glow-blue"
            iconColor="text-[oklch(0.68_0.20_250)]"
          />
          <InfoCard
            title="Activity Goals"
            value={patient.activityGoals || ""}
            icon={Calendar}
            iconGlow="icon-glow-green"
            iconColor="text-[oklch(0.68_0.18_155)]"
          />
          <InfoCard
            title="Contact Information"
            value={patient.contactInfo || ""}
            icon={User}
            iconGlow="icon-glow-purple"
            iconColor="text-[oklch(0.68_0.20_290)]"
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
              className="rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-[oklch(0.72_0.17_195)] data-[state=active]:text-[oklch(0.10_0.03_240)] data-[state=active]:shadow-glow"
            >
              Assessments
            </TabsTrigger>
            <TabsTrigger
              data-ocid="patient.treatment_plans.tab"
              value="treatment-plans"
              className="rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-[oklch(0.72_0.17_195)] data-[state=active]:text-[oklch(0.10_0.03_240)] data-[state=active]:shadow-glow"
            >
              Treatment Plans
            </TabsTrigger>
            <TabsTrigger
              data-ocid="patient.therapy_modalities.tab"
              value="therapy-modalities"
              className="flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-[oklch(0.72_0.17_195)] data-[state=active]:text-[oklch(0.10_0.03_240)] data-[state=active]:shadow-glow"
            >
              <FlameKindling className="h-4 w-4" />
              Therapy Modalities
            </TabsTrigger>
          </TabsList>

          {/* Assessments tab */}
          <TabsContent value="assessments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">
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
                  Create the first assessment for this patient to start tracking
                  their progress.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {assessments.map((assessment, idx) => (
                  <div
                    key={assessment.id}
                    data-ocid={`patient.assessments.item.${idx + 1}`}
                  >
                    <AssessmentCard assessment={assessment} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Treatment plans tab */}
          <TabsContent value="treatment-plans" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-foreground">
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
                  >
                    <TreatmentPlanCard plan={plan} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Therapy Modalities tab */}
          <TabsContent value="therapy-modalities" className="space-y-4">
            <TherapyModalitiesTab patientId={patientId} />
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
