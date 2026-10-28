/* ============================================================
   BUỔI 7 — MySQL & kết nối từ Node
   ============================================================ */
SESSION_DATA[7] = {
  intro: 'CT9 đã học SQL nên phần SQL chỉ ôn nhanh, tập trung vào: thiết kế ER cho DevBlog, kết nối mysql2 + pool, prepared statement chống SQL Injection, và viết lại model posts bằng SQL. Chuẩn bị sẵn MySQL (XAMPP / MySQL Installer / Docker) trên máy học viên từ trước buổi.',
  agenda: [
    { min: 10, t: 'Ôn B6 & kiểm tra MySQL đã cài', d: '' },
    { min: 25, t: 'Vì sao cần CSDL? Mô hình quan hệ', d: 'Bảng, khóa chính, khóa ngoại' },
    { min: 30, t: 'Thiết kế ER cho DevBlog', d: 'Quan hệ 1-N, N-N, chuẩn hóa' },
    { min: 20, t: 'Ôn nhanh SQL: DDL, DML, JOIN', d: '' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 25, t: 'mysql2 & Connection Pool', d: '' },
    { min: 25, t: 'SQL Injection & prepared statement', d: 'Demo tấn công' },
    { min: 20, t: 'Viết lại post.model bằng SQL & giao bài', d: '' }
  ],
  slides: [
    { kind: 'section', no: '01', title: 'Cơ sở dữ liệu quan hệ', sub: 'Tạm biệt file JSON — chào MySQL.' },
    {
      title: 'Vì sao file JSON không đủ?',
      cols: [
        { h: '📄 File JSON', cls: 'bad', bullets: ['Đọc **cả file** để tìm 1 bản ghi', 'Hai người ghi cùng lúc → **mất dữ liệu**', 'Không có ràng buộc (email trùng, khóa ngoại)', 'Không truy vấn phức tạp được (JOIN, GROUP BY)', 'File lớn → chậm, tốn RAM'] },
        { h: '🐬 MySQL', cls: 'good', bullets: ['Chỉ mục (index) → tìm cực nhanh', '**Transaction**, khóa → an toàn đồng thời', 'Ràng buộc: `UNIQUE`, `NOT NULL`, `FOREIGN KEY`', 'SQL mạnh mẽ, chuẩn công nghiệp', 'Hàng triệu bản ghi vẫn ổn'] }
      ],
      img: { src: 'mysql-logo.svg', cap: 'MySQL — CSDL mã nguồn mở phổ biến nhất thế giới', h: 110 }, layout: 'stack'
    },
    {
      title: 'Thuật ngữ mô hình quan hệ', layout: 'split', ratio: '.85fr 1.15fr',
      bullets: ['**Bảng** (relation / table) — một loại thực thể', '**Dòng** (tuple / row) — một bản ghi', '**Cột** (attribute / column) — một thuộc tính', '**Khóa chính** (PK) — định danh duy nhất mỗi dòng', '**Khóa ngoại** (FK) — tham chiếu tới PK bảng khác'],
      img: { src: 'relational-terms.svg', cap: 'Các thuật ngữ trong cơ sở dữ liệu quan hệ', h: 440 }
    },
    {
      title: 'Ba kiểu quan hệ', kicker: 'B07 · Mô hình hóa dữ liệu',
      cards: [
        { icon: '1️⃣', h: '1 – 1', p: 'Một user có **một** hồ sơ (profile). Ít gặp — thường gộp chung bảng.' },
        { icon: '🌿', h: '1 – N', p: 'Một user viết **nhiều** bài; mỗi bài thuộc **một** user. FK nằm ở **bên N**: `posts.user_id`.' },
        { icon: '🕸️', h: 'N – N', p: 'Một bài có nhiều tag; một tag gắn nhiều bài. Cần **bảng trung gian** `post_tags(post_id, tag_id)`.' }
      ], cols: 3,
      callout: { type: 'tip', t: 'Mẹo: đặt câu hỏi hai chiều — “Một A có bao nhiêu B?” và “Một B có bao nhiêu A?”' }
    },
    {
      title: 'ER Diagram — ví dụ thực tế', layout: 'split', ratio: '.8fr 1.2fr',
      bullets: ['Hình chữ nhật: **thực thể**', 'Đường nối: **quan hệ** kèm bản số (1, N)', 'Vẽ ER **trước** khi viết `CREATE TABLE`', 'Công cụ: draw.io, dbdiagram.io, MySQL Workbench'],
      img: { src: 'er-mmorpg.svg', cap: 'ER diagram của một game nhập vai trực tuyến', h: 520 }
    },
    {
      title: 'ER của DevBlog', kicker: 'B07 · Thiết kế cùng cả lớp', badge: 'THẢO LUẬN',
      table: {
        head: ['Bảng', 'Cột chính', 'Quan hệ'],
        rows: [
          ['`users`', '`id`, `name`, `email` (UNIQUE), `password_hash`, `role`, `created_at`', '1 user — N posts, N comments'],
          ['`posts`', '`id`, `user_id` (FK), `title`, `slug` (UNIQUE), `content`, `status`, `created_at`', 'N posts — 1 user'],
          ['`comments`', '`id`, `post_id` (FK), `user_id` (FK), `content`, `created_at`', 'N comments — 1 post, 1 user'],
          ['`tags`', '`id`, `name` (UNIQUE)', 'N – N với posts'],
          ['`post_tags`', '`post_id` (FK), `tag_id` (FK) — PK kép', 'Bảng trung gian']
        ], small: true
      },
      callout: { type: 'info', t: 'Quy ước đặt tên: bảng **số nhiều, snake_case**; khóa ngoại `<bảng số ít>_id`.' },
      notes: 'Vẽ lên bảng cùng học viên. Hỏi: "Like bài viết thì thêm bảng gì?" → post_likes(user_id, post_id) N-N.'
    },
    {
      title: 'Chuẩn hóa — tránh dữ liệu lặp', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '⛔ Chưa chuẩn hóa', cls: 'bad', code: { lang: 'sql', size: 'xs', src: `posts\n| id | title  | author_name | author_email   | tags            |\n|  1 | Node   | Lan         | lan@ct9.vn     | node,express    |\n|  2 | MySQL  | Lan         | lan@ct9.vn     | mysql           |\n-- Lan đổi email → sửa N dòng\n-- tìm bài có tag 'node' → LIKE '%node%' 😬` } },
        { h: '✅ Đã chuẩn hóa', cls: 'good', bullets: ['Thông tin tác giả ở bảng `users`, posts chỉ giữ `user_id`', 'Mỗi ô **một giá trị** (1NF) → tags tách bảng', 'Sửa một chỗ, đúng mọi nơi'] }
      ],
      callout: { type: 'tip', t: 'Ba dạng chuẩn đầu (1NF–3NF) là đủ cho 95% ứng dụng web.' }
    },

    { kind: 'section', no: '02', title: 'Ôn nhanh SQL', sub: 'DDL tạo cấu trúc, DML thao tác dữ liệu, JOIN nối bảng.' },
    {
      title: 'DDL — tạo bảng cho DevBlog', badge: 'LIVE CODING',
      code: { file: 'db/schema.sql', lang: 'sql', size: 'xs', src: `CREATE DATABASE IF NOT EXISTS devblog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nUSE devblog;\n\nCREATE TABLE users (\n  id            INT AUTO_INCREMENT PRIMARY KEY,\n  name          VARCHAR(100) NOT NULL,\n  email         VARCHAR(255) NOT NULL UNIQUE,\n  password_hash VARCHAR(255) NOT NULL,\n  role          ENUM('user','admin') NOT NULL DEFAULT 'user',\n  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE posts (\n  id         INT AUTO_INCREMENT PRIMARY KEY,\n  user_id    INT NOT NULL,\n  title      VARCHAR(200) NOT NULL,\n  slug       VARCHAR(220) NOT NULL UNIQUE,\n  content    TEXT NOT NULL,\n  status     ENUM('draft','published') DEFAULT 'draft',\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n);` },
      callout: { type: 'warn', t: 'Dùng `utf8mb4` để lưu **tiếng Việt và emoji** 🎉 đúng cách (`utf8` cũ của MySQL thiếu emoji).' }
    },
    {
      title: 'DML — CRUD bằng SQL',
      code: { lang: 'sql', size: 'sm', src: `INSERT INTO posts (user_id, title, slug, content) VALUES (1, 'Hello', 'hello', 'Nội dung');\n\nSELECT id, title, created_at FROM posts\nWHERE status = 'published' AND title LIKE '%node%'\nORDER BY created_at DESC\nLIMIT 10 OFFSET 20;          -- trang 3, mỗi trang 10\n\nUPDATE posts SET title = 'Tiêu đề mới' WHERE id = 5;\n\nDELETE FROM posts WHERE id = 5;\n\nSELECT user_id, COUNT(*) AS total FROM posts GROUP BY user_id HAVING total > 3;` },
      callout: { type: 'danger', t: '`UPDATE` / `DELETE` **quên `WHERE`** = sửa/xóa **toàn bộ bảng**. Luôn viết `WHERE` trước!' }
    },
    {
      title: 'Các kiểu JOIN', layout: 'split', ratio: '1.1fr .9fr',
      code: { lang: 'sql', size: 'sm', src: `-- Bài viết kèm tên tác giả\nSELECT p.id, p.title, u.name AS author\nFROM posts p\nINNER JOIN users u ON u.id = p.user_id;\n\n-- Mọi user, kể cả chưa viết bài nào\nSELECT u.name, COUNT(p.id) AS posts\nFROM users u\nLEFT JOIN posts p ON p.user_id = u.id\nGROUP BY u.id;\n\n-- Tag của bài 5 (qua bảng trung gian)\nSELECT t.name FROM tags t\nJOIN post_tags pt ON pt.tag_id = t.id\nWHERE pt.post_id = 5;` },
      img: [{ src: 'join-inner.svg', cap: 'INNER JOIN', h: 150 }, { src: 'join-left.svg', cap: 'LEFT JOIN', h: 150 }]
    },

    { kind: 'section', no: '03', title: 'Kết nối MySQL từ Node', sub: 'Thư viện mysql2, connection pool và prepared statement.' },
    {
      title: 'Cài đặt & kết nối với mysql2', badge: 'LIVE CODING',
      term: `$ npm install mysql2`,
      code: { file: 'src/config/db.js', lang: 'javascript', size: 'sm', src: `const mysql = require('mysql2/promise');\nconst config = require('./index');\n\nconst pool = mysql.createPool({\n  host: config.db.host,\n  user: config.db.user,\n  password: config.db.pass,\n  database: config.db.name,\n  waitForConnections: true,\n  connectionLimit: 10,      // tối đa 10 kết nối mở cùng lúc\n  namedPlaceholders: true\n});\n\nmodule.exports = pool;` },
      callout: { type: 'tip', t: 'Dùng `mysql2/promise` để viết được `await pool.query(...)`.' }
    },
    {
      title: 'Vì sao cần Connection Pool?', layout: 'split', ratio: '1fr 1fr',
      bullets: ['Mở kết nối DB **rất tốn kém** (TCP + xác thực)', 'Pool giữ sẵn N kết nối, **cho mượn – trả lại**', 'Request đến khi pool hết → **xếp hàng chờ**', 'Một pool dùng chung cho cả ứng dụng'],
      code: { lang: 'javascript', size: 'sm', src: `// kiểm tra kết nối khi khởi động server\nasync function checkDb() {\n  const [rows] = await pool.query('SELECT 1 + 1 AS ok');\n  console.log('✅ MySQL OK', rows[0].ok);\n}\n\ncheckDb().catch((e) => {\n  console.error('❌ Không kết nối được MySQL:', e.message);\n  process.exit(1);\n});` }
    },
    {
      title: 'Truy vấn với mysql2', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `// SELECT → [rows, fields]\nconst [rows] = await pool.query(\n  'SELECT * FROM posts WHERE status = ? ORDER BY id DESC LIMIT ?',\n  ['published', 10]\n);\n\n// INSERT → result.insertId\nconst [result] = await pool.execute(\n  'INSERT INTO posts (user_id, title, slug, content) VALUES (?, ?, ?, ?)',\n  [1, title, slug, content]\n);\nconsole.log(result.insertId, result.affectedRows);` },
      bullets: ['Kết quả là **mảng** `[rows, fields]` → destructure', '`?` là **placeholder** — giá trị truyền riêng', '`execute` = prepared statement thật sự (nên dùng)', '`insertId`, `affectedRows` để biết kết quả ghi']
    },
    {
      title: 'SQL Injection — lỗ hổng kinh điển', kicker: 'B07 · Bảo mật', badge: 'DEMO TẤN CÔNG',
      code: { lang: 'javascript', size: 'sm', src: `// ⛔ NỐI CHUỖI — TUYỆT ĐỐI KHÔNG LÀM\nconst sql = "SELECT * FROM users WHERE email = '" + req.body.email + "'";\n\n// Kẻ tấn công gửi email:   ' OR '1'='1\n// SQL thành:\n// SELECT * FROM users WHERE email = '' OR '1'='1'   → trả về TẤT CẢ user!\n\n// Tệ hơn:   '; DROP TABLE users; --` },
      callout: { type: 'danger', t: 'SQL Injection luôn nằm trong **OWASP Top 10** suốt hơn 20 năm. Một dòng nối chuỗi có thể làm lộ toàn bộ CSDL.' },
      notes: 'Demo thật trên máy giảng viên với bảng users giả. Học viên thường rất ấn tượng. Nhấn mạnh: mysql2 với query() và chuỗi nối tay KHÔNG an toàn.'
    },
    {
      title: 'Phòng chống: Prepared Statement', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `// ✅ Dùng placeholder — DB coi giá trị là DỮ LIỆU, không phải CODE\nconst [rows] = await pool.execute(\n  'SELECT * FROM users WHERE email = ?',\n  [req.body.email]\n);\n\n// ✅ Tên cột/bảng động → whitelist, KHÔNG dùng placeholder\nconst SORTABLE = { title: 'title', date: 'created_at' };\nconst col = SORTABLE[req.query.sort] || 'created_at';\nconst [posts] = await pool.query(\`SELECT * FROM posts ORDER BY \${col} DESC\`);` },
      bullets: ['**Luôn** dùng `?` cho giá trị từ người dùng', 'Placeholder **không** dùng cho tên cột / bảng / ASC-DESC', 'Phần “động” không phải giá trị → **whitelist**', 'ORM (B8) tự động làm việc này']
    },
    {
      title: 'Viết lại post.model bằng SQL', badge: 'LIVE CODING',
      code: { file: 'src/models/post.model.js', lang: 'javascript', size: 'xs', src: `const pool = require('../config/db');\n\nexports.findAll = async ({ q, limit = 10, offset = 0 } = {}) => {\n  const where = q ? 'WHERE p.title LIKE ?' : '';\n  const params = q ? [\`%\${q}%\`] : [];\n  const [rows] = await pool.query(\n    \`SELECT p.id, p.title, p.slug, p.created_at, u.name AS author\n     FROM posts p JOIN users u ON u.id = p.user_id\n     \${where} ORDER BY p.created_at DESC LIMIT ? OFFSET ?\`,\n    [...params, Number(limit), Number(offset)]\n  );\n  return rows;\n};\n\nexports.findById = async (id) => {\n  const [rows] = await pool.execute('SELECT * FROM posts WHERE id = ?', [id]);\n  return rows[0] || null;\n};\n\nexports.create = async ({ userId, title, slug, content }) => {\n  const [r] = await pool.execute(\n    'INSERT INTO posts (user_id, title, slug, content) VALUES (?, ?, ?, ?)',\n    [userId, title, slug, content]\n  );\n  return exports.findById(r.insertId);\n};\n\nexports.remove = async (id) => {\n  const [r] = await pool.execute('DELETE FROM posts WHERE id = ?', [id]);\n  return r.affectedRows > 0;\n};` },
      callout: { type: 'tip', t: 'Controller và service từ B6 **không phải sửa** — đó là sức mạnh của kiến trúc phân lớp!' }
    },
    {
      title: 'Bắt lỗi từ MySQL', layout: 'split', ratio: '1.1fr .9fr',
      code: { lang: 'javascript', size: 'sm', src: `try {\n  await Post.create(data);\n} catch (err) {\n  if (err.code === 'ER_DUP_ENTRY') {\n    throw new AppError('Slug đã tồn tại', 409);\n  }\n  if (err.code === 'ER_NO_REFERENCED_ROW_2') {\n    throw new AppError('User không tồn tại', 400);\n  }\n  throw err; // lỗi khác → 500\n}` },
      table: { small: true, head: ['err.code', 'Ý nghĩa'], rows: [['`ER_DUP_ENTRY`', 'Trùng UNIQUE'], ['`ER_NO_REFERENCED_ROW_2`', 'FK không tồn tại'], ['`ER_ROW_IS_REFERENCED_2`', 'Đang được tham chiếu'], ['`ECONNREFUSED`', 'MySQL chưa chạy']] }
    },
    {
      title: 'Kiểm tra bảo mật', badge: 'QUIZ',
      quiz: { q: 'Đoạn nào AN TOÀN trước SQL Injection?', opts: ['`query("... WHERE id = " + id)`', '`query(`... WHERE id = ${id}`)`', '`execute("... WHERE id = ?", [id])`', '`query("... WHERE id = \'" + escape(id) + "\'")` tự viết hàm escape'], a: 2, why: 'Chỉ **placeholder `?`** đảm bảo giá trị được gửi tách biệt khỏi câu SQL. Template string cũng chỉ là nối chuỗi. Hàm escape tự viết rất dễ sót trường hợp.' }
    }
  ],
  recap: [
    'CSDL quan hệ: bảng, PK, FK; quan hệ **1-N** (FK ở bên N) và **N-N** (bảng trung gian)',
    'Vẽ **ER diagram** trước, chuẩn hóa để tránh lặp dữ liệu; dùng `utf8mb4`',
    '`mysql2/promise` + **connection pool** dùng chung',
    '**Luôn dùng placeholder `?`** — không bao giờ nối chuỗi SQL; whitelist cho tên cột',
    'Chỉ thay lớp **Model** — controller/service giữ nguyên'
  ],
  exercises: [
    {
      level: 'warmup', time: 20, title: 'Cài đặt MySQL & tạo CSDL',
      desc: 'Chuẩn bị môi trường database.',
      tasks: ['Cài MySQL 8 (MySQL Installer / XAMPP / Docker `mysql:8`)', 'Cài công cụ quản lý: MySQL Workbench, DBeaver hoặc HeidiSQL', 'Tạo database `devblog` với `utf8mb4`', 'Tạo user riêng `devblog_app` chỉ có quyền trên DB `devblog` (không dùng root cho app)'],
      hints: ['`CREATE USER \'devblog_app\'@\'localhost\' IDENTIFIED BY \'...\'; GRANT ALL ON devblog.* TO \'devblog_app\'@\'localhost\';`', 'Docker: `docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:8`']
    },
    {
      level: 'core', time: 30, title: 'Thiết kế ER & schema DevBlog',
      desc: 'Hoàn thiện thiết kế CSDL cho đồ án.',
      tasks: ['Vẽ ER diagram: `users`, `posts`, `comments`, `tags`, `post_tags` (dbdiagram.io hoặc draw.io)', 'Viết `db/schema.sql` đầy đủ: PK, FK (`ON DELETE`), UNIQUE, NOT NULL, giá trị mặc định', 'Viết `db/seed.sql`: 3 users, 10 posts, 5 tags, 15 comments', 'Chạy được từ đầu trên DB trống (`DROP TABLE IF EXISTS` theo đúng thứ tự)'],
      hints: ['Xóa bảng con trước bảng cha (comments, post_tags → posts → users)', 'Bảng `post_tags`: `PRIMARY KEY (post_id, tag_id)`'],
      solution: { file: 'db/schema.sql (phần còn lại)', lang: 'sql', src: `CREATE TABLE comments (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  post_id INT NOT NULL,\n  user_id INT NOT NULL,\n  content TEXT NOT NULL,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,\n  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE\n);\n\nCREATE TABLE tags (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  name VARCHAR(50) NOT NULL UNIQUE\n);\n\nCREATE TABLE post_tags (\n  post_id INT NOT NULL,\n  tag_id INT NOT NULL,\n  PRIMARY KEY (post_id, tag_id),\n  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,\n  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE\n);` }
    },
    {
      level: 'core', time: 25, title: 'Luyện SQL truy vấn',
      desc: 'Viết các câu truy vấn trên dữ liệu seed.',
      tasks: ['10 bài mới nhất kèm **tên tác giả**', 'Số bài viết của từng user (kể cả user 0 bài)', 'Các bài có tag `node`', 'Top 3 bài có nhiều bình luận nhất', 'Bài viết kèm **danh sách tag** gộp thành một chuỗi (`GROUP_CONCAT`)'],
      hints: ['User 0 bài → `LEFT JOIN`', '`GROUP_CONCAT(t.name SEPARATOR \', \')`'],
      solution: { file: 'queries.sql', lang: 'sql', src: `-- 2\nSELECT u.name, COUNT(p.id) AS total FROM users u LEFT JOIN posts p ON p.user_id = u.id GROUP BY u.id;\n\n-- 4\nSELECT p.title, COUNT(c.id) AS comments FROM posts p\nLEFT JOIN comments c ON c.post_id = p.id\nGROUP BY p.id ORDER BY comments DESC LIMIT 3;\n\n-- 5\nSELECT p.id, p.title, GROUP_CONCAT(t.name ORDER BY t.name SEPARATOR ', ') AS tags\nFROM posts p\nLEFT JOIN post_tags pt ON pt.post_id = p.id\nLEFT JOIN tags t ON t.id = pt.tag_id\nGROUP BY p.id;` }
    },
    {
      level: 'core', time: 40, title: 'Products API dùng MySQL',
      desc: 'Thay model file JSON của bài products (B6) bằng MySQL.',
      tasks: ['Tạo bảng `products` (`price DECIMAL(12,2)`, `stock INT UNSIGNED`)', '`src/config/db.js` dùng pool, cấu hình từ `.env`', 'Viết lại `product.model.js`: `findAll` (tìm kiếm, phân trang bằng `LIMIT/OFFSET`), `findById`, `create`, `update`, `remove`', '**Mọi** câu SQL dùng placeholder', 'Postman Collection vẫn chạy xanh'],
      hints: ['Đếm tổng cho phân trang: `SELECT COUNT(*) AS total FROM products WHERE ...`', 'Cập nhật động: chỉ build `SET` cho các trường có trong whitelist'],
      solution: { file: 'src/models/product.model.js (update động)', lang: 'javascript', src: `const FIELDS = ['name', 'price', 'stock', 'category'];\n\nexports.update = async (id, data) => {\n  const keys = FIELDS.filter((k) => data[k] !== undefined);\n  if (!keys.length) return exports.findById(id);\n  const sql = \`UPDATE products SET \${keys.map((k) => k + ' = ?').join(', ')} WHERE id = ?\`;\n  await pool.execute(sql, [...keys.map((k) => data[k]), id]);\n  return exports.findById(id);\n};` },
      solutionNote: 'Tên cột lấy từ whitelist `FIELDS` (không từ người dùng), giá trị đi qua placeholder → an toàn.'
    },
    {
      level: 'challenge', time: 30, title: 'Thử tấn công SQL Injection (có kiểm soát)',
      desc: 'Hiểu lỗ hổng bằng cách tự khai thác trên code của chính mình.',
      tasks: ['Viết route **cố tình lỗi**: `GET /vuln/users?email=` nối chuỗi SQL', 'Khai thác để lấy toàn bộ users bằng `\' OR \'1\'=\'1`', 'Thử `UNION SELECT` để đọc dữ liệu bảng khác', 'Sửa bằng placeholder và chứng minh tấn công thất bại', 'Viết 5 dòng rút kinh nghiệm. **Xóa route lỗi** sau khi xong!'],
      hints: ['Chỉ thực hiện trên máy và CSDL của bạn. Tấn công hệ thống của người khác là **vi phạm pháp luật**.']
    },
    {
      level: 'homework', time: 40, title: 'Thống kê cho trang Dashboard',
      desc: 'Viết các API thống kê dùng SQL tổng hợp.',
      tasks: ['`GET /api/stats/overview` → tổng users, posts, comments (một truy vấn hoặc `Promise.all`)', '`GET /api/stats/posts-per-day?days=7` → số bài theo ngày (`DATE(created_at)`)', '`GET /api/stats/top-authors` → 5 tác giả nhiều bài nhất', 'Trang `public/dashboard.html` hiển thị số liệu (bonus: vẽ biểu đồ bằng Chart.js)'],
      hints: ['`GROUP BY DATE(created_at)` + `WHERE created_at >= NOW() - INTERVAL ? DAY`']
    },
    {
      level: 'project', time: 40, title: 'Đồ án DevBlog: chuyển sang MySQL',
      desc: 'Cột mốc 3 (phần 1).',
      tasks: ['`db/schema.sql` + `db/seed.sql` hoàn chỉnh', 'Pool trong `src/config/db.js`, kiểm tra kết nối khi khởi động', '`post.model.js` dùng SQL; danh sách bài kèm tên tác giả (JOIN)', 'Map lỗi `ER_DUP_ENTRY` (slug) → 409', 'Script `npm run db:reset` chạy schema + seed'],
      hints: ['`mysql -u root -p devblog < db/schema.sql` hoặc đọc file .sql và chạy bằng `pool.query` với `multipleStatements: true` (chỉ trong script)']
    }
  ],
  project: {
    lead: '**Cột mốc 3a**: dữ liệu DevBlog chuyển sang MySQL.',
    tasks: ['Schema + seed cho 5 bảng', 'Model posts bằng SQL (JOIN tác giả)', 'Placeholder ở mọi truy vấn'],
    callout: { type: 'tip', t: 'Buổi 8 sẽ thay SQL thủ công bằng **Sequelize ORM** — hãy để ý những chỗ bạn thấy SQL lặp lại nhàm chán.' }
  }
};
