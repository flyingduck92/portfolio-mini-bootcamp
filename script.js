/* ============================================================
   SOFT TECH PORTFOLIO — script.js
   ============================================================ */
'use strict';

/* ── Helpers ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── 1. Theme toggle ─────────────────────────────────────── */
(function initTheme() {
  const root = document.documentElement;
  const btn = $('#theme-toggle');
  const icon = btn.querySelector('.theme-icon');
  const stored = localStorage.getItem('theme');

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', theme);
  };

  // Apply stored or system preference
  if (stored) {
    applyTheme(stored);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  btn.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });
})();

/* ── 2. Floating pill nav — scroll behaviour ─────────────── */
(function initNav() {
  const nav = $('#pill-nav');
  const links = $$('.nav-link');
  const sections = $$('section[id]');

  // Compact on scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Active link on scroll (IntersectionObserver)
  // target all named sections including new featured + stack
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach((l) => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach((s) => io.observe(s));
})();

/* ── 3. GSAP Hero entrance animation ─────────────────────── */
(function initHeroAnimation() {
  // Wait for GSAP to load (it's deferred)
  const run = () => {
    if (typeof gsap === 'undefined') {
      // Fallback: show elements without animation
      $$('#hero-eyebrow, #hero-line-1, #hero-line-2, #hero-sub, #hero-cta').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.4)', duration: 0.75 } });

    tl.to('#hero-eyebrow', { opacity: 1, y: 0, duration: 0.5 })
      .to('#hero-line-1', { opacity: 1, y: 0 }, '-=0.35')
      .to('#hero-line-2', { opacity: 1, y: 0 }, '-=0.55')
      .to('#hero-sub', { opacity: 1, duration: 0.6 }, '-=0.4')
      .to('#hero-cta', { opacity: 1, duration: 0.5 }, '-=0.3');

    // Parallax blobs on scroll
    gsap.to('.blob-1', {
      y: -80,
      scrollTrigger: { trigger: '.hero', scrub: 1.5 },
    });
    gsap.to('.blob-2', {
      y: -50,
      scrollTrigger: { trigger: '.hero', scrub: 2 },
    });
  };

  // GSAP is deferred, so wait for window load
  if (document.readyState === 'complete') {
    run();
  } else {
    window.addEventListener('load', run);
  }
})();

/* ── 4. Spotlight hover effect on Vault cards ────────────── */
(function initSpotlight() {
  $$('.spotlight-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--cx', `${x}%`);
      card.style.setProperty('--cy', `${y}%`);
    });
  });
})();

/* ── 5. Crossfade Carousel ───────────────────────────────── */
(function initCarousel() {
  const slides = $$('.carousel-slide');
  const dots = $$('.dot');
  const prev = $('#carousel-prev');
  const next = $('#carousel-next');

  // Bail if carousel was removed from the page
  if (!prev || !next || slides.length === 0) return;

  let current = 0;
  let timer;

  const goTo = (idx) => {
    slides[current].classList.remove('active');
    slides[current].setAttribute('aria-hidden', 'true');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (idx + slides.length) % slides.length;

    slides[current].classList.add('active');
    slides[current].setAttribute('aria-hidden', 'false');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  };

  const startAuto = () => {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4500);
  };

  prev.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  next.addEventListener('click', () => { goTo(current + 1); startAuto(); });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  // Keyboard support
  const carousel = $('#vault-carousel');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); }
  });

  // Touch / swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { goTo(dx < 0 ? current + 1 : current - 1); startAuto(); }
  }, { passive: true });

  startAuto();
})();

/* ── 6. Shimmer Accordion ────────────────────────────────── */
(function initAccordion() {
  const items = $$('.accordion-item');

  items.forEach((item) => {
    const btn = item.querySelector('.accordion-trigger');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach((i) => {
        i.classList.remove('open');
        i.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');

        // Shimmer sweep
        item.classList.remove('shimmer-run');
        void item.offsetWidth;
        item.classList.add('shimmer-run');
        setTimeout(() => item.classList.remove('shimmer-run'), 700);
      }
    });
  });
})();


/* ── 7. Scroll-reveal for sections ──────────────────────── */
(function initReveal() {
  const targets = $$('.vault-card, .featured-card, .stack-group, .section-header, .accordion-item, .contact-inner > *');
  targets.forEach((el) => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  targets.forEach((el) => io.observe(el));
})();

/* ── 8. Contact form ─────────────────────────────────────── */
(function initContactForm() {
  const form = $('#contact-form');
  const feedback = $('#form-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#form-name').value.trim();
    const email = $('#form-email').value.trim();
    const message = $('#form-message').value.trim();

    if (!name || !email || !message) {
      feedback.textContent = '⚠️ Please fill in all fields.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.textContent = '⚠️ Please enter a valid email address.';
      return;
    }

    // Simulate async send
    const btn = $('#form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      feedback.textContent = '✦ Message sent! I\'ll be in touch soon.';
      btn.textContent = 'Send message ✦';
      btn.disabled = false;
      setTimeout(() => (feedback.textContent = ''), 5000);
    }, 1200);
  });
})();

/* ── 9. Elastic squish feedback (CSS :active is enough,
        but we add a JS class for extra fidelity) ────────── */
(function initSquish() {
  $$('.squish').forEach((el) => {
    el.addEventListener('pointerdown', () => {
      el.style.transform = 'scale(0.92)';
      el.style.transition = 'transform 120ms cubic-bezier(0.34,1.56,0.64,1)';
    });
    el.addEventListener('pointerup pointercancel', () => {
      el.style.transform = '';
      // Let CSS spring back
    });
    el.addEventListener('pointerup', () => {
      el.style.transform = '';
    });
    el.addEventListener('pointercancel', () => {
      el.style.transform = '';
    });
  });
})();
