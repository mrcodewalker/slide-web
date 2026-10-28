/* ============================================================
   BUỔI 10 — Authorization & Bảo mật API Chuyên Sâu
   ============================================================ */
SESSION_DATA[10] = {
  intro: 'Buổi bảo mật nâng cao và phòng thủ chiều sâu. Xây dựng hệ thống phân quyền Role-Based Access Control (RBAC), kiểm tra quyền sở hữu tài nguyên (Ownership Guard) chống lỗ hổng BOLA, kiểm duyệt dữ liệu với Joi chặn Mass Assignment, dựng lá chắn mạng với Helmet, CORS, Rate Limiting và thấu hiểu trọn vẹn OWASP API Security Top 10.',
  agenda: [
    { min: 10, t: 'Ôn B9 & Đặt câu hỏi tình huống', d: 'User thường có được xóa bài của Admin không?' },
    { min: 30, t: 'Phân quyền RBAC & Kiểm tra quyền sở hữu (Ownership)', d: 'Least Privilege, checkPostOwner, chống BOLA' },
    { min: 35, t: 'Input Validation & Sanitization với Joi', d: 'Schema, stripUnknown chống Mass Assignment' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 35, t: 'Lá chắn mạng: Helmet, CORS, Rate Limit', d: 'Security headers, Preflight cache, Redis rate limit' },
    { min: 35, t: 'OWASP API Security Top 10 Chuyên Sâu', d: 'BOLA, Broken Auth, BFLA, SSRF, Misconfiguration' },
    { min: 25, t: 'Tích hợp Defense-in-Depth vào DevBlog', d: 'Lắp ráp middleware đa tầng' },
    { min: 15, t: 'Tổng kết & giao bài tập B10', d: 'Đồ án DevBlog cột mốc 4b' }
  ],
  slides: [
    /* ---------- SECTION 01: PHÂN QUYỀN RBAC & QUYỀN SỞ HỮU ---------- */
    { kind: 'section', no: '01', title: 'Phân quyền RBAC & Kiểm tra Quyền sở hữu', sub: 'Nguyên tắc đặc quyền tối thiểu (Least Privilege): Mặc định từ chối, chỉ cấp đúng quyền hạn cần thiết.' },
    {
      title: 'Authentication vs Authorization: 401 vs 403', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '🔑 Authentication (Xác thực - 401)', bullets: [
          '• **Xác minh danh tính**: "Bạn là ai?"',
          '• Bạn đã đăng nhập chưa? Token gửi lên có hợp lệ và còn hạn không?',
          '• Nếu thất bại ➔ Trả mã HTTP **`401 Unauthorized`** (Chưa xác thực danh tính).',
          '• **Hình ảnh thực tế**: Bạn xuất trình chứng minh nhân dân tại cổng soát vé.'
        ] },
        { h: '🛡️ Authorization (Quyền hạn - 403)', cls: 'good', bullets: [
          '• **Xác minh quyền hạn**: "Bạn được phép làm gì?"',
          '• Bạn đã đăng nhập hợp lệ với vai trò `User`, nhưng cố tình bấm nút xóa tài khoản của người khác!',
          '• Nếu thất bại ➔ Trả mã HTTP **`403 Forbidden`** (Bị từ chối truy cập).',
          '• **Hình ảnh thực tế**: Bạn có vé vào rạp chiếu phim nhưng không được phép bước vào phòng kỹ thuật chiếu máy.'
        ] }
      ],
      callout: { type: 'info', t: 'Quy tắc dòng chảy bảo mật: **Luôn chạy Authentication trước**; khi danh tính đã được kiểm chứng (`req.user`) thì mới chạy tiếp **Authorization**!' }
    },
    {
      title: 'Tam giác Bảo mật CIA Triad trong Lập trình Web', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        'Mọi kiến trúc an toàn thông tin trên thế giới đều xoay quanh 3 trụ cột cốt lõi (CIA Triad):',
        '🔒 **1. Confidentiality (Tính Bí mật / Riêng tư)**: Dữ liệu chỉ được tiếp cận bởi người có thẩm quyền. Ẩn mật khẩu, mã hóa token, truyền tải an toàn qua HTTPS.',
        '🛡️ **2. Integrity (Tính Toàn vẹn dữ liệu)**: Dữ liệu không bị sửa đổi hay giả mạo trái phép. Chữ ký số HMAC của JWT, kiểm duyệt dữ liệu Joi.',
        '⚡ **3. Availability (Tính Khả dụng / Sẵn sàng)**: Hệ thống luôn sống sót phục vụ khách hàng. Rate Limiting chặn DDoS, Connection Pool chống cạn kiệt tài nguyên.'
      ],
      img: { src: 'cia-triad.svg', cap: 'Mô hình bảo mật CIA: Ba trụ cột sống còn của hệ thống phần mềm', h: 420 }
    },
    {
      title: 'Mô hình Phân Quyền Theo Vai Trò (RBAC)', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Role-Based Access Control (RBAC)**:',
        '• Người dùng không được cấp quyền trực tiếp lẻ tẻ, mà được gán vào các **Vai trò (Roles)** định sẵn.',
        '• Mỗi vai trò sở hữu một tập hợp các **Quyền hạn (Permissions)** cụ thể.',
        '• Nguyên tắc **Default Deny (Mặc định từ chối)**: Bất kỳ hành động nào không được khai báo cho phép thì mặc định là bị cấm tuyệt đối.'
      ],
      img: { src: 'rbac-model.svg', cap: 'Mô hình phân quyền kiểm soát truy cập dựa trên vai trò RBAC (Wikipedia)', h: 520 }
    },
    {
      title: 'Ma Trận Quyền Hạn trong Đồ Án DevBlog',
      lead: 'Bảng quy định phân quyền chi tiết giữa các nhóm người dùng trong hệ thống:',
      table: {
        head: ['Nhóm người dùng (Role)', 'Đọc bài viết', 'Đăng bài mới', 'Sửa/Xóa bài của mình', 'Sửa/Xóa bài người khác', 'Quản trị Users'],
        rows: [
          ['**Guest** (Khách vãng lai)', '✅ Cho phép', '❌ Cấm (401)', '❌ Cấm (401)', '❌ Cấm (401)', '❌ Cấm (401)'],
          ['**User / Member** (Thành viên)', '✅ Cho phép', '✅ Cho phép', '✅ Cho phép (Ownership)', '❌ Cấm (403)', '❌ Cấm (403)'],
          ['**Moderator** (Kiểm duyệt viên)', '✅ Cho phép', '✅ Cho phép', '✅ Cho phép', '✅ Ẩn bài viết vi phạm', '❌ Cấm (403)'],
          ['**Admin** (Quản trị viên tối cao)', '✅ Cho phép', '✅ Cho phép', '✅ Toàn quyền', '✅ Toàn quyền', '✅ Quản trị & Đổi quyền']
        ]
      },
      callout: { type: 'tip', t: 'Trong cơ sở dữ liệu MySQL, ta lưu cột `role ENUM(\'user\', \'moderator\', \'admin\') DEFAULT \'user\'`. Khi dự án quy mô lớn, tách thành 3 bảng: `users`, `roles`, `user_roles` (quan hệ N–N).' }
    },
    {
      title: 'Attribute-Based Access Control (ABAC): So Sánh Với RBAC', layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**Hạn chế của RBAC thuần túy**:',
        '• Khi số lượng vai trò phình to: `accountant_hanoi`, `accountant_hcm`, `manager_level_1` (Role Explosion).',
        '**Mô hình ABAC (Phân quyền theo thuộc tính)**:',
        '• Ra quyết định cấp quyền dựa trên 4 thuộc tính động:',
        '• 1. **Thuộc tính người dùng (Subject)**: `user.department === \'HR\'`, `user.clearanceLevel >= 3`.',
        '• 2. **Thuộc tính tài nguyên (Resource)**: `document.status === \'draft\'`, `post.isPublic === true`.',
        '• 3. **Hành động (Action)**: `read`, `write`, `approve`.',
        '• 4. **Môi trường (Environment)**: `request.time` trong giờ hành chính (8h-17h), `request.ip` thuộc mạng nội bộ VPN.'
      ],
      img: { src: 'rbac-model.svg', cap: 'Mô hình phân quyền kiểm soát truy cập linh hoạt theo thuộc tính và vai trò (Wikipedia)', h: 500 }
    },
    {
      title: 'Hiện Thực Hóa Middleware Phân Quyền authorize()', badge: 'LIVE CODING',
      code: { file: 'src/middlewares/role.middleware.js', lang: 'javascript', size: 'sm', src: `const AppError = require('../utils/AppError');

// Hàm bậc cao nhận vào danh sách các role được phép thực thi:
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Kiểm tra: Bắt buộc auth middleware phải chạy trước đó để có req.user
    if (!req.user) {
      return next(new AppError('Chưa xác thực danh tính người dùng', 401));
    }

    // 2. Kiểm tra vai trò của người dùng có nằm trong whitelist không:
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Bạn không có quyền thực hiện thao tác này', 403));
    }

    next(); // Hợp lệ, chuyển tiếp vào Controller
  };
};` },
      callout: { type: 'tip', t: 'Cách sử dụng cực kỳ ngắn gọn và linh hoạt: `router.delete(\'/users/:id\', auth, authorize(\'admin\'), userController.deleteUser);`' }
    },
    {
      title: 'Lỗ Hổng BOLA — Cơn Ác Mộng Số 1 OWASP API Security', layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**BOLA (Broken Object Level Authorization) là gì?**',
        '• Chỉ phân quyền theo Role là **HOÀN TOÀN CHƯA ĐỦ**!',
        '• Cả `Alice` và `Bob` đều là vai trò `user`. Cả hai đều có quyền gọi `PUT /api/posts/:id` để sửa bài viết.',
        '• Nếu server chỉ kiểm tra `req.user.role === "user"`, thì **Bob có thể gửi request sửa hoặc xóa sạch bài viết của Alice** chỉ bằng cách đổi ID trên URL!',
        '• Đây chính là lỗ hổng BOLA (trước đây gọi là IDOR) đứng đầu bảng xếp hạng lỗ hổng nguy hiểm nhất thế giới suốt 10 năm qua.'
      ],
      img: { src: 'bola-idor-attack.svg', cap: 'Kịch bản tấn công lỗ hổng BOLA/IDOR và giải pháp kiểm tra quyền sở hữu', h: 360 }
    },
    {
      title: 'Kiểm Tra Quyền Sở Hữu (Ownership Guard Middleware)', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/middlewares/ownership.middleware.js', lang: 'javascript', size: 'xs', src: `const { Post } = require('../models');
const AppError = require('../utils/AppError');

exports.checkPostOwnership = async (req, res, next) => {
  const postId = req.params.id;
  const post = await Post.findByPk(postId);

  if (!post) {
    return next(new AppError('Không tìm thấy bài viết yêu cầu', 404));
  }

  // Quy tắc sở hữu: Chính tác giả bài viết HOẶC Quản trị viên (Admin)
  const isOwner = post.userId === req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return next(new AppError('Bạn không có quyền chỉnh sửa bài viết của tác giả khác', 403));
  }

  // Tối ưu hóa: Gắn luôn đối tượng post vào req để controller không phải query lại DB!
  req.targetPost = post;
  next();
};` },
      bullets: [
        '**Lợi ích kép của Ownership Middleware**:',
        '• **1. Bảo mật tuyệt đối**: Ngăn chặn 100% nguy cơ tấn công BOLA.',
        '• **2. Tối ưu hiệu năng**: Tận dụng kiểm tra tìm kiếm bài viết, nạp sẵn vào `req.targetPost` giúp Controller bên dưới xử lý ngay mà không tốn thêm 1 câu truy vấn database.'
      ]
    },
    {
      title: 'Kết Hợp Đa Tầng Bảo Vệ: Auth ➔ Role ➔ Ownership', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/routes/post.routes.js', lang: 'javascript', size: 'sm', src: `const auth = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { checkPostOwnership } = require('../middlewares/ownership.middleware');

// Tuyến đường xóa bài viết:
router.delete('/:id',
  auth,                 // Chặng 1: Bạn đã đăng nhập chưa? (401)
  authorize('user', 'admin'), // Chặng 2: Vai trò có hợp lệ không? (403)
  checkPostOwnership,   // Chặng 3: Bạn có sở hữu bài viết này không? (403)
  postController.deletePost // Chặng 4: Thực thi nghiệp vụ xóa
);` },
      bullets: [
        '**Chiến lược phòng thủ theo chiều sâu (Defense-in-Depth)**:',
        '• Mỗi middleware đảm nhiệm một tầng trách nhiệm rõ ràng.',
        '• Request độc hại sẽ bị chặn đứng ngay từ tầng ngoài cùng trước khi chạm tới tầng cơ sở dữ liệu.'
      ]
    },

    /* ---------- SECTION 02: KIỂM DUYỆT DỮ LIỆU ĐẦU VÀO (JOI) ---------- */
    { kind: 'section', no: '02', title: 'Kiểm Duyệt Dữ Liệu Đầu Vào (Input Validation)', sub: 'Never trust user input — Luôn xác minh và làm sạch dữ liệu trước khi xử lý.' },
    {
      title: 'Cạm Bẫy Của If/Else Thủ Công vs Joi Schema', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '❌ Validate thủ công bằng if/else', cls: 'bad', bullets: [
          '• File Controller phình to hàng trăm dòng code kiểm tra rườm rà.',
          '• Rất dễ bỏ sót các trường hợp biên: chuỗi rỗng toàn dấu cách, số âm, email sai format.',
          '• Khi schema bảng dữ liệu thay đổi, phải đi tìm và sửa lại ở hàng chục file route khác nhau.',
          '• Không phân tách giữa logic kiểm tra cú pháp và logic tính toán nghiệp vụ.'
        ] },
        { h: '✅ Sử dụng Joi Validation Schema', cls: 'good', bullets: [
          '• Khai báo lược đồ kiểm tra dữ liệu bằng cú pháp khai báo (Declarative) cực kỳ ngắn gọn và trực quan.',
          '• Tự động kiểm tra kiểu dữ liệu, độ dài chuỗi, regex, khoảng giá trị, enum.',
          '• Tính năng `stripUnknown: true` tự động loại bỏ mọi trường lạ không cho phép (chống Mass Assignment).',
          '• Trả về danh sách thông báo lỗi chi tiết chuyên nghiệp cho Front-end.'
        ] }
      ],
      callout: { type: 'tip', t: 'Joi là thư viện kiểm duyệt dữ liệu mạnh mẽ và phổ biến nhất trong hệ sinh thái Node.js/Express.' }
    },
    {
      title: 'Định Nghĩa Schema Bài Viết với Joi', badge: 'LIVE CODING',
      term: `$ npm install joi`,
      code: { file: 'src/validators/post.validator.js', lang: 'javascript', size: 'sm', src: `const Joi = require('joi');

exports.createPostSchema = Joi.object({
  title: Joi.string().trim().min(5).max(200).required().messages({
    'string.empty': 'Tiêu đề bài viết không được để trống',
    'string.min': 'Tiêu đề bài viết phải có ít nhất {#limit} ký tự',
    'string.max': 'Tiêu đề bài viết không được vượt quá {#limit} ký tự',
    'any.required': 'Tiêu đề là trường thông tin bắt buộc'
  }),
  content: Joi.string().trim().min(20).required().messages({
    'string.min': 'Nội dung bài viết phải có ít nhất {#limit} ký tự'
  }),
  status: Joi.string().valid('draft', 'published').default('draft'),
  tags: Joi.array().items(Joi.string().alphanum().max(30)).max(5).messages({
    'array.max': 'Một bài viết chỉ được gắn tối đa 5 thẻ tags'
  })
});` }
    },
    {
      title: 'Xây Dựng Middleware Validate Toàn Cục Tái Sử Dụng', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/middlewares/validate.middleware.js', lang: 'javascript', size: 'sm', src: `const AppError = require('../utils/AppError');

// Middleware factory nhận vào Joi schema bất kỳ:
exports.validate = (schema) => {
  return (req, res, next) => {
    // ⚠️ TÙY CHỌN BẢO MẬT CỐT LÕI:
    // abortEarly: false -> Bắt tất cả lỗi thay vì dừng ở lỗi đầu tiên
    // stripUnknown: true -> Loại bỏ hoàn toàn các trường lạ không có trong schema!
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      // Bóc tách toàn bộ thông báo lỗi thành mảng chi tiết:
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }));
      return next(new AppError('Dữ liệu gửi lên không hợp lệ', 400, details));
    }

    // Gán lại req.body bằng dữ liệu đã được làm sạch và ép kiểu an toàn:
    req.body = value;
    next();
  };
};` },
      bullets: [
        '**Lợi ích của `stripUnknown: true`**:',
        '• Nếu hacker gửi body: `{"title": "Bài viết", "role": "admin", "userId": 999}` ➔ `validate` sẽ tự động lọc bỏ `role` và `userId` ra khỏi `req.body`!',
        '• Triệt tiêu hoàn toàn nguy cơ tấn công Mass Assignment.'
      ]
    },
    {
      title: 'Làm Sạch Dữ Liệu Chống XSS (Input Sanitization)', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/utils/sanitize.js', lang: 'javascript', size: 'sm', src: `const xss = require('xss');

// Tùy biến bộ lọc mã độc XSS trong nội dung bài viết HTML:
const xssOptions = {
  whiteList: {
    p: [], b: [], i: [], strong: [], em: [],
    h1: [], h2: [], h3: [], ul: [], ol: [], li: [],
    a: ['href', 'title', 'target'],
    code: ['class'], pre: []
  }
};

exports.sanitizeHtml = (dirtyHtml) => {
  return xss(dirtyHtml, xssOptions);
};

// ============================================
// VÍ DỤ NGĂN CHẶN MÃ ĐỘC:
// ============================================
// Đầu vào của hacker:
// "<p>Chào bạn</p><script>stealCookies()</script>"
// -> Sau khi sanitizeHtml:
// "<p>Chào bạn</p>&lt;script&gt;stealCookies()&lt;/script&gt;"` },
      bullets: [
        '**Hiểm họa Stored XSS**:',
        '• Hacker chèn thẻ `<script>` vào nội dung bài viết. Khi hàng ngàn độc giả vào đọc bài, mã script độc hại sẽ chạy trên trình duyệt của họ và gửi trộm token về cho hacker!',
        '• Sanitize giúp lọc sạch các thẻ nguy hiểm trước khi lưu vào Database.'
      ]
    },

    /* ---------- SECTION 03: LÁ CHẮN BẢO VỆ HẠ TẦNG MẠNG ---------- */
    { kind: 'section', no: '03', title: 'Lá Chắn Mạng: Helmet, CORS & Rate Limiting', sub: 'Phòng thủ ở tầng giao vận HTTP, gia cố Header và kiểm soát lưu lượng request.' },
    {
      title: 'Gia Cố HTTP Security Headers với Helmet', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Thư viện Helmet tự động thiết lập 15+ headers bảo mật quốc tế**:',
        '• **Ẩn thông tin công nghệ**: Tự động xóa bỏ header `X-Powered-By: Express` (hacker không biết server dùng NodeJS để tấn công lỗ hổng đặc thù).',
        '• **Chống Clickjacking (`X-Frame-Options: SAMEORIGIN`)**: Chặn không cho kẻ xấu nhúng website của bạn vào `<iframe>` lừa click.',
        '• **Chống MIME Sniffing (`X-Content-Type-Options: nosniff`)**: Bắt buộc trình duyệt tuân thủ định dạng MIME khai báo.',
        '• **Ép buộc HTTPS (`Strict-Transport-Security` - HSTS)**: Bắt buộc trình duyệt chỉ kết nối qua HTTPS có mã hóa SSL/TLS.'
      ],
      code: { file: 'src/app.js', lang: 'javascript', size: 'sm', src: `const helmet = require('helmet');

const app = express();

// Kích hoạt Helmet ở vị trí middleware ĐẦU TIÊN của ứng dụng:
app.use(helmet());` }
    },
    {
      title: 'Cơ Chế CORS Trong Môi Trường Production', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Cấu hình CORS an toàn chuyên nghiệp**:',
        '• Tuyệt đối **không dùng `app.use(cors())` mở toang mọi domain (`*`)** ở môi trường Production!',
        '• Phải thiết lập danh sách tên miền được phép truy cập (Whitelist Domains).',
        '• Bật cờ `credentials: true` nếu muốn hỗ trợ gửi nhận Cookie qua API.',
        '• Thiết lập thời gian lưu đệm Preflight Request (`maxAge: 86400`) để giảm tải các request `OPTIONS` lặp lại.'
      ],
      img: { src: 'mdn-cors-preflight.svg', cap: 'Quy trình kiểm tra Preflight OPTIONS và phản hồi CORS an toàn', h: 400 }
    },
    {
      title: 'Hiện Thực Hóa Cấu Hình CORS Chuẩn Doanh Nghiệp', badge: 'LIVE CODING',
      code: { file: 'src/config/cors.js', lang: 'javascript', size: 'sm', src: `const cors = require('cors');

// Danh sách các Front-end domain được phép gọi API:
const WHITELIST_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://devblog.vn',
  'https://admin.devblog.vn'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Cho phép các công cụ như Postman/Mobile app (origin = undefined) hoặc nằm trong whitelist:
    if (!origin || WHITELIST_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Chặn bởi chính sách CORS: Tên miền không được cấp quyền'));
    }
  },
  credentials: true, // Cho phép truyền cookie qua CORS
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  maxAge: 86400 // Cache kết quả kiểm tra Preflight trong 24 giờ
};

module.exports = cors(corsOptions);` }
    },
    {
      title: 'Chống Brute-Force & DDoS: express-rate-limit', layout: 'split', ratio: '1.15fr .85fr',
      term: `$ npm install express-rate-limit`,
      code: { file: 'src/middlewares/rateLimit.js', lang: 'javascript', size: 'xs', src: `const rateLimit = require('express-rate-limit');

// 1. Giới hạn chung toàn ứng dụng (100 request / 15 phút):
exports.globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: { message: 'Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau 15 phút' }
  },
  standardHeaders: true, // Trả header RateLimit-Limit, RateLimit-Remaining
  legacyHeaders: false
});

// 2. Giới hạn cực kỳ khắt khe cho endpoint Đăng nhập (5 lần thử sai / 15 phút):
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: { message: 'Đăng nhập sai quá nhiều lần. Tài khoản tạm khóa thử lại sau 15 phút.' }
  }
});` },
      bullets: [
        '**Lá chắn bảo vệ máy chủ**:',
        '• Ngăn chặn hacker dùng tool bắn hàng ngàn mật khẩu vào `/login` mỗi giây.',
        '• Khi vượt ngưỡng, client nhận ngay mã HTTP **`429 Too Many Requests`** kèm header thông báo số giây phải chờ.'
      ]
    },
    {
      title: 'Rate Limiting Theo User Account & Lưu Trữ Cụm Redis', layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**Hạn chế của Rate Limit theo IP thuần túy**:',
        '• Nếu toàn bộ sinh viên trong trường Đại học dùng chung 1 địa chỉ IP mạng trường (NAT IP), 1 bạn spam đăng nhập có thể làm khóa lây sang toàn bộ các bạn khác!',
        '**Giải pháp: Định danh khóa linh hoạt (Key Generator)**:',
        '• Nếu đã đăng nhập ➔ Rate limit theo `req.user.id`.',
        '• Nếu chưa đăng nhập ➔ Rate limit theo `req.ip`.',
        '**Lưu trữ bộ đếm với Redis Store (`rate-limit-redis`)**:',
        '• Trong hệ thống có 5 server chạy song song, lưu bộ đếm trong RAM Node.js sẽ không chính xác.',
        '• Redis đóng vai trò kho lưu trữ bộ đếm tập trung dùng chung cho toàn bộ cụm server!'
      ],
      img: { src: 'redis-rate-limiter.svg', cap: 'Kiến trúc Rate Limiting phân tán bảo vệ hệ thống với cụm bộ nhớ Redis', h: 360 }
    },
    {
      title: 'Content Security Policy (CSP): Tấm Khiên Chống XSS Của Helmet', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Chỉ cho phép tải tài nguyên từ chính domain này
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"], // Chỉ cho phép script từ CDN chỉ định
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https://api.devblog.vn"]
    }
  })
);` },
      bullets: [
        '**Sức mạnh của CSP Header**:',
        '• Kể cả khi hacker tiêm được thẻ `<script src="https://hacker.com/malware.js">` vào HTML, trình duyệt cũng lập tức từ chối tải file script đó vì vi phạm chính sách CSP!',
        '• Chốt chặn phòng thủ tầng cuối vô cùng hữu hiệu.'
      ]
    },
    {
      title: 'Chống Ô Nhiễm Tham Số HTTP Parameter Pollution (HPP)', layout: 'split', ratio: '1.1fr .9fr',
      code: { lang: 'javascript', size: 'sm', src: `// Tấn công HPP: Hacker gửi nhiều tham số trùng tên
// GET /api/posts?sort=price&sort=secret_leak

// Express parse req.query.sort thành MẢNG: ['price', 'secret_leak']
// -> Nếu code bạn viết: req.query.sort.toLowerCase()
// -> Crash lỗi sập server vì mảng không có toLowerCase()!

// ✅ GIẢI PHÁP: Sử dụng thư viện hpp
const hpp = require('hpp');
app.use(hpp({ whitelist: ['filter', 'tags'] })); // Chỉ cho phép mảng ở các trường chỉ định` },
      bullets: [
        '**Lỗ hổng Parameter Pollution**:',
        '• Lợi dụng sự khác biệt giữa các hệ thống trong việc parse tham số trùng lặp trên URL để bypass validation hoặc làm crash server.'
      ]
    },
    {
      title: 'Bảo Mật Cookie với các Cờ: HttpOnly, Secure, SameSite', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `res.cookie('token', jwtToken, {
  httpOnly: true,        // 🛡️ Chặn 100% JavaScript truy cập (Chống XSS)
  secure: true,          // 🔒 Chỉ gửi qua kết nối HTTPS có mã hóa SSL
  sameSite: 'strict',    // 🚫 Chống tấn công CSRF (Không gửi cookie khi click từ web khác)
  maxAge: 3600000,       // 1 giờ
  path: '/'
});` },
      bullets: [
        '**Bộ 3 cờ vàng bảo vệ Cookie**:',
        '• **HttpOnly**: JavaScript `document.cookie` không thể chạm tới.',
        '• **Secure**: Ngăn chặn rò rỉ cookie qua wifi công cộng không mã hóa (HTTP).',
        '• **SameSite (Strict / Lax)**: Trình duyệt không đính kèm cookie khi người dùng bị lừa bấm vào link lạ từ email hoặc website độc hại.'
      ]
    },

    /* ---------- SECTION 04: OWASP API SECURITY TOP 10 ---------- */
    { kind: 'section', no: '04', title: 'OWASP API Security Top 10 Chuyên Sâu', sub: 'Thấu hiểu tường tận 10 lỗ hổng nguy hiểm nhất đe dọa hệ thống API toàn cầu.' },
    {
      title: 'Tổng Quan Bảng Xếp Hạng OWASP API Security Top 10', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Open Web Application Security Project (OWASP)**:',
        '• Tổ chức phi lợi nhuận uy tín nhất thế giới về an ninh ứng dụng.',
        '• Bảng xếp hạng OWASP API Top 10 tổng kết từ hàng ngàn vụ rò rỉ dữ liệu của các tập đoàn lớn (Facebook, Uber, T-Mobile).',
        '• Là kim chỉ nam bắt buộc phải nắm vững của mọi kỹ sư Backend chuyên nghiệp.'
      ],
      img: { src: 'owasp-logo.svg', cap: 'Biểu tượng của tổ chức bảo mật ứng dụng web mở toàn cầu OWASP', h: 360 }
    },
    {
      title: 'API1: BOLA (Broken Object Level Authorization)', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'http', size: 'sm', src: `# Hacker đăng nhập với tài khoản ID 10
GET /api/v1/invoices/999 HTTP/1.1
Authorization: Bearer <token_cua_user_10>

# HẬU QUẢ KHI THIẾU OWNERSHIP CHECK:
# Server chỉ kiểm tra token hợp lệ -> Trả về hóa đơn 999 của nạn nhân khác!
# Dữ liệu tài chính, địa chỉ nhà, số điện thoại bị lộ toàn bộ!` },
      bullets: [
        '**Kịch bản khai thác phổ biến nhất hành tinh**:',
        '• Kẻ xấu đơn giản chỉ cần thay đổi số ID trên URL (`/documents/:id`, `/orders/:id`, `/messages/:id`).',
        '• **Biện pháp phòng thủ số 1**: Luôn luôn kiểm tra quyền sở hữu `record.userId === req.user.id` trước khi trả dữ liệu!'
      ]
    },
    {
      title: 'API2: Broken Authentication & API3: Mass Assignment', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '🔴 API2: Broken Authentication', bullets: [
          '• Mật khẩu lưu dạng plain text hoặc băm bằng thuật toán yếu (MD5).',
          '• Token JWT không có thời hạn hết hạn (`exp`).',
          '• Không có Rate Limit ở endpoint `/login` ➔ Hacker tha hồ brute-force.',
          '• **Khắc phục**: Bcrypt salt 10 + JWT 15m + Rate limit 5 req/15m.'
        ] },
        { h: '🔴 API3: Broken Object Property (Mass Assignment)', bullets: [
          '• Hacker gửi kèm các trường nhạy cảm trong body: `{"name": "Lan", "role": "admin", "isVerified": true}`.',
          '• Server dùng lệnh mù quáng: `User.update(req.body)`.',
          '• **Khắc phục**: Dùng Joi với `{ stripUnknown: true }` hoặc whitelist trường cho phép sửa!'
        ] }
      ]
    },
    {
      title: 'API4: Resource Consumption & API5: BFLA', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '🔴 API4: Unrestricted Resource Consumption', bullets: [
          '• Hacker gọi `GET /api/posts?limit=10000000` (đòi 10 triệu bản ghi một lúc).',
          '• Máy chủ ngốn sạch RAM và CPU để query DB ➔ Server treo cứng (DDoS)!',
          '• **Khắc phục**: Ép buộc giới hạn tối đa `limit = Math.min(50, limit)` và giới hạn kích thước body upload.'
        ] },
        { h: '🔴 API5: Broken Function Level Authorization (BFLA)', bullets: [
          '• User thường đoán ra đường dẫn ẩn: `DELETE /api/v1/admin/users/5`.',
          '• Server quên gắn middleware `authorize(\'admin\')` ➔ Xóa user thành công!',
          '• **Khắc phục**: Luôn áp dụng nguyên tắc Default Deny trên toàn bộ route `/admin/*`.'
        ] }
      ]
    },
    {
      title: 'API7: SSRF & API8: Security Misconfiguration', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '🔴 API7: Server Side Request Forgery (SSRF)', bullets: [
          '• API có tính năng tải ảnh đại diện từ link URL người dùng nhập vào.',
          '• Hacker nhập: `http://169.254.169.254/latest/meta-data/` (địa chỉ metadata nội bộ của máy chủ AWS Cloud!).',
          '• Server tự động gọi link đó và gửi trả lại AWS Secret Key cho hacker!',
          '• **Khắc phục**: Chặn toàn bộ IP nội bộ (Private IPs: 127.0.0.1, 10.0.0.0/8).'
        ] },
        { h: '🔴 API8: Security Misconfiguration', bullets: [
          '• Để lộ vết ngăn xếp lỗi (`stack trace`) của MySQL ra màn hình phản hồi cho client.',
          '• Để lộ file `.env` lên Git công khai.',
          '• Để lộ header `X-Powered-By: Express`.',
          '• **Khắc phục**: Helmet, tắt stack trace ở Production, bảo vệ `.env` bằng `.gitignore`.'
        ] }
      ]
    },
    {
      title: 'API6: Unrestricted Access to Sensitive Business Flows', layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**Tấn công logic dòng chảy nghiệp vụ (Business Flow Abuse)**:',
        '• Hacker không khai thác lỗi code cú pháp, mà khai thác chính tính năng hợp lệ của ứng dụng!',
        '• **Ví dụ thực tế**: Viết bot tự động mua vét sạch vé concert ca nhạc hoặc gom hàng flash sale trong 1 giây để đầu cơ bán lại chợ đen; bot tự động spam tạo 10,000 tài khoản ảo.',
        '• **Biện pháp phòng thủ đa tầng**:',
        '• Tích hợp dịch vụ phát hiện Captcha (Cloudflare Turnstile, reCAPTCHA v3).',
        '• Phân tích hành vi bất thường (Device Fingerprinting, tốc độ thao tác chuột).'
      ],
      img: { src: 'owasp-logo.svg', cap: 'Chống lạm dụng luồng nghiệp vụ nhạy cảm với Bot Mitigation', h: 360 }
    },
    {
      title: 'Cơ Chế Khóa Tài Khoản Tạm Thời (Account Lockout Policy)', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `// Khi kiểm tra đăng nhập trong auth.service.js:
if (user.isLockedUntil && user.isLockedUntil > new Date()) {
  const remainingMinutes = Math.ceil((user.isLockedUntil - new Date()) / 60000);
  throw new AppError(\`Tài khoản tạm khóa do nhập sai nhiều lần. Vui lòng thử lại sau \${remainingMinutes} phút\`, 429);
}

if (!isMatch) {
  user.failedLoginAttempts += 1;
  if (user.failedLoginAttempts >= 5) {
    user.isLockedUntil = new Date(Date.now() + 15 * 60 * 1000); // Khóa 15 phút
    user.failedLoginAttempts = 0;
  }
  await user.save();
  throw new AppError('Email hoặc mật khẩu không chính xác', 401);
}` },
      bullets: [
        '**Khóa tài khoản ở cấp Database**:',
        '• Ngay cả khi hacker đổi địa chỉ IP liên tục (dùng proxy xoay vòng để vượt qua Rate Limit theo IP), tài khoản của nạn nhân vẫn được bảo vệ an toàn!'
      ]
    },
    {
      title: 'Audit Logging: Ghi Nhật Ký Truy Vết Hành Vi Quản Trị', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `// Bảng audit_logs (id, user_id, action, target_type, target_id, ip, timestamp)
async function recordAuditLog({ userId, action, targetType, targetId, req }) {
  await AuditLog.create({
    userId,
    action, // 'DELETE_POST', 'UPDATE_ROLE', 'BAN_USER'
    targetType,
    targetId,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    createdAt: new Date()
  });
}

// Gọi trong Controller sau khi Admin thực hiện hành động nhạy cảm:
await recordAuditLog({
  userId: req.user.id,
  action: 'DELETE_POST',
  targetType: 'Post',
  targetId: post.id,
  req
});` },
      bullets: [
        '**Tuân thủ tiêu chuẩn an ninh kiểm toán (Audit Trail)**:',
        '• Mọi hành vi xóa bài viết, đổi quyền người dùng, rút tiền đều phải có bằng chứng lịch sử rõ ràng (Ai đã làm? Lúc nào? Từ IP nào?).'
      ]
    },

    /* ---------- SECTION 05: TÍCH HỢP BẢO MẬT VÀO DEVBLOG ---------- */
    { kind: 'section', no: '05', title: 'Tích hợp Lá Chắn Bảo Vệ vào DevBlog', sub: 'Lắp ráp toàn bộ các tầng bảo mật vào kiến trúc Express chuẩn.' },
    {
      title: 'Kiến Trúc Phòng Thủ Chiều Sâu (Defense-in-Depth)', layout: 'split', ratio: '1.05fr .95fr',
      steps: [
        { h: '1. Network Boundary', p: 'Reverse Proxy (Nginx) chặn IP độc hại, cấu hình SSL/TLS HTTPS' },
        { h: '2. Express HTTP Layer', p: '`helmet()` gia cố headers, `corsOptions` chặn tên miền lạ, `globalLimiter` chống spam' },
        { h: '3. Routing Layer', p: '`validate(schema)` kiểm duyệt dữ liệu với Joi, loại bỏ Mass Assignment' },
        { h: '4. Identity & Access Layer', p: '`auth` kiểm tra Bearer token, `authorize` kiểm tra role, `checkOwnership` chống BOLA' },
        { h: '5. Business & Data Layer', p: 'Sequelize ORM với Prepared Statements chống 100% SQL Injection' },
        { h: '6. Centralized Error Handler', p: 'Ẩn stack trace ở Production, trả JSON lỗi RFC chuẩn mực' }
      ],
      img: { src: 'cia-triad.svg', cap: 'Mô hình 6 lớp phòng thủ chiều sâu bảo vệ hệ thống toàn diện', h: 420 }
    },
    {
      title: 'Tích Hợp Toàn Diện Vào File src/app.js', badge: 'LIVE CODING',
      code: { file: 'src/app.js', lang: 'javascript', size: 'xs', src: `const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const corsMiddleware = require('./config/cors');
const { globalLimiter } = require('./middlewares/rateLimit');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const app = express();

// 1. Gia cố Security Headers:
app.use(helmet());

// 2. Kiểm soát nguồn gọi CORS:
app.use(corsMiddleware);

// 3. Giới hạn tần suất gọi API (Rate Limit):
app.use('/api', globalLimiter);

// 4. Bóc tách JSON body với giới hạn dung lượng:
app.use(express.json({ limit: '10kb' })); // Chống payload quá khổ làm tràn RAM

// 5. Ghi log request:
app.use(morgan('combined'));

// 6. Gắn các routers:
app.use('/api/v1', routes);

// 7. Chốt chặn bắt lỗi:
app.use(notFound);
app.use(errorHandler);

module.exports = app;` }
    },
    {
      title: 'Kiểm tra nhanh kiến thức Buổi 10', badge: 'QUIZ',
      quiz: {
        q: 'Một lập trình viên xây dựng API cập nhật thông tin cá nhân: `PUT /api/v1/users/profile`. Để ngăn chặn triệt để kẻ xấu gửi lén trường `{ "role": "admin" }` trong body nhằm tự cấp quyền cho chính mình (Mass Assignment), giải pháp nào sau đây là chuẩn mực và an toàn nhất?',
        opts: [
          'Chỉ cần kiểm tra xem người dùng đã đăng nhập (có token JWT hợp lệ) hay chưa.',
          'Sử dụng Joi Schema với tùy chọn `{ stripUnknown: true }` và chỉ định rõ các trường được phép sửa (`name`, `bio`, `avatar`), loại bỏ hoàn toàn các trường lạ khỏi `req.body`.',
          'Mã hóa cơ sở dữ liệu MySQL bằng thuật toán AES-256.',
          'Tắt hoàn toàn phương thức HTTP PUT trên toàn bộ hệ thống.'
        ],
        a: 1,
        why: 'Đây là lỗi Mass Assignment kinh điển (API3 trong OWASP Top 10). Bằng cách sử dụng Joi Schema với tùy chọn `{ stripUnknown: true }`, bất kỳ trường nhạy cảm nào (`role`, `isVerified`, `balance`) không nằm trong danh mục cho phép sẽ bị gạt bỏ hoàn toàn trước khi dữ liệu được chuyển vào Controller và Database!'
      }
    }
  ],
  recap: [
    'Phân biệt rõ: **Authentication (401)** là xác thực danh tính; **Authorization (403)** là kiểm tra quyền hạn.',
    'Triển khai **RBAC** (`authorize`) kết hợp **Ownership Guard** (`checkPostOwnership`) để triệt tiêu hoàn toàn **lỗ hổng BOLA số 1 thế giới**.',
    'Kiểm duyệt dữ liệu đầu vào bằng **Joi Schema**; Luôn bật `{ stripUnknown: true }` để vô hiệu hóa **Mass Assignment**.',
    'Gia cố bảo mật mạng: Dùng **Helmet** thiết lập HTTP security headers, cấu hình **CORS Whitelist** và chặn brute-force bằng **Rate Limiting**.',
    'Áp dụng chiến lược **Phòng thủ chiều sâu (Defense-in-Depth)** và nằm lòng **OWASP API Security Top 10**.'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Thiết lập Helmet & Cấu hình CORS Whitelist',
      desc: 'Gia cố các lớp phòng thủ tầng mạng cơ bản cho ứng dụng Express.',
      tasks: [
        'Cài đặt thư viện: `npm install helmet cors`.',
        'Tích hợp `helmet()` vào middleware đầu tiên của `src/app.js`.',
        'Cấu hình CORS chỉ cho phép các domain: `http://localhost:3000` và `http://localhost:5173`.',
        'Dùng trình duyệt hoặc Postman kiểm tra: Xác nhận header `X-Powered-By` đã bị ẩn hoàn toàn.'
      ]
    },
    {
      level: 'core', time: 30, title: 'Viết Middleware Phân quyền authorize(...roles)',
      desc: 'Hiện thực hóa hệ thống phân quyền Role-Based Access Control.',
      tasks: [
        'Tạo middleware `src/middlewares/role.middleware.js`.',
        'Hàm `authorize(...roles)` kiểm tra `req.user.role` có nằm trong danh sách được phép không.',
        'Nếu không đủ quyền, trả về mã lỗi HTTP 403 Forbidden kèm thông báo rõ ràng.',
        'Tạo route thử nghiệm `GET /api/v1/admin/users` chỉ dành riêng cho vai trò `admin`.',
        'Thử đăng nhập bằng tài khoản role `user` gọi vào route này ➔ Xác nhận nhận đúng mã 403.'
      ]
    },
    {
      level: 'core', time: 30, title: 'Viết Middleware Kiểm tra Quyền sở hữu (chống BOLA)',
      desc: 'Bảo vệ bài viết chỉ cho phép chính tác giả hoặc Admin chỉnh sửa.',
      tasks: [
        'Tạo middleware `src/middlewares/ownership.middleware.js`.',
        'Tìm bài viết theo ID trên URL, kiểm tra `post.userId === req.user.id` hoặc `req.user.role === "admin"`.',
        'Nếu không khớp, ném lỗi 403: "Bạn không có quyền chỉnh sửa bài viết của tác giả khác".',
        'Gắn middleware vào các route `PUT /api/v1/posts/:id` và `DELETE /api/v1/posts/:id`.',
        'Dùng 2 tài khoản User A và User B trên Postman để chứng minh User B không thể sửa bài của User A.'
      ]
    },
    {
      level: 'core', time: 35, title: 'Xây dựng Bộ Kiểm duyệt Joi & Chống Mass Assignment',
      desc: 'Áp dụng Joi Schema làm sạch toàn bộ dữ liệu đầu vào.',
      tasks: [
        'Cài đặt `npm install joi`.',
        'Viết Schema kiểm duyệt cho tạo bài viết `createPostSchema` và cập nhật thông tin cá nhân `updateProfileSchema`.',
        'Viết middleware generic `validate(schema)` có bật `{ stripUnknown: true, abortEarly: false }`.',
        'Thử gửi request cập nhật cá nhân kèm trường `{ "role": "admin" }` ➔ Chứng minh trường này bị lọc bỏ hoàn toàn.'
      ]
    },
    {
      level: 'challenge', time: 40, title: 'Thiết lập Rate Limiting Chuyên biệt cho Endpoint Login',
      desc: 'Chống tấn công vét cạn mật khẩu và bảo vệ tài nguyên hệ thống.',
      tasks: [
        'Cài đặt `npm install express-rate-limit`.',
        'Tạo `globalLimiter`: Cho phép tối đa 100 request trong 15 phút cho toàn bộ API.',
        'Tạo `loginLimiter`: Chỉ cho phép tối đa 5 lần thử đăng nhập trong 15 phút.',
        'Gắn `loginLimiter` vào route `POST /api/v1/auth/login`.',
        'Viết script hoặc dùng Postman Runner bắn 6 request đăng nhập sai liên tiếp ➔ Chứng minh request thứ 6 bị chặn với mã 429 Too Many Requests.'
      ]
    },
    {
      level: 'homework', time: 40, title: 'Thực hiện Đánh giá Rà soát An ninh (Security Audit Checklist)',
      desc: 'Rà soát toàn bộ dự án theo tiêu chuẩn OWASP API Security Top 10.',
      tasks: [
        'Lập bảng kiểm kê an ninh trong file `docs/security-audit.md`.',
        'Kiểm tra từng tiêu chí: BOLA, Mass Assignment, Rate Limit, Helmet, CORS, Password Hashing.',
        'Đảm bảo không còn bất kỳ câu lệnh SQL nối chuỗi nào trong mã nguồn.',
        'Đảm bảo không có secret key hay mật khẩu nào bị hardcode trong code.'
      ]
    },
    {
      level: 'project', time: 45, title: 'Đồ án DevBlog Cột mốc 4b: Hoàn thiện Bảo mật Toàn diện',
      desc: 'Cột mốc hoàn thiện hệ thống Authorization và An ninh cho DevBlog API.',
      tasks: [
        'Tích hợp Helmet, CORS Whitelist, Rate Limiting vào `src/app.js`.',
        'Phân quyền RBAC đầy đủ: Role `admin` được duyệt bài, xóa mọi bài viết; Role `user` chỉ sửa bài của chính mình.',
        'Toàn bộ các routes tạo/sửa đều được kiểm duyệt qua Joi Schema với `stripUnknown: true`.',
        'Export Postman Collection hoàn chỉnh có các test cases kiểm tra 401 và 403.'
      ]
    }
  ],
  project: {
    lead: '**Cột mốc 4b**: DevBlog API đạt tiêu chuẩn an toàn an ninh công nghiệp, miễn nhiễm với các lỗ hổng OWASP Top 10.',
    tasks: [
      'Triển khai RBAC và Ownership check chống hoàn toàn lỗ hổng BOLA',
      'Kiểm duyệt dữ liệu đầu vào với Joi schema chặn đứng Mass Assignment',
      'Gia cố tầng mạng với Helmet, CORS và Rate Limiting chống Brute-force'
    ],
    callout: { type: 'tip', t: 'Buổi 11 chúng ta sẽ làm việc với **Upload tệp tin đa phương tiện (Multer, Sharp)** và xây dựng tính năng tìm kiếm, phân trang tối ưu cho Front-end!' }
  }
};
