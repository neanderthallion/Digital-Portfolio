// Post-build content-integrity gates (README §N "Build checks").
// Runs after `vite build`; exits 1 on any failure.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';

const html = readFileSync('dist/index.html', 'utf8');
const errors = [];

// 1 · No unfinished content
const needed = [...new Set(html.match(/\[?CONTENT NEEDED[^\]<"]*\]?/g) || [])];
if (needed.length) errors.push(`CONTENT NEEDED found in output:\n    ${needed.join('\n    ')}`);

// 2 · Every <img> has alt, width, height
for (const tag of html.match(/<img\b[^>]*>/g) || []) {
  for (const attr of ['alt', 'width', 'height']) {
    if (!new RegExp(`\\s${attr}=`).test(tag)) errors.push(`<img> missing ${attr}: ${tag.slice(0, 90)}…`);
  }
}

// 3 · No published image over 500 KB
for (const f of readdirSync('dist/img')) {
  const kb = statSync(`dist/img/${f}`).size / 1024;
  if (kb > 500) errors.push(`dist/img/${f} is ${kb.toFixed(0)} KB (> 500 KB)`);
}

// 4 · HTML validates
try {
  execSync('npx html-validate dist/index.html', { stdio: 'pipe' });
} catch (e) {
  errors.push(`html-validate:\n${e.stdout?.toString() || e.message}`);
}

// 5 · Teacher emails only when the flag allows it
const site = JSON.parse(readFileSync('content/site.json', 'utf8'));
if (!site.flags.SHOW_REFERENCES && /vinschool\.edu\.vn/.test(html)) errors.push('Teacher emails present while SHOW_REFERENCES = false');

if (errors.length) {
  console.error(`\n✗ Production checks failed (${errors.length}):\n`);
  errors.forEach((e) => console.error(`  • ${e}\n`));
  process.exit(1);
}
console.log('✓ Production checks passed');
