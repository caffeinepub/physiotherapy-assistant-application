import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, LogOut, Shield, User } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsCallerAdmin } from "../hooks/useQueries";

interface HeaderProps {
  activeView?: string;
  onNavigateAccess?: () => void;
  onNavigateDashboard?: () => void;
}

export default function Header({
  activeView,
  onNavigateAccess,
  onNavigateDashboard,
}: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error("Login error:", error);
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header
      data-ocid="header.section"
      className="sticky top-0 z-50 w-full border-b border-[oklch(0.72_0.17_195/0.15)] bg-[oklch(0.13_0.025_240/0.85)] backdrop-blur-xl supports-[backdrop-filter]:bg-[oklch(0.13_0.025_240/0.75)]"
      style={{
        boxShadow:
          "0 1px 0 oklch(0.72 0.17 195 / 0.1), 0 4px 20px oklch(0.05 0.05 240 / 0.4)",
      }}
    >
      {/* Shimmer power line */}
      <div className="shimmer-border-line" />
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button
          type="button"
          onClick={onNavigateDashboard}
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl"
          data-ocid="header.logo_link"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl icon-glow-teal">
            <Activity className="h-5 w-5 text-[oklch(0.72_0.17_195)]" />
          </div>
          <div>
            <span className="font-display text-base font-bold tracking-tight text-foreground">
              PhysioAssist
            </span>
            <span className="ml-1.5 rounded-full border border-[oklch(0.72_0.17_195/0.3)] bg-[oklch(0.72_0.17_195/0.1)] px-1.5 py-0.5 text-[10px] font-semibold text-[oklch(0.80_0.12_195)] uppercase tracking-wide">
              Clinical AI
            </span>
          </div>
        </button>

        {/* Center nav — admin access link */}
        {isAuthenticated && isAdmin && onNavigateAccess && (
          <nav className="hidden sm:flex items-center">
            <button
              type="button"
              data-ocid="access.nav.link"
              onClick={onNavigateAccess}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeView === "access"
                  ? "bg-[oklch(0.72_0.17_195/0.15)] text-[oklch(0.82_0.14_195)] border border-[oklch(0.72_0.17_195/0.3)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-[oklch(0.72_0.17_195/0.08)]"
              }`}
              style={
                activeView === "access"
                  ? { boxShadow: "0 0 16px oklch(0.72 0.17 195 / 0.2)" }
                  : {}
              }
            >
              <Shield className="h-4 w-4" />
              Access
            </button>
          </nav>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Mobile admin access button */}
          {isAuthenticated && isAdmin && onNavigateAccess && (
            <button
              type="button"
              data-ocid="access.nav.link"
              onClick={onNavigateAccess}
              className={`sm:hidden flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all duration-200 ${
                activeView === "access"
                  ? "bg-[oklch(0.72_0.17_195/0.15)] text-[oklch(0.82_0.14_195)] border border-[oklch(0.72_0.17_195/0.3)]"
                  : "text-muted-foreground border border-[oklch(0.5_0.08_240/0.2)] hover:border-[oklch(0.72_0.17_195/0.25)] hover:text-foreground"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              Access
            </button>
          )}

          {isAuthenticated && userProfile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  data-ocid="header.user_dropdown"
                  variant="ghost"
                  className="gap-2.5 rounded-xl border border-[oklch(0.72_0.17_195/0.2)] bg-[oklch(0.20_0.04_240/0.6)] px-3 py-2 hover:bg-[oklch(0.24_0.04_240/0.8)]"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg icon-glow-teal">
                    <User className="h-3.5 w-3.5 text-[oklch(0.72_0.17_195)]" />
                  </div>
                  <span className="hidden text-sm font-medium sm:inline">
                    {userProfile.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-60 rounded-2xl border border-[oklch(0.72_0.17_195/0.2)] bg-[oklch(0.17_0.03_240/0.95)] backdrop-blur-xl"
              >
                <DropdownMenuLabel className="pb-2 pt-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl icon-glow-teal">
                      <User className="h-5 w-5 text-[oklch(0.72_0.17_195)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {userProfile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userProfile.credentials}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userProfile.specialization}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[oklch(0.72_0.17_195/0.1)]" />
                <DropdownMenuItem
                  data-ocid="header.logout_button"
                  onClick={handleAuth}
                  className="mx-1 mb-1 rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              data-ocid="header.login_button"
              onClick={handleAuth}
              disabled={disabled}
              className="btn-glow rounded-xl bg-[oklch(0.72_0.17_195)] px-5 text-sm font-semibold text-[oklch(0.10_0.03_240)] hover:bg-[oklch(0.78_0.18_195)]"
            >
              {loginStatus === "logging-in" ? "Logging in..." : "Login"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
