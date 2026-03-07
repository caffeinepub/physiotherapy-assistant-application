import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSaveCallerUserProfile } from "../hooks/useQueries";

export default function ProfileSetupModal() {
  const [name, setName] = useState("");
  const [credentials, setCredentials] = useState("");
  const [specialization, setSpecialization] = useState("");
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && credentials.trim() && specialization.trim()) {
      saveProfile.mutate({
        name: name.trim(),
        credentials: credentials.trim(),
        specialization: specialization.trim(),
      });
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent
        data-ocid="profile.dialog"
        className="rounded-3xl border-[oklch(0.72_0.17_195/0.25)] bg-[oklch(0.17_0.03_240/0.98)] backdrop-blur-xl sm:max-w-md"
        style={{
          boxShadow:
            "0 0 40px oklch(0.72 0.17 195 / 0.12), 0 24px 64px oklch(0.05 0.05 240 / 0.6)",
        }}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Welcome icon badge */}
        <div className="flex justify-center pt-2 pb-1">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl icon-glow-teal"
            style={{
              boxShadow:
                "0 0 32px oklch(0.72 0.17 195 / 0.3), 0 0 80px oklch(0.72 0.17 195 / 0.1)",
            }}
          >
            <Activity className="h-8 w-8 text-[oklch(0.72_0.17_195)]" />
          </div>
        </div>

        <DialogHeader className="text-center">
          <DialogTitle className="font-display text-2xl font-bold tracking-tight">
            Welcome to PhysioAssist!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            You're in! Complete your clinician profile to continue.
          </DialogDescription>
        </DialogHeader>

        {/* Form with soft teal glow border */}
        <form
          onSubmit={handleSubmit}
          className="mt-2 space-y-4 rounded-2xl p-4"
          style={{
            border: "1px solid oklch(0.72 0.17 195 / 0.18)",
            background: "oklch(0.15 0.03 240 / 0.5)",
            boxShadow: "0 0 20px oklch(0.72 0.17 195 / 0.06) inset",
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              data-ocid="profile.name.input"
              placeholder="Dr. Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl border-[oklch(0.5_0.08_240/0.25)] bg-[oklch(0.16_0.03_242/0.8)] focus-visible:ring-[oklch(0.72_0.17_195/0.4)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credentials">Credentials *</Label>
            <Input
              id="credentials"
              data-ocid="profile.credentials.input"
              placeholder="PT, DPT, OCS"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              required
              className="rounded-xl border-[oklch(0.5_0.08_240/0.25)] bg-[oklch(0.16_0.03_242/0.8)] focus-visible:ring-[oklch(0.72_0.17_195/0.4)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization *</Label>
            <Input
              id="specialization"
              data-ocid="profile.specialization.input"
              placeholder="Orthopedic Physical Therapy"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
              className="rounded-xl border-[oklch(0.5_0.08_240/0.25)] bg-[oklch(0.16_0.03_242/0.8)] focus-visible:ring-[oklch(0.72_0.17_195/0.4)]"
            />
          </div>
          <Button
            type="submit"
            data-ocid="profile.submit_button"
            className="btn-glow w-full rounded-xl bg-[oklch(0.72_0.17_195)] font-semibold text-[oklch(0.10_0.03_240)] hover:bg-[oklch(0.78_0.18_195)]"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {saveProfile.isPending ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
