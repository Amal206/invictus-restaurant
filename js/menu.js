/* ==========================================================
   INVICTUS — menu.js
   ► TOUTES LES DONNÉES DE LA CARTE SONT ICI, faciles à modifier.
   - price : nombre en TND (ex. 18 ou 18.5). Laisser null tant que le prix n'est pas confirmé.
   - desc  : texte de description. Laisser "" tant qu'il n'est pas rédigé.
   - badge : null | "Populaire" | "Sélection du Chef"
   - img   : URL ou chemin local (ex. "assets/images/risotto.jpg")
   ========================================================== */
(function () {
  'use strict';
  const { $, $$, px, icon } = window.INV;

  const CATEGORIES = [
    { id: 'entrees', name: 'Entrées & <em>Antipasti</em>' },
    { id: 'pates', name: 'Pâtes <em>fraîches</em>' },
    { id: 'risottos', name: '<em>Risottos</em>' },
    { id: 'viandes', name: 'Viandes & <em>Steaks</em>' },
    { id: 'poissons', name: 'Poissons & <em>Fruits de Mer</em>' },
    { id: 'mediterraneen', name: 'Spécialités <em>Méditerranéennes</em>' },
    { id: 'vegetarien', name: 'Plats <em>Végétariens</em>' },
    { id: 'brunch', name: '<em>Brunch</em>' },
    { id: 'desserts', name: '<em>Desserts</em>' },
    { id: 'boissons', name: 'Cocktails & <em>Boissons</em>' }
  ];
  const SHORT = { entrees: 'Entrées', pates: 'Pâtes', risottos: 'Risottos', viandes: 'Viandes', poissons: 'Poissons', mediterraneen: 'Méditerranéen', vegetarien: 'Végétarien', brunch: 'Brunch', desserts: 'Desserts', boissons: 'Boissons' };

  const ITEMS = [
    { id: 'antipasti', cat: 'entrees', name: 'Antipasti', desc: '', price: null, badge: null, img: px(14458910) },
    { id: 'rice-ball', cat: 'entrees', name: 'Rice Ball', desc: '', price: null, badge: null, img: px(26182871) },
    { id: 'pates-fruits-de-mer', cat: 'pates', name: 'Pâtes aux Fruits de Mer', desc: '', price: null, badge: null, img: px(32966723) },
    { id: 'spaghetti-4-fromages', cat: 'pates', name: 'Spaghetti 4 Fromages', desc: '', price: null, badge: null, img: px(9571433) },
    { id: 'risotto-champagne', cat: 'risottos', name: 'Risotto Champagne', desc: '', price: null, badge: null, img: px(18078967) },
    { id: 'risotto-crevettes', cat: 'risottos', name: 'Risotto aux Crevettes', desc: '', price: null, badge: null, img: px(23627779) },
    { id: 'hamburger', cat: 'viandes', name: 'Hamburger', desc: '', price: null, badge: null, img: px(2128536) },
    { id: 'cordon-bleu', cat: 'viandes', name: 'Cordon Bleu', desc: '', price: null, badge: null, img: px(12349437) },
    { id: 'poulet-orange', cat: 'viandes', name: "Poulet à l'Orange", desc: '', price: null, badge: null, img: px(6072033) },
    { id: 'filet-thon', cat: 'poissons', name: 'Filet de Thon', desc: '', price: null, badge: null, img: px(38431261) },
    { id: 'crepe-thon-fromage', cat: 'brunch', name: 'Crêpe Salée Thon Fromage', desc: '', price: null, badge: null, img: px(20582728) },
    { id: 'virgin-mojito', cat: 'boissons', name: 'Virgin Mojito', desc: '', price: null, badge: null, img: px(33129959) },
    { id: 'the-menthe', cat: 'boissons', name: 'Thé à la Menthe', desc: '', price: null, badge: null, img: px(30497987) }
  ];
  window.INVICTUS_MENU = { CATEGORIES, ITEMS };

  const fmtPrice = p => (typeof p === 'number' && !isNaN(p)) ? `${String(p).replace('.', ',')} TND` : '— TND';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const plain = s => s.replace(/<[^>]+>/g, '');
  const catOf = id => CATEGORIES.find(c => c.id === id);

  /* ----- Sélection signature (page d'accueil) ----- */
  const sigBox = $('#signature-track');
  if (sigBox) {
    const picks = ['risotto-champagne', 'pates-fruits-de-mer', 'filet-thon', 'cordon-bleu', 'poulet-orange', 'antipasti', 'hamburger'];
    sigBox.innerHTML = picks.map(id => ITEMS.find(i => i.id === id)).filter(Boolean).map(i =>
      `<a class="sig" href="menu.html#${i.cat}" draggable="false">
         <img src="${i.img}" alt="${esc(i.name)}" loading="lazy" draggable="false">
         <div class="sig-body"><small>${esc(plain(catOf(i.cat).name))}</small><h3>${esc(i.name)}</h3><span>${fmtPrice(i.price)}</span></div>
       </a>`).join('');
  }

  /* ----- Carte digitale ----- */
  const root = $('#menu-root');
  if (!root) return;

  const cardHTML = i => `
    <button class="dish" data-id="${i.id}" aria-label="Voir ${esc(i.name)}">
      <div class="dish-img"><img src="${i.img}" alt="${esc(i.name)}" loading="lazy">${i.badge ? `<span class="badge">${esc(i.badge)}</span>` : ''}</div>
      <div class="dish-body">
        <h3>${esc(i.name)}</h3>
        ${i.desc ? `<p class="desc">${esc(i.desc)}</p>` : ''}
        <div class="dish-foot"><span class="price ${i.price == null ? 'tbd' : ''}">${fmtPrice(i.price)}</span><i>Voir</i></div>
      </div>
    </button>`;

  const state = { q: '', badge: '' };
  function render() {
    const q = state.q.trim().toLowerCase();
    let total = 0;
    root.innerHTML = CATEGORIES.map((c, idx) => {
      const list = ITEMS.filter(i => i.cat === c.id && (!state.badge || i.badge === state.badge) &&
        (!q || (i.name + ' ' + i.desc + ' ' + plain(c.name)).toLowerCase().includes(q)));
      const filtering = q || state.badge;
      if (filtering && !list.length) return '';
      total += list.length;
      return `<section class="cat-sec" id="${c.id}" data-cat="${c.id}">
        <div class="cat-head"><span class="no">${String(idx + 1).padStart(2, '0')}</span><h2>${c.name}</h2><small>${list.length} plat${list.length > 1 ? 's' : ''}</small></div>
        ${list.length ? `<div class="dishes">${list.map(cardHTML).join('')}</div>` : `<div class="empty">Cette rubrique sera complétée prochainement. <br><small>(Ajoutez vos plats dans js/menu.js)</small></div>`}
      </section>`;
    }).join('');
    $('#no-res').style.display = (total === 0 && (q || state.badge)) ? 'block' : 'none';
    spy();
  }

  /* Puces de catégories */
  const chips = $('#cats-in');
  chips.innerHTML = CATEGORIES.map(c => `<button class="cat-chip" data-go="${c.id}">${SHORT[c.id]}</button>`).join('');
  chips.addEventListener('click', e => {
    const b = e.target.closest('[data-go]'); if (!b) return;
    const t = document.getElementById(b.dataset.go);
    if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.replaceState(null, '', '#' + b.dataset.go); }
  });
  let spyTick = false;
  function spy() {
    spyTick = false;
    const secs = $$('.cat-sec'); let cur = null;
    secs.forEach(s => { if (s.getBoundingClientRect().top < 190) cur = s.id; });
    $$('.cat-chip', chips).forEach(c => {
      const on = c.dataset.go === cur;
      c.classList.toggle('on', on);
      if (on) { const cx = c.offsetLeft - chips.clientWidth / 2 + c.clientWidth / 2; chips.scrollTo({ left: cx, behavior: 'smooth' }); }
    });
  }
  window.addEventListener('scroll', () => { if (!spyTick) { spyTick = true; requestAnimationFrame(spy); } }, { passive: true });

  /* Recherche & filtres badge */
  $('#menu-search').addEventListener('input', e => { state.q = e.target.value; render(); });
  const badges = [...new Set(ITEMS.map(i => i.badge).filter(Boolean))];
  const tf = $('#tag-filters');
  if (badges.length) {
    tf.innerHTML = badges.map(b => `<button data-b="${esc(b)}">${esc(b)}</button>`).join('');
    tf.addEventListener('click', e => {
      const b = e.target.closest('[data-b]'); if (!b) return;
      state.badge = state.badge === b.dataset.b ? '' : b.dataset.b;
      $$('button', tf).forEach(x => x.classList.toggle('on', x.dataset.b === state.badge));
      render();
    });
  }

  /* Fiche plat (bottom sheet) */
  const sheet = $('#sheet');
  const open = id => {
    const i = ITEMS.find(x => x.id === id); if (!i) return;
    $('#sheet-img').src = i.img.replace(/w=\d+/, 'w=1200'); $('#sheet-img').alt = i.name;
    $('#sheet-cat').textContent = plain(catOf(i.cat).name) + (i.badge ? ' · ' + i.badge : '');
    $('#sheet-name').textContent = i.name;
    const d = $('#sheet-desc'); d.textContent = i.desc || ''; d.style.display = i.desc ? 'block' : 'none';
    const p = $('#sheet-price'); p.textContent = fmtPrice(i.price); p.classList.toggle('tbd', i.price == null);
    sheet.classList.add('open'); document.body.style.overflow = 'hidden';
  };
  const close = () => { sheet.classList.remove('open'); document.body.style.overflow = ''; };
  root.addEventListener('click', e => { const c = e.target.closest('.dish'); if (c) open(c.dataset.id); });
  sheet.addEventListener('click', e => { if (e.target === sheet || e.target.closest('.sheet-close')) close(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  $('.sheet-close', sheet).innerHTML = icon('close', 18);
  $('.search', document).insertAdjacentHTML('afterbegin', icon('search', 18));

  render();
  if (location.hash) setTimeout(() => { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView({ behavior: 'smooth' }); }, 1100);
})();
