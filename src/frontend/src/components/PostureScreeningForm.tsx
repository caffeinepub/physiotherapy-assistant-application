import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  FileText,
  Heart,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import type {
  PostureAssessmentReport,
  ProvisionalPhysioImpression,
} from "../backend";
import { useCamera } from "../camera/useCamera";
import {
  useGenerateProvisionalImpression,
  useProcessPostureImage,
  useSubmitPostureAssessment,
} from "../hooks/useQueries";

interface PostureScreeningFormProps {
  patientId: string;
  functionalLimitations?: string;
  onReportGenerated: (
    report: PostureAssessmentReport,
    impression?: ProvisionalPhysioImpression,
  ) => void;
}

export default function PostureScreeningForm({
  patientId,
  functionalLimitations,
  onReportGenerated,
}: PostureScreeningFormProps) {
  const submitPostureAssessment = useSubmitPostureAssessment();
  const processPostureImage = useProcessPostureImage();
  const generateImpression = useGenerateProvisionalImpression();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [assessmentMode, setAssessmentMode] = useState<"manual" | "image">(
    "image",
  );
  const [viewType, setViewType] = useState<string>("anterior");
  const [landmarks, setLandmarks] = useState<Array<[string, string]>>([]);
  const [alignmentData, setAlignmentData] = useState<Array<[string, string]>>(
    [],
  );
  const [newLandmarkKey, setNewLandmarkKey] = useState("");
  const [newLandmarkValue, setNewLandmarkValue] = useState("");
  const [newAlignmentKey, setNewAlignmentKey] = useState("");
  const [newAlignmentValue, setNewAlignmentValue] = useState("");
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    isActive: cameraActive,
    isSupported: cameraSupported,
    error: cameraError,
    isLoading: cameraLoading,
    startCamera,
    stopCamera,
    capturePhoto,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: "environment",
    width: 1280,
    height: 720,
    quality: 0.9,
  });

  const handleCameraCapture = async () => {
    const photo = await capturePhoto();
    if (photo) {
      setCapturedImage(photo);
      const preview = URL.createObjectURL(photo);
      setImagePreview(preview);
      await stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) {
      setCapturedImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const clearImage = () => {
    setCapturedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageAnalysis = async () => {
    if (!capturedImage) return;

    const arrayBuffer = await capturedImage.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(uint8Array);

    processPostureImage.mutate(blob, {
      onSuccess: async (report) => {
        // Extract deviation names for provisional impression
        const observedDeviations = report.deviations.map((d) => d.name);

        // Parse functional limitations from text input
        const functionalDifficulties = functionalLimitations
          ? functionalLimitations
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line.length > 0)
          : [];

        // Generate provisional impression
        try {
          const impression = await generateImpression.mutateAsync({
            patientId,
            functionalDifficulties,
            observedDeviations,
          });
          onReportGenerated(report, impression);
        } catch (error) {
          // If impression generation fails, still show the report
          console.error("Failed to generate provisional impression:", error);
          onReportGenerated(report);
        }

        clearImage();
      },
    });
  };

  const addLandmark = () => {
    if (newLandmarkKey && newLandmarkValue) {
      setLandmarks([...landmarks, [newLandmarkKey, newLandmarkValue]]);
      setNewLandmarkKey("");
      setNewLandmarkValue("");
    }
  };

  const removeLandmark = (index: number) => {
    setLandmarks(landmarks.filter((_, i) => i !== index));
  };

  const addAlignment = () => {
    if (newAlignmentKey && newAlignmentValue) {
      setAlignmentData([
        ...alignmentData,
        [newAlignmentKey, newAlignmentValue],
      ]);
      setNewAlignmentKey("");
      setNewAlignmentValue("");
    }
  };

  const removeAlignment = (index: number) => {
    setAlignmentData(alignmentData.filter((_, i) => i !== index));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    submitPostureAssessment.mutate(
      {
        viewType,
        landmarks,
        alignmentData,
      },
      {
        onSuccess: async (report) => {
          // Extract deviation names for provisional impression
          const observedDeviations = report.deviations.map((d) => d.name);

          // Parse functional limitations from text input
          const functionalDifficulties = functionalLimitations
            ? functionalLimitations
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0)
            : [];

          // Generate provisional impression
          try {
            const impression = await generateImpression.mutateAsync({
              patientId,
              functionalDifficulties,
              observedDeviations,
            });
            onReportGenerated(report, impression);
          } catch (error) {
            // If impression generation fails, still show the report
            console.error("Failed to generate provisional impression:", error);
            onReportGenerated(report);
          }
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This analysis is a screening tool and does not replace professional
          evaluation.
        </AlertDescription>
      </Alert>

      <Tabs
        value={assessmentMode}
        onValueChange={(v) => setAssessmentMode(v as "manual" | "image")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image">Image Analysis</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="image" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload or Capture Patient Image</CardTitle>
              <CardDescription>
                Take a photo or upload an image for AI-assisted posture analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!capturedImage && !cameraActive && (
                <div className="flex flex-col gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="viewType">View Type *</Label>
                    <Select value={viewType} onValueChange={setViewType}>
                      <SelectTrigger id="viewType">
                        <SelectValue placeholder="Select view type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anterior">
                          Anterior (Front View)
                        </SelectItem>
                        <SelectItem value="lateral">
                          Lateral (Side View)
                        </SelectItem>
                        <SelectItem value="posterior">
                          Posterior (Back View)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {cameraSupported && (
                    <Button
                      type="button"
                      onClick={startCamera}
                      disabled={cameraLoading}
                      className="w-full"
                    >
                      {cameraLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="mr-2 h-4 w-4" />
                      )}
                      Open Camera
                    </Button>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {cameraActive && (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <canvas ref={canvasRef} className="hidden" />

                  {cameraError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{cameraError.message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleCameraCapture}
                      disabled={!cameraActive}
                      className="flex-1"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Photo
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={stopCamera}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {capturedImage && imagePreview && (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <img
                      src={imagePreview}
                      alt="Captured posture"
                      className="h-full w-full object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    type="button"
                    onClick={handleImageAnalysis}
                    disabled={
                      processPostureImage.isPending ||
                      generateImpression.isPending
                    }
                    className="w-full"
                  >
                    {(processPostureImage.isPending ||
                      generateImpression.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Analyze Posture
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <form onSubmit={handleManualSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="viewType-manual">View Type *</Label>
              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger id="viewType-manual">
                  <SelectValue placeholder="Select view type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anterior">
                    Anterior (Front View)
                  </SelectItem>
                  <SelectItem value="lateral">Lateral (Side View)</SelectItem>
                  <SelectItem value="posterior">
                    Posterior (Back View)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Body Landmarks</CardTitle>
                <CardDescription>
                  Add key body landmark coordinates from image analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Landmark name (e.g., shoulder_left)"
                    value={newLandmarkKey}
                    onChange={(e) => setNewLandmarkKey(e.target.value)}
                  />
                  <Input
                    placeholder="Coordinates (e.g., x:120,y:340)"
                    value={newLandmarkValue}
                    onChange={(e) => setNewLandmarkValue(e.target.value)}
                  />
                  <Button type="button" onClick={addLandmark} variant="outline">
                    Add
                  </Button>
                </div>
                {landmarks.length > 0 && (
                  <div className="space-y-2">
                    {landmarks.map(([key, value], index) => (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <span className="text-sm">
                          <strong>{key}:</strong> {value}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLandmark(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Alignment Data</CardTitle>
                <CardDescription>
                  Add alignment measurements and angles from analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Alignment type (e.g., spine_angle)"
                    value={newAlignmentKey}
                    onChange={(e) => setNewAlignmentKey(e.target.value)}
                  />
                  <Input
                    placeholder="Value (e.g., 15 degrees)"
                    value={newAlignmentValue}
                    onChange={(e) => setNewAlignmentValue(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={addAlignment}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
                {alignmentData.length > 0 && (
                  <div className="space-y-2">
                    {alignmentData.map(([key, value], index) => (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-md border p-2"
                      >
                        <span className="text-sm">
                          <strong>{key}:</strong> {value}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAlignment(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={
                submitPostureAssessment.isPending ||
                generateImpression.isPending
              }
              className="w-full"
            >
              {(submitPostureAssessment.isPending ||
                generateImpression.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Generate Posture Assessment Report
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface PostureReportDisplayProps {
  report: PostureAssessmentReport;
  impression?: ProvisionalPhysioImpression;
}

export function PostureReportDisplay({
  report,
  impression,
}: PostureReportDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Provisional Physiotherapy Impression - Featured Section */}
      {impression && (
        <>
          <Card className="border-accent/30 bg-accent/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                <CardTitle>Provisional Physiotherapy Impression</CardTitle>
              </div>
              <CardDescription>
                Clinical interpretation based on observed findings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {impression.generatedImpression}
                </p>
              </div>
            </CardContent>
          </Card>
          <Separator />
        </>
      )}

      {/* Patient-Friendly Summary - Featured Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <CardTitle>Your Posture Assessment Summary</CardTitle>
          </div>
          <CardDescription>
            Understanding your body's alignment in simple terms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {report.patientFriendlySummary.split("\n").map((paragraph) => {
              if (!paragraph.trim()) return null;
              return (
                <p key={paragraph} className="text-sm leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Clinical Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Clinical Details</h3>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Identified Postural Deviations
            </CardTitle>
            <CardDescription>
              Technical findings from the posture screening
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.deviations.length > 0 ? (
              report.deviations.map((deviation) => (
                <div key={deviation.name} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{deviation.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {deviation.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        Number(deviation.severity) > 3
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      Severity: {Number(deviation.severity)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No deviations identified
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Clinical Explanations</CardTitle>
            <CardDescription>
              Professional interpretation of findings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2">
              {report.explanations.map((explanation) => (
                <li key={explanation} className="text-sm">
                  {explanation}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Effects on Movement</CardTitle>
            <CardDescription>
              How these findings may impact daily activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2">
              {report.effectsOnMovement.map((effect) => (
                <li key={effect} className="text-sm">
                  {effect}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Corrective Focus Areas</CardTitle>
            <CardDescription>
              Recommended areas for therapeutic intervention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-2">
              {report.correctiveFocusAreas.map((area) => (
                <li key={area} className="text-sm">
                  {area}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Important Notice</AlertTitle>
        <AlertDescription>{report.disclaimer}</AlertDescription>
      </Alert>
    </div>
  );
}
