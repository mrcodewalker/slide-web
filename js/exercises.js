/* ============================================================
   EXERCISES.JS — hiển thị bài tập, checklist, PDF Preview & Tải PDF
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = n => (typeof n === 'number' ? String(n).padStart(2, '0') : String(n));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const md = s => esc(s == null ? '' : s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  const LEVELS = { warmup: '🟢 Khởi động', core: '🔵 Cơ bản', challenge: '🔴 Nâng cao', homework: '🏠 Về nhà', project: '🏗️ Đồ án' };
  const LEVEL_NAMES = { warmup: 'Khởi động', core: 'Cơ bản', challenge: 'Nâng cao', homework: 'Về nhà', project: 'Đồ án' };

  const params = new URLSearchParams(location.search);
  const rawS = params.get('s') || params.get('session') || params.get('b') || localStorage.getItem('ex.last') || '1';
  let meta = COURSE.sessions.find(x => String(x.n).toLowerCase() === String(rawS).toLowerCase() || (x.code && x.code.toLowerCase() === String(rawS).toLowerCase()));
  if (!meta) {
    const num = parseInt(rawS, 10);
    meta = COURSE.sessions.find(x => x.n === num);
  }
  if (!meta) meta = COURSE.sessions[0];
  let N = meta.n;
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
    $('#side').innerHTML = `<h4>${COURSE.sessions.length} buổi học</h4>` + COURSE.sessions.map(s => {
      const ph = COURSE.phaseOf ? COURSE.phaseOf(s.n) : (COURSE.phases.find(p => typeof s.n === 'number' && p.range && s.n >= p.range[0] && s.n <= p.range[1]) || COURSE.phases[0]);
      const tag = s.code || ('B' + pad(s.n));
      return `<div class="side-item ${String(s.n) === String(N) ? 'active' : ''}" data-n="${s.n}" style="--c:${ph.color}"><span class="no">${tag}</span><span class="tt">${esc(s.title)}</span><span class="pg" id="pg${s.n}">${progressOf(s.n) ? '✓' + progressOf(s.n) : ''}</span></div>`;
    }).join('');
    $$('.side-item').forEach(el => el.onclick = () => go(el.dataset.n));
  }

  async function go(n) {
    const matched = COURSE.sessions.find(x => String(x.n).toLowerCase() === String(n).toLowerCase() || (x.code && x.code.toLowerCase() === String(n).toLowerCase()));
    N = matched ? matched.n : (isNaN(Number(n)) ? n : Number(n));
    localStorage.setItem('ex.last', N);
    history.replaceState(null, '', `?s=${N}`);
    filter = 'all';
    const curMeta = COURSE.sessions.find(x => String(x.n) === String(N)) || COURSE.sessions[0];
    const tag = curMeta.code || ('B' + pad(curMeta.n));
    document.title = `Bài tập ${tag} · ${curMeta.title}`;
    renderSide();
    $('#main').innerHTML = '<div class="empty">Đang tải…</div>';
    if (!SESSION_DATA[N]) { try { await loadScript(`js/sessions/s${pad(N)}.js`); } catch (e) { } }
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function render() {
    const curMeta = COURSE.sessions.find(x => String(x.n) === String(N)) || COURSE.sessions[0];
    const data = SESSION_DATA[N];
    const tag = curMeta.code || ('B' + pad(N));
    if (!data || !data.exercises) { $('#main').innerHTML = `<div class="sess-head"><h1>${tag} · ${esc(curMeta.title)}</h1></div><div class="empty">Bài tập buổi này đang được cập nhật.</div>`; return; }
    const ex = data.exercises;
    const totalMin = ex.reduce((a, b) => a + b.time, 0);
    const levels = [...new Set(ex.map(e => e.level))];
    const done = store.get('ex.done.' + N);
    const doneCnt = ex.filter((e, i) => done[`${i}`]).length;
    $('#main').innerHTML = `
      <section class="sess-head"><div class="big">${tag}</div>
        <div class="eyebrow">Bài tập · ${tag}</div><h1>${curMeta.icon} ${esc(curMeta.title)}</h1>
        <p>${esc(meta.subtitle)} — <strong>${ex.length} bài</strong>, khoảng <strong>${totalMin} phút</strong> (gồm cả bài về nhà).</p>
        <div class="sess-actions">
          <a class="btn primary" href="present.html?s=${N}">▶ Mở slide buổi này</a>
          <button class="btn primary" id="btnSessPdf" style="background:linear-gradient(135deg, #10b981, #059669);border-color:#10b981">📄 Xem trước PDF & Tải về</button>
          <a class="btn" href="index.html#sessions">Tất cả buổi học</a>
          <div class="progress-ring"><span id="doneTxt">${doneCnt}/${ex.length} bài hoàn thành</span><div class="bar"><i id="doneBar" style="width:${doneCnt / ex.length * 100}%"></i></div></div>
        </div>
      </section>
      <div class="filters"><button data-f="all" class="on">Tất cả</button>${levels.map(l => `<button data-f="${l}">${LEVELS[l]}</button>`).join('')}</div>
      <div id="list">${ex.map((e, i) => card(e, i, done)).join('')}</div>
      <div class="ex-foot-note">💾 Tiến độ (tick checklist) được lưu trong trình duyệt của bạn. Bật <b>Chế độ giảng viên</b> ở góc trên để xem đáp án mẫu. Bấm <b>📄 Xem PDF & Tải về</b> để xuất tài liệu nộp bài chuẩn A4.</div>`;
    
    $$('.filters button').forEach(b => b.onclick = () => { filter = b.dataset.f; $$('.filters button').forEach(x => x.classList.toggle('on', x === b)); $$('.ex-card').forEach(c => c.style.display = (filter === 'all' || c.dataset.level === filter) ? '' : 'none'); });
    $$('.tasks input').forEach(inp => inp.onchange = onTick);
    
    const sessPdfBtn = $('#btnSessPdf');
    if (sessPdfBtn) sessPdfBtn.onclick = openPdfModal;
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

  /* ============================================================
     PDF PREVIEW & EXPORT ENGINE
     ============================================================ */
  function showToast(msg, duration = 3500) {
    const toast = $('#pdfToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
  }

  function renderPdfPaper() {
    const meta = COURSE.sessions.find(x => x.n === N) || {};
    const data = SESSION_DATA[N] || {};
    const ex = data.exercises || [];
    const totalMin = ex.reduce((a, b) => a + b.time, 0);

    // Calculate score distribution
    const scorePerEx = (10 / (ex.length || 1)).toFixed(1);

    const summaryRows = ex.map((e, idx) => `
      <tr>
        <td style="text-align:center;font-weight:700">#${N}.${idx + 1}</td>
        <td><b>${esc(e.title)}</b></td>
        <td><span class="pp-badge ${e.level}">${LEVEL_NAMES[e.level] || e.level}</span></td>
        <td style="text-align:center">${e.time} phút</td>
        <td style="text-align:center;font-weight:700;color:#000000">${scorePerEx} đ</td>
      </tr>
    `).join('');

    const exerciseCards = ex.map((e, idx) => {
      const taskList = (e.tasks || []).map(t => `<li>${md(t)}</li>`).join('');
      
      let starterCode = '';
      if (e.starter && e.starter.src) {
        starterCode = `
          <div class="pp-code">
            <div class="pp-code-head">
              <span>📄 Code khởi đầu: ${esc(e.starter.file || 'starter.js')}</span>
              <span>${esc(e.starter.lang || 'javascript')}</span>
            </div>
            <pre><code>${esc(e.starter.src.trim())}</code></pre>
          </div>
        `;
      }

      let expectedBox = '';
      if (e.expected) {
        const text = typeof e.expected === 'string' ? e.expected : (e.expected.src || '');
        expectedBox = `
          <div class="pp-code term">
            <div class="pp-code-head"><span>🖥️ Kết quả mong đợi (Terminal / Test Output)</span></div>
            <pre><code>${esc(text.trim())}</code></pre>
          </div>
        `;
      }

      let hintsBox = '';
      if (e.hints && e.hints.length) {
        hintsBox = `
          <div class="pp-hints">
            <h5>💡 Gợi ý thực hiện:</h5>
            <ul>${e.hints.map(h => `<li>${md(h)}</li>`).join('')}</ul>
          </div>
        `;
      }

      return `
        <div class="pp-ex-card">
          <div class="pp-ex-head">
            <div class="title-group">
              <span class="pp-ex-no">Bài #${N}.${idx + 1}</span>
              <h3>${md(e.title)}</h3>
            </div>
            <div class="pp-ex-meta">
              <span class="pp-badge ${e.level}">${LEVEL_NAMES[e.level] || e.level}</span>
              <span class="pp-ex-time">⏱ ${e.time} phút</span>
            </div>
          </div>
          <p class="pp-ex-desc">${md(e.desc)}</p>
          ${e.tasks ? `<div class="pp-tasks-title">Yêu cầu cần hoàn thành:</div><ul class="pp-tasks-list">${taskList}</ul>` : ''}
          ${starterCode}
          ${expectedBox}
          ${hintsBox}
        </div>
      `;
    }).join('');

    const paperHtml = `
      <div class="pp-header">
        <div class="pp-inst-left">
          <h4>HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</h4>
          <h3>KHOA CÔNG NGHỆ THÔNG TIN</h3>
          <p>Học phần: Lập trình Web Back-end (Node.js & Express) · Lớp: <b>${esc(COURSE.className)}</b></p>
        </div>
        <div class="pp-inst-right">
          <div class="tag">PHIẾU BÀI TẬP THỰC HÀNH</div>
          <p><b>Buổi học:</b> ${meta.code || ('B' + pad(N))}</p>
          <p><b>Thời lượng:</b> ${totalMin} phút</p>
          <p><b>Học phần:</b> Web Fullstack</p>
        </div>
      </div>

      <div class="pp-banner">
        <div class="kicker">BÀI TẬP THỰC HÀNH TẠI LỚP & VỀ NHÀ</div>
        <h1>${meta.icon || '📌'} ${meta.code || ('Buổi ' + pad(N))}: ${esc(meta.title || '')}</h1>
        <p class="sub">${esc(meta.subtitle || '')}</p>
      </div>

      <div class="pp-student-box">
        <div class="pp-field">
          <label>Họ và tên sinh viên</label>
          <span>.......................................................</span>
        </div>
        <div class="pp-field">
          <label>Mã sinh viên (MSSV)</label>
          <span>....................................</span>
        </div>
        <div class="pp-field">
          <label>Nhóm / Lớp học phần</label>
          <span>${esc(COURSE.className)}</span>
        </div>
        <div class="pp-field score">
          <label>Điểm đánh giá</label>
          <span>....... / 10</span>
        </div>
      </div>

      <div class="pp-sec-title">I. MỤC TIÊU & TỔNG QUAN BÀI THỰC HÀNH</div>
      <ul class="pp-outcomes">
        ${(meta.outcomes || []).map(o => `<li>${esc(o)}</li>`).join('')}
      </ul>

      <table class="pp-summary-tbl">
        <thead>
          <tr>
            <th style="width:60px;text-align:center">Mã bài</th>
            <th>Tên bài tập</th>
            <th style="width:110px">Cấp độ</th>
            <th style="width:90px;text-align:center">Thời gian</th>
            <th style="width:80px;text-align:center">Điểm tối đa</th>
          </tr>
        </thead>
        <tbody>
          ${summaryRows}
        </tbody>
      </table>

      <div class="pp-sec-title">II. NỘI DUNG CHI TIẾT CÁC BÀI TẬP</div>
      <div class="pp-exercises-list">
        ${exerciseCards}
      </div>

      <div class="pp-sec-title">III. TIÊU CHÍ ĐÁNH GIÁ & QUY ĐỊNH NỘP BÀI</div>
      <div class="pp-rubric">
        <h4>1. Thang điểm đánh giá bài thực hành (10 điểm):</h4>
        <ul>
          <li><b>Chức năng & Tính đúng đắn (5.0 điểm):</b> Mã nguồn chạy không lỗi, đáp ứng đầy đủ các yêu cầu đầu ra và test case mẫu.</li>
          <li><b>Cấu trúc code & Chuẩn NodeJS/Express (2.5 điểm):</b> Đặt tên biến/hàm theo quy chuẩn, tách module/file rõ ràng, áp dụng Clean Code.</li>
          <li><b>Xử lý lỗi & Ngoại lệ (1.5 điểm):</b> Bắt lỗi bất đồng bộ, kiểm tra dữ liệu đầu vào (validation), không làm crash server Node.</li>
          <li><b>Quy trình Git & Tài liệu (1.0 điểm):</b> Commit có ý nghĩa, có file <code>README.md</code> hướng dẫn cách cài đặt và chạy ứng dụng.</li>
        </ul>

        <h4>2. Hướng dẫn nộp bài:</h4>
        <ul>
          <li>Sinh viên đẩy toàn bộ mã nguồn lên GitHub cá nhân (không commit thư mục <code>node_modules</code> và file <code>.env</code> nhạy cảm).</li>
          <li>Nộp đường dẫn (link) repository GitHub hoặc file nén <code>.zip</code> lên hệ thống nộp bài của giảng viên trước thời hạn quy định.</li>
        </ul>

        <div class="pp-sign-row">
          <div class="pp-sign-col">
            <p><b>XÁC NHẬN CỦA SINH VIÊN</b></p>
            <p><i>(Ký và ghi rõ họ tên)</i></p>
            <div class="sign-space"></div>
            <p>................................................................</p>
          </div>
          <div class="pp-sign-col">
            <p><b>GIẢNG VIÊN ĐÁNH GIÁ</b></p>
            <p><i>(Ký, ghi điểm và nhận xét)</i></p>
            <div class="sign-space"></div>
            <p>................................................................</p>
          </div>
        </div>
      </div>
    `;

    $('#pdfPaper').innerHTML = paperHtml;
  }

  function openPdfModal() {
    renderPdfPaper();
    const meta = COURSE.sessions.find(x => x.n === N) || {};
    $('#pdfModalTitle').textContent = `Phiếu bài tập Buổi ${pad(N)}: ${meta.title || ''}`;
    $('#pdfModal').classList.add('open');
    $('#pdfModal').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePdfModal() {
    $('#pdfModal').classList.remove('open');
    $('#pdfModal').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  async function downloadPdf() {
    const btn = $('#btnDownloadPdf');
    const spinner = $('#pdfSpinner');
    const text = $('#pdfBtnText');

    btn.disabled = true;
    if (spinner) spinner.style.display = 'inline-block';
    if (text) text.textContent = 'Đang tạo PDF...';
    showToast('⏳ Đang tạo file PDF chất lượng cao, vui lòng đợi vài giây...', 4000);

    const element = $('#pdfPaper');
    const filename = `Bai-tap-NodeJS-B${pad(N)}-CT9.pdf`;

    const opt = {
      margin: [10, 10, 12, 10], // top, left, bottom, right in mm
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      if (window.html2pdf) {
        await html2pdf().set(opt).from(element).save();
        showToast(`✅ Đã tải xuống thành công: ${filename}`, 5000);
      } else {
        // Fallback to print
        showToast('Đang mở hộp thoại In để lưu thành PDF...', 3000);
        window.print();
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('⚠️ Không thể xuất PDF tự động, đang chuyển sang in trình duyệt...', 3000);
      window.print();
    } finally {
      btn.disabled = false;
      if (spinner) spinner.style.display = 'none';
      if (text) text.textContent = '📥 Tải xuống PDF';
    }
  }

  // Bind PDF Controls
  $('#btnPdfPreview').onclick = openPdfModal;
  $('#btnPdfClose').onclick = closePdfModal;
  $('#pdfModalBackdrop').onclick = closePdfModal;
  $('#btnDownloadPdf').onclick = downloadPdf;
  $('#btnPrintModal').onclick = () => window.print();

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && $('#pdfModal').classList.contains('open')) {
      closePdfModal();
    }
  });

  $('#teacherMode').checked = localStorage.getItem('teacherMode') === '1';
  document.body.classList.toggle('teacher', $('#teacherMode').checked);
  $('#teacherMode').onchange = e => { localStorage.setItem('teacherMode', e.target.checked ? '1' : '0'); document.body.classList.toggle('teacher', e.target.checked); };
  $('#btnPrint').onclick = () => {
    // Open preview and trigger print
    openPdfModal();
    setTimeout(() => window.print(), 300);
  };

  go(N);
})();
