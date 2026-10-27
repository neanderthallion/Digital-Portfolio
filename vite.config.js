import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { render } from './scripts/render.js';

const load = (f) => JSON.parse(readFileSync(new URL(f, import.meta.url), 'utf8'));

// Injects the rendered site into index.html. Runs as a "post" transform so Vite
// leaves the relative img/ paths alone (they are copied from public/ as-is).
function siteContent() {
  return {
    name: 'site-content',
    configureServer(server) {
      server.watcher.add(['content/site.json', 'content/images.json']);
      server.watcher.on('change', (f) => {
        if (/content[\\/].+\.json$/.test(f)) server.ws.send({ type: 'full-reload' });
      });
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const { head, body } = render(load('./content/site.json'), load('./content/images.json'));
        return html.replace('<!--site:head-->', head).replace('<!--site:body-->', body);
      },
    },
  };
}

export default defineConfig({
  base: './', // works on GitHub Pages under any repo path
  plugins: [siteContent()],
  build: { assetsInlineLimit: 0 },
});
