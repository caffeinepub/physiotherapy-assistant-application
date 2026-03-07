import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { useMemo, useState } from "react";
import { UserRole } from "./backend";
import AccessRestrictedScreen from "./components/AccessRestrictedScreen";
import Header from "./components/Header";
import ProfileSetupModal from "./components/ProfileSetupModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetCallerUserRole,
} from "./hooks/useQueries";
import AccessManagement from "./pages/AccessManagement";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import { hasValidRedemption } from "./utils/inviteCodes";
import { getUrlParameter } from "./utils/urlParams";

type ActiveView = "dashboard" | "access";

export default function App() {
  const { identity, loginStatus, login } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const { data: callerRole, isLoading: roleLoading } = useGetCallerUserRole();

  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [demoMode, setDemoMode] = useState(false);

  // Read invite code from URL on mount (stable reference, URL doesn't change)
  const initialInviteCode = useMemo(() => getUrlParameter("code") ?? "", []);

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === "initializing";

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // A user is "access restricted" when:
  // 1. They are authenticated
  // 2. Their profile exists (they've registered)
  // 3. Their role is "guest" (blocked / not yet approved)
  // 4. They haven't just redeemed a valid invite code in this session
  const isGuestRole =
    !roleLoading && callerRole !== undefined && callerRole === UserRole.guest;

  const showAccessRestricted =
    isAuthenticated &&
    !profileLoading &&
    isFetched &&
    userProfile !== null &&
    isGuestRole &&
    !hasValidRedemption();

  if (isInitializing) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="relative flex flex-col items-center gap-4">
            <div
              className="absolute h-32 w-32 rounded-full blur-2xl"
              style={{ background: "oklch(0.72 0.17 195 / 0.15)" }}
            />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl icon-glow-teal">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Initializing PhysioAssist...
            </p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Demo mode: show dashboard without authentication
  const showDashboard =
    demoMode ||
    (isAuthenticated && !showAccessRestricted && activeView === "dashboard");
  const showAccessMgmt =
    isAuthenticated && !showAccessRestricted && activeView === "access";
  const showLanding = !isAuthenticated && !demoMode;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="flex min-h-screen flex-col bg-background">
        {(isAuthenticated && !showAccessRestricted) || demoMode ? (
          <Header
            activeView={activeView}
            onNavigateAccess={
              demoMode ? undefined : () => setActiveView("access")
            }
            onNavigateDashboard={() => setActiveView("dashboard")}
            demoMode={demoMode}
            onExitDemo={() => setDemoMode(false)}
          />
        ) : null}
        <main className="flex-1">
          {showLanding ? (
            <LandingPage
              login={login}
              loginStatus={loginStatus}
              onTryDemo={() => setDemoMode(true)}
            />
          ) : showAccessRestricted ? (
            <AccessRestrictedScreen initialCode={initialInviteCode} />
          ) : showAccessMgmt ? (
            <AccessManagement />
          ) : showDashboard ? (
            <Dashboard demoMode={demoMode} />
          ) : null}
        </main>
        {((isAuthenticated && !showAccessRestricted) || demoMode) && (
          <footer className="border-t border-border/30 bg-background/50 backdrop-blur">
            <div className="container mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
              PhysioAssist is a clinical decision-support tool and does not
              replace licensed physiotherapy care.
            </div>
          </footer>
        )}
        {showProfileSetup && <ProfileSetupModal />}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
