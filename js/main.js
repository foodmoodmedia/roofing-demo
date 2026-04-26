/* ===== K&R GENERAL SERVICES — MAIN.JS (SHARED INTERACTIONS) ===== */
(function () {
  'use strict';

  /* ── NAV SCROLL ──────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const stickyCall = document.getElementById('sticky-call');
  const whatsappBtn = document.getElementById('whatsapp-btn');

  const onScroll = () => {
    const scrolled = window.scrollY > 80;
    if (navbar) navbar.classList.toggle('scrolled', scrolled);
    if (stickyCall) stickyCall.classList.toggle('visible', window.scrollY > 400);
    if (whatsappBtn) whatsappBtn.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MOBILE NAV ──────────────────────────────────────────────── */
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileClose = document.getElementById('mobile-close');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  const closeNav = () => {
    if (mobileNav) mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  };
  if (mobileClose) mobileClose.addEventListener('click', closeNav);
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', closeNav));

  /* ── MARK ACTIVE NAV LINK ────────────────────────────────────── */
  const current = window.location.pathname.toLowerCase();
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href && current.endsWith(href.replace('../', '').replace('./', ''))) {
      link.classList.add('active');
    }
  });

  /* ── SCROLL REVEAL ───────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale');
  if (revealEls.length) {
    const rev = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          rev.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => rev.observe(el));
  }

  /* ── BEFORE/AFTER SLIDERS ────────────────────────────────────── */
  document.querySelectorAll('[data-slider]').forEach(wrap => {
    const handle = wrap.querySelector('.ba-handle');
    const divider = wrap.querySelector('.ba-divider');
    const afterImg = wrap.querySelector('.ba-after-img');
    if (!handle || !divider || !afterImg) return;
    let dragging = false;

    const setPos = (x) => {
      const rect = wrap.getBoundingClientRect();
      const pct = Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100));
      handle.style.left = pct + '%';
      divider.style.left = pct + '%';
      afterImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    };

    handle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
    window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
    window.addEventListener('mouseup', () => { dragging = false; });
    handle.addEventListener('touchstart', () => { dragging = true; }, { passive: true });
    window.addEventListener('touchmove', e => { if (dragging && e.touches[0]) setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend', () => { dragging = false; });
  });

  /* ── FAQ ACCORDION ───────────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ── TESTIMONIALS CAROUSEL ───────────────────────────────────── */
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.carousel-dot');
  if (track && dots.length) {
    let current = 0;
    let autoplay;
    const cards = track.querySelectorAll('.t-card');
    const cpp = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const total = () => Math.ceil(cards.length / cpp());

    const show = (page) => {
      current = ((page % total()) + total()) % total();
      const n = cpp();
      cards.forEach((c, i) => {
        const vis = i >= current * n && i < (current + 1) * n;
        c.style.display = vis ? 'block' : 'none';
        if (vis) { c.style.animation = 'none'; c.offsetHeight; c.style.animation = 'fadeSlideUp .4s ease forwards'; }
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const start = () => { autoplay = setInterval(() => show(current + 1), 5000); };
    const stop = () => clearInterval(autoplay);
    dots.forEach(d => d.addEventListener('click', () => { stop(); show(+d.dataset.dot); start(); }));
    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);
    window.addEventListener('resize', () => show(current));
    show(0); start();
  }

  /* ── CITY LIST ───────────────────────────────────────────────── */
  document.querySelectorAll('.city-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.city-item').forEach(c => c.classList.remove('active'));
      item.classList.add('active');
    });
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); } });
  });

  /* ── FORM VALIDATION ─────────────────────────────────────────── */
  const form = document.getElementById('quoteForm');
  if (form) {
    const validate = (field, type) => {
      const fg = field.closest('.field-group');
      if (!fg) return true;
      const v = field.value.trim();
      let valid = true;
      if (type === 'required') valid = v.length > 0;
      else if (type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      else if (type === 'tel') valid = v.replace(/\D/g, '').length >= 10;
      else if (type === 'select') valid = v !== '';
      fg.classList.toggle('has-error', !valid);
      fg.classList.toggle('filled', valid && v.length > 0);
      return valid;
    };

    ['fullName', 'email', 'phone'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => validate(el, id === 'email' ? 'email' : id === 'phone' ? 'tel' : 'required'));
    });
    const svc = document.getElementById('serviceType');
    if (svc) svc.addEventListener('change', () => validate(svc, 'select'));

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const v = [
        validate(document.getElementById('fullName'), 'required'),
        validate(document.getElementById('phone'), 'tel'),
        validate(document.getElementById('email'), 'email'),
        validate(document.getElementById('serviceType'), 'select'),
      ];
      if (v.includes(false)) { form.querySelector('.has-error input, .has-error select')?.focus(); return; }

      const btn = document.getElementById('submitBtn');
      const txt = document.getElementById('submitText');
      const spin = document.getElementById('submitSpinner');
      const success = document.getElementById('formSuccess');
      if (btn) btn.classList.add('loading');
      if (txt) txt.style.display = 'none';
      if (spin) spin.style.display = 'flex';
      if (btn) btn.style.pointerEvents = 'none';

      await new Promise(r => setTimeout(r, 2200));
      form.style.display = 'none';
      if (success) { success.style.display = 'block'; success.style.animation = 'fadeSlideUp .5s ease forwards'; }
      setTimeout(() => {
        if (success) success.style.display = 'none';
        form.style.display = 'block';
        form.reset();
        if (btn) { btn.classList.remove('loading'); btn.style.pointerEvents = ''; }
        if (txt) txt.style.display = 'flex';
        if (spin) spin.style.display = 'none';
        document.querySelectorAll('.field-group').forEach(fg => fg.classList.remove('filled', 'has-error'));
      }, 8000);
    });
  }

  /* ── GALLERY FILTERS ─────────────────────────────────────────── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('[data-category]').forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? 'block' : 'none';
        if (show) { item.style.animation = 'none'; item.offsetHeight; item.style.animation = 'fadeSlideUp .4s ease forwards'; }
      });
    });
  });

  /* ── 3D TILT ON CARDS ────────────────────────────────────────── */
  document.querySelectorAll('.service-card,.ba-card,.t-card,.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(1000px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── STAT COUNTER ────────────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const co = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1800;
        const step = target / (duration / 16);
        let cur = 0;
        const timer = setInterval(() => {
          cur = Math.min(cur + step, target);
          el.textContent = prefix + (Number.isInteger(target) ? Math.floor(cur) : cur.toFixed(1)) + suffix;
          if (cur >= target) clearInterval(timer);
        }, 16);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => co.observe(c));
  }

  /* ── HERO MOUSE PARALLAX ─────────────────────────────────────── */
  const heroSection = document.querySelector('#hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const px = (e.clientX / window.innerWidth - 0.5);
      const py = (e.clientY / window.innerHeight - 0.5);
      const orbs = heroSection.querySelectorAll('.hero-orb');
      orbs.forEach((orb, i) => {
        const depth = (i + 1) * 20;
        orb.style.transform = `translate(${px * depth}px, ${py * depth}px)`;
      });
    });
  }

})();
