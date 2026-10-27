// Project pop-ups: one native <dialog> filled from the server-rendered
// <article id="slug"> blocks. Hash routing follows README §C.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initModal() {
  const dialog = document.getElementById('popup');
  const body = dialog.querySelector('.popup__body');
  const counter = dialog.querySelector('.popup__counter');
  const articles = new Map([...document.querySelectorAll('.popup-article')].map((a) => [a.dataset.slug, a]));
  const projects = [...document.querySelectorAll('.card[data-popup]')].map((c) => c.dataset.popup);
  const SOLO = 'research'; // not part of the project set: no prev/next

  let currentSlug = null;
  let pendingSlug = null; // target of an in-flight cross-fade
  let opener = null;
  let closingFromHistory = false;

  const homeHash = (slug) => (slug === SOLO ? '#innovation' : '#projects');
  const triggerFor = (slug) => document.querySelector(slug === SOLO ? '.innovation [data-popup]' : `.card[data-popup="${slug}"]`);

  function fill(slug) {
    const node = articles.get(slug).cloneNode(true);
    // Strip ids so the clone does not duplicate the fallback articles
    node.removeAttribute('id');
    node.removeAttribute('aria-labelledby');
    node.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    node.querySelector('.popup__title').id = 'popup-title';
    body.replaceChildren(node);
    watchImages(body);

    const solo = slug === SOLO;
    dialog.classList.toggle('is-solo', solo);
    if (!solo) counter.textContent = `${projects.indexOf(slug) + 1} / ${projects.length}`;
    currentSlug = slug;
  }

  function focusTitle() {
    dialog.querySelector('.popup__frame').scrollTop = 0;
    dialog.querySelector('#popup-title').focus({ preventScroll: true });
  }

  function open(slug, { history: mode = 'push', from = null } = {}) {
    if (!articles.has(slug)) return;
    const wasOpen = dialog.open;
    if (wasOpen && slug !== currentSlug) return swap(slug, mode);

    opener = from || triggerFor(slug);
    fill(slug);
    if (mode === 'push') history.pushState({ popup: slug }, '', `#${slug}`);
    else if (mode === 'replace') history.replaceState({ popup: slug }, '', `#${slug}`);
    if (!wasOpen) {
      document.documentElement.classList.add('is-locked');
      dialog.showModal();
    }
    focusTitle();
  }

  function swap(slug, mode = 'replace') {
    pendingSlug = slug;
    const done = () => {
      if (pendingSlug !== slug) return; // superseded by a later step
      pendingSlug = null;
      fill(slug);
      if (mode !== 'none') history.replaceState({ popup: slug }, '', `#${slug}`);
      focusTitle();
      body.classList.remove('is-swapping');
    };
    if (reduceMotion.matches) return done();
    body.classList.add('is-swapping');
    setTimeout(done, 150);
  }

  function step(dir) {
    const from = pendingSlug || currentSlug;
    if (!from || from === SOLO) return;
    const i = projects.indexOf(from);
    swap(projects[(i + dir + projects.length) % projects.length]);
  }

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('is-locked');
    if (!closingFromHistory && currentSlug) {
      history.replaceState(null, '', homeHash(currentSlug));
    }
    closingFromHistory = false;
    currentSlug = null;
    body.replaceChildren();
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
  });

  // Close button, backdrop click (the dialog box itself, outside the frame)
  dialog.querySelector('.popup__close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.querySelector('.popup__prev').addEventListener('click', () => step(-1));
  dialog.querySelector('.popup__next').addEventListener('click', () => step(1));
  document.addEventListener('keydown', (e) => {
    if (!dialog.open || e.target.closest('input, textarea, select, [contenteditable]')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  });

  // Cards, the Innovation button and the in-dialog "(see Innovation)" link
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-popup]');
    if (!trigger || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    open(trigger.dataset.popup, { from: dialog.contains(trigger) ? opener : trigger });
  });

  // Back / Forward
  window.addEventListener('popstate', () => {
    const slug = location.hash.slice(1);
    if (articles.has(slug)) {
      if (dialog.open) swap(slug, 'none');
      else open(slug, { history: 'none' });
    } else if (dialog.open) {
      closingFromHistory = true;
      dialog.close();
    }
  });

  // Deep link on load: page sits at the section behind, pop-up opens
  const initial = location.hash.slice(1);
  if (articles.has(initial)) {
    // The browser's own fragment scroll runs after this script, so re-apply on load
    const section = document.getElementById(homeHash(initial).slice(1));
    const toSection = () => section && window.scrollTo({ top: section.offsetTop, behavior: 'instant' });
    toSection();
    window.addEventListener('load', () => requestAnimationFrame(() => {
      toSection();
      if (dialog.open) focusTitle(); // fragment navigation resets focus to <body>
    }), { once: true });
    open(initial, { history: 'none' });
  } else if (initial && !document.getElementById(initial)) {
    window.scrollTo(0, 0); // unknown hash: ignore
  }
}

// ImageFrame error state: keep the frame, show "Image unavailable" + alt
export function watchImages(root = document) {
  root.querySelectorAll('.frame img').forEach((img) => {
    const fail = () => img.closest('.frame')?.classList.add('is-error');
    if (img.complete && img.naturalWidth === 0 && img.currentSrc) fail();
    else img.addEventListener('error', fail, { once: true });
  });
}
