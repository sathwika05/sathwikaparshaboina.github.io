/* ══════════════════════════════════════════════════════════════
   Motion + interaction.
   Animation supports the page; it never becomes the page.
   ══════════════════════════════════════════════════════════════ */
(function () {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HAS_GSAP = typeof gsap !== 'undefined';
  const HAS_ST = HAS_GSAP && typeof ScrollTrigger !== 'undefined';

  if (HAS_ST) gsap.registerPlugin(ScrollTrigger);

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── smooth scroll ──────────────────────────────────────── */
  let lenis = null;
  if (!REDUCED && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    if (HAS_GSAP) {
      if (HAS_ST) lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70, duration: 1.2 });
      });
    });
  }

  /* ── counters ───────────────────────────────────────────── */
  function countUp() {
    document.querySelectorAll('.num').forEach((el) => {
      const to = parseFloat(el.dataset.to);
      const pre = el.dataset.prefix || '';
      const suf = el.dataset.suffix || '';
      if (!HAS_GSAP || REDUCED) { el.textContent = pre + to + suf; return; }
      const o = { v: 0 };
      gsap.to(o, {
        v: to, duration: 1.6, ease: 'power2.out', delay: 0.25,
        onUpdate: () => { el.textContent = pre + Math.round(o.v) + suf; }
      });
    });
  }

  /* ── hero entrance ──────────────────────────────────────── */
  function heroIn() {
    if (!HAS_GSAP || REDUCED) {
      document.querySelectorAll('[data-boot]').forEach((n) => (n.style.opacity = 1));
      countUp();
      return;
    }
    gsap.timeline()
      /* name first, then the positioning it qualifies */
      .fromTo('[data-boot="1"],[data-boot="2"]',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0)
      /* y:0 is required — GSAP reads the CSS translateY(105%) as a pixel `y`,
         which would otherwise survive the yPercent tween and cancel it out. */
      .fromTo('.hero__title .line>span,.hero__tagline .line>span',
        { yPercent: 110, y: 0 },
        { yPercent: 0, y: 0, duration: 1.1, stagger: 0.09, ease: 'expo.out' }, 0.16)
      /* the portrait resolves alongside the headline, not after it */
      .fromTo('[data-boot="5"]',
        { opacity: 0, y: 26, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' }, 0.28)
      .fromTo('[data-boot="3"]',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.6)
      .fromTo('[data-boot="4"]',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.72)
      .fromTo('[data-boot="6"]',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.84)
      .fromTo('.metric',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power2.out' }, 0.9);

    countUp();
  }

  /* ── boot ───────────────────────────────────────────────── */
  const boot = document.getElementById('boot');
  if (boot && !REDUCED && HAS_GSAP) {
    document.body.classList.add('is-booting');
    if (lenis) lenis.stop();
    const c = { v: 0 };
    const count = document.getElementById('bootCount');
    const bar = document.getElementById('bootBar');
    gsap.to(c, {
      v: 100, duration: 1.25, ease: 'power2.inOut',
      onUpdate: () => {
        const n = Math.round(c.v);
        count.textContent = String(n).padStart(3, '0');
        bar.style.width = n + '%';
      },
      onComplete: () => {
        gsap.to(boot, {
          yPercent: -101, duration: 0.85, ease: 'expo.inOut',
          onStart: () => {
            document.body.classList.remove('is-booting');
            if (lenis) lenis.start();
          },
          onComplete: () => boot.remove()
        });
        heroIn();
      }
    });
  } else {
    if (boot) boot.remove();
    document.body.classList.remove('is-booting');
    heroIn();
  }

  /* ── contact form ───────────────────────────────────────
     A static site has no backend of its own, so submissions are
     POSTed to Web3Forms, which delivers them to my inbox. The key is
     public by design — it only authorises sending to that one
     address and grants no read access.                             */
  const FORM_ENDPOINT = 'https://api.web3forms.com/submit';
  const FORM_KEY = '1334bb61-7761-487c-9ca0-bb28f9049f32';
  const FALLBACK_EMAIL = 'sathwikap25@gmail.com';
  const form = document.getElementById('form');
  if (form) {
    const status = document.getElementById('formStatus');
    const fields = [...form.querySelectorAll('.field')];

    const problem = (input) => {
      const v = input.value.trim();
      if (!v) {
        return input.type === 'email' ? 'Add your email so I can reply.'
          : input.tagName === 'TEXTAREA' ? 'Add a line or two about it.'
          : 'Add your name.';
      }
      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
        return 'That email address looks incomplete.';
      }
      return '';
    };

    const check = (field) => {
      const input = field.querySelector('input,textarea');
      const err = problem(input);
      field.classList.toggle('bad', !!err);
      field.querySelector('[data-err]').textContent = err;
      return !err;
    };

    fields.forEach((field) => {
      const input = field.querySelector('input,textarea');
      input.addEventListener('blur', () => { if (input.value.trim()) check(field); });
      input.addEventListener('input', () => {
        if (field.classList.contains('bad')) check(field);
      });
    });

    const send = form.querySelector('.form__send');
    const sendLabel = send.textContent;
    /* form.elements, not form.name — HTMLFormElement.name is the form's
       own attribute and shadows the input of the same name. */
    const val = (n) => form.elements[n].value.trim();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      status.classList.remove('is-bad');

      const results = fields.map(check);
      const firstBad = fields[results.indexOf(false)];
      if (firstBad) {
        firstBad.querySelector('input,textarea').focus();
        return;
      }

      send.disabled = true;
      send.textContent = 'Sending…';

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: FORM_KEY,
            subject: 'Portfolio enquiry from ' + val('name'),
            name: val('name'),
            email: val('email'),
            message: val('message')
          })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) throw new Error(data.message || 'Send failed');

        form.reset();
        fields.forEach((f) => {
          f.classList.remove('bad');
          f.querySelector('[data-err]').textContent = '';
        });
        status.textContent = 'Thanks — I\'ll get back to you shortly.';
      } catch (err) {
        /* Never claim a success we cannot verify — give them a way through. */
        status.classList.add('is-bad');
        status.textContent = 'Could not send. Please email ' + FALLBACK_EMAIL + ' directly.';
      } finally {
        send.disabled = false;
        send.textContent = sendLabel;
      }
    });
  }

  if (!HAS_ST || REDUCED) {
    document.querySelectorAll('[data-fade],[data-card],[data-grp]')
      .forEach((n) => (n.style.opacity = 1));
    return;
  }

  /* ── nav state + read progress ──────────────────────────── */
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 40, end: 99999,
    onToggle: (s) => nav.classList.toggle('stuck', s.isActive)
  });
  gsap.to('#progress', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
  });

  /* ── scroll reveals ─────────────────────────────────────── */
  const reveal = (sel, vars, start) =>
    gsap.utils.toArray(sel).forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: vars.y },
        {
          opacity: 1, y: 0, duration: vars.d, delay: i * (vars.stagger || 0),
          ease: 'power3.out',
          scrollTrigger: { trigger: vars.groupTrigger || el, start: start }
        });
    });

  reveal('[data-grp]', { y: 34, d: 0.8, stagger: 0.05 }, 'top 88%');
  reveal('[data-card]', { y: 38, d: 0.85, stagger: 0.06 }, 'top 88%');
  reveal('[data-fade]', { y: 20, d: 0.75 }, 'top 90%');
  reveal('.sec-title', { y: 28, d: 0.85 }, 'top 88%');
  reveal('.eyebrow', { y: 14, d: 0.6 }, 'top 92%');
  reveal('.contact__lead', { y: 28, d: 0.85 }, 'top 88%');

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
