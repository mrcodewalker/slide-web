const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'assets', 'img');

// 1. html5-semantic-layout.svg
const semanticSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620" width="100%" height="100%">
  <defs>
    <linearGradient id="bgG" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Canvas -->
  <rect width="900" height="620" rx="16" fill="url(#bgG)"/>
  <rect x="30" y="30" width="840" height="560" rx="12" fill="#0b1120" stroke="#334155" stroke-width="2"/>

  <!-- Top bar / Browser Mockup -->
  <rect x="30" y="30" width="840" height="42" rx="12" fill="#1e293b"/>
  <circle cx="56" cy="51" r="6" fill="#ef4444"/>
  <circle cx="76" cy="51" r="6" fill="#f59e0b"/>
  <circle cx="96" cy="51" r="6" fill="#10b981"/>
  <rect x="130" y="40" width="450" height="22" rx="6" fill="#0f172a" stroke="#334155"/>
  <text x="145" y="55" fill="#94a3b8" font-family="monospace" font-size="12">https://devblog.edu.vn/posts/semantic-html</text>

  <!-- BODY Container Label -->
  <text x="50" y="96" fill="#64748b" font-family="monospace" font-size="13" font-weight="bold">&lt;body&gt; — Khung Cấu Trúc Ngữ Nghĩa HTML5 Tiêu Chuẩn</text>

  <!-- HEADER -->
  <g filter="url(#shadow)">
    <rect x="50" y="110" width="800" height="64" rx="8" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
    <text x="70" y="146" fill="#c7d2fe" font-family="sans-serif" font-size="16" font-weight="bold">&lt;header&gt;</text>
    <text x="160" y="146" fill="#818cf8" font-family="sans-serif" font-size="13">Logo website, Slogan, Tiêu đề thương hiệu</text>
  </g>

  <!-- NAV -->
  <g filter="url(#shadow)">
    <rect x="50" y="184" width="800" height="46" rx="8" fill="#14532d" stroke="#22c55e" stroke-width="2"/>
    <text x="70" y="213" fill="#bbf7d0" font-family="sans-serif" font-size="15" font-weight="bold">&lt;nav&gt;</text>
    <text x="135" y="213" fill="#86efac" font-family="sans-serif" font-size="13">Thanh điều hướng chính: [Trang chủ] [Bài viết] [Chuyên mục] [Về tác giả]</text>
  </g>

  <!-- MAIN & ASIDE Wrapper -->
  <!-- MAIN -->
  <g filter="url(#shadow)">
    <rect x="50" y="240" width="550" height="270" rx="8" fill="#172554" stroke="#3b82f6" stroke-width="2"/>
    <text x="70" y="268" fill="#bfdbfe" font-family="sans-serif" font-size="15" font-weight="bold">&lt;main&gt;</text>
    <text x="140" y="268" fill="#93c5fd" font-family="sans-serif" font-size="12">Nội dung cốt lõi độc nhất của trang web (duy nhất 1 thẻ/trang)</text>

    <!-- ARTICLE inside MAIN -->
    <rect x="70" y="285" width="510" height="110" rx="6" fill="#1e3a8a" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4 3"/>
    <text x="86" y="310" fill="#dbeafe" font-family="sans-serif" font-size="14" font-weight="bold">&lt;article&gt;</text>
    <text x="165" y="310" fill="#bfdbfe" font-family="sans-serif" font-size="12">Bài viết độc lập, có thể tái phân phối (RSS / News)</text>
    
    <rect x="86" y="325" width="478" height="55" rx="4" fill="#0f172a" fill-opacity="0.6"/>
    <text x="100" y="348" fill="#94a3b8" font-family="sans-serif" font-size="12">&lt;h1&gt;Tiêu đề bài viết&lt;/h1&gt; &amp; &lt;p&gt;Đoạn văn nội dung...&lt;/p&gt;</text>
    <text x="100" y="368" fill="#64748b" font-family="sans-serif" font-size="11">&lt;time datetime="2026-10-28"&gt;28/10/2026&lt;/time&gt; · Tác giả: Admin</text>

    <!-- SECTION inside MAIN -->
    <rect x="70" y="405" width="510" height="90" rx="6" fill="#1e3a8a" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="4 3"/>
    <text x="86" y="430" fill="#dbeafe" font-family="sans-serif" font-size="14" font-weight="bold">&lt;section&gt;</text>
    <text x="170" y="430" fill="#bfdbfe" font-family="sans-serif" font-size="12">Khu vực phân nhóm chủ đề (ví dụ: Bình luận của bạn đọc)</text>
    <rect x="86" y="445" width="478" height="38" rx="4" fill="#0f172a" fill-opacity="0.6"/>
    <text x="100" y="468" fill="#94a3b8" font-family="sans-serif" font-size="12">&lt;h2&gt;Bình luận (14)&lt;/h2&gt; kèm form &lt;form&gt; gửi bình luận</text>
  </g>

  <!-- ASIDE (Sidebar) -->
  <g filter="url(#shadow)">
    <rect x="615" y="240" width="235" height="270" rx="8" fill="#451a03" stroke="#f59e0b" stroke-width="2"/>
    <text x="635" y="268" fill="#fde68a" font-family="sans-serif" font-size="15" font-weight="bold">&lt;aside&gt;</text>
    <text x="635" y="295" fill="#fef3c7" font-family="sans-serif" font-size="12">Nội dung phụ trợ (Sidebar):</text>
    <rect x="630" y="310" width="205" height="45" rx="4" fill="#1e293b"/>
    <text x="642" y="337" fill="#fbbf24" font-family="sans-serif" font-size="12">📌 Danh mục bài viết</text>
    <rect x="630" y="365" width="205" height="45" rx="4" fill="#1e293b"/>
    <text x="642" y="392" fill="#fbbf24" font-family="sans-serif" font-size="12">🔥 Bài xem nhiều nhất</text>
    <rect x="630" y="420" width="205" height="75" rx="4" fill="#1e293b"/>
    <text x="642" y="445" fill="#fbbf24" font-family="sans-serif" font-size="12">👤 Tiểu sử tác giả</text>
    <text x="642" y="470" fill="#94a3b8" font-family="sans-serif" font-size="11">Liên kết mạng xã hội</text>
  </g>

  <!-- FOOTER -->
  <g filter="url(#shadow)">
    <rect x="50" y="520" width="800" height="52" rx="8" fill="#312e81" stroke="#818cf8" stroke-width="2"/>
    <text x="70" y="552" fill="#e0e7ff" font-family="sans-serif" font-size="15" font-weight="bold">&lt;footer&gt;</text>
    <text x="145" y="552" fill="#c7d2fe" font-family="sans-serif" font-size="13">Bản quyền © 2026 DevBlog · Điều khoản dịch vụ · Chính sách bảo mật · Liên hệ</text>
  </g>
</svg>`;

// 2. flexbox-layout-axes.svg
const flexboxSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 600" width="100%" height="100%">
  <defs>
    <linearGradient id="fbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="100%" stop-color="#111c30"/>
    </linearGradient>
    <marker id="arrowM" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
    <marker id="arrowC" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#ec4899"/>
    </marker>
  </defs>

  <rect width="920" height="600" rx="16" fill="url(#fbg)"/>

  <!-- Title banner -->
  <text x="40" y="48" fill="#f8fafc" font-family="sans-serif" font-size="22" font-weight="bold">CSS Flexbox: Trục Chính (Main Axis) &amp; Trục Phụ (Cross Axis)</text>
  <text x="40" y="74" fill="#94a3b8" font-family="monospace" font-size="14">display: flex; flex-direction: row; (Mặc định)</text>

  <!-- Flex Container Outer Box -->
  <rect x="80" y="140" width="760" height="380" rx="14" fill="#0f172a" stroke="#475569" stroke-width="3" stroke-dasharray="8 6"/>
  <rect x="95" y="115" width="230" height="32" rx="6" fill="#1e293b" stroke="#334155"/>
  <text x="110" y="136" fill="#e2e8f0" font-family="monospace" font-size="13" font-weight="bold">.flex-container (Parent)</text>

  <!-- MAIN AXIS ARROW (Horizontal) -->
  <line x1="80" y1="100" x2="835" y2="100" stroke="#38bdf8" stroke-width="4" marker-end="url(#arrowM)"/>
  <text x="400" y="90" fill="#38bdf8" font-family="sans-serif" font-size="15" font-weight="bold">MAIN AXIS (Trục chính — điều khiển bởi justify-content)</text>
  <text x="80" y="88" fill="#0284c7" font-family="monospace" font-size="12">main-start</text>
  <text x="780" y="88" fill="#0284c7" font-family="monospace" font-size="12">main-end</text>

  <!-- CROSS AXIS ARROW (Vertical) -->
  <line x1="45" y1="140" x2="45" y2="515" stroke="#ec4899" stroke-width="4" marker-end="url(#arrowC)"/>
  <text x="-370" y="32" fill="#ec4899" font-family="sans-serif" font-size="15" font-weight="bold" transform="rotate(-90)">CROSS AXIS (Trục phụ — align-items)</text>
  <text x="15" y="132" fill="#be185d" font-family="monospace" font-size="12">cross-start</text>
  <text x="15" y="535" fill="#be185d" font-family="monospace" font-size="12">cross-end</text>

  <!-- Flex Items -->
  <!-- Item 1 -->
  <g transform="translate(130, 180)">
    <rect width="180" height="280" rx="10" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
    <rect x="15" y="15" width="150" height="35" rx="6" fill="#2563eb"/>
    <text x="32" y="38" fill="#fff" font-family="sans-serif" font-size="15" font-weight="bold">Item 1 (Child)</text>
    <text x="25" y="90" fill="#93c5fd" font-family="monospace" font-size="12">flex: 1 1 auto;</text>
    <text x="25" y="125" fill="#e2e8f0" font-family="sans-serif" font-size="13">• Chiều rộng co giãn</text>
    <text x="25" y="155" fill="#e2e8f0" font-family="sans-serif" font-size="13">• Nội dung tự ôm</text>
    <rect x="25" y="200" width="130" height="45" rx="6" fill="#0f172a" stroke="#3b82f6"/>
    <text x="40" y="228" fill="#60a5fa" font-family="monospace" font-size="12">order: 1;</text>
  </g>

  <!-- Item 2 -->
  <g transform="translate(350, 180)">
    <rect width="200" height="280" rx="10" fill="#065f46" stroke="#34d399" stroke-width="2"/>
    <rect x="15" y="15" width="170" height="35" rx="6" fill="#059669"/>
    <text x="38" y="38" fill="#fff" font-family="sans-serif" font-size="15" font-weight="bold">Item 2 (Nổi bật)</text>
    <text x="25" y="90" fill="#a7f3d0" font-family="monospace" font-size="12">flex-grow: 2;</text>
    <text x="25" y="125" fill="#e2e8f0" font-family="sans-serif" font-size="13">• Chiếm gấp đôi</text>
    <text x="25" y="155" fill="#e2e8f0" font-family="sans-serif" font-size="13">• Khoảng trống thừa</text>
    <rect x="25" y="200" width="150" height="45" rx="6" fill="#0f172a" stroke="#10b981"/>
    <text x="35" y="228" fill="#34d399" font-family="monospace" font-size="12">align-self: center;</text>
  </g>

  <!-- Item 3 -->
  <g transform="translate(590, 180)">
    <rect width="180" height="280" rx="10" fill="#581c87" stroke="#c084fc" stroke-width="2"/>
    <rect x="15" y="15" width="150" height="35" rx="6" fill="#7c3aed"/>
    <text x="32" y="38" fill="#fff" font-family="sans-serif" font-size="15" font-weight="bold">Item 3 (Child)</text>
    <text x="25" y="90" fill="#ddd6fe" font-family="monospace" font-size="12">flex-shrink: 1;</text>
    <text x="25" y="125" fill="#e2e8f0" font-family="sans-serif" font-size="13">• Tự co lại khi</text>
    <text x="25" y="155" fill="#e2e8f0" font-family="sans-serif" font-size="13">• Màn hình hẹp lại</text>
    <rect x="25" y="200" width="130" height="45" rx="6" fill="#0f172a" stroke="#8b5cf6"/>
    <text x="40" y="228" fill="#c084fc" font-family="monospace" font-size="12">order: 3;</text>
  </g>

  <!-- Bottom properties cheat sheet -->
  <text x="80" y="555" fill="#94a3b8" font-family="sans-serif" font-size="13">
    💡 <tspan fill="#38bdf8" font-weight="bold">justify-content</tspan>: flex-start | center | flex-end | space-between | space-around | space-evenly
  </text>
  <text x="80" y="580" fill="#94a3b8" font-family="sans-serif" font-size="13">
    🎯 <tspan fill="#ec4899" font-weight="bold">align-items</tspan>: stretch (mặc định) | flex-start | center | flex-end | baseline
  </text>
</svg>`;

// 3. event-flow-phases.svg
const eventFlowSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 620" width="100%" height="100%">
  <defs>
    <linearGradient id="ebg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1329"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <marker id="downArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6"/>
    </marker>
    <marker id="upArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444"/>
    </marker>
  </defs>

  <rect width="920" height="620" rx="16" fill="url(#ebg)"/>

  <!-- Title -->
  <text x="50" y="46" fill="#f8fafc" font-family="sans-serif" font-size="22" font-weight="bold">Chu Trình Sự Kiện DOM: Capturing Phase → Target → Bubbling Phase</text>
  <text x="50" y="72" fill="#94a3b8" font-family="sans-serif" font-size="14">Chuẩn W3C Event Propagation khi người dùng tương tác (click, keypress, submit)</text>

  <!-- Left: Capturing Phase Indicator -->
  <rect x="50" y="105" width="200" height="42" rx="8" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/>
  <text x="65" y="132" fill="#bfdbfe" font-family="sans-serif" font-size="14" font-weight="bold">1. Capturing Phase</text>
  <text x="65" y="165" fill="#60a5fa" font-family="sans-serif" font-size="12">Sự kiện đi từ gốc Window</text>
  <text x="65" y="185" fill="#60a5fa" font-family="sans-serif" font-size="12">xuống dần qua các thẻ cha</text>

  <!-- Right: Bubbling Phase Indicator -->
  <rect x="670" y="105" width="200" height="42" rx="8" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>
  <text x="690" y="132" fill="#fecaca" font-family="sans-serif" font-size="14" font-weight="bold">3. Bubbling Phase</text>
  <text x="670" y="165" fill="#f87171" font-family="sans-serif" font-size="12">Sự kiện nổi bọt ngược lên</text>
  <text x="670" y="185" fill="#f87171" font-family="sans-serif" font-size="12">từ thẻ con lên các thẻ cha (Mặc định)</text>

  <!-- DOM Hierarchy Nested Boxes -->
  <!-- Level 1: Window -->
  <g transform="translate(280, 105)">
    <rect width="360" height="470" rx="12" fill="#0f172a" stroke="#475569" stroke-width="2"/>
    <text x="20" y="30" fill="#94a3b8" font-family="monospace" font-size="14" font-weight="bold">window</text>

    <!-- Level 2: Document -->
    <rect x="20" y="45" width="320" height="400" rx="10" fill="#1e293b" stroke="#64748b" stroke-width="1.5"/>
    <text x="40" y="70" fill="#cbd5e1" font-family="monospace" font-size="13" font-weight="bold">document</text>

    <!-- Level 3: <html> -->
    <rect x="40" y="85" width="280" height="340" rx="8" fill="#0f2847" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="60" y="110" fill="#7dd3fc" font-family="monospace" font-size="13" font-weight="bold">&lt;html&gt;</text>

    <!-- Level 4: <body> -->
    <rect x="60" y="125" width="240" height="280" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="1.5"/>
    <text x="80" y="150" fill="#6ee7b7" font-family="monospace" font-size="13" font-weight="bold">&lt;body&gt;</text>

    <!-- Level 5: <form> -->
    <rect x="80" y="165" width="200" height="220" rx="8" fill="#78350f" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="100" y="190" fill="#fde68a" font-family="monospace" font-size="13" font-weight="bold">&lt;form id="loginForm"&gt;</text>

    <!-- Level 6: Target Element <button> -->
    <rect x="100" y="210" width="160" height="155" rx="8" fill="#831843" stroke="#f43f5e" stroke-width="2"/>
    <text x="115" y="238" fill="#fecdd3" font-family="monospace" font-size="13" font-weight="bold">&lt;button type="submit"&gt;</text>
    <rect x="115" y="255" width="130" height="40" rx="6" fill="#be123c"/>
    <text x="135" y="280" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold">2. TARGET</text>
    <text x="120" y="325" fill="#fda4af" font-family="sans-serif" font-size="11">Phần tử thực sự</text>
    <text x="120" y="342" fill="#fda4af" font-family="sans-serif" font-size="11">nhận click của chuột</text>
  </g>

  <!-- Left Arrows: Downward Capturing -->
  <path d="M 190 200 C 230 200, 230 250, 230 350 L 230 450" fill="none" stroke="#3b82f6" stroke-width="4" stroke-dasharray="8 4" marker-end="url(#downArrow)"/>
  <text x="120" y="360" fill="#60a5fa" font-family="monospace" font-size="12">Capture Phase ↓</text>
  <text x="120" y="380" fill="#94a3b8" font-family="monospace" font-size="11">{ capture: true }</text>

  <!-- Right Arrows: Upward Bubbling -->
  <path d="M 690 450 C 690 350, 690 250, 730 200" fill="none" stroke="#ef4444" stroke-width="4" stroke-dasharray="8 4" marker-end="url(#upArrow)"/>
  <text x="710" y="360" fill="#f87171" font-family="monospace" font-size="12">Bubble Phase ↑</text>
  <text x="710" y="380" fill="#94a3b8" font-family="monospace" font-size="11">e.stopPropagation()</text>

  <!-- Footer Tip -->
  <rect x="50" y="585" width="820" height="25" rx="4" fill="#0f172a"/>
  <text x="60" y="602" fill="#e2e8f0" font-family="sans-serif" font-size="12">
    💡 Hầu hết listener đăng ký bằng <tspan fill="#38bdf8" font-family="monospace">el.addEventListener('click', fn)</tspan> mặc định lắng nghe ở <tspan fill="#ef4444" font-weight="bold">Bubbling Phase</tspan>.
  </text>
</svg>`;

// 4. fetch-request-lifecycle.svg
const fetchSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 600" width="100%" height="100%">
  <defs>
    <linearGradient id="feBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a101f"/>
      <stop offset="100%" stop-color="#141e33"/>
    </linearGradient>
    <marker id="feArr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981"/>
    </marker>
    <marker id="beArr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366f1"/>
    </marker>
  </defs>

  <rect width="940" height="600" rx="16" fill="url(#feBg)"/>

  <!-- Title -->
  <text x="50" y="46" fill="#f8fafc" font-family="sans-serif" font-size="22" font-weight="bold">Vòng Đời Gọi API Bất Đồng Bộ: Browser fetch() ⇄ Node.js Express</text>
  <text x="50" y="72" fill="#94a3b8" font-family="sans-serif" font-size="14">Luồng dữ liệu JSON hai chiều từ giao diện người dùng tới máy chủ dịch vụ</text>

  <!-- Left: BROWSER FRONT-END -->
  <g transform="translate(50, 110)">
    <rect width="360" height="440" rx="12" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
    <rect x="0" y="0" width="360" height="44" rx="12" fill="#064e3b"/>
    <text x="20" y="28" fill="#a7f3d0" font-family="sans-serif" font-size="15" font-weight="bold">Trình Duyệt (Front-end Web)</text>
    
    <!-- Code Box 1: Trigger -->
    <rect x="20" y="65" width="320" height="85" rx="8" fill="#1e293b" stroke="#334155"/>
    <text x="35" y="90" fill="#38bdf8" font-family="sans-serif" font-size="13" font-weight="bold">1. Người dùng bấm Submit Form</text>
    <text x="35" y="112" fill="#94a3b8" font-family="monospace" font-size="11">e.preventDefault();</text>
    <text x="35" y="132" fill="#6ee7b7" font-family="monospace" font-size="11">const res = await fetch('/api/posts', ...)</text>

    <!-- State Loading -->
    <rect x="20" y="165" width="320" height="65" rx="8" fill="#1e293b" stroke="#334155"/>
    <text x="35" y="190" fill="#fbbf24" font-family="sans-serif" font-size="13" font-weight="bold">2. Trạng thái Đang Tải (Pending)</text>
    <text x="35" y="215" fill="#fef3c7" font-family="sans-serif" font-size="12">Hiển thị Spinner / Nút bấm bị vô hiệu hóa (disabled)</text>

    <!-- Code Box 2: Response Handle -->
    <rect x="20" y="245" width="320" height="90" rx="8" fill="#1e293b" stroke="#334155"/>
    <text x="35" y="270" fill="#a7f3d0" font-family="sans-serif" font-size="13" font-weight="bold">5. Nhận kết quả &amp; Chuyển đổi JSON</text>
    <text x="35" y="295" fill="#94a3b8" font-family="monospace" font-size="11">if (!res.ok) throw new Error(...)</text>
    <text x="35" y="315" fill="#6ee7b7" font-family="monospace" font-size="11">const data = await res.json();</text>

    <!-- Render DOM -->
    <rect x="20" y="350" width="320" height="70" rx="8" fill="#047857" stroke="#34d399"/>
    <text x="35" y="375" fill="#fff" font-family="sans-serif" font-size="13" font-weight="bold">6. Render DOM ra giao diện</text>
    <text x="35" y="400" fill="#d1fae5" font-family="sans-serif" font-size="12">postList.innerHTML = data.map(renderCard).join('')</text>
  </g>

  <!-- Right: SERVER BACK-END -->
  <g transform="translate(530, 110)">
    <rect width="360" height="440" rx="12" fill="#0f172a" stroke="#6366f1" stroke-width="2"/>
    <rect x="0" y="0" width="360" height="44" rx="12" fill="#312e81"/>
    <text x="20" y="28" fill="#c7d2fe" font-family="sans-serif" font-size="15" font-weight="bold">Máy Chủ (Node.js &amp; Express API)</text>

    <!-- Server step 1: Middleware & Route -->
    <rect x="20" y="65" width="320" height="110" rx="8" fill="#1e293b" stroke="#334155"/>
    <text x="35" y="90" fill="#818cf8" font-family="sans-serif" font-size="13" font-weight="bold">3. Nhận Request &amp; Giải mã Body</text>
    <text x="35" y="115" fill="#94a3b8" font-family="monospace" font-size="11">app.use(cors());</text>
    <text x="35" y="135" fill="#94a3b8" font-family="monospace" font-size="11">app.use(express.json());</text>
    <text x="35" y="155" fill="#c7d2fe" font-family="monospace" font-size="11">router.post('/posts', controller.create)</text>

    <!-- Server step 2: DB & Logic -->
    <rect x="20" y="190" width="320" height="110" rx="8" fill="#1e293b" stroke="#334155"/>
    <text x="35" y="215" fill="#f43f5e" font-family="sans-serif" font-size="13" font-weight="bold">4. Xác thực &amp; Lưu CSDL MySQL</text>
    <text x="35" y="240" fill="#94a3b8" font-family="monospace" font-size="11">const post = await Post.create(req.body);</text>
    <text x="35" y="260" fill="#e2e8f0" font-family="sans-serif" font-size="12">Ghi bản ghi vào bảng posts trong MySQL</text>
    <text x="35" y="282" fill="#38bdf8" font-family="monospace" font-size="11">res.status(201).json({ ok: true, post })</text>

    <!-- Server step 3: Response -->
    <rect x="20" y="320" width="320" height="100" rx="8" fill="#4338ca" stroke="#818cf8"/>
    <text x="35" y="348" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold">HTTP Response Header &amp; Body</text>
    <text x="35" y="375" fill="#e0e7ff" font-family="monospace" font-size="11">Status: 201 Created</text>
    <text x="35" y="398" fill="#e0e7ff" font-family="monospace" font-size="11">Content-Type: application/json</text>
  </g>

  <!-- Connecting Arrows -->
  <!-- Request (Top Arrow) -->
  <line x1="415" y1="210" x2="525" y2="210" stroke="#10b981" stroke-width="4" marker-end="url(#feArr)"/>
  <text x="420" y="195" fill="#34d399" font-family="sans-serif" font-size="11" font-weight="bold">HTTP REQUEST →</text>
  <text x="435" y="235" fill="#6ee7b7" font-family="monospace" font-size="10">JSON Body</text>

  <!-- Response (Bottom Arrow) -->
  <line x1="525" y1="380" x2="415" y2="380" stroke="#6366f1" stroke-width="4" marker-end="url(#beArr)"/>
  <text x="425" y="365" fill="#818cf8" font-family="sans-serif" font-size="11" font-weight="bold">← HTTP RESPONSE</text>
  <text x="430" y="405" fill="#c7d2fe" font-family="monospace" font-size="10">Status 200/201</text>
</svg>`;

fs.writeFileSync(path.join(imgDir, 'html5-semantic-layout.svg'), semanticSvg, 'utf8');
fs.writeFileSync(path.join(imgDir, 'flexbox-layout-axes.svg'), flexboxSvg, 'utf8');
fs.writeFileSync(path.join(imgDir, 'event-flow-phases.svg'), eventFlowSvg, 'utf8');
fs.writeFileSync(path.join(imgDir, 'fetch-request-lifecycle.svg'), fetchSvg, 'utf8');

console.log('4 Front-End diagrams generated successfully!');
