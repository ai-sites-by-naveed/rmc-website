/**
 * Home page interactive modules for Risk Management Consultants (RMC):
 * 1. #risk-pulse-matrix sector telemetry switcher with View Transition support
 * 2. #risk-diagnostic Enterprise EHS & Fire Readiness Diagnostic engine
 * 3. Pure-CSS :has() benchmark filter fallback + live result count
 */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

const SECTOR_PULSE_PROFILES = {
  textile: {
    badge: 'SEQS & NFPA Priority',
    badgeClass: 'badge badge--amber',
    fire: 'NFPA 13/24 Hydrant Ring + Addressable FACP & Lint-Zone Detection',
    effluent: 'BOD ≤ 80 mg/L · COD ≤ 150 mg/L · 60% UF/RO Process Water Reuse',
    legal: 'Sindh OSH Act 2017 · SEPA 2014 / SEQS · BCP Fire Safety Provisions 2016',
    vector: 'Unmonitored arc ignition in lint/dryer zones & ETP shock-load bypass',
    control: 'MBBR + UF/RO closed-loop ETP retrofit paired with zoned NFPA 72/20 fire loop',
    corridor: 'S.I.T.E. · Korangi · Landhi · Faisalabad',
    servicePrefill: 'wastewater',
    scopePrefill:
      'Sector Focus: Textile & Dyeing — ETP & UF/RO Water Recycling + NFPA 13/24 Fire Ring & Addressable FACP'
  },
  pharma: {
    badge: 'Clean-Agent & API ETP',
    badgeClass: 'badge badge--teal',
    fire: 'NFPA 72 Addressable FACP + FM-200 Clean-Agent Solvent & Server Suppression',
    effluent: 'API Pretreatment + Biological Polishing · Zero-Bypass SEQS / cGMP Compliance',
    legal: 'Sindh OSH Act 2017 · SEPA / SEQS · DRAP Environmental Controls · BCP 2016',
    vector: 'Solvent vapor ignition in dispensing zones & high-toxicity COD/TDS spikes',
    control: 'Multi-loop addressable detection, FM-200 zone isolation & segregated API ETP train',
    corridor: 'Korangi Industrial Area · Port Qasim · Hub',
    servicePrefill: 'fire-detection',
    scopePrefill:
      'Sector Focus: Pharma & Chemical — Multi-Loop NFPA 72 FACP, FM-200 Suppression & Segregated API Effluent Control'
  },
  highrise: {
    badge: 'BCP 2016 Life Safety',
    badgeClass: 'badge badge--amber',
    fire: 'Addressable FACP Voice/Evac Integration + Pressurized Risers & Sprinkler Grid',
    effluent: 'Compact STP / Greywater Biological Treatment & Cooling-Tower Reuse',
    legal: 'Building Code of Pakistan (Fire Safety Provisions 2016) · SBCA & Civil Defence NOC',
    vector: 'Obstructed stairwell egress, silent riser pressure drop & unmonitored HVAC smoke',
    control: 'Floor-by-floor BCP 2016 life-safety gap audit, riser pressure test & warden drill program',
    corridor: 'Saddar · I.I. Chundrigar · Clifton · Nationwide',
    servicePrefill: 'ehs-audits',
    scopePrefill:
      'Sector Focus: High-Rise & Commercial — BCP 2016 Life-Safety Audit, Addressable FACP & SBCA/Civil Defence NOC Readiness'
  },
  warehouse: {
    badge: 'High-Piled Storage Risk',
    badgeClass: 'badge badge--danger',
    fire: 'NFPA 20 Electric/Diesel/Jockey Pump Room + 12-Bar Hydrant Ring & Hose Stations',
    effluent: 'Stormwater Oil-Water Separation + Domestic STP & Chemical Spill Containment',
    legal: 'BCP Fire Safety Provisions 2016 · NFPA 13/24 · Sindh OSH Act 2017 · NFPA 921',
    vector: 'Unverified pump-house diesel cut-in, rack flue blockage & arc ignition hazards',
    control: 'Dedicated fire-water reservoir, 12-bar hydrotested yard ring & preventive arc/thermal audits',
    corridor: 'Port Qasim / BQIP · KCIP · Nooriabad · Northern Bypass',
    servicePrefill: 'fire-suppression',
    scopePrefill:
      'Sector Focus: Warehousing & Logistics — NFPA 20 Fire Pump Room, 12-Bar Yard Hydrant Ring & Loss Prevention Audit'
  }
};

const DIAGNOSTIC_SECTOR_META = {
  textile: {
    label: 'Textile, Dyeing & Export Apparel Mill',
    summaryRisk: 'SEPA effluent threshold violations, buyer audit flags (ZDHC/BSCI), and lint-zone fire escalation',
    codes: [
      { label: 'Sindh OSH Act 2017', cls: 'badge badge--navy' },
      { label: 'SEPA / SEQS & ZDHC', cls: 'badge badge--navy' },
      { label: 'BCP Fire Safety 2016', cls: 'badge badge--amber' },
      { label: 'NFPA 13 / 20 / 72', cls: 'badge badge--amber' }
    ]
  },
  pharma: {
    label: 'Pharmaceutical, Chemical & Process Plant',
    summaryRisk: 'API wastewater toxicity spikes, solvent flash hazards, and cleanroom life-safety non-compliance',
    codes: [
      { label: 'Sindh OSH Act 2017', cls: 'badge badge--navy' },
      { label: 'SEPA / SEQS', cls: 'badge badge--navy' },
      { label: 'NFPA 72 / 2001 (FM-200)', cls: 'badge badge--amber' },
      { label: 'ISO 45001 / 14001', cls: 'badge badge--teal' }
    ]
  },
  commercial: {
    label: 'Commercial High-Rise, Hospital & Institutional',
    summaryRisk: 'SBCA / Civil Defence NOC delays, stairwell egress bottlenecks, and unverified riser pressures',
    codes: [
      { label: 'BCP Fire Safety 2016', cls: 'badge badge--amber' },
      { label: 'SBCA / Civil Defence NOC', cls: 'badge badge--navy' },
      { label: 'NFPA 72 / 101', cls: 'badge badge--amber' },
      { label: 'Sindh OSH Act 2017', cls: 'badge badge--navy' }
    ]
  },
  warehouse: {
    label: 'Warehousing, Logistics & Cold-Chain Depot',
    summaryRisk: 'uncontrolled high-piled rack fire spread, pump pressure collapse, and disputed insurer root-cause claims',
    codes: [
      { label: 'BCP Fire Safety 2016', cls: 'badge badge--amber' },
      { label: 'NFPA 13 / 20 / 24', cls: 'badge badge--amber' },
      { label: 'NFPA 921 Forensics', cls: 'badge badge--danger' },
      { label: 'Sindh OSH Act 2017', cls: 'badge badge--navy' }
    ]
  }
};

/**
 * Initializes the #risk-pulse-matrix interactive sector switcher with arrow-key tab navigation
 * and reduced-motion-guarded document.startViewTransition updates.
 */
function initRiskPulseMatrix() {
  const matrix = document.getElementById('risk-pulse-matrix');
  if (!matrix) return;

  const tabs = Array.from(matrix.querySelectorAll('.pulse-tab[role="tab"]'));
  const panel = document.getElementById('risk-pulse-panel');
  const badgeEl = document.getElementById('pulse-status-badge');
  const fireEl = document.getElementById('pulse-fire');
  const effluentEl = document.getElementById('pulse-effluent');
  const legalEl = document.getElementById('pulse-legal');
  const vectorEl = document.getElementById('pulse-vector');
  const controlEl = document.getElementById('pulse-control');
  const corridorEl = document.getElementById('pulse-corridor');
  const ctaBtn = document.getElementById('pulse-scope-cta');

  if (!tabs.length || !panel) return;

  const applySectorUpdate = (tab) => {
    const sectorKey = tab.dataset.sector;
    const profile = SECTOR_PULSE_PROFILES[sectorKey];
    if (!profile) return;

    for (const candidate of tabs) {
      const active = candidate === tab;
      candidate.setAttribute('aria-selected', String(active));
      candidate.tabIndex = active ? 0 : -1;
    }

    panel.setAttribute('aria-labelledby', tab.id);
    if (badgeEl) {
      badgeEl.className = profile.badgeClass;
      badgeEl.textContent = profile.badge;
    }
    if (fireEl) fireEl.textContent = profile.fire;
    if (effluentEl) effluentEl.textContent = profile.effluent;
    if (legalEl) legalEl.textContent = profile.legal;
    if (vectorEl) vectorEl.textContent = profile.vector;
    if (controlEl) controlEl.textContent = profile.control;
    if (corridorEl) corridorEl.textContent = profile.corridor;

    if (ctaBtn) {
      ctaBtn.dataset.servicePrefill = profile.servicePrefill;
      ctaBtn.dataset.scopePrefill = profile.scopePrefill;
    }
  };

  const selectSectorTab = (tab, moveFocus = false) => {
    if (tab.getAttribute('aria-selected') === 'true') {
      if (moveFocus) tab.focus();
      return;
    }

    const canTransition =
      typeof document.startViewTransition === 'function' &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches;

    if (canTransition) {
      try {
        document.startViewTransition(() => {
          applySectorUpdate(tab);
        });
      } catch {
        applySectorUpdate(tab);
      }
    } else {
      applySectorUpdate(tab);
    }

    if (moveFocus) tab.focus();
  };

  matrix.addEventListener('click', (event) => {
    const tab = event.target instanceof Element ? event.target.closest('.pulse-tab[role="tab"]') : null;
    if (!tab) return;
    selectSectorTab(tab, false);
  });

  matrix.addEventListener('keydown', (event) => {
    const currentTab = event.target instanceof Element ? event.target.closest('.pulse-tab[role="tab"]') : null;
    if (!currentTab) return;

    const index = tabs.indexOf(currentTab);
    if (index === -1) return;

    let nextIndex = -1;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;

    if (nextIndex !== -1) {
      event.preventDefault();
      selectSectorTab(tabs[nextIndex], true);
    }
  });
}

/**
 * Renders the SVG icon matching a readiness tier inside #diagnostic-tier.
 * @param {HTMLElement} tierEl
 * @param {'ready'|'moderate'|'high'} tierKey
 */
function updateTierIcon(tierEl, tierKey) {
  const svg = tierEl.querySelector('svg');
  if (!svg) return;

  const path = svg.querySelector('path');
  if (!path) return;

  if (tierKey === 'ready') {
    path.setAttribute('d', 'M20 6 9 17l-5-5');
  } else if (tierKey === 'moderate') {
    path.setAttribute('d', 'M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z');
  } else {
    path.setAttribute('d', 'M12 8v5m0 3.5h.01M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2Z');
  }
}

/**
 * Initializes the #risk-diagnostic Enterprise EHS & Fire Readiness Diagnostic engine.
 */
function initRiskDiagnostic() {
  const root = document.getElementById('risk-diagnostic');
  const form = document.getElementById('risk-diagnostic-form');
  if (!root || !form) return;

  const scoreEl = document.getElementById('diagnostic-score');
  const tierEl = document.getElementById('diagnostic-tier');
  const tierLabelEl = document.getElementById('diagnostic-tier-label');
  const summaryEl = document.getElementById('diagnostic-summary');
  const recsListEl = document.getElementById('diagnostic-recommendations');
  const codesListEl = document.getElementById('diagnostic-codes-list');
  const sendBtn = document.getElementById('diagnostic-send-btn');

  const buildRecommendations = (sector, fire, wastewater, ehs, forensics) => {
    const candidates = [];

    if (forensics === 'critical') {
      candidates.push({
        priority: 100,
        service: 'fire-investigation',
        text: 'Preserve electrical panels and burn patterns immediately; engage an NFPA 921 arc-mapping investigation and CAPA redesign.'
      });
    } else if (forensics === 'partial') {
      candidates.push({
        priority: 45,
        service: 'fire-investigation',
        text: 'Establish thermal imaging inspections, electrical load balance logs, and formal root-cause CAPA tracking across distribution panels.'
      });
    }

    if (fire === 'minimal') {
      candidates.push({
        priority: 95,
        service: 'fire-suppression',
        text: 'Engineer and commission an NFPA 20 fire pump room, 12-bar hydrant ring main, and NFPA 72 addressable FACP coverage.'
      });
    } else if (fire === 'partial') {
      candidates.push({
        priority: 65,
        service: 'fire-detection',
        text: 'Upgrade conventional fire alarms to an NFPA 72 addressable FACP and conduct full perimeter hydrant pressure flow testing.'
      });
    }

    if (wastewater === 'none') {
      candidates.push({
        priority: 92,
        service: 'wastewater',
        text:
          sector === 'commercial'
            ? 'Install a compact biological STP and greywater recycling package to achieve SEPA SEQS compliance and cooling reuse.'
            : 'Design and build a turnkey ETP (equalization, coagulation, MBBR) to eliminate raw SEQS discharge violations.'
      });
    } else if (wastewater === 'partial') {
      candidates.push({
        priority: 60,
        service: 'wastewater',
        text:
          sector === 'textile'
            ? 'Add biological MBBR + tertiary UF/RO polishing to stabilize COD/BOD below SEQS and recover 55–65% process water.'
            : 'Retrofit secondary biological polishing and composite sampling controls to stop shock-load SEQS bypasses.'
      });
    }

    if (ehs === 'none') {
      candidates.push({
        priority: 88,
        service: 'ehs-audits',
        text: 'Commission a baseline Sindh OSH Act 2017 & BCP 2016 EHS/fire gap audit before regulatory or buyer inspections.'
      });
    } else if (ehs === 'partial') {
      candidates.push({
        priority: 55,
        service: 'ehs-systems',
        text: 'Formalize ISO 45001/14001 HIRA registers, permit-to-work SOPs, and scheduled shift evacuation and firefighting drills.'
      });
    }

    // Add maintenance / continuous stewardship recommendations when facility scores highly.
    candidates.push(
      {
        priority: 25,
        service: 'ehs-systems',
        text: 'Maintain annual third-party ISO 45001/14001 surveillance audits and certified emergency drill validation across all shifts.'
      },
      {
        priority: 20,
        service: 'fire-suppression',
        text: 'Sustain quarterly NFPA 20 diesel/jockey pump run tests and loop-by-loop NFPA 72 detector sensitivity calibration.'
      },
      {
        priority: 15,
        service: 'wastewater',
        text: 'Schedule independent SEPA-approved lab composite effluent verification to preserve buyer ZDHC/SEQS readiness.'
      }
    );

    candidates.sort((a, b) => b.priority - a.priority);
    return candidates.slice(0, 3);
  };

  const evaluateDiagnostic = () => {
    const sectorInput = form.querySelector('input[name="sector"]:checked');
    const fireInput = form.querySelector('input[name="fire"]:checked');
    const wwInput = form.querySelector('input[name="wastewater"]:checked');
    const ehsInput = form.querySelector('input[name="ehs"]:checked');
    const forensicsInput = form.querySelector('input[name="forensics"]:checked');

    const sector = sectorInput?.value || 'textile';
    const fire = fireInput?.value || 'partial';
    const wastewater = wwInput?.value || 'partial';
    const ehs = ehsInput?.value || 'partial';
    const forensics = forensicsInput?.value || 'partial';

    const points = [fireInput, wwInput, ehsInput, forensicsInput].reduce(
      (sum, input) => sum + Number(input?.dataset.points ?? 0),
      0
    );
    const score = Math.max(0, Math.min(100, points));

    let tierKey = 'high';
    let tierLabel = 'High Regulatory & Loss Risk';
    if (score >= 80) {
      tierKey = 'ready';
      tierLabel = 'Compliance-Ready';
    } else if (score >= 50) {
      tierKey = 'moderate';
      tierLabel = 'Moderate Exposure';
    }

    const sectorMeta = DIAGNOSTIC_SECTOR_META[sector] || DIAGNOSTIC_SECTOR_META.textile;
    const topRecs = buildRecommendations(sector, fire, wastewater, ehs, forensics);

    if (scoreEl) scoreEl.textContent = String(score);
    if (tierEl) {
      tierEl.dataset.tier = tierKey;
      updateTierIcon(tierEl, tierKey);
    }
    if (tierLabelEl) tierLabelEl.textContent = tierLabel;

    if (summaryEl) {
      if (tierKey === 'ready') {
        summaryEl.textContent = `Strong operational posture for your ${sectorMeta.label}: core fire, effluent, and EHS controls align well with Pakistan statutory rules. Focus on preventive O&M and verification logs.`;
      } else if (tierKey === 'moderate') {
        summaryEl.textContent = `Partial protection exposes your ${sectorMeta.label} to ${sectorMeta.summaryRisk}. Closing the three gaps below establishes defensible compliance.`;
      } else {
        summaryEl.textContent = `Critical exposure flagged for your ${sectorMeta.label}: immediate action is needed to mitigate ${sectorMeta.summaryRisk} before enforcement or loss events.`;
      }
    }

    if (recsListEl) {
      recsListEl.replaceChildren(
        ...topRecs.map((rec) => {
          const li = document.createElement('li');
          li.textContent = rec.text;
          return li;
        })
      );
    }

    if (codesListEl) {
      codesListEl.replaceChildren(
        ...sectorMeta.codes.map((code) => {
          const li = document.createElement('li');
          const span = document.createElement('span');
          span.className = code.cls;
          span.textContent = code.label;
          li.append(span);
          return li;
        })
      );
    }

    if (sendBtn) {
      sendBtn.dataset.servicePrefill = topRecs[0]?.service || 'ehs-audits';
      sendBtn.dataset.scopePrefill = `Diagnostic Score: ${score}/100 (${tierLabel}) | Sector: ${sectorMeta.label} | Top Priorities: ${topRecs.map((r) => r.text).join(' | ')}`;
    }
  };

  form.addEventListener('change', evaluateDiagnostic);
  form.addEventListener('reset', () => {
    window.setTimeout(evaluateDiagnostic, 0);
  });

  evaluateDiagnostic();
}

/**
 * Provides the :has() CSS filter fallback for older browsers and keeps #home-filter-count synced.
 */
function initHomeBenchmarkFilter() {
  const section = document.querySelector('.filter-section');
  const grid = document.getElementById('home-benchmark-grid');
  const countEl = document.getElementById('home-filter-count');
  if (!section || !grid) return;

  const radios = Array.from(section.querySelectorAll('input[name="home-benchmark-filter"]'));
  const cardShells = Array.from(grid.querySelectorAll('.card-shell'));
  const totalCount = cardShells.length;
  const supportsHas = CSS.supports('selector(:has(*))');

  if (!radios.length || !totalCount) return;

  const syncFilter = () => {
    const selected = radios.find((r) => r.checked)?.value || 'all';
    let visibleCount = 0;

    for (const shell of cardShells) {
      const card = shell.querySelector('.case-card');
      const category = card?.dataset.category || '';
      const matches = selected === 'all' || category === selected;
      if (matches) visibleCount += 1;

      if (!supportsHas) {
        shell.classList.toggle('is-hidden', !matches);
        if (card) card.classList.toggle('is-hidden', !matches);
      }
    }

    if (countEl) {
      countEl.textContent = `Showing ${visibleCount} of ${totalCount} representative benchmarks`;
    }
  };

  for (const radio of radios) {
    radio.addEventListener('change', syncFilter);
  }

  syncFilter();
}

initRiskPulseMatrix();
initRiskDiagnostic();
initHomeBenchmarkFilter();
