// Light / dark theme switch. The initial theme is set in index.html before
// first paint (saved choice, else the device setting); this wires the button.

const KEY = 'theme';
const COLORS = { light: '#F4F4F1', dark: '#0A0A0A' };
const root = document.documentElement;
const os = window.matchMedia('(prefers-color-scheme: light)');

function saved() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

function apply(theme, btn) {
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLORS[theme]);
  const next = theme === 'light' ? 'dark' : 'light';
  btn.setAttribute('aria-label', `Switch to ${next} theme`);
}

export function initTheme() {
  const btn = document.querySelector('.topbar__theme');
  if (!btn) return;
  apply(root.dataset.theme === 'light' ? 'light' : 'dark', btn);

  btn.addEventListener('click', () => {
    const theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    apply(theme, btn);
    try { localStorage.setItem(KEY, theme); } catch { /* private mode: choice lasts this visit */ }
  });

  // Follow the device setting until the visitor makes a choice
  os.addEventListener('change', (e) => {
    const s = saved();
    if (s !== 'light' && s !== 'dark') apply(e.matches ? 'light' : 'dark', btn);
  });
}
