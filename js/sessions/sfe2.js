/* ============================================================
   SESSION FE02 — CSS3 Hiện Đại: Box Model, Flexbox & CSS Grid
   Mục tiêu: Nắm vững nguyên lý Box Model, cứu tinh box-sizing,
             làm chủ bố cục 1 chiều Flexbox, 2 chiều CSS Grid,
             kỹ thuật định vị positioning, responsive và animations.
   ============================================================ */
SESSION_DATA['fe2'] = {
  intro: 'Chào mừng các bạn đến với Buổi FE02! Hôm nay chúng ta sẽ làm chủ CSS3 hiện đại: từ bản chất tính toán kích thước hộp (Box Model) đến kỹ thuật dàn trang mạnh mẽ nhất lịch sử web: Flexbox, CSS Grid, Positioning và Responsive Design.',
  agenda: [
    { min: 30, t: 'Nền Tảng CSS3, Selector & Độ Ưu Tiên Specificity', d: 'Cú pháp luật CSS, combinators, pseudo-classes/elements, cascade & inheritance' },
    { min: 35, t: 'Box Model & Cứu Tinh box-sizing: border-box', d: 'Content, padding, border, margin; hiện tượng gộp lề margin collapsing, đơn vị rem/em' },
    { min: 40, t: 'Làm Chủ Bố Cục Một Chiều Flexbox', d: 'Main Axis vs Cross Axis, justify-content, align-items, flex-direction, flex: 1, gap' },
    { min: 35, t: 'Dàn Trang Hai Chiều CSS Grid & Positioning', d: 'grid-template-columns, đơn vị fr, minmax(auto-fit), static/relative/absolute/fixed/sticky' },
    { min: 40, t: 'Responsive Mobile-First & Micro-Animations', d: 'Media queries, clamp(), transition, transform 2D, glassmorphism backdrop-filter' }
  ],
  slides: [
    /* ============================================================
       SECTION 01: NỀN TẢNG CSS3, SELECTOR & ĐỘ ƯU TIÊN
       ============================================================ */
    { kind: 'section', no: '01', title: 'Nền Tảng CSS3, Selector & Độ Ưu Tiên', sub: 'Hiểu sâu cơ chế xếp tầng (Cascade), phân cấp trọng số bộ chọn và kế thừa thuộc tính.' },

    {
      title: 'CSS3 Là Gì & 3 Phương Thức Nhúng CSS Vào Tài Liệu', kicker: 'FE02 · Section 01: CSS3 & Selectors',
      table: {
        head: ['Phương Thức Nhúng', 'Cú Pháp Khai Báo', 'Ưu Điểm', 'Nhược Điểm / Ngữ Cảnh'],
        rows: [
          ['1. External CSS (File riêng)', '`<link rel="stylesheet" href="style.css">`', 'Tách biệt cấu trúc và giao diện, trình duyệt cache được, tái sử dụng toàn website', '★ Chuẩn công nghiệp bắt buộc cho mọi dự án!'],
          ['2. Internal CSS (Trong thẻ `<head>`)', '`<style> body { background: #000; } </style>`', 'Nhanh chóng khi thử nghiệm trang đơn hoặc nhúng mã critical CSS', 'Không tái sử dụng được giữa các trang khác nhau'],
          ['3. Inline CSS (Trực tiếp trên thẻ)', '`<p style="color: red; font-size: 16px;">`', 'Ghi đè nhanh tức thì cho 1 phần tử cá biệt', '❌ Chống chỉ định — Làm rối HTML, cực khó bảo trì, độ ưu tiên quá cao!']
        ]
      },
      callout: { type: 'tip', t: 'Quy tắc vàng: Luôn luôn sử dụng External CSS thông qua thẻ `<link>` đặt ở trong phần `<head>` của tài liệu HTML.' }
    },

    {
      title: 'Cú Pháp Luật CSS & 4 Bộ Chọn (Selectors) Cơ Bản', kicker: 'FE02 · Section 01: CSS3 & Selectors',
      badge: 'SYNTAX',
      code: {
        file: 'basic-selectors.css', lang: 'css', size: 'xs',
        src: `/* 1. Universal Selector (*): Chọn TẤT CẢ mọi phần tử trên trang */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 2. Type/Element Selector: Chọn theo tên thẻ HTML */
h1 {
  font-family: 'Inter', sans-serif;
  color: #0f172a;
}

/* 3. Class Selector (.tên-class): Chọn theo lớp (Có thể gán cho nhiều phần tử) */
.btn-primary {
  background-color: #3b82f6;
  color: #ffffff;
  border-radius: 8px;
}

/* 4. ID Selector (#tên-id): Chọn phần tử ĐỘC NHẤT (Chỉ 1 id duy nhất trên trang) */
#main-navigation {
  position: sticky;
  top: 0;
  background-color: #ffffff;
}`
      }
    },

    {
      title: 'Bộ Chọn Quan Hệ (Combinators): Bắt Đúng Phần Tử Mục Tiêu', kicker: 'FE02 · Section 01: CSS3 & Selectors',
      table: {
        head: ['Bộ Chọn Combinator', 'Ký Hiệu', 'Ý Nghĩa Quan Hệ', 'Ví Dụ Thực Tế'],
        rows: [
          ['Descendant Selector (Hậu duệ)', 'Khoảng trắng (` `)', 'Chọn TẤT CẢ phần tử con, cháu, chắt nằm sâu bên trong thẻ cha', '`article p` (Chọn mọi thẻ `<p>` nằm trong `<article>`)'],
          ['Child Selector (Con trực tiếp)', 'Dấu lớn hơn (`>`)', 'CHỈ chọn các phần tử là con trực tiếp ở cấp 1 của thẻ cha', '`ul.menu > li` (Không chọn các `<li>` của menu con cấp 2)'],
          ['Adjacent Sibling (Anh em liền kề)', 'Dấu cộng (`+`)', 'Chọn phần tử nằm NGAY SAU phần tử đầu tiên và chung cha', '`h2 + p` (Chỉ chọn đoạn văn nằm sát ngay sau tiêu đề `<h2>`)'],
          ['General Sibling (Anh em chung)', 'Dấu ngã (`~`)', 'Chọn TẤT CẢ các phần tử nằm sau phần tử đầu và chung cha', '`h2 ~ p` (Chọn tất cả các thẻ `<p>` nằm sau `<h2>`)']
        ]
      },
      callout: { type: 'tip', t: 'Sử dụng Child Selector `>` giúp CSS chạy nhanh hơn và tránh việc vô tình làm đổi style của các component lồng sâu bên trong!' }
    },

    {
      title: 'Giả Lớp (Pseudo-classes): Bắt Trạng Thái Tương Tác Của Phần Tử', kicker: 'FE02 · Section 01: CSS3 & Selectors',
      cards: [
        { icon: '🖱️', h: ':hover, :focus, :active', p: '`:hover` kích hoạt khi di chuột qua; `:focus` kích hoạt khi ô input nhận con trỏ; `:active` kích hoạt ngay tại khoảnh khắc bấm chuột xuống nút.' },
        { icon: '🎯', h: ':first-child & :last-child', p: 'Chọn phần tử đầu tiên hoặc phần tử cuối cùng trong danh sách anh em, rất tiện để bỏ đường gạch viền `border-bottom: none` cho item cuối.' },
        { icon: '🔢', h: ':nth-child(an + b)', p: 'Bộ chọn kỳ diệu: `:nth-child(2n)` hoặc `:nth-child(even)` tạo màu xen kẽ cho bảng biểu; `:nth-child(3)` chọn chính xác phần tử thứ 3.' },
        { icon: '🚫', h: ':not() & :is() & :where()', p: '`:not(.active)` chọn tất cả trừ phần tử active; `:is(h1, h2, h3)` viết gộp bộ chọn; `:where()` viết gộp mà không làm tăng độ ưu tiên specificity.' }
      ],
      cols: 2
    },

    {
      title: 'Phần Tử Giả (Pseudo-elements): `::before` & `::after` Thần Thánh', kicker: 'FE02 · Section 01: CSS3 & Selectors',
      layout: 'split', ratio: '1.05fr .95fr',
      code: {
        file: 'badge.css', lang: 'css', size: 'xs',
        src: `/* Tạo dấu chấm trạng thái online mà không cần thêm thẻ HTML! */
.user-status {
  position: relative;
  font-weight: 600;
}

.user-status::before {
  content: ""; /* BẮT BUỘC PHẢI CÓ thuộc tính content */
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #22c55e; /* Màu xanh lá */
  border-radius: 50%;
  margin-right: 8px;
}

/* Thêm icon mũi tên tự động vào sau các link ngoài */
a[target="_blank"]::after {
  content: " ↗";
  font-size: 0.85em;
  color: #64748b;
}`
      },
      bullets: [
        '**`::before` và `::after` sinh ra một hộp ảo** nằm bên trong phần tử (ngay trước hoặc ngay sau nội dung thật).',
        '**Bắt buộc phải có thuộc tính `content: ""`**: Dù là chuỗi rỗng thì trình duyệt mới vẽ phần tử giả ra màn hình.',
        '**Lợi ích vượt trội**:',
        '• Giữ mã nguồn HTML tinh gọn, sạch sẽ, không bị ô nhiễm bởi các thẻ `<span>` trang trí vô nghĩa.',
        '• Tuyệt vời cho: Dấu gạch chân animated, icon trang trí, huy hiệu badge, hoặc lớp phủ mờ overlay.'
      ]
    },

    {
      title: 'Cơ Chế Xếp Tầng (The Cascade): Ai Là Người Chiến Thắng?', kicker: 'FE02 · Section 01: CSS3 & Selectors',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        'CSS viết tắt của **Cascading Style Sheets** — Tính năng xếp tầng là bản chất cốt lõi nhất của CSS.',
        'Khi một phần tử có nhiều luật CSS xung đột (cùng muốn đổi màu chữ), trình duyệt giải quyết theo 3 cấp độ:',
        '1. **Tầm quan trọng (Importance)**: Cờ `!important` ghi đè mọi luật thông thường.',
        '2. **Trọng số ưu tiên (Specificity)**: Bộ chọn nào có trọng số tính toán chi tiết hơn sẽ chiến thắng.',
        '3. **Thứ tự xuất hiện (Source Order)**: Nếu trọng số bằng nhau hoàn toàn, luật nào viết ở dòng code SAU CÙNG trong file CSS sẽ được áp dụng!'
      ],
      img: { src: 'css-cascade-flow.svg', cap: 'Thuật toán xếp tầng CSS Cascade: Importance ➔ Specificity ➔ Source Order', h: 320 }
    },

    {
      title: 'Kim Tự Tháp Độ Ưu Tiên Specificity: Công Thức 4 Con Số', kicker: 'FE02 · Section 01: CSS3 & Selectors',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**Công thức tính trọng số: (Inline, ID, Class, Element)**:',
        '• **Inline style** (`style="..."`): Trọng số `(1, 0, 0, 0)` = 1000 điểm.',
        '• **ID selector** (`#header`): Trọng số `(0, 1, 0, 0)` = 100 điểm.',
        '• **Class / Pseudo-class / Attribute** (`.btn`, `:hover`, `[type]`): Trọng số `(0, 0, 1, 0)` = 10 điểm.',
        '• **Element / Pseudo-element** (`div`, `p`, `::before`): Trọng số `(0, 0, 0, 1)` = 1 điểm.',
        '• **Universal `*` và Combinators (`>`, `+`)**: Trọng số `(0, 0, 0, 0)` = 0 điểm.'
      ],
      img: { src: 'css-specificity-hierarchy.svg', cap: 'Kim tự tháp trọng số ưu tiên: Inline > ID > Class > Element (W3C Standard)', h: 360 }
    },

    {
      title: 'Tính Kế Thừa (Inheritance) Trong CSS: Cha Truyền Con Nối', kicker: 'FE02 · Section 01: CSS3 & Selectors',
      table: {
        head: ['Nhóm Thuộc Tính', 'Có Tự Động Kế Thừa?', 'Các Thuộc Tính Tiêu Biểu'],
        rows: [
          ['Thuộc tính Kiểu chữ & Văn bản (Typography)', 'CÓ (Tự động kế thừa từ cha sang con)', '`color`, `font-family`, `font-size`, `line-height`, `text-align`, `letter-spacing`'],
          ['Thuộc tính Hộp & Bố cục (Box Model & Layout)', 'KHÔNG (Mỗi phần tử có giá trị riêng)', '`width`, `height`, `margin`, `padding`, `border`, `background`, `display`, `position`'],
          ['Từ khóa ép buộc kế thừa: `inherit`', 'Ép phần tử con nhận giá trị của cha', '`a { color: inherit; }` (Giúp thẻ `<a>` cùng màu chữ với đoạn văn chứa nó)']
        ]
      },
      callout: { type: 'tip', t: 'Nhờ tính kế thừa, bạn chỉ cần khai báo `font-family` và `color` một lần duy nhất tại thẻ `body`, toàn bộ các thẻ con bên trong sẽ tự động nhận đúng phông chữ!' }
    },

    /* ============================================================
       SECTION 02: MÔ HÌNH HỘP (BOX MODEL) & HỆ THỐNG ĐƠN VỊ
       ============================================================ */
    { kind: 'section', no: '02', title: 'Mô Hình Hộp (Box Model) & Hệ Thống Đơn Vị', sub: 'Làm chủ kích thước hộp, giải quyết hiện tượng gộp lề và chuẩn hóa hệ thống đơn vị đo lường hiện đại.' },

    {
      title: 'CSS Box Model — Trái Tim Của Mọi Bố Cục Giao Diện', kicker: 'FE02 · Section 02: Box Model & Box Sizing',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        'Trong trình duyệt, **mọi phần tử HTML đều là một chiếc hộp chữ nhật**.',
        '**Cấu trúc 4 lớp từ trong ra ngoài**:',
        '1. **Content (Nội dung)**: Nơi chứa chữ, hình ảnh hoặc các thẻ con bên trong.',
        '2. **Padding (Vùng đệm)**: Khoảng cách từ nội dung ra viền. Mang màu nền (background) của phần tử.',
        '3. **Border (Đường viền)**: Nét viền bao quanh vùng đệm (`solid`, `dashed`, có độ dày và màu riêng).',
        '4. **Margin (Lề ngoài)**: Khoảng trống vô hình ngăn cách phần tử này với các phần tử lân cận bên ngoài.'
      ],
      img: { src: 'box-model.svg', cap: 'Sơ đồ 4 lớp chuẩn W3C Box Model: Content, Padding, Border, Margin', h: 360 }
    },

    {
      title: 'Padding vs Margin & Hiện Tượng Gộp Lề (Margin Collapsing)', kicker: 'FE02 · Section 02: Box Model & Box Sizing',
      cards: [
        { icon: '📦', h: 'Padding (Vùng đệm trong)', p: 'Tăng kích thước có thể click của nút bấm. Khi bạn click vào vùng padding, sự kiện click vẫn được kích hoạt. Luôn mang màu nền background.' },
        { icon: '🌌', h: 'Margin (Khoảng cách ngoài)', p: 'Đẩy các phần tử khác ra xa. Vùng margin hoàn toàn trong suốt, bạn không thể click vào margin và margin không mang màu nền.' },
        { icon: '💥', h: 'Margin Collapsing (Gộp lề dọc)', p: 'Khi 2 phần tử Block xếp chồng lên nhau: phần tử trên có `margin-bottom: 30px`, phần tử dưới có `margin-top: 20px`. Khoảng cách giữa chúng KHÔNG PHẢI 50px mà là **30px** (lấy giá trị lớn hơn)!' },
        { icon: '🛡️', h: 'Khắc phục Margin Collapsing', p: 'Sử dụng Flexbox hoặc Grid với thuộc tính `gap`. Khoảng cách `gap` không bao giờ bị gộp lề, luôn chính xác 100%!' }
      ],
      cols: 2
    },

    {
      title: 'Bước Ngoặt Công Nghệ: `box-sizing: border-box`', kicker: 'FE02 · Section 02: Box Model & Box Sizing',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**Mặc định tai hại của CSS (`content-box`)**:',
        '• Thuộc tính `width` chỉ tính cho Content. Khi thêm padding và border, phần tử sẽ tự phình to ra ngoài: $\\text{Kích thước thật} = \\text{width} + \\text{padding} + \\text{border}$.',
        '• Chia 2 cột `50%` thêm `padding: 10px` sẽ bị vỡ dòng ngay lập tức!',
        '**Cứu tinh hiện đại (`border-box`)**:',
        '• Thuộc tính `width` bao trọn toàn bộ Content + Padding + Border. Content tự động co nhỏ lại để kích thước ngoài đúng chuẩn số pixel đã khai báo.',
        '• **Dòng code đầu tiên của mọi dự án**:',
        '  `*, *::before, *::after { box-sizing: border-box; }`'
      ],
      img: { src: 'box-model-sizing.svg', cap: 'So sánh trực quan: content-box làm vỡ khung vs border-box giữ chuẩn kích thước', h: 360 }
    },

    {
      title: 'Hệ Thống Đơn Vị Đo Lường: Tuyệt Đối vs Tương Đối', kicker: 'FE02 · Section 02: Box Model & Box Sizing',
      table: {
        head: ['Đơn Vị', 'Phân Loại', 'Cách Tính Giá Trị', 'Khuyên Dùng Cho'],
        rows: [
          ['`px` (Pixel)', 'Tuyệt đối', '1 điểm ảnh trên màn hình, cố định không đổi', 'Độ dày đường viền (`border: 1px solid`), đổ bóng nhẹ.'],
          ['`rem` (Root EM)', 'Tương đối', 'Tính theo font-size của thẻ gốc `<html>` (Mặc định `1rem = 16px`)', '★ Tiêu chuẩn vàng cho font-size, padding, margin, width!'],
          ['`em`', 'Tương đối', 'Tính theo font-size của chính phần tử cha trực tiếp', 'Khoảng cách co giãn theo kích thước chữ cục bộ.'],
          ['`%` (Phần trăm)', 'Tương đối', 'Tính theo chiều rộng hoặc chiều cao của thẻ cha', 'Chia tỷ lệ cột layout (ví dụ: `width: 50%`).'],
          ['`vw` / `vh`', 'Khung nhìn', '1% chiều rộng hoặc chiều cao của cửa sổ trình duyệt (Viewport)', 'Banner trang chủ toàn màn hình (`height: 100vh`).'],
          ['`dvh` (Dynamic VH)', 'Khung nhìn', 'Tự co giãn khi thanh địa chỉ trên mobile xuất hiện/ẩn', 'Tránh lỗi giao diện bị che khuất trên Safari iOS / Chrome Android.']
        ]
      },
      callout: { type: 'tip', t: 'Vì sao dùng `rem` thay vì `px`? Khi người cao tuổi chỉnh tăng cỡ chữ hệ thống của trình duyệt, toàn bộ website dùng `rem` sẽ tự phóng to đều đặn, chuẩn tiếp cận a11y tuyệt đối!' }
    },

    {
      title: 'Hệ Thống Màu Sắc Hiện Đại: HEX, RGB/RGBA, HSL', kicker: 'FE02 · Section 02: Box Model & Box Sizing',
      table: {
        head: ['Hệ Màu', 'Cú Pháp Khai Báo', 'Đặc Điểm & Trực Giác Lập Trình'],
        rows: [
          ['HEX', '`#3b82f6` hoặc `#ffffff`', 'Mã hexa 6 ký tự gồm Red, Green, Blue. Ngắn gọn, phổ biến nhất trên Figma.'],
          ['RGB / RGBA', '`rgba(59, 130, 246, 0.8)`', '3 kênh Đỏ - Lục - Lam (0-255) kèm kênh Alpha (0-1) quy định độ trong suốt.'],
          ['HSL / HSLA', '`hsl(217deg, 91%, 60%)`', 'Hue (Góc màu 0-360°), Saturation (Độ bão hòa %), Lightness (Độ sáng %).'],
          ['Ưu điểm vượt trội của HSL', 'Dễ dàng tạo bảng màu Hover/Active', 'Để tạo màu hover đậm hơn một chút, bạn chỉ cần giảm Lightness từ `60%` xuống `50%` mà không cần tra mã màu mới!']
        ]
      },
      callout: { type: 'tip', t: 'Cú pháp CSS Color Level 4 hiện đại cho phép viết khoảng trắng tiện lợi: `rgb(59 130 246 / 80%)`.' }
    },

    {
      title: 'Nghệ Thuật Kiểu Chữ (Typography) Trong Giao Diện Web', kicker: 'FE02 · Section 02: Box Model & Box Sizing',
      badge: 'STYLING',
      code: {
        file: 'typography.css', lang: 'css', size: 'xs',
        src: `/* Nhúng phông chữ quốc tế hiện đại từ Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  /* Font Stack: Danh sách ưu tiên nếu máy người dùng chưa có phông */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1rem;       /* 16px */
  line-height: 1.6;      /* Chiều cao dòng thông thoáng, chống mỏi mắt */
  color: #1e293b;        /* Màu xám đen thẫm, dịu mắt hơn màu đen tuyền #000 */
  letter-spacing: -0.01em; /* Thu hẹp nhẹ khoảng cách ký tự giúp chữ sắc nét */
}

h1, h2, h3 {
  line-height: 1.25;     /* Tiêu đề chữ to nên để line-height thấp hơn */
  font-weight: 700;
  color: #0f172a;
}`
      }
    },

    {
      title: 'Biến Tùy Chỉnh CSS (CSS Custom Properties): Design System & Dark Mode', kicker: 'FE02 · Section 02: Box Model & Box Sizing',
      badge: 'DESIGN SYSTEM',
      code: {
        file: 'variables.css', lang: 'css', size: 'xs',
        src: `/* Khai báo biến toàn cục tại gốc :root */
:root {
  --primary-color: #3b82f6;
  --bg-color: #ffffff;
  --text-color: #0f172a;
  --card-bg: #f8fafc;
  --radius: 12px;
}

/* Tự động kích hoạt Dark Mode theo cài đặt hệ điều hành của người dùng */
@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #60a5fa;
    --bg-color: #0f172a;
    --text-color: #f8fafc;
    --card-bg: #1e293b;
  }
}

/* Áp dụng biến vào các thành phần giao diện */
.card {
  background-color: var(--card-bg);
  color: var(--text-color);
  border-radius: var(--radius);
  border: 1px solid var(--primary-color);
}`
      },
      callout: { type: 'tip', t: 'Chỉ với việc định nghĩa biến CSS tại `:root`, bạn có thể đổi toàn bộ màu sắc chủ đạo của hàng trăm trang web chỉ bằng 1 dòng code duy nhất!' }
    },

    {
      title: 'Câu Hỏi Trắc Nghiệm: Box Model & Kích Thước Phần Tử', badge: 'QUIZ',
      quiz: {
        q: 'Một thẻ <div> có khai báo CSS: `width: 300px; padding: 20px; border: 5px solid #000; box-sizing: content-box;`. Tổng chiều rộng thực tế của chiếc hộp này trên màn hình là bao nhiêu?',
        opts: [
          '300px',
          '325px',
          '350px',
          '250px'
        ],
        a: 2,
        why: 'Với content-box (mặc định), chiều rộng 300px chỉ áp dụng cho phần ruột content. Kích thước thật trên màn hình phải cộng thêm padding 2 bên (20px * 2 = 40px) và border 2 bên (5px * 2 = 10px). Tổng cộng: 300 + 40 + 10 = 350px!'
      }
    },

    /* ============================================================
       SECTION 03: HỆ THỐNG BỐ CỤC 1 CHIỀU: FLEXBOX
       ============================================================ */
    { kind: 'section', no: '03', title: 'Hệ Thống Bố Cục 1 Chiều: Flexbox', sub: 'Làm chủ công cụ căn chỉnh mạnh mẽ nhất: trục chính Main Axis, trục phụ Cross Axis và căn giữa thần thánh.' },

    {
      title: 'Flexbox — Cuộc Cách Mạng Dàn Trang 1 Chiều (1D)', kicker: 'FE02 · Section 03: Flexbox Layout',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        'Trước khi có Flexbox, lập trình viên phải chật vật với `float: left` và các thủ thuật clearfix hack.',
        '**Flexbox (Flexible Box Layout)** được sinh ra để:',
        '• Căn giữa hoàn hảo cả ngang lẫn dọc chỉ với 3 dòng code.',
        '• Tự động phân bổ khoảng trống đều đặn giữa các item.',
        '• Co giãn linh hoạt theo kích thước màn hình mà không bao giờ bị tràn vỡ.',
        '**Nguyên lý Cha - Con (Container & Items)**:',
        '• Đặt `display: flex;` trên **thẻ cha (Flex Container)**.',
        '• Các **thẻ con trực tiếp (Flex Items)** ngay lập tức trở thành các hộp linh hoạt xếp thành hàng ngang.'
      ],
      img: { src: 'flexbox-layout-axes.svg', cap: 'Bản đồ 2 trục tọa độ trong Flexbox: Main Axis vs Cross Axis', h: 360 }
    },

    {
      title: 'Hai Trục Tọa Độ Cốt Lõi: Main Axis & Cross Axis', kicker: 'FE02 · Section 03: Flexbox Layout',
      cards: [
        { icon: '➡️', h: 'Trục Chính (Main Axis)', p: 'Trục chạy theo hướng sắp xếp của các phần tử. Khi `flex-direction: row` (mặc định), trục chính nằm ngang từ trái sang phải. Căn chỉnh trên trục chính bằng `justify-content`.' },
        { icon: '⬇️', h: 'Trục Vuông Góc (Cross Axis)', p: 'Trục vuông góc 90° với trục chính. Khi trục chính nằm ngang, trục phụ sẽ chạy dọc từ trên xuống dưới. Căn chỉnh trên trục phụ bằng `align-items`.' },
        { icon: '🔄', h: 'flex-direction: column', p: 'Đổi hướng trục: Trục chính chuyển thành DỌC (từ trên xuống), trục phụ chuyển thành NGANG (từ trái sang). Mọi thuộc tính căn chỉnh đổi vai trò theo trục mới!' },
        { icon: '↩️', h: 'flex-wrap: wrap', p: 'Cho phép các phần tử con tự động rớt xuống dòng tiếp theo khi hàng ngang không còn đủ chỗ chứa (mặc định `nowrap` sẽ ép các item co lại).' }
      ],
      cols: 2
    },

    {
      title: 'Căn Chỉnh Dọc Trục Chính Với `justify-content`', kicker: 'FE02 · Section 03: Flexbox Layout',
      table: {
        head: ['Giá Trị justify-content', 'Cách Phân Bổ Khoảng Trống', 'Ứng Dụng Thực Tế Thường Gặp'],
        rows: [
          ['`flex-start` (Mặc định)', 'Dồn toàn bộ các phần tử về đầu trục chính', 'Danh sách thẻ tag bài viết.'],
          ['`flex-end`', 'Dồn toàn bộ các phần tử về cuối trục chính', 'Nút "Lưu" và "Hủy" ở góc phải modal popup.'],
          ['`center`', 'Tập trung toàn bộ phần tử vào chính giữa trục', 'Căn giữa logo, banner, form đăng nhập.'],
          ['`space-between`', 'Phần tử đầu sát mép trái, phần tử cuối sát mép phải, khoảng trống dồn vào giữa', '★ Navbar: Logo bên trái, nút đăng nhập bên phải!'],
          ['`space-around`', 'Khoảng trống chia đều quanh mỗi item (khoảng cách mép ngoài bằng 1/2 khoảng cách giữa 2 item)', 'Danh sách 3 icon mạng xã hội.'],
          ['`space-evenly`', 'Toàn bộ khoảng cách giữa các phần tử và mép ngoài đều bằng nhau chằn chặn', 'Bảng tính năng sản phẩm cân đối.']
        ]
      },
      callout: { type: 'tip', t: '`justify-content: space-between` là thuộc tính được sử dụng nhiều nhất trong thiết kế Header và Card Footer trên toàn thế giới!' }
    },

    {
      title: 'Căn Chỉnh Vuông Góc Trục Phụ Với `align-items`', kicker: 'FE02 · Section 03: Flexbox Layout',
      table: {
        head: ['Giá Trị align-items', 'Hành Vi Hiển Thị Của Flex Items', 'Ngữ Cảnh Ứng Dụng'],
        rows: [
          ['`stretch` (Mặc định)', 'Tất cả các item tự kéo dài chiều cao bằng với item cao nhất trong hàng', 'Các cột tin tức tự có chiều cao bằng nhau tuyệt đối!'],
          ['`center`', 'Căn giữa theo chiều dọc của container', 'Căn giữa icon và chữ nằm thẳng hàng trên cùng 1 dòng.'],
          ['`flex-start`', 'Dồn các item về phía trên đỉnh của trục phụ', 'Khi nội dung các cột không cần cao bằng nhau.'],
          ['`flex-end`', 'Dồn các item xuống đáy chân của trục phụ', 'Căn chân các biểu đồ cột.'],
          ['`baseline`', 'Căn thẳng hàng theo đường chân dòng chữ của từng phần tử', 'Khi các chữ có kích thước to nhỏ khác nhau nhưng muốn thẳng hàng ngang.']
        ]
      },
      callout: { type: 'tip', t: 'Bí kíp căn giữa tuyệt đối huyền thoại: Đặt `display: flex; justify-content: center; align-items: center;` trên thẻ cha!' }
    },

    {
      title: 'Thuộc Tính Của Flex Items: `flex-grow`, `flex-shrink` & `flex: 1`', kicker: 'FE02 · Section 03: Flexbox Layout',
      badge: 'LIVE CODING',
      code: {
        file: 'flex-items.css', lang: 'css', size: 'xs',
        src: `/* 1. flex-grow: Tỷ lệ nhận thêm khoảng trống thừa */
.search-input {
  flex-grow: 1; /* Tự phình to chiếm trọn không gian còn lại */
}

/* 2. flex-shrink: Tỷ lệ bị co lại khi thiếu diện tích */
.avatar {
  flex-shrink: 0; /* KHÔNG BAO GIỜ bị bẹp méo khi màn hình thu nhỏ */
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

/* 3. Viết tắt thần thánh: flex: 1 */
/* Tương đương: flex: 1 1 0% (Tự động co giãn chia đều không gian) */
.col-equal {
  flex: 1;
}`
      },
      callout: { type: 'tip', t: 'Muốn một icon, ảnh avatar hoặc nút bấm không bao giờ bị trình duyệt bóp méo khi thu nhỏ màn hình? Hãy gán ngay: `flex-shrink: 0;`!' }
    },

    {
      title: 'Khoảng Cách Phần Tử Hiện Đại Với Thuộc Tính `gap`', kicker: 'FE02 · Section 03: Flexbox Layout',
      layout: 'split', ratio: '1.05fr .95fr',
      code: {
        file: 'gap-modern.css', lang: 'css', size: 'xs',
        src: `/* CÁCH HIỆN ĐẠI (Khuyên dùng ★) */
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px; /* Khoảng cách đều 24px cả ngang lẫn dọc! */
}

/* Hoặc tách riêng từng chiều */
.custom-layout {
  display: flex;
  row-gap: 32px;    /* Khoảng cách giữa các hàng */
  column-gap: 16px; /* Khoảng cách giữa các cột */
}`
      },
      bullets: [
        '**Lợi ích vượt trội của `gap` so với `margin` cũ**:',
        '• Thuộc tính `gap` chỉ tạo khoảng trống **ở giữa** các phần tử với nhau.',
        '• **Không tạo khoảng cách thừa ở mép ngoài cùng**: Bạn không còn phải viết các mẹo khổ sở như `:last-child { margin-right: 0; }` hay margin âm!',
        '• Hoạt động đồng nhất hoàn hảo trên cả Flexbox lẫn CSS Grid.'
      ]
    },

    {
      title: 'Xây Dựng Thanh Điều Hướng Header Hoàn Chỉnh Bằng Flexbox', kicker: 'FE02 · Section 03: Flexbox Layout',
      badge: 'LIVE CODING',
      code: {
        file: 'navbar-flex.css', lang: 'css', size: 'xs',
        src: `.navbar {
  display: flex;
  justify-content: space-between; /* Đẩy Logo sang trái, Actions sang phải */
  align-items: center;            /* Căn giữa theo trục dọc */
  padding: 16px 32px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.nav-links {
  display: flex;
  gap: 24px;                      /* Khoảng cách giữa các mục menu */
  list-style: none;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}`
      },
      callout: { type: 'tip', t: 'Chỉ với hơn 10 dòng CSS Flexbox, bạn đã có một Header chuyên nghiệp, co giãn mượt mà trên mọi kích cỡ màn hình!' }
    },

    /* ============================================================
       SECTION 04: CSS GRID (2D) & KỸ THUẬT ĐỊNH VỊ (POSITION)
       ============================================================ */
    { kind: 'section', no: '04', title: 'CSS Grid (2D) & Kỹ Thuật Định Vị (Position)', sub: 'Làm chủ lưới 2 chiều toàn năng, ma trận co giãn tự động và 5 trạng thái định vị phần tử.' },

    {
      title: 'CSS Grid — Hệ Thống Bố Cục Hai Chiều (2D) Toàn Năng', kicker: 'FE02 · Section 04: CSS Grid & Positioning',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        'Nếu Flexbox chuyên trị bố cục **1 chiều** (hoặc hàng ngang, hoặc cột dọc), thì **CSS Grid** là ông hoàng của bố cục **2 chiều** (đồng thời cả hàng và cột).',
        '**Đơn vị phân số mới: `fr` (Fractional Unit)**:',
        '• `1fr` đại diện cho 1 phần tỷ lệ của khoảng trống khả dụng.',
        '• `grid-template-columns: 1fr 2fr;` ➔ Cột thứ hai tự động rộng gấp đôi cột thứ nhất.',
        '**Hàm lặp lại: `repeat()`**:',
        '• Thay vì viết `1fr 1fr 1fr`, chỉ cần viết `repeat(3, 1fr)`.'
      ],
      img: { src: 'css-grid-matrix.svg', cap: 'Hệ thống bố cục ma trận 2 chiều CSS Grid toàn năng', h: 320 }
    },

    {
      title: 'Phép Thuật Co Giãn Tự Động: `repeat(auto-fit, minmax(280px, 1fr))`', kicker: 'FE02 · Section 04: CSS Grid & Positioning',
      badge: 'PRO TIP',
      code: {
        file: 'auto-grid.css', lang: 'css', size: 'xs',
        src: `/* Lưới sản phẩm / bài viết tự động Responsive KHÔNG CẦN MEDIA QUERY! */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}`
      },
      bullets: [
        '**Giải mã dòng code kỳ diệu**:',
        '1. **`minmax(280px, 1fr)`**: Mỗi thẻ card rộng tối thiểu 280px, tối đa 1fr.',
        '2. **`auto-fit`**: Trình duyệt tự đếm xem màn hình nhét vừa được bao nhiêu cột 280px.',
        '   • Màn hình lớn (Desktop): Tự chia thành 4 cột.',
        '   • Màn hình vừa (Tablet): Tự co lại thành 2 cột.',
        '   • Màn hình nhỏ (Mobile): Tự động xếp chồng thành 1 cột!',
        '✓ Không cần viết bất kỳ dòng Media Query `@media` nào mà giao diện vẫn responsive hoàn hảo!'
      ]
    },

    {
      title: 'Đặt Tên Vùng Bố Cục Trực Quan: `grid-template-areas`', kicker: 'FE02 · Section 04: CSS Grid & Positioning',
      badge: 'LAYOUT',
      code: {
        file: 'grid-areas.css', lang: 'css', size: 'xs',
        src: `.page-layout {
  display: grid;
  grid-template-areas:
    "header  header"
    "sidebar content"
    "footer  footer";
  grid-template-columns: 260px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 20px;
}

header  { grid-area: header; }
sidebar { grid-area: sidebar; }
main    { grid-area: content; }
footer  { grid-area: footer; }`
      },
      callout: { type: 'tip', t: 'Viết CSS giống hệt như đang vẽ sơ đồ bố cục trang web! Cực kỳ trực quan, dễ hình dung và bảo trì.' }
    },

    {
      title: '5 Kiểu Định Vị (position) Trong CSS Layout', kicker: 'FE02 · Section 04: CSS Grid & Positioning',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        'Thuộc tính `position` quyết định vị trí của phần tử so với luồng tài liệu thông thường (Normal Flow).',
        '**5 Giá trị cốt lõi**:',
        '1. **`static`**: Mặc định, theo luồng tài liệu, bỏ qua top/left.',
        '2. **`relative`**: Dịch chuyển so với chính vị trí gốc ban đầu của nó.',
        '3. **`absolute`**: Thoát ly khỏi luồng tài liệu, neo theo cha có `position` gần nhất.',
        '4. **`fixed`**: Neo cố định theo cửa sổ trình duyệt (Viewport), cuộn trang không trôi.',
        '5. **`sticky`**: Lai giữa relative và fixed, dính chặt khi cuộn chuột qua ngưỡng.'
      ],
      img: { src: 'css-positioning-types.svg', cap: 'Minh họa 5 kiểu định vị: static, relative, absolute, fixed và sticky', h: 360 }
    },

    {
      title: 'Bộ Đôi Bất Ly Thân: `position: relative` Bọc `absolute`', kicker: 'FE02 · Section 04: CSS Grid & Positioning',
      badge: 'PRO PATTERN',
      code: {
        file: 'badge-position.css', lang: 'css', size: 'xs',
        src: `/* Thẻ cha: Làm cột mốc neo tọa độ */
.product-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

/* Thẻ con: Huy hiệu SALE giảm giá gắn ở góc trên cùng bên phải */
.sale-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #ef4444; /* Màu đỏ */
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 10;
}`
      },
      callout: { type: 'warning', t: 'Lỗi kinh điển: Nếu quên đặt `position: relative` trên thẻ cha, thẻ con mang `absolute` sẽ nhảy tót ra ngoài màn hình và bám vào tận mép thẻ `<body>`!' }
    },

    {
      title: 'Ngữ Cảnh Xếp Chồng (Stacking Context) & Thuộc Tính `z-index`', kicker: 'FE02 · Section 04: CSS Grid & Positioning',
      cards: [
        { icon: '🥞', h: 'z-index Quyết Định Độ Cao Trục Z', p: 'Phần tử có `z-index` lớn hơn sẽ nằm đè lên trên phần tử có `z-index` nhỏ hơn khi chúng bị đè lấn tọa độ lên nhau.' },
        { icon: '⚠️', h: 'Điều Kiện Bắt Buộc Của z-index', p: 'Thuộc tính `z-index` CHỈ HOẠT ĐỘNG trên các phần tử đã được khai báo `position` (khác `static`), ví dụ relative, absolute, fixed, sticky.' },
        { icon: '🏢', h: 'Ngữ Cảnh Xếp Chồng (Stacking Context)', p: 'Các phần tử con bị giới hạn bởi độ cao của cha. Nếu cha có `z-index: 1`, dù con có đặt `z-index: 9999` cũng không bao giờ ngoi lên trên được một phần tử hàng xóm có `z-index: 2`!' },
        { icon: '📐', h: 'Quy Chuẩn Thang Đo z-index', p: 'Dropdown menu: 100 ➔ Fixed Navbar: 500 ➔ Modal Overlay: 1000 ➔ Toast Notification: 2000. Tránh gõ bừa `z-index: 999999`!' }
      ],
      cols: 2
    },

    {
      title: '`position: sticky`: Thanh Header & Mục Lục Dính Khi Cuộn', kicker: 'FE02 · Section 04: CSS Grid & Positioning',
      badge: 'UX PATTERN',
      code: {
        file: 'sticky-header.css', lang: 'css', size: 'xs',
        src: `/* 1. Thanh điều hướng dính chặt khi cuộn trang */
.header-sticky {
  position: sticky;
  top: 0;           /* BẮT BUỘC phải có ngưỡng tọa độ top/bottom */
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px); /* Kính mờ siêu đẹp */
}

/* 2. Mục lục bài viết (Table of Contents) dính ở sidebar */
.table-of-contents {
  position: sticky;
  top: 80px;        /* Cách mép trên 80px để không đè vào header */
}`
      },
      callout: { type: 'tip', t: 'Lưu ý sống còn với `sticky`: Nếu bất kỳ thẻ cha nào bên ngoài có thuộc tính `overflow: hidden`, phần tử sticky sẽ bị vô hiệu hóa hoàn toàn!' }
    },

    /* ============================================================
       SECTION 05: RESPONSIVE, HIỆU ỨNG & HOÀN THIỆN
       ============================================================ */
    { kind: 'section', no: '05', title: 'Responsive, Hiệu Ứng & Hoàn Thiện', sub: 'Tư duy Mobile-First, hàm toán học clamp(), chuyển động mượt mà và hiệu ứng kính mờ Glassmorphism.' },

    {
      title: 'Triết Lý Thiết Kế Đáp Ứng: Mobile-First vs Desktop-First', kicker: 'FE02 · Section 05: Responsive & Polish',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        'Hơn **65% lưu lượng truy cập web hiện nay đến từ thiết bị di động (Smartphones)**.',
        '**Tư duy Mobile-First (Chuẩn công nghiệp)**:',
        '• Viết CSS mặc định cho màn hình điện thoại nhỏ trước (giao diện 1 cột đơn giản, tối ưu tốc độ tải).',
        '• Sử dụng truy vấn `@media (min-width: ...)` để bổ sung layout nhiều cột khi màn hình mở rộng dần ra máy tính bảng và desktop.',
        '• Code sạch hơn, hiệu năng cao hơn và tối ưu chỉ số Google Mobile-Friendly.'
      ],
      img: { src: 'responsive-viewports.svg', cap: 'Thiết kế đáp ứng đa màn hình: Mobile ➔ Tablet ➔ Desktop Viewports', h: 320 }
    },

    {
      title: 'Bảng Breakpoints Media Queries Tiêu Chuẩn Quốc Tế', kicker: 'FE02 · Section 05: Responsive & Polish',
      table: {
        head: ['Breakpoint', 'Truy Vấn Media Query', 'Thiết Bị Mục Tiêu'],
        rows: [
          ['`< 640px`', 'Mặc định (Không cần media query)', 'Điện thoại di động (iPhone, Samsung Galaxy) — Layout 1 cột dọc'],
          ['`sm (≥ 640px)`', '`@media (min-width: 640px) { ... }`', 'Điện thoại xoay ngang, máy tính bảng cỡ nhỏ'],
          ['`md (≥ 768px)`', '`@media (min-width: 768px) { ... }`', 'Máy tính bảng iPad màn hình dọc — Bắt đầu chia 2 cột'],
          ['`lg (≥ 1024px)`', '`@media (min-width: 1024px) { ... }`', 'Laptop, Desktop phổ thông — Layout 3 hoặc 4 cột hoàn chỉnh'],
          ['`xl (≥ 1280px)`', '`@media (min-width: 1280px) { ... }`', 'Màn hình máy tính để bàn rộng, giới hạn max-width container']
        ]
      },
      callout: { type: 'tip', t: 'Không viết breakpoint theo tên từng đời máy iPhone! Hãy đặt breakpoint tại điểm mà nội dung giao diện của bạn bắt đầu có dấu hiệu bị chật chội hoặc gãy dòng.' }
    },

    {
      title: 'Hàm Toán Học Hiện Đại: `clamp()` Cho Kiểu Chữ Tự Co Giãn', kicker: 'FE02 · Section 05: Responsive & Polish',
      badge: 'MODERN MATH',
      code: {
        file: 'fluid-typography.css', lang: 'css', size: 'xs',
        src: `/* Cú pháp: clamp(Kích_thước_tối_thiểu, Giá_trị_lý_tưởng, Kích_thước_tối_đa) */
h1 {
  /* Điện thoại: chữ nhỏ nhất 2rem (32px)
     Màn hình vừa: tự co giãn theo 5% chiều rộng viewport (5vw)
     Màn hình lớn: chữ tối đa 3.5rem (56px) */
  font-size: clamp(2rem, 5vw + 1rem, 3.5rem);
}

.container {
  /* Chiều rộng co giãn linh hoạt nhưng không bao giờ tràn */
  width: clamp(320px, 90%, 1200px);
  margin-inline: auto; /* Căn giữa ngang chuẩn hiện đại */
}`
      },
      callout: { type: 'tip', t: 'Hàm `clamp()` giúp tiêu đề tự động phóng to thu nhỏ mượt mà theo từng pixel cửa sổ mà không cần viết hàng chục dòng Media Query ngắt quãng!' }
    },

    {
      title: 'Hiệu Ứng Chuyển Động Mượt Mà Với CSS `transition`', kicker: 'FE02 · Section 05: Responsive & Polish',
      badge: 'INTERACTION',
      code: {
        file: 'transitions.css', lang: 'css', size: 'xs',
        src: `.btn-primary {
  background-color: #3b82f6;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;

  /* Cú pháp: transition: thuộc_tính thời_gian hàm_gia_tốc */
  transition: background-color 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease;
}

/* Hiệu ứng khi rê chuột vào nút bấm */
.btn-primary:hover {
  background-color: #2563eb;               /* Đổi màu thẫm hơn */
  transform: translateY(-2px);             /* Nút nổi nhẹ lên trên 2px */
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35); /* Đổ bóng phát sáng */
}

/* Hiệu ứng khi nhấn giữ nút */
.btn-primary:active {
  transform: translateY(0);                /* Nút lún xuống như bấm nút thật */
}`
      }
    },

    {
      title: 'Biến Đổi Hình Học 2D (Transform) & Card Hover Micro-Interactions', kicker: 'FE02 · Section 05: Responsive & Polish',
      layout: 'split', ratio: '1.05fr .95fr',
      code: {
        file: 'card-hover.css', lang: 'css', size: 'xs',
        src: `.course-card {
  border-radius: 16px;
  overflow: hidden;
  background: #ffffff;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
}

.course-card img {
  width: 100%;
  transition: transform 0.5s ease;
}

/* Khi hover vào card: Card nhấc lên và ảnh zoom nhẹ */
.course-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.15);
}

.course-card:hover img {
  transform: scale(1.05); /* Phóng to ảnh 5% tinh tế */
}`
      },
      bullets: [
        '**4 Hàm Transform 2D cơ bản**:',
        '• `translate(x, y)`: Dịch chuyển vị trí mà không làm xáo trộn các phần tử xung quanh.',
        '• `scale(x, y)`: Phóng to hoặc thu nhỏ tỷ lệ kích thước.',
        '• `rotate(deg)`: Xoay góc (ví dụ: `rotate(45deg)`).',
        '• `skew(deg)`: Kéo nghiêng hình khối.',
        '**Hiệu năng GPU siêu tốc**: `transform` và `opacity` được card đồ họa GPU xử lý trực tiếp (Compositing), không kích hoạt Reflow giúp hiệu ứng mượt 60 FPS!'
      ]
    },

    {
      title: 'Hiệu Ứng Kính Mờ Đẳng Cấp (Glassmorphism): `backdrop-filter`', kicker: 'FE02 · Section 05: Responsive & Polish',
      badge: 'PREMIUM UI',
      code: {
        file: 'glassmorphism.css', lang: 'css', size: 'xs',
        src: `.glass-card {
  /* 1. Nền bán trong suốt màu trắng */
  background: rgba(255, 255, 255, 0.15);

  /* 2. Cứu tinh làm mờ nền phía sau (Hiệu ứng kính mờ macOS / iOS) */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px); /* Hỗ trợ Safari */

  /* 3. Viền phản quang mờ tạo chiều sâu */
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;

  /* 4. Đổ bóng mềm mại */
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  padding: 32px;
}`
      },
      callout: { type: 'tip', t: 'Hiệu ứng Glassmorphism giúp giao diện trang web trông hiện đại, sang trọng và thu hút người dùng ngay từ cái nhìn đầu tiên!' }
    },

    {
      title: 'Tổng Kết FE02: Sẵn Sàng Thổi Hồn Tương Tác Với JavaScript', kicker: 'FE02 · Tổng Kết Buổi Học',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**Những đỉnh cao kiến thức bạn đã chinh phục trong buổi FE02**:',
        '• Hiểu thấu đáo bản chất Box Model và luôn cài đặt `box-sizing: border-box`.',
        '• Làm chủ căn chỉnh trục chính và trục phụ với bố cục 1 chiều Flexbox.',
        '• Dàn dựng ma trận 2 chiều với CSS Grid và phép thuật `minmax(auto-fit)`.',
        '• Điều khiển chính xác vị trí với relative, absolute, fixed và sticky.',
        '• Tư duy Mobile-First và tạo hiệu ứng tương tác mượt mà chuẩn 60 FPS.',
        '**Bước sang buổi FE03 (JavaScript Front-end)**:',
        '• Giao diện đã lộng lẫy! Buổi tới chúng ta sẽ lập trình JavaScript để lắng nghe tiếng click chuột, bắt sự kiện, gọi API và cập nhật dữ liệu DOM sống động!'
      ],
      img: { src: 'js-logo.svg', cap: 'Sẵn sàng bước vào buổi FE03: Lập trình tương tác và kết nối API với JavaScript', h: 280 },
      callout: { type: 'tip', t: 'Bạn đã hoàn thành xuất sắc 2/3 nền tảng Front-end. Hãy luyện tập vẽ layout thật nhiều để biến các thuộc tính Flexbox và Grid thành kỹ năng phản xạ tự nhiên!' }
    }
  ],
  recap: [
    '**Box Model & border-box** loại bỏ hoàn toàn lỗi phình to kích thước ngoài khi thêm padding và border',
    '**Flexbox (1D Layout)** làm chủ trục Main Axis & Cross Axis với các thuộc tính `justify-content`, `align-items` và `gap`',
    '**CSS Grid (2D Layout)** kiến tạo lưới co giãn tự động không cần media query bằng `repeat(auto-fit, minmax(280px, 1fr))`',
    '**Kỹ Thuật Positioning** kết hợp `relative` làm mốc neo cho `absolute`, và `sticky` tạo navbar dính thông minh',
    '**Mobile-First Responsive** xây dựng giao diện tối ưu cho smartphone trước bằng media queries và hàm `clamp()`',
    'Sẵn sàng bước vào buổi **FE03: Lập Trình Tương Tác DOM & Kết Nối API Với JavaScript**!'
  ],
  exercises: [
    {
      level: 'warmup', time: 20, title: 'Thiết Lập CSS Reset Chuẩn & Box-Sizing Toàn Cục',
      desc: 'Tạo file styles.css chứa bộ quy tắc reset chuẩn hiện đại và khai báo biến CSS Custom Properties.',
      tasks: [
        'Khai báo quy tắc `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`',
        'Khai báo `:root` chứa bảng màu thương hiệu: `--primary`, `--text-main`, `--bg-page`, `--radius-md`',
        'Nhúng font chữ Inter từ Google Fonts và gán font-family cho thẻ body kèm line-height: 1.6',
        'Tạo 2 class màu nền sử dụng biến CSS và kiểm tra độ tương phản trên trình duyệt'
      ]
    },
    {
      level: 'core', time: 35, title: 'Xây Dựng Thanh Header & Navigation Bar Bằng Flexbox',
      desc: 'Dựng thanh menu đầu trang đáp ứng đầy đủ logo, các liên kết menu và nút hành động đăng nhập.',
      tasks: [
        'Sử dụng `display: flex; justify-content: space-between; align-items: center;` cho container header',
        'Dựng danh sách menu `<ul>` nằm ngang bằng Flexbox với khoảng cách `gap: 24px`',
        'Thêm hiệu ứng hover đổi màu và gạch chân animated cho các liên kết menu',
        'Thêm thuộc tính `position: sticky; top: 0; z-index: 100;` để header dính chặt khi cuộn trang',
        'Thêm hiệu ứng kính mờ `backdrop-filter: blur(10px)` cho header'
      ],
      solution: { file: 'navbar.css', lang: 'css', src: `.header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

.nav-links a {
  text-decoration: none;
  color: #334155;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #3b82f6;
}` }
    },
    {
      level: 'core', time: 35, title: 'Thiết Kế Lưới Card Bài Viết Co Giãn Tự Động Bằng CSS Grid',
      desc: 'Dựng ma trận hiển thị danh sách bài viết blog tự động chia cột responsive không dùng media query.',
      tasks: [
        'Tạo container `.grid-container` với `display: grid; gap: 24px;`',
        'Sử dụng công thức `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));`',
        'Tạo giao diện thẻ `.card` gồm ảnh bài viết, tag thể loại, tiêu đề `<h3>` và nút đọc tiếp',
        'Thêm hiệu ứng hover: Card nhấc nhẹ lên bằng `transform: translateY(-6px);` và đổ bóng mềm mại',
        'Co kéo thử kích thước cửa sổ trình duyệt để quan sát số lượng cột tự động thay đổi từ 4 cột sang 2 cột và 1 cột'
      ]
    },
    {
      level: 'challenge', time: 40, title: 'Dựng Giao Diện Dashboard Hoàn Chỉnh Bằng CSS Grid Areas',
      desc: 'Xây dựng layout quản trị hệ thống phức tạp với sidebar cố định, header và vùng nội dung chính.',
      tasks: [
        'Khai báo `grid-template-areas` với 3 vùng: header, sidebar, content',
        'Thiết lập tỷ lệ cột: `grid-template-columns: 260px 1fr;` và chiều cao `min-height: 100vh;`',
        'Sử dụng `position: relative` bọc `position: absolute` tạo huy hiệu số lượng thông báo mới ở icon chuông',
        'Viết Media Query `@media (max-width: 768px)` để trên màn hình điện thoại, sidebar tự động ẩn và header chiếm 100%'
      ]
    },
    {
      level: 'homework', time: 50, title: 'Hoàn Thiện Trang Đọc Bài Viết DevBlog Đầy Đủ Responsive',
      desc: 'Tạo trang chi tiết bài viết hoàn chỉnh áp dụng Flexbox, Typography, Media Queries và Glassmorphism.',
      tasks: [
        'Dựng layout bài viết 2 cột: cột trái là nội dung chính (70%), cột phải là sidebar bài viết liên quan (30%)',
        'Sử dụng `position: sticky; top: 100px;` cho mục lục bài viết ở sidebar',
        'Áp dụng hàm `clamp()` cho tiêu đề bài viết để tự động co giãn kích thước mượt mà',
        'Tạo nút "Back to Top" cố định ở góc dưới bên phải màn hình bằng `position: fixed`',
        'Kiểm tra giao diện trên cả 3 kích thước: Mobile (375px), Tablet (768px) và Desktop (1440px)'
      ]
    }
  ],
  project: {
    lead: '**Đồ án giai đoạn Front-end**: Hoàn thiện toàn bộ hệ thống tạo kiểu CSS3 hiện đại, linh hoạt và đáp ứng cho nền tảng DevBlog!',
    tasks: [
      'Xây dựng Design System đồng nhất với biến CSS Custom Properties',
      'Xây dựng Header và Navigation bar bằng Flexbox với hiệu ứng Glassmorphism',
      'Xây dựng lưới bài viết tự động responsive bằng CSS Grid minmax',
      'Tối ưu hóa trải nghiệm tương tác với Transitions và Transform 60 FPS'
    ],
    callout: { type: 'tip', t: 'Một giao diện được chăm chút tỉ mỉ về typography, khoảng cách và hiệu ứng chuyển động sẽ khiến người dùng mê mẩn ngay từ cái chạm đầu tiên!' }
  }
};
