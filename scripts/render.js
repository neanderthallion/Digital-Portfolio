// Renders content/site.json into static HTML strings at build (and dev) time,
// so the page is complete without JavaScript. Pop-up content is rendered as
// <article id="slug"> blocks at the end of <main>; modal.js reuses them.

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const split = (s) => s.split(' · ').map((x) => x.trim()).filter(Boolean);
const isMissing = (href) => !href || href.includes('CONTENT NEEDED');
const isExternal = (href) => /^https?:/.test(href);

const NEW_TAB = '<span class="sr-only"> (opens in new tab)</span>';
const ARROW_OUT = '<span class="btn__icon" aria-hidden="true">↗</span>';
const ARROW = '<span class="btn__icon" aria-hidden="true">→</span>';

const POPUP_HASH = /^#(vtec|mindful-odyssey|slumbering|ds-in-the-making|petite|gesture-game|research)$/;

function button({ label, href, primary = false, large = false, attrs = '' }) {
  if (isMissing(href)) return '';
  const popup = href.match(POPUP_HASH);
  if (popup && !attrs.includes('data-popup')) attrs += ` aria-haspopup="dialog" data-popup="${popup[1]}"`;
  const ext = isExternal(href);
  const cls = ['btn', primary ? 'btn--primary' : 'btn--secondary', large ? 'btn--large' : ''].filter(Boolean).join(' ');
  const target = ext ? ' target="_blank" rel="noopener"' : '';
  const icon = ext ? ARROW_OUT + NEW_TAB : href.startsWith('#') ? ARROW : '';
  return `<a class="${cls}" href="${esc(href)}"${target}${attrs}>${esc(label)}${icon}</a>`;
}

// "01 / ABOUT" → red tick, red index, name
function label(text) {
  const [index, ...rest] = String(text).split(' / ');
  const inner = rest.length ? `<span class="section-label__index">${esc(index)}</span> / ${esc(rest.join(' / '))}` : esc(index);
  return `<p class="section-label"><span class="section-label__tick" aria-hidden="true"></span><span>${inner}</span></p>`;
}

// Wireframe column hairlines behind a section (decoration only)
const VGRID = `<div class="vgrid" aria-hidden="true">${'<span></span>'.repeat(6)}</div>`;

// Wraps one phrase of an approved heading in the red italic accent, if present
const accent = (text, phrase) => {
  const t = esc(text), p = esc(phrase);
  return t.includes(p) ? t.replace(p, `<span class="em-accent">${p}</span>`) : t;
};

// Crosshair corners for ImageFrame
const CORNERS = ['tl', 'tr', 'bl', 'br'].map((c) => `<span class="xh xh--${c}" aria-hidden="true"></span>`).join('');

function picture(images, id, { alt = '', sizes = '100vw', eager = false } = {}) {
  const m = images[id];
  if (!m) throw new Error(`Unknown image id "${id}" in site.json — add it to scripts/images.js, then run npm run images`);
  const srcset = (ext) => m.widths.map((w) => `img/${id}-${w}.${ext} ${w}w`).join(', ');
  const fallback = m.widths.includes(960) ? 960 : m.widths[m.widths.length - 1];
  const loading = eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  return `<picture><source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}"><img src="img/${id}-${fallback}.${m.ext}" srcset="${srcset(m.ext)}" sizes="${sizes}" alt="${esc(alt)}" width="${m.width}" height="${m.height}" ${loading} decoding="async"${m.pixelated ? ' class="is-pixelated"' : ''}></picture>`;
}

function frame(images, img, opts = {}) {
  const { annotation, cls = '' } = opts;
  if (!img.id) {
    // Dev placeholder; its CONTENT NEEDED text makes the production check fail
    return `<figure class="frame frame--missing ${cls}" style="--ar: 4 / 3"><div class="frame__missing"><span class="mono">${esc(img.needed)}</span><span class="frame__missing-alt">${esc(img.alt)}</span></div>${CORNERS}</figure>`;
  }
  const m = images[img.id];
  const note = annotation ? `<span class="frame__note mono" aria-hidden="true"><span class="frame__line"></span>${esc(annotation)}</span>` : '';
  return `<figure class="frame ${cls}" style="--ar: ${m.width} / ${m.height}" data-alt="${esc(img.alt)}">${picture(images, img.id, { alt: img.alt, ...opts })}${CORNERS}${note}</figure>`;
}

// Wireframe geometry (GridDecor): hairlines, circles, ticks, one red dot. No text.
const DECOR = {
  sphere: () => {
    const merid = [0.18, 0.42, 0.66, 0.88].map((k) => `<ellipse cx="300" cy="300" rx="${250 * k}" ry="250" />`).join('');
    const lats = [-0.66, -0.36, 0, 0.36, 0.66]
      .map((y) => { const r = 250 * Math.sqrt(1 - y * y); return `<ellipse cx="300" cy="${300 + y * 250}" rx="${r.toFixed(1)}" ry="${(r * 0.16).toFixed(1)}" />`; })
      .join('');
    return `<circle cx="300" cy="300" r="250" />${merid}${lats}
      <line x1="300" y1="20" x2="300" y2="580" class="decor__faint" />
      <ellipse cx="300" cy="300" rx="290" ry="70" transform="rotate(-18 300 300)" class="decor__accent" />
      <circle cx="562" cy="215" r="5" class="decor__dot" />`;
  },
  target: () => {
    const ticks = Array.from({ length: 72 }, (_, i) => i * 5)
      .map((a) => {
        const r1 = a % 30 === 0 ? 256 : 268, t = (a * Math.PI) / 180;
        const x = (r) => (300 + r * Math.cos(t)).toFixed(1), y = (r) => (300 + r * Math.sin(t)).toFixed(1);
        return `<line class="decor__tick" x1="${x(r1)}" y1="${y(r1)}" x2="${x(280)}" y2="${y(280)}" />`;
      })
      .join('');
    return `<circle cx="300" cy="300" r="280" /><circle cx="300" cy="300" r="180" class="decor__faint" /><circle cx="300" cy="300" r="60" />${ticks}
      <line x1="0" y1="300" x2="600" y2="300" /><line x1="300" y1="0" x2="300" y2="600" />
      <path d="M300 300 L498 102" class="decor__accent" /><circle cx="498" cy="102" r="5" class="decor__dot" />`;
  },
};

function gridDecor(variant) {
  return `<svg class="decor decor--${variant}" aria-hidden="true" focusable="false" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">${DECOR[variant]()}</svg>`;
}

/* ------------------------------------------------------------------ header */

function header(site) {
  const links = site.nav
    .map((n, i) => `<li><a class="nav__link" href="${n.href}"><span class="nav__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${esc(n.label)}</a></li>`)
    .join('');
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="topbar">
  <div class="container topbar__inner">
    <a class="topbar__mark" href="#top"><span class="topbar__dot" aria-hidden="true"></span>Minh Anh</a>
    <button class="topbar__menu" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="nav" id="site-nav" aria-label="Main">
      <button class="nav__close" type="button" aria-label="Close menu"><span aria-hidden="true">✕</span></button>
      <ul class="nav__list">${links}</ul>
      <span class="nav__indicator" aria-hidden="true"></span>
    </nav>
  </div>
</header>`;
}
// ${button({ label: 'Résumé', href: site.links.resume, attrs: ' data-resume' }).replace('btn btn--secondary', 'btn btn--secondary btn--small')}

/* ------------------------------------------------------------------ sections */

function hero(site, images) {
  const h = site.hero;
  // "Luong Minh Anh" → family name, then the given name in the red box
  const [family, ...given] = h.name.split(' ');
  return `<section class="hero" id="top" aria-labelledby="hero-title">
  ${VGRID}
  <div class="container hero__inner">
    <div class="hero__meta">
      <p class="mono hero__item" style="--i:0">${esc(h.label)}</p>
      <p class="mono hero__item" style="--i:1">${esc(h.tagline)}</p>
    </div>
    <h1 class="display display--hero hero__name hero__item" id="hero-title" style="--i:2"><span>${esc(family)}</span> <span><span class="em-box">${esc(given.join(' '))}</span></span></h1>
    <div class="hero__orb hero__item" style="--i:3">
      ${gridDecor('sphere')}
      ${frame(images, h.image, { eager: true, sizes: '(min-width: 1024px) 330px, 78vw', annotation: h.annotation, cls: 'frame--cover hero__frame' })}
    </div>
    <p class="hero__theme hero__item" style="--i:4">${esc(h.theme)}</p>
    <div class="btn-row hero__cta hero__item" style="--i:5">
      ${button({ ...h.primary, primary: true })}
      ${button(h.secondary)}
    </div>
  </div>
</section>`;
}

function about(site) {
  const a = site.about;
  const copy = [].concat(a.copy).map((p) => `<p>${esc(p)}</p>`).join('');
  const chips = a.chips.map((c) => `<li class="chip"><span class="chip__label">${esc(c.label)}</span><span class="chip__value">${esc(c.value)}</span></li>`).join('');
  const highlights = a.highlights
    .map((h, i) => `<li class="highlight"><span class="highlight__index mono" aria-hidden="true">A/${String(i + 1).padStart(2, '0')}</span><span>${esc(h)}</span></li>`)
    .join('');
  return `<section class="section about theme-paper reveal" id="about" aria-labelledby="about-title">
  ${VGRID}
  <div class="container">
    ${label(a.label)}
    <div class="grid">
      <div class="about__intro">
        <h2 class="display display--section" id="about-title">${accent(a.heading, 'Minh Anh')}</h2>
        <div class="body-copy about__copy">${copy}</div>
      </div>
      <div class="about__facts">
        <h3 class="sr-only">Scores</h3>
        <ul class="chips">${chips}</ul>
        <h3 class="sr-only">Highlights</h3>
        <ol class="highlights">${highlights}</ol>
        <div class="btn-row">${a.buttons.map(button).join('')}</div>
      </div>
    </div>
    <span class="about__wm halftone-text" aria-hidden="true">About</span>
  </div>
</section>`;
}

// Cards past this count sit behind the "See more projects" button (JS only)
const VISIBLE_PROJECTS = 4;

function projects(site, images) {
  const p = site.projects;
  const cards = p.items
    .map((it, i) => {
      const media = it.image
        ? picture(images, it.image, { sizes: '(min-width: 1024px) 390px, (min-width: 640px) 44vw, 90vw' })
        : `<span class="card__missing mono">${esc(it.imageNeeded)}</span>`;
      return `<li${i >= VISIBLE_PROJECTS ? ' class="cards__more"' : ''}>
      <a class="card" href="#${it.slug}" aria-haspopup="dialog" aria-describedby="${it.slug}-desc" data-popup="${it.slug}">
        <div class="card__media">
          ${media}
          <span class="card__index mono" aria-hidden="true">${esc(it.index)}</span>
          <span class="card__panel" aria-hidden="true">
            <span class="card__panel-title">${esc(it.name)}</span>
            <span class="card__panel-desc">${esc(it.desc)}</span>
          </span>
        </div>
        <div class="card__body">
          <div class="card__head"><h3 class="card__title">${esc(it.name)}</h3><span class="card__arrow" aria-hidden="true">→</span></div>
          <p class="card__desc" id="${it.slug}-desc">${esc(it.desc)}</p>
        </div>
      </a>
    </li>`;
    })
    .join('');
  return `<section class="section projects reveal" id="projects" aria-labelledby="projects-title">
  ${VGRID}
  <div class="container">
    ${label(p.label)}
    <div class="section-head">
      <h2 class="display display--section" id="projects-title">${esc(p.heading)}<span class="section-head__count" aria-hidden="true">(${String(p.items.length).padStart(2, '0')})</span></h2>
      <p class="section-head__sub">${esc(p.subheading)}</p>
    </div>
    <ul class="cards" id="projects-list">${cards}</ul>
    ${p.items.length > VISIBLE_PROJECTS ? `<div class="projects__more"><button class="btn btn--secondary projects__toggle" type="button" aria-expanded="false" aria-controls="projects-list" hidden>See more projects<span class="btn__icon" aria-hidden="true">↓</span></button></div>` : ''}
  </div>
</section>`;
}

function innovation(site, images) {
  const n = site.innovation;
  const stats = n.stats
    .map((s) => `<li class="stat"><span class="stat__value" aria-hidden="true">${esc(s.value)}</span><span class="stat__caption mono" aria-hidden="true">${esc(s.caption)}</span><span class="sr-only">${esc(s.sr)}</span></li>`)
    .join('');
  return `<section class="section innovation reveal" id="innovation" aria-labelledby="innovation-title">
  ${VGRID}
  <div class="container">
    ${label(n.label)}
    <div class="grid">
      <div class="innovation__text">
        <h2 class="heading-xl" id="innovation-title">${esc(n.heading)}</h2>
        <p class="body-copy">${esc(n.copy)}</p>
        <ul class="stats">${stats}</ul>
        <div class="btn-row">${(n.buttons || [{ ...n.button, primary: true }]).map(button).join('')}</div>
      </div>
      <div class="innovation__media">
        <div class="innovation__wash" aria-hidden="true"></div>
        ${gridDecor('target')}
        ${frame(images, n.image, { sizes: '(min-width: 1024px) 500px, 92vw', annotation: n.annotation, cls: 'frame--chart' })}
      </div>
    </div>
  </div>
</section>`;
}

function contact(site) {
  const c = site.contact;
  const refs = site.flags.SHOW_REFERENCES
    ? `<div class="references"><h3 class="mono references__title">References</h3><ul>${c.references
        .map((r) => `<li><strong>${esc(r.name)}</strong><span>${esc(r.role)}</span><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></li>`)
        .join('')}</ul></div>`
    : '';
  return `<section class="section contact reveal" id="contact" aria-labelledby="contact-title">
  ${VGRID}
  <div class="contact__dots" aria-hidden="true"></div>
  <div class="container">
    ${label(c.label)}
    <h2 class="display" id="contact-title">${accent(c.heading, 'hello')}</h2>
    <p class="body-copy contact__copy">${esc(c.copy)}</p>
    <div class="btn-row">${button({ ...c.button, primary: true, large: true })}</div>
    ${refs}
  </div>
</section>`;
}

function footer(site) {
  const f = site.footer;
  return `<footer class="footer">
  <div class="container footer__inner">
    <p class="footer__left">${esc(f.name)} · (+84)833065011 · <a href="mailto:${esc(site.links.email)}">${esc(site.links.email)}</a></p>
    <p class="footer__right">
      <a href="${esc(site.links.github)}" target="_blank" rel="noopener">GitHub${NEW_TAB}</a>
      <a href="#top">${esc(f.backToTop)}</a>
    </p>
    <p class="footer__updated mono">Updated ${esc(site.meta.publishDate)}</p>
  </div>
</footer>`;
}

/* ------------------------------------------------------------------ pop-up articles */

function listItems(s) {
  return split(s)
    .map((item) => {
      // "(see Innovation)" becomes an in-dialog link to the research pop-up
      const html = esc(item).replace('(see Innovation)', '(<a href="#research" data-popup="research">see Innovation</a>)');
      return `<li>${html}</li>`;
    })
    .join('');
}

function detailRow(row, images) {
  if (row.image) return `<div class="popup__image popup__image--inline">${frame(images, row.image, { sizes: '(min-width: 1024px) 820px, 92vw' })}</div>`;
  if (row.compare) {
    return `<div class="compare">${row.compare
      .map((c, i) => `<div class="compare__col${i ? ' compare__col--cant' : ''}"><h3 class="detail__label mono">${esc(c.label)}</h3><p>${esc(c.text)}</p></div>`)
      .join('')}</div>`;
  }
  let content;
  if (row.text) content = `<p>${esc(row.text)}</p>`;
  else if (row.list) content = `<ul class="detail__list">${listItems(row.list)}</ul>`;
  else if (row.steps) content = `<ol class="detail__steps">${split(row.steps).map((s) => `<li>${esc(s.replace(/^\d+\.\s*/, ''))}</li>`).join('')}</ol>`;
  else if (row.groups) {
    content = row.groups
      .map((g) => `<div class="dataset"><h4 class="dataset__name">${esc(g.dataset)}</h4><ul class="dataset__items">${g.items
        .map((it) => `<li><p>${esc(it.did)}</p><p class="dataset__result"><span class="mono">Result</span> ${esc(it.result)}</p></li>`)
        .join('')}</ul></div>`)
      .join('');
  }
  return `<div class="detail"><h3 class="detail__label mono">${esc(row.label)}</h3><div class="detail__content">${content}</div></div>`;
}

function article(site, images, p) {
  const links = p.links.map((l) => button({ label: l.label, href: l.href })).filter(Boolean).join('');
  const role = p.roleDates ? `<p class="popup__role mono">${split(p.roleDates).map(esc).join('<br>')}</p>` : '';
  const intro = p.appIntro ? `<p class="popup__intro">${esc(site.sharedAppIntro)}</p>` : '';
  return `<article class="popup-article" id="${p.slug}" aria-labelledby="${p.slug}-title" data-slug="${p.slug}">
  <div class="popup__image">${frame(images, p.image, { sizes: '(min-width: 1024px) 820px, 100vw' })}</div>
  <h2 class="popup__title" id="${p.slug}-title" tabindex="-1">${esc(p.title)}</h2>
  ${role}
  ${intro}
  <div class="details">${p.rows.map((r) => detailRow(r, images)).join('')}</div>
  ${links ? `<div class="link-group">${links}</div>` : ''}
</article>`;
}

function dialog() {
  return `<dialog class="popup" id="popup" aria-labelledby="popup-title">
  <div class="popup__frame">
    <div class="popup__bar">
      <button class="popup__btn popup__close" type="button" aria-label="Close"><span aria-hidden="true">✕</span></button>
      <div class="popup__nav">
        <button class="popup__btn popup__prev" type="button" aria-label="Previous project"><span aria-hidden="true">←</span></button>
        <span class="popup__counter mono" aria-live="polite"></span>
        <button class="popup__btn popup__next" type="button" aria-label="Next project"><span aria-hidden="true">→</span></button>
      </div>
    </div>
    <div class="popup__body"></div>
  </div>
</dialog>`;
}

export function render(site, images) {
  const order = site.projects.items.map((i) => i.slug).concat('research');
  const popups = order.map((slug) => site.popups.find((p) => p.slug === slug));
  return {
    body: `${header(site)}
<main id="main" tabindex="-1">
${hero(site, images)}
${about(site)}
${projects(site, images)}
${innovation(site, images)}
${contact(site)}
<div class="articles" id="details">
  <div class="container">
    ${popups.map((p) => article(site, images, p)).join('\n')}
  </div>
</div>
</main>
${footer(site)}
${dialog()}`,
    head: `<title>${esc(site.meta.title)}</title>
<meta name="description" content="${esc(site.meta.description)}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(site.meta.title)}">
<meta property="og:description" content="${esc(site.meta.description)}">
<meta property="og:image" content="${esc(site.meta.ogImage)}">
<meta name="twitter:card" content="summary_large_image">`,
  };
}
