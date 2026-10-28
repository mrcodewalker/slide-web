/* ============================================================
   BUỔI 5 — Thiết kế REST API & CRUD
   ============================================================ */
SESSION_DATA[5] = {
  intro: 'Buổi bản lề: học viên chuyển từ "viết route" sang "thiết kế API chuyên nghiệp". Nhấn mạnh tư duy tài nguyên (danh từ) + HTTP method (động từ) + status code chuẩn REST. Nắm vững Richardson Maturity Model, chuẩn hóa envelope response, chống mass assignment và kiểm thử tự động với Postman.',
  agenda: [
    { min: 10, t: 'Ôn B4 & chữa bài tập', d: 'Middleware, asyncHandler, CORS, AppError' },
    { min: 35, t: 'REST là gì? 6 ràng buộc & Richardson Maturity Model', d: 'Roy Fielding, Level 0 đến Level 3 HATEOAS' },
    { min: 30, t: 'Tư duy tài nguyên: URL, HTTP verbs, Safe & Idempotent', d: 'Danh từ số nhiều, nested resources, PUT vs PATCH' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 25, t: 'Status code & Envelope Response chuẩn RFC', d: '2xx, 4xx, 5xx, phân biệt 401 vs 403, error envelope' },
    { min: 55, t: 'Live coding: CRUD bài viết hoàn chỉnh', d: 'GET/POST/PUT/PATCH/DELETE, router.param, whitelist chống mass assignment' },
    { min: 25, t: 'Lưu trữ file JSON atomic & Validation đầu vào', d: 'Atomic write chống race condition, validate thủ công' },
    { min: 25, t: 'Postman: Collection, Environment & Test Scripts tự động', d: 'Runner kiểm thử hồi quy, export docs' },
    { min: 15, t: 'Tổng kết & giao bài tập B05', d: 'Đồ án DevBlog cột mốc 1' }
  ],
  slides: [
    /* ---------- SECTION 01: BẢN CHẤT KIẾN TRÚC REST ---------- */
    { kind: 'section', no: '01', title: 'Kiến trúc REST & Tư duy Tài nguyên', sub: 'Một phong cách thiết kế API chuẩn mực giúp web và mobile giao tiếp bền vững.' },
    {
      title: 'API — “Bản hợp đồng” giữa Front-end và Back-end', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Mô hình Kiến trúc 3 tầng (Three-Tier Architecture)**:',
        '🖥️ **1. Tầng Trình bày (Presentation Tier)**: Trình duyệt web (HTML/CSS/JS, React, Vue), Mobile App (Flutter, React Native) hoặc Postman.',
        '⚙️ **2. Tầng Ứng dụng & Logic (Application Tier - Node.js Express)**: Tiếp nhận request, xác thực danh tính, tính toán nghiệp vụ và điều phối dữ liệu.',
        '🐬 **3. Tầng Dữ liệu (Data Tier - MySQL / File Store)**: Lưu trữ dữ liệu bền vững, bảo toàn tính toàn vẹn.',
        '**API đóng vai trò Hợp đồng giao tiếp (Contract)**:',
        { t: 'Quy định chặt chẽ: URL tài nguyên, HTTP Method, cấu trúc JSON gửi lên và kết quả trả về.', sub: ['Giúp team Front-end và Back-end làm việc song song độc lập, không phụ thuộc nhau.', 'Một hệ thống Back-end phục vụ đồng thời cả Website, App di động và tích hợp bên thứ ba.'] }
      ],
      img: { src: 'three-tier-enterprise.svg', cap: 'Mô hình 3 tầng chuẩn: Client ⟷ Application Server ⟷ Database Server (Wikipedia)', h: 520 },
      callout: { type: 'tip', t: 'Nhờ API, khi giao diện Front-end đổi mới toàn diện, toàn bộ hệ thống Back-end vẫn giữ nguyên 100% không cần viết lại!' }
    },
    {
      title: 'REST — Representational State Transfer', kicker: 'B05 · Roy Fielding, 2000',
      cards: [
        { icon: '🤝', h: 'Client–Server', p: 'Tách biệt hoàn toàn giao diện người dùng và logic xử lý dữ liệu lưu trữ' },
        { icon: '🧠', h: 'Stateless', p: 'Mỗi request tự chứa đủ thông tin để server hiểu (vd: JWT token), không lưu session bộ nhớ' },
        { icon: '🗄️', h: 'Cacheable', p: 'Mọi response phải tự khai báo có được cache ở client/proxy hay không' },
        { icon: '🔗', h: 'Uniform Interface', p: 'Giao diện đồng nhất: Định danh tài nguyên qua URI, thao tác qua biểu diễn' },
        { icon: '🧱', h: 'Layered System', p: 'Client không cần biết đang kết nối trực tiếp tới server hay qua Reverse Proxy, Load Balancer' },
        { icon: '📦', h: 'Code on demand', p: '(Tùy chọn) Server có thể mở rộng client bằng cách gửi script thực thi' }
      ], cols: 3, small: true,
      callout: { type: 'tip', t: 'Không cần thuộc lòng lý thuyết 6 ràng buộc. Cần nhớ cốt lõi: **tài nguyên = danh từ trong URL**, **hành động = HTTP method**, **trạng thái = HTTP status code**.' }
    },
    {
      title: 'Richardson Maturity Model — 4 Cấp độ Trưởng thành REST', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        'Mô hình do **Leonard Richardson** đề xuất nhằm đo lường mức độ tuân thủ kiến trúc REST chuẩn mực:',
        '• **Level 0 (The Swamp of POX)**: Dùng HTTP đơn thuần như đường ống vận chuyển (RPC), chỉ dùng POST, 1 URL duy nhất (`/api/service`).',
        '• **Level 1 (Resources)**: Bắt đầu chia tài nguyên theo từng URL riêng biệt (`/api/posts`, `/api/users`), nhưng vẫn dùng method lộn xộn.',
        '• **Level 2 (HTTP Verbs & Status Codes)**: Chuẩn REST phổ biến nhất hiện nay! Dùng đúng `GET`, `POST`, `PUT`, `DELETE` và trả đúng mã `200`, `201`, `404`, `500`.',
        '• **Level 3 (HATEOAS)**: Tự khám phá liên kết (Hypermedia Controls). Trong response có kèm link dẫn tới các hành động tiếp theo.'
      ],
      img: { src: 'rest-maturity.svg', cap: 'Mô hình trưởng thành REST (Richardson Maturity Model) 4 cấp độ', h: 360 },
      callout: { type: 'info', t: 'Đa số các công ty công nghệ lớn trên thế giới (GitHub, Stripe, Twitter) thiết kế API đạt **Level 2** thực dụng và hiệu quả cao.' }
    },
    {
      title: 'Level 0 (RPC) vs Level 1 (Phân tách Tài nguyên)', layout: 'split', ratio: '1.1fr .9fr',
      cols: [
        { h: '⛔ Level 0: Đầm lầy RPC (The Swamp of POX)', cls: 'bad', code: { lang: 'http', size: 'sm', src: `POST /api/service HTTP/1.1\nContent-Type: application/json\n\n{ "action": "getUser", "userId": 10 }\n\nPOST /api/service HTTP/1.1\n{ "action": "deleteUser", "userId": 10 }` } },
        { h: '⚠️ Level 1: Định danh Tài nguyên (Resource URIs)', cls: 'warn', code: { lang: 'http', size: 'sm', src: `POST /api/users/10/get HTTP/1.1\nContent-Type: application/json\n\nPOST /api/users/10/delete HTTP/1.1\nContent-Type: application/json\n\n# Đã có URL riêng cho tài nguyên, nhưng vẫn dùng POST làm tất cả!` } }
      ],
      bullets: [
        '**Hạn chế của Level 0 & 1**:',
        '• Không tận dụng được cơ chế caching của trình duyệt và CDN (vì tất cả đều là POST).',
        '• Không phân biệt được hành động nào là đọc an toàn, hành động nào là ghi đè hay xóa dữ liệu.'
      ]
    },
    {
      title: 'Level 2: Chuẩn mực HTTP Verbs & Status Code', layout: 'split', ratio: '1.1fr .9fr',
      cols: [
        { h: '✅ Level 2: Chuẩn RESTful ngành công nghiệp', cls: 'good', code: { lang: 'http', size: 'sm', src: `GET /api/users/10 HTTP/1.1\n→ 200 OK (Trả về thông tin user 10)\n\nPOST /api/users HTTP/1.1\n→ 201 Created (Tạo user mới, header Location)\n\nPUT /api/users/10 HTTP/1.1\n→ 200 OK (Thay thế toàn bộ user 10)\n\nDELETE /api/users/10 HTTP/1.1\n→ 204 No Content (Xóa thành công, body rỗng)` } }
      ],
      img: { src: 'mdn-http-message.svg', cap: 'Thông điệp HTTP Request & Response chuẩn Level 2', h: 360 },
      callout: { type: 'tip', t: 'Level 2 giải quyết triệt để vấn đề: Mạng lưới Proxy/Cache tự động cache các request GET mà không sợ ảnh hưởng đến dữ liệu sửa đổi.' }
    },
    {
      title: 'Level 3: HATEOAS — Hypermedia Controls', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'json', size: 'sm', src: `{\n  "id": 10,\n  "name": "Nguyen Van A",\n  "email": "a@example.com",\n  "status": "active",\n  "_links": {\n    "self": { "href": "/api/users/10", "method": "GET" },\n    "orders": { "href": "/api/users/10/orders", "method": "GET" },\n    "deactivate": { "href": "/api/users/10/deactivate", "method": "POST" },\n    "avatar": { "href": "/api/users/10/avatar", "method": "PUT" }\n  }\n}` },
      bullets: [
        '**HATEOAS là gì?**',
        '• Viết tắt của: *Hypermedia As The Engine Of Application State*.',
        '• Client không cần phải ghi nhớ sẵn URL nào để thực hiện bước tiếp theo — Server chủ động cung cấp đường dẫn (`_links`) dựa theo trạng thái hiện tại của đối tượng.',
        '• Ví dụ: Nếu tài khoản user bị khóa, server sẽ không trả về link `deactivate` mà trả link `reactivate`.',
        '**Thực tế áp dụng**: Thường gặp ở các hệ thống ngân hàng hoặc thanh toán khắt khe (PayPal API), còn ứng dụng thông thường ít dùng vì làm tăng kích thước payload.'
      ]
    },
    {
      title: 'Tư duy tài nguyên: Danh từ, tuyệt đối không dùng Động từ',
      cols: [
        { h: '⛔ Kiểu “RPC” cổ điển — Cần tránh', cls: 'bad', code: { lang: 'http', size: 'sm', src: `GET  /getAllPosts\nPOST /createPost\nPOST /updatePost?id=5\nGET  /deletePost/5\nGET  /getCommentsOfPost?postId=5\nPOST /changePasswordOfUser` } },
        { h: '✅ Kiểu RESTful chuẩn mực — Khuyên dùng', cls: 'good', code: { lang: 'http', size: 'sm', src: `GET    /api/posts\nPOST   /api/posts\nPUT    /api/posts/5\nDELETE /api/posts/5\nGET    /api/posts/5/comments\nPOST   /api/users/me/password` } }
      ],
      callout: { type: 'info', t: 'Quy tắc vàng: **URL trả lời câu hỏi “ĐỐI TƯỢNG NÀO?” (Danh từ)**, còn **HTTP Method trả lời câu hỏi “LÀM GÌ VỚI NÓ?” (Động từ)**. Luôn dùng **danh từ số nhiều**, chữ thường viết liền gạch nối: `/api/blog-posts`.' }
    },
    {
      title: 'Cấu trúc URI Phân cấp & Quy tắc Đặt tên Clean URL', layout: 'split', ratio: '1.1fr .9fr',
      bullets: [
        '**5 Quy tắc thiết kế URI chuẩn quốc tế**:',
        '• **1. Dùng danh từ số nhiều (Plural nouns)**: `/users` thay vì `/user`, `/products` thay vì `/product`.',
        '• **2. Dùng chữ thường (kebab-case)**: `/api/user-profiles` thay vì camelCase `/userProfiles` hay `/user_profiles`.',
        '• **3. Không dùng đuôi mở rộng file**: Tránh `/api/posts.json` hay `/api/posts.php` — dùng header `Accept: application/json`.',
        '• **4. Tiền tố phiên bản API (API Versioning)**: Luôn gắn `/api/v1/...` ngay từ ngày đầu để sau này nâng cấp phiên bản không làm sập app cũ.',
        '• **5. Giữ URI nhất quán**: Đừng trộn lẫn `/api/v1/posts` và `/api/v1/article`.'
      ],
      img: { src: 'mdn-http-request.svg', cap: 'Cấu trúc HTTP Request tiêu chuẩn: Method, URI, Headers và Body (MDN Web Docs)', h: 500 }
    },
    {
      title: 'HTTP Verbs: Safe Methods vs Idempotent Methods', layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**Khái niệm Tính An toàn (Safe Methods)**:',
        '• Method được gọi là *Safe* nếu nó **chỉ đọc** và tuyệt đối không làm thay đổi trạng thái dữ liệu trên server.',
        '• `GET`, `HEAD`, `OPTIONS` là Safe methods.',
        '**Khái niệm Tính Bất biến (Idempotent Methods)**:',
        '• Method được gọi là *Idempotent* nếu gọi 1 lần hay gọi **100 lần liên tiếp** với cùng tham số thì trạng thái hệ thống vẫn hoàn toàn như nhau.',
        '• `GET`: Idempotent (đọc 100 lần vẫn vậy).',
        '• `PUT`: Idempotent (ghi đè cùng 1 dữ liệu 100 lần vẫn ra kết quả đó).',
        '• `DELETE`: Idempotent (xóa ID 5 lần đầu thành công, 99 lần sau báo 404, bản ghi vẫn đã bị xóa).',
        '• ⚠️ `POST`: **KHÔNG Idempotent**! Gọi POST 2 lần sẽ tạo ra 2 bản ghi mới với 2 ID khác nhau (trừ khi có Idempotency-Key).'
      ],
      img: { src: 'mdn-http-message.svg', cap: 'Tính chất Safe và Idempotent của các HTTP Verbs', h: 360 }
    },
    {
      title: 'Bảng CRUD ↔ HTTP Verbs & Status Code chuẩn', kicker: 'B05 · Quy chuẩn bắt buộc',
      table: {
        head: ['Hành động CRUD', 'HTTP Method', 'URL Endpoint', 'Mã thành công', 'Ý nghĩa & Payload trả về'],
        rows: [
          ['Lấy danh sách', '`GET`', '`/api/v1/posts`', '`200 OK`', 'Mảng danh sách các bài viết kèm metadata phân trang'],
          ['Lấy chi tiết một', '`GET`', '`/api/v1/posts/:id`', '`200 OK`', 'Một đối tượng bài viết duy nhất'],
          ['Tạo mới bản ghi', '`POST`', '`/api/v1/posts`', '`201 Created`', 'Bản ghi vừa tạo + Header `Location: /api/v1/posts/10`'],
          ['Thay thế toàn bộ', '`PUT`', '`/api/v1/posts/:id`', '`200 OK`', 'Toàn bộ bản ghi sau khi được cập nhật'],
          ['Cập nhật một phần', '`PATCH`', '`/api/v1/posts/:id`', '`200 OK`', 'Bản ghi sau khi các trường chỉ định được sửa'],
          ['Xóa bản ghi', '`DELETE`', '`/api/v1/posts/:id`', '`204 No Content`', 'Thân response rỗng hoàn toàn, không có JSON body']
        ]
      }
    },
    {
      title: 'PUT vs PATCH: Thay thế toàn bộ vs Sửa một phần', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: 'PUT — Thay thế toàn bộ bản ghi', code: { lang: 'json', size: 'sm', src: `// Client gửi PUT /api/posts/5:\n{\n  "title": "Tiêu đề mới hoàn toàn",\n  "content": "Nội dung bài viết mới"\n}\n// ⚠️ CẢNH BÁO VỚI PUT:\n// Nếu bản ghi cũ có trường "tags": ["node"]\n// nhưng body PUT không gửi "tags",\n// thì "tags" sẽ bị GHI ĐÈ THÀNH NULL HOẶC MẤT LUÔN!` } },
        { h: 'PATCH — Sửa một phần (Partial Update)', code: { lang: 'json', size: 'sm', src: `// Client gửi PATCH /api/posts/5:\n{\n  "title": "Chỉ đổi tiêu đề này thôi"\n}\n// ✅ ƯU ĐIỂM CỦA PATCH:\n// Server chỉ cập nhật duy nhất trường "title".\n// Các trường "content", "tags", "authorId", "createdAt"\n// hoàn toàn giữ nguyên giá trị ban đầu!` } }
      ],
      callout: { type: 'tip', t: 'Trong 90% dự án thực tế, các lập trình viên ưu tiên sử dụng **PATCH** vì giao diện web/app thường chỉ sửa 1 hoặc vài ô nhập liệu mà không cần gửi lại toàn bộ đối tượng đồ sộ.' }
    },
    {
      title: 'Quan hệ & Tài nguyên lồng nhau (Nested Resources)', layout: 'split', ratio: '1.1fr .9fr',
      table: {
        head: ['Nhu cầu nghiệp vụ', 'URL thiết kế chuẩn REST', 'Ghi chú kiến trúc'],
        rows: [
          ['Danh sách bình luận của bài 5', '`GET /api/posts/5/comments`', 'Thể hiện quan hệ 1-N (Post has many Comments)'],
          ['Thêm bình luận mới vào bài 5', '`POST /api/posts/5/comments`', 'ID bài viết lấy trực tiếp từ URL cha'],
          ['Xóa bình luận số 12', '`DELETE /api/comments/12`', 'Tránh lồng sâu `/posts/5/comments/12` vì id 12 đã duy nhất'],
          ['Bài viết của user số 3', '`GET /api/users/3/posts`', 'Hoặc dùng query string: `GET /api/posts?authorId=3`'],
          ['Xem thông tin chính mình', '`GET /api/me`', 'Alias URI tiện lợi cho người dùng đang đăng nhập']
        ]
      },
      callout: { type: 'warn', t: '**Quy tắc 2 cấp (Rule of 2 Levels)**: Tuyệt đối không lồng URI vượt quá 2 cấp (vd: `/orgs/1/teams/2/users/3/repos/4/commits` là phản mẫu thiết kế tồi). Hãy làm phẳng (flatten) các endpoint tài nguyên khi chúng đã có ID riêng!' }
    },
    {
      title: 'Query String: Lọc, Tìm kiếm, Sắp xếp', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'http', size: 'sm', src: `# 1. Tìm kiếm toàn văn (Full-text Search):\nGET /api/posts?q=nodejs\n\n# 2. Lọc chính xác theo thuộc tính (Filtering):\nGET /api/posts?tag=express&status=published\n\n# 3. Sắp xếp thứ tự (Sorting):\nGET /api/posts?sort=createdAt           # Tăng dần (A-Z, cũ đến mới)\nGET /api/posts?sort=-createdAt          # Giảm dần (Z-A, mới nhất lên đầu)\n\n# 4. Giới hạn trường trả về (Field Selection):\nGET /api/posts?fields=id,title,slug     # Giảm tải băng thông mạng\n\n# 5. Kết hợp linh hoạt:\nGET /api/posts?tag=nodejs&sort=-views&limit=5` },
      bullets: [
        '**Bản chất Query String**:',
        '• Tất cả các tham số lọc, tìm, xếp đều thuộc về **cùng một tài nguyên** `/api/posts`.',
        '• Query string không tạo ra tài nguyên mới mà chỉ điều chỉnh **cách dữ liệu được trả về**.',
        '• Giúp URL mang tính biểu đạt cao, người dùng có thể copy paste link hoặc bookmark kết quả tìm kiếm dễ dàng.'
      ]
    },
    {
      title: 'Query String: Phân trang (Offset vs Cursor)', layout: 'split', ratio: '1.1fr .9fr',
      cols: [
        { h: '1. Offset-based Pagination (Phổ biến)', code: { lang: 'http', size: 'sm', src: `GET /api/posts?page=2&limit=10\n\n// Server tính toán:\n// offset = (page - 1) * limit = 10\n// SQL: LIMIT 10 OFFSET 10;` } },
        { h: '2. Cursor-based Pagination (Big Data)', code: { lang: 'http', size: 'sm', src: `GET /api/posts?cursor=eyJpZCI6MTA1fQ&limit=10\n\n// Server truy vấn:\n// SQL: WHERE id > 105 LIMIT 10;` } }
      ],
      bullets: [
        '**So sánh hai chiến lược**:',
        '• **Offset (Page/Limit)**: Trực quan, dễ làm nút chuyển trang [1, 2, 3...], nhưng chậm khi dữ liệu hàng triệu dòng (offset lớn phải quét qua tất cả bản ghi trước đó).',
        '• **Cursor (Next Token)**: Hiệu năng cực nhanh và ổn định, lý tưởng cho tính năng cuộn vô tận (Infinite Scroll như Facebook, TikTok), không bị lệch bản ghi khi có người vừa đăng bài mới.'
      ]
    },

    /* ---------- SECTION 02: STATUS CODES & CHUẨN HÓA RESPONSE ---------- */
    { kind: 'section', no: '02', title: 'HTTP Status Codes & Chuẩn hóa Response', sub: 'Một API đẳng cấp luôn phản hồi đúng mã trạng thái và giữ cấu trúc JSON nhất quán.' },
    {
      title: 'Phân loại 5 Nhóm HTTP Status Code', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        'HTTP chia toàn bộ mã phản hồi thành 5 họ trạng thái dựa theo chữ số đầu tiên:',
        '• **1xx (Informational)**: Thông tin tạm thời — Yêu cầu đã nhận, đang tiếp tục xử lý (vd: `101 Switching Protocols` khi nâng cấp WebSocket).',
        '• **2xx (Success)**: Thành công — Request đã được tiếp nhận, hiểu và xử lý trọn vẹn (`200`, `201`, `204`).',
        '• **3xx (Redirection)**: Chuyển hướng — Cần thực hiện thêm hành động để hoàn tất (`301 Moved Permanently`, `304 Not Modified` khi dùng Cache).',
        '• **4xx (Client Error)**: Lỗi do phía Client gửi sai thông tin, thiếu quyền hoặc gọi sai URL (`400`, `401`, `403`, `404`, `409`).',
        '• **5xx (Server Error)**: Lỗi do phía Server bị bug crash, hết RAM hoặc chết kết nối Database (`500`, `502`, `503`).'
      ],
      img: { src: 'mdn-http-response.svg', cap: 'Giải phẫu thông điệp HTTP Response với mã trạng thái', h: 400 }
    },
    {
      title: 'Các mã Thành công (2xx) cốt lõi', layout: 'split', ratio: '1.15fr .85fr',
      table: {
        head: ['Mã Code', 'Tên trạng thái', 'Khi nào sử dụng trong REST API'],
        rows: [
          ['`200 OK`', 'Thành công chuẩn', 'Dùng cho `GET`, `PUT`, `PATCH` xử lý thành công và có trả về dữ liệu trong body.'],
          ['`201 Created`', 'Đã tạo mới', 'Bắt buộc dùng khi `POST` tạo mới một tài nguyên thành công. Nên trả kèm header `Location`.'],
          ['`204 No Content`', 'Không có nội dung', 'Dùng cho `DELETE` thành công, hoặc các action không cần trả về payload (thân rỗng).']
        ]
      },
      code: { lang: 'javascript', size: 'sm', src: `// 200 OK\nres.status(200).json({ success: true, data: post });\n\n// 201 Created\nres.status(201).location(\`/api/posts/\${post.id}\`).json({ success: true, data: post });\n\n// 204 No Content\nres.sendStatus(204); // Không gửi body!` },
      callout: { type: 'tip', t: 'Không bao giờ trả `200 OK` khi tạo mới bản ghi — hãy luôn dùng `201 Created` để client biết chính xác bản ghi đã được tạo lập bền vững.' }
    },
    {
      title: 'Các mã Lỗi Client (4xx) phổ biến nhất', layout: 'split', ratio: '1.1fr .9fr',
      table: {
        head: ['Mã Code', 'Tên lỗi', 'Tình huống phát sinh thực tế'],
        rows: [
          ['`400 Bad Request`', 'Dữ liệu không hợp lệ', 'Client gửi thiếu trường, sai định dạng JSON, email không đúng định dạng.'],
          ['`401 Unauthorized`', 'Chưa xác thực', 'Client không gửi Token, Token hết hạn, hoặc chữ ký Token không hợp lệ.'],
          ['`403 Forbidden`', 'Bị từ chối truy cập', 'Đã đăng nhập nhưng không đủ quyền (vd: user thường cố xóa bài admin).'],
          ['`404 Not Found`', 'Không tìm thấy', 'URL không tồn tại, hoặc ID tài nguyên yêu cầu không có trong cơ sở dữ liệu.'],
          ['`409 Conflict`', 'Xung đột dữ liệu', 'Đăng ký tài khoản với Email đã tồn tại, hoặc slug bài viết bị trùng lặp.'],
          ['`422 Unprocessable`', 'Sai logic nghiệp vụ', 'Cú pháp JSON đúng nhưng vi phạm ràng buộc (vd: ngày kết thúc trước ngày bắt đầu).']
        ]
      },
      callout: { type: 'danger', t: 'Tuyệt đối không bao giờ trả về `200 OK` nhưng bên trong thân body lại ghi `{ "status": "error", "message": "Sai mật khẩu" }`! Đây là phản mẫu thiết kế tồi làm hỏng kiến trúc HTTP.' }
    },
    {
      title: 'Phân biệt sống còn: 401 Unauthorized vs 403 Forbidden', layout: 'split', ratio: '1.05fr .95fr',
      cols: [
        { h: '🔒 401 Unauthorized (Chính xác là Unauthenticated)', cls: 'bad', bullets: [
          '• Câu hỏi cốt lõi: **"BẠN LÀ AI?"**',
          '• Xảy ra khi: Request hoàn toàn không có header `Authorization`, hoặc gửi token rác, token giả mạo, token đã hết hạn.',
          '• Hành động của Front-end: Chuyển hướng người dùng về ngay trang **Đăng nhập (Login Page)**.'
        ] },
        { h: '🚫 403 Forbidden (Chính xác là Unauthorized)', cls: 'bad', bullets: [
          '• Câu hỏi cốt lõi: **"BẠN CÓ QUYỀN LÀM VIỆC NÀY KHÔNG?"**',
          '• Xảy ra khi: Server biết rõ bạn là Nguyễn Văn A (đã login hợp lệ), nhưng bạn là vai trò `Member` mà lại cố xóa tài khoản của người khác.',
          '• Hành động của Front-end: Hiển thị thông báo **"Bạn không có quyền hạn truy cập khu vực này"** (không chuyển về trang login).'
        ] }
      ],
      callout: { type: 'info', t: 'Mẹo nhớ: **401** là chưa xuất trình chứng minh thư. **403** là đã xuất trình chứng minh thư nhưng bảo vệ không cho phép bạn bước vào phòng VIP.' }
    },
    {
      title: 'Các mã Lỗi Server (5xx)', layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        'Khi client nhận mã 5xx, trách nhiệm 100% thuộc về đội ngũ Back-end:',
        '• **500 Internal Server Error**: Lỗi code chưa bắt ngoại lệ (Uncaught Exception), biến `undefined.something`, truy vấn cú pháp SQL sai dẫn tới crash.',
        '• **502 Bad Gateway**: Server trung gian (Nginx, Cloudflare) không thể nhận phản hồi hợp lệ từ ứng dụng Node.js Express chạy phía sau.',
        '• **503 Service Unavailable**: Server đang quá tải lượng truy cập cực lớn hoặc đang tạm dừng để bảo trì định kỳ.',
        '• **504 Gateway Timeout**: Server Node.js xử lý quá lâu (vượt quá ngưỡng timeout của Nginx, vd > 60 giây) khiến proxy tự ngắt kết nối.'
      ],
      img: { src: 'http-status-categories.svg', cap: 'Phân tích các mã lỗi Server 5xx và vị trí sự cố trong Express', h: 360 }
    },
    {
      title: 'Định dạng Response chuẩn: Envelope Pattern', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: '✅ Khi Thành công (Success Envelope)', cls: 'good', code: { lang: 'json', size: 'sm', src: `// 1. Lấy chi tiết một tài nguyên:\n{\n  "success": true,\n  "data": {\n    "id": 5,\n    "title": "Tìm hiểu REST API",\n    "slug": "tim-hieu-rest-api",\n    "createdAt": "2026-10-28T10:00:00Z"\n  }\n}\n\n// 2. Lấy danh sách có phân trang:\n{\n  "success": true,\n  "data": [ ...mảng các bài viết... ],\n  "meta": {\n    "page": 1,\n    "limit": 10,\n    "total": 45,\n    "totalPages": 5\n  }\n}` } },
        { h: '❌ Khi Thất bại (Error Envelope)', cls: 'bad', code: { lang: 'json', size: 'sm', src: `{\n  "success": false,\n  "error": {\n    "code": "VALIDATION_FAILED",\n    "message": "Dữ liệu gửi lên không hợp lệ",\n    "details": [\n      {\n        "field": "title",\n        "message": "Tiêu đề phải có độ dài từ 3 ký tự trở lên"\n      },\n      {\n        "field": "price",\n        "message": "Giá tiền bắt buộc phải lớn hơn 0"\n      }\n    ]\n  }\n}` } }
      ],
      callout: { type: 'tip', t: 'Lợi ích vô giá: Đội Front-end chỉ cần viết **một hàm interceptor duy nhất** (vd: Axios Interceptor) để kiểm tra cờ `response.data.success` cho toàn bộ ứng dụng.' }
    },
    {
      title: 'Chuẩn hóa Báo lỗi theo RFC 7807 (Problem Details)', layout: 'split', ratio: '1.15fr .85fr',
      code: { lang: 'json', size: 'sm', src: `{\n  "type": "https://api.devblog.com/errors/invalid-credentials",\n  "title": "Unauthorized",\n  "status": 401,\n  "detail": "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.",\n  "instance": "/api/v1/auth/login",\n  "timestamp": "2026-10-28T10:15:30.123Z"\n}` },
      bullets: [
        '**Tiêu chuẩn IETF RFC 7807**: Định dạng mô tả lỗi chuẩn cho HTTP API toàn cầu.',
        '• `type`: Đường link tài liệu giải thích chi tiết về mã lỗi này.',
        '• `title`: Tên tóm tắt ngắn gọn của mã trạng thái.',
        '• `status`: Mã HTTP status phản chiếu từ header.',
        '• `detail`: Lời giải thích dễ hiểu dành cho người dùng cuối.',
        '• `instance`: URI endpoint đã kích hoạt lỗi này.'
      ]
    },

    /* ---------- SECTION 03: LIVE CODING CRUD BÀI VIẾT ---------- */
    { kind: 'section', no: '03', title: 'Live Coding: Xây dựng REST API CRUD Bài viết', sub: 'Hiện thực hóa toàn bộ lý thuyết thành code chạy thật từng endpoint một.' },
    {
      title: 'Sơ đồ luồng xử lý CRUD bài viết trong Express', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Hành trình một HTTP Request CRUD đi qua các chặng**:',
        '1. **Client (Postman/Web)**: Gửi request HTTP kèm Method, Path, Body JSON.',
        '2. **express.json() Middleware**: Đọc Stream nhị phân, parse thành Object `req.body`.',
        '3. **Router Dispatcher (`/api/v1/posts`)**: Điều hướng đến handler tương ứng theo Method (`GET`, `POST`, `PUT`, `DELETE`).',
        '4. **Param Validation (`router.param`)**: Kiểm tra định dạng `id`, tìm đối tượng trước.',
        '5. **Business Logic & Persistence**: Đọc/ghi dữ liệu (mảng bộ nhớ / file JSON / DB).',
        '6. **Envelope Formatter**: Đóng gói `{ success: true, data }` và gửi về client kèm Status Code chuẩn.'
      ],
      img: { src: 'mdn-http-response.svg', cap: 'Cấu trúc HTTP Response tiêu chuẩn: Status Code, Headers, MIME Type và JSON Payload (MDN)', h: 500 }
    },
    {
      title: 'Dữ liệu mẫu & Khởi tạo Router posts.js', badge: 'LIVE CODING',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `const express = require('express');\nconst router = express.Router();\n\n// Dữ liệu mẫu ban đầu trong bộ nhớ:\nlet posts = [\n  { id: 1, title: 'Bắt đầu với Node.js', content: 'Nội dung bài viết 1...', tags: ['node', 'backend'], createdAt: new Date() },\n  { id: 2, title: 'Làm chủ Express Router', content: 'Nội dung bài viết 2...', tags: ['express'], createdAt: new Date() }\n];\nlet nextId = 3;\n\n// Hàm tiện ích tìm kiếm bài viết theo ID:\nconst findPost = (id) => posts.find((p) => p.id === Number(id));\n\nmodule.exports = router;` },
      callout: { type: 'info', t: 'Khai báo Router riêng biệt giúp mã nguồn module hóa sạch sẽ, tách rời khỏi file `server.js` trung tâm.' }
    },
    {
      title: 'READ — GET Danh sách có Lọc & Tìm kiếm', badge: 'LIVE CODING',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `// GET /api/v1/posts?q=node&tag=backend\nrouter.get('/', (req, res) => {\n  const { q, tag } = req.query;\n  let result = posts;\n\n  // Lọc theo từ khóa tìm kiếm (không phân biệt hoa thường):\n  if (q) {\n    const queryStr = q.toLowerCase();\n    result = result.filter(p => p.title.toLowerCase().includes(queryStr));\n  }\n\n  // Lọc theo danh mục thẻ (tag):\n  if (tag) {\n    result = result.filter(p => p.tags && p.tags.includes(tag));\n  }\n\n  res.status(200).json({\n    success: true,\n    data: result,\n    meta: { total: result.length }\n  });\n});` },
      callout: { type: 'tip', t: 'Không bao giờ sửa trực tiếp mảng gốc `posts` khi lọc — luôn gán ra mảng kết quả `result` riêng biệt!' }
    },
    {
      title: 'READ — GET Chi tiết bài viết theo ID & Bẫy 404', badge: 'LIVE CODING',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `// GET /api/v1/posts/:id\nrouter.get('/:id', (req, res) => {\n  const id = Number(req.params.id);\n\n  // Kiểm tra tính hợp lệ của tham số ID:\n  if (isNaN(id) || id <= 0) {\n    return res.status(400).json({\n      success: false,\n      error: { message: 'ID bài viết phải là số nguyên dương hợp lệ' }\n    });\n  }\n\n  const post = findPost(id);\n\n  // Nếu không tìm thấy đối tượng trong cơ sở dữ liệu:\n  if (!post) {\n    return res.status(404).json({\n      success: false,\n      error: { message: \`Không tìm thấy bài viết mang ID \${id}\` }\n    });\n  }\n\n  res.status(200).json({\n    success: true,\n    data: post\n  });\n});` },
      callout: { type: 'warn', t: 'Nhớ `return` ngay sau khi gọi `res.status(404).json(...)` để dừng thực thi hàm handler, tránh lỗi văng `ERR_HTTP_HEADERS_SENT`!' }
    },
    {
      title: 'CREATE — POST Tạo mới bài viết & Header Location', badge: 'LIVE CODING',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `// POST /api/v1/posts\nrouter.post('/', (req, res) => {\n  const { title, content, tags = [] } = req.body;\n\n  // 1. Kiểm tra validation bắt buộc:\n  if (!title || !title.trim() || !content || !content.trim()) {\n    return res.status(400).json({\n      success: false,\n      error: { message: 'Tiêu đề (title) và nội dung (content) không được để trống' }\n    });\n  }\n\n  // 2. Tạo đối tượng mới với ID tự sinh phía Server:\n  const newPost = {\n    id: nextId++, \n    title: title.trim(),\n    content: content.trim(),\n    tags: Array.isArray(tags) ? tags : [],\n    createdAt: new Date()\n  };\n\n  posts.push(newPost);\n\n  // 3. Phản hồi 201 Created kèm header Location:\n  res.status(201)\n     .location(\`/api/v1/posts/\${newPost.id}\`)\n     .json({\n       success: true,\n       data: newPost\n     });\n});` },
      callout: { type: 'danger', t: 'Không bao giờ tin tưởng client tự gửi `id` hoặc `createdAt` lên trong body — Server phải hoàn toàn làm chủ việc sinh khóa chính và mốc thời gian.' }
    },
    {
      title: 'UPDATE — PUT Thay thế toàn bộ bản ghi', badge: 'LIVE CODING',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `// PUT /api/v1/posts/:id\nrouter.put('/:id', (req, res) => {\n  const post = findPost(req.params.id);\n  if (!post) {\n    return res.status(404).json({ success: false, error: { message: 'Không tìm thấy bài viết' } });\n  }\n\n  const { title, content, tags = [] } = req.body;\n  if (!title || !content) {\n    return res.status(400).json({ success: false, error: { message: 'PUT yêu cầu cung cấp đầy đủ title và content' } });\n  }\n\n  // Thay thế toàn bộ nội dung bản ghi:\n  post.title = title.trim();\n  post.content = content.trim();\n  post.tags = Array.isArray(tags) ? tags : [];\n  post.updatedAt = new Date();\n\n  res.status(200).json({\n    success: true,\n    data: post\n  });\n});` }
    },
    {
      title: 'UPDATE — PATCH Sửa một phần & Whitelist chống Mass Assignment', badge: 'LIVE CODING',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `// PATCH /api/v1/posts/:id\nrouter.patch('/:id', (req, res) => {\n  const post = findPost(req.params.id);\n  if (!post) {\n    return res.status(404).json({ success: false, error: { message: 'Không tìm thấy bài viết' } });\n  }\n\n  // ⚠️ CHỐNG MASS ASSIGNMENT: Chỉ định danh sách trường ĐƯỢC PHÉP sửa:\n  const ALLOWED_FIELDS = ['title', 'content', 'tags'];\n\n  for (const field of ALLOWED_FIELDS) {\n    if (req.body[field] !== undefined) {\n      post[field] = req.body[field];\n    }\n  }\n  post.updatedAt = new Date();\n\n  res.status(200).json({\n    success: true,\n    data: post\n  });\n});` },
      callout: { type: 'danger', t: '**Lỗ hổng Mass Assignment**: Lệnh nguy hiểm `Object.assign(post, req.body)` cho phép kẻ xấu cố tình gửi `{"id": 999, "authorId": 1, "role": "admin"}` để chiếm quyền hoặc phá hoại cơ sở dữ liệu! Luôn dùng **Whitelist**!' }
    },
    {
      title: 'DELETE — Xóa bản ghi & Trả mã 204 No Content', badge: 'LIVE CODING', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `// DELETE /api/v1/posts/:id\nrouter.delete('/:id', (req, res) => {\n  const id = Number(req.params.id);\n  const index = posts.findIndex(p => p.id === id);\n\n  if (index === -1) {\n    return res.status(404).json({\n      success: false,\n      error: { message: \`Không tìm thấy bài viết \${id} để xóa\` }\n    });\n  }\n\n  // Xóa phần tử khỏi mảng dữ liệu:\n  posts.splice(index, 1);\n\n  // Phản hồi 204 No Content:\n  res.sendStatus(204);\n});` },
      bullets: [
        '**Quy chuẩn HTTP DELETE**:',
        '• Khi xóa thành công, trả về status **204 No Content** — Thân response không chứa bất kỳ ký tự nào.',
        '• Nếu ID không tồn tại, trả về **404 Not Found**.',
        '• Trình duyệt hoặc Postman sẽ không hiển thị preview JSON body đối với mã 204.'
      ]
    },
    {
      title: 'Soft Delete vs Hard Delete trong Hệ thống Thực tế', layout: 'split', ratio: '1.05fr .95fr',
      cols: [
        { h: '💥 Hard Delete (Xóa cứng vĩnh viễn)', cls: 'bad', bullets: [
          '• Xóa đứt đoạn dòng dữ liệu khỏi bảng (`DELETE FROM posts WHERE id = 5;`).',
          '• **Hậu quả**: Không thể khôi phục khi người dùng xóa nhầm; phá vỡ ràng buộc khóa ngoại (Foreign Key Integrity) đối với bảng đơn hàng, bình luận liên quan.'
        ] },
        { h: '🛡️ Soft Delete (Xóa mềm - Khuyên dùng)', cls: 'good', bullets: [
          '• Không xóa dữ liệu thực tế, chỉ gán cờ thời gian: `isDeleted = true` hoặc `deletedAt = new Date()`.',
          '• Khi truy vấn danh sách chỉ lấy bài chưa xóa: `WHERE deletedAt IS NULL`.',
          '• Cho phép tính năng "Thùng rác", khôi phục bài viết và kiểm toán lịch sử (Audit Trail).'
        ] }
      ],
      callout: { type: 'tip', t: 'Hầu hết các hệ thống doanh nghiệp lớn đều áp dụng cơ chế **Soft Delete** cho các tài nguyên cốt lõi.' }
    },
    {
      title: 'Validation thủ công: Đừng bao giờ tin tưởng Client', kicker: 'B05 · Nguyên tắc phòng thủ', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'validators/postValidator.js', lang: 'javascript', size: 'sm', src: `function validatePostInput(body) {\n  const errors = [];\n\n  if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 5) {\n    errors.push({ field: 'title', message: 'Tiêu đề bắt buộc và phải có ít nhất 5 ký tự' });\n  }\n\n  if (!body.content || typeof body.content !== 'string' || body.content.trim().length < 10) {\n    errors.push({ field: 'content', message: 'Nội dung bắt buộc và phải có ít nhất 10 ký tự' });\n  }\n\n  if (body.tags !== undefined && !Array.isArray(body.tags)) {\n    errors.push({ field: 'tags', message: 'Tags bắt buộc phải là một mảng chuỗi' });\n  }\n\n  return errors;\n}\n\nmodule.exports = { validatePostInput };` },
      bullets: [
        '**Nguyên tắc số 1 của an ninh web**:',
        '• Tuyệt đối không bao giờ tin cậy dữ liệu do người dùng hoặc client gửi lên.',
        '• Kể cả khi trang web Front-end đã có form validate bằng JavaScript, hacker vẫn có thể dùng Postman hoặc `curl` để bắn payload rác trực tiếp vào server.',
        '• Back-end luôn là chốt chặn bảo vệ cơ sở dữ liệu cuối cùng.'
      ]
    },
    {
      title: 'Tối ưu Router với router.param(\'id\')', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'routes/posts.js', lang: 'javascript', size: 'sm', src: `// Tự động kích hoạt mỗi khi URL có param :id\nrouter.param('id', (req, res, next, id) => {\n  const numId = Number(id);\n\n  if (isNaN(numId) || numId <= 0) {\n    return res.status(400).json({ success: false, error: { message: 'ID không hợp lệ' } });\n  }\n\n  const post = findPost(numId);\n  if (!post) {\n    return res.status(404).json({ success: false, error: { message: 'Không tìm thấy bài viết' } });\n  }\n\n  // Gắn đối tượng đã tìm thấy trực tiếp vào req để tái sử dụng:\n  req.targetPost = post;\n  next();\n});\n\n// Các route bên dưới trở nên siêu ngắn gọn:\nrouter.get('/:id', (req, res) => res.json({ success: true, data: req.targetPost }));\nrouter.delete('/:id', (req, res) => {\n  posts = posts.filter(p => p !== req.targetPost);\n  res.sendStatus(204);\n});` },
      bullets: [
        '**Lợi ích của `router.param`**:',
        '• Áp dụng nguyên lý **DRY (Don\'t Repeat Yourself)**: Không cần phải viết đi viết lại đoạn code `findPost` và check 404 trong từng hàm GET, PUT, PATCH, DELETE.',
        '• Tập trung logic kiểm tra hợp lệ của ID vào một nơi duy nhất.'
      ]
    },

    /* ---------- SECTION 04: LƯU TRỮ FILE & KIỂM THỬ POSTMAN ---------- */
    { kind: 'section', no: '04', title: 'Lưu trữ Dữ liệu Bền vững & Postman Automation', sub: 'Chống mất dữ liệu khi restart và tự động hóa toàn bộ quy trình kiểm thử API.' },
    {
      title: 'Lưu trữ File JSON Bền vững với fs/promises', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'data/fileStore.js', lang: 'javascript', size: 'sm', src: `const fs = require('fs/promises');\nconst path = require('path');\nconst FILE_PATH = path.join(__dirname, 'posts.json');\n\nasync function readPosts() {\n  try {\n    const raw = await fs.readFile(FILE_PATH, 'utf8');\n    return JSON.parse(raw);\n  } catch (err) {\n    // Nếu file chưa tồn tại (ENOENT), tạo mảng rỗng khởi đầu:\n    if (err.code === 'ENOENT') return [];\n    throw err;\n  }\n}\n\nasync function writePosts(data) {\n  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');\n}\n\nmodule.exports = { readPosts, writePosts };` },
      bullets: [
        '**Vì sao cần lưu xuống ổ đĩa?**',
        '• Lưu trong biến bộ nhớ RAM (`let posts = []`) sẽ **mất sạch dữ liệu** mỗi khi server restart hoặc nodemon kích hoạt tải lại code.',
        '• Dùng `fs/promises` giúp đọc ghi bất đồng bộ non-blocking, không làm treo Event Loop.',
        '• Đây là bước đệm tuyệt vời trước khi học lên hệ quản trị cơ sở dữ liệu MySQL ở Buổi 7.'
      ]
    },
    {
      title: 'Race Condition & Kỹ thuật Atomic Write khi Ghi File', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'data/atomicStore.js', lang: 'javascript', size: 'sm', src: `const fs = require('fs/promises');\nconst path = require('path');\nconst FILE = path.join(__dirname, 'posts.json');\nconst TMP_FILE = path.join(__dirname, 'posts.json.tmp');\n\n// Kỹ thuật Ghi nguyên tử (Atomic Write):\nasync function safeSavePosts(posts) {\n  const jsonContent = JSON.stringify(posts, null, 2);\n\n  // 1. Ghi toàn bộ nội dung ra một file tạm trước:\n  await fs.writeFile(TMP_FILE, jsonContent, 'utf8');\n\n  // 2. Đổi tên đè lên file chính (thao tác đổi tên ở cấp OS là nguyên tử):\n  await fs.rename(TMP_FILE, FILE);\n}\n\nmodule.exports = { safeSavePosts };` },
      bullets: [
        '**Mối nguy hiểm của việc ghi trực tiếp**:',
        '• Nếu server bị mất điện hoặc crash đúng lúc `fs.writeFile` đang ghi dở nửa chừng, file `posts.json` sẽ bị hỏng cấu trúc cú pháp JSON (corrupted) và không thể đọc lại được nữa!',
        '• **Kỹ thuật Atomic Write**: Ghi xong 100% ra file `.tmp` rồi mới gọi lệnh `rename` của hệ điều hành. Dữ liệu luôn an toàn nguyên vẹn.'
      ]
    },
    {
      title: 'Giới thiệu Postman & Thiết lập Environment', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Postman — Công cụ tối thượng của kỹ sư Back-end**:',
        '• Cho phép tạo, lưu trữ và giả lập mọi loại HTTP Request phức tạp (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, Headers, Body form/json).',
        '• **Postman Environment (Biến môi trường)**: Quản lý linh hoạt các biến như `baseUrl = http://localhost:3000/api/v1`.',
        '• Khi chuyển sang môi trường Staging hay Production, chỉ cần đổi active environment mà không cần phải gõ lại URL của từng request một!',
        '• Hỗ trợ quản lý API theo thư mục và Collection có cấu trúc khoa học.'
      ],
      img: { src: 'postman-icon.svg', cap: 'Hệ sinh thái kiểm thử và tự động hóa API với Postman', h: 360 }
    },
    {
      title: 'Postman Collection & Viết Test Script tự động', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'Postman Tests Tab', lang: 'javascript', size: 'sm', src: `// 1. Kiểm tra status code phải là 201 Created:\npm.test("Status code is 201 Created", function () {\n    pm.response.to.have.status(201);\n});\n\n// 2. Kiểm tra cờ success và định dạng JSON:\npm.test("Response body has success: true", function () {\n    const json = pm.response.json();\n    pm.expect(json.success).to.be.true;\n    pm.expect(json.data).to.be.an('object');\n    pm.expect(json.data.title).to.eql("Node.js Cơ bản");\n});\n\n// 3. Tự động lưu ID của bài viết vừa tạo vào biến môi trường:\nconst resData = pm.response.json().data;\npm.environment.set("createdPostId", resData.id);` },
      bullets: [
        '**Kiểm thử tự động hóa (Automated Testing)**:',
        '• Tab **Tests** trong Postman cho phép viết code JavaScript kiểm tra kết quả ngay sau khi request phản hồi.',
        '• Chuỗi mắt xích thông minh: Request POST tự lưu `createdPostId` ➔ Request GET tiếp theo tự động dùng `{{baseUrl}}/posts/{{createdPostId}}` để xác minh!'
      ]
    },
    {
      title: 'Chạy Tự động Kiểm thử Hồi quy với Postman Collection Runner', layout: 'split', ratio: '1.1fr .9fr',
      steps: [
        { h: '1. Chọn Collection', p: 'Mở Collection "DevBlog Posts CRUD" trong Postman' },
        { h: '2. Mở Collection Runner', p: 'Nhấn nút "Run Collection" ở góc trên bên phải' },
        { h: '3. Chọn Environment', p: 'Chọn môi trường "Local Dev (Port 3000)"' },
        { h: '4. Thực thi hàng loạt', p: 'Postman sẽ chạy tuần tự toàn bộ 10-20 requests theo đúng thứ tự logic nghiệp vụ' },
        { h: '5. Đọc Báo cáo kết quả', p: 'Mọi ca kiểm thử thành công hiển thị xanh (Pass), phát hiện ngay lỗi hồi quy (Regression)' }
      ],
      img: { src: 'postman-icon.svg', cap: 'Quy trình kiểm thử hồi quy tự động API bằng Postman Collection Runner', h: 420 },
      callout: { type: 'tip', t: 'Trước mỗi lần commit hoặc deploy lên server, hãy chạy Collection Runner để đảm bảo không một tính năng cũ nào bị hỏng!' }
    },
    {
      title: 'Kiểm tra nhanh kiến thức Buổi 5', badge: 'QUIZ',
      quiz: {
        q: 'Client gửi request POST /api/v1/users để đăng ký tài khoản với địa chỉ email đã có người dùng khác đăng ký trước đó. Mã HTTP Status Code nào là chuẩn mực RESTful nhất để phản hồi?',
        opts: [
          '200 OK kèm thông báo { "error": "Email đã tồn tại" }',
          '400 Bad Request',
          '404 Not Found',
          '409 Conflict'
        ],
        a: 3,
        why: '**409 Conflict**: Request hoàn toàn hợp lệ về mặt cú pháp JSON và kiểu dữ liệu, nhưng bị xung đột trực tiếp với trạng thái hiện tại của cơ sở dữ liệu (tài nguyên email bị trùng lặp). Mã 400 chỉ nên dùng khi dữ liệu sai định dạng (vd: thiếu trường, không đúng định dạng email).'
      }
    }
  ],
  recap: [
    'REST: **Tài nguyên** = danh từ số nhiều trong URL, **Hành động** = HTTP method (GET, POST, PUT, PATCH, DELETE).',
    'Richardson Maturity Model: Phấn đấu đạt chuẩn **Level 2** với Verbs và Status Code chuẩn mực.',
    'CRUD ↔ GET / POST / PUT · PATCH / DELETE; Sử dụng đúng mã trạng thái **200 · 201 · 204 · 400 · 401 · 403 · 404 · 409**.',
    'Chuẩn hóa cấu trúc Response `{ success, data, meta }` và Error Response `{ success: false, error }` nhất quán.',
    'Bảo mật dữ liệu: Luôn kiểm tra validation ở Back-end và dùng **Whitelist** chống lỗ hổng Mass Assignment.',
    'Lưu trữ file JSON an toàn bằng kỹ thuật **Atomic Write** và tự động hóa kiểm thử với **Postman Collection Runner**.'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Thiết kế REST API trên giấy',
      desc: 'Thiết kế (chưa viết code) hệ thống REST API cho ứng dụng **Quản lý Thư viện Sách**: Sách (books), Tác giả (authors), Độc giả (members), Phiếu mượn (borrowings).',
      tasks: [
        'Liệt kê đầy đủ các endpoint: HTTP Method + URL Path + Ý nghĩa nghiệp vụ + HTTP Status thành công.',
        'Thiết kế ít nhất 2 tài nguyên có quan hệ lồng nhau (vd: Danh sách sách của một tác giả cụ thể).',
        'Thiết kế endpoint tìm kiếm, lọc và phân trang bằng Query String.',
        'Đổi chéo bản thiết kế với bạn cùng lớp để phản biện (review): Có endpoint nào bị phạm quy tắc dùng động từ trong URL không?'
      ],
      hints: [
        'Mượn một cuốn sách tương đương với hành động **tạo mới một phiếu mượn**: `POST /api/v1/borrowings`',
        'Trả sách tương đương với hành động **cập nhật trạng thái phiếu**: `PATCH /api/v1/borrowings/:id`'
      ]
    },
    {
      level: 'core', time: 45, title: 'Xây dựng CRUD Products (In-memory)',
      desc: 'Xây dựng hoàn chỉnh bộ API CRUD cho tài nguyên **products** có cấu trúc: `{ id, name, price, stock, category }`.',
      tasks: [
        '`GET /api/v1/products` hỗ trợ query params: `?category=` (lọc chính xác) và `?q=` (tìm kiếm tương đối theo tên).',
        '`GET /api/v1/products/:id` — Trả về 404 nếu không tìm thấy, 400 nếu id không phải là số nguyên dương.',
        '`POST /api/v1/products` — Validate: `name` ≥ 2 ký tự, `price` > 0, `stock` là số nguyên ≥ 0 → Trả về **201 Created**.',
        '`PUT` (thay thế toàn bộ) và `PATCH` (áp dụng whitelist) cập nhật sản phẩm.',
        '`DELETE /api/v1/products/:id` — Xóa sản phẩm và trả về **204 No Content**.',
        'Toàn bộ các response đều phải tuân thủ chuẩn cấu trúc Envelope `{ success, data }`.'
      ],
      expected: 'POST /api/v1/products {"name":"Bút chì","price":-10}\n→ 400 Bad Request\n{"success":false,"error":{"message":"Dữ liệu không hợp lệ","details":[{"field":"price","message":"Giá phải lớn hơn 0"}]}}',
      hints: [
        'Tạo các hàm helper tiện ích: `ok(res, data, status=200)` và `fail(res, status, message, details)`',
        'Kiểm tra số nguyên: `Number.isInteger(stock) && stock >= 0`'
      ],
      solution: {
        file: 'routes/products.js', lang: 'javascript', size: 'sm',
        src: `const router = require('express').Router();\n\nlet products = [\n  { id: 1, name: 'Bút bi Thiên Long', price: 5000, stock: 100, category: 'stationery' },\n  { id: 2, name: 'Sổ tay bìa da', price: 45000, stock: 30, category: 'stationery' }\n];\nlet nextId = 3;\n\nconst ok = (res, data, status = 200) => res.status(status).json({ success: true, data });\nconst fail = (res, status, message, details) => res.status(status).json({ success: false, error: { message, details } });\n\nfunction validateProduct(body, isPatch = false) {\n  const errors = [];\n  if (!isPatch || body.name !== undefined) {\n    if (typeof body.name !== 'string' || body.name.trim().length < 2) errors.push({ field: 'name', message: 'Tên phải từ 2 ký tự' });\n  }\n  if (!isPatch || body.price !== undefined) {\n    if (typeof body.price !== 'number' || body.price <= 0) errors.push({ field: 'price', message: 'Giá phải là số lớn hơn 0' });\n  }\n  if (!isPatch || body.stock !== undefined) {\n    if (!Number.isInteger(body.stock) || body.stock < 0) errors.push({ field: 'stock', message: 'Tồn kho phải là số nguyên >= 0' });\n  }\n  return errors;\n}\n\nrouter.param('id', (req, res, next, id) => {\n  const numId = Number(id);\n  if (isNaN(numId) || numId <= 0) return fail(res, 400, 'ID sản phẩm không hợp lệ');\n  req.product = products.find(p => p.id === numId);\n  if (!req.product) return fail(res, 404, 'Không tìm thấy sản phẩm');\n  next();\n});\n\nrouter.get('/', (req, res) => {\n  const { category, q } = req.query;\n  let result = products;\n  if (category) result = result.filter(p => p.category === category);\n  if (q) result = result.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));\n  ok(res, result);\n});\n\nrouter.get('/:id', (req, res) => ok(res, req.product));\n\nrouter.post('/', (req, res) => {\n  const errors = validateProduct(req.body);\n  if (errors.length) return fail(res, 400, 'Dữ liệu không hợp lệ', errors);\n  const { name, price, stock, category = 'general' } = req.body;\n  const newProduct = { id: nextId++, name: name.trim(), price, stock, category };\n  products.push(newProduct);\n  ok(res, newProduct, 201);\n});\n\nrouter.put('/:id', (req, res) => {\n  const errors = validateProduct(req.body);\n  if (errors.length) return fail(res, 400, 'Dữ liệu không hợp lệ', errors);\n  const { name, price, stock, category = 'general' } = req.body;\n  Object.assign(req.product, { name: name.trim(), price, stock, category, updatedAt: new Date() });\n  ok(res, req.product);\n});\n\nrouter.patch('/:id', (req, res) => {\n  const errors = validateProduct(req.body, true);\n  if (errors.length) return fail(res, 400, 'Dữ liệu không hợp lệ', errors);\n  const allowed = ['name', 'price', 'stock', 'category'];\n  for (const key of allowed) {\n    if (req.body[key] !== undefined) req.product[key] = req.body[key];\n  }\n  req.product.updatedAt = new Date();\n  ok(res, req.product);\n});\n\nrouter.delete('/:id', (req, res) => {\n  products = products.filter(p => p !== req.product);\n  res.sendStatus(204);\n});\n\nmodule.exports = router;`
      },
      solutionNote: 'Áp dụng router.param giúp kiểm tra ID và tìm sản phẩm một lần duy nhất, tránh trùng lặp code.'
    },
    {
      level: 'core', time: 25, title: 'Sắp xếp & Phân trang Sản phẩm',
      desc: 'Bổ sung tính năng phân trang và sắp xếp nhiều tiêu chí cho endpoint `GET /api/v1/products`.',
      tasks: [
        'Hỗ trợ tham số sắp xếp: `?sort=price` (tăng dần) và `?sort=-price` (giảm dần). Cho phép xếp theo `name`, `price`, `stock`.',
        'Hỗ trợ phân trang: `?page=1&limit=5`. Giá trị mặc định là `page=1`, `limit=10`, cận trên tối đa `limit=50`.',
        'Trả về cấu trúc metadata chuẩn: `meta: { page, limit, total, totalPages }`.'
      ],
      hints: [
        'Tạo bản sao mảng trước khi sort để không làm biến dạng mảng gốc: `[...items].sort(...)`',
        'Tính chỉ số mảng cắt: `items.slice((page - 1) * limit, page * limit)`'
      ]
    },
    {
      level: 'core', time: 20, title: 'Tạo Postman Collection có Automated Tests',
      desc: 'Viết bộ kiểm thử hồi quy tự động hoàn chỉnh cho tài nguyên Products trong Postman.',
      tasks: [
        'Tạo Environment `DevBlog Local` với biến `baseUrl = http://localhost:3000/api/v1`.',
        'Request POST tự động lưu `productId` vào biến môi trường bằng script Tests.',
        'Mọi request đều có ít nhất một assertion kiểm tra HTTP Status Code chính xác (200, 201, 204, 400, 404).',
        'Chạy Collection Runner và chụp lại báo cáo toàn bộ các test cases đều đạt màu xanh (Pass).'
      ],
      hints: [
        'pm.test("Status code is 201", () => pm.response.to.have.status(201));',
        'pm.environment.set("productId", pm.response.json().data.id);'
      ]
    },
    {
      level: 'challenge', time: 40, title: 'Lưu trữ File JSON an toàn với Atomic Write',
      desc: 'Nâng cấp toàn bộ hệ thống lưu trữ Products từ RAM sang lưu bền vững trong file `data/products.json` dùng `fs/promises`.',
      tasks: [
        'Xây dựng module `data/productStore.js` gồm các hàm: `readAll()`, `writeAll(items)`.',
        'Áp dụng cơ chế **Atomic Write**: ghi ra file tạm `.tmp` trước rồi dùng `fs.rename` đè lên file chính.',
        'Cấu hình file `nodemon.json` để nodemon không tự động restart server mỗi khi file JSON trong thư mục `data/` thay đổi.',
        'Chuyển đổi toàn bộ các route handler sang hàm bất đồng bộ `async/await` an toàn.'
      ]
    },
    {
      level: 'homework', time: 50, title: 'Giao diện Quản trị Sản phẩm (Front-end Fetch API)',
      desc: 'Dựng một trang giao diện HTML/CSS/JS thuần kết nối gọi trực tiếp bộ REST API Products vừa xây dựng.',
      tasks: [
        'Hiển thị bảng danh sách sản phẩm, có ô tìm kiếm tức thời và bộ lọc danh mục.',
        'Form thêm mới và cập nhật sản phẩm (dùng chung một modal/form linh hoạt).',
        'Nút Xóa sản phẩm có hộp thoại xác nhận `confirm()` trước khi gửi request DELETE.',
        'Bộ nút chuyển trang [Trang trước / Trang sau] dựa trên thông tin `meta.totalPages` từ API.'
      ]
    },
    {
      level: 'project', time: 40, title: 'Đồ án DevBlog Cột mốc 1: Hoàn thiện CRUD Bài viết',
      desc: 'Cột mốc chính thức đầu tiên của đồ án cuối khóa DevBlog.',
      tasks: [
        'Hoàn thiện toàn bộ các route `/api/v1/posts` lưu trữ bền vững vào file JSON.',
        'Tự động sinh `slug` thân thiện SEO từ `title` (vd: "Học Node" ➔ "hoc-node"); nếu trùng slug trả về **409 Conflict**.',
        'Endpoint `GET /api/v1/posts/:idOrSlug` thông minh nhận diện cả ID số lẫn Slug chuỗi.',
        'Export Postman Collection hoàn chỉnh vào thư mục `docs/DevBlog.postman_collection.json` của dự án.'
      ]
    }
  ],
  project: {
    lead: '**Cột mốc 1**: DevBlog có bộ REST API CRUD bài viết hoàn chỉnh và kiểm thử tự động.',
    tasks: [
      'CRUD `/api/v1/posts` đầy đủ với slug tự sinh và lưu trữ bền vững',
      'Hỗ trợ lọc theo `?tag=`, tìm kiếm `?q=` và phân trang chuẩn mực',
      'Postman Collection hoàn chỉnh export vào thư mục `docs/`'
    ],
    callout: { type: 'tip', t: 'Buổi 6 chúng ta sẽ tái cấu trúc toàn bộ mã nguồn này sang mô hình kiến trúc MVC chuyên nghiệp — hãy commit Git cẩn thận trước buổi học!' }
  }
};
