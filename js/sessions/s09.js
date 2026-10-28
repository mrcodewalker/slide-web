/* ============================================================
   BUỔI 9 — Authentication: bcrypt & JWT
   ============================================================ */
SESSION_DATA[9] = {
  intro: 'Buổi 9 bước vào giai đoạn Bảo mật: phân biệt Authentication (bạn là ai?) và Authorization (bạn được làm gì?). Học viên sẽ hiểu tại sao không bao giờ lưu mật khẩu thuần, cơ chế Salt & Hash của bcrypt, cấu trúc JWT (Header.Payload.Signature), và dựng hoàn chỉnh luồng Đăng ký / Đăng nhập cho DevBlog API.',
  agenda: [
    { min: 10, t: 'Ôn B8 & Đặt vấn đề bảo mật', d: 'Tại sao API cần biết ai đang gọi?' },
    { min: 25, t: 'Lưu mật khẩu an toàn: Salt & Hash với bcrypt', d: 'Rainbow table, salt rounds, bcrypt.hash & compare' },
    { min: 35, t: 'Session/Cookie vs Token/JWT', d: 'Stateful vs Stateless, vì sao REST API chuộng JWT?' },
    { min: 30, t: 'Giải phẫu JSON Web Token (JWT)', d: 'Header · Payload · Signature, jsonwebtoken thư viện' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 35, t: 'Live code: API /auth/register & /auth/login', d: 'Validate, hash, tạo user, sinh token' },
    { min: 25, t: 'Middleware auth: Bearer Token & req.user', d: 'Bảo vệ endpoint nhạy cảm' },
    { min: 10, t: 'Quiz & Giao bài tập', d: '' }
  ],
  slides: [
    { kind: 'section', no: '01', title: 'Lưu trữ mật khẩu an toàn', sub: 'Không bao giờ, dưới bất kỳ lý do gì, lưu mật khẩu dạng văn bản thuần (plain text).' },
    {
      title: 'Thảm họa lưu Plain Text & MD5',
      cols: [
        { h: '❌ Plain Text / MD5 / SHA1', cls: 'bad', bullets: ['Database bị rò rỉ → kẻ trộm đọc được mật khẩu ngay lập tức', 'Người dùng thường dùng **chung 1 mật khẩu** cho nhiều web', 'MD5/SHA1 tính toán quá nhanh: GPU thử được **hàng tỷ hash/giây**', '**Rainbow table**: bảng tra cứu ngược hash có sẵn từ trước'] },
        { h: '✅ Bcrypt + Salt (Chuẩn an toàn)', cls: 'good', bullets: ['**Salt**: chuỗi ngẫu nhiên sinh riêng cho mỗi mật khẩu', 'Hai người cùng pass `123456` cho ra 2 hash **hoàn toàn khác nhau**', '**Adaptive Cost (Work Factor)**: làm chậm có chủ đích để chống brute-force', 'Chỉ có thể hash 1 chiều, **không thể giải mã ngược**'] }
      ],
      callout: { type: 'danger', t: 'Năm 2012, LinkedIn bị lộ 6.5 triệu mật khẩu băm SHA-1 không có Salt; hơn 90% bị bẻ khóa chỉ trong vài ngày!' }
    },
    {
      title: 'Cơ chế Cryptographic Hash & Salt', layout: 'split', ratio: '.9fr 1.1fr',
      bullets: [
        '**Hash 1 chiều**: Từ mật khẩu `P` tính ra hash `H`. Không thể từ `H` suy ra `P`.',
        '**Salt**: Trước khi hash, sinh chuỗi muối ngẫu nhiên `S`, ghép `P + S` rồi mới hash.',
        'Kết quả lưu trong DB gồm: `[Cost]$[Salt]$[Hash]`.',
        'Khi user đăng nhập: lấy Salt cũ trong DB ra ghép với pass người dùng nhập, hash lại và so sánh.'
      ],
      img: { src: 'hash-function.svg', cap: 'Hàm băm mật mã một chiều', h: 360 }
    },
    {
      title: 'Sử dụng bcrypt trong Node.js', badge: 'LIVE CODING',
      term: `$ npm install bcrypt`,
      code: { file: 'src/utils/password.js', lang: 'javascript', size: 'sm', src: `const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10; // 2^10 = 1024 vòng lặp (~80ms trên CPU hiện đại)

// 1. Khi Đăng ký: băm mật khẩu
exports.hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

// 2. Khi Đăng nhập: so sánh mật khẩu nhập vào với hash trong DB
exports.comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};` },
      callout: { type: 'tip', t: '`SALT_ROUNDS = 10` là tiêu chuẩn cân bằng giữa an toàn và tốc độ server. Quá cao (>14) sẽ làm đơ Event Loop khi nhiều người đăng nhập!' }
    },

    { kind: 'section', no: '02', title: 'Cơ chế Xác thực: Session vs JWT', sub: 'Stateful server-side vs Stateless client-side token.' },
    {
      title: 'Session/Cookie vs Token JWT',
      cols: [
        { h: '🍪 Session-Based (Stateful)', bullets: ['Server lưu Session ID trong RAM / Redis', 'Client nhận Cookie `connect.sid` qua HTTP', 'Mỗi request server phải tra DB/RAM để biết user', 'Khó scale khi có nhiều server (load balancer)', 'Phù hợp: Web truyền thống (SSR, Blade, EJS)'] },
        { h: '🪙 JWT Token (Stateless)', cls: 'good', bullets: ['Server **không cần lưu session** trong RAM/DB', 'Toàn bộ thông tin cần thiết nằm ngay trong Token', 'Server chỉ cần **xác thực chữ ký số** (Signature)', 'Dễ scale ngang (microservices, mobile app, SPA)', 'Chuẩn vàng cho **RESTful API** hiện đại'] }
      ],
      img: { src: 'cookie-exchange.svg', cap: 'Mô hình Cookie truyền thống', h: 120 }, layout: 'stack'
    },
    {
      title: 'Giải phẫu JSON Web Token (JWT)', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        'JWT gồm 3 phần nối nhau bằng dấu chấm: `xxxx.yyyy.zzzz`',
        '🔴 **Header**: Thuật toán mã hóa (`HS256`, `RS256`) & loại token',
        '🟣 **Payload**: Dữ liệu người dùng (`id`, `role`, `email`, `exp`) — **Base64Url encoded, không bảo mật nội dung!**',
        '🔵 **Signature**: Chữ ký tạo bởi `HMAC(Header + Payload, SECRET_KEY)` — đảm bảo token không bị giả mạo.'
      ],
      code: { lang: 'javascript', size: 'xs', src: `// Token ví dụ:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  <-- Header
// eyJpZCI6MSwicm9sZSI6ImFkbWluIn0.       <-- Payload
// SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQ <-- Signature

// ⚠️ LƯU Ý SỐNG CÒN:
// Payload chỉ encode Base64, BẤT KỲ AI cũng đọc được!
// TUYỆT ĐỐI KHÔNG để mật khẩu hay thẻ tín dụng vào Payload!` }
    },
    {
      title: 'Cài đặt và cấu hình jsonwebtoken', badge: 'LIVE CODING',
      term: `$ npm install jsonwebtoken`,
      code: { file: 'src/utils/jwt.js', lang: 'javascript', size: 'sm', src: `const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ct9_super_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

// Ký token
exports.signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Xác thực & giải mã token
exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET); // ném lỗi JsonWebTokenError / TokenExpiredError
};` },
      callout: { type: 'warn', t: '`JWT_SECRET` phải là chuỗi dài ngẫu nhiên và lưu trong `.env`, không bao giờ commit lên GitHub!' }
    },

    { kind: 'section', no: '03', title: 'Luồng Đăng ký & Đăng nhập', sub: 'Hiện thực hóa các API xác thực chuẩn RESTful cho DevBlog.' },
    {
      title: 'Quy trình API /auth/register',
      steps: [
        { h: '1. Nhận input', p: 'email, password, name từ req.body' },
        { h: '2. Kiểm tra trùng', p: 'Tìm xem email đã tồn tại trong DB chưa (409 Conflict)' },
        { h: '3. Hash mật khẩu', p: 'Dùng bcrypt.hash(password, 10)' },
        { h: '4. Tạo User', p: 'Lưu user vào MySQL với password_hash' },
        { h: '5. Phản hồi', p: 'Trả về 201 Created (giấu password_hash)' }
      ]
    },
    {
      title: 'Code Controller: Register & Login',
      code: { file: 'src/controllers/auth.controller.js', lang: 'javascript', size: 'xs', src: `const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const existing = await User.findByEmail(email);
  if (existing) return next(new AppError('Email này đã được sử dụng', 409));

  const passwordHash = await hashPassword(password);
  const newUser = await User.create({ name, email, passwordHash, role: 'user' });

  // Xóa hash trước khi gửi ra response
  delete newUser.password_hash;
  res.status(201).json({ ok: true, message: 'Đăng ký thành công', data: newUser });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (!user) return next(new AppError('Email hoặc mật khẩu không chính xác', 401));

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) return next(new AppError('Email hoặc mật khẩu không chính xác', 401));

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.json({ ok: true, message: 'Đăng nhập thành công', token, user: { id: user.id, name: user.name, role: user.role } });
};` }
    },
    {
      title: 'Middleware Bảo vệ: auth.middleware.js', layout: 'split', ratio: '1.1fr .9fr',
      code: { file: 'src/middlewares/auth.middleware.js', lang: 'javascript', size: 'xs', src: `const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Vui lòng đăng nhập để thực hiện (thiếu Bearer token)', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Gắn thông tin user vào request object
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token đã hết hạn, vui lòng đăng nhập lại', 401));
    }
    return next(new AppError('Token không hợp lệ', 401));
  }
};` },
      bullets: [
        'Client gửi token trong Header: `Authorization: Bearer <token>`',
        'Middleware cắt chuỗi để lấy token',
        'Dùng `jwt.verify` kiểm tra chữ ký & hạn sử dụng',
        'Nếu hợp lệ, gán `req.user = decoded`',
        'Các controller phía sau chỉ việc đọc `req.user.id`'
      ]
    },
    {
      title: 'Gắn auth middleware vào routes',
      code: { file: 'src/routes/post.routes.js', lang: 'javascript', size: 'sm', src: `const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const auth = require('../middlewares/auth.middleware');

// Public route — ai cũng xem được
router.get('/', postController.getAll);
router.get('/:id', postController.getOne);

// Protected route — bắt buộc phải đăng nhập có Token!
router.post('/', auth, postController.create);
router.put('/:id', auth, postController.update);
router.delete('/:id', auth, postController.delete);

module.exports = router;` },
      callout: { type: 'tip', t: 'Trong controller create post, tác giả chính là `req.user.id` từ token, client không thể tự mạo danh `userId` khác!' }
    },
    {
      title: 'Kiểm tra độ hiểu về JWT', badge: 'QUIZ',
      quiz: {
        q: 'Nếu hacker bắt được JWT token của người dùng, họ có thể sửa đổi Payload (ví dụ sửa role: "user" thành "admin") không?',
        opts: [
          'Có thể, vì Payload chỉ mã hóa Base64 nên sửa rất dễ.',
          'Sửa được Payload nhưng server sẽ phát hiện ngay vì Chữ ký (Signature) bị sai lệch.',
          'Không thể sửa vì toàn bộ token được mã hóa không thể mở.',
          'Chỉ sửa được nếu token đã hết hạn.'
        ],
        a: 1,
        why: 'Base64 cho phép giải mã và sửa dữ liệu trong Payload, NHƯNG khi server kiểm tra `HMAC(Header + NewPayload, SECRET)`, chữ ký tính lại sẽ KHÔNG khớp với chữ ký cũ của token. Server lập tức từ chối 401 Unauthorized!'
      }
    }
  ],
  recap: [
    'Không bao giờ lưu mật khẩu plain text; luôn dùng **bcrypt** với salt (rounds 10)',
    'Phân biệt: **Authentication** (xác minh danh tính) vs **Authorization** (kiểm tra quyền hạn)',
    '**JWT** là stateless token gồm 3 phần: Header · Payload · Signature',
    'Payload KHÔNG bảo mật — chỉ encode Base64, không bao giờ nhét dữ liệu nhạy cảm vào payload',
    'Client gửi `Authorization: Bearer <token>`, middleware giải mã và nạp vào `req.user`'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Thực nghiệm tốc độ bcrypt & Salt Rounds',
      desc: 'Hiểu tại sao bcrypt chống brute-force hiệu quả.',
      tasks: [
        'Tạo file `scratch/benchmark-bcrypt.js`',
        'Viết vòng lặp đo thời gian hash mật khẩu với `rounds = 8, 10, 12, 14`',
        'Ghi lại thời gian chạy (ms) của từng mức và rút ra nhận xét'
      ],
      starter: { lang: 'javascript', src: `const bcrypt = require('bcrypt');
async function run() {
  for (const rounds of [8, 10, 12, 14]) {
    const t0 = Date.now();
    await bcrypt.hash('matkhau123', rounds);
    console.log(\`Rounds \${rounds}: \${Date.now() - t0}ms\`);
  }
}
run();` },
      hints: ['Rounds tăng thêm 1 nghĩa là số phép tính tăng gấp đôi (2^rounds)!']
    },
    {
      level: 'core', time: 30, title: 'Cài đặt API Đăng ký (/api/auth/register)',
      desc: 'Xây dựng chức năng tạo tài khoản mới cho DevBlog API.',
      tasks: [
        'Tạo route `POST /api/auth/register`',
        'Kiểm tra: `name`, `email`, `password` không được để trống (nếu thiếu trả 400)',
        'Kiểm tra định dạng email và độ dài password >= 6 ký tự',
        'Kiểm tra email đã tồn tại trong database chưa (trả 409 nếu trùng)',
        'Băm password bằng `bcrypt.hash` và lưu vào DB MySQL',
        'Trả về status 201 cùng thông tin user (đã loại bỏ password_hash)'
      ],
      hints: ['Dùng `delete user.password_hash` hoặc SELECT chỉ các trường cần thiết']
    },
    {
      level: 'core', time: 30, title: 'Cài đặt API Đăng nhập & Cấp JWT (/api/auth/login)',
      desc: 'Xác minh danh tính và sinh access token.',
      tasks: [
        'Tạo route `POST /api/auth/login`',
        'Tìm user trong DB theo email; nếu không thấy trả 401',
        'So sánh mật khẩu bằng `bcrypt.compare`; nếu sai trả 401',
        'Sinh JWT Token có thời hạn 2h chứa `{ id, email, role }`',
        'Trả về JSON `{ ok: true, token, user: { id, name, email, role } }`',
        'Test thành công trên Postman và lưu token vào biến môi trường Postman'
      ],
      hints: ['Thông báo lỗi khi sai email hoặc sai password nên GIỐNG NHAU ("Email hoặc mật khẩu không đúng") để tránh kẻ tấn công dò user.']
    },
    {
      level: 'core', time: 30, title: 'Viết auth middleware & Bảo vệ API bài viết',
      desc: 'Yêu cầu token hợp lệ khi thao tác với bài viết.',
      tasks: [
        'Viết middleware `src/middlewares/auth.middleware.js`',
        'Kiểm tra Header `Authorization: Bearer <token>`',
        'Verify token bằng `jwt.verify`; bắt lỗi `TokenExpiredError` và lỗi token giả',
        'Gán `req.user = decoded` và gọi `next()`',
        'Gắn middleware vào `POST /api/posts`; gán `user_id = req.user.id` khi tạo bài viết mới',
        'Thử gửi request từ Postman không có token → 401; có token → 201 thành công'
      ],
      solution: { file: 'src/middlewares/auth.middleware.js', lang: 'javascript', src: `const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, message: 'Vui lòng cung cấp Bearer token' });
  }
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};` }
    },
    {
      level: 'challenge', time: 40, title: 'API /api/auth/me & Đổi mật khẩu',
      desc: 'API xem thông tin bản thân và đổi mật khẩu an toàn.',
      tasks: [
        'Tạo `GET /api/auth/me` (có auth): trả về thông tin chi tiết user hiện tại từ DB',
        'Tạo `PUT /api/auth/change-password` (có auth): nhận `oldPassword`, `newPassword`',
        'Kiểm tra `oldPassword` có khớp với hash trong DB không (nếu sai trả 400)',
        'Băm `newPassword` và cập nhật vào DB',
        'Trả về thông báo thành công và yêu cầu đăng nhập lại'
      ],
      hints: ['Đọc `req.user.id` từ token, truy vấn DB lấy hash mật khẩu cũ ra để compare.']
    },
    {
      level: 'homework', time: 35, title: 'Postman Collection Automation với JWT',
      desc: 'Cấu hình Postman tự động trích xuất Token sau khi login.',
      tasks: [
        'Mở request Login trong Postman, vào tab **Tests**',
        'Viết script JS tự động lấy `pm.response.json().token` lưu vào biến môi trường `pm.environment.set("token", token)`',
        'Cấu hình tab **Authorization** của cả Collection là `Bearer Token` = `{{token}}`',
        'Chạy toàn bộ collection kiểm tra các request tự động có token mà không cần copy paste tay'
      ],
      starter: { lang: 'javascript', src: `// Trong tab Tests của request Login:
const res = pm.response.json();
if (res.token) {
  pm.environment.set("token", res.token);
  console.log("Token updated successfully!");
}` }
    },
    {
      level: 'project', time: 45, title: 'Đồ án DevBlog: Cột mốc 4 (Authentication)',
      desc: 'Hoàn thiện module Authentication cho DevBlog API.',
      tasks: [
        'Tạo bảng `users` với cột `password_hash` VARCHAR(255)',
        'Hoàn thiện route `/api/auth/register`, `/api/auth/login`, `/api/auth/me`',
        'Khi tạo bài viết `POST /api/posts`, tự động gán `user_id = req.user.id`',
        'Chỉ cho phép sửa/xóa bài viết nếu `req.user.id === post.user_id` (kiểm tra sơ bộ quyền sở hữu)',
        'Export Postman Collection nộp kèm bài tập'
      ]
    }
  ],
  project: {
    lead: '**Cột mốc 4a**: Hệ thống xác thực danh tính DevBlog API.',
    tasks: ['Mật khẩu băm an toàn với bcrypt 10 rounds', 'Cấp JWT token khi login', 'Bảo vệ endpoint tạo bài viết'],
    callout: { type: 'tip', t: 'Buổi 10 chúng ta sẽ bổ sung **Authorization** (Phân quyền Admin vs User) và bảo mật toàn diện với Helmet, Rate-limit, Joi!' }
  }
};
