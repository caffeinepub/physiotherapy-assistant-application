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
import { Calculator, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ClinicalScale } from "../backend";
import { useCalculateClinicalScale } from "../hooks/useQueries";

interface ClinicalScaleFormProps {
  clinicalScales: ClinicalScale[];
  onScalesChange: (scales: ClinicalScale[]) => void;
}

const AVAILABLE_SCALES = [
  {
    value: "SPADI",
    label: "SPADI (Shoulder Pain and Disability Index)",
    domain: "Orthopedic",
  },
  {
    value: "WOMAC",
    label: "WOMAC (Western Ontario McMaster)",
    domain: "Orthopedic",
  },
  {
    value: "LEFS",
    label: "LEFS (Lower Extremity Functional Scale)",
    domain: "Orthopedic",
  },
  {
    value: "FIM",
    label: "FIM (Functional Independence Measure)",
    domain: "Neurological",
  },
  {
    value: "NIH Stroke Scale",
    label: "NIH Stroke Scale",
    domain: "Neurological",
  },
  {
    value: "6MWT",
    label: "6MWT (6-Minute Walk Test)",
    domain: "Cardiopulmonary",
  },
  {
    value: "Borg RPE",
    label: "Borg RPE (Rating of Perceived Exertion)",
    domain: "Cardiopulmonary",
  },
  {
    value: "PedsQL",
    label: "PedsQL (Pediatric Quality of Life)",
    domain: "Pediatric",
  },
  {
    value: "GMFM",
    label: "GMFM (Gross Motor Function Measure)",
    domain: "Pediatric",
  },
  {
    value: "Tinetti",
    label: "Tinetti (Balance and Gait)",
    domain: "Geriatric",
  },
  { value: "TUG", label: "TUG (Timed Up and Go)", domain: "Geriatric" },
];

export default function ClinicalScaleForm({
  clinicalScales,
  onScalesChange,
}: ClinicalScaleFormProps) {
  const [selectedScale, setSelectedScale] = useState("");
  const [responseInput, setResponseInput] = useState("");
  const calculateScale = useCalculateClinicalScale();

  const handleAddScale = () => {
    if (!selectedScale) {
      toast.error("Please select a clinical scale");
      return;
    }

    if (!responseInput.trim()) {
      toast.error("Please enter response values");
      return;
    }

    const responses = responseInput
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.length > 0)
      .map((r) => {
        const num = Number.parseInt(r, 10);
        if (Number.isNaN(num)) {
          throw new Error(`Invalid number: ${r}`);
        }
        return BigInt(num);
      });

    if (responses.length === 0) {
      toast.error("Please enter at least one response value");
      return;
    }

    calculateScale.mutate(
      { scaleName: selectedScale, responses },
      {
        onSuccess: (calculatedScale) => {
          onScalesChange([...clinicalScales, calculatedScale]);
          setSelectedScale("");
          setResponseInput("");
          toast.success("Clinical scale calculated and added");
        },
        onError: (error: Error) => {
          toast.error(`Failed to calculate scale: ${error.message}`);
        },
      },
    );
  };

  const handleRemoveScale = (index: number) => {
    const newScales = clinicalScales.filter((_, i) => i !== index);
    onScalesChange(newScales);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 rounded-lg border p-4">
        <div className="space-y-2">
          <Label htmlFor="scaleSelect">Select Clinical Scale</Label>
          <Select value={selectedScale} onValueChange={setSelectedScale}>
            <SelectTrigger id="scaleSelect">
              <SelectValue placeholder="Choose a validated scale" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_SCALES.map((scale) => (
                <SelectItem key={scale.value} value={scale.value}>
                  {scale.label} ({scale.domain})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="responses">Response Values</Label>
          <Input
            id="responses"
            placeholder="Enter comma-separated values (e.g., 3,4,2,5)"
            value={responseInput}
            onChange={(e) => setResponseInput(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter numeric responses separated by commas
          </p>
        </div>

        <Button
          type="button"
          onClick={handleAddScale}
          disabled={calculateScale.isPending}
          className="w-full"
        >
          <Calculator className="mr-2 h-4 w-4" />
          Calculate and Add Scale
        </Button>
      </div>

      {clinicalScales.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Added Clinical Scales</h4>
          {clinicalScales.map((scale, index) => (
            <Card key={scale.name}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{scale.name}</CardTitle>
                    <CardDescription>
                      Score: {Number(scale.score)} • {scale.interpretation}
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveScale(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Responses: {scale.responses.map((r) => Number(r)).join(", ")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
