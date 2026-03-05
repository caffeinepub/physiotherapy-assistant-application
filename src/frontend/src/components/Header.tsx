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
import { Activity, LogOut, User } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
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
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3" data-ocid="header.logo_link">
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
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
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
