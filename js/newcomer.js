/* Native modal dialogs provide focus containment and Escape dismissal. */
(() => {
  document.querySelectorAll('[data-campus-dialog]').forEach(trigger => {
    const dialog = document.getElementById(trigger.dataset.campusDialog);
    if (!dialog) return;
    const hoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let hoverTimer;
    let closeTimer;
    let openedByHover = false;
    function openCampus(fromHover = false) {
      clearTimeout(hoverTimer);
      if (dialog.open || document.querySelector('.campus-dialog[open]')) return;
      const map = dialog.querySelector('iframe[data-src]');
      if (map && !map.hasAttribute('src')) map.src = map.dataset.src;
      openedByHover = fromHover;
      dialog.showModal();
      document.body.classList.add('campus-dialog-open');
    }
    trigger.addEventListener('click', () => openCampus(false));
    trigger.addEventListener('pointerenter', event => {
      if (hoverPointer.matches && event.pointerType === 'mouse') {
        hoverTimer = setTimeout(() => openCampus(true), 300);
      }
    });
    trigger.addEventListener('pointerleave', () => clearTimeout(hoverTimer));
    trigger.addEventListener('pointercancel', () => clearTimeout(hoverTimer));
    dialog.addEventListener('pointerenter', () => clearTimeout(closeTimer));
    dialog.addEventListener('pointerleave', event => {
      if (openedByHover && event.pointerType === 'mouse') {
        closeTimer = setTimeout(() => dialog.close(), 200);
      }
    });
    // A modal backdrop covers the card: allow travel to the popup, then close
    // if the mouse remains outside both the popup and its original card.
    dialog.addEventListener('pointermove', event => {
      if (!openedByHover || event.pointerType !== 'mouse') return;
      const inside = element => {
        const rect = element.getBoundingClientRect();
        return event.clientX >= rect.left && event.clientX <= rect.right &&
          event.clientY >= rect.top && event.clientY <= rect.bottom;
      };
      if (inside(dialog) || inside(trigger)) {
        clearTimeout(closeTimer);
        closeTimer = undefined;
      } else if (!closeTimer) {
        closeTimer = setTimeout(() => dialog.close(), 300);
      }
    });
    dialog.querySelector('.campus-dialog__close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
      clearTimeout(hoverTimer);
      clearTimeout(closeTimer);
      closeTimer = undefined;
      openedByHover = false;
      document.body.classList.remove('campus-dialog-open');
      trigger.focus();
    });
  });
})();

// Local, one-question-at-a-time preview. No network or storage operations.
(() => {
  const form = document.querySelector('[data-welcome-form]');
  if (!form) return;
  const intro = document.querySelector('[data-welcome-intro]');
  const complete = document.querySelector('[data-welcome-complete]');
  const steps = [...form.querySelectorAll('[data-welcome-step]')];
  const back = form.querySelector('[data-welcome-back]');
  const next = form.querySelector('[data-welcome-next]');
  const error = form.querySelector('[data-welcome-error]');
  let current = 0;
  form.noValidate = true;
  function showStep() {
    steps.forEach((step, index) => {
      step.hidden = index !== current;
      step.disabled = index !== current;
    });
    back.textContent = current === 0 ? 'Back to welcome' : 'Previous';
    next.textContent = current === steps.length - 1 ? 'Finish preview' : 'Next ?';
    form.querySelector('[data-welcome-count]').textContent = `${current + 1} / ${steps.length}`;
    form.querySelector('progress').value = current + 1;
    error.textContent = '';
    const legend = steps[current].querySelector('legend');
    legend.tabIndex = -1;
    legend.focus({ preventScroll: true });
  }
  document.querySelector('[data-welcome-start]').addEventListener('click', () => {
    intro.hidden = true; form.hidden = false; showStep();
  });
  back.addEventListener('click', () => {
    if (current === 0) {
      form.hidden = true; intro.hidden = false;
      intro.querySelector('button').focus({ preventScroll: true });
    } else { current--; showStep(); }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const invalid = [...steps[current].querySelectorAll('input,textarea')].find(input => !input.checkValidity());
    if (invalid) { invalid.reportValidity(); return; }
    if (current === 5 && !steps[current].querySelector('input:checked')) {
      error.textContent = 'Please choose at least one option.';
      steps[current].querySelector('input').focus(); return;
    }
    if (current < steps.length - 1) { current++; showStep(); }
    else {
      form.hidden = true; complete.hidden = false;
      complete.querySelector('button').focus({ preventScroll: true });
    }
  });
  document.querySelector('[data-welcome-reset]').addEventListener('click', () => {
    form.reset(); current = 0; complete.hidden = true; intro.hidden = false;
    intro.querySelector('button').focus({ preventScroll: true });
  });
  steps.forEach(step => { step.hidden = true; step.disabled = true; });
})();
