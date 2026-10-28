/* ============================================================
   BUỔI 4 — Middleware & Routing nâng cao
   ============================================================ */
SESSION_DATA[4] = {
  intro: 'Middleware là khái niệm "ăn tiền" nhất của Express. Dùng hình ảnh dây chuyền / lớp hành tây. Cho học viên tự viết logger rồi mới giới thiệu thư viện morgan để họ hiểu bản chất.',
  agenda: [
    { min: 10, t: 'Ôn B3 & chữa bài tập', d: '' },
    { min: 40, t: 'Middleware: khái niệm, (req, res, next), thứ tự', d: 'Tự viết logger, timer, auth giả lập' },
    { min: 30, t: 'express.Router — chia nhỏ route', d: 'Mount path, route chaining' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 20, t: 'Middleware bên thứ ba: morgan, cors, helmet…', d: 'CORS là gì?' },
    { min: 35, t: 'Xử lý lỗi tập trung & 404', d: 'Error-handling middleware, lỗi async' },
    { min: 20, t: 'Form HTML → server & tổng kết', d: 'urlencoded, redirect' },
    { min: 15, t: 'Giao bài', d: '' }
  ],
  slides: [
    { kind: 'section', no: '01', title: 'Middleware', sub: 'Những “trạm kiểm soát” mà mọi request đi qua trước khi tới route handler.' },
    {
      title: 'Middleware là gì?', lead: 'Hàm **đứng giữa** request và response, có thể **đọc/sửa** `req`, `res` rồi chuyển tiếp hoặc dừng lại.',
      steps: [
        { h: 'Request', p: 'Client gửi lên' },
        { h: 'Logger', p: 'Ghi lại request' },
        { h: 'Parser', p: '`express.json()` đọc body' },
        { h: 'Auth', p: 'Kiểm tra đăng nhập' },
        { h: 'Handler', p: 'Route xử lý → `res.json`' }
      ],
      callout: { type: 'tip', t: 'Hình dung **dây chuyền nhà máy**: mỗi trạm làm một việc nhỏ rồi chuyển cho trạm sau. Trạm nào phát hiện lỗi có thể **dừng cả dây chuyền**.' }
    },
    {
      title: 'Chữ ký (req, res, next)', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'middleware.js', lang: 'javascript', size: 'sm', src: `function logger(req, res, next) {\n  console.log(\`\${req.method} \${req.url}\`);\n  next(); // 👉 chuyển sang middleware kế tiếp\n}\n\napp.use(logger);\n\napp.get('/', (req, res) => res.send('Home'));` },
      bullets: ['Nhận 3 tham số: **req, res, next**', '`next()` → đi tiếp trạm sau', '**Không gọi** `next()` và cũng không `res.*` → request **treo mãi**', '`next(err)` → nhảy thẳng đến **error handler**'],
      callout: { type: 'danger', t: 'Hai cách kết thúc đúng: gọi **`next()`** hoặc gửi **response**. Không bao giờ làm cả hai!' }
    },
    {
      title: 'Thứ tự middleware', badge: 'QUIZ',
      code: { file: 'order.js', lang: 'javascript', size: 'sm', src: `app.use((req, res, next) => { console.log('A'); next(); });\n\napp.get('/hi', (req, res) => {\n  console.log('B');\n  res.send('hi');\n});\n\napp.use((req, res, next) => { console.log('C'); next(); });` },
      quiz: { q: 'GET /hi in ra những gì trong console?', opts: ['A rồi B', 'A, B rồi C', 'B rồi A', 'Chỉ B'], a: 0, why: 'Khớp **từ trên xuống**. Sau khi handler `/hi` đã `res.send`, request kết thúc → middleware C (khai báo sau) **không bao giờ chạy**.' }
    },
    {
      title: 'Các loại middleware',
      table: {
        head: ['Loại', 'Ví dụ', 'Ghi chú'],
        rows: [
          ['Cấp ứng dụng', '`app.use(logger)`', 'Chạy cho **mọi** request'],
          ['Cấp route', '`app.get(\'/me\', auth, handler)`', 'Chỉ cho route đó'],
          ['Cấp Router', '`router.use(auth)`', 'Cho mọi route trong router'],
          ['Có sẵn (built-in)', '`express.json()`, `express.static()`', 'Đi kèm Express'],
          ['Bên thứ ba', '`morgan`, `cors`, `helmet`', 'Cài từ npm'],
          ['Xử lý lỗi', '`(err, req, res, next)`', '**4 tham số**, đặt cuối cùng']
        ]
      }
    },
    {
      title: 'Tự viết: logger & timer', badge: 'LIVE CODING',
      code: { file: 'middlewares/logger.js', lang: 'javascript', size: 'sm', src: `module.exports = function logger(req, res, next) {\n  const start = Date.now();\n\n  // 'finish' = response đã gửi xong\n  res.on('finish', () => {\n    const ms = Date.now() - start;\n    console.log(\`\${req.method} \${req.originalUrl} → \${res.statusCode} (\${ms}ms)\`);\n  });\n\n  next();\n};` },
      term: `GET /api/posts → 200 (3ms)\nPOST /api/posts → 201 (5ms)\nGET /api/khong-co → 404 (1ms)`,
      notes: 'Cho học viên tự viết. Hỏi: tại sao phải dùng res.on("finish") thay vì log ngay trong middleware? (vì status code chưa biết lúc đó).'
    },
    {
      title: 'Middleware có tham số (factory)', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'middlewares/requireFields.js', lang: 'javascript', size: 'sm', src: `// Trả về một middleware “đặt riêng” cho từng route\nmodule.exports = (...fields) => (req, res, next) => {\n  const missing = fields.filter(f => !req.body?.[f]);\n  if (missing.length) {\n    return res.status(400).json({\n      error: 'Thiếu trường bắt buộc',\n      fields: missing\n    });\n  }\n  next();\n};\n\n// Dùng:\napp.post('/posts', requireFields('title', 'content'), createPost);` },
      bullets: ['Hàm trả về hàm → **tái sử dụng** với cấu hình khác nhau', 'Mẫu rất phổ biến: `rateLimit({...})`, `cors({...})`', 'Gắn nhiều middleware: `app.get(path, mw1, mw2, handler)`']
    },
    {
      title: 'Demo: Auth giả lập bằng API key', badge: 'LIVE CODING',
      code: { file: 'middlewares/apiKey.js', lang: 'javascript', size: 'sm', src: `module.exports = function apiKey(req, res, next) {\n  const key = req.get('x-api-key');\n  if (key !== 'ct9-secret') {\n    return res.status(401).json({ error: 'Thiếu hoặc sai API key' });\n  }\n  req.user = { name: 'Admin' }; // 👉 gắn dữ liệu cho handler phía sau\n  next();\n};\n\n// app.js\napp.get('/api/secret', apiKey, (req, res) => {\n  res.json({ message: \`Chào \${req.user.name}\` });\n});` },
      callout: { type: 'info', t: 'Middleware **gắn dữ liệu vào `req`** (vd `req.user`) để các bước sau dùng. B9–B10 ta sẽ thay API key bằng **JWT** thật, cùng một cơ chế.' }
    },

    { kind: 'section', no: '02', title: 'express.Router', sub: 'Chia ứng dụng thành các “mini-app” — mỗi tài nguyên một file.' },
    {
      title: 'Vấn đề: app.js phình to', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '😵 Trước', cls: 'bad', bullets: ['Một file 300+ dòng', 'Route users, posts, comments lẫn lộn', 'Khó tìm, khó sửa, hay xung đột khi làm nhóm'] },
        { h: '😎 Sau (Router)', cls: 'good', bullets: ['`routes/posts.js`', '`routes/users.js`', '`routes/comments.js`', '`app.js` chỉ “gắn” chúng lại'] }
      ]
    },
    {
      title: 'express.Router — cách dùng',
      cols: [
        { h: 'routes/posts.js', code: { file: 'routes/posts.js', lang: 'javascript', size: 'xs', src: `const router = require('express').Router();\n\nrouter.get('/', (req, res) => {\n  res.json([]);\n});\nrouter.get('/:id', (req, res) => {\n  res.json({ id: req.params.id });\n});\nrouter.post('/', (req, res) => {\n  res.status(201).json(req.body);\n});\n\nmodule.exports = router;` } },
        { h: 'app.js', code: { file: 'app.js', lang: 'javascript', size: 'xs', src: `const express = require('express');\nconst postsRouter = require('./routes/posts');\nconst usersRouter = require('./routes/users');\n\nconst app = express();\napp.use(express.json());\n\napp.use('/api/posts', postsRouter);\napp.use('/api/users', usersRouter);\n\napp.listen(3000);` } }
      ],
      callout: { type: 'tip', t: 'Trong router, path là **tương đối** theo điểm gắn: `/` ở `postsRouter` = `/api/posts`; `/:id` = `/api/posts/:id`.' }
    },
    {
      title: 'Route chaining & middleware theo Router', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `const router = require('express').Router();\nconst apiKey = require('../middlewares/apiKey');\n\nrouter.get('/', listPosts);\nrouter.post('/', apiKey, createPost);\n\n// gom các method cùng path\nrouter.route('/:id')\n  .get(getPost)\n  .put(apiKey, updatePost)\n  .delete(apiKey, deletePost);\n\n// router.use(apiKey);  // hoặc: bảo vệ MỌI route bên dưới` },
      bullets: ['`router.route(path)` tránh lặp path', 'Gắn middleware **riêng cho từng method**', '`router.use(mw)` áp cho cả router (chỉ những route khai báo **sau** nó)']
    },
    {
      title: 'Cấu trúc thư mục & URL đầy đủ', layout: 'split', ratio: '.9fr 1.1fr',
      term: `devblog-api/\n├─ app.js\n├─ routes/\n│  ├─ posts.js\n│  └─ users.js\n├─ middlewares/\n│  ├─ logger.js\n│  ├─ apiKey.js\n│  └─ requireFields.js\n├─ data/\n└─ public/`,
      table: {
        small: true, head: ['Mount', 'Trong router', 'URL thực tế'],
        rows: [['`/api/posts`', '`GET /`', '`GET /api/posts`'], ['`/api/posts`', '`GET /:id`', '`GET /api/posts/5`'], ['`/api/users`', '`POST /`', '`POST /api/users`'], ['`/api/users`', '`GET /:id/posts`', '`GET /api/users/3/posts`']]
      }
    },

    { kind: 'section', no: '03', title: 'Middleware bên thứ ba & CORS', sub: 'Đừng phát minh lại bánh xe.' },
    {
      title: 'Bộ đồ nghề quen thuộc', kicker: 'B04 · npm install …',
      cards: [
        { icon: '📝', h: 'morgan', p: 'Ghi log HTTP request chuẩn, nhiều định dạng' },
        { icon: '🌐', h: 'cors', p: 'Cho phép front-end ở origin khác gọi API' },
        { icon: '🛡️', h: 'helmet', p: 'Thêm các header bảo mật (B10)' },
        { icon: '🗜️', h: 'compression', p: 'Nén response gzip → nhanh hơn' },
        { icon: '🍪', h: 'cookie-parser', p: 'Đọc cookie từ request' },
        { icon: '🚦', h: 'express-rate-limit', p: 'Giới hạn số request (B10)' }
      ], cols: 3, small: true
    },
    {
      title: 'morgan & cors — dùng thế nào?', layout: 'split', ratio: '1.1fr .9fr',
      code: { file: 'app.js', lang: 'javascript', size: 'sm', src: `const morgan = require('morgan');\nconst cors = require('cors');\n\napp.use(morgan('dev'));  // log gọn, có màu\napp.use(cors());         // cho phép MỌI origin (dev)\n\napp.use(express.json());\n// ... routes ...` },
      term: `$ npm i morgan cors\nGET /api/posts 200 4.2 ms - 512\nPOST /api/posts 201 6.8 ms - 98`,
      callout: { type: 'warn', t: 'Trên production, **giới hạn** origin: `cors({ origin: \'https://myblog.com\' })`.' }
    },
    {
      title: 'CORS là gì? Vì sao trình duyệt chặn?', layout: 'split', ratio: '1fr 1.15fr',
      bullets: ['**Same-Origin Policy**: trang ở `a.com` không được đọc dữ liệu từ `b.com`', 'Origin = **giao thức + domain + cổng**', '`localhost:5500` (Live Server) ≠ `localhost:3000` (Express) → **khác origin**', 'Server cho phép bằng header `Access-Control-Allow-Origin` — đó là việc của `cors()`'],
      img: { src: 'mdn-cors-overview.svg', cap: 'Cơ chế CORS' },
      notes: 'Lỗi này học viên SẼ gặp khi mở index.html bằng Live Server rồi fetch sang :3000. Chốt: CORS là cơ chế bảo vệ của TRÌNH DUYỆT, không phải của server; Postman không bị CORS.'
    },
    {
      title: 'Preflight request (OPTIONS)', layout: 'split', ratio: '1fr 1.2fr',
      bullets: ['Với request “nhạy cảm” (`PUT`, `DELETE`, JSON, header `Authorization`…), trình duyệt hỏi trước bằng `OPTIONS`', 'Server trả cho phép → trình duyệt mới gửi request thật', '`cors()` tự xử lý preflight giúp bạn'],
      img: { src: 'mdn-cors-preflight.svg', cap: 'Request có preflight' }
    },

    { kind: 'section', no: '04', title: 'Xử lý lỗi tập trung', sub: 'Một nơi duy nhất quyết định lỗi trả về cho client trông như thế nào.' },
    {
      title: 'Error-handling middleware', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'middlewares/errorHandler.js', lang: 'javascript', size: 'sm', src: `// ⚠️ ĐÚNG 4 tham số — Express dựa vào đó để nhận ra\nmodule.exports = (err, req, res, next) => {\n  console.error(err);\n  const status = err.status || 500;\n  res.status(status).json({\n    error: status === 500 ? 'Lỗi máy chủ' : err.message\n  });\n};\n\n// app.js — đặt SAU CÙNG, sau cả 404\napp.use(notFound);\napp.use(errorHandler);` },
      bullets: ['Có **4 tham số** `(err, req, res, next)`', 'Đặt **cuối cùng** trong chuỗi', 'Kích hoạt khi: `throw` (đồng bộ) hoặc `next(err)`', 'Không để lộ **stack trace** cho client ở production']
    },
    {
      title: 'Lỗi bất đồng bộ — coi chừng!', kicker: 'B04 · Điểm hay bị bẫy',
      cols: [
        { h: '⛔ Express 4: không tự bắt', cls: 'bad', code: { lang: 'javascript', size: 'xs', src: `app.get('/posts', async (req, res) => {\n  const data = await db.query(); // lỗi ở đây?\n  res.json(data);\n});\n// → Promise reject, server treo\n// hoặc sập (UnhandledRejection)!` } },
        { h: '✅ Cách xử lý (chạy cả 4 & 5)', cls: 'good', code: { lang: 'javascript', size: 'xs', src: `app.get('/posts', async (req, res, next) => {\n  try {\n    const data = await db.query();\n    res.json(data);\n  } catch (err) {\n    next(err); // 👉 chuyển cho errorHandler\n  }\n});` } }
      ],
      callout: { type: 'info', t: '**Express 5** tự chuyển Promise bị reject vào error handler. Nhưng rất nhiều dự án còn dùng Express 4 → luôn nên hiểu `next(err)`. B6 sẽ có wrapper `asyncHandler` để khỏi lặp `try/catch`.' }
    },
    {
      title: 'Công thức app.js “chuẩn chỉnh”', kicker: 'B04 · Thứ tự cắm middleware', badge: 'GHI NHỚ',
      steps: [
        { h: 'morgan / logger', p: 'Ghi log đầu tiên' },
        { h: 'cors · helmet', p: 'Header & quyền truy cập' },
        { h: 'express.json()', p: 'Đọc body' },
        { h: 'static', p: 'File tĩnh' },
        { h: 'routes', p: '`/api/...`' },
        { h: '404', p: 'Không route nào khớp' },
        { h: 'errorHandler', p: 'Luôn cuối cùng' }
      ],
      code: { file: 'app.js', lang: 'javascript', size: 'sm', src: `app.use(morgan('dev'));\napp.use(cors());\napp.use(express.json());\napp.use(express.static('public'));\napp.use('/api/posts', postsRouter);\napp.use(notFound);\napp.use(errorHandler);` }
    },
    {
      title: 'Form HTML → server', badge: 'LIVE CODING', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: 'public/contact.html', code: { lang: 'xml', size: 'xs', src: `<form action="/contact" method="POST">\n  <input name="email" type="email" required>\n  <textarea name="message"></textarea>\n  <button>Gửi</button>\n</form>` } },
        { h: 'Route nhận form', code: { lang: 'javascript', size: 'xs', src: `app.use(express.urlencoded({ extended: true }));\n\napp.post('/contact', (req, res) => {\n  const { email, message } = req.body;\n  // ... lưu lại ...\n  res.redirect('/thanks.html'); // PRG\n});` } }
      ],
      callout: { type: 'tip', t: '**Post → Redirect → Get (PRG)**: sau khi xử lý POST, **redirect** để người dùng F5 không gửi lại form.' }
    }
  ],
  recap: [
    'Middleware `(req, res, next)`: chạy theo **thứ tự khai báo**; phải `next()` **hoặc** trả response',
    'Middleware factory (hàm trả về middleware) để cấu hình & tái sử dụng',
    '`express.Router()` + `app.use(\'/api/xxx\', router)` — mỗi tài nguyên một file',
    '`morgan`, `cors` (hiểu **CORS** là cơ chế của trình duyệt), `helmet`…',
    'Error handler **4 tham số**, đặt **cuối cùng**; lỗi async → `next(err)`'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Logger middleware của riêng bạn',
      desc: 'Viết middleware ghi log mỗi request **không dùng morgan**.',
      tasks: ['File `middlewares/logger.js`', 'Log: giờ, method, URL, status code, thời gian xử lý (ms)', 'Dùng `res.on("finish", …)`', 'Gắn bằng `app.use` và kiểm tra bằng 3 request khác nhau'],
      expected: '[11:05:21] GET /api/ping → 200 (2ms)',
      hints: ['Status code chỉ biết **sau khi** response gửi xong', '`req.originalUrl` giữ nguyên URL đầy đủ (kể cả khi trong router)'],
      solution: { file: 'middlewares/logger.js', lang: 'javascript', src: `module.exports = (req, res, next) => {\n  const start = Date.now();\n  res.on('finish', () => {\n    const t = new Date().toLocaleTimeString('vi-VN');\n    console.log(\`[\${t}] \${req.method} \${req.originalUrl} → \${res.statusCode} (\${Date.now() - start}ms)\`);\n  });\n  next();\n};` }
    },
    {
      level: 'core', time: 25, title: 'Middleware validate: requireFields',
      desc: 'Tạo middleware factory kiểm tra các trường bắt buộc trong `req.body`.',
      tasks: ['`requireFields("title", "content")` trả middleware', 'Thiếu → **400** + danh sách trường thiếu', 'Chuỗi rỗng / toàn khoảng trắng cũng tính là thiếu', 'Áp dụng cho `POST /api/posts`'],
      hints: ['`typeof v === "string" && v.trim() !== ""`', 'Nhớ `return` khi trả lỗi'],
      solution: { file: 'middlewares/requireFields.js', lang: 'javascript', src: `module.exports = (...fields) => (req, res, next) => {\n  const body = req.body || {};\n  const missing = fields.filter((f) => {\n    const v = body[f];\n    return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');\n  });\n  if (missing.length) return res.status(400).json({ error: 'Thiếu trường bắt buộc', fields: missing });\n  next();\n};` }
    },
    {
      level: 'core', time: 20, title: 'Bảo vệ route bằng API key',
      desc: 'Giả lập xác thực để chuẩn bị cho JWT ở B9.',
      tasks: ['Middleware `apiKey` đọc header `x-api-key`', 'Key đúng lưu trong biến (tạm) — sai/thiếu → **401**', 'Gắn `req.user = { name, role }`', 'Chỉ bảo vệ `POST`, `PUT`, `DELETE` của posts; `GET` vẫn công khai', 'Test bằng Postman: có key và không có key'],
      hints: ['`req.get("x-api-key")` không phân biệt hoa thường tên header'],
      solution: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `const router = require('express').Router();\nconst apiKey = require('../middlewares/apiKey');\n\nrouter.get('/', listPosts);\nrouter.get('/:id', getPost);\nrouter.post('/', apiKey, createPost);\nrouter.put('/:id', apiKey, updatePost);\nrouter.delete('/:id', apiKey, deletePost);\n\nmodule.exports = router;` }
    },
    {
      level: 'core', time: 30, title: 'Chia Router: users & posts',
      desc: 'Tách ứng dụng thành các router riêng.',
      tasks: ['`routes/users.js` (`GET /`, `GET /:id`, `POST /`) và `routes/posts.js`', 'Gắn vào `/api/users` và `/api/posts`', 'Thêm `GET /api/users/:id/posts` trong users router', 'Vẽ **bảng URL đầy đủ** của tất cả endpoint vào README'],
      hints: ['Mỗi file router: `const router = express.Router(); … module.exports = router`', 'Dữ liệu tạm lưu ở mảng đầu file']
    },
    {
      level: 'core', time: 25, title: 'Gắn morgan, cors và error handler',
      desc: 'Hoàn thiện “bộ khung middleware” cho app.',
      tasks: ['Cài `morgan` và `cors`; dùng đúng **thứ tự** trong công thức app.js', 'Viết `notFound` (404 JSON) và `errorHandler` (4 tham số)', 'Thêm route `GET /api/boom` cố ý `throw new Error("Boom!")` → kiểm tra trả 500 JSON, **không lộ stack**', 'Thêm route async lỗi và xử lý đúng bằng `next(err)`', 'Mở `index.html` bằng Live Server (cổng khác) và gọi API → thấy CORS hoạt động'],
      hints: ['Lỗi `throw` đồng bộ trong handler được Express tự bắt', 'Với async dùng `try/catch` + `next(err)`'],
      solution: [
        { file: 'middlewares/notFound.js', lang: 'javascript', src: `module.exports = (req, res) =>\n  res.status(404).json({ error: 'Not Found', path: req.originalUrl });` },
        { file: 'middlewares/errorHandler.js', lang: 'javascript', src: `module.exports = (err, req, res, next) => {\n  console.error(err);\n  const status = err.status || 500;\n  res.status(status).json({ error: status === 500 ? 'Lỗi máy chủ' : err.message });\n};` }
      ]
    },
    {
      level: 'challenge', time: 40, title: 'Rate limiter tự viết',
      desc: 'Giới hạn số request theo IP — tự viết như thư viện `express-rate-limit`.',
      tasks: ['`rateLimit({ windowMs, max })` trả middleware', 'Đếm request theo `req.ip` trong một cửa sổ thời gian', 'Vượt ngưỡng → **429 Too Many Requests** + header `Retry-After`', 'Hết cửa sổ → đếm lại từ đầu', 'Test: cho phép 5 request / 10 giây'],
      hints: ['Dùng `Map` lưu `{ count, resetAt }`', 'Dọn dẹp bằng `setInterval` hoặc kiểm tra `resetAt` mỗi lần'],
      solution: { file: 'middlewares/rateLimit.js', lang: 'javascript', size: 'sm', src: `module.exports = ({ windowMs = 10000, max = 5 } = {}) => {\n  const hits = new Map();\n  return (req, res, next) => {\n    const now = Date.now();\n    let h = hits.get(req.ip);\n    if (!h || now > h.resetAt) {\n      h = { count: 0, resetAt: now + windowMs };\n      hits.set(req.ip, h);\n    }\n    h.count++;\n    if (h.count > max) {\n      res.set('Retry-After', Math.ceil((h.resetAt - now) / 1000));\n      return res.status(429).json({ error: 'Quá nhiều request, thử lại sau' });\n    }\n    next();\n  };\n};\n\n// app.use('/api', rateLimit({ windowMs: 10000, max: 5 }));` }
    },
    {
      level: 'homework', time: 45, title: 'Form liên hệ hoàn chỉnh',
      desc: 'Trang liên hệ gửi form HTML truyền thống, lưu vào file, có thông báo.',
      tasks: ['`public/contact.html`: form `name`, `email`, `message` (method POST)', '`POST /contact`: validate (rỗng, email sai định dạng); lỗi → quay lại form kèm thông báo (qua query `?error=...`)', 'Thành công → lưu vào `data/contacts.json` (`fs/promises`) rồi **redirect** `/thanks.html`', 'Trang `thanks.html` hiển thị lời cảm ơn', '`GET /api/contacts` (cần API key) trả danh sách'],
      hints: ['Form HTML gửi `application/x-www-form-urlencoded` → cần `express.urlencoded`', 'Hiển thị lỗi: đọc `URLSearchParams(location.search)` ở phía FE'],
    },
    {
      level: 'project', time: 25, title: 'Đồ án DevBlog: tách router & middleware',
      desc: 'Cải tổ cấu trúc đồ án.',
      tasks: ['Thư mục `routes/`, `middlewares/`', '`routes/posts.js` mount tại `/api/posts` (danh sách, chi tiết từ file seed)', 'Middleware: `logger` (hoặc morgan), `notFound`, `errorHandler`', 'Thêm `cors()`', 'Cập nhật README: bảng endpoint'],
      hints: ['Chưa cần CRUD đầy đủ — B5 sẽ làm']
    }
  ],
  project: {
    lead: 'Dự án bắt đầu có **cấu trúc**.',
    tasks: ['Tách `routes/posts.js`, mount `/api/posts`', 'Middleware: logger, cors, notFound, errorHandler', 'Cập nhật README liệt kê endpoint'],
    callout: { type: 'tip', t: 'Quy tắc nhóm: mỗi file một nhiệm vụ. Nếu một file dài hơn ~150 dòng, hãy cân nhắc tách.' }
  }
};
