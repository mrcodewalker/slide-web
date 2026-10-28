const fs = require('fs');
const path = require('path');

const imgDir = path.resolve('assets/img');

// 1. box-model.svg
const boxModelSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="100%" height="100%">
  <defs>
    <style>
      .title { font: bold 18px 'Segoe UI', Roboto, sans-serif; fill: #1e293b; }
      .lbl { font: 600 15px 'Segoe UI', Roboto, sans-serif; letter-spacing: 1px; }
      .dim { font: 12px 'Segoe UI', Roboto, sans-serif; fill: #64748b; }
      .badge { font: bold 11px monospace; fill: #0f172a; }
    </style>
    <filter id="shadow" x="-4%" y="-4%" width="108%" height="108%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="800" height="520" fill="#f8fafc" rx="16"/>
  <text x="400" y="38" text-anchor="middle" class="title">W3C CSS Box Model Standard</text>
  <text x="400" y="58" text-anchor="middle" class="dim">Mô hình tính toán kích thước phần tử trong chuẩn CSS</text>

  <!-- 1. MARGIN BOX (Outside) -->
  <g filter="url(#shadow)">
    <rect x="60" y="80" width="680" height="390" rx="12" fill="#fff7ed" stroke="#f97316" stroke-width="2.5" stroke-dasharray="6,4"/>
  </g>
  <text x="80" y="112" class="lbl" fill="#ea580c">MARGIN (Lề ngoài - Trong suốt)</text>
  <text x="400" y="105" text-anchor="middle" class="dim">margin-top: 24px</text>
  <text x="400" y="455" text-anchor="middle" class="dim">margin-bottom: 24px</text>
  <text x="120" y="275" text-anchor="middle" class="dim" transform="rotate(-90 120 275)">margin-left: 32px</text>
  <text x="680" y="275" text-anchor="middle" class="dim" transform="rotate(90 680 275)">margin-right: 32px</text>

  <!-- 2. BORDER BOX -->
  <rect x="150" y="130" width="500" height="290" rx="10" fill="#fef9c3" stroke="#ca8a04" stroke-width="3"/>
  <text x="170" y="160" class="lbl" fill="#a16207">BORDER (Đường viền - border-width: 4px solid)</text>

  <!-- 3. PADDING BOX -->
  <rect x="220" y="175" width="360" height="200" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="240" y="202" class="lbl" fill="#15803d">PADDING (Vùng đệm trong)</text>
  <text x="400" y="196" text-anchor="middle" class="dim">padding-top: 16px</text>
  <text x="400" y="365" text-anchor="middle" class="dim">padding-bottom: 16px</text>
  <text x="235" y="275" text-anchor="middle" class="dim" transform="rotate(-90 235 275)">padding-left: 20px</text>
  <text x="565" y="275" text-anchor="middle" class="dim" transform="rotate(90 565 275)">padding-right: 20px</text>

  <!-- 4. CONTENT BOX (Inside) -->
  <rect x="280" y="220" width="240" height="110" rx="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <text x="400" y="260" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="16" fill="#0369a1">CONTENT (Nội dung)</text>
  <text x="400" y="285" text-anchor="middle" font-family="monospace" font-weight="700" font-size="14" fill="#0284c7">width × height (240px × 110px)</text>
  <text x="400" y="306" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" fill="#475569">Văn bản, hình ảnh, phần tử con</text>

  <!-- Legend bar at bottom -->
  <g transform="translate(100, 485)">
    <rect x="0" y="0" width="16" height="16" rx="3" fill="#ea580c"/>
    <text x="24" y="13" font-size="12" font-family="sans-serif" fill="#475569">Margin</text>

    <rect x="140" y="0" width="16" height="16" rx="3" fill="#ca8a04"/>
    <text x="164" y="13" font-size="12" font-family="sans-serif" fill="#475569">Border</text>

    <rect x="280" y="0" width="16" height="16" rx="3" fill="#16a34a"/>
    <text x="304" y="13" font-size="12" font-family="sans-serif" fill="#475569">Padding</text>

    <rect x="420" y="0" width="16" height="16" rx="3" fill="#0284c7"/>
    <text x="444" y="13" font-size="12" font-family="sans-serif" fill="#475569">Content</text>
  </g>
</svg>`;

// 2. box-model-sizing.svg (content-box vs border-box)
const boxModelSizingSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 500" width="100%" height="100%">
  <defs>
    <style>
      .heading { font: bold 20px 'Segoe UI', Roboto, sans-serif; fill: #0f172a; text-anchor: middle; }
      .subhead { font: 14px 'Segoe UI', Roboto, sans-serif; fill: #64748b; text-anchor: middle; }
      .col-title { font: bold 16px monospace; fill: #1e293b; }
      .desc { font: 13px 'Segoe UI', Roboto, sans-serif; fill: #334155; }
      .calc { font: bold 14px monospace; fill: #0f172a; }
      .warn { fill: #dc2626; font: 600 13px 'Segoe UI', Roboto, sans-serif; }
      .good { fill: #16a34a; font: 600 13px 'Segoe UI', Roboto, sans-serif; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="880" height="500" fill="#f8fafc" rx="16"/>
  <text x="440" y="38" class="heading">So Sánh Trực Quan: content-box vs border-box</text>
  <text x="440" y="62" class="subhead">Thuộc tính CSS box-sizing quyết định cách trình duyệt tính toán kích thước phần tử</text>

  <!-- LEFT: content-box -->
  <g transform="translate(40, 90)">
    <!-- Card Container -->
    <rect width="380" height="380" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <rect width="380" height="42" rx="12" fill="#fee2e2"/>
    <text x="20" y="27" class="col-title" fill="#991b1b">box-sizing: content-box (Mặc định)</text>

    <!-- Visual Box -->
    <!-- Actual Rendered Size: 260px wide (200 content + 40 pad + 20 border) -->
    <g transform="translate(60, 60)">
      <!-- Outer Border: 260px -->
      <rect x="0" y="0" width="260" height="150" rx="6" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
      <!-- Padding: 240px -->
      <rect x="10" y="10" width="240" height="130" rx="4" fill="#bbf7d0" stroke="#16a34a" stroke-width="1"/>
      <!-- Content: 200px -->
      <rect x="30" y="25" width="200" height="100" rx="3" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
      <text x="130" y="80" text-anchor="middle" font-size="13" font-family="monospace" font-weight="700" fill="#0369a1">width: 200px</text>
    </g>

    <!-- Dimension arrow -->
    <path d="M 60,225 L 320,225" stroke="#dc2626" stroke-width="2" marker-start="url(#dot)" marker-end="url(#dot)"/>
    <text x="190" y="245" text-anchor="middle" class="calc" fill="#dc2626">Kích thước thật: 260px!</text>

    <text x="20" y="280" class="desc">• CSS khai báo: <tspan font-family="monospace">width: 200px; padding: 20px; border: 10px;</tspan></text>
    <text x="20" y="305" class="desc">• Thực tế mở rộng: 200 + (20×2) + (10×2) = <tspan font-weight="700">260px</tspan></text>
    <text x="20" y="335" class="warn">❌ Dễ làm tràn khung, vỡ layout cột trên màn hình nhỏ!</text>
  </g>

  <!-- RIGHT: border-box -->
  <g transform="translate(460, 90)">
    <!-- Card Container -->
    <rect width="380" height="380" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <rect width="380" height="42" rx="12" fill="#dcfce7"/>
    <text x="20" y="27" class="col-title" fill="#166534">box-sizing: border-box (Khuyên dùng ★)</text>

    <!-- Visual Box -->
    <!-- Rendered Size: EXACTLY 200px wide -->
    <g transform="translate(90, 60)">
      <!-- Outer Border: exactly 200px -->
      <rect x="0" y="0" width="200" height="150" rx="6" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
      <!-- Padding: inside -->
      <rect x="10" y="10" width="180" height="130" rx="4" fill="#bbf7d0" stroke="#16a34a" stroke-width="1"/>
      <!-- Content: shrinks to 140px! -->
      <rect x="30" y="25" width="140" height="100" rx="3" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
      <text x="100" y="80" text-anchor="middle" font-size="12" font-family="monospace" font-weight="700" fill="#0369a1">content: 140px</text>
    </g>

    <!-- Dimension arrow -->
    <path d="M 90,225 L 290,225" stroke="#16a34a" stroke-width="2"/>
    <text x="190" y="245" text-anchor="middle" class="calc" fill="#16a34a">Kích thước thật: Chuẩn 200px ✓</text>

    <text x="20" y="280" class="desc">• CSS khai báo: <tspan font-family="monospace">width: 200px; padding: 20px; border: 10px;</tspan></text>
    <text x="20" y="305" class="desc">• Content tự co lại để tổng bề ngang đúng <tspan font-weight="700">200px</tspan></text>
    <text x="20" y="335" class="good">✓ Chuẩn công nghiệp: Bắt buộc cài đặt cho mọi dự án Web!</text>
  </g>
</svg>`;

// 3. dom-tree.svg
const domTreeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 540" width="100%" height="100%">
  <defs>
    <style>
      .title { font: bold 20px 'Segoe UI', Roboto, sans-serif; fill: #0f172a; text-anchor: middle; }
      .subhead { font: 14px 'Segoe UI', Roboto, sans-serif; fill: #64748b; text-anchor: middle; }
      .node-doc { fill: #6366f1; stroke: #4f46e5; }
      .node-root { fill: #0284c7; stroke: #0369a1; }
      .node-elem { fill: #059669; stroke: #047857; }
      .node-text { fill: #d97706; stroke: #b45309; }
      .node-txt { font: bold 14px monospace; fill: #ffffff; text-anchor: middle; }
      .node-desc { font: 11px 'Segoe UI', Roboto, sans-serif; fill: #f8fafc; text-anchor: middle; }
      .link { fill: none; stroke: #94a3b8; stroke-width: 2.5; stroke-linecap: round; }
      .legend { font: 12px 'Segoe UI', Roboto, sans-serif; fill: #334155; }
    </style>
  </defs>

  <rect width="880" height="540" fill="#f8fafc" rx="16"/>
  <text x="440" y="36" class="title">Cấu Trúc Cây DOM (Document Object Model Tree)</text>
  <text x="440" y="58" class="subhead">Mô hình cây phân cấp các đối tượng Node đại diện cho trang HTML trong bộ nhớ trình duyệt</text>

  <!-- Connective Lines -->
  <!-- Level 0 to Level 1 -->
  <path d="M 440,115 L 440,145" class="link"/>
  <!-- Level 1 to Level 2 (head & body) -->
  <path d="M 440,185 L 230,225" class="link"/>
  <path d="M 440,185 L 610,225" class="link"/>
  <!-- Level 2 head to title, meta -->
  <path d="M 230,265 L 140,310" class="link"/>
  <path d="M 230,265 L 290,310" class="link"/>
  <!-- Level 2 body to header, main, footer -->
  <path d="M 610,265 L 470,310" class="link"/>
  <path d="M 610,265 L 620,310" class="link"/>
  <path d="M 610,265 L 770,310" class="link"/>
  <!-- Level 3 main to h1, p, button -->
  <path d="M 620,350 L 530,395" class="link"/>
  <path d="M 620,350 L 640,395" class="link"/>
  <path d="M 620,350 L 740,395" class="link"/>
  <!-- Level 4 p to text, a -->
  <path d="M 640,435 L 600,475" class="link"/>
  <path d="M 640,435 L 690,475" class="link"/>

  <!-- Level 0: Document Node -->
  <g transform="translate(370, 75)">
    <rect width="140" height="40" rx="8" class="node-doc"/>
    <text x="70" y="25" class="node-txt">document</text>
  </g>

  <!-- Level 1: Root Element -->
  <g transform="translate(360, 145)">
    <rect width="160" height="40" rx="8" class="node-root"/>
    <text x="80" y="25" class="node-txt">&lt;html&gt;</text>
  </g>

  <!-- Level 2: Head & Body -->
  <g transform="translate(150, 225)">
    <rect width="160" height="40" rx="8" class="node-elem"/>
    <text x="80" y="25" class="node-txt">&lt;head&gt;</text>
  </g>
  <g transform="translate(530, 225)">
    <rect width="160" height="40" rx="8" class="node-elem"/>
    <text x="80" y="25" class="node-txt">&lt;body&gt;</text>
  </g>

  <!-- Level 3: Children of Head -->
  <g transform="translate(80, 310)">
    <rect width="110" height="38" rx="6" class="node-elem"/>
    <text x="55" y="24" class="node-txt">&lt;meta&gt;</text>
  </g>
  <g transform="translate(240, 310)">
    <rect width="110" height="38" rx="6" class="node-elem"/>
    <text x="55" y="24" class="node-txt">&lt;title&gt;</text>
  </g>

  <!-- Level 3: Children of Body -->
  <g transform="translate(410, 310)">
    <rect width="110" height="38" rx="6" class="node-elem"/>
    <text x="55" y="24" class="node-txt">&lt;header&gt;</text>
  </g>
  <g transform="translate(560, 310)">
    <rect width="120" height="38" rx="6" class="node-elem"/>
    <text x="60" y="24" class="node-txt">&lt;main&gt;</text>
  </g>
  <g transform="translate(710, 310)">
    <rect width="110" height="38" rx="6" class="node-elem"/>
    <text x="55" y="24" class="node-txt">&lt;footer&gt;</text>
  </g>

  <!-- Level 4: Children of Main -->
  <g transform="translate(480, 395)">
    <rect width="90" height="36" rx="6" class="node-elem"/>
    <text x="45" y="23" class="node-txt">&lt;h1&gt;</text>
  </g>
  <g transform="translate(595, 395)">
    <rect width="90" height="36" rx="6" class="node-elem"/>
    <text x="45" y="23" class="node-txt">&lt;p&gt;</text>
  </g>
  <g transform="translate(700, 395)">
    <rect width="100" height="36" rx="6" class="node-elem"/>
    <text x="50" y="23" class="node-txt">&lt;button&gt;</text>
  </g>

  <!-- Level 5: Text and Inline Nodes -->
  <g transform="translate(550, 475)">
    <rect width="90" height="32" rx="6" class="node-text"/>
    <text x="45" y="21" class="node-txt" font-size="12">"Text..."</text>
  </g>
  <g transform="translate(660, 475)">
    <rect width="80" height="32" rx="6" class="node-elem"/>
    <text x="40" y="21" class="node-txt" font-size="12">&lt;a&gt;</text>
  </g>

  <!-- Legend -->
  <g transform="translate(60, 480)">
    <rect x="0" y="0" width="16" height="16" rx="4" fill="#6366f1"/>
    <text x="24" y="13" class="legend">Document Node</text>

    <rect x="150" y="0" width="16" height="16" rx="4" fill="#0284c7"/>
    <text x="174" y="13" class="legend">Root Element</text>

    <rect x="290" y="0" width="16" height="16" rx="4" fill="#059669"/>
    <text x="314" y="13" class="legend">Element Node</text>

    <rect x="420" y="0" width="16" height="16" rx="4" fill="#d97706"/>
    <text x="444" y="13" class="legend">Text Leaf Node</text>
  </g>
</svg>`;

// 4. git-workflow.svg
const gitWorkflowSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 520" width="100%" height="100%">
  <defs>
    <style>
      .title { font: bold 22px 'Segoe UI', Roboto, sans-serif; fill: #0f172a; text-anchor: middle; }
      .subhead { font: 14px 'Segoe UI', Roboto, sans-serif; fill: #64748b; text-anchor: middle; }
      .col-title { font: bold 16px 'Segoe UI', Roboto, sans-serif; fill: #1e293b; text-anchor: middle; }
      .col-sub { font: 12px 'Segoe UI', Roboto, sans-serif; fill: #64748b; text-anchor: middle; }
      .cmd-badge { font: bold 12px monospace; fill: #ffffff; text-anchor: middle; }
      .zone-local { fill: #eff6ff; stroke: #3b82f6; stroke-width: 2; stroke-dasharray: 4,4; }
      .zone-remote { fill: #fdf2f8; stroke: #ec4899; stroke-width: 2; stroke-dasharray: 4,4; }
    </style>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#16a34a"/>
    </marker>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#2563eb"/>
    </marker>
    <marker id="arrow-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#ea580c"/>
    </marker>
  </defs>

  <rect width="940" height="520" fill="#f8fafc" rx="16"/>
  <text x="470" y="38" class="title">Quy Trình Hoạt Động Cốt Lõi Của Git &amp; GitHub</text>
  <text x="470" y="60" class="subhead">4 Không Gian Lưu Trữ (Zones) và các lệnh chuyển đổi trạng thái tập tin</text>

  <!-- Zones Grouping -->
  <rect x="30" y="85" width="650" height="400" rx="12" class="zone-local"/>
  <text x="60" y="110" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="13" fill="#2563eb">MÁY TÍNH CÁ NHÂN (LOCAL ENVIRONMENT)</text>

  <rect x="700" y="85" width="210" height="400" rx="12" class="zone-remote"/>
  <text x="720" y="110" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="13" fill="#db2777">CLOUD (REMOTE)</text>

  <!-- 4 Columns (Cards) -->
  <!-- Col 1: Working Directory -->
  <g transform="translate(50, 130)">
    <rect width="180" height="320" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <rect width="180" height="50" rx="10" fill="#f1f5f9"/>
    <text x="90" y="28" class="col-title">Working Tree</text>
    <text x="90" y="44" class="col-sub">Thư mục làm việc</text>

    <!-- File states -->
    <rect x="15" y="70" width="150" height="42" rx="6" fill="#fee2e2"/>
    <text x="90" y="96" text-anchor="middle" font-family="monospace" font-size="12" fill="#991b1b">Untracked Files</text>

    <rect x="15" y="125" width="150" height="42" rx="6" fill="#fef3c7"/>
    <text x="90" y="151" text-anchor="middle" font-family="monospace" font-size="12" fill="#92400e">Modified Files</text>

    <text x="20" y="205" font-size="11" font-family="sans-serif" fill="#64748b">• File đang chỉnh sửa</text>
    <text x="20" y="225" font-size="11" font-family="sans-serif" fill="#64748b">• Chưa ghi nhận</text>
    <text x="20" y="245" font-size="11" font-family="sans-serif" fill="#64748b">• Có thể revert dễ dàng</text>
  </g>

  <!-- Col 2: Staging Area -->
  <g transform="translate(265, 130)">
    <rect width="180" height="320" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <rect width="180" height="50" rx="10" fill="#f1f5f9"/>
    <text x="90" y="28" class="col-title">Staging Area</text>
    <text x="90" y="44" class="col-sub">Khu vực chờ (Index)</text>

    <rect x="15" y="70" width="150" height="42" rx="6" fill="#dcfce7"/>
    <text x="90" y="96" text-anchor="middle" font-family="monospace" font-size="12" fill="#166534">Staged Changes</text>

    <text x="20" y="145" font-size="11" font-family="sans-serif" fill="#64748b">• Chuẩn bị đóng gói</text>
    <text x="20" y="165" font-size="11" font-family="sans-serif" fill="#64748b">• Soát lỗi bằng diff</text>
    <text x="20" y="185" font-size="11" font-family="sans-serif" fill="#64748b">• Chọn lọc từng file</text>
  </g>

  <!-- Col 3: Local Repository -->
  <g transform="translate(480, 130)">
    <rect width="180" height="320" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <rect width="180" height="50" rx="10" fill="#f1f5f9"/>
    <text x="90" y="28" class="col-title">Local Repo</text>
    <text x="90" y="44" class="col-sub">Kho lưu cục bộ (.git)</text>

    <rect x="15" y="70" width="150" height="42" rx="6" fill="#e0f2fe"/>
    <text x="90" y="96" text-anchor="middle" font-family="monospace" font-size="12" fill="#0369a1">Committed (HEAD)</text>

    <text x="20" y="145" font-size="11" font-family="sans-serif" fill="#64748b">• Lịch sử Commit</text>
    <text x="20" y="165" font-size="11" font-family="sans-serif" fill="#64748b">• Mã băm SHA-1</text>
    <text x="20" y="185" font-size="11" font-family="sans-serif" fill="#64748b">• Nhánh (Branches)</text>
  </g>

  <!-- Col 4: Remote Repository -->
  <g transform="translate(715, 130)">
    <rect width="180" height="320" rx="10" fill="#ffffff" stroke="#fbcfe8" stroke-width="2"/>
    <rect width="180" height="50" rx="10" fill="#fce7f3"/>
    <text x="90" y="28" class="col-title" fill="#9d174d">Remote Repo</text>
    <text x="90" y="44" class="col-sub" fill="#be185d">GitHub / GitLab</text>

    <rect x="15" y="70" width="150" height="42" rx="6" fill="#fdf2f8"/>
    <text x="90" y="96" text-anchor="middle" font-family="monospace" font-size="12" fill="#9d174d">origin / main</text>

    <text x="20" y="145" font-size="11" font-family="sans-serif" fill="#64748b">• Chia sẻ nhóm</text>
    <text x="20" y="165" font-size="11" font-family="sans-serif" fill="#64748b">• Sao lưu đám mây</text>
    <text x="20" y="185" font-size="11" font-family="sans-serif" fill="#64748b">• Tự động Deploy</text>
  </g>

  <!-- Action Arrows (Commands) -->
  <!-- 1. git add -->
  <path d="M 230,225 L 260,225" stroke="#16a34a" stroke-width="3" marker-end="url(#arrow-green)"/>
  <rect x="215" y="200" width="60" height="20" rx="4" fill="#16a34a"/>
  <text x="245" y="214" class="cmd-badge">git add</text>

  <!-- 2. git commit -->
  <path d="M 445,225 L 475,225" stroke="#2563eb" stroke-width="3" marker-end="url(#arrow-blue)"/>
  <rect x="425" y="200" width="80" height="20" rx="4" fill="#2563eb"/>
  <text x="465" y="214" class="cmd-badge">git commit</text>

  <!-- 3. git push -->
  <path d="M 660,225 L 710,225" stroke="#db2777" stroke-width="3" marker-end="url(#arrow-blue)"/>
  <rect x="655" y="200" width="68" height="20" rx="4" fill="#db2777"/>
  <text x="689" y="214" class="cmd-badge">git push</text>

  <!-- 4. git pull / fetch (Return arrow) -->
  <path d="M 715,360 L 70,360" stroke="#ea580c" stroke-width="2.5" stroke-dasharray="6,4" marker-end="url(#arrow-orange)"/>
  <rect x="360" y="348" width="130" height="24" rx="4" fill="#ea580c"/>
  <text x="425" y="365" class="cmd-badge">git pull (fetch + merge)</text>
</svg>`;

// 5. css-specificity-hierarchy.svg
const specificitySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 500" width="100%" height="100%">
  <defs>
    <style>
      .title { font: bold 20px 'Segoe UI', Roboto, sans-serif; fill: #0f172a; text-anchor: middle; }
      .subhead { font: 14px 'Segoe UI', Roboto, sans-serif; fill: #64748b; text-anchor: middle; }
      .tier-score { font: bold 16px monospace; fill: #ffffff; text-anchor: middle; }
      .tier-name { font: bold 15px 'Segoe UI', Roboto, sans-serif; fill: #ffffff; }
      .tier-example { font: 13px monospace; fill: #f1f5f9; }
    </style>
  </defs>

  <rect width="880" height="500" fill="#f8fafc" rx="16"/>
  <text x="440" y="36" class="title">Kim Tự Tháp Độ Ưu Tiên CSS (Specificity Hierarchy)</text>
  <text x="440" y="58" class="subhead">Công thức 4 chữ số (a, b, c, d) quyết định luật CSS nào sẽ chiến thắng</text>

  <!-- Top Banner: !important -->
  <g transform="translate(140, 85)">
    <rect width="600" height="42" rx="8" fill="#ef4444"/>
    <text x="300" y="26" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="15" fill="#ffffff">
      🚨 !important (Ghi đè mọi luật - Tránh lạm dụng!)
    </text>
  </g>

  <!-- Specificity Pyramid Layers -->
  <!-- Level 1: Inline Style (1, 0, 0, 0) -->
  <g transform="translate(180, 140)">
    <polygon points="120,0 400,0 440,65 80,65" fill="#8b5cf6"/>
    <text x="260" y="30" class="tier-score">Inline Styles (1, 0, 0, 0)</text>
    <text x="260" y="50" text-anchor="middle" class="tier-example">style="color: red; font-size: 16px;"</text>
  </g>

  <!-- Level 2: IDs (0, 1, 0, 0) -->
  <g transform="translate(140, 215)">
    <polygon points="120,0 480,0 520,65 80,65" fill="#3b82f6"/>
    <text x="300" y="30" class="tier-score">ID Selectors (0, 1, 0, 0)</text>
    <text x="300" y="50" text-anchor="middle" class="tier-example">#header, #main-nav, #user-profile</text>
  </g>

  <!-- Level 3: Classes, Attributes, Pseudo-classes (0, 0, 1, 0) -->
  <g transform="translate(100, 290)">
    <polygon points="120,0 560,0 600,65 80,65" fill="#10b981"/>
    <text x="340" y="30" class="tier-score">Classes, Attributes &amp; Pseudo-classes (0, 0, 1, 0)</text>
    <text x="340" y="50" text-anchor="middle" class="tier-example">.btn, .card, [type="text"], :hover, :nth-child(2)</text>
  </g>

  <!-- Level 4: Elements & Pseudo-elements (0, 0, 0, 1) -->
  <g transform="translate(60, 365)">
    <polygon points="120,0 640,0 680,65 80,65" fill="#64748b"/>
    <text x="380" y="30" class="tier-score">Elements &amp; Pseudo-elements (0, 0, 0, 1)</text>
    <text x="380" y="50" text-anchor="middle" class="tier-example">div, h1, p, a, span, ::before, ::after</text>
  </g>

  <!-- Bottom: Universal Selector (0, 0, 0, 0) -->
  <g transform="translate(100, 445)">
    <rect width="680" height="36" rx="6" fill="#e2e8f0"/>
    <text x="340" y="23" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="13" fill="#475569">
      Universal Selector (*), Combinators (+, &gt;, ~), :where() ➔ Trọng số (0, 0, 0, 0)
    </text>
  </g>
</svg>`;

// 6. css-positioning-types.svg
const positioningSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 500" width="100%" height="100%">
  <defs>
    <style>
      .title { font: bold 20px 'Segoe UI', Roboto, sans-serif; fill: #0f172a; text-anchor: middle; }
      .subhead { font: 14px 'Segoe UI', Roboto, sans-serif; fill: #64748b; text-anchor: middle; }
      .card-title { font: bold 15px monospace; fill: #1e293b; }
      .card-desc { font: 12px 'Segoe UI', Roboto, sans-serif; fill: #475569; }
      .box-label { font: bold 12px monospace; fill: #ffffff; text-anchor: middle; }
    </style>
  </defs>

  <rect width="880" height="500" fill="#f8fafc" rx="16"/>
  <text x="440" y="36" class="title">5 Kiểu Định Vị (position) Trong CSS Layout</text>
  <text x="440" y="58" class="subhead">Quyết định phần tử nằm trong hay thoát khỏi luồng tài liệu thông thường (Normal Flow)</text>

  <!-- 1. static -->
  <g transform="translate(40, 85)">
    <rect width="240" height="180" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <text x="16" y="28" class="card-title" fill="#0284c7">1. position: static</text>
    <text x="16" y="48" class="card-desc">• Mặc định theo luồng HTML</text>
    <text x="16" y="66" class="card-desc">• Bỏ qua top, left, z-index</text>
    <rect x="20" y="85" width="200" height="32" rx="4" fill="#e2e8f0"/>
    <text x="120" y="106" class="box-label" fill="#475569">Phần tử A</text>
    <rect x="20" y="125" width="200" height="32" rx="4" fill="#0284c7"/>
    <text x="120" y="146" class="box-label">Static Box (Normal)</text>
  </g>

  <!-- 2. relative -->
  <g transform="translate(320, 85)">
    <rect width="240" height="180" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <text x="16" y="28" class="card-title" fill="#16a34a">2. position: relative</text>
    <text x="16" y="48" class="card-desc">• Dịch chuyển so với chính nó</text>
    <text x="16" y="66" class="card-desc">• Giữ nguyên chỗ đứng cũ</text>
    <rect x="20" y="85" width="200" height="32" rx="4" fill="#e2e8f0" stroke="#94a3b8" stroke-dasharray="4,4"/>
    <text x="120" y="106" class="box-label" fill="#94a3b8">(Vị trí gốc)</text>
    <!-- Shifted box -->
    <rect x="45" y="110" width="175" height="32" rx="4" fill="#16a34a"/>
    <text x="132" y="131" class="box-label">top: 15px; left: 25px</text>
  </g>

  <!-- 3. absolute -->
  <g transform="translate(600, 85)">
    <rect width="240" height="180" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <text x="16" y="28" class="card-title" fill="#d97706">3. position: absolute</text>
    <text x="16" y="48" class="card-desc">• Thoát hoàn toàn khỏi flow</text>
    <text x="16" y="66" class="card-desc">• Neo theo cha gần nhất có pos</text>
    <rect x="15" y="80" width="210" height="85" rx="6" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="25" y="100" font-size="11" font-family="sans-serif" fill="#92400e">Parent (relative)</text>
    <rect x="110" y="110" width="105" height="45" rx="4" fill="#d97706"/>
    <text x="162" y="138" class="box-label">top/right: 0</text>
  </g>

  <!-- 4. fixed -->
  <g transform="translate(180, 285)">
    <rect width="240" height="180" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <text x="16" y="28" class="card-title" fill="#8b5cf6">4. position: fixed</text>
    <text x="16" y="48" class="card-desc">• Neo cố định theo Viewport</text>
    <text x="16" y="66" class="card-desc">• Cuộn trang không bị trôi đi</text>
    <rect x="20" y="80" width="200" height="85" rx="6" fill="#f5f3ff" stroke="#c4b5fd"/>
    <rect x="30" y="90" width="180" height="24" rx="4" fill="#8b5cf6"/>
    <text x="120" y="106" class="box-label" font-size="11">Fixed Navbar (top: 0)</text>
    <rect x="170" y="125" width="30" height="30" rx="15" fill="#8b5cf6"/>
    <text x="185" y="144" class="box-label" font-size="11">↑</text>
  </g>

  <!-- 5. sticky -->
  <g transform="translate(460, 285)">
    <rect width="240" height="180" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <text x="16" y="28" class="card-title" fill="#ec4899">5. position: sticky</text>
    <text x="16" y="48" class="card-desc">• Lai giữa relative và fixed</text>
    <text x="16" y="66" class="card-desc">• Dính chặt khi chạm ngưỡng scroll</text>
    <rect x="20" y="80" width="200" height="85" rx="6" fill="#fdf2f8" stroke="#fbcfe8"/>
    <rect x="30" y="90" width="180" height="24" rx="4" fill="#ec4899"/>
    <text x="120" y="106" class="box-label" font-size="11">Sticky Header (top: 0)</text>
    <text x="120" y="140" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#db2777">Cuộn qua sẽ tự dính lại</text>
  </g>
</svg>`;

// 7. render-cloud-deploy.svg (Zero-docker Cloud Deploy)
const renderDeploySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 480" width="100%" height="100%">
  <defs>
    <style>
      .title { font: bold 22px 'Segoe UI', Roboto, sans-serif; fill: #0f172a; text-anchor: middle; }
      .subhead { font: 14px 'Segoe UI', Roboto, sans-serif; fill: #64748b; text-anchor: middle; }
      .step-num { font: bold 14px monospace; fill: #ffffff; text-anchor: middle; }
      .card-title { font: bold 16px 'Segoe UI', Roboto, sans-serif; fill: #0f172a; }
      .desc { font: 12px 'Segoe UI', Roboto, sans-serif; fill: #475569; }
      .cmd { font: bold 12px monospace; fill: #2563eb; }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#0284c7"/>
    </marker>
  </defs>

  <rect width="920" height="480" fill="#f8fafc" rx="16"/>
  <text x="460" y="38" class="title">Quy Trình Triển Khai Cloud Cực Dễ Dàng (Zero-Docker Deploy)</text>
  <text x="460" y="60" class="subhead">Đưa Node.js API lên Internet chỉ với Git Push qua nền tảng Render.com / Railway</text>

  <!-- Step 1: Local Git Repo -->
  <g transform="translate(40, 100)">
    <rect width="180" height="320" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="32" cy="32" r="16" fill="#3b82f6"/>
    <text x="32" y="37" class="step-num">1</text>
    <text x="60" y="38" class="card-title">Local Project</text>

    <text x="20" y="80" class="cmd">$ git add .</text>
    <text x="20" y="105" class="cmd">$ git commit -m "..."</text>
    <text x="20" y="130" class="cmd">$ git push origin main</text>

    <text x="20" y="180" class="desc">• Chuẩn bị file:</text>
    <text x="30" y="200" class="desc">✓ <tspan font-family="monospace">package.json</tspan></text>
    <text x="30" y="220" class="desc">✓ <tspan font-family="monospace">.gitignore</tspan></text>
    <text x="30" y="240" class="desc">✓ <tspan font-family="monospace">.env.example</tspan></text>
    <text x="20" y="280" class="desc" fill="#16a34a">✓ Không cần cài Docker!</text>
  </g>

  <path d="M 225,260 L 265,260" stroke="#0284c7" stroke-width="3" marker-end="url(#arrow)"/>

  <!-- Step 2: GitHub Repository -->
  <g transform="translate(270, 100)">
    <rect width="180" height="320" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="32" cy="32" r="16" fill="#1e293b"/>
    <text x="32" y="37" class="step-num">2</text>
    <text x="60" y="38" class="card-title">GitHub Repo</text>

    <rect x="20" y="70" width="140" height="60" rx="8" fill="#f1f5f9"/>
    <text x="90" y="105" text-anchor="middle" font-family="monospace" font-weight="700" font-size="13" fill="#0f172a">github.com/user/devblog-api</text>

    <text x="20" y="160" class="desc">• Lưu trữ mã nguồn</text>
    <text x="20" y="185" class="desc">• Quản lý commit &amp; tags</text>
    <text x="20" y="210" class="desc">• Kích hoạt Webhook tự động thông báo tới Render khi có code mới</text>
  </g>

  <path d="M 455,260 L 495,260" stroke="#0284c7" stroke-width="3" marker-end="url(#arrow)"/>

  <!-- Step 3: Render Cloud Platform -->
  <g transform="translate(500, 100)">
    <rect width="180" height="320" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="32" cy="32" r="16" fill="#06b6d4"/>
    <text x="32" y="37" class="step-num">3</text>
    <text x="60" y="38" class="card-title">Render Web Service</text>

    <rect x="20" y="70" width="140" height="40" rx="6" fill="#ecfeff"/>
    <text x="30" y="95" font-family="monospace" font-size="11" fill="#0891b2">npm install &amp;&amp; start</text>

    <text x="20" y="140" class="desc">• Tự nhận diện Node.js</text>
    <text x="20" y="165" class="desc">• Cài đặt <tspan font-family="monospace">node_modules</tspan></text>
    <text x="20" y="190" class="desc">• Thiết lập Environment Variables trong Dashboard</text>
    <text x="20" y="240" class="desc" font-weight="700" fill="#0891b2">Build Command:</text>
    <text x="20" y="260" font-family="monospace" font-size="11" fill="#475569">npm install</text>
    <text x="20" y="285" class="desc" font-weight="700" fill="#0891b2">Start Command:</text>
    <text x="20" y="305" font-family="monospace" font-size="11" fill="#475569">node src/server.js</text>
  </g>

  <path d="M 685,260 L 725,260" stroke="#0284c7" stroke-width="3" marker-end="url(#arrow)"/>

  <!-- Step 4: Live HTTPS Web -->
  <g transform="translate(730, 100)">
    <rect width="150" height="320" rx="12" fill="#ffffff" stroke="#10b981" stroke-width="2"/>
    <circle cx="32" cy="32" r="16" fill="#10b981"/>
    <text x="32" y="37" class="step-num">4</text>
    <text x="56" y="38" class="card-title" font-size="15">Live Web</text>

    <rect x="15" y="70" width="120" height="45" rx="6" fill="#dcfce7"/>
    <text x="75" y="98" text-anchor="middle" font-family="monospace" font-size="11" font-weight="700" fill="#15803d">HTTPS Online</text>

    <text x="15" y="145" class="desc">✓ Miễn phí 100%</text>
    <text x="15" y="170" class="desc">✓ Tự có SSL (https://)</text>
    <text x="15" y="195" class="desc">✓ Swagger UI online</text>
    <text x="15" y="220" class="desc">✓ Kết nối DB Cloud</text>
    <text x="15" y="260" class="desc" font-weight="700" fill="#10b981">Auto Deploy khi git push!</text>
  </g>
</svg>`;

// 8. event-delegation-flow.svg
const eventDelegationSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 500" width="100%" height="100%">
  <defs>
    <style>
      .title { font: bold 20px 'Segoe UI', Roboto, sans-serif; fill: #0f172a; text-anchor: middle; }
      .subhead { font: 14px 'Segoe UI', Roboto, sans-serif; fill: #64748b; text-anchor: middle; }
      .parent-title { font: bold 16px monospace; fill: #1e293b; }
      .item-text { font: 13px 'Segoe UI', Roboto, sans-serif; fill: #1e293b; }
    </style>
    <marker id="bubble-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 8 5 L 0 9 z" fill="#dc2626"/>
    </marker>
  </defs>

  <rect width="880" height="500" fill="#f8fafc" rx="16"/>
  <text x="440" y="36" class="title">Kỹ Thuật Event Delegation (Ủy Quyền Sự Kiện)</text>
  <text x="440" y="58" class="subhead">Gắn duy nhất 1 Event Listener tại phần tử cha thay vì gắn cho hàng nghìn phần tử con</text>

  <!-- Parent Element (UL) -->
  <g transform="translate(60, 90)">
    <rect width="440" height="370" rx="12" fill="#eff6ff" stroke="#3b82f6" stroke-width="2.5"/>
    <rect width="440" height="45" rx="12" fill="#dbeafe"/>
    <text x="20" y="28" class="parent-title" fill="#1d4ed8">&lt;ul id="todo-list"&gt; (Gắn duy nhất 1 listener ở đây)</text>

    <!-- Child Item 1 -->
    <g transform="translate(20, 65)">
      <rect width="400" height="55" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="20" y="32" class="item-text">&lt;li data-id="1"&gt; 1. Học cú pháp HTML cơ bản</text>
      <rect x="330" y="15" width="55" height="26" rx="4" fill="#fee2e2"/>
      <text x="357" y="32" text-anchor="middle" font-size="11" font-family="monospace" fill="#dc2626">Delete</text>
    </g>

    <!-- Child Item 2 (Clicked Item) -->
    <g transform="translate(20, 135)">
      <rect width="400" height="55" rx="8" fill="#fef2f2" stroke="#ef4444" stroke-width="2"/>
      <text x="20" y="32" class="item-text" font-weight="700">&lt;li data-id="2"&gt; 2. Làm chủ Box Model trong CSS</text>
      <rect x="330" y="15" width="55" height="26" rx="4" fill="#ef4444"/>
      <text x="357" y="32" text-anchor="middle" font-size="11" font-family="monospace" fill="#ffffff">Delete</text>
      <!-- Click point -->
      <circle cx="357" cy="28" r="14" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="3,3"/>
      <text x="410" y="32" font-size="11" font-family="sans-serif" font-weight="700" fill="#dc2626">👈 CLICK</text>
    </g>

    <!-- Child Item 3 -->
    <g transform="translate(20, 205)">
      <rect width="400" height="55" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
      <text x="20" y="32" class="item-text">&lt;li data-id="3"&gt; 3. Lập trình DOM với JavaScript</text>
      <rect x="330" y="15" width="55" height="26" rx="4" fill="#fee2e2"/>
      <text x="357" y="32" text-anchor="middle" font-size="11" font-family="monospace" fill="#dc2626">Delete</text>
    </g>

    <!-- Dynamically added Item 4 -->
    <g transform="translate(20, 275)">
      <rect width="400" height="55" rx="8" fill="#f0fdf4" stroke="#22c55e" stroke-dasharray="4,4"/>
      <text x="20" y="32" class="item-text" fill="#15803d">+ Phần tử mới sinh ra động bằng JS (Tự động nhận sự kiện!)</text>
    </g>
  </g>

  <!-- Bubbling Path & Code Explanation -->
  <g transform="translate(540, 90)">
    <rect width="280" height="370" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <text x="20" y="35" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="15" fill="#0f172a">Cách Thức Hoạt Động</text>

    <!-- Bubbling explanation -->
    <path d="M -30,220 C 10,220 10,110 30,110" fill="none" stroke="#dc2626" stroke-width="2.5" marker-end="url(#bubble-arrow)"/>
    <text x="20" y="70" font-size="12" font-family="sans-serif" fill="#64748b">1. Khi người dùng click nút Delete ở phần tử con, sự kiện <tspan font-weight="700" fill="#dc2626">Event Bubbling</tspan> sẽ nổi bọt ngược lên thẻ cha &lt;ul&gt;.</text>

    <text x="20" y="130" font-size="12" font-family="sans-serif" fill="#64748b">2. Dùng <tspan font-family="monospace" fill="#2563eb">e.target</tspan> để định danh chính xác thẻ nào đã bị click.</text>

    <rect x="15" y="160" width="250" height="130" rx="6" fill="#0f172a"/>
    <text x="25" y="185" font-family="monospace" font-size="11" fill="#38bdf8">list.addEventListener('click', e => {</text>
    <text x="35" y="205" font-family="monospace" font-size="11" fill="#f1f5f9">  const btn = e.target.closest('button');</text>
    <text x="35" y="225" font-family="monospace" font-size="11" fill="#f1f5f9">  if (!btn) return;</text>
    <text x="35" y="245" font-family="monospace" font-size="11" fill="#a7f3d0">  const li = btn.closest('li');</text>
    <text x="35" y="265" font-family="monospace" font-size="11" fill="#fca5a5">  li.remove();</text>
    <text x="25" y="283" font-family="monospace" font-size="11" fill="#38bdf8">});</text>

    <text x="20" y="315" font-size="12" font-family="sans-serif" font-weight="700" fill="#16a34a">✓ Tiết kiệm bộ nhớ RAM</text>
    <text x="20" y="335" font-size="12" font-family="sans-serif" font-weight="700" fill="#16a34a">✓ Hỗ trợ 100% phần tử sinh động</text>
  </g>
</svg>`;

// Write all SVGs
const svgs = {
  'box-model.svg': boxModelSvg,
  'box-model-sizing.svg': boxModelSizingSvg,
  'dom-tree.svg': domTreeSvg,
  'git-workflow.svg': gitWorkflowSvg,
  'css-specificity-hierarchy.svg': specificitySvg,
  'css-positioning-types.svg': positioningSvg,
  'render-cloud-deploy.svg': renderDeploySvg,
  'event-delegation-flow.svg': eventDelegationSvg
};

Object.entries(svgs).forEach(([filename, content]) => {
  const filePath = path.join(imgDir, filename);
  fs.writeFileSync(filePath, content.trim(), 'utf8');
  console.log(`Saved ${filename} (${content.length} bytes)`);
});
