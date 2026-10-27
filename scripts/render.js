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

const label = (text) =>
  `<p class="section-label"><span>${esc(text)}</span></p>`;

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
  return `<figure class="frame ${cls}" style="--ar: ${m.width} / ${m.height}" data-alt="${esc(img.alt)}">${picture(images, img.id, opts)}${CORNERS}${note}</figure>`;
}

function gridDecor(variant) {
  // Pure decoration: hairlines, circles, crosshairs. No text.
  if (variant === 'hero') {
    return `<svg class="decor decor--hero" aria-hidden="true" focusable="false" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
      <circle cx="300" cy="300" r="290" /><circle cx="300" cy="300" r="210" /><circle cx="300" cy="300" r="130" />
      <circle cx="420" cy="220" r="170" class="decor__faint" />
      <line x1="0" y1="300" x2="600" y2="300" /><line x1="300" y1="0" x2="300" y2="600" />
      <circle cx="510" cy="300" r="5" class="decor__dot" />
    </svg>`;
  }
  return `<svg class="decor decor--${variant}" aria-hidden="true" focusable="false" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
    <circle cx="200" cy="200" r="190" /><circle cx="200" cy="200" r="120" /><line x1="0" y1="200" x2="400" y2="200" />
  </svg>`;
}

/* ------------------------------------------------------------------ header */

function header(site) {
  const links = site.nav.map((n) => `<li><a class="nav__link" href="${n.href}">${esc(n.label)}</a></li>`).join('');
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="topbar">
  <div class="container topbar__inner">
    <a class="topbar__mark" href="#top">Minh Anh</a>
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
  return `<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="decor-grid" aria-hidden="true"></div>
  <div class="container grid hero__inner">
    <div class="hero__text">
      <p class="mono hero__item" style="--i:0">${esc(h.label)}</p>
      <h1 class="display hero__item" id="hero-title" style="--i:1">${esc(h.name)}</h1>
      <p class="mono hero__tagline hero__item" style="--i:2">${esc(h.tagline)}</p>
      <p class="hero__theme hero__item" style="--i:3">${esc(h.theme)}</p>
      <div class="btn-row hero__item" style="--i:4">
        ${button({ ...h.primary, primary: true })}
        ${button(h.secondary)}
      </div>
    </div>
    <div class="hero__media">
      ${gridDecor('hero')}
      ${frame(images, h.image, { eager: true, sizes: '(min-width: 1024px) 420px, (min-width: 640px) 60vw, 80vw', annotation: h.annotation, cls: 'frame--portrait' })}
    </div>
  </div>
</section>`;
}

function about(site) {
  const a = site.about;
  const chips = a.chips.map((c) => `<li class="chip"><span class="chip__label">${esc(c.label)}</span><span class="chip__value">${esc(c.value)}</span></li>`).join('');
  const highlights = a.highlights
    .map((h, i) => `<li class="highlight"><span class="highlight__index mono" aria-hidden="true">A/${String(i + 1).padStart(2, '0')}</span><span>${esc(h)}</span></li>`)
    .join('');
  return `<section class="section about reveal" id="about" aria-labelledby="about-title">
  <div class="container">
    ${label(a.label)}
    <div class="grid">
      <div class="about__intro">
        <h2 class="display display--section" id="about-title">${esc(a.heading)}</h2>
        <p class="body-copy">${esc(a.copy)}</p>
      </div>
      <div class="about__facts">
        <h3 class="sr-only">Scores</h3>
        <ul class="chips">${chips}</ul>
        <h3 class="sr-only">Highlights</h3>
        <ol class="highlights">${highlights}</ol>
        <div class="btn-row">${a.buttons.map(button).join('')}</div>
      </div>
    </div>
  </div>
</section>`;
}

function projects(site, images) {
  const p = site.projects;
  const cards = p.items
    .map((it) => {
      const media = it.image
        ? picture(images, it.image, { sizes: '(min-width: 1024px) 380px, (min-width: 640px) 46vw, 92vw' })
        : `<span class="card__missing mono">${esc(it.imageNeeded)}</span>`;
      return `<li>
      <a class="card" href="#${it.slug}" aria-haspopup="dialog" aria-describedby="${it.slug}-desc" data-popup="${it.slug}">
        <div class="card__media${images[it.image]?.ext === 'jpg' ? ' card__media--photo' : ''}">
          ${media}
          <span class="card__index mono" aria-hidden="true">${esc(it.index)}</span>
          <span class="card__panel" aria-hidden="true">
            <span class="card__panel-title">${esc(it.name)}</span>
            <span class="card__panel-desc">${esc(it.desc)}</span>
          </span>
        </div>
        <div class="card__body">
          <h3 class="card__title">${esc(it.name)}</h3>
          <p class="card__desc" id="${it.slug}-desc">${esc(it.desc)}</p>
        </div>
      </a>
    </li>`;
    })
    .join('');
  return `<section class="section projects reveal" id="projects" aria-labelledby="projects-title">
  <div class="container">
    ${label(p.label)}
    <div class="section-head">
      <h2 class="display display--section" id="projects-title">${esc(p.heading)}</h2>
      <p class="section-head__sub">${esc(p.subheading)}</p>
    </div>
    <ul class="cards">${cards}</ul>
  </div>
</section>`;
}

function innovation(site, images) {
  const n = site.innovation;
  const stats = n.stats
    .map((s) => `<li class="stat"><span class="stat__value" aria-hidden="true">${esc(s.value)}</span><span class="stat__caption mono" aria-hidden="true">${esc(s.caption)}</span><span class="sr-only">${esc(s.sr)}</span></li>`)
    .join('');
  return `<section class="section innovation reveal" id="innovation" aria-labelledby="innovation-title">
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
        ${gridDecor('innovation')}
        ${frame(images, n.image, { sizes: '(min-width: 1024px) 560px, 92vw', annotation: n.annotation, cls: 'frame--chart' })}
      </div>
    </div>
  </div>
</section>`;
}

function contact(site) {
  const c = site.contact;
  const refs = site.flags.SHOW_REFERENCES
    ? `<div class="references"><h3 class="mono references__title">References</h3><ul>${c.references
        .map((r) => `<li><strong>${esc(r.name)}</strong>, ${esc(r.role)} · <a href="mailto:${esc(r.email)}">${esc(r.email)}</a></li>`)
        .join('')}</ul></div>`
    : '';
  return `<section class="section contact reveal" id="contact" aria-labelledby="contact-title">
  <div class="decor-grid" aria-hidden="true"></div>
  <div class="container">
    ${label(c.label)}
    <h2 class="display" id="contact-title">${esc(c.heading)}</h2>
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
