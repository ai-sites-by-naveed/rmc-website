/**
 * Risk Management Consultants (RMC) — Services Scope & Mobilization Estimator
 * Drives #scope-estimator on services.html and locks structured engineering
 * prefill context onto #est-lock-cta for #consultation-modal.
 */

const DISCIPLINE_CONFIG = {
  'ehs-audits': {
    label: 'EHS Audits, Gap Studies & Statutory Compliance',
    baseWeeks: {
      audit: [2, 3],
      design: [3, 5],
      turnkey: [5, 8],
      'turnkey-om': [6, 10],
    },
    docs: [
      'Current plant layout, department headcount & shift roster',
      'Existing Sindh OSH / Labour Directorate inspection notices or buyer audit CAPs',
      'Chemical inventory (SDS sheets), permit-to-work & LOTO registers',
    ],
    clearances: {
      karachi: [
        'Sindh Occupational Safety & Health (OSH) Act 2017 compliance dossier',
        'S.I.T.E. / Korangi / Port Qasim estate & export buyer CAP readiness',
        'Building Code of Pakistan (Fire Safety Provisions 2016) gap matrix',
      ],
      sindh: [
        'Sindh Occupational Safety & Health (OSH) Act 2017 & Rules 2019',
        'District Labour Directorate & SEPA statutory record alignment',
        'Building Code of Pakistan (Fire Safety Provisions 2016) gap matrix',
      ],
      nationwide: [
        'Provincial OSH / Factories Act statutory audit dossier',
        'Building Code of Pakistan (Fire Safety Provisions 2016) life-safety review',
        'Buyer & insurer EHS pre-qualification documentation package',
      ],
    },
  },
  'ehs-systems': {
    label: 'ISO 45001 / ISO 14001 Management Systems & Training',
    baseWeeks: {
      audit: [2, 4],
      design: [4, 7],
      turnkey: [8, 12],
      'turnkey-om': [10, 14],
    },
    docs: [
      'Organization chart, process flowcharts & multi-shift operational boundaries',
      'Existing SOPs, incident logs, near-miss records & emergency drill history',
      'Legal register covering environmental, labour & fire safety obligations',
    ],
    clearances: {
      karachi: [
        'ISO 45001:2018 & ISO 14001:2015 Stage-1 / Stage-2 certification readiness',
        'Sindh OSH Act 2017 Safety Committee & statutory training logs',
        'Annual mock evacuation & emergency response drill validation records',
      ],
      sindh: [
        'ISO 45001:2018 & ISO 14001:2015 internal audit & management review files',
        'Sindh OSH Act 2017 & SEPA operational control procedures',
        'Live tabletop & fire-marshal competency drill certification',
      ],
      nationwide: [
        'ISO 45001:2018 & ISO 14001:2015 certification audit dossier',
        'Provincial OSH & EPA compliance management framework',
        'Multi-site EHS supervisor & emergency warden training sign-off',
      ],
    },
  },
  wastewater: {
    label: 'Industrial Wastewater Treatment (ETP / STP / RO Reuse)',
    baseWeeks: {
      audit: [2, 3],
      design: [4, 6],
      turnkey: [10, 14],
      'turnkey-om': [12, 16],
    },
    docs: [
      'Composite raw wastewater lab profile (BOD, COD, TSS, TDS, pH, color)',
      'Daily hydraulic flow variation & production shift schedule',
      'Available footprint CAD layout & utility power/drainage tie-ins',
    ],
    clearances: {
      karachi: [
        'SEPA / Sindh Environmental Quality Standards (SEQS)',
        'ZDHC Wastewater Guidelines (Export Textile / Dyeing)',
        'SEPA-approved third-party composite commissioning lab check',
      ],
      sindh: [
        'SEPA / Sindh Environmental Quality Standards (SEQS) effluent compliance',
        'Nooriabad / Kotri / Hub industrial effluent & sludge disposal manifest',
        'SEPA-approved laboratory composite commissioning verification',
      ],
      nationwide: [
        'Applicable EPA (PEQS / NEQS) effluent discharge compliance',
        'Export buyer ZDHC / ISO 14001 wastewater monitoring alignment',
        'EPA-accredited third-party composite commissioning lab test',
      ],
    },
  },
  'fire-suppression': {
    label: 'Turnkey Fire Suppression (Hydrants, Sprinklers, Pumps, Clean Agent)',
    baseWeeks: {
      audit: [2, 3],
      design: [3, 5],
      turnkey: [8, 12],
      'turnkey-om': [10, 14],
    },
    docs: [
      'Architectural CAD plans, ceiling heights & hazard occupancy classification',
      'Raw fire-water reservoir capacity, municipal supply & standby generator rating',
      'Server/electrical room volumes & enclosure integrity details (clean agent)',
    ],
    clearances: {
      karachi: [
        'Building Code of Pakistan (Fire Safety Provisions 2016) compliance',
        'NFPA 13 / 14 / 20 / 2001 hydraulic & hydrostatic acceptance (12 bar)',
        'KMC Fire Brigade / Civil Defence / SBCA NOC technical pack',
      ],
      sindh: [
        'Building Code of Pakistan (Fire Safety Provisions 2016) compliance',
        'NFPA 13 / 14 / 20 / 2001 installation & hydrostatic witness dossier',
        'Regional Fire Brigade, Rescue 1122 & insurer property-risk sign-off',
      ],
      nationwide: [
        'Building Code of Pakistan (Fire Safety Provisions 2016) compliance',
        'NFPA 13 / 14 / 20 / 2001 engineering commissioning & witness logs',
        'Provincial Rescue 1122 / Civil Defence NOC & insurer loss-control file',
      ],
    },
  },
  'fire-detection': {
    label: 'Addressable Fire Detection & Alarm Systems (NFPA 72)',
    baseWeeks: {
      audit: [1, 2],
      design: [2, 4],
      turnkey: [6, 9],
      'turnkey-om': [8, 11],
    },
    docs: [
      'Floor-by-floor reflected ceiling plans, HVAC duct & shaft layouts',
      'Existing BMS, elevator recall, fire door & AHU shutdown interface schedule',
      'Zone matrix & emergency evacuation muster / security room location',
    ],
    clearances: {
      karachi: [
        'NFPA 72 National Fire Alarm & Signaling Code test protocol',
        'Building Code of Pakistan (Fire Safety Provisions 2016) cause-and-effect matrix',
        'KMC Fire Brigade / SBCA life-safety alarm inspection sign-off',
      ],
      sindh: [
        'NFPA 72 loop continuity, battery autonomy (24h standby) & sounder dB logs',
        'Building Code of Pakistan (Fire Safety Provisions 2016) interface check',
        'District Fire & Rescue 1122 commissioning verification record',
      ],
      nationwide: [
        'NFPA 72 commissioning, HVAC shutdown & cause-and-effect certification',
        'Building Code of Pakistan (Fire Safety Provisions 2016) alarm dossier',
        'Provincial Rescue 1122 / Building Authority NOC support documentation',
      ],
    },
  },
  'fire-investigation': {
    label: 'Post-Incident Fire Forensics & Root-Cause Investigation (NFPA 921)',
    baseWeeks: {
      audit: [1, 2],
      design: [2, 4],
      turnkey: [3, 6],
      'turnkey-om': [4, 7],
    },
    docs: [
      'Unaltered scene preservation status, CCTV/access logs & BMS/SCADA alarm dumps',
      'Electrical single-line diagrams, breaker trip logs & maintenance work orders',
      'Insurer policy reference, process inventory & witness interview roster',
    ],
    clearances: {
      karachi: [
        'NFPA 921 scientific origin, arc-mapping & cause determination report',
        'Insurance loss-adjuster & reinsurer technical defense submission',
        'CAPA engineering roadmap aligned with BCP 2016 & Sindh OSH Act 2017',
      ],
      sindh: [
        'NFPA 921 forensic fire dossier & chain-of-custody evidence log',
        'Insurance claim adjudication & statutory inquiry technical brief',
        'Remedial electrical/fire CAPA design aligned with BCP 2016',
      ],
      nationwide: [
        'NFPA 921 & NFPA 1033 scientific origin & cause forensic dossier',
        'Corporate board, insurer & regulatory authority technical defense file',
        'Engineered CAPA retrofit package aligned with Building Code of Pakistan 2016',
      ],
    },
  },
};

const ENGAGEMENT_MODIFIERS = {
  audit: {
    label: 'Audit & Gap Study Only',
    extraDocs: ['Last 12 months of utility bills, maintenance logs & third-party inspection reports'],
    weekNote: '',
  },
  design: {
    label: 'Engineering Design + BOQ',
    extraDocs: ['Surveyed site boundary & structural load constraints for equipment pads'],
    weekNote: '',
  },
  turnkey: {
    label: 'Turnkey Supply, Install & Commissioning',
    extraDocs: ['Site crane/access clearance & hot-work permit protocols for installation crews'],
    weekNote: '',
  },
  'turnkey-om': {
    label: 'Turnkey + 12-Month O&M',
    extraDocs: ['Dedicated operator shift roster & consumables storage area allocation'],
    weekNote: ' + 12-Mo O&M',
  },
};

const SCALE_CONFIG = {
  small: {
    label: '< 25,000 sq.ft / < 50 m3/day',
    multiplier: 0.75,
  },
  medium: {
    label: '25k-100k sq.ft / 50-250 m3/day',
    multiplier: 1,
  },
  large: {
    label: '> 100,000 sq.ft / > 250 m3/day',
    multiplier: 1.4,
  },
};

const REGION_CONFIG = {
  karachi: {
    label: 'Karachi Industrial Estates',
    weekAdd: 0,
    mobilization: {
      immediate: '24 Hours',
      standard: '48–72 Hours',
    },
  },
  sindh: {
    label: 'Sindh Corridor (Nooriabad / Hub / Hyderabad)',
    weekAdd: 1,
    mobilization: {
      immediate: '24–36 Hours',
      standard: '48–72 Hours',
    },
  },
  nationwide: {
    label: 'Punjab / KP / Nationwide',
    weekAdd: 2,
    mobilization: {
      immediate: '48 Hours',
      standard: '3–5 Business Days',
    },
  },
};

/**
 * Populate an unordered list element cleanly without innerHTML.
 * @param {HTMLElement | null} listEl
 * @param {string[]} items
 */
function renderChecklist(listEl, items) {
  if (!listEl) return;
  const nodes = items.map((text) => {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
  });
  listEl.replaceChildren(...nodes);
}

function initScopeEstimator() {
  const section = document.getElementById('scope-estimator');
  const form = document.getElementById('scope-estimator-form');
  if (!section || !form) return;

  const disciplineSelect = document.getElementById('est-discipline');
  const timelineEl = document.getElementById('est-timeline');
  const mobilizationEl = document.getElementById('est-mobilization');
  const docsEl = document.getElementById('est-docs');
  const clearancesEl = document.getElementById('est-clearances');
  const lockCta = document.getElementById('est-lock-cta');

  const getCheckedValue = (name, fallback) => {
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    return checked instanceof HTMLInputElement ? checked.value : fallback;
  };

  const updateEstimator = () => {
    const disciplineKey =
      disciplineSelect instanceof HTMLSelectElement && DISCIPLINE_CONFIG[disciplineSelect.value]
        ? disciplineSelect.value
        : 'wastewater';
    const engagementKey = getCheckedValue('engagement', 'turnkey');
    const scaleKey = getCheckedValue('scale', 'medium');
    const regionKey = getCheckedValue('region', 'karachi');

    const discipline = DISCIPLINE_CONFIG[disciplineKey];
    const engagement = ENGAGEMENT_MODIFIERS[engagementKey] || ENGAGEMENT_MODIFIERS.turnkey;
    const scale = SCALE_CONFIG[scaleKey] || SCALE_CONFIG.medium;
    const region = REGION_CONFIG[regionKey] || REGION_CONFIG.karachi;

    const [baseMin, baseMax] = discipline.baseWeeks[engagementKey] || discipline.baseWeeks.turnkey;
    const minWeeks = Math.max(1, Math.round(baseMin * scale.multiplier) + region.weekAdd);
    const maxWeeks = Math.max(minWeeks + 1, Math.round(baseMax * scale.multiplier) + region.weekAdd);
    const timelineText = `${minWeeks}–${maxWeeks} Weeks${engagement.weekNote}`;

    const isImmediate = disciplineKey === 'fire-investigation' || engagementKey === 'audit';
    const mobilizationText = isImmediate
      ? region.mobilization.immediate
      : region.mobilization.standard;

    if (timelineEl) timelineEl.textContent = timelineText;
    if (mobilizationEl) mobilizationEl.textContent = mobilizationText;

    const combinedDocs = [...discipline.docs];
    if (scaleKey === 'large' || engagementKey === 'turnkey' || engagementKey === 'turnkey-om') {
      combinedDocs.push(...engagement.extraDocs);
    }
    renderChecklist(docsEl, combinedDocs);

    const clearanceList = discipline.clearances[regionKey] || discipline.clearances.karachi;
    renderChecklist(clearancesEl, clearanceList);

    if (lockCta) {
      lockCta.dataset.servicePrefill = disciplineKey;
      lockCta.dataset.scopePrefill =
        `[${engagement.label}] ${discipline.label} — Scale: ${scale.label} · ` +
        `Region: ${region.label} | Est. Window: ${timelineText} · Site Dispatch: ${mobilizationText}`;
    }
  };

  form.addEventListener('change', updateEstimator);
  form.addEventListener('input', updateEstimator);
  form.addEventListener('reset', () => {
    window.requestAnimationFrame(updateEstimator);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    updateEstimator();
    lockCta?.focus();
  });

  updateEstimator();
}

initScopeEstimator();
