import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2, Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import type { AIPlanOutput } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddTreatmentPlan,
  useGenerateAIPlan,
  useGetPatient,
} from "../hooks/useQueries";

interface AddTreatmentPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
}

export default function AddTreatmentPlanDialog({
  open,
  onOpenChange,
  patientId,
}: AddTreatmentPlanDialogProps) {
  const { identity } = useInternetIdentity();
  const { data: patient } = useGetPatient(patientId);
  const addTreatmentPlan = useAddTreatmentPlan();
  const generateAIPlan = useGenerateAIPlan();

  // Manual entry state
  const [diagnosis, setDiagnosis] = useState("");
  const [impairments, setImpairments] = useState("");
  const [goals, setGoals] = useState("");
  const [functionalLimitations, setFunctionalLimitations] = useState("");
  const [interventions, setInterventions] = useState<string[]>([""]);
  const [recommendations, setRecommendations] = useState<string[]>([""]);

  // AI input state
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [primaryComplaint, setPrimaryComplaint] = useState("");
  const [painScore, setPainScore] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [symptomDuration, setSymptomDuration] = useState("");
  const [aiFunctionalLimitations, setAiFunctionalLimitations] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [domain, setDomain] = useState("");
  const [patientGoals, setPatientGoals] = useState("");

  // AI output state
  const [aiPlan, setAiPlan] = useState<AIPlanOutput | null>(null);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    const filteredInterventions = interventions.filter(
      (i) => i.trim().length > 0,
    );
    const filteredRecommendations = recommendations.filter(
      (r) => r.trim().length > 0,
    );

    addTreatmentPlan.mutate(
      {
        id: "",
        patientId,
        clinicianId: identity.getPrincipal(),
        dateCreated: BigInt(Date.now() * 1000000),
        diagnosis,
        impairments,
        goals,
        functionalLimitations,
        interventions: filteredInterventions,
        recommendations: filteredRecommendations,
      },
      {
        onSuccess: () => {
          resetManualForm();
          onOpenChange(false);
        },
      },
    );
  };

  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    generateAIPlan.mutate(
      {
        age: BigInt(age),
        gender,
        primaryComplaint,
        painScore: BigInt(painScore),
        bodyPart,
        symptomDuration,
        functionalLimitations: aiFunctionalLimitations,
        medicalHistory,
        domain,
        patientGoals,
      },
      {
        onSuccess: (data) => {
          setAiPlan(data);
        },
      },
    );
  };

  const handleSaveAIPlan = () => {
    if (!identity || !aiPlan) return;

    // Convert AI plan to treatment plan format
    const planInterventions = aiPlan.exerciseList;
    const planRecommendations = [
      `Frequency: ${aiPlan.frequency}`,
      `Session Duration: ${aiPlan.sessionDuration}`,
      ...aiPlan.precautions,
    ];

    addTreatmentPlan.mutate(
      {
        id: "",
        patientId,
        clinicianId: identity.getPrincipal(),
        dateCreated: BigInt(Date.now() * 1000000),
        diagnosis: primaryComplaint,
        impairments: aiPlan.keyImpairments,
        goals: `${aiPlan.shortTermGoals}\n\n${aiPlan.longTermGoals}`,
        functionalLimitations: aiPlan.functionalProblems,
        interventions: planInterventions,
        recommendations: planRecommendations,
      },
      {
        onSuccess: () => {
          resetAIForm();
          setAiPlan(null);
          onOpenChange(false);
        },
      },
    );
  };

  const resetManualForm = () => {
    setDiagnosis("");
    setImpairments("");
    setGoals("");
    setFunctionalLimitations("");
    setInterventions([""]);
    setRecommendations([""]);
  };

  const resetAIForm = () => {
    setAge("");
    setGender("");
    setPrimaryComplaint("");
    setPainScore("");
    setBodyPart("");
    setSymptomDuration("");
    setAiFunctionalLimitations("");
    setMedicalHistory("");
    setDomain("");
    setPatientGoals("");
  };

  const addIntervention = () => {
    setInterventions([...interventions, ""]);
  };

  const removeIntervention = (index: number) => {
    setInterventions(interventions.filter((_, i) => i !== index));
  };

  const updateIntervention = (index: number, value: string) => {
    const newInterventions = [...interventions];
    newInterventions[index] = value;
    setInterventions(newInterventions);
  };

  const addRecommendation = () => {
    setRecommendations([...recommendations, ""]);
  };

  const removeRecommendation = (index: number) => {
    setRecommendations(recommendations.filter((_, i) => i !== index));
  };

  const updateRecommendation = (index: number, value: string) => {
    const newRecommendations = [...recommendations];
    newRecommendations[index] = value;
    setRecommendations(newRecommendations);
  };

  const prefillFromPatient = () => {
    if (patient) {
      setGender(patient.gender);
      setMedicalHistory(patient.medicalHistory);
      setPatientGoals(patient.activityGoals);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-[oklch(0.72_0.17_195/0.2)] bg-[oklch(0.17_0.03_240/0.98)] backdrop-blur-xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold tracking-tight">
            New Treatment Plan
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a treatment plan manually or use AI assistance to generate
            one.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Primary Diagnosis *</Label>
                <Input
                  id="diagnosis"
                  placeholder="e.g., Rotator cuff tendinopathy"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="impairments">Identified Impairments</Label>
                <Textarea
                  id="impairments"
                  placeholder="List key impairments affecting function"
                  value={impairments}
                  onChange={(e) => setImpairments(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Patient Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="Short-term and long-term functional goals"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="functionalLimitations">
                  Functional Limitations
                </Label>
                <Textarea
                  id="functionalLimitations"
                  placeholder="Current functional limitations"
                  value={functionalLimitations}
                  onChange={(e) => setFunctionalLimitations(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Interventions</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addIntervention}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {interventions.map((intervention, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: mutable list with no stable id
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="e.g., Therapeutic exercises for shoulder strengthening"
                        value={intervention}
                        onChange={(e) =>
                          updateIntervention(index, e.target.value)
                        }
                      />
                      {interventions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIntervention(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Evidence-Based Recommendations</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRecommendation}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {recommendations.map((recommendation, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: mutable list with no stable id
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="e.g., Home exercise program 3x daily"
                        value={recommendation}
                        onChange={(e) =>
                          updateRecommendation(index, e.target.value)
                        }
                      />
                      {recommendations.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRecommendation(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={addTreatmentPlan.isPending}>
                  {addTreatmentPlan.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Treatment Plan
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            {!aiPlan ? (
              <form onSubmit={handleAIGenerate} className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={prefillFromPatient}
                  >
                    Prefill from Patient Record
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="e.g., 45"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={gender} onValueChange={setGender} required>
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
                  <Label htmlFor="primaryComplaint">Primary Complaint *</Label>
                  <Input
                    id="primaryComplaint"
                    placeholder="e.g., Shoulder pain and stiffness"
                    value={primaryComplaint}
                    onChange={(e) => setPrimaryComplaint(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="painScore">Pain Score (0-10) *</Label>
                    <Input
                      id="painScore"
                      type="number"
                      min="0"
                      max="10"
                      placeholder="0-10"
                      value={painScore}
                      onChange={(e) => setPainScore(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bodyPart">Affected Body Part *</Label>
                    <Input
                      id="bodyPart"
                      placeholder="e.g., shoulder, knee, back"
                      value={bodyPart}
                      onChange={(e) => setBodyPart(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptomDuration">
                    Duration of Symptoms *
                  </Label>
                  <Input
                    id="symptomDuration"
                    placeholder="e.g., 3 months, 2 weeks"
                    value={symptomDuration}
                    onChange={(e) => setSymptomDuration(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain">Domain *</Label>
                  <Select value={domain} onValueChange={setDomain} required>
                    <SelectTrigger id="domain">
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Orthopedic">Orthopedic</SelectItem>
                      <SelectItem value="Neurological">Neurological</SelectItem>
                      <SelectItem value="Cardiopulmonary">
                        Cardiopulmonary
                      </SelectItem>
                      <SelectItem value="Pediatric">Pediatric</SelectItem>
                      <SelectItem value="Geriatric">Geriatric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiFunctionalLimitations">
                    Functional Limitations *
                  </Label>
                  <Textarea
                    id="aiFunctionalLimitations"
                    placeholder="e.g., Difficulty reaching overhead, unable to lift objects"
                    value={aiFunctionalLimitations}
                    onChange={(e) => setAiFunctionalLimitations(e.target.value)}
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">Medical History</Label>
                  <Textarea
                    id="medicalHistory"
                    placeholder="Relevant medical history"
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientGoals">Patient Goals *</Label>
                  <Textarea
                    id="patientGoals"
                    placeholder="e.g., Return to playing tennis, reduce pain during daily activities"
                    value={patientGoals}
                    onChange={(e) => setPatientGoals(e.target.value)}
                    rows={2}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={generateAIPlan.isPending}>
                    {generateAIPlan.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Plan
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">
                    {aiPlan.disclaimer}
                  </AlertDescription>
                </Alert>

                {aiPlan.redFlagReferral && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Red Flag Alert:</strong> {aiPlan.redFlagReferral}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3 rounded-lg border p-4">
                  <div>
                    <h4 className="mb-1 font-semibold">Key Impairments</h4>
                    <p className="text-sm text-muted-foreground">
                      {aiPlan.keyImpairments}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-1 font-semibold">Functional Problems</h4>
                    <p className="text-sm text-muted-foreground">
                      {aiPlan.functionalProblems}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-1 font-semibold">Short-Term Goals</h4>
                    <p className="text-sm text-muted-foreground">
                      {aiPlan.shortTermGoals}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-1 font-semibold">Long-Term Goals</h4>
                    <p className="text-sm text-muted-foreground">
                      {aiPlan.longTermGoals}
                    </p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <h4 className="mb-1 font-semibold">Frequency</h4>
                      <p className="text-sm text-muted-foreground">
                        {aiPlan.frequency}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-1 font-semibold">Session Duration</h4>
                      <p className="text-sm text-muted-foreground">
                        {aiPlan.sessionDuration}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-1 font-semibold">Exercise List</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {aiPlan.exerciseList.map((exercise) => (
                        <li key={exercise}>{exercise}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="mb-1 font-semibold">Precautions</h4>
                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {aiPlan.precautions.map((precaution) => (
                        <li key={precaution}>{precaution}</li>
                      ))}
                    </ul>
                  </div>

                  {aiPlan.contraindications && (
                    <div>
                      <h4 className="mb-1 font-semibold">Contraindications</h4>
                      <p className="text-sm text-muted-foreground">
                        {aiPlan.contraindications}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAiPlan(null);
                      resetAIForm();
                    }}
                  >
                    Generate New Plan
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveAIPlan}
                    disabled={addTreatmentPlan.isPending}
                  >
                    {addTreatmentPlan.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save to Patient Record
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
