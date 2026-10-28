/* ============================================================
   PRESENT.JS — Engine trình chiếu slide
   Slide schema: xem js/sessions/s01.js
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  /* mini-markdown: `code`, **bold**, ==mark== */
  const md = s => esc(s == null ? '' : s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/==([^=]+)==/g, '<mark>$1</mark>');

  const params = new URLSearchParams(location.search);
  let N = parseInt(params.get('s') || '1', 10);
  if (!(N >= 1 && N <= 12)) N = 1;
  const META = COURSE.sessions.find(x => x.n === N);
  const phase = COURSE.phases.find(p => N >= p.range[0] && N <= p.range[1]);
  const ACCENT = phase ? phase.color : '#68d391';

  const state = { i: 0, frag: 0, progressive: localStorage.getItem('present.progressive') === '1', slides: [], wraps: [] };

  function updateAnimUI() {
    const btn = $('#btnAnim');
    if (btn) {
      btn.innerHTML = state.progressive ? '✨ <span class="lbl">Từng ý</span>' : '⚡ <span class="lbl">Hiện hết</span>';
      btn.classList.toggle('on', state.progressive);
      btn.title = state.progressive ? 'Đang bật hiện từng ý (P) — Bấm để hiện toàn bộ ngay' : 'Đang hiện toàn bộ (P) — Bấm để bật hiện từng ý';
    }
  }
  function toggleAnim() {
    state.progressive = !state.progressive;
    localStorage.setItem('present.progressive', state.progressive ? '1' : '0');
    updateAnimUI();
    show(state.i, 1, !state.progressive);
  }

  /* ---------- load session ---------- */
  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }

  /* ---------- code highlight + line wrapping ---------- */
  function highlightLines(src, lang, hl) {
    let html;
    try {
      html = (lang && hljs.getLanguage(lang)) ? hljs.highlight(src, { language: lang, ignoreIllegals: true }).value : esc(src);
    } catch (e) { html = esc(src); }
    const lines = html.split('\n');
    const stack = [];
    const hlSet = new Set((hl || []).map(Number));
    const dimOthers = hlSet.size > 0;
    return lines.map((ln, idx) => {
      const open = stack.map(t => t).join('');
      let out = open + ln;
      const re = /<span[^>]*>|<\/span>/g; let m;
      while ((m = re.exec(ln))) { if (m[0] === '</span>') stack.pop(); else stack.push(m[0]); }
      out += '</span>'.repeat(stack.length);
      const cls = 'ln' + (hlSet.has(idx + 1) ? ' hl' : (dimOthers ? ' dim' : ''));
      return `<span class="${cls}">${out || ' '}</span>`;
    }).join('');
  }

  function codeHTML(c, extra = '') {
    if (!c) return '';
    const src = String(c.src).replace(/^\n+|\n+$/g, '');
    const n = src.split('\n').length;
    const size = c.size || (n > 22 ? 'xs' : n > 14 ? 'sm' : '');
    const lang = c.lang || 'javascript';
    return `<div class="code-block ${size} ${extra}">
      <div class="code-head"><i></i><i></i><i></i>${c.file ? `<span>${esc(c.file)}</span>` : ''}<em>${esc(lang)}</em></div>
      <pre><code>${highlightLines(src, lang, c.hl)}</code></pre></div>`;
  }

  function termHTML(t) {
    const raw = typeof t === 'string' ? t : t.src;
    const title = typeof t === 'string' ? 'Terminal' : (t.title || 'Terminal');
    const lines = String(raw).replace(/^\n+|\n+$/g, '').split('\n').map(l => {
      if (/^\s*(\$|>|PS>)\s/.test(l)) return l.replace(/^(\s*)(\$|>|PS>)(\s)(.*)$/, (_, a, b, c, d) => `<span class="ln">${a}<span class="p">${esc(b)}</span>${c}${esc(d)}</span>`);
      if (/^\s*(Error|error|ERR|TypeError|ReferenceError|✗)/.test(l)) return `<span class="ln e">${esc(l) || ' '}</span>`;
      return `<span class="ln o">${esc(l) || ' '}</span>`;
    }).join('');
    return `<div class="code-block term ${raw.split('\n').length > 12 ? 'sm' : ''}">
      <div class="code-head"><i></i><i></i><i></i><span>${esc(title)}</span><em>bash</em></div><pre><code>${lines}</code></pre></div>`;
  }

  /* ---------- image blocks ---------- */
  function creditOf(src) {
    const c = (window.IMG_CREDITS || {})[src];
    if (!c) return '';
    return `<b>${esc(c.source || 'Wikimedia Commons')}${c.license ? ' · ' + esc(c.license) : ''}</b>`;
  }
  function imgHTML(im) {
    const arr = Array.isArray(im) ? im : [im];
    const figs = arr.map(i => {
      const cap = [i.cap ? md(i.cap) : '', creditOf(i.src)].filter(Boolean).join(' — ');
      return `<figure class="media ${i.dark ? 'dark' : ''}" style="${i.h ? `--imgh:${i.h}px;` : ''}">
        <div class="paper" data-zoom><img src="assets/img/${esc(i.src)}" alt="${esc(i.alt || i.cap || '')}" loading="eager"></div>
        ${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
    }).join('');
    return arr.length > 1 ? `<div class="media-row">${figs}</div>` : figs;
  }
  function logosHTML(list) {
    return `<div class="logos">${list.map(l => `<div class="paper frag"><img src="assets/img/${esc(l)}" alt="${esc(l)}"></div>`).join('')}</div>`;
  }

  /* ---------- blocks ---------- */
  function bulletsHTML(items, cls = '') {
    const li = items.map(it => {
      if (typeof it === 'string') return `<li class="frag">${md(it)}</li>`;
      const sub = it.sub ? `<ul>${it.sub.map(x => `<li>${md(x)}</li>`).join('')}</ul>` : '';
      return `<li class="frag">${md(it.t)}${sub}</li>`;
    }).join('');
    return `<ul class="bullets ${cls}">${li}</ul>`;
  }
  function cardsHTML(cards, cols, small) {
    return `<div class="cards" style="--cols:${cols || Math.min(cards.length, 4)}">${cards.map(c =>
      `<div class="card frag ${small ? 'small' : ''}">${c.icon ? `<div class="ico">${c.icon}</div>` : ''}<h3>${md(c.h)}</h3>${c.p ? `<p>${md(c.p)}</p>` : ''}</div>`).join('')}</div>`;
  }
  function stepsHTML(steps, vertical) {
    return `<div class="steps ${vertical ? 'vertical' : ''}">${steps.map((s, i) =>
      `<div class="step frag"><div class="no">${s.no || i + 1}</div><h3>${md(s.h)}</h3>${s.p ? `<p>${md(s.p)}</p>` : ''}</div>`).join('')}</div>`;
  }
  function colsHTML(cols) {
    if (!Array.isArray(cols)) return '';
    return `<div class="cols" style="--cols:${cols.length}">${cols.map(c => `
      <div class="col frag ${c.cls || ''}">${c.h ? `<h3>${md(c.h)}</h3>` : ''}${c.p ? `<p>${md(c.p)}</p>` : ''}
      ${c.bullets ? bulletsHTML(c.bullets, 'compact').replace(/ frag"/g, '"') : ''}${c.code ? codeHTML(c.code, '') : ''}${c.img ? imgHTML(c.img) : ''}</div>`).join('')}</div>`;
  }
  function tableHTML(t) {
    return `<table class="tbl ${t.small ? 'small' : ''}"><thead><tr>${t.head.map(h => `<th>${md(h)}</th>`).join('')}</tr></thead><tbody>${
      t.rows.map(r => `<tr class="frag">${r.map(c => `<td>${md(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  function calloutHTML(c) {
    const icons = { tip: '💡', warn: '⚠️', info: 'ℹ️', danger: '⛔', demo: '🎬' };
    const type = c.type || 'tip';
    return `<div class="callout ${type} frag"><span class="ci">${c.icon || icons[type]}</span><div>${md(c.t)}</div></div>`;
  }
  function quizHTML(q) {
    const L = 'ABCD';
    return `<div class="quiz" data-a="${q.a}"><div class="q">${md(q.q)}</div>
      <div class="opts">${q.opts.map((o, i) => `<div class="opt" data-i="${i}"><b>${L[i]}</b><span>${md(o)}</span></div>`).join('')}</div>
      ${q.why ? `<div class="why">✅ ${md(q.why)}</div>` : ''}</div>`;
  }

  function bodyHTML(s) {
    const text = [], media = [], full = [];
    if (s.lead) text.push(`<p class="lead frag">${md(s.lead)}</p>`);
    if (s.steps) text.push(stepsHTML(s.steps, s.vertical));
    if (s.cards) text.push(cardsHTML(s.cards, typeof s.cols === 'number' ? s.cols : undefined, s.small));
    if (s.bullets) text.push(bulletsHTML(s.bullets, s.dense ? 'dense' : s.compact ? 'compact' : ''));
    if (s.logos) text.push(logosHTML(s.logos));
    if (s.callout) text.push(calloutHTML(s.callout));
    if (s.table) media.push(tableHTML(s.table));
    if (s.img) media.push(imgHTML(s.img));
    if (s.code) media.push(Array.isArray(s.code) ? `<div class="cols" style="--cols:${s.code.length}">${s.code.map(c => codeHTML(c)).join('')}</div>` : codeHTML(s.code));
    if (s.term) media.push(termHTML(s.term));
    if (Array.isArray(s.cols)) full.push(colsHTML(s.cols));
    if (s.quiz) full.push(quizHTML(s.quiz));

    const split = s.layout === 'split' || (s.layout !== 'stack' && s.img && !s.table && !s.code && !s.term && text.length > 0);
    // callout sau cùng nếu stack
    if (split) {
      const cls = ['split', s.top ? 'top' : '', s.rev ? 'rev' : ''].join(' ');
      return `<div class="${cls}" style="--ratio:${s.ratio || '1fr 1fr'}"><div class="col-text">${text.join('')}</div><div class="col-media">${media.join('')}</div></div>${full.join('')}`;
    }
    // stack: callout cuối
    const callIdx = text.findIndex(x => x.includes('class="callout'));
    let call = '';
    if (callIdx >= 0) call = text.splice(callIdx, 1)[0];
    return text.join('') + media.join('') + full.join('') + call;
  }

  /* ---------- slide builders ---------- */
  function footHTML(i, total) {
    return `<div class="slide-foot"><span>CT9 · BACK-END NODEJS · B${pad(N)}</span><span>${pad(i + 1)} / ${pad(total)}</span></div>`;
  }
  function slideHTML(s, i, total) {
    const kind = s.kind || 'content';
    let inner = '';
    if (kind === 'title') {
      inner = `<div class="course">CT9 · Back-end NodeJS · Buổi ${pad(N)} / 12</div>
        <div class="orbit"><i></i><i></i><i></i><div class="core">${META.icon}</div></div>
        <div class="hero"><div class="big-no">B${pad(N)}</div><h1>${md(META.title)}</h1><div class="sub">${md(META.subtitle)}</div>
        <div class="chips">${META.topics.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div></div>`;
      return wrap(`k-title`, inner);
    }
    if (kind === 'section') {
      inner = `<div class="ghost">${esc(s.no || '')}</div><div class="sec-no">PHẦN ${esc(s.no || '')}</div><h2>${md(s.title)}</h2>${s.sub ? `<p>${md(s.sub)}</p>` : ''}`;
      return wrap('k-section', inner);
    }
    if (kind === 'end') {
      const next = COURSE.sessions.find(x => x.n === N + 1);
      inner = `<div style="font-size:90px">🎉</div><h2 class="gradient-text">${md(s.title || 'Hết buổi học!')}</h2>
        <p class="lead" style="margin-top:18px">${md(s.lead || 'Cảm ơn cả lớp. Nhớ làm bài tập về nhà nhé!')}</p>
        ${next ? `<div class="next"><small>Buổi tiếp theo · B${pad(next.n)}</small><h3>${next.icon} ${md(next.title)}</h3><p>${md(next.subtitle)}</p></div>` : `<div class="next"><small>Kết thúc khóa học</small><h3>🏆 Chúc mừng các bạn hoàn thành chương trình Back-end!</h3></div>`}`;
      return wrap('k-end', inner);
    }
    const kick = s.kicker || `B${pad(N)} · ${META.title}`;
    const head = `<div class="slide-head"><div class="kicker">${s.badge ? `<span class="badge">${esc(s.badge)}</span>` : ''}${md(kick)}</div><h2>${md(s.title || '')}</h2></div>`;
    if (kind === 'agenda') {
      const tot = s.items.reduce((a, b) => a + b.min, 0);
      const mx = Math.max(...s.items.map(x => x.min));
      inner = head + `<div class="slide-body"><div class="slide-inner"><div class="timeline">${s.items.map(it => `
        <div class="tl-row frag"><div class="min">${it.min}′</div><div class="t">${md(it.t)}${it.d ? `<small>${md(it.d)}</small>` : ''}</div><div class="bar"><i style="width:${Math.round(it.min / mx * 100)}%"></i></div></div>`).join('')}</div>
        <p class="lead" style="font-size:22px">⏱ Tổng thời lượng dự kiến: <strong>${tot} phút</strong></p></div></div>`;
      return wrap('', inner);
    }
    if (kind === 'exercises') {
      inner = head + `<div class="slide-body"><div class="slide-inner"><div class="ex-list">${s.items.map(e => `
        <div class="ex-item frag"><span class="lv ${e.level}">${LEVELS[e.level] || e.level}</span><span class="t">${md(e.title)}</span><span class="tm">${e.time}′</span></div>`).join('')}</div>
        <p class="lead" style="font-size:22px">📝 Mở trang <a href="exercises.html?s=${N}" target="_blank" style="color:var(--green);text-decoration:underline">Bài tập B${pad(N)}</a> để xem đề chi tiết, gợi ý và checklist.</p></div></div>`;
      return wrap('', inner);
    }
    inner = head + `<div class="slide-body"><div class="slide-inner">${bodyHTML(s)}</div></div>`;
    return wrap(s.center ? 'k-center' : '', inner);

    function wrap(cls, content) {
      return `<div class="slide-wrap" data-n="${i + 1}"><section class="slide ${cls}" style="--accent:${ACCENT}">${content}${kind === 'title' ? '' : footHTML(i, total)}</section></div>`;
    }
  }
  const LEVELS = { warmup: 'Khởi động', core: 'Cơ bản', challenge: 'Nâng cao', homework: 'Về nhà', project: 'Đồ án' };

  function buildSlides(data) {
    const out = [{ kind: 'title', notes: data.intro || '' }];
    out.push({
      title: 'Mục tiêu buổi học', kicker: `B${pad(N)} · Bạn sẽ làm được gì?`,
      cards: META.outcomes.map((o, i) => ({ icon: ['🎯', '🧠', '🛠️', '🚀'][i % 4], h: o })), cols: 2, small: false,
      notes: 'Đọc nhanh mục tiêu, nhấn mạnh sản phẩm cuối buổi.'
    });
    if (data.agenda) out.push({ kind: 'agenda', title: 'Lịch trình buổi học', kicker: `B${pad(N)} · Agenda`, items: data.agenda });
    data.slides.forEach(s => out.push(s));
    if (data.recap) out.push({ title: 'Tổng kết buổi học', kicker: `B${pad(N)} · Recap`, bullets: data.recap, notes: 'Hỏi nhanh cả lớp: ý nào còn mơ hồ?' });
    if (data.exercises && data.exercises.length) out.push({ kind: 'exercises', title: 'Bài tập buổi này', kicker: `B${pad(N)} · Luyện tập`, items: data.exercises });
    if (data.project) out.push({ title: 'Cột mốc đồ án DevBlog API', kicker: `B${pad(N)} · Đồ án xuyên suốt`, badge: 'ĐỒ ÁN', lead: data.project.lead, bullets: data.project.tasks, callout: data.project.callout });
    out.push({ kind: 'end', notes: 'Nhắc deadline bài tập, chốt câu hỏi, giới thiệu buổi sau.' });
    return out;
  }

  /* ---------- scale / fit ---------- */
  function computeScale() {
    const stage = $('#stage');
    const W = window.innerWidth, H = window.innerHeight;
    const sessionPref = sessionStorage.getItem('present.viewMode');
    const isSmallScreen = W <= 880 || (H > W * 1.15 && W <= 1024);
    const isMobile = sessionPref ? (sessionPref === 'responsive') : isSmallScreen;

    if (isMobile) {
      document.body.classList.add('is-mobile-view');
      document.body.classList.remove('mode-cinema');
      stage.style.removeProperty('--s');
      const btn = $('#btnMode');
      if (btn) btn.innerHTML = '🖥️ <span class="lbl">Màn chiếu</span>';
      return;
    }

    document.body.classList.remove('is-mobile-view');
    document.body.classList.add('mode-cinema');
    const btn = $('#btnMode');
    if (btn) btn.innerHTML = '📱 <span class="lbl">Di động</span>';

    const pad_ = document.fullscreenElement ? 0 : 28;
    const topH = document.fullscreenElement ? 0 : 56;
    const s = Math.min((W - pad_ * 2) / 1600, (H - pad_ * 2 - topH) / 900);
    stage.style.setProperty('--s', Math.max(.2, s).toFixed(4));
    const tw = 330; // overview thumbnail width
    stage.style.setProperty('--ts', (tw / 1600).toFixed(4));
  }
  function fitSlide(wrapEl) {
    if (document.body.classList.contains('is-mobile-view')) return;
    const body = $('.slide-body', wrapEl); const inner = $('.slide-inner', wrapEl);
    if (!body || !inner) return;
    inner.style.transform = ''; inner.style.width = '';
    const avail = body.clientHeight; let r = 1;
    for (let k = 0; k < 6; k++) {
      inner.style.width = (100 / r) + '%';
      const h = inner.scrollHeight;
      if (h * r <= avail + 1) break;
      r = Math.max(.5, avail / h * 0.995);
      if (r <= .5) { inner.style.width = '200%'; break; }
    }
    if (r < 1) { inner.style.transform = `scale(${r})`; inner.style.transformOrigin = 'top left'; }
  }
  function fitAll() {
    if (document.body.classList.contains('is-mobile-view')) return;
    const wraps = state.wraps;
    wraps.forEach(w => { w.style.display = 'block'; w.style.visibility = 'hidden'; w.style.position = 'absolute'; });
    wraps.forEach(fitSlide);
    wraps.forEach(w => { w.style.display = ''; w.style.visibility = ''; w.style.position = ''; });
  }

  /* ---------- navigation ---------- */
  function fragsOf(w) { return $$('.frag', w); }
  function applyFrags(w, upTo) {
    const fr = fragsOf(w);
    fr.forEach((f, k) => f.classList.toggle('hidden', state.progressive && k >= upTo));
  }
  function show(i, dir = 1, fullFrags = false) {
    i = Math.max(0, Math.min(state.slides.length - 1, i));
    state.wraps.forEach((w, k) => { w.classList.toggle('active', k === i); w.classList.remove('enter-next', 'enter-prev'); });
    const w = state.wraps[i];
    if (i !== state.i || !w.dataset.seen) w.classList.add(dir >= 0 ? 'enter-next' : 'enter-prev');
    w.dataset.seen = 1;
    state.i = i;
    const total = fragsOf(w).length;
    state.frag = (fullFrags || !state.progressive) ? total : 0;
    applyFrags(w, state.frag);
    updateHUD();
    history.replaceState(null, '', `#${i + 1}`);
    if (document.body.classList.contains('overview')) return;
    if (document.body.classList.contains('is-mobile-view')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    requestAnimationFrame(() => fitSlide(w));
  }
  function next() {
    const w = state.wraps[state.i]; const total = fragsOf(w).length;
    if (state.progressive && state.frag < total) { state.frag++; applyFrags(w, state.frag); updateHUD(); return; }
    if (state.i < state.slides.length - 1) show(state.i + 1, 1);
  }
  function prev() {
    const w = state.wraps[state.i];
    if (state.progressive && state.frag > 0) { state.frag--; applyFrags(w, state.frag); return; }
    if (state.i > 0) show(state.i - 1, -1, true);
  }
  function updateHUD() {
    const n = state.slides.length;
    $('#counter').textContent = `${state.i + 1} / ${n}`;
    $('#progress i').style.width = ((state.i + 1) / n * 100) + '%';
    const notes = state.slides[state.i].notes;
    $('#notesBody').innerHTML = notes ? String(notes).split('\n').map(p => `<p>${md(p)}</p>`).join('') : '<p style="color:var(--text-mute)">— Slide này chưa có ghi chú —</p>';
  }

  /* ---------- UI ---------- */
  function toggleFs() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }
  function toggleOverview(force) {
    const on = force !== undefined ? force : !document.body.classList.contains('overview');
    document.body.classList.toggle('overview', on);
    $('#btnOverview').classList.toggle('on', on);
    if (!on) show(state.i, 1, !state.progressive);
    else { const a = state.wraps[state.i]; setTimeout(() => a && a.scrollIntoView({ block: 'center' }), 30); }
  }
  function toggleNotes() { $('#notes').classList.toggle('show'); $('#btnNotes').classList.toggle('on', $('#notes').classList.contains('show')); }

  let idleT;
  function wake() { document.body.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(() => { if (document.fullscreenElement && !$('#help').classList.contains('on')) document.body.classList.add('idle'); }, 2600); }

  let numBuf = '', numT;
  function bind() {
    $('#next').onclick = next; $('#prev').onclick = prev;
    $('#btnFs').onclick = toggleFs; $('#btnOverview').onclick = () => toggleOverview();
    $('#btnNotes').onclick = toggleNotes; $('#btnHelp').onclick = () => $('#help').classList.add('on');
    const btnMode = $('#btnMode');
    if (btnMode) {
      btnMode.onclick = () => {
        const isMobile = document.body.classList.contains('is-mobile-view');
        sessionStorage.setItem('present.viewMode', isMobile ? 'cinema' : 'responsive');
        localStorage.removeItem('present.viewMode');
        computeScale();
        if (!isMobile) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setTimeout(() => { fitAll(); fitSlide(state.wraps[state.i]); }, 60);
        }
      };
    }
    const btnAnim = $('#btnAnim');
    if (btnAnim) {
      updateAnimUI();
      btnAnim.onclick = toggleAnim;
    }
    const btnSkipAnim = $('#btnSkipAnim');
    if (btnSkipAnim) {
      btnSkipAnim.onclick = () => {
        const w = state.wraps[state.i];
        const total = fragsOf(w).length;
        state.frag = total;
        applyFrags(w, total);
      };
    }
    $('#help').onclick = () => $('#help').classList.remove('on');
    $('#lightbox').onclick = () => $('#lightbox').classList.remove('on');
    $('#timer').onclick = () => { t0 = Date.now(); };

    $('#deck').addEventListener('click', e => {
      const w = e.target.closest('.slide-wrap');
      if (document.body.classList.contains('overview') && w) { state.i = +w.dataset.n - 1; toggleOverview(false); return; }
      const z = e.target.closest('[data-zoom]');
      if (z) { const im = $('img', z); const lb = $('#lightbox'); $('img', lb).src = im.src; $('p', lb).innerHTML = (z.parentElement.querySelector('figcaption') || {}).innerHTML || ''; lb.classList.add('on'); return; }
      const opt = e.target.closest('.quiz .opt');
      if (opt) {
        const q = opt.closest('.quiz'); if (q.classList.contains('done')) return;
        const a = +q.dataset.a; $$('.opt', q).forEach((o, k) => { if (k === a) o.classList.add('right'); else if (o === opt) o.classList.add('wrong'); });
        q.classList.add('done'); fitSlide(opt.closest('.slide-wrap'));
      }
    });

    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      wake();
      const k = e.key;
      if ($('#help').classList.contains('on') && k !== '?') { if (k === 'Escape') $('#help').classList.remove('on'); return; }
      if (/^[0-9]$/.test(k)) { numBuf += k; clearTimeout(numT); numT = setTimeout(() => numBuf = '', 1600); return; }
      if (k === 'Enter' && numBuf) { show(parseInt(numBuf, 10) - 1, 1, true); numBuf = ''; return; }
      switch (k) {
        case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter': e.preventDefault(); next(); break;
        case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': e.preventDefault(); prev(); break;
        case 'Home': show(0, -1); break;
        case 'End': show(state.slides.length - 1, 1, true); break;
        case 'f': case 'F': toggleFs(); break;
        case 'g': case 'G': toggleOverview(); break;
        case 'Escape': if ($('#lightbox').classList.contains('on')) $('#lightbox').classList.remove('on'); else if (document.body.classList.contains('overview')) toggleOverview(false); else if ($('#notes').classList.contains('show')) toggleNotes(); break;
        case 'n': case 'N': toggleNotes(); break;
        case 'p': case 'P': toggleAnim(); break;
        case 'b': case 'B': $('#blackout').classList.toggle('on'); break;
        case 'l': case 'L': document.body.classList.toggle('laser'); break;
        case '?': $('#help').classList.toggle('on'); break;
        case '[': if (N > 1) location.href = `present.html?s=${N - 1}`; break;
        case ']': if (N < 12) location.href = `present.html?s=${N + 1}`; break;
      }
    });
    document.addEventListener('mousemove', e => { wake(); const l = $('#laser'); l.style.left = e.clientX + 'px'; l.style.top = e.clientY + 'px'; });
    document.addEventListener('fullscreenchange', () => { computeScale(); wake(); setTimeout(() => { fitAll(); fitSlide(state.wraps[state.i]); }, 60); });
    let rz; window.addEventListener('resize', () => { computeScale(); clearTimeout(rz); rz = setTimeout(() => fitSlide(state.wraps[state.i]), 80); });
    // swipe
    let sx = null; document.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    document.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) dx < 0 ? next() : prev(); sx = null; });
    window.addEventListener('hashchange', () => { const n = parseInt(location.hash.slice(1), 10); if (n && n - 1 !== state.i) show(n - 1, 1, true); });
  }

  let t0 = Date.now();
  setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); $('#timer').textContent = `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; }, 1000);

  /* ---------- init ---------- */
  async function init() {
    document.title = `B${pad(N)} · ${META.title} · Trình chiếu CT9`;
    $('#tbTitle').innerHTML = `<small>B${pad(N)}</small>${esc(META.title)}`;
    $('#btnEx').href = `exercises.html?s=${N}`;
    $('#sessionSel').innerHTML = COURSE.sessions.map(s => `<option value="${s.n}" ${s.n === N ? 'selected' : ''}>B${pad(s.n)} · ${esc(s.title)}</option>`).join('');
    $('#sessionSel').onchange = e => location.href = `present.html?s=${e.target.value}`;

    try { await loadScript(`js/sessions/s${pad(N)}.js`); } catch (e) { /* missing */ }
    const data = SESSION_DATA[N];
    if (!data) { $('#empty').classList.add('on'); $('#hud').style.display = 'none'; return; }

    state.slides = buildSlides(data);
    $('#deck').innerHTML = state.slides.map((s, i) => slideHTML(s, i, state.slides.length)).join('');
    state.wraps = $$('.slide-wrap');
    computeScale(); bind(); wake();
    // đợi ảnh & font rồi fit
    const imgs = $$('#deck img');
    const done = () => { fitAll(); const h = parseInt(location.hash.slice(1), 10); show(h ? h - 1 : 0, 1, !!h); };
    imgs.forEach(im => { im.addEventListener('load', () => fitSlide(im.closest('.slide-wrap'))); });
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(done));
    // zoom link target
    $$('a[target=_blank]').forEach(a => a.addEventListener('click', e => e.stopPropagation()));
  }
  init();
})();
