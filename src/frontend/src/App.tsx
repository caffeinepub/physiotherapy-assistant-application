import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { ThemeProvider } from "next-themes";
import Header from "./components/Header";
import ProfileSetupModal from "./components/ProfileSetupModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";

export default function App() {
  const { identity, loginStatus, login } = useInternetIdentity();
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

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="flex min-h-screen flex-col bg-background">
        {isAuthenticated && <Header />}
        <main className="flex-1">
          {!isAuthenticated ? (
            <LandingPage login={login} loginStatus={loginStatus} />
          ) : (
            <Dashboard />
          )}
        </main>
        {isAuthenticated && (
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
