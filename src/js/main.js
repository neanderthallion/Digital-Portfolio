import { initNav } from './nav.js';
import { initModal, watchImages } from './modal.js';
import { initMoreProjects } from './projects.js';

// Section reveal: fade up once per section
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) return items.forEach((el) => el.classList.add('is-in'));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }),
    { rootMargin: '0px 0px -10% 0px' }
  );
  items.forEach((el) => io.observe(el));
}

initReveal();
watchImages();
initNav();
initMoreProjects();
initModal();
