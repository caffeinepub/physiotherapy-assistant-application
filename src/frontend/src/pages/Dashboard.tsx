import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ClipboardList,
  FileText,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
      {/* Corner glow dot */}
      <span
        className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full"
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

export default function Dashboard() {
  const { data: dashboard } = useGetDashboard();
  const { data: patients } = useGetAllPatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );

  const tabsRevealRef = useScrollReveal();

  if (selectedPatientId) {
    return (
      <PatientDetailView
        patientId={selectedPatientId}
        onBack={() => setSelectedPatientId(null)}
      />
    );
  }

  return (
    <div className="page-enter relative min-h-[calc(100vh-8rem)]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 hero-glow" />

      {/* Ambient orbs */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.17 195 / 0.6) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full blur-3xl opacity-15"
        style={{
          background:
            "radial-gradient(circle, oklch(0.68 0.2 250 / 0.5) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/4 top-1/3 h-64 w-64 rounded-full blur-3xl opacity-10"
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
            subtitle="Active patient records"
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
            subtitle="Completed evaluations"
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
            subtitle="Active care plans"
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
            subtitle="AI-generated programs"
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
          <Tabs defaultValue="patients" className="space-y-5">
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
    </div>
  );
}
