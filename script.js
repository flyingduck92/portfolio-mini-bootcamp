/* ============================================================
   SOFT TECH PORTFOLIO — script.js
   ============================================================ */
'use strict';

/* ── Helpers ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// Prevent browser from automatically restoring scroll position on refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

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
        links.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach((s) => io.observe(s));
})();

/* ── 3. GSAP Hero entrance animation ─────────────────────── */
(function initHeroAnimation() {
  const run = () => {
    if (typeof gsap === 'undefined') return;

    // Custom Text Scramble Effect for Hero Eyebrow
    const eyebrow = $('#hero-eyebrow');
    const originalEyebrow = eyebrow.textContent;
    const scramble = () => {
      const chars = '!<>-_\\/[]{}—=+*^?#________';
      let frame = 0;
      let duration = 35; 
      const loop = () => {
        let output = '';
        for (let i = 0; i < originalEyebrow.length; i++) {
          if (originalEyebrow[i] === ' ') {
            output += ' ';
            continue;
          }
          if (frame >= duration || Math.random() < frame / duration) {
            output += originalEyebrow[i];
          } else {
            output += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        eyebrow.textContent = output;
        if (frame < duration) {
          frame++;
          requestAnimationFrame(loop);
        } else {
          eyebrow.textContent = originalEyebrow;
        }
      };
      loop();
    };

    // Start scramble slightly after page load
    setTimeout(scramble, 300);

    const tl = gsap.timeline({ defaults: { ease: 'elastic.out(1, 0.6)', duration: 1.5 } });

    tl.from(eyebrow, { opacity: 0, y: 30, duration: 0.8 })
      .from('.hero-line', { opacity: 0, y: 40, stagger: 0.15 }, '-=0.7')
      .from('#hero-sub', { opacity: 0, y: 20, duration: 1.2 }, '-=1')
      .from('#hero-cta', { opacity: 0, scale: 0.95, duration: 1 }, '-=1');

    // Parallax blobs
    gsap.to('.blob-1', { y: -120, scrollTrigger: { trigger: '.hero', scrub: 1 } });
    gsap.to('.blob-2', { y: -80, scrollTrigger: { trigger: '.hero', scrub: 1.5 } });
    gsap.to('.blob-3', { y: -40, scrollTrigger: { trigger: '.hero', scrub: 2 } });
  };

  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run);
})();

/* ── 4. Spotlight hover effect on cards ──────────────────── */
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

  // Close accordion if clicked outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.accordion-item')) {
      items.forEach((i) => {
        i.classList.remove('open');
        i.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });
    }
  });
})();

/* ── 7. Scroll-reveal (Intersection Observer) ────────────── */
(function initReveal() {
  const targets = $$('.vault-card, .featured-card, .stack-group, .section-header, .accordion-item, .contact-inner > *');
  targets.forEach((el) => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
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

    const btn = $('#form-submit');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Send email directly via FormSubmit.co
    fetch('https://formsubmit.co/ajax/sektiwicaksono92@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `New contact from ${name}`,
        name: name,
        email: email,
        message: message
      })
    })
      .then(response => response.json())
      .then(data => {
        form.reset();
        feedback.textContent = '✦ Message sent directly to my inbox! I\'ll be in touch.';
        btn.textContent = originalText;
        btn.disabled = false;
        setTimeout(() => (feedback.textContent = ''), 6000);
      })
      .catch(error => {
        console.error('Error sending email:', error);
        feedback.textContent = '⚠️ Oops, something went wrong. Please try again later.';
        btn.textContent = originalText;
        btn.disabled = false;
      });
  });
})();

/* ── 9. Magnetic & Squish buttons ────────────────────────── */
(function initMagneticButtons() {
  $$('.squish').forEach((el) => {
    // Magnetic pull
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const h = rect.width / 2;
      const v = rect.height / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - v;
      // Pull strength factor (0.25)
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.3}px) scale(1.05)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 400ms var(--ease-spring)';
      setTimeout(() => { el.style.transition = ''; }, 400);
    });

    // Squish on click
    el.addEventListener('pointerdown', () => {
      el.style.transform = 'scale(0.92)';
      el.style.transition = 'transform 120ms cubic-bezier(0.34,1.56,0.64,1)';
    });
    el.addEventListener('pointerup', () => el.style.transform = '');
    el.addEventListener('pointercancel', () => el.style.transform = '');
  });
})();
