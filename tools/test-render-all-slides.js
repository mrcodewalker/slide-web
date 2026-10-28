const fs = require('fs');

global.window = global;
global.COURSE = {};
global.SESSION_DATA = {};
global.IMG_CREDITS = {};

eval(fs.readFileSync('js/curriculum.js', 'utf8'));
eval(fs.readFileSync('js/img-credits.js', 'utf8'));

// Test present.js rendering engine on each session from 1 to 12
for (let n = 1; n <= 12; n++) {
  const pad = String(n).padStart(2, '0');
  eval(fs.readFileSync(`js/sessions/s${pad}.js`, 'utf8'));
  const data = SESSION_DATA[n];
  const META = COURSE.sessions.find(x => x.n === n);
  const phase = COURSE.phases.find(p => n >= p.range[0] && n <= p.range[1]);
  const ACCENT = phase ? phase.color : '#68d391';

  // Mini-markdown
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const md = s => esc(s == null ? '' : s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/==([^=]+)==/g, '<mark>$1</mark>');

  function creditOf(src) {
    const c = (window.IMG_CREDITS || {})[src];
    if (!c) return '';
    return `<b>${esc(c.source || 'Wikimedia Commons')}${c.license ? ' · ' + esc(c.license) : ''}</b>`;
  }
  function imgHTML(im) {
    const arr = Array.isArray(im) ? im : [im];
    const figs = arr.map(i => {
      const cap = [i.cap ? md(i.cap) : '', creditOf(i.src)].filter(Boolean).join(' — ');
      const hStyle = i.h ? `--imgh:${Math.max(i.h, 540)}px;` : '--imgh:540px;';
      return `<figure class="media ${i.dark ? 'dark' : ''}" style="${hStyle}">
        <div class="paper" data-zoom><img src="assets/img/${esc(i.src)}" alt="${esc(i.alt || i.cap || '')}" loading="eager"></div>
        ${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`;
    }).join('');
    return arr.length > 1 ? `<div class="media-row">${figs}</div>` : figs;
  }

  function codeHTML(c, cls = '') {
    return `<div class="code-block ${cls}"><pre><code>${esc(c.src || '')}</code></pre></div>`;
  }
  function termHTML(t) { return `<div class="term"><pre>${esc(t)}</pre></div>`; }
  function bulletsHTML(items, cls = '') {
    const li = items.map(it => {
      if (typeof it === 'string') return `<li class="frag">${md(it)}</li>`;
      const sub = it.sub ? `<ul>${it.sub.map(x => `<li>${md(x)}</li>`).join('')}</ul>` : '';
      return `<li class="frag">${md(it.t)}${sub}</li>`;
    }).join('');
    return `<ul class="bullets ${cls}">${li}</ul>`;
  }
  function cardsHTML(cards, cols, small) {
    return `<div class="cards">${cards.map(c => `<div class="card">${c.h}</div>`).join('')}</div>`;
  }
  function stepsHTML(steps) { return `<div class="steps">${steps.map(s => `<div>${s.h}</div>`).join('')}</div>`; }
  function colsHTML(cols) { return `<div class="cols">${cols.map(c => `<div>${c.h || ''}</div>`).join('')}</div>`; }
  function tableHTML(t) { return `<table></table>`; }
  function calloutHTML(c) { return `<div class="callout">${md(c.t)}</div>`; }
  function quizHTML(q) { return `<div class="quiz">${md(q.q)}</div>`; }

  function bodyHTML(s) {
    const text = [], media = [], full = [];
    if (s.lead) text.push(`<p class="lead">${md(s.lead)}</p>`);
    if (s.steps) text.push(stepsHTML(s.steps));
    if (s.cards) text.push(cardsHTML(s.cards));
    if (s.bullets) text.push(bulletsHTML(s.bullets));
    if (s.callout) text.push(calloutHTML(s.callout));
    if (s.table) media.push(tableHTML(s.table));
    if (s.img) media.push(imgHTML(s.img));
    if (s.code) media.push(Array.isArray(s.code) ? s.code.map(c => codeHTML(c)).join('') : codeHTML(s.code));
    if (s.term) media.push(termHTML(s.term));
    if (Array.isArray(s.cols)) full.push(colsHTML(s.cols));
    if (s.quiz) full.push(quizHTML(s.quiz));

    const split = s.layout === 'split' || (s.layout !== 'stack' && s.img && !s.table && !s.code && !s.term && text.length > 0);
    if (split) {
      let ratio = s.ratio || '0.82fr 1.18fr';
      return `<div class="split" style="--ratio:${ratio}">${text.join('')}${media.join('')}</div>`;
    }
    return text.join('') + media.join('') + full.join('');
  }

  try {
    data.slides.forEach((s, idx) => {
      bodyHTML(s);
    });
    console.log(`Session ${n} renders OK (${data.slides.length} slides)`);
  } catch (err) {
    console.error(`Session ${n} ERROR on render:`, err);
  }
}
