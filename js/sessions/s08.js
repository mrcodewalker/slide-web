/* ============================================================
   BUỔI 8 — ORM với Sequelize
   ============================================================ */
SESSION_DATA[8] = {
  intro: 'So sánh liên tục với SQL thủ công của B7 để học viên thấy ORM làm gì hộ. Dành nhiều thời gian cho associations + include (đây là chỗ học viên hay vướng). Migration giới thiệu đủ để dùng, không cần đi sâu.',
  agenda: [
    { min: 10, t: 'Ôn B7 & chữa bài tập', d: '' },
    { min: 20, t: 'ORM là gì? Ưu nhược điểm', d: '' },
    { min: 30, t: 'Kết nối Sequelize, định nghĩa Model', d: 'Kiểu dữ liệu, validate, timestamps' },
    { min: 25, t: 'CRUD với Model & toán tử Op', d: '' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 35, t: 'Associations: 1-N, N-N & eager loading', d: 'hasMany, belongsTo, belongsToMany, include' },
    { min: 25, t: 'Migration & seeder với sequelize-cli', d: '' },
    { min: 15, t: 'Transaction, N+1 & giao bài', d: '' }
  ],
  slides: [
    { kind: 'section', no: '01', title: 'ORM là gì?', sub: 'Làm việc với database bằng object JavaScript thay vì chuỗi SQL.' },
    {
      title: 'Object–Relational Mapping', layout: 'split', ratio: '1fr .8fr',
      bullets: ['Ánh xạ **bảng ↔ class (Model)**, **dòng ↔ object**', 'Viết `Post.findAll()` thay cho `SELECT * FROM posts`', 'ORM sinh SQL, **tự dùng placeholder** (chống SQL Injection)', 'Sequelize hỗ trợ MySQL, PostgreSQL, SQLite, MSSQL…'],
      img: { src: 'sequelize-logo.svg', cap: 'Sequelize — ORM phổ biến cho Node.js', h: 300 }
    },
    {
      title: 'SQL thủ công vs Sequelize',
      cols: [
        { h: 'mysql2 (B7)', code: { lang: 'javascript', size: 'xs', src: `const [rows] = await pool.query(\n  \`SELECT p.*, u.name AS author\n   FROM posts p\n   JOIN users u ON u.id = p.user_id\n   WHERE p.status = ?\n   ORDER BY p.created_at DESC\n   LIMIT ? OFFSET ?\`,\n  ['published', 10, 0]\n);` } },
        { h: 'Sequelize', code: { lang: 'javascript', size: 'xs', src: `const posts = await Post.findAll({\n  where: { status: 'published' },\n  include: { model: User, as: 'author',\n             attributes: ['name'] },\n  order: [['createdAt', 'DESC']],\n  limit: 10,\n  offset: 0\n});` } }
      ],
      table: { small: true, head: ['👍 Ưu điểm', '👎 Nhược điểm'], rows: [['Code ngắn, nhất quán, an toàn mặc định', 'Thêm một lớp phải học'], ['Đổi loại DB dễ hơn', 'Truy vấn phức tạp đôi khi khó/chậm'], ['Validate, quan hệ, migration có sẵn', 'Dễ “quên” SQL thật chạy bên dưới']] }
    },

    { kind: 'section', no: '02', title: 'Model & CRUD', sub: 'Định nghĩa cấu trúc dữ liệu bằng JavaScript.' },
    {
      title: 'Cài đặt & kết nối', badge: 'LIVE CODING',
      term: `$ npm install sequelize mysql2\n$ npm install -D sequelize-cli`,
      code: { file: 'src/config/sequelize.js', lang: 'javascript', size: 'sm', src: `const { Sequelize } = require('sequelize');\nconst config = require('./index');\n\nconst sequelize = new Sequelize(config.db.name, config.db.user, config.db.pass, {\n  host: config.db.host,\n  dialect: 'mysql',\n  logging: config.env === 'development' ? console.log : false, // xem SQL được sinh ra\n  define: { underscored: true }  // createdAt → created_at trong DB\n});\n\nmodule.exports = sequelize;` },
      callout: { type: 'tip', t: 'Bật `logging` khi học để **thấy SQL thật** Sequelize sinh ra — cách học ORM nhanh nhất.' }
    },
    {
      title: 'Định nghĩa Model', badge: 'LIVE CODING', layout: 'split', ratio: '1.25fr .75fr',
      code: { file: 'src/models/post.model.js', lang: 'javascript', size: 'xs', src: `const { DataTypes } = require('sequelize');\nconst sequelize = require('../config/sequelize');\n\nconst Post = sequelize.define('Post', {\n  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },\n  title: {\n    type: DataTypes.STRING(200),\n    allowNull: false,\n    validate: { len: { args: [3, 200], msg: 'Tiêu đề 3–200 ký tự' } }\n  },\n  slug: { type: DataTypes.STRING(220), allowNull: false, unique: true },\n  content: { type: DataTypes.TEXT, allowNull: false },\n  status: {\n    type: DataTypes.ENUM('draft', 'published'),\n    defaultValue: 'draft'\n  }\n}, {\n  tableName: 'posts',\n  timestamps: true   // tự quản lý createdAt, updatedAt\n});\n\nmodule.exports = Post;` },
      bullets: ['`DataTypes`: STRING, TEXT, INTEGER, DECIMAL, BOOLEAN, DATE, ENUM, JSON…', '`allowNull`, `unique`, `defaultValue`', '`validate`: `isEmail`, `len`, `min`, `max`, `is` (regex)…', '`timestamps` tự thêm 2 cột thời gian']
    },
    {
      title: 'CRUD với Model',
      table: {
        head: ['Thao tác', 'Sequelize', 'SQL tương đương'],
        rows: [
          ['Tạo', '`await Post.create({ title, slug, content })`', '`INSERT INTO …`'],
          ['Lấy tất cả', '`await Post.findAll({ where, order, limit })`', '`SELECT … WHERE … ORDER BY … LIMIT`'],
          ['Theo khóa chính', '`await Post.findByPk(5)`', '`SELECT … WHERE id = 5`'],
          ['Một bản ghi', '`await Post.findOne({ where: { slug } })`', '`SELECT … LIMIT 1`'],
          ['Đếm + danh sách', '`await Post.findAndCountAll({ limit, offset })`', '`COUNT(*)` + `SELECT`'],
          ['Cập nhật', '`await post.update({ title })` hoặc `post.title = …; await post.save()`', '`UPDATE …`'],
          ['Xóa', '`await post.destroy()`', '`DELETE …`']
        ], small: true
      },
      callout: { type: 'info', t: 'Kết quả là **instance** của Model (có `.save()`, `.update()`…). Cần object thuần → `post.toJSON()` hoặc `{ raw: true }`.' }
    },
    {
      title: 'Điều kiện nâng cao với Op', layout: 'split', ratio: '1.2fr .8fr',
      code: { lang: 'javascript', size: 'sm', src: `const { Op } = require('sequelize');\n\nconst posts = await Post.findAll({\n  where: {\n    status: 'published',\n    title: { [Op.like]: \`%\${q}%\` },\n    createdAt: { [Op.gte]: new Date('2026-01-01') },\n    [Op.or]: [{ userId: 1 }, { userId: 2 }]\n  },\n  attributes: ['id', 'title', 'slug', 'createdAt'],  // chỉ lấy cột cần\n  order: [['createdAt', 'DESC']],\n  limit: 10,\n  offset: 20\n});` },
      table: { small: true, head: ['Op', 'SQL'], rows: [['`Op.eq / ne`', '= / !='], ['`Op.gt / gte / lt / lte`', '> >= < <='], ['`Op.like`', 'LIKE'], ['`Op.in`', 'IN (…)'], ['`Op.between`', 'BETWEEN'], ['`Op.or / and`', 'OR / AND']] }
    },

    { kind: 'section', no: '03', title: 'Associations', sub: 'Khai báo quan hệ một lần — truy vấn dữ liệu liên quan dễ dàng.' },
    {
      title: 'Khai báo quan hệ', badge: 'LIVE CODING',
      code: { file: 'src/models/index.js', lang: 'javascript', size: 'sm', src: `const sequelize = require('../config/sequelize');\nconst User = require('./user.model');\nconst Post = require('./post.model');\nconst Comment = require('./comment.model');\nconst Tag = require('./tag.model');\n\n// 1 - N : User — Post\nUser.hasMany(Post, { foreignKey: 'userId', as: 'posts' });\nPost.belongsTo(User, { foreignKey: 'userId', as: 'author' });\n\n// 1 - N : Post — Comment, User — Comment\nPost.hasMany(Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE' });\nComment.belongsTo(Post, { foreignKey: 'postId' });\nComment.belongsTo(User, { foreignKey: 'userId', as: 'user' });\n\n// N - N : Post — Tag qua bảng post_tags\nPost.belongsToMany(Tag, { through: 'post_tags', foreignKey: 'postId', as: 'tags' });\nTag.belongsToMany(Post, { through: 'post_tags', foreignKey: 'tagId', as: 'posts' });\n\nmodule.exports = { sequelize, User, Post, Comment, Tag };` },
      callout: { type: 'tip', t: 'Khai báo **cả hai chiều** để truy vấn được từ cả hai phía. Import model từ `models/index.js` để chắc chắn quan hệ đã được khai báo.' }
    },
    {
      title: 'Eager loading với include', layout: 'split', ratio: '1.2fr .8fr',
      code: { lang: 'javascript', size: 'sm', src: `const post = await Post.findOne({\n  where: { slug: req.params.slug },\n  include: [\n    { model: User, as: 'author', attributes: ['id', 'name'] },\n    { model: Tag, as: 'tags', attributes: ['name'],\n      through: { attributes: [] } },   // ẩn cột bảng trung gian\n    { model: Comment, as: 'comments',\n      include: [{ model: User, as: 'user', attributes: ['name'] }] }\n  ],\n  order: [[{ model: Comment, as: 'comments' }, 'createdAt', 'DESC']]\n});` },
      code2: null,
      bullets: ['`include` = JOIN tự động', 'Lồng `include` nhiều cấp', '`attributes` để **không lộ** `passwordHash`!', '`as` phải **khớp** với lúc khai báo quan hệ']
    },
    {
      title: 'Kết quả JSON nhận được', layout: 'split', ratio: '1fr 1fr',
      code: { lang: 'json', size: 'xs', src: `{\n  "id": 5,\n  "title": "Học Sequelize",\n  "slug": "hoc-sequelize",\n  "author": { "id": 1, "name": "Lan" },\n  "tags": [ { "name": "node" }, { "name": "orm" } ],\n  "comments": [\n    { "id": 9, "content": "Hay quá!",\n      "user": { "name": "Minh" } }\n  ]\n}` },
      bullets: ['Dữ liệu **lồng nhau** đúng cấu trúc front-end cần', 'Một request API trả đủ thông tin cho trang chi tiết bài viết', 'Không phải tự gộp kết quả JOIN thủ công như B7']
    },
    {
      title: 'Thao tác với quan hệ N–N', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `// tạo bài kèm gắn tag\nconst post = await Post.create({ title, slug, content, userId });\n\nconst tags = await Promise.all(\n  tagNames.map((name) => Tag.findOrCreate({ where: { name } }).then(([t]) => t))\n);\nawait post.setTags(tags);      // thay toàn bộ tag\n// await post.addTag(tag);     // thêm 1\n// await post.removeTag(tag);  // bỏ 1\n\nconst list = await post.getTags();` },
      bullets: ['Sequelize tự sinh **mixin**: `getTags`, `setTags`, `addTag`, `removeTag`, `countTags`…', '`findOrCreate` — có thì lấy, chưa có thì tạo']
    },
    {
      title: 'Vấn đề N+1 query', kicker: 'B08 · Hiệu năng', badge: 'CẢNH BÁO',
      cols: [
        { h: '⛔ N+1 query', cls: 'bad', code: { lang: 'javascript', size: 'xs', src: `const posts = await Post.findAll(); // 1 query\nfor (const p of posts) {\n  p.author = await p.getAuthor();   // + N query!\n}\n// 100 bài = 101 truy vấn 🐌` } },
        { h: '✅ Eager loading', cls: 'good', code: { lang: 'javascript', size: 'xs', src: `const posts = await Post.findAll({\n  include: { model: User, as: 'author',\n             attributes: ['name'] }\n});\n// 1 truy vấn JOIN duy nhất 🚀` } }
      ],
      callout: { type: 'warn', t: 'Bật `logging` và **đếm số câu SQL** in ra khi gọi một API. Thấy SQL lặp lại theo vòng lặp → N+1.' }
    },

    { kind: 'section', no: '04', title: 'Migration & Transaction', sub: 'Quản lý phiên bản cấu trúc DB như quản lý code bằng Git.' },
    {
      title: 'sync() vs Migration',
      cols: [
        { h: '⚡ sequelize.sync()', bullets: ['Tạo bảng từ model khi chạy app', '`sync({ alter: true })` tự sửa bảng — **nguy hiểm** trên dữ liệu thật', '`sync({ force: true })` **xóa sạch** rồi tạo lại', 'Chỉ dùng khi học / prototype'] },
        { h: '📜 Migration', cls: 'good', bullets: ['Mỗi thay đổi schema = **một file** có thời gian', 'Có `up` (áp dụng) và `down` (hoàn tác)', 'Commit vào Git → cả nhóm có **cùng** cấu trúc DB', 'Bắt buộc với dự án thật'] }
      ]
    },
    {
      title: 'Migration với sequelize-cli', badge: 'LIVE CODING',
      term: `$ npx sequelize-cli init\n$ npx sequelize-cli migration:generate --name add-views-to-posts\n$ npx sequelize-cli db:migrate          # áp dụng\n$ npx sequelize-cli db:migrate:undo     # hoàn tác lần gần nhất\n$ npx sequelize-cli db:seed:all         # nạp dữ liệu mẫu`,
      code: { file: 'migrations/20261026-add-views-to-posts.js', lang: 'javascript', size: 'sm', src: `module.exports = {\n  async up(queryInterface, Sequelize) {\n    await queryInterface.addColumn('posts', 'views', {\n      type: Sequelize.INTEGER, allowNull: false, defaultValue: 0\n    });\n  },\n  async down(queryInterface) {\n    await queryInterface.removeColumn('posts', 'views');\n  }\n};` }
    },
    {
      title: 'Transaction — tất cả hoặc không gì cả', layout: 'split', ratio: '1.2fr .8fr',
      code: { lang: 'javascript', size: 'sm', src: `const { sequelize } = require('../models');\n\nawait sequelize.transaction(async (t) => {\n  const post = await Post.create(\n    { title, slug, content, userId }, { transaction: t }\n  );\n  await post.setTags(tags, { transaction: t });\n  await User.increment('postCount', {\n    where: { id: userId }, transaction: t\n  });\n});\n// lỗi ở bất kỳ bước nào → ROLLBACK toàn bộ` },
      bullets: ['Ví dụ kinh điển: **chuyển tiền** (trừ A, cộng B)', 'Managed transaction: callback lỗi → tự **rollback**', 'Nhớ truyền `{ transaction: t }` cho **mọi** truy vấn bên trong'],
      callout: { type: 'info', t: 'ACID: Atomicity, Consistency, Isolation, Durability.' }
    },
    {
      title: 'Kiểm tra hiểu bài', badge: 'QUIZ',
      quiz: { q: 'Bài viết có nhiều tag, tag thuộc nhiều bài. Khai báo đúng là?', opts: ['`Post.hasMany(Tag)` + `Tag.belongsTo(Post)`', '`Post.belongsToMany(Tag, { through: \'post_tags\' })` + chiều ngược lại', '`Post.hasOne(Tag)`', 'Lưu tags dạng chuỗi “a,b,c” trong posts'], a: 1, why: 'Quan hệ **N–N** dùng `belongsToMany` với bảng trung gian `through`. `hasMany/belongsTo` chỉ dành cho 1–N.' }
    }
  ],
  recap: [
    'ORM: bảng ↔ Model; Sequelize tự sinh SQL và tự dùng placeholder',
    'Model: `DataTypes`, `allowNull`, `unique`, `validate`, `timestamps`',
    'CRUD: `create`, `findAll`, `findByPk`, `findAndCountAll`, `update`, `destroy`; điều kiện với `Op`',
    'Quan hệ: `hasMany`/`belongsTo` (1-N), `belongsToMany` (N-N); `include` để tránh **N+1**',
    'Migration thay cho `sync()`; transaction cho thao tác nhiều bước'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Kết nối & model đầu tiên',
      desc: 'Làm quen Sequelize trên một bảng đơn giản.',
      tasks: ['Cài `sequelize`, `mysql2`; tạo `config/sequelize.js` đọc `.env`', 'Model `Category { name (unique), description }`', 'Chạy `sequelize.authenticate()` và `sync()` một lần', 'Bật `logging` và chụp lại câu `CREATE TABLE` được sinh ra'],
      hints: ['`await sequelize.authenticate()` ném lỗi nếu không kết nối được']
    },
    {
      level: 'core', time: 40, title: 'Products API dùng Sequelize',
      desc: 'Viết lại model products (B7) bằng Sequelize — controller/service giữ nguyên.',
      tasks: ['Model `Product` với validate: `name` len 2–100, `price` min 0.01, `stock` min 0', '`findAndCountAll` cho phân trang + `meta.total`', 'Tìm kiếm `?q=` bằng `Op.like`, lọc khoảng giá `?minPrice=&maxPrice=` bằng `Op.between`/`gte`/`lte`', 'Bắt `SequelizeValidationError` trong error handler → 400 kèm `details`', 'Bắt `SequelizeUniqueConstraintError` → 409'],
      hints: ['`err.name === "SequelizeValidationError"` → `err.errors.map(e => ({ field: e.path, msg: e.message }))`'],
      solution: { file: 'errorHandler.js (bổ sung)', lang: 'javascript', src: `if (err.name === 'SequelizeValidationError') {\n  err.status = 400; err.isOperational = true;\n  err.details = err.errors.map((e) => ({ field: e.path, msg: e.message }));\n  err.message = 'Dữ liệu không hợp lệ';\n}\nif (err.name === 'SequelizeUniqueConstraintError') {\n  err.status = 409; err.isOperational = true;\n  err.message = 'Giá trị đã tồn tại: ' + err.errors.map((e) => e.path).join(', ');\n}` }
    },
    {
      level: 'core', time: 35, title: 'Quan hệ Category — Product (1-N)',
      desc: 'Thêm danh mục cho sản phẩm.',
      tasks: ['`Category.hasMany(Product)` / `Product.belongsTo(Category, { as: "category" })`', '`GET /api/products` trả kèm `category: { id, name }`', '`GET /api/categories/:id/products` — sản phẩm của một danh mục', '`GET /api/categories` kèm **số lượng sản phẩm** mỗi danh mục', 'Tạo product với `categoryId` không tồn tại → 400'],
      hints: ['Đếm: `attributes: { include: [[sequelize.fn("COUNT", sequelize.col("products.id")), "productCount"]] }`, `include: [{ model: Product, attributes: [] }]`, `group: ["Category.id"]`']
    },
    {
      level: 'core', time: 30, title: 'Migration & Seeder',
      desc: 'Quản lý schema đúng cách.',
      tasks: ['`npx sequelize-cli init`, cấu hình `config/config.js` đọc `.env`', 'Migration tạo bảng `categories` và `products` (có FK)', 'Migration thứ hai: thêm cột `is_active BOOLEAN DEFAULT true` vào `products`', 'Seeder: 3 categories, 15 products', 'Chạy `db:migrate:undo:all` rồi `db:migrate` + `db:seed:all` thành công'],
      hints: ['Dùng file `.sequelizerc` để chỉ đường dẫn config/migrations/seeders vào thư mục `src/` hoặc `db/`']
    },
    {
      level: 'challenge', time: 40, title: 'Đơn hàng với Transaction',
      desc: 'Tạo đơn hàng phải trừ tồn kho an toàn.',
      tasks: ['Model `Order` và `OrderItem` (N-N Order–Product qua OrderItem có `quantity`, `price`)', '`POST /api/orders` body `{ items: [{ productId, quantity }] }`', 'Trong **một transaction**: kiểm tra đủ hàng, tạo order, tạo items, trừ `stock`', 'Một sản phẩm không đủ hàng → rollback toàn bộ, trả 409 kèm tên sản phẩm', '**Bonus**: dùng `lock: t.LOCK.UPDATE` để chống hai đơn cùng lúc mua sản phẩm cuối cùng'],
      hints: ['Tính `total` ở server từ giá trong DB — không tin giá client gửi'],
      solution: { file: 'services/order.service.js', lang: 'javascript', size: 'sm', src: `const { sequelize, Order, OrderItem, Product } = require('../models');\nconst AppError = require('../utils/AppError');\n\nexports.create = (userId, items) => sequelize.transaction(async (t) => {\n  let total = 0;\n  const lines = [];\n  for (const { productId, quantity } of items) {\n    const p = await Product.findByPk(productId, { transaction: t, lock: t.LOCK.UPDATE });\n    if (!p) throw new AppError(\`Sản phẩm \${productId} không tồn tại\`, 400);\n    if (p.stock < quantity) throw new AppError(\`"\${p.name}" chỉ còn \${p.stock}\`, 409);\n    await p.decrement('stock', { by: quantity, transaction: t });\n    total += Number(p.price) * quantity;\n    lines.push({ productId, quantity, price: p.price });\n  }\n  const order = await Order.create({ userId, total }, { transaction: t });\n  await OrderItem.bulkCreate(lines.map((l) => ({ ...l, orderId: order.id })), { transaction: t });\n  return order;\n});` }
    },
    {
      level: 'homework', time: 40, title: 'Phát hiện & sửa N+1',
      desc: 'Rèn thói quen để ý hiệu năng truy vấn.',
      tasks: ['Viết cố ý một API `GET /api/categories-slow` bị N+1 (lấy categories rồi vòng lặp lấy products)', 'Đếm số câu SQL trong log với 3, 10, 50 categories', 'Viết lại bằng `include` — đếm lại', 'Đo thời gian phản hồi hai phiên bản bằng Postman', 'Ghi kết quả vào bảng trong README'],
      hints: ['Seed nhiều dữ liệu bằng vòng lặp + `bulkCreate`']
    },
    {
      level: 'project', time: 45, title: 'Đồ án DevBlog: Sequelize',
      desc: 'Cột mốc 3 (hoàn thành).',
      tasks: ['Models: `User`, `Post`, `Comment`, `Tag` + associations trong `models/index.js`', 'Migrations + seeders thay cho `schema.sql`', '`GET /api/posts/:slug` trả kèm author, tags, comments (kèm user)', '`POST /api/posts` nhận `tags: ["node","express"]` — `findOrCreate` tag + `setTags` trong **transaction**', 'API comments: `GET/POST /api/posts/:id/comments`, `DELETE /api/comments/:id`'],
      hints: ['Tạm thời chưa có đăng nhập: `userId` lấy từ body hoặc gán cứng = 1 (B9 sẽ sửa)', 'Loại `passwordHash` khỏi mọi `include` User']
    }
  ],
  project: {
    lead: '**Cột mốc 3**: DevBlog chạy trên Sequelize với đầy đủ quan hệ.',
    tasks: ['4 models + associations + migrations/seeders', 'Chi tiết bài viết kèm author, tags, comments', 'Tạo bài + tags trong transaction'],
    callout: { type: 'warn', t: 'Đang tạm gán `userId = 1`. Buổi 9 sẽ lấy từ **người dùng đã đăng nhập**.' }
  }
};
