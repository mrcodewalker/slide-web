/* ============================================================
   BUỔI 11 — Tính năng thực tế & Tích hợp Front-end
   ============================================================ */
SESSION_DATA[11] = {
  intro: 'Buổi 11 đưa API vào đời sống thực tế: học cách xử lý multipart/form-data để upload file ảnh với Multer, thiết kế phân trang (pagination), tìm kiếm và sắp xếp chuẩn RESTful. Đặc biệt, ta sẽ gỡ rối bài toán CORS và kết nối trực tiếp giao diện Front-end HTML/CSS/JS thuần (đã làm ở nửa đầu kỳ) với hệ thống Back-end Express!',
  agenda: [
    { min: 10, t: 'Ôn B10 & Bức tranh tích hợp FE - BE', d: 'Hai nửa của ứng dụng web gặp nhau' },
    { min: 35, t: 'Upload file với Multer', d: 'Multipart/form-data, diskStorage, fileFilter, giới hạn dung lượng' },
    { min: 25, t: 'Phục vụ file tĩnh (Static Files)', d: 'express.static(\'uploads\'), URL truy cập ảnh' },
    { min: 30, t: 'Phân trang, Tìm kiếm & Sắp xếp', d: 'Pagination metadata: page, limit, total, totalPages' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 25, t: 'Hiểu đúng về CORS & Preflight', d: 'Tại sao trình duyệt chặn? Access-Control-Allow-Origin' },
    { min: 35, t: 'Live code: Nối Front-end gọi API', d: 'fetch(), lưu token vào localStorage, render DOM' },
    { min: 10, t: 'Quiz & Giao bài tập', d: '' }
  ],
  slides: [
    { kind: 'section', no: '01', title: 'Upload File với Multer', sub: 'Xử lý multipart/form-data an toàn và chuyên nghiệp.' },
    {
      title: 'Vì sao req.body không nhận được file?', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        'Dữ liệu JSON thông thường gửi header `Content-Type: application/json`.',
        'Khi upload file (ảnh, tài liệu), form phải dùng `Content-Type: multipart/form-data`.',
        'Bộ phân tích `express.json()` mặc định **không đọc được multipart**.',
        '**Multer** là thư viện middleware của Express chuyên bóc tách file và body từ request multipart.'
      ],
      callout: { type: 'tip', t: 'Không bao giờ lưu trực tiếp dữ liệu nhị phân của ảnh vào database (BLOB). Hãy lưu file trên ổ cứng / cloud và chỉ lưu **đường dẫn URL (string)** vào database!' }
    },
    {
      title: 'Cấu hình Multer DiskStorage an toàn', badge: 'LIVE CODING',
      term: `$ npm install multer`,
      code: { file: 'src/middlewares/upload.middleware.js', lang: 'javascript', size: 'xs', src: `const multer = require('multer');
const path = require('path');
const AppError = require('../utils/AppError');

// 1. Cấu hình nơi lưu và cách đặt tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => {
    // Đặt tên duy nhất: field-timestamp-random.ext
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = \`\${file.fieldname}-\${Date.now()}-\${Math.round(Math.random() * 1E9)}\${ext}\`;
    cb(null, uniqueName);
  }
});

// 2. Bộ lọc: chỉ cho phép ảnh jpg, png, webp
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WEBP', 400), false);
  }
};

// 3. Giới hạn dung lượng: tối đa 2MB
module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});` }
    },
    {
      title: 'Tạo Route Upload & Phục vụ Ảnh', layout: 'split', ratio: '1.1fr .9fr',
      code: { file: 'src/routes/user.routes.js', lang: 'javascript', size: 'sm', src: `const upload = require('../middlewares/upload.middleware');
const auth = require('../middlewares/auth.middleware');

// Route upload ảnh đại diện (upload.single)
router.post('/avatar', auth, upload.single('avatar'), async (req, res, next) => {
  if (!req.file) return next(new AppError('Vui lòng chọn file ảnh', 400));

  const avatarUrl = \`/uploads/\${req.file.filename}\`;
  await User.updateAvatar(req.user.id, avatarUrl);

  res.json({
    ok: true,
    message: 'Cập nhật avatar thành công',
    data: { avatarUrl }
  });
});` },
      bullets: [
        '`upload.single("avatar")`: nhận 1 file từ trường form có tên `avatar`.',
        'Sau middleware, file nằm trong `req.file` (`filename`, `path`, `size`).',
        'Cần mở thư mục tĩnh: `app.use(\'/uploads\', express.static(\'public/uploads\'))`.',
        'Client truy cập ảnh qua: `http://localhost:3000/uploads/avatar-12345.png`.'
      ]
    },

    { kind: 'section', no: '02', title: 'Phân trang, Tìm kiếm & Sắp xếp', sub: 'Tối ưu hiệu năng khi dữ liệu lên tới hàng ngàn bài viết.' },
    {
      title: 'Thiết kế Pagination Metadata chuẩn REST',
      cols: [
        { h: '📥 Tham số đầu vào (Query)', bullets: ['`?page=2`: Trang muốn xem (mặc định 1)', '`?limit=10`: Số bản ghi mỗi trang (mặc định 10)', '`?search=node`: Từ khóa tìm kiếm theo tiêu đề', '`?sort=-createdAt`: Sắp xếp giảm dần theo ngày tạo'] },
        { h: '📤 Cấu trúc phản hồi chuẩn', cls: 'good', bullets: ['Mảng `data`: danh sách bản ghi trang hiện tại', '`pagination.total`: Tổng số bản ghi thỏa mãn', '`pagination.totalPages`: Tổng số trang', '`pagination.currentPage`: Trang hiện tại', '`pagination.hasPrev / hasNext`: Cờ boolean'] }
      ]
    },
    {
      title: 'Công thức tính toán trong SQL', badge: 'LIVE CODING',
      code: { file: 'src/services/post.service.js', lang: 'javascript', size: 'sm', src: `exports.getPosts = async (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  const offset = (page - 1) * limit; // Vị trí bắt đầu lấy

  const search = query.search ? \`%\${query.search}%\` : null;
  const whereSql = search ? 'WHERE title LIKE ?' : '';
  const params = search ? [search] : [];

  // 1. Đếm tổng số bản ghi
  const [countResult] = await pool.query(\`SELECT COUNT(*) AS total FROM posts \${whereSql}\`, params);
  const total = countResult[0].total;

  // 2. Lấy dữ liệu trang hiện tại
  const [posts] = await pool.query(
    \`SELECT * FROM posts \${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?\`,
    [...params, limit, offset]
  );

  return {
    data: posts,
    pagination: {
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit
    }
  };
};` }
    },

    { kind: 'section', no: '03', title: 'CORS & Kết nối Front-end', sub: 'Giải quyết rào cản nguồn gốc chéo và kết nối fetch() từ trình duyệt.' },
    {
      title: 'Hiểu đúng về CORS (Cross-Origin Resource Sharing)', layout: 'split', ratio: '.95fr 1.05fr',
      bullets: [
        '**Same-Origin Policy**: Trình duyệt mặc định chặn website ở origin này gọi API ở origin khác.',
        'Khác **Giao thức** (`http` vs `https`), khác **Domain** (`ct9.vn` vs `api.ct9.vn`), hoặc khác **Port** (`localhost:5500` vs `localhost:3000`).',
        '**Lưu ý quan trọng**: Lỗi CORS xảy ra ở **Trình duyệt**, không phải ở server! Request thực chất đã gửi đến server, nhưng trình duyệt chặn không cho JS đọc kết quả.',
        'Giải pháp: Cấu hình server trả header `Access-Control-Allow-Origin`.'
      ],
      img: { src: 'mdn-cors-overview.svg', cap: 'Cơ chế chia sẻ tài nguyên nguồn gốc chéo (CORS)', h: 320 }
    },
    {
      title: 'Preflight Request (OPTIONS) & Cấu hình cors', layout: 'split', ratio: '1.05fr .95fr',
      term: `$ npm install cors`,
      code: { file: 'src/app.js', lang: 'javascript', size: 'xs', src: `const cors = require('cors');

// Cấu hình CORS bảo mật
const corsOptions = {
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://ct9-blog.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));` },
      bullets: [
        'Khi gửi method phức tạp (`PUT`, `DELETE`) hoặc có header `Authorization`, trình duyệt tự động gửi trước một request **OPTIONS** gọi là **Preflight**.',
        'Server phải chấp nhận request OPTIONS đó thì trình duyệt mới gửi tiếp request thật.',
        'Package `cors` của Express tự động xử lý toàn bộ logic Preflight này.'
      ]
    },
    {
      title: 'Code Front-end: fetch() kèm Bearer Token',
      code: { file: 'public/fe-demo/app.js', lang: 'javascript', size: 'xs', src: `const API_BASE = 'http://localhost:3000/api';

// 1. Hàm gọi API có kèm Token tự động
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('ct9_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': \`Bearer \${token}\` } : {}),
    ...options.headers
  };

  const response = await fetch(\`\${API_BASE}\${endpoint}\`, { ...options, headers });
  if (response.status === 401) {
    localStorage.removeItem('ct9_token');
    alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!');
    window.location.href = '/login.html';
    return;
  }
  return await response.json();
}

// 2. Hiển thị danh sách bài viết
async function loadPosts(page = 1) {
  const res = await apiRequest(\`/posts?page=\${page}&limit=6\`);
  if (!res.ok) return;

  const container = document.getElementById('postList');
  container.innerHTML = res.data.map(p => \`
    <article class="post-card">
      \${p.cover_url ? \`<img src="http://localhost:3000\${p.cover_url}" alt="\${p.title}">\` : ''}
      <h3>\${p.title}</h3>
      <p>\${p.content.substring(0, 100)}...</p>
      <small>Tác giả: \${p.author_name} · \${new Date(p.created_at).toLocaleDateString()}</small>
    </article>
  \`).join('');
}` }
    },
    {
      title: 'Quiz về Tích hợp & CORS', badge: 'QUIZ',
      quiz: {
        q: 'Front-end chạy ở `http://localhost:5500` gửi `POST /api/posts` kèm file ảnh đại diện sang `http://localhost:3000`. Khi dùng `fetch()`, header `Content-Type` nên đặt là gì?',
        opts: [
          'Bắt buộc đặt là `Content-Type: application/json`.',
          'Đặt là `Content-Type: multipart/form-data`.',
          'KHÔNG đặt header Content-Type; hãy để trình duyệt tự động thiết lập kèm boundary khi truyền FormData.',
          'Đặt là `Content-Type: image/jpeg`.'
        ],
        a: 2,
        why: 'Khi gửi `FormData`, trình duyệt cần tự động sinh một chuỗi phân tách đặc biệt gọi là `boundary` (ví dụ `multipart/form-data; boundary=----WebKitFormBoundary...`). Nếu lập trình viên set tay "multipart/form-data", boundary sẽ bị thiếu và Multer sẽ báo lỗi không đọc được file!'
      }
    }
  ],
  recap: [
    'Dùng **Multer** xử lý `multipart/form-data`; luôn giới hạn dung lượng (`limits`) và kiểm tra loại file (`fileFilter`)',
    'Lưu file ảnh vào thư mục máy chủ, lưu đường dẫn string vào CSDL; phục vụ qua `express.static()`',
    'Phân trang chuẩn dùng `LIMIT` và `OFFSET`; luôn trả kèm metadata: `page`, `limit`, `total`, `totalPages`',
    '**CORS** do trình duyệt chặn khi khác origin; dùng package `cors` để cấp quyền và xử lý Preflight OPTIONS',
    'Front-end lưu JWT trong `localStorage` và gửi qua header `Authorization: Bearer <token>`'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Cấu hình Multer upload avatar đơn giản',
      desc: 'Tập sử dụng Multer trong route Express.',
      tasks: [
        'Cài đặt `multer`',
        'Tạo thư mục `public/uploads` để chứa file',
        'Cấu hình `upload.single("image")` chỉ nhận file dung lượng <= 2MB',
        'Viết route test `POST /api/test/upload` trả về thông tin `req.file`',
        'Dùng Postman gửi file qua `form-data` và kiểm tra file xuất hiện trong ổ cứng'
      ]
    },
    {
      level: 'core', time: 35, title: 'API Phân trang & Tìm kiếm bài viết',
      desc: 'Viết API danh sách bài viết hỗ trợ phân trang và tìm kiếm.',
      tasks: [
        'Route `GET /api/posts` nhận query: `page` (default 1), `limit` (default 10), `search`',
        'Tính toán `offset = (page - 1) * limit`',
        'Thực hiện 2 truy vấn SQL: đếm tổng số bản ghi thỏa điều kiện và lấy dữ liệu trang hiện tại',
        'Trả về response chuẩn cấu trúc: `{ ok: true, data: [...], pagination: { total, totalPages, currentPage, limit } }`',
        'Kiểm tra trường hợp trang vượt quá tổng số trang → trả data là mảng rỗng `[]`'
      ]
    },
    {
      level: 'core', time: 30, title: 'Cấu hình CORS kết nối giữa 2 port local',
      desc: 'Cho phép front-end gọi API không bị chặn.',
      tasks: [
        'Cài đặt `cors`',
        'Cấu hình middleware `cors` trong Express cho phép origin `http://127.0.0.1:5500` hoặc Live Server VSCode',
        'Cho phép headers `Content-Type` và `Authorization`',
        'Mở trang HTML bằng Live Server gọi thử một API và xác nhận không còn lỗi đỏ CORS trên Console DevTools'
      ],
      solution: { file: 'src/app.js', lang: 'javascript', src: `const cors = require('cors');
app.use(cors({
  origin: '*', // Trong môi trường dev có thể để *
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));` }
    },
    {
      level: 'core', time: 40, title: 'Upload ảnh bìa cho bài viết (Cover Image)',
      desc: 'Tích hợp upload ảnh vào nghiệp vụ tạo bài viết.',
      tasks: [
        'Thêm cột `cover_url` VARCHAR(255) NULL vào bảng `posts`',
        'Cập nhật `POST /api/posts` sử dụng middleware `upload.single("cover")`',
        'Nếu có gửi file, lưu đường dẫn `/uploads/${req.file.filename}` vào cột `cover_url`',
        'Cấu hình `app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")))` để ảnh xem được trên trình duyệt'
      ]
    },
    {
      level: 'challenge', time: 45, title: 'Tự động tối ưu và nén ảnh với Sharp',
      desc: 'Chuyển đổi ảnh sang WebP để tăng tốc độ tải trang.',
      tasks: [
        'Cài đặt thư viện `sharp`',
        'Dùng `multer.memoryStorage()` để lưu file tạm vào RAM dạng Buffer',
        'Viết middleware xử lý ảnh: tự động resize ảnh tối đa chiều ngang 1200px, nén chất lượng 80% và xuất ra định dạng `.webp`',
        'Lưu file webp đã tối ưu vào thư mục `public/uploads`'
      ],
      hints: ['`await sharp(req.file.buffer).resize(1200).webp({ quality: 80 }).toFile(outPath)`']
    },
    {
      level: 'homework', time: 40, title: 'Trang Front-end HTML/JS hiển thị bài viết',
      desc: 'Kết nối giao diện HTML tĩnh với Back-end Node.js.',
      tasks: [
        'Tạo file `public/client/index.html` với thanh tìm kiếm và danh sách bài viết',
        'Dùng `fetch()` gọi API `GET /api/posts` để render động các thẻ bài viết',
        'Hiển thị nút `Trang trước` và `Trang sau`, khi bấm sẽ gọi lại API với `page` mới',
        'Có thanh tìm kiếm (input): khi người dùng gõ từ khóa và nhấn Enter sẽ lọc bài viết theo tiêu đề'
      ]
    },
    {
      level: 'project', time: 50, title: 'Đồ án DevBlog: Cột mốc 5 (Tích hợp thực tế & Front-end)',
      desc: 'Hoàn thiện tính năng upload, phân trang và nối giao diện blog.',
      tasks: [
        'Upload avatar cho user và ảnh bìa bài viết',
        'Phân trang và tìm kiếm bài viết hoàn chỉnh',
        'Trang Front-end blog có thể: Xem bài, Phân trang, Đăng nhập lưu token, và Đăng bài viết mới có ảnh bìa',
        'Xử lý mượt mà thông báo lỗi từ API lên giao diện người dùng'
      ]
    }
  ],
  project: {
    lead: '**Cột mốc 5**: Nối API DevBlog với Front-end HTML/CSS/JS.',
    tasks: ['Upload ảnh bìa và avatar với Multer', 'Phân trang & Tìm kiếm bài viết', 'Kết nối giao diện người dùng qua fetch()'],
    callout: { type: 'tip', t: 'Buổi cuối cùng (Buổi 12): Tự động hóa kiểm thử với Jest, sinh tài liệu API Swagger và Deploy ứng dụng lên Internet!' }
  }
};
