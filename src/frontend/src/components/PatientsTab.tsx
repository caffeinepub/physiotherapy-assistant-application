import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Plus, Search, User } from "lucide-react";
import { useState } from "react";
import type { PatientProfile } from "../backend";
import AddPatientDialog from "./AddPatientDialog";

interface PatientsTabProps {
  patients: PatientProfile[];
  onSelectPatient: (patientId: string) => void;
}

export default function PatientsTab({
  patients,
  onSelectPatient,
}: PatientsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.firstName.toLowerCase().includes(query) ||
      patient.lastName.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            data-ocid="patients.search_input"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl border-[oklch(0.72_0.17_195/0.2)] bg-[oklch(0.17_0.03_240/0.8)] pl-10 backdrop-blur focus:border-[oklch(0.72_0.17_195/0.5)] focus:ring-[oklch(0.72_0.17_195/0.3)]"
          />
        </div>
        <Button
          data-ocid="patients.add_patient.button"
          onClick={() => setShowAddDialog(true)}
          className="btn-glow gap-2 rounded-xl bg-[oklch(0.72_0.17_195)] text-sm font-semibold text-[oklch(0.10_0.03_240)] hover:bg-[oklch(0.78_0.18_195)]"
        >
          <Plus className="h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Empty state */}
      {filteredPatients.length === 0 ? (
        <div
          data-ocid="patients.list.empty_state"
          className="card-3d flex flex-col items-center justify-center rounded-3xl py-16 text-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl icon-glow-teal">
            <User className="h-8 w-8 text-[oklch(0.72_0.17_195)]" />
          </div>
          <p className="text-base font-semibold text-foreground">
            {searchQuery ? "No patients found" : "No patients yet"}
          </p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            {searchQuery
              ? "Try a different search term."
              : "Add your first patient to begin tracking assessments and treatment plans."}
          </p>
          {!searchQuery && (
            <Button
              data-ocid="patients.empty_add.button"
              onClick={() => setShowAddDialog(true)}
              className="btn-glow mt-5 gap-2 rounded-xl bg-[oklch(0.72_0.17_195)] text-sm font-semibold text-[oklch(0.10_0.03_240)] hover:bg-[oklch(0.78_0.18_195)]"
            >
              <Plus className="h-4 w-4" />
              Add First Patient
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient, idx) => {
            const initials =
              `${patient.firstName?.[0] ?? ""}${patient.lastName?.[0] ?? ""}`.toUpperCase();
            return (
              <button
                type="button"
                key={patient.id}
                data-ocid={`patients.list.item.${idx + 1}`}
                onClick={() => onSelectPatient(patient.id)}
                className="card-3d group w-full rounded-2xl p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.72_0.17_195/0.6)]"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl icon-glow-teal font-display text-base font-bold text-[oklch(0.72_0.17_195)]">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base font-semibold text-foreground">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {patient.gender} &bull; DOB: {patient.dateOfBirth}
                    </p>
                    {patient.activityGoals && (
                      <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">
                        {patient.activityGoals}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[oklch(0.72_0.17_195)]" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      <AddPatientDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
}
