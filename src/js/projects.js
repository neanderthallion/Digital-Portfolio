// "See more projects": cards past the first four are hidden until asked for.
// Without JS every card shows and the button stays hidden.

let setOpen = () => {};

export function initMoreProjects() {
  const button = document.querySelector('.projects__toggle');
  const extra = [...document.querySelectorAll('.cards__more')];
  if (!button || !extra.length) return;

  setOpen = (open, { focus = false } = {}) => {
    extra.forEach((li) => { li.hidden = !open; });
    button.setAttribute('aria-expanded', String(open));
    button.firstChild.textContent = open ? 'Show fewer projects' : 'See more projects';
    button.querySelector('.btn__icon').textContent = open ? '↑' : '↓';
    if (open && focus) extra[0].querySelector('.card')?.focus();
  };

  setOpen(false);
  button.hidden = false;
  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true', { focus: true });
  });
}

export function expandProjects() {
  setOpen(true);
}
