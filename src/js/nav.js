// Sticky top bar: active-section highlight and the mobile full-screen menu.

const mobile = window.matchMedia('(max-width: 767px)');

export function initNav() {
  const nav = document.querySelector('.nav');
  const menuBtn = document.querySelector('.topbar__menu');
  const closeBtn = document.querySelector('.nav__close');
  const indicator = document.querySelector('.nav__indicator');
  const links = [...document.querySelectorAll('.nav__link')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const outside = [document.querySelector('main'), document.querySelector('.footer'), document.querySelector('.topbar__mark')];

  /* ---- Active section */
  nav.classList.add('has-indicator');
  let current = null;

  function moveIndicator() {
    const active = links.find((a) => a.hasAttribute('aria-current'));
    if (!active || mobile.matches) return indicator.style.setProperty('--o', 0);
    const navBox = nav.getBoundingClientRect();
    const box = active.getBoundingClientRect();
    indicator.style.setProperty('--x', `${box.left - navBox.left + 12}px`);
    indicator.style.setProperty('--w', `${box.width - 24}px`);
    indicator.style.setProperty('--o', 1);
  }

  function setActive(id) {
    if (id === current) return;
    current = id;
    links.forEach((a) => {
      if (a.getAttribute('href') === `#${id}`) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
    moveIndicator();
  }

  // A section is "active" while it crosses a line ~35% down the viewport
  const visible = new Map();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => visible.set(e.target.id, e.isIntersecting));
      const hit = sections.find((s) => visible.get(s.id));
      setActive(hit ? hit.id : null);
    },
    { rootMargin: '-35% 0px -60% 0px' }
  );
  sections.forEach((s) => io.observe(s));
  window.addEventListener('resize', moveIndicator);
  document.fonts?.ready.then(moveIndicator);

  /* ---- Mobile menu */
  function open() {
    nav.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    outside.forEach((el) => el && (el.inert = true));
    menuBtn.inert = true;
    document.documentElement.classList.add('is-locked');
    links[0].focus();
  }
  function close({ restoreFocus = true } = {}) {
    if (!nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    outside.forEach((el) => el && (el.inert = false));
    menuBtn.inert = false;
    document.documentElement.classList.remove('is-locked');
    if (restoreFocus) menuBtn.focus();
  }

  menuBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', () => close());
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) close({ restoreFocus: false });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  mobile.addEventListener('change', () => close({ restoreFocus: false }));
}
