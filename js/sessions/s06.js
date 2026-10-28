/* ============================================================
   BUỔI 6 — Kiến trúc dự án: MVC & Cấu hình
   ============================================================ */
SESSION_DATA[6] = {
  intro: 'Buổi "dọn nhà". Không thêm tính năng mới — chỉ tổ chức lại để từ B7 cắm database vào dễ dàng. Hãy refactor trực tiếp code CRUD posts của B5 trước mặt học viên, từng bước nhỏ, chạy lại Postman sau mỗi bước.',
  agenda: [
    { min: 10, t: 'Ôn B5 & chữa bài tập', d: '' },
    { min: 25, t: 'Vì sao cần kiến trúc? MVC & phân lớp', d: 'Route → Controller → Service → Model' },
    { min: 20, t: 'Cấu trúc thư mục chuẩn', d: '' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 45, t: 'Live refactor: posts theo MVC', d: 'Từng bước, test lại bằng Postman' },
    { min: 25, t: 'Cấu hình với dotenv & tách app/server', d: '' },
    { min: 30, t: 'AppError, asyncHandler, response helpers', d: 'Xử lý lỗi tập trung' },
    { min: 15, t: 'Tổng kết & giao bài', d: '' }
  ],
  slides: [
    { kind: 'section', no: '01', title: 'Vì sao cần kiến trúc?', sub: 'Code chạy được mới là một nửa. Nửa còn lại: đọc được, sửa được, mở rộng được.' },
    {
      title: 'Triệu chứng của dự án “mì spaghetti”',
      cols: [
        { h: '😵 Hiện trạng', cls: 'bad', bullets: ['Route handler 80 dòng: validate + logic + đọc file + format', 'Copy-paste `try/catch` và `res.status(404)…` khắp nơi', 'Mật khẩu DB, cổng, secret **viết cứng** trong code', 'Đổi file JSON → MySQL = **sửa mọi route**'] },
        { h: '🎯 Mục tiêu', cls: 'good', bullets: ['Mỗi lớp **một trách nhiệm**', 'Lỗi xử lý ở **một chỗ**', 'Cấu hình nằm ngoài code (`.env`)', 'Đổi nơi lưu dữ liệu chỉ sửa **một lớp**'] }
      ],
      callout: { type: 'tip', t: '**Separation of Concerns**: tách các mối quan tâm. Đây là nguyên tắc quan trọng nhất của kiến trúc phần mềm.' }
    },
    {
      title: 'Mô hình MVC', layout: 'split', ratio: '1fr 1fr',
      bullets: ['**Model**: dữ liệu & quy tắc nghiệp vụ, nói chuyện với DB', '**View**: phần hiển thị (với API → **JSON**)', '**Controller**: nhận request, gọi Model, chọn View/response', 'Ra đời từ 1979 (Smalltalk), vẫn là nền tảng của Rails, Laravel, ASP.NET MVC…'],
      img: { src: 'mvc-process.svg', cap: 'Mô hình Model–View–Controller', h: 500 }
    },
    {
      title: 'MVC trong Express', layout: 'split', ratio: '.9fr 1.1fr',
      bullets: ['**Routes** nhận request, chuyển cho **controller** phù hợp', 'Controller đọc/ghi qua **models**', 'Với web truyền thống: controller render **view** (template)', 'Với REST API: “view” chính là `res.json()`'],
      img: { src: 'mdn-express-mvc.png', cap: 'Luồng dữ liệu chính trong ứng dụng Express theo MVC', h: 500 }
    },
    {
      title: 'Kiến trúc phân lớp cho API', kicker: 'B06 · Mỗi lớp một việc',
      steps: [
        { h: 'Route', p: 'URL + method → gắn middleware → gọi controller' },
        { h: 'Middleware', p: 'Auth, validate, upload…' },
        { h: 'Controller', p: 'Lấy dữ liệu từ `req`, gọi service, trả `res`' },
        { h: 'Service', p: '**Logic nghiệp vụ** — không biết gì về `req`/`res`' },
        { h: 'Model / Repo', p: 'Đọc/ghi dữ liệu (file → MySQL)' }
      ],
      callout: { type: 'info', t: 'Quy tắc vàng: **service không được dùng `req`, `res`**. Nhờ vậy có thể gọi service từ API, từ script, từ test…' }
    },
    {
      title: 'Cấu trúc thư mục đề xuất', layout: 'split', ratio: '1fr 1fr',
      term: `devblog-api/\n├─ src/\n│  ├─ config/        # đọc .env, cấu hình\n│  ├─ routes/        # định nghĩa URL\n│  ├─ controllers/   # xử lý req/res\n│  ├─ services/      # logic nghiệp vụ\n│  ├─ models/        # dữ liệu\n│  ├─ middlewares/   # auth, validate, error…\n│  ├─ utils/         # AppError, asyncHandler…\n│  ├─ app.js         # tạo app, gắn middleware\n│  └─ server.js      # app.listen\n├─ public/\n├─ .env              # ❌ KHÔNG commit\n├─ .env.example      # ✅ commit\n└─ package.json`,
      bullets: ['Gom theo **loại** (layer) — dễ học, hợp dự án vừa', 'Dự án lớn có thể gom theo **tính năng** (`modules/posts/…`)', 'Tách `app.js` và `server.js` để **test** dễ (B12)']
    },

    { kind: 'section', no: '02', title: 'Live refactor', sub: 'Biến router posts “tất cả trong một” thành 4 lớp gọn gàng.' },
    {
      title: 'Bước 1 — Model', badge: 'LIVE CODING',
      code: { file: 'src/models/post.model.js', lang: 'javascript', size: 'sm', src: `const store = require('../utils/jsonStore')('posts.json');\n\nexports.findAll = () => store.readAll();\n\nexports.findById = async (id) =>\n  (await store.readAll()).find((p) => p.id === id) || null;\n\nexports.create = (data) => store.update((posts) => {\n  const post = { id: Date.now(), ...data, createdAt: new Date().toISOString() };\n  posts.push(post);\n  return post;\n});\n\nexports.update = (id, data) => store.update((posts) => {\n  const p = posts.find((x) => x.id === id);\n  if (!p) return null;\n  return Object.assign(p, data, { updatedAt: new Date().toISOString() });\n});\n\nexports.remove = (id) => store.update((posts) => {\n  const i = posts.findIndex((x) => x.id === id);\n  return i === -1 ? false : (posts.splice(i, 1), true);\n});` },
      callout: { type: 'tip', t: 'B7–B8 ta chỉ **viết lại file này** bằng MySQL/Sequelize — controller & service gần như không đổi.' }
    },
    {
      title: 'Bước 2 — Service (logic nghiệp vụ)', badge: 'LIVE CODING',
      code: { file: 'src/services/post.service.js', lang: 'javascript', size: 'sm', src: `const Post = require('../models/post.model');\nconst AppError = require('../utils/AppError');\nconst slugify = require('../utils/slugify');\n\nexports.list = async ({ q, tag } = {}) => {\n  let posts = await Post.findAll();\n  if (q) posts = posts.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));\n  if (tag) posts = posts.filter((p) => p.tags?.includes(tag));\n  return posts;\n};\n\nexports.getById = async (id) => {\n  const post = await Post.findById(id);\n  if (!post) throw new AppError('Không tìm thấy bài viết', 404);\n  return post;\n};\n\nexports.create = async ({ title, content, tags = [] }) => {\n  const slug = slugify(title);\n  const exists = (await Post.findAll()).some((p) => p.slug === slug);\n  if (exists) throw new AppError('Tiêu đề đã tồn tại', 409);\n  return Post.create({ title, slug, content, tags });\n};` },
      callout: { type: 'info', t: 'Service **ném lỗi** (`throw AppError`) thay vì `res.status(...)`. Nó không biết mình đang chạy trong HTTP.' }
    },
    {
      title: 'Bước 3 — Controller', badge: 'LIVE CODING', layout: 'split', ratio: '1.25fr .75fr',
      code: { file: 'src/controllers/post.controller.js', lang: 'javascript', size: 'sm', src: `const postService = require('../services/post.service');\nconst asyncHandler = require('../utils/asyncHandler');\n\nexports.list = asyncHandler(async (req, res) => {\n  const posts = await postService.list(req.query);\n  res.json({ success: true, data: posts });\n});\n\nexports.getOne = asyncHandler(async (req, res) => {\n  const post = await postService.getById(Number(req.params.id));\n  res.json({ success: true, data: post });\n});\n\nexports.create = asyncHandler(async (req, res) => {\n  const post = await postService.create(req.body);\n  res.status(201).json({ success: true, data: post });\n});` },
      bullets: ['Mỏng: **3–5 dòng** mỗi hàm', 'Chỉ: lấy input → gọi service → trả output', 'Không `try/catch` nhờ `asyncHandler`']
    },
    {
      title: 'Bước 4 — Route & app.js', badge: 'LIVE CODING',
      cols: [
        { h: 'src/routes/post.routes.js', code: { lang: 'javascript', size: 'xs', src: `const router = require('express').Router();\nconst c = require('../controllers/post.controller');\nconst requireFields = require('../middlewares/requireFields');\n\nrouter.route('/')\n  .get(c.list)\n  .post(requireFields('title', 'content'), c.create);\n\nrouter.route('/:id')\n  .get(c.getOne)\n  .put(c.update)\n  .delete(c.remove);\n\nmodule.exports = router;` } },
        { h: 'src/routes/index.js', code: { lang: 'javascript', size: 'xs', src: `const router = require('express').Router();\n\nrouter.use('/posts', require('./post.routes'));\nrouter.use('/users', require('./user.routes'));\nrouter.get('/health', (req, res) =>\n  res.json({ status: 'ok' }));\n\nmodule.exports = router;\n\n// app.js\n// app.use('/api', require('./routes'));` } }
      ]
    },

    { kind: 'section', no: '03', title: 'Cấu hình & xử lý lỗi', sub: 'Bí mật không nằm trong code. Lỗi không nằm rải rác.' },
    {
      title: 'Biến môi trường & dotenv', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '.env (không commit)', code: { lang: 'bash', size: 'sm', src: `NODE_ENV=development\nPORT=3000\nDB_HOST=localhost\nDB_USER=root\nDB_PASS=supersecret\nJWT_SECRET=doi-chuoi-nay-di` } },
        { h: 'src/config/index.js', code: { lang: 'javascript', size: 'sm', src: `require('dotenv').config();\n\nconst required = ['DB_HOST', 'DB_USER', 'JWT_SECRET'];\nfor (const k of required) {\n  if (!process.env[k]) throw new Error('Thiếu biến ' + k);\n}\n\nmodule.exports = {\n  env: process.env.NODE_ENV || 'development',\n  port: Number(process.env.PORT) || 3000,\n  db: { host: process.env.DB_HOST, user: process.env.DB_USER,\n        pass: process.env.DB_PASS },\n  jwtSecret: process.env.JWT_SECRET\n};` } }
      ],
      callout: { type: 'danger', t: 'Lộ `.env` lên GitHub = lộ mật khẩu DB. Thêm `.env` vào `.gitignore`, commit **`.env.example`** (chỉ có tên biến, không có giá trị thật).' }
    },
    {
      title: 'Tách app.js và server.js', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: 'src/app.js', code: { lang: 'javascript', size: 'xs', src: `const express = require('express');\nconst morgan = require('morgan');\nconst cors = require('cors');\nconst routes = require('./routes');\nconst notFound = require('./middlewares/notFound');\nconst errorHandler = require('./middlewares/errorHandler');\n\nconst app = express();\napp.use(morgan('dev'));\napp.use(cors());\napp.use(express.json());\napp.use(express.static('public'));\napp.use('/api', routes);\napp.use(notFound);\napp.use(errorHandler);\n\nmodule.exports = app;   // 👉 không listen ở đây` } },
        { h: 'src/server.js', code: { lang: 'javascript', size: 'xs', src: `const app = require('./app');\nconst config = require('./config');\n\napp.listen(config.port, () => {\n  console.log(\n    \`🚀 [\${config.env}] http://localhost:\${config.port}\`\n  );\n});\n\n// package.json\n// "start": "node src/server.js",\n// "dev":   "nodemon src/server.js"` } }
      ],
      callout: { type: 'info', t: 'B12, thư viện **Supertest** sẽ `require(\'./app\')` để test mà không cần mở cổng thật.' }
    },
    {
      title: 'AppError — lỗi “có chủ đích”', layout: 'split', ratio: '1.1fr .9fr',
      code: { file: 'src/utils/AppError.js', lang: 'javascript', size: 'sm', src: `class AppError extends Error {\n  constructor(message, status = 500, details) {\n    super(message);\n    this.status = status;\n    this.details = details;\n    this.isOperational = true; // lỗi dự kiến, không phải bug\n  }\n}\nmodule.exports = AppError;\n\n// dùng ở bất kỳ đâu:\nthrow new AppError('Không tìm thấy bài viết', 404);\nthrow new AppError('Dữ liệu không hợp lệ', 400, errors);` },
      bullets: ['Phân biệt **lỗi nghiệp vụ** (404, 409…) và **bug** (500)', 'Lỗi nghiệp vụ: hiện message cho client', 'Bug: ẩn chi tiết, chỉ log phía server']
    },
    {
      title: 'asyncHandler — tạm biệt try/catch lặp lại', layout: 'split', ratio: '1.1fr .9fr',
      code: { file: 'src/utils/asyncHandler.js', lang: 'javascript', size: 'sm', src: `// Bọc handler async: lỗi nào cũng chuyển cho next()\nmodule.exports = (fn) => (req, res, next) =>\n  Promise.resolve(fn(req, res, next)).catch(next);\n\n// Trước:\nrouter.get('/', async (req, res, next) => {\n  try { res.json(await svc.list()); }\n  catch (e) { next(e); }\n});\n\n// Sau:\nrouter.get('/', asyncHandler(async (req, res) => {\n  res.json(await svc.list());\n}));` },
      bullets: ['Hàm bậc cao: nhận hàm, trả về hàm', '3 dòng code tiết kiệm hàng trăm dòng `try/catch`', 'Express 5 làm sẵn điều này — nhưng hiểu cơ chế vẫn rất đáng']
    },
    {
      title: 'Error handler hoàn chỉnh', badge: 'GHI NHỚ',
      code: { file: 'src/middlewares/errorHandler.js', lang: 'javascript', size: 'sm', src: `const config = require('../config');\n\nmodule.exports = (err, req, res, next) => {\n  // JSON body hỏng (express.json ném SyntaxError)\n  if (err.type === 'entity.parse.failed') {\n    err.status = 400; err.message = 'JSON không hợp lệ'; err.isOperational = true;\n  }\n\n  const status = err.status || 500;\n  if (status >= 500) console.error('💥', err);\n\n  res.status(status).json({\n    success: false,\n    error: {\n      message: err.isOperational ? err.message : 'Lỗi máy chủ',\n      ...(err.details && { details: err.details }),\n      ...(config.env === 'development' && status >= 500 && { stack: err.stack })\n    }\n  });\n};` }
    },
    {
      title: 'Kiểm tra hiểu bài', badge: 'QUIZ',
      quiz: { q: 'Logic “kiểm tra slug bài viết đã tồn tại thì báo 409” nên đặt ở đâu?', opts: ['Route', 'Controller', 'Service', 'Error handler'], a: 2, why: 'Đó là **quy tắc nghiệp vụ** → thuộc **Service**. Service ném `AppError(…, 409)`; error handler chỉ lo định dạng response.' }
    }
  ],
  recap: [
    'Phân lớp: **Route → (Middleware) → Controller → Service → Model**',
    'Controller mỏng, **service không biết `req`/`res`**, model lo dữ liệu',
    'Cấu hình bằng `.env` + `dotenv`; commit `.env.example`, **không** commit `.env`',
    'Tách `app.js` (cấu hình app) và `server.js` (listen)',
    '`AppError` + `asyncHandler` + error handler tập trung'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Sắp xếp đoạn code vào đúng lớp',
      desc: 'Giảng viên phát 8 đoạn code nhỏ (đọc `req.params`, kiểm tra email trùng, `res.status(201)`, `fs.readFile`, tính tổng tiền đơn hàng, `router.post`, kiểm tra header Authorization, format JSON lỗi). Xếp mỗi đoạn vào đúng lớp.',
      tasks: ['Phân loại vào: Route / Middleware / Controller / Service / Model / Error handler', 'Giải thích 1 câu cho mỗi lựa chọn', 'Thảo luận với bạn bên cạnh những đoạn bạn phân vân'],
      hints: ['Hỏi: “Đoạn này có cần biết về HTTP không?” — không → Service hoặc Model']
    },
    {
      level: 'core', time: 45, title: 'Refactor Products (B5) theo MVC',
      desc: 'Tái cấu trúc bài CRUD products của B5 sang kiến trúc 4 lớp. **Hành vi API không được thay đổi** — Postman Collection B5 phải chạy xanh 100%.',
      tasks: ['Tạo đúng cấu trúc `src/{routes,controllers,services,models,middlewares,utils,config}`', '`product.model.js` đọc/ghi file JSON', '`product.service.js` chứa validate nghiệp vụ, ném `AppError`', 'Controller dùng `asyncHandler`, không có `try/catch`', 'Chạy lại Postman Runner: tất cả test pass'],
      hints: ['Refactor **từng bước**, chạy lại test sau mỗi bước', 'Bắt đầu từ Model (dưới cùng) đi lên'],
      solution: [
        { file: 'src/services/product.service.js', lang: 'javascript', src: `const Product = require('../models/product.model');\nconst AppError = require('../utils/AppError');\n\nfunction validate(b, partial) {\n  const e = [];\n  if (!partial || b.name !== undefined) if (typeof b.name !== 'string' || b.name.trim().length < 2) e.push({ field: 'name', msg: 'Tối thiểu 2 ký tự' });\n  if (!partial || b.price !== undefined) if (typeof b.price !== 'number' || b.price <= 0) e.push({ field: 'price', msg: 'Phải > 0' });\n  if (e.length) throw new AppError('Dữ liệu không hợp lệ', 400, e);\n}\n\nexports.list = (q) => Product.findAll(q);\nexports.get = async (id) => {\n  const p = await Product.findById(id);\n  if (!p) throw new AppError('Không tìm thấy sản phẩm', 404);\n  return p;\n};\nexports.create = async (data) => { validate(data); return Product.create(data); };\nexports.update = async (id, data) => { validate(data, true); await exports.get(id); return Product.update(id, data); };\nexports.remove = async (id) => { await exports.get(id); return Product.remove(id); };` },
        { file: 'src/controllers/product.controller.js', lang: 'javascript', src: `const svc = require('../services/product.service');\nconst ah = require('../utils/asyncHandler');\nconst id = (req) => Number(req.params.id);\n\nexports.list = ah(async (req, res) => res.json({ success: true, data: await svc.list(req.query) }));\nexports.get = ah(async (req, res) => res.json({ success: true, data: await svc.get(id(req)) }));\nexports.create = ah(async (req, res) => res.status(201).json({ success: true, data: await svc.create(req.body) }));\nexports.update = ah(async (req, res) => res.json({ success: true, data: await svc.update(id(req), req.body) }));\nexports.remove = ah(async (req, res) => { await svc.remove(id(req)); res.sendStatus(204); });` }
      ]
    },
    {
      level: 'core', time: 20, title: 'Cấu hình bằng dotenv',
      desc: 'Đưa mọi giá trị cấu hình ra `.env`.',
      tasks: ['Cài `dotenv`, tạo `src/config/index.js`', 'Chuyển `PORT`, `NODE_ENV`, `API_KEY` (B4) vào `.env`', 'Thiếu biến bắt buộc → app **dừng ngay** khi khởi động, báo rõ thiếu biến nào', 'Tạo `.env.example`, kiểm tra `.gitignore`', 'Chạy thử với `PORT=4000` mà không sửa code'],
      hints: ['Gọi `require("dotenv").config()` **càng sớm càng tốt**', 'Trên Windows PowerShell: `$env:PORT=4000; npm run dev`']
    },
    {
      level: 'core', time: 25, title: 'Error handler “xịn”',
      desc: 'Hoàn thiện hệ thống xử lý lỗi.',
      tasks: ['`AppError` với `status`, `details`, `isOperational`', '`asyncHandler`', 'Error handler xử lý: JSON body hỏng → 400; AppError → status tương ứng; lỗi khác → 500 ẩn chi tiết', 'Ở `development` kèm `stack`, ở `production` thì không', 'Viết 4 request Postman chứng minh từng trường hợp'],
      hints: ['Lỗi JSON hỏng của `express.json()` có `err.type === "entity.parse.failed"`']
    },
    {
      level: 'challenge', time: 35, title: 'Response helpers & request ID',
      desc: 'Chuẩn hóa response và truy vết request.',
      tasks: ['Middleware gắn `res.ok(data, meta)`, `res.created(data)`, `res.noContent()` vào `res`', 'Middleware gắn `req.id` (dùng `crypto.randomUUID()`) và header `X-Request-Id` vào response', 'Logger và error handler in kèm `req.id`', 'Response lỗi chứa `requestId` để người dùng báo lỗi cho admin'],
      hints: ['`res.ok = (data, meta) => res.json({ success: true, data, ...(meta && { meta }) })`'],
      solution: { file: 'src/middlewares/responseHelpers.js', lang: 'javascript', src: `const { randomUUID } = require('crypto');\n\nmodule.exports = (req, res, next) => {\n  req.id = req.get('x-request-id') || randomUUID();\n  res.set('X-Request-Id', req.id);\n\n  res.ok = (data, meta) => res.json({ success: true, data, ...(meta && { meta }) });\n  res.created = (data) => res.status(201).json({ success: true, data });\n  res.noContent = () => res.sendStatus(204);\n  next();\n};` }
    },
    {
      level: 'homework', time: 40, title: 'Vẽ sơ đồ kiến trúc & viết tài liệu',
      desc: 'Tài liệu hóa kiến trúc dự án của bạn.',
      tasks: ['Vẽ sơ đồ luồng một request `POST /api/products` đi qua các lớp (draw.io / Excalidraw)', 'Thêm mục **Kiến trúc** vào README: cấu trúc thư mục + trách nhiệm từng lớp', 'Thêm mục **Cài đặt**: clone → `npm i` → tạo `.env` từ `.env.example` → `npm run dev`', 'Nhờ một bạn khác làm theo README từ đầu — sửa chỗ họ bị vướng'],
      hints: ['README tốt = người lạ chạy được dự án trong 5 phút']
    },
    {
      level: 'project', time: 40, title: 'Đồ án DevBlog: tái cấu trúc MVC',
      desc: 'Cột mốc 2 của đồ án.',
      tasks: ['Chuyển toàn bộ code sang `src/` theo 4 lớp', '`.env` + `config/`, tách `app.js` / `server.js`', '`AppError`, `asyncHandler`, error handler tập trung', 'Postman Collection B5 vẫn chạy xanh', 'Commit: `refactor: MVC architecture`'],
      hints: ['Đừng thêm tính năng mới trong commit refactor — dễ review hơn']
    }
  ],
  project: {
    lead: '**Cột mốc 2**: DevBlog có kiến trúc chuyên nghiệp, sẵn sàng cắm database.',
    tasks: ['Cấu trúc `src/` 4 lớp + `config/` + `.env`', 'AppError + asyncHandler + error handler', 'Test hồi quy bằng Postman Runner'],
    callout: { type: 'tip', t: 'Buổi 7 chỉ cần **viết lại các file model** — đó là phần thưởng cho việc refactor hôm nay.' }
  }
};
