/* ============================================================
   HOME.JS
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = n => (typeof n === 'number' ? String(n).padStart(2, '0') : String(n));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const phaseOf = n => (COURSE.phaseOf ? COURSE.phaseOf(n) : (COURSE.phases.find(p => typeof n === 'number' && p.range && n >= p.range[0] && n <= p.range[1]) || COURSE.phases[0]));

  /* stats */
  $('#stats').innerHTML = [
    ['15', 'Buổi học (3 FE + 12 BE)'], ['~45', 'Giờ học'], ['80+', 'Bài tập'], ['1', 'Đồ án thực tế']
  ].map(([b, s]) => `<div class="stat"><b>${b}</b><span>${s}</span></div>`).join('');

  /* typing terminal */
  const script = [
    ['<span class="c">// buổi 3 — Express chỉ với vài dòng</span>\n', 0],
    ['<span class="p">$</span> npm init -y &amp;&amp; npm i express\n', 380],
    ['<span class="o">added 64 packages in 3s</span>\n\n', 300],
    ['<span class="k">const</span> express = <span class="f">require</span>(<span class="s">\'express\'</span>);\n', 260],
    ['<span class="k">const</span> app = <span class="f">express</span>();\n\n', 200],
    ['app.<span class="f">get</span>(<span class="s">\'/api/posts\'</span>, (req, res) =&gt; {\n', 260],
    ['  res.<span class="f">json</span>({ ok: <span class="k">true</span>, data: [] });\n', 260],
    ['});\n\n', 120],
    ['app.<span class="f">listen</span>(<span class="s">3000</span>);\n\n', 200],
    ['<span class="p">$</span> node app.js\n', 400],
    ['<span class="o">🚀 Server chạy tại http://localhost:3000</span>', 300]
  ];
  (async function type() {
    const el = $('#typer'); if (!el) return;
    while (true) {
      el.innerHTML = '';
      for (const [html, wait] of script) {
        await new Promise(r => setTimeout(r, wait));
        const tmp = document.createElement('div'); tmp.innerHTML = html;
        // gõ từng ký tự của text, giữ nguyên thẻ span bằng cách thêm cả khối với hiệu ứng nhanh
        const full = html; let shown = 0;
        const textLen = tmp.textContent.length;
        const start = el.innerHTML;
        for (let k = 1; k <= 3; k++) { el.innerHTML = start + (k === 3 ? full : ''); await new Promise(r => setTimeout(r, 40)); }
      }
      await new Promise(r => setTimeout(r, 4200));
    }
  })();

  /* marquee logos */
  const logos = ['node-logo.svg', 'express-logo.png', 'mysql-logo.svg', 'jwt-logo.svg', 'npm-logo.svg', 'git-logo.svg', 'docker-logo.svg', 'js-logo.svg', 'postman-logo.png', 'nginx-logo.svg', 'html5-logo.svg', 'css3-logo.svg'];
  const lg = logos.map(l => `<div class="lg"><img src="assets/img/${l}" alt="${l.split('-')[0]}" onerror="this.parentNode.remove()"></div>`).join('');
  $('#marquee').innerHTML = lg + lg;

  /* roadmap */
  const phaseTopics = {
    FE: ['HTML5 Semantic & Forms', 'CSS3 Flexbox, Grid & Responsive', 'JavaScript DOM, Events & Fetch API'],
    A: ['Client–Server & HTTP', 'Node runtime, npm', 'async/await, http module'],
    B: ['Express, Router', 'Middleware', 'REST API & CRUD', 'MVC, .env'],
    C: ['ER Diagram, SQL', 'mysql2, Pool', 'Sequelize ORM'],
    D: ['bcrypt, JWT', 'Phân quyền (RBAC)', 'Joi, helmet, rate limit'],
    E: ['multer, phân trang', 'Nối Front-end (fetch)', 'Jest, Swagger, Deploy']
  };
  $('#roadmapGrid').innerHTML = COURSE.phases.map((p, i) => {
    const rangeText = p.sessionIds ? `${p.sessionIds.length} buổi nền tảng` : `Buổi ${pad(p.range[0])}${p.range[1] !== p.range[0] ? ' – ' + pad(p.range[1]) : ''}`;
    const target = p.sessionIds ? p.sessionIds[0] : p.range[0];
    return `
    <div class="phase" style="--c:${p.color}" data-go="${target}">
      <div class="node">${p.id === 'FE' ? '★' : i}</div><h3>${p.name}</h3>
      <div class="rg">${rangeText}</div>
      <ul>${(phaseTopics[p.id] || []).map(t => `<li>• ${t}</li>`).join('')}</ul></div>`;
  }).join('');
  $$('.phase').forEach(el => el.onclick = () => {
    const target = el.dataset.go; const t = $(`#tabs button[data-p="${phaseOf(target).id}"]`); t && t.click();
    $('#sessions').scrollIntoView({ behavior: 'smooth' });
  });

  /* tabs + cards */
  let cur = 'all';
  $('#tabs').innerHTML = `<button class="on" data-p="all">Tất cả</button>` + COURSE.phases.map(p => `<button data-p="${p.id}" style="--c:${p.color}">${p.name}</button>`).join('');
  function renderCards() {
    $('#sessionGrid').innerHTML = COURSE.sessions.filter(s => cur === 'all' || phaseOf(s.n).id === cur).map(s => {
      const p = phaseOf(s.n);
      const tag = s.code || ('B' + pad(s.n));
      return `<article class="s-card fade-up in" style="--c:${p.color}">
        <div class="s-top"><div class="s-no">${tag}</div><div class="s-ico">${s.icon}</div></div>
        <h3>${esc(s.title)}</h3><p>${esc(s.subtitle)}</p>
        <div class="s-topics">${s.topics.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
        <div class="s-actions">
          <a class="btn primary" href="present.html?s=${s.n}">▶ Trình chiếu</a>
          <a class="btn" href="exercises.html?s=${s.n}">📝 Bài tập</a>
          <button class="btn ghost" data-info="${s.n}" title="Chi tiết buổi học">ⓘ</button>
        </div></article>`;
    }).join('');
    $$('[data-info]').forEach(b => b.onclick = () => openModal(b.dataset.info));
  }
  $$('#tabs button').forEach(b => b.onclick = () => { cur = b.dataset.p; $$('#tabs button').forEach(x => x.classList.toggle('on', x === b)); renderCards(); });
  renderCards();

  /* modal */
  function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
  async function openModal(rawN) {
    const s = COURSE.sessions.find(x => String(x.n) === String(rawN) || (x.code && x.code.toLowerCase() === String(rawN).toLowerCase())) || COURSE.sessions[0];
    const n = s.n;
    const tag = s.code || ('B' + pad(n));
    const p = phaseOf(n);
    const modal = $('#modal'); modal.classList.add('on'); document.body.style.overflow = 'hidden';
    const box = $('#modalBox'); box.style.setProperty('--c', p.color);
    const draw = (d) => {
      const ag = d && d.agenda ? `<h4>Lịch trình (${d.agenda.reduce((a, b) => a + b.min, 0)} phút)</h4><div class="m-agenda">${d.agenda.map(a => `<div class="row"><b>${a.min}′</b><div>${esc(a.t)}${a.d ? `<small>${esc(a.d)}</small>` : ''}</div></div>`).join('')}</div>` : '';
      const ex = d && d.exercises ? `<h4>Bài tập (${d.exercises.length})</h4><ul class="out">${d.exercises.map(e => `<li>${esc(e.title)} <span style="color:var(--text-mute)">· ${e.time}′</span></li>`).join('')}</ul>` : '';
      box.innerHTML = `<button class="modal-close" aria-label="Đóng">✕</button>
        <div class="m-no">${tag} · ${p.name.toUpperCase()}</div><h3>${s.icon} ${esc(s.title)}</h3><p>${esc(s.subtitle)}</p>
        <h4>Sau buổi học, học viên sẽ…</h4><ul class="out">${s.outcomes.map(o => `<li>${esc(o)}</li>`).join('')}</ul>${ag}${ex}
        <div class="modal-actions"><a class="btn primary" href="present.html?s=${n}">▶ Mở slide</a><a class="btn" href="exercises.html?s=${n}">📝 Xem bài tập</a></div>`;
      $('.modal-close', box).onclick = closeModal;
    };
    draw(window.SESSION_DATA[n]);
    if (!window.SESSION_DATA[n]) { try { await loadScript(`js/sessions/s${pad(n)}.js`); draw(window.SESSION_DATA[n]); } catch (e) { } }
  }
  function closeModal() { $('#modal').classList.remove('on'); document.body.style.overflow = ''; }
  $('#modal').onclick = e => { if (e.target.id === 'modal') closeModal(); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* interactive lightbox for homepage illustrations */
  const homeLightbox = $('#homeLightbox');
  const hlImg = $('#hlImg');
  const hlCap = $('#hlCap');
  const hlClose = $('#hlClose');

  function openHomeLightbox(src, caption) {
    if (!homeLightbox || !hlImg) return;
    hlImg.src = src;
    hlImg.alt = caption || 'Hình minh họa';
    if (hlCap) hlCap.textContent = caption || '';
    homeLightbox.classList.add('on');
    homeLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeHomeLightbox() {
    if (!homeLightbox) return;
    homeLightbox.classList.remove('on');
    homeLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hlClose) hlClose.onclick = closeHomeLightbox;
  if (homeLightbox) {
    homeLightbox.onclick = e => {
      if (e.target === homeLightbox || e.target.classList.contains('hl-dialog') || e.target.id === 'hlClose') {
        closeHomeLightbox();
      }
    };
  }

  // Attach click to all paper illustrations and float logos
  $$('.paper, .arch .paper, .project .paper, .float-logo').forEach(el => {
    el.style.cursor = 'zoom-in';
    el.onclick = () => {
      const img = el.querySelector('img');
      if (!img) return;
      const figcaption = el.closest('figure')?.querySelector('figcaption');
      const caption = img.alt || (figcaption ? figcaption.textContent.trim().split('\n')[0] : 'Hình minh họa kiến trúc');
      openHomeLightbox(img.src, caption);
    };
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeHomeLightbox();
      closeModal();
    }
  });

  /* reveal on scroll */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.fade-up').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
})();
