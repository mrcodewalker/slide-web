/* ============================================================
   CURRICULUM — Khung chương trình Back-end NodeJS (CT9)
   Dùng chung cho index.html, present.html, exercises.html
   ============================================================ */
window.COURSE = {
  name: "Back-end NodeJS với Express",
  className: "CT9",
  hours: "3 giờ / buổi",
  stack: ["Node.js 20+", "Express 4", "MySQL 8", "Sequelize", "JWT", "Postman"],
  project: {
    name: "DevBlog API",
    desc: "Nền tảng blog mini: đăng ký / đăng nhập, viết bài, bình luận, gắn thẻ, upload ảnh đại diện — front-end HTML/CSS/JS thuần gọi API do chính học viên viết.",
    milestones: [
      "B5 — Khởi tạo project, CRUD bài viết (in-memory)",
      "B6 — Tái cấu trúc MVC + cấu hình .env",
      "B7–B8 — Thiết kế DB MySQL + Sequelize (User, Post, Comment, Tag)",
      "B9–B10 — Đăng ký / đăng nhập JWT + phân quyền",
      "B11 — Upload ảnh, phân trang, tích hợp Front-end",
      "B12 — Test, Swagger, deploy & bảo vệ đồ án"
    ]
  },
  phases: [
    { id: "FE", name: "Nền tảng Front-End", color: "#ed8936", sessionIds: ["fe1", "fe2", "fe3"] },
    { id: "A", name: "Nền tảng Node", color: "#68d391", range: [1, 2] },
    { id: "B", name: "Express & REST", color: "#4fd1c5", range: [3, 6] },
    { id: "C", name: "Database", color: "#63b3ed", range: [7, 8] },
    { id: "D", name: "Bảo mật", color: "#b794f4", range: [9, 10] },
    { id: "E", name: "Hoàn thiện & Deploy", color: "#f6ad55", range: [11, 12] }
  ],
  phaseOf: function (n) {
    return this.phases.find(p => {
      if (p.sessionIds && p.sessionIds.includes(String(n))) return true;
      if (typeof n === 'number' && p.range) return n >= p.range[0] && n <= p.range[1];
      return false;
    }) || this.phases[0];
  },
  sessions: [
    {
      n: "fe1", code: "FE01", icon: "🌐", title: "HTML5 & Cấu trúc ngữ nghĩa Web",
      subtitle: "Cấu trúc tài liệu chuẩn, semantic tags, forms, input types, validation và accessibility.",
      topics: ["HTML5 Syntax", "DOM Tree", "Semantic Tags", "Forms & Inputs", "Attributes & a11y", "DevTools Elements"],
      outcomes: [
        "Hiểu cấu trúc tài liệu chuẩn HTML5 và cách trình duyệt phân tích thành DOM tree",
        "Sử dụng thành thạo các thẻ ngữ nghĩa (header, nav, main, article, section, aside, footer)",
        "Thiết kế biểu mẫu (forms) thu thập dữ liệu với các input type hiện đại và validation native",
        "Nắm vững các nguyên tắc cơ bản về khả năng truy cập (Accessibility - a11y) và SEO"
      ]
    },
    {
      n: "fe2", code: "FE02", icon: "🎨", title: "CSS3 hiện đại: Box Model, Flexbox & Grid",
      subtitle: "Từ cách tính kích thước phần tử đến dàn trang responsive đa màn hình bằng Flexbox & Grid.",
      topics: ["Box Model", "box-sizing", "Specificity", "Flexbox 1D", "CSS Grid 2D", "Media Queries"],
      outcomes: [
        "Nắm vững Box Model, cách tính margin/padding và lý do luôn dùng box-sizing: border-box",
        "Làm chủ Flexbox để căn chỉnh, sắp xếp và phân bố không gian linh hoạt 1 chiều",
        "Xây dựng bố cục 2 chiều phức tạp cho website bằng CSS Grid",
        "Thiết kế giao diện thích ứng responsive trên Mobile, Tablet và Desktop với Media Queries"
      ]
    },
    {
      n: "fe3", code: "FE03", icon: "⚡", title: "JavaScript Front-end: DOM, Events & Fetch API",
      subtitle: "Thao tác phần tử giao diện, bắt sự kiện người dùng và gọi REST API bất đồng bộ với fetch.",
      topics: ["DOM Selection", "Event Listener", "Event Bubbling", "Form Handling", "Fetch API", "Async/Await UI"],
      outcomes: [
        "Truy vấn và thao tác DOM động (querySelector, innerHTML, classList, createElement)",
        "Lắng nghe và xử lý sự kiện (click, submit, input) kèm event.preventDefault() và event bubbling",
        "Gửi và nhận dữ liệu JSON với máy chủ backend bằng Fetch API và async/await",
        "Render dữ liệu động từ API lên giao diện và xử lý trạng thái Loading / Error mượt mà"
      ]
    },
    {
      n: 1, icon: "🟢", title: "Nhập môn Back-end & Node.js",
      subtitle: "Web vận hành thế nào? Node là gì? Chạy dòng code đầu tiên phía server.",
      topics: ["Client–Server", "HTTP", "V8 & Event Loop", "npm", "CommonJS", "fs · path · os"],
      outcomes: [
        "Giải thích được mô hình Client–Server và vòng đời một HTTP request",
        "Hiểu Node.js là gì, khác gì JavaScript trên trình duyệt",
        "Cài đặt Node, dùng npm, tạo và chạy module",
        "Đọc/ghi file bằng module fs"
      ]
    },
    {
      n: 2, icon: "⏳", title: "JavaScript bất đồng bộ & HTTP Server thuần",
      subtitle: "Callback → Promise → async/await, rồi tự dựng server không cần framework.",
      topics: ["Callback", "Promise", "async/await", "ESM vs CJS", "http module", "Routing thủ công"],
      outcomes: [
        "Viết code bất đồng bộ bằng Promise và async/await",
        "Biết dùng fs/promises và EventEmitter",
        "Tạo HTTP server bằng module http và tự xử lý route",
        "Cảm nhận được nỗi đau → lý do cần Express"
      ]
    },
    {
      n: 3, icon: "🚂", title: "Express căn bản",
      subtitle: "Từ 50 dòng http thuần xuống 5 dòng Express. Routing, request, response.",
      topics: ["Express app", "Routing", "req · res", "params · query · body", "Static files", "Postman"],
      outcomes: [
        "Khởi tạo project Express với nodemon",
        "Định nghĩa route cho GET / POST / PUT / DELETE",
        "Đọc params, query string, JSON body",
        "Phục vụ front-end HTML/CSS/JS bằng express.static"
      ]
    },
    {
      n: 4, icon: "🧅", title: "Middleware & Routing nâng cao",
      subtitle: "Trái tim của Express: chuỗi middleware, Router module, xử lý lỗi.",
      topics: ["Middleware chain", "express.Router", "morgan · cors", "Error handler", "404", "Form → API"],
      outcomes: [
        "Hiểu cơ chế next() và thứ tự middleware",
        "Tách route thành nhiều file bằng express.Router",
        "Viết middleware tự định nghĩa (logger, auth giả lập)",
        "Xây error-handling middleware tập trung"
      ]
    },
    {
      n: 5, icon: "🔌", title: "Thiết kế REST API & CRUD",
      subtitle: "Chuẩn REST, status code, validation. Khởi động đồ án DevBlog API.",
      topics: ["REST", "Resource & URL", "Status code", "CRUD", "Validation", "Postman Collection"],
      outcomes: [
        "Thiết kế URL & phương thức HTTP đúng chuẩn REST",
        "Trả status code và JSON response nhất quán",
        "Cài đặt CRUD đầy đủ (dữ liệu in-memory / file JSON)",
        "Kiểm thử API bằng Postman"
      ]
    },
    {
      n: 6, icon: "🏗️", title: "Kiến trúc dự án: MVC & Cấu hình",
      subtitle: "Từ một file index.js 300 dòng đến dự án có cấu trúc chuyên nghiệp.",
      topics: ["MVC", "Controller–Service", "dotenv", "Folder structure", "asyncHandler", "AppError"],
      outcomes: [
        "Tổ chức project theo routes / controllers / services",
        "Quản lý cấu hình bằng biến môi trường (.env)",
        "Xử lý lỗi async tập trung với AppError",
        "Tái cấu trúc DevBlog API theo MVC"
      ]
    },
    {
      n: 7, icon: "🐬", title: "MySQL & kết nối từ Node",
      subtitle: "Thiết kế CSDL quan hệ, viết SQL, dùng mysql2 và chống SQL Injection.",
      topics: ["ER Diagram", "DDL · DML", "JOIN", "mysql2", "Connection Pool", "SQL Injection"],
      outcomes: [
        "Vẽ ER diagram và chuẩn hóa cơ bản cho DevBlog",
        "Viết SELECT / INSERT / UPDATE / DELETE / JOIN",
        "Kết nối MySQL bằng mysql2 + Connection Pool",
        "Hiểu và phòng chống SQL Injection bằng prepared statement"
      ]
    },
    {
      n: 8, icon: "🧬", title: "ORM với Sequelize",
      subtitle: "Thao tác database bằng object JavaScript: model, quan hệ, migration.",
      topics: ["ORM", "Model", "Associations", "Migration", "Query nâng cao", "Transaction"],
      outcomes: [
        "Định nghĩa Model và đồng bộ với MySQL",
        "Khai báo quan hệ 1–N và N–N (include / eager loading)",
        "Dùng migration để quản lý phiên bản schema",
        "Dùng transaction cho thao tác nhiều bước"
      ]
    },
    {
      n: 9, icon: "🔐", title: "Authentication: bcrypt & JWT",
      subtitle: "Đăng ký, đăng nhập, lưu mật khẩu an toàn và cấp token.",
      topics: ["Hash & Salt", "bcrypt", "JWT", "Login flow", "Bearer token", "Refresh token"],
      outcomes: [
        "Phân biệt authentication và authorization",
        "Băm mật khẩu bằng bcrypt, không bao giờ lưu plain text",
        "Cấp và xác thực JWT",
        "Cài đặt API /auth/register và /auth/login"
      ]
    },
    {
      n: 10, icon: "🛡️", title: "Authorization & Bảo mật API",
      subtitle: "Ai được làm gì? Phân quyền, validation và các lỗ hổng phổ biến.",
      topics: ["Auth middleware", "RBAC", "Joi / validator", "helmet", "Rate limit", "OWASP Top 10"],
      outcomes: [
        "Viết middleware xác thực và phân quyền theo role / ownership",
        "Validate dữ liệu đầu vào bằng Joi",
        "Cấu hình helmet, CORS, rate limiting",
        "Nhận diện các lỗ hổng OWASP thường gặp"
      ]
    },
    {
      n: 11, icon: "📦", title: "Tính năng thực tế & Tích hợp Front-end",
      subtitle: "Upload file, phân trang, tìm kiếm — và nối API với giao diện HTML/JS.",
      topics: ["multer", "Pagination", "Search · Sort", "CORS", "fetch từ FE", "Lưu token"],
      outcomes: [
        "Upload và phục vụ file ảnh với multer",
        "Cài đặt phân trang, tìm kiếm, sắp xếp",
        "Gọi API từ front-end bằng fetch (kèm token)",
        "Xử lý CORS đúng cách"
      ]
    },
    {
      n: 12, icon: "🚀", title: "Testing, Tài liệu & Deploy",
      subtitle: "Kiểm thử tự động, Swagger, Git workflow, đưa ứng dụng lên Internet.",
      topics: ["Jest · Supertest", "Swagger · OpenAPI", "Git & GitHub", ".gitignore & .env", "Render Cloud Deploy", "Bảo vệ đồ án"],
      outcomes: [
        "Viết test API tự động với Jest + Supertest",
        "Viết tài liệu API bằng Swagger / OpenAPI 3.0",
        "Quản lý mã nguồn với Git, bảo mật .gitignore và .env.example",
        "Deploy lên Cloud (Render / Railway) qua Git push tự động cấp HTTPS",
        "Trình bày và bảo vệ đồ án DevBlog"
      ]
    }
  ]
};

/* Registry cho nội dung chi tiết từng buổi (js/sessions/sXX.js) */
window.SESSION_DATA = window.SESSION_DATA || {};
