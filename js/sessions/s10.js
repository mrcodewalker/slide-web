/* ============================================================
   BUỔI 10 — Authorization & Bảo mật API
   ============================================================ */
SESSION_DATA[10] = {
  intro: 'Authentication xác minh "Bạn là ai?", còn Authorization quyết định "Bạn được phép làm gì?". Trong buổi 10, học viên xây dựng hệ thống phân quyền Role-Based Access Control (RBAC), kiểm tra quyền sở hữu tài nguyên (Ownership), làm sạch và kiểm duyệt dữ liệu với Joi, cùng các lớp lá chắn bảo vệ API: Helmet, CORS, Rate Limiting và nhận diện OWASP Top 10 API.',
  agenda: [
    { min: 10, t: 'Ôn B9 & Đặt câu hỏi', d: 'User thường có được xóa bài của Admin không?' },
    { min: 25, t: 'Phân quyền theo vai trò (RBAC)', d: 'User · Moderator · Admin, middleware authorize(...roles)' },
    { min: 30, t: 'Kiểm tra quyền sở hữu (Ownership)', d: 'Chỉ tác giả mới được sửa/xóa bài của chính mình' },
    { min: 35, t: 'Input Validation & Sanitization với Joi', d: 'Chặn dữ liệu rác trước khi chạm vào controller' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 30, t: 'Bảo vệ tầng mạng: Helmet, CORS, Rate Limit', d: 'HTTP security headers, express-rate-limit chống DDoS' },
    { min: 25, t: 'OWASP Top 10 API Security Risks', d: 'BOLA, Broken Auth, Mass Assignment' },
    { min: 15, t: 'Quiz & Giao bài tập', d: '' }
  ],
  slides: [
    { kind: 'section', no: '01', title: 'Phân quyền RBAC & Quyền sở hữu', sub: 'Nguyên tắc đặc quyền tối thiểu (Least Privilege): chỉ cấp đúng quyền cần thiết.' },
    {
      title: 'Authentication vs Authorization',
      cols: [
        { h: '🔑 Authentication (401)', bullets: ['**Xác minh danh tính**: Bạn là ai?', 'Đã đăng nhập chưa? Token có hợp lệ không?', 'Thất bại → HTTP **401 Unauthorized**', 'Ví dụ: Trình chứng minh nhân dân / Căn cước'] },
        { h: '🛡️ Authorization (403)', cls: 'good', bullets: ['**Xác minh quyền hạn**: Bạn được làm gì?', 'User này có quyền truy cập tài nguyên này không?', 'Thất bại → HTTP **403 Forbidden**', 'Ví dụ: Có vé vào cổng nhưng không được vào phòng VIP'] }
      ],
      callout: { type: 'info', t: 'Quy tắc vàng: Luôn chạy **Authentication trước**, nếu danh tính hợp lệ mới chạy tiếp **Authorization**!' }
    },
    {
      title: 'Mô hình RBAC (Role-Based Access Control)', layout: 'split', ratio: '1fr 1fr',
      bullets: [
        'Người dùng được gán một hoặc nhiều **Role** (Vai trò): `user`, `editor`, `admin`.',
        'Mỗi Role có một tập hợp quyền cụ thể.',
        'Endpoint định nghĩa các vai trò được phép truy cập.',
        'Hệ thống mở rộng dễ dàng: thêm role mới mà không cần sửa code từng user.'
      ],
      img: { src: 'cia-triad.svg', cap: 'Mô hình bảo mật CIA: Confidentiality, Integrity, Availability', h: 320 }
    },
    {
      title: 'Viết Middleware Phân Quyền authorize()', badge: 'LIVE CODING',
      code: { file: 'src/middlewares/role.middleware.js', lang: 'javascript', size: 'sm', src: `const AppError = require('../utils/AppError');

// Higher-order function: nhận danh sách role được phép và trả về middleware
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Yêu cầu: auth.middleware phải chạy trước để có req.user
    if (!req.user) {
      return next(new AppError('Chưa xác thực người dùng', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Bạn không có quyền thực hiện thao tác này', 403));
    }

    next();
  };
};` },
      callout: { type: 'tip', t: 'Sử dụng: `router.delete(\'/users/:id\', auth, authorize(\'admin\'), userController.remove);`' }
    },
    {
      title: 'Kiểm tra quyền sở hữu (Ownership)', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/middlewares/ownership.middleware.js', lang: 'javascript', size: 'xs', src: `const Post = require('../models/post.model');
const AppError = require('../utils/AppError');

exports.checkPostOwner = async (req, res, next) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) return next(new AppError('Không tìm thấy bài viết', 404));

  // Admin có toàn quyền, hoặc chính tác giả bài viết
  const isOwner = post.user_id === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return next(new AppError('Bạn không có quyền sửa/xóa bài viết của người khác', 403));
  }

  req.post = post; // Tối ưu: truyền luôn post sang controller, không cần query lại!
  next();
};` },
      bullets: [
        'Role thôi là chưa đủ! Cả `Alice` và `Bob` đều là role `user`.',
        'Nếu không check ownership, `Bob` có thể gửi `PUT /posts/1` để sửa bài của `Alice`!',
        'Đây là lỗ hổng **BOLA (Broken Object Level Authorization)** — số 1 trong OWASP API Security!',
        'Controller chỉ cần xử lý logic cập nhật.'
      ]
    },

    { kind: 'section', no: '02', title: 'Kiểm duyệt dữ liệu đầu vào (Validation)', sub: 'Never trust user input — Luôn validate và sanitize trước khi xử lý.' },
    {
      title: 'Tại sao cần thư viện Validation (Joi)?',
      cols: [
        { h: '❌ Viết if/else thủ công', cls: 'bad', bullets: ['Code controller phình to, lặp lại hàng chục dòng', 'Dễ sót trường hợp: chuỗi rỗng, số âm, email sai định dạng', 'Khó quản lý khi schema thay đổi', 'Không phân tách logic nghiệp vụ và logic kiểm tra'] },
        { h: '✅ Dùng Joi Schema', cls: 'good', bullets: ['Định nghĩa schema trực quan, súc tích', 'Tự động kiểm tra kiểu dữ liệu, độ dài, regex, enum', 'Loại bỏ các trường lạ không cho phép (`stripUnknown: true`)', 'Trả về danh sách thông báo lỗi chi tiết, chuyên nghiệp'] }
      ]
    },
    {
      title: 'Định nghĩa Schema & Middleware Validation', badge: 'LIVE CODING',
      term: `$ npm install joi`,
      code: { file: 'src/middlewares/validate.middleware.js', lang: 'javascript', size: 'xs', src: `const Joi = require('joi');
const AppError = require('../utils/AppError');

// Schema validate bài viết
exports.postSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).required().messages({
    'string.empty': 'Tiêu đề không được để trống',
    'string.min': 'Tiêu đề phải có ít nhất {#limit} ký tự'
  }),
  content: Joi.string().min(20).required(),
  status: Joi.string().valid('draft', 'published').default('draft'),
  tags: Joi.array().items(Joi.string().alphanum()).max(5)
});

// Middleware validate generic
exports.validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const msg = error.details.map(d => d.message).join('; ');
    return next(new AppError(msg, 400));
  }
  req.body = value; // Gán lại body đã được làm sạch và ép kiểu
  next();
};` }
    },

    { kind: 'section', no: '03', title: 'Lá chắn bảo vệ: Helmet & Rate Limit', sub: 'Phòng thủ ở tầng HTTP header và lưu lượng truy cập.' },
    {
      title: 'Bảo vệ Headers với Helmet', layout: 'split', ratio: '1fr 1fr',
      bullets: [
        '**Helmet** tự động thiết lập 15+ HTTP response headers bảo mật.',
        'Ẩn thông tin công nghệ: xóa header `X-Powered-By: Express`.',
        'Chống Clickjacking: `X-Frame-Options: SAMEORIGIN`.',
        'Bảo vệ XSS: `X-Content-Type-Options: nosniff`.',
        'Ép buộc HTTPS: `Strict-Transport-Security` (HSTS).'
      ],
      code: { file: 'src/app.js', lang: 'javascript', size: 'sm', src: `const helmet = require('helmet');

const app = express();

// Kích hoạt Helmet ở middleware đầu tiên
app.use(helmet());` }
    },
    {
      title: 'Chống Brute-Force & Spam: Rate Limiting', layout: 'split', ratio: '1.05fr .95fr',
      term: `$ npm install express-rate-limit`,
      code: { file: 'src/middlewares/rateLimit.js', lang: 'javascript', size: 'xs', src: `const rateLimit = require('express-rate-limit');

// Giới hạn chung cho toàn bộ API: 100 req / 15 phút
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { ok: false, message: 'Bạn gửi quá nhiều yêu cầu, vui lòng thử lại sau 15 phút.' },
  standardHeaders: true, // Trả header RateLimit-*
  legacyHeaders: false
});

// Giới hạn khắt khe cho Login: 5 lần thử sai / 15 phút
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { ok: false, message: 'Đăng nhập sai quá nhiều lần. Vui lòng đợi 15 phút.' }
});` },
      bullets: [
        'Ngăn chặn kẻ xấu tấn công vét cạn (brute-force) mật khẩu.',
        'Ngăn chặn spam tạo bài viết rác làm sập server.',
        'Client nhận mã **HTTP 429 Too Many Requests** khi vượt ngưỡng.'
      ]
    },
    {
      title: 'Tổng quan OWASP Top 10 API Security', layout: 'split', ratio: '.85fr 1.15fr',
      img: { src: 'owasp-logo.svg', cap: 'Open Web Application Security Project', h: 180 },
      bullets: [
        '🔴 **API1: BOLA**: Sửa ID trên URL để đọc/sửa dữ liệu của người khác.',
        '🔴 **API2: Broken Authentication**: Mật khẩu yếu, token không hết hạn, thiếu brute-force limit.',
        '🔴 **API3: Broken Object Property Level**: Mass assignment — client tự gửi `role: "admin"` và server lưu luôn vào DB.',
        '🔴 **API4: Unrestricted Resource Consumption**: Thiếu phân trang hoặc rate limit → request 1 triệu dòng làm tràn RAM.',
        '🔴 **API8: Security Misconfiguration**: Để lộ thông báo lỗi chi tiết (stack trace) ra ngoài production.'
      ]
    },
    {
      title: 'Câu hỏi tình huống bảo mật', badge: 'QUIZ',
      quiz: {
        q: 'Hacker gửi request: `PUT /api/users/profile` với body `{ "name": "Hacker", "role": "admin" }`. Làm sao ngăn chặn họ tự phong làm Admin?',
        opts: [
          'Chỉ cần kiểm tra họ đã đăng nhập (JWT token hợp lệ) hay chưa.',
          'Dùng Joi validation với whitelist các trường được sửa (chỉ cho phép `name`, `bio`), cấm trường `role`.',
          'Mã hóa cơ sở dữ liệu bằng thuật toán AES.',
          'Tắt phương thức HTTP PUT trên toàn bộ server.'
        ],
        a: 1,
        why: 'Đây là lỗi Mass Assignment kinh điển. Bằng cách dùng Joi schema với `{ stripUnknown: true }` và chỉ khai báo các trường được sửa, trường `role` sẽ bị loại bỏ hoàn toàn trước khi đưa vào Database.'
      }
    }
  ],
  recap: [
    '**Authentication (401)** là xác thực danh tính; **Authorization (403)** là kiểm tra quyền truy cập',
    'Triển khai **RBAC** cho các vai trò quản trị và **Ownership check** cho tài nguyên người dùng sở hữu',
    'Luôn kiểm duyệt dữ liệu với **Joi schema**; loại bỏ các trường không mong muốn (chống Mass Assignment)',
    'Dùng **Helmet** gia cố HTTP headers và **Rate Limit** chặn tấn công vét cạn mật khẩu',
    'Nắm vững **OWASP Top 10 API** để luôn viết code phòng thủ chiều sâu'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Cấu hình Helmet & Giới hạn Rate Limit',
      desc: 'Bảo vệ tầng mạng cho server Express.',
      tasks: [
        'Cài đặt `helmet` và `express-rate-limit`',
        'Áp dụng Helmet cho toàn bộ ứng dụng trong `src/app.js`',
        'Tạo `loginLimiter`: tối đa 5 request trong 10 phút áp dụng riêng cho `POST /api/auth/login`',
        'Dùng Postman gửi 6 request liên tiếp vào route login để xác nhận nhận được mã 429'
      ],
      hints: ['Kiểm tra tab Headers trên Postman xem header `X-Powered-By` đã bị xóa chưa!']
    },
    {
      level: 'core', time: 30, title: 'Viết middleware authorize(...roles) cho Admin',
      desc: 'Phân quyền Role-based access control.',
      tasks: [
        'Thêm trường `role` enum (`user`, `admin`) vào model User',
        'Tạo middleware `src/middlewares/role.middleware.js`',
        'Tạo route `GET /api/admin/users`: chỉ tài khoản có role `admin` mới được xem danh sách tất cả user',
        'Tạo route `DELETE /api/admin/posts/:id`: chỉ Admin mới có quyền xóa bất kỳ bài viết nào',
        'Thử đăng nhập với tài khoản role `user` gọi API admin → nhận đúng 403 Forbidden'
      ],
      solution: { file: 'src/middlewares/role.middleware.js', lang: 'javascript', src: `module.exports = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ ok: false, message: 'Bạn không có quyền truy cập chức năng này' });
  }
  next();
};` }
    },
    {
      level: 'core', time: 35, title: 'Kiểm tra quyền sở hữu (Ownership) bài viết & bình luận',
      desc: 'Ngăn chặn người dùng sửa bài viết của nhau.',
      tasks: [
        'Viết middleware `checkPostOwner` trong `src/middlewares/ownership.middleware.js`',
        'Lấy bài viết từ database theo `req.params.id`',
        'Kiểm tra: nếu `post.user_id !== req.user.id` và `req.user.role !== "admin"` thì trả 403',
        'Gắn middleware vào `PUT /api/posts/:id` và `DELETE /api/posts/:id`',
        'Tạo 2 tài khoản User A và User B; dùng token của User B để sửa bài của User A → kiểm tra nhận lỗi 403'
      ]
    },
    {
      level: 'core', time: 35, title: 'Validate dữ liệu với Joi',
      desc: 'Chuẩn hóa input cho API đăng ký và tạo bài viết.',
      tasks: [
        'Tạo `src/validations/auth.validation.js`: validate `register` (email đúng định dạng, password từ 6-30 ký tự, name từ 2-50 ký tự)',
        'Tạo `src/validations/post.validation.js`: validate `createPost` (title từ 5-200 ký tự, content tối thiểu 10 ký tự)',
        'Viết hàm bọc `validate(schema)` trả về lỗi 400 kèm thông báo rõ ràng tiếng Việt khi không hợp lệ',
        'Gắn vào routes tương ứng và kiểm tra trường hợp gửi body thiếu hoặc sai kiểu'
      ],
      solution: { file: 'src/validations/auth.validation.js', lang: 'javascript', src: `const Joi = require('joi');

exports.registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required()
});` }
    },
    {
      level: 'challenge', time: 40, title: 'Chống XSS với Sanitize-HTML & Chống Mass Assignment',
      desc: 'Làm sạch nội dung HTML người dùng gửi lên.',
      tasks: [
        'Cài đặt thư viện `sanitize-html`',
        'Viết hàm làm sạch nội dung bài viết trước khi lưu DB, chỉ cho phép các thẻ an toàn: `<b>, <i>, <p>, <code>, <pre>, <a>`',
        'Loại bỏ triệt để các thẻ `<script>`, `<iframe>` và thuộc tính nguy hiểm như `onerror`, `onclick`',
        'Thử gửi bài viết chứa `<script>alert("hack")</script>` và xác nhận chuỗi script bị triệt tiêu khi lưu vào database'
      ]
    },
    {
      level: 'homework', time: 35, title: 'Xây dựng Audit Log ghi nhận hành động quản trị',
      desc: 'Lưu vết lịch sử các thao tác nhạy cảm của Admin.',
      tasks: [
        'Tạo bảng `audit_logs` (`id`, `user_id`, `action`, `target_id`, `ip_address`, `created_at`)',
        'Mỗi khi Admin xóa bài viết hoặc đổi role user, tự động ghi lại một dòng log vào bảng này',
        'Tạo API `GET /api/admin/audit-logs` có phân trang để Admin xem lịch sử thao tác'
      ]
    },
    {
      level: 'project', time: 45, title: 'Đồ án DevBlog: Cột mốc 4 (Authorization & Bảo mật)',
      desc: 'Bảo vệ toàn diện hệ thống DevBlog API.',
      tasks: [
        'Áp dụng RBAC cho User và Admin',
        'Kiểm tra Ownership trên API sửa/xóa bài viết và bình luận',
        'Validate toàn bộ dữ liệu đầu vào với Joi schemas',
        'Bật Helmet và Rate Limiting trong toàn bộ project',
        'Cập nhật Postman Collection kiểm thử đầy đủ các case 401 Unauthorized và 403 Forbidden'
      ]
    }
  ],
  project: {
    lead: '**Cột mốc 4b**: Hoàn tất lá chắn bảo mật cho DevBlog API.',
    tasks: ['Phân quyền RBAC & Ownership', 'Validation đầu vào với Joi', 'Bật Helmet & Rate Limiter'],
    callout: { type: 'tip', t: 'Buổi 11 chúng ta sẽ làm các tính năng thực tế: Upload ảnh đại diện với Multer, Phân trang, Tìm kiếm và tích hợp trực tiếp vào Front-end!' }
  }
};
