/* ============================================================
   SESSION FE01 — HTML5 & Cấu Trúc Ngữ Nghĩa Web
   Mục tiêu: Nắm vững kiến trúc Web, Critical Rendering Path, cây DOM,
             thẻ ngữ nghĩa Semantic HTML5, biểu mẫu forms native & a11y.
   ============================================================ */
SESSION_DATA['fe1'] = {
  intro: 'Chào mừng các bạn đến với giai đoạn Tiền đề Front-end (Phase FE). Buổi học hôm nay tập trung vào HTML5 — nền tảng cấu trúc và ngữ nghĩa của mọi trang web hiện đại trên toàn cầu.',
  agenda: [
    { min: 30, t: 'Kiến Trúc Web & Cấu Trúc HTML5 Chuẩn', d: 'Rendering engine, DOM tree, <!DOCTYPE html>, thẻ meta viewport & SEO' },
    { min: 35, t: 'Phân Loại Phần Tử & Định Dạng Văn Bản', d: 'Block vs Inline, tiêu đề h1-h6, liên kết a, danh sách ul/ol, bảng table' },
    { min: 40, t: 'Thẻ Ngữ Nghĩa (Semantic Web)', d: 'header, nav, main, article, section, aside, footer — Xóa bỏ "div soup"' },
    { min: 40, t: 'Biểu Mẫu & Input Validation Native', d: 'form, input types, pattern, required, textarea, select, UX form di động' },
    { min: 35, t: 'Đa Phương Tiện & Khả Năng Truy Cập (a11y)', d: 'img, picture, audio/video, alt text, ARIA roles, label liên kết input' }
  ],
  slides: [
    /* ============================================================
       SECTION 01: NỀN TẢNG WEB, GIAO THỨC & CẤU TRÚC HTML5
       ============================================================ */
    { kind: 'section', no: '01', title: 'Nền Tảng Web, Giao Thức & Cấu Trúc HTML5', sub: 'Hiểu rõ cách trình duyệt tải và biên dịch mã HTML5 thành giao diện trực quan trước mắt người dùng.' },

    {
      title: 'HTML5 Là Gì Trong Bức Tranh Phát Triển Web Toàn Diện?', kicker: 'FE01 · Section 01: Web Fundamentals',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**HTML5 (HyperText Markup Language 5)** là ngôn ngữ đánh dấu siêu văn bản tiêu chuẩn của tổ chức W3C.',
        'Đóng vai trò là **bộ khung xương (Skeleton)** định hình toàn bộ cấu trúc và phân cấp nội dung của trang web.',
        '**Mối quan hệ kiềng ba chân Front-end**:',
        '• **HTML5**: Cung cấp cấu trúc và ý nghĩa nội dung (Structure & Semantics).',
        '• **CSS3**: Trình bày màu sắc, phông chữ, bố cục và hiệu ứng (Presentation).',
        '• **JavaScript**: Xử lý logic tương tác và giao tiếp mạng với server (Behavior).'
      ],
      img: { src: 'html5-logo.svg', cap: 'HTML5 — Chuẩn công nghệ nền tảng thống trị thế giới web hiện đại', h: 320 }
    },

    {
      title: 'Kiến Trúc Web: Client - Server, DNS & Cách Trình Duyệt Tải Trang', kicker: 'FE01 · Section 01: Web Fundamentals',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**Hành trình khi bạn gõ `https://devblog.vn` vào thanh địa chỉ**:',
        '1. **DNS Lookup**: Trình duyệt hỏi máy chủ DNS để đổi tên miền thành địa chỉ IP máy chủ (ví dụ `103.22.18.5`).',
        '2. **TCP / TLS Handshake**: Thiết lập kết nối mạng và mã hóa bảo mật HTTPS an toàn.',
        '3. **HTTP GET Request**: Trình duyệt gửi yêu cầu: `GET / HTTP/1.1`.',
        '4. **HTTP Response**: Máy chủ trả về gói tin HTML đầu tiên kèm mã trạng thái `200 OK`.',
        '5. **Parse & Render**: Trình duyệt bắt đầu phân tích chuỗi ký tự HTML để dựng giao diện.'
      ],
      img: { src: 'client-server.svg', cap: 'Mô hình Client-Server: Trình duyệt gửi HTTP Request và nhận HTML Response', h: 360 }
    },

    {
      title: 'Critical Rendering Path: Từ Chuỗi Byte Tới Điểm Ảnh Màn Hình', kicker: 'FE01 · Section 01: Web Fundamentals',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**Quy trình 5 bước trình duyệt render trang web ra màn hình**:',
        '1. **Parsing HTML ➔ DOM Tree**: Đọc chuỗi byte HTML, chuyển thành tokens và dựng cây Document Object Model.',
        '2. **Parsing CSS ➔ CSSOM Tree**: Đọc file CSS và thẻ `<style>`, dựng cây CSS Object Model.',
        '3. **Render Tree**: Ghép DOM và CSSOM lại với nhau để lọc ra các phần tử thực sự hiển thị.',
        '4. **Layout (Reflow)**: Tính toán chính xác tọa độ $(x, y)$ và chiều rộng, chiều cao từng hộp phần tử.',
        '5. **Painting (Repaint)**: Quét pixel thực tế lên bộ nhớ đệm màn hình GPU.'
      ],
      img: { src: 'dom-model.svg', cap: 'Quy trình phân tích tài liệu và khởi tạo mô hình hướng đối tượng DOM', h: 360 }
    },

    {
      title: 'Giải Mã Bộ Khung Tài Liệu HTML5 Tiêu Chuẩn', kicker: 'FE01 · Section 01: Web Fundamentals',
      layout: 'split', ratio: '1.05fr .95fr',
      code: {
        file: 'index.html', lang: 'html', size: 'xs',
        src: `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Nền tảng chia sẻ kiến thức lập trình DevBlog">
  <title>DevBlog — Chia Sẻ Kiến Thức Lập Trình</title>
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Chào mừng đến với DevBlog</h1>
  <script src="app.js" defer></script>
</body>
</html>`
      },
      bullets: [
        '**`<!DOCTYPE html>`**: Tuyên ngôn kích hoạt chế độ chuẩn (Standard Mode), tránh Quirks Mode cổ điển.',
        '**`<html lang="vi">`**: Khai báo ngôn ngữ chính giúp bộ đọc màn hình phát âm đúng và hỗ trợ SEO.',
        '**`<meta charset="UTF-8">`**: Bảng mã ký tự quốc tế, hiển thị tiếng Việt có dấu chuẩn xác 100%.',
        '**`<meta name="viewport">`**: Thiết lập tỷ lệ hiển thị responsive trên thiết bị di động.',
        '**`defer` trên `<script>`**: Tải JS song song và chỉ thực thi khi DOM đã phân tích xong.'
      ]
    },

    {
      title: 'Thẻ `<head>` vs Thẻ `<body>`: Sự Khác Biệt Cốt Lõi', kicker: 'FE01 · Section 01: Web Fundamentals',
      cards: [
        { icon: '🧠', h: 'Thẻ <head> — Não Bộ & Metadata', p: 'Chứa các thông tin siêu dữ liệu (metadata) dành cho trình duyệt và công cụ tìm kiếm (Googlebot). Không trực tiếp hiển thị ra màn hình (title, meta, link, script).' },
        { icon: '👁️', h: 'Thẻ <body> — Cơ Thể & Giao Diện', p: 'Chứa toàn bộ các phần tử hiển thị trực tiếp cho người dùng nhìn thấy và tương tác (văn bản, tiêu đề, hình ảnh, video, bảng, biểu mẫu, nút bấm).' },
        { icon: '📱', h: 'Meta Viewport Chuẩn', p: '`width=device-width, initial-scale=1.0` giúp chiều rộng khung nhìn bằng đúng chiều rộng vật lý của điện thoại, ngăn chặn hiện tượng tự thu nhỏ font chữ.' },
        { icon: '🔍', h: 'Open Graph (Social Sharing)', p: 'Các thẻ `meta property="og:title"` và `og:image` giúp bài viết khi chia sẻ lên Facebook, Zalo, LinkedIn tự động hiện thumbnail và mô tả đẹp mắt.' }
      ],
      cols: 2
    },

    {
      title: 'Cách Tải JavaScript Chuẩn: Normal vs Async vs Defer', kicker: 'FE01 · Section 01: Web Fundamentals',
      table: {
        head: ['Thuộc Tính Khai Báo', 'Quá Trình Tải (Download)', 'Thời Điểm Thực Thi (Execute)', 'Ngữ Cảnh Khuyên Dùng'],
        rows: [
          ['`<script src="app.js">`', 'Dừng phân tích HTML (Parser blocking)', 'Thực thi ngay lập tức khi tải xong', '❌ Cách cũ — Làm chậm thời gian hiển thị trang web!'],
          ['`<script src="app.js" async>`', 'Tải song song không chặn DOM', 'Thực thi ngay khi tải xong (không theo thứ tự)', 'Thích hợp cho mã độc lập: Google Analytics, Facebook Pixel.'],
          ['`<script src="app.js" defer>`', 'Tải song song không chặn DOM', 'Thực thi sau khi toàn bộ cây DOM đã hoàn thành', '★ Khuyên dùng cho mã ứng dụng chính tương tác với DOM!']
        ]
      },
      callout: { type: 'tip', t: 'Nguyên tắc vàng: Luôn đặt thuộc tính `defer` vào thẻ `<script>` ở `<head>` để trang web tải siêu tốc và code JS luôn tìm thấy mọi phần tử HTML.' }
    },

    {
      title: 'Cây DOM (Document Object Model): Bản Đồ Phân Cấp Các Node', kicker: 'FE01 · Section 01: Web Fundamentals',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**DOM là giao diện lập trình hướng đối tượng (API)** biểu diễn tài liệu HTML dưới dạng một cây phân cấp các nút (**Nodes**).',
        '**4 Loại Node cơ bản trong cây DOM**:',
        '• **Document Node**: Gốc cao nhất của trang web (`document`).',
        '• **Element Node**: Các thẻ như `<html>`, `<body>`, `<h1>`, `<p>`.',
        '• **Attribute Node**: Thuộc tính của thẻ như `class`, `id`, `href`.',
        '• **Text Node**: Chuỗi văn bản thuần túy nằm bên trong các thẻ.',
        'JavaScript tương tác với HTML thông qua cây DOM này để thay đổi giao diện theo thời gian thực.'
      ],
      img: { src: 'dom-tree.svg', cap: 'Cấu trúc cây phân cấp DOM: Gốc document, các phần tử con và nút văn bản lá', h: 360 }
    },

    {
      title: 'Khảo Sát Cây DOM Thực Tế Với Chrome DevTools Elements Tab', kicker: 'FE01 · Section 01: Web Fundamentals',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**Phím tắt thần thánh**: Bấm `F12` hoặc tổ hợp phím `Ctrl + Shift + I` (trên Windows) để mở DevTools.',
        '**Tab Elements (Cửa sổ mổ xẻ mã nguồn)**:',
        '• Cho phép soi trực tiếp cây DOM đang chạy trong bộ nhớ máy (DOM Tree).',
        '• **Inspect Element**: Bấm biểu tượng con trỏ ở góc trái ➔ click vào bất kỳ phần tử nào trên giao diện để nhảy tới dòng code tương ứng.',
        '• **Chỉnh sửa trực tiếp (Live Edit)**: Bạn có thể nháy đúp chuột vào bất kỳ chữ nào hoặc thêm class CSS để xem kết quả thay đổi tức thì mà không cần reload trang!'
      ],
      img: { src: 'devtools-dom-inspector.svg', cap: 'Công cụ Chrome DevTools — Trợ thủ đắc lực soi cây DOM và Box Model', h: 320 }
    },

    /* ============================================================
       SECTION 02: PHÂN LOẠI PHẦN TỬ, VĂN BẢN & ĐỊNH DẠNG
       ============================================================ */
    { kind: 'section', no: '02', title: 'Phân Loại Phần Tử, Văn Bản & Định Dạng', sub: 'Làm chủ hành vi hiển thị của Block vs Inline, phân cấp tiêu đề, siêu liên kết và bảng dữ liệu chuyên nghiệp.' },

    {
      title: 'So Sánh Toàn Diện: Block vs Inline vs Inline-Block', kicker: 'FE01 · Section 02: Elements & Formatting',
      table: {
        head: ['Đặc Điểm So Sánh', 'Phần Tử Khối (Block)', 'Phần Tử Nội Dòng (Inline)', 'Phần Tử Lai (Inline-Block)'],
        rows: [
          ['Xuống dòng mới?', 'Có (Luôn bắt đầu ở một dòng mới)', 'Không (Nằm chung dòng với văn bản)', 'Không (Nằm chung dòng với văn bản)'],
          ['Chiều rộng (Width)', 'Tự chiếm 100% bề ngang cha', 'Chỉ vừa khít nội dung bên trong', 'Tùy chỉnh được width/height theo ý muốn'],
          ['Tác dụng Margin / Padding', 'Nhận đầy đủ cả 4 hướng (top/bottom/left/right)', 'Chỉ nhận lề ngang (left/right). Lề dọc KHÔNG đẩy dòng!', 'Nhận đầy đủ cả 4 hướng chuẩn xác'],
          ['Các thẻ tiêu biểu', '`<div>`, `<p>`, `<h1>`-`<h6>`, `<header>`, `<main>`, `<section>`', '`<span>`, `<a>`, `<strong>`, `<em>`, `<code>`', '`<img>`, `<button>`, `<input>`']
        ]
      },
      callout: { type: 'tip', t: 'Quy tắc lồng thẻ: Thẻ Block CÓ THỂ chứa thẻ Inline. Tuyệt đối KHÔNG ĐƯỢC lồng thẻ Block vào bên trong thẻ Inline (ví dụ không lồng `<div>` vào trong `<span>`)!' }
    },

    {
      title: 'Hệ Thống Tiêu Đề Chuẩn: Từ `<h1>` Đến `<h6>`', kicker: 'FE01 · Section 02: Elements & Formatting',
      layout: 'split', ratio: '0.9fr 1.1fr',
      bullets: [
        '**Ý nghĩa phân cấp của thẻ Heading**:',
        '• Thể hiện mức độ quan trọng và cấu trúc mục lục của bài viết, tương tự như các chương mục trong một cuốn sách.',
        '**Quy tắc vàng cho SEO & Khả năng tiếp cận**:',
        '• **Duy nhất một thẻ `<h1>`**: Mỗi trang web chỉ nên có đúng 1 thẻ `<h1>` duy nhất đại diện cho chủ đề chính.',
        '• **Không nhảy cóc thứ bậc**: Luôn đi tuần tự từ `<h1>` ➔ `<h2>` ➔ `<h3>`. Không bao giờ nhảy từ `<h1>` thẳng xuống `<h4>` chỉ vì muốn chữ nhỏ hơn!',
        '• Để chỉnh chữ to nhỏ, hãy dùng thuộc tính CSS `font-size`, không dùng sai ngữ nghĩa thẻ HTML.'
      ],
      img: { src: 'html5-semantic-layout.svg', cap: 'Phân cấp heading rõ ràng giúp bot tìm kiếm Google hiểu cấu trúc bài viết', h: 320 }
    },

    {
      title: 'Định Dạng Văn Bản Ngữ Nghĩa: Cặp Thẻ Trực Quan', kicker: 'FE01 · Section 02: Elements & Formatting',
      table: {
        head: ['Thẻ Ngữ Nghĩa (Semantic)', 'Thẻ Trình Bày (Presentational)', 'Ý Nghĩa Ngữ Nghĩa Khác Biệt'],
        rows: [
          ['`<strong>`', '`<b>` (Bold)', '`<strong>` nhấn mạnh nội dung có tính chất quan trọng sống còn; `<b>` chỉ đơn thuần in đậm thị giác.'],
          ['`<em>` (Emphasis)', '`<i>` (Italic)', '`<em>` thể hiện ngữ điệu nhấn mạnh bằng lời nói; `<i>` chỉ in nghiêng thuật ngữ kỹ thuật, tên loài, từ nước ngoài.'],
          ['`<mark>`', '—', 'Đánh dấu văn bản được highlight màu vàng (như bút dạ quang), thường dùng cho kết quả tìm kiếm.'],
          ['`<small>`', '—', 'Văn bản phụ, chú thích bản quyền (Copyright), điều khoản dịch vụ.'],
          ['`<sub>` / `<sup>`', '—', 'Chỉ số dưới (H<sub>2</sub>O) và số mũ trên (E = mc<sup>2</sup>).']
        ]
      },
      callout: { type: 'tip', t: 'Luôn ưu tiên dùng `<strong>` và `<em>` để bộ đọc màn hình (Screen Reader) của người khiếm thị có thể phát hiện và nhấn mạnh âm lượng phù hợp.' }
    },

    {
      title: 'Thẻ Siêu Liên Kết `<a>` & Thuộc Tính Bảo Mật Cần Biết', kicker: 'FE01 · Section 02: Elements & Formatting',
      badge: 'LIVE CODING',
      code: {
        file: 'links.html', lang: 'html', size: 'xs',
        src: `<!-- 1. Liên kết nội bộ sang trang khác -->
<a href="/about.html">Về chúng tôi</a>

<!-- 2. Liên kết ngoài mở tab mới AN TOÀN (Bắt buộc rel) -->
<a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">
  Tài liệu Node.js chính thức
</a>

<!-- 3. Neo trang nhảy tới vị trí phần tử có id tương ứng -->
<a href="#section-faq">Nhảy tới phần Hỏi & Đáp</a>

<!-- 4. Liên kết kích hoạt ứng dụng cuộc gọi / gửi email -->
<a href="mailto:admin@ct9.vn?subject=TuVan">Gửi Email Tư Vấn</a>
<a href="tel:+84988123456">Gọi Hotline: 0988.123.456</a>`
      },
      callout: { type: 'warning', t: 'Bảo mật: Khi dùng `target="_blank"`, bắt buộc phải có `rel="noopener noreferrer"`. Nếu không có, trang đích mở ra có thể dùng đối tượng `window.opener` để chuyển hướng trang gốc của bạn tới website giả mạo (lỗ hổng Tabnabbing)!' }
    },

    {
      title: 'Danh Sách Trong HTML5: `<ul>`, `<ol>` & `<dl>`', kicker: 'FE01 · Section 02: Elements & Formatting',
      cards: [
        { icon: '🔹', h: 'Danh Sách Không Thứ Tự <ul>', p: 'Sử dụng các dấu chấm tròn (bullet points). Thích hợp cho danh sách các mục không phân biệt trước sau, menu thanh điều hướng navigation bar.' },
        { icon: '🔢', h: 'Danh Sách Có Thứ Tự <ol>', p: 'Đánh số thứ tự tăng dần (1, 2, 3 hoặc A, B, C). Thích hợp cho các bước hướng dẫn nấu ăn, quy trình đăng ký tài khoản. Hỗ trợ thuộc tính `start` và `reversed`.' },
        { icon: '📖', h: 'Danh Sách Định Nghĩa <dl>', p: 'Bao gồm thuật ngữ `<dt>` (Definition Term) và phần diễn giải `<dd>` (Definition Description). Rất chuẩn ngữ nghĩa cho từ điển hoặc mục Hỏi - Đáp (FAQ).' },
        { icon: '⚠️', h: 'Quy Tắc Con Trực Tiếp', p: 'Thẻ con trực tiếp duy nhất được phép nằm trong `<ul>` và `<ol>` là thẻ `<li>`. Tuyệt đối không đặt thẻ `<div>` hay `<a>` trực tiếp làm con của `<ul>`!' }
      ],
      cols: 2
    },

    {
      title: 'Hiển Thị Mã Nguồn & Trích Dẫn: `<pre>`, `<code>` & `<blockquote>`', kicker: 'FE01 · Section 02: Elements & Formatting',
      badge: 'MARKUP',
      code: {
        file: 'snippets.html', lang: 'html', size: 'xs',
        src: `<!-- 1. Trích dẫn đoạn văn bản dài có nguồn gốc -->
<blockquote cite="https://en.wikipedia.org/wiki/Tim_Berners-Lee">
  "Trang web không chỉ là nơi tìm kiếm thông tin, mà là không gian kết nối trí tuệ nhân loại."
  <cite>— Tim Berners-Lee (Nhà sáng lập World Wide Web)</cite>
</blockquote>

<!-- 2. Hiển thị khối mã nguồn giữ nguyên khoảng trắng và xuống dòng -->
<pre><code class="language-js">
// Hàm tính tổng hai số
function sum(a, b) {
  return a + b;
}
</code></pre>

<!-- 3. Hướng dẫn phím tắt bàn phím -->
<p>Nhấn tổ hợp phím <kbd>Ctrl</kbd> + <kbd>C</kbd> để sao chép mã nguồn.</p>`
      },
      callout: { type: 'tip', t: 'Thẻ `<pre>` (Preformatted) giữ nguyên mọi dấu cách thụt lề và ký tự xuống dòng mà không bị trình duyệt nén thành 1 dấu cách duy nhất.' }
    },

    {
      title: 'Bảng Dữ Liệu Chuyên Nghiệp: `<table>`, `<thead>`, `<tbody>`, `<tfoot>`', kicker: 'FE01 · Section 02: Elements & Formatting',
      layout: 'split', ratio: '1.05fr .95fr',
      code: {
        file: 'table.html', lang: 'html', size: 'xs',
        src: `<table>
  <caption>Bảng Báo Cáo Học Viên Lớp CT9</caption>
  <thead>
    <tr>
      <th scope="col">Mã HV</th>
      <th scope="col">Họ và Tên</th>
      <th scope="col">Điểm Đồ Án</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>HV-001</td>
      <td>Nguyễn Văn An</td>
      <td>9.5</td>
    </tr>
    <tr>
      <td>HV-002</td>
      <td>Trần Thị Bình</td>
      <td>9.0</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2">Điểm Trung Bình</td>
      <td>9.25</td>
    </tr>
  </tfoot>
</table>`
      },
      bullets: [
        '**`<caption>`**: Tiêu đề đại diện cho bảng, hỗ trợ công cụ đọc màn hình.',
        '**`<thead>`**: Vùng chứa tiêu đề các cột với thẻ `<th>`.',
        '**`scope="col|row"`**: Khai báo phạm vi của ô tiêu đề cho cột hoặc dòng.',
        '**`<tbody>`**: Phần thân chứa dữ liệu thực tế của bảng với thẻ `<td>`.',
        '**`<tfoot>`**: Phần chân bảng dùng để tổng kết hoặc tính toán số liệu tổng.'
      ]
    },

    {
      title: 'Hợp Nhất Ô Bảng Nâng Cao: Thuộc Tính `colspan` & `rowspan`', kicker: 'FE01 · Section 02: Elements & Formatting',
      table: {
        head: ['Thuộc Tính', 'Ý Nghĩa Kỹ Thuật', 'Ví Dụ Ứng Dụng Thực Tế'],
        rows: [
          ['`colspan="2"`', 'Hợp nhất chiều ngang: 1 ô chiếm không gian của 2 cột kế tiếp', 'Dòng tổng kết ở `<tfoot>` gộp ô "Mã HV" và "Họ tên" thành 1 ô duy nhất ghi "Tổng cộng".'],
          ['`rowspan="3"`', 'Hợp nhất chiều dọc: 1 ô chiếm không gian của 3 hàng liên tiếp', 'Cột "Ca học" gộp lại cho cả 3 ngày Thứ 2, Thứ 4, Thứ 6 cùng học chung ca tối.'],
          ['Lưu ý loại bỏ ô thừa', 'Khi ô trước đã chiếm colspan/rowspan, các dòng kế phải bỏ bớt `<td>`', 'Nếu không bỏ bớt `<td>`, bảng sẽ bị thừa ô và phình to vỡ khung giao diện.']
        ]
      },
      callout: { type: 'tip', t: 'Quy tắc vàng: Thẻ `<table>` CHỈ ĐƯỢC DÙNG để biểu diễn dữ liệu bảng biểu dạng lưới (Tabular Data). Tuyệt đối không dùng table để dàn layout giao diện trang web!' }
    },

    /* ============================================================
       SECTION 03: NGỮ NGHĨA HTML5 & BỐ CỤC TRANG WEB HIỆN ĐẠI
       ============================================================ */
    { kind: 'section', no: '03', title: 'Ngữ Nghĩa HTML5 & Bố Cục Trang Web', sub: 'Chấm dứt hoàn toàn vấn nạn "Div Soup" bằng hệ thống thẻ ngữ nghĩa chuẩn SEO và nâng cao khả năng tiếp cận.' },

    {
      title: 'Cuộc Cách Mạng Semantic HTML5: Xóa Bỏ "Div Soup"', kicker: 'FE01 · Section 03: Semantic Web',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**Thời kỳ tăm tối HTML4 ("Div Soup")**:',
        '• Toàn bộ trang web được bọc trong hàng trăm thẻ `<div>` vô nghĩa: `<div id="header">`, `<div class="sidebar">`, `<div class="article-body">`.',
        '• Trình duyệt, bộ đọc màn hình và công cụ tìm kiếm không thể phân biệt đâu là nội dung bài viết thật, đâu là thanh quảng cáo!',
        '**Sự ra đời của Semantic HTML5**:',
        '• Cung cấp các thẻ ngữ nghĩa mang ý nghĩa nội tại rõ ràng: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`.',
        '• Giúp Googlebot lập chỉ mục chính xác, tăng thứ hạng SEO vượt bậc và giúp người khiếm thị duyệt web dễ dàng.'
      ],
      img: { src: 'html5-semantic-layout.svg', cap: 'Mô hình bố cục chuẩn ngữ nghĩa Semantic HTML5 thay thế hoàn toàn Div Soup', h: 360 }
    },

    {
      title: 'Bản Đồ Phân Bổ Các Thẻ Ngữ Nghĩa Trên Giao Diện Chuẩn', kicker: 'FE01 · Section 03: Semantic Web',
      cards: [
        { icon: '🏷️', h: '<header>', p: 'Đầu trang web hoặc đầu bài viết: chứa logo, tên thương hiệu, khẩu hiệu, thanh tìm kiếm hoặc thông tin tác giả bài viết.' },
        { icon: '🧭', h: '<nav>', p: 'Khu vực điều hướng: chứa danh sách các liên kết chính dẫn tới các trang nội bộ trong hệ thống website.' },
        { icon: '🎯', h: '<main>', p: 'Nội dung cốt lõi, độc nhất của trang. Mỗi tài liệu HTML CHỈ ĐƯỢC CÓ DUY NHẤT MỘT thẻ `<main>`.' },
        { icon: '📰', h: '<article>', p: 'Một khối nội dung độc lập hoàn chỉnh có thể tách ra xuất bản ở nơi khác (bài viết blog, bài báo tin tức, bình luận).' },
        { icon: '📑', h: '<section>', p: 'Một phần nhóm các nội dung có chung chủ đề bên trong bài viết (ví dụ: phần Giới thiệu, phần Đánh giá, phần Kết luận).' },
        { icon: '📌', h: '<aside>', p: 'Nội dung phụ gián tiếp liên quan: thanh menu bên cạnh (sidebar), danh sách bài viết liên quan, banner quảng cáo.' }
      ],
      cols: 3
    },

    {
      title: 'Thanh Điều Hướng `<nav>` Kết Hợp `<ul>` Chuẩn Ngữ Nghĩa', kicker: 'FE01 · Section 03: Semantic Web',
      badge: 'LIVE CODING',
      code: {
        file: 'header-nav.html', lang: 'html', size: 'xs',
        src: `<header class="site-header">
  <div class="logo">
    <a href="/"><img src="logo.svg" alt="DevBlog Logo"></a>
  </div>

  <nav class="main-nav" aria-label="Điều hướng chính">
    <ul>
      <li><a href="/" class="active">Trang Chủ</a></li>
      <li><a href="/courses.html">Khóa Học Back-end</a></li>
      <li><a href="/blog.html">Bài Viết Mới</a></li>
      <li><a href="/about.html">Về Chúng Tôi</a></li>
      <li><a href="/contact.html">Liên Hệ</a></li>
    </ul>
  </nav>

  <div class="user-actions">
    <a href="/login.html" class="btn btn-login">Đăng Nhập</a>
  </div>
</header>`
      },
      callout: { type: 'tip', t: 'Thuộc tính `aria-label="Điều hướng chính"` giúp bộ đọc màn hình thông báo cho người khiếm thị biết đây là menu chính của website khi họ dùng phím Tab.' }
    },

    {
      title: 'Phân Biệt Tinh Tế: `<main>` vs `<article>` vs `<section>`', kicker: 'FE01 · Section 03: Semantic Web',
      table: {
        head: ['Thẻ HTML5', 'Đặc Điểm Phân Biệt', 'Quy Tắc Sử Dụng Cốt Lõi'],
        rows: [
          ['`<main>`', 'Chứa nội dung duy nhất của trang', 'Không bao giờ chứa các nội dung lặp lại ở mọi trang như header, footer, search bar chung. Toàn trang chỉ có 1 thẻ `<main>`.'],
          ['`<article>`', 'Nội dung có thể tự đứng độc lập', 'Nếu bạn copy nội dung này chia sẻ lên một trang RSS feed hoặc mạng xã hội, người đọc vẫn hiểu trọn vẹn ý nghĩa.'],
          ['`<section>`', 'Một phân đoạn nội dung theo chủ đề', 'Luôn luôn phải có một thẻ Heading (`<h2>`-`<h6>`) bên trong để đặt tên cho phân đoạn đó.'],
          ['`<div>`', 'Không mang bất kỳ ý nghĩa ngữ nghĩa nào', 'Chỉ dùng khi cần bọc phần tử để căn lề, thêm background, hoặc xử lý Flexbox/Grid CSS.']
        ]
      },
      callout: { type: 'warning', t: 'Không lạm dụng: Đừng thay thế mù quáng mọi thẻ `<div>` thành `<section>`. Nếu khối tử chỉ thuần túy dùng để trang trí CSS, thẻ `<div>` là lựa chọn chính xác 100%!' }
    },

    {
      title: 'Thẻ Tương Tác Mới Trong HTML5: `<details>`, `<summary>` & `<dialog>`', kicker: 'FE01 · Section 03: Semantic Web',
      badge: 'INTERACTIVE',
      code: {
        file: 'interactive.html', lang: 'html', size: 'xs',
        src: `<!-- 1. Hộp đóng mở nội dung (Accordion FAQ) không cần 1 dòng JS! -->
<details>
  <summary>Khóa học CT9 Back-end có yêu cầu kinh nghiệm trước không?</summary>
  <p>Khóa học bắt đầu từ nền tảng Front-end HTML/CSS/JS cơ bản trước khi đi sâu vào Node.js và CSDL MySQL, phù hợp với cả người mới bắt đầu!</p>
</details>

<!-- 2. Cửa sổ Modal Popup chuẩn HTML5 Native -->
<dialog id="loginModal">
  <form method="dialog">
    <h3>Đăng Nhập Tài Khoản</h3>
    <input type="email" placeholder="Email của bạn" required>
    <button type="submit">Xác Nhận</button>
    <button type="button" onclick="loginModal.close()">Đóng</button>
  </form>
</dialog>

<!-- Nút mở modal native -->
<button onclick="loginModal.showModal()">Mở Cửa Sổ Đăng Nhập</button>`
      },
      callout: { type: 'tip', t: 'Thẻ `<dialog>` có sẵn lớp nền mờ `::backdrop`, tự động khóa cuộn trang nền và hỗ trợ phím Escape (ESC) để đóng hộp thoại mà không cần thư viện bên ngoài!' }
    },

    {
      title: 'So Sánh Trực Quan: Div Soup Cổ Điển vs Semantic HTML5', kicker: 'FE01 · Section 03: Semantic Web',
      cols: 2,
      code: [
        {
          file: '❌ Cách Cũ (Div Soup)', lang: 'html', size: 'xs',
          src: `<div id="header">
  <div class="nav">...</div>
</div>
<div id="content">
  <div class="post">
    <div class="post-title">...</div>
    <div class="post-body">...</div>
  </div>
  <div class="sidebar">...</div>
</div>
<div id="footer">...</div>`
        },
        {
          file: '✓ Chuẩn Hiện Đại (Semantic HTML5)', lang: 'html', size: 'xs',
          src: `<header>
  <nav>...</nav>
</header>
<main>
  <article>
    <h2>...</h2>
    <p>...</p>
  </article>
  <aside>...</aside>
</main>
<footer>...</footer>`
        }
      ],
      callout: { type: 'tip', t: 'Code chuẩn Semantic HTML5 ngắn gọn hơn 30%, dễ đọc, thân thiện với SEO và dễ bảo trì hơn gấp nhiều lần!' }
    },

    {
      title: 'Câu Hỏi Trắc Nghiệm: Cấu Trúc Ngữ Nghĩa HTML5', badge: 'QUIZ',
      quiz: {
        q: 'Trong một trang chi tiết bài viết blog, thẻ ngữ nghĩa nào dưới đây là phù hợp nhất để bao bọc toàn bộ nội dung của bài viết và phần bình luận của độc giả?',
        opts: [
          'Thẻ <div> với class="article-wrapper"',
          'Thẻ <section> có tiêu đề bài viết',
          'Thẻ <article> đại diện cho một khối nội dung hoàn chỉnh có thể đứng độc lập',
          'Thẻ <aside> để bài viết nằm bên cạnh menu'
        ],
        a: 2,
        why: 'Thẻ <article> được W3C thiết kế chuyên biệt cho nội dung tự thân hoàn chỉnh (self-contained) có thể phân phối hoặc tái xuất bản độc lập như bài blog, bài báo, bài đăng diễn đàn hoặc bình luận độc giả.'
      }
    },

    /* ============================================================
       SECTION 04: BIỂU MẪU FORMS & VALIDATION NATIVE
       ============================================================ */
    { kind: 'section', no: '04', title: 'Biểu Mẫu Forms & Validation Native', sub: 'Thu thập dữ liệu người dùng an toàn, làm chủ các kiểu input hiện đại và cơ chế kiểm tra dữ liệu client-side.' },

    {
      title: 'Giải Phẫu Thẻ `<form>`: Thuộc Tính `action`, `method` & `enctype`', kicker: 'FE01 · Section 04: Forms & Validation',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**Thẻ `<form>` là cánh cổng giao tiếp chính** giữa người dùng và máy chủ Back-end.',
        '**3 Thuộc tính nền tảng bắt buộc phải hiểu**:',
        '1. **`action`**: Đường dẫn URL của endpoint API tiếp nhận dữ liệu (ví dụ: `/api/v1/auth/login`).',
        '2. **`method`**: Phương thức gửi HTTP Request:',
        '   • `GET`: Dữ liệu đính trực tiếp lên URL query string (`?q=nodejs`). Dùng cho ô tìm kiếm.',
        '   • `POST`: Dữ liệu ẩn bên trong Request Body. Dùng cho đăng nhập, gửi mật khẩu, tạo bài viết mới.',
        '3. **`enctype`**: Kiểu mã hóa dữ liệu. Khi có upload file ảnh, bắt buộc phải dùng `enctype="multipart/form-data"`!'
      ],
      img: { src: 'client-server.svg', cap: 'Form đóng gói thông tin gửi lên server qua giao thức HTTP POST', h: 320 }
    },

    {
      title: '15+ Kiểu Input Cốt Lõi Trong HTML5 Form', kicker: 'FE01 · Section 04: Forms & Validation',
      table: {
        head: ['Giá Trị type="..."', 'Hành Vi Hiển Thị & Bàn Phím Di Động', 'Tính Năng Tự Động'],
        rows: [
          ['`type="text"`', 'Ô nhập văn bản 1 dòng thông thường', 'Nhập họ tên, tiêu đề bài viết'],
          ['`type="email"`', 'Mở bàn phím có sẵn ký tự `@` và `.com` trên điện thoại', 'Tự động kiểm tra có định dạng `user@domain.com`'],
          ['`type="password"`', 'Ẩn ký tự bằng dấu chấm tròn đen bảo mật', 'Bảo vệ mật khẩu khi gõ nơi công cộng'],
          ['`type="number"`', 'Mở bàn phím số, có mũi tên tăng giảm số', 'Hỗ trợ `min`, `max`, `step` giới hạn giá trị'],
          ['`type="tel"`', 'Mở bàn phím bàn phím quay số điện thoại', 'Thích hợp nhập số điện thoại di động'],
          ['`type="date"`', 'Mở lịch chọn ngày tháng trực quan của hệ điều hành', 'Định dạng ngày chuẩn quốc tế `YYYY-MM-DD`'],
          ['`type="file"`', 'Mở cửa sổ chọn file ảnh/tài liệu từ máy tính', 'Hỗ trợ `accept="image/*"` và `multiple`'],
          ['`type="checkbox"` / `radio`', 'Hộp tích chọn nhiều / Nút tròn chọn duy nhất 1 mục', 'Bắt buộc thuộc tính `name` đồng nhất cho nhóm radio']
        ]
      },
      callout: { type: 'tip', t: 'Chọn đúng `type` giúp người dùng trên smartphone nhập liệu nhanh gấp 3 lần nhờ bàn phím ảo hiển thị đúng ngữ cảnh!' }
    },

    {
      title: 'Tầm Quan Trọng Tuyệt Đối Của Thẻ `<label>` & Thuộc Tính `for`', kicker: 'FE01 · Section 04: Forms & Validation',
      badge: 'BEST PRACTICE',
      code: {
        file: 'form-labels.html', lang: 'html', size: 'xs',
        src: `<!-- CÁCH 1: Dùng thuộc tính for liên kết với id của input (Khuyên dùng) -->
<div class="form-group">
  <label for="userEmail">Địa chỉ Email của bạn:</label>
  <input type="email" id="userEmail" name="email" required>
</div>

<!-- CÁCH 2: Bọc trực tiếp thẻ input vào trong label -->
<label class="checkbox-label">
  <input type="checkbox" name="agreeTerms" required>
  Tôi đồng ý với các điều khoản dịch vụ của DevBlog
</label>`
      },
      bullets: [
        '**Tăng diện tích tương tác (UX)**: Khi người dùng bấm vào dòng chữ của `<label>`, con trỏ chuột sẽ tự động focus vào ô `<input>`. Với checkbox/radio nhỏ xíu trên mobile, việc bấm được vào chữ là cứu tinh trải nghiệm!',
        '**Trợ năng (a11y)**: Bộ đọc màn hình sẽ đọc to nội dung nhãn label khi người khiếm thị di chuyển tới ô nhập liệu.'
      ]
    },

    {
      title: 'Các Phần Tử Điều Khiển Biểu Mẫu Khác: `<textarea>`, `<select>` & `<datalist>`', kicker: 'FE01 · Section 04: Forms & Validation',
      badge: 'MARKUP',
      code: {
        file: 'form-controls.html', lang: 'html', size: 'xs',
        src: `<!-- 1. Ô nhập văn bản nhiều dòng -->
<label for="postContent">Nội dung bài viết:</label>
<textarea id="postContent" name="content" rows="5" placeholder="Nhập nội dung..."></textarea>

<!-- 2. Danh sách chọn thả xuống (Dropdown) -->
<label for="category">Chuyên mục:</label>
<select id="category" name="category_id">
  <optgroup label="Lập Trình Web">
    <option value="1">Front-end (HTML/CSS/JS)</option>
    <option value="2" selected>Back-end (Node.js & MySQL)</option>
  </optgroup>
  <optgroup label="Điện Toán Đám Mây">
    <option value="3">DevOps & Cloud Deploy</option>
  </optgroup>
</select>

<!-- 3. Ô gợi ý tự động (Autocomplete Datalist) -->
<input list="techList" name="technology" placeholder="Gõ tên công nghệ...">
<datalist id="techList">
  <option value="Node.js">
  <option value="Express.js">
  <option value="MySQL">
  <option value="Sequelize">
</datalist>`
      }
    },

    {
      title: 'Cơ Chế Xác Thực Dữ Liệu Native (Client-Side HTML5 Validation)', kicker: 'FE01 · Section 04: Forms & Validation',
      table: {
        head: ['Thuộc Tính Validation', 'Ý Nghĩa Kiểm Tra', 'Ví Dụ Khai Báo'],
        rows: [
          ['`required`', 'Bắt buộc không được để trống khi submit form', '`<input type="text" required>`'],
          ['`minlength` / `maxlength`', 'Giới hạn độ dài chuỗi ký tự tối thiểu và tối đa', '`<input type="password" minlength="8" maxlength="32">`'],
          ['`min` / `max` / `step`', 'Giới hạn giá trị số hoặc ngày tháng tối thiểu/tối đa', '`<input type="number" min="18" max="65" step="1">`'],
          ['`pattern`', 'Kiểm tra khớp với biểu thức chính quy (Regex)', '`<input pattern="[0-9]{10}" title="Số điện thoại 10 chữ số">`'],
          ['`:valid` / `:invalid`', 'Giả lớp CSS tự đổi màu viền khi dữ liệu đúng hoặc sai', '`input:invalid { border-color: #ef4444; }`']
        ]
      },
      callout: { type: 'tip', t: 'Trình duyệt sẽ tự động chặn sự kiện submit và hiển thị bong bóng thông báo lỗi bằng ngôn ngữ máy của người dùng mà không cần viết 1 dòng code JS nào!' }
    },

    {
      title: 'Mẫu Form Đăng Ký Tài Khoản DevBlog Chuẩn Chỉ 100%', kicker: 'FE01 · Section 04: Forms & Validation',
      badge: 'LIVE CODING',
      code: {
        file: 'register.html', lang: 'html', size: 'xs',
        src: `<form action="/api/v1/auth/register" method="POST" class="auth-form" novalidate>
  <h2>Đăng Ký Tài Khoản Thành Viên CT9</h2>

  <div class="form-group">
    <label for="fullname">Họ và Tên:</label>
    <input type="text" id="fullname" name="name" required minlength="2" placeholder="Nguyễn Văn A">
  </div>

  <div class="form-group">
    <label for="email">Địa chỉ Email:</label>
    <input type="email" id="email" name="email" required autocomplete="email" placeholder="name@domain.com">
  </div>

  <div class="form-group">
    <label for="password">Mật khẩu:</label>
    <input type="password" id="password" name="password" required minlength="8" autocomplete="new-password">
    <small>Tối thiểu 8 ký tự gồm chữ và số</small>
  </div>

  <div class="form-group">
    <label class="checkbox-inline">
      <input type="checkbox" name="terms" required> Tôi chấp nhận các điều khoản
    </label>
  </div>

  <button type="submit" class="btn btn-primary">Tạo Tài Khoản</button>
</form>`
      },
      callout: { type: 'warning', t: 'Bảo mật Back-end: Client-side validation chỉ phục vụ trải nghiệm người dùng (UX). Hacker hoàn toàn có thể dùng cURL hoặc Postman gửi request bỏ qua HTML. Vì vậy Back-end bắt buộc phải validate lại 100% bằng Joi/Zod!' }
    },

    {
      title: 'Tối Ưu Trải Nghiệm Biểu Mẫu Di Động: Autocomplete & Inputmode', kicker: 'FE01 · Section 04: Forms & Validation',
      cards: [
        { icon: '⌨️', h: 'inputmode="..."', p: 'Chỉ định loại bàn phím hiển thị trên iOS/Android mà không làm đổi kiểu dữ liệu. Ví dụ `inputmode="numeric"` cho mã OTP, thẻ ngân hàng mà không bị mũi tên tăng giảm số gây khó chịu.' },
        { icon: '🪄', h: 'autocomplete="..."', p: 'Giúp trình duyệt tự động điền sẵn họ tên, email, số điện thoại, địa chỉ hoặc mật khẩu đã lưu từ Keychain/Google Password Manager chỉ với 1 chạm.' },
        { icon: '🎯', h: 'autofocus', p: 'Tự động đặt con trỏ chuột vào ô nhập liệu đầu tiên khi người dùng vừa mở trang (chỉ dùng duy nhất 1 ô autofocus trên toàn trang).' },
        { icon: '🚫', h: 'spellcheck="false"', p: 'Tắt gạch chân màu đỏ kiểm tra chính tả của trình duyệt trên các ô nhập tên tài khoản, mã code hoặc mật khẩu.' }
      ],
      cols: 2
    },

    {
      title: 'Câu Hỏi Trắc Nghiệm: Biểu Mẫu Forms & Bảo Mật', badge: 'QUIZ',
      quiz: {
        q: 'Khi xây dựng chức năng đổi ảnh đại diện (avatar) của thành viên, thuộc tính nào dưới đây là BẮT BUỘC phải khai báo trên thẻ <form>?',
        opts: [
          'method="GET" và type="file"',
          'method="POST" và enctype="multipart/form-data"',
          'action="/upload" và target="_blank"',
          'novalidate="true" và autocomplete="off"'
        ],
        a: 1,
        why: 'Mặc định form mã hóa dữ liệu theo kiểu application/x-www-form-urlencoded (chỉ truyền được chuỗi văn bản). Để upload file nhị phân (binary) như ảnh PNG/JPG, bắt buộc phải dùng method="POST" kết hợp thuộc tính enctype="multipart/form-data" để chia nhỏ file thành từng phần gửi lên server.'
      }
    },

    /* ============================================================
       SECTION 05: ĐA PHƯƠNG TIỆN, TRỢ NĂNG (A11Y) & TỔNG KẾT
       ============================================================ */
    { kind: 'section', no: '05', title: 'Đa Phương Tiện, Trợ Năng (a11y) & Tổng Kết', sub: 'Tối ưu hóa hình ảnh chuẩn Responsive, nhúng âm thanh/video và xây dựng website tiếp cận mọi đối tượng người dùng.' },

    {
      title: 'Tối Ưu Hóa Hình Ảnh: Thuộc Tính `loading="lazy"` & `srcset`', kicker: 'FE01 · Section 05: Media & Accessibility',
      badge: 'PERFORMANCE',
      code: {
        file: 'images.html', lang: 'html', size: 'xs',
        src: `<!-- 1. Tối ưu ảnh cơ bản: Bắt buộc có alt, kích thước và lazy load -->
<img src="banner.jpg"
     alt="Học viên lớp CT9 đang thuyết trình đồ án tốt nghiệp Node.js"
     width="800" height="450"
     loading="lazy"
     decoding="async">

<!-- 2. Responsive Image: Phục vụ ảnh kích thước phù hợp theo độ phân giải màn hình -->
<img src="photo-medium.jpg"
     srcset="photo-small.jpg 480w, photo-medium.jpg 800w, photo-large.jpg 1200w"
     sizes="(max-width: 600px) 480px, 800px"
     alt="Minh họa kiến trúc hệ thống Back-end">`
      },
      bullets: [
        '**`alt="..."` (Alternative Text)**: Bắt buộc phải có để mô tả ảnh cho Google Image Search và đọc cho người khiếm thị.',
        '**`loading="lazy"`**: Trình duyệt chỉ tải ảnh khi người dùng cuộn chuột gần tới nơi, tiết kiệm 70% băng thông 4G ban đầu.',
        '**`width` và `height`**: Giúp trình duyệt giữ trước khoảng trống, loại bỏ hiện tượng giật cục bố cục (Cumulative Layout Shift - CLS).'
      ]
    },

    {
      title: 'Nghệ Thuật Chọn Ảnh (Art Direction) Với Thẻ `<picture>`', kicker: 'FE01 · Section 05: Media & Accessibility',
      layout: 'split', ratio: '1.05fr .95fr',
      code: {
        file: 'picture.html', lang: 'html', size: 'xs',
        src: `<picture>
  <!-- Ưu tiên 1: Định dạng hiện đại AVIF siêu nhẹ -->
  <source srcset="hero.avif" type="image/avif">

  <!-- Ưu tiên 2: Định dạng WebP nén tốt hơn JPG 30% -->
  <source srcset="hero.webp" type="image/webp">

  <!-- Ưu tiên 3: Màn hình điện thoại nhỏ dùng ảnh crop dọc -->
  <source media="(max-width: 640px)" srcset="hero-mobile.jpg">

  <!-- Phương án dự phòng cuối cùng cho trình duyệt cũ -->
  <img src="hero-fallback.jpg"
       alt="Khóa học lập trình Web Back-end CT9"
       loading="eager">
</picture>`
      },
      bullets: [
        '**Thẻ `<picture>` là cứu tinh tối ưu hiệu năng web**:',
        '• Cho phép trình duyệt thông minh tự động chọn file ảnh có dung lượng nhẹ nhất mà nó hỗ trợ (AVIF ➔ WebP ➔ JPG).',
        '• Cho phép hiển thị các bố cục ảnh khác nhau hoàn toàn giữa máy tính để bàn (ảnh ngang) và điện thoại (ảnh vuông hoặc dọc).',
        '• Thẻ `<img>` bên trong đóng vai trò hiển thị và là phương án dự phòng (fallback) an toàn 100%.'
      ]
    },

    {
      title: 'Nhúng Âm Thanh & Video HTML5 Native: `<audio>` & `<video>`', kicker: 'FE01 · Section 05: Media & Accessibility',
      badge: 'MULTIMEDIA',
      code: {
        file: 'media.html', lang: 'html', size: 'xs',
        src: `<!-- 1. Trình phát video chuẩn HTML5 có phụ đề -->
<video controls width="100%" poster="video-thumbnail.jpg" preload="metadata">
  <source src="lecture-01.mp4" type="video/mp4">
  <source src="lecture-01.webm" type="video/webm">
  <!-- File phụ đề tiếng Việt chuẩn WebVTT -->
  <track src="subs-vi.vtt" kind="subtitles" srclang="vi" label="Tiếng Việt" default>
  Trình duyệt của bạn không hỗ trợ thẻ video HTML5.
</video>

<!-- 2. Trình phát âm thanh Podcast -->
<audio controls preload="none">
  <source src="podcast-episode1.mp3" type="audio/mpeg">
  Trình duyệt không hỗ trợ phát âm thanh.
</audio>`
      },
      callout: { type: 'tip', t: 'Thuộc tính `controls` hiển thị nút Play/Pause, thanh âm lượng và toàn màn hình native của hệ điều hành. Thuộc tính `poster` đặt ảnh đại diện hiển thị trước khi người dùng bấm Play.' }
    },

    {
      title: 'Khả Năng Tiếp Cận Web (Web Accessibility - a11y)', kicker: 'FE01 · Section 05: Media & Accessibility',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**a11y (Accessibility) là gì?**',
        '• Thiết kế trang web sao cho mọi người, bao gồm người khiếm thị, người khiếm thính, người khuyết tật vận động đều có thể tiếp cận và sử dụng thuận tiện.',
        '**4 Nguyên tắc vàng trong xây dựng HTML5 tiếp cận**:',
        '1. **Đầy đủ thẻ `<label>` và thuộc tính `alt`**: Không để người dùng khiếm thị bị "lạc lối" giữa các ô nhập liệu.',
        '2. **Độ tương phản màu sắc (Color Contrast)**: Tỷ lệ tương phản chữ và nền tối thiểu đạt chuẩn WCAG AA là `4.5:1`.',
        '3. **Điều hướng bằng bàn phím (Keyboard Navigation)**: Người dùng có thể bấm phím `Tab` để di chuyển qua lại giữa các nút và link mà không cần dùng chuột.',
        '4. **Vai trò ARIA (`role="alert"`, `aria-expanded`)**: Thông báo các trạng thái động cho Screen Reader.'
      ],
      img: { src: 'w3c-accessibility-pour.svg', cap: 'Chuẩn Web Accessibility (W3C WCAG) & 4 Nguyên lý POUR tiếp cận', h: 320 }
    },

    {
      title: 'Bảng Check-List 10 Tiêu Chuẩn Vàng Của Trang HTML5 Chuẩn Mực', kicker: 'FE01 · Section 05: Media & Accessibility',
      table: {
        head: ['Hạng Mục Kiểm Tra', 'Tiêu Chí Chuẩn Đạt', 'Lợi Ích Mang Lại'],
        rows: [
          ['1. DOCTYPE & Ngôn ngữ', 'Khai báo `<!DOCTYPE html>` và `<html lang="vi">`', 'Kích hoạt Standard Mode, hỗ trợ SEO và bộ đọc màn hình'],
          ['2. Responsive Viewport', 'Có thẻ `<meta name="viewport" content="...">`', 'Hiển thị chuẩn xác trên mọi kích thước smartphone'],
          ['3. Tiêu đề Duy Nhất', 'Đúng 1 thẻ `<h1>` duy nhất mỗi trang, heading tuần tự', 'Tối ưu chỉ số lập chỉ mục SEO của Google'],
          ['4. Ngữ nghĩa Semantic', 'Dùng `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`', 'Loại bỏ div soup, cấu trúc mạch lạc, dễ bảo trì'],
          ['5. Nhãn Form Label', '100% thẻ `<input>` đều có `<label>` liên kết `for`', 'Trải nghiệm bấm chạm trên mobile tuyệt vời, chuẩn a11y'],
          ['6. Tải Script Tối Ưu', 'Sử dụng `<script defer>` cho các file JS tương tác', 'Không chặn hiển thị trang web, tốc độ tải tức thì']
        ]
      },
      callout: { type: 'tip', t: 'Hãy biến 10 tiêu chuẩn này thành phản xạ tự nhiên mỗi khi mở editor viết bất kỳ dòng mã HTML nào!' }
    },

    {
      title: 'Tổng Kết FE01: Nền Móng Vững Chắc Cho Hành Trình Web Master', kicker: 'FE01 · Tổng Kết Buổi Học',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**Thành quả đạt được sau buổi FE01**:',
        '• Hiểu rõ kiến trúc Client-Server, Critical Rendering Path và cấu trúc cây DOM trong bộ nhớ trình duyệt.',
        '• Phân biệt thuần thục Block vs Inline, tiêu đề Heading, siêu liên kết an toàn và bảng dữ liệu chuyên nghiệp.',
        '• Xóa bỏ tư duy "Div Soup", làm chủ hoàn toàn các thẻ ngữ nghĩa Semantic HTML5 hiện đại.',
        '• Xây dựng biểu mẫu Form thu thập dữ liệu với bộ kiểm tra Native Validation hoàn chỉnh.',
        '**Cầu nối sang buổi FE02 (CSS3)**:',
        '• Khung xương HTML đã dựng xong! Buổi tiếp theo chúng ta sẽ khoác lên bộ áo lộng lẫy bằng CSS3: Làm chủ Box Model, Flexbox, Grid, Responsive và Micro-animations!'
      ],
      img: { src: 'css3-logo.svg', cap: 'Sẵn sàng bước sang buổi FE02: Làm chủ nghệ thuật bố cục và tạo kiểu CSS3', h: 280 },
      callout: { type: 'tip', t: 'HTML là khung xương, CSS là da thịt và trang phục, JavaScript là hệ thần kinh cử động. Bạn đã hoàn thành xuất sắc 1/3 chặng đường nền tảng Front-end!' }
    }
  ],
  recap: [
    '**Critical Rendering Path** giải thích cách trình duyệt phân tích HTML thành DOM và kết hợp CSSOM để render điểm ảnh',
    '**HTML5 Semantic Web** (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`) tăng tốc độ SEO và xóa bỏ vấn nạn Div Soup',
    '**Thẻ Liên Kết An Toàn** luôn đi kèm `rel="noopener noreferrer"` khi sử dụng `target="_blank"` để chống Tabnabbing',
    '**HTML5 Native Validation** (`required`, `pattern`, `min/max`, `type="email"`) kiểm soát dữ liệu client-side mượt mà',
    '**Tối Ưu Đa Phương Tiện** với thẻ `<picture>` hỗ trợ định dạng hiện đại WebP/AVIF và thuộc tính `loading="lazy"`',
    'Sẵn sàng bước vào buổi **FE02: CSS3 & Hệ Thống Bố Cục Hiện Đại**!'
  ],
  exercises: [
    {
      level: 'warmup', time: 20, title: 'Tạo Khung Tài Liệu Chuẩn HTML5 Kèm Metadata SEO',
      desc: 'Khởi tạo tập tin index.html chứa đầy đủ các thẻ meta cần thiết cho việc hiển thị chuẩn trên di động và mạng xã hội.',
      tasks: [
        'Tạo file `index.html` với khai báo `<!DOCTYPE html>` và `<html lang="vi">`',
        'Khai báo bộ mã ký tự UTF-8 và thẻ meta viewport cho responsive',
        'Thêm tiêu đề `<title>` và thẻ `<meta name="description">` chuẩn SEO cho trang cá nhân',
        'Khai báo 2 thẻ Open Graph: `og:title` và `og:image` để hiển thị thumbnail khi chia sẻ link',
        'Mở file trên trình duyệt và kiểm tra thông tin tab hiển thị chính xác'
      ]
    },
    {
      level: 'core', time: 35, title: 'Tái Cấu Trúc Giao Diện Blog Từ "Div Soup" Sang Semantic HTML5',
      desc: 'Chuyển đổi một đoạn mã HTML cũ dùng toàn thẻ div thành cấu trúc chuẩn ngữ nghĩa hiện đại.',
      tasks: [
        'Thay thế `<div id="header">` và `<div id="menu">` bằng `<header>` và `<nav>`',
        'Chuyển khối nội dung bài viết thành `<main>` chứa bên trong một thẻ `<article>` độc lập',
        'Sử dụng `<section>` có tiêu đề phụ `<h2>` cho từng phân đoạn nội dung bài viết',
        'Đặt thanh chuyên mục và bài viết liên quan vào trong thẻ `<aside>`',
        'Bọc phần thông tin bản quyền và liên hệ cuối trang trong thẻ `<footer>`'
      ],
      solution: { file: 'semantic-blog.html', lang: 'html', src: `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bài Viết Blog Chuẩn Ngữ Nghĩa</title>
</head>
<body>
  <header>
    <h1>DevBlog CT9</h1>
    <nav aria-label="Điều hướng chính">
      <ul>
        <li><a href="/">Trang Chủ</a></li>
        <li><a href="/courses">Khóa Học</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <article>
      <h2>Lộ Trình Trở Thành Kỹ Sư Back-end Node.js Chuyên Nghiệp</h2>
      <p>Nội dung bài viết chi tiết...</p>
    </article>
    <aside>
      <h3>Bài Viết Cùng Chủ Đề</h3>
      <ul>
        <li><a href="/post-1">Kiến trúc MVC là gì?</a></li>
      </ul>
    </aside>
  </main>
  <footer>
    <p>&copy; 2026 DevBlog CT9. Bản quyền thuộc về tác giả.</p>
  </footer>
</body>
</html>` }
    },
    {
      level: 'core', time: 35, title: 'Xây Dựng Biểu Mẫu Đăng Bài Mới Kèm Native Validation',
      desc: 'Tạo form gửi bài viết mới với các ràng buộc kiểm tra dữ liệu phía client không dùng JavaScript.',
      tasks: [
        'Tạo thẻ `<form action="/api/v1/posts" method="POST" enctype="multipart/form-data">`',
        'Thêm ô nhập tiêu đề bài viết: `type="text"`, bắt buộc (`required`), độ dài từ 10 đến 100 ký tự',
        'Thêm ô chọn chuyên mục bằng thẻ `<select>` có ít nhất 2 `<optgroup>`',
        'Thêm ô upload ảnh đại diện: `type="file"`, chỉ chấp nhận file ảnh (`accept="image/*"`)',
        'Thêm khung soạn nội dung bằng thẻ `<textarea>` bắt buộc tối thiểu 50 ký tự',
        'Thử bấm nút Submit khi chưa điền dữ liệu để quan sát trình duyệt hiển thị bong bóng thông báo lỗi'
      ]
    },
    {
      level: 'challenge', time: 40, title: 'Thiết Kế Bảng Báo Giá Khóa Học Với Colspan & Rowspan',
      desc: 'Dựng bảng so sánh các gói học tập có đầy đủ thead, tbody, tfoot và hợp nhất ô nâng cao.',
      tasks: [
        'Tạo bảng với thẻ `<caption>` mô tả "Bảng So Sánh Quyền Lợi Các Gói Học Lập Trình"',
        'Phần `<thead>` gồm 4 cột: Tính Năng, Gói Cơ Bản, Gói Nâng Cao, Gói Chuyên Sâu',
        'Dùng `rowspan="2"` để gộp ô tính năng "Hỗ Trợ 1-1" áp dụng chung cho cả 2 gói cao cấp',
        'Dùng `colspan="3"` ở dòng `<tfoot>` để ghi chú chính sách hoàn tiền 100% trong 7 ngày đầu',
        'Thêm thuộc tính `scope="col"` cho tiêu đề cột và `scope="row"` cho tiêu đề dòng'
      ]
    },
    {
      level: 'homework', time: 50, title: 'Dựng Trang Giới Thiệu Bản Thân Đầy Đủ Multimedia & a11y',
      desc: 'Hoàn thiện một trang Portfolio cá nhân hoàn chỉnh áp dụng toàn bộ kiến thức Semantic, Form và Media.',
      tasks: [
        'Dựng đầy đủ cấu trúc: header logo + nav, main với 3 section (Giới thiệu, Kỹ năng, Dự án đã làm), footer',
        'Nhúng ảnh đại diện bằng thẻ `<picture>` hỗ trợ WebP và JPG fallback, có `loading="lazy"`',
        'Tạo một form liên hệ có đầy đủ label, input type="text", "email", "tel", textarea',
        'Sử dụng thẻ `<details>` và `<summary>` tạo mục Hỏi & Đáp (FAQ) về bản thân',
        'Kiểm tra trang web bằng công cụ Lighthouse trong Chrome DevTools để đạt điểm Accessibility > 90'
      ]
    }
  ],
  project: {
    lead: '**Đồ án giai đoạn Front-end**: Dựng khung xương Semantic HTML5 hoàn chỉnh cho hệ thống DevBlog trước khi sang bước tạo kiểu CSS3!',
    tasks: [
      'Xây dựng trang chủ DevBlog với bố cục Semantic HTML5 chuẩn mực',
      'Xây dựng form đăng ký thành viên với HTML5 Native Validation',
      'Xây dựng form tạo bài viết mới hỗ trợ upload file ảnh',
      'Tối ưu hóa hình ảnh với thẻ picture và responsive srcset'
    ],
    callout: { type: 'tip', t: 'Một bộ khung xương HTML vững chắc và chuẩn ngữ nghĩa sẽ giúp việc viết CSS ở buổi sau trở nên cực kỳ dễ dàng và thư thái!' }
  }
};
