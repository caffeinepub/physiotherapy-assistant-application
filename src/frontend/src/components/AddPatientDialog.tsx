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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAddPatient } from "../hooks/useQueries";

interface AddPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddPatientDialog({
  open,
  onOpenChange,
}: AddPatientDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    contactInfo: "",
    medicalHistory: "",
    surgicalHistory: "",
    activityGoals: "",
  });

  const addPatient = useAddPatient();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPatient.mutate(
      { id: "", ...formData },
      {
        onSuccess: () => {
          setFormData({
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            gender: "",
            contactInfo: "",
            medicalHistory: "",
            surgicalHistory: "",
            activityGoals: "",
          });
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-[oklch(0.72_0.17_195/0.2)] bg-[oklch(0.17_0.03_240/0.98)] backdrop-blur-xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold tracking-tight">
            Add New Patient
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter patient demographic and medical information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Information</Label>
            <Input
              id="contactInfo"
              placeholder="Phone, email, address"
              value={formData.contactInfo}
              onChange={(e) =>
                setFormData({ ...formData, contactInfo: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              placeholder="Relevant medical conditions, medications, allergies"
              value={formData.medicalHistory}
              onChange={(e) =>
                setFormData({ ...formData, medicalHistory: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surgicalHistory">Surgical History</Label>
            <Textarea
              id="surgicalHistory"
              placeholder="Previous surgeries and dates"
              value={formData.surgicalHistory}
              onChange={(e) =>
                setFormData({ ...formData, surgicalHistory: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activityGoals">Activity Goals</Label>
            <Textarea
              id="activityGoals"
              placeholder="Patient's functional and activity goals"
              value={formData.activityGoals}
              onChange={(e) =>
                setFormData({ ...formData, activityGoals: e.target.value })
              }
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              data-ocid="add_patient.cancel_button"
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-[oklch(0.72_0.17_195/0.2)] bg-[oklch(0.20_0.04_240/0.5)] hover:bg-[oklch(0.24_0.04_240/0.7)]"
            >
              Cancel
            </Button>
            <Button
              data-ocid="add_patient.submit_button"
              type="submit"
              disabled={addPatient.isPending}
              className="btn-glow rounded-xl bg-[oklch(0.72_0.17_195)] font-semibold text-[oklch(0.10_0.03_240)] hover:bg-[oklch(0.78_0.18_195)]"
            >
              {addPatient.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Patient
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
