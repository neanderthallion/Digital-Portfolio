// Checks that every external link in the built page responds 2xx (npm run build first).
import { readFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
const urls = [...new Set([...html.matchAll(/href="(https?:[^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&')))]
  .filter((u) => !/fonts\.(googleapis|gstatic)\.com/.test(u));

const broken = [];
await Promise.all(
  urls.map(async (url) => {
    try {
      const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 link-check' } });
      if (!res.ok) broken.push(`${res.status}  ${url}`);
      else if (res.url.includes('accounts.google.com')) broken.push(`LOGIN  ${url}  (not shared publicly)`);
    } catch (e) {
      broken.push(`ERR  ${url}  (${e.cause?.code || e.name})`);
    }
  })
);

console.log(`Checked ${urls.length} external links`);
if (broken.length) {
  console.error(`✗ Broken links:\n  ${broken.join('\n  ')}`);
  process.exit(1);
}
console.log('✓ All links respond');
