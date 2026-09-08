/**
 * Cath Lab Clinical Presets & Dynamic Persistent Custom Dictionary Manager
 */

const STORAGE_CUSTOM_PRESETS_KEY = 'cks_pci_custom_presets_v1';

// Base Default Presets
const DEFAULT_CATH_LAB_PRESETS = {
  operators: [
    "Dr. PRAKASH CHANDWANI",
    "Dr. KUSHAL JANGID",
    "Dr. NITESH PANSARI",
    "Dr. PRAKASH CHANDWANI / Dr. KUSHAL JANGID",
    "Dr. PRAKASH CHANDWANI / Dr. NITESH PANSARI",
    "Dr. KUSHAL JANGID / Dr. NITESH PANSARI"
  ],

  indications: [
    "Acute Anterior Wall Myocardial Infarction (AWMI)",
    "Acute Inferior Wall Myocardial Infarction (IWMI)",
    "Non-ST Elevation Myocardial Infarction (NSTEMI)",
    "Unstable Angina Pectoris",
    "Post-MI Angina",
    "Chronic Stable Angina Class III",
    "High Risk Single / Double Vessel Disease"
  ],

  lesions: [
    "LAD: 90% Thrombotic Ostial / Proximal Stenosis",
    "LAD: 95% Subtotal Stenosis in Proximal Segment",
    "LAD: 85% Mid Segment Stenosis",
    "RCA: 95% Subtotal Proximal Stenosis",
    "RCA: 90% Mid Segment Stenosis",
    "LCX: 80% Mid Segment Stenosis",
    "Obtuse Marginal (OM1): 90% Stenosis",
    "Nil / Normal Coronaries"
  ],

  routes: [
    "Right Radial",
    "Left Radial",
    "Right Femoral",
    "Left Femoral",
    "Right Brachial"
  ],

  aorticPressures: [
    "120/80 mmHg",
    "130/80 mmHg",
    "110/70 mmHg",
    "140/85 mmHg",
    "125/75 mmHg",
    "100/60 mmHg"
  ],

  contrasts: [
    "Omnipaque 350 (80 ml)",
    "Omnipaque 350 (100 ml)",
    "Visipaque 320 (90 ml)",
    "Ultravist 370 (80 ml)",
    "Iodixanol 320 (100 ml)"
  ],

  gp2b3aInhibitors: [
    "Inj. Eptifibatide (Bolus 180 mcg/kg + Infusion)",
    "Inj. Tirofiban (Bolus + Infusion)",
    "Inj. Abciximab",
    "Nil / None"
  ],

  guidingCatheters: [
    "6F EBU 3.5 (Medtronic)",
    "6F JL4",
    "6F JR4",
    "6F AL1",
    "6F XB 3.5",
    "7F EBU 3.5",
    "6F Launcher EBU 3.5",
    "6F Ikari Left 3.5"
  ],

  guideWires: [
    "Runthrough NS 0.014\" x 180 cm",
    "BMW (Balance Middle Weight) 0.014\"",
    "Choice PT 0.014\"",
    "Sion Blue 0.014\"",
    "Fielder FC 0.014\"",
    "Whisper Extra Support 0.014\"",
    "Grand Slam 0.014\""
  ],

  preDilatations: [
    "NC Balloon 2.0 x 12 mm @ 12 atm",
    "NC Balloon 2.5 x 15 mm @ 14 atm",
    "NC Sapphire 2.5 x 12 mm @ 14 atm",
    "Semi-compliant Balloon 2.0 x 10 mm @ 10 atm",
    "Semi-compliant Balloon 2.5 x 12 mm @ 12 atm",
    "Direct Stenting (No Pre-dilatation)"
  ],

  stents: [
    "DES (Resolute Onyx) 2.75 x 24 mm",
    "DES (Resolute Onyx) 3.0 x 28 mm",
    "DES (Resolute Onyx) 3.5 x 38 mm",
    "DES (Xience Skypoint) 3.0 x 28 mm",
    "DES (Xience Skypoint) 3.5 x 33 mm",
    "DES (Synergy) 2.75 x 28 mm",
    "DES (Ultimaster Nagomi) 3.0 x 33 mm",
    "DES (Promus PREMIER) 3.0 x 24 mm"
  ],

  postDilatations: [
    "NC Balloon 3.0 x 12 mm @ 16 atm",
    "NC Balloon 3.25 x 12 mm @ 18 atm",
    "NC Balloon 3.5 x 15 mm @ 18 atm",
    "NC Accuforce 3.5 x 12 mm @ 18 atm",
    "POT done with NC Balloon 3.5 x 8 mm @ 18 atm",
    "Nil"
  ],

  endResults: [
    "TIMI III Flow with 0% Residual Stenosis and no dissection/thrombus.",
    "Successful Stent deployment with TIMI III distal flow and well-apposed stent struts.",
    "Satisfactory result with complete revascularization and TIMI III flow."
  ],

  conclusions: [
    "Successful Primary PCI to LAD with Drug Eluting Stent (DES).",
    "Successful Percutaneous Coronary Intervention (PCI) to RCA with DES.",
    "Successful PCI to LCX with DES under full aseptic precautions."
  ],

  advises: [
    "1. Tab. Aspirin 75mg OD continuously.\n2. Tab. Ticagrelor 90mg BD (or Clopidogrel 75mg OD) for 12 months.\n3. Tab. Atorvastatin 80mg HS.\n4. Tab. Metoprolol XL 25mg OD.\n5. Follow up in Cath OPD after 7 days.\n6. Keep puncture site clean & dry; avoid heavy lifting for 5 days.",
    "1. Dual Antiplatelet Therapy (DAPT) for 1 year.\n2. High-intensity Statin therapy.\n3. Echocardiography assessment after 4 weeks.\n4. Strict blood pressure and glycemic control."
  ],

  addresses: [
    "Jaipur, Rajasthan",
    "Vaishali Nagar, Jaipur",
    "Mansarovar, Jaipur",
    "VKIA, Jaipur",
    "Vidhyadhar Nagar, Jaipur",
    "Sikar, Rajasthan",
    "Ajmer, Rajasthan",
    "Alwar, Rajasthan"
  ],

  doctors: [
    "Dr. PRAKASH CHANDWANI",
    "Dr. KUSHAL JANGID",
    "Dr. NITESH PANSARI"
  ]
};

// Load saved custom entries from LocalStorage
function getCustomPresets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_CUSTOM_PRESETS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

// Get combined list of Default + Custom presets for a category key
function getCombinedPresets(categoryKey) {
  const defaults = DEFAULT_CATH_LAB_PRESETS[categoryKey] || [];
  const customs = getCustomPresets()[categoryKey] || [];
  
  // Combine unique items
  const set = new Set([...defaults, ...customs]);
  return Array.from(set);
}

// Add a new custom preset item permanently to a category
function saveCustomPreset(categoryKey, newValue) {
  const trimmed = (newValue || '').trim();
  if (!trimmed) return false;

  const currentCustoms = getCustomPresets();
  if (!currentCustoms[categoryKey]) {
    currentCustoms[categoryKey] = [];
  }

  // Avoid duplicates
  if (!currentCustoms[categoryKey].includes(trimmed) && !DEFAULT_CATH_LAB_PRESETS[categoryKey]?.includes(trimmed)) {
    currentCustoms[categoryKey].push(trimmed);
    localStorage.setItem(STORAGE_CUSTOM_PRESETS_KEY, JSON.stringify(currentCustoms));
  }

  return true;
}
