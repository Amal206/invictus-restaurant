/* ==========================================================
   INVICTUS — gallery.js
   Galerie filtrable + visionneuse plein écran.
   Remplacez les "id" Pexels par vos propres photos : { src: "assets/images/x.jpg", ... }
   ========================================================== */
(function () {
  'use strict';
  const { $, $$, px, icon } = window.INV;
  const grid = $('#masonry');
  if (!grid) return;

  const CATS = ['Tous', 'Plats', 'Intérieur', 'Terrasse', 'Cheminée', 'Ambiance'];
  // w/h : proportions de l'image (évite les sauts de mise en page)
  const P = (id, w, h, cat, title) => ({ src: px(id, 900), full: px(id, 1800), w, h, cat, title });
  const PHOTOS = [
    P(24186303, 16, 9, 'Plats', 'Dressage signature'),
    P(26729398, 3, 2, 'Intérieur', 'La salle'),
    P(18078967, 3, 4, 'Plats', 'Risotto'),
    P(33630389, 3, 2, 'Terrasse', 'La terrasse'),
    P(31970869, 3, 2, 'Cheminée', 'Au coin du feu'),
    P(32966723, 4, 5, 'Plats', 'Pâtes aux fruits de mer'),
    P(15325595, 3, 4, 'Ambiance', 'Cocktails'),
    P(35326200, 3, 2, 'Intérieur', 'Lumières chaudes'),
    P(38431261, 3, 2, 'Plats', 'Poisson'),
    P(8412054, 3, 2, 'Terrasse', 'Dîner en plein air'),
    P(14458910, 4, 3, 'Plats', 'Antipasti'),
    P(36028725, 3, 2, 'Cheminée', 'Moment de calme'),
    P(33731580, 3, 2, 'Ambiance', 'Desserts'),
    P(12349437, 3, 2, 'Plats', 'Cordon bleu'),
    P(17001731, 3, 2, 'Intérieur', 'Art de la table'),
    P(6072033, 2, 3, 'Plats', "Poulet à l'orange"),
    P(14361690, 3, 2, 'Ambiance', 'Au bar'),
    P(9571433, 2, 3, 'Plats', 'Pâtes crémeuses'),
    P(33129959, 2, 3, 'Ambiance', 'Fraîcheur'),
    P(26182871, 2, 3, 'Plats', 'Rice balls'),
    P(28438607, 10, 9, 'Ambiance', 'Dessert dressé'),
    P(24186393, 16, 9, 'Plats', 'Volaille rôtie')
  ];

  let cur = 'Tous', list = PHOTOS, idx = 0;

  const fl = $('#filters');
  fl.innerHTML = CATS.map((c, i) => `<button class="${i ? '' : 'on'}" data-c="${c}">${c}</button>`).join('');
  fl.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    cur = b.dataset.c; $$('button', fl).forEach(x => x.classList.toggle('on', x === b)); render();
  });

  function render() {
    list = PHOTOS.filter(p => cur === 'Tous' || p.cat === cur);
    grid.innerHTML = list.map((p, i) => `
      <button class="g-item" style="--i:${i};aspect-ratio:${p.w}/${p.h}" data-i="${i}" aria-label="Agrandir : ${p.title}">
        <img src="${p.src}" alt="${p.title} — INVICTUS Restaurant" loading="lazy" width="${p.w * 100}" height="${p.h * 100}">
        <span class="frame"></span>
        <figcaption><small>${p.cat}</small><b>${p.title}</b></figcaption>
      </button>`).join('');
  }
  render();

  /* Visionneuse plein écran */
  const lb = $('#lb'), img = $('#lb-img');
  $('.lb-close', lb).innerHTML = icon('close', 20);
  $('.lb-prev', lb).innerHTML = icon('left', 20);
  $('.lb-next', lb).innerHTML = icon('arrow', 20);
  const show = i => {
    idx = (i + list.length) % list.length;
    const p = list[idx];
    img.classList.add('out');
    setTimeout(() => {
      img.src = p.full; img.alt = p.title;
      $('#lb-cat').textContent = p.cat; $('#lb-title').textContent = p.title;
      $('#lb-count').textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0');
      img.onload = () => img.classList.remove('out');
      if (img.complete) img.classList.remove('out');
    }, 260);
    [1, -1].forEach(d => { const n = list[(idx + d + list.length) % list.length]; new Image().src = n.full; });
  };
  const openLb = i => { lb.classList.add('open'); document.body.style.overflow = 'hidden'; lb.setAttribute('aria-hidden', 'false'); show(i); };
  const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; lb.setAttribute('aria-hidden', 'true'); };
  grid.addEventListener('click', e => { const b = e.target.closest('.g-item'); if (b) openLb(+b.dataset.i); });
  $('.lb-close', lb).addEventListener('click', closeLb);
  $('.lb-prev', lb).addEventListener('click', () => show(idx - 1));
  $('.lb-next', lb).addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLb(); });
  window.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });
  // Balayage tactile
  let sx = 0;
  lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); }, { passive: true });
})();
