/* Shared navigation for the pages in html/. Serve through Live Server or HTTP. */
(() => {
  const host = document.querySelector('[data-navbar]');
  if (!host) return;
  const source = new URL('../html/partials/navbar.html', document.currentScript.src);

  function initialize(header, mobile) {
    const items = [...header.querySelectorAll('[data-menu]')];
    const burger = header.querySelector('[data-burger]');
    const desktop = window.matchMedia('(min-width: 721px)');

    function setMenu(item, open) {
      item.classList.toggle('open', open);
      item.querySelector('button')?.setAttribute('aria-expanded', String(open));
    }
    function closeMenus(except) {
      items.forEach(item => { if (item !== except) setMenu(item, false); });
    }
    function setMobile(open) {
      mobile.classList.toggle('open', open);
      mobile.inert = !open;
      burger.setAttribute('aria-expanded', String(open));
      if (!open) mobile.querySelectorAll('.m-sec').forEach(section => setMenu(section, false));
    }

    items.forEach((item, index) => {
      const button = item.querySelector('button');
      const panel = item.querySelector('.panel');
      if (!button || !panel) return;
      panel.id = `coos-menu-${index}`;
      button.setAttribute('aria-controls', panel.id);
      setMenu(item, false);
      button.addEventListener('click', () => {
        const open = !item.classList.contains('open');
        closeMenus(item);
        setMenu(item, open);
      });
      item.addEventListener('mouseenter', () => {
        if (desktop.matches) { closeMenus(item); setMenu(item, true); }
      });
      item.addEventListener('mouseleave', () => {
        if (desktop.matches && !item.contains(document.activeElement)) setMenu(item, false);
      });
      item.addEventListener('focusout', event => {
        if (!item.contains(event.relatedTarget)) setMenu(item, false);
      });
    });

    mobile.querySelectorAll('.m-sec > button').forEach((button, index) => {
      const section = button.parentElement;
      const panel = section.querySelector('.m-body');
      if (panel) {
        panel.id = `coos-mobile-section-${index}`;
        button.setAttribute('aria-controls', panel.id);
      }
      setMenu(section, false);
      button.addEventListener('click', () => setMenu(section, !section.classList.contains('open')));
    });
    setMobile(false);
    burger.addEventListener('click', () => setMobile(!mobile.classList.contains('open')));
    mobile.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMobile(false)));
    header.querySelectorAll('.panel a').forEach(link => link.addEventListener('click', () => closeMenus()));

    document.addEventListener('click', event => {
      if (!header.contains(event.target)) closeMenus();
      if (!header.contains(event.target) && !mobile.contains(event.target)) setMobile(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const active = items.find(item => item.classList.contains('open') && item.contains(document.activeElement));
      const mobileWasOpen = mobile.classList.contains('open');
      closeMenus();
      setMobile(false);
      if (mobileWasOpen) burger.focus();
      else active?.querySelector('button')?.focus();
    });
    desktop.addEventListener('change', () => { closeMenus(); setMobile(false); });

    const current = new URL(window.location.href);
    [...header.querySelectorAll('a'), ...mobile.querySelectorAll('a')].forEach(link => {
      const target = new URL(link.href, current);
      if (target.pathname.endsWith('/newcomer.html') && target.pathname === current.pathname) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
    const updateNav = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  async function load() {
    try {
      const response = await fetch(source);
      if (!response.ok) throw new Error(`Navbar request returned ${response.status}`);
      const template = document.createElement('template');
      template.innerHTML = await response.text();
      const header = template.content.querySelector('header.nav');
      const mobile = template.content.querySelector('[data-mobile]');
      if (!header || !mobile || !header.querySelector('[data-burger]')) {
        throw new Error('Navbar partial is missing its required controls');
      }
      // Replace the placeholder so the sticky header remains a direct body child.
      host.replaceWith(template.content);
      initialize(header, mobile);
    } catch (error) {
      // The basic links in the placeholder remain usable if the request fails.
      console.error('Could not load the shared navbar. Use Live Server or an HTTP server.', error);
    }
  }
  load();
})();
