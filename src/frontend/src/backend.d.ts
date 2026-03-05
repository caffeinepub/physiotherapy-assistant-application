import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface PostureAssessmentInput {
    landmarks: Array<[string, string]>;
    viewType: string;
    alignmentData: Array<[string, string]>;
}
export interface AIPlanInput {
    age: bigint;
    painScore: bigint;
    primaryComplaint: string;
    domain: string;
    patientGoals: string;
    functionalLimitations: string;
    medicalHistory: string;
    gender: string;
    bodyPart: string;
    symptomDuration: string;
}
export interface Deviation {
    name: string;
    description: string;
    severity: bigint;
}
export type ImpressionId = string;
export interface ProvisionalPhysioImpression {
    id: ImpressionId;
    observedDeviations: Array<string>;
    dateCreated: bigint;
    generatedImpression: string;
    functionalDifficulties: Array<string>;
}
export type PatientId = string;
export type ClinicianId = Principal;
export interface ClinicalScale {
    responses: Array<bigint>;
    name: string;
    score: bigint;
    hjiquestions: string;
    interpretation: string;
}
export type AssessmentId = string;
export interface TreatmentPlan {
    id: string;
    dateCreated: bigint;
    patientId: PatientId;
    recommendations: Array<string>;
    impairments: string;
    clinicianId: ClinicianId;
    functionalLimitations: string;
    diagnosis: string;
    goals: string;
    interventions: Array<string>;
}
export interface Assessment {
    id: AssessmentId;
    clinicalScales: Array<ClinicalScale>;
    dateCreated: bigint;
    patientId: PatientId;
    clinicianId: ClinicianId;
    redFlags: Array<string>;
    subjectiveHistory: SubjectiveHistory;
    objectiveTest: ObjectiveTest;
}
export interface PostureAssessmentReport {
    correctiveFocusAreas: Array<string>;
    deviations: Array<Deviation>;
    effectsOnMovement: Array<string>;
    disclaimer: string;
    patientFriendlySummary: string;
    explanations: Array<string>;
}
export interface PatientProfile {
    id: PatientId;
    contactInfo: string;
    activityGoals: string;
    dateOfBirth: string;
    medicalHistory: string;
    gender: string;
    lastName: string;
    surgicalHistory: string;
    firstName: string;
}
export interface ObjectiveTest {
    muscleTesting: string;
    rangeOfMotion: string;
    gaitAssessment: string;
    balanceAssessment: string;
    neurologicalScreening: string;
    cardiopulmonaryScreening: string;
}
export interface SubjectiveHistory {
    aggravatingFactors: string;
    functionalLimitations: string;
    relievingFactors: string;
    onsetHistory: string;
    chiefComplaint: string;
}
export interface AIPlanOutput {
    keyImpairments: string;
    sessionDuration: string;
    functionalProblems: string;
    redFlagReferral: string;
    contraindications: string;
    exerciseList: Array<string>;
    disclaimer: string;
    longTermGoals: string;
    frequency: string;
    shortTermGoals: string;
    precautions: Array<string>;
}
export interface UserProfile {
    name: string;
    credentials: string;
    specialization: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAssessment(assessment: Assessment): Promise<AssessmentId>;
    addPatient(profile: PatientProfile): Promise<void>;
    addTreatmentPlan(plan: TreatmentPlan): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateClinicalScaleScore(scaleName: string, responses: Array<bigint>): Promise<ClinicalScale>;
    generateAIPlan(input: AIPlanInput): Promise<AIPlanOutput>;
    generateProvisionalPhysioImpression(patientId: PatientId, functionalDifficulties: Array<string>, observedDeviations: Array<string>): Promise<ProvisionalPhysioImpression>;
    getAllPatients(): Promise<Array<PatientProfile>>;
    getAllProvisionalImpressions(): Promise<Array<ProvisionalPhysioImpression>>;
    getAssessment(assessmentId: AssessmentId): Promise<Assessment | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClinicianDashboard(): Promise<{
        aiPlanCount: bigint;
        treatmentPlanCount: bigint;
        patientCount: bigint;
        assessmentCount: bigint;
    }>;
    getPatient(patientId: PatientId): Promise<PatientProfile | null>;
    getPatientAssessments(patientId: PatientId): Promise<Array<Assessment>>;
    getPatientTreatmentPlans(patientId: PatientId): Promise<Array<TreatmentPlan>>;
    getProvisionalImpressions(patientId: PatientId): Promise<Array<ProvisionalPhysioImpression>>;
    getTreatmentPlan(planId: string): Promise<TreatmentPlan | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    processPostureImage(image: ExternalBlob): Promise<PostureAssessmentReport>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitPostureAssessment(input: PostureAssessmentInput): Promise<PostureAssessmentReport>;
}
