'use strict';

(() => {
  const catalogue = document.querySelector('#gallery-index');
  const catalogueTitle = catalogue.querySelector('#gallery-index-title');
  const catalogueGrid = catalogue.querySelector('.gallery-index-grid');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  catalogue.querySelector('.gallery-index-close').addEventListener('click', () => catalogue.close());
  catalogue.addEventListener('click', event => {
    if (event.target !== catalogue) return;
    const bounds = catalogue.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) catalogue.close();
  });

  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const track = gallery.querySelector('.gallery-track');
    const slides = [...track.children];
    const previous = gallery.querySelector('[data-gallery-prev]');
    const next = gallery.querySelector('[data-gallery-next]');
    const status = gallery.querySelector('[data-gallery-status]');
    const pages = gallery.querySelector('.gallery-pages');
    const instruction = gallery.querySelector('[data-gallery-instruction]');
    let active = 0;
    let scrollTimer;

    const title = index => slides[index].dataset.galleryTitle;
    const position = index => slides[index].offsetLeft + slides[index].offsetWidth / 2 - track.clientWidth / 2;

    function activate(index, play = false) {
      active = index;
      gallery.dataset.galleryIndex = String(index);
      if (instruction && instruction.dataset.galleryInstructionIndex !== String(index)) {
        const source = slides[index].querySelector('template[data-gallery-instruction-source]');
        instruction.replaceChildren(source.content.cloneNode(true));
        instruction.dataset.galleryInstructionIndex = String(index);
      }
      slides.forEach((slide, slideIndex) => {
        const selected = slideIndex === index;
        slide.classList.toggle('is-active', selected);
        slide.inert = !selected;
        slide.setAttribute('aria-hidden', String(!selected));
        if (!selected) slide.querySelectorAll('video').forEach(video => {
          if (!video.paused) video.pause();
        });
      });
      previous.disabled = index === 0;
      next.disabled = index === slides.length - 1;
      status.textContent = `${index + 1} / ${slides.length}`;
      status.setAttribute('aria-label', `${title(index)} · ${index + 1} / ${slides.length}`);
      [...pages.children].forEach((button, pageIndex) => {
        if (pageIndex === index) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      });
      const videos = slides[index].querySelectorAll('video');
      if (play && videos.length === 1) videos[0].play().catch(() => {});
    }

    function goTo(index, play = false, behavior = reducedMotion.matches ? 'instant' : 'smooth') {
      index = Math.max(0, Math.min(slides.length - 1, index));
      activate(index, play);
      track.scrollTo({left: position(index), behavior});
    }

    function nearest() {
      let index = 0;
      let distance = Infinity;
      slides.forEach((slide, slideIndex) => {
        const candidate = Math.abs(position(slideIndex) - track.scrollLeft);
        if (candidate < distance) {
          distance = candidate;
          index = slideIndex;
        }
      });
      if (index !== active) activate(index);
    }

    previous.addEventListener('click', () => goTo(active - 1, true));
    next.addEventListener('click', () => goTo(active + 1, true));
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(nearest, 140);
    }, {passive: true});
    track.addEventListener('keydown', event => {
      if (event.target !== track) return;
      const destinations = {ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: slides.length - 1};
      if (!(event.key in destinations)) return;
      event.preventDefault();
      goTo(destinations[event.key]);
    });
    track.addEventListener('click', event => {
      const index = slides.findIndex(slide => {
        const bounds = slide.getBoundingClientRect();
        return event.clientX >= bounds.left && event.clientX <= bounds.right &&
          event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      });
      if (index >= 0 && index !== active) goTo(index, true);
    });

    slides.forEach((slide, index) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${title(index)}: ${index + 1} of ${slides.length}`);
      if (slides.length > 8) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'gallery-page';
      button.setAttribute('aria-label', `Show ${title(index)}`);
      button.addEventListener('click', () => goTo(index, true));
      pages.appendChild(button);
    });

    gallery.querySelector('[data-gallery-all]').addEventListener('click', () => {
      document.querySelectorAll('video').forEach(video => {
        if (!video.paused) video.pause();
      });
      catalogueTitle.textContent = gallery.getAttribute('aria-label');
      catalogueGrid.replaceChildren();
      slides.forEach((slide, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'gallery-index-item';
        button.dataset.galleryTarget = String(index);
        if (index === active) button.setAttribute('aria-current', 'true');
        const image = document.createElement('img');
        image.src = slide.querySelector('video').poster;
        image.alt = '';
        image.loading = 'lazy';
        const label = document.createElement('strong');
        label.textContent = title(index);
        button.append(image, label);
        if (slide.dataset.galleryDescription) {
          const detail = document.createElement('span');
          detail.textContent = slide.dataset.galleryDescription;
          button.appendChild(detail);
        }
        button.addEventListener('click', () => {
          catalogue.close();
          goTo(index, true, 'instant');
          track.focus({preventScroll: true});
        });
        catalogueGrid.appendChild(button);
      });
      catalogue.showModal();
    });

    activate(0);
    new ResizeObserver(() => goTo(active, false, 'instant')).observe(track);
  });
})();
