'use strict';
const figureDialog = document.getElementById('figure-dialog');
const figureImage = figureDialog?.querySelector('.figure-body img');

function closeFigure() {
  if (!figureDialog) return;
  if (typeof figureDialog.close === 'function') figureDialog.close();
  else figureDialog.removeAttribute('open');
}

document.querySelectorAll('[data-figure]').forEach(button => {
  button.addEventListener('click', () => {
    if (!figureDialog || !figureImage) return;
    figureImage.src = button.dataset.figure;
    figureImage.alt = button.querySelector('img')?.alt || 'Figure';
    if (figureDialog.open) return;
    if (typeof figureDialog.showModal === 'function') figureDialog.showModal();
    else figureDialog.setAttribute('open', '');
  });
});

figureDialog?.querySelector('.figure-close')?.addEventListener('click', closeFigure);

figureDialog?.addEventListener('click', event => {
  if (event.target === figureDialog) closeFigure();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && figureDialog?.open) closeFigure();
});