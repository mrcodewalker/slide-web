/* ============================================================
   BUỔI 11 — Tính năng Thực tế & Tích hợp Front-end
   ============================================================ */
SESSION_DATA[11] = {
  intro: 'Buổi 11 đưa API vào đời sống ứng dụng thực tế: Xử lý multipart/form-data upload file ảnh với Multer, tối ưu ảnh với Sharp, làm chủ các chiến lược phân trang (Offset vs Cursor), gỡ rối triệt để cơ chế CORS & Preflight OPTIONS, và nối trực tiếp giao diện Front-end HTML/CSS/JS với hệ thống Back-end Express hoàn chỉnh.',
  agenda: [
    { min: 10, t: 'Ôn B10 & Bức tranh tích hợp toàn diện', d: 'Hai nửa của ứng dụng web gặp nhau' },
    { min: 35, t: 'Upload file với Multer & Xử lý ảnh với Sharp', d: 'Multipart/form-data, diskStorage, fileFilter, magic bytes, Sharp webp' },
    { min: 25, t: 'Phục vụ file tĩnh & Cloud Storage (S3/Cloudinary)', d: 'express.static, cấu trúc URL, CDN' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 35, t: 'Phân trang, Tìm kiếm & Sắp xếp chuyên sâu', d: 'Offset vs Cursor pagination, multi-sort whitelist' },
    { min: 35, t: 'Bản chất cơ chế CORS, SOP & Preflight OPTIONS', d: 'Simple request vs Preflight, gỡ rối 5 lỗi CORS kinh điển' },
    { min: 35, t: 'Live code: Nối Front-end Fetch API & FormData', d: 'Bearer token interceptor, DOM rendering, upload preview' },
    { min: 15, t: 'Tổng kết & giao bài tập B11', d: 'Đồ án DevBlog cột mốc 5' }
  ],
  slides: [
    /* ============================================================
       SECTION 01: UPLOAD FILE VỚI MULTER & ĐA PHƯƠNG TIỆN
       ============================================================ */
    { kind: 'section', no: '01', title: 'Upload File với Multer & Quản lý Đa Phương Tiện', sub: 'Bóc tách dữ liệu nhị phân multipart/form-data an toàn, tối ưu dung lượng ảnh.' },

    {
      title: 'Vì sao req.body không nhận được File Upload?', kicker: 'B11 · Section 01: File Upload',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Giới hạn của `express.json()`**:',
        '• Request thông thường truyền dữ liệu chuỗi ký tự dạng JSON: `Content-Type: application/json`.',
        '• Khi người dùng chọn upload file (ảnh, PDF, video), trình duyệt bắt buộc phải đóng gói dưới định dạng **`multipart/form-data`**.',
        '• Mỗi trường dữ liệu và tệp tin nhị phân được ngăn cách bởi một chuỗi phân cách ngẫu nhiên gọi là **Boundary**.',
        '• Middleware `express.json()` hay `express.urlencoded()` **hoàn toàn bất lực trước stream nhị phân multipart**!',
        '• **Multer** là thư viện middleware chuyên trách bóc tách từng phần dữ liệu multipart và lưu file an toàn.'
      ],
      img: { src: 'mdn-http-request.svg', cap: 'Cơ chế đóng gói HTTP Request dạng multipart/form-data qua các ranh giới Boundary (MDN)', h: 500 }
    },

    {
      title: 'Kiến Trúc Lưu Trữ Multer: MemoryStorage vs DiskStorage', kicker: 'B11 · Section 01: File Upload',
      layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '1. MemoryStorage (Lưu vào RAM)', code: { lang: 'javascript', size: 'xs', src: `const storage = multer.memoryStorage();
const upload = multer({ storage });

// File được lưu dưới dạng Buffer trong RAM:
// req.file.buffer (Node.js Buffer)

// 👍 Ưu điểm: Tốc độ xử lý siêu nhanh.
// ⚠️ Cảnh báo: Tốn RAM! Nếu 100 người cùng upload file 10MB cùng lúc, server sẽ hết sạch RAM và crash văng tiến trình!` } },
        { h: '2. DiskStorage (Ghi trực tiếp xuống Ổ đĩa)', code: { lang: 'javascript', size: 'xs', src: `const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, \`\${file.fieldname}-\${Date.now()}\${ext}\`);
  }
});

// 👍 Ưu điểm: Cực kỳ ổn định, an toàn bộ nhớ.
// Chuẩn mực cho hệ thống lưu trữ file cục bộ!` } }
      ],
      callout: { type: 'tip', t: 'Quy tắc vàng: **Tuyệt đối không bao giờ lưu trực tiếp dữ liệu nhị phân của ảnh vào database (dạng BLOB)**! Hãy lưu file trên ổ đĩa / cloud storage và chỉ lưu **chuỗi đường dẫn URL (vd: `/uploads/avatar.webp`)** vào database.' }
    },

    {
      title: 'Cấu Hình Multer DiskStorage An Toàn Tuyệt Đối', badge: 'LIVE CODING',
      term: `$ npm install multer`,
      code: { file: 'src/middlewares/upload.middleware.js', lang: 'javascript', size: 'xs', src: `const multer = require('multer');
const path = require('path');
const { randomUUID } = require('crypto');
const AppError = require('../utils/AppError');

// 1. Cấu hình vị trí thư mục và thuật toán đặt tên file độc nhất:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    // Luôn sinh tên ngẫu nhiên UUID để chống ghi đè và tránh lộ tên gốc:
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueFileName = \`\${file.fieldname}-\${Date.now()}-\${randomUUID()}\${ext}\`;
    cb(null, uniqueFileName);
  }
});

// 2. Bộ lọc kiểm tra định dạng MIME hợp lệ:
const fileFilter = (req, file, cb) => {
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Định dạng file không hỗ trợ! Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP', 400), false);
  }
};

// 3. Thiết lập chốt chặn dung lượng tối đa 2MB:
module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});` }
    },

    {
      title: 'Xử Lý Nhiều File Cùng Lúc: upload.array() & upload.fields()', kicker: 'B11 · Section 01: File Upload',
      layout: 'split', ratio: '1.1fr .9fr',
      bullets: [
        '**3 Phương thức bóc tách file linh hoạt của Multer**:',
        '1. **`upload.single(\'avatar\')`**: Tiếp nhận duy nhất 1 file từ trường `avatar`. File kết quả gán vào **`req.file`**.',
        '2. **`upload.array(\'photos\', 5)`**: Tiếp nhận tối đa 5 file cùng từ 1 trường `photos`. Mảng kết quả gán vào **`req.files`**.',
        '3. **`upload.fields([\n    { name: \'avatar\', maxCount: 1 },\n    { name: \'gallery\', maxCount: 10 }\n  ])`**: Tiếp nhận đồng thời nhiều trường file khác nhau trong cùng 1 form.',
        '• Cực kỳ hữu ích cho trang đăng tin bất động sản, bài viết có ảnh đại diện kèm bộ sưu tập ảnh đính kèm.'
      ],
      img: { src: 'multipart-upload.svg', cap: 'Kiến trúc bóc tách luồng dữ liệu Multipart/form-data trong Multer Express', h: 360 }
    },

    {
      title: 'Kiểm Tra Magic Bytes Chống Giả Mạo Định Dạng File', kicker: 'B11 · Section 01: File Upload',
      layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**Hiểm họa vượt qua bộ lọc bằng đổi đuôi file**:',
        '• Hacker đổi tên một file mã độc thực thi `virus.exe` hoặc script `shell.php` thành `photo.jpg`.',
        '• Nếu server chỉ kiểm tra đuôi mở rộng `.jpg` hoặc header `file.mimetype` do client gửi lên (dễ dàng làm giả), file mã độc sẽ chui lọt vào hệ thống!',
        '**Kỹ thuật kiểm tra Magic Bytes (File Signatures)**:',
        '• Mỗi định dạng file thực sự luôn bắt đầu bằng các byte nhị phân đặc thù ở đầu tập tin:',
        '• **JPEG**: Bắt đầu bằng byte `FF D8 FF`.',
        '• **PNG**: Bắt đầu bằng byte `89 50 4E 47`.',
        '• Dùng thư viện `file-type` để đọc trực tiếp các byte đầu của file trước khi chấp nhận lưu trữ.'
      ],
      img: { src: 'magic-bytes-inspection.svg', cap: 'Kiểm tra chữ ký nhị phân Magic Bytes chống mã độc giả mạo đuôi file', h: 360 }
    },

    {
      title: 'Nén và Tối Ưu Hóa Kích Thước Ảnh Tự Động với Sharp', badge: 'LIVE CODING',
      term: `$ npm install sharp`,
      code: { file: 'src/middlewares/resizeImage.js', lang: 'javascript', size: 'xs', src: `const sharp = require('sharp');
const path = require('path');

// Middleware nén ảnh sau khi Multer lưu file tạm vào RAM:
exports.resizeAndConvertToWebp = async (req, res, next) => {
  if (!req.file) return next();

  const filename = \`post-\${Date.now()}-\${Math.round(Math.random() * 1E9)}.webp\`;
  const outputPath = path.join(__dirname, '../../public/uploads', filename);

  // Dùng Sharp resize về chuẩn full-HD, nén chất lượng 80% WebP:
  await sharp(req.file.buffer)
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .toFormat('webp')
    .webp({ quality: 80 })
    .toFile(outputPath);

  // Gán đường dẫn URL kết quả vào req để controller lưu DB:
  req.fileUrl = \`/uploads/\${filename}\`;
  next();
};` },
      callout: { type: 'tip', t: 'Sharp được viết bằng C++ (thư viện libvips) nhanh gấp 5 lần ImageMagick, giúp nén ảnh trong vài mili-giây mà không làm nghẽn Event Loop của Node.js.' }
    },

    {
      title: 'Dọn Dẹp File Rác & File Mồ Côi Khi Cập Nhật (Orphaned Files)', kicker: 'B11 · Section 01: File Upload',
      layout: 'split', ratio: '1.1fr .9fr',
      bullets: [
        '**Vấn đề File Mồ Côi (Orphaned Files)**:',
        '• Khi người dùng đổi ảnh đại diện 10 lần, nếu server chỉ ghi đè đường dẫn trong DB mà không xóa file cũ trên ổ đĩa, 9 file ảnh cũ sẽ tồn tại mãi mãi làm tràn ổ cứng!',
        '• Tương tự, nếu quá trình ghi DB bị lỗi giữa chừng, file vừa upload phải được dọn dẹp ngay.',
        '**Giải pháp bằng `fs.unlink()`**:',
        '• Lấy đường dẫn ảnh cũ từ DB trước khi cập nhật.',
        '• Dùng `await fs.unlink(oldFilePath)` để giải phóng dung lượng đĩa an toàn.',
        '• Bọc trong khối try/catch phòng trường hợp file cũ đã bị xóa trước đó.'
      ],
      img: { src: 'clean-architecture.svg', cap: 'Quy trình dọn dẹp file cũ giữ cho dung lượng máy chủ luôn sạch sẽ', h: 280 }
    },

    /* ============================================================
       SECTION 02: PHỤC VỤ FILE TĨNH & CLOUD STORAGE
       ============================================================ */
    { kind: 'section', no: '02', title: 'Phục Vụ File Tĩnh & Kiến Trúc Cloud Storage', sub: 'Phân phối tài nguyên tĩnh tốc độ cao với HTTP Caching và dịch vụ lưu trữ đám mây.' },

    {
      title: 'Phục Vụ Tệp Tin Tĩnh An Toàn với express.static', kicker: 'B11 · Section 02: Static Files',
      layout: 'split', ratio: '1.1fr .9fr',
      code: { file: 'src/app.js', lang: 'javascript', size: 'sm', src: `const path = require('path');

// Mở thư mục public/uploads thành các đường dẫn tĩnh:
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../public/uploads'), {
    maxAge: '7d', // Hướng dẫn trình duyệt cache ảnh trong 7 ngày
    etag: true,
    immutable: true
  })
);` },
      bullets: [
        '**Quy chuẩn truy cập file từ Front-end**:',
        '• Khi file lưu tại: `c:/Users/.../public/uploads/cover-123.webp`.',
        '• Trình duyệt truy cập qua URL: `http://localhost:3000/uploads/cover-123.webp`.',
        '• Tiêu đề HTTP Cache `maxAge: 7d` giúp trình duyệt tải ảnh về lưu đệm cục bộ, không cần tải lại ở những lần truy cập sau.'
      ]
    },

    {
      title: 'Lưu Trữ Đám Mây: Cloud Storage (AWS S3 / Cloudinary)', kicker: 'B11 · Section 02: Static Files',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Vì sao hệ thống thực tế chuyển dịch sang Cloud Storage?**',
        '• **Hạn chế của lưu ổ đĩa cục bộ (Local Disk)**: Khi chạy cụm 5 server đằng sau Load Balancer, người dùng upload ảnh lên Server 1 thì Server 2 và 3 sẽ không có file đó!',
        '• Khi deploy qua Docker container, container restart sẽ xóa sạch các file mới upload (Stateless Container).',
        '**Giải pháp lưu trữ đám mây tập trung**:',
        '• **AWS S3 / Google Cloud Storage / Cloudinary**: Lưu trữ phi máy chủ, dung lượng không giới hạn, độ bền 99.999999999%.',
        '• Tự động tích hợp mạng phân phối nội dung toàn cầu (CDN) giúp tải ảnh cực nhanh từ bất kỳ quốc gia nào trên thế giới.'
      ],
      img: { src: 'reverse-proxy.svg', cap: 'Mô hình chuyển tiếp file từ Express lên cụm Cloud Storage và CDN (Wikipedia)', h: 500 }
    },

    {
      title: 'Presigned URL: Upload Trực Tiếp Lên S3 Giảm Tải Máy Chủ', kicker: 'B11 · Section 02: Static Files',
      layout: 'split', ratio: '1.1fr .9fr',
      bullets: [
        '**Nút thắt cổ chai khi upload qua Back-end Server**:',
        '• Nếu 1000 người cùng upload video/ảnh 50MB qua server Node.js, băng thông mạng (Network I/O) và CPU của server sẽ bị quá tải hoàn toàn.',
        '**Mô hình Presigned URL chuẩn công nghiệp**:',
        '1. Client gửi request: "Cho tôi xin link upload ảnh `avatar.png` dung lượng 2MB".',
        '2. Node.js Server tạo một **Presigned URL** có chữ ký mã hóa từ AWS S3 (hạn dùng 5 phút) rồi trả về cho Client.',
        '3. Trình duyệt gửi trực tiếp file lên AWS S3 qua Presigned URL đó. **Back-end Server không tốn 1 byte RAM hay băng thông nào**!'
      ],
      img: { src: 's3-presigned-flow.svg', cap: 'Mô hình Presigned URL: Client upload trực tiếp lên đám mây AWS S3 / Cloudflare R2', h: 360 }
    },

    /* ============================================================
       SECTION 03: PHÂN TRANG, TÌM KIẾM & SẮP XẾP CHUYÊN SÂU
       ============================================================ */
    { kind: 'section', no: '03', title: 'Phân trang, Tìm kiếm & Sắp xếp Nâng cao', sub: 'Tối ưu hóa hiệu năng và trải nghiệm người dùng khi dữ liệu lên tới hàng chục ngàn bài viết.' },

    {
      title: 'Thiết Kế Chuẩn Hợp Đồng Phân Trang RESTful', kicker: 'B11 · Section 03: Pagination & Search',
      layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '📥 Tham số đầu vào (Query String)', bullets: [
          '• `?page=2`: Chỉ số trang hiện tại muốn xem (mặc định là 1).',
          '• `?limit=10`: Số lượng bản ghi tối đa trên một trang (mặc định 10, cận trên 50).',
          '• `?search=nodejs`: Từ khóa tìm kiếm tương đối theo tiêu đề.',
          '• `?sort=-createdAt`: Sắp xếp (dấu `-` thể hiện giảm dần DESC, không dấu thể hiện tăng dần ASC).'
        ] },
        { h: '📤 Cấu trúc Envelope phản hồi chuẩn', cls: 'good', bullets: [
          '• `data`: Mảng danh sách các bản ghi của trang hiện tại.',
          '• `meta.page`: Trang hiện tại.',
          '• `meta.limit`: Số bản ghi mỗi trang.',
          '• `meta.total`: Tổng số bản ghi thỏa mãn điều kiện lọc trong database.',
          '• `meta.totalPages`: Tổng số trang (`Math.ceil(total / limit)`).'
        ] }
      ],
      callout: { type: 'tip', t: 'Không bao giờ để client gửi `?limit=100000` làm cạn kiệt bộ nhớ máy chủ! Luôn khống chế: `const safeLimit = Math.min(50, Math.max(1, limit));`' }
    },

    {
      title: 'Offset-based vs Cursor-based Pagination', kicker: 'B11 · Section 03: Pagination & Search',
      layout: 'split', ratio: '1.05fr .95fr',
      table: {
        head: ['Tiêu chí so sánh', 'Offset Pagination (LIMIT / OFFSET)', 'Cursor Pagination (Keyset Token)'],
        rows: [
          ['Cách truy vấn', '`LIMIT 10 OFFSET 200000`', '`WHERE id > 200000 LIMIT 10`'],
          ['Tốc độ với dữ liệu lớn', 'Chậm dần khi offset lớn (phải quét qua bản ghi trước)', 'Cực nhanh và ổn định ở mọi vị trí ($O(1)$ qua B-Tree)'],
          ['Chuyển trang trực tiếp', 'Dễ dàng: Bấm nhảy sang trang 1, 2, 10', 'Khó: Chỉ có thể bấm "Tiếp theo" hoặc "Trước đó"'],
          ['Xê dịch dữ liệu', 'Bị trùng hoặc sót bản ghi khi có người vừa đăng bài mới', 'Hoàn toàn không bị lệch dữ liệu'],
          ['Ứng dụng thực tế', 'Trang bảng quản trị Dashboard, danh mục sản phẩm', 'Bảng tin Facebook, Twitter, TikTok (Infinite Scroll)']
        ]
      }
    },

    {
      title: 'Sắp Xếp Đa Trường An Toàn với Whitelist', badge: 'LIVE CODING',
      code: { lang: 'javascript', size: 'xs', src: `// Client gửi: ?sort=-createdAt,title
exports.parseSortParams = (sortQuery) => {
  // 1. Danh sách trắng các cột ĐƯỢC PHÉP sắp xếp:
  const ALLOWED_COLUMNS = ['createdAt', 'title', 'viewCount'];
  const orderClauses = [];

  if (!sortQuery) return [['createdAt', 'DESC']];

  const fields = sortQuery.split(',');
  for (const field of fields) {
    const isDesc = field.startsWith('-');
    const cleanField = field.replace(/^[-+]/, '');

    if (ALLOWED_COLUMNS.includes(cleanField)) {
      orderClauses.push([cleanField, isDesc ? 'DESC' : 'ASC']);
    }
  }

  return orderClauses.length ? orderClauses : [['createdAt', 'DESC']];
};` },
      callout: { type: 'tip', t: 'Whitelist sắp xếp triệt tiêu hoàn toàn nguy cơ SQL Injection qua tham số sort, đồng thời ngăn ngừa người dùng vô tình sắp xếp theo cột không có index gây treo database.' }
    },

    {
      title: 'Tìm Kiếm Nâng Cao: MySQL Full-Text Search vs LIKE %...%', kicker: 'B11 · Section 03: Pagination & Search',
      layout: 'split', ratio: '1.1fr .9fr',
      bullets: [
        '**Hiểm họa của `WHERE title LIKE \'%keyword%\'`**:',
        '• Ký tự `%` ở đầu bắt buộc MySQL phải quét toàn bộ bảng (Full Table Scan). Khi bảng có 1 triệu bài viết, câu truy vấn mất 3-5 giây!',
        '**Giải pháp Full-Text Index (MATCH...AGAINST)**:',
        '• Tạo index toàn văn: `ALTER TABLE posts ADD FULLTEXT(title, content);`',
        '• Cú pháp truy vấn: `WHERE MATCH(title, content) AGAINST(:keyword IN BOOLEAN MODE)`',
        '• MySQL sử dụng bảng chỉ mục đảo (Inverted Index) chạy trong vài mili-giây, hỗ trợ tìm kiếm theo độ liên quan (Relevance Score)!'
      ],
      img: { src: 'btree-index.svg', cap: 'Inverted Index trong Full-Text Search nhanh hơn Full Table Scan gấp 100 lần', h: 300 }
    },

    {
      title: 'Bộ Lọc Đa Điều Kiện: Lọc Theo Danh Mục & Khoảng Thời Gian', badge: 'LIVE CODING',
      code: { file: 'src/services/post.service.js', lang: 'javascript', size: 'xs', src: `const { Op } = require('sequelize');

exports.buildFilterQuery = (query) => {
  const where = { status: 'published' }; // Chỉ lấy bài đã xuất bản

  // Lọc theo danh mục:
  if (query.category_id) {
    where.category_id = query.category_id;
  }

  // Lọc theo khoảng thời gian đăng bài (from ... to):
  if (query.fromDate || query.toDate) {
    where.createdAt = {};
    if (query.fromDate) where.createdAt[Op.gte] = new Date(query.fromDate);
    if (query.toDate) where.createdAt[Op.lte] = new Date(query.toDate);
  }

  // Tìm kiếm tương đối:
  if (query.search) {
    where.title = { [Op.like]: \`%\${query.search}%\` };
  }

  return where;
};` }
    },

    {
      title: 'Tối Ưu Đếm Tổng COUNT(*) Trên Bảng Hàng Triệu Dòng', kicker: 'B11 · Section 03: Pagination & Search',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Chi phí đắt đỏ của `SELECT COUNT(*)`**:',
        '• Với cơ chế MVCC của InnoDB trong MySQL, câu lệnh `COUNT(*)` phải duyệt qua các khóa index để kiểm tra tính hiển thị của từng dòng dữ liệu.',
        '• Khi bảng có 10 triệu dòng, việc tính toán `total` và `totalPages` cho mỗi request có thể làm sập database!',
        '**Các chiến lược tối ưu chuẩn công nghiệp**:',
        '1. **Sequelize `findAndCountAll({ distinct: true })`**: Gộp truy vấn lấy dữ liệu và đếm dòng trong 1 lượt.',
        '2. **Cache giá trị COUNT vào Redis**: Chỉ cập nhật lại số đếm sau mỗi 5 phút hoặc khi có bài viết mới được thêm/xóa.',
        '3. **Approximate Count (Ước lượng số lượng)**: Đọc trường `TABLE_ROWS` trong bảng metadata `information_schema.tables` với chi phí 0 mili-giây.'
      ],
      img: { src: 'btree-index.svg', cap: 'Chiến lược tối ưu hóa chi phí đếm tổng bản ghi trong hệ thống lớn', h: 280 }
    },

    /* ============================================================
       SECTION 04: BẢN CHẤT CORS & GỠ RỐI THỰC TẾ
       ============================================================ */
    { kind: 'section', no: '04', title: 'Bản chất CORS, Preflight Request & Gỡ rối Lỗi', sub: 'Giải quyết triệt để rào cản nguồn gốc chéo Same-Origin Policy giữa Front-end và Back-end.' },

    {
      title: 'Bản Chất Cơ Chế CORS (Cross-Origin Resource Sharing)', kicker: 'B11 · Section 04: CORS & SOP',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Định nghĩa Origin (Nguồn gốc)**: Là bộ ba gồm `(Giao thức, Tên miền, Cổng mạng)`:',
        '• `http://localhost:5500` và `http://localhost:3000` là **2 Origin khác nhau** (khác Cổng mạng Port!).',
        '• `http://devblog.vn` và `https://devblog.vn` là **khác Origin** (khác Protocol).',
        '• `https://devblog.vn` và `https://api.devblog.vn` là **khác Origin** (khác Subdomain).',
        '**Same-Origin Policy (Chính sách cùng nguồn)**: Cơ chế an ninh sống còn tích hợp sẵn trong trình duyệt:',
        '• Trình duyệt mặc định chặn không cho mã JavaScript của trang A đọc dữ liệu riêng tư từ trang B.',
        '• **CORS là cơ chế nới lỏng an toàn**: Cho phép Server chỉ định rõ những trang web nào được phép gọi tới mình!'
      ],
      img: { src: 'mdn-cors-overview.svg', cap: 'Cơ chế kiểm tra nguồn gốc chéo CORS giữa Web Browser và Server', h: 360 }
    },

    {
      title: 'Yêu Cầu Đơn Giản (Simple) vs Yêu Cầu Preflight (OPTIONS)', kicker: 'B11 · Section 04: CORS & SOP',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**1. Yêu cầu đơn giản (Simple Request)**:',
        '• Dùng method `GET`, `HEAD` hoặc `POST`.',
        '• Chỉ chứa các header chuẩn: `Accept`, `Content-Type: text/plain`, `multipart/form-data`, `application/x-www-form-urlencoded`.',
        '• Trình duyệt gửi trực tiếp request đi ngay mà không cần hỏi trước.',
        '**2. Yêu cầu phức tạp cần Preflight (Preflighted Request)**:',
        '• Sử dụng method: `PUT`, `PATCH`, `DELETE`.',
        '• Hoặc có gửi header tự chế / bảo mật: `Authorization: Bearer <token>`, `X-Request-Id`.',
        '• Hoặc `Content-Type: application/json`!',
        '• **Trình duyệt tự động gửi một request thăm dò `OPTIONS` trước** để hỏi server có đồng ý không rồi mới gửi request thật!'
      ],
      img: { src: 'mdn-cors-preflight.svg', cap: 'Quy trình kiểm tra Preflight OPTIONS hai bước trước khi gửi dữ liệu thật', h: 360 }
    },

    {
      title: '5 Nguyên Nhân Gây Lỗi CORS Kinh Điển & Cách Khắc Phục', kicker: 'B11 · Section 04: CORS & SOP',
      table: {
        head: ['Nguyên nhân gây lỗi CORS', 'Hiện tượng báo lỗi trên Console trình duyệt', 'Giải pháp khắc phục triệt để'],
        rows: [
          ['1. Thiếu header Access-Control', '\`No \'Access-Control-Allow-Origin\' header is present\`', 'Cài package `cors` và kích hoạt `app.use(cors())` trước mọi routes.'],
          ['2. Tên miền gọi không có trong Whitelist', '\`The \'Access-Control-Allow-Origin\' header has a value that is not equal\`', 'Thêm port/domain của Front-end (vd: `http://localhost:5173`) vào mảng whitelist.'],
          ['3. Gửi Bearer token nhưng chưa mở Header', '\`Request header field authorization is not allowed by Access-Control-Allow-Headers\`', 'Cấu hình `allowedHeaders: [\'Content-Type\', \'Authorization\']`.'],
          ['4. Thiếu method PUT/DELETE', '\`Method PUT is not allowed by Access-Control-Allow-Methods\`', 'Cấu hình `methods: [\'GET\', \'POST\', \'PUT\', \'PATCH\', \'DELETE\', \'OPTIONS\']`.'],
          ['5. Server bị crash lỗi 500 trước khi kịp trả header CORS', '\`CORS error\` xuất hiện đồng thời cùng \`500 Internal Error\`', 'Fix bug crash trong route handler; đảm bảo Error Middleware vẫn có header CORS.']
        ]
      }
    },

    {
      title: 'Vì Sao Postman Không Bị CORS Nhưng Trình Duyệt Lại Bị?', kicker: 'B11 · Section 04: CORS & SOP',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Câu hỏi phỏng vấn kinh điển**:',
        '• *"Tại sao em test API trên Postman thì chạy ầm ầm, nhưng khi viết code fetch() trong React hay HTML thì console đỏ rực lỗi CORS?"*',
        '**Bản chất câu trả lời**:',
        '• **Lỗi CORS là do TRÌNH DUYỆT CHẶN, HOÀN TOÀN KHÔNG PHẢI DO SERVER CHẶN**!',
        '• Postman, Curl, Mobile App là các phần mềm ứng dụng độc lập — chúng **không phải là Trình duyệt Web** nên không có chính sách bảo mật Same-Origin Policy.',
        '• Trình duyệt chặn để bảo vệ người dùng không bị mã script độc hại âm thầm gửi request đánh cắp tài khoản.'
      ],
      img: { src: 'mdn-cors-overview.svg', cap: 'Trình duyệt là chốt chặn thực thi chính sách Same-Origin Policy', h: 320 }
    },

    {
      title: 'Cấu Hình CORS Động Cho Hệ Thống Đa Domain & Cookie Credentials', badge: 'LIVE CODING',
      code: { file: 'src/config/cors.js', lang: 'javascript', size: 'xs', src: `const cors = require('cors');

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5500',
  'https://devblog.vn'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Cho phép các công cụ không có origin (như Postman, mobile app) hoặc domain nằm trong whitelist:
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Chính sách CORS không cho phép truy cập từ nguồn gốc này!'));
    }
  },
  credentials: true, // Cho phép truyền Cookie HttpOnly giữa các domain
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // Yêu cầu trình duyệt lưu cache kết quả Preflight trong 24 giờ
};

module.exports = cors(corsOptions);` }
    },

    /* ============================================================
       SECTION 05: NỐI FRONT-END: FETCH API & FORMDATA
       ============================================================ */
    { kind: 'section', no: '05', title: 'Nối Front-End: Fetch API, FormData & Trạng Thái', sub: 'Hiện thực hóa mã nguồn JavaScript thuần kết nối mượt mà với hệ thống REST API Back-end.' },

    {
      title: 'Xây Dựng Module Gọi API apiRequest() Phía Front-End', badge: 'FRONT-END CODE',
      code: { file: 'public/js/api.js', lang: 'javascript', size: 'xs', src: `const API_BASE = 'http://localhost:3000/api/v1';

// Hàm wrapper fetch tiện lợi tái sử dụng toàn bộ ứng dụng:
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('access_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': \`Bearer \${token}\` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(\`\${API_BASE}\${endpoint}\`, { ...options, headers });

    // Tự động xử lý khi Token hết hạn:
    if (res.status === 401) {
      localStorage.removeItem('access_token');
      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      window.location.href = '/login.html';
      return;
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'Đã có lỗi xảy ra');
    }
    return data;
  } catch (err) {
    console.error('API Error:', err.message);
    throw err;
  }
}` }
    },

    {
      title: 'Xử Lý Upload File với Đối Tượng FormData', badge: 'FRONT-END CODE', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'public/js/upload.js', lang: 'javascript', size: 'xs', src: `// Khi người dùng submit form upload ảnh bài viết:
const form = document.getElementById('postForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('titleInput').value);
  formData.append('content', document.getElementById('contentInput').value);
  
  // Lấy file từ thẻ <input type="file" id="coverFileInput">:
  const fileInput = document.getElementById('coverFileInput');
  if (fileInput.files[0]) {
    formData.append('coverImage', fileInput.files[0]);
  }

  const token = localStorage.getItem('access_token');

  // ⚠️ LƯU Ý SỐNG CÒN KHI DÙNG FETCH + FORMDATA:
  // TUYỆT ĐỐI KHÔNG SET 'Content-Type': 'multipart/form-data'!
  // Hãy để trình duyệt tự động thiết lập kèm boundary ngẫu nhiên:
  const res = await fetch('http://localhost:3000/api/v1/posts', {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${token}\`
      // Không ghi Content-Type ở đây!
    },
    body: formData
  });

  const result = await res.json();
  if (result.success) alert('Đăng bài viết kèm ảnh thành công!');
});` },
      bullets: [
        '**Lưu ý quan trọng nhất khi upload bằng Fetch**:',
        '• Khi truyền `body: formData`, trình duyệt tự động sinh ra header: `Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...`.',
        '• Nếu lập trình viên set cứng `Content-Type: multipart/form-data`, chuỗi boundary sẽ bị thiếu và Multer sẽ báo lỗi không đọc được dữ liệu!'
      ]
    },

    {
      title: 'Xem Trước Ảnh Tức Thời Trước Khi Upload (Instant Preview)', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'public/js/preview.js', lang: 'javascript', size: 'sm', src: `const fileInput = document.getElementById('coverInput');
const previewImg = document.getElementById('previewImage');

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Dùng URL.createObjectURL để tạo URL ảo trực tiếp từ RAM trình duyệt:
  const blobUrl = URL.createObjectURL(file);
  previewImg.src = blobUrl;
  previewImg.style.display = 'block';

  // Giải phóng bộ nhớ sau khi ảnh tải xong:
  previewImg.onload = () => URL.revokeObjectURL(blobUrl);
});` },
      bullets: [
        '**Trải nghiệm người dùng cao cấp**:',
        '• Người dùng nhìn thấy ảnh hiển thị ngay tức khắc trên màn hình ngay khi vừa chọn file từ máy tính mà không cần phải chờ upload lên server trước!',
        '• Giảm thiểu tối đa tình trạng người dùng chọn nhầm ảnh.'
      ]
    },

    {
      title: 'Thanh Tiến Trình Upload (Progress Bar) Với XMLHttpRequest', badge: 'FRONT-END CODE',
      code: { file: 'public/js/progress.js', lang: 'javascript', size: 'xs', src: `function uploadWithProgress(url, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    const token = localStorage.getItem('access_token');
    if (token) xhr.setRequestHeader('Authorization', \`Bearer \${token}\`);

    // Lắng nghe sự kiện tiến trình truyền tải dữ liệu của Upload Stream:
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete); // Cập nhật width thanh % trong DOM
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(\`Upload thất bại: \${xhr.statusText}\`));
      }
    };

    xhr.onerror = () => reject(new Error('Lỗi kết nối mạng khi upload'));
    xhr.send(formData);
  });
}` }
    },

    {
      title: 'Render Danh Sách Bài Viết Động & Phân Trang', badge: 'FRONT-END CODE',
      code: { file: 'public/js/posts.js', lang: 'javascript', size: 'xs', src: `async function loadPosts(page = 1) {
  const container = document.getElementById('postsContainer');
  container.innerHTML = '<div class="spinner">Đang tải dữ liệu...</div>';

  try {
    const response = await apiRequest(\`/posts?page=\${page}&limit=6\`);
    const posts = response.data;
    const meta = response.meta;

    // 1. Vẽ danh sách bài viết:
    container.innerHTML = posts.map(post => \`
      <article class="post-card">
        \${post.coverUrl ? \`<img src="http://localhost:3000\${post.coverUrl}" alt="\${post.title}">\` : ''}
        <h3>\${post.title}</h3>
        <p>\${post.content.slice(0, 120)}...</p>
        <span class="author">Tác giả: \${post.author?.name || 'Ẩn danh'}</span>
      </article>
    \`).join('');

    // 2. Vẽ nút chuyển trang [Trước] [Trang 2/5] [Sau]:
    renderPagination(meta);
  } catch (err) {
    container.innerHTML = \`<div class="error">Lỗi nạp bài viết: \${err.message}</div>\`;
  }
}` }
    },

    /* ============================================================
       SECTION 06: TÍCH HỢP HOÀN CHỈNH VÀO ĐỒ ÁN DEVBLOG
       ============================================================ */
    { kind: 'section', no: '06', title: 'Tích hợp Hoàn chỉnh vào Đồ án DevBlog', sub: 'Hoàn thiện toàn bộ các tính năng Upload, Tìm kiếm, Phân trang và kiểm thử tự động.' },

    {
      title: 'Tuyến Đường Upload Ảnh Bìa Bài Viết: post.routes.js', badge: 'LIVE CODING',
      code: { file: 'src/routes/post.routes.js', lang: 'javascript', size: 'xs', src: `const upload = require('../middlewares/upload.middleware');
const auth = require('../middlewares/auth.middleware');
const { checkPostOwnership } = require('../middlewares/ownership.middleware');

// Upload ảnh bìa cho bài viết (Chỉ tác giả mới được upload):
router.post('/:id/cover',
  auth,
  checkPostOwnership,
  upload.single('coverImage'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError('Vui lòng chọn tệp tin ảnh để upload', 400);
    }

    const coverUrl = \`/uploads/\${req.file.filename}\`;
    
    // Cập nhật đường dẫn ảnh vào database:
    req.targetPost.coverUrl = coverUrl;
    await req.targetPost.save();

    res.status(200).json({
      success: true,
      message: 'Upload ảnh bìa bài viết thành công',
      data: { coverUrl }
    });
  })
);` }
    },

    {
      title: 'Tích Hợp Phân Trang, Tìm Kiếm & Lọc Trong PostService', badge: 'LIVE CODING',
      code: { file: 'src/services/post.service.js', lang: 'javascript', size: 'xs', src: `const { Post, User, Category } = require('../models');

exports.getPaginatedPosts = async ({ page = 1, limit = 10, search, sort = '-createdAt' }) => {
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit)));
  const offset = (parseInt(page) - 1) * safeLimit;

  const whereClause = {};
  if (search) {
    whereClause.title = { [Op.like]: \`%\${search}%\` };
  }

  const { rows, count } = await Post.findAndCountAll({
    where: whereClause,
    limit: safeLimit,
    offset,
    order: parseSortParams(sort),
    include: [
      { model: User, as: 'author', attributes: ['id', 'name', 'avatar'] },
      { model: Category, as: 'category', attributes: ['id', 'name'] }
    ]
  });

  return {
    posts: rows,
    meta: {
      page: parseInt(page),
      limit: safeLimit,
      total: count,
      totalPages: Math.ceil(count / safeLimit)
    }
  };
};` }
    },

    {
      title: 'Kiểm Thử Toàn Diện Upload File Bằng Postman', kicker: 'B11 · Section 06: DevBlog Integration',
      layout: 'split', ratio: '1.05fr .95fr',
      steps: [
        { h: '1. Tạo Request POST', p: 'Nhập URL: `{{baseUrl}}/posts/1/cover`' },
        { h: '2. Cấu hình Body', p: 'Chọn tab **Body** ➔ Chọn kiểu **form-data**' },
        { h: '3. Chọn Kiểu File', p: 'Tại cột KEY, gõ `coverImage` ➔ Đổi dropdown từ Text sang **File**' },
        { h: '4. Đính kèm File', p: 'Tại cột VALUE, bấm nút "Select Files" và chọn một file ảnh JPG/PNG từ máy tính' },
        { h: '5. Đính kèm Token', p: 'Chọn tab Authorization ➔ Bearer Token: `{{jwt_token}}`' },
        { h: '6. Bấm Send & Xác nhận', p: 'Nhận response 200 OK chứa đường dẫn `/uploads/...`' }
      ],
      img: { src: 'postman-icon.svg', cap: 'Quy trình kiểm thử upload tệp tin multipart/form-data trong Postman', h: 300 }
    },

    {
      title: 'Kiểm tra nhanh kiến thức Buổi 11', badge: 'QUIZ',
      quiz: {
        q: 'Khi gửi một request từ Front-end (React/Fetch) chứa file ảnh và dữ liệu form dạng `FormData` sang server Node.js Express có sử dụng Multer, lập trình viên nên thiết lập header `Content-Type` như thế nào?',
        opts: [
          'Bắt buộc phải ghi rõ: `headers: { \'Content-Type\': \'application/json\' }`',
          'Bắt buộc phải ghi rõ: `headers: { \'Content-Type\': \'multipart/form-data\' }`',
          'TUYỆT ĐỐI KHÔNG thiết lập header Content-Type; hãy để trình duyệt tự động sinh kèm chuỗi boundary phân cách hợp lệ',
          'Thiết lập: `headers: { \'Content-Type\': \'image/jpeg\' }`'
        ],
        a: 2,
        why: 'Khi truyền đối tượng `FormData` vào `fetch(url, { body: formData })`, trình duyệt sẽ tự động phát hiện và sinh ra header có cấu trúc đặc biệt: `multipart/form-data; boundary=----WebKitFormBoundary...`. Nếu lập trình viên cố tình ghi đè chuỗi "multipart/form-data", tham số `boundary` sẽ bị mất và Multer phía server sẽ báo lỗi không thể phân tách file!'
      }
    },

    {
      title: 'Tổng Kết Buổi 11 & Chuẩn Bị Cho Buổi Bế Mạc', kicker: 'B11 · Section 06: DevBlog Integration',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Thành quả đạt được sau Buổi 11**:',
        '• Nền tảng DevBlog API đã hoàn chỉnh toàn bộ các tính năng người dùng: Đăng ký, Đăng nhập, Quản lý bài viết, Upload ảnh đại diện, Phân trang và Tìm kiếm.',
        '• Nối thành công giao diện Front-end Web tương tác trực quan với Back-end.',
        '**Chuẩn bị cho Buổi 12 (Buổi Cuối Cùng)**:',
        '• Viết **Kiểm thử tự động với Jest & Supertest** để tự tin bảo vệ mã nguồn.',
        '• Tự động sinh tài liệu chuẩn hóa tương tác với **OpenAPI 3.0 & Swagger UI**.',
        '• Đóng gói toàn bộ hệ thống bằng **Docker & Docker Compose**.',
        '• Triển khai ứng dụng lên máy chủ Internet với **PM2 & Nginx Reverse Proxy** và bảo vệ đồ án tốt nghiệp!'
      ],
      img: { src: 'clean-architecture.svg', cap: 'Hệ thống DevBlog API đã sẵn sàng cho giai đoạn kiểm thử và đóng gói', h: 300 }
    }
  ],
  recap: [
    'Dùng **Multer** xử lý `multipart/form-data`; Luôn giới hạn dung lượng (`limits`) và kiểm tra loại file (`fileFilter`).',
    'Chỉ lưu **đường dẫn URL dạng chuỗi** vào CSDL, file thực tế lưu trong ổ đĩa hoặc Cloud Storage (AWS S3).',
    'Phục vụ file tĩnh tốc độ cao với **`express.static(\'public\')`** có kích hoạt HTTP Cache Control.',
    'Thiết kế **Phân trang RESTful**: Hỗ trợ `page`, `limit`, `sort`, `search` và trả về `meta` chi tiết.',
    'Bản chất **CORS**: Là chính sách bảo vệ của Trình duyệt Web; Xử lý mượt mà Preflight Request `OPTIONS`.',
    'Nối **Front-end**: Sử dụng Fetch API kèm Bearer Token tự động và xử lý `FormData` chuẩn mực.'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Cấu hình Multer Upload File Cơ Bản',
      desc: 'Làm quen với việc cấu hình Multer tiếp nhận file ảnh đơn lẻ.',
      tasks: [
        'Cài đặt thư viện: `npm install multer`.',
        'Tạo thư mục `public/uploads/` trong dự án.',
        'Cấu hình `diskStorage` lưu file vào thư mục trên với tên file kèm timestamp độc nhất.',
        'Viết route thử nghiệm `POST /api/v1/test-upload` nhận `upload.single(\'myFile\')` và in `req.file` ra console.'
      ]
    },
    {
      level: 'core', time: 30, title: 'Upload Ảnh Đại Diện User (/api/v1/users/avatar)',
      desc: 'Xây dựng tính năng cập nhật ảnh đại diện người dùng hoàn chỉnh.',
      tasks: [
        'Tạo route `POST /api/v1/users/avatar` (có `auth` middleware).',
        'Chỉ chấp nhận file ảnh định dạng JPG, PNG, WEBP với dung lượng tối đa 2MB.',
        'Nếu người dùng upload file quá 2MB, bắt lỗi Multer và trả về mã lỗi 400 Bad Request thân thiện.',
        'Cập nhật cột `avatar_url` của user trong database và trả về đường dẫn ảnh mới.',
        'Kiểm tra mở ảnh trực tiếp trên trình duyệt qua URL `http://localhost:3000/uploads/...` thành công.'
      ]
    },
    {
      level: 'core', time: 35, title: 'Xây dựng Tính Năng Phân Trang & Lọc Đa Tiêu Chí',
      desc: 'Hoàn thiện endpoint danh sách bài viết hỗ trợ phân trang và tìm kiếm chuẩn mực.',
      tasks: [
        'Cập nhật endpoint `GET /api/v1/posts` nhận các query params: `?page=`, `?limit=`, `?search=`, `?tag=`, `?sort=`.',
        'Khống chế `limit` tối đa 50 bản ghi để bảo vệ bộ nhớ máy chủ.',
        'Hỗ trợ sắp xếp đa tiêu chí theo whitelist: `createdAt`, `title`, `viewCount` (hỗ trợ dấu `-` cho DESC).',
        'Cấu trúc phản hồi đầy đủ metadata: `{ success: true, data: [...], meta: { page, limit, total, totalPages } }`.'
      ]
    },
    {
      level: 'core', time: 30, title: 'Cấu hình CORS Nghiêm Ngặt & Xử Lý Preflight',
      desc: 'Thiết lập rào chắn nguồn gốc chéo an toàn cho môi trường phát triển và sản phẩm.',
      tasks: [
        'Cài đặt `npm install cors`.',
        'Cấu hình danh sách trắng (Whitelist) chỉ cho phép các domain Front-end cụ thể.',
        'Mở quyền cho các headers: `Content-Type`, `Authorization`, `X-Request-Id`.',
        'Bật cờ `credentials: true` và thiết lập cache Preflight `maxAge: 86400`.',
        'Dùng Fetch từ domain lạ gọi sang để xác nhận trình duyệt chặn đứng với lỗi CORS Policy.'
      ]
    },
    {
      level: 'challenge', time: 40, title: 'Nén và Chuyển Đổi Ảnh Tự Động Sang Định Dạng WebP với Sharp',
      desc: 'Tối ưu hóa hiệu năng tải trang bằng việc xử lý đồ họa nâng cao.',
      tasks: [
        'Cài đặt thư viện: `npm install sharp`.',
        'Cấu hình Multer sử dụng `memoryStorage` để lưu ảnh tạm vào RAM Buffer.',
        'Viết middleware xử lý ảnh bằng Sharp: Tự động resize ảnh về kích thước tối đa 1200px chiều rộng (giữ nguyên tỷ lệ).',
        'Chuyển đổi toàn bộ định dạng ảnh sang chuẩn WebP với chất lượng 80%.',
        'Ghi file WebP đã nén xuống thư mục `public/uploads/` và so sánh dung lượng file trước và sau khi nén.'
      ]
    },
    {
      level: 'homework', time: 40, title: 'Xây dựng Giao Diện Front-end Gọi API & Phân Trang',
      desc: 'Tạo trang web HTML/CSS/JS thuần kết nối gọi trọn vẹn bộ API vừa xây dựng.',
      tasks: [
        'Tạo file `public/index.html` và `public/js/app.js`.',
        'Viết hàm `loadPosts(page)` sử dụng `fetch()` gọi API lấy danh sách bài viết.',
        'Render danh sách bài viết dạng thẻ Card có ảnh bìa, tiêu đề, tác giả.',
        'Vẽ các nút phân trang: [Trang trước] [Trang X / Y] [Trang sau] dựa trên `meta` nhận được.',
        'Xử lý hiển thị thông báo "Đang tải dữ liệu..." trong lúc chờ API phản hồi.'
      ]
    },
    {
      level: 'project', time: 45, title: 'Đồ án DevBlog Cột mốc 5: Tích hợp Đa Phương Tiện & Nối Front-end',
      desc: 'Cột mốc đưa dự án DevBlog thành sản phẩm web hoàn chỉnh có thể tương tác trực quan.',
      tasks: [
        'Hoàn thiện tính năng upload ảnh bìa cho bài viết `POST /api/v1/posts/:id/cover`.',
        'Hoàn thiện API danh sách bài viết có phân trang, tìm kiếm và sắp xếp chuẩn RESTful.',
        'Cấu hình CORS an toàn kết nối giữa Front-end chạy cổng 5500 và Back-end chạy cổng 3000.',
        'Kết nối trang giao diện đọc bài viết Front-end tải dữ liệu thật từ database MySQL.',
        'Export Postman Collection đầy đủ các ca kiểm thử upload file và phân trang.'
      ]
    }
  ],
  project: {
    lead: '**Cột mốc 5**: DevBlog sở hữu đầy đủ tính năng thực tế: Upload ảnh đa phương tiện, phân trang mượt mà và kết nối Front-end thành công.',
    tasks: [
      'Xử lý upload ảnh bìa bài viết với Multer an toàn và phục vụ file tĩnh',
      'Xây dựng hệ thống phân trang, tìm kiếm đa tiêu chí có khống chế tải',
      'Cấu hình CORS chuẩn và kết nối giao diện web Front-end với API Back-end'
    ],
    callout: { type: 'tip', t: 'Buổi 12 — buổi kết khóa: Chúng ta sẽ viết **Kiểm thử tự động với Jest & Supertest**, tạo tài liệu tương tác với **Swagger/OpenAPI**, đóng gói **Docker** và triển khai lên máy chủ thật với **PM2 & Nginx**!' }
  }
};
