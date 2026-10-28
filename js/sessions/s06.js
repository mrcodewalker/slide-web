/* ============================================================
   BUỔI 6 — Kiến trúc dự án: MVC, Phân lớp & Cấu hình
   ============================================================ */
SESSION_DATA[6] = {
  intro: 'Buổi "dọn nhà" mang tính bước ngoặt. Không thêm tính năng mới — tổ chức lại mã nguồn theo kiến trúc 4 lớp chuẩn doanh nghiệp (Router ➔ Controller ➔ Service ➔ Model). Tách biệt hoàn toàn app.js và server.js, cấu hình tập trung với dotenv, xử lý lỗi chuyên nghiệp với AppError và asyncHandler, sẵn sàng cắm MySQL ở Buổi 7.',
  agenda: [
    { min: 10, t: 'Ôn B5 & chữa bài tập', d: 'REST CRUD, envelope response, atomic write file' },
    { min: 35, t: 'Vì sao cần kiến trúc? SoC, MVC & Mô hình 4 lớp', d: 'Separation of Concerns, Thin Controller vs Fat Service' },
    { min: 25, t: 'Tổ chức cấu trúc thư mục dự án chuẩn Enterprise', d: 'Layer-based vs Feature-based, Git secrets' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 50, t: 'Live refactor: Tái cấu trúc DevBlog theo 4 lớp', d: 'Model ➔ Service ➔ Controller ➔ Route, kiểm thử với Postman' },
    { min: 30, t: 'Cấu hình môi trường dotenv & Tách app/server', d: '12-Factor App, validate env, graceful shutdown' },
    { min: 35, t: 'Xử lý lỗi tập trung: AppError, asyncHandler, Error Middleware', d: 'Lỗi nghiệp vụ vs Bug hệ thống, bảo vệ stack trace' },
    { min: 15, t: 'Tổng kết & giao bài tập B06', d: 'Đồ án DevBlog cột mốc 2' }
  ],
  slides: [
    /* ---------- SECTION 01: VÌ SAO CẦN KIẾN TRÚC PHÂN TẦNG ---------- */
    { kind: 'section', no: '01', title: 'Vì sao cần Kiến trúc Phân tầng?', sub: 'Code chạy được mới chỉ là một nửa. Nửa còn lại là đọc được, bảo trì được và mở rộng được.' },
    {
      title: 'Triệu chứng của dự án “Mì Spaghetti”', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '😵 Hiện trạng dự án Spaghetti Code', cls: 'bad', bullets: [
          '• **File route phình to 100-200 dòng**: Nhồi nhét lẫn lộn cả kiểm tra validation, truy vấn SQL/file, tính toán tiền tệ và format JSON.',
          '• **Copy-paste khắp nơi**: Khối `try/catch` và câu lệnh `res.status(404).json(...)` lặp lại hàng chục lần.',
          '• **Hardcode cấu hình nhạy cảm**: Mật khẩu database, port server, secret key viết chết cứng trong file JS.',
          '• **Ác mộng khi nâng cấp**: Khi chuyển từ file JSON sang cơ sở dữ liệu MySQL, lập trình viên phải mở và sửa lại từng dòng trong 50 routes!'
        ] },
        { h: '🎯 Mục tiêu Kiến trúc Phân lớp', cls: 'good', bullets: [
          '• **Mỗi tầng một nhiệm vụ duy nhất (Single Responsibility)**: Router định tuyến, Controller đón request, Service tính toán, Model lo dữ liệu.',
          '• **Xử lý lỗi tập trung tại một chốt chặn duy nhất**: Không cần viết `try/catch` thủ công ở từng route.',
          '• **Cấu hình độc lập ngoài mã nguồn (`.env`)**: Bảo mật an toàn tuyệt đối, dễ dàng triển khai.',
          '• **Dễ dàng hoán đổi công nghệ**: Thay đổi hệ quản trị CSDL chỉ cần viết lại tầng Model, tầng Service và Controller giữ nguyên 100%!'
        ] }
      ],
      callout: { type: 'tip', t: '**Separation of Concerns (SoC)** — Nguyên lý phân tách mối quan tâm là kim chỉ nam hàng đầu của mọi kỹ sư phần mềm cao cấp.' }
    },
    {
      title: 'Mô hình Kiến trúc Model–View–Controller (MVC) Kinh điển', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Mô hình ra đời từ những năm 1970 và định hình thế giới web**:',
        '🧠 **1. Model (Tầng Dữ liệu & Nghiệp vụ)**:',
        { t: 'Định nghĩa cấu trúc dữ liệu (`User`, `Post`), quy tắc ràng buộc và trực tiếp làm việc với nơi lưu trữ.', sub: ['Hoàn toàn độc lập: Không biết giao diện trông như thế nào.'] },
        '🎨 **2. View (Tầng Trình bày / Giao diện)**:',
        { t: 'Hiển thị dữ liệu trực quan cho người dùng tương tác.', sub: ['Web Server-side Rendering (SSR): File HTML/EJS/Pug.', 'Web hiện đại (REST API): Chính là định dạng dữ liệu **JSON** trả về.'] },
        '⚙️ **3. Controller (Tầng Điều phối / Cầu nối)**:',
        { t: 'Tiếp nhận thao tác của người dùng từ View/Route, gọi Model xử lý, rồi gửi kết quả về cho View cập nhật.' }
      ],
      img: { src: 'mvc-pattern.svg', cap: 'Mô hình kiến trúc Model-View-Controller kinh điển (Wikipedia)', h: 520 },
      callout: { type: 'info', t: 'MVC giúp đội ngũ lập trình tách biệt rõ ràng giữa logic hiển thị (Front-end) và logic dữ liệu (Back-end).' }
    },
    {
      title: 'Kiến trúc 4 Tầng (4-Tier Architecture) trong REST API Express', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        'Trong các dự án Back-end Node.js Express thực tế, MVC được tiến hóa thành **Kiến trúc 4 Tầng Phân Lập**:',
        '• **1. Router Layer (`/routes`)**: Lắng nghe Method & URI Path, gắn Middleware (Auth, Validate) và chuyển giao cho Controller.',
        '• **2. Controller Layer (`/controllers`)**: Đóng vai trò HTTP Adapter. Bóc tách `req.body`, `req.params`, gọi Service và trả về `res.json()`.',
        '• **3. Service Layer (`/services`)**: Trái tim chứa **100% Logic nghiệp vụ**. Tuyệt đối không dính dáng đến `req` hay `res`!',
        '• **4. Model / Repository Layer (`/models`)**: Quản lý truy vấn cơ sở dữ liệu (MySQL, PostgreSQL, MongoDB, Sequelize ORM).'
      ],
      img: { src: 'clean-architecture.svg', cap: 'Sơ đồ luồng dữ liệu 4 tầng phân lập trong hệ thống REST API hiện đại', h: 420 },
      callout: { type: 'tip', t: 'Quy tắc dòng chảy dữ liệu: **Request chỉ đi theo chiều từ ngoài vào trong** (Router ➔ Controller ➔ Service ➔ Model) và trả kết quả theo chiều ngược lại.' }
    },
    {
      title: 'Tầng Router: Trạm Gác & Điều Phối Tuyến Đường', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/routes/post.routes.js', lang: 'javascript', size: 'sm', src: `const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const validate = require('../middlewares/validate');
const { createPostSchema } = require('../validators/post.validator');

// Định tuyến sạch sẽ, gắn middleware bảo vệ:
router.route('/')
  .get(postController.getAllPosts)
  .post(validate(createPostSchema), postController.createPost);

router.route('/:id')
  .get(postController.getPostById)
  .put(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;` },
      bullets: [
        '**Trách nhiệm của Tầng Router**:',
        '• Chỉ làm 2 việc: **Xác định đường dẫn URL** và **Chỉ định Controller/Middleware nào xử lý**.',
        '• Tuyệt đối không viết code nghiệp vụ, không truy vấn database trong file route.',
        '• Sử dụng cú pháp `router.route(\'/\')` giúp gom nhóm các HTTP Method (`GET`, `POST`) trên cùng một URI cực kỳ trực quan.'
      ]
    },
    {
      title: 'Tầng Controller: Thin Controller (Bộ Chuyển Đổi Mỏng)', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'src/controllers/post.controller.js', lang: 'javascript', size: 'sm', src: `const postService = require('../services/post.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await postService.getAllPosts(req.query);
  res.status(200).json({ success: true, data: posts });
});

exports.getPostById = asyncHandler(async (req, res) => {
  const post = await postService.getPostById(Number(req.params.id));
  res.status(200).json({ success: true, data: post });
});

exports.createPost = asyncHandler(async (req, res) => {
  const newPost = await postService.createPost(req.body);
  res.status(201).json({ success: true, data: newPost });
});` },
      bullets: [
        '**Nguyên tắc Thin Controller**:',
        '• Mỗi hàm Controller chỉ nên dài từ **3 đến 7 dòng code**.',
        '• Nhiệm vụ: Đọc tham số đầu vào (`req.body`, `req.params`, `req.query`) ➔ Truyền vào Service ➔ Nhận kết quả và trả về HTTP Response.',
        '• Nhờ có `asyncHandler`, Controller hoàn toàn sạch bóng các khối lệnh `try/catch` rườm rà!'
      ]
    },
    {
      title: 'Tầng Service: Nơi Chứa Toàn Bộ Logic Nghiệp Vụ', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/services/post.service.js', lang: 'javascript', size: 'sm', src: `const postModel = require('../models/post.model');
const AppError = require('../utils/AppError');
const slugify = require('../utils/slugify');

exports.getPostById = async (id) => {
  const post = await postModel.findById(id);
  if (!post) {
    throw new AppError('Không tìm thấy bài viết yêu cầu', 404);
  }
  return post;
};

exports.createPost = async ({ title, content, tags = [] }) => {
  const slug = slugify(title);
  
  // Kiểm tra trùng lặp slug (Quy tắc nghiệp vụ):
  const existing = await postModel.findBySlug(slug);
  if (existing) {
    throw new AppError('Tiêu đề bài viết này đã tồn tại', 409);
  }

  return await postModel.create({ title, slug, content, tags });
};` },
      bullets: [
        '**Quy tắc vàng số 1 của Tầng Service**:',
        '• **Service KHÔNG BAO GIỜ được nhận hay sử dụng biến `req` và `res`**!',
        '• Service chỉ nhận tham số dạng thuần túy (Object, Number, String) và trả về dữ liệu thuần túy (Promise).',
        '• Khi có lỗi xảy ra, Service chủ động ném lỗi: `throw new AppError(...)`.',
        '• **Lợi ích**: Cực kỳ dễ viết Unit Test độc lập, có thể tái sử dụng Service cho Cronjob, CLI hay RabbitMQ Message Consumer mà không cần HTTP!'
      ]
    },
    {
      title: 'Tầng Model: Độc Quyền Quản Lý Lưu Trữ Dữ Liệu', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/models/post.model.js', lang: 'javascript', size: 'sm', src: `const fileStore = require('../utils/jsonStore')('posts.json');

exports.findAll = async (filter = {}) => {
  const allPosts = await fileStore.readAll();
  return allPosts.filter(p => !p.isDeleted);
};

exports.findById = async (id) => {
  const allPosts = await fileStore.readAll();
  return allPosts.find(p => p.id === id && !p.isDeleted) || null;
};

exports.findBySlug = async (slug) => {
  const allPosts = await fileStore.readAll();
  return allPosts.find(p => p.slug === slug && !p.isDeleted) || null;
};

exports.create = async (postData) => {
  return await fileStore.insert(postData);
};` },
      bullets: [
        '**Trách nhiệm của Tầng Model**:',
        '• Là lớp duy nhất trong toàn bộ ứng dụng được phép thực thi đọc ghi dữ liệu (file JSON, câu lệnh SQL, ORM).',
        '• Tầng Service khi cần dữ liệu chỉ việc gọi `postModel.findById(id)` mà không cần quan tâm dữ liệu đang nằm ở file ổ cứng hay cụm server MySQL!',
        '• Sau này chuyển sang MySQL ở Buổi 7, bạn chỉ việc thay thế nội dung file model này.'
      ]
    },
    {
      title: 'So sánh: Fat Controller vs Thin Controller / Fat Service',
      cols: [
        { h: '❌ Fat Controller (Phản mẫu thiết kế)', cls: 'bad', bullets: [
          '• Controller kiêm luôn viết câu lệnh SQL `SELECT * FROM posts WHERE...`.',
          '• Controller kiêm kiểm tra tài khoản có đủ tiền không, gọi API ngân hàng, gửi email chúc mừng.',
          '• Khó viết kiểm thử tự động (muốn test phải giả lập toàn bộ đối tượng `req`, `res`, `next` đồ sộ của Express).',
          '• Không thể tái sử dụng code khi cần viết một script chạy định kỳ nửa đêm.'
        ] },
        { h: '✅ Thin Controller + Fat Service (Chuẩn công nghiệp)', cls: 'good', bullets: [
          '• Controller chỉ đóng vai trò "tiếp tân": Nhận việc từ khách hàng (HTTP) ➔ Giao cho bộ phận chuyên trách (Service) ➔ Gửi trả biên nhận.',
          '• Toàn bộ trí thông minh nghiệp vụ nằm trong Service.',
          '• Dễ dàng kiểm thử độc lập 100% bằng Jest / Mocha.',
          '• Code rõ ràng, mạch lạc, thành viên mới vào dự án nhìn vào hiểu ngay luồng đi.'
        ] }
      ],
      callout: { type: 'tip', t: 'Quy tắc ngón tay cái: **Nếu bạn thấy trong file Controller có câu lệnh `SELECT`, `INSERT` hoặc thuật toán tính toán phức tạp, hãy tách ngay ra Service!**' }
    },
    {
      title: 'Tổ chức Thư mục Chuẩn Enterprise: Layer-based vs Feature-based', layout: 'split', ratio: '1.05fr .95fr',
      cols: [
        { h: '1. Layer-based (Theo tầng - Rất tốt cho dự án vừa)', code: { lang: 'bash', size: 'xs', src: `src/
├── config/        # Quản lý .env
├── routes/        # Định tuyến URL
├── controllers/   # HTTP handlers mỏng
├── services/      # Logic nghiệp vụ cốt lõi
├── models/        # Truy vấn CSDL
├── middlewares/   # Auth, logger, validate
├── utils/         # AppError, asyncHandler
├── app.js         # Khởi tạo Express app
└── server.js      # Khởi động app.listen` } },
        { h: '2. Feature-based (Theo tính năng - Dự án lớn)', code: { lang: 'bash', size: 'xs', src: `src/
├── modules/
│   ├── posts/
│   │   ├── post.routes.js
│   │   ├── post.controller.js
│   │   ├── post.service.js
│   │   └── post.model.js
│   ├── users/
│   │   ├── user.routes.js
│   │   └── user.service.js
│   └── comments/
├── shared/
├── app.js
└── server.js` } }
      ],
      callout: { type: 'info', t: 'Trong khóa học này, chúng ta áp dụng mô hình **Layer-based** vì tính trực quan cao, giúp học viên rèn luyện tư duy phân lớp một cách sâu sắc nhất.' }
    },

    /* ---------- SECTION 02: LIVE REFACTOR DEVBLOG THEO 4 LỚP ---------- */
    { kind: 'section', no: '02', title: 'Live Refactor: Tái Cấu Trúc DevBlog', sub: 'Biến router posts nguyên khối ở Buổi 5 thành hệ thống 4 lớp tinh gọn, kiểm thử bằng Postman.' },
    {
      title: 'Chiến lược Refactor: Đi từ Tầng Dưới cùng lên Tầng Trên', layout: 'split', ratio: '1.1fr .9fr',
      steps: [
        { h: 'Bước 1: Tầng Model', p: 'Tách toàn bộ logic đọc/ghi mảng hoặc file JSON vào `src/models/post.model.js`' },
        { h: 'Bước 2: Tầng Service', p: 'Chuyển quy tắc tạo slug, kiểm tra trùng lặp và tính toán vào `src/services/post.service.js`' },
        { h: 'Bước 3: Tầng Controller', p: 'Viết các handler mỏng bọc trong `asyncHandler` trong `src/controllers/post.controller.js`' },
        { h: 'Bước 4: Tầng Routes', p: 'Kết nối URL với controller bằng `router.route()` trong `src/routes/post.routes.js`' },
        { h: 'Bước 5: Kiểm thử Hồi quy', p: 'Chạy lại Postman Collection B5 — Tất cả test case phải giữ nguyên màu xanh!' }
      ],
      img: { src: 'clean-architecture.svg', cap: 'Quy trình refactor từ dưới lên trên đảm bảo tính toàn vẹn hệ thống', h: 380 },
      callout: { type: 'tip', t: 'Không bao giờ viết một mạch xong mới test. Sau mỗi bước chuyển đổi, hãy gọi thử endpoint tương ứng trên Postman để phát hiện lỗi ngay lập tức!' }
    },
    {
      title: 'Bước 1 — Xây dựng Model post.model.js hoàn chỉnh', badge: 'LIVE REFACTOR',
      code: { file: 'src/models/post.model.js', lang: 'javascript', size: 'sm', src: `const fs = require('fs/promises');
const path = require('path');
const FILE_PATH = path.join(__dirname, '../../data/posts.json');

async function readAll() {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeAll(posts) {
  const tmpPath = FILE_PATH + '.tmp';
  await fs.writeFile(tmpPath, JSON.stringify(posts, null, 2), 'utf8');
  await fs.rename(tmpPath, FILE_PATH);
}

exports.findAll = async () => await readAll();

exports.findById = async (id) => {
  const posts = await readAll();
  return posts.find(p => p.id === id) || null;
};

exports.findBySlug = async (slug) => {
  const posts = await readAll();
  return posts.find(p => p.slug === slug) || null;
};

exports.create = async (postData) => {
  const posts = await readAll();
  const newPost = { id: Date.now(), ...postData, createdAt: new Date().toISOString() };
  posts.push(newPost);
  await writeAll(posts);
  return newPost;
};` }
    },
    {
      title: 'Bước 2 — Xây dựng Service post.service.js', badge: 'LIVE REFACTOR',
      code: { file: 'src/services/post.service.js', lang: 'javascript', size: 'sm', src: `const postModel = require('../models/post.model');
const AppError = require('../utils/AppError');
const slugify = require('../utils/slugify');

exports.getAllPosts = async (query = {}) => {
  let posts = await postModel.findAll();
  const { q, tag } = query;

  if (q) {
    const lower = q.toLowerCase();
    posts = posts.filter(p => p.title.toLowerCase().includes(lower));
  }
  if (tag) {
    posts = posts.filter(p => p.tags && p.tags.includes(tag));
  }
  return posts;
};

exports.getPostById = async (id) => {
  const post = await postModel.findById(id);
  if (!post) throw new AppError(\`Không tìm thấy bài viết mang ID \${id}\`, 404);
  return post;
};

exports.createPost = async ({ title, content, tags = [] }) => {
  const slug = slugify(title);
  const exists = await postModel.findBySlug(slug);
  if (exists) throw new AppError('Tiêu đề bài viết này đã tồn tại, vui lòng chọn tiêu đề khác', 409);

  return await postModel.create({ title, slug, content, tags });
};` }
    },
    {
      title: 'Bước 3 — Xây dựng Controller post.controller.js', badge: 'LIVE REFACTOR',
      code: { file: 'src/controllers/post.controller.js', lang: 'javascript', size: 'sm', src: `const postService = require('../services/post.service');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await postService.getAllPosts(req.query);
  res.status(200).json({
    success: true,
    data: posts,
    meta: { total: posts.length }
  });
});

exports.getPostById = asyncHandler(async (req, res) => {
  const post = await postService.getPostById(Number(req.params.id));
  res.status(200).json({
    success: true,
    data: post
  });
});

exports.createPost = asyncHandler(async (req, res) => {
  const newPost = await postService.createPost(req.body);
  res.status(201)
     .location(\`/api/v1/posts/\${newPost.id}\`)
     .json({
       success: true,
       data: newPost
     });
});` },
      callout: { type: 'tip', t: 'Không có bất kỳ khối `try/catch` nào làm rối mã nguồn. Khi Service quăng ra `AppError(..., 404)`, `asyncHandler` sẽ tự động bắt lấy và chuyển tới error handler tập trung.' }
    },
    {
      title: 'Bước 4 — Tổ chức Tuyến Đường Phân Cấp (Hierarchical Routing)', badge: 'LIVE REFACTOR', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: 'src/routes/post.routes.js', code: { lang: 'javascript', size: 'xs', src: `const router = require('express').Router();
const postController = require('../controllers/post.controller');

router.route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost);

router.route('/:id')
  .get(postController.getPostById);

module.exports = router;` } },
        { h: 'src/routes/index.js (Root Router gom tất cả)', code: { lang: 'javascript', size: 'xs', src: `const router = require('express').Router();
const postRoutes = require('./post.routes');

// Gắn tiền tố đường dẫn cho từng module:
router.use('/posts', postRoutes);

// Health check endpoint cho Docker / K8s:
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;` } }
      ],
      callout: { type: 'info', t: 'Tại `src/app.js`, bạn chỉ cần khai báo một dòng duy nhất: `app.use(\'/api/v1\', rootRouter);` cực kỳ sạch sẽ!' }
    },

    /* ---------- SECTION 03: CẤU HÌNH MÔI TRƯỜNG & TÁCH APP/SERVER ---------- */
    { kind: 'section', no: '03', title: 'Cấu hình Biến Môi trường & Tách biệt App / Server', sub: 'Áp dụng nguyên tắc 12-Factor App: Đưa cấu hình ra ngoài code và bảo vệ bí mật dự án.' },
    {
      title: 'Nguyên tắc 12-Factor App: Config trong Environment', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Quy chuẩn The Twelve-Factor App (Yếu tố số III: Cấu hình)**:',
        '• Tuyệt đối **không lưu trữ hằng số cấu hình** (DB URL, Port, Secret Token) trong mã nguồn code.',
        '• Cùng một bản build mã nguồn phải có thể chạy hoàn hảo trên cả 3 môi trường: `Development` (máy lập trình viên), `Staging` (máy test), và `Production` (máy chủ thực tế).',
        '• Môi trường nào sử dụng giá trị của môi trường đó thông qua **Biến Môi Trường (Environment Variables)**.'
      ],
      img: { src: 'clean-architecture.svg', cap: 'Sự tách biệt giữa mã nguồn ứng dụng và biến môi trường cấu hình', h: 360 }
    },
    {
      title: 'Quản lý Biến Môi Trường với dotenv', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '❌ .env (TUYỆT ĐỐI KHÔNG COMMIT LÊN GIT)', cls: 'bad', code: { lang: 'bash', size: 'sm', src: `NODE_ENV=development
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=MatKhauBaoMatSieuCap123!
JWT_SECRET=super_secret_key_999` } },
        { h: '✅ .env.example (BẮT BUỘC COMMIT LÊN GIT)', cls: 'good', code: { lang: 'bash', size: 'sm', src: `NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=
DB_PASSWORD=
JWT_SECRET=your_jwt_secret_here` } }
      ],
      callout: { type: 'danger', t: 'Cảnh báo nguy hiểm: **Nếu bạn commit file `.env` lên GitHub công khai, bot của hacker sẽ quét thấy mật khẩu DB chỉ sau 30 giây!** Luôn thêm `.env` vào file `.gitignore` ngay từ khi khởi tạo dự án.' }
    },
    {
      title: 'Xây dựng Module Cấu hình Tập trung & Validate .env', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/config/index.js', lang: 'javascript', size: 'sm', src: `const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Kiểm tra danh sách các biến môi trường bắt buộc:
const REQUIRED_VARS = ['PORT', 'JWT_SECRET'];
for (const varName of REQUIRED_VARS) {
  if (!process.env[varName]) {
    console.error(\`💥 LỖI CẤU HÌNH: Thiếu biến môi trường bắt buộc "\${varName}" trong file .env\`);
    process.exit(1); // Dừng khởi động server ngay lập tức
  }
}

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    pass: process.env.DB_PASSWORD || ''
  }
};` },
      bullets: [
        '**Lợi ích của file config tập trung**:',
        '• Có gợi ý kiểu dữ liệu (Intellisense) và giá trị mặc định fallback an toàn.',
        '• **Fail-fast Principle**: Ứng dụng phát hiện thiếu cấu hình quan trọng sẽ dừng ngay lập tức thay vì chạy ngầm rồi crash bất ngờ giữa đêm.'
      ]
    },
    {
      title: 'Vì sao CẦN PHẢI tách app.js và server.js?', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Hai trách nhiệm hoàn toàn khác nhau**:',
        '• **`app.js` (Tạo và Cấu hình Ứng dụng)**: Khởi tạo instance Express, đăng ký middleware toàn cục, gắn các routers và error handler. **Không gọi `app.listen()` ở đây**!',
        '• **`server.js` (Điểm Vào Mạng Môi Trường - Network Entrypoint)**: Nhúng `app.js`, đọc cấu hình cổng từ `config.port`, gọi `app.listen()` và lắng nghe các tín hiệu hệ điều hành.',
        '**Lý do sống còn**:',
        '• Khi viết **Kiểm thử tự động API (Integration Testing với Supertest ở Buổi 12)**, thư viện test cần import trực tiếp file `app.js` để bắn request ảo trong bộ nhớ mà **không được mở cổng mạng thật** làm xung đột cổng port!'
      ],
      img: { src: 'app-server-separation.svg', cap: 'Sơ đồ tách biệt trách nhiệm: src/app.js (cấu hình & test) vs src/server.js (khởi chạy mạng)', h: 360 }
    },
    {
      title: 'Hiện thực hóa src/app.js & src/server.js', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: 'src/app.js (Cấu hình Express)', code: { lang: 'javascript', size: 'xs', src: `const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gắn API Routes:
app.use('/api/v1', routes);

// Middleware xử lý 404 và lỗi tập trung:
app.use(notFound);
app.use(errorHandler);

module.exports = app;` } },
        { h: 'src/server.js (Lắng nghe cổng mạng)', code: { lang: 'javascript', size: 'xs', src: `const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
  console.log(\`🚀 Server đang chạy tại: http://localhost:\${config.port} [\${config.env}]\`);
});

// Xử lý tắt ứng dụng an toàn (Graceful Shutdown):
process.on('SIGTERM', () => {
  console.log('🛑 Nhận tín hiệu SIGTERM, đang đóng kết nối...');
  server.close(() => {
    console.log('✅ Server đã dừng an toàn.');
    process.exit(0);
  });
});` } }
      ]
    },

    /* ---------- SECTION 04: XỬ LÝ LỖI TẬP TRUNG CHUẨN DOANH NGHIỆP ---------- */
    { kind: 'section', no: '04', title: 'Xử lý Lỗi Tập trung & Error Middleware', sub: 'Không để lộ bí mật hệ thống ra client, bắt trọn 100% ngoại lệ bất đồng bộ.' },
    {
      title: 'Thiết kế Lớp AppError: Phân loại Lỗi Rõ Ràng', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/utils/AppError.js', lang: 'javascript', size: 'sm', src: `class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);

    this.statusCode = statusCode;
    this.status = \`\${statusCode}\`.startsWith('4') ? 'fail' : 'error';
    this.details = details;
    
    // Cờ đánh dấu lỗi dự đoán được trong nghiệp vụ (Operational Error):
    this.isOperational = true;

    // Giữ nguyên vết ngăn xếp chuẩn (Stack Trace):
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;` },
      bullets: [
        '**Phân biệt hai loại lỗi trong phần mềm**:',
        '• **1. Lỗi Nghiệp vụ (Operational Errors)**: Lỗi đã lường trước do client gửi dữ liệu sai (400), sai mật khẩu (401), hết hàng trong kho (409). Cần gửi thông báo dễ hiểu cho người dùng.',
        '• **2. Lỗi Lập trình (Programmer Bugs)**: Gọi hàm `undefined`, lỗi cú pháp SQL, crash logic. Cần ẩn giấu thông tin chi tiết trước client để bảo mật!'
      ]
    },
    {
      title: 'asyncHandler: Giải phóng khỏi xiềng xích try/catch', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/utils/asyncHandler.js', lang: 'javascript', size: 'sm', src: `// Hàm bậc cao nhận vào 1 async fn, trả về middleware Express:
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;

// ============================================
// SO SÁNH TRỰC QUAN:
// ============================================
// CÁCH CŨ (Rườm rà, dễ quên next(err)):
router.get('/posts', async (req, res, next) => {
  try {
    const data = await postService.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// CÁCH MỚI (Ngắn gọn tuyệt đối):
router.get('/posts', asyncHandler(async (req, res) => {
  const data = await postService.getAll();
  res.json(data);
}));` },
      bullets: [
        '**Cơ chế hoạt động kỳ diệu của `asyncHandler`**:',
        '• Khi hàm `fn()` bất đồng bộ bị reject hoặc throw lỗi, `Promise.resolve().catch(next)` sẽ ngay lập tức bắt lấy và tự động gọi `next(err)`.',
        '• Đảm bảo không bao giờ có request bất đồng bộ nào bị treo lơ lửng không phản hồi!'
      ]
    },
    {
      title: 'Middleware Xử Lý Lỗi Toàn Diện errorHandler.js', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/middlewares/errorHandler.js', lang: 'javascript', size: 'sm', src: `const config = require('../config');

module.exports = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  // 1. Xử lý lỗi parse JSON sai cú pháp của express.json():
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Dữ liệu gửi lên không đúng định dạng JSON hợp lệ';
  }

  // 2. Ghi log cảnh báo trên màn hình server nếu là lỗi 500:
  if (statusCode >= 500) {
    console.error('💥 [CRITICAL SERVER ERROR]:', err);
  }

  // 3. Đóng gói response: Ẩn stack trace ở môi trường Production!
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.isOperational ? message : 'Đã có lỗi nội bộ xảy ra phía máy chủ',
      ...(err.details && { details: err.details }),
      ...(config.env === 'development' && { stack: err.stack })
    }
  });
};` },
      callout: { type: 'danger', t: 'Quy tắc an ninh tối thượng: **Tuyệt đối không bao giờ trả trường `stack` về cho Client ở môi trường Production!** Stack trace sẽ làm lộ toàn bộ đường dẫn thư mục, tên file và logic nội bộ cho hacker nghiên cứu khai thác.' }
    },
    {
      title: 'Xử lý Unhandled Rejection & Uncaught Exception ở Process', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/server.js', lang: 'javascript', size: 'sm', src: `// Bắt lỗi đồng bộ chưa được try/catch trong toàn bộ ứng dụng:
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Đang tắt ứng dụng khẩn cấp...');
  console.error(err.name, err.message, err.stack);
  process.exit(1); // Bắt buộc phải restart process
});

// Bắt lỗi Promise rejected mà không có .catch():
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Đang đóng server...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});` },
      bullets: [
        '**Vì sao cần 2 chốt chặn cấp thấp này?**',
        '• Node.js Event Loop có thể sập hoàn toàn nếu một ngoại lệ đồng bộ ném ra ngoài không có ai hứng.',
        '• Khi xảy ra `uncaughtException`, ứng dụng đã rơi vào trạng thái bấp bênh (unclean state) — cách an toàn nhất là ghi log và dừng ngay để trình quản lý tiến trình (PM2 / Docker) tự khởi động lại bản mới sạch sẽ!'
      ]
    },
    {
      title: 'Middleware Bổ Trợ: Response Helpers & X-Request-Id', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/middlewares/responseHelpers.js', lang: 'javascript', size: 'sm', src: `const { randomUUID } = require('crypto');

module.exports = (req, res, next) => {
  // Gán hoặc nhận mã định danh duy nhất cho request:
  req.id = req.get('x-request-id') || randomUUID();
  res.set('X-Request-Id', req.id);

  // Gắn các hàm tiện ích phản hồi chuẩn hóa trực tiếp vào res:
  res.ok = (data, meta = null) => {
    res.status(200).json({ success: true, data, ...(meta && { meta }) });
  };

  res.created = (data) => {
    res.status(201).json({ success: true, data });
  };

  res.noContent = () => {
    res.sendStatus(204);
  };

  next();
};` },
      bullets: [
        '**Giá trị thực chiến của `X-Request-Id`**:',
        '• Khi người dùng gặp lỗi và chụp màn hình gửi cho bộ phận hỗ trợ khách hàng kèm mã `X-Request-Id: 9b1deb4d...`, kỹ sư Back-end chỉ việc gõ mã này vào hệ thống log (Elasticsearch / CloudWatch) là tìm thấy chính xác lỗi chỉ trong 3 giây!'
      ]
    },
    {
      title: 'DTO (Data Transfer Object) Pattern & Request Sanitization', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/dtos/post.dto.js', lang: 'javascript', size: 'sm', src: `class CreatePostDTO {
  constructor(data) {
    this.title = String(data.title || '').trim();
    this.content = String(data.content || '').trim();
    this.tags = Array.isArray(data.tags) ? data.tags.map(t => String(t).trim().toLowerCase()) : [];
  }
}

class PostResponseDTO {
  constructor(post) {
    this.id = post.id;
    this.title = post.title;
    this.slug = post.slug;
    this.tags = post.tags;
    this.createdAt = post.createdAt;
    // Tuyệt đối không trả các trường nội bộ (secret/audit/deletedAt)!
  }
}

module.exports = { CreatePostDTO, PostResponseDTO };` },
      bullets: [
        '**Lợi ích của mô hình DTO**:',
        '• **Đầu vào (Input DTO)**: Chuẩn hóa, làm sạch (`trim`, ép kiểu) dữ liệu thô từ `req.body` trước khi đưa vào Service.',
        '• **Đầu ra (Output DTO)**: Đóng vai trò tấm khiên bảo vệ, loại bỏ các trường nhạy cảm (`passwordHash`, `isDeleted`, `internalAudit`) trước khi gửi trả về cho Client!'
      ]
    },
    {
      title: 'Dependency Injection (DI) Cơ Bản: Giảm Phụ Thuộc Cứng', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/services/post.service.js', lang: 'javascript', size: 'sm', src: `// Factory Function tiêm phụ thuộc (Dependency Injection):
function createPostService({ postModel, logger }) {
  return {
    async createPost(dto) {
      logger.info('Đang tạo bài viết mới: ' + dto.title);
      return await postModel.create(dto);
    },
    async getPostById(id) {
      return await postModel.findById(id);
    }
  };
}

module.exports = createPostService;

// Khi chạy thật (Production):
// const postService = createPostService({ postModel: realDbModel, logger: realLogger });

// Khi chạy kiểm thử Unit Test:
// const mockModel = { findById: jest.fn().mockResolvedValue({ id: 1 }) };
// const testService = createPostService({ postModel: mockModel, logger: console });` },
      bullets: [
        '**Sức mạnh của Dependency Injection**:',
        '• Thay vì `require(\'../models/post.model\')` chết cứng bên trong Service, ta truyền Model từ ngoài vào qua tham số.',
        '• Giúp viết Unit Test siêu tốc: Giả lập (Mock) hành vi truy vấn dữ liệu mà không cần kết nối tới database thật!'
      ]
    },
    {
      title: 'Logging Chuẩn Doanh nghiệp: Định dạng JSON với Morgan & Logger', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/utils/logger.js', lang: 'javascript', size: 'sm', src: `const morgan = require('morgan');

// Token tùy chỉnh đọc X-Request-Id:
morgan.token('req-id', (req) => req.id || '-');

// Format log cấu trúc JSON phục vụ Elasticsearch / CloudWatch:
const jsonLogFormat = (tokens, req, res) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    requestId: tokens['req-id'](req, res),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number(tokens.status(req, res)),
    responseTimeMs: Number(tokens['response-time'](req, res)),
    contentLength: tokens.res(req, res, 'content-length')
  });
};

module.exports = morgan(jsonLogFormat);` },
      bullets: [
        '**Vì sao hệ thống lớn dùng JSON Log?**',
        '• Các hệ thống giám sát tập trung (Datadog, Grafana Loki, ELK Stack) có thể bóc tách trường JSON tự động.',
        '• Dễ dàng lọc thống kê: Tìm tất cả request có `status >= 500` hoặc thời gian phản hồi `responseTimeMs > 2000`.'
      ]
    },
    {
      title: 'Health Checks trong Cloud Native: /healthz vs /ready', layout: 'split', ratio: '1.1fr .9fr',
      code: { file: 'src/routes/health.routes.js', lang: 'javascript', size: 'sm', src: `const router = require('express').Router();

// 1. Liveness Probe (Kiểm tra Node process có còn sống không):
router.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// 2. Readiness Probe (Kiểm tra hệ thống ĐÃ SẴN SÀNG nhận traffic chưa):
router.get('/ready', async (req, res) => {
  try {
    // Kiểm tra kết nối CSDL và các dịch vụ phụ trợ:
    // await db.authenticate();
    res.status(200).json({ status: 'ready', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'unavailable', error: err.message });
  }
});

module.exports = router;` },
      bullets: [
        '**Chuẩn mực triển khai Cloud & Docker**:',
        '• **Liveness**: Nếu `/healthz` không phản hồi, Docker / Kubernetes sẽ tự động diệt container và bật container mới thay thế.',
        '• **Readiness**: Khi server vừa khởi động chưa kịp nạp dữ liệu hoặc mất kết nối DB, Load Balancer (Nginx) sẽ tạm thời không điều phối khách hàng vào máy chủ này.'
      ]
    },
    {
      title: 'Graceful Shutdown Chuyên nghiệp: Đóng Server An toàn', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/server.js', lang: 'javascript', size: 'sm', src: `async function gracefulShutdown(signal) {
  console.log(\`\\n🛑 Nhận tín hiệu \${signal}. Đang bắt đầu quy trình dừng an toàn...\`);

  // 1. Ngừng nhận request HTTP mới từ bên ngoài:
  server.close(async () => {
    console.log('✅ Đã đóng cổng tiếp nhận HTTP.');

    try {
      // 2. Chờ các request dở dang hoàn tất và ngắt kết nối CSDL:
      console.log('⏳ Đang ngắt kết nối cơ sở dữ liệu MySQL...');
      // await db.close();
      console.log('✅ Đã đóng toàn bộ kết nối Database an toàn.');

      process.exit(0);
    } catch (err) {
      console.error('💥 Lỗi khi đóng tài nguyên:', err);
      process.exit(1);
    }
  });

  // 3. Cơ chế ép buộc tắt nếu request bị kẹt quá 10 giây:
  setTimeout(() => {
    console.error('⚠️ Quá thời gian chờ (10s), buộc phải tắt tiến trình ngay lập tức.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));` },
      bullets: [
        '**Lợi ích sống còn**:',
        '• Không làm đứt đoạn giao dịch mua hàng hoặc thanh toán của khách hàng khi hệ thống thực hiện nâng cấp phiên bản mới (Zero-downtime Deployment).'
      ]
    },
    {
      title: 'Phòng chống Lộ Secrets: git-secrets & gitleaks', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Nguy cơ lộ lọt thông tin nhạy cảm**:',
        '• Rất nhiều lập trình viên vô tình gõ `git add .` rồi đẩy cả file `.env` chứa Private Key lên kho mã nguồn GitHub.',
        '• Ngay cả khi bạn commit đè xóa đi, lịch sử git log vẫn lưu lại toàn bộ mật khẩu cũ vĩnh viễn!',
        '**Biện pháp phòng thủ chủ động**:',
        '• **1. Luôn kiểm tra `.gitignore`**: Đảm bảo có dòng `.env`, `.env.local`, `*.pem`, `*.key`.',
        '• **2. Cài đặt Git Pre-commit Hook**: Dùng công cụ `gitleaks` hoặc `husky` để quét và chặn ngay lệnh `git commit` nếu phát hiện có chuỗi mật khẩu trong mã nguồn.'
      ],
      img: { src: 'git-logo.svg', cap: 'Thiết lập chốt chặn bảo vệ Secrets an toàn trước khi đẩy lên Git', h: 360 }
    },
    {
      title: 'Vòng đời Toàn diện một HTTP Request qua Hệ Thống 4 Lớp', layout: 'split', ratio: '1.05fr .95fr',
      steps: [
        { h: '1. Client ➔ Server Entry', p: 'Postman/Web gửi HTTP POST `/api/v1/posts` kèm body JSON tới Node.js `server.js`' },
        { h: '2. Global Middlewares', p: '`morgan` ghi log ➔ `cors` kiểm tra domain ➔ `express.json` parse body' },
        { h: '3. Router & Route Middleware', p: '`post.routes.js` điều phối ➔ chạy middleware validate schema input' },
        { h: '4. Controller Layer', p: '`post.controller.js` bóc tách dữ liệu sạch, chuyển tiếp vào Service' },
        { h: '5. Service Layer', p: '`post.service.js` kiểm tra slug trùng lặp, tính toán quy tắc nghiệp vụ' },
        { h: '6. Model Layer', p: '`post.model.js` thực thi lưu trữ xuống CSDL bền vững' },
        { h: '7. Return & Response', p: 'Kết quả trả ngược lên Controller ➔ đóng gói `{ success: true, data }` ➔ `res.status(201).json()`' }
      ],
      img: { src: 'clean-architecture.svg', cap: 'Hành trình trọn vẹn của dữ liệu trong kiến trúc phần mềm chuyên nghiệp', h: 400 }
    },
    {
      title: 'Kiểm thử Hồi quy với Postman: Giữ vững Hoạt động API', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Định nghĩa Refactor thành công**:',
        '• Refactor là thay đổi cấu trúc bên trong của mã nguồn mà **KHÔNG ĐƯỢC LÀM THAY ĐỔI hành vi bên ngoài** của hệ thống.',
        '• Toàn bộ URL endpoints, HTTP status codes và cấu trúc JSON response từ Buổi 5 phải giữ nguyên giá trị chính xác 100%.',
        '• Chạy lại **Postman Collection Runner** của Buổi 5: Tất cả các bài test kiểm tra CRUD bài viết phải báo màu xanh Pass hoàn hảo!'
      ],
      img: { src: 'clean-architecture.svg', cap: 'Mọi endpoints giữ nguyên contract API với client sau khi refactor', h: 360 },
      callout: { type: 'tip', t: 'Nếu có test case nào bị Fail sau khi refactor, bạn đã vô tình làm thay đổi hợp đồng API. Hãy kiểm tra lại Controller và Service!' }
    },
    {
      title: 'Kiểm tra nhanh kiến thức Buổi 6', badge: 'QUIZ',
      quiz: {
        q: 'Trong kiến trúc phân lớp 4 tầng chuẩn, quy tắc nghiệp vụ "Kiểm tra xem slug của bài viết đã tồn tại trong hệ thống hay chưa, nếu có thì ném lỗi 409 Conflict" nên được đặt ở file nào?',
        opts: [
          'src/routes/post.routes.js',
          'src/controllers/post.controller.js',
          'src/services/post.service.js',
          'src/middlewares/errorHandler.js'
        ],
        a: 2,
        why: 'Đó là **Quy tắc Nghiệp vụ (Business Rule)** cốt lõi của ứng dụng, do đó bắt buộc phải nằm ở **Tầng Service (`post.service.js`)**. Service sẽ kiểm tra và ném `throw new AppError(..., 409)`. Controller chỉ làm nhiệm vụ tiếp nhận HTTP, còn Router chỉ định tuyến!'
      }
    }
  ],
  recap: [
    'Phân tách mối quan tâm (SoC): Kiến trúc 4 tầng **Router ➔ Controller ➔ Service ➔ Model**.',
    '**Thin Controller (Mỏng)**: Chỉ chuyển đổi HTTP, **Service (Dày)** chứa 100% logic nghiệp vụ và không đụng vào `req`/`res`.',
    'Cấu hình môi trường theo 12-Factor App: Đưa hết vào `.env`, commit `.env.example`, chặn bằng `.gitignore`.',
    'Bắt buộc tách `src/app.js` (cấu hình Express) và `src/server.js` (mở cổng mạng `listen`) phục vụ kiểm thử tự động.',
    'Xử lý lỗi tập trung: Lớp `AppError` phân biệt lỗi nghiệp vụ vs Bug, kết hợp `asyncHandler` xóa sổ `try/catch` lặp lại.'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Phân loại đoạn code vào đúng tầng kiến trúc',
      desc: 'Giảng viên cung cấp 8 đoạn code ngắn. Hãy xác định chính xác mỗi đoạn thuộc về tầng nào trong 4 tầng kiến trúc.',
      tasks: [
        'Phân loại 8 tác vụ: (1) Đọc `req.params.id`, (2) Kiểm tra email đã có người dùng chưa, (3) Gửi mã HTTP `201 Created`, (4) Đọc file `products.json`, (5) Tính tổng tiền sau khi áp mã giảm giá, (6) Khai báo `router.post(\'/\')`, (7) Bóc tách Bearer Token từ header, (8) Đóng gói JSON error response.',
        'Giải thích ngắn gọn lý do phân loại cho từng trường hợp.',
        'Thảo luận câu hỏi: Tầng nào tuyệt đối không được xuất hiện `res.status(...)`?'
      ],
      hints: [
        'Tự đặt câu hỏi: "Đoạn code này có cần biết nó đang chạy qua giao thức HTTP không?" Nếu không cần biết ➔ Chắc chắn thuộc về Tầng Service hoặc Model!'
      ]
    },
    {
      level: 'core', time: 45, title: 'Tái cấu trúc bộ API CRUD Products theo MVC 4 Tầng',
      desc: 'Tái cấu trúc toàn bộ mã nguồn CRUD Products từ Buổi 5 sang kiến trúc 4 tầng chuẩn mực. Đảm bảo toàn bộ các bài test Postman cũ chạy xanh 100%.',
      tasks: [
        'Tạo cấu trúc thư mục chuẩn: `src/{config,routes,controllers,services,models,middlewares,utils}`.',
        'Xây dựng `src/models/product.model.js` quản lý file `data/products.json`.',
        'Xây dựng `src/services/product.service.js` chứa toàn bộ validation nghiệp vụ và ném `AppError`.',
        'Xây dựng `src/controllers/product.controller.js` mỏng, bọc qua `asyncHandler`.',
        'Chạy lại Postman Collection Runner: Tất cả các endpoints đều phải Pass hoàn hảo.'
      ],
      hints: [
        'Thực hiện refactor theo thứ tự từ dưới lên: Model ➔ Service ➔ Controller ➔ Routes.'
      ]
    },
    {
      level: 'core', time: 20, title: 'Thiết lập Module Cấu hình dotenv Tập trung',
      desc: 'Đưa toàn bộ các giá trị cấu hình ra khỏi code và quản lý qua `.env`.',
      tasks: [
        'Cài đặt thư viện `dotenv`, tạo file `src/config/index.js`.',
        'Chuyển các biến `PORT`, `NODE_ENV`, `DATABASE_PATH` vào file `.env`.',
        'Viết mã kiểm tra tự động: Nếu thiếu biến bắt buộc, server lập tức dừng khởi động và in thông báo lỗi rõ ràng.',
        'Tạo file `.env.example` và kiểm tra xác nhận file `.env` đã nằm trong `.gitignore`.'
      ]
    },
    {
      level: 'core', time: 25, title: 'Hoàn thiện Hệ thống Bắt lỗi Tập trung',
      desc: 'Xây dựng bộ xử lý ngoại lệ đồng bộ và bất đồng bộ toàn diện cho Express.',
      tasks: [
        'Định nghĩa lớp `AppError` kế thừa từ `Error`.',
        'Viết hàm bọc `asyncHandler` cho tất cả các async route handlers.',
        'Xây dựng middleware `errorHandler` tập trung: Lỗi 4xx trả về chi tiết, lỗi 5xx ẩn chi tiết ở môi trường Production.',
        'Bắt chốt chặn sự kiện `unhandledRejection` và `uncaughtException` trong file `server.js`.'
      ]
    },
    {
      level: 'challenge', time: 35, title: 'Xây dựng Middleware Truy vết Request với X-Request-Id',
      desc: 'Nâng cấp hệ thống logging và khả năng truy vết lỗi cho hệ thống REST API.',
      tasks: [
        'Viết middleware tự động sinh `req.id` bằng `crypto.randomUUID()` và gán vào header `X-Request-Id`.',
        'Gắn các hàm tiện ích phản hồi: `res.ok(data, meta)`, `res.created(data)`, `res.noContent()` vào `res`.',
        'Mọi phản hồi báo lỗi 500 đều phải đính kèm `requestId` để người dùng có thể gửi mã hỗ trợ kỹ thuật.'
      ]
    },
    {
      level: 'homework', time: 40, title: 'Vẽ Sơ đồ Kiến trúc Dự án & Viết Tài liệu README',
      desc: 'Tài liệu hóa kiến trúc hệ thống chuyên nghiệp phục vụ bàn giao dự án.',
      tasks: [
        'Vẽ sơ đồ luồng một request `POST /api/v1/products` đi qua 4 tầng bằng draw.io hoặc Excalidraw.',
        'Viết tài liệu README.md chi tiết: Hướng dẫn clone, cài đặt dependencies, tạo file `.env` từ `.env.example`, và khởi chạy lệnh dev/start.',
        'Đưa cho một bạn cùng lớp thử cài đặt và chạy dự án theo đúng tài liệu README bạn vừa viết.'
      ]
    },
    {
      level: 'project', time: 40, title: 'Đồ án DevBlog Cột mốc 2: Tái cấu trúc Toàn diện theo MVC',
      desc: 'Cột mốc chính thức số 2 của đồ án kết khóa DevBlog.',
      tasks: [
        'Chuyển toàn bộ mã nguồn DevBlog hiện tại sang cấu trúc thư mục `src/` phân lập 4 tầng.',
        'Tách biệt triệt để giữa `src/app.js` và `src/server.js`.',
        'Áp dụng `AppError`, `asyncHandler`, và middleware xử lý lỗi tập trung.',
        'Kiểm tra lại toàn bộ Postman Collection: Tất cả endpoints bài viết vẫn hoạt động trơn tru.',
        'Tạo commit Git chuẩn: `git commit -m "refactor: migrate DevBlog to 4-tier MVC architecture"`.'
      ]
    }
  ],
  project: {
    lead: '**Cột mốc 2**: DevBlog sở hữu kiến trúc phân tầng chuẩn doanh nghiệp, sẵn sàng cắm hệ quản trị cơ sở dữ liệu MySQL.',
    tasks: [
      'Tái cấu trúc thư mục `src/` theo 4 tầng phân lập rõ ràng',
      'Quản lý cấu hình bằng module `config/` và file `.env` an toàn',
      'Kiểm thử tự động hồi quy toàn bộ API với Postman Runner'
    ],
    callout: { type: 'tip', t: 'Buổi 7 tới đây chúng ta chỉ cần **viết lại các file trong thư mục `src/models/`** để kết nối MySQL — đó chính là sức mạnh vượt trội của kiến trúc phân tầng!' }
  }
};
