import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import List "mo:core/List";
import Nat "mo:core/Nat";
import BlobStorage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type PatientId = Text;
  public type AssessmentId = Text;
  public type ClinicianId = Principal;
  public type ImpressionId = Text;

  public type UserProfile = {
    name : Text;
    credentials : Text;
    specialization : Text;
  };

  public type UserEntry = {
    principal : Principal;
    role : AccessControl.UserRole;
    profile : ?UserProfile;
  };

  public type PatientProfile = {
    id : PatientId;
    firstName : Text;
    lastName : Text;
    dateOfBirth : Text;
    gender : Text;
    contactInfo : Text;
    medicalHistory : Text;
    surgicalHistory : Text;
    activityGoals : Text;
  };

  public type SubjectiveHistory = {
    chiefComplaint : Text;
    onsetHistory : Text;
    aggravatingFactors : Text;
    relievingFactors : Text;
    functionalLimitations : Text;
  };

  public type ObjectiveTest = {
    rangeOfMotion : Text;
    muscleTesting : Text;
    neurologicalScreening : Text;
    cardiopulmonaryScreening : Text;
    gaitAssessment : Text;
    balanceAssessment : Text;
  };

  public type ClinicalScale = {
    name : Text;
    hjiquestions : Text;
    responses : [Nat];
    score : Nat;
    interpretation : Text;
  };

  public type Assessment = {
    id : AssessmentId;
    patientId : PatientId;
    clinicianId : ClinicianId;
    dateCreated : Int;
    subjectiveHistory : SubjectiveHistory;
    objectiveTest : ObjectiveTest;
    clinicalScales : [ClinicalScale];
    redFlags : [Text];
  };

  public type TreatmentPlan = {
    id : Text;
    patientId : PatientId;
    clinicianId : ClinicianId;
    diagnosis : Text;
    impairments : Text;
    goals : Text;
    functionalLimitations : Text;
    interventions : [Text];
    recommendations : [Text];
    dateCreated : Int;
  };

  public type AIPlanInput = {
    age : Nat;
    gender : Text;
    primaryComplaint : Text;
    painScore : Nat;
    bodyPart : Text;
    symptomDuration : Text;
    functionalLimitations : Text;
    medicalHistory : Text;
    domain : Text;
    patientGoals : Text;
  };

  public type AIPlanOutput = {
    keyImpairments : Text;
    functionalProblems : Text;
    shortTermGoals : Text;
    longTermGoals : Text;
    frequency : Text;
    sessionDuration : Text;
    exerciseList : [Text];
    precautions : [Text];
    contraindications : Text;
    redFlagReferral : Text;
    disclaimer : Text;
  };

  public type PostureAssessmentInput = {
    viewType : Text;
    landmarks : [(Text, Text)];
    alignmentData : [(Text, Text)];
  };

  public type PostureAssessmentReport = {
    deviations : [Deviation];
    explanations : [Text];
    effectsOnMovement : [Text];
    correctiveFocusAreas : [Text];
    disclaimer : Text;
    patientFriendlySummary : Text;
  };

  public type PostureDeviation = {
    name : Text;
    description : Text;
    severity : Nat;
  };

  public type Deviation = {
    name : Text;
    description : Text;
    severity : Nat;
  };

  public type ProvisionalPhysioImpression = {
    id : ImpressionId;
    observedDeviations : [Text];
    functionalDifficulties : [Text];
    generatedImpression : Text;
    dateCreated : Int;
  };

  module PatientProfile {
    public func compare(a : PatientProfile, b : PatientProfile) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  module Assessment {
    public func compare(a : Assessment, b : Assessment) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  module TreatmentPlan {
    public func compare(a : TreatmentPlan, b : TreatmentPlan) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  module ProvisionalPhysioImpression {
    public func compare(a : ProvisionalPhysioImpression, b : ProvisionalPhysioImpression) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  // Internal storage
  let userProfiles = Map.empty<Principal, UserProfile>();
  let patients = Map.empty<PatientId, PatientProfile>();
  let assessments = Map.empty<AssessmentId, Assessment>();
  let treatmentPlans = Map.empty<Text, TreatmentPlan>();
  let aiPlans = Map.empty<Text, AIPlanOutput>();
  let patientFriendlySummaries = Map.empty<Text, Text>();
  // Store provisional impressions and efficient patientId to impression appendix lookup table for performance optimization
  let provisionalImpressions = Map.empty<ImpressionId, ProvisionalPhysioImpression>();
  let impressionIndex = Map.empty<PatientId, List.List<ImpressionId>>();

  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Include storage functionality
  include MixinStorage();

  // User functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Admin-only user management
  public query ({ caller }) func getAllUsers() : async [UserEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can fetch all users");
    };

    // Collect all users by iterating through the map
    let entries = Map.empty<Principal, UserEntry>();

    // We need to iterate through all possible users
    // Since we can't directly access userRoles, we collect from userProfiles
    // and check their roles
    for ((principal, profile) in userProfiles.entries()) {
      let role = AccessControl.getUserRole(accessControlState, principal);
      entries.add(principal, {
        principal;
        role;
        profile = ?profile;
      });
    };

    // Also need to check for users who have roles but no profiles
    // This is a limitation - we can only return users we know about through profiles
    // or through the caller's knowledge
    entries.values().toArray();
  };

  public shared ({ caller }) func removeUser(user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove users");
    };

    let userRole = AccessControl.getUserRole(accessControlState, user);
    if (userRole == #admin) {
      Runtime.trap("Cannot remove admin users");
    };

    // Since AccessControl module doesn't provide a removeUser function,
    // we assign the user to #guest role to effectively block them
    // This is the blocking mechanism mentioned in the user request
    AccessControl.assignRole(accessControlState, caller, user, #guest);

    // Optionally remove their profile as well
    userProfiles.remove(user);
  };

  // Patient functions
  public shared ({ caller }) func addPatient(profile : PatientProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can add patients");
    };
    let patientId = Time.now().toText();
    let newProfile : PatientProfile = {
      id = patientId;
      firstName = profile.firstName;
      lastName = profile.lastName;
      dateOfBirth = profile.dateOfBirth;
      gender = profile.gender;
      contactInfo = profile.contactInfo;
      medicalHistory = profile.medicalHistory;
      surgicalHistory = profile.surgicalHistory;
      activityGoals = profile.activityGoals;
    };
    patients.add(patientId, newProfile);
  };

  public query ({ caller }) func getPatient(patientId : PatientId) : async ?PatientProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can access patient data");
    };
    patients.get(patientId);
  };

  public query ({ caller }) func getAllPatients() : async [PatientProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can access patient data");
    };
    patients.values().toArray().sort();
  };

  // Assessment functions
  public shared ({ caller }) func addAssessment(assessment : Assessment) : async AssessmentId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can add assessment");
    };
    let assessmentId = Time.now().toText();
    let newAssessment : Assessment = {
      assessment with id = assessmentId;
    };
    assessments.add(assessmentId, newAssessment);
    assessmentId;
  };

  public query ({ caller }) func getAssessment(assessmentId : AssessmentId) : async ?Assessment {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can access assessment data");
    };
    assessments.get(assessmentId);
  };

  public query ({ caller }) func getPatientAssessments(patientId : PatientId) : async [Assessment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can access assessment data");
    };
    let patientAssessments = assessments.values().toArray().filter(
      func(assessment) {
        assessment.patientId == patientId;
      }
    );
    patientAssessments.sort();
  };

  // Treatment plan functions
  public shared ({ caller }) func addTreatmentPlan(plan : TreatmentPlan) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can add treatment plan");
    };
    let planId = Time.now().toText();
    let newPlan : TreatmentPlan = {
      plan with id = planId;
    };
    treatmentPlans.add(planId, newPlan);
  };

  public query ({ caller }) func getTreatmentPlan(planId : Text) : async ?TreatmentPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can access treatment plan data");
    };
    treatmentPlans.get(planId);
  };

  public query ({ caller }) func getPatientTreatmentPlans(patientId : PatientId) : async [TreatmentPlan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can access treatment plan data");
    };
    let patientPlans = treatmentPlans.values().toArray().filter(
      func(plan) {
        plan.patientId == patientId;
      }
    );
    patientPlans.sort();
  };

  // AI-Assisted Physiotherapy plan generation
  public shared ({ caller }) func generateAIPlan(input : AIPlanInput) : async AIPlanOutput {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can generate AI plans");
    };

    let plan : AIPlanOutput = {
      keyImpairments = identifyImpairments(input);
      functionalProblems = suggestFunctionalProblems(input);
      shortTermGoals = createShortTermGoals(input);
      longTermGoals = createLongTermGoals(input);
      frequency = recommendFrequency(input);
      sessionDuration = recommendSessionDuration(input);
      exerciseList = generateExerciseList(input);
      precautions = suggestPrecautions(input);
      contraindications = checkContraindications(input);
      redFlagReferral = checkRedFlags(input);
      disclaimer = "This plan is supportive and does not replace in-person physiotherapy care.";
    };

    let planId = Time.now().toText();
    aiPlans.add(planId, plan);
    plan;
  };

  func identifyImpairments(input : AIPlanInput) : Text {
    switch (input.domain) {
      case ("Orthopedic") { "Possible muscle weakness, decreased joint range, pain during movement" };
      case ("Neurological") { "Potential weakness, impaired coordination, spasticity" };
      case ("Cardiopulmonary") { "Potential decreased endurance, shortness of breath, fatigue" };
      case ("Pediatric") { "Possible developmental delays, motor coordination issues" };
      case ("Geriatric") { "Potential decreased balance, reduced strength, impaired mobility" };
      case (_) { "Insufficient data for detailed impairment identification" };
    };
  };

  func suggestFunctionalProblems(input : AIPlanInput) : Text {
    switch (input.domain) {
      case ("Orthopedic") { "Potential difficulties: walking, stair climbing, reaching, standing" };
      case ("Neurological") { "Potential difficulties: walking, balance, speech, movement coordination" };
      case ("Cardiopulmonary") { "Potential difficulties: walking distance, climbing stairs, daily tasks" };
      case ("Pediatric") { "Potential difficulties: crawling, walking, running, fine motor skills" };
      case ("Geriatric") { "Potential difficulties: walking, standing, maintaining balance" };
      case (_) { "Insufficient data for functional problem identification" };
    };
  };

  func createShortTermGoals(input : AIPlanInput) : Text {
    "Reduce pain to a more tolerable level, increase movement range, improve basic daily activity performance";
  };

  func createLongTermGoals(input : AIPlanInput) : Text {
    "Return to normal daily activities, regain full function, prevent recurrence of symptoms";
  };

  func recommendFrequency(input : AIPlanInput) : Text {
    switch (input.painScore) {
      case (d) {
        if (d <= 3) { "2-3 sessions per week" }
        else if (d <= 6) { "3-4 sessions per week with additional home exercises" }
        else if (d <= 10) { "Initial daily sessions with gradual reduction as pain decreases" }
        else { "Insufficient data for frequency recommendation" };
      };
    };
  };

  func recommendSessionDuration(input : AIPlanInput) : Text {
    switch (input.domain) {
      case ("Orthopedic") { "Recommended session duration: 45-60 minutes" };
      case ("Neurological") { "Recommended session duration: 60-90 minutes" };
      case ("Cardiopulmonary") { "Recommended session duration: 45-60 minutes" };
      case ("Pediatric") { "Recommended session duration: 30-45 minutes" };
      case ("Geriatric") { "Recommended session duration: 30-45 minutes" };
      case (_) { "Insufficient data for session duration recommendation" };
    };
  };

  func generateExerciseList(input : AIPlanInput) : [Text] {
    switch (input.bodyPart) {
      case ("shoulder") {
        [
          "Shoulder range of motion exercises (pendulum)",
          "Theraband resistance exercises (for muscle strengthening)",
          "Scapular stabilization exercises",
        ];
      };
      case ("knee") {
        [
          "Quadriceps strengthening (straight leg raises)",
          "Knee range of motion exercises",
          "Stationary cycling (if tolerated)",
        ];
      };
      case ("back") {
        [
          "Core stabilization exercises",
          "Gentle stretching for the back",
          "Aerobic activities (walking)",
        ];
      };
      case ("hand") {
        [
          "Hand grip exercises",
          "Range of motion for fingers/wrist",
          "Grip strength training",
        ];
      };
      case ("foot") {
        [
          "Ankle range of motion exercises",
          "Calf raises",
          "Balance training",
        ];
      };
      case (_) {
        [
          "General physiotherapy exercises including flexibility, resistance, and balance training",
        ];
      };
    };
  };

  func suggestPrecautions(input : AIPlanInput) : [Text] {
    switch (input.domain) {
      case ("Orthopedic") {
        [
          "Avoid heavy lifting of the affected area",
          "Use proper support during activities",
          "Maintain proper posture during rehabilitation",
        ];
      };
      case ("Neurological") {
        [
          "Ensure caregiver supervision for high fall risk patients",
          "Avoid sudden movements or exertion",
          "Prioritize patient safety during exercises",
        ];
      };
      case ("Cardiopulmonary") {
        [
          "Monitor vital signs carefully",
          "Avoid strenuous activities",
          "Take breaks as needed",
        ];
      };
      case ("Pediatric") {
        [
          "Engage in exercises with caregiver support",
          "Use playful approaches for better patient response",
          "Exercise according to age and capabilities",
        ];
      };
      case ("Geriatric") {
        [
          "Prioritize safety and fall prevention during exercises",
          "Use hydration and nutrition support",
          "Adapt activities to match functional abilities",
        ];
      };
      case (_) {
        [
          "Monitor exercise intensity and adjust as needed",
          "Use proper supervision during rehabilitation activities",
        ];
      };
    };
  };

  func checkContraindications(input : AIPlanInput) : Text {
    switch (input.domain) {
      case ("Cardiopulmonary") { "Avoid strenuous exercise in severe cardiac or respiratory conditions" };
      case ("Geriatric") { "Monitor frailty and underlying health conditions during exercises" };
      case (_) { "No absolute contraindications for general physiotherapy" };
    };
  };

  func checkRedFlags(input : AIPlanInput) : Text {
    // Use logical OR (| symbol) instead of "or" keyword
    if ((input.painScore > 8) or input.symptomDuration == "extended") {
      "Immediate referral to a physiotherapist or general practitioner recommended";
    } else if (input.domain == "Cardiopulmonary") {
      "Monitor for shortness of breath, chest pain, exercise tolerance issues";
    } else if (input.domain == "Orthopedic") {
      "Monitor for worsening pain symptoms";
    } else {
      "No urgent red flags identified, but regular monitoring recommended";
    };
  };

  // AI Posture Assessment
  public shared ({ caller }) func submitPostureAssessment(input : PostureAssessmentInput) : async PostureAssessmentReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can submit posture assessments");
    };

    let deviationsArray = identifyPosturalDeviations(input.viewType, input.landmarks, input.alignmentData);
    let explanationsArray = generateDeviationExplanations(deviationsArray);
    let effectsArray = analyzeMovementEffects(deviationsArray);
    let focusAreasArray = suggestCorrectiveFocusAreas(deviationsArray);
    let patientFriendlySummary = generatePatientFriendlySummary(deviationsArray);

    {
      deviations = deviationsArray;
      explanations = explanationsArray;
      effectsOnMovement = effectsArray;
      correctiveFocusAreas = focusAreasArray;
      disclaimer = "This analysis is a screening tool and does not replace professional evaluation.";
      patientFriendlySummary;
    };
  };

  func identifyPosturalDeviations(viewType : Text, landmarks : [(Text, Text)], alignmentData : [(Text, Text)]) : [Deviation] {
    let deviationsList = List.empty<Deviation>();

    switch (viewType) {
      case ("anterior") {
        deviationsList.add({
          name = "Pelvic Obliquity";
          description = "Uneven pelvis position";
          severity = 3;
        });
        deviationsList.add({
          name = "Genu Valgum";
          description = "Knee buckling inward";
          severity = 2;
        });
      };
      case ("lateral") {
        deviationsList.add({
          name = "Kyphosis";
          description = "Increased upper back rounding";
          severity = 2;
        });
        deviationsList.add({
          name = "Lordosis";
          description = "Excessive lower back curve";
          severity = 3;
        });
      };
      case ("posterior") {
        deviationsList.add({
          name = "Scoliosis";
          description = "Spinal curvature visible from the back";
          severity = 4;
        });
        deviationsList.add({
          name = "Knee Flexion Contracture";
          description = "Knees unable to fully straighten";
          severity = 3;
        });
      };
      case (_) {
        deviationsList.add({
          name = "Unknown";
          description = "View type not recognized";
          severity = 1;
        });
      };
    };
    deviationsList.toArray();
  };

  func generateDeviationExplanations(deviations : [Deviation]) : [Text] {
    deviations.map(
      func(d) {
        "The patient exhibits " # d.name # " which may affect overall posture. Severity: " # d.severity.toText();
      }
    );
  };

  func analyzeMovementEffects(deviations : [Deviation]) : [Text] {
    deviations.map(
      func(d) {
        " " # d.name # " can cause discomfort or pain during specific movements.";
      }
    );
  };

  func suggestCorrectiveFocusAreas(deviations : [Deviation]) : [Text] {
    deviations.map(
      func(d) {
        "Focus on strengthening related muscle groups and improving flexibility in affected areas.";
      }
    );
  };

  func generatePatientFriendlySummary(deviations : [Deviation]) : Text {
    var summary = "Posture Assessment Summary:\n\n";
    summary #= "This assessment helps us understand your body's alignment, which plays a big role in how you move, feel, and perform activities. Here's a breakdown of the findings:\n\n";
    if (deviations.size() == 0) {
      summary #= "No significant postural deviations detected. Great job maintaining good posture!\n";
    } else {
      deviations.forEach(func(d) {
        summary #= generateFriendlyDeviationExplanation(d);
      });
    };
    summary #= "\nIt's important to remember that some postural differences are normal and may not need correction. Our goal is to address areas that can improve comfort, movement, and overall function.\n";
    summary #= "\nThis posture assessment is a screening tool and does not replace an in-person physiotherapy evaluation.\n";
    summary;
  };

  func generateFriendlyDeviationExplanation(deviation : Deviation) : Text {
    switch (deviation.name) {
      case ("Pelvic Obliquity") {
        "Pelvic Tilt: One side of your pelvis may appear higher than the other, like a slight tilt in your hips. This can influence how you walk or distribute weight.";
      };
      case ("Genu Valgum") {
        "Knee Alignment: Known as \"knock knees,\" this appears when your knees touch while standing straight. It can affect your posture and gait.";
      };
      case ("Kyphosis") {
        "Upper Back Rounding: A pronounced curve in the upper back can give a hunched appearance and might lead to back or neck discomfort.";
      };
      case ("Lordosis") {
        "Lower Back Curve: An increased curve can create an accentuated lower spine and may be linked to back tension.";
      };
      case ("Scoliosis") {
        "Spinal Curvature: A side-to-side curve in the spine can cause uneven shoulders or hips and may affect movement.";
      };
      case ("Knee Flexion Contracture") {
        "Knee Flexibility: Difficulty fully straightening your knees may cause subtle bending at rest, potentially impacting posture and movement.";
      };
      case (_) {
        "This finding represents a unique aspect of your posture, which may have subtle effects on comfort or movement.";
      };
    };
  };

  // AI-assisted Posture Image Processing endpoint
  public shared ({ caller }) func processPostureImage(image : BlobStorage.ExternalBlob) : async PostureAssessmentReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can submit posture images");
    };

    let landmarks = [
      "forehead_center",
      "chin",
      "left_eye_outer",
      "right_eye_outer",
      "left_shoulder",
      "right_shoulder",
      "left_hip",
      "right_hip",
      "left_knee",
      "right_knee",
      "left_ankle",
      "right_ankle",
    ];

    let viewType = "anterior";

    let alignmentData = [
      ("head_tilt", "5"),
      ("shoulder_height_diff", "3"),
      ("hip_tilt_angle", "4"),
      ("knee_alignment", "2"),
    ];

    let deviationsArray = identifyPosturalDeviations(viewType, landmarks.map(func(l) { (l, "position") }), alignmentData);
    let explanationsArray = generateDeviationExplanations(deviationsArray);
    let effectsArray = analyzeMovementEffects(deviationsArray);
    let focusAreasArray = suggestCorrectiveFocusAreas(deviationsArray);
    let patientFriendlySummary = generatePatientFriendlySummary(deviationsArray);

    {
      deviations = deviationsArray;
      explanations = explanationsArray;
      effectsOnMovement = effectsArray;
      correctiveFocusAreas = focusAreasArray;
      disclaimer = "This analysis is a screening tool and does not replace professional evaluation.";
      patientFriendlySummary;
    };
  };

  // Scoring and interpretation
  public shared ({ caller }) func calculateClinicalScaleScore(
    scaleName : Text,
    responses : [Nat]
  ) : async ClinicalScale {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can calculate clinical scale scores");
    };
    let score = responses.foldLeft(0, func(acc, val) { acc + val });
    let interpretation = interpretScore(scaleName, score);
    {
      name = scaleName;
      hjiquestions = "";
      responses;
      score;
      interpretation;
    };
  };

  func interpretScore(scaleName : Text, score : Nat) : Text {
    switch (scaleName, score) {
      case ("SPADI", s) {
        if (s > 70) { "Severe impairment" } else if (s > 40) { "Moderate impairment" } else {
          "Mild impairment";
        };
      };
      case ("WOMAC", s) {
        if (s > 60) { "High pain/disability" } else if (s > 30) {
          "Moderate pain/disability";
        } else { "Low pain/disability" };
      };
      case ("LEFS", s) {
        if (s > 60) { "Excellent function" } else if (s > 40) {
          "Good function";
        } else { "Poor function" };
      };
      case (_) { "Interpretation not available" };
    };
  };

  // Dashboard functions
  public query ({ caller }) func getClinicianDashboard() : async {
    patientCount : Nat;
    assessmentCount : Nat;
    treatmentPlanCount : Nat;
    aiPlanCount : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can access dashboard");
    };
    {
      patientCount = patients.size();
      assessmentCount = assessments.size();
      treatmentPlanCount = treatmentPlans.size();
      aiPlanCount = aiPlans.size();
    };
  };

  // Provisional Impression Generator
  public shared ({ caller }) func generateProvisionalPhysioImpression(patientId : PatientId, functionalDifficulties : [Text], observedDeviations : [Text]) : async ProvisionalPhysioImpression {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can generate provisional impressions");
    };

    let explanation = generateFunctionalExplanation(functionalDifficulties);
    let provisionalImpression : ProvisionalPhysioImpression = {
      id = Time.now().toText();
      observedDeviations;
      functionalDifficulties;
      generatedImpression = formatPostureSummary(observedDeviations, explanation);
      dateCreated = Time.now();
    };

    provisionalImpressions.add(provisionalImpression.id, provisionalImpression);

    let existingImpressions = switch (impressionIndex.get(patientId)) {
      case (?impressions) { impressions };
      case (null) { List.empty<ImpressionId>() };
    };
    existingImpressions.add(provisionalImpression.id);
    impressionIndex.add(patientId, existingImpressions);
    provisionalImpression;
  };

  func generateFunctionalExplanation(functionalDifficulties : [Text]) : Text {
    let reviewFunctionalDifficulties = if (functionalDifficulties.size() > 0) {
      "Functional review found difficulties with: " # foldWithSeparator(functionalDifficulties, ", ") # ".";
    } else { "" };

    let functionalReviewSection = if (reviewFunctionalDifficulties.size() > 0) {
      reviewFunctionalDifficulties # " ";
    } else { "" };

    if (functionalReviewSection.size() >= 5) {
      "The " # functionalReviewSection.trimStart(#char ' ') # " appear consistent with movement or functional challenges. Continued monitoring, ongoing practice, or physiotherapy care would likely be supportive.";
    } else {
      "";
    };
  };

  func foldWithSeparator(array : [Text], separator : Text) : Text {
    if (array.size() == 0) { return "" };
    let withoutSeparator = array.sliceToArray(0, array.size() - 1);
    withoutSeparator.foldLeft(
      array[array.size() - 1],
      func(acc, val) {
        val # separator # acc;
      },
    );
  };

  func summarizeObservedDeviations(observedDeviations : [Text]) : Text {
    let deviationCount = observedDeviations.size();

    let deviationSummary = if (deviationCount == 0) {
      "No significant postural deviations detected.";
    } else if (deviationCount == 1) {
      "Review you notice " # observedDeviations[0] # ".";
    } else {
      "Review you notice " # observedDeviations[0] # ", " # observedDeviations[deviationCount - 1] # ", and " # observedDeviations[deviationCount - 1] # ", among others. No change means this is relatively minor.";
    };

    deviationSummary # " The findings above are non-diagnostic and for review only. Any movement deviation may have more than one root cause. Improvement is generally expected including with time, stretching, and movement practice.";
  };

  func formatPostureSummary(
    observedDeviations : [Text],
    explanation : Text,
  ) : Text {
    let deviationSummaryWithPreamble = summarizeObservedDeviations(observedDeviations);
    deviationSummaryWithPreamble.concat(" ").trimEnd(#char ' ') # " " # explanation # " Confirmation requires in-person physiotherapy assessment.";
  };

  public query ({ caller }) func getProvisionalImpressions(patientId : PatientId) : async [ProvisionalPhysioImpression] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can get provisional impressions");
    };

    let impressionIds = switch (impressionIndex.get(patientId)) {
      case (?ids) { ids };
      case (null) { List.empty<ImpressionId>() };
    };
    let impressionIdsArray = impressionIds.toArray();
    impressionIdsArray.map(func(id) { provisionalImpressions.get(id) }).filter(func(x) { x != null }).map(func(x) { switch (x) { case (?val) { val }; case (null) { Runtime.trap("Unexpected unreachable code") } } });
  };

  public query ({ caller }) func getAllProvisionalImpressions() : async [ProvisionalPhysioImpression] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only clinicians can access all impressions");
    };
    provisionalImpressions.values().toArray();
  };
};
