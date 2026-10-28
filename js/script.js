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

  const ministryScroller = document.querySelector('.ministries-stack');
  if (ministryScroller) {
    ministryScroller.addEventListener('wheel', event => {
      if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      let delta = event.deltaY;
      if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) delta *= 16;
      if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) delta *= ministryScroller.clientWidth;

      const maxScrollLeft = ministryScroller.scrollWidth - ministryScroller.clientWidth;
      const edgeTolerance = 4;
      const canScroll = delta > 0
        ? ministryScroller.scrollLeft < maxScrollLeft - edgeTolerance
        : ministryScroller.scrollLeft > edgeTolerance;

      if (canScroll) {
        event.preventDefault();
        ministryScroller.scrollLeft += delta;
      }
    }, { passive: false });
  }

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
