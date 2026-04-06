/* ═══════════════════════════════════════════════════════════════════
   CONSTANCE TOMESSIEN — CINEMATIC PORTFOLIO SCRIPTS
   Effects: Intro splash · Custom cursor · 3D tilt · Magnetic buttons
            Smooth scroll · Particles · Split-text · Parallax · Counter
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── UTILITIES ─────────────────────────────────────────────────── */
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const map   = (v, i1, i2, o1, o2) => o1 + ((v - i1) / (i2 - i1)) * (o2 - o1);


/* ═══════════════════════════════════════════════════════════════════
   1 ▸ THEME TOGGLE
   ═══════════════════════════════════════════════════════════════════ */
const themeBtn   = $('#theme-toggle');
const savedTheme = localStorage.getItem('ct-theme') || 'light';

document.documentElement.setAttribute('data-theme', savedTheme);
if (themeBtn) themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ct-theme', next);
    themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}


/* ═══════════════════════════════════════════════════════════════════
   2 ▸ CINEMATIC INTRO SPLASH
   ═══════════════════════════════════════════════════════════════════ */
const intro = $('#intro');

if (intro) {
  // Begin exit sequence at 3.2s
  setTimeout(() => {
    // Lift letterbox bars
    intro.classList.add('bars-away');

    // After bars finish, split-exit
    setTimeout(() => {
      intro.classList.add('exit');

      // Show nav
      const header = $('.site-header');
      if (header) header.classList.add('nav-visible');

      // Fire hero entrance after panel clears
      setTimeout(() => {
        intro.remove();
        triggerHeroEntrance();
      }, 850);
    }, 900);
  }, 3200);
} else {
  // No intro (subpages) — show nav immediately
  const header = $('.site-header');
  if (header) {
    header.style.transition = 'none';
    header.style.opacity = '1';
    header.style.transform = 'translateY(0)';
    setTimeout(() => {
      header.style.transition = '';
    }, 50);
  }
  triggerHeroEntrance();
}


/* ═══════════════════════════════════════════════════════════════════
   3 ▸ HERO ENTRANCE — staggered line-by-line reveal
   ═══════════════════════════════════════════════════════════════════ */
function triggerHeroEntrance() {
  const eyebrow = $('.hero-eyebrow');
  const lead    = $('.hero .lead');
  const cta     = $('.hero-cta');
  const stats   = $('.hero-stats');
  const card    = $('.hero-card');

  if (eyebrow) eyebrow.classList.add('visible');
  if (card)    card.classList.add('visible');

  // Split h1 words and reveal
  const h1 = $('h1');
  if (h1) splitAndReveal(h1, 0.05);

  setTimeout(() => { if (lead)  lead.classList.add('visible');  }, 400);
  setTimeout(() => { if (cta)   cta.classList.add('visible');   }, 700);
  setTimeout(() => {
    if (stats) stats.classList.add('visible');
    runCounters();
  }, 1000);
}

/* Split h1 into word spans, animate in */
function splitAndReveal(el, delayStep) {
  const rawHTML = el.innerHTML;
  // Already processed
  if (el.querySelector('.split-word')) return;

  // Preserve <em> and <br>
  const temp = document.createElement('div');
  temp.innerHTML = rawHTML;
  el.innerHTML = '';

  // Process each text node and element
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(' ').filter(w => w.length);
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'split-word';
        span.textContent = word;
        el.appendChild(span);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'BR') { el.appendChild(node.cloneNode()); }
      else if (node.tagName === 'EM') {
        const em = document.createElement('em');
        node.childNodes.forEach(child => {
          if (child.nodeType === Node.TEXT_NODE) {
            const words = child.textContent.split(' ').filter(w => w.length);
            words.forEach((word, i) => {
              const span = document.createElement('span');
              span.className = 'split-word';
              span.textContent = word;
              em.appendChild(span);
              if (i < words.length - 1) em.appendChild(document.createTextNode(' '));
            });
          }
        });
        el.appendChild(em);
        el.appendChild(document.createTextNode(' '));
      }
    }
  }
  temp.childNodes.forEach(n => processNode(n));

  // Animate each word
  $$('.split-word').forEach((w, i) => {
    setTimeout(() => w.classList.add('visible'), i * 60 + 80);
  });
}


/* ═══════════════════════════════════════════════════════════════════
   4 ▸ PARTICLE CANVAS — ambient data dots
   ═══════════════════════════════════════════════════════════════════ */
const canvas = $('#hero-canvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.5 + 0.5,
      vx:    (Math.random() - 0.5) * 0.25,
      vy:    (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.5 + 0.1,
      gold:  Math.random() > 0.6,
    };
  }

  for (let i = 0; i < 80; i++) particles.push(createParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);

    // Draw connecting lines first
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(201,169,110,${0.04 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(201,169,110,${p.alpha})`
        : `rgba(10,191,188,${p.alpha * 0.6})`;
      ctx.fill();
    });

    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}


/* ═══════════════════════════════════════════════════════════════════
   5 ▸ CUSTOM CURSOR
   ═══════════════════════════════════════════════════════════════════ */
const dot    = $('.c-dot');
const ring   = $('.c-ring');

if (dot && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function trackRing() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(trackRing);
  })();

  const hoverEls = $$('a, button, .work-card, .project-card, .credential-card, .snapshot-grid img, .service-card, .mag-btn');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}


/* ═══════════════════════════════════════════════════════════════════
   6 ▸ MAGNETIC BUTTONS
   ═══════════════════════════════════════════════════════════════════ */
$$('.mag-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) * 0.28;
    const dy   = (e.clientY - cy) * 0.28;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});


/* ═══════════════════════════════════════════════════════════════════
   7 ▸ 3D CARD TILT
   ═══════════════════════════════════════════════════════════════════ */
$$('.work-card, .service-card, .project-card').forEach(card => {
  const glow = card.querySelector('.card-glow');

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const rx   = clamp(map(y, 0, rect.height, 12, -12), -12, 12);
    const ry   = clamp(map(x, 0, rect.width,  -12, 12), -12, 12);

    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.boxShadow = `0 24px 60px rgba(11,13,18,0.2), ${ry * 1.5}px ${rx * -1.5}px 30px rgba(201,169,110,0.08)`;

    if (glow) {
      glow.style.left = x + 'px';
      glow.style.top  = y + 'px';
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});


/* ═══════════════════════════════════════════════════════════════════
   8 ▸ SCROLL PROGRESS BAR
   ═══════════════════════════════════════════════════════════════════ */
const scrollBar = $('#scroll-bar');

window.addEventListener('scroll', () => {
  if (scrollBar) {
    const d = document.documentElement.scrollHeight - window.innerHeight;
    scrollBar.style.width = (d > 0 ? window.scrollY / d * 100 : 0) + '%';
  }
}, { passive: true });


/* ═══════════════════════════════════════════════════════════════════
   9 ▸ NAV: hide on scroll down / show on scroll up
   ═══════════════════════════════════════════════════════════════════ */
let lastScroll = 0;
const header = $('.site-header');

window.addEventListener('scroll', () => {
  const s = window.scrollY;
  if (header) {
    header.classList.toggle('scrolled', s > 40);
    header.classList.toggle('hidden', s > lastScroll + 5 && s > 200);
    if (s < lastScroll) header.classList.remove('hidden');
  }
  lastScroll = s;
}, { passive: true });


/* ═══════════════════════════════════════════════════════════════════
   10 ▸ INTERSECTION OBSERVER — scroll reveals
   ═══════════════════════════════════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    // Stagger children
    e.target.querySelectorAll('.work-card, .service-card, .project-card, .credential-card').forEach((child, ci) => {
      child.style.transitionDelay = `${ci * 0.08}s`;
    });
    e.target.classList.add('active');
    revealObs.unobserve(e.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

$$('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));


/* ═══════════════════════════════════════════════════════════════════
   11 ▸ STAT COUNTERS
   ═══════════════════════════════════════════════════════════════════ */
function runCounters() {
  $$('.count').forEach(el => {
    const target = parseInt(el.dataset.target || el.textContent, 10);
    if (isNaN(target)) return;
    const dur = 1800;
    const start = performance.now();

    function step(now) {
      const t = Math.min((now - start) / dur, 1);
      // Ease out expo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      el.textContent = Math.floor(eased * target);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  });
}

// Also trigger when stats scroll into view (subpages)
const statsObs = new IntersectionObserver(e => {
  e.forEach(entry => { if (entry.isIntersecting) runCounters(); });
}, { threshold: 0.5 });
$$('.hero-stats').forEach(el => statsObs.observe(el));


/* ═══════════════════════════════════════════════════════════════════
   12 ▸ PARALLAX — hero card subtle depth
   ═══════════════════════════════════════════════════════════════════ */
const heroCard = $('.hero-card');
const heroOrb1 = $('.hero-orb-1');
const heroOrb2 = $('.hero-orb-2');

window.addEventListener('scroll', () => {
  const s = window.scrollY;
  if (heroCard && s < window.innerHeight) {
    heroCard.style.transform = `translateY(${s * 0.07}px)`;
  }
  if (heroOrb1) heroOrb1.style.transform = `translate(0, ${s * 0.12}px)`;
  if (heroOrb2) heroOrb2.style.transform = `translate(0, ${s * -0.08}px)`;
}, { passive: true });


/* ═══════════════════════════════════════════════════════════════════
   13 ▸ WORK CARDS — navigate to work.html
   ═══════════════════════════════════════════════════════════════════ */
$$('.work-card.clickable').forEach(card => {
  card.addEventListener('click', () => navigateTo('work.html'));
});

/* ─── Page veil transition ─── */
function navigateTo(url) {
  const veil = $('#page-veil');
  if (veil) {
    veil.classList.add('enter');
    setTimeout(() => { window.location.href = url; }, 550);
  } else {
    window.location.href = url;
  }
}

// On page load: drop the veil if coming from a transition
window.addEventListener('pageshow', () => {
  const veil = $('#page-veil');
  if (veil) {
    veil.classList.remove('enter');
    veil.classList.add('exit');
    setTimeout(() => veil.classList.remove('exit'), 600);
  }
});

// Intercept internal navigation links
$$('.nav-links a, .footer-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
  link.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(href);
  });
});


/* ═══════════════════════════════════════════════════════════════════
   14 ▸ IMAGE LIGHTBOX
   ═══════════════════════════════════════════════════════════════════ */
const modal    = $('#imageModal');
const modalImg = $('#modalImage');
const closeBtn = $('.close-modal');

if (modal && modalImg) {
  $$('.snapshot-grid img').forEach(img => {
    img.addEventListener('click', () => {
      modal.classList.add('open');
      modalImg.src = img.src;
      modalImg.alt = img.alt || '';
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLB = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };
  if (closeBtn) closeBtn.addEventListener('click', closeLB);
  modal.addEventListener('click', e => { if (e.target === modal) closeLB(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });
}


/* ═══════════════════════════════════════════════════════════════════
   15 ▸ SMOOTH SCROLL for anchor links
   ═══════════════════════════════════════════════════════════════════ */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const offset = (header?.offsetHeight || 70) + 24;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});


/* ═══════════════════════════════════════════════════════════════════
   16 ▸ MOUSE-FOLLOW GLOW on hero section
   ═══════════════════════════════════════════════════════════════════ */
const hero = $('.hero');
if (hero) {
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    hero.style.setProperty('--mx', x + '%');
    hero.style.setProperty('--my', y + '%');
  });
}
