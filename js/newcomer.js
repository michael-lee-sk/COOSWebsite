/* Campus details open deliberately by click, tap, or keyboard activation. */
(() => {
  document.querySelectorAll('[data-campus-dialog]').forEach(trigger => {
    const dialog = document.getElementById(trigger.dataset.campusDialog);
    if (!dialog) return;
    trigger.addEventListener('click', () => {
      if (dialog.open || document.querySelector('.campus-dialog[open]')) return;
      const map = dialog.querySelector('iframe[data-src]');
      if (map && !map.hasAttribute('src')) map.src = map.dataset.src;
      dialog.showModal();
      document.body.classList.add('campus-dialog-open');
    });
    dialog.querySelector('.campus-dialog__close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
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
    next.textContent = current === steps.length - 1 ? 'Finish preview' : 'Next \u2192';
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
