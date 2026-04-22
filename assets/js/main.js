/* =============================================
   Matra - main.js
   ============================================= */

(() => {
  'use strict';

  /* 1. Ano no footer */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* 2. Reveal on scroll - adiciona classe .reveal em seções e revela com IntersectionObserver */
  const revealTargets = document.querySelectorAll(
    '.hero__title, .hero__sub, .hero__ctas, .section__title, .section__lead, .pain, .step, .service, .compare, .faq__item, .cta-final__title, .cta-final__sub, .cta-final .btn'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 })
    : null;

  if (io) {
    revealTargets.forEach(el => io.observe(el));
    // Fallback: se por qualquer motivo o IO não disparar, garante visibilidade
    setTimeout(() => {
      revealTargets.forEach(el => {
        if (!el.classList.contains('is-visible')) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 1.5) el.classList.add('is-visible');
        }
      });
    }, 1200);
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* 3. WhatsApp flutuante - aparece quando a seção "como a Matra resolve" entra em tela */
  const waFloat = document.querySelector('.wa-float');
  const trigger = document.getElementById('como-funciona');

  if (waFloat && trigger) {
    const toggleFloat = () => {
      const triggerTop = trigger.getBoundingClientRect().top;
      if (triggerTop < window.innerHeight * 0.85) waFloat.classList.add('is-visible');
      else waFloat.classList.remove('is-visible');
    };
    toggleFloat();
    window.addEventListener('scroll', toggleFloat, { passive: true });
    window.addEventListener('resize', toggleFloat, { passive: true });
  }

  /* 4. Tracking - envia evento pro dataLayer (GTM) em qualquer elemento [data-track] */
  window.dataLayer = window.dataLayer || [];

  document.querySelectorAll('[data-track]').forEach(el => {
    el.addEventListener('click', () => {
      const payload = {
        event: el.dataset.track,
        section: el.dataset.section || null,
        label: el.dataset.label || null,
        href: el.getAttribute('href') || null
      };
      window.dataLayer.push(payload);
    });
  });

  /* 5. Scroll suave extra (fallback para browsers sem scroll-behavior) */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // fecha detalhes abertos do faq ao navegar
      history.replaceState(null, '', id);
    });
  });

})();
