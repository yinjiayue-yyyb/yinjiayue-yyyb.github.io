document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const pubCards = document.querySelectorAll('.pub-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const value = button.dataset.filter;
      pubCards.forEach(card => {
        const kind = card.dataset.kind;
        const show = value === 'all' || kind === value;
        card.style.display = show ? 'grid' : 'none';
      });
    });
  });

  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => revealObserver.observe(el));

  const setupCarousel = (carousel) => {
    const slides = carousel.querySelector('.slides');
    const items = Array.from(carousel.querySelectorAll('.slide'));
    const dotsWrap = carousel.querySelector('.dots');
    const prevBtn = carousel.querySelector('[data-prev]');
    const nextBtn = carousel.querySelector('[data-next]');

    // The staggered layout intentionally uses only one triangle button per carousel.
    // Therefore prevBtn and nextBtn are optional; the carousel should still initialize.
    if (!slides || !items.length || !dotsWrap) return;

    let index = 0;
    let auto = null;
    const interval = Number(carousel.dataset.autoplay || 4800);
    const autoDirection = nextBtn ? 1 : -1;

    const updateDots = () => {
      dotsWrap.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    };

    const goTo = (i) => {
      index = (i + items.length) % items.length;
      slides.style.transform = `translateX(${-index * 100}%)`;
      updateDots();
    };

    dotsWrap.innerHTML = '';
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(index + 1));

    if (items.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      dotsWrap.style.display = 'none';
      return;
    }

    const startAuto = () => {
      if (interval > 0 && !auto) {
        auto = setInterval(() => goTo(index + autoDirection), interval);
      }
    };

    const stopAuto = () => {
      if (auto) {
        clearInterval(auto);
        auto = null;
      }
    };

    startAuto();
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('focusin', stopAuto);
    carousel.addEventListener('focusout', startAuto);
  };

  document.querySelectorAll('[data-carousel]').forEach(setupCarousel);
});
