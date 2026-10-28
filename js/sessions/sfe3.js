/* ============================================================
   SESSION FE03 — JavaScript Front-end: DOM, Events & Fetch API
   Mục tiêu: Thao tác cây DOM, bắt sự kiện người dùng,
             kết nối API bất đồng bộ với Fetch API & Async/Await,
             quản lý trạng thái giao diện UI states và CORS.
   ============================================================ */
SESSION_DATA['fe3'] = {
  intro: 'Chào mừng các bạn đến với Buổi FE03! Đây là buổi học bản lề kết nối thế giới Front-end và Back-end. Chúng ta sẽ dùng JavaScript để biến trang web tĩnh thành ứng dụng tương tác sống động, lắng nghe sự kiện người dùng và gọi dữ liệu từ API máy chủ Node.js.',
  agenda: [
    { min: 30, t: 'Môi Trường Trình Duyệt & Truy Vấn DOM', d: 'window, document, querySelector, querySelectorAll, closest, textContent' },
    { min: 35, t: 'Thao Tác Class & Render Giao Diện Động', d: 'classList, createElement, append, DocumentFragment, template literals' },
    { min: 40, t: 'Hệ Thống Sự Kiện & Event Delegation', d: 'addEventListener, e.target, e.preventDefault(), Capturing vs Bubbling' },
    { min: 40, t: 'Giao Tiếp Mạng: Fetch API & Async/Await', d: 'fetch(url, options), headers, JSON.stringify, res.ok, res.json(), try/catch' },
    { min: 35, t: 'Quản Lý UI States & Kết Nối Backend', d: 'Loading spinner, toast error, live search debounce, gắn JWT token' }
  ],
  slides: [
    /* ============================================================
       SECTION 01: MÔI TRƯỜNG TRÌNH DUYỆT & TRUY XUẤT DOM
       ============================================================ */
    { kind: 'section', no: '01', title: 'Môi Trường Trình Duyệt & Truy Xuất DOM', sub: 'Hiểu rõ đối tượng window, document, cơ chế Event Loop trên trình duyệt và phương pháp truy vấn phần tử hiện đại.' },

    {
      title: 'JavaScript Chạy Trên Trình Duyệt Như Thế Nào?', kicker: 'FE03 · Section 01: Browser & DOM',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        'Khác với môi trường Node.js (chuyên xử lý file, socket, database), **JavaScript trên trình duyệt có quyền truy cập vào hai đối tượng toàn cục khổng lồ**:',
        '• **`window` (BOM - Browser Object Model)**: Đại diện cho cửa sổ trình duyệt (kích thước `innerWidth`, lịch sử `history`, vị trí URL `location`, hộp thoại `alert`).',
        '• **`document` (DOM - Document Object Model)**: Cánh cổng dẫn vào cây phân cấp HTML của trang web.',
        '**Vòng lặp tương tác**:',
        'Lắng nghe hành động người dùng ➔ Chỉnh sửa các nút trên cây DOM ➔ Trình duyệt tự động vẽ lại điểm ảnh (Repaint) tức thì!'
      ],
      img: { src: 'mdn-js-runtime.svg', cap: 'Môi trường thực thi JavaScript: Call Stack, Web APIs, Event Loop và DOM (MDN)', h: 360 }
    },

    {
      title: 'Kiến Trúc Browser Runtime: Call Stack, Web APIs & Event Loop', kicker: 'FE03 · Section 01: Browser & DOM',
      cards: [
        { icon: '🥞', h: 'Call Stack (Ngăn xếp thực thi)', p: 'Cơ chế đơn luồng (Single-threaded): Tại một thời điểm, JavaScript chỉ thực thi đúng một dòng lệnh. Lệnh nào vào sau thì ra trước (LIFO).' },
        { icon: '🌐', h: 'Web APIs (Trình duyệt hỗ trợ)', p: 'Các tính năng được viết bằng C++ của trình duyệt chạy ngầm đa luồng: `fetch()`, `setTimeout()`, DOM Events, `localStorage`.' },
        { icon: '📬', h: 'Callback Queue & Microtask Queue', p: 'Nơi xếp hàng chờ của các hàm callback khi tác vụ ngầm hoàn thành. Microtask (Promise `.then`) có độ ưu tiên cao hơn Macrotask (`setTimeout`).' },
        { icon: '🔄', h: 'Event Loop (Người điều phối)', p: 'Liên tục kiểm tra: Khi nào Call Stack rỗng, Event Loop mới nhấc callback từ hàng đợi đẩy vào Call Stack để thực thi.' }
      ],
      cols: 2
    },

    {
      title: 'Cách Tải File Script Chuẩn: Tránh Chặn Phân Tích HTML', kicker: 'FE03 · Section 01: Browser & DOM',
      table: {
        head: ['Cách Nhúng Script', 'Hành Vi Phân Tích HTML', 'Hành Vi Tải File JS', 'Thời Điểm Chạy Mã Code'],
        rows: [
          ['`<script src="app.js">` (ở `<head>`)', '❌ Bị dừng ngay lập tức', 'Tải tuần tự đồng bộ', 'Chạy ngay ➔ DOM chưa dựng xong nên code bị lỗi `null`!'],
          ['`<script src="app.js">` (cuối `<body>`)', 'Dựng xong toàn bộ HTML', 'Bắt đầu tải JS sau cùng', 'Chạy sau khi có DOM (cách truyền thống)'],
          ['`<script src="app.js" async>`', 'Không bị chặn', 'Tải song song độc lập', 'Chạy ngay khi tải xong (không theo thứ tự file)'],
          ['`<script src="app.js" defer>`', 'Không bị chặn (Chạy song song)', 'Tải ngầm song song với HTML', '★ Chạy tuần tự ngay sau khi toàn bộ cây DOM đã hoàn thành!']
        ]
      },
      callout: { type: 'tip', t: 'Tiêu chuẩn vàng: Luôn đặt `<script src="app.js" defer></script>` bên trong thẻ `<head>` để trang web tải nhanh nhất và code không bị lỗi thiếu phần tử.' }
    },

    {
      title: 'Truy Vấn Phần Tử DOM Hiện Đại: `querySelector` vs `querySelectorAll`', kicker: 'FE03 · Section 01: Browser & DOM',
      badge: 'LIVE CODING',
      code: {
        file: 'dom-queries.js', lang: 'javascript', size: 'xs',
        src: `// 1. Lấy phần tử ĐẦU TIÊN khớp với CSS Selector
const headerTitle = document.querySelector('header h1');
const submitBtn   = document.querySelector('#btnSubmit');
const activeCard  = document.querySelector('.card.active');

// 2. Lấy TẤT CẢ các phần tử khớp (trả về danh sách NodeList)
const allButtons = document.querySelectorAll('.btn');
const postCards  = document.querySelectorAll('.post-card');

// Duyệt qua NodeList bằng forEach trực quan
allButtons.forEach((btn, index) => {
  btn.style.cursor = 'pointer';
});

// Chuyển đổi NodeList thành Array thuần để dùng map, filter
const cardArray = Array.from(postCards);`
      },
      bullets: [
        '**`querySelector(selector)`**: Dùng chính xác cú pháp CSS Selector mà bạn đã học ở CSS (id `#`, class `.`, thuộc tính `[name="..."]`). Trả về **`null`** nếu không tìm thấy.',
        '**`querySelectorAll(selector)`**: Luôn trả về một **`NodeList`** (danh sách chứa các phần tử hoặc rỗng nếu không có). Thay thế hoàn toàn cho `getElementById` hay `getElementsByClassName` cũ.'
      ]
    },

    {
      title: 'Tìm Kiếm Phần Tử Theo Mối Quan Hệ: `element.closest()` & Navigation', kicker: 'FE03 · Section 01: Browser & DOM',
      badge: 'DOM TRAVERSAL',
      code: {
        file: 'dom-traversal.js', lang: 'javascript', size: 'xs',
        src: `const deleteBtn = document.querySelector('.btn-delete');

// 1. element.closest(selector): Tìm ngược lên trên cây DOM để bắt thẻ cha khớp selector
// Cực kỳ hữu ích khi bạn bấm nút delete và muốn tìm thẻ <article> bao bọc nó!
const parentPost = deleteBtn.closest('.post-card');

// 2. Di chuyển ngang hàng anh em (Siblings)
const nextCard = parentPost.nextElementSibling;     // Phần tử kế tiếp
const prevCard = parentPost.previousElementSibling; // Phần tử đứng trước

// 3. Di chuyển cha - con (Parent - Children)
const parentContainer = parentPost.parentElement;   // Thẻ cha trực tiếp
const childElements   = parentPost.children;        // Danh sách các thẻ con trực tiếp`
      },
      callout: { type: 'tip', t: 'Phương thức `element.closest()` là "vũ khí bí mật" giúp bạn tìm ngược lên thẻ cha bất kỳ mà không cần phải gõ liên tiếp `parent.parent.parentElement`!' }
    },

    {
      title: 'So Sánh NodeList (Tĩnh) vs HTMLCollection (Sống)', kicker: 'FE03 · Section 01: Browser & DOM',
      table: {
        head: ['Đặc Điểm Phân Biệt', 'NodeList (Trả về từ querySelectorAll)', 'HTMLCollection (Trả về từ getElementsByTagName)'],
        rows: [
          ['Bản chất dữ liệu', 'Danh sách tĩnh (Static Snapshot)', 'Danh sách sống (Live Collection)'],
          ['Khi DOM thay đổi', 'Không tự động cập nhật khi có phần tử mới thêm vào DOM', 'Tự động cập nhật số lượng ngay lập tức'],
          ['Hàm hỗ trợ sẵn', 'Hỗ trợ sẵn hàm `.forEach()` tiện lợi', 'KHÔNG hỗ trợ `.forEach()`, phải ép kiểu sang mảng'],
          ['Lời khuyên kỹ thuật', '★ Khuyên dùng trong 100% dự án hiện đại', 'Cũ kỹ, dễ sinh lỗi bất ngờ do tính năng tự cập nhật ngầm']
        ]
      },
      callout: { type: 'tip', t: 'Mẹo chuyển sang mảng JavaScript thuần: `const items = [...document.querySelectorAll(\'.item\')];` để thoải mái dùng `.map()`, `.filter()`, `.reduce()`.' }
    },

    {
      title: 'Thay Đổi Nội Dung An Toàn: `textContent` vs `innerHTML` (Cảnh Báo XSS)', kicker: 'FE03 · Section 01: Browser & DOM',
      layout: 'split', ratio: '1.05fr .95fr',
      code: {
        file: 'content-security.js', lang: 'javascript', size: 'xs',
        src: `const greetingBox = document.querySelector('#greeting');
const userInput = '<img src=x onerror="alert(\'Bị hack XSS!\')">';

// ❌ NGUY HIỂM: Trình duyệt sẽ thực thi mã độc script trong thẻ img!
// greetingBox.innerHTML = userInput; // Lỗ hổng bảo mật nghiêm trọng!

// ✅ AN TOÀN TUYỆT ĐỐI: Trình duyệt coi toàn bộ chuỗi là chữ thông thường
greetingBox.textContent = userInput;
// Kết quả hiển thị đúng nguyên văn chuỗi chữ, không thực thi mã độc!`
      },
      bullets: [
        '**Lỗ hổng Cross-Site Scripting (XSS)**:',
        '• Nếu dùng `innerHTML` để chèn nội dung do người dùng gửi lên (như ô bình luận bài viết), hacker có thể chèn mã JS độc hại để đánh cắp JWT Token lưu trong trình duyệt!',
        '**Nguyên tắc phòng thủ**:',
        '• Chỉ dùng `textContent` khi cập nhật văn bản thuần.',
        '• Chỉ dùng `innerHTML` với các chuỗi HTML tĩnh do chính lập trình viên kiểm soát.'
      ]
    },

    {
      title: 'Thao Tác Thuộc Tính & Custom Data Attributes (`dataset`)', kicker: 'FE03 · Section 01: Browser & DOM',
      badge: 'ATTRIBUTES',
      code: {
        file: 'dataset.html & js', lang: 'html', size: 'xs',
        src: `<!-- Khai báo thuộc tính dữ liệu tùy biến data-* trong HTML -->
<button class="btn-like" data-post-id="108" data-liked="false">
  Thích Bài Viết
</button>

<script>
  const likeBtn = document.querySelector('.btn-like');

  // Đọc dữ liệu từ thuộc tính data-* thông qua đối tượng dataset
  console.log(likeBtn.dataset.postId); // In ra chuỗi "108"
  console.log(likeBtn.dataset.liked);  // In ra chuỗi "false"

  // Cập nhật lại giá trị động
  likeBtn.dataset.liked = "true";

  // Thao tác thuộc tính tiêu chuẩn khác
  likeBtn.setAttribute('disabled', 'true'); // Khóa nút bấm
  likeBtn.removeAttribute('disabled');      // Mở khóa nút bấm
</script>`
      },
      callout: { type: 'tip', t: 'Thuộc tính `data-*` là cầu nối hoàn hảo để gắn ID bài viết hoặc ID người dùng từ CSDL vào thẳng phần tử HTML trên giao diện.' }
    },

    /* ============================================================
       SECTION 02: TƯƠNG TÁC GIAO DIỆN & SINH PHẦN TỬ ĐỘNG
       ============================================================ */
    { kind: 'section', no: '02', title: 'Tương Tác Giao Diện & Sinh Phần Tử Động', sub: 'Thao tác classList chuyên nghiệp, chèn phần tử mới vào DOM và tối ưu hiệu năng không gây giật lag.' },

    {
      title: 'Thao Tác Class CSS Chuyên Nghiệp Với Đối Tượng `classList`', kicker: 'FE03 · Section 02: DOM Manipulation',
      table: {
        head: ['Phương Thức classList', 'Cú Pháp Thực Thi', 'Hành Vi Nghiệp Vụ', 'Ví Dụ Ứng Dụng'],
        rows: [
          ['`classList.add()`', '`el.classList.add(\'active\', \'show\')`', 'Thêm một hoặc nhiều class vào phần tử', 'Kích hoạt trạng thái mở menu dropdown.'],
          ['`classList.remove()`', '`el.classList.remove(\'loading\')`', 'Xóa bỏ class chỉ định khỏi phần tử', 'Tắt biểu tượng loading spinner khi đã tải xong dữ liệu.'],
          ['`classList.toggle()`', '`el.classList.toggle(\'dark-mode\')`', 'Đảo trạng thái: Chưa có thì thêm vào, có rồi thì xóa đi', 'Bấm nút chuyển đổi giao diện Sáng / Tối.'],
          ['`classList.contains()`', '`if (el.classList.contains(\'open\'))`', 'Kiểm tra phần tử có chứa class hay không (trả về true/false)', 'Kiểm tra modal popup có đang mở hay không.']
        ]
      },
      callout: { type: 'tip', t: 'Tránh dùng `element.className = "..."` vì lệnh này sẽ ghi đè xóa sạch toàn bộ các class cũ đang có của phần tử!' }
    },

    {
      title: 'Can Thiệp Kiểu Dáng (Style) Trực Tiếp & Biến CSS', kicker: 'FE03 · Section 02: DOM Manipulation',
      badge: 'STYLING JS',
      code: {
        file: 'dynamic-style.js', lang: 'javascript', size: 'xs',
        src: `const progressBar = document.querySelector('.progress-fill');

// 1. Can thiệp trực tiếp thuộc tính CSS (Tên thuộc tính viết kiểu camelCase)
progressBar.style.width = '75%';
progressBar.style.backgroundColor = '#10b981'; // background-color chuyển thành backgroundColor

// 2. Can thiệp biến CSS Custom Properties (Khuyên dùng ★)
// Đổi màu chủ đạo toàn bộ website theo lựa chọn của người dùng
document.documentElement.style.setProperty('--primary-color', '#ec4899');

// 3. Ẩn / Hiện phần tử linh hoạt
const banner = document.querySelector('#promo-banner');
banner.style.display = 'none';  // Ẩn đi
banner.style.display = 'block'; // Hiện lại`
      },
      callout: { type: 'tip', t: 'Quy tắc vàng: Hạn chế gán cứng style trực tiếp bằng JS. Hãy định nghĩa sẵn các class trong CSS (như `.is-hidden`, `.is-active`), sau đó dùng JS `classList.toggle()` để bật/tắt class sẽ sạch sẽ hơn rất nhiều!' }
    },

    {
      title: 'Tạo Mới & Chèn Phần Tử Vào Cây DOM Bằng Phương Thức Native', kicker: 'FE03 · Section 02: DOM Manipulation',
      badge: 'LIVE CODING',
      code: {
        file: 'create-node.js', lang: 'javascript', size: 'xs',
        src: `// Bước 1: Tạo mới thẻ HTML trong bộ nhớ (chưa hiển thị trên màn hình)
const newCard = document.createElement('div');
newCard.classList.add('post-card');

// Bước 2: Tạo nội dung cho thẻ
const title = document.createElement('h3');
title.textContent = 'Bài Viết Mới Xuất Bản';

const desc = document.createElement('p');
desc.textContent = 'Tìm hiểu về quy trình kết nối Front-end và Back-end REST API.';

// Bước 3: Ghép các thẻ con vào thẻ cha
newCard.append(title, desc); // append cho phép chèn nhiều thẻ cùng lúc

// Bước 4: Chèn chiếc card hoàn chỉnh vào vị trí mong muốn trên trang
const postContainer = document.querySelector('#post-list');
postContainer.appendChild(newCard); // Gắn vào cuối danh sách`
      }
    },

    {
      title: 'Các Phương Thức Chèn Node Linh Hoạt: `append`, `prepend`, `before`, `after`', kicker: 'FE03 · Section 02: DOM Manipulation',
      table: {
        head: ['Phương Thức', 'Vị Trí Chèn Phần Tử', 'Ví Dụ Nghiệp Vụ Thực Tế'],
        rows: [
          ['`parent.append(child)`', 'Chèn vào vị trí CUỐI CÙNG bên trong thẻ cha', 'Thêm bài viết mới vào cuối danh sách tin tức.'],
          ['`parent.prepend(child)`', 'Chèn vào vị trí ĐẦU TIÊN bên trong thẻ cha', 'Đưa thông báo khẩn cấp hoặc tin mới nhất lên trên đỉnh.'],
          ['`target.before(newEl)`', 'Chèn vào NGAY PHÍA TRƯỚC phần tử mục tiêu (cùng cấp anh em)', 'Chèn banner quảng cáo vào trước khối bài viết.'],
          ['`target.after(newEl)`', 'Chèn vào NGAY PHÍA SAU phần tử mục tiêu (cùng cấp anh em)', 'Hiển thị form trả lời bình luận ngay dưới comment hiện tại.'],
          ['`element.remove()`', 'XÓA BỎ hoàn toàn phần tử khỏi cây DOM', 'Bấm nút xóa bài viết ➔ phần tử biến mất khỏi giao diện tức thì.']
        ]
      },
      callout: { type: 'tip', t: 'Xóa phần tử siêu nhanh: Chỉ cần gọi `element.remove()`, không cần phải tìm thẻ cha rồi gọi `parent.removeChild(element)` như thời kỳ cũ!' }
    },

    {
      title: 'Tối Ưu Hóa Hiệu Năng: Tránh Hiện Tượng Reflow Bằng Template Literals', kicker: 'FE03 · Section 02: DOM Manipulation',
      badge: 'PERFORMANCE',
      code: {
        file: 'render-template.js', lang: 'javascript', size: 'xs',
        src: `const posts = [
  { id: 1, title: 'Nhập môn Node.js & Express', author: 'Minh', views: 250 },
  { id: 2, title: 'Làm chủ MySQL & Sequelize ORM', author: 'Lan', views: 420 },
  { id: 3, title: 'Bảo mật API với JWT & Bcrypt', author: 'Tuấn', views: 680 }
];

const container = document.querySelector('#posts-container');

// 🚀 TỐI ƯU: Nối chuỗi toàn bộ danh sách rồi gán 1 LẦN DUY NHẤT!
const htmlString = posts.map(post => \`
  <article class="post-card" data-id="\${post.id}">
    <h3>\${post.title}</h3>
    <div class="meta">
      <span>Tác giả: <b>\${post.author}</b></span>
      <span>Lượt xem: \${post.views}</span>
    </div>
    <button class="btn btn-delete">Xóa Bài</button>
  </article>
\`).join('');

container.innerHTML = htmlString; // Chỉ kích hoạt Reflow ĐÚNG 1 LẦN!`
      },
      callout: { type: 'tip', t: 'Nếu danh sách có 100 bài viết mà bạn gọi `appendChild()` 100 lần trong vòng lặp, trình duyệt sẽ phải tính toán bố cục lại 100 lần (Reflow Thrashing) gây giật màn hình!' }
    },

    {
      title: 'Thao Tác Với Biểu Mẫu Forms: Thu Thập & Xử Lý Dữ Liệu Input', kicker: 'FE03 · Section 02: DOM Manipulation',
      badge: 'FORM JS',
      code: {
        file: 'form-values.js', lang: 'javascript', size: 'xs',
        src: `const emailInput = document.querySelector('#userEmail');
const roleSelect = document.querySelector('#userRole');
const termsCheck = document.querySelector('#agreeTerms');

// 1. Đọc giá trị người dùng vừa gõ vào
console.log(emailInput.value); // Ví dụ: "admin@devblog.vn"
console.log(roleSelect.value); // Ví dụ: "admin"
console.log(termsCheck.checked); // Trả về true nếu đã tích chọn, false nếu chưa

// 2. Tự động xóa sạch khoảng trắng thừa ở 2 đầu
const cleanEmail = emailInput.value.trim();

// 3. Tự động focus vào ô nhập liệu
emailInput.focus();

// 4. Xóa trắng form sau khi gửi thành công
document.querySelector('#registerForm').reset();`
      }
    },

    {
      title: 'Câu Hỏi Trắc Nghiệm: Thao Tác DOM & Bảo Mật', badge: 'QUIZ',
      quiz: {
        q: 'Để hiển thị tên người dùng nhận được từ ô nhập liệu ra giao diện một cách an toàn nhất, tránh hoàn toàn nguy cơ bị tấn công XSS, lập trình viên nên sử dụng phương thức nào?',
        opts: [
          'element.innerHTML = userName;',
          'element.textContent = userName;',
          'document.write(userName);',
          'element.insertAdjacentHTML(\'beforeend\', userName);'
        ],
        a: 1,
        why: 'Thuộc tính textContent coi toàn bộ chuỗi đưa vào là ký tự văn bản thuần túy (Plain Text), tự động mã hóa các ký tự đặc biệt như <, > thành thực thể an toàn, do đó triệt tiêu hoàn toàn khả năng thực thi mã JavaScript độc hại của hacker.'
      }
    },

    /* ============================================================
       SECTION 03: HỆ THỐNG SỰ KIỆN & LUỒNG SỰ KIỆN TRÌNH DUYỆT
       ============================================================ */
    { kind: 'section', no: '03', title: 'Hệ Thống Sự Kiện & Luồng Sự Kiện', sub: 'Làm chủ cơ chế Event Listener, ngăn chặn hành vi mặc định và kỹ thuật Event Delegation đỉnh cao.' },

    {
      title: 'Cơ Chế Lắng Nghe Sự Kiện: Phương Thức `addEventListener`', kicker: 'FE03 · Section 03: Events & Delegation',
      layout: 'split', ratio: '1.05fr .95fr',
      code: {
        file: 'event-listener.js', lang: 'javascript', size: 'xs',
        src: `const saveBtn = document.querySelector('#btnSave');

// Cú pháp: element.addEventListener(tên_sự_kiện, hàm_callback, options)
saveBtn.addEventListener('click', function(event) {
  console.log('Nút Lưu Đã Được Bấm!');
  console.log('Tọa độ click X:', event.clientX);
  console.log('Tọa độ click Y:', event.clientY);
});

// Có thể gắn NHIỀU listener khác nhau cho cùng 1 phần tử
saveBtn.addEventListener('click', () => {
  saveBtn.classList.add('btn-clicked');
});`
      },
      bullets: [
        '**Tại sao không dùng thuộc tính inline `onclick="..."` trong HTML?**',
        '• Thuộc tính inline làm trộn lẫn mã logic JS vào cấu trúc HTML.',
        '• Chỉ gán được duy nhất 1 hàm, hàm sau sẽ ghi đè hàm trước.',
        '**`addEventListener` là chuẩn mực hiện đại**:',
        '• Tách biệt hoàn toàn mã logic ra file JS riêng.',
        '• Hỗ trợ gắn không giới hạn số lượng hàm xử lý.',
        '• Hỗ trợ gỡ bỏ listener khi không cần dùng nữa (`removeEventListener`).'
      ]
    },

    {
      title: 'Khảo Sát Đối Tượng Sự Kiện (`Event Object`): Thuộc Tính `e.target`', kicker: 'FE03 · Section 03: Events & Delegation',
      cards: [
        { icon: '🎯', h: 'e.target (Tâm điểm click thật)', p: 'Đại diện cho phần tử THỰC TẾ mà con trỏ chuột người dùng đã click trúng (ví dụ: click trúng thẻ `<i>` icon nằm bên trong nút bấm).' },
        { icon: '🏛️', h: 'e.currentTarget (Chủ nhân listener)', p: 'Đại diện cho phần tử mà bạn đã gắn hàm `addEventListener` (ví dụ: chính là thẻ `<button>` bao ngoài).' },
        { icon: '⌨️', h: 'e.key & e.code', p: 'Cho các sự kiện bàn phím: `e.key` trả về ký tự được gõ (như "Enter", "Escape", "a"); `e.code` trả về mã phím vật lý ("KeyA", "Space").' },
        { icon: '🛑', h: 'e.preventDefault()', p: 'Ngăn chặn hành vi mặc định của trình duyệt: Ngăn form tự reload trang web, ngăn thẻ link `<a>` tự nhảy trang.' }
      ],
      cols: 2
    },

    {
      title: 'Ngăn Chặn Hành Vi Mặc Định Của Trình Duyệt: `e.preventDefault()`', kicker: 'FE03 · Section 03: Events & Delegation',
      badge: 'CRITICAL',
      code: {
        file: 'prevent-default.js', lang: 'javascript', size: 'xs',
        src: `const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', function(e) {
  // 🚨 BẮT BUỘC: Ngăn trình duyệt tự động gửi GET/POST và reload trắng trang!
  e.preventDefault();

  console.log('Đã chặn reload trang thành công!');

  // Lấy dữ liệu an toàn để chuẩn bị gọi API bằng Fetch
  const email = document.querySelector('#email').value;
  const pass  = document.querySelector('#password').value;

  console.log('Sẵn sàng gửi dữ liệu ngầm lên server:', { email, pass });
});`
      },
      callout: { type: 'tip', t: '100% các ứng dụng Web hiện đại (Single Page Application) đều sử dụng `e.preventDefault()` trên sự kiện submit form để giữ trải nghiệm mượt mà không bị chớp giật màn hình!' }
    },

    {
      title: 'Luồng Sự Kiện Trình Duyệt: 3 Giai Đoạn Hoạt Động', kicker: 'FE03 · Section 03: Events & Delegation',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        'Khi một sự kiện xảy ra (ví dụ: click vào nút bấm trong thẻ bài viết), sự kiện không chỉ diễn ra tại nút bấm mà đi qua một hành trình 3 giai đoạn:',
        '1. **Capturing Phase (Đi xuống)**: Sự kiện xuất phát từ đỉnh cao nhất `window` ➔ `document` ➔ `<html>` ➔ `<body>` đi xuống dần tới nút bấm.',
        '2. **Target Phase (Chạm đích)**: Sự kiện chạm tới chính xác phần tử bị click.',
        '3. **Bubbling Phase (Nổi bọt đi lên)**: Sau khi kích hoạt tại đích, sự kiện tự động **nổi bọt ngược lên trên** qua các thẻ cha ➔ `<body>` ➔ `<html>` ➔ `window`!'
      ],
      img: { src: 'event-flow-phases.svg', cap: '3 Giai đoạn luồng sự kiện W3C: Capturing Phase, Target Phase và Bubbling Phase', h: 360 }
    },

    {
      title: 'Kỹ Thuật Ủy Quyền Sự Kiện (Event Delegation) Bắt Buộc Phải Biết', kicker: 'FE03 · Section 03: Events & Delegation',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**Bài toán nhức nhối**:',
        '• Bạn có danh sách 1000 sản phẩm. Nếu dùng vòng lặp gắn 1000 event listener click cho từng nút Delete, bộ nhớ RAM sẽ bị ngốn nặng!',
        '• Khi gọi API tải thêm 10 sản phẩm mới, các nút Delete mới sinh ra **sẽ không hoạt động** vì chưa được gắn listener!',
        '**Giải pháp Event Delegation thần thánh**:',
        '• Nhờ cơ chế **Event Bubbling**, mọi cú click ở phần tử con đều nổi bọt lên thẻ cha `<ul>`.',
        '• **Chỉ cần gắn duy nhất 1 Event Listener tại thẻ cha `<ul>`**!',
        '• Dùng `e.target.closest(\'.btn-delete\')` để bắt trúng nút bị click.'
      ],
      img: { src: 'event-delegation-flow.svg', cap: 'Kỹ thuật Event Delegation: Duy nhất 1 listener ở thẻ cha phục vụ toàn bộ con cháu', h: 360 }
    },

    {
      title: 'Mẫu Code Event Delegation Chuẩn Cho Danh Sách Động', kicker: 'FE03 · Section 03: Events & Delegation',
      badge: 'PRO PATTERN',
      code: {
        file: 'event-delegation.js', lang: 'javascript', size: 'xs',
        src: `const postList = document.querySelector('#postList');

// Gắn DUY NHẤT 1 listener trên thẻ cha #postList
postList.addEventListener('click', function(e) {
  // Kiểm tra xem phần tử bị click có phải nút Xóa hay không
  const deleteBtn = e.target.closest('.btn-delete');
  if (!deleteBtn) return; // Nếu click chỗ khác thì bỏ qua

  // Tìm thẻ bài viết cha chứa nút xóa đó
  const postItem = deleteBtn.closest('.post-card');
  const postId = postItem.dataset.id;

  if (confirm(\`Bạn có chắc chắn muốn xóa bài viết ID: \${postId}?\`)) {
    // 1. Gọi API gửi request DELETE lên server
    // 2. Xóa thẻ khỏi giao diện
    postItem.remove();
    console.log(\`✅ Đã xóa thành công bài viết ID: \${postId}\`);
  }
});`
      },
      callout: { type: 'tip', t: 'Dù sau này bạn có thêm hàng nghìn bài viết mới động bằng JS, nút xóa của các bài viết mới vẫn tự động hoạt động hoàn hảo 100% mà không cần gắn lại listener!' }
    },

    {
      title: 'Kỹ Thuật Tối Ưu Debounce Cho Ô Tìm Kiếm Thời Gian Thực (Live Search)', kicker: 'FE03 · Section 03: Events & Delegation',
      badge: 'OPTIMIZATION',
      code: {
        file: 'debounce.js', lang: 'javascript', size: 'xs',
        src: `// Hàm trì hoãn Debounce: Chỉ chạy hàm khi người dùng ngừng gõ phím sau N mili-giây
function debounce(fn, delay = 400) {
  let timerId;
  return function(...args) {
    clearTimeout(timerId); // Xóa bộ đếm cũ nếu người dùng vẫn đang gõ tiếp
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const searchInput = document.querySelector('#search');

// Áp dụng: Chỉ gọi API tìm kiếm khi người dùng đã dừng gõ 500ms
searchInput.addEventListener('input', debounce(function(e) {
  const query = e.target.value.trim();
  if (query.length >= 2) {
    console.log(\`🔍 Đang gọi API tìm kiếm từ khóa: "\${query}"...\`);
    // Gọi fetch('/api/v1/posts?q=' + query)
  }
}, 500));`
      },
      callout: { type: 'tip', t: 'Không có Debounce: Người dùng gõ từ "javascript" (10 ký tự) sẽ bắn 10 requests lên server gây nghẽn mạng. Có Debounce: Chỉ bắn đúng 1 request duy nhất khi gõ xong!' }
    },

    /* ============================================================
       SECTION 04: LƯU TRỮ PHÍA TRÌNH DUYỆT & GIAO TIẾP FETCH API
       ============================================================ */
    { kind: 'section', no: '04', title: 'Lưu Trữ Phía Client & Giao Tiếp Fetch API', sub: 'Lưu session an toàn với localStorage và làm chủ Fetch API bất đồng bộ kết nối Back-end Node.js.' },

    {
      title: 'Tổng Quan Các Cơ Chế Lưu Trữ Phía Trình Duyệt', kicker: 'FE03 · Section 04: Storage & Fetch API',
      table: {
        head: ['Cơ Chế Lưu Trữ', 'Dung Lượng Tối Đa', 'Vòng Đời Dữ Liệu', 'Tự Động Đính Kèm HTTP Request?'],
        rows: [
          ['`localStorage`', '~5MB - 10MB', 'Lưu vĩnh viễn (kể cả khi tắt trình duyệt / tắt máy)', 'KHÔNG (Phải tự dùng JavaScript lấy ra)'],
          ['`sessionStorage`', '~5MB', 'Mất ngay khi đóng tab trình duyệt hiện tại', 'KHÔNG'],
          ['`Cookies`', '~4KB (Rất nhỏ)', 'Có thời gian hết hạn cụ thể (Expires/Max-Age)', 'CÓ (Tự động đính kèm lên header của mọi request)']
        ]
      },
      callout: { type: 'tip', t: 'Thường dùng `localStorage` để lưu: Theme giao diện Sáng/Tối, ngôn ngữ ưa thích, hoặc thông tin hiển thị cơ bản của người dùng sau khi đăng nhập.' }
    },

    {
      title: 'Thao Tác `localStorage` Kết Hợp Chuyển Đổi JSON Chuẩn Chỉ', kicker: 'FE03 · Section 04: Storage & Fetch API',
      badge: 'STORAGE API',
      code: {
        file: 'storage-helper.js', lang: 'javascript', size: 'xs',
        src: `// Lưu ý quan trọng: localStorage CHỈ LƯU ĐƯỢC CHUỖI VĂN BẢN (String)!
const currentUser = { id: 1, name: 'Nguyễn Văn A', role: 'admin' };

// 1. Lưu Object: Bắt buộc chuyển thành chuỗi JSON
localStorage.setItem('user', JSON.stringify(currentUser));

// 2. Đọc Object: Lấy chuỗi ra và giải mã JSON.parse()
const storedUserStr = localStorage.getItem('user');
if (storedUserStr) {
  const user = JSON.parse(storedUserStr);
  console.log('Xin chào:', user.name);
}

// 3. Xóa dữ liệu khi người dùng bấm Đăng Xuất (Logout)
localStorage.removeItem('user');
localStorage.removeItem('accessToken');

// 4. Xóa sạch toàn bộ bộ nhớ của trang web
localStorage.clear();`
      }
    },

    {
      title: 'Vòng Đời Yêu Cầu - Phản Hồi Của Fetch API', kicker: 'FE03 · Section 04: Storage & Fetch API',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**`fetch()` là hàm bất đồng bộ native** được tích hợp sẵn trong mọi trình duyệt hiện đại (thay thế thư viện cồng kềnh jQuery Ajax hay Axios cho các tác vụ cơ bản).',
        '**Vòng đời 4 giai đoạn**:',
        '1. Gửi HTTP Request tới máy chủ Back-end.',
        '2. Nhận gói tin phản hồi đầu tiên (Headers & Status Code).',
        '3. Kiểm tra tính hợp lệ qua thuộc tính `response.ok` (Status 200-299).',
        '4. Phân tích gói tin thân (Parse Body): Gọi `await response.json()` để chuyển chuỗi JSON thành JavaScript Object.'
      ],
      img: { src: 'fetch-request-lifecycle.svg', cap: 'Vòng đời xử lý HTTP Request của Fetch API: Từ gửi yêu cầu tới phân tích JSON', h: 360 }
    },

    {
      title: 'Cú Pháp Bất Đồng Bộ Hiện Đại: `async / await` & Kiểm Tra `res.ok`', kicker: 'FE03 · Section 04: Storage & Fetch API',
      badge: 'ASYNC AWAIT',
      code: {
        file: 'fetch-get.js', lang: 'javascript', size: 'xs',
        src: `// Hàm lấy danh sách bài viết từ server Node.js
async function loadPosts() {
  try {
    const res = await fetch('http://localhost:3000/api/v1/posts');

    // 🚨 BẮT BUỘC: Kiểm tra mã trạng thái HTTP có nằm trong dải 200-299 hay không
    if (!res.ok) {
      throw new Error(\`Máy chủ trả về mã lỗi: \${res.status} (\${res.statusText})\`);
    }

    // Giải mã luồng dữ liệu JSON bất đồng bộ
    const result = await res.json();
    console.log('✅ Dữ liệu bài viết nhận về:', result.data);

    // Gọi hàm render ra màn hình
    renderPostList(result.data);

  } catch (error) {
    console.error('❌ Lỗi kết nối mạng hoặc lỗi server:', error.message);
    showErrorMessage('Không thể tải bài viết. Vui lòng kiểm tra lại kết nối mạng!');
  }
}`
      },
      callout: { type: 'warning', t: 'Lỗi tai hại của người mới: `fetch()` KHÔNG tự ném lỗi (reject Promise) khi server trả về 404 Not Found hay 500 Server Error! Bạn BẮT BUỘC phải tự kiểm tra điều kiện `if (!res.ok)`!' }
    },

    {
      title: 'Gửi Request Tạo Mới: `fetch()` Phương Thức POST Kèm JSON Body', kicker: 'FE03 · Section 04: Storage & Fetch API',
      badge: 'POST REQUEST',
      code: {
        file: 'fetch-post.js', lang: 'javascript', size: 'xs',
        src: `async function createNewPost(postData) {
  try {
    const res = await fetch('http://localhost:3000/api/v1/posts', {
      method: 'POST',
      headers: {
        // Bắt buộc khai báo định dạng nội dung gửi đi là JSON
        'Content-Type': 'application/json',
        // Gắn kèm Bearer Token nếu API yêu cầu xác thực
        'Authorization': \`Bearer \${localStorage.getItem('token')}\`
      },
      // Đóng gói JavaScript Object thành chuỗi JSON
      body: JSON.stringify(postData)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(\`Tạo bài thất bại: \${data.message || 'Lỗi không xác định'}\`);
      return;
    }

    alert('🎉 Tạo bài viết mới thành công!');
    window.location.href = '/blog.html'; // Chuyển trang

  } catch (err) {
    console.error('Lỗi khi gửi bài viết:', err);
  }
}`
      }
    },

    {
      title: 'Xử Lý Ngoại Lệ Mạng: Khối `try ... catch ... finally` Toàn Diện', kicker: 'FE03 · Section 04: Storage & Fetch API',
      cards: [
        { icon: '🟢', h: 'Khối try { ... }', p: 'Chứa toàn bộ các dòng lệnh gọi fetch và phân tích dữ liệu. Nếu có bất kỳ lỗi mạng hoặc điều kiện !res.ok, chương trình sẽ lập tức nhảy sang khối catch.' },
        { icon: '🔴', h: 'Khối catch (error) { ... }', p: 'Tiếp nhận đối tượng lỗi, ghi log hệ thống bằng `console.error` và hiển thị thông báo thân thiện với người dùng (thông báo Toast hoặc thanh banner đỏ).' },
        { icon: '⚪', h: 'Khối finally { ... } (Sống còn)', p: 'Khối lệnh **LUÔN LUÔN ĐƯỢC CHẠY** dù thành công hay thất bại. Nơi lý tưởng nhất để: Tắt biểu tượng xoay Loading Spinner và mở khóa lại nút bấm submit!' },
        { icon: '🛡️', h: 'Trải Nghiệm Phòng Thủ', p: 'Không bao giờ để ứng dụng bị "treo đơ" ở trạng thái loading vô tận khi server bị sập hoặc đứt mạng!' }
      ],
      cols: 2
    },

    /* ============================================================
       SECTION 05: QUẢN LÝ TRẠNG THÁI GIAO DIỆN & KẾT NỐI BACKEND
       ============================================================ */
    { kind: 'section', no: '05', title: 'Quản Lý UI States & Kết Nối Backend', sub: 'Làm chủ 5 trạng thái giao diện, xử lý lỗi CORS và hoàn thiện bức tranh toàn cảnh Fullstack.' },

    {
      title: 'Quản Lý 5 Trạng Thái Giao Diện (UI States) Chuẩn Chuyên Nghiệp', kicker: 'FE03 · Section 05: Integration & Wrap-up',
      table: {
        head: ['Trạng Thái Giao Diện', 'Dấu Hiệu Nhận Biết', 'Hành Vi Mã Nguồn Front-End Cần Làm'],
        rows: [
          ['1. Idle (Nghỉ)', 'Chưa có tương tác gì', 'Hiển thị nút bấm và ô form bình thường.'],
          ['2. Loading (Đang tải)', 'Đang đợi gói tin từ server', 'Hiện xoay spinner, làm mờ container, vô hiệu hóa `button.disabled = true` để chống người dùng bấm đúp 2 lần.'],
          ['3. Success (Thành công)', 'Server trả về 200/201', 'Hiển thị dữ liệu, hiển thị Toast xanh lá "Thành công!", reset form.'],
          ['4. Error (Có lỗi)', 'Mất mạng hoặc server trả về 4xx/5xx', 'Hiện thông báo đỏ giải thích nguyên nhân, có nút "Thử lại" (Retry).'],
          ['5. Empty (Trống rỗng)', 'Mảng dữ liệu trả về rỗng (`data.length === 0`)', 'Hiển thị hình minh họa vui vẻ kèm dòng chữ: "Chưa có bài viết nào. Hãy là người đầu tiên đăng bài!"']
        ]
      },
      callout: { type: 'tip', t: 'Một lập trình viên nghiệp dư chỉ code trạng thái Success. Một Kỹ sư chuyên nghiệp luôn chuẩn bị kỹ lưỡng cả 5 trạng thái để trải nghiệm người dùng luôn hoàn hảo!' }
    },

    {
      title: 'Bí Mật Lỗi CORS: Nỗi Ám Ảnh Của Lập Trình Viên Front-End', kicker: 'FE03 · Section 05: Integration & Wrap-up',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**Lỗi kinh điển trên Console**: `Access to fetch at "http://localhost:3000" from origin "http://127.0.0.1:5500" has been blocked by CORS policy!`',
        '**Nguyên nhân gốc rễ**:',
        '• Cơ chế an ninh bảo vệ người dùng của trình duyệt: **Same-Origin Policy (Chính sách cùng nguồn gốc)**.',
        '• Hai trang web được coi là cùng nguồn khi có chung cả 3 yếu tố: **Giao thức (http/https)**, **Tên miền (Domain)** và **Cổng (Port)**.',
        '• Front-end chạy cổng `5500`, Back-end chạy cổng `3000` ➔ Trình duyệt tự chặn phản hồi!',
        '**Cách giải quyết triệt để**:',
        '• Bật cấu hình CORS tại máy chủ Node.js Back-end bằng thư viện `cors` (`app.use(cors())`). Front-end KHÔNG THỂ tự sửa lỗi này bằng code JS thuần!'
      ],
      img: { src: 'mdn-cors-overview.svg', cap: 'Cơ chế CORS: Trình duyệt gửi Preflight OPTIONS kiểm tra quyền truy cập nguồn khác', h: 360 }
    },

    {
      title: 'Toàn Cảnh Ứng Dụng Web: Luồng Dữ Liệu Khép Kín Front-End & Back-End', kicker: 'FE03 · Section 05: Integration & Wrap-up',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**Bức tranh tổng thể hoàn mỹ**:',
        '1. **Người dùng** gõ email/mật khẩu vào Form HTML5 và bấm Đăng Nhập.',
        '2. **JavaScript Front-end** bắt sự kiện `submit`, gọi `e.preventDefault()`, kiểm tra dữ liệu và gọi `fetch()` gửi chuỗi JSON lên máy chủ.',
        '3. **Node.js Express Back-end** tiếp nhận request, kiểm tra mật khẩu bằng `bcrypt`, tạo chuỗi `JWT Token` và trả về JSON `200 OK`.',
        '4. **Front-end** nhận được Token ➔ lưu vào `localStorage` ➔ cập nhật trạng thái "Xin chào Admin" lên cây DOM tức thì!',
        '5. Hai thế giới tách rời đã hòa làm một thông qua bản hợp đồng dữ liệu RESTful API!'
      ],
      img: { src: 'client-server-model.svg', cap: 'Mô hình luồng dữ liệu khép kín giữa Front-end Client và Node.js REST API Server', h: 360 }
    },

    {
      title: '10 Lỗi Kinh Điển Thường Gặp Của Người Mới Học JavaScript Front-End', kicker: 'FE03 · Section 05: Integration & Wrap-up',
      table: {
        head: ['Lỗi Thường Gặp', 'Biểu Hiện Trên Console', 'Nguyên Nhân & Cách Khắc Phục'],
        rows: [
          ['1. Chưa có DOM đã query', '`Cannot read properties of null`', 'Thêm thuộc tính `defer` vào thẻ `<script>` trong phần `<head>`.'],
          ['2. Quên e.preventDefault()', 'Form bị chớp nháy và mất sạch dữ liệu', 'Thêm `e.preventDefault()` ở dòng đầu tiên của hàm submit form.'],
          ['3. Nhầm .value và textContent', 'Ô input không đổi chữ hoặc in ra undefined', 'Ô input/textarea dùng `.value`; thẻ thông thường dùng `.textContent`.'],
          ['4. Quên await res.json()', 'In ra đối tượng Promise { <pending> }', 'Nhớ thêm từ khóa `await` trước hàm `res.json()`.'],
          ['5. Không chuyển JSON khi lưu Storage', 'In ra chuỗi `[object Object]`', 'Bắt buộc dùng `JSON.stringify()` trước khi lưu vào localStorage.']
        ]
      },
      callout: { type: 'tip', t: 'Hãy chụp lại màn hình bảng tra cứu này! Bạn sẽ tiết kiệm được hàng chục giờ đồng hồ gỡ lỗi trong quá trình làm đồ án.' }
    },

    {
      title: 'Câu Hỏi Trắc Nghiệm Tổng Kết Toàn Bộ Giai Đoạn Front-End', badge: 'QUIZ',
      quiz: {
        q: 'Trong ứng dụng Single Page Application, sau khi người dùng đăng nhập thành công và server trả về mã token JWT, phương án nào dưới đây thể hiện quy trình xử lý chuẩn mực nhất của Front-end?',
        opts: [
          'In token ra màn hình bằng document.write() và reload trang',
          'Lưu token vào localStorage, cập nhật giao diện hiển thị tên người dùng trên DOM, và đính kèm token vào Header Authorization của các request fetch tiếp theo',
          'Gửi token ngược lại server qua phương thức GET query string',
          'Tạo một thẻ input hidden để lưu token'
        ],
        a: 1,
        why: 'Quy trình chuẩn: Lưu token vào bộ nhớ máy khách (localStorage hoặc Cookie), cập nhật giao diện người dùng sống động bằng cách sửa đổi DOM, và sau đó mỗi khi gọi các endpoint được bảo vệ sẽ đính kèm header Authorization: Bearer <token>.'
      }
    },

    {
      title: 'Chúc Mừng Bạn Đã Tốt Nghiệp Giai Đoạn Tiền Đề Front-End!', kicker: 'FE03 · Bế Mạc Giai Đoạn Front-End',
      layout: 'split', ratio: '0.85fr 1.15fr',
      bullets: [
        '**Hành trang vững vàng bạn đang sở hữu**:',
        '• **FE01 (HTML5)**: Nắm vững khung xương ngữ nghĩa Semantic Web, DOM tree, biểu mẫu validation native và trợ năng a11y.',
        '• **FE02 (CSS3)**: Làm chủ Box Model, bố cục 1 chiều Flexbox, lưới 2 chiều CSS Grid, định vị positioning và responsive mobile-first.',
        '• **FE03 (JavaScript Front-end)**: Làm chủ tương tác DOM, Event Delegation, lưu trữ bộ nhớ và gọi API bất đồng bộ với Fetch.',
        '**Cánh cổng Back-end Node.js & Express chính thức mở ra!**:',
        '• Bạn không còn là người chỉ biết gõ giao diện, mà đã hiểu trọn vẹn cách một hệ thống Web vận hành từ Client tới Server!',
        '• Từ Buổi 01, chúng ta sẽ bắt tay vào xây dựng bộ não máy chủ thực thụ với Node.js, Express, CSDL MySQL và kiến trúc MVC chuyên nghiệp!'
      ],
      img: { src: 'node-logo.svg', cap: 'Chúc mừng bạn đã hoàn thành xuất sắc giai đoạn Tiền đề Front-end! Sẵn sàng chinh phục Back-end!', h: 280 },
      callout: { type: 'tip', t: 'Khởi đầu hoàn hảo tạo nên thành công vượt bậc. Hẹn gặp lại các bạn tại Buổi 01: Kiến Trúc Node.js & Môi Trường Thực Thi Bất Đồng Bộ! 🚀🎓' }
    }
  ],
  recap: [
    '**Browser Runtime** phân biệt vai trò giữa `window` (BOM), `document` (DOM) và cơ chế Event Loop',
    '**DOM Manipulation** với `querySelector`, `classList` và phương thức chèn Node an toàn tránh lỗ hổng XSS',
    '**Event Delegation** gắn duy nhất 1 listener ở thẻ cha tận dụng cơ chế Event Bubbling giúp tối ưu bộ nhớ',
    '**Fetch API & Async/Await** gửi HTTP Request bất đồng bộ, kiểm tra trạng thái `res.ok` và xử lý lỗi mạng',
    '**Quản Lý 5 Trạng Thái UI** (Idle, Loading, Success, Error, Empty) đảm bảo trải nghiệm người dùng luôn mượt mà',
    'Xin chúc mừng! Bạn đã hoàn thành xuất sắc 3 buổi Tiền đề Front-end và sẵn sàng bước vào **Buổi 01: Node.js Cơ Bản**!'
  ],
  exercises: [
    {
      level: 'warmup', time: 20, title: 'Xây Dựng Chức Năng Bật / Tắt Giao Diện Dark Mode',
      desc: 'Sử dụng JavaScript lắng nghe sự kiện click trên nút bấm để bật/tắt class dark-mode và lưu trạng thái vào localStorage.',
      tasks: [
        'Tạo nút bấm chuyển đổi giao diện có id `#themeToggle`',
        'Gắn sự kiện click vào nút bằng `addEventListener(\'click\', ...)`',
        'Sử dụng `document.body.classList.toggle(\'dark-theme\')`',
        'Lưu trạng thái hiện tại ("dark" hoặc "light") vào `localStorage`',
        'Khi tải lại trang, đọc giá trị từ `localStorage` và tự động kích hoạt lại dark theme nếu trước đó người dùng đã chọn'
      ]
    },
    {
      level: 'core', time: 35, title: 'Xây Dựng Ứng Dụng Todo List Động Với Event Delegation',
      desc: 'Tạo ứng dụng quản lý công việc cho phép thêm mới, đánh dấu hoàn thành và xóa công việc sử dụng Event Delegation.',
      tasks: [
        'Bắt sự kiện submit form, dùng `e.preventDefault()` để không reload trang và lấy giá trị từ ô input',
        'Tạo phần tử `<li>` mới chứa tên công việc và nút "Xóa"',
        'Chèn công việc mới vào đầu danh sách bằng phương thức `prepend()`',
        'Gắn duy nhất 1 sự kiện click trên thẻ cha `<ul>`, dùng `e.target.closest(\'.btn-delete\')` để xóa `<li>` tương ứng',
        'Nếu click vào dòng chữ công việc, dùng `classList.toggle(\'completed\')` để gạch ngang chữ'
      ],
      solution: { file: 'todo-app.js', lang: 'javascript', src: `const form = document.querySelector('#todoForm');
const input = document.querySelector('#todoInput');
const list = document.querySelector('#todoList');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement('li');
  li.innerHTML = \`<span>\${text}</span> <button class="btn-del">Xóa</button>\`;
  list.prepend(li);
  input.value = '';
});

// Event Delegation trên thẻ cha <ul>
list.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-del')) {
    e.target.closest('li').remove();
  } else if (e.target.tagName === 'SPAN') {
    e.target.classList.toggle('done');
  }
});` }
    },
    {
      level: 'core', time: 35, title: 'Kết Nối API Lấy Danh Sách Bài Viết Kèm Loading Spinner',
      desc: 'Sử dụng Fetch API và Async/Await lấy dữ liệu từ server, hiển thị biểu tượng xoay khi đang tải.',
      tasks: [
        'Tạo thẻ `<div id="loading" class="spinner">Đang tải dữ liệu...</div>`',
        'Viết hàm bất đồng bộ `async function fetchPosts()`',
        'Trước khi gọi fetch: Hiển thị spinner loading',
        'Gọi `fetch(\'http://localhost:3000/api/v1/posts\')`, kiểm tra `if (!res.ok)`',
        'Duyệt mảng bài viết và render danh sách ra giao diện bằng template literals',
        'Trong khối `finally`: Luôn luôn ẩn spinner loading dù request thành công hay gặp lỗi'
      ]
    },
    {
      level: 'challenge', time: 40, title: 'Xây Dựng Ô Tìm Kiếm Thời Gian Thực Với Kỹ Thuật Debounce',
      desc: 'Tối ưu hóa ô tìm kiếm bài viết, chỉ gửi request lên máy chủ khi người dùng ngừng gõ phím sau 500ms.',
      tasks: [
        'Viết hàm tiện ích `debounce(callback, delay)`',
        'Lắng nghe sự kiện `input` trên ô tìm kiếm `#searchInput` kết hợp hàm debounce 500ms',
        'Khi từ khóa có từ 2 ký tự trở lên: Gọi API `GET /api/v1/posts?q=...`',
        'Nếu không tìm thấy kết quả (`data.length === 0`): Hiển thị thông báo trạng thái rỗng "Không tìm thấy bài viết phù hợp"',
        'Nếu tìm thấy: Cập nhật lại danh sách bài viết trên giao diện'
      ]
    },
    {
      level: 'homework', time: 50, title: 'Xây Dựng Form Tạo Bài Viết Mới Gửi HTTP POST Kèm Bearer Token',
      desc: 'Hoàn thiện luồng tạo bài viết mới từ Front-end gửi dữ liệu JSON lên Back-end REST API.',
      tasks: [
        'Dựng form tạo bài viết gồm tiêu đề, tóm tắt và nội dung',
        'Bắt sự kiện submit form, thu thập dữ liệu thành JavaScript Object',
        'Đọc chuỗi `accessToken` từ `localStorage`',
        'Gửi request `fetch()` với method `POST`, header `Content-Type: application/json` và header `Authorization: Bearer <token>`',
        'Nếu thành công: Hiển thị thông báo Toast xanh lá và chuyển hướng về trang chủ',
        'Nếu lỗi: Hiển thị thông báo lỗi từ server trả về mà không làm mất nội dung người dùng vừa gõ'
      ]
    }
  ],
  project: {
    lead: '**Cột mốc hoàn thành Tiền đề Front-end**: Biến giao diện DevBlog thành ứng dụng sống động, kết nối trực tiếp với REST API!',
    tasks: [
      'Lập trình giao diện xem danh sách bài viết từ API server',
      'Xây dựng chức năng chuyển đổi giao diện Sáng / Tối lưu trữ vào localStorage',
      'Tối ưu hóa ô tìm kiếm bài viết với kỹ thuật Debounce 500ms',
      'Xây dựng form tạo bài viết gửi dữ liệu JSON kèm JWT Bearer Token'
    ],
    callout: { type: 'tip', t: 'Xin chúc mừng các bạn đã làm chủ trọn vẹn bộ ba HTML5 - CSS3 - JavaScript! Giờ đây các bạn đã sẵn sàng bước vào thế giới lập trình Web Back-end đỉnh cao với Node.js! 🚀🎓' }
  }
};
