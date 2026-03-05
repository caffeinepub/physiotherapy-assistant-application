import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  AIPlanInput,
  AIPlanOutput,
  Assessment,
  ClinicalScale,
  PatientProfile,
  PostureAssessmentInput,
  PostureAssessmentReport,
  ProvisionalPhysioImpression,
  TreatmentPlan,
  UserProfile,
} from "../backend";
import type { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
      toast.success("Profile saved successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

// Patient Queries
export function useGetAllPatients() {
  const { actor, isFetching } = useActor();

  return useQuery<PatientProfile[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPatients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPatient(patientId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PatientProfile | null>({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      if (!actor || !patientId) return null;
      return actor.getPatient(patientId);
    },
    enabled: !!actor && !isFetching && !!patientId,
  });
}

export function useAddPatient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: PatientProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addPatient(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient added successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add patient: ${error.message}`);
    },
  });
}

// Assessment Queries
export function useGetPatientAssessments(patientId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Assessment[]>({
    queryKey: ["assessments", patientId],
    queryFn: async () => {
      if (!actor || !patientId) return [];
      return actor.getPatientAssessments(patientId);
    },
    enabled: !!actor && !isFetching && !!patientId,
  });
}

export function useAddAssessment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assessment: Assessment) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addAssessment(assessment);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["assessments", variables.patientId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Assessment saved successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to save assessment: ${error.message}`);
    },
  });
}

// Treatment Plan Queries
export function useGetPatientTreatmentPlans(patientId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<TreatmentPlan[]>({
    queryKey: ["treatmentPlans", patientId],
    queryFn: async () => {
      if (!actor || !patientId) return [];
      return actor.getPatientTreatmentPlans(patientId);
    },
    enabled: !!actor && !isFetching && !!patientId,
  });
}

export function useAddTreatmentPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plan: TreatmentPlan) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addTreatmentPlan(plan);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["treatmentPlans", variables.patientId],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Treatment plan saved successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to save treatment plan: ${error.message}`);
    },
  });
}

// AI Plan Generation
export function useGenerateAIPlan() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (input: AIPlanInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.generateAIPlan(input);
    },
    onSuccess: () => {
      toast.success("AI treatment plan generated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate AI plan: ${error.message}`);
    },
  });
}

// Posture Assessment
export function useSubmitPostureAssessment() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (input: PostureAssessmentInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitPostureAssessment(input);
    },
    onSuccess: () => {
      toast.success("Posture assessment completed successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit posture assessment: ${error.message}`);
    },
  });
}

// Posture Image Processing
export function useProcessPostureImage() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (image: ExternalBlob) => {
      if (!actor) throw new Error("Actor not available");
      return actor.processPostureImage(image);
    },
    onSuccess: () => {
      toast.success("Image analyzed successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to analyze image: ${error.message}`);
    },
  });
}

// Provisional Physiotherapy Impression
export function useGenerateProvisionalImpression() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      patientId,
      functionalDifficulties,
      observedDeviations,
    }: {
      patientId: string;
      functionalDifficulties: string[];
      observedDeviations: string[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.generateProvisionalPhysioImpression(
        patientId,
        functionalDifficulties,
        observedDeviations,
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["provisionalImpressions", variables.patientId],
      });
      toast.success("Provisional impression generated successfully");
    },
    onError: (error: Error) => {
      toast.error(
        `Failed to generate provisional impression: ${error.message}`,
      );
    },
  });
}

export function useGetProvisionalImpressions(patientId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<ProvisionalPhysioImpression[]>({
    queryKey: ["provisionalImpressions", patientId],
    queryFn: async () => {
      if (!actor || !patientId) return [];
      return actor.getProvisionalImpressions(patientId);
    },
    enabled: !!actor && !isFetching && !!patientId,
  });
}

// Clinical Scale Calculation
export function useCalculateClinicalScale() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      scaleName,
      responses,
    }: {
      scaleName: string;
      responses: bigint[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.calculateClinicalScaleScore(scaleName, responses);
    },
  });
}

// Dashboard Query
export function useGetDashboard() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    patientCount: bigint;
    assessmentCount: bigint;
    treatmentPlanCount: bigint;
    aiPlanCount: bigint;
  }>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      if (!actor)
        return {
          patientCount: BigInt(0),
          assessmentCount: BigInt(0),
          treatmentPlanCount: BigInt(0),
          aiPlanCount: BigInt(0),
        };
      return actor.getClinicianDashboard();
    },
    enabled: !!actor && !isFetching,
  });
}
