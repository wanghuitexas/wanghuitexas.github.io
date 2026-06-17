/* ============================================================
   CALMLAYER LLC — script.js
   All interactive features: Matrix Rain, Particles, Animations
   ============================================================ */

(function () {
  'use strict';

  /* ── MATRIX RAIN ─────────────────────────────────────────── */
  const matrixCanvas = document.getElementById('matrix-canvas');
  const matrixCtx = matrixCanvas.getContext('2d');

  function resizeMatrix() {
    matrixCanvas.width  = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
  }
  resizeMatrix();
  window.addEventListener('resize', resizeMatrix);

  const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const fontSize    = 13;
  let columns = Math.floor(matrixCanvas.width / fontSize);
  let drops   = Array(columns).fill(0).map(() => Math.random() * -100);

  function drawMatrix() {
    matrixCtx.fillStyle = 'rgba(2,8,16,0.06)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    matrixCtx.fillStyle = '#00ff88';
    matrixCtx.font      = `${fontSize}px "Share Tech Mono", monospace`;

    drops.forEach((y, i) => {
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      const x    = i * fontSize;
      matrixCtx.globalAlpha = Math.random() * 0.8 + 0.2;
      matrixCtx.fillText(char, x, y * fontSize);
      if (y * fontSize > matrixCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });
    matrixCtx.globalAlpha = 1;
  }

  setInterval(drawMatrix, 55);

  window.addEventListener('resize', () => {
    columns = Math.floor(matrixCanvas.width / fontSize);
    drops   = Array(columns).fill(0).map(() => Math.random() * -100);
  });

  /* ── PARTICLE NETWORK ────────────────────────────────────── */
  const pCanvas = document.getElementById('particle-canvas');
  const pCtx    = pCanvas.getContext('2d');

  function resizeParticles() {
    pCanvas.width  = window.innerWidth;
    pCanvas.height = window.innerHeight;
  }
  resizeParticles();
  window.addEventListener('resize', resizeParticles);

  const PARTICLE_COUNT = 60;
  const MAX_DIST       = 160;
  const particles      = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x:   Math.random() * window.innerWidth,
      y:   Math.random() * window.innerHeight,
      vx:  (Math.random() - 0.5) * 0.35,
      vy:  (Math.random() - 0.5) * 0.35,
      r:   Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    });
  }

  let mouse = { x: -9999, y: -9999 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function drawParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

    particles.forEach(p => {
      // mouse repulsion
      const dx  = p.x - mouse.x;
      const dy  = p.y - mouse.y;
      const md  = Math.sqrt(dx * dx + dy * dy);
      if (md < 120) {
        p.vx += (dx / md) * 0.3;
        p.vy += (dy / md) * 0.3;
      }

      p.vx = Math.max(-1.2, Math.min(1.2, p.vx));
      p.vy = Math.max(-1.2, Math.min(1.2, p.vy));

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = pCanvas.width;
      if (p.x > pCanvas.width)  p.x = 0;
      if (p.y < 0) p.y = pCanvas.height;
      if (p.y > pCanvas.height) p.y = 0;

      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(0,255,136,${p.opacity})`;
      pCtx.fill();
    });

    // draw lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          pCtx.beginPath();
          pCtx.moveTo(particles[i].x, particles[i].y);
          pCtx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          pCtx.strokeStyle = `rgba(0,204,255,${alpha})`;
          pCtx.lineWidth = 0.6;
          pCtx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ── NAVBAR SCROLL ───────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.getElementById('nav-links');
  const navToggle = document.getElementById('nav-toggle');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  /* ── TERMINAL TYPEWRITER ─────────────────────────────────── */
  const terminalEl = document.getElementById('terminal-text');
  const messages   = [
    '> Initializing CalmLayer defense protocols...',
    '> Scanning for surveillance devices... CLEAR',
    '> RF spectrum analysis: 1MHz - 24GHz sweep complete',
    '> Zero-day vulnerability database: UPDATED',
    '> TSCM module: ARMED & READY',
    '> Quantum encryption: ACTIVE',
    '> Your digital perimeter is secure.',
  ];
  let mIdx = 0, cIdx = 0, isDeleting = false, pauseCount = 0;

  function typeTerminal() {
    const current  = messages[mIdx];
    const displayed = current.substring(0, cIdx);
    if (terminalEl) terminalEl.textContent = displayed;

    if (!isDeleting && cIdx < current.length) {
      cIdx++;
      setTimeout(typeTerminal, 45);
    } else if (!isDeleting && cIdx === current.length) {
      pauseCount++;
      if (pauseCount < 30) {
        setTimeout(typeTerminal, 70);
      } else {
        pauseCount  = 0;
        isDeleting  = true;
        setTimeout(typeTerminal, 70);
      }
    } else if (isDeleting && cIdx > 0) {
      cIdx--;
      setTimeout(typeTerminal, 25);
    } else {
      isDeleting = false;
      mIdx       = (mIdx + 1) % messages.length;
      setTimeout(typeTerminal, 500);
    }
  }
  typeTerminal();

  /* ── COUNTER ANIMATION ───────────────────────────────────── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const isFloat = String(target).includes('.');
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;
      el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ── SCROLL REVEAL ───────────────────────────────────────── */
  const revealEls    = document.querySelectorAll('.section-header, .service-card, .product-showcase, .metric-card, .testimonial-card, .about-grid, .contact-grid, .footer-grid, .threat-dashboard');
  const statNums     = document.querySelectorAll('.stat-num');
  let statsAnimated  = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNums.forEach(el => animateCounter(el));
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  if (statNums.length) statsObserver.observe(statNums[0].closest('.hero-stats') || document.body);

  /* ── LIVE THREAT FEED ────────────────────────────────────── */
  const threatFeed   = document.getElementById('threat-feed');
  const alertCount   = document.getElementById('alert-count');
  let alertNum = 0;

  const threatData = [
    { severity: 'high', msg: 'SQL Injection attempt — Origin: CN/Beijing', time: 'now' },
    { severity: 'high', msg: 'Brute force attack — SSH port 22 — 4,200 attempts/min', time: '2s' },
    { severity: 'med',  msg: 'Suspicious outbound traffic — Port 443 anomaly', time: '8s' },
    { severity: 'high', msg: 'Zero-day exploit attempt — CVE-2026-1337', time: '15s' },
    { severity: 'low',  msg: 'Port scan neutralized — Origin: RU/Moscow', time: '22s' },
    { severity: 'med',  msg: 'DNS tunneling detected — traffic quarantined', time: '31s' },
    { severity: 'high', msg: 'APT group activity — Lateral movement blocked', time: '45s' },
    { severity: 'low',  msg: 'Tor exit node connection — flagged & logged', time: '1m' },
    { severity: 'med',  msg: 'Credential stuffing attack — 12K attempts blocked', time: '2m' },
    { severity: 'high', msg: 'Ransomware payload intercepted — quarantined', time: '3m' },
  ];

  function addFeedItem(item) {
    const div  = document.createElement('div');
    div.className = 'feed-item';
    div.innerHTML = `
      <span class="feed-severity ${item.severity}"></span>
      <span class="feed-text">${item.msg}</span>
      <span class="feed-time">${item.time}</span>
    `;
    if (threatFeed) {
      threatFeed.insertBefore(div, threatFeed.firstChild);
      if (threatFeed.children.length > 8) {
        threatFeed.removeChild(threatFeed.lastChild);
      }
    }
    alertNum++;
    if (alertCount) alertCount.textContent = `${alertNum} New`;
  }

  // Initial feed
  [...threatData].reverse().forEach((item, i) => {
    setTimeout(() => addFeedItem(item), i * 200);
  });

  // Live updates
  let feedIdx = 0;
  setInterval(() => {
    const item = { ...threatData[feedIdx % threatData.length], time: 'now' };
    addFeedItem(item);
    feedIdx++;
  }, 4500);

  /* ── METRICS LIVE UPDATE ─────────────────────────────────── */
  const attackCount = document.getElementById('attack-count');
  const scanCount   = document.getElementById('scan-count');
  const threatCount = document.getElementById('threat-count');

  setInterval(() => {
    if (attackCount) {
      const v = parseInt(attackCount.textContent.replace(/,/g, '')) + Math.floor(Math.random() * 8 + 1);
      attackCount.textContent = v.toLocaleString();
    }
    if (scanCount) {
      const v = parseInt(scanCount.textContent.replace(/,/g, '')) + Math.floor(Math.random() * 30 + 5);
      scanCount.textContent = v.toLocaleString();
    }
    if (threatCount && Math.random() > 0.7) {
      let v = parseInt(threatCount.textContent);
      v = Math.max(3, Math.min(15, v + (Math.random() > 0.5 ? 1 : -1)));
      threatCount.textContent = v;
    }
  }, 2200);

  /* ── CONTACT FORM ────────────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  const formStatus  = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('#form-submit-btn');
      const original = btn.innerHTML;
      btn.innerHTML = '<span class="btn-icon">⟳</span> Encrypting...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<span class="btn-icon">✓</span> Transmitted!';
        if (formStatus) {
          formStatus.className = 'form-status success';
          formStatus.textContent = '⬡ Secure message received. A Calmlayer operative will contact you within 24 hours.';
        }
        setTimeout(() => {
          contactForm.reset();
          btn.innerHTML = original;
          btn.disabled  = false;
          if (formStatus) { formStatus.className = 'form-status'; formStatus.textContent = ''; }
        }, 5000);
      }, 1800);
    });
  }

  /* ── SMOOTH ANCHOR SCROLL ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── CURSOR GLOW TRAIL ───────────────────────────────────── */
  const trail = [];
  const TRAIL_LENGTH = 8;

  for (let i = 0; i < TRAIL_LENGTH; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:fixed;width:${6 - i * 0.5}px;height:${6 - i * 0.5}px;
      background:rgba(0,255,136,${0.6 - i * 0.07});border-radius:50%;
      pointer-events:none;z-index:9999;transition:all ${i * 30}ms ease;
      transform:translate(-50%,-50%);
    `;
    document.body.appendChild(dot);
    trail.push(dot);
  }

  window.addEventListener('mousemove', e => {
    trail.forEach(dot => {
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    });
  });

  /* ── ACTIVE NAV ON SCROLL ─────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchs  = document.querySelectorAll('.nav-link:not(.nav-cta)');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 80;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navAnchs.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === '#' + current) {
        a.style.color = 'var(--green)';
      }
    });
  });

  /* ── CARD TILT EFFECT ────────────────────────────────────── */
  document.querySelectorAll('.service-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width  / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;
      const maxTilt = 6;
      const tiltX   = -(y / (rect.height / 2)) * maxTilt;
      const tiltY   =  (x / (rect.width  / 2)) * maxTilt;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── THREAT MAP ANIMATED LINES ──────────────────────────── */
  const attackLines = document.getElementById('attack-lines');
  const origins = [
    { x: '82%', y: '15%' },
    { x: '48%', y: '20%' },
    { x: '72%', y: '18%' },
  ];
  const target_ = { x: '16%', y: '33%' };

  if (attackLines) {
    origins.forEach((orig, i) => {
      const line = document.createElement('div');
      line.style.cssText = `
        position:absolute;
        width:2px;
        background:linear-gradient(180deg,rgba(255,51,102,0.8),transparent);
        top:${orig.y};left:${orig.x};height:0;
        animation: atkLine 2.5s ease-in-out ${i * 0.8}s infinite;
        transform-origin:top;border-radius:2px;
      `;
      attackLines.appendChild(line);
    });

    const style = document.createElement('style');
    style.textContent = `
      @keyframes atkLine {
        0%{height:0;opacity:1;}
        60%{height:80px;opacity:0.8;}
        100%{height:80px;opacity:0;}
      }
    `;
    document.head.appendChild(style);
  }

  /* ── GLITCH RANDOM TRIGGER ───────────────────────────────── */
  setInterval(() => {
    const glitchEls = document.querySelectorAll('.glitch');
    if (!glitchEls.length) return;
    const el = glitchEls[Math.floor(Math.random() * glitchEls.length)];
    el.style.animation = 'none';
    setTimeout(() => { el.style.animation = ''; }, 50);
  }, 3000);

  /* ── OPS CENTER — LEAFLET MAP ───────────────────────────────── */
  function initOpsMap() {
    if (!document.getElementById('houston-map') || typeof L === 'undefined') return;

    const HOUSTON = [29.7604, -95.3698];

    const map = L.map('houston-map', {
      center: HOUSTON,
      zoom: 4,
      zoomControl: true,
      attributionControl: false,
      minZoom: 2,
      maxZoom: 10,
    });

    // Dark tile layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // ── Custom SVG icon builder ──
    function makeIcon(color, glow, size, pulse) {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 40 40">
          <defs>
            <filter id="glow-${color.replace('#','')}">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          ${pulse ? `<circle cx="20" cy="20" r="18" fill="${color}" opacity="0.12" class="pulse-svg"/>` : ''}
          <polygon points="20,4 36,14 36,26 20,36 4,26 4,14" fill="none" stroke="${color}" stroke-width="2" filter="url(#glow-${color.replace('#','')})"/>
          <circle cx="20" cy="20" r="5" fill="${color}" filter="url(#glow-${color.replace('#','')})"/>
        </svg>`;
      return L.divIcon({
        html: svg,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        popupAnchor: [0, -size/2],
      });
    }

    // ── HQ Marker — Houston ──
    const hqIcon = L.divIcon({
      html: `
        <div style="position:relative;width:48px;height:48px;">
          <div style="position:absolute;inset:0;border-radius:50%;background:rgba(0,255,136,0.15);animation:blink 1.5s infinite;"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" style="position:relative;z-index:2;">
            <polygon points="24,3 45,15 45,33 24,45 3,33 3,15" fill="rgba(0,255,136,0.1)" stroke="#00ff88" stroke-width="2"/>
            <polygon points="24,10 38,18 38,30 24,38 10,30 10,18" fill="none" stroke="#00ccff" stroke-width="1" stroke-dasharray="3 2"/>
            <circle cx="24" cy="24" r="6" fill="#00ff88" style="filter:drop-shadow(0 0 6px #00ff88)"/>
            <circle cx="24" cy="24" r="3" fill="#020810"/>
          </svg>
        </div>`,
      className: '',
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -28],
    });

    const hqMarker = L.marker(HOUSTON, { icon: hqIcon }).addTo(map);
    hqMarker.bindPopup(`
      <div class="hq-popup">
        <h4>⬡ CALMLAYER LLC — HQ</h4>
        <p>Houston, Texas 77064<br/>Energy Corridor District<br/>SOC Operations: 24/7 Active</p>
        <div class="popup-status">
          <span style="width:6px;height:6px;background:#00ff88;border-radius:50%;display:inline-block;animation:blink 1s infinite;box-shadow:0 0 6px #00ff88;"></span>
          RESPONDING TO CVE-2026-9001
        </div>
      </div>`, { maxWidth: 240 }
    ).openPopup();

    // ── Threat origin markers ──
    const threats = [
      { latlng: [55.75, 37.62],  label: 'Moscow, RU',    color: '#ff3366' },
      { latlng: [39.91, 116.39], label: 'Beijing, CN',   color: '#ff3366' },
      { latlng: [48.85, 2.35],   label: 'Paris, FR',     color: '#ffaa00' },
      { latlng: [1.35,  103.82], label: 'Singapore, SG', color: '#ffaa00' },
      { latlng: [51.51, -0.13],  label: 'London, UK',    color: '#ffaa00' },
    ];

    const threatArcs = [];

    threats.forEach((t, i) => {
      const threatIcon = makeIcon(t.color, t.color, 36, true);
      const marker = L.marker(t.latlng, { icon: threatIcon }).addTo(map);
      marker.bindPopup(`
        <div class="hq-popup">
          <h4 style="color:${t.color}">⚠ THREAT ORIGIN</h4>
          <p>${t.label}<br/>CVE-2026-9001 Source Vector<br/>Status: INTERCEPTED</p>
        </div>`, { maxWidth: 200 }
      );

      // Great-circle arc via intermediate waypoints
      function interpolate(p1, p2, t) {
        return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
      }
      function arcPoints(from, to, n) {
        const pts = [];
        for (let k = 0; k <= n; k++) {
          const t = k / n;
          const pt = interpolate(from, to, t);
          // lift midpoint (geodesic arc approximation)
          const arc = Math.sin(Math.PI * t) * 18;
          pts.push([pt[0] + arc * 0.3, pt[1]]);
        }
        return pts;
      }

      // Dashed red arc (incoming threat)
      const arcPts = arcPoints(t.latlng, HOUSTON, 50);
      const arc = L.polyline(arcPts, {
        color: t.color,
        weight: 1.5,
        opacity: 0.7,
        dashArray: '6 5',
        className: 'threat-arc',
      }).addTo(map);
      threatArcs.push({ arc, pts: arcPts, color: t.color, delay: i * 1800 });

      // Animate a "moving dot" along the arc
      setTimeout(() => animateDot(arcPts, t.color, map), i * 1800 + 800);
    });

    // ── Animated dot along arc ──
    function animateDot(pts, color, map) {
      let idx = 0;
      const dotIcon = L.divIcon({
        html: `<div style="width:10px;height:10px;background:${color};border-radius:50%;box-shadow:0 0 10px ${color};"></div>`,
        className: '',
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });
      const dot = L.marker(pts[0], { icon: dotIcon, zIndexOffset: 1000 }).addTo(map);
      const timer = setInterval(() => {
        if (idx >= pts.length - 1) {
          // flash + remove when hitting Houston
          dot.setLatLng(HOUSTON);
          setTimeout(() => { try { map.removeLayer(dot); } catch(e){} }, 400);

          // flash the HQ marker on impact
          const flash = L.circleMarker(HOUSTON, {
            radius: 5, color: color, fillColor: color, fillOpacity: 0.8, weight: 2, opacity: 1,
          }).addTo(map);
          let r = 5;
          const grow = setInterval(() => {
            r += 3;
            flash.setRadius(r);
            flash.setStyle({ opacity: Math.max(0, 1 - r / 40), fillOpacity: Math.max(0, 0.6 - r / 40) });
            if (r >= 40) { clearInterval(grow); try { map.removeLayer(flash); } catch(e){} }
          }, 40);

          clearInterval(timer);
          return;
        }
        idx += 2;
        dot.setLatLng(pts[Math.min(idx, pts.length - 1)]);
      }, 40);

      // Loop every 12s
      setTimeout(() => animateDot(pts, color, map), 12000);
    }

    // ── Calmlayer response arcs (green, outward from Houston) ──
    const responseTargets = [
      [40.71, -74.00],  // New York
      [34.05, -118.24], // Los Angeles
      [41.88, -87.63],  // Chicago
      [51.51, -0.13],   // London (client)
      [1.35,  103.82],  // Singapore (client)
    ];
    responseTargets.forEach((to, i) => {
      function arcPtsResp(from, to, n) {
        const pts = [];
        for (let k = 0; k <= n; k++) {
          const t = k / n;
          const pt = [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
          const arc = Math.sin(Math.PI * t) * 8;
          pts.push([pt[0] + arc * 0.2, pt[1]]);
        }
        return pts;
      }
      setTimeout(() => {
        const pts = arcPtsResp(HOUSTON, to, 40);
        L.polyline(pts, {
          color: '#00ff88', weight: 1, opacity: 0.35, dashArray: '4 6',
        }).addTo(map);
      }, i * 600 + 2000);
    });
  }

  // Wait for Leaflet to be available (loaded async)
  if (typeof L !== 'undefined') {
    initOpsMap();
  } else {
    document.querySelector('script[src*="leaflet"]')
      && document.querySelector('script[src*="leaflet"]').addEventListener('load', initOpsMap);
    window.addEventListener('load', () => { if (typeof L !== 'undefined') initOpsMap(); });
  }

  /* ── RESPONSE TIMER ─────────────────────────────────────────── */
  const timerEl  = document.getElementById('response-timer');
  const zdaStatus = document.getElementById('zda-status');
  const incStatus = document.getElementById('incident-status');
  const savedEl   = document.getElementById('targets-saved');
  const actionLog = document.getElementById('ops-action-log');

  if (timerEl) {
    let seconds = 0, saved = 0;
    const actions = [
      { delay: 2000,  icon: 'warn', text: 'CVE-2026-9001 RCE payload detected — 3 vectors active' },
      { delay: 5000,  icon: 'prog', text: 'Isolating affected subnets — 12 endpoints quarantined' },
      { delay: 9000,  icon: 'prog', text: 'Deploying emergency patch payload to edge nodes' },
      { delay: 14000, icon: 'done', text: 'Vector 1 (Moscow) — NEUTRALIZED ✓' },
      { delay: 19000, icon: 'done', text: 'Vector 2 (Beijing) — NEUTRALIZED ✓' },
      { delay: 25000, icon: 'prog', text: 'Sweeping residual persistence modules...' },
      { delay: 31000, icon: 'done', text: 'Vector 3 (Paris) — NEUTRALIZED ✓' },
      { delay: 36000, icon: 'done', text: 'All 3 threat vectors contained — CVE-2026-9001 CLOSED' },
    ];

    // Start timer
    setInterval(() => {
      seconds++;
      const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      if (timerEl) timerEl.textContent = `${h}:${m}:${s}`;
    }, 1000);

    // Targets saved counter
    const savedInterval = setInterval(() => {
      saved += Math.floor(Math.random() * 4 + 1);
      if (savedEl) savedEl.textContent = saved.toLocaleString();
    }, 2800);

    // Progressive action log
    actions.forEach(a => {
      setTimeout(() => {
        if (!actionLog) return;
        const div = document.createElement('div');
        div.className = 'ops-action-item';
        div.innerHTML = `
          <span class="ops-action-icon ${a.icon}">${a.icon === 'done' ? '✓' : a.icon === 'warn' ? '⚠' : '⟳'}</span>
          <span class="ops-action-text">${a.text}</span>`;
        actionLog.insertBefore(div, actionLog.firstChild);

        // At last action — switch status to CONTAINED then NEUTRALIZED
        if (a.delay === 31000 && zdaStatus) {
          zdaStatus.textContent = 'CONTAINED';
          zdaStatus.className = 'zda-status contained';
          if (incStatus) { incStatus.textContent = 'CONTAINED'; incStatus.className = 'ops-ir-val blink-val'; }
        }
        if (a.delay === 36000) {
          if (zdaStatus) { zdaStatus.textContent = '✓ NEUTRALIZED'; zdaStatus.className = 'zda-status neutralized'; }
          if (incStatus) { incStatus.textContent = '✓ NEUTRALIZED'; incStatus.className = 'ops-ir-val green'; }
          clearInterval(savedInterval);
        }
      }, a.delay);
    });
  }

  console.log('%c CALMLAYER LLC — SYSTEMS ONLINE ', 'background:#020810;color:#00ff88;font-family:monospace;font-size:14px;padding:10px 20px;border:1px solid #00ff88;');
  console.log('%c All systems operational. Your connection is monitored. ', 'color:#7090a0;font-family:monospace;font-size:11px;');

})();
