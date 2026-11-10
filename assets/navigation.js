'use strict';
const sidebar = document.querySelector('.section-sidebar');
const toggle = document.querySelector('.sidebar-toggle');
const links = [...sidebar.querySelectorAll('a')];
function closeSidebar() {
  sidebar.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
}
toggle.addEventListener('click', () => {
  toggle.setAttribute('aria-expanded', String(sidebar.classList.toggle('is-open')));
});
links.forEach(link => link.addEventListener('click', closeSidebar));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && sidebar.classList.contains('is-open')) {
    closeSidebar();
    toggle.focus();
  }
});
function updateCurrent() {
  const threshold = Math.min(180, innerHeight * .25);
  let active = -1;
  links.forEach((link, index) => {
    const section = document.querySelector(link.hash);
    if (section && section.getBoundingClientRect().top <= threshold) active = index;
  });
  if (scrollY > 0 && innerHeight + scrollY >= document.documentElement.scrollHeight - 3) {
    active = links.length - 1;
  }
  links.forEach((link, index) => {
    if (index === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
addEventListener('scroll', updateCurrent, {passive: true});
addEventListener('resize', updateCurrent);
updateCurrent();
