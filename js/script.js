/**
 * Church of Our Saviour (COOS) - Interactive Features & Cookie Management
 */

document.addEventListener('DOMContentLoaded', function () {
  
  // 1. Mega-Menu Dropdowns (from new.html)
  const items = [...document.querySelectorAll('[data-menu]')];
  function closeAll(except) {
    items.forEach(i => { if (i !== except) i.classList.remove('open'); });
  }

  items.forEach(item => {
    const btn = item.querySelector('button');
    if (!btn) return;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = item.classList.contains('open');
      closeAll();
      item.classList.toggle('open', !isOpen);
    });

    item.addEventListener('mouseenter', () => {
      if (window.innerWidth > 720) {
        closeAll(item);
        item.classList.add('open');
      }
    });

    item.addEventListener('mouseleave', () => {
      if (window.innerWidth > 720) {
        item.classList.remove('open');
      }
    });
  });

  document.addEventListener('click', () => closeAll());

  // Mobile Drawer Toggle
  const mob = document.querySelector('[data-mobile]');
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeAll();
      if (mob) mob.classList.remove('open');
    }
  });

  const burger = document.querySelector('[data-burger]');
  if (burger && mob) {
    burger.addEventListener('click', () => mob.classList.toggle('open'));
  }

  document.querySelectorAll('.m-sec > button').forEach(b => {
    b.addEventListener('click', () => b.parentElement.classList.toggle('open'));
  });

  // 2. Cookie Consent Banner Handling
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieDecline = document.getElementById('cookieDecline');
  const cookieAccept = document.getElementById('cookieAccept');

  // Check if consent choice is saved in localStorage
  const cookieConsent = localStorage.getItem('coos_cookie_consent');
  if (cookieConsent && cookieBanner) {
    cookieBanner.classList.add('hidden');
  }

  function handleCookieChoice(choice) {
    localStorage.setItem('coos_cookie_consent', choice);
    if (cookieBanner) {
      cookieBanner.classList.add('hidden');
    }
  }

  if (cookieDecline) {
    cookieDecline.addEventListener('click', function () {
      handleCookieChoice('declined');
    });
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      handleCookieChoice('accepted');
    });
  }

  // 3. Scrollytelling: Swap pinned bg + caption as each step crosses viewport center
  (function () {
    const root = document.getElementById('scrolly');
    if (!root) return;
    const bgWrap = root.querySelector('.scrolly__bg');
    const hEl = root.querySelector('[data-h]');
    const pEl = root.querySelector('[data-p]');
    const steps = [...root.querySelectorAll('[data-step]')];
    const imgCache = {};
    function getImg(src) {
      if (imgCache[src]) return imgCache[src];
      const img = document.createElement('img');
      img.src = src;
      img.setAttribute('data-bg', '');
      bgWrap.appendChild(img);
      imgCache[src] = img;
      return img;
    }
    // preload first image as active
    const first = bgWrap ? bgWrap.querySelector('img[data-bg]') : null;
    if (first) {
      first.classList.add('is-active');
    }

    let current = null;
    function activate(step) {
      if (current === step) return;
      current = step;
      const src = step.dataset.img;
      const img = getImg(src);
      if (bgWrap) {
        bgWrap.querySelectorAll('img').forEach(i => i.classList.remove('is-active'));
      }
      img.classList.add('is-active');
      if (hEl && pEl) {
        hEl.style.opacity = 0;
        pEl.style.opacity = 0;
        hEl.style.transform = 'translateY(8px)';
        pEl.style.transform = 'translateY(8px)';
        setTimeout(() => {
          hEl.textContent = step.dataset.title;
          pEl.textContent = step.dataset.text;
          hEl.style.opacity = 1;
          pEl.style.opacity = 1;
          hEl.style.transform = 'translateY(0)';
          pEl.style.transform = 'translateY(0)';
        }, 160);
      }
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) activate(e.target);
      });
    }, { threshold: 0, rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(s => io.observe(s));
  })();
});


/* Phase 1: progressive enhancement. Existing handlers remain intact. */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  if (nav) {
    const updateNav = () => nav.classList.toggle('is-scrolled', window.scrollY > 16);
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = [...document.querySelectorAll('[data-reveal-section]')];
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
    sections.forEach(section => {
      // Do not conceal content already on screen during initialization.
      if (section.getBoundingClientRect().top > window.innerHeight) {
        section.classList.add('reveal-ready');
        observer.observe(section);
      }
    });
  }

  // Reflect menu state for assistive technologies without altering the original controls.
  document.querySelectorAll('[data-menu] > button, .m-sec > button').forEach(button => {
    button.setAttribute('aria-expanded', String(button.parentElement.classList.contains('open')));
  });
  const syncMenuState = () => {
    document.querySelectorAll('[data-menu] > button, .m-sec > button').forEach(button => {
      button.setAttribute('aria-expanded', String(button.parentElement.classList.contains('open')));
    });
  };
  document.addEventListener('click', syncMenuState);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') syncMenuState(); });
});


/* Homepage V2: progress, accessible mobile navigation, and story position. */
document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('homepage-v2')) return;
  const progress = document.querySelector('.reading-progress span');
  let scheduled = false;
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  const burger = document.querySelector('[data-burger]');
  const mobile = document.querySelector('[data-mobile]');
  const syncNavigation = () => {
    if (burger && mobile) burger.setAttribute('aria-expanded', String(mobile.classList.contains('open')));
    document.querySelectorAll('[data-menu] > button, .m-sec > button').forEach(button => {
      button.setAttribute('aria-expanded', String(button.parentElement.classList.contains('open')));
    });
  };
  if (burger && mobile) {
    burger.setAttribute('aria-controls', 'coos-mobile-menu');
    mobile.id = 'coos-mobile-menu';
    burger.setAttribute('aria-expanded', 'false');
    mobile.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      mobile.classList.remove('open'); syncNavigation();
    }));
  }
  document.addEventListener('click', syncNavigation);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { syncNavigation(); burger?.focus(); }
  });
  syncNavigation();

  const steps = [...document.querySelectorAll('#scrolly [data-step]')];
  const counter = document.querySelector('[data-story-counter]');
  if (counter && steps.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const index = steps.indexOf(entry.target) + 1;
        counter.textContent = `${String(index).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
      }
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(step => observer.observe(step));
  }
});
