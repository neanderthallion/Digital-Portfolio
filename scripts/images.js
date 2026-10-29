// Builds optimised web copies of DP_Assets/Images into public/img and writes
// content/images.json (dimensions + srcset widths) for the renderer.
// Run once, and again whenever a source image changes: `npm run images`.
// Pass job names to rebuild only those and keep the rest of the manifest:
// `npm run images -- slumbering`.
import sharp from 'sharp';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'DP_Assets/Images';
const OUT = 'public/img';
const WIDTHS = [480, 960, 1440];
const MAX_BYTES = 500 * 1024;

// kind: 'photo' → JPG fallback, 'chart' → PNG fallback (never recoloured or lossy-mangled)
// extract: crop box in source pixels; pad: extend canvas (white) to reach 4:3
const JOBS = [
  { out: 'portrait', src: 'Portrait.jpg', kind: 'photo' },
  { out: 'sample-distribution', src: 'Sample Distribution.jpg', kind: 'chart',
    extract: { left: 21, top: 66, width: 1240, height: 744 } }, // trim the white margin
  { out: 'sparkmind', src: 'Sparkmind.jpg', kind: 'photo' },
  { out: 'reinvintech', src: 'REINVINTECH.JPG', kind: 'photo' },
  { out: 'bewellnest', src: 'BewellNest.jpg', kind: 'photo' },
  { out: 'slumbering', src: 'Slumbering.jpg', kind: 'photo',
    extract: { left: 0, top: 111, width: 1280, height: 638 } }, // drop white bands
  { out: 'gesturegame', src: 'Gesturegame.jpg', kind: 'photo'},
  { out: 'gesturegame-card', src: 'Gesturegame.jpg', kind: 'photo',
    extract: { left: 1322, top: 46, width: 596, height: 447 } }, // webcam view only
  { out: 'insomnia-shap', src: 'Insomnia.png', kind: 'chart' },
  { out: 'insomnia-shap-card', src: 'Insomnia.png', kind: 'chart',
    extract: { left: 0, top: 82, width: 1040, height: 376 }, padTo43: true }, // top-ranked features
  { out: 'petite', src: 'Petite.png', kind: 'chart' }, // full screenshot: normal scaling, not pixel-art
];

async function run() {
  await mkdir(OUT, { recursive: true });
  const only = process.argv.slice(2);
  const unknown = only.filter((o) => !JOBS.some((j) => j.out === o));
  if (unknown.length) throw new Error(`Unknown image job(s): ${unknown.join(', ')}`);
  const manifest = only.length ? JSON.parse(await readFile('content/images.json', 'utf8')) : {};

  for (const job of JOBS.filter((j) => !only.length || only.includes(j.out))) {
    let base = sharp(path.join(SRC, job.src)).rotate(); // honour EXIF orientation
    if (job.extract) base = base.extract(job.extract);
    if (job.padTo43) {
      const { width, height } = job.extract;
      const target = Math.round((width * 3) / 4);
      const pad = Math.max(0, Math.floor((target - height) / 2));
      base = base.extend({ top: pad, bottom: pad, background: '#ffffff' });
    }
    const buf = await base.flatten({ background: '#ffffff' }).toBuffer();
    const meta = await sharp(buf).metadata();

    // Pixel art is tiny: upscale with nearest-neighbour so it stays crisp
    const widths = job.pixelated
      ? [960]
      : WIDTHS.filter((w) => w < meta.width).concat(meta.width <= 1440 ? [meta.width] : [1440]);
    const uniq = [...new Set(widths)].sort((a, b) => a - b);

    for (const w of uniq) {
      const resized = () =>
        sharp(buf).resize({ width: w, kernel: job.pixelated ? 'nearest' : 'lanczos3', withoutEnlargement: !job.pixelated });
      await resized().webp({ quality: job.kind === 'photo' ? 72 : 90 }).toFile(`${OUT}/${job.out}-${w}.webp`);
      if (job.kind === 'photo') {
        await resized().jpeg({ quality: 72, mozjpeg: true }).toFile(`${OUT}/${job.out}-${w}.jpg`);
      } else {
        await resized().png({ compressionLevel: 9, palette: true }).toFile(`${OUT}/${job.out}-${w}.png`);
      }
    }

    const largest = uniq[uniq.length - 1];
    const ext = job.kind === 'photo' ? 'jpg' : 'png';
    for (const w of uniq) {
      for (const e of ['webp', ext]) {
        const { size } = await stat(`${OUT}/${job.out}-${w}.${e}`);
        if (size > MAX_BYTES) throw new Error(`${job.out}-${w}.${e} is ${(size / 1024) | 0} KB (> 500 KB)`);
      }
    }
    manifest[job.out] = {
      ext,
      widths: uniq,
      width: largest,
      height: Math.round((meta.height / meta.width) * largest),
      pixelated: !!job.pixelated,
    };
    console.log(`✓ ${job.out}  ${uniq.join('/')}w`);
  }

  await writeFile('content/images.json', JSON.stringify(manifest, null, 2) + '\n');
}

run().catch((e) => { console.error(e); process.exit(1); });
