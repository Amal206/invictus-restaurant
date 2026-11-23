/* ==========================================================
   INVICTUS — main.js
   Noyau partagé : navigation, pied de page, transitions de page,
   animations au défilement, parallaxe, tilt 3D, scène Three.js.
   ========================================================== */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;
  const page = document.body.dataset.page || '';

  /* ---------- Données du restaurant (modifiables ici) ---------- */
  const INFO = {
    name: 'INVICTUS',
    by: "by Karim M'halla",
    phone: '+216 28 048 282',
    tel: 'tel:+21628048282',
    sms: '+21628048282',
    address: 'VJ38+MC3, Khezama Zone Touristique, Avenue 14 Janvier, Sousse 4051, Tunisie',
    rating: 4.4,
    reviews: 182,
    mapsEmbed: 'https://www.google.com/maps?q=' + encodeURIComponent('VJ38+MC3 Khezama, Sousse, Tunisie') + '&output=embed',
    mapsDir: 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent('VJ38+MC3 Khezama, Sousse, Tunisie'),
    mapsPlace: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('INVICTUS Restaurant Khezama Sousse')
  };
  const SERVICES = [
    ['family', 'Restaurant familial'], ['fire', 'Cheminée'], ['umbrella', 'Terrasse extérieure'],
    ['parking', 'Parking gratuit'], ['wifi', 'Wi-Fi gratuit'], ['calendar', 'Réservations acceptées'],
    ['bag', 'Sur place & à emporter'], ['star', 'Ambiance chaleureuse & raffinée']
  ];
  /* Photos : Pexels (illustratives). Remplacez par vos photos dans /assets/images si besoin. */
  const px = (id, w = 900) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

  /* ---------- Icônes ---------- */
  const ICONS = {
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    wifi: '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".8"/>',
    fire: '<path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z"/>',
    parking: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9.5 17V7H13a3 3 0 0 1 0 6H9.5"/>',
    umbrella: '<path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9zM12 12v7a2 2 0 0 0 4 0"/>',
    family: '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.2"/><path d="M2 20a6 6 0 0 1 12 0M15 20a5 5 0 0 1 7 0"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    bag: '<path d="M5 8h14l-1 12H6L5 8zM9 8a3 3 0 0 1 6 0"/>',
    star: '<path d="M12 3l2.8 6 6.2.7-4.6 4.3 1.3 6.5L12 17.3 6.3 20.5l1.3-6.5L3 9.7 9.2 9z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    close: '<path d="M5 5l14 14M19 5L5 19"/>',
    nav: '<path d="M3 11l18-8-8 18-2-8-8-2z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
    print: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>'
  };
  const icon = (n, s = 22) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const markSVG = (ink = '#fff') => `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="460" viewBox="440 110 200 460"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EBD59B"/><stop offset="1" stop-color="#B38F54"/></linearGradient></defs><path fill="url(#g)" d="M540 121L572 146L540 171L508 146Z"/><path fill="url(#g)" d="M540 175L572 197L540 220L508 197Z"/><path fill="${ink}" d="M452 207H505L540 237L575 207H628V462Q628 494 592 517V263L540 306L488 263V517Q452 494 452 462Z"/><path fill="${ink}" d="M527 322L556 346V398L536 398L556 420V546L540 560L524 546V430L488 398L524 368Z"/></svg>`;

  window.INV = { $, $$, px, INFO, icon, markSVG, reduce, canHover };

  /* ---------- Navigation & pied de page ---------- */
  const NAV = [
    ['index.html', 'Accueil', 'home'], ['about.html', 'À propos', 'about'],
    ['menu.html', 'La Carte', 'menu'], ['gallery.html', 'Galerie', 'gallery'],
    ['contact.html', 'Contact', 'contact']
  ];
  const hdr = $('#site-header');
  if (hdr) {
    hdr.innerHTML = `
      <div class="hdr-in">
        <a class="brand" href="index.html" aria-label="INVICTUS Restaurant — Accueil">
          <img src="assets/logo/logo-mark.svg" alt="" width="19" height="44">
          <span><b>INVICTUS</b><i>Restaurant</i></span>
        </a>
        <nav class="nav" aria-label="Navigation principale">
          ${NAV.map(n => `<a href="${n[0]}" class="${n[2] === page ? 'active' : ''}">${n[1]}</a>`).join('')}
        </nav>
        <div class="hdr-actions">
          <a class="btn btn-gold btn-sm" href="${INFO.tel}">Réserver</a>
          <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false"><span></span><span></span></button>
        </div>
      </div>`;
    const mnav = document.createElement('div');
    mnav.className = 'mnav';
    mnav.id = 'mnav';
    mnav.innerHTML = NAV.map((n, i) => `<a class="ml ${n[2] === page ? 'active' : ''}" style="--i:${i}" href="${n[0]}"><small>0${i + 1}</small>${n[1]}</a>`).join('') +
      `<div class="mnav-foot"><a href="${INFO.tel}">${INFO.phone}</a>${INFO.address}</div>`;
    document.body.appendChild(mnav);
    const burger = $('.burger', hdr);
    const toggle = (open) => {
      const o = open === undefined ? !document.body.classList.contains('menu-open') : open;
      document.body.classList.toggle('menu-open', o);
      burger.setAttribute('aria-expanded', o);
      burger.setAttribute('aria-label', o ? 'Fermer le menu' : 'Ouvrir le menu');
    };
    burger.addEventListener('click', () => toggle());
    window.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });

    // État au défilement (la carte garde un en-tête fixe et compact)
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      hdr.classList.toggle('scrolled', y > 40 || page === 'menu');
      if (page !== 'menu' && !document.body.classList.contains('menu-open')) {
        hdr.classList.toggle('hide', y > lastY && y > 400);
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const ftr = $('#site-footer');
  if (ftr) {
    ftr.innerHTML = `
      <div class="ftr-top container">
        <div>
          <img src="assets/logo/logo-mark.svg" alt="Logo INVICTUS" width="34" height="78">
          <h3>INVICTUS</h3>
          <p style="color:var(--gold);letter-spacing:.2em;font-size:.75rem;text-transform:uppercase">${INFO.by}</p>
          <p style="margin-top:14px;max-width:34ch">Restaurant gastronomique méditerranéen et international.</p>
        </div>
        <div>
          <h4>Navigation</h4>
          <ul>${NAV.map(n => `<li><a href="${n[0]}">${n[1]}</a></li>`).join('')}<li><a href="qr-code.html">QR Code de la carte</a></li></ul>
        </div>
        <div>
          <h4>Contact</h4>
          <p>${INFO.address}</p>
          <p><a href="${INFO.tel}" style="color:var(--gold-l);font-family:var(--f-disp);font-size:.95rem">${INFO.phone}</a></p>
          <p><a href="${INFO.mapsDir}" target="_blank" rel="noopener">Itinéraire Google Maps →</a></p>
        </div>
        <div>
          <h4>Services</h4>
          <ul>${SERVICES.map(s => `<li>${s[1]}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="ftr-bot container">
        <span>© ${new Date().getFullYear()} INVICTUS ${INFO.by} — Tous droits réservés</span>
        <span>Khezama · Sousse · Tunisie</span>
      </div>`;
  }

  /* Icônes déclaratives + services */
  $$('[data-services]').forEach(box => {
    const cls = box.dataset.services || 'svc';
    box.innerHTML = SERVICES.map(s => `<div class="${cls}" data-icon="${s[0]}"><span>${s[1]}</span></div>`).join('');
  });
  $$('[data-icon]').forEach(el => el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon, +el.dataset.size || 22)));

  /* ---------- Transitions de page (rideau architectural) ---------- */
  const root = document.documentElement;
  const openCurtain = () => { clearTimeout(window.__rt); root.classList.add('ready'); setTimeout(() => startReveals(), 450); };
  if (document.readyState === 'complete') setTimeout(openCurtain, 250);
  else window.addEventListener('load', () => setTimeout(openCurtain, 350));
  window.addEventListener('pageshow', e => { if (e.persisted) { root.classList.add('ready'); document.body.classList.remove('menu-open'); } });

  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const href = a.getAttribute('href');
    if (!href || a.target === '_blank' || a.hasAttribute('download') || /^(https?:|tel:|mailto:|sms:|#|javascript:)/i.test(href)) return;
    e.preventDefault();
    root.classList.remove('ready');
    document.body.classList.remove('menu-open');
    setTimeout(() => { window.location.href = href; }, reduce ? 0 : 900);
  });

  /* ---------- Titres animés (mot par mot) ---------- */
  $$('.split').forEach(el => {
    let i = 0;
    const wrap = txt => txt.split(/(\s+)/).map(t => (!t || /^\s+$/.test(t)) ? t : `<span class="w"><span style="--i:${i++}">${t}</span></span>`).join('');
    const out = [];
    el.childNodes.forEach(n => {
      if (n.nodeType === 3) out.push(wrap(n.textContent));
      else if (n.nodeType === 1) { const c = n.cloneNode(false); c.innerHTML = wrap(n.textContent); out.push(c.outerHTML); }
    });
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = out.join('');
  });

  /* ---------- Apparition progressive ---------- */
  const countUp = el => {
    const t = parseFloat(el.dataset.count), d = +el.dataset.dec || 0, t0 = performance.now(), dur = 1900;
    (function f(n) {
      const p = Math.min((n - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = (t * e).toFixed(d).replace('.', ',');
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      if (en.target.dataset.count) countUp(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  const observeAll = () => $$('.reveal,.reveal-img,.split,[data-count]').forEach(el => io.observe(el));
  // Les animations démarrent une fois le rideau de transition ouvert
  let started = false;
  const startReveals = () => { if (started) return; started = true; observeAll(); };
  window.INV.observe = observeAll; // utile après un rendu dynamique
  setTimeout(startReveals, 5200); // filet de sécurité

  /* ---------- Parallaxe au défilement ---------- */
  const pEls = $$('[data-parallax]'), pxEls = $$('[data-parallax-x]');
  let tick = false;
  const parallax = () => {
    tick = false;
    const vh = window.innerHeight;
    pEls.forEach(el => {
      const r = (el.parentElement || el).getBoundingClientRect();
      if (r.bottom < -300 || r.top > vh + 300) return;
      el.style.setProperty('--py', ((r.top + r.height / 2 - vh / 2) * -parseFloat(el.dataset.parallax)).toFixed(1) + 'px');
    });
    pxEls.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -300 || r.top > vh + 300) return;
      el.style.setProperty('--px', ((r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallaxX)).toFixed(1) + 'px');
    });
  };
  if (!reduce && (pEls.length || pxEls.length)) {
    window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(parallax); } }, { passive: true });
    window.addEventListener('resize', parallax);
    parallax();
  }

  /* ---------- Tilt 3D, lumière souris, boutons magnétiques ---------- */
  if (canHover && !reduce) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(1100px) rotateY(${(x * 11).toFixed(2)}deg) rotateX(${(-y * 11).toFixed(2)}deg)`;
        el.style.setProperty('--gx', ((x + .5) * 100).toFixed(1) + '%');
        el.style.setProperty('--gy', ((y + .5) * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    $$('.hero,.phero').forEach(h => h.addEventListener('pointermove', e => {
      const r = h.getBoundingClientRect();
      h.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      h.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }));
    $$('.btn').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${((e.clientX - r.left) / r.width - .5) * 10}px,${((e.clientY - r.top) / r.height - .5) * 8}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* ---------- Pistes horizontales (drag + flèches) ---------- */
  $$('[data-drag]').forEach(tr => {
    let down = false, sx = 0, sl = 0, moved = 0;
    tr.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = tr.scrollLeft; });
    window.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
      if (moved > 5) tr.classList.add('drag');
      tr.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', () => { down = false; setTimeout(() => tr.classList.remove('drag'), 0); });
    tr.addEventListener('click', e => { if (moved > 5) { e.preventDefault(); e.stopPropagation(); } }, true);
    tr.addEventListener('dragstart', e => e.preventDefault());
  });
  $$('[data-scroll]').forEach(b => b.addEventListener('click', () => {
    const t = $(b.dataset.target);
    if (t) t.scrollBy({ left: (b.dataset.scroll === 'next' ? 1 : -1) * t.clientWidth * .7, behavior: 'smooth' });
  }));

  /* ---------- Accordéon ambiance ---------- */
  const amb = $$('.amb-item');
  amb.forEach(it => {
    const on = () => { amb.forEach(o => o.classList.toggle('on', o === it)); };
    it.addEventListener('mouseenter', on); it.addEventListener('focus', on); it.addEventListener('click', on);
  });

  /* ---------- Contact : copier / SMS de réservation ---------- */
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); const t = b.textContent; b.textContent = 'Adresse copiée ✓'; setTimeout(() => b.textContent = t, 2000); } catch (e) { /* ignore */ }
  }));
  const rf = $('#resa-form');
  if (rf) {
    const d = rf.elements.date; if (d) d.min = new Date().toISOString().split('T')[0];
    rf.addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(rf);
      const msg = `Bonjour INVICTUS, je souhaite réserver une table le ${f.get('date')} à ${f.get('time')} pour ${f.get('people')} personne(s). Nom : ${f.get('name')}.`;
      window.location.href = `sms:${INFO.sms}?body=${encodeURIComponent(msg)}`;
    });
  }

  /* ---------- Scène Three.js : totem de losanges architecturaux ---------- */
  function initGL() {
    const cv = $('#gl');
    if (!cv || !window.THREE || reduce) return;
    const T = window.THREE;
    let renderer;
    try { renderer = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true, powerPreference: 'low-power' }); } catch (e) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    const scene = new T.Scene();
    const cam = new T.PerspectiveCamera(40, 1, .1, 100);
    cam.position.z = 16;
    scene.add(new T.AmbientLight(0x8a7448, 1.1));
    const key = new T.PointLight(0xffe2a0, 1.5, 0); key.position.set(4, 4, 9); scene.add(key);
    const fill = new T.PointLight(0xffffff, .5, 0); fill.position.set(-8, -4, 6); scene.add(fill);

    const slabGeo = new T.BoxGeometry(2.3, 2.3, .26);
    const mat = new T.MeshPhongMaterial({ color: 0xc9a96a, specular: 0xfff0c0, shininess: 90, emissive: 0x2a1f0c, transparent: true, opacity: 1 });
    const totem = new T.Group();
    const s1 = new T.Mesh(slabGeo, mat), s2 = new T.Mesh(slabGeo, mat);
    [s1, s2].forEach(s => s.rotation.z = Math.PI / 4);
    s1.position.y = 1.05; s2.position.y = -1.05;
    const edgeMat = new T.LineBasicMaterial({ color: 0xecd69b, transparent: true, opacity: .55 });
    [s1, s2].forEach(s => s.add(new T.LineSegments(new T.EdgesGeometry(slabGeo), edgeMat)));
    totem.add(s1, s2); scene.add(totem);

    // Losanges filaires en profondeur
    const wireGeo = new T.EdgesGeometry(new T.BoxGeometry(1, 1, .05));
    const wires = [];
    const N = window.innerWidth < 700 ? 9 : 18;
    for (let i = 0; i < N; i++) {
      const m = new T.LineBasicMaterial({ color: 0xc9a96a, transparent: true, opacity: .12 + Math.random() * .28 });
      const w = new T.LineSegments(wireGeo, m);
      const sc = .5 + Math.random() * 2.4;
      w.scale.setScalar(sc);
      w.position.set((Math.random() - .5) * 30, (Math.random() - .5) * 17, -12 + Math.random() * 12);
      w.rotation.z = Math.PI / 4;
      w.userData = { sp: (Math.random() - .5) * .006, fl: Math.random() * 6 };
      scene.add(w); wires.push(w);
    }
    // Poussière dorée
    const P = window.innerWidth < 700 ? 120 : 260, pos = new Float32Array(P * 3);
    for (let i = 0; i < P; i++) { pos[i * 3] = (Math.random() - .5) * 34; pos[i * 3 + 1] = (Math.random() - .5) * 20; pos[i * 3 + 2] = -10 + Math.random() * 18; }
    const pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pos, 3));
    const dust = new T.Points(pg, new T.PointsMaterial({ color: 0xecd69b, size: .045, transparent: true, opacity: .65, sizeAttenuation: true }));
    scene.add(dust);

    const parent = cv.parentElement;
    const layout = () => {
      const wide = cam.aspect > 1.15;
      totem.position.set(wide ? 5.6 : 0, wide ? 0 : 4.6, 0);
      totem.scale.setScalar(wide ? 1 : .5);
      mat.opacity = wide ? 1 : .5;
    };
    const size = () => {
      const w = parent.clientWidth, h = parent.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); layout();
    };
    size();
    window.addEventListener('resize', size);
    if (window.ResizeObserver) new ResizeObserver(size).observe(parent);

    let mx = 0, my = 0, tx = 0, ty = 0, visible = true;
    window.addEventListener('pointermove', e => { tx = e.clientX / window.innerWidth - .5; ty = e.clientY / window.innerHeight - .5; });
    new IntersectionObserver(en => { visible = en[0].isIntersecting; }).observe(cv);
    const clock = new T.Clock();
    (function loop() {
      requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      mx += (tx - mx) * .05; my += (ty - my) * .05;
      s1.rotation.y = t * .45; s2.rotation.y = -t * .35 + 1;
      totem.rotation.x = my * .25; totem.position.y += ((cam.aspect > 1.15 ? 0 : 4.6) + Math.sin(t * .8) * .18 - totem.position.y) * .05;
      wires.forEach(w => { w.rotation.y += w.userData.sp * 2; w.rotation.x += w.userData.sp; w.position.y += Math.sin(t + w.userData.fl) * .0025; });
      dust.rotation.y = t * .01 + mx * .1;
      cam.position.x = mx * 1.6; cam.position.y = -my * 1.0 - window.scrollY * .002;
      cam.lookAt(0, 0, 0);
      key.position.x = 4 + mx * 10; key.position.y = 4 - my * 8;
      renderer.render(scene, cam);
    })();
  }
  initGL();
})();
