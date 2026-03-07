import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Lock, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { redeemInviteCode } from "../utils/inviteCodes";

interface AccessRestrictedScreenProps {
  initialCode?: string;
}

export default function AccessRestrictedScreen({
  initialCode = "",
}: AccessRestrictedScreenProps) {
  const { clear } = useInternetIdentity();
  const [code, setCode] = useState(initialCode);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pageRef.current) {
      pageRef.current.classList.add("section-visible");
    }
  }, []);

  const handleRedeem = useCallback(
    async (codeToRedeem?: string) => {
      const target = (codeToRedeem ?? code).trim();
      if (!target) {
        setErrorMsg("Please enter an invite code.");
        setStatus("error");
        return;
      }

      setStatus("loading");
      setErrorMsg("");

      // Small delay to feel responsive
      await new Promise((r) => setTimeout(r, 600));

      const result = redeemInviteCode(target);
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(result.message);
      }
    },
    [code],
  );

  // Auto-redeem if initialCode is provided from URL
  useEffect(() => {
    if (initialCode) {
      handleRedeem(initialCode);
    }
  }, [initialCode, handleRedeem]);

  return (
    <div
      data-ocid="access_restricted.section"
      className="section-hidden relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4"
      ref={pageRef}
    >
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

      {/* Ambient orbs */}
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full blur-3xl opacity-15"
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.17 195 / 0.5) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full blur-3xl opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.62 0.22 25 / 0.5) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.68 0.2 250 / 0.3) 0%, transparent 70%)",
          opacity: 0.08,
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-6 rounded-3xl p-8 text-center"
              data-ocid="access_restricted.success_state"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.2 0.04 238 / 0.95) 0%, oklch(0.16 0.03 242 / 0.95) 100%)",
                border: "1px solid oklch(0.68 0.18 155 / 0.4)",
                backdropFilter: "blur(24px)",
                boxShadow:
                  "0 0 60px oklch(0.68 0.18 155 / 0.15), 0 24px 64px oklch(0.05 0.05 240 / 0.6)",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="flex h-20 w-20 items-center justify-center rounded-2xl"
                style={{
                  background: "oklch(0.68 0.18 155 / 0.15)",
                  border: "1px solid oklch(0.68 0.18 155 / 0.4)",
                  boxShadow:
                    "0 0 32px oklch(0.68 0.18 155 / 0.3), 0 0 80px oklch(0.68 0.18 155 / 0.1)",
                }}
              >
                <CheckCircle2 className="h-9 w-9 text-[oklch(0.78_0.15_155)]" />
              </motion.div>

              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Access Granted!
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your invite code has been redeemed successfully. Click below
                  to proceed to the platform.
                </p>
              </div>

              <Button
                data-ocid="access_restricted.primary_button"
                onClick={() => window.location.reload()}
                className="w-full rounded-2xl bg-[oklch(0.68_0.18_155)] py-3 font-semibold text-[oklch(0.10_0.03_240)] hover:bg-[oklch(0.72_0.18_155)] btn-glow"
                style={{
                  boxShadow:
                    "0 0 24px oklch(0.68 0.18 155 / 0.4), 0 4px 16px oklch(0.05 0.05 240 / 0.4)",
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Enter PhysioAssist
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-7 rounded-3xl p-8"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.2 0.04 238 / 0.95) 0%, oklch(0.16 0.03 242 / 0.95) 100%)",
                border: "1px solid oklch(0.5 0.08 200 / 0.25)",
                backdropFilter: "blur(24px)",
                boxShadow:
                  "0 0 60px oklch(0.72 0.17 195 / 0.08), 0 24px 64px oklch(0.05 0.05 240 / 0.6), 0 1px 0 oklch(0.9 0.02 220 / 0.06) inset",
              }}
            >
              {/* Icon */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="flex h-20 w-20 items-center justify-center rounded-2xl icon-glow-teal"
                style={{
                  boxShadow:
                    "0 0 32px oklch(0.72 0.17 195 / 0.3), 0 0 80px oklch(0.72 0.17 195 / 0.1)",
                }}
              >
                <Lock className="h-9 w-9 text-[oklch(0.72_0.17_195)]" />
              </motion.div>

              {/* Heading */}
              <div className="text-center">
                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                  Access{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, oklch(0.72 0.17 195) 0%, oklch(0.68 0.2 250) 100%)",
                    }}
                  >
                    Restricted
                  </span>
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  PhysioAssist is invite-only. You need an invite link from an
                  administrator to access this platform.
                </p>
              </div>

              {/* Divider */}
              <div className="divider-glow w-full" />

              {/* Code input form */}
              <div className="w-full space-y-4">
                <div>
                  <label
                    htmlFor="invite-code"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    Invite Code
                  </label>
                  <Input
                    id="invite-code"
                    data-ocid="access_restricted.input"
                    placeholder="Enter your invite code..."
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRedeem();
                    }}
                    className="rounded-xl border-[oklch(0.5_0.08_240/0.25)] bg-[oklch(0.16_0.03_242/0.8)] text-sm focus-visible:ring-[oklch(0.72_0.17_195/0.4)]"
                    style={{
                      boxShadow:
                        "0 2px 4px oklch(0.05 0.05 240 / 0.4) inset, 0 1px 0 oklch(0.9 0.02 220 / 0.06)",
                    }}
                  />
                  <AnimatePresence>
                    {status === "error" && errorMsg && (
                      <motion.p
                        data-ocid="access_restricted.error_state"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1.5 text-xs text-[oklch(0.72_0.18_25)]"
                      >
                        {errorMsg}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  data-ocid="access_restricted.submit_button"
                  onClick={() => handleRedeem()}
                  disabled={status === "loading" || !code.trim()}
                  className="w-full rounded-xl bg-[oklch(0.72_0.17_195)] py-2.5 font-semibold text-[oklch(0.10_0.03_240)] hover:bg-[oklch(0.78_0.18_195)] disabled:opacity-50 btn-glow"
                  style={{
                    boxShadow:
                      "0 0 20px oklch(0.72 0.17 195 / 0.35), 0 4px 16px oklch(0.05 0.05 240 / 0.4)",
                  }}
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Verifying...
                    </span>
                  ) : (
                    "Redeem Invite"
                  )}
                </Button>
              </div>

              {/* Sign out link */}
              <button
                type="button"
                data-ocid="access_restricted.secondary_button"
                onClick={() => clear()}
                className="text-xs text-muted-foreground/60 underline underline-offset-2 transition-colors hover:text-muted-foreground"
              >
                Sign out and use a different account
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
