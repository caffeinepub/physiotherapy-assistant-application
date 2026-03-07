import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ClipboardList,
  FileText,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AddPatientDialog from "../components/AddPatientDialog";
import PatientDetailView from "../components/PatientDetailView";
import PatientsTab from "../components/PatientsTab";
import { useGetAllPatients, useGetDashboard } from "../hooks/useQueries";

// Animated counter hook
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (target === 0 || startedRef.current) return;
    startedRef.current = true;
    const steps = 40;
    const stepMs = duration / steps;
    let current = 0;
    const increment = target / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepMs);
    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  iconGlow: string;
  iconColor: string;
  valueGradient: string;
  trend?: string;
  delay?: number;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconGlow,
  iconColor,
  valueGradient,
  trend,
  delay = 0,
}: StatCardProps) {
  const animatedValue = useCountUp(value);

  return (
    <div
      className="stat-card stat-glow-pulse rounded-2xl p-5 relative"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Corner ping beacon dot */}
      <span
        className="ping-beacon absolute top-3 right-3 h-1.5 w-1.5 rounded-full"
        style={{
          background: "oklch(0.72 0.17 195)",
          boxShadow: "0 0 6px oklch(0.72 0.17 195 / 0.8)",
        }}
      />
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </p>
          <p
            className="mt-2 font-display text-4xl font-bold bg-clip-text text-transparent"
            style={{ backgroundImage: valueGradient }}
          >
            {animatedValue}
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
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return ref;
}

// Demo data shown when in demo mode (matches PatientProfile shape)
const DEMO_PATIENTS: import("../backend").PatientProfile[] = [
  {
    id: "demo-1",
    firstName: "Ahmed",
    lastName: "Al-Rashidi",
    gender: "Male",
    dateOfBirth: "1982-03-15",
    contactInfo: "+971 50 123 4567",
    activityGoals: "Return to walking without pain",
    medicalHistory: "Chronic Low Back Pain – 3 years",
    surgicalHistory: "None",
  },
  {
    id: "demo-2",
    firstName: "Sara",
    lastName: "Johnson",
    gender: "Female",
    dateOfBirth: "1996-07-22",
    contactInfo: "sara.j@email.com",
    activityGoals: "Return to football",
    medicalHistory: "Post-ACL Reconstruction (Left Knee)",
    surgicalHistory: "ACL Reconstruction 2024",
  },
  {
    id: "demo-3",
    firstName: "Mohammed",
    lastName: "Al-Farsi",
    gender: "Male",
    dateOfBirth: "1959-01-10",
    contactInfo: "+966 55 987 6543",
    activityGoals: "Improve walking independence",
    medicalHistory: "Hemiplegia following ischaemic stroke",
    surgicalHistory: "None",
  },
  {
    id: "demo-4",
    firstName: "Fatima",
    lastName: "Al-Zahra",
    gender: "Female",
    dateOfBirth: "1969-11-05",
    contactInfo: "fatima@email.com",
    activityGoals: "Reduce knee pain on stairs",
    medicalHistory: "Bilateral Knee Osteoarthritis – Grade II",
    surgicalHistory: "None",
  },
  {
    id: "demo-5",
    firstName: "Khalid",
    lastName: "Nasser",
    gender: "Male",
    dateOfBirth: "2005-09-18",
    contactInfo: "+973 33 456 7890",
    activityGoals: "Improve posture and reduce back fatigue",
    medicalHistory: "Mild Scoliosis (Cobb angle 18°)",
    surgicalHistory: "None",
  },
];

const DEMO_DASHBOARD = {
  patientCount: BigInt(5),
  assessmentCount: BigInt(12),
  treatmentPlanCount: BigInt(8),
  aiPlanCount: BigInt(6),
};

interface DashboardProps {
  demoMode?: boolean;
}

export default function Dashboard({ demoMode }: DashboardProps) {
  const { data: dashboardData } = useGetDashboard();
  const { data: patientsData } = useGetAllPatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );
  const [showFabAdd, setShowFabAdd] = useState(false);
  const [activeTab, setActiveTab] = useState("patients");

  const tabsRevealRef = useScrollReveal();

  // Use demo data if in demo mode
  const dashboard = demoMode ? DEMO_DASHBOARD : dashboardData;
  const patients = demoMode ? DEMO_PATIENTS : patientsData;

  if (selectedPatientId && !demoMode) {
    return (
      <PatientDetailView
        patientId={selectedPatientId}
        onBack={() => setSelectedPatientId(null)}
      />
    );
  }

  if (selectedPatientId && demoMode) {
    const demoPatient = DEMO_PATIENTS.find((p) => p.id === selectedPatientId);
    // In demo mode, show a simplified patient view
    return (
      <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="relative z-10 max-w-lg text-center px-6">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{
              background: "oklch(0.72 0.17 195 / 0.15)",
              border: "1px solid oklch(0.72 0.17 195 / 0.3)",
            }}
          >
            <Users className="h-10 w-10 text-[oklch(0.72_0.17_195)]" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            {demoPatient
              ? `${demoPatient.firstName} ${demoPatient.lastName}`
              : "Demo Patient"}
          </h2>
          <p className="text-muted-foreground mb-1">
            {demoPatient?.medicalHistory}
          </p>
          <p className="text-sm text-muted-foreground">
            {demoPatient?.gender} · DOB: {demoPatient?.dateOfBirth}
          </p>
          <p className="text-sm text-muted-foreground mt-4 mb-6">
            Full patient details, assessments, therapy plans, and progress
            tracking are available after logging in.
          </p>
          <button
            type="button"
            onClick={() => setSelectedPatientId(null)}
            className="rounded-xl border border-[oklch(0.72_0.17_195/0.3)] px-6 py-2.5 text-sm font-semibold text-[oklch(0.80_0.12_195)] hover:bg-[oklch(0.72_0.17_195/0.1)] transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter relative min-h-[calc(100vh-8rem)]">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      {/* Ambient orbs — reduced opacity for performance */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full blur-3xl opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.17 195 / 0.6) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full blur-3xl opacity-8"
        style={{
          background:
            "radial-gradient(circle, oklch(0.68 0.2 250 / 0.5) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/4 top-1/3 h-64 w-64 rounded-full blur-3xl opacity-5"
        style={{
          background:
            "radial-gradient(circle, oklch(0.75 0.2 300 / 0.5) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[oklch(0.72_0.17_195/0.25)] bg-[oklch(0.72_0.17_195/0.08)] px-3 py-1 text-xs font-semibold text-[oklch(0.80_0.12_195)]">
            <Activity className="h-3 w-3" />
            Clinical Dashboard
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Patient{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.72 0.17 195) 0%, oklch(0.68 0.2 250) 100%)",
              }}
            >
              Overview
            </span>
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
            subtitle={
              demoMode ? "Sample demo records" : "Active patient records"
            }
            icon={Users}
            iconGlow="icon-glow-teal"
            iconColor="text-[oklch(0.72_0.17_195)]"
            valueGradient="linear-gradient(135deg, oklch(0.85 0.15 195) 0%, oklch(0.72 0.17 195) 100%)"
            trend="Active & monitored"
            delay={0}
          />
          <StatCard
            title="Assessments"
            value={dashboard ? Number(dashboard.assessmentCount) : 0}
            subtitle={demoMode ? "Sample evaluations" : "Completed evaluations"}
            icon={ClipboardList}
            iconGlow="icon-glow-blue"
            iconColor="text-[oklch(0.68_0.20_250)]"
            valueGradient="linear-gradient(135deg, oklch(0.80 0.15 250) 0%, oklch(0.68 0.20 250) 100%)"
            trend="Across all domains"
            delay={0.1}
          />
          <StatCard
            title="Treatment Plans"
            value={dashboard ? Number(dashboard.treatmentPlanCount) : 0}
            subtitle={demoMode ? "Sample care plans" : "Active care plans"}
            icon={FileText}
            iconGlow="icon-glow-green"
            iconColor="text-[oklch(0.68_0.18_155)]"
            valueGradient="linear-gradient(135deg, oklch(0.80 0.16 155) 0%, oklch(0.68 0.18 155) 100%)"
            trend="Evidence-based"
            delay={0.2}
          />
          <StatCard
            title="AI Plans"
            value={dashboard ? Number(dashboard.aiPlanCount) : 0}
            subtitle={demoMode ? "Sample AI programs" : "AI-generated programs"}
            icon={Sparkles}
            iconGlow="icon-glow-purple"
            iconColor="text-[oklch(0.68_0.20_290)]"
            valueGradient="linear-gradient(135deg, oklch(0.80 0.18 300) 0%, oklch(0.68 0.20 290) 100%)"
            trend="Personalized outputs"
            delay={0.3}
          />
        </div>

        {/* Glowing divider */}
        <div className="divider-glow mb-6" />

        {/* Tabs */}
        <div ref={tabsRevealRef} className="section-hidden">
          <Tabs
            defaultValue="patients"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-5"
          >
            <TabsList
              data-ocid="dashboard.tabs"
              className="inline-flex gap-1 rounded-2xl border border-[oklch(0.72_0.17_195/0.15)] bg-[oklch(0.17_0.03_240/0.8)] p-1.5 backdrop-blur"
            >
              <TabsTrigger
                data-ocid="dashboard.patients.tab"
                value="patients"
                className="rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-[oklch(0.72_0.17_195)] data-[state=active]:text-[oklch(0.10_0.03_240)] data-[state=active]:shadow-glow data-[state=active]:scale-[1.03]"
              >
                Patients
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patients" className="space-y-4">
              <div className="section-visible">
                <PatientsTab
                  patients={patients || []}
                  onSelectPatient={setSelectedPatientId}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* FAB — Add Patient (only on patients tab, not in demo mode) */}
      {activeTab === "patients" && !demoMode && (
        <>
          <button
            type="button"
            data-ocid="dashboard.fab.button"
            onClick={() => setShowFabAdd(true)}
            aria-label="Add new patient"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-200 hover:scale-110"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.18 195) 0%, oklch(0.72 0.17 195) 100%)",
              boxShadow:
                "0 0 32px oklch(0.72 0.17 195 / 0.55), 0 4px 20px oklch(0.05 0.05 240 / 0.7), inset 0 1px 0 oklch(0.9 0.1 200 / 0.3)",
              color: "oklch(0.10 0.03 240)",
            }}
          >
            {/* Outer pulsing ring */}
            <span
              className="absolute inset-0 rounded-full opacity-50"
              style={{
                border: "2px solid oklch(0.72 0.17 195 / 0.6)",
                animation: "ping-beacon 2s cubic-bezier(0,0,0.2,1) infinite",
              }}
            />
            <Plus className="h-6 w-6 relative z-10" strokeWidth={2.5} />
          </button>
          <AddPatientDialog open={showFabAdd} onOpenChange={setShowFabAdd} />
        </>
      )}
    </div>
  );
}
