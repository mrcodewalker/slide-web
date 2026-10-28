/* ============================================================
   BUỔI 7 — MySQL & Kết Nối Từ Node.js
   ============================================================ */
SESSION_DATA[7] = {
  intro: 'Buổi kết nối cơ sở dữ liệu quan hệ chuyên nghiệp. Chuyển đổi từ file JSON sang MySQL 8. Nắm vững thiết kế ERD chuẩn hóa 3NF, phân tích chỉ mục B-Tree, giao dịch ACID, làm chủ mysql2/promise cùng kiến trúc Connection Pool, phòng chống triệt để lỗ hổng SQL Injection với Prepared Statements và hoàn thiện tầng Model cho DevBlog.',
  agenda: [
    { min: 10, t: 'Ôn B6 & kiểm tra môi trường MySQL', d: 'XAMPP, MySQL Installer, Docker' },
    { min: 30, t: 'Vì sao cần CSDL quan hệ? ERD & Chuẩn hóa 3NF', d: 'Bảng, PK, FK, quan hệ 1-1, 1-N, N-N' },
    { min: 30, t: 'Ôn tập & Nâng cao SQL: DDL, DML, JOIN, B-Tree', d: 'Chỉ mục B-Tree, INNER/LEFT JOIN, ACID transactions' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 35, t: 'Thư viện mysql2 & Bản chất Connection Pool', d: 'mysql2/promise, pool reuse, tham số tối ưu' },
    { min: 35, t: 'Lỗ hổng SQL Injection & Kỹ thuật Prepared Statement', d: 'Demo khai thác, placeholder ?, whitelist tên cột' },
    { min: 35, t: 'Tái cấu trúc post.model.js bằng SQL & Bắt lỗi CSDL', d: 'Bắt ER_DUP_ENTRY, chuyển đổi AppError' },
    { min: 15, t: 'Tổng kết & giao bài tập B07', d: 'Đồ án DevBlog cột mốc 3a' }
  ],
  slides: [
    /* ---------- SECTION 01: CƠ SỞ DỮ LIỆU QUAN HỆ & THIẾT KẾ ERD ---------- */
    { kind: 'section', no: '01', title: 'Cơ sở dữ liệu Quan hệ & Thiết kế ERD', sub: 'Tạm biệt file JSON đơn sơ — Bước chân vào thế giới cơ sở dữ liệu quan hệ chuẩn mực.' },
    {
      title: 'Vì sao file JSON không đủ? Chuyển dịch sang MySQL', layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**Hạn chế chí mạng của lưu trữ file JSON**:',
        { t: 'Đọc/ghi chậm chạp (O(N)): Cần tìm 1 bài viết phải nạp toàn bộ file 50MB vào RAM để parse JSON.', sub: ['Xung đột ghi đồng thời (Race Condition): 2 người dùng bình luận cùng lúc sẽ ghi đè làm mất dữ liệu của nhau.', 'Không có ràng buộc toàn vẹn: Không tự động kiểm tra trùng email, dễ sinh ra dữ liệu mồ côi (dangling pointers).', 'Truy vấn nghèo nàn: Không thể JOIN 3 bảng, không có GROUP BY, COUNT, SUM hiệu năng cao.'] },
        '**Sức mạnh vượt trội của MySQL**:',
        { t: 'Tổ chức dữ liệu theo Bảng (Table), Cột (Column) và Dòng (Row) chuẩn hóa nghiêm ngặt.', sub: ['Chỉ mục B-Tree (Index) giúp tìm kiếm 1 bản ghi trong 10 triệu dòng chỉ mất 1 mili-giây.', 'Bảo toàn dữ liệu tuyệt đối theo tiêu chuẩn ACID (Atomicity, Consistency, Isolation, Durability).', 'Khả năng phục vụ hàng ngàn người dùng truy cập đồng thời ổn định 24/7.'] }
      ],
      img: { src: 'mysql-logo.svg', cap: 'MySQL — Hệ quản trị CSDL quan hệ phổ biến nhất thế giới', h: 320 }
    },
    {
      title: 'Thuật ngữ Cốt lõi trong Cơ sở dữ liệu Quan hệ', layout: 'split', ratio: '.85fr 1.15fr',
      bullets: [
        '**Bảng (Table / Relation)**: Đại diện cho một tập hợp thực thể cùng loại (vd: Bảng `users`, Bảng `posts`).',
        '**Dòng (Row / Record / Tuple)**: Một thực thể cụ thể duy nhất (vd: Người dùng Nguyễn Văn A).',
        '**Cột (Column / Field / Attribute)**: Một thuộc tính dữ liệu cụ thể (vd: `email`, `created_at`).',
        '**Khóa chính (Primary Key - PK)**: Cột định danh độc nhất cho từng dòng trong bảng (không được rỗng, không được trùng).',
        '**Khóa ngoại (Foreign Key - FK)**: Cột tham chiếu tới Khóa chính của bảng khác để thiết lập mối quan hệ.'
      ],
      img: { src: 'relational-terms.svg', cap: 'Các thuật ngữ trực quan trong mô hình cơ sở dữ liệu quan hệ', h: 420 }
    },
    {
      title: 'Ba Kiểu Quan hệ Thực thể trong Mô hình Dữ liệu', kicker: 'B07 · Mô hình hóa dữ liệu',
      cards: [
        { icon: '1️⃣', h: 'Một – Một (1 – 1)', p: 'Một user chỉ có **một** hồ sơ chi tiết (profile); một hồ sơ chỉ thuộc **một** user. Ít gặp — thường gộp chung vào một bảng để tối ưu truy vấn.' },
        { icon: '🌿', h: 'Một – Nhiều (1 – N)', p: 'Một tác giả viết **nhiều** bài viết; mỗi bài viết chỉ thuộc về **một** tác giả duy nhất. Khóa ngoại FK luôn nằm ở **bảng bên Nhiều**: `posts.user_id`.' },
        { icon: '🕸️', h: 'Nhiều – Nhiều (N – N)', p: 'Một bài viết gắn **nhiều** tag; một tag được gắn vào **nhiều** bài viết. Bắt buộc phải dùng **Bảng Trung Gian (Junction Table)**: `post_tags(post_id, tag_id)`.' }
      ], cols: 3,
      callout: { type: 'tip', t: 'Mẹo xác định quan hệ: Luôn đặt 2 câu hỏi đảo chiều: "Một A chứa bao nhiêu B?" và "Một B thuộc về bao nhiêu A?".' }
    },
    {
      title: 'Sơ đồ Thực thể Quan hệ (ER Diagram - ERD)', layout: 'split', ratio: '.8fr 1.2fr',
      bullets: [
        '**Tầm quan trọng của việc vẽ ERD**:',
        '• ERD là bản vẽ kiến trúc móng nhà trước khi thợ bắt đầu xây tường đổ bê tông.',
        '• Hình chữ nhật biểu diễn **Thực thể (Entity)**.',
        '• Đường nối thể hiện **Mối quan hệ (Relationship)** kèm bản số (Cardinality: 1, N).',
        '• Quy tắc bất di bất dịch: **Luôn thống nhất ERD với toàn bộ thành viên trong nhóm trước khi gõ lệnh `CREATE TABLE`**!',
        '• Công cụ khuyên dùng: `dbdiagram.io`, `draw.io`, `MySQL Workbench`.'
      ],
      img: { src: 'er-mmorpg.svg', cap: 'Ví dụ sơ đồ ERD hoàn chỉnh của một hệ thống game trực tuyến', h: 500 }
    },
    {
      title: 'Thiết kế ERD Hoàn Chỉnh cho Đồ Án DevBlog', badge: 'THẢO LUẬN LỚP',
      table: {
        head: ['Tên Bảng', 'Các Cột Thuộc Tính Chính', 'Ràng Buộc & Khóa', 'Ý Nghĩa Quan Hệ'],
        rows: [
          ['`users`', '`id`, `name`, `email`, `password_hash`, `role`, `created_at`', 'PK: `id`, UNIQUE: `email`', '1 user viết N posts, 1 user viết N comments'],
          ['`posts`', '`id`, `user_id`, `title`, `slug`, `content`, `status`, `created_at`', 'PK: `id`, FK: `user_id`, UNIQUE: `slug`', 'N posts thuộc 1 user (1-N)'],
          ['`comments`', '`id`, `post_id`, `user_id`, `content`, `created_at`', 'PK: `id`, FK: `post_id`, FK: `user_id`', 'N comments thuộc 1 post, 1 user'],
          ['`tags`', '`id`, `name`, `slug`', 'PK: `id`, UNIQUE: `name`, `slug`', 'Quan hệ Nhiều - Nhiều với bảng posts'],
          ['`post_tags`', '`post_id`, `tag_id`', 'PK kép: `(post_id, tag_id)`, FK: cả 2', 'Bảng trung gian phân rã quan hệ N-N']
        ]
      },
      callout: { type: 'info', t: 'Quy ước đặt tên chuẩn quốc tế: Tên bảng luôn là **danh từ số nhiều viết thường nối gạch dưới (snake_case)**; Cột khóa ngoại đặt theo cú pháp `<tên_bảng_số_ít>_id`.' }
    },
    {
      title: 'Bảng Trung Gian (Junction Table) trong Quan Hệ N-N', layout: 'split', ratio: '1.1fr .9fr',
      code: { lang: 'sql', size: 'sm', src: `-- Bảng trung gian nối giữa posts và tags:
CREATE TABLE post_tags (
  post_id INT NOT NULL,
  tag_id  INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Khóa chính kép (Composite Primary Key) chống gán trùng 1 tag:
  PRIMARY KEY (post_id, tag_id),
  
  -- Ràng buộc toàn vẹn khóa ngoại:
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE
);` },
      bullets: [
        '**Vì sao phải có bảng trung gian?**',
        '• CSDL quan hệ không cho phép một ô lưu mảng `tags: [1, 2, 5]` (vi phạm dạng chuẩn 1NF).',
        '• Bảng trung gian chuyển đổi 1 quan hệ N–N phức tạp thành **2 quan hệ 1–N đơn giản**: `posts 1 ➔ N post_tags` và `tags 1 ➔ N post_tags`.',
        '• Khóa chính kép `PRIMARY KEY (post_id, tag_id)` ngăn chặn tuyệt đối lỗi gắn trùng 1 tag vào cùng 1 bài viết hai lần!'
      ]
    },
    {
      title: 'Chuẩn Hóa Dữ Liệu: 1NF, 2NF, 3NF Chống Dư Thừa', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '⛔ Bảng chưa chuẩn hóa (Lỗi nặng)', cls: 'bad', code: { lang: 'sql', size: 'xs', src: `-- Bảng Posts thiết kế cẩu thả:
| id | title | author_name | author_email | tags |
| 1  | Node  | Nguyễn Lan  | lan@ct9.vn   | js,node |
| 2  | SQL   | Nguyễn Lan  | lan@ct9.vn   | db,sql |

-- HẬU QUẢ:
-- 1. Lan đổi email -> Phải cập nhật 1000 dòng!
-- 2. Tìm bài có tag 'node' -> Phải LIKE '%node%' cực chậm!` } },
        { h: '✅ Bảng đã chuẩn hóa 3NF', cls: 'good', bullets: [
          '• **1NF (Nguyên tử)**: Mỗi ô chỉ chứa 1 giá trị duy nhất (tách tags ra bảng riêng).',
          '• **2NF (Phụ thuộc toàn phần)**: Mọi thuộc tính không khóa phải phụ thuộc toàn bộ vào khóa chính.',
          '• **3NF (Không phụ thuộc bắc cầu)**: Tách thông tin tác giả (`author_name`, `email`) sang bảng `users`, bảng `posts` chỉ lưu `user_id`. Sửa email ở đúng 1 dòng duy nhất!'
        ] }
      ],
      callout: { type: 'tip', t: 'Trong 95% dự án phát triển web thực tế, đạt chuẩn **3NF** là điểm cân bằng hoàn hảo giữa tính toàn vẹn dữ liệu và hiệu năng truy vấn.' }
    },
    {
      title: 'Ràng Buộc Khóa Ngoại & Hành Vi ON DELETE CASCADE', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'sql', size: 'sm', src: `CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  
  -- Khi bài viết bị xóa, tất cả bình luận bên dưới tự động biến mất:
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  
  -- Khi tài khoản người dùng bị xóa, ta có thể chọn:
  -- Cách 1: Xóa sạch bình luận
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  -- Cách 2: Giữ bình luận nhưng gán vô danh (yêu cầu cột cho phép NULL)
  -- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);` },
      bullets: [
        '**4 Hành vi Foreign Key khi dòng cha bị xóa**:',
        '• **CASCADE**: Xóa cha ➔ Tự động xóa sạch toàn bộ dòng con liên quan.',
        '• **RESTRICT / NO ACTION**: Chặn không cho xóa dòng cha nếu đang có dòng con tham chiếu tới (ném lỗi).',
        '• **SET NULL**: Gán khóa ngoại ở dòng con thành `NULL` khi dòng cha bị xóa.',
        '• Giúp bảo toàn tính toàn vẹn tham chiếu (Referential Integrity), không bao giờ lo sinh ra bình luận trỏ vào bài viết không tồn tại!'
      ]
    },

    /* ---------- SECTION 02: ÔN TẬP & NÂNG CAO TRUY VẤN SQL ---------- */
    { kind: 'section', no: '02', title: 'Ôn tập & Nâng cao Kỹ thuật Truy vấn SQL', sub: 'Làm chủ DDL, DML, phân tích cơ chế Chỉ mục B-Tree và các phép JOIN phức tạp.' },
    {
      title: 'DDL — Khởi Tạo Cấu Trúc Bảng với utf8mb4', badge: 'LIVE CODING',
      code: { file: 'db/schema.sql', lang: 'sql', size: 'xs', src: `CREATE DATABASE IF NOT EXISTS devblog
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE devblog;

CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  title      VARCHAR(200) NOT NULL,
  slug       VARCHAR(250) NOT NULL UNIQUE,
  content    TEXT NOT NULL,
  status     ENUM('draft', 'published') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);` },
      callout: { type: 'warn', t: 'Bắt buộc phải chọn charset **`utf8mb4`** thay vì `utf8` thông thường. Bộ mã `utf8` cũ của MySQL chỉ hỗ trợ tối đa 3 bytes nên sẽ bị lỗi crash khi người dùng nhập tiếng Việt có dấu phức tạp hoặc các ký tự Emoji 🎉🚀🔥!' }
    },
    {
      title: 'Các Kiểu Dữ Liệu Phổ Biến trong MySQL',
      table: {
        head: ['Kiểu dữ liệu', 'Mô tả & Giới hạn dung lượng', 'Tình huống sử dụng thực tế'],
        rows: [
          ['`INT` / `BIGINT`', 'Số nguyên 4 bytes (đến 2 tỷ) / 8 bytes (đến 9 tỷ tỷ)', 'Khóa chính `id`, số lượng hàng tồn kho `stock`'],
          ['`VARCHAR(N)`', 'Chuỗi độ dài biến đổi tối đa N ký tự (tối đa 65,535 bytes)', 'Tiêu đề `title`, địa chỉ `email`, họ tên `name`'],
          ['`TEXT` / `LONGTEXT`', 'Văn bản dài (64KB đến 4GB), lưu ngoài trang dữ liệu', 'Nội dung bài viết `content`, bài luận, mô tả HTML'],
          ['`DECIMAL(P, S)`', 'Số thực dấu phẩy tĩnh chính xác tuyệt đối không sai số', 'Tiền bạc, giá sản phẩm: `DECIMAL(12, 2)` (chống lỗi float)'],
          ['`ENUM(\'a\', \'b\')`', 'Kiểu liệt kê, chỉ được chọn 1 trong các giá trị định sẵn', 'Trạng thái bài viết (`draft`, `published`), vai trò (`user`, `admin`)'],
          ['`TIMESTAMP`', 'Mốc thời gian (4 bytes, tự động chuyển theo Timezone)', 'Thời điểm tạo `created_at`, sửa `updated_at`']
        ], small: true
      }
    },
    {
      title: 'DML — Thao tác Dữ liệu: INSERT, UPDATE, DELETE an toàn', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'sql', size: 'sm', src: `-- 1. INSERT tạo bản ghi mới:
INSERT INTO posts (user_id, title, slug, content, status)
VALUES (1, 'Học MySQL cùng CT9', 'hoc-mysql-cung-ct9', 'Nội dung...', 'published');

-- 2. UPDATE cập nhật bản ghi:
UPDATE posts
SET title = 'Tiêu đề mới', content = 'Nội dung mới'
WHERE id = 5;

-- 3. DELETE xóa bản ghi:
DELETE FROM posts WHERE id = 5;` },
      bullets: [
        '**Nguyên tắc sinh tồn của kỹ sư dữ liệu**:',
        '• Khi viết lệnh `UPDATE` hoặc `DELETE`, **luôn luôn viết mệnh đề `WHERE` trước tiên**!',
        '• Lệnh `DELETE FROM posts;` (quên `WHERE`) sẽ **xóa sạch toàn bộ triệu bài viết** của công ty trong chớp mắt mà không có hộp thoại hỏi lại!',
        '• Trong các công ty lớn, chế độ Safe Updates (`SQL_SAFE_UPDATES = 1`) luôn được bật để chặn các câu lệnh UPDATE/DELETE thiếu WHERE.'
      ]
    },
    {
      title: 'Mệnh đề SELECT Nâng cao: Lọc, Gom nhóm & Phân trang', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'sql', size: 'sm', src: `SELECT
  p.user_id,
  u.name AS author_name,
  COUNT(p.id) AS total_posts,
  MAX(p.created_at) AS latest_post_date
FROM posts p
JOIN users u ON u.id = p.user_id
WHERE p.status = 'published'
GROUP BY p.user_id, u.name
HAVING total_posts >= 2
ORDER BY total_posts DESC
LIMIT 10 OFFSET 0;` },
      bullets: [
        '**Thứ tự thực thi ngầm của MySQL Engine**:',
        '1. `FROM` & `JOIN`: Xác định các bảng nguồn và ghép dữ liệu.',
        '2. `WHERE`: Lọc các dòng thỏa mãn điều kiện cơ sở.',
        '3. `GROUP BY`: Gom các dòng thành từng nhóm nhỏ.',
        '4. `HAVING`: Lọc trên các nhóm sau khi gom (khác WHERE).',
        '5. `SELECT`: Chọn các cột và hàm tính toán (`COUNT`, `AVG`).',
        '6. `ORDER BY`: Sắp xếp kết quả cuối cùng.',
        '7. `LIMIT` / `OFFSET`: Cắt trang dữ liệu trả về cho client.'
      ]
    },
    {
      title: 'Cơ Chế Chỉ Mục B-Tree (Index) vs Quét Toàn Bảng (Full Table Scan)', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Full Table Scan (Quét toàn bộ bảng)**:',
        '• Không có Index: MySQL phải duyệt qua từng dòng một từ dòng 1 đến dòng 10,000,000 để tìm kiếm email. Tốn 5-10 giây và làm nghẽn CPU ổ đĩa!',
        '**Cấu trúc B-Tree Index (Cây tìm kiếm cân bằng)**:',
        '• Dữ liệu được tổ chức dưới dạng cây nhiều nhánh tự cân bằng (Balanced Tree).',
        '• Độ phức tạp thuật toán: **$O(\\log N)$**.',
        '• Với bảng 10 triệu bản ghi, MySQL chỉ cần thực hiện tối đa **3 đến 4 bước nhảy con trỏ** là tìm thấy dữ liệu chính xác chỉ trong 1 mili-giây!'
      ],
      img: { src: 'btree-index.svg', cap: 'Cơ chế tra cứu cây B-Tree Index so với Full Table Scan trong MySQL', h: 420 }
    },
    {
      title: 'Khi Nào NÊN và KHÔNG NÊN Đánh Chỉ Mục Index?', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '✅ NÊN tạo INDEX', cls: 'good', bullets: [
          '• Các cột xuất hiện thường xuyên trong mệnh đề `WHERE` (vd: `email`, `slug`, `status`).',
          '• Các cột Khóa ngoại dùng để nối bảng `JOIN ... ON` (vd: `user_id`, `post_id`).',
          '• Các cột dùng để sắp xếp thứ tự `ORDER BY` (vd: `created_at`).',
          '• Cột định danh độc nhất cần ràng buộc `UNIQUE`.'
        ] },
        { h: '⛔ KHÔNG NÊN lạm dụng INDEX', cls: 'bad', bullets: [
          '• Bảng quá nhỏ (dưới vài trăm dòng): Quét toàn bảng còn nhanh hơn tra cứu index.',
          '• Cột có độ biến thiên quá thấp (Low Cardinality): Cột giới tính (`gender`: nam/nữ) hoặc cờ `is_active` (0/1).',
          '• Bảng có tần suất ghi (`INSERT`, `UPDATE`, `DELETE`) quá dày đặc: Mỗi khi thêm 1 dòng mới, MySQL phải tính toán và vẽ lại toàn bộ cây B-Tree, làm chậm tốc độ ghi dữ liệu!'
        ] }
      ],
      callout: { type: 'tip', t: 'Tạo index bằng lệnh: `CREATE INDEX idx_posts_status_date ON posts(status, created_at DESC);`' }
    },
    {
      title: 'Kỹ Thuật EXPLAIN: Đọc Kế Hoạch Thực Thi (Execution Plan)', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'sql', size: 'sm', src: `-- Thêm từ khóa EXPLAIN trước câu lệnh SELECT để xem chi tiết:
EXPLAIN SELECT * FROM posts WHERE status = 'published' AND user_id = 5;

-- Kết quả MySQL phân tích trả về:
-- | type  | possible_keys | key               | rows | Extra       |
-- | ref   | idx_user_id   | idx_user_id       | 3    | Using where |
-- (Nếu type = 'ALL' -> CẢNH BÁO: Đang Full Table Scan!)` },
      bullets: [
        '**Các chỉ số sống còn khi đọc EXPLAIN**:',
        '• **type**: Hiệu năng giảm dần: `const` ➔ `eq_ref` ➔ `ref` ➔ `range` ➔ `index` ➔ ⚠️ `ALL` (Quét toàn bộ bảng).',
        '• **key**: Tên Index thực tế mà MySQL Optimizer lựa chọn sử dụng.',
        '• **rows**: Số lượng dòng ước tính mà MySQL phải đọc trong bộ nhớ. Số này càng nhỏ thì truy vấn càng nhanh gấp bội!'
      ],
      img: { src: 'btree-index.svg', cap: 'Phân tích đường đi của dữ liệu qua lệnh EXPLAIN trong MySQL', h: 360 }
    },
    {
      title: 'Composite Index (Chỉ mục Kết hợp) & Leftmost Prefix Rule', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'sql', size: 'sm', src: `-- Tạo một chỉ mục kết hợp 3 cột:
CREATE INDEX idx_status_created_views ON posts (status, created_at, view_count);

-- ✅ TẬN DỤNG ĐƯỢC INDEX (Tuân thủ Leftmost Prefix):
SELECT * FROM posts WHERE status = 'published';
SELECT * FROM posts WHERE status = 'published' AND created_at > '2026-01-01';
SELECT * FROM posts WHERE status = 'published' AND created_at > '2026-01-01' AND view_count > 100;

-- ❌ KHÔNG TẬN DỤNG ĐƯỢC INDEX (Bỏ qua cột đầu tiên 'status'):
SELECT * FROM posts WHERE created_at > '2026-01-01';
SELECT * FROM posts WHERE view_count > 100;` },
      bullets: [
        '**Quy tắc Tiền tố Phía Trái (Leftmost Prefix Rule)**:',
        '• MySQL chỉ có thể sử dụng Composite Index nếu truy vấn có chứa cột đầu tiên ngoài cùng bên trái của Index.',
        '• Thứ tự đặt cột khi tạo Index: **Cột lọc chính xác (`=`) đặt trước ➔ Cột lọc khoảng (`>`, `<`) hoặc `ORDER BY` đặt sau**.'
      ]
    },
    {
      title: 'Database Migration: Quản Lý Phiên Bản CSDL Trong Dự Án Nhóm', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Nỗi đau khi làm việc nhóm không có Migration**:',
        '• Bạn A thêm cột `avatar` vào database máy mình, bạn B kéo code về chạy bị sập vì thiếu cột!',
        '• Chạy file SQL thủ công rất dễ sót lệnh, không biết máy nào đang ở phiên bản CSDL nào.',
        '**Khái niệm Database Migration**:',
        '• Đóng vai trò như **"Git dành cho cấu trúc cơ sở dữ liệu"**.',
        '• Mỗi thay đổi (tạo bảng, thêm cột, sửa kiểu dữ liệu) là một file migration có mốc thời gian (timestamp).',
        '• Có 2 hàm đối xứng: `up()` (thực thi thay đổi) và `down()` (hoàn tác quay về phiên bản cũ).',
        '• Buổi 8 ta sẽ dùng công cụ chuyên nghiệp **Sequelize Migration** để giải quyết triệt để vấn đề này!'
      ],
      img: { src: 'db-migration-timeline.svg', cap: 'Quy trình quản lý phiên bản CSDL và rollback với Database Migration', h: 360 }
    },
    {
      title: 'Phân Biệt Các Phép JOIN: INNER vs LEFT vs RIGHT JOIN', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**INNER JOIN (Giao nhau)**:',
        '• Chỉ lấy các dòng có khóa ngoại khớp dữ liệu ở **cả hai bảng**.',
        '• Bài viết không có tác giả hợp lệ sẽ bị loại bỏ khỏi kết quả.',
        '**LEFT JOIN (Bảo toàn bảng bên Trái)**:',
        '• Giữ lại **100% các dòng của bảng bên trái** (Users).',
        '• Nếu tác giả đó chưa từng đăng bài viết nào, các cột của bảng Posts sẽ được điền giá trị `NULL`.',
        '• Vô cùng hữu ích để thống kê danh sách thành viên kèm số bài viết của họ!'
      ],
      img: { src: 'sql-joins.svg', cap: 'Sơ đồ Venn tổng hợp các phép kết nối SQL JOINs (INNER, LEFT, RIGHT, FULL OUTER)' },
      callout: { type: 'info', t: 'RIGHT JOIN tương tự như LEFT JOIN nhưng bảo toàn bảng bên phải. Trong thực tế 99% kỹ sư sử dụng LEFT JOIN vì chiều đọc code từ trái qua phải tự nhiên hơn.' }
    },
    {
      title: 'Kỹ thuật JOIN Nhiều-Nhiều: Lấy Bài Viết Kèm Danh Sách Tags', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'sql', size: 'sm', src: `SELECT
  p.id,
  p.title,
  u.name AS author_name,
  -- Gộp mảng các tên tag cách nhau bởi dấu phẩy:
  GROUP_CONCAT(t.name ORDER BY t.name SEPARATOR ', ') AS tags_list
FROM posts p
INNER JOIN users u ON u.id = p.user_id
LEFT JOIN post_tags pt ON pt.post_id = p.id
LEFT JOIN tags t ON t.id = pt.tag_id
WHERE p.status = 'published'
GROUP BY p.id, p.title, u.name
ORDER BY p.created_at DESC;` },
      bullets: [
        '**Giải pháp xử lý quan hệ N-N trong 1 truy vấn duy nhất**:',
        '• Nối qua 3 mắt xích: `posts ➔ post_tags ➔ tags`.',
        '• Hàm tổng hợp `GROUP_CONCAT(t.name)` giúp gom toàn bộ các tag của bài viết thành một chuỗi duy nhất như `"express, javascript, nodejs"`.',
        '• Tránh được hoàn toàn lỗi kinh điển **N+1 Query Problem** (truy vấn danh sách bài viết rồi lại chạy thêm N vòng lặp để lấy tags của từng bài).'
      ]
    },
    {
      title: 'Tính Toàn Vẹn Giao Dịch ACID trong Cơ Sở Dữ Liệu', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**4 Thuộc tính vàng bảo đảm an toàn dữ liệu tuyệt đối (ACID)**:',
        '• **A - Atomicity (Tính Nguyên tử)**: "Tất cả hoặc không gì cả". Toàn bộ chuỗi thao tác thành công thì ghi nhận, chỉ cần 1 bước lỗi thì toàn bộ bị hủy bỏ (Rollback).',
        '• **C - Consistency (Tính Nhất quán)**: Dữ liệu luôn tuân thủ mọi ràng buộc toàn vẹn trước và sau khi thực hiện giao dịch.',
        '• **I - Isolation (Tính Cô lập)**: Các giao dịch diễn ra đồng thời không được can thiệp hay nhìn thấy dữ liệu dở dang của nhau.',
        '• **D - Durability (Tính Bền vững)**: Khi giao dịch đã Commit, dữ liệu được ghi an toàn xuống ổ đĩa vĩnh viễn, kể cả khi server mất điện đột ngột ngay sau đó.'
      ],
      img: { src: 'database-transaction.svg', cap: 'Mô hình tính Nguyên tử (Atomicity) và chu trình Transaction trong CSDL (Wikipedia)', h: 520 }
    },
    {
      title: 'Quản Lý Database Transaction: START, COMMIT, ROLLBACK', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `// Ví dụ chuyển tiền ngân hàng giữa 2 tài khoản:
const connection = await pool.getConnection();

try {
  // 1. Bắt đầu phiên giao dịch:
  await connection.beginTransaction();

  // 2. Trừ 1,000,000đ từ tài khoản A:
  await connection.execute('UPDATE accounts SET balance = balance - 1000000 WHERE id = ?', [accA]);

  // Giả lập lỗi sập server hoặc mạng đứt tại đây...

  // 3. Cộng 1,000,000đ vào tài khoản B:
  await connection.execute('UPDATE accounts SET balance = balance + 1000000 WHERE id = ?', [accB]);

  // 4. Mọi bước hoàn tất mỹ mãn -> Chốt giao dịch:
  await connection.commit();
} catch (err) {
  // 5. Có bất kỳ sự cố nào xảy ra -> Hoàn tác 100% trạng thái ban đầu:
  await connection.rollback();
  throw err;
} finally {
  // 6. Trả kết nối lại cho Connection Pool:
  connection.release();
}` }
    },

    /* ---------- SECTION 03: KẾT NỐI MYSQL TỪ NODE.JS ---------- */
    { kind: 'section', no: '03', title: 'Kết nối MySQL từ Node.js với mysql2', sub: 'Thư viện mysql2/promise, kiến trúc Connection Pool và tối ưu hóa tài nguyên.' },
    {
      title: 'Cài Đặt Thư Viện mysql2 & mysql2/promise', badge: 'LIVE CODING',
      term: `$ npm install mysql2`,
      code: { file: 'src/config/db.js', lang: 'javascript', size: 'sm', src: `const mysql = require('mysql2/promise');
const config = require('./index');

// Khởi tạo Connection Pool tập trung:
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,       // Tối đa 10 kết nối đồng thời
  queueLimit: 0,             // Hàng đợi không giới hạn
  timezone: '+07:00'         // Múi giờ Việt Nam
});

module.exports = pool;` },
      callout: { type: 'tip', t: 'Luôn import nhánh **`mysql2/promise`** để sử dụng cú pháp hiện đại `await pool.query(...)` thay vì callback cổ điển rối rắm.' }
    },
    {
      title: 'Bản Chất Kiến Trúc Connection Pool', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Vì sao KHÔNG NÊN dùng kết nối đơn lẻ (`createConnection`)?**',
        '• Mỗi lần mở kết nối mới tới MySQL phải trải qua: Bắt tay TCP 3 bước, trao đổi chứng chỉ mã hóa TLS và xác thực mật khẩu. Mất từ 50-100ms lãng phí!',
        '**Nguyên lý hoạt động của Connection Pool**:',
        '• Pool khởi tạo sẵn một lượng kết nối (vd: 10 sockets) và duy trì trạng thái sẵn sàng.',
        '• Khi có HTTP Request cần truy vấn ➔ Pool cho mượn một kết nối nhàn rỗi (Borrow Connection).',
        '• Truy vấn xong ➔ Kết nối được trả về Pool ngay lập tức để phục vụ cho request tiếp theo (Reuse).',
        '• Nếu cả 10 kết nối đều đang bận, request thứ 11 sẽ tự động xếp vào hàng đợi (Wait Queue) trong vài mili-giây.'
      ],
      img: { src: 'thread-pool.svg', cap: 'Kiến trúc Connection / Resource Pool quản lý và tái sử dụng kết nối (Wikipedia)', h: 520 }
    },
    {
      title: 'Kiểm Tra Kết Nối Database Ngay Khi Khởi Động Server', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/config/db.js', lang: 'javascript', size: 'sm', src: `// Hàm kiểm tra sức khỏe kết nối CSDL khi boot app:
async function testDbConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS connection_test');
    console.log('✅ Kết nối cơ sở dữ liệu MySQL thành công!');
    return true;
  } catch (err) {
    console.error('💥 KHÔNG THỂ KẾT NỐI TỚI MYSQL:');
    console.error('Mã lỗi:', err.code);
    console.error('Chi tiết:', err.message);
    
    // Nếu không có DB, dừng khởi động app ngay lập tức:
    process.exit(1);
  }
}

module.exports = { pool, testDbConnection };` },
      bullets: [
        '**Triết lý Fail-fast trong kỹ thuật phần mềm**:',
        '• Không bao giờ để server Express mở cổng `http://localhost:3000` thành công trong khi cơ sở dữ liệu MySQL phía sau chưa bật hoặc gõ sai mật khẩu!',
        '• Gọi `testDbConnection()` trước khi gọi `app.listen()` giúp phát hiện lỗi cấu hình ngay tại giây đầu tiên.'
      ]
    },
    {
      title: 'Thực Thi Truy Vấn: pool.query() vs pool.execute()', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `// 1. SELECT đọc dữ liệu:
// Kết quả trả về là một mảng 2 phần tử: [rows, fields]
const [posts] = await pool.execute(
  'SELECT id, title, slug FROM posts WHERE status = ? LIMIT ?',
  ['published', 10]
);

// 2. INSERT tạo dữ liệu mới:
// Kết quả trả về chứa insertId và affectedRows:
const [result] = await pool.execute(
  'INSERT INTO posts (user_id, title, slug, content) VALUES (?, ?, ?, ?)',
  [1, 'Tiêu đề bài viết', 'tieu-de-bai-viet', 'Nội dung...']
);

console.log('ID bài viết vừa tạo:', result.insertId);
console.log('Số dòng bị tác động:', result.affectedRows);` },
      bullets: [
        '**Sự khác biệt then chốt giữa `query` và `execute`**:',
        '• `pool.query()`: Gửi chuỗi SQL nguyên bản sang MySQL server parse lại từ đầu mỗi lần chạy.',
        '• `pool.execute()`: Sử dụng **Prepared Statement nhị phân cấp thấp** của MySQL. Câu lệnh SQL được compile và cache sẵn trên server ➔ Thực thi nhanh hơn đáng kể và an toàn tuyệt đối!'
      ]
    },

    /* ---------- SECTION 04: LỖ HỔNG SQL INJECTION & PHÒNG THỦ ---------- */
    { kind: 'section', no: '04', title: 'Lỗ hổng SQL Injection & Kỹ thuật Phòng thủ', sub: 'Hiểu cặn kẽ cơ chế tấn công SQL Injection và phòng thủ tuyệt đối bằng Prepared Statement.' },
    {
      title: 'SQL Injection — Lỗ Hổng Kinh Điển OWASP Top 10', badge: 'DEMO TẤN CÔNG',
      layout: 'split', ratio: '1fr 1fr',
      code: { lang: 'javascript', size: 'xs', src: `// ⛔ ĐOẠN CODE NGUY HIỂM CHẾT NGƯỜI (NỐI CHUỖI):
const emailInput = req.body.email; // Kẻ tấn công nhập vào form
const sql = "SELECT * FROM users WHERE email = '" + emailInput + "'";

// 💥 KỊCH BẢN TẤN CÔNG 1: Bypass Đăng nhập (Vượt qua mật khẩu)
// Hacker nhập vào ô email:    ' OR '1'='1
// Câu SQL được sinh ra:
// SELECT * FROM users WHERE email = '' OR '1'='1'
// --> Điều kiện '1'='1' LUÔN ĐÚNG! (Hacker login thành Admin!)

// 💥 KỊCH BẢN TẤN CÔNG 2: Phá hoại xóa sổ dữ liệu
// Hacker nhập:  admin@ct9.vn'; DROP TABLE users; --
// Câu SQL biến thành:
// SELECT * FROM users WHERE email = 'admin@ct9.vn'; DROP TABLE users; --'` },
      img: { src: 'sql-injection.png', cap: 'Sơ đồ luồng tấn công SQL Injection vượt qua lớp kiểm tra mật khẩu' },
      callout: { type: 'danger', t: 'SQL Injection luôn đứng đầu danh sách lỗ hổng nguy hiểm nhất hành tinh suốt hơn 20 năm qua. Chỉ cần một lập trình viên sơ suất nối chuỗi, toàn bộ cơ sở dữ liệu khách hàng sẽ bị đánh cắp hoặc xóa sạch!' }
    },
    {
      title: 'Cơ Chế Phòng Thủ Tuyệt Đối: Prepared Statement với dấu ?', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `// ✅ BẢO VỆ TUYỆT ĐỐI BẰNG PLACEHOLDER (?):
const [rows] = await pool.execute(
  'SELECT * FROM users WHERE email = ? AND status = ?',
  [req.body.email, 'active']
);` },
      bullets: [
        '**Vì sao Prepared Statement ngăn chặn được 100% SQL Injection?**',
        '• **Giai đoạn 1**: Câu lệnh SQL cấu trúc `SELECT * FROM users WHERE email = ?` được gửi sang MySQL server biên dịch (compile) thành cây thực thi trước.',
        '• **Giai đoạn 2**: Dữ liệu người dùng gửi lên (`req.body.email`) được gửi sang theo kênh tham số riêng biệt.',
        '• **Bản chất**: MySQL coi giá trị của `?` **ĐƠN THUẦN LÀ DỮ LIỆU CHUỖI (RAW DATA)**. Dù hacker có nhập `\' OR 1=1` hay `; DROP TABLE`, MySQL cũng chỉ tìm xem có ai sở hữu email đúng bằng chuỗi ký tự đó hay không!',
        '• Tuyệt đối không thể làm thay đổi cấu trúc câu lệnh truy vấn ban đầu.'
      ]
    },
    {
      title: 'Xử Lý Tên Cột và Sắp Xếp Động: Kỹ Thuật Whitelist', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'javascript', size: 'sm', src: `// ⚠️ CẠNH BÁO: Dấu ? CHỈ DÀNH CHO DỮ LIỆU GIÁ TRỊ!
// Không thể viết: 'SELECT * FROM posts ORDER BY ? ?' (Lỗi cú pháp)

// ✅ GIẢI PHÁP: Sử dụng Bảng Trắng (Whitelist)
const ALLOWED_SORT_COLUMNS = {
  title: 'title',
  date: 'created_at',
  views: 'view_count'
};

const sortField = ALLOWED_SORT_COLUMNS[req.query.sort] || 'created_at';
const sortOrder = req.query.order === 'asc' ? 'ASC' : 'DESC';

// Lúc này biến sortField hoàn toàn nằm trong tầm kiểm soát của server:
const [rows] = await pool.query(
  \`SELECT * FROM posts WHERE status = ? ORDER BY \${sortField} \${sortOrder} LIMIT ?\`,
  ['published', 10]
);` },
      bullets: [
        '**Nguyên tắc xử lý định danh SQL động**:',
        '• Placeholder `?` chỉ hoạt động với giá trị dữ liệu literal (String, Number, Date).',
        '• Tên bảng, tên cột, từ khóa `ASC/DESC` bắt buộc phải đối chiếu qua **Whitelist** từ điển được server định nghĩa sẵn trước khi ghép chuỗi.'
      ]
    },

    /* ---------- SECTION 05: TÁI CẤU TRÚC MODEL VỚI SQL & BẮT LỖI ---------- */
    { kind: 'section', no: '05', title: 'Tái Cấu Trúc Model Post với SQL & Bắt Lỗi', sub: 'Hiện thực hóa tầng Model hoàn chỉnh, ánh xạ lỗi ràng buộc CSDL thành thông báo thân thiện.' },
    {
      title: 'Tái Cấu Trúc Model post.model.js Hoàn Chỉnh', badge: 'LIVE CODING',
      code: { file: 'src/models/post.model.js', lang: 'javascript', size: 'xs', src: `const { pool } = require('../config/db');

exports.findAll = async ({ q, tag, limit = 10, offset = 0 } = {}) => {
  let whereConditions = ["p.status = 'published'"];
  let params = [];

  if (q) {
    whereConditions.push('p.title LIKE ?');
    params.push(\`%\${q}%\`);
  }

  const whereClause = whereConditions.length ? 'WHERE ' + whereConditions.join(' AND ') : '';

  const querySql = \`
    SELECT
      p.id, p.title, p.slug, p.created_at,
      u.name AS author_name,
      GROUP_CONCAT(t.name) AS tags
    FROM posts p
    INNER JOIN users u ON u.id = p.user_id
    LEFT JOIN post_tags pt ON pt.post_id = p.id
    LEFT JOIN tags t ON t.id = pt.tag_id
    \${whereClause}
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?;
  \`;

  params.push(Number(limit), Number(offset));
  const [rows] = await pool.query(querySql, params);
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM posts WHERE id = ?', [id]);
  return rows[0] || null;
};

exports.create = async ({ userId, title, slug, content }) => {
  const [result] = await pool.execute(
    'INSERT INTO posts (user_id, title, slug, content) VALUES (?, ?, ?, ?)',
    [userId, title, slug, content]
  );
  return await exports.findById(result.insertId);
};` }
    },
    {
      title: 'Ánh Xạ Mã Lỗi MySQL (Error Mapping) sang AppError', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'src/services/post.service.js', lang: 'javascript', size: 'sm', src: `try {
  return await postModel.create(postData);
} catch (err) {
  // 1. Trùng lặp khóa UNIQUE (vd: slug hoặc email bị trùng):
  if (err.code === 'ER_DUP_ENTRY') {
    throw new AppError('Tiêu đề bài viết hoặc slug này đã tồn tại trong hệ thống', 409);
  }

  // 2. Vi phạm ràng buộc khóa ngoại (User ID tác giả không tồn tại):
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    throw new AppError('Tác giả bài viết không tồn tại trong hệ thống', 400);
  }

  // 3. Khóa ngoại đang được tham chiếu không thể xóa:
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    throw new AppError('Không thể xóa đối tượng này vì đang có dữ liệu con liên kết', 400);
  }

  // Lỗi chưa lường trước -> Ném ra ngoài để Error Middleware xử lý 500:
  throw err;
}` },
      table: {
        small: true, head: ['Mã lỗi MySQL', 'Nguyên nhân kỹ thuật', 'Status Code ánh xạ'],
        rows: [
          ['`ER_DUP_ENTRY`', 'Vi phạm ràng buộc UNIQUE', '`409 Conflict`'],
          ['`ER_NO_REFERENCED_ROW_2`', 'Khóa ngoại FK không có trong bảng cha', '`400 Bad Request`'],
          ['`ER_ROW_IS_REFERENCED_2`', 'Bảng cha đang bị bảng con tham chiếu', '`400 Bad Request`'],
          ['`ECONNREFUSED`', 'Server MySQL chưa khởi động / sai port', '`500 Internal Error`']
        ]
      }
    },
    {
      title: 'Tự Động Hóa Khởi Tạo Database: schema.sql & seed.sql', layout: 'split', ratio: '1.1fr .9fr',
      code: { file: 'package.json', lang: 'json', size: 'sm', src: `{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "db:init": "node scripts/initDb.js",
    "db:seed": "node scripts/seedDb.js",
    "db:reset": "npm run db:init && npm run db:seed"
  }
}` },
      bullets: [
        '**Lợi ích của kịch bản tự động hóa CSDL**:',
        '• Khi một thành viên mới gia nhập nhóm hoặc khi triển khai lên máy chủ CI/CD, họ chỉ cần gõ đúng một lệnh: `npm run db:reset` là toàn bộ cấu trúc bảng và dữ liệu mẫu được nạp đầy đủ trong 2 giây.',
        '• Đảm bảo môi trường phát triển của tất cả thành viên trong nhóm luôn đồng bộ 100%!'
      ]
    },
    {
      title: 'Kiểm tra nhanh kiến thức Buổi 7', badge: 'QUIZ',
      quiz: {
        q: 'Khi xây dựng tính năng phân trang cho danh sách bài viết, kỹ thuật nào sau đây là an toàn và chuẩn mực nhất để đưa tham số `limit` và `offset` vào câu lệnh truy vấn SQL bằng thư viện mysql2?',
        opts: [
          'Ghép chuỗi trực tiếp: `query("... LIMIT " + req.query.limit)`',
          'Dùng template string: `query(`... LIMIT ${req.query.limit}`)`',
          'Dùng Prepared Statement: `execute("... LIMIT ? OFFSET ?", [Number(limit), Number(offset)])`',
          'Dùng hàm `escape()` tự viết để làm sạch chuỗi'
        ],
        a: 2,
        why: 'Chỉ có **Prepared Statement với dấu placeholder `?`** kết hợp với việc ép kiểu số nguyên `Number(...)` mới đảm bảo tham số được truyền tách biệt hoàn toàn khỏi cú pháp SQL, loại bỏ 100% nguy cơ tấn công SQL Injection!'
      }
    }
  ],
  recap: [
    'Mô hình CSDL quan hệ: Bảng, Cột, Dòng, Khóa chính (PK), Khóa ngoại (FK) và Chuẩn hóa 3NF.',
    'Chỉ mục **B-Tree Index** tăng tốc tra cứu từ $O(N)$ xuống $O(\\log N)$; Sử dụng đúng chỗ cho WHERE, JOIN, ORDER BY.',
    'Các phép kết nối: **INNER JOIN** (phần giao), **LEFT JOIN** (bảo toàn bảng trái), **GROUP_CONCAT** cho quan hệ N-N.',
    'Toàn vẹn giao dịch **ACID**: Quản lý an toàn bằng `START TRANSACTION`, `COMMIT`, `ROLLBACK`.',
    'Thư viện `mysql2/promise` kết hợp **Connection Pool** giúp tái sử dụng socket mạng hiệu quả cao.',
    'Phòng thủ tuyệt đối lỗ hổng **SQL Injection** bằng **Prepared Statement (`?`)**; Tuyệt đối không nối chuỗi SQL.'
  ],
  exercises: [
    {
      level: 'warmup', time: 20, title: 'Cài đặt MySQL & Khởi tạo Database DevBlog',
      desc: 'Chuẩn bị môi trường CSDL quan hệ sẵn sàng phục vụ dự án Node.js.',
      tasks: [
        'Cài đặt MySQL Server 8.0 (qua MySQL Installer, XAMPP hoặc Docker Container `mysql:8`).',
        'Cài đặt công cụ giao diện trực quan: DBeaver, MySQL Workbench hoặc TablePlus.',
        'Tạo Database `devblog` với charset `utf8mb4` và collation `utf8mb4_unicode_ci`.',
        'Tạo tài khoản người dùng riêng `devblog_user` chỉ cấp quyền trên database `devblog` (không dùng tài khoản `root` cho ứng dụng).'
      ],
      hints: [
        'Lệnh tạo user: `CREATE USER \'devblog_user\'@\'localhost\' IDENTIFIED BY \'mat_khau_an_toan\';`',
        'Lệnh cấp quyền: `GRANT ALL PRIVILEGES ON devblog.* TO \'devblog_user\'@\'localhost\'; FLUSH PRIVILEGES;`'
      ]
    },
    {
      level: 'core', time: 30, title: 'Thiết kế Schema SQL & Seed dữ liệu cho 5 bảng DevBlog',
      desc: 'Hiện thực hóa toàn bộ cấu trúc CSDL của đồ án DevBlog từ bản vẽ ERD.',
      tasks: [
        'Viết file `db/schema.sql` tạo đầy đủ 5 bảng: `users`, `posts`, `comments`, `tags`, `post_tags`.',
        'Khai báo đầy đủ các ràng buộc: Khóa chính (PK), Khóa ngoại (FK) có `ON DELETE CASCADE`, `UNIQUE`, `NOT NULL`.',
        'Viết file `db/seed.sql` chèn dữ liệu mẫu thực tế: 3 users, 10 bài viết, 5 thẻ tags, 15 bình luận.',
        'Đảm bảo script có thể chạy lặp lại trơn tru từ đầu (`DROP TABLE IF EXISTS` theo đúng thứ tự bảng con trước bảng cha).'
      ],
      solution: {
        file: 'db/schema.sql', lang: 'sql',
        src: `DROP TABLE IF EXISTS post_tags;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  status ENUM('draft', 'published') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE post_tags (
  post_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);`
      }
    },
    {
      level: 'core', time: 25, title: 'Viết các câu truy vấn JOIN phức tạp',
      desc: 'Luyện tập kỹ năng trích xuất dữ liệu đa bảng từ CSDL DevBlog.',
      tasks: [
        'Truy vấn 10 bài viết mới nhất kèm họ tên tác giả (`INNER JOIN`).',
        'Thống kê tổng số lượng bài viết của từng user (kể cả những user chưa có bài nào — `LEFT JOIN`).',
        'Lấy danh sách các bài viết có gắn tag "nodejs".',
        'Tìm Top 3 bài viết có số lượng bình luận nhiều nhất hệ thống.',
        'Lấy bài viết kèm toàn bộ danh sách tên các tag gộp thành chuỗi bằng hàm `GROUP_CONCAT`.'
      ]
    },
    {
      level: 'core', time: 40, title: 'Chuyển đổi Products API sang lưu trữ MySQL',
      desc: 'Thay thế tầng Model lưu trữ JSON của bài Products (B6) bằng MySQL 8.',
      tasks: [
        'Tạo bảng `products (id, name, price, stock, category, created_at)`.',
        'Xây dựng module `src/config/db.js` với `createPool` đọc thông tin từ file `.env`.',
        'Viết lại toàn bộ các hàm trong `src/models/product.model.js`: `findAll`, `findById`, `create`, `update`, `remove`.',
        '100% các câu lệnh truy vấn đều phải dùng Prepared Statement với placeholder `?`.',
        'Chạy lại Postman Collection Runner: Tất cả các endpoints CRUD sản phẩm đều phải Pass màu xanh!'
      ]
    },
    {
      level: 'challenge', time: 30, title: 'Thực nghiệm Khai thác & Vá lỗi SQL Injection',
      desc: 'Tự mình khai thác lỗ hổng bảo mật trên môi trường cô lập để thấu hiểu bản chất.',
      tasks: [
        'Viết một route kiểm thử có lỗi cố ý: `GET /vuln/users?email=` ghép chuỗi SQL trực tiếp.',
        'Khai thác thành công để lấy toàn bộ danh sách users bằng payload `\' OR \'1\'=\'1`.',
        'Sửa lại đoạn code bằng Prepared Statement với `?` và chứng minh cuộc tấn công thất bại hoàn toàn.',
        'Ghi chú 3 dòng bài học kinh nghiệm và xóa route thử nghiệm sau khi hoàn tất bài tập.'
      ]
    },
    {
      level: 'homework', time: 40, title: 'Xây dựng API Báo cáo Thống kê Dashboard',
      desc: 'Áp dụng các hàm tổng hợp SQL để xây dựng các endpoints thống kê dữ liệu.',
      tasks: [
        'Endpoint `GET /api/v1/stats/overview`: Trả về tổng số users, tổng số posts, tổng comments.',
        'Endpoint `GET /api/v1/stats/posts-per-day`: Thống kê số lượng bài viết đăng theo từng ngày trong tuần qua.',
        'Endpoint `GET /api/v1/stats/top-authors`: Danh sách 5 tác giả có tổng lượt bài viết nhiều nhất.',
        'Đảm bảo thời gian phản hồi của các truy vấn thống kê dưới 50ms.'
      ]
    },
    {
      level: 'project', time: 40, title: 'Đồ án DevBlog Cột mốc 3a: Kết nối Toàn diện MySQL',
      desc: 'Cột mốc chuyển đổi hạ tầng dữ liệu của đồ án DevBlog.',
      tasks: [
        'Hoàn thiện `db/schema.sql` và `db/seed.sql` cho toàn bộ dự án.',
        'Cấu hình Connection Pool trong `src/config/db.js`, kiểm tra kết nối khi boot server.',
        'Tái cấu trúc `src/models/post.model.js` sử dụng câu lệnh SQL chuẩn.',
        'Ánh xạ mã lỗi MySQL `ER_DUP_ENTRY` sang HTTP Status Code `409 Conflict`.',
        'Thêm script `npm run db:reset` vào file `package.json`.'
      ]
    }
  ],
  project: {
    lead: '**Cột mốc 3a**: Dữ liệu DevBlog được lưu trữ bền vững trong hệ quản trị CSDL quan hệ MySQL 8.',
    tasks: [
      'Thiết kế Schema và dữ liệu Seed cho 5 bảng quan hệ',
      'Xây dựng Model posts hoàn toàn bằng SQL chuẩn với Prepared Statement',
      'Kiểm thử tự động hồi quy với Postman Collection'
    ],
    callout: { type: 'tip', t: 'Buổi 8 chúng ta sẽ nâng cấp tiếp tầng dữ liệu lên **Sequelize ORM** — hãy để ý những câu lệnh SQL dài dòng hôm nay để thấy được sự tiện lợi vượt bậc của ORM!' }
  }
};
