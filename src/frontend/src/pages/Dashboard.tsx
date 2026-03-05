import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ClipboardList,
  FileText,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import PatientDetailView from "../components/PatientDetailView";
import PatientsTab from "../components/PatientsTab";
import { useGetAllPatients, useGetDashboard } from "../hooks/useQueries";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ElementType;
  iconGlow: string;
  iconColor: string;
  trend?: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconGlow,
  iconColor,
  trend,
}: StatCardProps) {
  return (
    <div className="stat-card rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 font-display text-4xl font-bold text-foreground">
            {value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconGlow}`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1.5 border-t border-[oklch(0.72_0.17_195/0.1)] pt-3">
          <TrendingUp className="h-3 w-3 text-[oklch(0.68_0.18_155)]" />
          <span className="text-xs font-medium text-[oklch(0.68_0.18_155)]">
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { data: dashboard } = useGetDashboard();
  const { data: patients } = useGetAllPatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );

  if (selectedPatientId) {
    return (
      <PatientDetailView
        patientId={selectedPatientId}
        onBack={() => setSelectedPatientId(null)}
      />
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 hero-glow" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[oklch(0.72_0.17_195/0.25)] bg-[oklch(0.72_0.17_195/0.08)] px-3 py-1 text-xs font-semibold text-[oklch(0.80_0.12_195)]">
            <Activity className="h-3 w-3" />
            Clinical Dashboard
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Patient Overview
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage assessments, posture screenings, and treatment plans
          </p>
        </div>

        {/* Stat cards */}
        <div
          data-ocid="dashboard.stats.section"
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            title="Total Patients"
            value={dashboard ? Number(dashboard.patientCount) : 0}
            subtitle="Active patient records"
            icon={Users}
            iconGlow="icon-glow-teal"
            iconColor="text-[oklch(0.72_0.17_195)]"
            trend="Active & monitored"
          />
          <StatCard
            title="Assessments"
            value={dashboard ? Number(dashboard.assessmentCount) : 0}
            subtitle="Completed evaluations"
            icon={ClipboardList}
            iconGlow="icon-glow-blue"
            iconColor="text-[oklch(0.68_0.20_250)]"
            trend="Across all domains"
          />
          <StatCard
            title="Treatment Plans"
            value={dashboard ? Number(dashboard.treatmentPlanCount) : 0}
            subtitle="Active care plans"
            icon={FileText}
            iconGlow="icon-glow-green"
            iconColor="text-[oklch(0.68_0.18_155)]"
            trend="Evidence-based"
          />
          <StatCard
            title="AI Plans"
            value={dashboard ? Number(dashboard.aiPlanCount) : 0}
            subtitle="AI-generated programs"
            icon={Sparkles}
            iconGlow="icon-glow-purple"
            iconColor="text-[oklch(0.68_0.20_290)]"
            trend="Personalized outputs"
          />
        </div>

        {/* Glowing divider */}
        <div className="divider-glow mb-6" />

        {/* Tabs */}
        <Tabs defaultValue="patients" className="space-y-5">
          <TabsList
            data-ocid="dashboard.tabs"
            className="inline-flex gap-1 rounded-2xl border border-[oklch(0.72_0.17_195/0.15)] bg-[oklch(0.17_0.03_240/0.8)] p-1.5 backdrop-blur"
          >
            <TabsTrigger
              data-ocid="dashboard.patients.tab"
              value="patients"
              className="rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-[oklch(0.72_0.17_195)] data-[state=active]:text-[oklch(0.10_0.03_240)] data-[state=active]:shadow-glow"
            >
              Patients
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-4">
            <PatientsTab
              patients={patients || []}
              onSelectPatient={setSelectedPatientId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
