/* ============================================================
   BUỔI 3 — Express căn bản
   ============================================================ */
SESSION_DATA[3] = {
  intro: 'Buổi "wow": học viên thấy 50 dòng http thuần co lại còn 5 dòng. Nhớ cho học viên tự gõ code, không copy. Kết thúc buổi phải có server Express + bộ định tuyến Router + Postman testing + trang HTML gọi được API bằng fetch.',
  agenda: [
    { min: 10, t: 'Ôn B2 & chữa bài tập To-do API thuần', d: 'Nỗi đau của http thuần' },
    { min: 30, t: 'Express là gì? Khởi tạo project, nodemon, Hello World', d: 'Kiến trúc tối giản, port binding' },
    { min: 35, t: 'Routing: HTTP verbs, Route params, Query string', d: 'req.params, req.query, regex constraint' },
    { min: 30, t: 'Giải phẫu req & res, Body parsing: express.json()', d: 'express-req-res diagram, limit size' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 35, t: 'Bộ định tuyến mô-đun với express.Router()', d: 'Chia nhỏ routes, prefix /api/posts' },
    { min: 30, t: 'Kiểm thử API chuyên nghiệp với Postman', d: 'Collection, Environment, Tests script' },
    { min: 20, t: 'express.static & Nối Front-end bằng fetch', d: 'Demo full-stack end-to-end' }
  ],
  slides: [
    /* ---------- SECTION 01: LÀM QUEN VỚI EXPRESS ---------- */
    { kind: 'section', no: '01', title: 'Làm quen với Express.js', sub: 'Framework web tối giản — nền móng vững chắc của hầu hết dự án Node.js.' },
    {
      title: 'Express.js là gì?', layout: 'split', ratio: '1.1fr .9fr', top: true,
      bullets: [
        '**Framework Web tối giản và linh hoạt nhất cho Node.js**: Ra đời từ năm 2010 bởi TJ Holowaychuk, hiện là thư viện web được tải nhiều nhất trên npm (>30 triệu lượt/tuần).',
        '**Triết lý "Unopinionated"**: Không ép buộc cấu trúc thư mục cứng nhắc (như Django hay Rails). Bạn toàn quyền quyết định cách tổ chức code, chọn CSDL và thư viện đi kèm.',
        '**Cung cấp 3 giá trị cốt lõi**:',
        '• **Hệ thống Routing tinh tế**: Khớp URL và HTTP Method trong tích tắc.',
        '• **Đường ống Middleware Pipeline**: Xử lý request qua nhiều lớp bảo vệ.',
        '• **Mở rộng linh hoạt đối tượng req/res**: Bổ sung hàng chục helper hữu ích như `res.json()`, `res.status()`, `res.download()`.',
        '**Nền tảng của hệ sinh thái**: Là lõi bên dưới của nhiều framework cấp cao hơn như NestJS, Sails, Feathers.'
      ],
      img: { src: 'express-logo.png', cap: 'Express.js — Framework Web chuẩn mực công nghiệp cho Node.js', h: 300 },
      callout: { type: 'info', t: 'Express không thay thế Node.js — nó chạy trực tiếp trên nền module `http` mà chúng ta đã giải phẫu ở Buổi 2.' },
      notes: 'Hỏi lớp: "Tại sao không dùng luôn http thuần mà phải cài Express?" ➔ Dẫn vào slide so sánh tiếp theo.'
    },
    {
      title: 'Cùng một server: http thuần vs Express.js',
      cols: [
        {
          h: '😫 http thuần (Dài dòng & Dễ lỗi)', cls: 'bad',
          code: { lang: 'javascript', size: 'xs', src: `const http = require('http');
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'GET' &&
      url.pathname === '/api/hello') {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    return res.end(JSON.stringify({
      message: 'Xin chào'
    }));
  }
  res.writeHead(404);
  res.end('Not Found');
}).listen(3000);` }
        },
        {
          h: '😍 Express.js (Ngắn gọn & Tinh tế)', cls: 'good',
          code: { lang: 'javascript', size: 'xs', src: `const express = require('express');
const app = express();

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Xin chào' });
});

app.listen(3000);

// Tự động set Content-Type: application/json
// Tự động JSON.stringify()
// Tự động xử lý 404 cho các route lạ!` }
        }
      ],
      callout: { type: 'tip', t: '50 dòng code thủ công của http thuần được thu gọn lại chỉ còn 5 dòng Express thanh lịch!' },
      notes: 'Đếm số dòng 2 bên để học viên thấy rõ sự tiện lợi của Express.'
    },
    {
      title: 'Khởi tạo project Express & Cấu hình nodemon', badge: 'LAB SETUP',
      term: `$ mkdir devblog-api && cd devblog-api
$ npm init -y
$ npm install express
$ npm install -D nodemon`,
      code: { file: 'package.json', lang: 'json', size: 'sm', src: `"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
},
"dependencies": {
  "express": "^4.19.2"
},
"devDependencies": {
  "nodemon": "^3.1.0"
}` },
      callout: { type: 'tip', t: '`nodemon` giám sát toàn bộ file `.js` trong dự án và tự động restart server ngay khi bạn bấm Ctrl + S. Dùng `npm run dev` trong suốt quá trình học!' }
    },
    {
      title: 'Hello, Express! Server đầu tiên và cơ chế Port Binding', badge: 'LIVE CODING',
      code: { file: 'app.js', lang: 'javascript', src: `const express = require('express');
const app = express(); // Tạo thực thể ứng dụng Express

// Đọc cổng từ biến môi trường hoặc dùng mặc định 3000
const PORT = process.env.PORT || 3000;

// Định nghĩa route trang chủ
app.get('/', (req, res) => {
  res.send('<h1>Xin chào từ máy chủ Express!</h1>');
});

// Route kiểm tra nhịp tim hệ thống (Health Check)
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Lắng nghe kết nối mạng
app.listen(PORT, () => {
  console.log(\`🚀 Máy chủ Express đang chạy tại: http://localhost:\${PORT}\`);
});` },
      term: `$ npm run dev
[nodemon] starting \`node app.js\`
🚀 Máy chủ Express đang chạy tại: http://localhost:3000`
    },
    {
      title: 'Giải phẫu một Route: app.METHOD(PATH, HANDLER)', kicker: 'B03 · Công thức nền tảng',
      code: { lang: 'javascript', size: '', src: `app.METHOD( PATH, HANDLER )
app.get ( '/api/posts', (req, res) => { ... } )` },
      cards: [
        { icon: '🔤', h: 'METHOD', p: 'Khớp phương thức HTTP: `app.get()`, `app.post()`, `app.put()`, `app.patch()`, `app.delete()`' },
        { icon: '🛣️', h: 'PATH', p: 'Đường dẫn URL trên server, hỗ trợ ký tự đại diện và tham số biến đổi: `/posts/:id`' },
        { icon: '⚙️', h: 'HANDLER', p: 'Hàm xử lý `(req, res, next)` được thực thi khi request khớp — **bắt buộc** phải kết thúc bằng một lệnh `res.*`' }
      ], cols: 3,
      callout: { type: 'info', t: 'Express kiểm tra các Route theo thứ tự khai báo từ trên xuống dưới. Route nào khớp trước sẽ được kích hoạt trước!' }
    },

    /* ---------- SECTION 02: ROUTING CHUYÊN SÂU ---------- */
    { kind: 'section', no: '02', title: 'Routing chuyên sâu & Tham số Request', sub: 'Phân loại HTTP verbs, bóc tách params, query và làm chủ req/res.' },
    {
      title: 'Các HTTP Method trong Express & Ý nghĩa chuẩn REST', layout: 'split', ratio: '1.1fr .9fr',
      code: { file: 'routes.js', lang: 'javascript', size: 'sm', src: `// 1. GET: Đọc danh sách hoặc chi tiết (Safe & Idempotent)
app.get('/api/posts',        (req, res) => res.json([]));
app.get('/api/posts/:id',    (req, res) => res.json({}));

// 2. POST: Tạo mới tài nguyên (Non-idempotent)
app.post('/api/posts',       (req, res) => res.status(201).json({}));

// 3. PUT: Thay thế toàn bộ bản ghi
app.put('/api/posts/:id',    (req, res) => res.json({}));

// 4. PATCH: Cập nhật một vài trường dữ liệu
app.patch('/api/posts/:id',  (req, res) => res.json({}));

// 5. DELETE: Xóa bỏ tài nguyên
app.delete('/api/posts/:id', (req, res) => res.sendStatus(204));` },
      table: {
        small: true,
        head: ['HTTP Method', 'Hành động', 'Mã Status trả về'],
        rows: [
          ['`GET`', 'Lấy dữ liệu (không sửa đổi DB)', '`200 OK`'],
          ['`POST`', 'Tạo mới bản ghi vào CSDL', '`201 Created`'],
          ['`PUT`', 'Ghi đè toàn bộ thông tin', '`200 OK`'],
          ['`PATCH`', 'Cập nhật từng phần (Partial update)', '`200 OK`'],
          ['`DELETE`', 'Xóa bản ghi khỏi hệ thống', '`204 No Content`']
        ]
      }
    },
    {
      title: 'Route Parameters (`req.params`): Định danh tài nguyên', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'params.js', lang: 'javascript', size: 'sm', src: `// Định nghĩa 1 tham số động :id
app.get('/api/posts/:id', (req, res) => {
  console.log(req.params); // { id: '42' }
  const postId = Number(req.params.id);

  if (Number.isNaN(postId)) {
    return res.status(400).json({ error: 'ID bài viết phải là số nguyên' });
  }

  res.json({ id: postId, title: \`Chi tiết bài viết #\${postId}\` });
});

// Định nghĩa nhiều tham số lồng nhau
app.get('/api/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId: Number(userId), postId: Number(postId) });
});` },
      bullets: [
        '**Dấu hai chấm `:`**: Đánh dấu đoạn URL phía sau là một tham số biến đổi linh hoạt.',
        '**Truy cập qua `req.params`**: Express tự động gom các tham số thành một JavaScript Object.',
        '**Cảnh báo kiểu dữ liệu**: Mọi giá trị lấy từ `req.params` **LUÔN LUÔN LÀ STRING**. Nếu ID là số, bắt buộc phải ép kiểu bằng `Number(req.params.id)`!'
      ]
    },
    {
      title: 'Query String (`req.query`): Lọc, tìm kiếm & phân trang', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'query.js', lang: 'javascript', size: 'sm', src: `// URL ví dụ: /api/posts?tag=nodejs&page=2&limit=10&sort=desc
app.get('/api/posts', (req, res) => {
  console.log(req.query);
  // { tag: 'nodejs', page: '2', limit: '10', sort: 'desc' }

  const tag = req.query.tag || 'all';
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const sort = req.query.sort === 'asc' ? 'asc' : 'desc';

  res.json({
    filter: { tag, sort },
    pagination: { page, limit },
    data: []
  });
});` },
      bullets: [
        '**Vị trí**: Nằm sau dấu chấm hỏi `?` trên URL, các cặp `key=value` nối nhau bằng dấu `&`.',
        '**Truy cập qua `req.query`**: Express tự động phân tích (parse) chuỗi query thành object.',
        '**Ứng dụng thực tế**: Dùng khi muốn lọc (Filter), tìm kiếm (Search), phân trang (Pagination), sắp xếp (Sorting).',
        '**Khác biệt cơ bản**: Query string là **tùy chọn (Optional)**, không làm thay đổi cấu trúc định tuyến URL.'
      ]
    },
    {
      title: 'So sánh: Route Params vs Query Params', kicker: 'B03 · Phân biệt chuẩn thiết kế API',
      table: {
        head: ['Tiêu chí', 'Route Params (`req.params`)', 'Query Params (`req.query`)'],
        rows: [
          ['Vị trí trên URL', 'Là một phần của đường dẫn: `/posts/:id`', 'Sau dấu `?`: `/posts?page=2&sort=desc`'],
          ['Mục đích sử dụng', 'Định danh một tài nguyên cụ thể (Định danh bắt buộc)', 'Lọc, tìm kiếm, phân trang, cấu hình hiển thị'],
          ['Tính bắt buộc', 'Bắt buộc (Nếu thiếu sẽ khớp sang route khác)', 'Tùy chọn (Không có thì dùng giá trị mặc định)'],
          ['Ví dụ thực tế', '`/api/users/105` ➔ Lấy đúng user có ID 105', '`/api/users?role=admin` ➔ Lọc tất cả user là admin']
        ]
      },
      callout: { type: 'tip', t: 'Quy tắc vàng: "Params = CÁI GÌ (Tài nguyên cụ thể) — Query = THẾ NÀO (Cách lọc & định dạng kết quả)".' }
    },
    {
      title: 'Giải phẫu toàn diện đối tượng REQ & RES trong Express', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**req (Incoming Request)**: Đại diện cho yêu cầu từ Client gửi tới.',
        '• `req.params`: Object chứa route parameters (`/posts/:id`).',
        '• `req.query`: Object chứa query string parameters (`?sort=desc`).',
        '• `req.body`: Dữ liệu gửi lên từ client (cần `express.json()`).',
        '• `req.headers` & `req.get(\'Authorization\')`: Đọc header xác thực.',
        '**res (Server Response)**: Điều khiển dữ liệu gửi ngược về Client.',
        '• `res.status(code)`: Thiết lập HTTP Status Code (200, 201, 400, 404, 500).',
        '• `res.json(payload)`: Chuyển đổi Object JS thành chuỗi JSON và gửi.',
        '• `res.cookie()` & `res.download()`: Hỗ trợ cookie và truyền tải file.'
      ],
      img: { src: 'express-req-res.svg', cap: 'Giải phẫu toàn diện đối tượng Request (req) và Response (res) trong Express', h: 360 }
    },
    {
      title: 'Lỗi kinh điển: Cannot set headers after they are sent', kicker: 'B03 · Lỗi phổ biến nhất của người mới',
      layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'double-response.js', lang: 'javascript', size: 'sm', src: `// ❌ LỖI TAI HẠI: Quên return sau khi res.json()!
app.get('/api/user', (req, res) => {
  if (!req.query.id) {
    res.status(400).json({ error: 'Thiếu ID' });
    // KHÔNG RETURN! Code vẫn chạy tiếp xuống dưới!
  }

  // Lệnh thứ 2 lại cố gửi response lần nữa ➔ CRASH!
  res.json({ name: 'Lan' });
  // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers 
  // after they are sent to the client
});

// ✅ ĐÚNG CHUẨN: LUÔN RETURN RES.*
app.get('/api/user', (req, res) => {
  if (!req.query.id) {
    return res.status(400).json({ error: 'Thiếu ID' });
  }
  return res.json({ name: 'Lan' });
});` },
      bullets: [
        '**Nguyên nhân gốc rễ**: Một chu trình HTTP Request chỉ được phép có **DUY NHẤT MỘT** HTTP Response đóng gói gửi về. Gửi lần 2 sẽ vi phạm giao thức mạng.',
        '**res.json() không tự dừng hàm**: Khác với `return`, lệnh `res.json()` chỉ gửi dữ liệu xuống socket mạng chứ không kết thúc hàm hiện tại!',
        '**Giải pháp phòng ngừa**: Hãy tạo thói quen gõ `return res.status(...).json(...)` trong mọi khối điều kiện `if`!'
      ],
      callout: { type: 'danger', t: 'Nhớ kỹ: `res.json()` chỉ gửi dữ liệu, còn `return` mới là lệnh thoát hàm JavaScript!' }
    },
    {
      title: 'Thứ tự khai báo Route quyết định kết quả', badge: 'QUIZ',
      code: { file: 'route-order.js', lang: 'javascript', size: 'sm', src: `// Route 1 có tham số :id
app.get('/api/users/:id', (req, res) => {
  res.send('Chi tiết User: ' + req.params.id);
});

// Route 2 có path tĩnh cụ thể /me
app.get('/api/users/me', (req, res) => {
  res.send('Hồ sơ cá nhân của tôi');
});` },
      quiz: {
        q: 'Khi Client gửi GET /api/users/me thì nhận được kết quả nào?',
        opts: ['“Hồ sơ cá nhân của tôi”', '“Chi tiết User: me”', 'Mã lỗi 404 Not Found', 'Bị lỗi Crash Server'],
        a: 1,
        why: 'Express khớp Route tuần tự từ trên xuống dưới. Tham số :id khớp với bất kỳ chuỗi nào, kể cả chữ "me". Do đó Route 1 bắt mất request! Quy tắc: Luôn đặt Route tĩnh cụ thể (/me) nằm TRƯỚC Route có tham số động (/:id).'
      }
    },

    /* ---------- SECTION 03: BODY PARSING ---------- */
    { kind: 'section', no: '03', title: 'Body Parsing & Tiếp nhận Dữ liệu', sub: 'Giải mã dữ liệu gửi lên từ Front-end qua JSON và Form URL-Encoded.' },
    {
      title: 'Vì sao req.body mặc định là undefined?', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'no-body-parser.js', lang: 'javascript', size: 'sm', src: `const express = require('express');
const app = express();

// ❌ Chưa khai báo middleware express.json()
app.post('/api/posts', (req, res) => {
  console.log(req.body); // undefined !
  
  // Sẽ gây lỗi: TypeError: Cannot destructure property 'title' of req.body as it is undefined.
  const { title } = req.body; 
  res.json({ title });
});` },
      bullets: [
        '**Triết lý hiệu năng của Express**: Không tự ý giải mã body cho mọi request để tiết kiệm RAM và CPU (ví dụ request GET không có body thì không cần tốn công parse).',
        '**Cần Middleware hỗ trợ**: Để Express tự động gom các chunk nhị phân qua stream mạng và `JSON.parse` vào `req.body`, ta bắt buộc phải bật bộ lọc **Middleware** tương ứng.',
        '**Middleware là gì?**: Là một hàm can thiệp vào giữa chu trình (ở giữa lúc Request đến và lúc Route Handler xử lý).'
      ]
    },
    {
      title: 'Bộ đôi Middleware chuẩn: express.json() & urlencoded()', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'body-parsers.js', lang: 'javascript', size: 'sm', src: `const express = require('express');
const app = express();

// 1. Giải mã payload gửi dạng JSON (Content-Type: application/json)
app.use(express.json({ limit: '1mb' }));

// 2. Giải mã payload gửi từ Form HTML (Content-Type: application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.post('/api/posts', (req, res) => {
  const { title, content, author } = req.body;

  // Validate dữ liệu đầu vào bắt buộc
  if (!title || !content) {
    return res.status(400).json({ 
      error: 'Tiêu đề (title) và nội dung (content) không được để trống' 
    });
  }

  res.status(201).json({
    id: Date.now(),
    title,
    content,
    author: author || 'Ẩn danh'
  });
});` },
      bullets: [
        '**`express.json()`**: Kiểm tra nếu `Content-Type: application/json`, tự động đọc stream và gán object vào `req.body`.',
        '**`express.urlencoded({ extended: true })`**: Hỗ trợ bóc tách mảng và object lồng nhau gửi lên từ `<form>` truyền thống.',
        '**Tham số `limit: \'1mb\'`**: Rất quan trọng! Giới hạn dung lượng tối đa chống tin tặc gửi JSON dung lượng hàng chục MB làm tràn bộ nhớ server (DoS Attack).'
      ]
    },

    /* ---------- SECTION 04: MODULAR ROUTING ---------- */
    { kind: 'section', no: '04', title: 'Bộ định tuyến mô-đun (express.Router)', sub: 'Tổ chức kiến trúc dự án chuyên nghiệp thay vì nhồi nhét vào một file duy nhất.' },
    {
      title: 'Vấn đề khi dồn toàn bộ code vào file app.js duy nhất', kicker: 'B03 · Nợ kỹ thuật (Technical Debt)',
      layout: 'split', ratio: '1.1fr .9fr',
      bullets: [
        '**Khi dự án phát triển lên 50–100 endpoints**:',
        { t: 'File `app.js` phình to lên hàng ngàn dòng code.', sub: ['Xung đột code (Git Merge Conflict) liên tục xảy ra khi nhiều lập trình viên cùng chỉnh sửa file `app.js`.', 'Khó khăn trong việc bảo trì, debug và tìm kiếm route liên quan.', 'Vi phạm nghiêm trọng nguyên tắc Single Responsibility Principle (SRP).'] },
        '**Giải pháp kiến trúc công nghiệp**: Sử dụng **`express.Router()`** để phân rã ứng dụng thành các module chức năng riêng biệt (Auth Router, Post Router, User Router, Comment Router).'
      ],
      img: { src: 'clean-architecture.svg', cap: 'Kiến trúc phân tầng: Router tách biệt làm nhiệm vụ định tuyến tiền tuyến', dark: true, h: 420 }
    },
    {
      title: 'Tạo Route con độc lập với express.Router()', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'routes/postRoutes.js', lang: 'javascript', size: 'sm', src: `const express = require('express');
// Khởi tạo mini-app Router riêng
const router = express.Router();

// Dữ liệu mẫu tạm thời in-memory
let posts = [
  { id: 1, title: 'Bài viết Node.js căn bản' }
];

// GET / (Sẽ tự động nhận tiền tố ở file app.js)
router.get('/', (req, res) => {
  res.json({ total: posts.length, data: posts });
});

// GET /:id
router.get('/:id', (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).json({ error: 'Bài viết không tồn tại' });
  res.json(post);
});

// Xuất router để app.js nhúng vào
module.exports = router;` },
      bullets: [
        '**`express.Router()` như một mini-app**: Có đầy đủ các hàm `.get()`, `.post()`, `.use()` tương tự như `app`.',
        '**Độc lập & Tái sử dụng**: File `postRoutes.js` chỉ quan tâm tới các route liên quan đến bài viết, không bị phụ thuộc vào cấu hình server chung.',
        '**Xuất chuẩn CommonJS**: Cuối file luôn gọi `module.exports = router;`.'
      ]
    },
    {
      title: 'Gắn Prefix đường dẫn trong app.js: app.use(\'/api/posts\', ...)', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'app.js', lang: 'javascript', size: 'sm', src: `const express = require('express');
const app = express();

// 1. Nạp middleware phân tích JSON
app.use(express.json());

// 2. Nhập các router mô-đun
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');

// 3. Gắn tiền tố (URL Prefix) cho từng module:
// Mọi route trong postRoutes sẽ bắt đầu bằng /api/posts
app.use('/api/posts', postRoutes);

// Mọi route trong userRoutes sẽ bắt đầu bằng /api/users
app.use('/api/users', userRoutes);

// 4. Route 404 đặt cuối cùng
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint không tồn tại' });
});

app.listen(3000);` },
      bullets: [
        '**Kỹ thuật URL Prefixing**: Lệnh `app.use(\'/api/posts\', postRoutes)` sẽ tự động nối tiền tố `/api/posts` vào trước mọi route con.',
        '**Gọn gàng trong router con**: Trong `postRoutes.js`, ta chỉ cần viết `router.get(\'/\')` (tương đương `/api/posts`) và `router.get(\'/:id\')` (tương đương `/api/posts/:id`).',
        '**Dễ dàng bảo trì**: Nếu cần đổi tiền tố sang `/v1/posts`, ta chỉ cần sửa đúng 1 dòng duy nhất trong file `app.js`!'
      ]
    },
    {
      title: 'Cấu trúc thư mục chuẩn cho dự án Express REST API', kicker: 'B03 · Tổ chức mã nguồn chuẩn',
      term: `devblog-api/
├── package.json          # Quản lý dependencies & scripts
├── app.js                # Điểm khởi động ứng dụng & cấu hình middleware
├── routes/               # Thư mục chứa các bộ định tuyến mô-đun
│   ├── authRoutes.js     # Đăng ký, đăng nhập (/api/auth)
│   ├── postRoutes.js     # CRUD bài viết (/api/posts)
│   └── userRoutes.js     # Quản lý thành viên (/api/users)
├── public/               # Thư mục chứa tài nguyên tĩnh cho Front-end
│   ├── index.html        # Giao diện web demo
│   ├── style.css         # CSS làm đẹp
│   └── app.js            # JavaScript gọi fetch()
└── data/                 # Dữ liệu mẫu ban đầu
    └── posts.json        # File JSON seed bài viết`,
      callout: { type: 'tip', t: 'Cấu trúc thư mục ngăn nắp giúp dự án dễ dàng mở rộng khi bước sang các buổi học về Controller, Service và CSDL MySQL sau này!' }
    },

    /* ---------- SECTION 05: KIỂM THỬ VỚI POSTMAN ---------- */
    { kind: 'section', no: '05', title: 'Kiểm thử API chuyên nghiệp với Postman', sub: 'Thành thạo công cụ kiểm thử tiêu chuẩn công nghiệp của mọi lập trình viên Back-end.' },
    {
      title: 'Postman — “Trình duyệt” Chuyên dụng dành cho API', badge: 'CÔNG CỤ THIẾT YẾU',
      layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**Tại sao Trình duyệt (Chrome/Firefox) là chưa đủ?**',
        { t: 'Thanh URL của trình duyệt **chỉ gửi được request `GET`**.', sub: ['Không thể gõ gửi dữ liệu `POST` (tạo tài khoản, đăng bài).', 'Không thể tùy biến Headers (`Authorization`, `Content-Type: application/json`).'] },
        '**Các tính năng cốt lõi của Postman trong phát triển phần mềm**:',
        { t: 'Soạn thảo & Kiểm thử mọi phương thức HTTP: `GET`, `POST`, `PUT`, `DELETE`.', sub: ['Quản lý **Collections**: Nhóm các API của dự án theo thư mục (Auth, Posts, Users).', 'Biến môi trường (**Environment Variables**): Đổi từ `localhost:3000` sang Cloud chỉ với 1 click.', 'Viết kịch bản kiểm thử tự động (**Tests Assertion**): Đo status code `200 OK` và cấu trúc JSON.'] }
      ],
      steps: [
        { h: '1. Tạo Request', p: 'Chọn method `POST`, nhập URL `http://localhost:3000/api/posts`' },
        { h: '2. Nhập Body', p: 'Chọn tab **Body → raw → JSON**, nhập dữ liệu bài viết mới' },
        { h: '3. Gửi & Xem kết quả', p: 'Bấm **Send** → xem Status Code, thời gian phản hồi và JSON Body' },
        { h: '4. Lưu Collection', p: 'Bấm **Save** để lưu lại và xuất file chia sẻ cho đồng nghiệp' }
      ],
      img: { src: 'postman-logo.png', cap: 'Postman — Nền tảng kiểm thử API hàng đầu thế giới', h: 300 }
    },
    {
      title: 'Quản lý Biến môi trường (Environment Variables) trong Postman', layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**Vấn đề khi gõ cứng URL**: Nếu bạn gõ `http://localhost:3000` trong 50 request, khi đổi sang cổng `http://localhost:8080` hoặc domain staging `https://devblog.vn`, bạn sẽ phải sửa thủ công 50 lần!',
        '**Biến môi trường `{{baseUrl}}`**:',
        { t: 'Tạo Environment tên là **"Local Dev"**.', sub: ['Thêm biến: `baseUrl` = `http://localhost:3000`', 'Thêm biến: `token` = `""` (lưu token sau khi đăng nhập)'] },
        '**Cách dùng trong thanh URL Postman**: `{{baseUrl}}/api/posts/:id`',
        '**Chuyển đổi môi trường tức thì**: Chỉ cần bấm dropdown góc phải để chuyển từ "Local Dev" sang "Staging Cloud" mà không cần sửa bất kỳ request nào!'
      ],
      term: `GET {{baseUrl}}/api/posts?page=1&limit=5
Authorization: Bearer {{token}}

HTTP/1.1 200 OK
Time: 12 ms
Size: 1.2 KB`
    },
    {
      title: 'Viết kịch bản kiểm thử tự động (Tests Assertion) trong Postman', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'Postman Tests Tab', lang: 'javascript', size: 'sm', src: `// 1. Kiểm tra HTTP Status Code trả về đúng 200 OK
pm.test("Status code phải là 200", function () {
  pm.response.to.have.status(200);
});

// 2. Kiểm tra thời gian phản hồi nhanh < 200ms
pm.test("Thời gian phản hồi nhanh < 200ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(200);
});

// 3. Phân tích JSON body và kiểm tra cấu trúc dữ liệu
pm.test("Cấu trúc trả về phải có mảng data", function () {
  const jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property('data');
  pm.expect(jsonData.data).to.be.an('array');
});

// 4. Tự động lưu biến Token để dùng cho các request tiếp theo
if (pm.response.code === 200) {
  const res = pm.response.json();
  if (res.token) {
    pm.environment.set("token", res.token);
    console.log("🔑 Đã tự động cập nhật token mới!");
  }
}` },
      bullets: [
        '**Tự động hóa kiểm thử (CI/CD Ready)**: Giúp lập trình viên kiểm tra toàn bộ 50 API chỉ bằng nút bấm **"Run Collection"**.',
        '**Thư viện Chai Assertion có sẵn**: Cung cấp các hàm kiểm tra ngữ nghĩa trực quan như `expect().to.be...`.',
        '**Chuyển giao Token tự động**: Không cần copy paste token thủ công giữa API đăng nhập và các API cần xác thực!'
      ]
    },

    /* ---------- SECTION 06: PHỤC VỤ STATIC & NỐI FRONTEND ---------- */
    { kind: 'section', no: '06', title: 'Phục vụ Static Files & Nối Front-end', sub: 'Hợp nhất Front-end và Back-end thành một ứng dụng web hoàn chỉnh.' },
    {
      title: 'Phục vụ tập tin tĩnh với express.static', layout: 'split', ratio: '1fr 1fr',
      code: { file: 'app.js', lang: 'javascript', size: 'sm', src: `const path = require('path');

// Đăng ký thư mục public là thư mục phục vụ tĩnh
app.use(express.static(path.join(__dirname, 'public')));

// Quy tắc map tự động của express.static:
// GET /             ➔ Trả về file public/index.html
// GET /style.css    ➔ Trả về file public/style.css
// GET /app.js       ➔ Trả về file public/app.js
// GET /logo.png     ➔ Trả về file public/logo.png` },
      term: `devblog-api/
├── app.js
├── package.json
└── public/
    ├── index.html   (Giao diện)
    ├── style.css    (CSS)
    └── app.js       (Fetch API)`,
      callout: { type: 'tip', t: 'Từ giờ, máy chủ Express vừa đóng vai trò Web Server phục vụ giao diện tĩnh (HTML/CSS), vừa là REST API Server cung cấp dữ liệu JSON!' }
    },
    {
      title: 'Demo: Front-end gọi API bằng fetch()', badge: 'LIVE CODING',
      cols: [
        {
          h: '1. public/index.html',
          code: { file: 'index.html', lang: 'xml', size: 'xs', src: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>DevBlog Client</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>DevBlog Mini</h1>
  <button id="btnLoad">Tải danh sách bài viết</button>
  <ul id="postList"></ul>
  <script src="app.js"></script>
</body>
</html>` }
        },
        {
          h: '2. public/app.js (Front-end JS)',
          code: { file: 'app.js', lang: 'javascript', size: 'xs', src: `const btn = document.querySelector('#btnLoad');
const list = document.querySelector('#postList');

btn.addEventListener('click', async () => {
  try {
    btn.disabled = true;
    btn.textContent = 'Đang tải...';

    // Gọi API của server Express:
    const res = await fetch('/api/posts');
    const posts = await res.json();

    // Render danh sách lên màn hình:
    list.innerHTML = posts.map(p => 
      \`<li><strong>\${p.title}</strong> (\${p.author})</li>\`
    ).join('');
  } catch (err) {
    alert('Lỗi kết nối API!');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Tải lại danh sách';
  }
});` }
        }
      ],
      callout: { type: 'demo', t: 'Chúc mừng bạn! Front-end (HTML/CSS/JS) và Back-end (Node.js/Express) đã chính thức gặp nhau thành công!' }
    },
    {
      title: 'HTTP Headers & Đàm phán Nội dung (Content Negotiation)', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'headers.js', lang: 'javascript', size: 'sm', src: `app.get('/api/resource', (req, res) => {
  // Đọc header an toàn qua hàm helper req.get()
  const userAgent = req.get('User-Agent');
  const authHeader = req.get('Authorization');
  const acceptType = req.get('Accept');

  // Đàm phán kiểu dữ liệu trả về theo yêu cầu của Client
  if (req.accepts('json')) {
    return res.json({ message: 'Định dạng JSON', userAgent });
  }
  if (req.accepts('html')) {
    return res.send('<h1>Định dạng HTML</h1>');
  }
  
  res.status(406).send('Not Acceptable');
});` },
      bullets: [
        '**`req.get(\'Header-Name\')`**: Đọc header không phân biệt chữ hoa chữ thường (Case-insensitive). Luôn ưu tiên dùng hàm này thay vì `req.headers[...]`.',
        '**Content Negotiation (Đàm phán nội dung)**: Header `Accept` cho phép client chỉ định định dạng mong muốn (`application/json`, `text/html`, `application/xml`).',
        '**`req.accepts(type)`**: Trả về loại MIME phù hợp nhất hoặc `false` nếu không tương thích.'
      ]
    },
    {
      title: 'Tải tập tin về máy Client với res.download() & res.sendFile()', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'downloads.js', lang: 'javascript', size: 'sm', src: `const path = require('path');

// 1. res.sendFile: Trình duyệt mở xem trực tiếp nếu hỗ trợ (PDF, ảnh)
app.get('/reports/preview', (req, res) => {
  const file = path.join(__dirname, 'reports', 'annual.pdf');
  res.sendFile(file);
});

// 2. res.download: Ép trình duyệt bật cửa sổ Save As tải về đĩa
app.get('/reports/download', (req, res) => {
  const file = path.join(__dirname, 'reports', 'annual.pdf');
  // Tham số thứ 2 là tên file hiển thị khi tải về máy
  res.download(file, 'Bao-cao-tai-chinh-2026.pdf', (err) => {
    if (err) {
      console.error('Lỗi truyền tải file:', err);
    }
  });
});` },
      bullets: [
        '**`res.sendFile(absolutePath)`**: Phục vụ file nhị phân qua đường dẫn tuyệt đối (Absolute Path).',
        '**`res.download(path, filename)`**: Tự động gắn header `Content-Disposition: attachment; filename="..."` buộc trình duyệt phải tải về thay vì hiển thị trực tiếp.',
        '**Hỗ trợ Stream ngầm**: Cả hai hàm đều dùng Stream để truyền tải file, an toàn với các file dung lượng lớn.'
      ]
    },
    {
      title: 'Tiền xử lý kịch bản với Pre-request Scripts trong Postman', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'Postman Pre-request Tab', lang: 'javascript', size: 'sm', src: `// Tự động sinh dữ liệu ngẫu nhiên trước khi gửi Request
const randomId = Math.floor(Math.random() * 10000);
pm.environment.set("temp_post_id", randomId);

const timestamp = new Date().toISOString();
pm.environment.set("request_time", timestamp);

// Tự động sinh email ngẫu nhiên để test API đăng ký
const randomEmail = "user_" + Date.now() + "@ct9.edu.vn";
pm.environment.set("new_email", randomEmail);

console.log("🚀 Chuẩn bị gửi request với email:", randomEmail);` },
      bullets: [
        '**Pre-request Script chạy trước khi request phát đi**: Giúp chuẩn bị dữ liệu động, mã hóa chữ ký HMAC hoặc sinh email ngẫu nhiên.',
        '**Tránh trùng lặp dữ liệu khi test**: Thử nghiệm API đăng ký tài khoản liên tục mà không bị báo lỗi "Email đã tồn tại"!',
        '**Tích hợp `console.log()`**: Xem trực tiếp nhật ký luồng chạy trong cửa sổ Postman Console (Ctrl + Alt + C).'
      ]
    },
    {
      title: 'Kiểm thử các trường hợp biên (Edge Cases & Malformed Payloads)', kicker: 'B03 · Tư duy kiểm thử vững vàng',
      table: {
        head: ['Tình huống kiểm thử', 'Dữ liệu gửi lên', 'Kết quả mong đợi', 'Hành vi cần tránh'],
        rows: [
          ['Body không phải JSON', 'Chuỗi text thường hoặc XML', '`400 Bad Request` dạng JSON', 'Server bị Crash hoặc trả HTML 500'],
          ['Dung lượng vượt quá giới hạn', 'File JSON > 1MB', '`413 Payload Too Large`', 'Server ngốn RAM và bị đơ luồng'],
          ['Thiếu trường bắt buộc', '`{ "content": "..." }` (thiếu title)', '`400 Bad Request` + message rõ ràng', 'Lưu bản ghi rác hoặc lỗi undefined'],
          ['Trường sai kiểu dữ liệu', '`{ "title": 12345, "a": "abc" }`', '`400 Bad Request` (Báo lỗi kiểu)', 'Tính toán NaN hoặc sai lệch logic'],
          ['ID URL không tồn tại', '`GET /api/posts/999999`', '`404 Not Found`', 'Trả 200 kèm null hoặc lỗi rỗng']
        ]
      },
      callout: { type: 'warn', t: 'Một API đạt chuẩn công nghiệp phải xử lý mượt mà và trả mã lỗi chính xác cho TẤT CẢ các trường hợp biên trên!' }
    },
    {
      title: 'Tổ chức Route chuyên nghiệp: Gom nhóm theo tài nguyên', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'routes/postRoutes.js', lang: 'javascript', size: 'sm', src: `const express = require('express');
const router = express.Router();

// Gom nhóm theo cùng đường dẫn '/'
router.route('/')
  .get((req, res) => {
    res.json({ message: 'Danh sách bài viết' });
  })
  .post((req, res) => {
    res.status(201).json({ message: 'Tạo bài viết mới' });
  });

// Gom nhóm theo cùng đường dẫn '/:id'
router.route('/:id')
  .get((req, res) => {
    res.json({ message: 'Xem bài #' + req.params.id });
  })
  .put((req, res) => {
    res.json({ message: 'Cập nhật bài #' + req.params.id });
  })
  .delete((req, res) => {
    res.sendStatus(204);
  });

module.exports = router;` },
      bullets: [
        '**Cú pháp `router.route(path)`**: Cho phép xâu chuỗi nhiều HTTP verb (`.get()`, `.post()`, `.put()`, `.delete()`) trên cùng một URL path.',
        '**Tránh lặp lại đường dẫn**: Không phải gõ lại chuỗi `\'/:id\'` nhiều lần, giảm thiểu nguy cơ gõ sai chính tả.',
        '**Chuẩn mực RESTful**: Phản ánh trực quan tư duy hướng tài nguyên (Resource-oriented architecture).'
      ]
    },
    {
      title: 'Đồ án DevBlog: Kiến trúc luồng End-to-End Buổi 3', kicker: 'B03 · Bức tranh tổng quan',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**1. Tầng Client (Trình duyệt)**: Nạp giao diện tĩnh từ thư mục `public/` qua `express.static`. Người dùng bấm nút "Tải bài viết".',
        '**2. Kích hoạt Network Request**: Mã JavaScript Front-end gọi `fetch(\'/api/posts\')` gửi HTTP GET Request.',
        '**3. Tầng Gateway Express (app.js)**: Định tuyến URL bắt đầu bằng `/api/posts` chuyển giao cho `postRoutes.js`.',
        '**4. Tầng Xử lý Dữ liệu**: `postRoutes` nạp file `data/posts.json` bằng `fs/promises` bất đồng bộ.',
        '**5. Đóng gói Phản hồi**: Trả về `200 OK` kèm mảng JSON ➔ Front-end render thẻ `<li>` hiển thị lên giao diện.'
      ],
      img: { src: 'three-tier-enterprise.svg', cap: 'Mô hình kiến trúc 3 tầng chuẩn doanh nghiệp: Client ➔ App Gateway ➔ Data Tier (Wikipedia)', h: 520 },
      callout: { type: 'tip', t: 'Đây là cột mốc quan trọng nhất: Hệ thống đã thông suốt từ Giao diện ➔ Mạng ➔ Server ➔ Dữ liệu!' }
    },
    {
      title: 'Bảng tổng hợp mã lỗi thường gặp trong Express & Cách sửa', kicker: 'B03 · Sổ tay sửa lỗi',
      table: {
        head: ['Mã lỗi / Thông báo', 'Nguyên nhân thực tế', 'Cách khắc phục chuẩn'],
        rows: [
          ['`Cannot GET /xyz` (404)', 'Chưa khai báo route hoặc gõ sai method HTTP', 'Kiểm tra path và method trong file router; kiểm tra tiền tố prefix'],
          ['`req.body` là `undefined`', 'Quên bật middleware `express.json()` hoặc sai header', 'Khai báo `app.use(express.json())` nằm TRƯỚC các routes; kiểm tra header `Content-Type`'],
          ['`EADDRINUSE: port 3000`', 'Cổng 3000 đang bị chiếm bởi một chương trình khác', 'Tắt tiến trình Node đang chạy ngầm hoặc đổi `PORT = 3001`'],
          ['`Cannot set headers after they are sent`', 'Gọi `res.json()` hoặc `res.send()` hai lần trong 1 handler', 'Thêm lệnh `return` phía trước `res.status().json()`'],
          ['Trình duyệt quay mãi không thôi', 'Route Handler quên không gọi bất kỳ lệnh `res.*` nào', 'Đảm bảo mọi nhánh code (kể cả if/else) đều kết thúc bằng `res.end/json/send`']
        ]
      }
    },
    {
      title: 'Nhìn về Buổi 4: Nghệ thuật Middleware & Kiểm soát luồng', kicker: 'B03 · Tiền đề buổi sau',
      layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**Những câu hỏi mở ra cho Buổi 4**:',
        '• Làm sao để ghi log (Logger) tự động mỗi khi có bất kỳ ai truy cập website?',
        '• Làm sao để chặn người lạ không có Token trước khi họ bước vào xem dữ liệu nhạy cảm?',
        '• Làm sao để bắt toàn bộ lỗi ngoại lệ tập trung tại một nơi duy nhất mà không cần viết lặp lại try/catch ở 100 routes?',
        '• Tại sao trình duyệt lại chặn kết nối khi gọi API từ domain khác (**CORS Error**)?',
        '**Câu trả lời**: Toàn bộ bí mật nằm ở cơ chế **Middleware Pipeline** của Express mà chúng ta sẽ khai phá ở Buổi 4!'
      ],
      img: { src: 'express-logo.png', cap: 'Buổi 4: Express Middleware & Error Handling chuyên sâu', h: 280 },
      callout: { type: 'tip', t: 'Về nhà hãy hoàn thành toàn bộ bài tập tạo API và Postman Collection để chuẩn bị cho Buổi 4 thật bùng nổ!' }
    }
  ],
  recap: [
    'Express = Framework web tối giản chạy trên nền `http`: cú pháp tinh gọn `app.METHOD(path, handler)`',
    'Bộ 3 tham số request: `req.params` (đường dẫn định danh) · `req.query` (lọc & tìm kiếm) · `req.body` (dữ liệu payload)',
    '`express.json({ limit: "1mb" })` bắt buộc phải có để đọc body JSON an toàn',
    '`res.json()`, `res.status().json()`; quy tắc sống còn: mỗi request chỉ có **duy nhất một response** (luôn có return)',
    'Bộ định tuyến mô-đun **`express.Router()`** giúp chia nhỏ dự án chuyên nghiệp và gắn tiền tố prefix sạch sẽ',
    '`express.static` phục vụ tài nguyên tĩnh cho Front-end; **Postman** là công cụ kiểm thử thiết yếu không thể thiếu'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Khởi động project Express',
      desc: 'Dựng project mới với Express và nodemon.',
      tasks: ['`npm init -y`, cài `express` và `nodemon` (dev)', 'Thêm script `dev` và `start`', 'Route `GET /` trả “Xin chào Express!”', 'Dùng `process.env.PORT || 3000`', 'Sửa nội dung → xác nhận nodemon tự restart'],
      hints: ['Nhớ `app.listen`', 'Gõ `rs` + Enter trong terminal nodemon để restart thủ công'],
      solution: { file: 'app.js', lang: 'javascript', src: `const express = require('express');\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\napp.get('/', (req, res) => res.send('Xin chào Express!'));\n\napp.listen(PORT, () => console.log(\`http://localhost:\${PORT}\`));` }
    },
    {
      level: 'core', time: 25, title: 'API tính toán nhỏ',
      desc: 'Thực hành params và query, kèm kiểm tra dữ liệu đầu vào.',
      tasks: ['`GET /api/about` → JSON gồm tên bạn, lớp, ngày hiện tại', '`GET /api/hello/:name` → `{ message: "Xin chào <name>" }`', '`GET /api/add?a=1&b=2` → `{ result: 3 }`', 'Nếu `a`/`b` **không phải số** → status **400** và `{ error: "..." }`', 'Route lạ → 404 JSON'],
      expected: 'GET /api/add?a=5&b=7  → 200 {"result":12}\nGET /api/add?a=x&b=7  → 400 {"error":"a và b phải là số"}',
      hints: ['`Number(req.query.a)`; kiểm tra `Number.isNaN`', 'Nhớ `return` khi trả lỗi'],
      solution: { file: 'app.js', lang: 'javascript', size: 'sm', src: `const express = require('express');\nconst app = express();\n\napp.get('/api/about', (req, res) => res.json({ name: 'Nguyễn Văn A', class: 'CT9', date: new Date() }));\n\napp.get('/api/hello/:name', (req, res) => res.json({ message: 'Xin chào ' + req.params.name }));\n\napp.get('/api/add', (req, res) => {\n  const a = Number(req.query.a), b = Number(req.query.b);\n  if (Number.isNaN(a) || Number.isNaN(b)) {\n    return res.status(400).json({ error: 'a và b phải là số' });\n  }\n  res.json({ result: a + b });\n});\n\napp.use((req, res) => res.status(404).json({ error: 'Not Found' }));\napp.listen(3000);` }
    },
    {
      level: 'core', time: 25, title: 'POST /api/calc',
      desc: 'Nhận JSON body và trả kết quả phép tính.',
      tasks: ['Body: `{ "a": 10, "b": 5, "op": "+" }` với `op` thuộc `+ - * /`', 'Trả `{ result }`', 'Chia cho 0 → 400 “Không thể chia cho 0”', '`op` không hợp lệ → 400', 'Test **bằng Postman** (gửi cả trường hợp đúng và sai)'],
      hints: ['Cần `app.use(express.json())`', 'Dùng `switch(op)`'],
      solution: { file: 'calc.js', lang: 'javascript', size: 'sm', src: `app.use(express.json());\n\napp.post('/api/calc', (req, res) => {\n  const { a, b, op } = req.body;\n  if (typeof a !== 'number' || typeof b !== 'number') {\n    return res.status(400).json({ error: 'a và b phải là số' });\n  }\n  let result;\n  switch (op) {\n    case '+': result = a + b; break;\n    case '-': result = a - b; break;\n    case '*': result = a * b; break;\n    case '/':\n      if (b === 0) return res.status(400).json({ error: 'Không thể chia cho 0' });\n      result = a / b; break;\n    default: return res.status(400).json({ error: 'Phép toán không hợp lệ' });\n  }\n  res.json({ result });\n});` }
    },
    {
      level: 'core', time: 30, title: 'Trang web gọi API bằng fetch',
      desc: 'Nối Front-end đã học với Back-end vừa viết.',
      tasks: ['Thư mục `public/` có `index.html`, `style.css`, `app.js`', 'Dùng `express.static` để phục vụ', 'Form nhập `a`, `b`, chọn phép tính → gọi `POST /api/calc` bằng `fetch`', 'Hiển thị kết quả **hoặc** thông báo lỗi (màu đỏ) trên trang', 'Làm đẹp bằng CSS tùy ý'],
      hints: ['`fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })`', 'Kiểm tra `res.ok` trước khi đọc kết quả'],
      solution: { file: 'public/app.js', lang: 'javascript', size: 'sm', src: `document.querySelector('#form').addEventListener('submit', async (e) => {\n  e.preventDefault();\n  const a = Number(e.target.a.value), b = Number(e.target.b.value);\n  const op = e.target.op.value;\n  const out = document.querySelector('#out');\n\n  const res = await fetch('/api/calc', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ a, b, op })\n  });\n  const data = await res.json();\n\n  out.style.color = res.ok ? 'green' : 'crimson';\n  out.textContent = res.ok ? 'Kết quả: ' + data.result : data.error;\n});` }
    },
    {
      level: 'core', time: 20, title: 'Postman Collection',
      desc: 'Tập thói quen test API có hệ thống.',
      tasks: ['Tạo Collection **“CT9 – B3”**', 'Có ≥ 6 request gồm cả **thành công** và **lỗi** (400, 404)', 'Dùng **biến** `{{baseUrl}}` = `http://localhost:3000`', 'Tab **Tests** của 2 request: `pm.test("status 200", () => pm.response.to.have.status(200))`', 'Export collection ra file JSON nộp kèm bài'],
      hints: ['Variables nằm ở tab Variables của Collection', 'Chạy cả collection bằng nút **Run**']
    },
    {
      level: 'challenge', time: 40, title: 'URL Shortener',
      desc: 'Rút gọn link giống bit.ly (lưu trong bộ nhớ).',
      tasks: ['`POST /shorten` body `{ "url": "https://..." }` → `{ code, shortUrl }` (code ngẫu nhiên 6 ký tự)', 'Kiểm tra URL hợp lệ (dùng `new URL()` trong try/catch) → sai thì 400', '`GET /:code` → **redirect 302** về URL gốc; không có → 404', '`GET /stats/:code` → số lượt click', 'Đặt route `/stats/:code` **trước** `/:code`'],
      hints: ['Mã ngẫu nhiên: `Math.random().toString(36).slice(2, 8)`', 'Lưu `Map` hoặc object: `{ code: { url, clicks } }`'],
      solution: { file: 'shortener.js', lang: 'javascript', size: 'sm', src: `const express = require('express');\nconst app = express();\napp.use(express.json());\nconst links = new Map();\n\napp.post('/shorten', (req, res) => {\n  try { new URL(req.body.url); }\n  catch { return res.status(400).json({ error: 'URL không hợp lệ' }); }\n  const code = Math.random().toString(36).slice(2, 8);\n  links.set(code, { url: req.body.url, clicks: 0 });\n  res.status(201).json({ code, shortUrl: \`\${req.protocol}://\${req.get('host')}/\${code}\` });\n});\n\napp.get('/stats/:code', (req, res) => {\n  const l = links.get(req.params.code);\n  if (!l) return res.status(404).json({ error: 'Không tìm thấy' });\n  res.json({ code: req.params.code, ...l });\n});\n\napp.get('/:code', (req, res) => {\n  const l = links.get(req.params.code);\n  if (!l) return res.status(404).json({ error: 'Không tìm thấy' });\n  l.clicks++;\n  res.redirect(l.url);\n});\n\napp.listen(3000);` }
    },
    {
      level: 'homework', time: 50, title: 'Guestbook: sổ lưu bút',
      desc: 'Ứng dụng full-stack nhỏ: khách để lại lời nhắn, hiển thị danh sách ngay trên trang.',
      tasks: ['`GET /api/messages` và `POST /api/messages` (`name`, `text`; giới hạn độ dài, không rỗng)', 'Lưu **in-memory** (và nâng cao: lưu vào `messages.json` bằng `fs/promises`)', 'Trang `public/index.html`: form + danh sách tin nhắn mới nhất ở trên', '**An toàn**: hiển thị bằng `textContent`, **không** dùng `innerHTML` với dữ liệu người dùng', 'Hiển thị thời gian gửi dạng “x phút trước”'],
      hints: ['XSS: nếu ai đó gửi `<script>…</script>`, `innerHTML` sẽ chạy code của họ!', 'Sau khi POST thành công, gọi lại hàm `loadMessages()`']
    },
    {
      level: 'project', time: 25, title: 'Đồ án DevBlog: khung Express',
      desc: 'Biến repo ở B1 thành server Express đầu tiên.',
      tasks: ['Cài `express`, `nodemon`; scripts `start`/`dev`', '`GET /api/health` → `{ status: "ok", uptime }`', '`GET /api/posts` → đọc `data/posts.json` (seed ở B2) và trả về', '`public/index.html` hiển thị danh sách bài viết bằng `fetch`', 'Route 404 JSON; commit & push'],
      hints: ['`process.uptime()` cho thời gian chạy', 'Đọc file bằng `fs/promises` trong handler `async`']
    }
  ],
  project: {
    lead: 'DevBlog API có **nhịp tim đầu tiên**!',
    tasks: ['`GET /api/health` & `GET /api/posts` (từ file seed)', 'Trang `public/index.html` liệt kê bài viết bằng `fetch`', 'Route 404 trả JSON'],
    callout: { type: 'tip', t: 'Chưa cần đẹp — cần **chạy được** từ đầu đến cuối (end-to-end).' }
  }
};
