/* ============================================================
   BUỔI 5 — Thiết kế REST API & CRUD
   ============================================================ */
SESSION_DATA[5] = {
  intro: 'Buổi bản lề: học viên chuyển từ "viết route" sang "thiết kế API". Nhấn mạnh tư duy tài nguyên (danh từ) + HTTP method (động từ) + status code. Cuối buổi đồ án DevBlog có CRUD bài viết đầy đủ (in-memory/file JSON).',
  agenda: [
    { min: 10, t: 'Ôn B4 & chữa bài tập', d: '' },
    { min: 30, t: 'REST là gì? Tài nguyên, URL, method', d: '6 ràng buộc REST (giới thiệu)' },
    { min: 25, t: 'Status code & định dạng response nhất quán', d: '' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 50, t: 'Live coding: CRUD bài viết', d: 'GET list/detail, POST, PUT/PATCH, DELETE' },
    { min: 20, t: 'Validation đầu vào & lọc / tìm kiếm', d: '' },
    { min: 20, t: 'Postman Collection & biến môi trường', d: '' },
    { min: 15, t: 'Tổng kết & giao bài', d: '' }
  ],
  slides: [
    { kind: 'section', no: '01', title: 'REST là gì?', sub: 'Một phong cách thiết kế API mà gần như cả thế giới web đang dùng.' },
    {
      title: 'API — “hợp đồng” giữa Front-end và Back-end', layout: 'split', ratio: '1fr 1fr',
      bullets: ['**API** (Application Programming Interface): cách hai phần mềm nói chuyện', 'Web API: Front-end gửi HTTP request → Back-end trả **JSON**', 'Một API tốt: **dễ đoán**, nhất quán, có tài liệu', 'Cùng API có thể phục vụ **web, mobile, app khác**'],
      img: { src: 'three-tier.svg', cap: 'Front-end ↔ API ↔ Database', h: 460 }
    },
    {
      title: 'REST — Representational State Transfer', kicker: 'B05 · Roy Fielding, 2000',
      cards: [
        { icon: '🤝', h: 'Client–Server', p: 'Tách giao diện và xử lý dữ liệu' },
        { icon: '🧠', h: 'Stateless', p: 'Mỗi request tự chứa đủ thông tin (vd token)' },
        { icon: '🗄️', h: 'Cacheable', p: 'Response cho biết có được cache không' },
        { icon: '🔗', h: 'Uniform Interface', p: 'URL cho tài nguyên, method cho hành động' },
        { icon: '🧱', h: 'Layered System', p: 'Có thể có proxy, load balancer ở giữa' },
        { icon: '📦', h: 'Code on demand', p: '(Tùy chọn) server gửi code cho client' }
      ], cols: 3, small: true,
      callout: { type: 'tip', t: 'Không cần thuộc lòng 6 ràng buộc. Cần nhớ: **tài nguyên = danh từ trong URL**, **hành động = HTTP method**.' }
    },
    {
      title: 'Tư duy tài nguyên: danh từ, không phải động từ',
      cols: [
        { h: '⛔ Kiểu “RPC” — tránh', cls: 'bad', code: { lang: 'http', size: 'sm', src: `GET  /getAllPosts\nPOST /createPost\nPOST /updatePost?id=5\nGET  /deletePost/5\nGET  /getCommentsOfPost?postId=5` } },
        { h: '✅ Kiểu REST — nên', cls: 'good', code: { lang: 'http', size: 'sm', src: `GET    /posts\nPOST   /posts\nPUT    /posts/5\nDELETE /posts/5\nGET    /posts/5/comments` } }
      ],
      callout: { type: 'info', t: 'URL trả lời “**cái gì**”, method trả lời “**làm gì**”. Dùng **danh từ số nhiều**, chữ thường, nối bằng gạch ngang: `/blog-posts`.' }
    },
    {
      title: 'Bảng CRUD ↔ HTTP chuẩn', kicker: 'B05 · Học thuộc bảng này',
      table: {
        head: ['Hành động', 'Method', 'URL', 'Thành công', 'Body response'],
        rows: [
          ['Lấy danh sách', '`GET`', '`/api/posts`', '`200 OK`', 'Mảng bài viết'],
          ['Lấy một', '`GET`', '`/api/posts/:id`', '`200 OK`', 'Một bài viết'],
          ['Tạo mới', '`POST`', '`/api/posts`', '`201 Created`', 'Bài vừa tạo'],
          ['Thay thế toàn bộ', '`PUT`', '`/api/posts/:id`', '`200 OK`', 'Bài sau khi sửa'],
          ['Sửa một phần', '`PATCH`', '`/api/posts/:id`', '`200 OK`', 'Bài sau khi sửa'],
          ['Xóa', '`DELETE`', '`/api/posts/:id`', '`204 No Content`', '(trống)']
        ]
      }
    },
    {
      title: 'PUT vs PATCH', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: 'PUT — thay thế toàn bộ', code: { lang: 'json', size: 'sm', src: `// PUT /api/posts/5\n{\n  "title": "Tiêu đề mới",\n  "content": "Nội dung mới",\n  "tags": ["node"]\n}\n// thiếu trường → coi như xóa/để mặc định` } },
        { h: 'PATCH — chỉ sửa trường gửi lên', code: { lang: 'json', size: 'sm', src: `// PATCH /api/posts/5\n{\n  "title": "Chỉ đổi tiêu đề"\n}\n// các trường khác giữ nguyên` } }
      ],
      callout: { type: 'tip', t: '**Idempotent**: gọi `PUT`/`DELETE` nhiều lần cho cùng kết quả như gọi một lần. `POST` thì không — gọi 2 lần tạo 2 bài!' }
    },
    {
      title: 'Quan hệ & tài nguyên lồng nhau',
      table: {
        head: ['Nhu cầu', 'Thiết kế'],
        rows: [
          ['Bình luận của bài 5', '`GET /api/posts/5/comments`'],
          ['Thêm bình luận vào bài 5', '`POST /api/posts/5/comments`'],
          ['Xóa bình luận 12', '`DELETE /api/comments/12` (không cần lồng sâu)'],
          ['Bài viết của user 3', '`GET /api/users/3/posts` hoặc `GET /api/posts?author=3`'],
          ['Hồ sơ của chính mình', '`GET /api/me` (alias, B9)']
        ]
      },
      callout: { type: 'warn', t: 'Đừng lồng quá **2 cấp**: `/users/3/posts/5/comments/12/likes` là quá sâu.' }
    },
    {
      title: 'Lọc, tìm kiếm, sắp xếp, phân trang → query string',
      code: { lang: 'http', src: `GET /api/posts?q=node                 # tìm kiếm\nGET /api/posts?tag=express            # lọc\nGET /api/posts?sort=-createdAt        # sắp xếp (dấu - = giảm dần)\nGET /api/posts?page=2&limit=10        # phân trang\nGET /api/posts?tag=node&sort=title&page=1&limit=5   # kết hợp` },
      callout: { type: 'info', t: 'Tất cả vẫn là **cùng một tài nguyên** `/api/posts` — query chỉ thay đổi **cách lấy**.' }
    },

    { kind: 'section', no: '02', title: 'Status code & Response', sub: 'API chuyên nghiệp “nói” đúng mã lỗi và luôn trả cùng một hình dạng.' },
    {
      title: 'Status code hay dùng nhất khi làm API',
      table: {
        head: ['Code', 'Ý nghĩa', 'Khi nào dùng'],
        rows: [
          ['`200 OK`', 'Thành công', 'GET, PUT, PATCH thành công'],
          ['`201 Created`', 'Đã tạo', 'POST tạo tài nguyên mới'],
          ['`204 No Content`', 'Thành công, không có body', 'DELETE'],
          ['`400 Bad Request`', 'Dữ liệu gửi lên sai', 'Thiếu trường, sai kiểu, JSON hỏng'],
          ['`401 Unauthorized`', 'Chưa xác thực', 'Thiếu/sai token (B9)'],
          ['`403 Forbidden`', 'Không đủ quyền', 'Sửa bài của người khác (B10)'],
          ['`404 Not Found`', 'Không tồn tại', 'ID không có'],
          ['`409 Conflict`', 'Xung đột', 'Email/slug đã tồn tại'],
          ['`422 Unprocessable`', 'Hợp lệ cú pháp, sai nghiệp vụ', 'Validation chi tiết (tùy chọn)'],
          ['`500 Internal Error`', 'Lỗi server', 'Bug, DB sập']
        ], small: true
      }
    },
    {
      title: 'Định dạng response nhất quán', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '✅ Thành công', cls: 'good', code: { lang: 'json', size: 'sm', src: `{\n  "success": true,\n  "data": { "id": 5, "title": "..." }\n}\n\n// danh sách\n{\n  "success": true,\n  "data": [ ... ],\n  "meta": { "page": 1, "limit": 10, "total": 42 }\n}` } },
        { h: '❌ Lỗi', cls: 'bad', code: { lang: 'json', size: 'sm', src: `{\n  "success": false,\n  "error": {\n    "message": "Dữ liệu không hợp lệ",\n    "details": [\n      { "field": "title", "msg": "Bắt buộc" }\n    ]\n  }\n}` } }
      ],
      callout: { type: 'tip', t: 'Front-end chỉ cần viết **một** hàm xử lý response cho mọi API. Cả nhóm thống nhất format **ngay từ đầu**.' }
    },

    { kind: 'section', no: '03', title: 'Live coding: CRUD bài viết', sub: 'Từ thiết kế trên giấy đến API chạy thật trong 50 phút.' },
    {
      title: 'Dữ liệu & khung router', badge: 'LIVE CODING',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `const router = require('express').Router();\n\nlet posts = [\n  { id: 1, title: 'Hello Node', content: 'Bài đầu tiên', tags: ['node'], createdAt: new Date() },\n  { id: 2, title: 'Express căn bản', content: 'Routing...', tags: ['express'], createdAt: new Date() }\n];\nlet nextId = 3;\n\nconst findPost = (id) => posts.find((p) => p.id === Number(id));\n\n// ... các route ở slide sau ...\n\nmodule.exports = router;` }
    },
    {
      title: 'READ — GET danh sách & chi tiết', badge: 'LIVE CODING',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `// GET /api/posts?q=node&tag=express\nrouter.get('/', (req, res) => {\n  const { q, tag } = req.query;\n  let result = posts;\n  if (q)   result = result.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));\n  if (tag) result = result.filter((p) => p.tags.includes(tag));\n  res.json({ success: true, data: result, meta: { total: result.length } });\n});\n\n// GET /api/posts/:id\nrouter.get('/:id', (req, res) => {\n  const post = findPost(req.params.id);\n  if (!post) return res.status(404).json({ success: false, error: { message: 'Không tìm thấy bài viết' } });\n  res.json({ success: true, data: post });\n});` }
    },
    {
      title: 'CREATE — POST', badge: 'LIVE CODING',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `router.post('/', (req, res) => {\n  const { title, content, tags = [] } = req.body;\n\n  if (!title || !content) {\n    return res.status(400).json({ success: false, error: { message: 'title và content là bắt buộc' } });\n  }\n\n  const post = { id: nextId++, title: title.trim(), content, tags, createdAt: new Date() };\n  posts.push(post);\n\n  res.status(201)\n     .location(\`/api/posts/\${post.id}\`)   // header Location: nơi xem tài nguyên mới\n     .json({ success: true, data: post });\n});` },
      callout: { type: 'info', t: 'Không bao giờ tin `id` client gửi lên khi tạo mới — **server tự sinh** id.' }
    },
    {
      title: 'UPDATE — PUT & PATCH', badge: 'LIVE CODING',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `router.put('/:id', (req, res) => {\n  const post = findPost(req.params.id);\n  if (!post) return res.status(404).json({ success: false, error: { message: 'Không tìm thấy' } });\n  const { title, content, tags = [] } = req.body;\n  if (!title || !content) return res.status(400).json({ success: false, error: { message: 'Thiếu dữ liệu' } });\n  Object.assign(post, { title, content, tags, updatedAt: new Date() });\n  res.json({ success: true, data: post });\n});\n\nrouter.patch('/:id', (req, res) => {\n  const post = findPost(req.params.id);\n  if (!post) return res.status(404).json({ success: false, error: { message: 'Không tìm thấy' } });\n  const allowed = ['title', 'content', 'tags'];           // ⚠️ whitelist trường được sửa\n  for (const k of allowed) if (req.body[k] !== undefined) post[k] = req.body[k];\n  post.updatedAt = new Date();\n  res.json({ success: true, data: post });\n});` },
      callout: { type: 'danger', t: '**Mass assignment**: `Object.assign(post, req.body)` cho phép client sửa cả `id`, `authorId`, `role`… Luôn **whitelist** trường!' }
    },
    {
      title: 'DELETE', badge: 'LIVE CODING', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `router.delete('/:id', (req, res) => {\n  const id = Number(req.params.id);\n  const exists = posts.some((p) => p.id === id);\n  if (!exists) {\n    return res.status(404).json({ success: false, error: { message: 'Không tìm thấy' } });\n  }\n  posts = posts.filter((p) => p.id !== id);\n  res.sendStatus(204);\n});` },
      bullets: ['Trả **204** — không có body', 'Xóa thứ không tồn tại → **404**', 'Thực tế hay dùng **soft delete**: đánh dấu `deletedAt` thay vì xóa hẳn']
    },
    {
      title: 'Validation: đừng bao giờ tin client', kicker: 'B05 · Quy tắc an toàn số 1',
      bullets: ['Kiểm tra **có tồn tại** (required), **kiểu** (string/number), **độ dài**, **định dạng** (email, slug)', 'ID trên URL: phải là **số nguyên dương**', 'Chuẩn hóa: `trim()`, chữ thường cho email', 'Validate ở **back-end** dù front-end đã validate (dễ bị bỏ qua bằng Postman)'],
      code: { file: 'validators/post.js', lang: 'javascript', size: 'sm', src: `function validatePost(body) {\n  const errors = [];\n  if (typeof body.title !== 'string' || body.title.trim().length < 3) errors.push({ field: 'title', msg: 'Tối thiểu 3 ký tự' });\n  if (typeof body.content !== 'string' || !body.content.trim()) errors.push({ field: 'content', msg: 'Bắt buộc' });\n  if (body.tags && !Array.isArray(body.tags)) errors.push({ field: 'tags', msg: 'Phải là mảng' });\n  return errors;\n}` },
      callout: { type: 'info', t: 'B10 sẽ dùng thư viện **Joi** để viết validation ngắn gọn và đầy đủ hơn.' }
    },
    {
      title: 'Lưu xuống file JSON (để không mất khi restart)', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'data/store.js', lang: 'javascript', size: 'sm', src: `const fs = require('fs/promises');\nconst path = require('path');\nconst FILE = path.join(__dirname, 'posts.json');\n\nasync function readAll() {\n  try { return JSON.parse(await fs.readFile(FILE, 'utf8')); }\n  catch (e) { if (e.code === 'ENOENT') return []; throw e; }\n}\n\nasync function writeAll(posts) {\n  await fs.writeFile(FILE, JSON.stringify(posts, null, 2));\n}\n\nmodule.exports = { readAll, writeAll };` },
      bullets: ['In-memory mất sạch khi server restart', 'File JSON: tạm ổn cho học tập', 'Không chịu được nhiều người ghi cùng lúc → **B7: MySQL**'],
      callout: { type: 'warn', t: 'nodemon sẽ restart khi file JSON thay đổi! Thêm `nodemon.json`: `{ "ignore": ["data/*.json"] }`.' }
    },
    {
      title: 'Postman: Collection, biến, test tự động', badge: 'LIVE DEMO',
      steps: [
        { h: 'Environment', p: 'Tạo env “Local”: `baseUrl = http://localhost:3000/api`' },
        { h: 'Collection', p: '“DevBlog API” → folder **Posts** với 6 request CRUD' },
        { h: 'Lưu biến từ response', p: 'Tab Tests của POST: `pm.environment.set("postId", pm.response.json().data.id)`' },
        { h: 'Dùng lại', p: '`{{baseUrl}}/posts/{{postId}}` cho GET/PUT/DELETE' },
        { h: 'Runner', p: 'Chạy cả collection một lần — kiểm tra hồi quy' }
      ], vertical: true
    },
    {
      title: 'Kiểm tra nhanh', badge: 'QUIZ',
      quiz: { q: 'Client gửi POST /api/users với email đã tồn tại. Status code phù hợp nhất?', opts: ['200 OK', '400 Bad Request', '404 Not Found', '409 Conflict'], a: 3, why: '**409 Conflict**: request hợp lệ về cú pháp nhưng xung đột với trạng thái hiện tại (email đã có). 400 dùng khi dữ liệu sai định dạng.' }
    }
  ],
  recap: [
    'REST: **tài nguyên** = danh từ số nhiều trong URL, **hành động** = HTTP method',
    'CRUD ↔ GET / POST / PUT·PATCH / DELETE; status **200 · 201 · 204 · 400 · 404 · 409**',
    'Response nhất quán `{ success, data, meta }` / `{ success: false, error }`',
    'Validate mọi đầu vào ở back-end; **whitelist** trường được sửa (chống mass assignment)',
    'Lọc / tìm / sắp xếp / phân trang bằng **query string**; test bằng Postman Collection'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Thiết kế API trên giấy',
      desc: 'Thiết kế (chưa code) REST API cho một **thư viện sách**: sách, tác giả, độc giả, phiếu mượn.',
      tasks: ['Liệt kê đầy đủ endpoint: method + URL + mô tả + status thành công', 'Có ít nhất một tài nguyên lồng nhau (vd sách của một tác giả)', 'Có endpoint tìm kiếm & phân trang bằng query string', 'Đổi chéo với bạn bên cạnh để review: chỗ nào dùng động từ trong URL?'],
      hints: ['Mượn sách = **tạo** một phiếu mượn: `POST /loans`', 'Trả sách = **cập nhật** phiếu: `PATCH /loans/:id`']
    },
    {
      level: 'core', time: 45, title: 'CRUD Products (in-memory)',
      desc: 'Xây đầy đủ CRUD cho tài nguyên **products** `{ id, name, price, stock, category }`.',
      tasks: ['`GET /api/products` hỗ trợ `?category=` và `?q=` (tìm theo tên)', '`GET /api/products/:id` — 404 nếu không có, 400 nếu id không phải số', '`POST` — validate: `name` ≥ 2 ký tự, `price` > 0, `stock` số nguyên ≥ 0 → **201**', '`PUT`, `PATCH` (whitelist), `DELETE` → **204**', 'Response theo format `{ success, data }` thống nhất'],
      expected: 'POST /api/products {"name":"Bút","price":-5}\n→ 400 {"success":false,"error":{"message":"Dữ liệu không hợp lệ","details":[{"field":"price","msg":"Phải > 0"}]}}',
      hints: ['Viết helper `ok(res, data, status=200)` và `fail(res, status, message, details)`', '`Number.isInteger(stock) && stock >= 0`'],
      solution: { file: 'routes/products.js', lang: 'javascript', size: 'sm', src: `const router = require('express').Router();\nlet products = [{ id: 1, name: 'Bút bi', price: 5000, stock: 100, category: 'vpp' }];\nlet nextId = 2;\n\nconst ok = (res, data, status = 200) => res.status(status).json({ success: true, data });\nconst fail = (res, status, message, details) => res.status(status).json({ success: false, error: { message, details } });\n\nfunction validate(b, partial = false) {\n  const e = [];\n  if (!partial || b.name !== undefined) if (typeof b.name !== 'string' || b.name.trim().length < 2) e.push({ field: 'name', msg: 'Tối thiểu 2 ký tự' });\n  if (!partial || b.price !== undefined) if (typeof b.price !== 'number' || b.price <= 0) e.push({ field: 'price', msg: 'Phải > 0' });\n  if (!partial || b.stock !== undefined) if (!Number.isInteger(b.stock) || b.stock < 0) e.push({ field: 'stock', msg: 'Số nguyên >= 0' });\n  return e;\n}\n\nrouter.param('id', (req, res, next, id) => {\n  if (!/^\\d+$/.test(id)) return fail(res, 400, 'id không hợp lệ');\n  req.product = products.find((p) => p.id === Number(id));\n  if (!req.product) return fail(res, 404, 'Không tìm thấy sản phẩm');\n  next();\n});\n\nrouter.get('/', (req, res) => {\n  const { category, q } = req.query;\n  let r = products;\n  if (category) r = r.filter((p) => p.category === category);\n  if (q) r = r.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));\n  ok(res, r);\n});\nrouter.get('/:id', (req, res) => ok(res, req.product));\nrouter.post('/', (req, res) => {\n  const e = validate(req.body);\n  if (e.length) return fail(res, 400, 'Dữ liệu không hợp lệ', e);\n  const { name, price, stock, category = 'other' } = req.body;\n  const p = { id: nextId++, name: name.trim(), price, stock, category };\n  products.push(p);\n  ok(res, p, 201);\n});\nrouter.put('/:id', (req, res) => {\n  const e = validate(req.body);\n  if (e.length) return fail(res, 400, 'Dữ liệu không hợp lệ', e);\n  const { name, price, stock, category = 'other' } = req.body;\n  Object.assign(req.product, { name, price, stock, category });\n  ok(res, req.product);\n});\nrouter.patch('/:id', (req, res) => {\n  const e = validate(req.body, true);\n  if (e.length) return fail(res, 400, 'Dữ liệu không hợp lệ', e);\n  for (const k of ['name', 'price', 'stock', 'category']) if (req.body[k] !== undefined) req.product[k] = req.body[k];\n  ok(res, req.product);\n});\nrouter.delete('/:id', (req, res) => {\n  products = products.filter((p) => p !== req.product);\n  res.sendStatus(204);\n});\n\nmodule.exports = router;` },
      solutionNote: '`router.param` là kỹ thuật hay: chạy một lần cho mọi route có `:id`, gom phần kiểm tra id + tìm bản ghi về một chỗ.'
    },
    {
      level: 'core', time: 25, title: 'Sắp xếp & phân trang',
      desc: 'Bổ sung cho `GET /api/products`.',
      tasks: ['`?sort=price` (tăng dần) và `?sort=-price` (giảm dần); hỗ trợ `name`, `price`, `stock`', '`?page=2&limit=5`; mặc định `page=1`, `limit=10`, tối đa `limit=50`', 'Trả `meta: { page, limit, total, totalPages }`', 'Trường sort không hợp lệ → bỏ qua (hoặc 400, tùy bạn — ghi rõ trong README)'],
      hints: ['Sao chép mảng trước khi sort: `[...r].sort(...)`', '`slice((page-1)*limit, page*limit)`', '`Math.ceil(total / limit)`'],
      solution: { file: 'paginate.js', lang: 'javascript', size: 'sm', src: `const SORTABLE = ['name', 'price', 'stock'];\n\nfunction sortAndPaginate(items, query) {\n  let r = [...items];\n  if (query.sort) {\n    const desc = query.sort.startsWith('-');\n    const field = query.sort.replace(/^-/, '');\n    if (SORTABLE.includes(field)) {\n      r.sort((a, b) => (a[field] > b[field] ? 1 : a[field] < b[field] ? -1 : 0) * (desc ? -1 : 1));\n    }\n  }\n  const page = Math.max(1, parseInt(query.page, 10) || 1);\n  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));\n  const total = r.length;\n  return {\n    data: r.slice((page - 1) * limit, page * limit),\n    meta: { page, limit, total, totalPages: Math.ceil(total / limit) }\n  };\n}\nmodule.exports = sortAndPaginate;` }
    },
    {
      level: 'core', time: 20, title: 'Postman Collection có test',
      desc: 'Kiểm thử toàn bộ CRUD products bằng Postman.',
      tasks: ['Environment `Local` với `baseUrl`', 'Request POST lưu `productId` vào biến môi trường', 'Mỗi request có ít nhất 1 test kiểm tra status', 'Có request kiểm tra trường hợp lỗi (400, 404)', 'Chạy Collection Runner, chụp màn hình kết quả **tất cả xanh**'],
      hints: ['`pm.test("201", () => pm.response.to.have.status(201));`', '`pm.environment.set("productId", pm.response.json().data.id);`']
    },
    {
      level: 'challenge', time: 40, title: 'Lưu file JSON + chống ghi đè đồng thời',
      desc: 'Chuyển products sang lưu trong `data/products.json` bằng `fs/promises`.',
      tasks: ['Module `store.js` với `readAll()`, `writeAll()`', 'Mọi route chuyển sang `async` + `try/catch` + `next(err)`', 'Cấu hình `nodemon.json` bỏ qua thư mục `data/`', 'Ghi file an toàn: ghi ra file tạm rồi `fs.rename` (atomic write)', '**Bonus**: hàng đợi ghi (write queue) để 2 request ghi cùng lúc không làm mất dữ liệu'],
      hints: ['Atomic write: `await fs.writeFile(FILE + ".tmp", data); await fs.rename(FILE + ".tmp", FILE);`', 'Write queue: giữ một biến `let chain = Promise.resolve()`; mỗi lần ghi `chain = chain.then(() => doWrite())`'],
      solution: { file: 'data/store.js', lang: 'javascript', size: 'sm', src: `const fs = require('fs/promises');\nconst path = require('path');\nconst FILE = path.join(__dirname, 'products.json');\nlet chain = Promise.resolve();\n\nasync function readAll() {\n  try { return JSON.parse(await fs.readFile(FILE, 'utf8')); }\n  catch (e) { if (e.code === 'ENOENT') return []; throw e; }\n}\n\nfunction writeAll(items) {\n  chain = chain.then(async () => {\n    await fs.writeFile(FILE + '.tmp', JSON.stringify(items, null, 2));\n    await fs.rename(FILE + '.tmp', FILE);\n  });\n  return chain;\n}\n\n// cập nhật nguyên tử: đọc → sửa → ghi trong cùng một mắt xích\nfunction update(fn) {\n  chain = chain.then(async () => {\n    const items = await readAll();\n    const result = await fn(items);\n    await fs.writeFile(FILE + '.tmp', JSON.stringify(items, null, 2));\n    await fs.rename(FILE + '.tmp', FILE);\n    return result;\n  });\n  return chain;\n}\n\nmodule.exports = { readAll, writeAll, update };` }
    },
    {
      level: 'homework', time: 50, title: 'Trang quản trị sản phẩm (Front-end)',
      desc: 'Dựng giao diện quản lý products gọi API vừa viết.',
      tasks: ['Bảng danh sách sản phẩm, có ô tìm kiếm và chọn danh mục', 'Form thêm / sửa (dùng chung một form)', 'Nút xóa có hộp thoại xác nhận', 'Phân trang (nút Trước / Sau) dựa trên `meta`', 'Hiển thị lỗi validation dưới từng ô nhập (dùng `error.details`)'],
      hints: ['Viết hàm `api(method, url, body)` dùng chung, ném lỗi nếu `!res.ok`', 'Dùng `textContent` khi chèn dữ liệu (tránh XSS)']
    },
    {
      level: 'project', time: 40, title: 'Đồ án DevBlog: CRUD bài viết',
      desc: 'Cột mốc 1 của đồ án.',
      tasks: ['CRUD `/api/posts` đầy đủ, lưu file JSON', 'Tự sinh `slug` từ `title` (dùng `slugify` B1); slug trùng → **409**', '`GET /api/posts/:idOrSlug` nhận cả id lẫn slug', 'Lọc theo `?tag=`, tìm `?q=`, phân trang', 'Postman Collection “DevBlog” export vào thư mục `docs/`'],
      hints: ['Phân biệt id hay slug: `/^\\d+$/.test(param)`']
    }
  ],
  project: {
    lead: '**Cột mốc 1**: DevBlog có CRUD bài viết hoàn chỉnh.',
    tasks: ['CRUD `/api/posts` + slug tự sinh, lưu file JSON', 'Lọc / tìm kiếm / phân trang', 'Postman Collection trong `docs/`'],
    callout: { type: 'tip', t: 'Buổi sau ta **tái cấu trúc** code này theo MVC — nên commit thật sạch trước buổi 6.' }
  }
};
