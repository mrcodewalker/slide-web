/* ============================================================
   BUỔI 3 — Express căn bản
   ============================================================ */
SESSION_DATA[3] = {
  intro: 'Buổi "wow": học viên thấy 50 dòng http thuần co lại còn 5 dòng. Nhớ cho học viên tự gõ code, không copy. Kết thúc buổi phải có server Express + trang HTML gọi được API bằng fetch.',
  agenda: [
    { min: 10, t: 'Ôn B2 & chữa bài tập (To-do API thuần)', d: '' },
    { min: 25, t: 'Express là gì? Cài đặt, nodemon, Hello Express', d: '' },
    { min: 40, t: 'Routing: method, params, query', d: 'req & res thường dùng' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 25, t: 'Body parsing: express.json(), urlencoded', d: 'Postman' },
    { min: 25, t: 'express.static & nối Front-end bằng fetch', d: 'Demo tích hợp' },
    { min: 25, t: 'Lỗi thường gặp, tổng kết, giao bài', d: '' }
  ],
  slides: [
    { kind: 'section', no: '01', title: 'Làm quen với Express', sub: 'Framework web tối giản — nền móng của hầu hết dự án Node.js.' },
    {
      title: 'Express.js là gì?', layout: 'split', ratio: '1.1fr .9fr', top: true,
      bullets: ['Framework web **tối giản, linh hoạt** cho Node.js', 'Ra đời 2010, hiện là framework Node **phổ biến nhất**', 'Cung cấp: **routing**, **middleware**, helper cho req/res', '“Unopinionated” — bạn tự chọn cấu trúc & thư viện', 'Nền tảng của nhiều framework khác (NestJS, Sails…)'],
      img: { src: 'express-logo.png', cap: 'Express.js', h: 150 },
      callout: { type: 'info', t: 'Express **không thay thế** Node — nó chạy **trên** module `http` mà bạn đã học.' }
    },
    {
      title: 'Cùng một server: http thuần vs Express',
      cols: [
        { h: '😫 http thuần', cls: 'bad', code: { lang: 'javascript', size: 'xs', src: `const http = require('http');\nhttp.createServer((req, res) => {\n  const url = new URL(req.url, 'http://x');\n  if (req.method === 'GET' &&\n      url.pathname === '/api/hello') {\n    res.writeHead(200, {\n      'Content-Type': 'application/json'\n    });\n    return res.end(JSON.stringify({\n      message: 'Xin chào'\n    }));\n  }\n  res.writeHead(404);\n  res.end('Not Found');\n}).listen(3000);` } },
        { h: '😍 Express', cls: 'good', code: { lang: 'javascript', size: 'xs', src: `const express = require('express');\nconst app = express();\n\napp.get('/api/hello', (req, res) => {\n  res.json({ message: 'Xin chào' });\n});\n\napp.listen(3000);\n\n// 404 tự động, Content-Type tự đặt,\n// JSON tự stringify...` } }
      ],
      notes: 'Để hai cột cạnh nhau, giảng viên đếm số dòng. Nhấn mạnh: Express làm gọn, không "ma thuật" — nó vẫn là http bên dưới.'
    },
    {
      title: 'Khởi tạo project Express', badge: 'LIVE CODING',
      term: `$ mkdir devblog-api && cd devblog-api\n$ npm init -y\n$ npm install express\n$ npm install -D nodemon`,
      code: { file: 'package.json', lang: 'json', size: 'sm', src: `"scripts": {\n  "start": "node app.js",\n  "dev": "nodemon app.js"\n}` },
      callout: { type: 'tip', t: '`nodemon` **tự khởi động lại** server mỗi khi bạn lưu file. Từ giờ dùng `npm run dev` khi code.' }
    },
    {
      title: 'Hello, Express!', badge: 'LIVE CODING',
      code: { file: 'app.js', lang: 'javascript', src: `const express = require('express');\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\napp.get('/', (req, res) => {\n  res.send('<h1>Xin chào Express!</h1>');\n});\n\napp.get('/api/ping', (req, res) => {\n  res.json({ ok: true, time: new Date() });\n});\n\napp.listen(PORT, () => {\n  console.log(\`🚀 Server: http://localhost:\${PORT}\`);\n});` },
      term: `$ npm run dev\n[nodemon] starting \`node app.js\`\n🚀 Server: http://localhost:3000`
    },
    {
      title: 'Giải phẫu một route', kicker: 'B03 · Công thức cần thuộc',
      code: { lang: 'javascript', size: '', src: `app.METHOD( PATH, HANDLER )\napp.get ( '/api/posts', (req, res) => { ... } )` },
      cards: [
        { icon: '🔤', h: 'METHOD', p: '`get` `post` `put` `patch` `delete` — khớp HTTP method' },
        { icon: '🛣️', h: 'PATH', p: 'Đường dẫn URL, có thể có tham số `:id`' },
        { icon: '⚙️', h: 'HANDLER', p: 'Hàm `(req, res)` chạy khi khớp — **phải kết thúc** bằng một `res.*`' }
      ], cols: 3
    },

    { kind: 'section', no: '02', title: 'Routing', sub: 'Quyết định “URL nào + method nào → chạy code nào”.' },
    {
      title: 'Các HTTP method trong Express', layout: 'split', ratio: '1.1fr .9fr',
      code: { file: 'routes.js', lang: 'javascript', size: 'sm', src: `app.get('/posts',        (req, res) => res.json([]));        // lấy danh sách\napp.get('/posts/:id',    (req, res) => res.json({}));        // lấy một\napp.post('/posts',       (req, res) => res.status(201).json({})); // tạo\napp.put('/posts/:id',    (req, res) => res.json({}));        // thay thế\napp.patch('/posts/:id',  (req, res) => res.json({}));        // sửa một phần\napp.delete('/posts/:id', (req, res) => res.sendStatus(204)); // xóa` },
      table: { small: true, head: ['Method', 'Mục đích'], rows: [['GET', 'Đọc'], ['POST', 'Tạo mới'], ['PUT / PATCH', 'Cập nhật'], ['DELETE', 'Xóa']] }
    },
    {
      title: 'Route params — `/users/:id`', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'params.js', lang: 'javascript', size: 'sm', src: `app.get('/users/:id', (req, res) => {\n  console.log(req.params); // { id: '42' }\n  const id = Number(req.params.id);\n  res.json({ id });\n});\n\napp.get('/users/:userId/posts/:postId', (req, res) => {\n  const { userId, postId } = req.params;\n  res.json({ userId, postId });\n});` },
      bullets: ['`:ten` khai báo tham số trong path', 'Đọc qua `req.params`', 'Giá trị **luôn là chuỗi** → ép kiểu bằng `Number()`'],
      callout: { type: 'warn', t: 'Ví dụ `GET /users/abc` → `Number("abc")` = `NaN`. Hãy **kiểm tra** trước khi dùng!' }
    },
    {
      title: 'Query string — `?q=node&page=2`', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'query.js', lang: 'javascript', size: 'sm', src: `// GET /search?q=node&page=2\napp.get('/search', (req, res) => {\n  const q = req.query.q || '';\n  const page = parseInt(req.query.page, 10) || 1;\n  res.json({ q, page });\n});` },
      bullets: ['Phần sau dấu `?`, ngăn cách bằng `&`', 'Đọc qua `req.query` (object)', 'Dùng cho **lọc, tìm kiếm, phân trang, sắp xếp**', 'Cũng luôn là **chuỗi**'],
      callout: { type: 'tip', t: '**Params** = “cái gì” (định danh tài nguyên). **Query** = “thế nào” (lọc/sắp xếp/phân trang).' }
    },
    {
      title: 'Đối tượng req thường dùng',
      table: {
        head: ['Thuộc tính / hàm', 'Ví dụ giá trị', 'Dùng để'],
        rows: [
          ['`req.params`', '`{ id: "42" }`', 'Tham số trong đường dẫn'],
          ['`req.query`', '`{ page: "2" }`', 'Query string'],
          ['`req.body`', '`{ title: "…" }`', 'Dữ liệu gửi lên (cần `express.json()`)'],
          ['`req.headers` / `req.get(name)`', '`"application/json"`', 'Đọc header'],
          ['`req.method`, `req.path`', '`"POST"`, `"/api/posts"`', 'Thông tin request'],
          ['`req.ip`', '`"::1"`', 'Địa chỉ client']
        ]
      }
    },
    {
      title: 'Đối tượng res thường dùng',
      table: {
        head: ['Hàm', 'Tác dụng'],
        rows: [
          ['`res.send(data)`', 'Gửi chuỗi / HTML / Buffer (tự đoán Content-Type)'],
          ['`res.json(obj)`', 'Gửi **JSON** — dùng nhiều nhất khi làm API'],
          ['`res.status(code)`', 'Đặt status code (**chain được**): `res.status(404).json(...)`'],
          ['`res.sendStatus(204)`', 'Gửi status + chữ mô tả mặc định'],
          ['`res.redirect(url)`', 'Chuyển hướng (302 mặc định)'],
          ['`res.sendFile(path)`', 'Gửi file (cần đường dẫn **tuyệt đối**)'],
          ['`res.set(name, value)`', 'Đặt header']
        ]
      },
      callout: { type: 'danger', t: 'Mỗi request **chỉ gọi một lần** `res.send/json/...`. Gọi lần hai → lỗi `Cannot set headers after they are sent`.' }
    },
    {
      title: 'Thứ tự route rất quan trọng', badge: 'QUIZ',
      code: { file: 'order.js', lang: 'javascript', size: 'sm', src: `app.get('/users/:id', (req, res) => res.send('Chi tiết user'));\napp.get('/users/me',  (req, res) => res.send('Hồ sơ của tôi'));` },
      quiz: { q: 'Gọi GET /users/me thì nhận được gì?', opts: ['“Hồ sơ của tôi”', '“Chi tiết user”', '404 Not Found', 'Lỗi server'], a: 1, why: 'Express khớp route **từ trên xuống**, cái đầu tiên khớp là thắng. `:id` khớp luôn chữ “me”. **Đặt route cụ thể lên trước route có tham số.**' }
    },
    {
      title: 'Xử lý 404 — route “bắt hết”', layout: 'split', ratio: '1.1fr .9fr',
      code: { file: 'app.js', lang: 'javascript', size: 'sm', src: `// ... mọi route khác ở trên ...\n\napp.use((req, res) => {\n  res.status(404).json({\n    error: 'Not Found',\n    path: req.originalUrl\n  });\n});\n\napp.listen(3000);` },
      bullets: ['Đặt **cuối cùng**, sau tất cả route', '`app.use` không có path → khớp **mọi** request chưa ai xử lý', 'Mặc định Express trả HTML “Cannot GET /…” — xấu cho API!']
    },

    { kind: 'section', no: '03', title: 'Body, Postman & file tĩnh', sub: 'Nhận dữ liệu từ client và nối với Front-end bạn đã làm.' },
    {
      title: 'Đọc body: express.json()', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'body.js', lang: 'javascript', size: 'sm', src: `app.use(express.json());                         // JSON body\napp.use(express.urlencoded({ extended: true })); // form HTML\n\napp.post('/api/posts', (req, res) => {\n  const { title, content } = req.body;\n  if (!title) {\n    return res.status(400).json({ error: 'Thiếu title' });\n  }\n  res.status(201).json({ id: 1, title, content });\n});` },
      bullets: ['Không có middleware → `req.body` là **`undefined`**', '`express.json()` — body dạng `application/json`', '`express.urlencoded()` — body từ `<form>` HTML', 'Client phải gửi header `Content-Type` đúng'],
      callout: { type: 'info', t: 'Đây là lần đầu bạn thấy **middleware** (`app.use`). Buổi 4 sẽ đi sâu!' }
    },
    {
      title: 'Postman — “trình duyệt” dành cho API', badge: 'LIVE DEMO',
      steps: [
        { h: 'New Request', p: 'Chọn method `POST`, nhập URL `http://localhost:3000/api/posts`' },
        { h: 'Body', p: 'Tab **Body → raw → JSON**, nhập `{ "title": "Bài 1" }`' },
        { h: 'Send', p: 'Xem **Status**, **Time**, **Body** của response' },
        { h: 'Lưu', p: '**Save** vào Collection để dùng lại & chia sẻ' }
      ], vertical: true,
      img: { src: 'postman-logo.png', cap: 'Postman', h: 90 }, layout: 'split', ratio: '1.3fr .7fr',
      notes: 'Cài Postman (hoặc dùng extension Thunder Client trong VS Code). Cho học viên tự thử gửi thiếu title để thấy 400.'
    },
    {
      title: 'express.static — phục vụ Front-end', layout: 'split', ratio: '1fr 1fr',
      code: { file: 'app.js', lang: 'javascript', size: 'sm', src: `const path = require('path');\n\napp.use(express.static(path.join(__dirname, 'public')));\n\n// GET /            → public/index.html\n// GET /style.css   → public/style.css\n// GET /app.js      → public/app.js` },
      term: `devblog-api/\n├─ app.js\n├─ package.json\n└─ public/\n   ├─ index.html\n   ├─ style.css\n   └─ app.js`,
      callout: { type: 'tip', t: 'Từ giờ **một server** vừa phục vụ trang HTML vừa trả API — không còn lo CORS khi cùng origin.' }
    },
    {
      title: 'Demo: Front-end gọi API bằng fetch', badge: 'LIVE CODING',
      cols: [
        { h: 'public/index.html', code: { file: 'index.html', lang: 'xml', size: 'xs', src: `<h1>DevBlog</h1>\n<button id="btn">Gọi API</button>\n<pre id="out"></pre>\n<script src="app.js"></script>` } },
        { h: 'public/app.js', code: { file: 'app.js', lang: 'javascript', size: 'xs', src: `document.querySelector('#btn')\n  .addEventListener('click', async () => {\n    const res = await fetch('/api/ping');\n    const data = await res.json();\n    document.querySelector('#out')\n      .textContent = JSON.stringify(data, null, 2);\n  });` } }
      ],
      callout: { type: 'demo', t: 'Kiến thức HTML/CSS/JS (Front-end) + Node/Express (Back-end) **gặp nhau** ở đây. Đây chính là một ứng dụng web hoàn chỉnh!' }
    },
    {
      title: 'Lỗi thường gặp', kicker: 'B03 · Debug',
      table: {
        head: ['Hiện tượng', 'Nguyên nhân', 'Cách sửa'],
        rows: [
          ['`Cannot GET /xyz`', 'Chưa khai báo route / sai method', 'Kiểm tra path & method; thêm route'],
          ['`req.body` là `undefined`', 'Thiếu `express.json()` hoặc sai `Content-Type`', '`app.use(express.json())` **trước** route'],
          ['`EADDRINUSE: port 3000`', 'Cổng đã có chương trình khác dùng', 'Tắt server cũ hoặc đổi `PORT`'],
          ['`Cannot set headers after they are sent`', 'Gọi `res.send/json` hai lần', 'Thêm `return` trước `res.*`'],
          ['Trình duyệt quay mãi', 'Handler không gọi `res.*`', 'Mọi nhánh phải kết thúc response']
        ]
      }
    }
  ],
  recap: [
    'Express = framework mỏng trên `http`: `app.METHOD(path, handler)`',
    '`req.params` (đường dẫn) · `req.query` (query string) · `req.body` (cần `express.json()`)',
    '`res.json()`, `res.status().json()`, `res.sendStatus()`; mỗi request chỉ **một** response',
    'Thứ tự route quan trọng; đặt **404** cuối cùng',
    '`express.static` phục vụ Front-end; **Postman** để test API'
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
