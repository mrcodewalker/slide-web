const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'assets', 'img');

// 1. css-specificity-hierarchy.svg
const specificitySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 600" width="100%" height="100%">
  <defs>
    <linearGradient id="spBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <filter id="spSh" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <rect width="920" height="600" rx="16" fill="url(#spBg)"/>
  <text x="50" y="48" fill="#f8fafc" font-family="sans-serif" font-size="22" font-weight="bold">Thang Đo Độ Ưu Tiên Trong CSS (CSS Specificity Hierarchy)</text>
  <text x="50" y="74" fill="#94a3b8" font-family="sans-serif" font-size="14">Quy tắc 4 chữ số (Inline, ID, Class, Element) quyết định phong cách hiển thị</text>

  <!-- Pyramid Levels -->
  <!-- Level 0: !important -->
  <g transform="translate(60, 105)" filter="url(#spSh)">
    <rect width="800" height="60" rx="8" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>
    <text x="30" y="38" fill="#fecaca" font-family="monospace" font-size="18" font-weight="bold">!important</text>
    <text x="230" y="38" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold">VÔ ĐỊCH — Phá vỡ toàn bộ thứ bậc xếp tầng Cascade</text>
    <text x="730" y="38" fill="#fca5a5" font-family="monospace" font-size="13">Tránh dùng!</text>
  </g>

  <!-- Level 1: Inline Style (1000) -->
  <g transform="translate(60, 180)" filter="url(#spSh)">
    <rect width="800" height="65" rx="8" fill="#4c1d95" stroke="#a855f7" stroke-width="2"/>
    <rect x="20" y="15" width="130" height="35" rx="6" fill="#6b21a8"/>
    <text x="35" y="39" fill="#f3e8ff" font-family="monospace" font-size="16" font-weight="bold">1, 0, 0, 0</text>
    <text x="175" y="32" fill="#e9d5ff" font-family="sans-serif" font-size="15" font-weight="bold">Inline Styles (Viết trực tiếp trong HTML)</text>
    <text x="175" y="52" fill="#c084fc" font-family="monospace" font-size="12">&lt;h1 style="color: red; font-size: 2rem;"&gt;</text>
  </g>

  <!-- Level 2: ID Selector (100) -->
  <g transform="translate(60, 260)" filter="url(#spSh)">
    <rect width="800" height="65" rx="8" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/>
    <rect x="20" y="15" width="130" height="35" rx="6" fill="#1d4ed8"/>
    <text x="35" y="39" fill="#dbeafe" font-family="monospace" font-size="16" font-weight="bold">0, 1, 0, 0</text>
    <text x="175" y="32" fill="#bfdbfe" font-family="sans-serif" font-size="15" font-weight="bold">ID Selectors (#id)</text>
    <text x="175" y="52" fill="#60a5fa" font-family="monospace" font-size="12">#mainHeader, #submitBtn, #userProfile</text>
  </g>

  <!-- Level 3: Class, Attribute, Pseudo-class (10) -->
  <g transform="translate(60, 340)" filter="url(#spSh)">
    <rect width="800" height="65" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
    <rect x="20" y="15" width="130" height="35" rx="6" fill="#047857"/>
    <text x="35" y="39" fill="#d1fae5" font-family="monospace" font-size="16" font-weight="bold">0, 0, 1, 0</text>
    <text x="175" y="32" fill="#a7f3d0" font-family="sans-serif" font-size="15" font-weight="bold">Classes, Attributes &amp; Pseudo-classes</text>
    <text x="175" y="52" fill="#34d399" font-family="monospace" font-size="12">.card, .btn-primary, [type="text"], :hover, :nth-child(2)</text>
  </g>

  <!-- Level 4: Element & Pseudo-element (1) -->
  <g transform="translate(60, 420)" filter="url(#spSh)">
    <rect width="800" height="65" rx="8" fill="#374151" stroke="#9ca3af" stroke-width="2"/>
    <rect x="20" y="15" width="130" height="35" rx="6" fill="#4b5563"/>
    <text x="35" y="39" fill="#f3f4f6" font-family="monospace" font-size="16" font-weight="bold">0, 0, 0, 1</text>
    <text x="175" y="32" fill="#e5e7eb" font-family="sans-serif" font-size="15" font-weight="bold">Elements &amp; Pseudo-elements</text>
    <text x="175" y="52" fill="#d1d5db" font-family="monospace" font-size="12">div, p, span, h1, li, ::before, ::after</text>
  </g>

  <!-- Bottom Pro-Tip -->
  <rect x="60" y="505" width="800" height="60" rx="8" fill="#1e293b" stroke="#334155"/>
  <text x="80" y="532" fill="#38bdf8" font-family="sans-serif" font-size="13" font-weight="bold">💡 Lời Khuyên Của Kỹ Sư Senior:</text>
  <text x="80" y="552" fill="#94a3b8" font-family="sans-serif" font-size="13">Luôn ưu tiên dùng Class Selector (10 điểm). Không gán ID cho CSS để tránh Specificity War không thể ghi đè!</text>
</svg>`;

// 2. css-positioning-types.svg
const positioningSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 600" width="100%" height="100%">
  <defs>
    <linearGradient id="posBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a1128"/>
      <stop offset="100%" stop-color="#141f3d"/>
    </linearGradient>
  </defs>

  <rect width="920" height="600" rx="16" fill="url(#posBg)"/>
  <text x="50" y="48" fill="#f8fafc" font-family="sans-serif" font-size="22" font-weight="bold">5 Thuộc Tính Định Vị Vị Trí Trong CSS (CSS Position)</text>
  <text x="50" y="74" fill="#94a3b8" font-family="sans-serif" font-size="14">Kiểm soát vị trí hiển thị phần tử trên luồng tài liệu chuẩn (Normal Flow)</text>

  <!-- Card 1: static -->
  <g transform="translate(50, 105)">
    <rect width="380" height="135" rx="10" fill="#0f172a" stroke="#475569" stroke-width="2"/>
    <text x="20" y="32" fill="#e2e8f0" font-family="monospace" font-size="16" font-weight="bold">position: static; (Mặc định)</text>
    <text x="20" y="60" fill="#94a3b8" font-family="sans-serif" font-size="13">• Nằm tự nhiên theo luồng tài liệu HTML.</text>
    <text x="20" y="82" fill="#94a3b8" font-family="sans-serif" font-size="13">• Các thuộc tính top, right, bottom, left và z-index</text>
    <text x="20" y="104" fill="#ef4444" font-family="sans-serif" font-size="13">  HOÀN TOÀN KHÔNG CÓ TÁC DỤNG.</text>
  </g>

  <!-- Card 2: relative -->
  <g transform="translate(490, 105)">
    <rect width="380" height="135" rx="10" fill="#172554" stroke="#3b82f6" stroke-width="2"/>
    <text x="20" y="32" fill="#93c5fd" font-family="monospace" font-size="16" font-weight="bold">position: relative;</text>
    <text x="20" y="60" fill="#bfdbfe" font-family="sans-serif" font-size="13">• Vẫn giữ nguyên khoảng trống cũ trong luồng HTML.</text>
    <text x="20" y="82" fill="#bfdbfe" font-family="sans-serif" font-size="13">• Dịch chuyển tương đối so với vị trí ban đầu của nó.</text>
    <text x="20" y="104" fill="#60a5fa" font-family="sans-serif" font-size="13">• Làm mốc tọa độ (Anchor) cho các thẻ con absolute!</text>
  </g>

  <!-- Card 3: absolute -->
  <g transform="translate(50, 265)">
    <rect width="380" height="145" rx="10" fill="#4c1d95" stroke="#a855f7" stroke-width="2"/>
    <text x="20" y="32" fill="#e9d5ff" font-family="monospace" font-size="16" font-weight="bold">position: absolute;</text>
    <text x="20" y="60" fill="#ddd6fe" font-family="sans-serif" font-size="13">• Bị rút hoàn toàn ra khỏi luồng tài liệu (Zero footprint).</text>
    <text x="20" y="82" fill="#ddd6fe" font-family="sans-serif" font-size="13">• Định vị theo thẻ cha gần nhất có position != static.</text>
    <text x="20" y="104" fill="#ddd6fe" font-family="sans-serif" font-size="13">• Nếu không có thẻ cha nào, định vị theo thẻ &lt;html&gt;.</text>
    <text x="20" y="126" fill="#c084fc" font-family="sans-serif" font-size="12">Ứng dụng: Nút đóng [X] modal, Huy hiệu Badge góc ảnh.</text>
  </g>

  <!-- Card 4: fixed -->
  <g transform="translate(490, 265)">
    <rect width="380" height="145" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
    <text x="20" y="32" fill="#a7f3d0" font-family="monospace" font-size="16" font-weight="bold">position: fixed;</text>
    <text x="20" y="60" fill="#d1fae5" font-family="sans-serif" font-size="13">• Định vị cố định theo khung nhìn Viewport trình duyệt.</text>
    <text x="20" y="82" fill="#d1fae5" font-family="sans-serif" font-size="13">• Khi cuộn chuột lên xuống, phần tử VẪN ĐỨNG YÊN.</text>
    <text x="20" y="104" fill="#d1fae5" font-family="sans-serif" font-size="13">• Bị rút khỏi luồng tài liệu giống như absolute.</text>
    <text x="20" y="126" fill="#34d399" font-family="sans-serif" font-size="12">Ứng dụng: Thanh Navbar ghim đỉnh trang, Nút Chat Zalo.</text>
  </g>

  <!-- Card 5: sticky -->
  <g transform="translate(50, 430)">
    <rect width="820" height="135" rx="10" fill="#451a03" stroke="#f59e0b" stroke-width="2"/>
    <text x="20" y="32" fill="#fde68a" font-family="monospace" font-size="16" font-weight="bold">position: sticky; top: 0; (Hiện đại nhất)</text>
    <text x="20" y="62" fill="#fef3c7" font-family="sans-serif" font-size="13">• Kết hợp tuyệt vời giữa relative và fixed:</text>
    <text x="20" y="84" fill="#fef3c7" font-family="sans-serif" font-size="13">• Ban đầu ứng xử như relative. Khi cuộn màn hình đến vị trí ngưỡng (top: 0), nó tự động "dính chặt" như fixed!</text>
    <text x="20" y="106" fill="#fbbf24" font-family="sans-serif" font-size="12">Ứng dụng: Tiêu đề chuyên mục bài viết, Bảng mục lục Sidebar dính theo trang khi đọc bài dài.</text>
  </g>
</svg>`;

// 3. render-cloud-deploy.svg (Thay thế Docker trong Buổi 12)
const cloudDeploySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 600" width="100%" height="100%">
  <defs>
    <linearGradient id="cdBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#070c18"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <marker id="cdArr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="8" markerHeight="8" orient="auto">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
  </defs>

  <rect width="940" height="600" rx="16" fill="url(#cdBg)"/>
  <text x="50" y="46" fill="#f8fafc" font-family="sans-serif" font-size="22" font-weight="bold">Quy Trình Triển Khai Cloud Tự Động Hóa (Git Push ➔ Render.com Live API)</text>
  <text x="50" y="72" fill="#94a3b8" font-family="sans-serif" font-size="14">Không cần Docker phức tạp — Đưa ứng dụng Node.js &amp; MySQL lên Internet hoàn toàn miễn phí</text>

  <!-- Step 1: Local Dev -->
  <g transform="translate(50, 115)">
    <rect width="250" height="420" rx="12" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
    <rect x="0" y="0" width="250" height="42" rx="12" fill="#1e3a8a"/>
    <text x="18" y="27" fill="#bfdbfe" font-family="sans-serif" font-size="15" font-weight="bold">1. Máy Của Học Viên</text>
    
    <text x="20" y="70" fill="#94a3b8" font-family="sans-serif" font-size="13">Viết code &amp; kiểm thử:</text>
    <rect x="15" y="85" width="220" height="75" rx="6" fill="#1e293b"/>
    <text x="25" y="110" fill="#34d399" font-family="monospace" font-size="12">$ git add .</text>
    <text x="25" y="130" fill="#34d399" font-family="monospace" font-size="12">$ git commit -m "feat..."</text>
    <text x="25" y="150" fill="#38bdf8" font-family="monospace" font-size="12">$ git push origin main</text>

    <text x="20" y="190" fill="#94a3b8" font-family="sans-serif" font-size="13">Bảo vệ bí mật:</text>
    <text x="20" y="215" fill="#fca5a5" font-family="sans-serif" font-size="12">🔒 .gitignore chặn file .env</text>
    <text x="20" y="235" fill="#fca5a5" font-family="sans-serif" font-size="12">🔒 Bỏ qua node_modules</text>

    <rect x="15" y="270" width="220" height="120" rx="6" fill="#1e293b"/>
    <text x="25" y="295" fill="#e2e8f0" font-family="sans-serif" font-size="13" font-weight="bold">File Cần Có:</text>
    <text x="25" y="320" fill="#94a3b8" font-family="monospace" font-size="12">• package.json</text>
    <text x="25" y="340" fill="#94a3b8" font-family="monospace" font-size="12">• .env.example</text>
    <text x="25" y="360" fill="#94a3b8" font-family="monospace" font-size="12">• README.md</text>
  </g>

  <!-- Arrow 1 -->
  <line x1="310" y1="280" x2="350" y2="280" stroke="#38bdf8" stroke-width="4" marker-end="url(#cdArr)"/>

  <!-- Step 2: GitHub -->
  <g transform="translate(360, 115)">
    <rect width="250" height="420" rx="12" fill="#0f172a" stroke="#8b5cf6" stroke-width="2"/>
    <rect x="0" y="0" width="250" height="42" rx="12" fill="#581c87"/>
    <text x="18" y="27" fill="#ddd6fe" font-family="sans-serif" font-size="15" font-weight="bold">2. GitHub Repository</text>

    <text x="20" y="70" fill="#94a3b8" font-family="sans-serif" font-size="13">Kho lưu trữ đám mây:</text>
    <rect x="15" y="85" width="220" height="60" rx="6" fill="#1e293b"/>
    <text x="25" y="112" fill="#c084fc" font-family="monospace" font-size="12">branch: main</text>
    <text x="25" y="132" fill="#a78bfa" font-family="sans-serif" font-size="11">Webhook tự động kích hoạt</text>

    <text x="20" y="180" fill="#94a3b8" font-family="sans-serif" font-size="13">Lợi ích:</text>
    <text x="20" y="205" fill="#e2e8f0" font-family="sans-serif" font-size="12">• Lịch sử commit minh bạch</text>
    <text x="20" y="230" fill="#e2e8f0" font-family="sans-serif" font-size="12">• Báo cáo test tự động</text>
    <text x="20" y="255" fill="#e2e8f0" font-family="sans-serif" font-size="12">• Giảng viên chấm bài online</text>

    <rect x="15" y="290" width="220" height="100" rx="6" fill="#1e293b"/>
    <text x="25" y="320" fill="#fbbf24" font-family="sans-serif" font-size="13" font-weight="bold">Gửi tín hiệu Webhook:</text>
    <text x="25" y="345" fill="#94a3b8" font-family="sans-serif" font-size="12">"Có commit mới trên main!"</text>
    <text x="25" y="365" fill="#38bdf8" font-family="sans-serif" font-size="12">➔ Báo cho Render biết</text>
  </g>

  <!-- Arrow 2 -->
  <line x1="620" y1="280" x2="660" y2="280" stroke="#38bdf8" stroke-width="4" marker-end="url(#cdArr)"/>

  <!-- Step 3: Render Cloud -->
  <g transform="translate(670, 115)">
    <rect width="230" height="420" rx="12" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
    <rect x="0" y="0" width="230" height="42" rx="12" fill="#064e3b"/>
    <text x="18" y="27" fill="#a7f3d0" font-family="sans-serif" font-size="15" font-weight="bold">3. Render.com Web Service</text>

    <text x="20" y="70" fill="#94a3b8" font-family="sans-serif" font-size="13">Quy trình Cloud Build:</text>
    <rect x="15" y="85" width="200" height="110" rx="6" fill="#1e293b"/>
    <text x="25" y="110" fill="#6ee7b7" font-family="monospace" font-size="11">1. npm install</text>
    <text x="25" y="130" fill="#6ee7b7" font-family="monospace" font-size="11">2. node src/server.js</text>
    <text x="25" y="150" fill="#6ee7b7" font-family="monospace" font-size="11">3. Cấp chứng chỉ HTTPS</text>
    <text x="25" y="170" fill="#6ee7b7" font-family="monospace" font-size="11">4. Live tại URL công khai</text>

    <rect x="15" y="215" width="200" height="180" rx="6" fill="#047857"/>
    <text x="25" y="245" fill="#fff" font-family="sans-serif" font-size="14" font-weight="bold">ĐƯỜNG LINK THẬT:</text>
    <text x="25" y="275" fill="#d1fae5" font-family="monospace" font-size="11">https://devblog-api</text>
    <text x="25" y="295" fill="#d1fae5" font-family="monospace" font-size="11">.onrender.com</text>
    <text x="25" y="335" fill="#fff" font-family="sans-serif" font-size="12">✔ Có sẵn SSL miễn phí</text>
    <text x="25" y="355" fill="#fff" font-family="sans-serif" font-size="12">✔ Truy cập từ toàn cầu</text>
    <text x="25" y="375" fill="#fff" font-family="sans-serif" font-size="12">✔ Thử nghiệm Swagger</text>
  </g>
</svg>`;

// 4. event-delegation-flow.svg
const delegationSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 580" width="100%" height="100%">
  <defs>
    <linearGradient id="dlBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a1224"/>
      <stop offset="100%" stop-color="#15213b"/>
    </linearGradient>
    <marker id="upBubble" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b"/>
    </marker>
  </defs>

  <rect width="920" height="580" rx="16" fill="url(#dlBg)"/>
  <text x="50" y="46" fill="#f8fafc" font-family="sans-serif" font-size="22" font-weight="bold">Kỹ Thuật Ủy Quyền Sự Kiện (Event Delegation)</text>
  <text x="50" y="72" fill="#94a3b8" font-family="sans-serif" font-size="14">Gắn 1 listener duy nhất trên thẻ cha thay vì gắn 100 listener lên từng thẻ con</text>

  <!-- Parent Container -->
  <g transform="translate(60, 110)">
    <rect width="800" height="420" rx="14" fill="#0f172a" stroke="#f59e0b" stroke-width="3"/>
    <rect x="0" y="0" width="800" height="48" rx="14" fill="#78350f"/>
    <text x="24" y="32" fill="#fde68a" font-family="monospace" font-size="16" font-weight="bold">&lt;ul id="todoList"&gt; — Thẻ Cha Nhận Listener Duy Nhất</text>
    
    <text x="24" y="85" fill="#38bdf8" font-family="monospace" font-size="13">todoList.addEventListener('click', (e) => {</text>
    <text x="40" y="105" fill="#94a3b8" font-family="monospace" font-size="13">const delBtn = e.target.closest('.btn-delete');</text>
    <text x="40" y="125" fill="#94a3b8" font-family="monospace" font-size="13">if (delBtn) delBtn.closest('li').remove();</text>
    <text x="24" y="145" fill="#38bdf8" font-family="monospace" font-size="13">});</text>

    <!-- Child Item 1 -->
    <g transform="translate(30, 175)">
      <rect width="740" height="55" rx="8" fill="#1e293b" stroke="#334155"/>
      <text x="20" y="34" fill="#e2e8f0" font-family="sans-serif" font-size="14">1. Học cú pháp Semantic HTML5</text>
      <rect x="630" y="10" width="90" height="35" rx="6" fill="#ef4444"/>
      <text x="655" y="33" fill="#fff" font-family="sans-serif" font-size="13" font-weight="bold">Xóa ✕</text>
    </g>

    <!-- Child Item 2 -->
    <g transform="translate(30, 245)">
      <rect width="740" height="55" rx="8" fill="#1e293b" stroke="#334155"/>
      <text x="20" y="34" fill="#e2e8f0" font-family="sans-serif" font-size="14">2. Thiết kế layout Flexbox &amp; Grid</text>
      <rect x="630" y="10" width="90" height="35" rx="6" fill="#ef4444"/>
      <text x="655" y="33" fill="#fff" font-family="sans-serif" font-size="13" font-weight="bold">Xóa ✕</text>
    </g>

    <!-- Child Item 3 (New dynamic item) -->
    <g transform="translate(30, 315)">
      <rect width="740" height="55" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
      <text x="20" y="34" fill="#a7f3d0" font-family="sans-serif" font-size="14">3. Phần tử mới vừa được JS thêm động vào DOM bằng createElement()</text>
      <rect x="630" y="10" width="90" height="35" rx="6" fill="#ef4444"/>
      <text x="655" y="33" fill="#fff" font-family="sans-serif" font-size="13" font-weight="bold">Xóa ✕</text>
    </g>

    <text x="30" y="398" fill="#a7f3d0" font-family="sans-serif" font-size="13" font-weight="bold">
      ✨ Kỳ diệu: Thẻ số 3 sinh ra sau nhưng vẫn BẤM XÓA ĐƯỢC NGAY mà không cần đăng ký listener mới!
    </text>
  </g>
</svg>`;

fs.writeFileSync(path.join(imgDir, 'css-specificity-hierarchy.svg'), specificitySvg, 'utf8');
fs.writeFileSync(path.join(imgDir, 'css-positioning-types.svg'), positioningSvg, 'utf8');
fs.writeFileSync(path.join(imgDir, 'render-cloud-deploy.svg'), cloudDeploySvg, 'utf8');
fs.writeFileSync(path.join(imgDir, 'event-delegation-flow.svg'), delegationSvg, 'utf8');

console.log('4 new authentic SVG diagrams written successfully!');
