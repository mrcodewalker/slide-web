/* ============================================================
   BUỔI 4 — Middleware & Routing nâng cao
   ============================================================ */
SESSION_DATA[4] = {
  intro: 'Middleware là khái niệm "ăn tiền" nhất của Express. Dùng hình ảnh dây chuyền kiểm soát chất lượng / lớp hành tây. Buổi này học viên sẽ tự viết logger, auth guard, làm chủ CORS, asyncHandler và xử lý lỗi tập trung chuẩn doanh nghiệp.',
  agenda: [
    { min: 10, t: 'Ôn B3 & chữa bài tập', d: 'Express routes, params, query, Postman testing' },
    { min: 35, t: 'Bản chất Middleware: (req, res, next) & Thứ tự', d: 'Dây chuyền kiểm soát, lifecycle, next() vs res' },
    { min: 30, t: 'Tự viết Middleware: Logger, Timer, Auth Guard', d: 'res.on finish, gắn cờ req.user, middleware factory' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 30, t: 'Middleware bên thứ ba: Morgan, Helmet, Compression', d: 'Bảo mật header, nén gzip, rate limit' },
    { min: 35, t: 'Bản chất cơ chế CORS & Preflight OPTIONS', d: 'Same-Origin Policy, headers, preflight cache' },
    { min: 35, t: 'Xử lý lỗi tập trung & Bẫy lỗi bất đồng bộ', d: 'asyncHandler wrapper, errorHandler 4 tham số, AppError' },
    { min: 15, t: 'Form HTML, Redirect PRG & Giao bài tập B04', d: 'Post-Redirect-Get, cấu trúc module DevBlog' }
  ],
  slides: [
    /* ---------- SECTION 01: BẢN CHẤT CỦA MIDDLEWARE ---------- */
    { kind: 'section', no: '01', title: 'Bản chất của Middleware', sub: 'Những “trạm kiểm soát” mà mọi request đi qua trước khi tới route handler.' },
    {
      title: 'Middleware là gì?', lead: 'Hàm **đứng giữa** request và response, có thể **đọc/sửa** `req`, `res` rồi chuyển tiếp hoặc dừng lại.',
      layout: 'split', ratio: '1.05fr .95fr',
      steps: [
        { h: '1. HTTP Request', p: 'Client gửi request đến cổng mạng của server' },
        { h: '2. HTTP Logger', p: 'Ghi lại IP, Method, URL và thời gian' },
        { h: '3. Body Parser', p: '`express.json()` bóc tách JSON body vào `req.body`' },
        { h: '4. Auth Guard', p: 'Kiểm tra Token / API Key, gắn `req.user`' },
        { h: '5. Route Handler', p: 'Controller xử lý nghiệp vụ ➔ trả về `res.json()`' }
      ],
      img: { src: 'chain-of-responsibility.jpg', cap: 'Mô hình thiết kế Chain of Responsibility (chuỗi trạm kiểm soát Middleware) trong Express (Wikipedia / UML)', h: 520 },
      callout: { type: 'tip', t: 'Hình dung **dây chuyền nhà máy**: mỗi trạm làm một việc nhỏ rồi chuyển cho trạm sau. Trạm nào phát hiện lỗi có thể **dừng cả dây chuyền**.' }
    },
    {
      title: 'Chữ ký hàm chuẩn: (req, res, next) => { ... }', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'middleware.js', lang: 'javascript', size: 'sm', src: `function requestLogger(req, res, next) {
  console.log(\`📥 \${req.method} \${req.originalUrl}\`);

  // Bắt buộc phải chọn 1 trong 2 hành động:
  next(); // 👉 Chuyển giao quyền thực thi cho middleware tiếp theo
}

// Đăng ký middleware cấp toàn cục ứng dụng:
app.use(requestLogger);

app.get('/api/posts', (req, res) => {
  res.json({ message: 'Danh sách bài viết' });
});` },
      bullets: [
        '**3 Tham số bắt buộc**:',
        '• `req`: Đối tượng HTTP Request (có thể đọc và gắn thêm dữ liệu mới).',
        '• `res`: Đối tượng HTTP Response (có thể dừng chu trình gửi kết quả về ngay).',
        '• `next`: Hàm callback chuyển giao quyền điều khiển cho middleware tiếp theo trong ngăn xếp (Stack).',
        '**Quy tắc vàng sống còn**: Trong một middleware, bạn phải chọn **GỌI `next()`** HOẶC **GỬI `res.*()`**. Tuyệt đối không làm cả hai hoặc không làm gì cả (treo request)!'
      ]
    },
    {
      title: 'Thứ tự khai báo Middleware quyết định vận mệnh Request', badge: 'QUIZ',
      code: { file: 'middleware-order.js', lang: 'javascript', size: 'sm', src: `app.use((req, res, next) => {
  console.log('1. Middleware A');
  next();
});

app.get('/api/test', (req, res) => {
  console.log('2. Route Handler B');
  res.send('Kết quả kiểm tra');
});

app.use((req, res, next) => {
  console.log('3. Middleware C');
  next();
});` },
      quiz: {
        q: 'Khi gửi GET /api/test, màn hình Console sẽ in ra những dòng nào?',
        opts: ['1 rồi 2', '1, 2 rồi 3', '2 rồi 1', 'Chỉ duy nhất 2'],
        a: 0,
        why: 'Express khớp Middleware từ trên xuống dưới theo thứ tự app.use(). Sau khi Handler B gọi res.send(), chu trình Request-Response đã chính thức kết thúc và socket được đóng lại. Do đó Middleware C khai báo phía sau sẽ KHÔNG BAO GIỜ được gọi tới!'
      }
    },
    {
      title: 'Phân loại 5 cấp độ Middleware trong Express',
      table: {
        head: ['Cấp độ Middleware', 'Cú pháp khai báo', 'Phạm vi tác động thực tế'],
        rows: [
          ['Cấp Ứng dụng (App-level)', '`app.use(logger)`', 'Chạy cho MỌI request gửi tới máy chủ'],
          ['Cấp Router (Router-level)', '`router.use(authGuard)`', 'Chỉ chạy cho các routes nằm trong router module đó'],
          ['Cấp Route cụ thể (Route-level)', '`app.post(\'/posts\', auth, validate, handler)`', 'Chỉ áp dụng cho đúng duy nhất 1 endpoint đó'],
          ['Tích hợp sẵn (Built-in)', '`express.json()`, `express.static()`', 'Có sẵn trong lõi framework Express'],
          ['Xử lý Ngoại lệ (Error-handling)', '`(err, req, res, next)` (Đủ 4 tham số)', 'Bắt mọi lỗi tập trung, luôn đặt ở CUỐI CÙNG file app.js']
        ]
      },
      callout: { type: 'info', t: 'Hiểu đúng cấp độ middleware giúp bạn đặt trạm kiểm soát đúng nơi, không gây lãng phí CPU cho các route không cần thiết.' }
    },
    {
      title: 'Tự viết HTTP Logger & Response Timer chuyên nghiệp', badge: 'LIVE CODING',
      layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'middlewares/logger.js', lang: 'javascript', size: 'sm', src: `module.exports = function customLogger(req, res, next) {
  const startTime = Date.now();
  const timeStr = new Date().toLocaleTimeString('vi-VN');

  // Sự kiện 'finish' phát ra khi toàn bộ dữ liệu response đã gửi xong
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    
    // Gán biểu tượng theo mã lỗi
    const icon = status >= 500 ? '🔥' : status >= 400 ? '⚠️' : '✅';
    console.log(\`\${icon} [\${timeStr}] \${req.method} \${req.originalUrl} ➔ \${status} (\${duration}ms)\`);
  });

  next(); // Luôn gọi next() ngay lập tức!
};` },
      term: `✅ [14:20:10] GET /api/posts ➔ 200 (4ms)
✅ [14:20:12] POST /api/posts ➔ 201 (12ms)
⚠️ [14:20:15] GET /api/khong-ton-tai ➔ 404 (1ms)
🔥 [14:20:18] GET /api/crash ➔ 500 (2ms)`,
      bullets: [
        '**Vì sao phải dùng `res.on(\'finish\')`?**: Tại thời điểm middleware bắt đầu chạy, Route Handler phía sau chưa xử lý xong nên ta chưa thể biết trước Status Code và tổng thời gian (duration).',
        '**`req.originalUrl`**: Luôn lưu giữ đường dẫn URL đầy đủ ban đầu, không bị cắt cụt khi mount router con.'
      ]
    },
    {
      title: 'Middleware Factory: Tạo Middleware tùy biến theo cấu hình', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'middlewares/requireFields.js', lang: 'javascript', size: 'sm', src: `// Hàm bọc bên ngoài (Factory) nhận tham số cấu hình
function requireFields(...requiredFields) {
  // Trả về hàm middleware chuẩn 3 tham số
  return (req, res, next) => {
    const missing = [];

    for (const field of requiredFields) {
      const val = req.body?.[field];
      if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Dữ liệu không hợp lệ',
        missingFields: missing
      });
    }

    next(); // Hợp lệ ➔ cho phép đi tiếp
  };
}

module.exports = requireFields;` },
      bullets: [
        '**Mẫu thiết kế Factory Pattern**: Một hàm bậc cao nhận cấu hình và trả về một hàm middleware.',
        '**Tái sử dụng cực cao**:',
        { t: 'Route tạo bài viết: `requireFields(\'title\', \'content\')`', sub: ['Route đăng ký tài khoản: `requireFields(\'username\', \'email\', \'password\')`', 'Route đổi mật khẩu: `requireFields(\'oldPassword\', \'newPassword\')`'] },
        '**Cách các thư viện lớn hoạt động**: Cả `cors({ origin: ... })` hay `rateLimit({ max: ... })` đều là Middleware Factory!'
      ]
    },
    {
      title: 'Demo Authentication Guard: Kiểm tra API Key & gắn req.user', badge: 'LIVE CODING',
      layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'middlewares/apiKeyAuth.js', lang: 'javascript', size: 'sm', src: `module.exports = function apiKeyAuth(req, res, next) {
  // Đọc header 'x-api-key' từ client (không phân biệt hoa thường)
  const apiKey = req.get('x-api-key');

  if (!apiKey || apiKey !== 'ct9-secret-token-2026') {
    return res.status(401).json({
      error: 'Truy cập bị từ chối: Thiếu hoặc sai API Key'
    });
  }

  // 🔑 GẮN THÔNG TIN NGƯỜI DÙNG VÀO ĐỐI TƯỢNG REQ:
  req.user = {
    id: 101,
    username: 'admin_ct9',
    role: 'superadmin'
  };

  next(); // Đã xác thực thành công ➔ đi tiếp vào Controller
};` },
      bullets: [
        '**Cơ chế truyền dữ liệu qua `req`**: Đối tượng `req` là duy nhất và sống xuyên suốt chu trình xử lý của một request. Bất kỳ thuộc tính nào gắn vào `req` (như `req.user`) đều có thể truy cập được ở tất cả middleware và route handler phía sau.',
        '**Chặn đứng rủi ro an ninh**: Nếu API Key không hợp lệ, middleware lập tức gửi phản hồi `401 Unauthorized` và kết thúc ngay mà không chạm tới tầng Controller nặng nhọc.',
        '**Bàn đạp sang Buổi 9**: Ở buổi JWT, chúng ta sẽ thay thế chuỗi API Key cố định bằng giải mã Token JWT có chữ ký số!'
      ]
    },

    /* ---------- SECTION 02: THƯ VIỆN MIDDLEWARE THIẾT YẾU ---------- */
    { kind: 'section', no: '02', title: 'Thư viện Middleware thiết yếu', sub: 'Bộ công cụ tiêu chuẩn công nghiệp không thể thiếu trong mọi dự án Production.' },
    {
      title: 'Bộ công cụ Middleware thiết yếu bên thứ ba', kicker: 'B04 · npm install ...',
      cards: [
        { icon: '📝', h: 'morgan', p: 'Ghi log HTTP request tự động với nhiều format (dev, combined, short)' },
        { icon: '🛡️', h: 'helmet', p: 'Tự động thiết lập 14 HTTP headers bảo vệ an ninh chống XSS và Clickjacking' },
        { icon: '🌐', h: 'cors', p: 'Kiểm soát chia sẻ tài nguyên nguồn gốc chéo cho Front-end' },
        { icon: '🗜️', h: 'compression', p: 'Nén dữ liệu phản hồi bằng thuật toán Gzip/Deflate giảm 70% băng thông' },
        { icon: '🚦', h: 'express-rate-limit', p: 'Giới hạn số lượt gọi API theo địa chỉ IP chống Brute-force' },
        { icon: '🍪', h: 'cookie-parser', p: 'Giải mã chuỗi cookie từ request header thành object req.cookies' }
      ], cols: 3, small: true,
      callout: { type: 'tip', t: 'Không phát minh lại bánh xe! Hãy tận dụng các thư viện chuẩn đã được hàng triệu lập trình viên kiểm chứng an ninh.' }
    },
    {
      title: 'Morgan & Helmet: Giám sát truy cập & Phòng ngự cơ bản', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'app.js', lang: 'javascript', size: 'sm', src: `const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

// 1. Helmet: Bật các HTTP headers bảo mật hàng đầu
app.use(helmet());

// 2. Morgan: Ghi log có màu sắc cho môi trường phát triển
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // Định dạng log chuẩn Apache cho production
} else {
  app.use(morgan('dev'));      // Định dạng gọn gàng, có màu sắc cho local dev
}

app.use(express.json());` },
      bullets: [
        '**`helmet()` làm gì cho bạn?**',
        { t: 'Ẩn header `X-Powered-By: Express` (tránh để tin tặc biết server dùng Express).', sub: ['Bật `X-Frame-Options: DENY` (chống tấn công Clickjacking lồng trang web vào iframe).', 'Bật `X-Content-Type-Options: nosniff` (chống trình duyệt đoán sai MIME type).'] },
        '**`morgan(\'dev\')`**: In log trực quan: `GET /api/posts 200 4.215 ms - 512 bytes`.'
      ]
    },
    {
      title: 'Compression: Tối ưu băng thông mạng gấp 3 lần', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'compression-demo.js', lang: 'javascript', size: 'sm', src: `const express = require('express');
const compression = require('compression');

const app = express();

// Bật nén Gzip cho mọi phản hồi > 1KB
app.use(compression({
  threshold: 1024, // Chỉ nén các response có kích thước từ 1KB trở lên
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

app.get('/api/large-dataset', (req, res) => {
  const hugeArray = Array.from({ length: 5000 }, (_, i) => ({
    id: i,
    name: 'Khách hàng #' + i,
    address: 'Hà Nội, Việt Nam'
  }));
  // Dữ liệu thô: ~250 KB ➔ Sau khi nén Gzip: chỉ còn ~35 KB!
  res.json(hugeArray);
});` },
      bullets: [
        '**Cơ chế hoạt động**: Middleware kiểm tra header `Accept-Encoding: gzip, deflate` của trình duyệt. Nếu hỗ trợ, nó tự động nén chuỗi JSON trước khi truyền đi.',
        '**Lợi ích trực tiếp**:',
        { t: 'Giảm tải băng thông mạng từ 60% đến 80%.', sub: ['Tốc độ tải trang Front-end trên mạng di động 4G/5G nhanh hơn rõ rệt.', 'Giảm chi phí hóa đơn băng thông máy chủ đám mây (AWS / DigitalOcean).'] }
      ]
    },

    /* ---------- SECTION 03: BẢN CHẤT CƠ CHẾ CORS ---------- */
    { kind: 'section', no: '03', title: 'Bản chất cơ chế CORS & Preflight', sub: 'Hiểu cặn kẽ vì sao trình duyệt chặn kết nối và cách cấu hình chuẩn xác.' },
    {
      title: 'CORS là gì? Vì sao trình duyệt chặn?', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Same-Origin Policy (Chính sách cùng nguồn)**: Cơ chế an ninh tối cao của trình duyệt nhằm ngăn chặn mã độc ở trang `evil.com` âm thầm gửi request đọc trộm dữ liệu từ `mybank.com`.',
        '**Định nghĩa một Origin**: Bao gồm 3 thành tố: **Giao thức (http/https) + Tên miền (Domain) + Cổng mạng (Port)**:',
        { t: 'Front-end chạy Live Server `http://localhost:5500`.', sub: ['Back-end Express chạy `http://localhost:3000`.', 'Khác Port $\\rightarrow$ Trình duyệt coi là 2 Origin hoàn toàn khác nhau!'] },
        '**Lưu ý cốt lõi**: Lỗi CORS xảy ra ở **phía Trình duyệt**, không phải ở Server! Server vẫn nhận và xử lý request, nhưng trình duyệt chặn không cho JavaScript đọc kết quả.',
        '**Cách giải quyết**: Server cấu hình trả header `Access-Control-Allow-Origin` cho phép client truy cập.'
      ],
      img: { src: 'mdn-cors-overview.svg', cap: 'Cơ chế chia sẻ tài nguyên nguồn gốc chéo (CORS)', h: 420 },
      callout: { type: 'tip', t: 'Postman và cURL không phải trình duyệt nên không bị hạn chế bởi CORS. Nếu Postman chạy được mà web bị lỗi, 100% nguyên nhân là cấu hình CORS trên server!' }
    },
    {
      title: 'Preflight Request (OPTIONS) & Bắt tay 2 bước', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Khi nào trình duyệt gửi Preflight?** Khi request **không phải là Simple Request**:',
        { t: 'Dùng các phương thức HTTP: `PUT`, `DELETE`, `PATCH`.', sub: ['Header có chứa `Content-Type: application/json` hoặc `Authorization` (Bearer token).'] },
        '**Cơ chế bắt tay 2 bước**:',
        { t: '1. Trình duyệt tự động gửi trước 1 request thăm dò với method `OPTIONS`:', sub: ['Hỏi server: "Tôi có được phép gửi `POST` với header `Authorization` đến URL này không?"'] },
        { t: '2. Server trả về mã `204 No Content` kèm các headers cho phép:', sub: ['`Access-Control-Allow-Methods: GET, POST, PUT, DELETE`', '`Access-Control-Allow-Headers: Content-Type, Authorization`'] },
        '**Tối ưu hiệu năng**: Cấu hình `Access-Control-Max-Age: 86400` để trình duyệt lưu cache kết quả Preflight trong 24h, tránh gửi request `OPTIONS` lặp lại liên tục.'
      ],
      img: { src: 'mdn-cors-preflight.svg', cap: 'Luồng bắt tay Preflight Request (OPTIONS) trước khi gửi request chính thức', h: 420 }
    },
    {
      title: 'Cấu hình thư viện cors chuẩn mực cho Dev và Production', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'cors-config.js', lang: 'javascript', size: 'sm', src: `const cors = require('cors');

// Cấu hình danh sách tên miền được phép truy cập (Whitelist)
const allowedOrigins = [
  'http://localhost:5500',      // Live Server cục bộ
  'http://localhost:3000',      // React / Vue / NextJS dev
  'https://devblog.vn'          // Production Domain
];

const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép các công cụ không có origin (như Postman hoặc Mobile App)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Chính sách CORS chặn: Origin này không được phép!'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true,            // Cho phép gửi kèm Cookie / Token
  maxAge: 86400                 // Cache kết quả Preflight trong 24 giờ
};

app.use(cors(corsOptions));` },
      bullets: [
        '**Môi trường Dev**: Có thể dùng `app.use(cors())` mở cho mọi nguồn (`*`).',
        '**Môi trường Production**: BẮT BUỘC phải dùng Whitelist nguồn gốc rõ ràng để chống đánh cắp dữ liệu.',
        '**Cờ `credentials: true`**: Cần thiết khi ứng dụng sử dụng Cookie hoặc HTTP Authentication.'
      ]
    },

    /* ---------- SECTION 04: BỘ ĐỊNH TUYẾN ROUTER NÂNG CAO ---------- */
    { kind: 'section', no: '04', title: 'Bộ định tuyến Router nâng cao', sub: 'Tối ưu hóa cấu trúc dự án với mô hình định tuyến phân tầng.' },
    {
      title: 'Route Chaining & Gắn Middleware theo Scope', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `const express = require('express');
const router = express.Router();
const apiKey = require('../middlewares/apiKey');
const requireFields = require('../middlewares/requireFields');

// Scope 1: Public Route (Ai cũng xem được)
router.get('/', listAllPosts);
router.get('/:id', getPostDetails);

// Scope 2: Route được bảo vệ bằng API Key
router.post(
  '/', 
  apiKey, 
  requireFields('title', 'content'), 
  createNewPost
);

// Scope 3: Gom nhóm phương thức trên cùng 1 đường dẫn:
router.route('/:id')
  .put(apiKey, requireFields('title'), updatePost)
  .delete(apiKey, deletePost);

module.exports = router;` },
      bullets: [
        '**Gắn chuỗi nhiều middleware**: Trong 1 route, bạn có thể truyền số lượng middleware tùy ý: `(req, res, mw1, mw2, mw3, handler)`.',
        '**Thực thi tuần tự**: Nếu `mw1` lỗi ➔ dừng lại ngay, không bao giờ chạy sang `mw2` hay `handler`.',
        '**Tách bạch trách nhiệm (Clean Code)**: Tầng Route chỉ kiểm tra quyền và validate dữ liệu, phần tính toán nhường lại cho Controller!'
      ]
    },

    /* ---------- SECTION 05: XỬ LÝ NGOẠI LỆ TẬP TRUNG ---------- */
    { kind: 'section', no: '05', title: 'Xử lý ngoại lệ tập trung', sub: 'Một nơi duy nhất kiểm soát toàn bộ lỗi của hệ thống (Centralized Error Handling).' },
    {
      title: 'Cơn ác mộng khi viết lặp lại try...catch ở mọi Controller', kicker: 'B04 · Vấn đề lặp mã nguồn',
      layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'repetitive-try-catch.js', lang: 'javascript', size: 'sm', src: `// 😫 CỰC NHỌC: 50 routes là 50 lần copy paste try/catch!
app.get('/api/posts', async (req, res, next) => {
  try {
    const posts = await postService.getAll();
    res.json(posts);
  } catch (err) {
    next(err); // Phải nhớ gọi next(err) thủ công
  }
});

app.post('/api/posts', async (req, res, next) => {
  try {
    const post = await postService.create(req.body);
    res.status(201).json(post);
  } catch (err) {
    next(err); // Nếu quên lệnh này ➔ Server bị treo vĩnh viễn!
  }
});` },
      bullets: [
        '**Khuyết điểm của Express 4**: Khối `try...catch` không thể tự động bắt lỗi của hàm bất đồng bộ (`async function`). Nếu không có `next(err)`, Promise bị reject sẽ gây lỗi UnhandledPromiseRejection làm sập server.',
        '**Giải pháp tối ưu**: Viết một hàm bọc (Wrapper Function) mang tên **`asyncHandler`** để tự động chuyển mọi lỗi phát sinh vào `next(err)`!'
      ]
    },
    {
      title: 'Kỹ thuật bọc asyncHandler — Tạm biệt try...catch thủ công', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'utils/asyncHandler.js', lang: 'javascript', size: 'sm', src: `// Hàm tiện ích bọc async route handler
const asyncHandler = (fn) => (req, res, next) => {
  // Promise.resolve tự động tóm lấy lỗi và đẩy vào next(err)
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

// Sử dụng siêu ngắn gọn và sạch đẹp trong Controller:
const asyncHandler = require('../utils/asyncHandler');

app.get('/api/posts', asyncHandler(async (req, res) => {
  const posts = await postService.getAll();
  // Nếu postService bị lỗi DB, asyncHandler tự động bắt và ném xuống Error Middleware!
  res.json(posts);
}));` },
      bullets: [
        '**Bản chất toán tử Higher-Order Function**: Nhận vào hàm `fn` bất đồng bộ, thực thi nó trong một Promise, và tự động gọi `.catch(next)` nếu có ngoại lệ.',
        '**Code Controller siêu sạch**: Lập trình viên chỉ cần tập trung 100% vào luồng nghiệp vụ thành công mà không phải bận tâm viết `try...catch` lặp lại!',
        '**Chuẩn mực ngành công nghiệp**: Đây là pattern được áp dụng trong mọi dự án Express chuyên nghiệp.'
      ]
    },
    {
      title: 'Middleware xử lý lỗi 4 tham số: (err, req, res, next)', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'middlewares/errorHandler.js', lang: 'javascript', size: 'sm', src: `// ⚠️ BẮT BUỘC PHẢI KHAI BÁO ĐỦ 4 THAM SỐ!
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  console.error('💥 [ERROR CAUGHT]:', err.message);

  res.status(statusCode).json({
    success: false,
    error: {
      message: statusCode === 500 && isProduction ? 'Lỗi máy chủ nội bộ' : err.message,
      statusCode: statusCode,
      // Chỉ hiện vết lỗi (Stack Trace) trên môi trường phát triển (Dev)
      ...(isProduction ? {} : { stack: err.stack })
    }
  });
};` },
      bullets: [
        '**Đúng 4 tham số**: Express nhận diện error handler thông qua `fn.length === 4`. Nếu bạn bỏ bớt tham số `next`, nó sẽ bị coi là middleware thường!',
        '**Vị trí bắt buộc**: Phải được đặt ở **DÒNG CUỐI CÙNG** của file `app.js`, nằm sau tất cả các routes và middleware 404.',
        '**Ẩn vết lỗi trên Production**: Tuyệt đối không bao giờ trả `err.stack` cho client trên môi trường thật vì sẽ làm lộ cấu trúc thư mục và mã nguồn nội bộ!'
      ]
    },
    {
      title: 'Xây dựng lớp ngoại lệ tùy chỉnh AppError chuẩn OOP', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'utils/AppError.js', lang: 'javascript', size: 'sm', src: `class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // Phân loại lỗi người dùng (4xx) hay lỗi server (5xx)
    this.status = \`\${statusCode}\`.startsWith('4') ? 'fail' : 'error';
    // Đánh dấu đây là lỗi nghiệp vụ dự tính trước (Operational Error)
    this.isOperational = true;

    // Giữ nguyên vết ngăn xếp lỗi chính xác
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

// Cách dùng trong Controller:
const AppError = require('../utils/AppError');

app.get('/api/posts/:id', asyncHandler(async (req, res) => {
  const post = await db.findPost(req.params.id);
  if (!post) {
    throw new AppError('Không tìm thấy bài viết với ID này', 404);
  }
  res.json(post);
}));` },
      bullets: [
        '**Kế thừa lớp `Error` gốc**: Giữ trọn vẹn thuộc tính `message` và vết stack trace.',
        '**Gắn kèm `statusCode`**: Giúp Error Handler tự động biết trả về mã 400, 401, 403 hay 404 mà không cần viết `if/else` cồng kềnh.',
        '**Chuẩn OOP thanh lịch**: Đưa văn hóa lập trình chuyên nghiệp vào hệ thống Back-end Node.js.'
      ]
    },
    {
      title: 'Xử lý Route 404 Not Found & Cấu trúc cắm dây Middleware chuẩn', kicker: 'B04 · Thứ tự vàng không đổi',
      code: { file: 'app.js', lang: 'javascript', size: 'sm', src: `const express = require('express');
const app = express();

// 1. Tầng Tiền Tuyến (Security & Logging)
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(compression());

// 2. Tầng Giải Mã Dữ Liệu (Body Parsers)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// 3. Tầng Phục Vụ Tĩnh (Static Files)
app.use(express.static('public'));

// 4. Tầng Định Tuyến Ứng Dụng (Application Routes)
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// 5. Tầng Bắt 404 (Không có route nào ở trên khớp)
app.use((req, res, next) => {
  next(new AppError(\`Không tìm thấy endpoint: \${req.originalUrl}\`, 404));
});

// 6. Tầng Xử Lý Lỗi Toàn Cục (Centralized Error Handler)
app.use(errorHandler);

module.exports = app;` },
      bullets: [
        '**Thứ tự cắm dây là bất biến**: Logger ➔ Security ➔ Parsers ➔ Static ➔ Routes ➔ 404 Fallback ➔ Error Handler.',
        '**Bắt 404 thông minh**: Thay vì `res.status(404).json(...)` trực tiếp, ta chuyển nó thành `next(new AppError(..., 404))` để quy về một mối quản lý format phản hồi duy nhất!'
      ]
    },

    /* ---------- SECTION 06: FORM HTML & REDIRECT ---------- */
    { kind: 'section', no: '06', title: 'Form HTML, Redirect & Tích hợp đồ án', sub: 'Thực hành các mẫu thiết kế biểu mẫu truyền thống và hoàn thiện khung đồ án.' },
    {
      title: 'Vòng đời toàn cảnh của một HTTP Request trong Express', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**1. Bắt tay mạng TCP/IP & TLS**: Trình duyệt kết nối tới cổng 3000, bắt tay SSL nếu chạy HTTPS.',
        '**2. Khởi tạo đối tượng req & res**: Node.js tạo `http.IncomingMessage` và `http.ServerResponse`, chuyển giao cho Express.',
        '**3. Kích hoạt Middleware Stack**: Request đi tuần tự qua từng middleware đã đăng ký qua `app.use()`.',
        '**4. Định tuyến Route Matching**: Bộ định tuyến Router so khớp Method và Path để kích hoạt Controller tương ứng.',
        '**5. Thực thi nghiệp vụ**: Đọc CSDL, tính toán logic và gọi `res.json()`.',
        '**6. Kích hoạt Error Middleware (nếu có lỗi)**: Bất kỳ lỗi nào phát sinh đều được gom xuống Handler 4 tham số.',
        '**7. Đóng kết nối Socket**: Toàn bộ luồng dữ liệu hoàn tất, phát sự kiện `res.on(\'finish\')`.'
      ],
      img: { src: 'mdn-http-layers.svg', cap: 'Vòng đời toàn cảnh các tầng giao thức mạng và chu trình HTTP Request (MDN)', h: 520 }
    },
    {
      title: 'Kỹ thuật gom cụm Middleware thành Mảng (Array of Middlewares)', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `// Định nghĩa bộ lọc phòng vệ nhiều lớp cho các thao tác nhạy cảm
const adminGuard = [
  apiKeyAuth,                       // 1. Kiểm tra xác thực danh tính
  requireFields('title', 'content'), // 2. Kiểm tra dữ liệu bắt buộc
  checkAdminRole                    // 3. Kiểm tra quyền hạn Quản trị viên
];

// Gắn toàn bộ mảng middleware vào route một cách ngắn gọn:
router.post('/api/posts', adminGuard, createNewPost);
router.put('/api/posts/:id', adminGuard, updatePost);
router.delete('/api/posts/:id', [apiKeyAuth, checkAdminRole], deletePost);` },
      bullets: [
        '**Express hỗ trợ mảng Middleware tự nhiên**: Bạn có thể truyền một mảng các hàm middleware vào `app.use()` hoặc bất kỳ route nào.',
        '**Tái sử dụng cực kỳ thanh lịch**: Không cần gõ lại lặp đi lặp lại 3-4 middleware cho từng route.',
        '**Dễ đọc & dễ bảo trì**: Tạo ra các bộ "Guard" tái sử dụng như `authGuard`, `uploadGuard`, `validationGuard`.'
      ]
    },
    {
      title: 'Đọc Cookie an toàn với cookie-parser & Signed Cookies', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'cookie-demo.js', lang: 'javascript', size: 'sm', src: `const cookieParser = require('cookie-parser');

// Cung cấp chuỗi bí mật để ký chữ ký số chống giả mạo cookie
app.use(cookieParser('my-super-secret-signature-key-2026'));

app.get('/api/set-session', (req, res) => {
  // Gửi signed cookie có chữ ký số an toàn:
  res.cookie('user_session', 'id_998877', {
    signed: true,           // Ký mã hóa chống sửa đổi ở client
    httpOnly: true,         // Chống JavaScript đọc trộm qua XSS
    secure: false,          // Đặt true khi chạy HTTPS thật
    maxAge: 7 * 24 * 3600 * 1000 // Hạn sử dụng 7 ngày
  });
  res.json({ message: 'Đã tạo cookie an toàn' });
});

app.get('/api/get-session', (req, res) => {
  // Đọc cookie đã được xác minh chữ ký:
  const session = req.signedCookies.user_session;
  res.json({ session: session || 'Chưa đăng nhập' });
});` },
      bullets: [
        '**Signed Cookies**: Express sử dụng HMAC SHA256 ký kèm vào cookie. Nếu người dùng tự ý vào DevTools chỉnh sửa giá trị, server sẽ phát hiện và trả về `false` ngay lập tức.',
        '**Cờ `httpOnly: true`**: Cực kỳ quan trọng! Ngăn chặn hacker dùng mã độc JavaScript (`document.cookie`) đánh cắp session token qua lỗ hổng XSS.'
      ]
    },
    {
      title: 'Giới hạn tốc độ gọi API với express-rate-limit', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'rate-limit.js', lang: 'javascript', size: 'sm', src: `const rateLimit = require('express-rate-limit');

// 1. Giới hạn chung cho toàn bộ API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Cửa sổ theo dõi: 15 phút
  max: 100,                 // Mỗi địa chỉ IP tối đa 100 requests
  standardHeaders: true,    // Trả header chuẩn RateLimit-*
  legacyHeaders: false,
  message: { error: 'Quá nhiều yêu cầu từ IP của bạn, vui lòng thử lại sau 15 phút' }
});

// 2. Giới hạn cực kỳ nghiêm ngặt cho API Đăng nhập (Chống dò mật khẩu)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 5,                   // Tối đa 5 lần thử sai mật khẩu
  message: { error: 'Thử đăng nhập sai quá 5 lần. Tài khoản tạm khóa 1 giờ.' }
});

app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter);` },
      bullets: [
        '**Phòng chống Brute-force**: Ngăn chặn bot tự động gửi hàng ngàn request dò mật khẩu tài khoản người dùng.',
        '**Phòng chống DoS/DDoS**: Bảo vệ server không bị tê liệt bởi các đợt cào dữ liệu (Web Scraping) hoặc spam requests với cường độ cao.'
      ]
    },
    {
      title: 'Bắt lỗi cấp tiến trình (Process-Level Safety Net)', kicker: 'B04 · Phòng tuyến cuối cùng',
      layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'process-safety.js', lang: 'javascript', size: 'sm', src: `// 🛡️ Bẫy 1: Bắt các ngoại lệ đồng bộ chưa được xử lý ở bất kỳ đâu
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Server sẽ đóng an toàn...');
  console.error(err.name, err.message, err.stack);
  
  // Buộc phải dừng tiến trình để PM2 hồi sinh lại (Clean State)
  process.exit(1);
});

// 🛡️ Bẫy 2: Bắt các Promise bị reject mà không có .catch()
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 UNHANDLED REJECTION! Lý do:', reason);
  // Đóng server từ từ trước khi thoát
  server.close(() => {
    process.exit(1);
  });
});` },
      bullets: [
        '**Vì sao phải thoát tiến trình khi gặp Uncaught Exception?**: Khi có ngoại lệ đồng bộ không bắt được, trạng thái bộ nhớ RAM của Node.js đã bị ô nhiễm (Dirty State). Tiếp tục chạy có thể dẫn đến rò rỉ dữ liệu hoặc sai lệch logic.',
        '**Mô hình Fail-Fast & Auto-Restart**: Trong thực tế sản xuất, ta cấu hình công cụ quản lý tiến trình (như **PM2** ở Buổi 12) để tự động khởi động lại một tiến trình mới tinh chỉ trong vài mili-giây!'
      ]
    },
    {
      title: 'Mẫu thiết kế Graceful Shutdown: Tắt Server an toàn không rớt kết nối', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'graceful-shutdown.js', lang: 'javascript', size: 'sm', src: `const server = app.listen(PORT, () => {
  console.log(\`🚀 Server chạy tại port \${PORT}\`);
});

// Lắng nghe tín hiệu dừng từ Hệ điều hành hoặc Docker (SIGTERM / SIGINT)
function handleGracefulShutdown(signal) {
  console.log(\`\\n🛑 Nhận tín hiệu \${signal}. Đang tắt server nhẹ nhàng...\`);

  // 1. Ngừng nhận thêm request mới từ Internet
  server.close(async () => {
    console.log('✅ Đã đóng cổng mạng HTTP.');

    try {
      // 2. Chờ các truy vấn DB đang chạy dở hoàn tất rồi mới ngắt kết nối
      // await db.disconnect();
      console.log('✅ Đã đóng kết nối Cơ sở dữ liệu.');
      process.exit(0); // Thoát thành công (Exit Code 0)
    } catch (err) {
      console.error('❌ Lỗi khi dọn dẹp:', err);
      process.exit(1);
    }
  });

  // 3. Nếu sau 10 giây vẫn chưa đóng xong, ép buộc dừng tránh treo vô hạn
  setTimeout(() => {
    console.error('⏰ Quá thời gian chờ (10s), buộc phải dừng ngay lập tức!');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT')); // Bấm Ctrl + C` },
      bullets: [
        '**Hiện tượng gián đoạn đột ngột (Hard Kill)**: Nếu tắt server đột ngột, các khách hàng đang thanh toán hoặc đang tải file sẽ bị đứt kết nối giữa chừng, gây mất dữ liệu.',
        '**Graceful Shutdown**: Cho phép server phục vụ nốt các request đang xử lý dở trước khi chính thức tắt nguồn.'
      ]
    },
    {
      title: 'Debugging Express Middleware với biến môi trường DEBUG', layout: 'split', ratio: '1.15fr .85fr',
      term: `$ # Bật nhật ký chẩn đoán chuyên sâu toàn bộ router & middleware:
$ DEBUG=express:* nodemon app.js

express:application booting new devblog app +0ms
express:router use '/' query +2ms
express:router use '/' expressInit +1ms
express:router use '/' logger +1ms
express:router use '/' jsonParser +0ms
express:router:layer match '/' +3ms
express:router:route get '/api/posts' +1ms
  dispatching req.method: GET, path: /api/posts`,
      bullets: [
        '**Thư viện `debug` tích hợp sẵn**: Express sử dụng thư viện `debug` của TJ Holowaychuk, cho phép xem từng bước khớp route và kích hoạt layer.',
        '**Cách lọc phạm vi log**:',
        '• `DEBUG=express:router` ➔ Chỉ xem việc khớp route và url.',
        '• `DEBUG=express:application` ➔ Xem quá trình khởi tạo app và middleware stack.',
        '• `DEBUG=*` ➔ Xem toàn bộ log của tất cả các package có hỗ trợ debug.'
      ]
    },
    {
      title: 'Vệ sinh dữ liệu (Data Sanitization) trước khi xử lý', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'middlewares/sanitize.js', lang: 'javascript', size: 'sm', src: `// Middleware loại bỏ ký tự nguy hiểm chống tấn công NoSQL / XSS
function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        // Cắt bỏ khoảng trắng thừa đầu đuôi
        req.body[key] = req.body[key].trim();
        // Loại bỏ ký tự $ hoặc dấu chấm nguy hiểm nếu dùng MongoDB/NoSQL
        if (key.startsWith('$') || key.includes('.')) {
          delete req.body[key];
        }
      }
    }
  }
  next();
}

app.use(express.json());
app.use(sanitizeBody); // Tự động làm sạch mọi chuỗi string trong body!` },
      bullets: [
        '**Data Sanitization**: Làm sạch dữ liệu trước khi chuyển giao cho Controller (cắt bỏ khoảng trắng, chuẩn hóa email chữ thường, loại bỏ HTML độc hại).',
        '**Khác biệt giữa Validation & Sanitization**:',
        { t: 'Sanitization: Chỉnh sửa/làm sạch dữ liệu cho đúng chuẩn.', sub: ['Validation: Kiểm tra và từ chối nếu không đạt chuẩn (`400 Bad Request`).'] }
      ]
    },
    {
      title: 'Kiểm tra độ sẵn sàng của Middleware cho Production (Checklist)', kicker: 'B04 · Bảng kiểm chuẩn công nghiệp',
      table: {
        head: ['Tiêu chuẩn kiểm tra', 'Công cụ / Giải pháp', 'Mức độ ưu tiên'],
        rows: [
          ['Ghi log truy cập & thời gian', '`morgan(\'combined\')` hoặc custom logger', 'Bắt buộc (P0)'],
          ['Tăng cường HTTP Headers bảo mật', '`helmet()`', 'Bắt buộc (P0)'],
          ['Bảo vệ nguồn gốc chéo CORS', '`cors({ origin: whitelist, credentials })`', 'Bắt buộc (P0)'],
          ['Bảo vệ quá tải dung lượng Body', '`express.json({ limit: \'1mb\' })`', 'Bắt buộc (P0)'],
          ['Nén dữ liệu phản hồi tiết kiệm băng thông', '`compression()`', 'Khuyến nghị cao (P1)'],
          ['Xử lý lỗi tập trung & ẩn stack trace', '`errorHandler` 4 tham số + `NODE_ENV`', 'Bắt buộc (P0)'],
          ['Giới hạn tần suất gọi API', '`express-rate-limit`', 'Bắt buộc với Auth (P0)']
        ]
      },
      callout: { type: 'tip', t: 'Hoàn thành đủ 7 tiêu chí trên đảm bảo ứng dụng Express của bạn đạt chuẩn an toàn của các hệ thống doanh nghiệp lớn.' }
    },
    {
      title: 'Mẫu thiết kế Post-Redirect-Get (PRG Pattern)', layout: 'split', ratio: '1.1fr .9fr',
      cols: [
        {
          h: '1. Form gửi dữ liệu (public/contact.html)',
          code: { lang: 'xml', size: 'xs', src: `<form action="/contact" method="POST">
  <input name="email" type="email" required placeholder="Email của bạn">
  <textarea name="message" required placeholder="Lời nhắn"></textarea>
  <button type="submit">Gửi liên hệ</button>
</form>` }
        },
        {
          h: '2. Route xử lý & Redirect (app.js)',
          code: { lang: 'javascript', size: 'xs', src: `app.use(express.urlencoded({ extended: true }));

app.post('/contact', asyncHandler(async (req, res) => {
  const { email, message } = req.body;
  await saveContactMessage({ email, message });

  // ⚠️ KHÔNG RENDER TRỰC TIẾP! BẮT BUỘC REDIRECT!
  res.redirect('/thanks.html');
}));` }
        }
      ],
      bullets: [
        '**Vấn nạn F5 Form Resubmission**: Nếu sau khi nhận POST bạn render trực tiếp trang kết quả, khi người dùng bấm phím F5 hoặc nút Reload, trình duyệt sẽ gửi lại một request POST nữa ➔ Tạo đơn hàng bị trùng lặp!',
        '**Giải pháp PRG Pattern**:',
        '• Bước 1 (POST): Server nhận dữ liệu và lưu vào CSDL.',
        '• Bước 2 (REDIRECT): Server gửi lệnh chuyển hướng `HTTP 302` sang trang mới.',
        '• Bước 3 (GET): Trình duyệt gửi request `GET /thanks.html` hiển thị thông báo. Giờ đây F5 thoải mái mà không sợ gửi lại dữ liệu!'
      ]
    },
    {
      title: 'Sơ đồ toàn cảnh luồng Middleware trong đồ án DevBlog', kicker: 'B04 · Bức tranh tổng thể',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Đồ án DevBlog API của chúng ta đã được trang bị đầy đủ**:',
        '• **Morgan logger**: Giám sát từng mili-giây thời gian phản hồi của bài viết.',
        '• **Helmet & CORS**: Bảo vệ an ninh và mở cửa cho Front-end gọi API.',
        '• **express.json({ limit: "1mb" })**: Chống tấn công làm tràn RAM.',
        '• **postRoutes mô-đun**: Định tuyến sạch sẽ với prefix `/api/posts`.',
        '• **requireFields middleware**: Kiểm tra bắt buộc trường `title` và `content`.',
        '• **asyncHandler & Centralized Error Handler**: Bắt trọn vẹn mọi lỗi không làm sập server.'
      ],
      img: { src: 'express-middleware-flow.svg', cap: 'Sơ đồ toàn cảnh đường ống Middleware hoàn chỉnh trong đồ án DevBlog API', h: 360 },
      callout: { type: 'tip', t: 'Buổi 5 chúng ta sẽ chính thức chuẩn hóa toàn bộ API theo tiêu chuẩn thiết kế RESTful chuyên nghiệp của Roy Fielding!' }
    }
  ],
  recap: [
    'Middleware `(req, res, next)`: chạy tuần tự theo **thứ tự khai báo**; phải gọi `next()` **hoặc** trả response',
    'Middleware factory (hàm trả về middleware) giúp cấu hình linh hoạt và tái sử dụng code',
    '`express.Router()` + tiền tố prefix: mỗi tài nguyên là một module độc lập, sạch sẽ',
    'Bộ thư viện chuẩn: `morgan`, `cors` (hiểu sâu cơ chế **CORS & Preflight OPTIONS** của browser), `helmet`, `compression`',
    '`asyncHandler` bọc Promise loại bỏ hoàn toàn `try...catch` lặp lại trong Controller',
    'Error Handler **đủ 4 tham số `(err, req, res, next)`**, đặt **cuối cùng**; phân biệt lỗi dev vs prod',
    'Pattern **Post-Redirect-Get (PRG)** chống submit form trùng lặp trên web'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Logger middleware của riêng bạn',
      desc: 'Viết middleware ghi log mỗi request không dùng morgan.',
      tasks: ['File `middlewares/logger.js`', 'Log: giờ, method, URL, status code, thời gian xử lý (ms)', 'Dùng `res.on("finish", …)`', 'Gắn bằng `app.use` và kiểm tra bằng 3 request khác nhau'],
      expected: '[11:05:21] GET /api/ping → 200 (2ms)',
      hints: ['Status code chỉ biết sau khi response gửi xong', '`req.originalUrl` giữ nguyên URL đầy đủ (kể cả khi trong router)'],
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
      tasks: ['`routes/users.js` (`GET /`, `GET /:id`, `POST /`) và `routes/posts.js`', 'Gắn vào `/api/users` và `/api/posts`', 'Thêm `GET /api/users/:id/posts` trong users router', 'Vẽ bảng URL đầy đủ của tất cả endpoint vào README'],
      hints: ['Mỗi file router: `const router = express.Router(); … module.exports = router`', 'Dữ liệu tạm lưu ở mảng đầu file']
    },
    {
      level: 'core', time: 25, title: 'Gắn morgan, cors và error handler',
      desc: 'Hoàn thiện “bộ khung middleware” cho app.',
      tasks: ['Cài `morgan` và `cors`; dùng đúng thứ tự trong công thức app.js', 'Viết `notFound` (404 JSON) và `errorHandler` (4 tham số)', 'Thêm route `GET /api/boom` cố ý `throw new Error("Boom!")` → kiểm tra trả 500 JSON, không lộ stack', 'Thêm route async lỗi và xử lý đúng bằng `next(err)`', 'Mở `index.html` bằng Live Server (cổng khác) và gọi API → thấy CORS hoạt động'],
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
      hints: ['Form HTML gửi `application/x-www-form-urlencoded` → cần `express.urlencoded`', 'Hiển thị lỗi: đọc `URLSearchParams(location.search)` ở phía FE']
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
