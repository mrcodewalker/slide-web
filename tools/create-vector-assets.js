const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'assets', 'img');

// Helper to write SVG file
function writeSvg(filename, content) {
  const target = path.join(imgDir, filename);
  fs.writeFileSync(target, content.trim(), 'utf8');
  console.log(`Created: ${filename} (${fs.statSync(target).size} bytes)`);
}

// 1. promise-lifecycle.svg
writeSvg('promise-lifecycle.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="pBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <linearGradient id="pendGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <linearGradient id="fulGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="rejGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#b91c1c" />
    </linearGradient>
    <linearGradient id="finGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#6d28d9" />
    </linearGradient>
    <filter id="pDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
    </marker>
    <marker id="arrowGreen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#34d399" />
    </marker>
    <marker id="arrowRed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f87171" />
    </marker>
    <marker id="arrowPurp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#c084fc" />
    </marker>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#pBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">VÒNG ĐỜI VÀ TRẠNG THÁI CỦA PROMISE TRONG JAVASCRIPT</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Promise chuyển trạng thái bất khả đảo từ PENDING sang FULFILLED hoặc REJECTED</text>

  <!-- PENDING -->
  <g transform="translate(60, 150)" filter="url(#pDrop)">
    <rect width="200" height="150" rx="14" fill="#0f172a" stroke="#d97706" stroke-width="2" />
    <rect width="200" height="38" rx="14" fill="url(#pendGrad)" />
    <text x="100" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">⏳ PENDING</text>
    <text x="14" y="62" font-family="sans-serif" font-size="11" fill="#fef3c7" font-weight="700">Trạng thái khởi tạo ban đầu</text>
    <text x="14" y="84" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Đang chờ tác vụ hoàn tất</text>
    <text x="14" y="104" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Kết quả chưa xác định</text>
    <text x="14" y="128" font-family="monospace" font-size="10" fill="#f59e0b">result: undefined</text>
  </g>

  <!-- Flow Arrows -->
  <path d="M 260 190 C 330 190, 340 145, 410 145" fill="none" stroke="#34d399" stroke-width="2.5" marker-end="url(#arrowGreen)" />
  <text x="330" y="155" text-anchor="middle" font-family="monospace" font-size="11" fill="#34d399" font-weight="700">resolve(value)</text>

  <path d="M 260 255 C 330 255, 340 305, 410 305" fill="none" stroke="#f87171" stroke-width="2.5" marker-end="url(#arrowRed)" />
  <text x="330" y="300" text-anchor="middle" font-family="monospace" font-size="11" fill="#f87171" font-weight="700">reject(error)</text>

  <!-- FULFILLED -->
  <g transform="translate(420, 90)" filter="url(#pDrop)">
    <rect width="220" height="120" rx="14" fill="#0f172a" stroke="#059669" stroke-width="2" />
    <rect width="220" height="36" rx="14" fill="url(#fulGrad)" />
    <text x="110" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">✅ FULFILLED (RESOLVED)</text>
    <text x="14" y="58" font-family="sans-serif" font-size="11" fill="#a7f3d0" font-weight="700">Tác vụ thành công mỹ mãn</text>
    <text x="14" y="78" font-family="monospace" font-size="11" fill="#38bdf8">.then((val) =&gt; { ... })</text>
    <text x="14" y="100" font-family="monospace" font-size="10" fill="#94a3b8">result: value dữ liệu</text>
  </g>

  <!-- REJECTED -->
  <g transform="translate(420, 250)" filter="url(#pDrop)">
    <rect width="220" height="120" rx="14" fill="#0f172a" stroke="#dc2626" stroke-width="2" />
    <rect width="220" height="36" rx="14" fill="url(#rejGrad)" />
    <text x="110" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">❌ REJECTED</text>
    <text x="14" y="58" font-family="sans-serif" font-size="11" fill="#fecaca" font-weight="700">Gặp sự cố hoặc lỗi ngoại lệ</text>
    <text x="14" y="78" font-family="monospace" font-size="11" fill="#f87171">.catch((err) =&gt; { ... })</text>
    <text x="14" y="100" font-family="monospace" font-size="10" fill="#94a3b8">result: Error object</text>
  </g>

  <!-- Arrows to FINALLY -->
  <path d="M 640 150 C 700 150, 700 200, 740 200" fill="none" stroke="#c084fc" stroke-width="2.5" marker-end="url(#arrowPurp)" />
  <path d="M 640 310 C 700 310, 700 240, 740 240" fill="none" stroke="#c084fc" stroke-width="2.5" marker-end="url(#arrowPurp)" />

  <!-- FINALLY -->
  <g transform="translate(750, 160)" filter="url(#pDrop)">
    <rect width="160" height="130" rx="14" fill="#0f172a" stroke="#7c3aed" stroke-width="2" />
    <rect width="160" height="36" rx="14" fill="url(#finGrad)" />
    <text x="80" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">🔄 FINALLY</text>
    <text x="12" y="60" font-family="monospace" font-size="11" fill="#c084fc">.finally(() =&gt; {</text>
    <text x="20" y="80" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">Dọn dẹp tài nguyên</text>
    <text x="20" y="98" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">Đóng loading...</text>
    <text x="12" y="118" font-family="monospace" font-size="11" fill="#c084fc">})</text>
  </g>

  <!-- Note Footer -->
  <rect x="60" y="405" width="840" height="48" rx="10" fill="#1e293b" stroke="#334155" />
  <text x="80" y="434" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="700">💡 Quy tắc vàng:</text>
  <text x="180" y="434" font-family="sans-serif" font-size="11.5" fill="#e2e8f0">Khi Promise đã chuyển sang Fulfilled hoặc Rejected (Settled), trạng thái của nó vĩnh viễn không thể thay đổi lần thứ hai!</text>
</svg>`);

// 2. stream-pipeline.svg
writeSvg('stream-pipeline.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="stBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <linearGradient id="readGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
    <linearGradient id="transGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#7e22ce" />
    </linearGradient>
    <linearGradient id="writeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22c55e" />
      <stop offset="100%" stop-color="#15803d" />
    </linearGradient>
    <filter id="stDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
    <marker id="pipeArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
    </marker>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#stBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">KIẾN TRÚC NODE.JS STREAMS &amp; BACKPRESSURE</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Xử lý dữ liệu dung lượng lớn từng khối (Chunks 64KB) mà không làm tràn bộ nhớ RAM (RAM OOM)</text>

  <!-- Readable Stream -->
  <g transform="translate(60, 120)" filter="url(#stDrop)">
    <rect width="220" height="200" rx="14" fill="#0f172a" stroke="#0ea5e9" stroke-width="2" />
    <rect width="220" height="38" rx="14" fill="url(#readGrad)" />
    <text x="110" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">📥 READABLE STREAM</text>
    <text x="16" y="62" font-family="sans-serif" font-size="11" fill="#bae6fd" font-weight="700">Nguồn phát dữ liệu</text>
    <text x="16" y="84" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• fs.createReadStream()</text>
    <text x="16" y="104" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• HTTP Request (`req`)</text>
    <text x="16" y="124" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• process.stdin</text>
    <rect x="16" y="145" width="188" height="36" rx="6" fill="#1e293b" />
    <text x="110" y="167" text-anchor="middle" font-family="monospace" font-size="10" fill="#38bdf8">Chunk [ 64 KB ] ➔</text>
  </g>

  <!-- Arrow 1 -->
  <path d="M 280 220 L 360 220" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#pipeArr)" />
  <text x="320" y="205" text-anchor="middle" font-family="monospace" font-size="11" fill="#38bdf8">.pipe()</text>

  <!-- Transform Stream -->
  <g transform="translate(370, 120)" filter="url(#stDrop)">
    <rect width="220" height="200" rx="14" fill="#0f172a" stroke="#a855f7" stroke-width="2" />
    <rect width="220" height="38" rx="14" fill="url(#transGrad)" />
    <text x="110" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">⚙️ TRANSFORM STREAM</text>
    <text x="16" y="62" font-family="sans-serif" font-size="11" fill="#e9d5ff" font-weight="700">Biến đổi trung gian trên luồng</text>
    <text x="16" y="84" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• zlib.createGzip() (Nén)</text>
    <text x="16" y="104" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• crypto.createCipheriv()</text>
    <text x="16" y="124" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Chuyển đổi mã hóa UTF-8</text>
    <rect x="16" y="145" width="188" height="36" rx="6" fill="#1e293b" />
    <text x="110" y="167" text-anchor="middle" font-family="monospace" font-size="10" fill="#c084fc">Nén / Mã hóa tức thì</text>
  </g>

  <!-- Arrow 2 -->
  <path d="M 590 220 L 670 220" fill="none" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#pipeArr)" />
  <text x="630" y="205" text-anchor="middle" font-family="monospace" font-size="11" fill="#38bdf8">.pipe()</text>

  <!-- Writable Stream -->
  <g transform="translate(680, 120)" filter="url(#stDrop)">
    <rect width="220" height="200" rx="14" fill="#0f172a" stroke="#22c55e" stroke-width="2" />
    <rect width="220" height="38" rx="14" fill="url(#writeGrad)" />
    <text x="110" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">📤 WRITABLE STREAM</text>
    <text x="16" y="62" font-family="sans-serif" font-size="11" fill="#bbf7d0" font-weight="700">Đích nhận dữ liệu</text>
    <text x="16" y="84" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• fs.createWriteStream()</text>
    <text x="16" y="104" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• HTTP Response (`res`)</text>
    <text x="16" y="124" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• process.stdout</text>
    <rect x="16" y="145" width="188" height="36" rx="6" fill="#1e293b" />
    <text x="110" y="167" text-anchor="middle" font-family="monospace" font-size="10" fill="#4ade80">Ghi xuống đĩa / socket</text>
  </g>

  <!-- Pipeline best practice callout -->
  <rect x="60" y="360" width="840" height="85" rx="12" fill="#1e293b" stroke="#334155" />
  <text x="80" y="390" font-family="sans-serif" font-size="12.5" fill="#38bdf8" font-weight="700">🛡️ Chuẩn viết an toàn: Dùng pipeline() thay vì .pipe() thuần</text>
  <text x="80" y="412" font-family="monospace" font-size="11" fill="#cbd5e1">const { pipeline } = require('stream/promises');</text>
  <text x="80" y="432" font-family="monospace" font-size="11" fill="#a7f3d0">await pipeline(readable, transform, writable); // Tự động dọn dẹp file descriptors khi gặp lỗi</text>
</svg>`);

// 3. event-emitter-flow.svg
writeSvg('event-emitter-flow.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="eeBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <linearGradient id="emGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#be123c" />
    </linearGradient>
    <linearGradient id="hubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#4338ca" />
    </linearGradient>
    <linearGradient id="lisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14b8a6" />
      <stop offset="100%" stop-color="#0f766e" />
    </linearGradient>
    <filter id="eeDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
    <marker id="eeArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#818cf8" />
    </marker>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#eeBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">MÔ HÌNH OBSERVER PATTERN VỚI NODE.JS EVENTEMITTER</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Bản chất của hầu hết thư viện cốt lõi trong Node: http.Server, Streams, Sockets</text>

  <!-- Emitter Component -->
  <g transform="translate(60, 140)" filter="url(#eeDrop)">
    <rect width="210" height="180" rx="14" fill="#0f172a" stroke="#f43f5e" stroke-width="2" />
    <rect width="210" height="38" rx="14" fill="url(#emGrad)" />
    <text x="105" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">📢 PUBLISHER (EMITTER)</text>
    <text x="14" y="66" font-family="monospace" font-size="11.5" fill="#fb7185">emitter.emit(event, data)</text>
    <text x="14" y="92" font-family="sans-serif" font-size="11" fill="#cbd5e1">• Phát tín hiệu khi có sự kiện</text>
    <text x="14" y="114" font-family="sans-serif" font-size="11" fill="#cbd5e1">• Gửi kèm payload dữ liệu</text>
    <text x="14" y="136" font-family="sans-serif" font-size="11" fill="#cbd5e1">• Không cần biết ai lắng nghe</text>
    <text x="14" y="160" font-family="monospace" font-size="10" fill="#94a3b8">emit('order:created', order)</text>
  </g>

  <!-- Arrow Emit -->
  <path d="M 270 230 L 370 230" fill="none" stroke="#818cf8" stroke-width="3" marker-end="url(#eeArrow)" />
  <text x="320" y="220" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#a5b4fc" font-weight="700">Trigger</text>

  <!-- Central Registry Hub -->
  <g transform="translate(380, 110)" filter="url(#eeDrop)">
    <rect width="230" height="240" rx="14" fill="#0f172a" stroke="#6366f1" stroke-width="2" />
    <rect width="230" height="38" rx="14" fill="url(#hubGrad)" />
    <text x="115" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">📑 EVENT REGISTRY</text>
    <text x="16" y="65" font-family="sans-serif" font-size="11" fill="#c7d2fe" font-weight="700">Bảng tra cứu Listener theo Event</text>
    <rect x="16" y="78" width="198" height="60" rx="8" fill="#1e293b" />
    <text x="24" y="98" font-family="monospace" font-size="10.5" fill="#38bdf8">'order:created': [ fn1, fn2, fn3 ]</text>
    <text x="24" y="122" font-family="monospace" font-size="10.5" fill="#34d399">'user:registered': [ sendWelcome ]</text>
    <text x="16" y="160" font-family="sans-serif" font-size="10.5" fill="#94a3b8">• Quản lý danh sách callbacks</text>
    <text x="16" y="180" font-family="sans-serif" font-size="10.5" fill="#94a3b8">• Thực thi đồng bộ theo thứ tự đăng ký</text>
    <text x="16" y="200" font-family="sans-serif" font-size="10.5" fill="#94a3b8">• Hỗ trợ emitter.once() tự huỷ sau 1 lần</text>
    <text x="16" y="222" font-family="monospace" font-size="10" fill="#f59e0b">setMaxListeners(10)</text>
  </g>

  <!-- Arrows to Listeners -->
  <path d="M 610 180 L 690 150" fill="none" stroke="#2dd4bf" stroke-width="2.5" marker-end="url(#eeArrow)" />
  <path d="M 610 230 L 690 230" fill="none" stroke="#2dd4bf" stroke-width="2.5" marker-end="url(#eeArrow)" />
  <path d="M 610 280 L 690 310" fill="none" stroke="#2dd4bf" stroke-width="2.5" marker-end="url(#eeArrow)" />

  <!-- Listeners -->
  <g transform="translate(700, 110)" filter="url(#eeDrop)">
    <rect width="200" height="70" rx="10" fill="#0f172a" stroke="#14b8a6" stroke-width="1.5" />
    <text x="14" y="28" font-family="sans-serif" font-size="11.5" fill="#2dd4bf" font-weight="700">1. Gửi Email Hóa đơn</text>
    <text x="14" y="50" font-family="monospace" font-size="10" fill="#94a3b8">mailerService.sendInvoice()</text>
  </g>

  <g transform="translate(700, 195)" filter="url(#eeDrop)">
    <rect width="200" height="70" rx="10" fill="#0f172a" stroke="#14b8a6" stroke-width="1.5" />
    <text x="14" y="28" font-family="sans-serif" font-size="11.5" fill="#2dd4bf" font-weight="700">2. Trừ Kho Hàng</text>
    <text x="14" y="50" font-family="monospace" font-size="10" fill="#94a3b8">warehouse.deductStock()</text>
  </g>

  <g transform="translate(700, 280)" filter="url(#eeDrop)">
    <rect width="200" height="70" rx="10" fill="#0f172a" stroke="#14b8a6" stroke-width="1.5" />
    <text x="14" y="28" font-family="sans-serif" font-size="11.5" fill="#2dd4bf" font-weight="700">3. Bắn Noti Telegram</text>
    <text x="14" y="50" font-family="monospace" font-size="10" fill="#94a3b8">telegramBot.alertAdmin()</text>
  </g>

  <!-- Summary Note -->
  <rect x="60" y="380" width="840" height="65" rx="10" fill="#1e293b" stroke="#334155" />
  <text x="80" y="408" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="700">🎯 Lợi ích kiến trúc:</text>
  <text x="80" y="428" font-family="sans-serif" font-size="11" fill="#e2e8f0">Khử ghép nối (Decoupling) triệt để giữa logic tạo đơn hàng và các tác vụ hậu xử lý. Dễ dàng mở rộng thêm tính năng mới mà không sửa logic cũ.</text>
</svg>`);

// 4. express-req-res.svg
writeSvg('express-req-res.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="rrBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <linearGradient id="reqHead" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="resHead" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="rrDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#rrBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">GIẢI PHẪU TOÀN DIỆN REQ &amp; RES TRONG EXPRESS</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Hai đối tượng cốt lõi định hình mọi Route Handler: (req, res, next) =&gt; { ... }</text>

  <!-- Left: REQ object -->
  <g transform="translate(50, 95)" filter="url(#rrDrop)">
    <rect width="400" height="340" rx="14" fill="#0f172a" stroke="#0284c7" stroke-width="2" />
    <rect width="400" height="42" rx="14" fill="url(#reqHead)" />
    <text x="200" y="27" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="14" fill="#ffffff">📥 HTTP REQUEST OBJECT (req)</text>

    <g transform="translate(18, 55)">
      <rect width="364" height="48" rx="8" fill="#1e293b" />
      <text x="14" y="20" font-family="monospace" font-size="11.5" fill="#38bdf8" font-weight="700">req.params</text>
      <text x="14" y="38" font-family="sans-serif" font-size="10.5" fill="#94a3b8">Tham số động trên URL: /posts/:id =&gt; { id: '42' }</text>
    </g>

    <g transform="translate(18, 110)">
      <rect width="364" height="48" rx="8" fill="#1e293b" />
      <text x="14" y="20" font-family="monospace" font-size="11.5" fill="#38bdf8" font-weight="700">req.query</text>
      <text x="14" y="38" font-family="sans-serif" font-size="10.5" fill="#94a3b8">Query params sau dấu ?: ?page=2&amp;sort=desc</text>
    </g>

    <g transform="translate(18, 165)">
      <rect width="364" height="48" rx="8" fill="#1e293b" />
      <text x="14" y="20" font-family="monospace" font-size="11.5" fill="#38bdf8" font-weight="700">req.body</text>
      <text x="14" y="38" font-family="sans-serif" font-size="10.5" fill="#94a3b8">Dữ liệu gửi từ Client (cần express.json() parse)</text>
    </g>

    <g transform="translate(18, 220)">
      <rect width="364" height="48" rx="8" fill="#1e293b" />
      <text x="14" y="20" font-family="monospace" font-size="11.5" fill="#38bdf8" font-weight="700">req.headers &amp; req.get('Authorization')</text>
      <text x="14" y="38" font-family="sans-serif" font-size="10.5" fill="#94a3b8">HTTP Headers: Token, User-Agent, Content-Type</text>
    </g>

    <g transform="translate(18, 275)">
      <rect width="364" height="48" rx="8" fill="#1e293b" />
      <text x="14" y="20" font-family="monospace" font-size="11.5" fill="#38bdf8" font-weight="700">req.ip, req.method, req.originalUrl</text>
      <text x="14" y="38" font-family="sans-serif" font-size="10.5" fill="#94a3b8">Thông tin meta đường truyền mạng của Client</text>
    </g>
  </g>

  <!-- Right: RES object -->
  <g transform="translate(510, 95)" filter="url(#rrDrop)">
    <rect width="400" height="340" rx="14" fill="#0f172a" stroke="#059669" stroke-width="2" />
    <rect width="400" height="42" rx="14" fill="url(#resHead)" />
    <text x="200" y="27" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="14" fill="#ffffff">📤 HTTP RESPONSE OBJECT (res)</text>

    <g transform="translate(18, 55)">
      <rect width="364" height="48" rx="8" fill="#1e293b" />
      <text x="14" y="20" font-family="monospace" font-size="11.5" fill="#34d399" font-weight="700">res.status(code)</text>
      <text x="14" y="38" font-family="sans-serif" font-size="10.5" fill="#94a3b8">Thiết lập HTTP Status Code (200, 201, 400, 404, 500)</text>
    </g>

    <g transform="translate(18, 110)">
      <rect width="364" height="48" rx="8" fill="#1e293b" />
      <text x="14" y="20" font-family="monospace" font-size="11.5" fill="#34d399" font-weight="700">res.json(payload)</text>
      <text x="14" y="38" font-family="sans-serif" font-size="10.5" fill="#94a3b8">Serialize object thành JSON &amp; set Content-Type tự động</text>
    </g>

    <g transform="translate(18, 165)">
      <rect width="364" height="48" rx="8" fill="#1e293b" />
      <text x="14" y="20" font-family="monospace" font-size="11.5" fill="#34d399" font-weight="700">res.setHeader(name, val)</text>
      <text x="14" y="38" font-family="sans-serif" font-size="10.5" fill="#94a3b8">Cấu hình Custom Header hoặc Cache-Control</text>
    </g>

    <g transform="translate(18, 220)">
      <rect width="364" height="48" rx="8" fill="#1e293b" />
      <text x="14" y="20" font-family="monospace" font-size="11.5" fill="#34d399" font-weight="700">res.cookie(name, val, options)</text>
      <text x="14" y="38" font-family="sans-serif" font-size="10.5" fill="#94a3b8">Set-Cookie an toàn với httpOnly: true, secure: true</text>
    </g>

    <g transform="translate(18, 275)">
      <rect width="364" height="48" rx="8" fill="#1e293b" />
      <text x="14" y="20" font-family="monospace" font-size="11.5" fill="#34d399" font-weight="700">res.download(filePath, filename)</text>
      <text x="14" y="38" font-family="sans-serif" font-size="10.5" fill="#94a3b8">Stream tải file trực tiếp về máy tính client</text>
    </g>
  </g>
</svg>`);

// 5. rest-maturity.svg
writeSvg('rest-maturity.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="rmBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <filter id="rmDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#rmBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">MÔ HÌNH TRƯỞNG THÀNH RICHARDSON (RICHARDSON MATURITY MODEL)</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">4 cấp độ chuẩn hóa từ RPC sơ khai tới Restful API hoàn chỉnh (Roy Fielding)</text>

  <!-- Level 3 -->
  <g transform="translate(100, 100)" filter="url(#rmDrop)">
    <rect width="760" height="70" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="2" />
    <rect width="130" height="70" rx="10" fill="#059669" />
    <text x="65" y="32" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">LEVEL 3</text>
    <text x="65" y="52" text-anchor="middle" font-family="sans-serif" font-size="10.5" fill="#a7f3d0">HATEOAS</text>
    <text x="150" y="32" font-family="sans-serif" font-size="13" fill="#34d399" font-weight="700">Hypermedia Controls</text>
    <text x="150" y="52" font-family="sans-serif" font-size="11" fill="#cbd5e1">Response trả kèm danh sách links điều hướng tiếp theo (_links: { next, self, cancel })</text>
  </g>

  <!-- Level 2 -->
  <g transform="translate(100, 185)" filter="url(#rmDrop)">
    <rect width="760" height="70" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="2" />
    <rect width="130" height="70" rx="10" fill="#0284c7" />
    <text x="65" y="32" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">LEVEL 2</text>
    <text x="65" y="52" text-anchor="middle" font-family="sans-serif" font-size="10.5" fill="#bae6fd">HTTP VERBS</text>
    <text x="150" y="32" font-family="sans-serif" font-size="13" fill="#38bdf8" font-weight="700">Chuẩn hóa HTTP Verbs &amp; Status Codes (Hầu hết API thực tế đạt mức này)</text>
    <text x="150" y="52" font-family="sans-serif" font-size="11" fill="#cbd5e1">GET (Lấy), POST (Tạo), PUT (Thay thế), PATCH (Sửa 1 phần), DELETE (Xóa) + Status 200, 201, 204, 404</text>
  </g>

  <!-- Level 1 -->
  <g transform="translate(100, 270)" filter="url(#rmDrop)">
    <rect width="760" height="70" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="2" />
    <rect width="130" height="70" rx="10" fill="#7e22ce" />
    <text x="65" y="32" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">LEVEL 1</text>
    <text x="65" y="52" text-anchor="middle" font-family="sans-serif" font-size="10.5" fill="#e9d5ff">RESOURCES</text>
    <text x="150" y="32" font-family="sans-serif" font-size="13" fill="#c084fc" font-weight="700">Tài nguyên định danh riêng biệt (Individual URIs)</text>
    <text x="150" y="52" font-family="sans-serif" font-size="11" fill="#cbd5e1">Mỗi thực thể có URL riêng: /api/posts/10, /api/users/5 (nhưng có thể vẫn chỉ dùng duy nhất POST)</text>
  </g>

  <!-- Level 0 -->
  <g transform="translate(100, 355)" filter="url(#rmDrop)">
    <rect width="760" height="70" rx="10" fill="#0f172a" stroke="#64748b" stroke-width="2" />
    <rect width="130" height="70" rx="10" fill="#334155" />
    <text x="65" y="32" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">LEVEL 0</text>
    <text x="65" y="52" text-anchor="middle" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">THE SWAMP</text>
    <text x="150" y="32" font-family="sans-serif" font-size="13" fill="#94a3b8" font-weight="700">The Swamp of POX (SOAP, RPC cổ điển)</text>
    <text x="150" y="52" font-family="sans-serif" font-size="11" fill="#94a3b8">Một Endpoint duy nhất POST /api/service, toàn bộ action ghi trong body XML/JSON</text>
  </g>

  <text x="480" y="450" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#38bdf8">💡 Mục tiêu của khóa học: Đạt Level 2 vững chắc chuẩn công nghiệp và làm quen tư duy Level 3!</text>
</svg>`);

// 6. clean-architecture.svg
writeSvg('clean-architecture.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="caBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <linearGradient id="cRout" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="cCtrl" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#4f46e5" />
    </linearGradient>
    <linearGradient id="cSvc" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <linearGradient id="cRepo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <filter id="caDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
    <marker id="caArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
    </marker>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#caBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">KIẾN TRÚC 4 TẦNG (CLEAN / LAYERED ARCHITECTURE) TRONG BACKEND</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Tách bạch trách nhiệm (Separation of Concerns): Router ➔ Controller ➔ Service ➔ Repository / Model</text>

  <!-- Layer 1: Routes -->
  <g transform="translate(40, 110)" filter="url(#caDrop)">
    <rect width="190" height="260" rx="14" fill="#0f172a" stroke="#0284c7" stroke-width="2" />
    <rect width="190" height="38" rx="14" fill="url(#cRout)" />
    <text x="95" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">1. ROUTER LAYER</text>
    <text x="12" y="65" font-family="sans-serif" font-size="11" fill="#bae6fd" font-weight="700">Định tuyến &amp; URL</text>
    <text x="12" y="90" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Khớp HTTP Method + URI</text>
    <text x="12" y="112" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Gắn Middleware bảo vệ</text>
    <text x="12" y="134" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Gắn Validate Schema</text>
    <rect x="12" y="160" width="166" height="85" rx="8" fill="#1e293b" />
    <text x="20" y="180" font-family="monospace" font-size="9.5" fill="#38bdf8">router.post('/posts',</text>
    <text x="20" y="200" font-family="monospace" font-size="9.5" fill="#f87171">  authGuard,</text>
    <text x="20" y="220" font-family="monospace" font-size="9.5" fill="#818cf8">  postCtrl.create</text>
    <text x="20" y="235" font-family="monospace" font-size="9.5" fill="#38bdf8">)</text>
  </g>

  <!-- Arrow 1 -->
  <path d="M 230 240 L 265 240" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#caArrow)" />

  <!-- Layer 2: Controller -->
  <g transform="translate(270, 110)" filter="url(#caDrop)">
    <rect width="190" height="260" rx="14" fill="#0f172a" stroke="#4f46e5" stroke-width="2" />
    <rect width="190" height="38" rx="14" fill="url(#cCtrl)" />
    <text x="95" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">2. CONTROLLER</text>
    <text x="12" y="65" font-family="sans-serif" font-size="11" fill="#c7d2fe" font-weight="700">Điều phối HTTP</text>
    <text x="12" y="90" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Đọc req.params, body</text>
    <text x="12" y="112" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Gọi sang Service tương ứng</text>
    <text x="12" y="134" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Trả về res.status().json()</text>
    <rect x="12" y="160" width="166" height="85" rx="8" fill="#1e293b" />
    <text x="20" y="180" font-family="monospace" font-size="9" fill="#818cf8">const post = await</text>
    <text x="20" y="200" font-family="monospace" font-size="9" fill="#34d399">  postSvc.createPost(</text>
    <text x="20" y="218" font-family="monospace" font-size="9" fill="#cbd5e1">    req.body, req.user</text>
    <text x="20" y="235" font-family="monospace" font-size="9" fill="#34d399">  );</text>
  </g>

  <!-- Arrow 2 -->
  <path d="M 460 240 L 495 240" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#caArrow)" />

  <!-- Layer 3: Service -->
  <g transform="translate(500, 110)" filter="url(#caDrop)">
    <rect width="190" height="260" rx="14" fill="#0f172a" stroke="#059669" stroke-width="2" />
    <rect width="190" height="38" rx="14" fill="url(#cSvc)" />
    <text x="95" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">3. SERVICE LAYER</text>
    <text x="12" y="65" font-family="sans-serif" font-size="11" fill="#a7f3d0" font-weight="700">Trái tim Nghiệp vụ</text>
    <text x="12" y="90" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Business logic, tính toán</text>
    <text x="12" y="112" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Gửi email, trừ tiền, tích điểm</text>
    <text x="12" y="134" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Không phụ thuộc req hay res</text>
    <rect x="12" y="160" width="166" height="85" rx="8" fill="#1e293b" />
    <text x="20" y="180" font-family="monospace" font-size="9" fill="#34d399">if (!user.isVip) {</text>
    <text x="20" y="200" font-family="monospace" font-size="9" fill="#f87171">  throw new AppError(</text>
    <text x="20" y="218" font-family="monospace" font-size="9" fill="#f87171">    'Upgrade required', 403</text>
    <text x="20" y="235" font-family="monospace" font-size="9" fill="#34d399">}</text>
  </g>

  <!-- Arrow 3 -->
  <path d="M 690 240 L 725 240" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#caArrow)" />

  <!-- Layer 4: Model / Repository -->
  <g transform="translate(730, 110)" filter="url(#caDrop)">
    <rect width="190" height="260" rx="14" fill="#0f172a" stroke="#d97706" stroke-width="2" />
    <rect width="190" height="38" rx="14" fill="url(#cRepo)" />
    <text x="95" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">4. REPOSITORY / DB</text>
    <text x="12" y="65" font-family="sans-serif" font-size="11" fill="#fde68a" font-weight="700">Truy xuất Dữ liệu</text>
    <text x="12" y="90" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Giao tiếp ORM / Sequelize</text>
    <text x="12" y="112" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• SELECT, INSERT, UPDATE</text>
    <text x="12" y="134" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• MySQL Tables &amp; Index</text>
    <rect x="12" y="160" width="166" height="85" rx="8" fill="#1e293b" />
    <text x="20" y="180" font-family="monospace" font-size="9" fill="#fbbf24">Post.create({</text>
    <text x="20" y="200" font-family="monospace" font-size="9" fill="#cbd5e1">  title, content,</text>
    <text x="20" y="218" font-family="monospace" font-size="9" fill="#cbd5e1">  authorId: user.id</text>
    <text x="20" y="235" font-family="monospace" font-size="9" fill="#fbbf24">});</text>
  </g>

  <!-- Footer note -->
  <rect x="40" y="390" width="880" height="60" rx="10" fill="#1e293b" stroke="#334155" />
  <text x="60" y="415" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="700">⚡ Thin Controller, Fat Service Rule:</text>
  <text x="60" y="435" font-family="sans-serif" font-size="11" fill="#cbd5e1">Controller chỉ nên mỏng gọn (đóng mở HTTP). Toàn bộ nghiệp vụ phức tạp phải nằm trong Service để dễ viết Unit Test độc lập!</text>
</svg>`);

// 7. btree-index.svg
writeSvg('btree-index.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="btBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef4444" />
      <stop offset="100%" stop-color="#b91c1c" />
    </linearGradient>
    <linearGradient id="treeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="btDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#btBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">FULL TABLE SCAN VS B-TREE INDEX TRONG CƠ SỞ DỮ LIỆU</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Bản chất của tăng tốc độ truy vấn từ O(N) đọc tuần tự toàn bộ đĩa sang O(log N) duyệt cây nhị phân cân bằng</text>

  <!-- Left: Full Table Scan -->
  <g transform="translate(50, 100)" filter="url(#btDrop)">
    <rect width="400" height="330" rx="14" fill="#0f172a" stroke="#dc2626" stroke-width="2" />
    <rect width="400" height="40" rx="14" fill="url(#scanGrad)" />
    <text x="200" y="25" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">❌ FULL TABLE SCAN (KHÔNG CÓ INDEX)</text>

    <text x="20" y="65" font-family="sans-serif" font-size="11.5" fill="#fecaca" font-weight="700">Độ phức tạp O(N) — Đọc tuần tự từng dòng từ đĩa</text>

    <!-- Table Rows -->
    <g transform="translate(20, 80)">
      <rect width="360" height="24" rx="4" fill="#1e293b" stroke="#334155" />
      <text x="14" y="16" font-family="monospace" font-size="10.5" fill="#94a3b8">Row 1: email = 'alice@gmail.com' (Bỏ qua ➔)</text>
    </g>
    <g transform="translate(20, 110)">
      <rect width="360" height="24" rx="4" fill="#1e293b" stroke="#334155" />
      <text x="14" y="16" font-family="monospace" font-size="10.5" fill="#94a3b8">Row 2: email = 'bob@gmail.com' (Bỏ qua ➔)</text>
    </g>
    <g transform="translate(20, 140)">
      <rect width="360" height="24" rx="4" fill="#1e293b" stroke="#334155" />
      <text x="14" y="16" font-family="monospace" font-size="10.5" fill="#94a3b8">Row ... (Đọc hàng triệu bản ghi tuần tự...)</text>
    </g>
    <g transform="translate(20, 170)">
      <rect width="360" height="26" rx="4" fill="#450a0a" stroke="#ef4444" />
      <text x="14" y="18" font-family="monospace" font-size="10.5" fill="#fca5a5" font-weight="700">Row 1.000.000: email = 'target@domain.vn' [FOUND]</text>
    </g>

    <rect x="20" y="215" width="360" height="95" rx="8" fill="#1e293b" />
    <text x="32" y="240" font-family="sans-serif" font-size="11" fill="#f87171" font-weight="700">Hậu quả khi bảng đạt quy mô lớn:</text>
    <text x="32" y="260" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Disk I/O tăng nghẽn 100%</text>
    <text x="32" y="280" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• CPU treo, thời gian phản hồi API nhảy từ 5ms lên 3000ms</text>
    <text x="32" y="300" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Dễ làm sập Database khi có hàng trăm kết nối đồng thời</text>
  </g>

  <!-- Right: B-Tree Index -->
  <g transform="translate(510, 100)" filter="url(#btDrop)">
    <rect width="400" height="330" rx="14" fill="#0f172a" stroke="#059669" stroke-width="2" />
    <rect width="400" height="40" rx="14" fill="url(#treeGrad)" />
    <text x="200" y="25" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">✅ B-TREE INDEX (CREATE INDEX ON email)</text>

    <text x="20" y="65" font-family="sans-serif" font-size="11.5" fill="#a7f3d0" font-weight="700">Độ phức tạp O(log N) — Chỉ tốn 3-4 lần đọc khối</text>

    <!-- Tree Root -->
    <rect x="150" y="80" width="100" height="28" rx="6" fill="#065f46" stroke="#34d399" />
    <text x="200" y="98" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#ffffff" font-weight="700">Root: [ M ]</text>

    <!-- Links -->
    <line x1="180" y1="108" x2="100" y2="135" stroke="#34d399" stroke-width="1.5" />
    <line x1="220" y1="108" x2="300" y2="135" stroke="#34d399" stroke-width="1.5" />

    <!-- Branch Nodes -->
    <rect x="50" y="135" width="100" height="26" rx="6" fill="#1e293b" stroke="#34d399" />
    <text x="100" y="152" text-anchor="middle" font-family="monospace" font-size="10" fill="#a7f3d0">Branch: [ A - L ]</text>

    <rect x="250" y="135" width="100" height="26" rx="6" fill="#065f46" stroke="#34d399" />
    <text x="300" y="152" text-anchor="middle" font-family="monospace" font-size="10" fill="#ffffff" font-weight="700">Branch: [ N - Z ]</text>

    <!-- Links to Leaves -->
    <line x1="280" y1="161" x2="240" y2="185" stroke="#34d399" stroke-width="1.5" />
    <line x1="320" y1="161" x2="360" y2="185" stroke="#34d399" stroke-width="1.5" />

    <!-- Leaf Nodes -->
    <rect x="200" y="185" width="80" height="24" rx="4" fill="#1e293b" />
    <text x="240" y="201" text-anchor="middle" font-family="monospace" font-size="9" fill="#94a3b8">[ N - S ]</text>

    <rect x="300" y="185" width="90" height="24" rx="4" fill="#047857" stroke="#6ee7b7" />
    <text x="345" y="201" text-anchor="middle" font-family="monospace" font-size="9" fill="#ffffff" font-weight="700">[ T - Z ] ➔ PTR</text>

    <rect x="20" y="225" width="360" height="85" rx="8" fill="#1e293b" />
    <text x="32" y="250" font-family="sans-serif" font-size="11" fill="#34d399" font-weight="700">Hiệu năng vượt trội:</text>
    <text x="32" y="270" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• 10 triệu dòng chỉ mất 3-4 phép so sánh trên bộ nhớ đệm RAM</text>
    <text x="32" y="290" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Tốc độ phản hồi duy trì đều đặn 1-3ms</text>
  </g>
</svg>`);

// 8. acid-transactions.svg
writeSvg('acid-transactions.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="acBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <filter id="acDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#acBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">NGUYÊN LÝ GIAO DỊCH ACID TRONG HỆ QUẢN TRỊ CSDL QUAN HỆ</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Đảm bảo an toàn tuyệt đối cho các nghiệp vụ thanh toán tài chính, ngân hàng và đặt hàng</text>

  <!-- 4 Pillars of ACID -->
  <g transform="translate(60, 100)" filter="url(#acDrop)">
    <rect width="195" height="190" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <rect width="195" height="36" rx="12" fill="#0284c7" />
    <text x="97" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">A — ATOMICITY</text>
    <text x="14" y="60" font-family="sans-serif" font-size="11" fill="#38bdf8" font-weight="700">Tính Nguyên Tử (All or Nothing)</text>
    <text x="14" y="82" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Toàn bộ lệnh thành công HOẶC toàn bộ bị hủy bỏ</text>
    <text x="14" y="112" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Không có trạng thái dở dang</text>
    <text x="14" y="142" font-family="sans-serif" font-size="10" fill="#94a3b8">VD: Trừ tiền A nhưng lỗi cộng tiền B ➔ Hoàn tiền ngay</text>
  </g>

  <g transform="translate(275, 100)" filter="url(#acDrop)">
    <rect width="195" height="190" rx="12" fill="#0f172a" stroke="#34d399" stroke-width="1.5" />
    <rect width="195" height="36" rx="12" fill="#059669" />
    <text x="97" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">C — CONSISTENCY</text>
    <text x="14" y="60" font-family="sans-serif" font-size="11" fill="#34d399" font-weight="700">Tính Nhất Quán</text>
    <text x="14" y="82" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• CSDL chỉ chuyển từ trạng thái hợp lệ này sang trạng thái hợp lệ khác</text>
    <text x="14" y="122" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Tuân thủ toàn bộ Constraints, Foreign Keys, Rules</text>
  </g>

  <g transform="translate(490, 100)" filter="url(#acDrop)">
    <rect width="195" height="190" rx="12" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5" />
    <rect width="195" height="36" rx="12" fill="#d97706" />
    <text x="97" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">I — ISOLATION</text>
    <text x="14" y="60" font-family="sans-serif" font-size="11" fill="#fbbf24" font-weight="700">Tính Cô Lập</text>
    <text x="14" y="82" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Các giao dịch chạy đồng thời không can thiệp lẫn nhau</text>
    <text x="14" y="112" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Tránh lỗi Dirty Read, Non-repeatable Read, Phantom Read</text>
  </g>

  <g transform="translate(705, 100)" filter="url(#acDrop)">
    <rect width="195" height="190" rx="12" fill="#0f172a" stroke="#c084fc" stroke-width="1.5" />
    <rect width="195" height="36" rx="12" fill="#7c3aed" />
    <text x="97" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">D — DURABILITY</text>
    <text x="14" y="60" font-family="sans-serif" font-size="11" fill="#c084fc" font-weight="700">Tính Bền Vững</text>
    <text x="14" y="82" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Khi COMMIT thành công, dữ liệu được ghi đĩa vĩnh viễn</text>
    <text x="14" y="112" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Dù server sập nguồn ngay sau đó, dữ liệu vẫn không mất</text>
  </g>

  <!-- Flow Lifecycle at bottom -->
  <rect x="60" y="315" width="840" height="135" rx="12" fill="#1e293b" stroke="#334155" />
  <text x="80" y="342" font-family="sans-serif" font-size="12.5" fill="#38bdf8" font-weight="700">⚙️ Vòng đời giao dịch thực tế trong Sequelize / MySQL:</text>
  <text x="80" y="368" font-family="monospace" font-size="11" fill="#fbbf24">START TRANSACTION; -- Bắt đầu phiên làm việc cô lập</text>
  <text x="80" y="388" font-family="monospace" font-size="11" fill="#cbd5e1">UPDATE accounts SET balance = balance - 100 WHERE id = 1;</text>
  <text x="80" y="408" font-family="monospace" font-size="11" fill="#cbd5e1">UPDATE accounts SET balance = balance + 100 WHERE id = 2;</text>
  <text x="80" y="430" font-family="monospace" font-size="11" fill="#34d399">COMMIT; -- Lưu vĩnh viễn // Nếu có lỗi bất kỳ ➔ ROLLBACK; -- Khôi phục lại y như cũ</text>
</svg>`);

// 9. connection-pool.svg
writeSvg('connection-pool.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="cpBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <linearGradient id="poolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
    <filter id="cpDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#cpBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">CƠ CHẾ MYSQL CONNECTION POOL TRONG NODE.JS</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Tái sử dụng các kết nối TCP đã mở sẵn thay vì khởi tạo lại liên tục gây quá tải MySQL Server</text>

  <!-- Left: Client Requests -->
  <g transform="translate(60, 110)" filter="url(#cpDrop)">
    <rect width="200" height="230" rx="14" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <rect width="200" height="36" rx="14" fill="#0284c7" />
    <text x="100" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">📥 ĐỒNG THỜI 1000 REQS</text>
    <text x="14" y="65" font-family="sans-serif" font-size="11" fill="#bae6fd" font-weight="700">Express Route Handlers</text>
    <text x="14" y="90" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Req #1: Lấy danh sách bài</text>
    <text x="14" y="112" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Req #2: Đăng nhập user</text>
    <text x="14" y="134" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Req #3: Tạo bình luận mới</text>
    <text x="14" y="156" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Req #4: Cập nhật giỏ hàng</text>
    <text x="14" y="185" font-family="monospace" font-size="10" fill="#f59e0b">...chờ lấy slot kết nối</text>
  </g>

  <!-- Center: Connection Pool -->
  <g transform="translate(340, 95)" filter="url(#cpDrop)">
    <rect width="280" height="260" rx="14" fill="#0f172a" stroke="#6366f1" stroke-width="2" />
    <rect width="280" height="38" rx="14" fill="url(#poolGrad)" />
    <text x="140" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">🏊 MYSQL CONNECTION POOL</text>
    <text x="16" y="62" font-family="sans-serif" font-size="11" fill="#a5b4fc" font-weight="700">connectionLimit: 10 (Mở sẵn 10 socket)</text>

    <!-- Pre-warmed sockets -->
    <rect x="16" y="75" width="248" height="28" rx="6" fill="#065f46" stroke="#34d399" />
    <text x="24" y="93" font-family="monospace" font-size="10.5" fill="#ffffff">Conn #1: [ BUSY ] Query Req #1</text>

    <rect x="16" y="110" width="248" height="28" rx="6" fill="#065f46" stroke="#34d399" />
    <text x="24" y="128" font-family="monospace" font-size="10.5" fill="#ffffff">Conn #2: [ BUSY ] Query Req #2</text>

    <rect x="16" y="145" width="248" height="28" rx="6" fill="#1e293b" stroke="#64748b" />
    <text x="24" y="163" font-family="monospace" font-size="10.5" fill="#94a3b8">Conn #3: [ IDLE ] Sẵn sàng phục vụ</text>

    <rect x="16" y="180" width="248" height="28" rx="6" fill="#1e293b" stroke="#64748b" />
    <text x="24" y="198" font-family="monospace" font-size="10.5" fill="#94a3b8">Conn #4..#10: [ IDLE ] Đang chờ</text>

    <text x="16" y="235" font-family="sans-serif" font-size="10.5" fill="#f59e0b">Hàng đợi: queueLimit: 0 (FIFO chờ mượn)</text>
  </g>

  <!-- Right: MySQL Server -->
  <g transform="translate(700, 110)" filter="url(#cpDrop)">
    <rect width="200" height="230" rx="14" fill="#0f172a" stroke="#059669" stroke-width="1.5" />
    <rect width="200" height="36" rx="14" fill="#059669" />
    <text x="100" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">🛢️ MYSQL 8.0 SERVER</text>
    <text x="14" y="65" font-family="sans-serif" font-size="11" fill="#a7f3d0" font-weight="700">Ổn định tài nguyên</text>
    <text x="14" y="90" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Chỉ chịu tải đúng 10 kết nối</text>
    <text x="14" y="112" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Không bị quá tải RAM/CPU</text>
    <text x="14" y="134" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Tránh lỗi "Too many connections"</text>
    <text x="14" y="156" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• InnoDB Buffer Pool tối ưu</text>
    <text x="14" y="185" font-family="monospace" font-size="10" fill="#34d399">Tốc độ ổn định &lt; 5ms</text>
  </g>

  <!-- Summary Footer -->
  <rect x="60" y="380" width="840" height="65" rx="10" fill="#1e293b" stroke="#334155" />
  <text x="80" y="408" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="700">💡 Quy tắc vàng:</text>
  <text x="80" y="428" font-family="sans-serif" font-size="11" fill="#cbd5e1">Luôn dùng mysql.createPool() hoặc Sequelize Connection Pool thay vì mysql.createConnection() riêng lẻ trong ứng dụng Web.</text>
</svg>`);

// 10. orm-mapping.svg
writeSvg('orm-mapping.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="ormBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <linearGradient id="jsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="sqlGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <filter id="ormDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#ormBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">ÁNH XẠ ĐỐI TƯỢNG - QUAN HỆ VỚI SEQUELIZE ORM</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Cầu nối giải quyết bất đồng bộ hình thái giữa Lập trình hướng đối tượng (OOP) và CSDL quan hệ (RDBMS)</text>

  <!-- Left: JavaScript World -->
  <g transform="translate(60, 105)" filter="url(#ormDrop)">
    <rect width="360" height="250" rx="14" fill="#0f172a" stroke="#0284c7" stroke-width="2" />
    <rect width="360" height="40" rx="14" fill="url(#jsGrad)" />
    <text x="180" y="25" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">JAVASCRIPT / NODE.JS (OOP)</text>

    <text x="16" y="65" font-family="monospace" font-size="11" fill="#38bdf8">class User extends Model {}</text>
    <text x="16" y="90" font-family="monospace" font-size="10.5" fill="#cbd5e1">user.name = 'Nguyen Van A';</text>
    <text x="16" y="112" font-family="monospace" font-size="10.5" fill="#cbd5e1">user.posts = [ post1, post2 ]; // Nested Array</text>
    <text x="16" y="134" font-family="monospace" font-size="10.5" fill="#34d399">await user.save();</text>
    <text x="16" y="160" font-family="sans-serif" font-size="11" fill="#94a3b8">• Đối tượng (Objects) có phương thức</text>
    <text x="16" y="180" font-family="sans-serif" font-size="11" fill="#94a3b8">• Kế thừa (Inheritance) &amp; Quan hệ tham chiếu</text>
    <text x="16" y="200" font-family="sans-serif" font-size="11" fill="#94a3b8">• Kiểu dữ liệu động (Dynamic Types)</text>
    <text x="16" y="222" font-family="monospace" font-size="10.5" fill="#f59e0b">User.hasMany(Post);</text>
  </g>

  <!-- Center Bridge -->
  <g transform="translate(440, 150)">
    <rect width="80" height="150" rx="10" fill="#1e293b" stroke="#6366f1" stroke-width="1.5" />
    <text x="40" y="30" text-anchor="middle" font-family="sans-serif" font-size="18">⇄</text>
    <text x="40" y="60" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#a5b4fc" font-weight="700">ORM</text>
    <text x="40" y="80" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#cbd5e1">Auto SQL</text>
    <text x="40" y="100" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#cbd5e1">Cast Types</text>
    <text x="40" y="120" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#cbd5e1">Validate</text>
  </g>

  <!-- Right: Relational World -->
  <g transform="translate(540, 105)" filter="url(#ormDrop)">
    <rect width="360" height="250" rx="14" fill="#0f172a" stroke="#d97706" stroke-width="2" />
    <rect width="360" height="40" rx="14" fill="url(#sqlGrad)" />
    <text x="180" y="25" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">MYSQL / RDBMS (RELATIONAL)</text>

    <text x="16" y="65" font-family="monospace" font-size="11" fill="#f59e0b">TABLE users (id, name, email)</text>
    <text x="16" y="90" font-family="monospace" font-size="10.5" fill="#cbd5e1">TABLE posts (id, title, user_id)</text>
    <text x="16" y="112" font-family="monospace" font-size="10.5" fill="#cbd5e1">FOREIGN KEY (user_id) REFERENCES users(id)</text>
    <text x="16" y="134" font-family="monospace" font-size="10.5" fill="#34d399">INSERT INTO users (name) VALUES (...);</text>
    <text x="16" y="160" font-family="sans-serif" font-size="11" fill="#94a3b8">• Bảng 2 chiều gồm Hàng (Rows) &amp; Cột (Cols)</text>
    <text x="16" y="180" font-family="sans-serif" font-size="11" fill="#94a3b8">• Quan hệ thông qua Khóa ngoại (Foreign Key)</text>
    <text x="16" y="200" font-family="sans-serif" font-size="11" fill="#94a3b8">• Kiểu dữ liệu tĩnh nghiêm ngặt (INT, VARCHAR)</text>
    <text x="16" y="222" font-family="monospace" font-size="10.5" fill="#38bdf8">JOIN posts ON users.id = posts.user_id</text>
  </g>

  <!-- Footer note -->
  <rect x="60" y="380" width="840" height="65" rx="10" fill="#1e293b" stroke="#334155" />
  <text x="80" y="408" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="700">🚀 Giá trị cốt lõi của Sequelize:</text>
  <text x="80" y="428" font-family="sans-serif" font-size="11" fill="#cbd5e1">Lập trình viên làm việc thuần túy với Object JavaScript trực quan, an toàn trước SQL Injection mà không cần viết nối chuỗi câu lệnh SQL thủ công.</text>
</svg>`);

// 11. jwt-structure.svg
writeSvg('jwt-structure.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="jwtBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <filter id="jwtDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#jwtBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">GIẢI MÃ CẤU TRÚC 3 PHẦN CỦA JSON WEB TOKEN (JWT)</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Chuỗi Token gồm 3 đoạn Base64Url ghép nối với nhau bằng 2 dấu chấm (.): HEADER . PAYLOAD . SIGNATURE</text>

  <!-- Raw Token Box -->
  <rect x="60" y="95" width="840" height="48" rx="8" fill="#0f172a" stroke="#334155" />
  <text x="80" y="125" font-family="monospace" font-size="13" font-weight="700">
    <tspan fill="#fb7185">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</tspan>
    <tspan fill="#ffffff">.</tspan>
    <tspan fill="#a855f7">eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJBbHkiLCJyb2xlIjoiYWRtaW4ifQ</tspan>
    <tspan fill="#ffffff">.</tspan>
    <tspan fill="#38bdf8">TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ</tspan>
  </text>

  <!-- Part 1: Header -->
  <g transform="translate(60, 165)" filter="url(#jwtDrop)">
    <rect width="260" height="195" rx="12" fill="#0f172a" stroke="#f43f5e" stroke-width="2" />
    <rect width="260" height="34" rx="12" fill="#e11d48" />
    <text x="130" y="22" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">1. HEADER (ĐỎ)</text>
    <text x="14" y="58" font-family="sans-serif" font-size="11" fill="#fecdd3" font-weight="700">Thuật toán &amp; Kiểu token</text>
    <rect x="14" y="70" width="232" height="75" rx="6" fill="#1e293b" />
    <text x="24" y="92" font-family="monospace" font-size="10" fill="#cbd5e1">{</text>
    <text x="34" y="110" font-family="monospace" font-size="10" fill="#fb7185">  "alg": "HS256",</text>
    <text x="34" y="128" font-family="monospace" font-size="10" fill="#fb7185">  "typ": "JWT"</text>
    <text x="24" y="142" font-family="monospace" font-size="10" fill="#cbd5e1">}</text>
    <text x="14" y="168" font-family="sans-serif" font-size="10" fill="#94a3b8">Mã hóa Base64Url sang chuỗi 1</text>
  </g>

  <!-- Part 2: Payload -->
  <g transform="translate(350, 165)" filter="url(#jwtDrop)">
    <rect width="260" height="195" rx="12" fill="#0f172a" stroke="#a855f7" stroke-width="2" />
    <rect width="260" height="34" rx="12" fill="#7e22ce" />
    <text x="130" y="22" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">2. PAYLOAD (TÍM)</text>
    <text x="14" y="58" font-family="sans-serif" font-size="11" fill="#f3e8ff" font-weight="700">Thông tin người dùng (Claims)</text>
    <rect x="14" y="70" width="232" height="95" rx="6" fill="#1e293b" />
    <text x="24" y="90" font-family="monospace" font-size="10" fill="#cbd5e1">{</text>
    <text x="34" y="106" font-family="monospace" font-size="10" fill="#c084fc">  "id": 42,</text>
    <text x="34" y="122" font-family="monospace" font-size="10" fill="#c084fc">  "role": "admin",</text>
    <text x="34" y="138" font-family="monospace" font-size="10" fill="#c084fc">  "exp": 1740000000</text>
    <text x="24" y="154" font-family="monospace" font-size="10" fill="#cbd5e1">}</text>
    <text x="14" y="182" font-family="sans-serif" font-size="10" fill="#94a3b8">⚠️ Không lưu password/bí mật tại đây!</text>
  </g>

  <!-- Part 3: Signature -->
  <g transform="translate(640, 165)" filter="url(#jwtDrop)">
    <rect width="260" height="195" rx="12" fill="#0f172a" stroke="#0284c7" stroke-width="2" />
    <rect width="260" height="34" rx="12" fill="#0369a1" />
    <text x="130" y="22" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">3. SIGNATURE (XANH)</text>
    <text x="14" y="58" font-family="sans-serif" font-size="11" fill="#bae6fd" font-weight="700">Chữ ký số chống giả mạo</text>
    <rect x="14" y="70" width="232" height="95" rx="6" fill="#1e293b" />
    <text x="20" y="90" font-family="monospace" font-size="9.5" fill="#38bdf8">HMACSHA256(</text>
    <text x="26" y="108" font-family="monospace" font-size="9" fill="#fb7185">  base64Url(header) + "." +</text>
    <text x="26" y="126" font-family="monospace" font-size="9" fill="#c084fc">  base64Url(payload),</text>
    <text x="26" y="144" font-family="monospace" font-size="9.5" fill="#facc15">  JWT_SECRET</text>
    <text x="20" y="160" font-family="monospace" font-size="9.5" fill="#38bdf8">)</text>
    <text x="14" y="182" font-family="sans-serif" font-size="10" fill="#94a3b8">Chỉ Server nắm giữ JWT_SECRET</text>
  </g>

  <!-- Alert -->
  <rect x="60" y="380" width="840" height="65" rx="10" fill="#1e293b" stroke="#334155" />
  <text x="80" y="408" font-family="sans-serif" font-size="12" fill="#f87171" font-weight="700">⛔ Cảnh báo quan trọng:</text>
  <text x="80" y="428" font-family="sans-serif" font-size="11" fill="#cbd5e1">Base64Url là phương thức mã hóa 2 chiều có thể decode dịch ngược bất kỳ lúc nào, KHÔNG PHẢI MÃ HÓA BẢO MẬT (Encryption)!</text>
</svg>`);

// 12. refresh-token-flow.svg
writeSvg('refresh-token-flow.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="rfBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <filter id="rfDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
    <marker id="rfArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
    </marker>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#rfBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">QUY TRÌNH XOAY VÒNG VÀ LÀM MỚI TOKEN (SILENT REFRESH TOKEN)</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Cân bằng giữa Bảo mật (Access Token 15 phút) và Trải nghiệm người dùng không bị văng đăng nhập (Refresh Token 7 ngày)</text>

  <!-- Left: Client -->
  <g transform="translate(60, 105)" filter="url(#rfDrop)">
    <rect width="180" height="320" rx="14" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <rect width="180" height="36" rx="14" fill="#0284c7" />
    <text x="90" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">📱 FRONT-END CLIENT</text>

    <text x="14" y="65" font-family="sans-serif" font-size="11" fill="#bae6fd" font-weight="700">Bộ nhớ Client</text>
    <rect x="14" y="78" width="152" height="40" rx="6" fill="#1e293b" />
    <text x="20" y="96" font-family="monospace" font-size="9.5" fill="#34d399">Access Token</text>
    <text x="20" y="110" font-family="sans-serif" font-size="8.5" fill="#94a3b8">Hạn 15 phút (RAM/State)</text>

    <rect x="14" y="130" width="152" height="40" rx="6" fill="#1e293b" />
    <text x="20" y="148" font-family="monospace" font-size="9.5" fill="#c084fc">Refresh Token</text>
    <text x="20" y="162" font-family="sans-serif" font-size="8.5" fill="#94a3b8">HttpOnly Cookie (7 ngày)</text>

    <text x="14" y="195" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Axios / Fetch Interceptor</text>
    <text x="14" y="215" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Khi gặp 401 Unauthorized:</text>
    <text x="14" y="235" font-family="sans-serif" font-size="10" fill="#f59e0b">  Tự động gọi /refresh</text>
    <text x="14" y="255" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Nhận token mới và chạy lại request cũ mượt mà</text>
  </g>

  <!-- Middle Steps -->
  <g transform="translate(260, 110)">
    <!-- Line 1 -->
    <path d="M 0 30 L 400 30" fill="none" stroke="#38bdf8" stroke-width="2" marker-end="url(#rfArr)" />
    <text x="200" y="22" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#38bdf8">1. POST /api/posts + Bearer Token hết hạn</text>

    <!-- Line 2 -->
    <path d="M 400 70 L 0 70" fill="none" stroke="#f87171" stroke-width="2" marker-end="url(#rfArr)" />
    <text x="200" y="62" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#f87171">2. HTTP 401 Unauthorized (jwt expired)</text>

    <!-- Line 3 -->
    <path d="M 0 120 L 400 120" fill="none" stroke="#c084fc" stroke-width="2" marker-end="url(#rfArr)" />
    <text x="200" y="112" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#c084fc">3. POST /auth/refresh-token (Kèm Cookie)</text>

    <!-- Line 4 -->
    <path d="M 400 160 L 0 160" fill="none" stroke="#34d399" stroke-width="2" marker-end="url(#rfArr)" />
    <text x="200" y="152" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#34d399">4. 200 OK + Access Token mới + Đổi Refresh mới</text>

    <!-- Line 5 -->
    <path d="M 0 210 L 400 210" fill="none" stroke="#38bdf8" stroke-width="2" marker-end="url(#rfArr)" />
    <text x="200" y="202" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#38bdf8">5. Gửi lại POST /api/posts với Token mới</text>

    <!-- Line 6 -->
    <path d="M 400 250 L 0 250" fill="none" stroke="#34d399" stroke-width="2" marker-end="url(#rfArr)" />
    <text x="200" y="242" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#34d399">6. 201 Created (Thành công hoàn toàn!)</text>
  </g>

  <!-- Right: Server -->
  <g transform="translate(680, 105)" filter="url(#rfDrop)">
    <rect width="220" height="320" rx="14" fill="#0f172a" stroke="#059669" stroke-width="1.5" />
    <rect width="220" height="36" rx="14" fill="#059669" />
    <text x="110" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">🖥️ EXPRESS AUTH SERVER</text>

    <text x="14" y="65" font-family="sans-serif" font-size="11" fill="#a7f3d0" font-weight="700">Kiểm tra bảo mật</text>
    <text x="14" y="90" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Xác thực chữ ký Refresh Token</text>
    <text x="14" y="112" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Kiểm tra token trong DB/Whitelist</text>
    <text x="14" y="134" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Cơ chế Token Rotation:</text>
    <text x="14" y="154" font-family="sans-serif" font-size="10" fill="#f87171">  Huỷ Refresh Token cũ ngay</text>
    <text x="14" y="172" font-family="sans-serif" font-size="10" fill="#34d399">  Phát Refresh Token mới</text>
    <text x="14" y="200" font-family="sans-serif" font-size="10" fill="#f59e0b">🛡️ Phát hiện tấn công đánh cắp:</text>
    <text x="14" y="220" font-family="sans-serif" font-size="9.5" fill="#cbd5e1">Nếu 1 Refresh Token cũ bị tái sử dụng ➔ Lập tức thu hồi toàn bộ phiên đăng nhập của User!</text>
  </g>
</svg>`);

// 13. rbac-matrix.svg
writeSvg('rbac-matrix.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="rbBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <filter id="rbDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#rbBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">MA TRẬN PHÂN QUYỀN VAI TRÒ (ROLE-BASED ACCESS CONTROL - RBAC)</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Bảo vệ tài nguyên theo vai trò (Roles) và quyền sở hữu tác giả (Resource Ownership Guard)</text>

  <!-- Table Container -->
  <g transform="translate(60, 100)" filter="url(#rbDrop)">
    <rect width="840" height="250" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1.5" />

    <!-- Table Header -->
    <rect width="840" height="45" rx="12" fill="#1e293b" />
    <text x="140" y="28" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12.5" fill="#ffffff">VAI TRÒ (ROLE)</text>
    <text x="320" y="28" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12.5" fill="#ffffff">GET (ĐỌC BÀI)</text>
    <text x="460" y="28" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12.5" fill="#ffffff">POST (TẠO MỚI)</text>
    <text x="600" y="28" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12.5" fill="#ffffff">PUT (SỬA)</text>
    <text x="740" y="28" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12.5" fill="#ffffff">DELETE (XÓA)</text>

    <!-- Row 1: ADMIN -->
    <line x1="0" y1="45" x2="840" y2="45" stroke="#334155" />
    <text x="140" y="80" text-anchor="middle" font-family="monospace" font-size="12" fill="#ef4444" font-weight="700">👑 ADMIN</text>
    <text x="320" y="80" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#34d399">✅ Mọi bài</text>
    <text x="460" y="80" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#34d399">✅ Toàn quyền</text>
    <text x="600" y="80" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#34d399">✅ Mọi bài</text>
    <text x="740" y="80" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#34d399">✅ Mọi bài</text>

    <!-- Row 2: AUTHOR / MEMBER -->
    <line x1="0" y1="100" x2="840" y2="100" stroke="#334155" />
    <text x="140" y="135" text-anchor="middle" font-family="monospace" font-size="12" fill="#38bdf8" font-weight="700">✍️ AUTHOR</text>
    <text x="320" y="135" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#34d399">✅ Mọi bài</text>
    <text x="460" y="135" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#34d399">✅ Tạo bài mới</text>
    <text x="600" y="135" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#fbbf24">⚠️ Chỉ bài của mình</text>
    <text x="740" y="135" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#fbbf24">⚠️ Chỉ bài của mình</text>

    <!-- Row 3: USER / VIEWER -->
    <line x1="0" y1="155" x2="840" y2="155" stroke="#334155" />
    <text x="140" y="190" text-anchor="middle" font-family="monospace" font-size="12" fill="#a7f3d0" font-weight="700">👤 USER / VIEWER</text>
    <text x="320" y="190" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#34d399">✅ Mọi bài</text>
    <text x="460" y="190" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f87171">❌ 403 Forbidden</text>
    <text x="600" y="190" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f87171">❌ 403 Forbidden</text>
    <text x="740" y="190" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f87171">❌ 403 Forbidden</text>

    <!-- Row 4: GUEST -->
    <line x1="0" y1="210" x2="840" y2="210" stroke="#334155" />
    <text x="140" y="235" text-anchor="middle" font-family="monospace" font-size="12" fill="#94a3b8">🌐 GUEST (ẨN DANH)</text>
    <text x="320" y="235" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#34d399">✅ Bài public</text>
    <text x="460" y="235" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f87171">❌ 401 Unauthorized</text>
    <text x="600" y="235" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f87171">❌ 401 Unauthorized</text>
    <text x="740" y="235" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#f87171">❌ 401 Unauthorized</text>
  </g>

  <!-- Ownership Middleware snippet -->
  <rect x="60" y="370" width="840" height="85" rx="10" fill="#1e293b" stroke="#334155" />
  <text x="80" y="398" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="700">🛡️ Middleware kiểm tra quyền sở hữu bài viết (checkOwnership):</text>
  <text x="80" y="420" font-family="monospace" font-size="10.5" fill="#a7f3d0">if (req.user.role !== 'admin' &amp;&amp; post.authorId !== req.user.id) {</text>
  <text x="80" y="440" font-family="monospace" font-size="10.5" fill="#f87171">  return res.status(403).json({ message: 'Bạn không có quyền sửa hoặc xóa bài này!' }); }</text>
</svg>`);

// 14. multipart-upload.svg
writeSvg('multipart-upload.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="mpBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <linearGradient id="multGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ec4899" />
      <stop offset="100%" stop-color="#be185d" />
    </linearGradient>
    <filter id="mpDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#mpBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">XỬ LÝ UPLOAD FILE MULTIPART/FORM-DATA VỚI MULTER</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Bóc tách nhị phân (Binary Boundary Parsing) giữa trường text thông thường và tập tin đính kèm</text>

  <!-- Left: Browser Form -->
  <g transform="translate(60, 105)" filter="url(#mpDrop)">
    <rect width="240" height="250" rx="14" fill="#0f172a" stroke="#ec4899" stroke-width="2" />
    <rect width="240" height="38" rx="14" fill="url(#multGrad)" />
    <text x="120" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">1. CLIENT FORMDATA</text>

    <text x="14" y="65" font-family="monospace" font-size="10.5" fill="#f472b6">Content-Type:</text>
    <text x="14" y="82" font-family="monospace" font-size="9" fill="#cbd5e1">multipart/form-data; boundary=---X</text>

    <rect x="14" y="98" width="212" height="60" rx="6" fill="#1e293b" />
    <text x="22" y="118" font-family="monospace" font-size="10" fill="#38bdf8">title: 'Ảnh đại diện'</text>
    <text x="22" y="138" font-family="monospace" font-size="10" fill="#fbbf24">avatar: &lt;avatar.png&gt;</text>

    <text x="14" y="180" font-family="sans-serif" font-size="10" fill="#94a3b8">• Trình duyệt tự sinh boundary</text>
    <text x="14" y="200" font-family="sans-serif" font-size="10" fill="#94a3b8">• Truyền dữ liệu dạng binary stream</text>
    <text x="14" y="220" font-family="sans-serif" font-size="10" fill="#94a3b8">• express.json() không đọc được!</text>
  </g>

  <!-- Center: Multer Middleware -->
  <g transform="translate(340, 95)" filter="url(#mpDrop)">
    <rect width="280" height="270" rx="14" fill="#0f172a" stroke="#6366f1" stroke-width="2" />
    <rect width="280" height="38" rx="14" fill="#4338ca" />
    <text x="140" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">2. MULTER ENGINE</text>

    <text x="14" y="65" font-family="sans-serif" font-size="11" fill="#c7d2fe" font-weight="700">Tùy chọn Lưu Trữ (Storage Engine)</text>

    <rect x="14" y="78" width="252" height="70" rx="6" fill="#1e293b" />
    <text x="22" y="98" font-family="monospace" font-size="10.5" fill="#34d399">multer.diskStorage()</text>
    <text x="22" y="116" font-family="sans-serif" font-size="10" fill="#cbd5e1">Ghi thẳng xuống ổ cứng /uploads</text>
    <text x="22" y="134" font-family="sans-serif" font-size="10" fill="#94a3b8">Tiết kiệm RAM máy chủ</text>

    <rect x="14" y="158" width="252" height="70" rx="6" fill="#1e293b" />
    <text x="22" y="178" font-family="monospace" font-size="10.5" fill="#f59e0b">multer.memoryStorage()</text>
    <text x="22" y="196" font-family="sans-serif" font-size="10" fill="#cbd5e1">Lưu trong RAM (req.file.buffer)</text>
    <text x="22" y="214" font-family="sans-serif" font-size="10" fill="#94a3b8">Dành cho Sharp crop ảnh, nén ảnh</text>

    <text x="14" y="250" font-family="monospace" font-size="10" fill="#38bdf8">limits: { fileSize: 5 * 1024 * 1024 }</text>
  </g>

  <!-- Right: Route Handler Outcome -->
  <g transform="translate(660, 105)" filter="url(#mpDrop)">
    <rect width="240" height="250" rx="14" fill="#0f172a" stroke="#10b981" stroke-width="2" />
    <rect width="240" height="38" rx="14" fill="#059669" />
    <text x="120" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">3. ROUTE HANDLER (REQ)</text>

    <text x="14" y="65" font-family="sans-serif" font-size="11" fill="#a7f3d0" font-weight="700">Dữ liệu được bóc tách hoàn chỉnh:</text>

    <rect x="14" y="78" width="212" height="50" rx="6" fill="#1e293b" />
    <text x="22" y="98" font-family="monospace" font-size="10" fill="#38bdf8">req.body</text>
    <text x="22" y="116" font-family="monospace" font-size="9" fill="#cbd5e1">{ title: 'Ảnh đại diện' }</text>

    <rect x="14" y="136" width="212" height="60" rx="6" fill="#1e293b" />
    <text x="22" y="156" font-family="monospace" font-size="10" fill="#34d399">req.file / req.files</text>
    <text x="22" y="172" font-family="monospace" font-size="9" fill="#cbd5e1">{ filename, size, mimetype,</text>
    <text x="22" y="186" font-family="monospace" font-size="9" fill="#cbd5e1">  path, destination }</text>

    <text x="14" y="220" font-family="sans-serif" font-size="10" fill="#34d399">Lưu path vào DB &amp; trả JSON!</text>
  </g>

  <!-- Security callout -->
  <rect x="60" y="380" width="840" height="65" rx="10" fill="#1e293b" stroke="#334155" />
  <text x="80" y="408" font-family="sans-serif" font-size="12" fill="#f87171" font-weight="700">🛡️ Phòng chống tải file độc hại (RCE Web Shell):</text>
  <text x="80" y="428" font-family="sans-serif" font-size="11" fill="#cbd5e1">Không bao giờ tin tưởng đuôi file client gửi lên (.php, .sh). Luôn đổi tên file thành UUID ngẫu nhiên và dùng fileFilter kiểm tra MIME type!</text>
</svg>`);

// 15. test-pyramid.svg
writeSvg('test-pyramid.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="tpBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <filter id="tpDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#tpBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">KIM TỰ THÁP KIỂM THỬ PHẦN MỀM (TEST PYRAMID) TRONG NODE.JS</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Cân bằng chiến lược kiểm thử tự động giữa Chi phí thực thi, Tốc độ chạy và Độ tin cậy</text>

  <!-- Pyramid Levels -->
  <g transform="translate(100, 100)" filter="url(#tpDrop)">
    <!-- Top: E2E Tests -->
    <polygon points="380,10 240,90 520,90" fill="#dc2626" stroke="#f87171" stroke-width="2" />
    <text x="380" y="55" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">E2E TESTS</text>
    <text x="380" y="75" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#fecaca">(Playwright / Cypress)</text>

    <!-- Mid: Integration Tests -->
    <polygon points="240,95 520,95 590,180 170,180" fill="#0284c7" stroke="#38bdf8" stroke-width="2" />
    <text x="380" y="130" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="14" fill="#ffffff">INTEGRATION TESTS (SUPERTEST + JEST)</text>
    <text x="380" y="152" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#bae6fd">Kiểm thử toàn bộ luồng REST API qua HTTP Request ảo</text>

    <!-- Bottom: Unit Tests -->
    <polygon points="170,185 590,185 670,270 90,270" fill="#059669" stroke="#34d399" stroke-width="2" />
    <text x="380" y="220" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="15" fill="#ffffff">UNIT TESTS (JEST)</text>
    <text x="380" y="242" text-anchor="middle" font-family="sans-serif" font-size="11.5" fill="#a7f3d0">Kiểm thử hàm toán tử, helper, service độc lập chạy siêu tốc (&lt; 1 giây)</text>
  </g>

  <!-- Comparison Indicators -->
  <g transform="translate(740, 110)">
    <text x="0" y="30" font-family="sans-serif" font-size="12" fill="#ef4444" font-weight="700">▲ TỐN KÉM NHẤT</text>
    <text x="0" y="50" font-family="sans-serif" font-size="11" fill="#94a3b8">• Chạy chậm</text>
    <text x="0" y="68" font-family="sans-serif" font-size="11" fill="#94a3b8">• Dễ bị flaky</text>

    <text x="0" y="130" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="700">★ TRỌNG TÂM BACKEND</text>
    <text x="0" y="150" font-family="sans-serif" font-size="11" fill="#cbd5e1">• Kiểm thử Route + Controller</text>
    <text x="0" y="168" font-family="sans-serif" font-size="11" fill="#cbd5e1">• Đo chuẩn HTTP status &amp; JSON</text>

    <text x="0" y="225" font-family="sans-serif" font-size="12" fill="#34d399" font-weight="700">▼ SỐ LƯỢNG NHIỀU NHẤT</text>
    <text x="0" y="245" font-family="sans-serif" font-size="11" fill="#a7f3d0">• Chạy siêu nhanh</text>
    <text x="0" y="263" font-family="sans-serif" font-size="11" fill="#a7f3d0">• Dễ bảo trì</text>
  </g>

  <!-- Supertest Snippet -->
  <rect x="60" y="380" width="840" height="65" rx="10" fill="#1e293b" stroke="#334155" />
  <text x="80" y="408" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="700">💻 Ví dụ Supertest kiểm thử REST API:</text>
  <text x="80" y="428" font-family="monospace" font-size="10.5" fill="#a7f3d0">const res = await request(app).get('/api/posts').expect(200); expect(res.body.data).toHaveLength(5);</text>
</svg>`);

// 16. docker-architecture.svg
writeSvg('docker-architecture.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="dkBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <linearGradient id="dkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
    <filter id="dkDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
    <marker id="dkArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
    </marker>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#dkBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">VÒNG ĐỜI ĐÓNG GÓI ỨNG DỤNG VỚI DOCKER CONTAINER</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">"Chạy được trên máy tôi thì cũng chạy được trên Server": Xóa bỏ hoàn toàn xung đột môi trường</text>

  <!-- Step 1: Dockerfile -->
  <g transform="translate(60, 110)" filter="url(#dkDrop)">
    <rect width="210" height="230" rx="14" fill="#0f172a" stroke="#0284c7" stroke-width="1.5" />
    <rect width="210" height="36" rx="14" fill="url(#dkGrad)" />
    <text x="105" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">📄 1. DOCKERFILE</text>
    <text x="14" y="65" font-family="sans-serif" font-size="11" fill="#bae6fd" font-weight="700">Công thức đóng gói</text>
    <rect x="14" y="78" width="182" height="110" rx="6" fill="#1e293b" />
    <text x="22" y="98" font-family="monospace" font-size="9.5" fill="#38bdf8">FROM node:20-alpine</text>
    <text x="22" y="116" font-family="monospace" font-size="9.5" fill="#cbd5e1">WORKDIR /app</text>
    <text x="22" y="134" font-family="monospace" font-size="9.5" fill="#cbd5e1">COPY package*.json ./</text>
    <text x="22" y="152" font-family="monospace" font-size="9.5" fill="#34d399">RUN npm ci --only=prod</text>
    <text x="22" y="170" font-family="monospace" font-size="9.5" fill="#fbbf24">CMD ["npm", "start"]</text>
    <text x="14" y="210" font-family="monospace" font-size="10" fill="#94a3b8">$ docker build -t app .</text>
  </g>

  <!-- Arrow 1 -->
  <path d="M 270 225 L 340 225" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#dkArr)" />
  <text x="305" y="212" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#38bdf8">build</text>

  <!-- Step 2: Docker Image -->
  <g transform="translate(350, 110)" filter="url(#dkDrop)">
    <rect width="210" height="230" rx="14" fill="#0f172a" stroke="#6366f1" stroke-width="1.5" />
    <rect width="210" height="36" rx="14" fill="#4f46e5" />
    <text x="105" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">📦 2. DOCKER IMAGE</text>
    <text x="14" y="65" font-family="sans-serif" font-size="11" fill="#c7d2fe" font-weight="700">Khuôn mẫu bất biến</text>
    <text x="14" y="90" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Chứa OS tối giản (Alpine)</text>
    <text x="14" y="112" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Chứa Node runtime 20</text>
    <text x="14" y="134" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Chứa source code &amp; modules</text>
    <text x="14" y="156" font-family="sans-serif" font-size="10.5" fill="#cbd5e1">• Chỉ đọc (Read-Only Layer)</text>
    <text x="14" y="180" font-family="sans-serif" font-size="10" fill="#a7f3d0">Đẩy lên Docker Hub / ECR</text>
    <text x="14" y="210" font-family="monospace" font-size="10" fill="#94a3b8">$ docker run -p 3000:3000</text>
  </g>

  <!-- Arrow 2 -->
  <path d="M 560 225 L 630 225" fill="none" stroke="#38bdf8" stroke-width="3" marker-end="url(#dkArr)" />
  <text x="595" y="212" text-anchor="middle" font-family="monospace" font-size="10.5" fill="#38bdf8">run</text>

  <!-- Step 3: Container Instances -->
  <g transform="translate(640, 110)" filter="url(#dkDrop)">
    <rect width="260" height="230" rx="14" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
    <rect width="260" height="36" rx="14" fill="#059669" />
    <text x="130" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">🚀 3. RUNNING CONTAINER</text>
    <text x="14" y="65" font-family="sans-serif" font-size="11" fill="#a7f3d0" font-weight="700">Tiến trình chạy cô lập hoàn toàn</text>

    <rect x="14" y="78" width="232" height="40" rx="6" fill="#1e293b" />
    <text x="22" y="96" font-family="monospace" font-size="10" fill="#34d399">Instance 1: port 3000</text>
    <text x="22" y="110" font-family="sans-serif" font-size="8.5" fill="#94a3b8">Chạy độc lập trên CPU/RAM sandbox</text>

    <rect x="14" y="125" width="232" height="40" rx="6" fill="#1e293b" />
    <text x="22" y="143" font-family="monospace" font-size="10" fill="#34d399">Instance 2: port 3001</text>
    <text x="22" y="157" font-family="sans-serif" font-size="8.5" fill="#94a3b8">Dễ dàng nhân bản Scale Up tức thì</text>

    <text x="14" y="185" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Ghép nối bằng docker-compose.yml</text>
    <text x="14" y="202" font-family="monospace" font-size="9.5" fill="#f59e0b">services: [ node-app, mysql-db ]</text>
  </g>

  <!-- Footer note -->
  <rect x="60" y="375" width="840" height="65" rx="10" fill="#1e293b" stroke="#334155" />
  <text x="80" y="402" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="700">💡 Điểm phân biệt then chốt:</text>
  <text x="80" y="422" font-family="sans-serif" font-size="11" fill="#cbd5e1">Container dùng chung nhân Linux Kernel của máy chủ chủ quản (Host), khởi động chỉ trong 1-2 giây chứ không cồng kềnh như Máy ảo VirtualBox/VMware!</text>
</svg>`);

// 17. cloud-deploy.svg
writeSvg('cloud-deploy.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="100%">
  <defs>
    <linearGradient id="cdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1222" />
      <stop offset="100%" stop-color="#111c35" />
    </linearGradient>
    <filter id="cdDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.45" />
    </filter>
    <marker id="cdArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
    </marker>
  </defs>

  <rect width="960" height="480" rx="16" fill="url(#cdBg)" stroke="#1e293b" stroke-width="2" />

  <text x="480" y="44" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="20" fill="#ffffff" letter-spacing="0.5">KIẾN TRÚC TRIỂN KHAI PRODUCTION: CLIENT ➔ NGINX ➔ PM2 ➔ MYSQL</text>
  <text x="480" y="68" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12.5" fill="#94a3b8">Mô hình vận hành tiêu chuẩn công nghiệp đảm bảo High Availability, Zero Downtime Reload và Bảo mật SSL</text>

  <!-- Step 1: Internet Client -->
  <g transform="translate(40, 110)" filter="url(#cdDrop)">
    <rect width="160" height="240" rx="14" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <rect width="160" height="36" rx="14" fill="#0284c7" />
    <text x="80" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">🌐 INTERNET</text>
    <text x="12" y="65" font-family="sans-serif" font-size="11" fill="#bae6fd" font-weight="700">Người dùng</text>
    <text x="12" y="90" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Web Browsers</text>
    <text x="12" y="110" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Mobile Apps (Flutter/React)</text>
    <text x="12" y="130" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Third-party Webhooks</text>
    <text x="12" y="160" font-family="monospace" font-size="9.5" fill="#38bdf8">https://api.devblog.vn</text>
    <text x="12" y="180" font-family="sans-serif" font-size="9.5" fill="#94a3b8">Port 443 (HTTPS an toàn)</text>
  </g>

  <!-- Arrow 1 -->
  <path d="M 200 230 L 245 230" fill="none" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#cdArr)" />

  <!-- Step 2: Nginx Reverse Proxy -->
  <g transform="translate(250, 100)" filter="url(#cdDrop)">
    <rect width="200" height="260" rx="14" fill="#0f172a" stroke="#10b981" stroke-width="2" />
    <rect width="200" height="38" rx="14" fill="#059669" />
    <text x="100" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">⚡ NGINX REVERSE PROXY</text>
    <text x="12" y="65" font-family="sans-serif" font-size="11" fill="#a7f3d0" font-weight="700">Tầng Gateway Tiền Tuyến</text>
    <text x="12" y="88" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Xử lý SSL/TLS Handshake</text>
    <text x="12" y="108" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Nén Gzip / Brotli tự động</text>
    <text x="12" y="128" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Phục vụ Static Files (/uploads)</text>
    <text x="12" y="148" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Chặn DDoS / Rate limit sơ bộ</text>
    <rect x="12" y="170" width="176" height="42" rx="6" fill="#1e293b" />
    <text x="20" y="188" font-family="monospace" font-size="9" fill="#34d399">proxy_pass</text>
    <text x="20" y="202" font-family="monospace" font-size="9" fill="#cbd5e1">http://127.0.0.1:3000;</text>
  </g>

  <!-- Arrow 2 -->
  <path d="M 450 230 L 495 230" fill="none" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#cdArr)" />

  <!-- Step 3: Node.js Cluster with PM2 -->
  <g transform="translate(500, 100)" filter="url(#cdDrop)">
    <rect width="210" height="260" rx="14" fill="#0f172a" stroke="#818cf8" stroke-width="2" />
    <rect width="210" height="38" rx="14" fill="#4f46e5" />
    <text x="105" y="24" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="13" fill="#ffffff">⚙️ PM2 CLUSTER MODE</text>
    <text x="12" y="65" font-family="sans-serif" font-size="11" fill="#c7d2fe" font-weight="700">Quản lý Tiến trình Node</text>

    <rect x="12" y="78" width="186" height="34" rx="6" fill="#1e293b" />
    <text x="20" y="96" font-family="monospace" font-size="9.5" fill="#34d399">Node App (Core CPU 1)</text>

    <rect x="12" y="118" width="186" height="34" rx="6" fill="#1e293b" />
    <text x="20" y="136" font-family="monospace" font-size="9.5" fill="#34d399">Node App (Core CPU 2)</text>

    <rect x="12" y="158" width="186" height="34" rx="6" fill="#1e293b" />
    <text x="20" y="176" font-family="monospace" font-size="9.5" fill="#34d399">Node App (Core CPU 3..N)</text>

    <text x="12" y="210" font-family="sans-serif" font-size="9.5" fill="#f59e0b">• Tự động hồi sinh khi crash (Auto-restart)</text>
    <text x="12" y="228" font-family="sans-serif" font-size="9.5" fill="#a7f3d0">• Reload không gián đoạn (Zero downtime)</text>
  </g>

  <!-- Arrow 3 -->
  <path d="M 710 230 L 755 230" fill="none" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#cdArr)" />

  <!-- Step 4: MySQL Database -->
  <g transform="translate(760, 110)" filter="url(#cdDrop)">
    <rect width="160" height="240" rx="14" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5" />
    <rect width="160" height="36" rx="14" fill="#d97706" />
    <text x="80" y="23" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="12" fill="#ffffff">🛢️ MYSQL 8.0</text>
    <text x="12" y="65" font-family="sans-serif" font-size="11" fill="#fde68a" font-weight="700">Tầng Dữ liệu</text>
    <text x="12" y="90" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Chỉ mở bind 127.0.0.1 (Localhost)</text>
    <text x="12" y="120" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Không public port 3306 ra ngoài Internet</text>
    <text x="12" y="160" font-family="sans-serif" font-size="10" fill="#cbd5e1">• Tự động Backup hàng ngày (Cronjob)</text>
    <text x="12" y="195" font-family="monospace" font-size="9.5" fill="#34d399">Port 3306 (Internal)</text>
  </g>

  <!-- Summary Note -->
  <rect x="40" y="380" width="880" height="65" rx="10" fill="#1e293b" stroke="#334155" />
  <text x="60" y="408" font-family="sans-serif" font-size="12" fill="#38bdf8" font-weight="700">🚀 Lợi ích tổng thể của kiến trúc:</text>
  <text x="60" y="428" font-family="sans-serif" font-size="11" fill="#cbd5e1">An toàn bảo mật (không để lộ cổng Node.js ra Internet), chịu tải cao (Multi-core Cluster) và quản lý tiến trình tự động 24/7.</text>
</svg>`);

console.log('All architecture SVGs generated successfully!');
