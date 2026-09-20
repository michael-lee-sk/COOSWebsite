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

});
