/* ============================================================
   BUỔI 8 — ORM với Sequelize: Model, Quan hệ & Migration
   ============================================================ */
SESSION_DATA[8] = {
  intro: 'Chuyển hóa từ SQL thủ công sang sức mạnh của Object-Relational Mapping (ORM) với Sequelize. Khắc phục bất tương thích trở kháng, định nghĩa Model hướng đối tượng, làm chủ các mối quan hệ 1-N và N-N với include, triệt tiêu lỗi N+1 Query, quản lý cấu trúc bảng chuẩn doanh nghiệp bằng Sequelize Migration và bảo vệ dữ liệu với Managed Transactions.',
  agenda: [
    { min: 10, t: 'Ôn B7 & chữa bài tập', d: 'MySQL pool, SQL injection, B-Tree' },
    { min: 30, t: 'Bản chất ORM & Bất tương thích trở kháng', d: 'Impedance Mismatch, so sánh mysql2 vs Sequelize' },
    { min: 35, t: 'Định nghĩa Model, Validation & Hooks', d: 'DataTypes, validate, beforeCreate slug, timestamps' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 45, t: 'Associations: 1-N, N-N & Eager Loading', d: 'hasMany, belongsTo, belongsToMany, include, triệt tiêu N+1' },
    { min: 35, t: 'Sequelize Migration & Seeder chuyên nghiệp', d: 'sequelize-cli, up/down, đồng bộ nhóm Git' },
    { min: 25, t: 'Managed Transactions & Row Locking', d: 'sequelize.transaction, t.LOCK.UPDATE' },
    { min: 15, t: 'Tổng kết & giao bài tập B08', d: 'Đồ án DevBlog cột mốc 3b' }
  ],
  slides: [
    /* ---------- SECTION 01: BẢN CHẤT ORM & SEQUELIZE ---------- */
    { kind: 'section', no: '01', title: 'Bản chất ORM & Khởi tạo Sequelize', sub: 'Làm việc với cơ sở dữ liệu bằng Class và Object JavaScript thay vì viết chuỗi SQL thủ công.' },
    {
      title: 'Bản chất của Object–Relational Mapping (ORM)', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Bài toán Bất tương thích Trở kháng (Object-Relational Impedance Mismatch)**:',
        { t: 'JavaScript tổ chức dữ liệu theo **Hướng đối tượng (OOP)**: Class, Instance, quan hệ tham chiếu con trỏ.', sub: ['MySQL tổ chức dữ liệu theo **Mô hình quan hệ (RDBMS)**: Bảng 2 chiều, Dòng, Cột, Khóa ngoại.'] },
        '**ORM là cầu nối tự động dịch chuyển giữa 2 thế giới**:',
        { t: 'Ánh xạ **Bảng (Table)** ↔ **Model Class** (`User`, `Post`).', sub: ['Ánh xạ **Dòng (Row/Record)** ↔ **Instance Object** (`post.title`, `post.save()`).', 'Ánh xạ **Khóa ngoại (Foreign Key)** ↔ **Mối quan hệ (Association)** (`user.getPosts()`).'] },
        '**Lợi ích vượt trội trong phát triển phần mềm**:',
        { t: 'Tự động áp dụng Prepared Statements $\\rightarrow$ **Miễn nhiễm 100% với SQL Injection**.', sub: ['Độc lập hệ quản trị CSDL (Database Agnostic): Đổi từ MySQL sang PostgreSQL mà không cần viết lại câu SQL.'] }
      ],
      img: { src: 'orm-mapping.svg', cap: 'Bản chất kiến trúc ánh xạ Object-Relational Mapping (ORM) giữa JS và CSDL', h: 360 },
      callout: { type: 'tip', t: 'Quy tắc vàng: "ORM sinh ra để phục vụ bạn, nhưng đừng coi nó là hộp đen thần bí." Luôn bật `logging: console.log` khi học để nhìn thấy câu lệnh SQL thực tế đang chạy ngầm bên dưới!' }
    },
    {
      title: 'So sánh Trực quan: mysql2 (Raw SQL) vs Sequelize (ORM)',
      cols: [
        { h: '1. mysql2 thuần (Buổi 7)', code: { lang: 'javascript', size: 'xs', src: `// Tự viết toàn bộ câu SQL nối bảng phức tạp:
const [rows] = await pool.query(
  \`SELECT p.id, p.title, p.slug, u.name AS author_name
   FROM posts p
   INNER JOIN users u ON u.id = p.user_id
   WHERE p.status = ?
   ORDER BY p.created_at DESC
   LIMIT ? OFFSET ?\`,
  ['published', Number(limit), Number(offset)]
);
// Tự format kết quả thủ công...` } },
        { h: '2. Sequelize ORM (Buổi 8)', code: { lang: 'javascript', size: 'xs', src: `// Gọi hàm hướng đối tượng trong sáng, tự động JOIN:
const posts = await Post.findAll({
  where: { status: 'published' },
  include: [{
    model: User,
    as: 'author',
    attributes: ['id', 'name']
  }],
  order: [['createdAt', 'DESC']],
  limit: 10,
  offset: 0
});` } }
      ],
      table: {
        small: true, head: ['Tiêu chí so sánh', 'Raw SQL (mysql2)', 'ORM (Sequelize)'],
        rows: [
          ['Tốc độ viết code', 'Chậm, phải viết đi viết lại CRUD', 'Cực nhanh, CRUD có sẵn trong 1 dòng'],
          ['An toàn bảo mật', 'Dễ sót nếu sơ suất nối chuỗi', 'An toàn tuyệt đối mặc định (Prepared Statements)'],
          ['Quản trị quan hệ', 'Phải tự viết JOIN và tự parse mảng', 'Tự động gộp dữ liệu thành Object JSON lồng nhau'],
          ['Tối ưu hiệu năng', 'Kiểm soát trực tiếp 100% SQL', 'Cần hiểu sâu để tránh bẫy N+1 Query']
        ]
      }
    },
    {
      title: 'Hệ Sinh Thái Sequelize trong Node.js', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Sequelize — Thư viện ORM chuẩn mực số 1 cho Node.js**:',
        '• Hỗ trợ đầy đủ các hệ quản trị CSDL quan hệ phổ biến: MySQL, PostgreSQL, SQLite, MariaDB, SQL Server.',
        '• Cung cấp đầy đủ tính năng: Model Validation, Lifecycle Hooks, Associations, Transactions, Migrations, Seeders.',
        '• Có hệ sinh thái công cụ dòng lệnh mạnh mẽ `sequelize-cli` phục vụ quản lý vòng đời phát triển dự án.'
      ],
      img: { src: 'sequelize-logo.svg', cap: 'Sequelize — ORM mạnh mẽ hàng đầu cho Node.js & TypeScript', h: 360 }
    },
    {
      title: 'Khởi Tạo Kết Nối Sequelize Tập Trung', badge: 'LIVE CODING',
      term: `$ npm install sequelize mysql2\n$ npm install -D sequelize-cli`,
      code: { file: 'src/config/sequelize.js', lang: 'javascript', size: 'sm', src: `const { Sequelize } = require('sequelize');
const config = require('./index');

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    // In câu SQL ra terminal ở môi trường dev để học tập:
    logging: config.env === 'development' ? console.log : false,
    define: {
      underscored: true,     // Tự chuyển createdAt trong JS thành created_at trong DB
      freezeTableName: true  // Không tự ý đổi tên bảng tiếng Anh thành số nhiều
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;` },
      callout: { type: 'tip', t: 'Tùy chọn `underscored: true` là cứu tinh giúp code JavaScript giữ phong cách `camelCase` (`createdAt`), trong khi cột database MySQL vẫn tuân thủ chuẩn `snake_case` (`created_at`).' }
    },

    /* ---------- SECTION 02: KHAI BÁO MODEL & THAO TÁC CRUD ---------- */
    { kind: 'section', no: '02', title: 'Khai báo Model, Validation & Thao tác CRUD', sub: 'Định nghĩa lược đồ dữ liệu bằng JavaScript, kiểm tra ràng buộc tự động và thao tác dữ liệu.' },
    {
      title: 'Định Nghĩa Model Bài Viết post.model.js', badge: 'LIVE CODING', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'src/models/post.model.js', lang: 'javascript', size: 'xs', src: `const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: { args: [3, 200], msg: 'Tiêu đề bài viết phải từ 3 đến 200 ký tự' }
    }
  },
  slug: {
    type: DataTypes.STRING(250),
    allowNull: false,
    unique: { msg: 'Đường dẫn slug này đã tồn tại' }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft'
  }
}, {
  tableName: 'posts',
  timestamps: true // Tự động quản lý createdAt và updatedAt
});

module.exports = Post;` },
      bullets: [
        '**Các thành phần cấu thành Model**:',
        '• `DataTypes`: Khai báo kiểu dữ liệu ánh xạ sang cột MySQL.',
        '• `allowNull`: Tương đương ràng buộc `NOT NULL` trong SQL.',
        '• `unique`: Tự động tạo ràng buộc `UNIQUE` và ném lỗi có message khi bị trùng.',
        '• `validate`: Hệ thống validation tích hợp sẵn của Sequelize.'
      ]
    },
    {
      title: 'Hệ Thống Kiểu Dữ Liệu DataTypes Đa Dạng',
      table: {
        head: ['Sequelize DataType', 'Kiểu dữ liệu MySQL tương ứng', 'Ghi chú & Ví dụ áp dụng'],
        rows: [
          ['`DataTypes.INTEGER`', '`INT`', 'Khóa chính `id`, số lượng tồn kho `stock`'],
          ['`DataTypes.STRING(N)`', '`VARCHAR(N)`', 'Mặc định 255 ký tự: `title`, `email`, `slug`'],
          ['`DataTypes.TEXT`', '`TEXT` (hoặc `LONGTEXT`)', 'Nội dung bài viết dài `content`, mã HTML'],
          ['`DataTypes.DECIMAL(10, 2)`', '`DECIMAL(10, 2)`', 'Tiền bạc, đơn giá: chính xác tuyệt đối không sai số'],
          ['`DataTypes.BOOLEAN`', '`TINYINT(1)`', 'Cờ bật tắt: `isPublished`, `isDeleted`'],
          ['`DataTypes.ENUM(\'a\', \'b\')`', '`ENUM(\'a\', \'b\')`', 'Tập giá trị cố định: `role`, `status`'],
          ['`DataTypes.DATE`', '`DATETIME` (hoặc `TIMESTAMP`)', 'Thời điểm: tự động chuyển đổi sang đối tượng `Date` của JS']
        ], small: true
      }
    },
    {
      title: 'Tự Động Kiểm Tra Dữ Liệu với Thuộc Tính validate', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `email: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
  validate: {
    isEmail: { msg: 'Địa chỉ email không đúng định dạng' },
    notEmpty: { msg: 'Email không được để trống' }
  }
},
price: {
  type: DataTypes.DECIMAL(10, 2),
  allowNull: false,
  validate: {
    isDecimal: { msg: 'Giá tiền phải là số hợp lệ' },
    min: { args: [0.01], msg: 'Giá tiền phải lớn hơn 0' }
  }
}` },
      bullets: [
        '**Validation diễn ra ở cấp ứng dụng Node.js**:',
        '• Khi bạn gọi `Post.create(data)`, Sequelize sẽ chạy toàn bộ các hàm kiểm tra trong `validate` **TRƯỚC KHI** gửi câu lệnh SQL sang database.',
        '• Nếu dữ liệu sai, nó ném ngay lỗi `SequelizeValidationError` kèm mảng chi tiết từng trường bị lỗi!',
        '• Giúp bảo vệ database không phải tiếp nhận các request rác.'
      ]
    },
    {
      title: 'Sequelize Hooks (Lifecycle Events): Tự Động Hóa Nghiệp Vụ', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `const slugify = require('../utils/slugify');

// Hook tự động sinh slug trước khi tạo bài viết mới:
Post.beforeCreate(async (post, options) => {
  if (post.title && !post.slug) {
    post.slug = slugify(post.title);
  }
});

// Hook tự động cập nhật slug nếu tiêu đề bài viết thay đổi:
Post.beforeUpdate(async (post, options) => {
  if (post.changed('title')) {
    post.slug = slugify(post.title);
  }
});` },
      bullets: [
        '**Hooks là gì?**',
        '• Là các hàm tự động kích hoạt tại các mốc vòng đời của Model: `beforeValidate`, `beforeCreate`, `afterCreate`, `beforeUpdate`, `beforeDestroy`.',
        '• Rất hữu ích để: Tự động mã hóa mật khẩu (`bcrypt.hash` ở Buổi 9), tự động sinh slug, ghi audit log thay đổi dữ liệu.'
      ]
    },
    {
      title: 'Bảng Tổng Hợp CRUD Dữ Liệu với Sequelize Model',
      table: {
        head: ['Hành động CRUD', 'Cú pháp Sequelize Model', 'Câu lệnh SQL tương ứng'],
        rows: [
          ['Tạo mới bản ghi', '`await Post.create({ title, content })`', '`INSERT INTO posts ...`'],
          ['Lấy danh sách', '`await Post.findAll({ where, limit, offset })`', '`SELECT ... WHERE ... LIMIT ...`'],
          ['Tìm theo Khóa chính', '`await Post.findByPk(5)`', '`SELECT ... WHERE id = 5 LIMIT 1`'],
          ['Tìm một bản ghi', '`await Post.findOne({ where: { slug } })`', '`SELECT ... WHERE slug = ? LIMIT 1`'],
          ['Đếm + Lấy phân trang', '`await Post.findAndCountAll({ limit, offset })`', '`SELECT COUNT(*)` + `SELECT ...`'],
          ['Cập nhật bản ghi', '`await post.update({ title: \'Mới\' })`', '`UPDATE posts SET title = ? WHERE id = ?`'],
          ['Xóa bản ghi', '`await post.destroy()`', '`DELETE FROM posts WHERE id = ?`']
        ], small: true
      },
      callout: { type: 'info', t: 'Lưu ý quan trọng: Kết quả trả về của `findOne` hay `findByPk` là một **Model Instance** có chứa các hàm `.update()`, `.save()`, `.destroy()`. Nếu muốn lấy Object JSON thuần túy để gửi cho client, hãy dùng `post.toJSON()` hoặc truyền `{ raw: true }`.' }
    },
    {
      title: 'Phân Trang Hoàn Hảo với findAndCountAll', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `exports.getPaginatedPosts = async ({ page = 1, limit = 10 }) => {
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  // Thực thi song song: đếm tổng số dòng + lấy mảng trang hiện tại
  const { count, rows } = await Post.findAndCountAll({
    where: { status: 'published' },
    order: [['createdAt', 'DESC']],
    limit: limitNum,
    offset: offset
  });

  return {
    data: rows,
    meta: {
      page: pageNum,
      limit: limitNum,
      total: count,
      totalPages: Math.ceil(count / limitNum)
    }
  };
};` },
      bullets: [
        '**Sức mạnh của `findAndCountAll`**:',
        '• Chỉ với 1 phương thức duy nhất, Sequelize tự động tính toán tổng số bản ghi (`count`) và trả về danh sách trang (`rows`).',
        '• Cung cấp đầy đủ thông tin để Front-end vẽ thanh phân trang cực kỳ tiện lợi!'
      ]
    },
    {
      title: 'Lọc Dữ Liệu Nâng Cao với Toán Tử Op', layout: 'split', ratio: '1.2fr .8fr',
      code: { lang: 'javascript', size: 'sm', src: `const { Op } = require('sequelize');

const posts = await Post.findAll({
  where: {
    status: 'published',
    // 1. Tìm kiếm chuỗi gần đúng (LIKE %q%):
    title: { [Op.like]: \`%\${searchQuery}%\` },
    // 2. Lọc trong khoảng thời gian:
    createdAt: {
      [Op.between]: [new Date('2026-01-01'), new Date('2026-12-31')]
    },
    // 3. Điều kiện HOẶC (OR):
    [Op.or]: [
      { userId: 1 },
      { viewCount: { [Op.gte]: 1000 } }
    ]
  },
  attributes: ['id', 'title', 'slug', 'createdAt'], // Chọn cột cần lấy
  order: [['createdAt', 'DESC']]
});` },
      table: {
        small: true, head: ['Toán tử Op', 'Ý nghĩa SQL'],
        rows: [
          ['`[Op.eq] / [Op.ne]`', '`= / !=`'],
          ['`[Op.gt] / [Op.gte]`', '`> / >=`'],
          ['`[Op.lt] / [Op.lte]`', '`< / <=`'],
          ['`[Op.like]`', '`LIKE`'],
          ['`[Op.in]`', '`IN (...)`'],
          ['`[Op.between]`', '`BETWEEN ... AND ...`'],
          ['`[Op.or] / [Op.and]`', '`OR / AND`']
        ]
      }
    },
    {
      title: 'Bảo Vệ Dữ Liệu Nhạy Cảm với Projection (Attributes Exclude)', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `// Khi lấy thông tin người dùng, TUYỆT ĐỐI KHÔNG để lộ password:
const user = await User.findByPk(userId, {
  attributes: {
    // Ẩn hoàn toàn cột mật khẩu khỏi kết quả:
    exclude: ['passwordHash', 'resetToken']
  }
});

// Hoặc chỉ định danh sách cột được phép trả về:
const publicUsers = await User.findAll({
  attributes: ['id', 'name', 'avatar', 'role']
});` },
      bullets: [
        '**Lợi ích kép của việc chọn lọc cột**:',
        '• **1. An ninh bảo mật**: Không bao giờ vô tình để lộ trường nhạy cảm (`passwordHash`, `secretKey`, `token`) ra API response.',
        '• **2. Tiết kiệm băng thông & RAM**: Thay vì `SELECT *` kéo cả trường `content` dung lượng 5MB của 100 bài viết, ta chỉ chọn `id`, `title`, `slug` giúp ứng dụng phản hồi nhanh hơn gấp 10 lần!'
      ]
    },

    /* ---------- SECTION 03: ASSOCIATIONS & EAGER LOADING ---------- */
    { kind: 'section', no: '03', title: 'Thiết lập Quan hệ (Associations) & Eager Loading', sub: 'Khai báo quan hệ 1-N, N-N và truy vấn tự động nối bảng mà không gặp lỗi N+1 Query.' },
    {
      title: 'Bản Đồ 4 Quan Hệ Cốt Lõi trong Sequelize', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        'Sequelize mô hình hóa quan hệ thông qua 4 phương thức nền tảng:',
        '• **`hasOne`** (Một có Một): Khóa ngoại nằm ở bảng đích.',
        '• **`belongsTo`** (Thuộc về Một): Khóa ngoại nằm ở bảng hiện tại.',
        '• **`hasMany`** (Một có Nhiều): Quan hệ 1–N kinh điển (1 Tác giả có Nhiều Bài viết).',
        '• **`belongsToMany`** (Nhiều thuộc về Nhiều): Quan hệ N–N bắt buộc chỉ định bảng trung gian `through`.'
      ],
      img: { src: 'er-mmorpg.svg', cap: 'Sơ đồ quan hệ thực thể (ERD) và ràng buộc khóa ngoại giữa các bảng (Wikimedia)', h: 520 },
      callout: { type: 'tip', t: 'Quy tắc vàng: **Luôn khai báo quan hệ theo CẢ HAI CHIỀU** để có thể truy vấn xuôi từ User sang Post và ngược lại từ Post sang User!' }
    },
    {
      title: 'Quản Lý Quan Hệ Tập Trung: src/models/index.js', badge: 'LIVE CODING',
      code: { file: 'src/models/index.js', lang: 'javascript', size: 'sm', src: `const sequelize = require('../config/sequelize');
const User = require('./user.model');
const Post = require('./post.model');
const Comment = require('./comment.model');
const Tag = require('./tag.model');

// 1. Quan hệ 1 - N: User có nhiều Post, Post thuộc về 1 User
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'author' });

// 2. Quan hệ 1 - N: Post có nhiều Comment, User có nhiều Comment
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 3. Quan hệ N - N: Post và Tag thông qua bảng post_tags
Post.belongsToMany(Tag, { through: 'post_tags', foreignKey: 'postId', as: 'tags' });
Tag.belongsToMany(Post, { through: 'post_tags', foreignKey: 'tagId', as: 'posts' });

module.exports = { sequelize, User, Post, Comment, Tag };` },
      callout: { type: 'info', t: 'Trong toàn bộ dự án, bạn luôn `require(\'../models\')` từ file `index.js` này để đảm bảo tất cả các quan hệ đã được Sequelize khởi tạo hoàn tất.' }
    },
    {
      title: 'Eager Loading với include: Tự Động Nối Đa Bảng', layout: 'split', ratio: '1.2fr .8fr',
      code: { lang: 'javascript', size: 'sm', src: `// Lấy chi tiết bài viết kèm: Tác giả + Thẻ tags + Danh sách bình luận
const post = await Post.findOne({
  where: { slug: req.params.slug },
  include: [
    // 1. Lấy thông tin tác giả:
    { model: User, as: 'author', attributes: ['id', 'name'] },
    
    // 2. Lấy danh sách tags (ẩn các cột của bảng trung gian post_tags):
    {
      model: Tag,
      as: 'tags',
      attributes: ['id', 'name'],
      through: { attributes: [] }
    },
    
    // 3. Lấy bình luận kèm thông tin người bình luận (Lồng 2 cấp):
    {
      model: Comment,
      as: 'comments',
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
    }
  ],
  order: [[{ model: Comment, as: 'comments' }, 'createdAt', 'DESC']]
});` },
      bullets: [
        '**Sự tiện lợi tột bậc của `include`**:',
        '• Sequelize tự động biên dịch thành các câu lệnh `LEFT JOIN` tối ưu.',
        '• Cho phép lồng `include` nhiều cấp tùy ý (Nested Eager Loading).',
        '• Tham số `as` bắt buộc phải khớp chính xác với alias đã khai báo ở file `models/index.js`.'
      ]
    },
    {
      title: 'Kết Quả JSON Lồng Nhau Hoàn Hảo cho Front-end', layout: 'split', ratio: '1fr 1fr',
      code: { lang: 'json', size: 'xs', src: `{
  "success": true,
  "data": {
    "id": 10,
    "title": "Làm chủ Sequelize ORM",
    "slug": "lam-chu-sequelize-orm",
    "author": {
      "id": 1,
      "name": "Nguyễn Văn A"
    },
    "tags": [
      { "id": 1, "name": "nodejs" },
      { "id": 3, "name": "sequelize" }
    ],
    "comments": [
      {
        "id": 105,
        "content": "Bài viết quá chi tiết và thực tế!",
        "createdAt": "2026-10-28T10:30:00.000Z",
        "user": { "id": 2, "name": "Trần Thị B" }
      }
    ]
  }
}` },
      bullets: [
        '**Lợi ích cho đội Front-end (React / Vue)**:',
        '• Chỉ cần gọi đúng 1 request API duy nhất `GET /api/v1/posts/lam-chu-sequelize-orm` là có trọn vẹn toàn bộ dữ liệu để hiển thị giao diện trang đọc bài viết.',
        '• Không phải tự ghép nối hay viết thuật toán gom mảng thủ công!'
      ]
    },
    {
      title: 'Các Hàm Tiện Ích Mixin Tự Động Sinh trong Quan Hệ N-N', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `// Khi tạo bài viết mới kèm danh sách tags: ['nodejs', 'express']
const post = await Post.create({ title, slug, content, userId });

// Tìm hoặc tạo mới các thẻ tag:
const tagInstances = await Promise.all(
  tagNames.map(name => Tag.findOrCreate({ where: { name } }).then(([tag]) => tag))
);

// Sử dụng Mixin do Sequelize tự động tạo ra:
await post.setTags(tagInstances);    // Ghi đè toàn bộ tag của bài viết
// await post.addTag(newTag);        // Thêm 1 tag
// await post.removeTag(oldTag);     // Bỏ 1 tag
// const currentTags = await post.getTags(); // Lấy mảng tag hiện tại` },
      bullets: [
        '**Cơ chế Mixin thông minh**:',
        '• Khi khai báo `Post.belongsToMany(Tag, { as: \'tags\' })`, Sequelize tự động gắn thêm vào đối tượng `post` một loạt các hàm tiện ích: `getTags`, `setTags`, `addTag`, `removeTag`, `hasTag`.',
        '• Không cần phải tự viết code thêm xóa vào bảng trung gian `post_tags`!'
      ]
    },
    {
      title: 'Hiểm Họa Hiệu Năng: Vấn Đề N+1 Query & Cách Khắc Phục', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '⛔ Thảm họa N+1 Query (Cần tránh)', cls: 'bad', code: { lang: 'javascript', size: 'xs', src: `// Lấy 100 bài viết:
const posts = await Post.findAll(); // 1 câu SQL

// Lặp qua từng bài để lấy tác giả:
for (const post of posts) {
  // Bắn thêm 100 câu SQL vào Database!
  post.author = await post.getAuthor();
}
// TỔNG CỘNG: 101 câu SQL truy vấn!
// Server sập nếu có 10,000 bài viết!` } },
        { h: '✅ Khắc phục triệt để bằng include', cls: 'good', code: { lang: 'javascript', size: 'xs', src: `// Dùng Eager Loading:
const posts = await Post.findAll({
  include: [{
    model: User,
    as: 'author',
    attributes: ['id', 'name']
  }]
});

// TỔNG CỘNG: ĐÚNG 1 CÂU SQL DUY NHẤT!
// MySQL tự động JOIN lấy hết trong 5ms 🚀` } }
      ],
      callout: { type: 'warn', t: 'Quy tắc bắt buộc: **Tuyệt đối không bao giờ gọi hàm truy vấn `await post.get...()` bên trong vòng lặp `for` hay `map`!** Luôn dùng `include`.' }
    },

    /* ---------- SECTION 04: SEQUELIZE MIGRATION & SEEDER ---------- */
    { kind: 'section', no: '04', title: 'Sequelize Migration & Seeder Chuyên nghiệp', sub: 'Quản lý phiên bản cấu trúc cơ sở dữ liệu như quản lý mã nguồn bằng Git.' },
    {
      title: 'So Sánh sequelize.sync() vs Migration', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '⚡ sequelize.sync() (Chỉ dùng khi học)', bullets: [
          '• Tự động tạo bảng dựa trên Model khi khởi động ứng dụng.',
          '• `sync({ alter: true })`: Tự ý sửa cấu trúc bảng — **Cực kỳ nguy hiểm, có thể làm mất sạch dữ liệu thật** trên môi trường Production!',
          '• Không thể hoàn tác (Rollback) khi cấu trúc bị lỗi.',
          '• Không biết lịch sử ai đã sửa cột nào vào lúc nào.'
        ] },
        { h: '📜 Sequelize Migration (Chuẩn doanh nghiệp)', cls: 'good', bullets: [
          '• Mỗi thay đổi cấu trúc bảng là **một file migration riêng biệt** có gắn mốc thời gian (timestamp).',
          '• Luôn có 2 phương thức đối xứng: `up()` (thực thi) và `down()` (hoàn tác).',
          '• File migration được commit lên Git ➔ Toàn bộ thành viên trong team và Server Production đều có cùng một cấu trúc CSDL chính xác 100%!'
        ] }
      ],
      callout: { type: 'danger', t: 'Không bao giờ gọi `sequelize.sync()` trên máy chủ Production thực tế!' }
    },
    {
      title: 'Khởi Tạo sequelize-cli & Cấu Hình .sequelizerc', badge: 'LIVE CODING',
      code: { file: '.sequelizerc', lang: 'javascript', size: 'sm', src: `const path = require('path');

// Định hướng đường dẫn thư mục cho sequelize-cli:
module.exports = {
  'config': path.resolve('src/config', 'database.js'),
  'models-path': path.resolve('src', 'models'),
  'seeders-path': path.resolve('src/database', 'seeders'),
  'migrations-path': path.resolve('src/database', 'migrations')
};` },
      bullets: [
        '**Lợi ích của file `.sequelizerc`**:',
        '• Theo mặc định, `sequelize-cli init` sẽ tạo thư mục ở ngoài root dự án.',
        '• File `.sequelizerc` giúp gom toàn bộ migrations, seeders vào thư mục `src/database/` gọn gàng, đồng bộ với cấu trúc kiến trúc phân tầng của chúng ta.'
      ]
    },
    {
      title: 'Giải Phẫu Một File Migration Hoàn Chỉnh', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'migrations/20261028-create-posts-table.js', lang: 'javascript', size: 'xs', src: `'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      title: { type: Sequelize.STRING(200), allowNull: false },
      slug: { type: Sequelize.STRING(250), allowNull: false, unique: true },
      content: { type: Sequelize.TEXT, allowNull: false },
      status: { type: Sequelize.ENUM('draft', 'published'), defaultValue: 'draft' },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  }
};` },
      bullets: [
        '**Nguyên tắc đối xứng của Migration**:',
        '• `up()`: Làm gì (Tạo bảng `posts`).',
        '• `down()`: Hoàn tác lại chính xác điều đó (Xóa bảng `posts`).',
        '• Đảm bảo có thể quay ngược thời gian (Rollback) bất cứ lúc nào bằng lệnh `db:migrate:undo`!'
      ]
    },
    {
      title: 'Các Lệnh CLI Thiết Yếu Cần Thuộc Lòng',
      table: {
        head: ['Lệnh thực thi dòng lệnh CLI', 'Mục đích & Tác vụ thực hiện'],
        rows: [
          ['`npx sequelize-cli migration:generate --name add-views-to-posts`', 'Tạo một file migration mới rỗng với timestamp hiện tại'],
          ['`npx sequelize-cli db:migrate`', 'Chạy toàn bộ các file migration chưa được thực thi lên database'],
          ['`npx sequelize-cli db:migrate:undo`', 'Hoàn tác (Rollback) file migration chạy gần nhất'],
          ['`npx sequelize-cli db:migrate:undo:all`', 'Hoàn tác toàn bộ các migration (xóa sạch bảng về ban đầu)'],
          ['`npx sequelize-cli seed:generate --name demo-posts`', 'Tạo file nạp dữ liệu mẫu ban đầu'],
          ['`npx sequelize-cli db:seed:all`', 'Thực thi toàn bộ seeders nạp dữ liệu mẫu vào CSDL']
        ]
      }
    },

    /* ---------- SECTION 05: MANAGED TRANSACTIONS & TÍCH HỢP ---------- */
    { kind: 'section', no: '05', title: 'Managed Transactions & Tích hợp Tầng Service', sub: 'Đảm bảo tính toàn vẹn đa tác vụ và ánh xạ lỗi nghiệp vụ trong hệ thống thực tế.' },
    {
      title: 'Managed Transaction: Tự Động Hóa Quản Lý Giao Dịch', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `const { sequelize, Post, Tag, User } = require('../models');

// Tạo bài viết + Gắn tags + Tăng số bài của User trong 1 Transaction:
const result = await sequelize.transaction(async (t) => {
  // 1. Tạo bài viết:
  const post = await Post.create(
    { title, slug, content, userId },
    { transaction: t }
  );

  // 2. Gán danh sách tags:
  await post.setTags(tagInstances, { transaction: t });

  // 3. Tăng bộ đếm bài viết của tác giả:
  await User.increment('postCount', {
    by: 1,
    where: { id: userId },
    transaction: t
  });

  return post;
  // -> Mọi bước thành công: Sequelize TỰ ĐỘNG COMMIT!
});
// -> Nếu CÓ BẤT KỲ LỖI NÀO ném ra: Sequelize TỰ ĐỘNG ROLLBACK 100%! Nhà phát triển không lo quên rollback.` },
      bullets: [
        '**Lợi ích vượt trội của Managed Transaction**:',
        '• Không bao giờ lo rò rỉ kết nối (Connection Leak) vì Sequelize tự động quản lý vòng đời commit / rollback an toàn.',
        '• Lưu ý duy nhất: **Bắt buộc phải truyền `{ transaction: t }` vào mọi lời gọi hàm truy vấn bên trong callback**!'
      ]
    },
    {
      title: 'Row Locking với t.LOCK.UPDATE: Chống Xung Đột Đồng Thời', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `// Ví dụ: Đặt mua sản phẩm giới hạn (Flash Sale)
await sequelize.transaction(async (t) => {
  // Khóa dòng sản phẩm này lại, các request khác phải chờ:
  const product = await Product.findByPk(productId, {
    transaction: t,
    lock: t.LOCK.UPDATE // Sinh ra câu SQL: SELECT ... FOR UPDATE
  });

  if (product.stock < quantity) {
    throw new AppError('Sản phẩm này đã hết hàng!', 409);
  }

  // Trừ tồn kho an toàn:
  await product.decrement('stock', { by: quantity, transaction: t });
  
  // Tạo đơn hàng...
});` },
      bullets: [
        '**Bảo vệ dữ liệu tài chính trong hệ thống tải cao**:',
        '• Khi 2 khách hàng cùng bấm nút "Mua ngay" chiếc áo cuối cùng trong cùng 1 mili-giây, `t.LOCK.UPDATE` đảm bảo request thứ hai phải đợi request thứ nhất hoàn tất.',
        '• Ngăn chặn triệt để lỗi bán âm kho (Overselling)!'
      ]
    },
    {
      title: 'Ánh Xạ Lỗi Sequelize Trong Middleware errorHandler.js', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/middlewares/errorHandler.js', lang: 'javascript', size: 'sm', src: `module.exports = (err, req, res, next) => {
  // 1. Bắt lỗi Validation của Sequelize (Dữ liệu không hợp lệ):
  if (err.name === 'SequelizeValidationError') {
    const details = err.errors.map(e => ({ field: e.path, message: e.message }));
    return res.status(400).json({
      success: false,
      error: { message: 'Dữ liệu không hợp lệ', details }
    });
  }

  // 2. Bắt lỗi trùng lặp khóa UNIQUE (Email hoặc Slug đã có):
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || 'trường dữ liệu';
    return res.status(409).json({
      success: false,
      error: { message: \`\${field} này đã tồn tại trong hệ thống, vui lòng chọn giá trị khác\` }
    });
  }

  // Các lỗi khác giữ nguyên xử lý...
};` },
      bullets: [
        '**Tích hợp mượt mà với Tầng Xử lý Lỗi Buổi 6**:',
        '• Toàn bộ các lỗi do Sequelize ném ra đều được chuyển đổi thành mã trạng thái HTTP chuẩn mực (`400 Bad Request`, `409 Conflict`).'
      ]
    },
    {
      title: 'Soft Delete trong Sequelize với paranoid: true', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `const Post = sequelize.define('Post', {
  // các thuộc tính khác...
}, {
  tableName: 'posts',
  timestamps: true,
  paranoid: true // 👉 Bật cơ chế Xóa Mềm (Soft Delete)
});

// 1. Khi gọi xóa:
await post.destroy(); 
// SQL sinh ra: UPDATE posts SET deleted_at = NOW() WHERE id = 5;

// 2. Mặc định findAll tự động loại bỏ bản ghi đã xóa:
const activePosts = await Post.findAll(); 
// SQL sinh ra: WHERE deleted_at IS NULL

// 3. Khôi phục lại bản ghi:
await post.restore();

// 4. Nếu muốn lấy cả bản ghi đã xóa (Thùng rác):
const allPosts = await Post.findAll({ paranoid: false });` },
      bullets: [
        '**Cơ chế Paranoid của Sequelize**:',
        '• Tự động thêm cột `deletedAt` (hoặc `deleted_at`).',
        '• Mọi câu lệnh truy vấn `findAll`, `findOne`, `findByPk` sẽ tự động tiêm điều kiện `WHERE deleted_at IS NULL` mà lập trình viên không cần phải nhớ viết tay!',
        '• Cho phép người dùng khôi phục bài viết đã xóa nhầm cực kỳ dễ dàng.'
      ]
    },
    {
      title: 'Scopes: Tái Sử Dụng Bộ Lọc Dữ Liệu Tập Trung', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `const Post = sequelize.define('Post', { /* ... */ }, {
  defaultScope: {
    // Mặc định luôn chỉ lấy bài viết đã xuất bản:
    where: { status: 'published' },
    attributes: { exclude: ['internalNotes'] }
  },
  scopes: {
    // Định nghĩa các bộ lọc tái sử dụng (Named Scopes):
    recent: {
      order: [['createdAt', 'DESC']],
      limit: 10
    },
    byUser(userId) {
      return { where: { userId } };
    },
    withAuthor: {
      include: [{ model: User, as: 'author', attributes: ['id', 'name'] }]
    }
  }
});

// Sử dụng cực kỳ thanh lịch và ngắn gọn:
const topPosts = await Post.scope(['recent', 'withAuthor']).findAll();
const userPosts = await Post.scope({ method: ['byUser', 5] }).findAll();` },
      bullets: [
        '**Lợi ích của Model Scopes**:',
        '• Áp dụng nguyên lý DRY: Không phải lặp đi lặp lại mệnh đề `where: { status: \'published\' }` ở 20 file controller khác nhau.',
        '• Có thể kết hợp (chain) nhiều scopes cùng một lúc như xếp các khối lego!'
      ]
    },
    {
      title: 'Virtual Fields: Thuộc Tính Ảo Tiện Lợi (Getters & Setters)', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `const User = sequelize.define('User', {
  firstName: { type: DataTypes.STRING },
  lastName:  { type: DataTypes.STRING },
  
  // Thuộc tính ảo KHÔNG TỒN TẠI trong bảng MySQL:
  fullName: {
    type: DataTypes.VIRTUAL,
    get() {
      return \`\${this.firstName} \${this.lastName}\`.trim();
    },
    set(value) {
      const parts = value.split(' ');
      this.setDataValue('firstName', parts[0] || '');
      this.setDataValue('lastName', parts.slice(1).join(' ') || '');
    }
  }
});

const user = await User.findByPk(1);
console.log(user.fullName); // "Nguyễn Văn A"` },
      bullets: [
        '**Ứng dụng của DataTypes.VIRTUAL**:',
        '• Tính toán các giá trị phái sinh (Computed Properties) tự động trong JavaScript mà không cần tạo thêm cột dư thừa trong database.',
        '• Ví dụ: URL ảnh đại diện đầy đủ `avatarUrl`, số phút đọc ước tính của bài viết `readingTimeMinutes`.'
      ]
    },
    {
      title: 'Thực Thi Raw SQL Nâng Cao với sequelize.query()', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `const { QueryTypes } = require('sequelize');

// Khi gặp các báo cáo phân tích tài chính siêu phức tạp mà ORM khó biểu đạt:
const stats = await sequelize.query(
  \`SELECT
     DATE(p.created_at) AS post_date,
     COUNT(p.id) AS total_posts,
     COUNT(c.id) AS total_comments
   FROM posts p
   LEFT JOIN comments c ON c.post_id = p.id
   WHERE p.created_at >= :startDate
   GROUP BY DATE(p.created_at)
   ORDER BY post_date DESC\`,
  {
    replacements: { startDate: '2026-10-01' },
    type: QueryTypes.SELECT // Trả về mảng JSON thuần túy
  }
);` },
      bullets: [
        '**Lối thoát an toàn khi cần tối ưu hiệu năng đỉnh cao**:',
        '• Sequelize không hề trói buộc bạn — bạn vẫn có thể thực thi câu lệnh SQL thuần túy bất cứ lúc nào bằng `sequelize.query()`.',
        '• Luôn sử dụng `replacements` (tương đương Prepared Statement) để phòng chống SQL Injection tuyệt đối!'
      ]
    },
    {
      title: 'Tối Ưu Phân Trang Kết Hợp JOIN: Cờ subQuery: false', layout: 'split', ratio: '1.1fr .9fr',
      code: { lang: 'javascript', size: 'sm', src: `// Khi vừa phân trang vừa include nhiều bảng và sắp xếp theo bảng con:
const posts = await Post.findAll({
  where: { status: 'published' },
  include: [{
    model: Tag,
    as: 'tags',
    where: { name: 'nodejs' } // Điều kiện lọc trên bảng con!
  }],
  order: [['createdAt', 'DESC']],
  limit: 10,
  offset: 0,
  
  // ⚠️ CỜ QUAN TRỌNG:
  subQuery: false 
});` },
      bullets: [
        '**Cạm bẫy Subquery trong Sequelize**:',
        '• Mặc định khi có `limit` và `include`, Sequelize sẽ sinh ra một subquery phụ bọc quanh bảng chính. Nếu bảng con có điều kiện `where`, truy vấn có thể bị sai lệch số lượng bản ghi hoặc văng lỗi `Unknown column`.',
        '• Bật cờ `subQuery: false` chỉ đạo Sequelize thực hiện câu lệnh JOIN trực tiếp chuẩn xác 100%!'
      ]
    },
    {
      title: 'Tích Hợp Toàn Diện Sequelize Vào Tầng Service DevBlog', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/services/post.service.js', lang: 'javascript', size: 'xs', src: `const { Post, User, Tag, Comment } = require('../models');
const AppError = require('../utils/AppError');

exports.getPostBySlug = async (slug) => {
  const post = await Post.findOne({
    where: { slug },
    include: [
      { model: User, as: 'author', attributes: ['id', 'name'] },
      { model: Tag, as: 'tags', attributes: ['name'], through: { attributes: [] } },
      {
        model: Comment, as: 'comments',
        include: [{ model: User, as: 'user', attributes: ['name'] }]
      }
    ]
  });

  if (!post) {
    throw new AppError(\`Không tìm thấy bài viết với đường dẫn \${slug}\`, 404);
  }
  return post;
};` },
      bullets: [
        '**Sự kết hợp hoàn hảo**:',
        '• Tầng Controller và Route được giữ nguyên vẹn từ Buổi 6.',
        '• Tầng Service thay thế các hàm truy vấn thủ công bằng Sequelize Model.',
        '• Code trở nên ngắn hơn 70%, loại bỏ toàn bộ chuỗi nối SQL và xử lý mảng phức tạp.'
      ]
    },
    {
      title: 'Kiểm tra nhanh kiến thức Buổi 8', badge: 'QUIZ',
      quiz: {
        q: 'Để lấy danh sách 10 bài viết mới nhất và đồng thời đính kèm thông tin tác giả (User) của từng bài trong đúng một truy vấn duy nhất nhằm tránh thảm họa N+1 Query, cú pháp Sequelize nào sau đây là chuẩn mực nhất?',
        opts: [
          'Dùng vòng lặp for: `for (p of posts) p.author = await p.getAuthor()`',
          'Dùng Eager Loading với include: `Post.findAll({ include: [{ model: User, as: \'author\' }] })`',
          'Dùng Raw query nối chuỗi: `sequelize.query("SELECT * FROM posts, users")`',
          'Dùng Lazy loading: `post.reload()`'
        ],
        a: 1,
        why: '**Eager Loading với `include`** sẽ chỉ đạo Sequelize sinh ra đúng một câu lệnh `LEFT OUTER JOIN` duy nhất kết nối giữa bảng Posts và Users, giải quyết triệt để vấn đề N+1 truy vấn làm sập database!'
      }
    }
  ],
  recap: [
    'Sequelize ORM: Ánh xạ Bảng ↔ Model Class, Dòng ↔ Model Instance, Cột ↔ DataTypes.',
    'Model Validation và Hooks (`beforeCreate`) giúp kiểm tra và tự động hóa xử lý dữ liệu trước khi gửi sang CSDL.',
    'CRUD chuẩn mực: `create`, `findAll`, `findByPk`, `update`, `destroy` và phân trang với `findAndCountAll`.',
    'Thiết lập quan hệ 2 chiều: `hasMany` / `belongsTo` (1-N), `belongsToMany` (N-N); Khắc phục **N+1 Query** bằng **Eager Loading `include`**.',
    'Quản lý phiên bản cơ sở dữ liệu bằng **Sequelize Migration** (`up`/`down`) và Seeders thay vì `sync()`.',
    'Bảo toàn giao dịch với **Managed Transactions** và chống tranh chấp tài nguyên bằng **Row Locking `t.LOCK.UPDATE`**.'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Kết nối Sequelize & Khởi tạo Model Category',
      desc: 'Làm quen với việc cấu hình Sequelize và định nghĩa Model đầu tiên.',
      tasks: [
        'Cài đặt thư viện: `npm install sequelize mysql2` và `npm install -D sequelize-cli`.',
        'Cấu hình module `src/config/sequelize.js` kết nối MySQL đọc thông tin từ file `.env`.',
        'Định nghĩa model `Category` gồm các trường: `name` (chuỗi, bắt buộc, UNIQUE), `description` (văn bản).',
        'Kiểm tra kết nối bằng `sequelize.authenticate()` thành công.'
      ]
    },
    {
      level: 'core', time: 40, title: 'Chuyển đổi Products API sang Sequelize Model',
      desc: 'Tái cấu trúc tầng dữ liệu của bài Products sang sử dụng Sequelize ORM.',
      tasks: [
        'Định nghĩa Model `Product` có đầy đủ validation: `name` (từ 2 đến 100 ký tự), `price` (số dương > 0), `stock` (số nguyên ≥ 0).',
        'Cập nhật `product.service.js` sử dụng `Product.findAndCountAll` cho tính năng lọc và phân trang.',
        'Hỗ trợ tìm kiếm theo tên bằng toán tử `Op.like` và lọc khoảng giá bằng `Op.between`.',
        'Bổ sung middleware xử lý lỗi: Ánh xạ `SequelizeValidationError` ➔ 400 và `SequelizeUniqueConstraintError` ➔ 409.',
        'Chạy lại toàn bộ Postman Collection Runner Products: Tất cả bài test đều phải Pass màu xanh!'
      ]
    },
    {
      level: 'core', time: 35, title: 'Thiết lập Quan hệ Category — Product (1-N)',
      desc: 'Xây dựng mối quan hệ giữa danh mục và sản phẩm.',
      tasks: [
        'Khai báo quan hệ hai chiều: `Category.hasMany(Product)` và `Product.belongsTo(Category, { as: "category" })`.',
        'API `GET /api/v1/products` trả về kèm đối tượng danh mục: `category: { id, name }` bằng `include`.',
        'API `GET /api/v1/categories/:id/products`: Trả về danh sách tất cả các sản phẩm thuộc về một danh mục.',
        'API `GET /api/v1/categories`: Trả về danh sách danh mục kèm tổng số lượng sản phẩm của từng danh mục.'
      ]
    },
    {
      level: 'core', time: 30, title: 'Quản lý Lược đồ với Sequelize Migration & Seeder',
      desc: 'Áp dụng công cụ chuyên nghiệp quản lý cấu trúc cơ sở dữ liệu.',
      tasks: [
        'Tạo file cấu hình `.sequelizerc` chỉ hướng vào thư mục `src/database/`.',
        'Viết file migration khởi tạo bảng `categories` và bảng `products` (có khóa ngoại `category_id`).',
        'Viết migration thứ hai: Bổ sung thêm cột `is_active BOOLEAN DEFAULT true` vào bảng `products`.',
        'Viết seeder nạp dữ liệu mẫu: 3 danh mục và 15 sản phẩm.',
        'Chạy thử nghiệm lệnh `db:migrate:undo:all` rồi chạy lại `db:migrate` và `db:seed:all` thành công mỹ mãn.'
      ]
    },
    {
      level: 'challenge', time: 40, title: 'Xử lý Tạo Đơn Hàng trong Managed Transaction với Row Lock',
      desc: 'Hiện thực hóa quy trình đặt hàng thương mại điện tử an toàn tuyệt đối.',
      tasks: [
        'Tạo các Model: `Order` (id, userId, totalAmount, status) và `OrderItem` (orderId, productId, quantity, price).',
        'Xây dựng endpoint `POST /api/v1/orders` nhận mảng sản phẩm đặt mua.',
        'Toàn bộ quy trình: Kiểm tra tồn kho, trừ `stock`, tính tổng tiền, tạo order và order items phải nằm trong một `sequelize.transaction`.',
        'Sử dụng `lock: t.LOCK.UPDATE` để khóa dòng sản phẩm trong lúc kiểm tra.',
        'Nếu có bất kỳ sản phẩm nào không đủ số lượng tồn, hủy bỏ giao dịch và trả về lỗi 409 Conflict.'
      ]
    },
    {
      level: 'homework', time: 40, title: 'Thực nghiệm Đo lường & Triệt tiêu Lỗi N+1 Query',
      desc: 'Trải nghiệm sự khác biệt về hiệu năng giữa Lazy Loading và Eager Loading.',
      tasks: [
        'Viết một endpoint cố ý mắc lỗi N+1: `GET /api/v1/categories-slow` (lặp qua từng danh mục để gọi `cat.getProducts()`).',
        'Bật `logging` và quan sát số lượng câu SQL in ra terminal khi có 5, 20 và 50 danh mục.',
        'Viết endpoint tối ưu `GET /api/v1/categories-fast` sử dụng `include: [Product]`.',
        'Đo thời gian phản hồi bằng Postman và ghi nhận kết quả so sánh vào tài liệu README.'
      ]
    },
    {
      level: 'project', time: 45, title: 'Đồ án DevBlog Cột mốc 3b: Hoàn thiện Sequelize Toàn diện',
      desc: 'Cột mốc hoàn thiện tầng dữ liệu ORM cho đồ án DevBlog.',
      tasks: [
        'Khai báo đầy đủ 4 Models: `User`, `Post`, `Comment`, `Tag` cùng toàn bộ associations trong `src/models/index.js`.',
        'Viết hệ thống Migrations và Seeders thay thế hoàn toàn cho file `schema.sql` của Buổi 7.',
        'Endpoint `GET /api/v1/posts/:slug`: Trả về bài viết kèm author, tags, và comments (kèm thông tin user bình luận).',
        'Endpoint `POST /api/v1/posts`: Nhận mảng `tags: ["nodejs", "express"]`, tự động `findOrCreate` tag và `setTags` trong một Transaction an toàn.',
        'Kiểm tra lại toàn bộ Postman Collection: Tất cả các endpoints đều chạy trơn tru mượt mà.'
      ]
    }
  ],
  project: {
    lead: '**Cột mốc 3b**: Toàn bộ hệ thống dữ liệu DevBlog được vận hành mượt mà trên nền tảng Sequelize ORM.',
    tasks: [
      'Xây dựng 4 models hoàn chỉnh với associations và migrations/seeders',
      'Chi tiết bài viết nạp đa tầng dữ liệu qua Eager Loading (author, tags, comments)',
      'Tạo bài viết và gán thẻ tags trong một Managed Transaction an toàn'
    ],
    callout: { type: 'tip', t: 'Buổi 9 chúng ta sẽ nâng cấp hệ thống xác thực người dùng với **Bcrypt và JSON Web Token (JWT)** — sẵn sàng thay thế `userId = 1` tạm thời bằng token đăng nhập thật!' }
  }
};
