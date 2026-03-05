import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type {
  ClinicalScale,
  PostureAssessmentReport,
  ProvisionalPhysioImpression,
} from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddAssessment } from "../hooks/useQueries";
import ClinicalScaleForm from "./ClinicalScaleForm";
import PostureScreeningForm, {
  PostureReportDisplay,
} from "./PostureScreeningForm";

interface AddAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
}

export default function AddAssessmentDialog({
  open,
  onOpenChange,
  patientId,
}: AddAssessmentDialogProps) {
  const { identity } = useInternetIdentity();
  const addAssessment = useAddAssessment();

  const [subjective, setSubjective] = useState({
    chiefComplaint: "",
    onsetHistory: "",
    aggravatingFactors: "",
    relievingFactors: "",
    functionalLimitations: "",
  });

  const [objective, setObjective] = useState({
    rangeOfMotion: "",
    muscleTesting: "",
    neurologicalScreening: "",
    cardiopulmonaryScreening: "",
    gaitAssessment: "",
    balanceAssessment: "",
  });

  const [clinicalScales, setClinicalScales] = useState<ClinicalScale[]>([]);
  const [redFlags, setRedFlags] = useState("");
  const [postureReport, setPostureReport] =
    useState<PostureAssessmentReport | null>(null);
  const [provisionalImpression, setProvisionalImpression] =
    useState<ProvisionalPhysioImpression | null>(null);

  const handlePostureReportGenerated = (
    report: PostureAssessmentReport,
    impression?: ProvisionalPhysioImpression,
  ) => {
    setPostureReport(report);
    if (impression) {
      setProvisionalImpression(impression);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    const redFlagsArray = redFlags
      .split("\n")
      .map((flag) => flag.trim())
      .filter((flag) => flag.length > 0);

    addAssessment.mutate(
      {
        id: "",
        patientId,
        clinicianId: identity.getPrincipal(),
        dateCreated: BigInt(Date.now() * 1000000),
        subjectiveHistory: subjective,
        objectiveTest: objective,
        clinicalScales,
        redFlags: redFlagsArray,
      },
      {
        onSuccess: () => {
          setSubjective({
            chiefComplaint: "",
            onsetHistory: "",
            aggravatingFactors: "",
            relievingFactors: "",
            functionalLimitations: "",
          });
          setObjective({
            rangeOfMotion: "",
            muscleTesting: "",
            neurologicalScreening: "",
            cardiopulmonaryScreening: "",
            gaitAssessment: "",
            balanceAssessment: "",
          });
          setClinicalScales([]);
          setRedFlags("");
          setPostureReport(null);
          setProvisionalImpression(null);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-[oklch(0.72_0.17_195/0.2)] bg-[oklch(0.17_0.03_240/0.98)] backdrop-blur-xl sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold tracking-tight">
            New Assessment
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complete a comprehensive patient assessment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="subjective" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="subjective">Subjective</TabsTrigger>
              <TabsTrigger value="objective">Objective</TabsTrigger>
              <TabsTrigger value="posture">Posture</TabsTrigger>
              <TabsTrigger value="scales">Scales</TabsTrigger>
              <TabsTrigger value="flags">Red Flags</TabsTrigger>
            </TabsList>

            <TabsContent value="subjective" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
                <Textarea
                  id="chiefComplaint"
                  placeholder="Primary reason for visit"
                  value={subjective.chiefComplaint}
                  onChange={(e) =>
                    setSubjective({
                      ...subjective,
                      chiefComplaint: e.target.value,
                    })
                  }
                  required
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="onsetHistory">Onset History</Label>
                <Textarea
                  id="onsetHistory"
                  placeholder="When and how symptoms began"
                  value={subjective.onsetHistory}
                  onChange={(e) =>
                    setSubjective({
                      ...subjective,
                      onsetHistory: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aggravatingFactors">Aggravating Factors</Label>
                <Textarea
                  id="aggravatingFactors"
                  placeholder="Activities or positions that worsen symptoms"
                  value={subjective.aggravatingFactors}
                  onChange={(e) =>
                    setSubjective({
                      ...subjective,
                      aggravatingFactors: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relievingFactors">Relieving Factors</Label>
                <Textarea
                  id="relievingFactors"
                  placeholder="Activities or positions that improve symptoms"
                  value={subjective.relievingFactors}
                  onChange={(e) =>
                    setSubjective({
                      ...subjective,
                      relievingFactors: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="functionalLimitations">
                  Functional Limitations
                </Label>
                <Textarea
                  id="functionalLimitations"
                  placeholder="Impact on daily activities and function"
                  value={subjective.functionalLimitations}
                  onChange={(e) =>
                    setSubjective({
                      ...subjective,
                      functionalLimitations: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
            </TabsContent>

            <TabsContent value="objective" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rangeOfMotion">Range of Motion</Label>
                <Textarea
                  id="rangeOfMotion"
                  placeholder="Joint-specific ROM measurements"
                  value={objective.rangeOfMotion}
                  onChange={(e) =>
                    setObjective({
                      ...objective,
                      rangeOfMotion: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="muscleTesting">Manual Muscle Testing</Label>
                <Textarea
                  id="muscleTesting"
                  placeholder="Muscle strength grades (0-5)"
                  value={objective.muscleTesting}
                  onChange={(e) =>
                    setObjective({
                      ...objective,
                      muscleTesting: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neurologicalScreening">
                  Neurological Screening
                </Label>
                <Textarea
                  id="neurologicalScreening"
                  placeholder="Reflexes, sensation, coordination"
                  value={objective.neurologicalScreening}
                  onChange={(e) =>
                    setObjective({
                      ...objective,
                      neurologicalScreening: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardiopulmonaryScreening">
                  Cardiopulmonary Screening
                </Label>
                <Textarea
                  id="cardiopulmonaryScreening"
                  placeholder="Heart rate, blood pressure, respiratory rate"
                  value={objective.cardiopulmonaryScreening}
                  onChange={(e) =>
                    setObjective({
                      ...objective,
                      cardiopulmonaryScreening: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gaitAssessment">Gait Assessment</Label>
                <Textarea
                  id="gaitAssessment"
                  placeholder="Gait pattern observations"
                  value={objective.gaitAssessment}
                  onChange={(e) =>
                    setObjective({
                      ...objective,
                      gaitAssessment: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balanceAssessment">Balance Assessment</Label>
                <Textarea
                  id="balanceAssessment"
                  placeholder="Static and dynamic balance findings"
                  value={objective.balanceAssessment}
                  onChange={(e) =>
                    setObjective({
                      ...objective,
                      balanceAssessment: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
            </TabsContent>

            <TabsContent value="posture" className="space-y-4">
              {!postureReport ? (
                <PostureScreeningForm
                  patientId={patientId}
                  functionalLimitations={subjective.functionalLimitations}
                  onReportGenerated={handlePostureReportGenerated}
                />
              ) : (
                <div className="space-y-4">
                  <PostureReportDisplay
                    report={postureReport}
                    impression={provisionalImpression || undefined}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPostureReport(null);
                      setProvisionalImpression(null);
                    }}
                    className="w-full"
                  >
                    Generate New Assessment
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="scales" className="space-y-4">
              <ClinicalScaleForm
                clinicalScales={clinicalScales}
                onScalesChange={setClinicalScales}
              />
            </TabsContent>

            <TabsContent value="flags" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="redFlags">Red Flags</Label>
                <Textarea
                  id="redFlags"
                  placeholder="Enter each red flag on a new line"
                  value={redFlags}
                  onChange={(e) => setRedFlags(e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  Document any concerning findings that may require immediate
                  attention or referral
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addAssessment.isPending}>
              {addAssessment.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Assessment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
