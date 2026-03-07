export interface TherapyModality {
  id: string;
  name: string;
  category:
    | "Electrotherapy"
    | "Exercise Therapy"
    | "Manual Therapy"
    | "Thermotherapy / Cryotherapy"
    | "Other Modalities";
  method: string;
  dosage: string;
  frequency: string;
  intensity: string;
  duration: string;
  indications: string[];
  contraindications: string[];
  precautions: string[];
}

export const therapyModalities: TherapyModality[] = [
  // ─── ELECTROTHERAPY ───────────────────────────────────────────────────────
  {
    id: "tens",
    name: "TENS (Transcutaneous Electrical Nerve Stimulation)",
    category: "Electrotherapy",
    method:
      "1. Clean and dry the skin. 2. Apply electrodes around or bracketing the painful area (not directly over open wounds). 3. Conventional TENS: electrodes at or near pain site, 80–100 Hz, sensory-level intensity. 4. Acupuncture-like TENS: electrodes over acupoints or motor points, 1–4 Hz, strong motor-level stimulus. 5. Burst mode: bursts of high-frequency pulses at low carrier frequency. 6. Gradually increase intensity until comfortable tingling (conventional) or visible muscle twitch (acupuncture). 7. Patient should not feel pain — reduce intensity if sharp pain occurs.",
    dosage:
      "Conventional: 80–100 Hz, pulse width 50–80 µs, sensory threshold. Acupuncture-like: 1–4 Hz, pulse width 150–250 µs, motor threshold. Burst mode: 2–4 bursts/sec of 100 Hz train.",
    frequency: "1–2 sessions per day; up to 2–3x/week for chronic pain",
    intensity:
      "Conventional: comfortable tingling, below motor threshold. Acupuncture-like: visible muscle twitch, strong but comfortable. Never painful.",
    duration: "20–30 minutes per session; course 4–6 weeks",
    indications: [
      "Chronic and acute musculoskeletal pain",
      "Post-operative pain management",
      "Neuropathic pain",
      "Arthritis pain",
      "Labor pain",
      "Post-stroke shoulder pain",
    ],
    contraindications: [
      "Demand-type cardiac pacemaker",
      "Over anterior neck / carotid sinuses",
      "Thrombophlebitis / deep vein thrombosis",
      "Active malignancy over treatment area",
      "Epilepsy (head/neck placement)",
      "Pregnancy (over abdomen/low back in first trimester)",
    ],
    precautions: [
      "Impaired skin sensation — monitor for skin irritation",
      "Avoid mucous membranes and open wounds",
      "Remove before MRI",
      "Patch allergy to adhesive gel — use non-allergenic electrodes",
      "Monitor skin condition under electrodes after each session",
    ],
  },
  {
    id: "ift",
    name: "IFT (Interferential Therapy)",
    category: "Electrotherapy",
    method:
      "1. Clean and dry the skin. 2. Quadripolar placement: place two pairs of electrodes at 90° to each other so the currents cross at the target tissue. Bipolar placement: two electrodes in-line for superficial areas. 3. Apply conductive pads or sponge electrodes secured with straps. 4. Set carrier frequency to 4000 Hz (AMF or beat frequency 1–150 Hz). 5. Set sweep range (e.g., 80–150 Hz for pain, 1–10 Hz for muscle re-education). 6. Increase intensity to comfortable buzz sensation — no sharp pain. 7. Rhythmic sweep produces alternating beat that penetrates deep tissues.",
    dosage:
      "Carrier frequency: 4000 Hz. Beat/AMF frequency: 80–150 Hz for pain relief; 10–25 Hz for muscle spasm; 1–10 Hz for muscle re-education. Constant or sweep mode.",
    frequency: "3–5 sessions per week",
    intensity:
      "Comfortable tingling/buzz deep in tissue; below pain threshold. 30–50 mA typical range.",
    duration: "15–20 minutes per session; course 4–8 weeks",
    indications: [
      "Muscle spasm and spasticity",
      "Chronic musculoskeletal pain",
      "Post-traumatic swelling and edema",
      "Soft tissue injuries",
      "Osteoarthritis",
      "Shoulder-hand syndrome",
    ],
    contraindications: [
      "Active malignancy in treatment area",
      "Cardiac pacemaker or implanted stimulator",
      "Venous or arterial thrombosis",
      "Skin breakdown or active infection over electrodes",
      "Pregnancy over abdomen/low back",
    ],
    precautions: [
      "Impaired sensation — risk of burns",
      "Ensure equal skin impedance on both electrode pairs",
      "Use non-allergenic electrodes for sensitive skin",
      "Avoid over metal implants in treatment area",
      "Monitor for skin redness after treatment",
    ],
  },
  {
    id: "ultrasound",
    name: "Ultrasound Therapy",
    category: "Electrotherapy",
    method:
      "1. Apply liberal coupling gel to the treatment area (gel removes air gap). 2. Select frequency: 1 MHz for deep tissue (>2 cm), 3 MHz for superficial structures (<2 cm). 3. Continuous mode (thermal): slow circular or overlapping stroking technique at 4 cm²/sec. 4. Pulsed mode (non-thermal): 1:4 duty cycle (20% on); for acute inflammation, fracture healing, scar tissue. 5. Keep soundhead moving constantly — stationary application causes hot spots and periosteal burn. 6. ERA (effective radiating area) of head should match treatment area. 7. Treat area 2–3x the ERA for 5 minutes.",
    dosage:
      "Thermal (continuous): 1–2 W/cm² at 1 MHz; 0.5–1 W/cm² at 3 MHz. Non-thermal (pulsed): 0.5–1 W/cm² SATA (20% duty cycle). ERA: use appropriate soundhead size.",
    frequency: "3–5 sessions per week; daily for acute phase",
    intensity:
      "Thermal: moderate warmth felt by patient. Non-thermal: no warmth. Stop immediately if pain/burning is reported.",
    duration:
      "5–10 minutes per area; typically 5 min/treatment area; course 6–12 sessions",
    indications: [
      "Soft tissue injuries (muscle, tendon, ligament)",
      "Calcific tendinitis",
      "Scar tissue management",
      "Epicondylitis",
      "Plantar fasciitis",
      "Fracture healing (non-union)",
    ],
    contraindications: [
      "Over malignancy",
      "Directly over pacemaker or implanted stimulator leads",
      "Over growing epiphyses in children",
      "Over eyes, testes, pregnant uterus",
      "Thrombophlebitis or DVT",
      "Laminectomy sites",
    ],
    precautions: [
      "Impaired sensation — risk of thermal burns",
      "Maintain continuous movement — never hold stationary",
      "Metal implants: reduce intensity and monitor",
      "Ischemic areas — poor heat dissipation risk",
      "Acutely infected tissue — may spread infection",
    ],
  },
  {
    id: "laser",
    name: "LASER Therapy (Low-Level Laser / LLLT)",
    category: "Electrotherapy",
    method:
      "1. Both clinician and patient wear appropriate protective goggles. 2. Clean treatment area — no creams/lotions. 3. Contact technique: apply probe directly on skin with gentle pressure over treatment point. 4. Scanning technique: move probe 0.5–1 cm/sec over treatment area for larger zones. 5. Grid method: divide area into 1 cm² zones, treat each point 30–60 seconds. 6. Trigger point technique: locate trigger point, hold probe stationary for 60 seconds per point. 7. Treat at right angles to skin surface for maximum penetration.",
    dosage:
      "Wavelength: 630–670 nm (red, superficial) or 780–980 nm (NIR, deep). Energy density: 1–4 J/cm² for acute; 4–8 J/cm² for chronic. Power: 10–100 mW (probe). Total energy per session: 1–12 J.",
    frequency:
      "3x/week for acute; 2x/week for chronic; alternate-day treatment",
    intensity:
      "Patient should feel mild warmth or tingling only. Sub-erythemal dose. No visible redness or burning.",
    duration:
      "30–60 seconds per point; 5–20 minutes total per session; course 8–12 sessions",
    indications: [
      "Wound healing and tissue repair",
      "Trigger point therapy",
      "Tendinopathy",
      "Arthritis pain management",
      "Nerve regeneration",
      "Post-herpetic neuralgia",
    ],
    contraindications: [
      "Direct irradiation of eyes (severe risk of retinal damage)",
      "Active malignancy",
      "Pregnancy over abdomen",
      "Photosensitive skin conditions or medications",
      "Thyroid gland",
      "Hemorrhagic conditions",
    ],
    precautions: [
      "Always use certified laser goggles — both patient and clinician",
      "Do not apply over open fontanelles",
      "Avoid over dark pigmented tattoos (heat absorption)",
      "Monitor for photosensitivity reactions",
      "Avoid over major blood vessels in high-dose applications",
    ],
  },
  {
    id: "nmes",
    name: "NMES (Neuromuscular Electrical Stimulation)",
    category: "Electrotherapy",
    method:
      "1. Identify motor points of target muscles using motor point chart. 2. Place active electrode over motor point, dispersive electrode proximally or distally. 3. Set frequency 35–50 Hz (elicits tetanic contraction). 4. Set pulse width 200–350 µs. 5. Enable ramp-up (rise time 2–3 sec) and ramp-down (fall time 2–3 sec) to avoid sudden painful contraction. 6. On:off ratio 10s on / 50s off initially (1:5 ratio) — progress to 1:2 as muscle strengthens. 7. Increase intensity until visible smooth muscle contraction without excessive pain. 8. Patient may actively assist the contraction (combined volitional + NMES).",
    dosage:
      "Frequency: 35–50 Hz (fatigue-resistant). Pulse width: 200–350 µs. Ramp time: 2–3 seconds up/down. Duty cycle: 10s on / 50s off progressing to 15s on / 30s off.",
    frequency: "Daily or 5x/week; 15–20 contractions per session",
    intensity:
      "Visible smooth muscle contraction; 50–80% of maximum tolerated intensity. Contraction should be functional, not painful.",
    duration:
      "15–30 minutes per session; 4–8 week course; progress as muscle strength improves",
    indications: [
      "Post-surgical muscle re-education (e.g., post-ACL, post-arthroplasty)",
      "Muscle atrophy / disuse weakness",
      "Foot drop / dropfoot retraining",
      "Spastic muscle inhibition",
      "Shoulder subluxation prevention in stroke",
      "Incontinence (pelvic floor re-education)",
    ],
    contraindications: [
      "Demand cardiac pacemaker",
      "Denervated muscle (lower motor neuron lesion — use different parameters)",
      "Over carotid sinus",
      "Deep vein thrombosis",
      "Epilepsy (in susceptible areas)",
      "Implanted metal over treatment area",
    ],
    precautions: [
      "Osteoporosis — avoid forceful contractions",
      "Joint instability — secure joint during treatment",
      "Skin hypersensitivity — use non-allergenic electrodes",
      "Monitor for skin reaction under electrodes",
      "Avoid over epiphyseal plates in pediatric patients",
    ],
  },
  {
    id: "swd",
    name: "SWD / MWD (Short Wave / Microwave Diathermy)",
    category: "Electrotherapy",
    method:
      "SWD: 1. Remove all metal objects (jewelry, belt). 2. Use drum (inductive) or condenser plate (capacitive) electrodes. 3. Drum: place over target area 1–2 cm from skin; capacitive plates: sandwich the part between plates. 4. Continuous SWD for thermal effects; pulsed SWD (PSWD) for non-thermal/anti-inflammatory effects. 5. Set intensity: thermal — patient reports comfortable warmth; PSWD — below thermal level. MWD: 1. Use reflector/director electrode 2–5 cm from skin. 2. Apply to exposed skin — no dressings. 3. Patient must not move during treatment.",
    dosage:
      "SWD frequency: 27.12 MHz. Continuous: thermal dose III–IV (comfortable warmth). Pulsed: 1:4 or 1:9 pulse ratio; peak power 200–1000 W; mean power 20–100 W. MWD: 2450 MHz; 15–30 W output.",
    frequency: "3–5 sessions per week",
    intensity:
      "Continuous: comfortable warmth (dose III). Pulsed: imperceptible warmth (dose I–II). Never hot or burning.",
    duration: "15–20 minutes per session; course 6–10 sessions",
    indications: [
      "Subacute and chronic musculoskeletal pain",
      "Pelvic inflammatory disease (PSWD)",
      "Osteoarthritis",
      "Muscle spasm",
      "Post-fracture healing (PSWD non-thermal)",
      "Sinusitis (MWD)",
    ],
    contraindications: [
      "Metal implants or fixators in treatment field",
      "Cardiac pacemaker",
      "Pregnancy over trunk/pelvis",
      "Malignancy",
      "Moist wound dressings",
      "Contact lenses / over eyes",
    ],
    precautions: [
      "Remove all metal: jewelry, hearing aids, watches, IUDs",
      "Warn patient not to move limb during treatment",
      "Monitor for burns in areas of impaired sensation",
      "Do not apply over fluid-filled cavities (edema) with continuous SWD",
      "Ensure no moisture under electrodes or between skin and drum",
    ],
  },
  {
    id: "hvgs",
    name: "HVGS (High-Volt Galvanic Stimulation)",
    category: "Electrotherapy",
    method:
      "1. Clean skin thoroughly. 2. Select polarity: negative (cathode) for edema reduction and wound healing; positive (anode) for pain relief. 3. Place active electrode over treatment area; dispersive pad at proximal/remote site. 4. Use twin peak monophasic waveform (short pulse, <200 µs). 5. Set voltage 100–200 V at micro-ampere current levels (1–2.5 mA). 6. Pulsed DC — not continuous DC. 7. Increase intensity until comfortable tingling; motor stimulation optional at higher settings. 8. Active dispersive: switch polarity mid-session if indicated.",
    dosage:
      "Voltage: 100–200 V. Current: 1–2.5 mA (low current despite high voltage). Pulse rate: 2–120 pulses per second. Twin-peak monophasic waveform. Pulse duration: <200 µs.",
    frequency: "Daily for acute edema; 3x/week for pain management",
    intensity:
      "Comfortable tingling (sensory) to visible muscle twitch (motor level). No burning. Negative pole preferred for edema.",
    duration: "20–30 minutes per session; course 4–6 weeks",
    indications: [
      "Acute edema and post-traumatic swelling",
      "Wound healing (chronic ulcers)",
      "Muscle spasm",
      "Sports injuries (sprains, strains)",
      "Soft tissue pain",
      "Iontophoresis (delivery of ions into tissue)",
    ],
    contraindications: [
      "Cardiac pacemaker",
      "Over malignancy",
      "Thrombophlebitis / DVT",
      "Pregnancy over abdomen",
      "Over eyes, anterior neck",
      "Infected wounds with spreading cellulitis",
    ],
    precautions: [
      "Ensure skin is moist/clean for good contact",
      "Monitor for skin redness or burns",
      "Avoid large dispersive pad placement near heart",
      "Reduce intensity if stinging reported",
      "Impaired sensation — high risk of burns, monitor closely",
    ],
  },

  // ─── EXERCISE THERAPY ─────────────────────────────────────────────────────
  {
    id: "therapeutic-exercise",
    name: "Therapeutic Exercise",
    category: "Exercise Therapy",
    method:
      "1. Warm-up: 5–10 min light aerobic activity (walking, cycling) to prepare musculoskeletal system. 2. Stretching: static stretches 20–30 sec hold for major muscle groups. 3. Strengthening: progressive resistance training using FITT principle. 4. Range of motion: active, active-assisted, or passive exercises as indicated. 5. Cool-down: 5–10 min gentle movement and relaxation stretches. 6. Progress through phases: isometric → isotonic → isokinetic → functional. 7. Adjust load using RPE (Borg 12–16/20 for moderate intensity).",
    dosage:
      "Strengthening: 8–15 reps × 2–3 sets; 60–80% 1-RM for strength, 40–60% for endurance. Stretching: 20–30s hold, 3 reps. Mobility: 10–15 reps. FITT: Frequency 3–5x/week, Intensity RPE 12–16, Time 30–60 min, Type specific to goals.",
    frequency: "3–5 sessions per week with rest days for recovery",
    intensity:
      "Moderate: RPE 12–14 (Borg scale). Strengthening phase: 60–80% 1-RM. Progress by 5–10% load increase when 2 extra reps achieved on 2 consecutive sessions.",
    duration:
      "30–60 minutes per session including warm-up/cool-down; 8–12 week progressive program",
    indications: [
      "Musculoskeletal rehabilitation (post-surgery, injury)",
      "Chronic back pain",
      "Osteoarthritis",
      "Cardiac rehabilitation",
      "Post-fracture rehabilitation",
      "General deconditioning and weakness",
    ],
    contraindications: [
      "Acute fracture without stabilization",
      "Active infection in target joints",
      "Severe cardiovascular instability",
      "Deep vein thrombosis (exercise until anticoagulated)",
      "Resting angina or unstable cardiac condition",
    ],
    precautions: [
      "Warm up thoroughly before loading",
      "Monitor for excessive pain (>3 on VAS) during exercise — reduce load",
      "Delayed onset muscle soreness is normal; modify if severe",
      "Osteoporosis: avoid high-impact and spinal flexion loads",
      "Monitor cardiovascular response (HR, BP) in at-risk patients",
    ],
  },
  {
    id: "proprioceptive-training",
    name: "Proprioceptive Training",
    category: "Exercise Therapy",
    method:
      "1. Begin on stable surface with eyes open (bilateral stance). 2. Progress to foam/unstable surface (BOSU, balance board, wobble board). 3. Phase 1: double-leg stance, eyes open, 30s holds. 4. Phase 2: single-leg stance, eyes open, 3×30s. 5. Phase 3: single-leg stance, eyes closed, 3×30s. 6. Phase 4: unstable surface + eyes closed. 7. Phase 5: perturbation training — therapist provides gentle unexpected pushes. 8. Phase 6: functional tasks (catch, throw, sport-specific) on unstable surface.",
    dosage:
      "3×10 repetitions or 3×30 second holds per exercise. Progress eyes open → closed → unstable surface → dual-task. 4–6 exercise levels.",
    frequency: "Daily (home program) or 3x/week supervised",
    intensity:
      "Challenge without falling — moderate difficulty. Patient should maintain upright posture with mild sway. Support available initially.",
    duration:
      "15–20 minutes per session; integrate into broader rehab; 6–12 week progression",
    indications: [
      "Ankle sprain rehabilitation",
      "ACL reconstruction recovery",
      "Balance deficits post-stroke or vestibular disorder",
      "Knee osteoarthritis",
      "Prevention of falls in elderly",
      "Post-immobilization joint re-training",
    ],
    contraindications: [
      "Uncontrolled dizziness or vertigo",
      "Non-weight bearing restrictions",
      "Active fracture or ligament rupture requiring immobilization",
      "Severe vestibular pathology (until cleared)",
    ],
    precautions: [
      "Ensure safety spotting for fall prevention",
      "Use parallel bars or wall support initially",
      "Do not progress too quickly — base on patient performance",
      "Monitor fatigue — proprioception degrades rapidly when fatigued",
      "Protective footwear during unstable surface training",
    ],
  },
  {
    id: "pnf",
    name: "PNF (Proprioceptive Neuromuscular Facilitation)",
    category: "Exercise Therapy",
    method:
      "1. Position patient comfortably; identify target diagonal pattern. 2. D1 Flexion: shoulder flexion + abduction + ER; D1 Extension: shoulder extension + adduction + IR. D2 Flexion: shoulder flexion + abduction + ER (hand toward opposite ear). 3. Hold-Relax: move to end-range, patient resists maximally for 6–10s, then relax, therapist takes limb through new increased ROM. 4. Contract-Relax: same as hold-relax but with rotation added. 5. Rhythmic Initiation: passive → active-assisted → resisted movement through pattern. 6. Apply manual resistance throughout full range; use irradiation from stronger to weaker components.",
    dosage:
      "3 sets per pattern; 6–10 second holds for isometric techniques; 3–5 repetitions through full range for dynamic patterns. 2–3 patterns per session.",
    frequency: "3–5 sessions per week",
    intensity:
      "Maximal resistance for strengthening; sub-maximal for coordination. Patient should work hard but not substitute or break pattern.",
    duration: "20–40 minutes per session; 4–8 week course",
    indications: [
      "Post-stroke motor relearning",
      "Peripheral nerve injury rehabilitation",
      "Flexibility and ROM deficits",
      "Muscle weakness requiring facilitation",
      "Sports performance enhancement",
      "Shoulder instability rehabilitation",
    ],
    contraindications: [
      "Acute fracture at stretch site",
      "Severe cardiovascular instability",
      "Joint replacement with restricted patterns",
      "Acute ligament sprains in involved joints",
    ],
    precautions: [
      "Ensure smooth, coordinated manual resistance — avoid jerking",
      "Monitor for substitution patterns",
      "Reduce resistance if patient compensates",
      "Hypertensive patients — monitor BP with maximal isometrics",
      "Osteoporosis — avoid forceful stretch with high resistance",
    ],
  },
  {
    id: "core-stabilization",
    name: "Core Stabilization Exercise",
    category: "Exercise Therapy",
    method:
      "1. Find neutral spine: lie supine, find position between fully flat and over-arched. 2. Transversus abdominis (TrA) activation: drawing-in maneuver — gently draw navel toward spine (do not flatten back). 3. Progress: hold TrA activation during breathing. 4. Level 1 exercises: dead bug (supine arm/leg extension with TrA active), bird-dog (quadruped alternate arm/leg). 5. Level 2: plank (forearm or extended arm), side plank, glute bridge. 6. Level 3: unstable surface planks, Swiss ball exercises, loaded movements. 7. All exercises: maintain neutral spine and TrA activation throughout.",
    dosage:
      "3×10–15 repetitions; 10s holds for static exercises initially, progressing to 30s+. Breathing throughout — never hold breath. Progress when 3×15 reps completed with good form.",
    frequency: "Daily or 5x/week (low intensity allows daily training)",
    intensity:
      "Low-moderate. Never painful — stop if pain reproduced. Work to form failure, not fatigue failure. Progression based on quality, not speed.",
    duration:
      "20–30 minutes per session; 8–12 week progressive program integrated with functional tasks",
    indications: [
      "Chronic low back pain",
      "Lumbar disc herniation rehabilitation",
      "Post-spinal surgery recovery",
      "Spondylolysis / spondylolisthesis",
      "Pelvic girdle pain in pregnancy",
      "Prevention of low back injury in athletes",
    ],
    contraindications: [
      "Acute low back pain flare — begin with minimal loading",
      "Spinal instability requiring surgical clearance",
      "Severe lumbar stenosis with positional symptoms",
    ],
    precautions: [
      "Never load through pain",
      "Master TrA activation before adding load",
      "Avoid abdominal bracing over drawing-in for most patients",
      "Monitor for breath-holding (Valsalva) — can elevate BP",
      "Post-partum: pelvic floor assessment before loaded core work",
    ],
  },
  {
    id: "hydrotherapy",
    name: "Hydrotherapy / Aquatic Exercise",
    category: "Exercise Therapy",
    method:
      "1. Water temperature: 34–36°C for therapeutic exercise; 26–30°C for aerobic exercise. 2. Pool entry: use hoist, ramp, or steps — adapt to patient ability. 3. Halliwick method for balance: mental adjustment → sagittal rotation → transverse rotation → combined rotation → upthrust → balanced stillness → turbulent gliding. 4. Bad Ragaz ring method: therapist provides manual guidance at floats placed at hips, knees, ankles. 5. Exercise selection: buoyancy-assisted (shoulder ROM), buoyancy-supported (walking), buoyancy-resisted (leg kicks). 6. Hydrostatic pressure assists venous return; viscosity provides resistance.",
    dosage:
      "Depth: neck-deep (90% body weight reduction), chest-deep (60%), waist-deep (50%). Sets/reps: 2–3×10–15 per exercise. Aerobic: 15–20 min continuous activity.",
    frequency: "2–3 sessions per week",
    intensity:
      "Start buoyancy-assisted, progress to buoyancy-neutral, then resisted. RPE 11–14 for aerobic component. Monitor fatigue — water disguises effort level.",
    duration:
      "30–45 minutes per session including transition time; 6–12 week program",
    indications: [
      "Severe arthritis with land-based exercise intolerance",
      "Post-hip/knee replacement early mobilization",
      "Fibromyalgia",
      "Chronic back pain",
      "Neurological conditions (MS, Parkinson's)",
      "Pediatric developmental disorders",
    ],
    contraindications: [
      "Open wounds or active skin infection",
      "Urinary or fecal incontinence (without protection)",
      "Uncontrolled epilepsy",
      "Severe cardiac failure",
      "Claustrophobia / water phobia",
      "Active fever",
    ],
    precautions: [
      "Continuously monitor cardiac patients (HR, RPE)",
      "Lifeguard or therapist in/at pool at all times",
      "Check pool chemistry (pH 7.2–7.8, chlorine 1–3 ppm)",
      "Ensure pool entry/exit is safe — risk of falls",
      "Hyperthermia risk in warm pools — watch for dizziness",
    ],
  },

  // ─── MANUAL THERAPY ───────────────────────────────────────────────────────
  {
    id: "maitland-mobilization",
    name: "Joint Mobilization (Maitland Approach)",
    category: "Manual Therapy",
    method:
      "Maitland Grades: Grade I: small amplitude, early range (pain inhibition). Grade II: large amplitude, mid-range (pain inhibition). Grade III: large amplitude, end-range with resistance (stiffness). Grade IV: small amplitude, end-range against resistance (stiffness). Grade V: high-velocity, low-amplitude thrust (manipulation — advanced practitioners only). Technique: 1. Position patient in pain-free starting position. 2. Take joint to appropriate point in range. 3. Apply oscillatory movements at 2–3 cycles/second. 4. Maintain for 30–120 seconds per set, 3–4 sets per direction. 5. Reassess after each set.",
    dosage:
      "Grade I–II: for pain — 2–3 min per direction; Grades III–IV: for stiffness — 1–2 min per direction; 3–4 sets. Oscillation rate: 2–3 Hz.",
    frequency: "3–5 sessions per week in acute; 2–3x/week in subacute",
    intensity:
      "Grades I–II: minimal resistance; Grades III–IV: into resistance but not provoking pain. Grade V: only by trained manipulative therapists.",
    duration:
      "15–30 minutes per session (including assessment); course 6–12 sessions",
    indications: [
      "Joint stiffness from osteoarthritis",
      "Post-immobilization stiffness",
      "Cervical and lumbar facet joint pain",
      "Peripheral joint hypomobility",
      "Frozen shoulder / adhesive capsulitis",
      "Post-surgical joint stiffness",
    ],
    contraindications: [
      "Fracture or dislocation",
      "Bone tumor in treatment area",
      "Inflammatory arthritis in acute flare",
      "Osteoporosis (Grades III–V)",
      "Vertebrobasilar insufficiency (cervical manipulation)",
      "Anticoagulation therapy (Grade V only)",
    ],
    precautions: [
      "Perform neurological screen before cervical mobilization",
      "Reassess pain and range after each technique",
      "Hypermobile joints — Grade V contraindicated",
      "Recent corticosteroid injection — delay aggressive mobilization",
      "Elderly patients with osteoporosis — use lower grades only",
    ],
  },
  {
    id: "stm",
    name: "Soft Tissue Mobilization",
    category: "Manual Therapy",
    method:
      "1. Effleurage: long gliding strokes in direction of venous/lymphatic drainage to warm tissues. 2. Petrissage: kneading and lifting technique to mobilize deeper tissues and improve circulation. 3. Cross-fiber friction (CFM): apply pressure perpendicular to muscle/tendon fiber direction; maintains contact, moves skin over tissue; 30–60 second bursts; patient should feel 'exquisite tenderness'. 4. Myofascial stripping: longitudinal stripping along muscle belly with thumb or elbow. 5. Direct pressure: static sustained pressure on tender nodules. 6. Follow each technique with gentle passive or active movement.",
    dosage:
      "Effleurage: 3–5 min warm-up. Petrissage: 5–10 min. Cross-fiber friction: 3–5 min per area (60–90 sec bursts with rest). Total session: 20–30 min.",
    frequency: "2–3 sessions per week; daily effleurage in home program",
    intensity:
      "Cross-fiber friction: moderate-firm pressure causing tolerable discomfort (3–5/10 VAS). Effleurage/petrissage: comfortable. Never sharp or unbearable pain.",
    duration:
      "20–40 minutes per session; acute: 4–6 sessions; chronic: 8–12 sessions",
    indications: [
      "Muscle tension and trigger points",
      "Scar tissue adhesions",
      "Tendinopathy (cross-fiber friction)",
      "Chronic pain syndromes",
      "Post-surgical tissue mobility",
      "Lymphedema (effleurage)",
    ],
    contraindications: [
      "Open wounds or active infection",
      "Deep vein thrombosis",
      "Bleeding disorders or anticoagulant therapy",
      "Malignancy in treatment area",
      "Acute inflammatory arthritis flare",
    ],
    precautions: [
      "Avoid bony prominences — direct pressure on bone causes periosteal pain",
      "Gentle technique over recent surgical sites",
      "Post-treatment soreness normal for 24–48h — educate patient",
      "Monitor skin integrity with prolonged friction techniques",
      "Acute contusions: begin 48–72h post-injury (after acute inflammation settles)",
    ],
  },
  {
    id: "myofascial-release",
    name: "Myofascial Release (MFR)",
    category: "Manual Therapy",
    method:
      "Direct technique: 1. Locate fascial restriction — palpate for tightness, warmth, tissue drag. 2. Apply gentle sustained pressure directly into the restriction barrier. 3. Hold 90–120 seconds until softening or 'melting' sensation felt. 4. Do not force — allow tissue to release at its own pace. Indirect technique: 1. Take tissue slightly away from resistance barrier. 2. Follow the path of least resistance. 3. Hold until release felt (rebounding phenomenon). Skin rolling: lift skin away from fascia, roll methodically. J-stroke: firm J-shaped sweep along fascial lines.",
    dosage:
      "Sustained pressure: 90–120 seconds minimum per restriction. 3–5 restrictions per session. J-stroke: 5–6 sweeps per line. Total treatment: 20–40 min.",
    frequency:
      "2–3 sessions per week; allow 48h between sessions for tissue adaptation",
    intensity:
      "Never forceful. Gentle, sustained. Patient feels pressure and deep stretch but not acute pain. Post-treatment tenderness 24–48h is normal.",
    duration:
      "30–60 minutes per session; 8–12 week course with reassessment at 4 weeks",
    indications: [
      "Fibromyalgia",
      "Chronic musculoskeletal pain syndromes",
      "Post-surgical scar tissue restriction",
      "Headaches (suboccipital restrictions)",
      "Plantar fasciitis",
      "Frozen shoulder",
    ],
    contraindications: [
      "Malignancy in treatment area",
      "Acute inflammatory flare",
      "Anticoagulation therapy",
      "Fever or systemic infection",
      "Open wounds or hematoma",
    ],
    precautions: [
      "Healing crisis (temporary symptom flare) common after 3–4 sessions — educate patient",
      "Hydration is important post-treatment",
      "Avoid aggressive technique over healing surgical incisions",
      "Elderly skin may be fragile — reduce pressure",
      "MFR over spine requires advanced training",
    ],
  },
  {
    id: "trigger-point",
    name: "Trigger Point Therapy",
    category: "Manual Therapy",
    method:
      "1. Identify active trigger point (TrP): hyperirritable nodule in taut band of muscle; produces referred pain pattern on palpation. 2. Ischemic compression: apply progressively increasing pressure (thumb, elbow, tool) directly on TrP for 60–90 seconds until pain begins to diminish. 3. Pressure release technique: apply pressure to TrP, hold as barrier releases (not full ischemia). 4. Post-isometric relaxation: patient resists gently against stretch, then releases — therapist takes to new range. 5. Spray and stretch: cold spray applied in direction of referred pain while muscle stretched. 6. Essential: stretch target muscle after TrP release. 7. Limit to 3 active TrPs per session to avoid post-treatment soreness.",
    dosage:
      "Compression: 60–90 seconds per TrP. Pressure release: 30–60 seconds. Limit to 3 TrPs maximum per session. Follow each with 30s passive stretch × 3.",
    frequency: "2–3 sessions per week; avoid consecutive days on same muscle",
    intensity:
      "Pressure sufficient to reproduce referred pain (7/10 VAS maximum). Reduce if patient cannot relax. TrP should 'release' within 60–90 seconds.",
    duration:
      "20–30 minutes per session; 4–6 sessions typically; home program essential",
    indications: [
      "Myofascial pain syndrome",
      "Tension-type headache",
      "Neck pain and thoracic pain",
      "Shoulder girdle muscle dysfunction",
      "Sports-related muscle pain",
      "Temporomandibular dysfunction",
    ],
    contraindications: [
      "Active infection over TrP site",
      "Bleeding disorders",
      "Malignancy in treatment area",
      "Anticoagulant therapy",
      "Patient intolerant of procedure pain",
    ],
    precautions: [
      "Post-treatment soreness 24–48h is normal — ice and stretch",
      "Do not treat >3 TrPs in one session (systemic effect)",
      "Always stretch after compression",
      "Latent TrPs in sensitive individuals may become active",
      "Fibromyalgia patients — very light pressure only",
    ],
  },
  {
    id: "traction",
    name: "Spinal Traction",
    category: "Manual Therapy",
    method:
      "Manual cervical traction: 1. Patient supine; therapist cradles occiput and mandible. 2. Apply sustained longitudinal pull (5–8 kg force) for 10–20s, relax 10s. 3. Intermittent: alternate on/off cycles. Mechanical lumbar traction: 1. Patient prone or supine on traction table. 2. Apply thoracic belt and pelvic harness. 3. Set force: 10–15 kg (or 25–50% body weight) for lumbar. 4. Continuous (sustained) or intermittent (cycle 20s on / 10s off). 5. Ensure patient is comfortable and neutral spine maintained throughout.",
    dosage:
      "Cervical: 5–8 kg force; Lumbar: 10–15 kg (start at 25% body weight; progress to 50%). Intermittent: 20s hold / 10s rest. Continuous: full duration without rest.",
    frequency: "Daily for acute (3–5x/week); 2–3x/week for chronic",
    intensity:
      "Start low (15–20% BW lumbar) and progress based on response. Patient should feel gentle stretch but no pain. Reduce immediately if neurological symptoms worsen.",
    duration:
      "10–20 minutes per session; course 4–6 weeks; manual traction often used within 5–10 min manual therapy sessions",
    indications: [
      "Cervical or lumbar disc herniation (radiculopathy)",
      "Facet joint pain with hypomobility",
      "Nerve root compression",
      "Foraminal stenosis",
      "Cervical muscle spasm",
      "Lumbar degenerative disc disease",
    ],
    contraindications: [
      "Cauda equina syndrome or myelopathy",
      "Vertebral fracture or osteoporosis",
      "Rheumatoid arthritis (cervical spine instability)",
      "Vertebrobasilar insufficiency (cervical)",
      "Aortic aneurysm (lumbar)",
      "Acute inflammatory arthritis",
    ],
    precautions: [
      "Neurological signs that worsen with traction — stop immediately",
      "Start with manual traction to assess response before mechanical",
      "Post-traction: rest 5–10 min before mobilizing",
      "Elderly patients: reduced force; monitor osteoporosis risk",
      "Harness fit: ensure no restriction of breathing",
    ],
  },
  {
    id: "mulligan",
    name: "Mulligan Technique (MWM)",
    category: "Manual Therapy",
    method:
      "Mobilization With Movement (MWM) for peripheral joints: 1. Identify the restricted or painful movement. 2. Apply a sustained accessory glide (parallel to joint plane) in a direction that eliminates pain. 3. While maintaining the accessory glide, ask the patient to perform the active movement that was previously painful/restricted. 4. Movement should be completely pain-free — if not, reassess direction or force. 5. Perform 3×10 repetitions, maintaining sustained glide throughout. SNAG for spine: therapist's thumbs apply anteroposterior glide on spinous process while patient moves through range. Overpressure added at end-range.",
    dosage:
      "3×10 repetitions per technique. Sustained accessory glide throughout active movement. 1–3 techniques per session. May use taping or belts for sustained glide.",
    frequency: "Daily to 3x/week; technique should show immediate improvement",
    intensity:
      "Pain-free application is a prerequisite — if pain occurs, change direction or abandon. Accessory glide: firm but gentle. Patient should report reduction in symptoms after 3 reps.",
    duration:
      "10–20 minutes for MWM component; 4–8 sessions typically; home self-MWM with belt for ongoing",
    indications: [
      "Lateral epicondylalgia (tennis elbow)",
      "Ankle sprain with residual stiffness",
      "Cervical facet pain with rotation restriction",
      "Knee extension deficit",
      "Shoulder impingement syndrome",
      "Wrist stiffness post-Colles fracture",
    ],
    contraindications: [
      "Fracture at treated joint",
      "Joint replacement with restricted directions",
      "Malignancy in treatment area",
      "Severe osteoporosis",
      "Acute disc herniation with severe radiculopathy",
    ],
    precautions: [
      "MUST be pain-free — this is the cardinal rule of MWM",
      "Reassess after 3 reps — if no improvement, re-examine technique",
      "Ensure direction of accessory glide is anatomically correct",
      "Document pre- and post-treatment range/pain to track progress",
      "Patient must report any worsening immediately",
    ],
  },

  // ─── THERMOTHERAPY / CRYOTHERAPY ──────────────────────────────────────────
  {
    id: "hot-packs",
    name: "Hot Packs (Moist Heat Therapy)",
    category: "Thermotherapy / Cryotherapy",
    method:
      "1. Heat pack in hydrocollator at 65–70°C until fully saturated. 2. Remove with tongs — never squeeze; wear insulated gloves. 3. Wrap pack in 6–8 layers of toweling (standard: 1–2 commercial covers + 4–6 towel layers). 4. Place pack on treatment area — patient should feel comfortable warmth, not hot. 5. Check skin at 5 min — look for mottling, excessive redness. 6. Do not allow patient to lie on the pack (weight compression reduces insulation). 7. Remove if patient reports burning or discomfort.",
    dosage:
      "Temperature at skin surface: 40–45°C. Pack temperature: 65–70°C in unit. 6–8 layers toweling as insulation. Reusable hydrocollator packs (silica gel).",
    frequency: "1–2x/day; pre-exercise warm-up 3–5x/week",
    intensity:
      "Comfortable warmth — patient should be able to keep skin contact. No burning sensation. Monitor for mottled skin (livedo reticularis — reduce layers).",
    duration:
      "20–30 minutes per session. Allow pack to reheat 30 min in hydrocollator between uses.",
    indications: [
      "Muscle tension and spasm",
      "Subacute and chronic musculoskeletal pain",
      "Joint stiffness prior to manual therapy or exercise",
      "Trigger point preparation",
      "Chronic arthritis pain relief",
      "Bursitis (subacute)",
    ],
    contraindications: [
      "Acute trauma (first 48–72 hours)",
      "Impaired sensation",
      "Active infection or fever",
      "Malignancy in treatment area",
      "Active inflammation or edema",
      "Deep vein thrombosis",
    ],
    precautions: [
      "Never sleep or rest weight on hot pack — burn risk",
      "Elderly skin is more fragile — add extra towel layer",
      "Check skin every 5 minutes",
      "Patients with poor circulation — use cautiously",
      "Reduce layers if skin becomes excessively red or mottled",
    ],
  },
  {
    id: "cold-packs",
    name: "Cold Packs / Cryotherapy",
    category: "Thermotherapy / Cryotherapy",
    method:
      "1. Prepare ice pack, commercial cold pack (0–5°C), or ice in plastic bag. 2. Wrap in 3–4 layers of wet toweling (damp towel enhances cold transfer vs dry). 3. Apply to treatment area. 4. RICE principle for acute: Rest, Ice, Compression, Elevation. 5. CBAN sensation sequence: Cold → Burning → Aching → Numb (desired end-point for analgesia). 6. Monitor skin color: pale/white indicates ischemia — reduce time or layers. 7. Remove if numbness achieved before time limit. 8. Ice massage: move circular ice cube directly on skin, circular motions.",
    dosage:
      "Commercial pack: 0–5°C. Apply with 3–4 layers damp toweling. Ice massage: direct skin contact, circular motion. Intermittent: 20 min on, 20 min off.",
    frequency:
      "Every 1–2 hours in acute phase (first 24–72h); 2–3x/day in subacute",
    intensity:
      "Comfortable cold through CBAN sequence to numb. Never so cold it causes ice burn (white/blistered skin). Stop at numbness endpoint.",
    duration:
      "15–20 minutes per session. Ice massage: 5–7 minutes. Do not exceed 20 minutes.",
    indications: [
      "Acute musculoskeletal injury (first 72 hours)",
      "Post-exercise pain reduction",
      "Muscle spasm (cryotherapy + stretch)",
      "Post-surgical swelling management",
      "Acute headache",
      "Spasticity management (pre-exercise in neurological patients)",
    ],
    contraindications: [
      "Raynaud's phenomenon or cold hypersensitivity",
      "Cold urticaria",
      "Peripheral vascular disease",
      "Cryoglobulinemia",
      "Open wounds",
      "Impaired sensation",
    ],
    precautions: [
      "Monitor skin color — pale/blanched = ice burn risk",
      "Minimum barrier required (no bare ice-on-skin for >5 min)",
      "Elderly and diabetics: impaired sensation risk",
      "Reapply no sooner than 20 min after removal",
      "After numbness: protect area from further injury",
    ],
  },
  {
    id: "contrast-baths",
    name: "Contrast Baths",
    category: "Thermotherapy / Cryotherapy",
    method:
      "1. Prepare two containers: hot water (40–44°C) and cold water (10–18°C). Verify temperatures with thermometer. 2. Begin in hot water: immerse affected limb for 4 minutes. 3. Transfer to cold water: immerse for 1 minute. 4. Repeat the cycle 4 times (4 cycles total). 5. Always begin and end in hot water. 6. Monitor skin response at each transition. 7. Active exercise of the limb during immersion enhances effect (pumping action). 8. Typical sequence: 4 min hot → 1 min cold → 4 min hot → 1 min cold → (×4 cycles) → end in hot.",
    dosage:
      "Hot: 40–44°C. Cold: 10–18°C. Ratio 4:1 (4 min hot : 1 min cold). 4 cycles (8 total immersions). Total time: approximately 20 minutes.",
    frequency: "1–2x/day in subacute phase; 3–5x/week for chronic conditions",
    intensity:
      "Hot: comfortable warmth (not burning). Cold: uncomfortable but tolerable cold. Both temperatures should be verified with thermometer.",
    duration: "20 minutes per session (4 complete cycles); course 2–4 weeks",
    indications: [
      "Subacute extremity sprains/strains (after 72h)",
      "Chronic edema of hands and feet",
      "Reflex sympathetic dystrophy / CRPS",
      "Rheumatoid arthritis (subacute, distal joints)",
      "Sports injury recovery (ankle, wrist, elbow)",
      "Chronic venous insufficiency",
    ],
    contraindications: [
      "Acute injury (first 72 hours) — use ice only",
      "Arterial insufficiency / peripheral arterial disease",
      "Raynaud's phenomenon",
      "Deep vein thrombosis",
      "Impaired sensation",
      "Open wounds",
    ],
    precautions: [
      "Always verify water temperatures before each session",
      "Elderly patients may tolerate less extreme temperatures",
      "Diabetes: reduce hot temperature (40°C max) due to neuropathy risk",
      "Monitor peripheral circulation (nail bed color, pulses)",
      "Patient should not tolerate pain — adjust temperatures accordingly",
    ],
  },
  {
    id: "paraffin-wax",
    name: "Paraffin Wax Bath",
    category: "Thermotherapy / Cryotherapy",
    method:
      "1. Heat paraffin wax bath unit to 52–54°C. 2. Check temperature with thermometer. 3. Dip-and-wrap method: patient dips hand/foot 7–10 times in quick succession building up layers. 4. Allow momentary cooling between dips (5 seconds). 5. Wrap in plastic wrap then thick towel or insulated mitt. 6. Retain heat for 15–20 minutes. 7. Glove method: as above but shape wax into glove form. 8. Peel off cooled wax — recycle or discard. 9. Massage area post-treatment while skin is warm.",
    dosage:
      "Temperature: 52–54°C. 8–10 dip repetitions. Wrap time: 15–20 minutes. Mineral oil:wax ratio maintained by manufacturer — do not add water.",
    frequency: "Daily in subacute phase; 3–5x/week for chronic conditions",
    intensity:
      "Comfortable warmth throughout — no burning. Patient should feel consistent deep warmth. Check if first dip is tolerable before completing 8–10 dips.",
    duration:
      "15–20 minutes wrapped (after dipping); allow 20 min cool-down of unit before next patient use",
    indications: [
      "Rheumatoid arthritis of hands and feet",
      "Osteoarthritis of distal joints",
      "Scleroderma",
      "Post-fracture stiffness of wrist/hand",
      "Dupuytren's contracture (pre-exercise)",
      "Chronic peripheral neuralgia",
    ],
    contraindications: [
      "Open wounds or skin breakdown",
      "Peripheral vascular disease",
      "Impaired sensation in target area",
      "Active inflammatory flare (avoid heat)",
      "Rash, eczema, or skin infection",
      "Metal implants in distal joints (mild caution — monitor heat)",
    ],
    precautions: [
      "Temperature must be verified every session",
      "Avoid wax unit if patient has latex allergy (check unit composition)",
      "Remove all jewelry before treatment",
      "Burns possible if patient plunges too deeply too fast",
      "Do not share wax between patients — hygiene protocol essential",
    ],
  },
  {
    id: "ice-massage",
    name: "Ice Massage",
    category: "Thermotherapy / Cryotherapy",
    method:
      "1. Prepare ice: fill paper cup with water and freeze, leaving peel-able cup edge for grip. 2. Expose target area (localized trigger point, tendon insertion, small bony area). 3. Apply ice cup directly to skin. 4. Use slow circular or longitudinal strokes, keeping constant movement. 5. Do not hold ice stationary on one spot for more than 10 seconds. 6. Follow CBAN sequence: Cold (0–3 min) → Burning (1–3 min) → Aching (3–5 min) → Numb (5–7 min). 7. Stop at numbness — further treatment is unnecessary and risks ice burn. 8. Treat area should be no larger than 10×15 cm.",
    dosage:
      "Circular/longitudinal strokes; coverage 10×15 cm area max. Duration per CBAN sequence: 5–7 minutes typical. Direct contact — no barrier towel (therapeutic intent is maximal cold transfer).",
    frequency:
      "1–2x/day; as pre-treatment analgesia before stretching/exercise",
    intensity:
      "Progressively increasing cold sensation reaching numb (CBAN). If skin whitens or blisters — ice burn — stop immediately. Target numb endpoint, not pain.",
    duration:
      "5–7 minutes per area; never exceed 10 minutes per site; targeted, localized technique",
    indications: [
      "Localized trigger point desensitization",
      "Patellar tendinopathy (pre-exercise)",
      "Medial/lateral epicondylitis",
      "Achilles tendinopathy",
      "Bursitis",
      "Post-activity pain management for athletes",
    ],
    contraindications: [
      "Raynaud's phenomenon",
      "Cold urticaria",
      "Impaired sensation",
      "Peripheral vascular disease",
      "Cryoglobulinemia",
    ],
    precautions: [
      "Always keep ice moving — stationary ice causes ice burn quickly",
      "Monitor skin color continuously — stop at white/blanching",
      "Do not exceed 10 minutes maximum",
      "Diabetes patients: reduced sensation risk — use with caution",
      "Not indicated for large body areas (use cold pack instead)",
    ],
  },

  // ─── OTHER MODALITIES ─────────────────────────────────────────────────────
  {
    id: "dry-needling",
    name: "Dry Needling (Intramuscular Stimulation)",
    category: "Other Modalities",
    method:
      "1. Identify active trigger point (TrP) by palpation. 2. Clean skin with alcohol swab. 3. Insert fine acupuncture needle (0.25–0.30 mm × 25–50 mm) through skin and into taut band of muscle. 4. Advance needle toward TrP — look for local twitch response (LTR): brief involuntary contraction of the muscle band. 5. Pistoning technique: small up-down movements (5–10 mm excursion) to elicit further LTRs. 6. Once LTRs diminish, withdraw needle. 7. Apply direct pressure to prevent bruising. 8. Stretch target muscle for 30 seconds after treatment. 9. Limit to 1–5 needles per session initially.",
    dosage:
      "Needle gauge: 0.25–0.30 mm diameter. Length: 25–50 mm. 1–5 needles per session. Multiple LTR elicitation per needle (10–15 pistoning movements). Limit to 2–3 muscles per session.",
    frequency:
      "1–2x/week; allow 48–72 hours recovery between sessions on same muscle",
    intensity:
      "Local twitch response is target — brief, involuntary muscle twitch (not patient-controlled). Post-needling soreness (DOMS-like) 24–48h is expected and normal.",
    duration:
      "5–20 minutes per session; needles in tissue typically 30–90 seconds per site; course 4–8 sessions",
    indications: [
      "Myofascial pain syndrome",
      "Chronic neck and upper back pain",
      "Tension headaches",
      "Plantar fasciitis",
      "Gluteal and piriformis syndrome",
      "Sports-related muscle dysfunction",
    ],
    contraindications: [
      "Needle phobia",
      "Anticoagulant therapy (relative — proceed with caution)",
      "Active skin infection or open wounds at site",
      "Immunosuppression",
      "Lymphedema (avoid edematous limb)",
      "Pregnancy (over abdomen/low back)",
    ],
    precautions: [
      "Post-needling soreness 24–48h is normal — ice and gentle movement",
      "Vasovagal response: treat supine, have patient remain lying for 10 min post",
      "Bleeding risk: apply compression for 2–3 min after withdrawal",
      "Pneumothorax risk over chest wall — angle needle appropriately",
      "Practitioner MUST have specific dry needling training certification",
    ],
  },
  {
    id: "cupping",
    name: "Cupping Therapy",
    category: "Other Modalities",
    method:
      "1. Apply massage oil liberally to skin to allow smooth movement (dynamic cupping) or for skin protection (static). 2. Static cupping: place cup on skin, activate suction (fire, pump, or silicone squeeze), leave in position 5–15 min. 3. Dynamic (gliding) cupping: apply suction at reduced pressure, glide cup along muscle belly in long strokes following muscle fiber direction. 4. Cup size selection: small (face/joints), medium (limbs), large (back/thighs). 5. Suction pressure: light (skin barely raised) to strong (dark mark formation). 6. Multiple cups can be placed simultaneously in a pattern. 7. Remove by pressing skin beside cup to break suction — do not pull directly.",
    dosage:
      "Static: 5–15 minutes per cup placement. Dynamic: 5–10 long strokes per muscle group. Suction negative pressure: 50–450 mmHg depending on treatment depth. 3–6 cups per session.",
    frequency:
      "1–2x/week; allow marks to fully resolve before repeating on same site",
    intensity:
      "Light: superficial lymphatic drainage. Medium: muscle tension relief. Strong: deep tissue mobilization with mark formation. Marks last 3–7 days — educate patient.",
    duration:
      "20–30 minutes per session including prep; marks may persist 3–7 days",
    indications: [
      "Muscle tension and myofascial pain",
      "Respiratory conditions (back cupping for congestion)",
      "Chronic low back pain",
      "Neck and shoulder tension",
      "Sports recovery and performance",
      "Lymphatic drainage (light cupping)",
    ],
    contraindications: [
      "Over varicose veins",
      "Over bony prominences",
      "Active skin infection, inflammation or eczema at site",
      "Bleeding disorders",
      "Deep vein thrombosis over treatment area",
      "Over active cancer lesions",
    ],
    precautions: [
      "Cupping marks (ecchymosis) are not bruises — educate patient before treatment",
      "Do not cup on edematous or inflamed skin",
      "Geriatric/fragile skin: light suction only",
      "Dehydrated patients: drink water before treatment",
      "First session: lighter suction to assess skin response",
    ],
  },
  {
    id: "kinesiotaping",
    name: "Kinesio Taping",
    category: "Other Modalities",
    method:
      "1. Clean and dry skin; clip hair if needed; warm skin for better adhesion. 2. Cut tape in required shape: I-strip (muscle facilitation/inhibition), Y-strip (over muscle belly), X-strip (crosses over joint), fan cut (lymphatic/edema). 3. Always apply anchor (ends of tape) with 0% tension — do not stretch anchor ends. 4. Application techniques: Facilitation (10–25% stretch, applied from insertion to origin): activates weak muscle. Inhibition (15–25% stretch, applied from origin to insertion): relaxes overactive muscle. Space/decompression (50–75% stretch for space creation): elevates skin for edema/bruising. 5. Smooth tape gently to activate adhesive heat.",
    dosage:
      "Tape tension: 0% (anchor), 10–25% (facilitation/inhibition), 50–75% (decompression). Fan cut: 4–6 tails, 0–10% tension. Tape wear: 3–5 days (shower-proof). 2–3 layers maximum.",
    frequency: "Replace tape every 3–5 days; 2–4 applications per month",
    intensity:
      "Light stretch for neurological facilitation/inhibition; moderate stretch for structural support; high stretch (50–75%) for lymphatic drainage only.",
    duration:
      "3–5 days per application; ongoing as maintenance; 4–8 week treatment course",
    indications: [
      "Shoulder impingement syndrome",
      "Patellofemoral pain syndrome",
      "Ankle sprain support",
      "Lymphedema management",
      "Posture correction",
      "Muscle inhibition in hypertonic muscles post-stroke",
    ],
    contraindications: [
      "Open wounds or active skin infection under tape",
      "Deep vein thrombosis (local area)",
      "Fragile skin (elderly, post-steroid skin)",
      "Known latex or adhesive allergy",
      "Malignancy beneath tape area",
    ],
    precautions: [
      "Test patch 24h before full application in sensitive patients",
      "Ensure no wrinkling at anchor — wrinkling = too much tension",
      "Remove tape slowly by rolling back, moistening skin if needed",
      "Tape should not cause redness, itching or blistering — remove if occurs",
      "Hair removal required for prolonged wear in hairy regions",
    ],
  },
  {
    id: "balance-coordination",
    name: "Balance & Coordination Training",
    category: "Other Modalities",
    method:
      "1. Baseline assessment: Romberg test (eyes open, feet together), single-leg stance time, TUG (Timed Up and Go). 2. Static balance progression: feet together → tandem stance → single-leg → single-leg on foam. 3. Each position: eyes open → eyes closed → cognitive dual-task (count backward from 100 by 3s). 4. Dynamic balance: step-up/down, side steps, star excursion balance test (SEBT) — reach in 8 directions. 5. Perturbation training: therapist provides unexpected light pushes in multiple directions. 6. Functional tasks: reach, catch, tandem walking, stepping over obstacles.",
    dosage:
      "Static holds: 3×30 seconds per position, progressing to 60 seconds. Dynamic reps: 3×10 per direction. SEBT: 3 trials per direction per leg. Dual-task: add cognitive challenge once static form mastered.",
    frequency: "Daily (home program component) or 3–5x/week supervised",
    intensity:
      "Challenging but safe — patient should wobble but not fall. Support (wall, parallel bars) available. Progress to unsupported when 3×30s achieved without break.",
    duration:
      "15–25 minutes per session; 6–12 week program; integrate into broader rehab",
    indications: [
      "Falls prevention in elderly",
      "Post-stroke balance retraining",
      "Vestibular rehabilitation",
      "Post-ankle sprain proprioception",
      "Cerebellar ataxia",
      "Post-ACL reconstruction",
    ],
    contraindications: [
      "Active vertigo episode",
      "Non-weight bearing restrictions",
      "Severe cognitive impairment limiting instruction following",
      "Unstabilized fracture",
    ],
    precautions: [
      "Safety spotting essential — therapist ready to catch patient",
      "Ensure non-slip footwear and surface",
      "Progress to eyes-closed only after stable eyes-open performance",
      "Dual-tasking increases fall risk — introduce gradually",
      "Fatigue significantly impairs balance — limit session length",
    ],
  },
  {
    id: "gait-training",
    name: "Gait Training",
    category: "Other Modalities",
    method:
      "1. Baseline gait analysis: cadence, step length, stride width, stance/swing ratio, trunk sway. 2. Start in parallel bars: weight shift side-to-side and forward-backward. 3. Progression: parallel bars → standard walking frame → elbow crutches → single cane → free walking. 4. Key gait parameters to target: heel strike initiation, hip extension in late stance, step length symmetry, cadence uniformity. 5. Treadmill gait training: controlled speed with harness unloading system (30–50% BW offloading initially). 6. Stair training: leading with stronger limb up (stronger goes up first — good goes to heaven), weaker goes down first (bad goes down to hell). 7. Outdoor/community ambulation training last.",
    dosage:
      "Parallel bars: 10–15 m passes × 5–10 repetitions. Treadmill: 0.5–1.5 mph initial speed; 30–50% body weight unloading decreasing over sessions. Overground: 20–30 minute sessions. Stair training: 5 flights progressing to community stairs.",
    frequency: "Daily in acute inpatient rehab; 3–5x/week outpatient",
    intensity:
      "Challenging but safe. Measure with 10-meter walk test and 6-minute walk test for outcomes. Physiological cost index as intensity measure. RPE 11–14 for aerobic component.",
    duration:
      "20–30 minutes per session; acute inpatient: daily until discharge; outpatient: 6–12 week program",
    indications: [
      "Post-stroke hemiplegia gait rehabilitation",
      "Hip/knee replacement post-operative mobility",
      "Spinal cord injury partial recovery",
      "Parkinson's disease gait freezing",
      "Orthopedic injuries with gait deviation",
      "Pediatric gait disorders (cerebral palsy, toe walking)",
    ],
    contraindications: [
      "Non-weight bearing restrictions (surgical protocol)",
      "Severe cardiovascular instability",
      "Uncontrolled orthostatic hypotension",
      "Active lower limb fracture without surgical fixation",
    ],
    precautions: [
      "Always have safety belt in early stages",
      "Monitor vital signs with cardiac/respiratory patients",
      "Adequate footwear and orthotics if prescribed",
      "Progress ambulation aid reduction based on balance/confidence",
      "Uneven surfaces only after adequate indoor gait established",
    ],
  },
];

export const CATEGORY_CONFIG = {
  Electrotherapy: {
    color: "oklch(0.72 0.17 195)",
    bg: "oklch(0.72 0.17 195 / 0.1)",
    border: "oklch(0.72 0.17 195 / 0.3)",
    text: "oklch(0.85 0.12 195)",
    glow: "oklch(0.72 0.17 195 / 0.25)",
    iconGlow: "icon-glow-teal",
  },
  "Exercise Therapy": {
    color: "oklch(0.68 0.18 155)",
    bg: "oklch(0.68 0.18 155 / 0.1)",
    border: "oklch(0.68 0.18 155 / 0.3)",
    text: "oklch(0.82 0.14 155)",
    glow: "oklch(0.68 0.18 155 / 0.25)",
    iconGlow: "icon-glow-green",
  },
  "Manual Therapy": {
    color: "oklch(0.68 0.20 250)",
    bg: "oklch(0.68 0.20 250 / 0.1)",
    border: "oklch(0.68 0.20 250 / 0.3)",
    text: "oklch(0.82 0.15 250)",
    glow: "oklch(0.68 0.20 250 / 0.25)",
    iconGlow: "icon-glow-blue",
  },
  "Thermotherapy / Cryotherapy": {
    color: "oklch(0.72 0.18 60)",
    bg: "oklch(0.72 0.18 60 / 0.1)",
    border: "oklch(0.72 0.18 60 / 0.3)",
    text: "oklch(0.85 0.14 60)",
    glow: "oklch(0.72 0.18 60 / 0.25)",
    iconGlow: "icon-glow-amber",
  },
  "Other Modalities": {
    color: "oklch(0.68 0.20 290)",
    bg: "oklch(0.68 0.20 290 / 0.1)",
    border: "oklch(0.68 0.20 290 / 0.3)",
    text: "oklch(0.82 0.15 290)",
    glow: "oklch(0.68 0.20 290 / 0.25)",
    iconGlow: "icon-glow-purple",
  },
} as const;
