/**
 * Risk Management Consultants (RMC) — Case Studies Filter & Engineering Dossier Modal
 * Drives #case-filter-form multi-criteria filtering and #case-dossier-modal on case-studies.html.
 */

const CASE_DOSSIERS = {
  'RMC-CS-01': {
    code: 'RMC-CS-01 · Representative Benchmark',
    title: 'Textile Dye-House Biological + UF/RO Effluent Plant & 62% Water Recovery',
    serviceValue: 'wastewater',
    badges: [
      { text: 'RMC-CS-01', variant: 'navy' },
      { text: 'ETP & Water Reuse', variant: 'teal' },
      { text: 'Textile & Dyeing', variant: 'navy' },
      { text: 'Representative Benchmark', variant: 'amber' },
    ],
    location: 'S.I.T.E. Industrial Area, Karachi · Export Woven & Reactive Dyeing Mill (250+ m3/day stream)',
    challenge:
      'High-salinity reactive dye-bath discharges exhibited dark color, COD spikes above 1,100 mg/L, elevated TDS, and erratic pH swings between scour and mercerizing batches—risking SEQS non-compliance and heavy reliance on expensive tanker water.',
    solution:
      'RMC engineered a segregated-stream equalization tank with automated lime/coagulant flash-mix, dissolved air clarification, dual-stage aerobic MBBR/activated sludge biological polishing, pressure sand/carbon filtration, and high-recovery UF + brackish RO trains.',
    results:
      'Treated effluent consistently stabilized below SEQS discharge ceilings (COD < 110 mg/L, BOD < 45 mg/L, zero visible dye plume), while 62% permeate recovery displaced costly external raw-water tankers across washing lines.',
    standards: 'SEPA / Sindh Environmental Quality Standards (SEQS), ZDHC Wastewater Guidelines, ISO 14001',
    metrics: [
      { label: 'Treated COD', value: '< 110 mg/L' },
      { label: 'Treated BOD', value: '< 45 mg/L' },
      { label: 'Water Recovery', value: '62% Reuse' },
    ],
    scopePrefill:
      'Benchmark RMC-CS-01 Inquiry: Industrial ETP + UF/RO water recycling retrofit for reactive textile dyeing effluent (SEQS & ZDHC compliance).',
  },
  'RMC-CS-02': {
    code: 'RMC-CS-02 · Representative Benchmark',
    title: 'Pharmaceutical Sterile Suite Addressable Fire Detection & FM-200 Clean Agent Suppression',
    serviceValue: 'fire-detection',
    badges: [
      { text: 'RMC-CS-02', variant: 'navy' },
      { text: 'Fire Detection & Clean Agent', variant: 'amber' },
      { text: 'Pharma & Chemical', variant: 'navy' },
      { text: 'Representative Benchmark', variant: 'amber' },
    ],
    location: 'Korangi Industrial Area, Karachi · Sterile Formulation Plant, QC Labs & MV Switchgear',
    challenge:
      'Legacy conventional zone wiring prevented pinpoint fault localization, lacked automated HVAC AHU trip interlocks, and exposed cleanrooms, stability chambers, and switchgear vaults to unacceptable water-damage or contamination hazards.',
    solution:
      'Designed and installed an intelligent multi-loop addressable NFPA 72 FACP network with optical/thermal multi-criteria detectors, cause-and-effect AHU damper/fire-door relays, 24-hour standby battery banks, and engineered FM-200 clean-agent total flooding for server and MV/LV rooms.',
    results:
      'Sub-5-second addressable alarm pinpoint isolation across production zones, zero-residue electrical room protection, automated air-handling containment, and full GMP / insurer pre-audit sign-off.',
    standards: 'NFPA 72 (Fire Alarm & Signaling), NFPA 2001 (Clean Agent), BCP Fire Safety Provisions 2016',
    metrics: [
      { label: 'Fault Isolation', value: '< 5 sec' },
      { label: 'Code Alignment', value: 'NFPA 72 / 2001' },
      { label: 'Standby Power', value: '24h Verified' },
    ],
    scopePrefill:
      'Benchmark RMC-CS-02 Inquiry: Addressable NFPA 72 fire alarm system with HVAC interlocks and NFPA 2001 FM-200 suppression for cleanroom/electrical rooms.',
  },
  'RMC-CS-03': {
    code: 'RMC-CS-03 · Representative Benchmark',
    title: 'Export Knitwear Multi-Floor EHS/Fire Gap Closure & ISO 45001 Certification Readiness',
    serviceValue: 'ehs-audits',
    badges: [
      { text: 'RMC-CS-03', variant: 'navy' },
      { text: 'EHS Audits & ISO 45001', variant: 'teal' },
      { text: 'Textile & Apparel', variant: 'navy' },
      { text: 'Representative Benchmark', variant: 'amber' },
    ],
    location: 'Landhi Industrial Area, Karachi · Multi-Storey Export Apparel & Stitching Complex',
    challenge:
      'International retail buyers flagged critical deficiencies during compliance screening: obstructed secondary egress paths, undocumented chemical storage, missing LOTO hardware on boilers/compressors, and absence of a formal Sindh OSH Safety Committee.',
    solution:
      'Executed a line-by-line physical and statutory gap audit, drafted site-wide LOTO and confined-space permit workflows, re-mapped illuminated egress routes, built a complete ISO 45001:2018 SOP manual, and trained 6 production shift batches of fire wardens.',
    results:
      '100% closure of high- and medium-severity buyer CAPA findings ahead of follow-up audit window, verified timed multi-floor evacuation drills, and streamlined ISO 45001 certification.',
    standards: 'Sindh OSH Act 2017 & Rules 2019, ISO 45001:2018, Building Code of Pakistan 2016',
    metrics: [
      { label: 'CAPA Closure', value: '100% Closed' },
      { label: 'Drills Delivered', value: '6 Batches' },
      { label: 'Standard', value: 'ISO 45001' },
    ],
    scopePrefill:
      'Benchmark RMC-CS-03 Inquiry: Buyer CAPA closure, Sindh OSH Act 2017 compliance alignment, emergency evacuation drills, and ISO 45001 implementation.',
  },
  'RMC-CS-04': {
    code: 'RMC-CS-04 · Representative Benchmark',
    title: 'Port Logistics Perimeter Fire Hydrant Ring & NFPA 20 Diesel/Electric Pump House',
    serviceValue: 'fire-suppression',
    badges: [
      { text: 'RMC-CS-04', variant: 'navy' },
      { text: 'Hydrant Ring & Pump House', variant: 'amber' },
      { text: 'Warehousing & Logistics', variant: 'navy' },
      { text: 'Representative Benchmark', variant: 'amber' },
    ],
    location: 'Port Qasim / Bin Qasim Industrial Park (BQIP), Karachi · Bonded Logistics & High-Rack Yard',
    challenge:
      'High-piled mixed commodity storage and external container yards operated without pressurized perimeter hydrant coverage or redundant UL/FM-grade pumping pressure under power-loss fire scenarios.',
    solution:
      'Completed hydraulic network modeling and constructed a 12-bar hydrotested MS/Schedule-40 buried & above-ground perimeter ring main fed by an NFPA 20 trio pump house (main electric, diesel backup, and automated jockey pump) with dual-outlet yard cabinets and Siamese brigade inlets.',
    results:
      '100% perimeter yard and loading-bay hydrant reach confirmed under full-flow witness tests, clean 12-bar hydrostatic acceptance, and full underwriter property-protection approval.',
    standards: 'NFPA 14, NFPA 20, NFPA 24, Building Code of Pakistan (Fire Safety Provisions 2016)',
    metrics: [
      { label: 'Hydrotest Pass', value: '12 bar' },
      { label: 'Pump Config', value: 'NFPA 20 Trio' },
      { label: 'Coverage', value: '100% Yard' },
    ],
    scopePrefill:
      'Benchmark RMC-CS-04 Inquiry: Turnkey external fire hydrant ring main, hydraulic calculations, and NFPA 20 electric/diesel/jockey pump house.',
  },
  'RMC-CS-05': {
    code: 'RMC-CS-05 · Representative Benchmark',
    title: 'Commercial Corporate Tower BCP 2016 Life-Safety Audit & Pressurization Retrofit',
    serviceValue: 'ehs-audits',
    badges: [
      { text: 'RMC-CS-05', variant: 'navy' },
      { text: 'BCP 2016 & Life Safety', variant: 'teal' },
      { text: 'High-Rise & Commercial', variant: 'navy' },
      { text: 'Representative Benchmark', variant: 'amber' },
    ],
    location: 'Saddar / I.I. Chundrigar Business Corridor, Karachi · Multi-Tenant Corporate Tower',
    challenge:
      'Legacy commercial building exhibited non-compartmentalized electrical risers, uncalibrated stairwell smoke barriers, intermittent emergency exit signage, and unverified wet-riser residual head pressure at upper floors for authority NOC renewal.',
    solution:
      'Performed a floor-by-floor BCP 2016 vertical life-safety audit, installed UL-listed fire-stop penetration seals across electrical shafts, verified stairwell pressurization fans, upgraded wet-riser landing valves, and calibrated voice-evacuation alarm paging.',
    results:
      'Full floor-by-floor life-safety sign-off pack, verified upper-floor riser flow stability, documented warden response protocols, and KMC / SBCA NOC compliance readiness.',
    standards: 'Building Code of Pakistan (Fire Safety Provisions 2016), NFPA 101 Life Safety Code, NFPA 14 / 72',
    metrics: [
      { label: 'Code Anchor', value: 'BCP 2016' },
      { label: 'Scope', value: 'All Floors' },
      { label: 'Outcome', value: 'NOC Ready' },
    ],
    scopePrefill:
      'Benchmark RMC-CS-05 Inquiry: Commercial high-rise BCP 2016 fire safety audit, riser/stairwell pressurization rectification, and NOC technical dossier.',
  },
  'RMC-CS-06': {
    code: 'RMC-CS-06 · Representative Benchmark',
    title: 'Post-Incident Industrial Warehouse NFPA 921 Fire Forensics & CAPA Redesign',
    serviceValue: 'fire-investigation',
    badges: [
      { text: 'RMC-CS-06', variant: 'navy' },
      { text: 'NFPA 921 Forensics', variant: 'danger' },
      { text: 'Warehousing & Logistics', variant: 'navy' },
      { text: 'Representative Benchmark', variant: 'amber' },
    ],
    location: 'Nooriabad Industrial Estate, Sindh Corridor · Bulk Packaging & Raw-Material Storage Bay',
    challenge:
      'A localized structural fire damaged rack bay infrastructure and triggered contested root-cause questions across electrical contractors, facility operations, and commercial property insurers.',
    solution:
      'Mobilized within 24 hours under NFPA 921 protocols: preserved debris stratigraphy, performed systematic burn-pattern charting and electrical conductor arc-mapping across sub-main cable trays, analyzed breaker trip logs, and delivered a defensible scientific report paired with engineered CAPA retrofits.',
    results:
      'Unambiguous origin & ignition pathway established for management and insurer adjudication, followed by targeted thermal-imaging maintenance intervals, breaker coordination upgrades, and dedicated zone suppression redesign.',
    standards: 'NFPA 921 (Guide for Fire & Explosion Investigations), NFPA 70E, Sindh OSH Act 2017',
    metrics: [
      { label: 'Protocol', value: 'NFPA 921' },
      { label: 'Forensic Tool', value: 'Arc Mapping' },
      { label: 'Resolution', value: 'CAPA Verified' },
    ],
    scopePrefill:
      'Benchmark RMC-CS-06 Inquiry: Post-incident NFPA 921 fire scene investigation, arc-mapping root-cause analysis, and CAPA engineering redesign.',
  },
};

const TOTAL_BENCHMARKS = Object.keys(CASE_DOSSIERS).length;

/**
 * Create a styled badge list item cleanly for `ul#dossier-modal-badges.tag-list`.
 * @param {string} text
 * @param {'navy' | 'teal' | 'amber' | 'danger'} variant
 */
function createBadge(text, variant) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.className = `badge badge--${variant}`;
  span.textContent = text;
  li.appendChild(span);
  return li;
}

/**
 * Create a metric item matching `.case-metrics > .case-metric-item` styling.
 * @param {string} label
 * @param {string} value
 */
function createMetricItem(label, value) {
  const wrapper = document.createElement('div');
  wrapper.className = 'case-metric-item';

  const dt = document.createElement('dt');
  dt.className = 'case-metric-label';
  dt.textContent = label;

  const dd = document.createElement('dd');
  dd.className = 'case-metric-val';
  dd.textContent = value;

  wrapper.append(dt, dd);
  return wrapper;
}

function initCaseFilters() {
  const form = document.getElementById('case-filter-form');
  const grid = document.getElementById('case-study-grid');
  if (!form || !grid) return;

  const sectorSelect = document.getElementById('case-sector-filter');
  const countEl = document.getElementById('case-filter-count');
  const emptyState = document.getElementById('case-empty-state');
  const emptyResetBtn = document.getElementById('case-empty-reset');
  const allRadio = document.getElementById('cs-filter-all');
  const shells = Array.from(grid.querySelectorAll('.card-shell'));
  const totalCount = shells.length || TOTAL_BENCHMARKS;

  const applyFilter = () => {
    const checkedCategory = form.querySelector('input[name="category"]:checked');
    const selectedCategory =
      checkedCategory instanceof HTMLInputElement ? checkedCategory.value : 'all';
    const selectedSector =
      sectorSelect instanceof HTMLSelectElement ? sectorSelect.value : 'all';

    let visibleCount = 0;

    for (const shell of shells) {
      const cardCategory = shell.getAttribute('data-category') || '';
      const cardSector = shell.getAttribute('data-sector') || '';
      const matchCategory = selectedCategory === 'all' || cardCategory === selectedCategory;
      const matchSector = selectedSector === 'all' || cardSector === selectedSector;
      const isVisible = matchCategory && matchSector;

      shell.classList.toggle('is-hidden', !isVisible);
      shell.hidden = !isVisible;

      if (isVisible) {
        visibleCount += 1;
      }
    }

    if (countEl) {
      countEl.textContent = `Showing ${visibleCount} of ${totalCount} engineering benchmarks`;
    }

    if (emptyState) {
      const hasMatches = visibleCount > 0;
      emptyState.hidden = hasMatches;
      emptyState.classList.toggle('is-hidden', hasMatches);
    }
  };

  form.addEventListener('change', applyFilter);
  form.addEventListener('reset', () => {
    window.requestAnimationFrame(applyFilter);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilter();
  });

  if (emptyResetBtn) {
    emptyResetBtn.addEventListener('click', () => {
      form.reset();
      applyFilter();
      if (allRadio instanceof HTMLElement) {
        allRadio.focus();
      }
    });
  }

  applyFilter();
}

function initCaseDossierModal() {
  const modal = document.getElementById('case-dossier-modal');
  if (!(modal instanceof HTMLDialogElement)) return;

  const codeEl = document.getElementById('dossier-modal-code');
  const titleEl = document.getElementById('dossier-modal-title');
  const badgesEl = document.getElementById('dossier-modal-badges');
  const locationEl = document.getElementById('dossier-modal-location');
  const challengeEl = document.getElementById('dossier-modal-challenge');
  const solutionEl = document.getElementById('dossier-modal-solution');
  const resultsEl = document.getElementById('dossier-modal-results');
  const standardsEl = document.getElementById('dossier-modal-standards');
  const metricsEl = document.getElementById('dossier-modal-metrics');
  const ctaBtn = document.getElementById('dossier-modal-cta');

  const populateDossier = (caseId) => {
    const dossier = CASE_DOSSIERS[caseId];
    if (!dossier) return false;

    if (codeEl) codeEl.textContent = dossier.code;
    if (titleEl) titleEl.textContent = dossier.title;
    if (locationEl) locationEl.textContent = dossier.location;
    if (challengeEl) challengeEl.textContent = dossier.challenge;
    if (solutionEl) solutionEl.textContent = dossier.solution;
    if (resultsEl) resultsEl.textContent = dossier.results;
    if (standardsEl) standardsEl.textContent = dossier.standards;

    if (badgesEl) {
      const badgeNodes = dossier.badges.map((b) => createBadge(b.text, b.variant));
      badgesEl.replaceChildren(...badgeNodes);
    }

    if (metricsEl) {
      const metricNodes = dossier.metrics.map((m) => createMetricItem(m.label, m.value));
      metricsEl.replaceChildren(...metricNodes);
    }

    if (ctaBtn) {
      ctaBtn.dataset.servicePrefill = dossier.serviceValue;
      ctaBtn.dataset.scopePrefill = dossier.scopePrefill;
    }

    return true;
  };

  // Capture phase ensures modal content is populated before native Invoker Commands
  // or main.js's [commandfor] polyfill calls modal.showModal().
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target instanceof Element ? event.target.closest('[data-case-id]') : null;
      if (!(target instanceof HTMLElement)) return;

      const caseId = target.dataset.caseId;
      if (!caseId) return;
      populateDossier(caseId);
    },
    { capture: true },
  );

  // Safeguard for programmatic `command` event dispatches with a source invoker.
  modal.addEventListener('command', (event) => {
    const source = event.source;
    if (source instanceof HTMLElement && source.dataset.caseId) {
      populateDossier(source.dataset.caseId);
    }
  });

  // Scroll matching benchmark card smoothly into view when linked via #RMC-CS-01..#RMC-CS-06
  const hashCode = window.location.hash.replace(/^#/, '').trim();
  if (hashCode && CASE_DOSSIERS[hashCode]) {
    const trigger = document.querySelector(`[data-case-id="${CSS.escape(hashCode)}"]`);
    const card = trigger?.closest('.card-shell');
    if (card instanceof HTMLElement) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      card.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    }
  }
}

initCaseFilters();
initCaseDossierModal();
