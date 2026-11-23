/* ==========================================================
   INVICTUS — qr-code.js
   Générateur de QR Code pour la carte (qrcode-generator, 100 % local au navigateur).
   Aperçu · téléchargement PNG · version imprimable avec logo.
   ========================================================== */
(function () {
  'use strict';
  const { $, $$, markSVG, icon } = window.INV;
  const cardCv = $('#qr-card');
  if (!cardCv) return;

  const DEFAULT_URL = 'https://votre-domaine.com/menu.html';
  const KEY = 'invictus-qr-url';
  const urlIn = $('#qr-url'), msg = $('#qr-msg');
  let theme = 'dark';
  urlIn.value = localStorage.getItem(KEY) || DEFAULT_URL;

  const THEMES = {
    dark: { bg: '#050505', ink: '#ffffff', gold: '#c9a96a', goldL: '#ecd69b', panel: '#ffffff', qr: '#0a0a0a', sub: '#a39d90' },
    light: { bg: '#faf6ec', ink: '#0a0a0a', gold: '#a98547', goldL: '#8a6a30', panel: '#ffffff', qr: '#0a0a0a', sub: '#6f6a60' }
  };

  const loadImg = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
  const svgURI = ink => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markSVG(ink));

  function makeQR(text) {
    const qr = window.qrcode(0, 'H');
    qr.addData(text, 'Byte'); qr.make();
    return qr;
  }
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function spaced(ctx, text, cx, y, sp) {
    const w = [...text].reduce((a, c) => a + ctx.measureText(c).width + sp, -sp);
    let x = cx - w / 2; ctx.textAlign = 'left';
    [...text].forEach(c => { ctx.fillText(c, x, y); x += ctx.measureText(c).width + sp; });
  }
  function drawQR(ctx, qr, x, y, size, fg, bg, logo) {
    const n = qr.getModuleCount(), q = 3, cell = size / (n + q * 2);
    ctx.fillStyle = bg; ctx.fillRect(x, y, size, size);
    ctx.fillStyle = fg;
    const mid = n / 2, hole = n * 0.115; // zone du logo
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (!qr.isDark(r, c)) continue;
      if (Math.abs(r + .5 - mid) < hole && Math.abs(c + .5 - mid) < hole) continue;
      const px = x + (c + q) * cell, py = y + (r + q) * cell;
      rr(ctx, px + .3, py + .3, cell - .6, cell - .6, cell * .22); ctx.fill();
    }
    if (logo) {
      const L = hole * 2 * cell, cx = x + size / 2, cy = y + size / 2;
      ctx.fillStyle = bg; rr(ctx, cx - L / 2, cy - L / 2, L, L, L * .16); ctx.fill();
      const h = L * .78, w = h * 200 / 460;
      ctx.drawImage(logo, cx - w / 2, cy - h / 2, w, h);
    }
  }

  async function draw() {
    const text = urlIn.value.trim() || DEFAULT_URL;
    const T = THEMES[theme];
    try { await Promise.all([document.fonts.load('800 80px Unbounded'), document.fonts.load('italic 400 60px "Cormorant Garamond"'), document.fonts.load('400 30px Jost')]); } catch (e) { /* polices système */ }
    let qr;
    try { qr = makeQR(text); } catch (e) { msg.textContent = 'Lien trop long pour un QR Code.'; return; }
    const logoDark = await loadImg(svgURI('#0a0a0a'));

    const W = 1200, H = 1700, c = cardCv, ctx = c.getContext('2d');
    c.width = W; c.height = H;
    ctx.fillStyle = T.bg; ctx.fillRect(0, 0, W, H);
    // cadre
    ctx.strokeStyle = T.gold; ctx.lineWidth = 2; ctx.globalAlpha = .6; ctx.strokeRect(44, 44, W - 88, H - 88); ctx.globalAlpha = 1;
    // emblème
    const mark = await loadImg(svgURI(T.ink));
    if (mark) { const h = 300, w = h * 200 / 460; ctx.drawImage(mark, (W - w) / 2, 110, w, h); }
    // wordmark
    ctx.fillStyle = T.ink; ctx.textBaseline = 'alphabetic';
    ctx.font = '800 118px Unbounded, "Arial Black", sans-serif';
    spaced(ctx, 'INVICTUS', W / 2, 570, 4);
    // ligne or + RESTAURANT
    ctx.fillStyle = T.gold; ctx.fillRect(110, 630, W - 220, 5);
    ctx.fillStyle = T.ink; ctx.font = '400 34px Jost, Arial, sans-serif';
    spaced(ctx, 'RESTAURANT', W / 2, 712, 34);
    // QR
    const S = 700, qx = (W - S) / 2, qy = 790;
    ctx.fillStyle = T.panel; ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 12;
    rr(ctx, qx - 26, qy - 26, S + 52, S + 52, 10); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.strokeStyle = T.gold; ctx.lineWidth = 3; rr(ctx, qx - 26, qy - 26, S + 52, S + 52, 10); ctx.stroke();
    drawQR(ctx, qr, qx, qy, S, T.qr, T.panel, logoDark);
    // textes
    ctx.fillStyle = T.ink; ctx.textAlign = 'center';
    ctx.font = 'italic 400 66px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('Scannez pour découvrir notre carte', W / 2, 1600);
    ctx.fillStyle = T.sub; ctx.font = '300 24px Jost, Arial, sans-serif';
    ctx.fillText(text.replace(/^https?:\/\//, ''), W / 2, 1648);

    msg.textContent = '';
    localStorage.setItem(KEY, urlIn.value.trim());
    $('#qr-link').href = text; $('#qr-link').textContent = text;
  }

  const validUrl = () => { try { const u = new URL(urlIn.value.trim()); return /^https?:$/.test(u.protocol); } catch (e) { return false; } };
  let t;
  urlIn.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => { if (validUrl()) draw(); else msg.textContent = 'Saisissez un lien complet commençant par https://'; }, 250);
  });
  $('#qr-reset').addEventListener('click', () => { urlIn.value = DEFAULT_URL; draw(); });
  $$('.theme-sw button').forEach(b => b.addEventListener('click', () => {
    theme = b.dataset.t; $$('.theme-sw button').forEach(x => x.classList.toggle('on', x === b)); draw();
  }));

  const save = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
  $('#dl-card').addEventListener('click', async () => {
    if (!validUrl()) { msg.textContent = 'Lien invalide.'; return; }
    await draw(); cardCv.toBlob(b => save(b, 'invictus-carte-qr.png'), 'image/png');
  });
  $('#dl-qr').addEventListener('click', async () => {
    if (!validUrl()) { msg.textContent = 'Lien invalide.'; return; }
    const qr = makeQR(urlIn.value.trim()), logo = await loadImg(svgURI('#0a0a0a'));
    const c = document.createElement('canvas'); c.width = c.height = 1200;
    drawQR(c.getContext('2d'), qr, 0, 0, 1200, '#0a0a0a', '#ffffff', logo);
    c.toBlob(b => save(b, 'invictus-qr-seul.png'), 'image/png');
  });
  $('#print-qr').addEventListener('click', async () => {
    if (!validUrl()) { msg.textContent = 'Lien invalide.'; return; }
    await draw();
    $('#print-img').src = cardCv.toDataURL('image/png');
    setTimeout(() => window.print(), 150);
  });

  // inclinaison 3D de l'aperçu
  if (window.INV.canHover && !window.INV.reduce) {
    const st = $('.qr-stage');
    st.addEventListener('pointermove', e => {
      const r = st.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      cardCv.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
    });
    st.addEventListener('pointerleave', () => { cardCv.style.transform = ''; });
  }
  $$('[data-icon]').forEach(() => {});
  draw();
})();
