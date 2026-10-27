// axe-core accessibility run against the built site (npm run build first).
// Checks the page and every pop-up, at desktop and mobile widths.
import puppeteer from 'puppeteer-core';
import { createServer } from 'vite';
import { readFileSync, existsSync } from 'node:fs';

const CHROME = process.env.CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(existsSync);

const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const site = JSON.parse(readFileSync('content/site.json', 'utf8'));
const slugs = site.popups.map((p) => p.slug);

const server = await createServer({ root: 'dist', configFile: false, server: { port: 4174 }, logLevel: 'silent' });
await server.listen();
const base = 'http://localhost:4174/';

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
let failures = 0;

async function audit(label) {
  await page.evaluate(axeSource);
  const { violations } = await page.evaluate(() =>
    window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] })
  );
  for (const v of violations) {
    failures++;
    console.error(`✗ [${label}] ${v.id}: ${v.help}`);
    v.nodes.slice(0, 3).forEach((n) => console.error(`    ${n.target.join(' ')}`));
  }
}

for (const [w, h] of [[1280, 800], [375, 740]]) {
  await page.setViewport({ width: w, height: h });
  await page.goto(base, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in')));
  await new Promise((r) => setTimeout(r, 600)); // let the hero fade-in finish
  await audit(`page ${w}px`);
  for (const slug of slugs) {
    await page.goto(`${base}#${slug}`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 400));
    await audit(`#${slug} ${w}px`);
  }
}

await browser.close();
await server.close();
if (failures) { console.error(`\n${failures} accessibility violation(s)`); process.exit(1); }
console.log('✓ axe: 0 violations');
