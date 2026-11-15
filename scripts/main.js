/**
 * Shared client-side platform behaviors for Risk Management Consultants (RMC).
 * Implements responsive popover/inline navigation, native dialog invoker/light-dismiss
 * fallbacks, exclusive <details name> fallback, and accessible :user-invalid ARIA sync.
 */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
const FORM_SELECTOR = '#consultation-modal-form, #contact-rfp-form';
const CONTROL_SELECTOR = 'input, select, textarea';

/**
 * Sets the current calendar year on all [data-year] placeholders.
 */
function initCurrentYear() {
  const year = String(new Date().getFullYear());
  for (const el of document.querySelectorAll('[data-year]')) {
    el.textContent = year;
  }
}

/**
 * Synchronizes .is-wide and the popover attribute on #site-menu without layout thrash.
 * Uses setAttribute/removeAttribute rather than the .popover IDL for polyfill safety.
 */
function initResponsiveNavbar() {
  const header = document.getElementById('site-header') || document.querySelector('.site-header');
  const inner = header?.querySelector('.header-inner');
  const menu = document.getElementById('site-menu');
  const menuButton = header?.querySelector('.menu-button');
  if (!header || !inner || !menu) return;

  const supportsPopover = Object.hasOwn(HTMLElement.prototype, 'popover');
  let collapsedWidth = 0;
  let rafId = 0;

  // Lightweight fallback when native Popover API is unavailable (keeps zero dependencies).
  if (!supportsPopover && menuButton) {
    const toggleFallbackPopover = (open) => {
      if (header.classList.contains('is-wide')) return;
      const shouldOpen = open ?? !menu.classList.contains(':popover-open');
      menu.classList.toggle(':popover-open', shouldOpen);
      menuButton.setAttribute('aria-expanded', String(shouldOpen));
    };

    menuButton.addEventListener('click', () => toggleFallbackPopover());
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains(':popover-open')) {
        toggleFallbackPopover(false);
        menuButton.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (
        menu.classList.contains(':popover-open') &&
        !menu.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        toggleFallbackPopover(false);
      }
    });
  }

  const isMenuOpen = () =>
    menu.hasAttribute('popover') &&
    (menu.matches(':popover-open') || menu.classList.contains(':popover-open'));

  const hideMenuIfOpen = () => {
    if (!isMenuOpen()) return;
    if (supportsPopover && typeof menu.hidePopover === 'function') {
      try {
        menu.hidePopover();
      } catch {
        menu.classList.remove(':popover-open');
      }
    } else {
      menu.classList.remove(':popover-open');
      menuButton?.setAttribute('aria-expanded', 'false');
    }
  };

  const syncLayout = (force = false) => {
    const currentlyWide = header.classList.contains('is-wide');
    const currentWidth = header.getBoundingClientRect().width;

    // When already collapsed, avoid measuring inline on every shrink to prevent thrashing;
    // remeasure only when the header grows wider than the last collapsed measurement.
    if (!force && !currentlyWide && collapsedWidth > 0 && currentWidth <= collapsedWidth) {
      return;
    }

    const wasOpen = isMenuOpen();

    cancelAnimationFrame(rafId);
    header.classList.add('is-measuring');

    // Temporarily render inline to measure natural horizontal fit.
    if (wasOpen) hideMenuIfOpen();
    menu.removeAttribute('popover');
    header.classList.add('is-wide');

    const fitsInline = inner.scrollWidth <= inner.clientWidth;

    if (fitsInline) {
      collapsedWidth = 0;
      menu.classList.remove(':popover-open');
      menuButton?.removeAttribute('aria-expanded');
    } else {
      header.classList.remove('is-wide');
      menu.setAttribute('popover', 'auto');
      collapsedWidth = currentWidth;
      if (wasOpen) {
        if (supportsPopover && typeof menu.showPopover === 'function') {
          try {
            menu.showPopover();
          } catch {
            menu.classList.add(':popover-open');
          }
        } else {
          menu.classList.add(':popover-open');
          menuButton?.setAttribute('aria-expanded', 'true');
        }
      }
    }

    rafId = requestAnimationFrame(() => {
      header.classList.remove('is-measuring');
    });
  };

  // Close mobile popover cleanly when an internal anchor or consultation button is clicked.
  menu.addEventListener('click', (event) => {
    const interactive = event.target.closest('a, button');
    if (interactive && !header.classList.contains('is-wide')) {
      hideMenuIfOpen();
    }
  });

  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(() => syncLayout(false));
    observer.observe(header);
    observer.observe(menu);
  } else {
    window.addEventListener('resize', () => syncLayout(true));
  }

  document.fonts?.ready?.then(() => syncLayout(true));
  syncLayout(true);
}

/**
 * Prefills consultation modal fields from trigger data-* attributes and resets prior status banners.
 * @param {HTMLElement} trigger
 */
function prefillConsultationModal(trigger) {
  const modal = document.getElementById('consultation-modal');
  if (!(modal instanceof HTMLDialogElement)) return;

  const serviceSelect = document.getElementById('modal-service');
  const scopeInput = document.getElementById('modal-scope');
  const form = document.getElementById('consultation-modal-form');

  if (form) {
    const status = form.querySelector('.form-status');
    if (status) {
      status.hidden = true;
      status.textContent = '';
      status.classList.remove('is-error');
    }
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = false;
  }

  const servicePrefill = trigger.dataset.servicePrefill;
  if (serviceSelect instanceof HTMLSelectElement && servicePrefill) {
    const hasOption = Array.from(serviceSelect.options).some((opt) => opt.value === servicePrefill);
    if (hasOption) {
      serviceSelect.value = servicePrefill;
      serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  const scopePrefill = trigger.dataset.scopePrefill;
  if (scopeInput instanceof HTMLTextAreaElement && scopePrefill !== undefined) {
    scopeInput.value = scopePrefill;
    if (scopePrefill) {
      scopeInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}

/**
 * Manages modal dialogs, prefill triggers, invoker command fallback, light-dismiss fallback,
 * and returnValue cleanup without touching document/body overflow.
 */
function initDialogs() {
  const supportsCommandFor = 'commandForElement' in HTMLButtonElement.prototype;
  const consultationModal = document.getElementById('consultation-modal');

  const closeOtherOpenModal = (targetModal) => {
    for (const openDialog of document.querySelectorAll('dialog[open]')) {
      if (openDialog !== targetModal && typeof openDialog.close === 'function') {
        openDialog.close();
      }
    }
  };

  // Handle [data-open-consultation] triggers and [commandfor] polyfill when native support is absent.
  document.addEventListener('click', (event) => {
    const trigger = event.target instanceof Element ? event.target.closest('button, [data-open-consultation]') : null;
    if (!(trigger instanceof HTMLElement)) return;

    if (trigger.hasAttribute('data-open-consultation') && consultationModal instanceof HTMLDialogElement) {
      closeOtherOpenModal(consultationModal);
      prefillConsultationModal(trigger);

      const usesNativeCommand =
        supportsCommandFor &&
        trigger.getAttribute('command') === 'show-modal' &&
        trigger.getAttribute('commandfor') === 'consultation-modal';

      if (!usesNativeCommand && !consultationModal.open) {
        consultationModal.showModal();
      }
      return;
    }

    if (!supportsCommandFor && trigger.hasAttribute('commandfor') && trigger.hasAttribute('command')) {
      const targetId = trigger.getAttribute('commandfor');
      const command = trigger.getAttribute('command');
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      if (target instanceof HTMLDialogElement) {
        if (command === 'show-modal' && !target.open) {
          closeOtherOpenModal(target);
          target.showModal();
        } else if (command === 'close' && target.open) {
          target.close(trigger.getAttribute('value') || '');
        } else if (command === 'request-close' && target.open) {
          if (typeof target.requestClose === 'function') {
            target.requestClose(trigger.getAttribute('value') || '');
          } else {
            target.close(trigger.getAttribute('value') || '');
          }
        }
      } else if (target.hasAttribute('popover')) {
        if (command === 'toggle-popover') target.togglePopover?.({ source: trigger });
        else if (command === 'show-popover') target.showPopover?.({ source: trigger });
        else if (command === 'hide-popover') target.hidePopover?.();
      }
    }
  });

  if (consultationModal instanceof HTMLDialogElement) {
    consultationModal.addEventListener('command', (event) => {
      if (event.command === 'show-modal' && event.source instanceof HTMLElement) {
        prefillConsultationModal(event.source);
      }
    });
  }

  // Light-dismiss fallback for dialog[closedby="any"] when native closedBy is unsupported.
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutside = (event, dialog) => {
      const rect = dialog.getBoundingClientRect();
      return (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      );
    };

    for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (event) => {
        pressedOutside = dialog.open && isOutside(event, dialog);
      });
      dialog.addEventListener('pointerup', (event) => {
        if (pressedOutside && dialog.open && isOutside(event, dialog)) {
          dialog.close();
        }
        pressedOutside = false;
      });
      dialog.addEventListener('pointercancel', () => {
        pressedOutside = false;
      });
    }
  }

  // Clear returnValue on close so stale button values never leak across dismissals.
  for (const dialog of document.querySelectorAll('dialog')) {
    dialog.addEventListener('close', () => {
      dialog.returnValue = '';
    });
  }
}

/**
 * Polyfills exclusive <details name="..."> grouping when native name support is unavailable.
 */
function initExclusiveDetailsFallback() {
  if (Object.hasOwn(HTMLDetailsElement.prototype, 'name')) return;

  document.addEventListener(
    'toggle',
    (event) => {
      const details = event.target;
      if (!(details instanceof HTMLDetailsElement) || !details.open || !details.hasAttribute('name')) {
        return;
      }
      const groupName = details.getAttribute('name');
      if (!groupName) return;

      for (const other of document.querySelectorAll(`details[name="${CSS.escape(groupName)}"]`)) {
        if (other !== details && other.open) {
          other.open = false;
        }
      }
    },
    { capture: true }
  );
}

/**
 * Synchronizes :user-invalid visual state with aria-invalid, inline .field-error[hidden],
 * aria-describedby, debounced polite live-region announcements, and validated submit handling.
 */
function initFormValidation() {
  const forms = Array.from(document.querySelectorAll(FORM_SELECTOR));
  if (!forms.length) return;

  const supportsUserInvalid = CSS.supports('selector(:user-invalid)');

  // Single polite live region for the page announces post-blur errors without talking over focus.
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.className = 'visually-hidden';
  document.body.append(announcer);

  let announceTimer = 0;
  let announcedField = null;

  const flagged = new WeakSet();
  const announced = new WeakSet();
  const dirtyState = new WeakMap();
  const submittedInvalid = new WeakSet();
  const pendingPostSubmitReset = new WeakSet();

  const resolveErrorEl = (el) => {
    if (el.dataset.error) {
      const byId = document.getElementById(el.dataset.error);
      if (byId) return byId;
    }
    return el.closest('.field-group')?.querySelector('.field-error') || null;
  };

  const linkError = (el, shown) => {
    const errorEl = resolveErrorEl(el);
    if (!errorEl) return;
    if (!errorEl.id) {
      errorEl.id = `${el.id || el.name || 'field'}-err`;
    }
    errorEl.hidden = !shown;

    const ids = (el.getAttribute('aria-describedby') || '')
      .split(/\s+/)
      .filter((id) => id && id !== errorEl.id);
    if (shown) ids.push(errorEl.id);

    if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
    else el.removeAttribute('aria-describedby');
  };

  const spokenText = (node) => {
    const copy = node.cloneNode(true);
    copy.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
    copy.querySelectorAll('[role="img"][aria-label]').forEach((n) => {
      n.replaceWith(`${n.getAttribute('aria-label')}: `);
    });
    return copy.textContent.replace(/\s+/g, ' ').trim();
  };

  const announceError = (el) => {
    const errorEl = resolveErrorEl(el);
    if (!errorEl) return;
    const labelText = el.labels?.[0] ? `${spokenText(el.labels[0])}: ` : '';
    clearTimeout(announceTimer);
    announcer.textContent = '';
    announcedField = el;
    announceTimer = window.setTimeout(() => {
      announcer.textContent = `${labelText}${spokenText(errorEl)}`.trim();
    }, 500);
  };

  const announceSummary = (message) => {
    clearTimeout(announceTimer);
    announcer.textContent = '';
    announceTimer = window.setTimeout(() => {
      announcer.textContent = message;
    }, 500);
  };

  const applyPhoneConstraint = (el) => {
    if (!(el instanceof HTMLInputElement) || el.type !== 'tel') return;
    const raw = el.value.trim();
    if (!raw) {
      el.setCustomValidity('');
      return;
    }
    const digitCount = (raw.match(/\d/g) || []).length;
    el.setCustomValidity(digitCount >= 7 ? '' : 'Please provide a valid phone number with at least 7 digits.');
  };

  const isFieldInvalid = (el) => {
    applyPhoneConstraint(el);
    if (submittedInvalid.has(el) && !el.validity.valid) {
      return true;
    }
    if (supportsUserInvalid) {
      return el.matches(':user-invalid');
    }
    const state = dirtyState.get(el);
    return Boolean(state?.hasBlurred && state?.hasInteracted && !el.validity.valid);
  };

  const syncAria = (el, shouldAnnounce = false) => {
    if (!(el instanceof HTMLElement) || !el.matches(CONTROL_SELECTOR)) return;

    const invalid = isFieldInvalid(el);
    if (el.validity.valid) {
      submittedInvalid.delete(el);
    }

    if (!supportsUserInvalid) {
      const state = dirtyState.get(el);
      const interacted = Boolean(state?.hasBlurred && state?.hasInteracted);
      el.classList.toggle('user-invalid-fallback', invalid);
      el.classList.toggle('user-valid-fallback', interacted && el.validity.valid);
    }

    if (invalid) {
      if (shouldAnnounce && !announced.has(el)) {
        announceError(el);
        announced.add(el);
      }
      el.setAttribute('aria-invalid', 'true');
      linkError(el, true);
      flagged.add(el);
    } else if (flagged.has(el) || el.getAttribute('aria-invalid') !== 'true') {
      el.setAttribute('aria-invalid', 'false');
      linkError(el, false);
      flagged.delete(el);
      announced.delete(el);
      if (announcedField === el) {
        clearTimeout(announceTimer);
        announcer.textContent = '';
      }
    }
  };

  for (const form of forms) {
    const controls = form.querySelectorAll(CONTROL_SELECTOR);
    for (const control of controls) {
      control.setAttribute('aria-invalid', 'false');
      linkError(control, false);
    }

    form.addEventListener(
      'blur',
      (event) => {
        const el = event.target;
        if (!(el instanceof HTMLElement) || !el.matches(CONTROL_SELECTOR)) return;
        const state = dirtyState.get(el) || { hasInteracted: false, hasBlurred: false };
        state.hasBlurred = true;
        dirtyState.set(el, state);
        syncAria(el, true);
      },
      true
    );

    form.addEventListener('input', (event) => {
      const el = event.target;
      if (!(el instanceof HTMLElement) || !el.matches(CONTROL_SELECTOR)) return;
      const state = dirtyState.get(el) || { hasInteracted: false, hasBlurred: false };
      state.hasInteracted = true;
      dirtyState.set(el, state);

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = false;

      if (el.hasAttribute('aria-invalid')) {
        syncAria(el, false);
      }
    });

    form.addEventListener(
      'change',
      (event) => {
        const el = event.target;
        if (!(el instanceof HTMLElement) || !el.matches(CONTROL_SELECTOR)) return;
        const state = dirtyState.get(el) || { hasInteracted: false, hasBlurred: false };
        state.hasInteracted = true;
        if (el.matches('select, [type="checkbox"], [type="radio"]')) {
          state.hasBlurred = true;
        }
        dirtyState.set(el, state);
        syncAria(el, true);
      },
      true
    );

    form.addEventListener(
      'invalid',
      (event) => {
        const el = event.target;
        if (!(el instanceof HTMLElement) || !el.matches(CONTROL_SELECTOR)) return;
        dirtyState.set(el, { hasInteracted: true, hasBlurred: true });
        submittedInvalid.add(el);
        announced.add(el);
        syncAria(el, false);
      },
      true
    );

    form.addEventListener(
      'reset',
      () => {
        const keepConfirmation = pendingPostSubmitReset.has(form);
        pendingPostSubmitReset.delete(form);

        window.setTimeout(() => {
          for (const el of form.querySelectorAll(CONTROL_SELECTOR)) {
            dirtyState.delete(el);
            submittedInvalid.delete(el);
            flagged.delete(el);
            announced.delete(el);
            el.classList.remove('user-invalid-fallback', 'user-valid-fallback');
            if ('setCustomValidity' in el) el.setCustomValidity('');
            el.setAttribute('aria-invalid', 'false');
            linkError(el, false);
          }
          if (!keepConfirmation) {
            const statusEl = form.querySelector('.form-status');
            if (statusEl) {
              statusEl.hidden = true;
              statusEl.textContent = '';
              statusEl.classList.remove('is-error');
            }
            clearTimeout(announceTimer);
            announcer.textContent = '';
          }
        }, 0);
      },
      true
    );

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const statusEl = form.querySelector('.form-status');
      const formControls = Array.from(form.querySelectorAll(CONTROL_SELECTOR));
      const invalidControls = [];

      for (const el of formControls) {
        applyPhoneConstraint(el);
        if (typeof el.checkValidity === 'function' && !el.checkValidity()) {
          invalidControls.push(el);
        }
      }

      if (invalidControls.length > 0) {
        const firstInvalid = invalidControls[0];
        firstInvalid.focus();
        if (statusEl) {
          statusEl.hidden = true;
          statusEl.textContent = '';
          statusEl.classList.remove('is-error');
        }
        announceSummary(
          `${invalidControls.length} required ${invalidControls.length === 1 ? 'field needs' : 'fields need'} attention.`
        );
        return;
      }

      // Valid submission: generate reference code and confirm in .form-status.
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const refId = `RMC-INQ-2026-${randomNum}`;
      const companyVal = form.querySelector('[name="company"]')?.value.trim() || 'your facility';
      const serviceEl = form.querySelector('[name="service"]');
      const serviceLabel =
        serviceEl instanceof HTMLSelectElement && serviceEl.selectedOptions[0]
          ? serviceEl.selectedOptions[0].textContent.trim()
          : 'Engineering & EHS Inquiry';

      pendingPostSubmitReset.add(form);
      form.reset();

      if (statusEl) {
        statusEl.classList.remove('is-error');
        statusEl.hidden = false;
        statusEl.replaceChildren();

        const title = document.createElement('strong');
        title.textContent = `Reference ${refId} Logged`;
        const details = document.createElement('p');
        details.textContent = `Thank you — your ${serviceLabel} request for ${companyVal} has been recorded. RMC's Saddar, Karachi engineering desk responds within 1 business day (Urgent hotline: 0316-9043273).`;
        statusEl.append(title, details);
      }

      announceSummary(`Inquiry submitted successfully under reference ${refId}.`);
    });
  }
}

/**
 * Progressive IntersectionObserver reveal when CSS scroll-driven view() timelines
 * are unavailable and the user permits motion.
 */
function initScrollRevealFallback() {
  if (
    !window.matchMedia(REDUCED_MOTION_QUERY).matches ||
    CSS.supports('(animation-timeline: view()) and (animation-range: entry)')
  ) {
    return;
  }

  const targets = document.querySelectorAll('.scroll-reveal');
  if (!targets.length || typeof IntersectionObserver !== 'function') return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.animate(
          [
            { opacity: 0.01, transform: 'translateY(1rem)' },
            { opacity: 1, transform: 'translateY(0)' }
          ],
          { duration: 360, easing: 'ease-out', fill: 'both' }
        );
        obs.unobserve(entry.target);
      }
    },
    { threshold: 0.12 }
  );

  for (const el of targets) {
    observer.observe(el);
  }
}

initCurrentYear();
initResponsiveNavbar();
initDialogs();
initExclusiveDetailsFallback();
initFormValidation();
initScrollRevealFallback();
