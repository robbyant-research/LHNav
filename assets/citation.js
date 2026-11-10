'use strict';
const citation = document.querySelector('#citation pre');

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
  }
  const buffer = document.createElement('textarea');
  buffer.className = 'cite-buffer';
  buffer.value = text;
  document.body.appendChild(buffer);
  buffer.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch {}
  buffer.remove();
  return copied;
}

document.querySelector('.cite-copy')?.addEventListener('click', async event => {
  const button = event.currentTarget;
  if (!citation) return;
  const copied = await copyText(citation.textContent.trim());
  button.textContent = copied ? 'Copied' : 'Select text';
  setTimeout(() => { button.textContent = 'Copy BibTeX'; }, 1600);
});
