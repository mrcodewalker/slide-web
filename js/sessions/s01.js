/* ============================================================
   BUỔI 1 — Nhập môn Back-end & Node.js
   ============================================================ */
SESSION_DATA[1] = {
  intro: 'Buổi mở màn: tạo hứng thú và dựng bức tranh tổng thể. Đừng sa đà vào cú pháp — mục tiêu là học viên hiểu "web chạy thế nào" và chạy được file .js đầu tiên bằng Node.',
  agenda: [
    { min: 15, t: 'Giới thiệu khóa học & đồ án DevBlog API', d: 'Lộ trình 12 buổi, cách học, cách nộp bài' },
    { min: 35, t: 'Web hoạt động thế nào? Client–Server, DNS, HTTP', d: 'Request / Response, method, status code, DevTools' },
    { min: 30, t: 'Node.js là gì? V8, libuv, Event Loop', d: 'Khác gì JS trên trình duyệt, blocking vs non-blocking' },
    { min: 20, t: 'Cài đặt, Hello World, REPL', d: 'node -v, npm -v, chạy file .js' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 25, t: 'npm & package.json', d: 'init, install, scripts, semver' },
    { min: 30, t: 'Module CommonJS & built-in: fs · path · os', d: 'require / module.exports, đọc ghi file' },
    { min: 15, t: 'Quiz nhanh & giao bài tập', d: '' }
  ],
  slides: [
    /* ---------- 1. WEB HOẠT ĐỘNG THẾ NÀO ---------- */
    { kind: 'section', no: '01', title: 'Web hoạt động thế nào?', sub: 'Trước khi viết một dòng back-end, hãy hiểu chuyện gì xảy ra khi ta gõ một địa chỉ.' },
    {
      title: 'Front-end vs Back-end', lead: 'Bạn đã học Front-end. Hôm nay ta đi sang “nửa còn lại” của web.',
      cols: [
        { h: '🎨 Front-end (Client)', cls: 'good', bullets: ['Chạy **trên trình duyệt** của người dùng', 'HTML · CSS · JavaScript', 'Hiển thị giao diện, nhận thao tác', 'Người dùng **nhìn thấy & chạm vào**'] },
        { h: '⚙️ Back-end (Server)', bullets: ['Chạy **trên máy chủ**', 'Nhận request, xử lý logic, truy vấn DB', 'Xác thực, phân quyền, bảo mật', 'Người dùng **không nhìn thấy** — nhưng không thể thiếu'] }
      ],
      callout: { type: 'tip', t: 'Ví dụ: bấm “Đăng nhập” → **Front-end** gửi email/mật khẩu → **Back-end** kiểm tra trong DB → trả kết quả → Front-end hiển thị.' },
      notes: 'Hỏi lớp: "Nếu chỉ có HTML/CSS/JS thì chúng ta lưu tài khoản người dùng ở đâu?" → dẫn tới nhu cầu server + database.'
    },
    {
      title: 'Mô hình Client – Server', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**1. Khách (Client)**: Trình duyệt web (Chrome, Firefox), Mobile App hoặc Postman gửi yêu cầu (**HTTP Request**).',
        '**2. Hạ tầng Mạng (Network & Internet)**: Vận chuyển gói tin qua TCP/IP, định tuyến qua DNS và các Router trung gian.',
        '**3. Máy chủ Ứng dụng (Server - Node.js & Express)**: Lắng nghe tại cổng mạng (Port 3000), phân tích đường dẫn (URL), method (`GET`, `POST`) và kiểm tra tính hợp lệ.',
        '**4. Tầng Dữ liệu (Database - MySQL)**: Server truy vấn cơ sở dữ liệu để tìm kiếm, thêm mới hoặc cập nhật thông tin.',
        '**5. Phản hồi (Response)**: Server đóng gói dữ liệu kết quả (chuỗi JSON hoặc HTML) gửi ngược về Client kèm mã trạng thái (Status Code).'
      ],
      img: { src: 'client-server.svg', cap: 'Mô hình Client–Server: luồng trao đổi dữ liệu qua mạng' },
      callout: { type: 'tip', t: 'Một server có thể phục vụ hàng ngàn client cùng lúc nhờ cơ chế bất đồng bộ non-blocking của Node.js.' }
    },
    {
      title: 'Gõ URL rồi nhấn Enter — chuyện gì xảy ra?', kicker: 'B01 · Hành trình của một request',
      steps: [
        { h: '1. Phân giải DNS', p: 'Đổi tên miền `devblog.vn` thành địa chỉ IP máy chủ' },
        { h: '2. Bắt tay TCP', p: 'Client và Server thiết lập kết nối 3 bước (SYN, SYN-ACK, ACK)' },
        { h: '3. Gửi HTTP Request', p: 'Yêu cầu: `GET /api/posts HTTP/1.1` kèm các Headers' },
        { h: '4. Node.js xử lý', p: 'Chạy logic Express, truy vấn CSDL MySQL, tạo kết quả JSON' },
        { h: '5. Nhận Response', p: 'Trả về `200 OK` kèm body → Trình duyệt vẽ giao diện lên màn hình' }
      ],
      callout: { type: 'info', t: '**Back-end chính là bước 4** — toàn bộ logic điều phối và dữ liệu nằm tại đây. Đó là thứ chúng ta sẽ làm chủ bằng **Node.js & Express**.' }
    },
    {
      title: 'DNS — danh bạ của Internet', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Bản chất DNS (Domain Name System)**: Máy tính nói chuyện qua địa chỉ số **IP** (vd `142.250.190.78`), nhưng con người chỉ nhớ **tên miền** (`google.com`). DNS đóng vai trò "cuốn danh bạ" dịch tên miền $\\rightarrow$ IP.',
        '**1. Kiểm tra Cache**: Trình duyệt kiểm tra cache cục bộ trong máy tính xem IP này đã lưu chưa.',
        '**2. DNS Resolver (ISP)**: Nếu chưa có, gửi yêu cầu tới máy chủ phân giải của nhà mạng viễn thông.',
        '**3. Root & TLD Server**: Truy vấn phân cấp từ Root Server $\\rightarrow$ máy chủ quản lý đuôi tên miền (như `.com`, `.vn`).',
        '**4. Authoritative Name Server**: Máy chủ có thẩm quyền trả về địa chỉ IP chính xác của server lưu trữ.',
        '**Dev Local**: Tên miền `localhost` luôn trỏ cứng về IP loopback `127.0.0.1` — chính là máy tính cá nhân của bạn.'
      ],
      img: { src: 'dns.jpg', cap: 'Sơ đồ phân giải tên miền qua các cấp máy chủ DNS' }
    },
    {
      title: 'Server tĩnh vs Server động', lead: 'Điểm khác biệt cốt lõi: **Server có chạy code để tạo nội dung trước khi trả về hay không?**',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Server tĩnh (Static Server - Nginx, Apache, express.static)**:',
        { t: 'Đọc nguyên xi các file vật lý trên ổ cứng (`index.html`, `style.css`, file ảnh `.png`) và gửi thẳng cho client.', sub: ['Nội dung giống hệt nhau cho mọi người truy cập.', 'Tốc độ cực nhanh, nhưng không thể có tính năng cá nhân hóa (đăng nhập, bình luận).'] },
        '**Server động (Dynamic Application Server - Node.js Express)**:',
        { t: 'Mỗi request đến, server **thực thi mã nguồn JS**:', sub: ['Đọc tham số người dùng gửi lên, truy vấn Database MySQL.', 'Tính toán logic (kiểm tra mật khẩu, lọc bài viết theo tác giả).', 'Đóng gói dữ liệu kết quả (chuỗi **JSON**) rồi mới gửi trả cho Front-end.'] }
      ],
      img: { src: 'mdn-dynamic-server.png', cap: 'Kiến trúc máy chủ động: kết hợp Web Server, Ứng dụng code và Cơ sở dữ liệu' }
    },
    {
      title: 'HTTP — ngôn ngữ chung của web', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**HTTP (HyperText Transfer Protocol)**: Giao thức truyền tải siêu văn bản quy định chuẩn giao tiếp giữa Client và Server.',
        '**Chạy trên nền TCP/IP**: Cổng mặc định của HTTP là `80`, HTTPS (bảo mật mã hóa TLS) là `443`.',
        '**Định dạng văn bản (Text-based)**: Thông điệp truyền đi ở dạng plain text, lập trình viên có thể đọc và debug trực tiếp trên tab Network của DevTools.',
        '**Đặc tính Stateless (Phi trạng thái)**: Mỗi cặp Request / Response hoàn toàn độc lập, server không tự lưu phiên làm việc. Muốn nhớ người dùng phải dùng thêm **Cookie, Session hoặc JWT Token** (học ở B09).'
      ],
      img: { src: 'mdn-http-layers.svg', cap: 'Vị trí của HTTP tại tầng Ứng dụng (Application Layer) trên mô hình TCP/IP' }
    },
    {
      title: 'Một chút lịch sử', kicker: 'B01 · Fun fact',
      lead: '1989–1991: **Tim Berners-Lee** tại phòng thí nghiệm CERN (Thụy Sĩ) phát minh ra World Wide Web, giao thức HTTP và ngôn ngữ HTML. Chiếc máy trạm NeXT của Steve Jobs dưới đây chính là **máy chủ web đầu tiên trong lịch sử nhân loại**.',
      img: [{ src: 'tim-berners-lee.jpg', cap: 'Sir Tim Berners-Lee (1955) — Cha đẻ của Web', h: 360 }, { src: 'first-web-server.jpg', cap: 'Web Server đầu tiên (máy tính NeXT tại CERN)', h: 360 }]
    },
    {
      title: 'Anatomy của HTTP Request', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**1. Request Line (Dòng mở đầu)**: Gồm 3 thành phần:',
        { t: '`METHOD`: Hành động (`GET` xem, `POST` tạo mới, `PUT` sửa, `DELETE` xóa).', sub: ['`PATH`: Đường dẫn tài nguyên trên server (vd: `/api/posts?page=1`).', '`VERSION`: Phiên bản giao thức (`HTTP/1.1`).'] },
        '**2. Request Headers (Các dòng tiêu đề)**: Cặp `Key: Value` chứa metadata:',
        { t: '`Host`: Địa chỉ tên miền của server mục tiêu (`api.devblog.vn`).', sub: ['`Content-Type`: Định dạng dữ liệu gửi lên (`application/json`).', '`Authorization`: Chứa mã định danh token (`Bearer eyJhbG...`).'] },
        '**3. Dòng trống (Empty line)**: Dấu hiệu phân cách bắt buộc giữa Headers và Body.',
        '**4. Request Body**: Dữ liệu gửi lên server (thường là JSON khi tạo tài khoản, viết bài mới).'
      ],
      img: { src: 'mdn-http-request.svg', cap: 'Cấu trúc giải phẫu của một HTTP Request hoàn chỉnh' }
    },
    {
      title: 'Anatomy của HTTP Response', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**1. Status Line (Dòng trạng thái)**: Kết quả xử lý của server:',
        { t: '`HTTP/1.1 200 OK`: Thành công.', sub: ['Mã số 3 chữ số (**Status Code**) thể hiện bản chất kết quả.', 'Thông điệp trạng thái ngắn gọn bằng tiếng Anh đi kèm.'] },
        '**2. Response Headers**: Thông tin server gửi kèm để hướng dẫn trình duyệt:',
        { t: '`Content-Type`: Báo cho client kiểu nội dung trả về (`application/json; charset=utf-8`).', sub: ['`Set-Cookie`: Hướng dẫn client lưu trữ thông tin phiên.', '`Access-Control-Allow-Origin`: Cấu hình quyền truy cập (CORS).'] },
        '**3. Dòng trống (Empty line)**: Phân cách Headers và dữ liệu.',
        '**4. Response Body**: Dữ liệu thực sự mà client cần (chuỗi JSON danh sách bài viết, mã HTML hoặc file ảnh).'
      ],
      img: { src: 'mdn-http-response.svg', cap: 'Cấu trúc giải phẫu của một HTTP Response trả về từ máy chủ' }
    },
    {
      title: 'HTTP Method & Status Code — học thuộc!', kicker: 'B01 · Bảng tra nhanh',
      cols: [
        { h: 'HTTP Methods', bullets: ['`GET` — Truy xuất dữ liệu (an toàn, không đổi dữ liệu server)', '`POST` — Tạo mới tài nguyên (đăng ký user, tạo bài)', '`PUT` / `PATCH` — Cập nhật toàn bộ hoặc một phần', '`DELETE` — Xóa tài nguyên khỏi hệ thống'] },
        { h: 'HTTP Status Codes', bullets: ['`2xx` — Thành công (`200 OK`, `201 Created`, `204 No Content`)', '`3xx` — Chuyển hướng (`301 Moved`, `304 Not Modified`)', '`4xx` — **Lỗi phía Client** (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`)', '`5xx` — **Lỗi phía Server** (`500 Internal Error`, `502 Bad Gateway`)'] }
      ],
      callout: { type: 'warn', t: 'Quy tắc vàng: 400 = gửi dữ liệu sai, 401 = chưa đăng nhập, 403 = không đủ quyền, 404 = không tìm thấy, 500 = code server bị crash!' }
    },
    {
      title: 'Demo: soi request bằng DevTools', badge: 'LIVE DEMO', kicker: 'B01 · Thực hành cùng giảng viên',
      steps: [
        { h: '1. Mở DevTools', p: 'Nhấn `F12` (hoặc chuột phải $\\rightarrow$ Inspect) $\\rightarrow$ chuyển qua tab **Network**' },
        { h: '2. Tải trang & quan sát', p: 'Truy cập một trang tin tức, nhấn `F5`. Quan sát số lượng request được gọi' },
        { h: '3. Phân tích chi tiết', p: 'Click vào 1 request bất kỳ $\\rightarrow$ soi kỹ tab **Headers**, **Payload**, **Preview**' },
        { h: '4. Thử nghiệm với API JSON', p: 'Mở tab mới truy cập: `jsonplaceholder.typicode.com/posts/1`' }
      ],
      vertical: true,
      callout: { type: 'demo', t: 'Câu hỏi cho cả lớp: Method là gì? Status code bao nhiêu? Response trả về định dạng MIME nào?' },
      notes: 'Dành 3 phút cho học viên thực hành. Chỉ cho học viên thấy tab Response chứa chuỗi JSON thô và tab Headers chứa Content-Type.'
    },

    /* ---------- 2. NODE.JS ---------- */
    { kind: 'section', no: '02', title: 'Node.js là gì?', sub: 'JavaScript rời khỏi trình duyệt và trở thành sức mạnh phía máy chủ.' },
    {
      title: 'Node.js — JavaScript ngoài trình duyệt', layout: 'split', ratio: '1.05fr .95fr', top: true,
      bullets: [
        '**Lịch sử ra đời**: Năm **2009**, kỹ sư **Ryan Dahl** giới thiệu Node.js tại hội thảo JSConf và nhận được sự hoan nghênh nồng nhiệt toàn cầu.',
        '**Định nghĩa chuẩn xác**: Node.js là một **Môi trường thực thi JavaScript (JavaScript Runtime Environment)** — *không phải* ngôn ngữ lập trình mới, *không phải* framework.',
        '**Nền tảng công nghệ**: Xây dựng trên engine V8 cực nhanh của Google Chrome, kết hợp cùng thư viện `libuv` viết bằng ngôn ngữ C.',
        '**Đa nền tảng**: Chạy nhất quán trên Windows, macOS và Linux server.',
        '**Hệ sinh thái khổng lồ**: Sở hữu kho thư viện **npm** với hơn 3 triệu gói mã nguồn mở phong phú nhất thế giới.'
      ],
      img: [{ src: 'ryan-dahl.jpg', cap: 'Ryan Dahl — Tác giả sáng lập Node.js', h: 420 }],
      notes: 'Ryan Dahl nhận thấy server truyền thống (như Apache) cấp 1 thread riêng cho mỗi kết nối rất nhanh cạn kiệt RAM khi có hàng chục ngàn kết nối đồng thời. Ông đã giải quyết bằng mô hình Event-driven Non-blocking.'
    },
    {
      title: 'Bên trong Node: V8 + libuv + C++ Core', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**1. Google V8 Engine**: Trực tiếp phân tích cú pháp (parse) và biên dịch mã nguồn JavaScript thành mã máy (Machine Code) chạy thẳng trên CPU; quản lý Call Stack và bộ nhớ Heap.',
        '**2. Thư viện libuv (C Library)**: Trái tim xử lý hiệu năng cao của Node.js:',
        { t: 'Điều phối **Event Loop** bất đồng bộ đơn luồng.', sub: ['Quản lý **Worker Thread Pool** (mặc định 4 luồng) chạy ngầm các tác vụ nặng: đọc ghi đĩa (`fs`), mã hóa (`crypto`), phân giải DNS.', 'Tương tác trực tiếp với API bất đồng bộ (epoll trên Linux, IOCP trên Windows).'] },
        '**3. Node.js Core APIs**: Các module lõi cấp hệ điều hành bằng C++: `fs`, `http`, `net`, `path`, `os`.'
      ],
      img: { src: 'libuv-architecture.png', cap: 'Kiến trúc phân tầng của Node.js: V8 Engine, C++ Bindings và thư viện libuv', h: 460 }
    },
    {
      title: 'JavaScript: Trình duyệt vs Node.js',
      table: {
        head: ['', 'Trình duyệt', 'Node.js'],
        rows: [
          ['Đối tượng toàn cục', '`window`', '`global` / `globalThis`'],
          ['DOM, `document`, `alert`', '✅ Có', '❌ Không'],
          ['Đọc/ghi file, mạng, OS', '❌ Bị hạn chế (sandbox)', '✅ `fs`, `http`, `os`…'],
          ['Module', 'ES Modules', 'CommonJS + ES Modules'],
          ['Chạy ở đâu', 'Máy người dùng', 'Máy chủ / máy dev'],
          ['Engine', 'V8, SpiderMonkey…', 'V8']
        ]
      },
      callout: { type: 'tip', t: 'Ngôn ngữ **giống hệt** nhau. Khác nhau ở **API xung quanh** (DOM vs fs/http).' }
    },
    {
      title: 'Single-thread & Event Loop', kicker: 'B01 · Khái niệm cốt lõi của Node.js',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Bản chất Single-threaded**: Chỉ có **1 Call Stack duy nhất** để thực thi mã JavaScript trên luồng chính, loại bỏ hoàn toàn bài toán Deadlock hay xung đột đa luồng.',
        '**Mô hình Event-Driven Non-blocking**: Khi gặp tác vụ tốn thời gian (I/O đọc file, truy vấn Database, đợi mạng), Node.js đẩy việc đó xuống cho **libuv / OS Kernel** xử lý ngầm và giải phóng ngay luồng chính.',
        '**Các pha (Phases) của Event Loop (theo sơ đồ bên cạnh)**:',
        { t: '`Timers`: Thực thi các callback đã đến hạn của `setTimeout()` và `setInterval()`.', sub: ['`Pending Callbacks & Poll`: Lắng nghe và tiếp nhận các sự kiện I/O mạng hoặc đọc đĩa hoàn tất.', '`Check`: Thực thi ngay lập tức các hàm `setImmediate()`.', '`Close Callbacks`: Dọn dẹp đóng các socket và kết nối.'] },
        '**Năng lực chịu tải**: Nhờ không bị nghẽn (blocking), một tiến trình Node.js có thể phục vụ **hàng chục ngàn kết nối đồng thời** chỉ với vài chục MB RAM!'
      ],
      img: { src: 'libuv-loop.png', cap: 'Chu trình các pha (Phases) của Event Loop trong thư viện libuv', h: 480 },
      notes: 'Ẩn dụ kinh điển: Nhân viên phục vụ nhà hàng nhận order từ khách 1 rồi chuyển vào bếp (I/O). Trong lúc bếp nấu, nhân viên tiếp tục nhận order từ khách 2, khách 3 chứ không đứng chờ món. Khi chuông bếp reo (event), nhân viên mang món ra bàn.'
    },
    {
      title: 'Runtime = Call Stack + Queue + Event Loop', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**1. Memory Heap (Bộ nhớ Heap)**: Vùng nhớ phi cấu trúc dùng để cấp phát động cho các đối tượng (Objects, Arrays, Closures).',
        '**2. Call Stack (Ngăn xếp cuộc gọi)**: Cấu trúc LIFO (Vào sau - Ra trước) theo dõi hàm nào đang được CPU thực thi. Hàm gọi lồng nhau sẽ chồng lên nhau, chạy xong sẽ pop ra khỏi stack.',
        '**3. Web / Node APIs (C++ Background)**: Nơi các tác vụ I/O, bộ hẹn giờ hoặc kết nối mạng thực sự được hệ thống chạy song song ngầm.',
        '**4. Callback Queues (Hàng đợi sự kiện)**:',
        { t: '`Microtask Queue`: Hàng đợi ưu tiên cao nhất dành cho `Promise.then()` và `async/await`.', sub: ['`Macrotask / Task Queue`: Hàng đợi dành cho `setTimeout`, `setInterval` và I/O callbacks.', 'Microtask luôn được dọn sạch hoàn toàn trước khi Event Loop bốc tác vụ từ Task Queue!'] },
        '**5. Vai trò của Event Loop**: Nhịp tim điều phối — liên tục kiểm tra nếu **Call Stack hoàn toàn rỗng**, nó lập tức đẩy callback đầu tiên từ Queue vào Stack để thực thi.'
      ],
      img: { src: 'mdn-js-runtime.svg', cap: 'Kiến trúc mô hình Runtime hoàn chỉnh của JavaScript' }
    },
    {
      title: 'Blocking vs Non-blocking',
      code: [
        { file: 'blocking.js', lang: 'javascript', src: `const fs = require('fs');\n\nconsole.log('1. Bắt đầu');\nconst data = fs.readFileSync('big.txt', 'utf8'); // ⛔ chờ xong mới đi tiếp\nconsole.log('2. Đọc xong', data.length);\nconsole.log('3. Việc khác');` },
        { file: 'non-blocking.js', lang: 'javascript', src: `const fs = require('fs');\n\nconsole.log('1. Bắt đầu');\nfs.readFile('big.txt', 'utf8', (err, data) => {\n  console.log('3. Đọc xong', data.length);\n});\nconsole.log('2. Việc khác'); // ✅ chạy ngay` }
      ],
      callout: { type: 'danger', t: 'Trên **server**, một thao tác blocking có thể **đóng băng mọi người dùng**. Quy tắc vàng: ưu tiên API **bất đồng bộ**.' }
    },
    {
      title: 'Đố vui: thứ tự in ra?', badge: 'QUIZ',
      code: { file: 'order.js', lang: 'javascript', size: 'sm', src: `console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');` },
      quiz: { q: 'Kết quả in ra theo thứ tự nào?', opts: ['A B C D', 'A D B C', 'A D C B', 'A C D B'], a: 2, why: 'Code đồng bộ chạy trước (A, D). Sau đó **microtask** (Promise → C) chạy trước **timer** (setTimeout → B).' },
      notes: 'Để học viên đoán, giơ tay. Không cần giải thích sâu microtask — buổi 2 sẽ quay lại.'
    },
    {
      title: 'Node.js dùng để làm gì?', kicker: 'B01 · Ứng dụng thực tế',
      cards: [
        { icon: '🔌', h: 'REST API', p: 'Phục vụ web & mobile app' },
        { icon: '💬', h: 'Realtime', p: 'Chat, thông báo (WebSocket)' },
        { icon: '🛠️', h: 'CLI & Tooling', p: 'npm, Vite, ESLint… đều viết bằng Node' },
        { icon: '🧩', h: 'Microservices', p: 'Chia hệ thống thành dịch vụ nhỏ' },
        { icon: '📄', h: 'SSR', p: 'Next.js, Nuxt render phía server' },
        { icon: '🤖', h: 'Tự động hóa', p: 'Crawler, bot, xử lý file' }
      ], cols: 3,
      callout: { type: 'info', t: 'Netflix, PayPal, LinkedIn, Uber… đều dùng Node.js trong hệ thống của mình.' }
    },
    {
      title: 'Hệ sinh thái chúng ta sẽ dùng', kicker: 'B01 · Technology stack',
      logos: ['node-logo.svg', 'express-logo.png', 'mysql-logo.svg', 'jwt-logo.svg', 'npm-logo.svg', 'postman-logo.png', 'git-logo.svg', 'docker-logo.svg'],
      bullets: ['**Node.js + Express** → web server & API', '**MySQL + Sequelize** → lưu dữ liệu', '**JWT + bcrypt** → đăng nhập an toàn', '**Postman** → test API · **Git** → quản lý code']
    },

    /* ---------- 3. CÀI ĐẶT ---------- */
    { kind: 'section', no: '03', title: 'Cài đặt & chạy code đầu tiên', sub: 'Từ máy trống đến “Hello, Node!” trong 5 phút.' },
    {
      title: 'Cài đặt môi trường', badge: 'LIVE DEMO',
      steps: [
        { h: 'Tải Node LTS', p: 'nodejs.org → bản **LTS** (20+)' },
        { h: 'Cài VS Code', p: 'Editor + extension ESLint, Prettier' },
        { h: 'Kiểm tra', p: 'Mở terminal, chạy lệnh bên dưới' }
      ],
      term: `$ node -v\nv20.11.1\n$ npm -v\n10.2.4`,
      callout: { type: 'tip', t: 'Muốn đổi phiên bản Node dễ dàng? Dùng **nvm** (nvm-windows trên Windows). Luôn chọn bản **LTS** cho dự án thật.' }
    },
    {
      title: 'Hello, Node!', badge: 'LIVE CODING',
      cols: [
        { h: 'hello.js', code: { file: 'hello.js', lang: 'javascript', src: `const name = 'CT9';\nconsole.log(\`Xin chào \${name} từ Node.js!\`);` } },
        { h: 'Chạy file', code: { lang: 'bash', src: `node hello.js` } }
      ],
      term: `$ node hello.js\nXin chào CT9 từ Node.js!`,
      callout: { type: 'info', t: 'Gõ `node` (không kèm file) để vào **REPL** — thử code từng dòng, thoát bằng `Ctrl + C` hai lần hoặc `.exit`.' }
    },
    {
      title: 'Biến & đối tượng đặc biệt của Node', layout: 'split', ratio: '1.1fr .9fr',
      code: { file: 'globals.js', lang: 'javascript', size: 'sm', src: `console.log(__dirname);   // thư mục chứa file này\nconsole.log(__filename);  // đường dẫn đầy đủ của file\n\nconsole.log(process.argv);        // tham số dòng lệnh\nconsole.log(process.env.PATH);    // biến môi trường\nconsole.log(process.platform);    // 'win32' | 'linux' | 'darwin'\nconsole.log(process.version);\n\nprocess.exit(0); // kết thúc chương trình` },
      bullets: ['`process` — thông tin & điều khiển chương trình', '`__dirname`, `__filename` — vị trí file', '`process.argv` — nhận tham số `node app.js hello`', '`process.env` — cấu hình (sẽ dùng nhiều ở B6)']
    },

    /* ---------- 4. NPM ---------- */
    { kind: 'section', no: '04', title: 'npm & package.json', sub: 'Kho package lớn nhất thế giới và “chứng minh thư” của mỗi dự án.' },
    {
      title: 'npm — Node Package Manager', layout: 'split', ratio: '1fr .8fr',
      bullets: ['**Kho** hàng triệu package JS dùng chung', '**Công cụ dòng lệnh** `npm` để cài, gỡ, chạy script', 'Đi kèm Node.js — cài Node là có npm', 'Không tự viết lại thứ người khác đã làm tốt!'],
      img: { src: 'npm-logo.svg', cap: 'npm', h: 200 }
    },
    {
      title: 'Khởi tạo dự án: package.json', badge: 'LIVE CODING',
      term: `$ mkdir devblog-api && cd devblog-api\n$ npm init -y`,
      code: { file: 'package.json', lang: 'json', size: 'sm', src: `{\n  "name": "devblog-api",\n  "version": "1.0.0",\n  "description": "",\n  "main": "index.js",\n  "scripts": {\n    "start": "node index.js"\n  },\n  "license": "ISC"\n}` },
      notes: 'package.json = mô tả dự án + danh sách phụ thuộc + script. Mọi người clone repo chỉ cần `npm install`.'
    },
    {
      title: 'Cài & quản lý package',
      table: {
        head: ['Lệnh', 'Ý nghĩa'],
        rows: [
          ['`npm install dayjs`', 'Cài package, ghi vào **dependencies**'],
          ['`npm install -D nodemon`', 'Cài cho lúc phát triển (**devDependencies**)'],
          ['`npm install`', 'Cài lại tất cả theo package.json (khi clone repo)'],
          ['`npm uninstall dayjs`', 'Gỡ package'],
          ['`npm run <tên>`', 'Chạy script khai báo trong package.json'],
          ['`npx <tool>`', 'Chạy tool mà không cần cài global']
        ]
      },
      callout: { type: 'warn', t: '**Không commit** thư mục `node_modules/` — thêm vào `.gitignore`. Nhưng **phải commit** `package.json` và `package-lock.json`.' }
    },
    {
      title: 'npm scripts & Semantic Versioning', layout: 'split', ratio: '1fr 1fr',
      code: { file: 'package.json', lang: 'json', size: 'sm', src: `"scripts": {\n  "start": "node index.js",\n  "dev": "nodemon index.js"\n},\n"dependencies": {\n  "dayjs": "^1.11.10"\n},\n"devDependencies": {\n  "nodemon": "~3.0.3"\n}` },
      table: { small: true, head: ['Ký hiệu', 'Cho phép nâng'], rows: [['`1.2.3`', 'Đúng phiên bản này'], ['`^1.2.3`', 'Tới `1.x.x` (minor + patch)'], ['`~1.2.3`', 'Tới `1.2.x` (chỉ patch)']] },
      callout: { type: 'info', t: 'Phiên bản = **MAJOR.MINOR.PATCH**: breaking change . tính năng mới . sửa lỗi.' }
    },
    {
      title: 'Demo: dùng package bên thứ ba', badge: 'LIVE CODING',
      code: { file: 'index.js', lang: 'javascript', src: `const dayjs = require('dayjs');\n\nconst now = dayjs();\nconsole.log('Bây giờ:', now.format('DD/MM/YYYY HH:mm:ss'));\nconsole.log('Sau 7 ngày:', now.add(7, 'day').format('DD/MM/YYYY'));` },
      term: `$ npm install dayjs\n$ node index.js\nBây giờ: 26/10/2026 11:30:12\nSau 7 ngày: 02/11/2026`
    },

    /* ---------- 5. MODULE ---------- */
    { kind: 'section', no: '05', title: 'Module & thư viện có sẵn', sub: 'Chia nhỏ code thành các file, đọc ghi file, làm việc với đường dẫn.' },
    {
      title: 'Module CommonJS: require & module.exports',
      cols: [
        { h: 'math.js — xuất', code: { file: 'math.js', lang: 'javascript', size: 'sm', src: `function sum(a, b) {\n  return a + b;\n}\nconst PI = 3.14159;\n\nmodule.exports = { sum, PI };` } },
        { h: 'app.js — nhập', code: { file: 'app.js', lang: 'javascript', size: 'sm', src: `const { sum, PI } = require('./math');\n\nconsole.log(sum(2, 3)); // 5\nconsole.log(PI);        // 3.14159` } }
      ],
      callout: { type: 'tip', t: 'Mỗi file là **một module** riêng. Biến không `export` thì **không ai nhìn thấy** từ bên ngoài — tránh xung đột tên.' }
    },
    {
      title: 'Ba loại module',
      table: {
        head: ['Loại', 'Cách gọi', 'Ví dụ'],
        rows: [
          ['Core (có sẵn)', '`require(\'fs\')`', '`fs`, `path`, `os`, `http`, `crypto`, `events`'],
          ['Local (tự viết)', '`require(\'./math\')`', 'file `.js` của bạn — **bắt đầu bằng `./`**'],
          ['Third-party (npm)', '`require(\'dayjs\')`', 'package trong `node_modules`']
        ]
      },
      callout: { type: 'info', t: 'Node có **2 hệ module**: CommonJS (`require`) và ES Modules (`import`). Buổi 2 sẽ so sánh; khóa này ưu tiên **CommonJS** cho đơn giản.' }
    },
    {
      title: 'fs — đọc & ghi file', kicker: 'B01 · Core module',
      code: { file: 'files.js', lang: 'javascript', size: 'sm', src: `const fs = require('fs');\n\n// Ghi (tạo mới / ghi đè)\nfs.writeFileSync('note.txt', 'Hôm nay học Node.js\\n');\n\n// Ghi thêm vào cuối file\nfs.appendFileSync('note.txt', 'Dòng thứ hai\\n');\n\n// Đọc\nconst text = fs.readFileSync('note.txt', 'utf8');\nconsole.log(text);\n\n// Kiểm tra tồn tại / xóa\nif (fs.existsSync('note.txt')) fs.unlinkSync('note.txt');` },
      callout: { type: 'warn', t: 'Các hàm `...Sync` **chặn** chương trình. Hãy dùng `fs.promises` / `async-await` (B2) trong server thật.' }
    },
    {
      title: 'path & os — đường dẫn không bao giờ sai', layout: 'split', ratio: '1.1fr .9fr',
      code: { file: 'paths.js', lang: 'javascript', size: 'sm', src: `const path = require('path');\nconst os = require('os');\n\nconst file = path.join(__dirname, 'data', 'users.json');\nconsole.log(file);\nconsole.log(path.basename(file));  // users.json\nconsole.log(path.extname(file));   // .json\n\nconsole.log(os.platform(), os.cpus().length);\nconsole.log(os.totalmem() / 1024 ** 3, 'GB');` },
      bullets: ['Windows dùng `\\`, Linux/macOS dùng `/`', '**Luôn** dùng `path.join(__dirname, ...)`', 'Không nối chuỗi thủ công!', '`os` cho biết thông tin máy chạy code']
    },
    {
      title: 'Demo: Mini “Notes” CLI', badge: 'LIVE CODING', kicker: 'B01 · Ghép mọi thứ đã học',
      code: { file: 'notes.js', lang: 'javascript', size: 'sm', src: `const fs = require('fs');\nconst path = require('path');\nconst FILE = path.join(__dirname, 'notes.json');\n\nconst [cmd, ...rest] = process.argv.slice(2);\nconst notes = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : [];\n\nif (cmd === 'add') {\n  notes.push({ id: Date.now(), text: rest.join(' ') });\n  fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));\n  console.log('✅ Đã thêm ghi chú');\n} else if (cmd === 'list') {\n  notes.forEach((n, i) => console.log(\`\${i + 1}. \${n.text}\`));\n} else {\n  console.log('Dùng: node notes.js add <nội dung> | list');\n}` },
      term: `$ node notes.js add Học Node.js\n✅ Đã thêm ghi chú\n$ node notes.js list\n1. Học Node.js`
    },
    {
      title: 'Lỗi thường gặp & cách đọc', kicker: 'B01 · Debug cùng giảng viên',
      table: {
        head: ['Thông báo', 'Nguyên nhân', 'Cách sửa'],
        rows: [
          ['`Cannot find module \'./math\'`', 'Sai đường dẫn / tên file', 'Kiểm tra `./`, tên file, thư mục hiện tại'],
          ['`ENOENT: no such file or directory`', 'File không tồn tại', 'Dùng `path.join(__dirname, …)`'],
          ['`node is not recognized`', 'Chưa cài / chưa thêm PATH', 'Cài lại Node, mở terminal mới'],
          ['`Cannot use import statement outside a module`', 'Dùng `import` trong CommonJS', 'Dùng `require` hoặc đổi sang ESM (B2)'],
          ['`ReferenceError: window is not defined`', 'Dùng API trình duyệt trong Node', 'Node không có `window`/`document`']
        ]
      },
      callout: { type: 'tip', t: 'Đọc **dòng đầu tiên** và **dòng có tên file của bạn** trong stack trace — 90% lỗi nằm ở đó.' }
    }
  ],
  recap: [
    'Back-end = code chạy trên server; giao tiếp với client qua **HTTP request / response**',
    'Node.js = **V8 + libuv + API**, chạy JS ngoài trình duyệt, **single-thread + event loop**',
    'Ưu tiên **non-blocking** — không chặn luồng chính trên server',
    '`npm init`, `npm install`, `package.json`, scripts, `node_modules` (đừng commit)',
    'CommonJS: `require` / `module.exports`; core modules `fs`, `path`, `os`'
  ],
  exercises: [
    {
      level: 'warmup', time: 10, title: 'Cài đặt & kiểm tra môi trường',
      desc: 'Chuẩn bị máy để học 12 buổi tới. Chụp màn hình terminal gửi giảng viên.',
      tasks: ['Cài **Node.js LTS** và **VS Code**', 'Chạy `node -v`, `npm -v` và `git --version`', 'Tạo thư mục `ct9-backend` và mở bằng VS Code', 'Tạo file `hello.js` in ra **họ tên** và **lớp** của bạn, chạy bằng `node`'],
      expected: '$ node hello.js\nXin chào, mình là Nguyễn Văn A - lớp CT9',
      hints: ['Windows: mở **PowerShell** hoặc terminal tích hợp VS Code (Ctrl + `)', 'Nếu báo `node is not recognized` → đóng terminal, mở lại hoặc khởi động lại máy'],
      solution: { file: 'hello.js', lang: 'javascript', src: `const ten = 'Nguyễn Văn A';\nconst lop = 'CT9';\nconsole.log(\`Xin chào, mình là \${ten} - lớp \${lop}\`);` }
    },
    {
      level: 'warmup', time: 15, title: 'Vẽ sơ đồ “Gõ URL → hiển thị trang”',
      desc: 'Không cần code. Tự vẽ (giấy hoặc draw.io) sơ đồ các bước khi gõ `https://example.com/products` rồi Enter, sau đó giải thích cho bạn bên cạnh trong 1 phút.',
      tasks: ['Có đủ các bước: **DNS → TCP → HTTP request → server xử lý → response → render**', 'Ghi rõ **method** và **status code** ở request/response', 'Chỉ ra phần nào là **Front-end**, phần nào là **Back-end**'],
      hints: ['Mở DevTools → Network để quan sát request thật', 'Server trả về gì khi trang không tồn tại? (404)']
    },
    {
      level: 'core', time: 20, title: 'Lời chào theo giờ (dùng package npm)',
      desc: 'Viết chương trình nhận **tên** từ dòng lệnh và chào theo buổi trong ngày, kèm ngày giờ hiện tại (dùng `dayjs`).',
      tasks: ['`npm init -y` và `npm install dayjs`', 'Đọc tên từ `process.argv` (vd `node greet.js Lan`)', 'Chào “Chào buổi sáng / chiều / tối” theo giờ hiện tại', 'Nếu **không truyền tên**, in hướng dẫn sử dụng'],
      expected: '$ node greet.js Lan\nChào buổi sáng, Lan! Hôm nay là 26/10/2026 09:15',
      hints: ['Giờ hiện tại: `dayjs().hour()`', 'Sáng: 5–11, chiều: 12–17, còn lại: tối'],
      solution: { file: 'greet.js', lang: 'javascript', src: `const dayjs = require('dayjs');\n\nconst name = process.argv[2];\nif (!name) {\n  console.log('Dùng: node greet.js <tên>');\n  process.exit(1);\n}\n\nconst h = dayjs().hour();\nconst phase = h < 5 ? 'tối' : h < 12 ? 'sáng' : h < 18 ? 'chiều' : 'tối';\nconsole.log(\`Chào buổi \${phase}, \${name}! Hôm nay là \${dayjs().format('DD/MM/YYYY HH:mm')}\`);` }
    },
    {
      level: 'core', time: 25, title: 'Tự viết module tiện ích',
      desc: 'Tách code thành module bằng `module.exports` và `require`.',
      tasks: ['Tạo `utils.js` xuất các hàm: `sum(arr)`, `average(arr)`, `capitalize(str)`, `slugify(str)`', 'Tạo `main.js` import và gọi thử từng hàm với dữ liệu bất kỳ', '`slugify("Học Node.js Căn Bản")` → `hoc-node-js-can-ban`', 'Thêm script `"start": "node main.js"` và chạy bằng `npm start`'],
      hints: ['Bỏ dấu tiếng Việt: `str.normalize(\'NFD\').replace(/[\\u0300-\\u036f]/g, \'\')`', 'Thay `đ` → `d` riêng', 'Thay ký tự không phải chữ/số bằng `-` bằng regex `/[^a-z0-9]+/g`'],
      solution: [
        { file: 'utils.js', lang: 'javascript', src: `const sum = arr => arr.reduce((a, b) => a + b, 0);\nconst average = arr => (arr.length ? sum(arr) / arr.length : 0);\nconst capitalize = s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();\n\nconst slugify = s =>\n  s.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')\n    .replace(/đ/g, 'd').replace(/Đ/g, 'D')\n    .toLowerCase()\n    .replace(/[^a-z0-9]+/g, '-')\n    .replace(/^-+|-+$/g, '');\n\nmodule.exports = { sum, average, capitalize, slugify };` },
        { file: 'main.js', lang: 'javascript', src: `const { sum, average, capitalize, slugify } = require('./utils');\n\nconsole.log(sum([1, 2, 3, 4]));          // 10\nconsole.log(average([1, 2, 3, 4]));      // 2.5\nconsole.log(capitalize('nODE'));         // Node\nconsole.log(slugify('Học Node.js Căn Bản')); // hoc-node-js-can-ban` }
      ]
    },
    {
      level: 'core', time: 25, title: 'Logger ghi file',
      desc: 'Viết module `logger.js` ghi log có thời gian vào file `logs/app.log`. Module này sẽ được tái sử dụng trong đồ án.',
      tasks: ['Hàm `log(level, message)` ghi dạng `[2026-10-26 09:15:00] [INFO] nội dung`', 'Tự **tạo thư mục `logs/`** nếu chưa có (dùng `fs.mkdirSync` với `recursive`)', 'Xuất 3 hàm: `info`, `warn`, `error`', 'Dùng `path.join(__dirname, ...)` cho đường dẫn'],
      expected: '[2026-10-26 09:15:00] [INFO] Server started\n[2026-10-26 09:15:02] [ERROR] Cannot connect to DB',
      hints: ['`fs.appendFileSync(file, line + "\\n")`', '`fs.mkdirSync(dir, { recursive: true })` không báo lỗi nếu thư mục đã tồn tại'],
      solution: { file: 'logger.js', lang: 'javascript', src: `const fs = require('fs');\nconst path = require('path');\nconst dayjs = require('dayjs');\n\nconst dir = path.join(__dirname, 'logs');\nfs.mkdirSync(dir, { recursive: true });\nconst file = path.join(dir, 'app.log');\n\nfunction log(level, message) {\n  const line = \`[\${dayjs().format('YYYY-MM-DD HH:mm:ss')}] [\${level}] \${message}\`;\n  fs.appendFileSync(file, line + '\\n');\n  console.log(line);\n}\n\nmodule.exports = {\n  info: m => log('INFO', m),\n  warn: m => log('WARN', m),\n  error: m => log('ERROR', m)\n};` }
    },
    {
      level: 'challenge', time: 35, title: 'Notes CLI hoàn chỉnh',
      desc: 'Hoàn thiện ứng dụng ghi chú dòng lệnh từ phần demo, lưu trong `notes.json`.',
      tasks: ['`add <nội dung>` — thêm ghi chú (có `id` và `createdAt`)', '`list` — liệt kê, đánh số thứ tự', '`remove <số thứ tự>` — xóa; báo lỗi nếu số không hợp lệ', '`search <từ khóa>` — tìm ghi chú chứa từ khóa (không phân biệt hoa thường)', 'Tách logic đọc/ghi file thành module `storage.js`'],
      expected: '$ node notes.js add Mua sữa\n✅ Đã thêm\n$ node notes.js search sữa\n1. Mua sữa',
      hints: ['Viết hàm `load()` và `save(notes)` trong `storage.js`', 'Dùng `switch (cmd)` thay cho nhiều `if`', '`Number(rest[0])` rồi kiểm tra `Number.isInteger` và phạm vi'],
      solution: [
        { file: 'storage.js', lang: 'javascript', src: `const fs = require('fs');\nconst path = require('path');\nconst FILE = path.join(__dirname, 'notes.json');\n\nconst load = () => (fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : []);\nconst save = notes => fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));\n\nmodule.exports = { load, save };` },
        { file: 'notes.js', lang: 'javascript', src: `const { load, save } = require('./storage');\nconst [cmd, ...rest] = process.argv.slice(2);\nconst notes = load();\n\nswitch (cmd) {\n  case 'add':\n    notes.push({ id: Date.now(), text: rest.join(' '), createdAt: new Date().toISOString() });\n    save(notes); console.log('✅ Đã thêm'); break;\n  case 'list':\n    notes.forEach((n, i) => console.log(\`\${i + 1}. \${n.text}\`)); break;\n  case 'remove': {\n    const i = Number(rest[0]) - 1;\n    if (!Number.isInteger(i) || i < 0 || i >= notes.length) { console.log('❌ Số thứ tự không hợp lệ'); break; }\n    notes.splice(i, 1); save(notes); console.log('🗑️ Đã xóa'); break;\n  }\n  case 'search': {\n    const kw = rest.join(' ').toLowerCase();\n    notes.filter(n => n.text.toLowerCase().includes(kw)).forEach((n, i) => console.log(\`\${i + 1}. \${n.text}\`)); break;\n  }\n  default:\n    console.log('Dùng: add <nội dung> | list | remove <stt> | search <từ khóa>');\n}` }
      ]
    },
    {
      level: 'homework', time: 40, title: 'Liệt kê thư mục kiểu “tree”',
      desc: 'Viết `ls.js` nhận đường dẫn thư mục (mặc định là thư mục hiện tại) và in danh sách file/thư mục kèm dung lượng, sắp xếp theo dung lượng giảm dần.',
      tasks: ['Dùng `fs.readdirSync` + `fs.statSync`', 'Phân biệt 📁 thư mục và 📄 file (`stat.isDirectory()`)', 'Hiển thị dung lượng dễ đọc: B, KB, MB', 'Nhận đường dẫn từ `process.argv[2]`, báo lỗi thân thiện nếu thư mục không tồn tại', '**Bonus**: đệ quy in cây thư mục có thụt lề'],
      expected: '$ node ls.js .\n📄 package-lock.json   42.1 KB\n📄 notes.js            1.2 KB\n📁 node_modules        -',
      hints: ['Hàm đổi dung lượng: lặp chia 1024 cho tới khi < 1024', 'Dùng `path.join(dir, name)` trước khi gọi `statSync`'],
      solution: { file: 'ls.js', lang: 'javascript', src: `const fs = require('fs');\nconst path = require('path');\n\nconst dir = path.resolve(process.argv[2] || '.');\nif (!fs.existsSync(dir)) { console.error('❌ Không tìm thấy:', dir); process.exit(1); }\n\nconst fmt = n => {\n  const u = ['B', 'KB', 'MB', 'GB']; let i = 0;\n  while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }\n  return n.toFixed(i ? 1 : 0) + ' ' + u[i];\n};\n\nfs.readdirSync(dir)\n  .map(name => ({ name, st: fs.statSync(path.join(dir, name)) }))\n  .sort((a, b) => b.st.size - a.st.size)\n  .forEach(({ name, st }) => {\n    const icon = st.isDirectory() ? '📁' : '📄';\n    console.log(\`\${icon} \${name.padEnd(24)} \${st.isDirectory() ? '-' : fmt(st.size)}\`);\n  });` }
    },
    {
      level: 'project', time: 20, title: 'Đồ án DevBlog: khởi động',
      desc: 'Bước đầu tiên của đồ án xuyên suốt: chuẩn bị repo và lên kế hoạch.',
      tasks: ['Tạo thư mục `devblog-api`, chạy `npm init -y`, `git init`', 'Tạo `.gitignore` chứa `node_modules/` và `.env`', 'Viết `README.md`: mô tả ý tưởng, **ít nhất 8 user stories** (vd “Người dùng đăng ký tài khoản”, “Tác giả viết bài”, “Người đọc bình luận”)', 'Tạo repo GitHub và push lần đầu'],
      hints: ['User story: *Là <vai trò>, tôi muốn <việc> để <lợi ích>*', 'Chưa cần code API — chỉ cần repo sạch và kế hoạch rõ ràng']
    }
  ],
  project: {
    lead: 'Đồ án xuyên suốt: **DevBlog API** — nền tảng blog mini mà các bạn sẽ xây dần qua 12 buổi.',
    tasks: ['Tạo repo `devblog-api` (npm init, git init, `.gitignore`)', 'Viết README với ≥ 8 user stories', 'Push lên GitHub, gửi link cho giảng viên'],
    callout: { type: 'tip', t: 'Mỗi buổi sẽ có một **cột mốc** nhỏ. Commit thường xuyên với message rõ ràng.' }
  }
};
