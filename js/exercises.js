/* ============================================================
   EXERCISES.JS — hiển thị bài tập, checklist lưu localStorage
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const md = s => esc(s == null ? '' : s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const LEVELS = { warmup: '🟢 Khởi động', core: '🔵 Cơ bản', challenge: '🔴 Nâng cao', homework: '🏠 Về nhà', project: '🏗️ Đồ án' };

  let N = parseInt(new URLSearchParams(location.search).get('s') || localStorage.getItem('ex.last') || '1', 10);
  if (!(N >= 1 && N <= 12)) N = 1;
  let filter = 'all';
  const store = { get: k => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } }, set: (k, v) => localStorage.setItem(k, JSON.stringify(v)) };

  function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }

  function code(c, cls = '') {
    if (!c) return '';
    let html; const lang = c.lang || 'javascript';
    try { html = hljs.getLanguage(lang) ? hljs.highlight(c.src.trim(), { language: lang, ignoreIllegals: true }).value : esc(c.src); } catch (e) { html = esc(c.src); }
    return `<div class="code-block ${cls}"><div class="code-head"><i></i><i></i><i></i>${c.file ? `<span>${esc(c.file)}</span>` : ''}<em>${esc(lang)}</em></div><pre><code>${html}</code></pre></div>`;
  }
  function term(t) {
    const lines = String(t).trim().split('\n').map(l => /^\s*(\$|>)\s/.test(l) ? l.replace(/^(\s*)(\$|>)(\s)(.*)$/, (_, a, b, c, d) => `${a}<span class="p">${esc(b)}</span>${c}${esc(d)}`) : `<span class="o">${esc(l)}</span>`).join('\n');
    return `<div class="code-block term"><div class="code-head"><i></i><i></i><i></i><span>Kết quả mong đợi</span></div><pre><code>${lines}</code></pre></div>`;
  }

  function progressOf(n) {
    const st = store.get('ex.done.' + n); const keys = Object.keys(st).filter(k => st[k]);
    return keys.length;
  }
  function renderSide() {
    $('#side').innerHTML = '<h4>12 buổi học</h4>' + COURSE.sessions.map(s => {
      const ph = COURSE.phases.find(p => s.n >= p.range[0] && s.n <= p.range[1]);
      return `<div class="side-item ${s.n === N ? 'active' : ''}" data-n="${s.n}" style="--c:${ph.color}"><span class="no">B${pad(s.n)}</span><span class="tt">${esc(s.title)}</span><span class="pg" id="pg${s.n}">${progressOf(s.n) ? '✓' + progressOf(s.n) : ''}</span></div>`;
    }).join('');
    $$('.side-item').forEach(el => el.onclick = () => go(+el.dataset.n));
  }

  async function go(n) {
    N = n; localStorage.setItem('ex.last', n); history.replaceState(null, '', `?s=${n}`); filter = 'all';
    const meta = COURSE.sessions.find(x => x.n === n);
    document.title = `Bài tập B${pad(n)} · ${meta.title}`;
    renderSide();
    $('#main').innerHTML = '<div class="empty">Đang tải…</div>';
    if (!SESSION_DATA[n]) { try { await loadScript(`js/sessions/s${pad(n)}.js`); } catch (e) { } }
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function render() {
    const meta = COURSE.sessions.find(x => x.n === N); const data = SESSION_DATA[N];
    if (!data || !data.exercises) { $('#main').innerHTML = `<div class="sess-head"><h1>B${pad(N)} · ${esc(meta.title)}</h1></div><div class="empty">Bài tập buổi này đang được cập nhật.</div>`; return; }
    const ex = data.exercises;
    const totalMin = ex.reduce((a, b) => a + b.time, 0);
    const levels = [...new Set(ex.map(e => e.level))];
    const done = store.get('ex.done.' + N);
    const doneCnt = ex.filter((e, i) => done[`${i}`]).length;
    $('#main').innerHTML = `
      <section class="sess-head"><div class="big">B${pad(N)}</div>
        <div class="eyebrow">Bài tập · Buổi ${pad(N)} / 12</div><h1>${meta.icon} ${esc(meta.title)}</h1>
        <p>${esc(meta.subtitle)} — <strong>${ex.length} bài</strong>, khoảng <strong>${totalMin} phút</strong> (gồm cả bài về nhà).</p>
        <div class="sess-actions"><a class="btn primary" href="present.html?s=${N}">▶ Mở slide buổi này</a>
        <a class="btn" href="index.html#sessions">Tất cả buổi học</a>
        <div class="progress-ring"><span id="doneTxt">${doneCnt}/${ex.length} bài hoàn thành</span><div class="bar"><i id="doneBar" style="width:${doneCnt / ex.length * 100}%"></i></div></div></div></section>
      <div class="filters"><button data-f="all" class="on">Tất cả</button>${levels.map(l => `<button data-f="${l}">${LEVELS[l]}</button>`).join('')}</div>
      <div id="list">${ex.map((e, i) => card(e, i, done)).join('')}</div>
      <div class="ex-foot-note">💾 Tiến độ (tick checklist) được lưu trong trình duyệt của bạn. Bật <b>Chế độ giảng viên</b> ở góc trên để xem đáp án mẫu.</div>`;
    $$('.filters button').forEach(b => b.onclick = () => { filter = b.dataset.f; $$('.filters button').forEach(x => x.classList.toggle('on', x === b)); $$('.ex-card').forEach(c => c.style.display = (filter === 'all' || c.dataset.level === filter) ? '' : 'none'); });
    $$('.tasks input').forEach(inp => inp.onchange = onTick);
  }

  function card(e, i, done) {
    const tasks = (e.tasks || []).map((t, k) => `<li><label><input type="checkbox" data-ex="${i}" data-t="${k}" ${(store.get(`ex.task.${N}.${i}`)[k]) ? 'checked' : ''}><span>${md(t)}</span></label></li>`).join('');
    return `<article class="ex-card ${done[i] ? 'done' : ''}" data-level="${e.level}" id="ex${i}">
      <div class="ex-meta"><span class="id">#${N}.${i + 1}</span><span class="lv ${e.level}">${LEVELS[e.level]}</span><span class="tm">⏱ ${e.time} phút</span></div>
      <h3>${md(e.title)}</h3>
      <p class="desc">${md(e.desc)}</p>
      ${e.tasks ? `<h5>Yêu cầu</h5><ul class="tasks">${tasks}</ul>` : ''}
      ${e.expected ? `<h5>Kết quả mong đợi</h5>${typeof e.expected === 'string' ? term(e.expected) : code(e.expected)}` : ''}
      ${e.starter ? `<details><summary>📄 Code khởi đầu (starter)</summary><div class="inner">${code(e.starter)}</div></details>` : ''}
      ${e.hints ? `<details><summary>💡 Gợi ý (thử tự làm trước đã!)</summary><div class="inner"><ul class="hints">${e.hints.map(h => `<li>${md(h)}</li>`).join('')}</ul></div></details>` : ''}
      ${e.solution ? `<div class="teacher-only"><details class="solution"><summary>🔑 Đáp án mẫu (giảng viên)</summary><div class="inner">${Array.isArray(e.solution) ? e.solution.map(s => code(s)).join('') : code(e.solution)}${e.solutionNote ? `<p class="desc" style="margin-top:12px">${md(e.solutionNote)}</p>` : ''}</div></details></div>` : ''}
    </article>`;
  }

  function onTick(ev) {
    const inp = ev.target; const i = +inp.dataset.ex, k = inp.dataset.t;
    const key = `ex.task.${N}.${i}`; const st = store.get(key); st[k] = inp.checked; store.set(key, st);
    const total = $$(`input[data-ex="${i}"]`).length; const all = $$(`input[data-ex="${i}"]`).every(x => x.checked) && total > 0;
    const dk = 'ex.done.' + N; const d = store.get(dk); d[i] = all; store.set(dk, d);
    $('#ex' + i).classList.toggle('done', all);
    const ex = SESSION_DATA[N].exercises; const cnt = ex.filter((e, j) => d[j]).length;
    $('#doneTxt').textContent = `${cnt}/${ex.length} bài hoàn thành`; $('#doneBar').style.width = (cnt / ex.length * 100) + '%';
    const pg = $('#pg' + N); if (pg) pg.textContent = cnt ? '✓' + cnt : '';
  }

  $('#teacherMode').checked = localStorage.getItem('teacherMode') === '1';
  document.body.classList.toggle('teacher', $('#teacherMode').checked);
  $('#teacherMode').onchange = e => { localStorage.setItem('teacherMode', e.target.checked ? '1' : '0'); document.body.classList.toggle('teacher', e.target.checked); };
  $('#btnPrint').onclick = () => { $$('details').forEach(d => d.open = true); window.print(); };
  go(N);
})();
