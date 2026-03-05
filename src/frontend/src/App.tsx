import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import {
  Activity,
  Brain,
  Camera,
  Loader2,
  Shield,
  TrendingUp,
} from "lucide-react";
import { ThemeProvider } from "next-themes";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProfileSetupModal from "./components/ProfileSetupModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useInternetIdentity as useII } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import Dashboard from "./pages/Dashboard";

function LandingPage() {
  const { login, loginStatus } = useII();

  const features = [
    {
      icon: Brain,
      label: "Clinical Reasoning",
      desc: "AI-powered 5-brain assessment engine",
      glow: "icon-glow-teal",
      color: "text-[oklch(0.72_0.17_195)]",
    },
    {
      icon: Camera,
      label: "Posture Analysis",
      desc: "Camera-based postural screening",
      glow: "icon-glow-blue",
      color: "text-[oklch(0.68_0.20_250)]",
    },
    {
      icon: TrendingUp,
      label: "Progress Tracking",
      desc: "Evidence-based outcome measures",
      glow: "icon-glow-green",
      color: "text-[oklch(0.68_0.18_155)]",
    },
    {
      icon: Shield,
      label: "Safety Layer",
      desc: "Red-flag detection & referral triggers",
      glow: "icon-glow-purple",
      color: "text-[oklch(0.68_0.20_290)]",
    },
  ];

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-100" />
      <div className="absolute inset-0 hero-glow" />
      {/* Floating orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[oklch(0.72_0.17_195/0.08)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-[oklch(0.68_0.20_250/0.07)] blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Logo badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[oklch(0.72_0.17_195/0.3)] bg-[oklch(0.72_0.17_195/0.08)] px-4 py-2 text-sm font-medium text-[oklch(0.80_0.12_195)]">
          <Activity className="h-4 w-4" />
          <span>Professional Physiotherapy Platform</span>
        </div>

        {/* Hero icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl icon-glow-teal">
            <Activity className="h-14 w-14 text-[oklch(0.72_0.17_195)]" />
            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-3xl border border-[oklch(0.72_0.17_195/0.2)] scale-110" />
            <div className="absolute inset-0 rounded-3xl border border-[oklch(0.72_0.17_195/0.1)] scale-125" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="mb-4 font-display text-5xl font-bold tracking-tight text-foreground md:text-6xl">
          PhysioAssist
          <br />
          <span className="bg-gradient-to-r from-[oklch(0.72_0.17_195)] to-[oklch(0.68_0.20_250)] bg-clip-text text-transparent">
            Clinical AI
          </span>
        </h1>

        <p className="mb-10 text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
          A comprehensive clinician assistant combining AI-powered assessment,
          posture analysis, and evidence-based treatment planning in one unified
          platform.
        </p>

        {/* Feature pills */}
        <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {features.map(({ icon: Icon, label, desc, glow, color }) => (
            <div key={label} className="card-3d rounded-2xl p-4 text-left">
              <div
                className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${glow}`}
              >
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          data-ocid="landing.login_button"
          onClick={login}
          disabled={loginStatus === "logging-in"}
          size="lg"
          className="btn-glow h-14 rounded-2xl px-10 text-base font-semibold bg-[oklch(0.72_0.17_195)] text-[oklch(0.10_0.03_240)] hover:bg-[oklch(0.78_0.18_195)]"
        >
          {loginStatus === "logging-in" ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Connecting...
            </>
          ) : (
            "Access Dashboard"
          )}
        </Button>

        <p className="mt-4 text-xs text-muted-foreground">
          Secure login via Internet Identity
        </p>

        {/* Disclaimer */}
        <div className="mt-10 rounded-2xl border border-[oklch(0.72_0.17_195/0.15)] bg-[oklch(0.72_0.17_195/0.05)] px-5 py-3">
          <p className="text-xs text-muted-foreground">
            This platform is a clinical decision-support tool and does not
            replace licensed physiotherapy care. Always verify AI-generated
            plans with qualified professionals.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { identity, loginStatus } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === "initializing";
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="relative flex flex-col items-center gap-4">
            <div className="absolute h-32 w-32 rounded-full bg-[oklch(0.72_0.17_195/0.15)] blur-2xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl icon-glow-teal">
              <Loader2 className="h-8 w-8 animate-spin text-[oklch(0.72_0.17_195)]" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Initializing PhysioAssist...
            </p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          {!isAuthenticated ? <LandingPage /> : <Dashboard />}
        </main>
        <Footer />
        {showProfileSetup && <ProfileSetupModal />}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
