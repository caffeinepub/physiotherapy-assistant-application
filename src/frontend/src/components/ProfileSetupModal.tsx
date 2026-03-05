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
import { Loader2 } from "lucide-react";
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
        className="rounded-3xl border-[oklch(0.72_0.17_195/0.2)] bg-[oklch(0.17_0.03_240/0.98)] backdrop-blur-xl sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold tracking-tight">
            Complete Your Profile
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Please provide your professional information to continue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Dr. Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="credentials">Credentials *</Label>
            <Input
              id="credentials"
              placeholder="PT, DPT, OCS"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization *</Label>
            <Input
              id="specialization"
              placeholder="Orthopedic Physical Therapy"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
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
            Save Profile
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
