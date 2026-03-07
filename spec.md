# PhysioAssist – Voice Clinical Scribe

## Current State
The app has a full clinician dashboard with patient management, assessments, treatment plans, therapy modalities, posture screening, and a 3D landing page. There is no voice recording or voice-to-clinical-notes feature.

## Requested Changes (Diff)

### Add
- `VoiceClinicalScribe` component: a floating voice recorder accessible from the patient detail view via a new "Voice Scribe" tab
- Visual microphone button that pulses/glows with a neon teal ring animation when recording is active
- Browser-native `MediaRecorder` API for audio capture (no external API needed)
- Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) for live speech-to-text transcription
- Post-transcription clinical formatting: the transcribed text is structured into a SOAP-style clinical note (Subjective, Objective, Assessment, Plan sections) using rule-based formatting
- Recorded session state: shows transcription in real-time, allows stopping and reviewing
- Copy-to-clipboard button for the formatted note
- Clear/reset button to start a new recording
- Safety disclaimer: "Voice transcription is an aid and does not replace clinician review."
- New "Voice Scribe" tab inside `PatientDetailView` alongside existing Assessments, Treatment Plans, Therapy Modalities tabs

### Modify
- `PatientDetailView.tsx`: add a new "Voice Scribe" tab with a `Mic` icon
- Dashboard tabs list to include the new tab trigger

### Remove
- Nothing removed
