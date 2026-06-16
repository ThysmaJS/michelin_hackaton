// Smooth-scroll helpers used by the nav and CTA buttons.

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
