/* ============================================================
   BUỔI 12 — Testing, Tài liệu Swagger, Quy Trình Git & Triển Khai Cloud
   ============================================================ */
SESSION_DATA[12] = {
  intro: 'Buổi cuối cùng hoàn thiện bức tranh của một lập trình viên Back-end chuyên nghiệp: kiểm thử tự động với Jest & Supertest để tự tin refactor code, sinh tài liệu API sống động với Swagger/OpenAPI 3.0, quản lý mã nguồn bài bản với Git & GitHub, bảo mật biến môi trường với .gitignore, và đưa API lên môi trường Internet công khai cực dễ dàng với Render.com và MySQL Cloud. Tổng kết toàn diện khóa học và bảo vệ đồ án DevBlog API!',
  agenda: [
    { min: 10, t: 'Ôn B11 & Bức tranh Production Ready', d: 'Sự khác biệt giữa code đồ án chạy localhost và code vận hành môi trường Production' },
    { min: 35, t: 'Kiểm thử tự động: Jest & Supertest', d: 'Test Pyramid, Unit Test Service, Mocking Database, Integration Test REST API endpoints' },
    { min: 30, t: 'Chuẩn hóa tài liệu: OpenAPI & Swagger UI', d: 'Đặc tả OpenAPI 3.0, JSDoc annotations, cấu hình Bearer Auth, sandbox tương tác /api-docs' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 35, t: 'Quy Trình Git & Chuẩn Bị Dự Án', d: '4 Không gian lưu trữ Git, .gitignore, .env.example, Conventional Commits, README.md' },
    { min: 35, t: 'Triển Khai Cloud Dễ Dàng (Render.com)', d: 'Zero-docker deploy via Git push, HTTPS tự động, MySQL Cloud, Health check & CORS' },
    { min: 25, t: 'Tổng kết 12 buổi học & Bảo vệ Đồ án', d: 'Hành trình từ Zero đến Back-end Engineer, thang điểm đồ án DevBlog API, định hướng tương lai' },
    { min: 10, t: 'Trao chứng chỉ & Bế mạc khóa học', d: '' }
  ],
  slides: [
    /* ============================================================
       SECTION 01: KIỂM THỬ TỰ ĐỘNG VỚI JEST & SUPERTEST
       ============================================================ */
    { kind: 'section', no: '01', title: 'Kiểm thử Tự động với Jest & Supertest', sub: 'Tự tin tái cấu trúc (refactor), nâng cấp thư viện và mở rộng tính năng mà không bao giờ sợ làm hỏng code cũ.' },

    {
      title: 'Triết lý Kiểm thử Phần mềm & Tháp Kiểm thử (Test Pyramid)', kicker: 'B12 · Section 01: Testing',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Tại sao kiểm thử thủ công bằng Postman là không đủ?**',
        '• Khi dự án có 50+ endpoints, mỗi lần sửa 1 dòng code, bạn không thể bấm tay test lại 50 endpoints trong Postman!',
        '• **Regression Bug (Lỗi hồi quy)**: Sửa tính năng A lại vô tình làm hỏng tính năng B mà không ai phát hiện cho đến khi người dùng khiếu nại trên Production.',
        '**Mô hình Tháp Kiểm thử chuẩn công nghiệp (Mike Cohn Test Pyramid)**:',
        '• **Unit Tests (Chân tháp - 70%)**: Kiểm tra các hàm logic cô lập, chạy siêu nhanh (vài mili-giây), chi phí bảo trì thấp nhất.',
        '• **Integration Tests (Thân tháp - 20%)**: Kiểm tra sự liên kết giữa các tầng (Route ➔ Middleware ➔ Controller ➔ Service ➔ Database).',
        '• **End-to-End Tests (Đỉnh tháp - 10%)**: Mô phỏng toàn bộ trải nghiệm từ trình duyệt Front-end tới Back-end, chạy chậm và tốn kém nhất.'
      ],
      img: { src: 'test-pyramid.svg', cap: 'Mô hình Tháp kiểm thử tự động (Test Pyramid) chuẩn công nghiệp', h: 320 },
      notes: 'Giảng viên phân tích: Nhiều lập trình viên mới vào nghề hay lười viết test vì nghĩ tốn thời gian. Nhưng chi phí tìm và sửa một con bug trên môi trường Production đắt gấp 100 lần việc phát hiện nó ngay trong lúc chạy Unit test tại localhost!'
    },

    {
      title: 'Giải Phẫu Jest Testing Framework & Assertion Matchers', kicker: 'B12 · Section 01: Testing',
      layout: 'split', ratio: '1fr 1fr',
      bullets: [
        '**Jest là gì?**',
        '• Framework kiểm thử mã nguồn mở phổ biến nhất hệ sinh thái JavaScript/Node.js, được phát triển bởi Facebook (Meta).',
        '• Tích hợp sẵn bộ chạy test (Test Runner), thư viện so sánh kết quả (Assertion Library), và công cụ tạo Mock/Spy mà không cần cài thêm thư viện phụ trợ.',
        '**Bộ cú pháp BDD (Behavior-Driven Development)**:',
        '• `describe(suiteName, fn)`: Nhóm các ca kiểm thử liên quan theo module hoặc feature.',
        '• `it(caseName, fn)` / `test()`: Định nghĩa một ca kiểm thử cụ thể.',
        '• `expect(received).matcher(expected)`: Các hàm so sánh kết quả kỳ vọng.',
        '• Các matchers thông dụng: `.toBe()` (so sánh nguyên thủy ===), `.toEqual()` (so sánh sâu object/array), `.toHaveProperty()`, `.toContain()`, `.toThrow()`.',
        '• Lifecycle Hooks: `beforeAll()`, `beforeEach()`, `afterEach()`, `afterAll()` dùng để chuẩn bị và dọn dẹp dữ liệu test.'
      ],
      img: { src: 'jest-logo.svg', cap: 'Jest — Testing framework số 1 thế giới cho JavaScript & Node.js', h: 260 },
      callout: { type: 'tip', t: 'Quy tắc đặt tên file test: Luôn đặt tên file có đuôi `.test.js` hoặc `.spec.js` trong thư mục `tests/`. Jest sẽ tự động tìm và thực thi tất cả các file này.' }
    },

    {
      title: 'Unit Test cho Pure Function & Business Logic', badge: 'LIVE CODING',
      term: '$ npm install --save-dev jest',
      code: { file: 'tests/unit/post.utils.test.js', lang: 'javascript', size: 'xs', src: `const { calculateReadingTime, slugifyTitle } = require('../../src/utils/post.util');

describe('Post Utilities (Unit Tests)', () => {
  describe('slugifyTitle()', () => {
    it('Chuyển đổi tiêu đề có dấu tiếng Việt thành slug URL an toàn', () => {
      const input = 'Khóa Học Lập Trình Node.js & Express Toàn Diện!';
      const result = slugifyTitle(input);
      expect(result).toBe('khoa-hoc-lap-trinh-node-js-express-toan-dien');
    });

    it('Xóa bỏ khoảng trắng thừa và ký tự đặc biệt nguy hiểm', () => {
      const input = '   Bảo Mật API <script>alert(1)</script>   ';
      const result = slugifyTitle(input);
      expect(result).toBe('bao-mat-api-alert-1');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });
  });

  describe('calculateReadingTime()', () => {
    it('Tính đúng số phút đọc ước tính dựa trên 200 từ/phút', () => {
      const text400Words = new Array(400).fill('nodejs').join(' ');
      const minutes = calculateReadingTime(text400Words);
      expect(minutes).toBe(2);
    });

    it('Bài viết ngắn dưới 200 từ mặc định trả về tối thiểu 1 phút', () => {
      const shortText = 'Xin chào thế giới';
      expect(calculateReadingTime(shortText)).toBe(1);
    });
  });
});` },
      callout: { type: 'info', t: 'Pure Functions (hàm thuần túy) không phụ thuộc I/O, không gọi DB là những hàm dễ viết Unit test nhất và có tỷ lệ tái sử dụng cao nhất trong hệ thống.' }
    },

    {
      title: 'Kỹ Thuật Mocking trong Jest: Cô Lập Database & Network', kicker: 'B12 · Section 01: Testing',
      layout: 'split', ratio: '1.1fr .9fr',
      bullets: [
        '**Tại sao Unit Test không được kết nối Database thật?**',
        '• Khi Unit test kết nối Database thật: Test chạy chậm (từ vài mili-giây tăng lên vài giây), dễ bị lỗi do mất mạng, dữ liệu bị ghi đè lẫn nhau giữa các lần chạy.',
        '• **Mục tiêu của Mocking**: Thay thế các module I/O nặng (Database, SendGrid Email, Stripe Payment) bằng các hàm giả lập có thể kiểm soát kết quả trả về.',
        '**Các công cụ Mocking mạnh mẽ của Jest**:',
        '• `jest.fn()`: Tạo một hàm giả theo dõi số lần được gọi và tham số truyền vào.',
        '• `jest.mock(\'path/to/module\')`: Giả lập toàn bộ một module hoặc ORM Model.',
        '• `jest.spyOn(object, \'methodName\')`: Bắt chước hành vi của một method cụ thể mà vẫn giữ nguyên cấu trúc object.',
        '• Thiết lập kết quả trả về: `.mockResolvedValue(data)` cho async function, `.mockReturnValue(value)` cho sync function.'
      ],
      img: { src: 'unit-test-mocking.svg', cap: 'Mô hình Mocking: Cô lập hoàn toàn Database & Network khi chạy Unit Test', h: 320 },
      notes: 'Giảng viên nhấn mạnh: Khi viết Unit test cho Service, ta giả định Database hoạt động hoàn hảo. Ta chỉ kiểm tra logic nghiệp vụ: nếu user không tồn tại thì Service có throw NotFoundError không, nếu mật khẩu trùng thì có hash mật khẩu không.'
    },

    {
      title: 'Minh Họa Mocking UserService với Jest', badge: 'LIVE CODING',
      code: { file: 'tests/unit/user.service.test.js', lang: 'javascript', size: 'xs', src: `const userService = require('../../src/services/user.service');
const userRepository = require('../../src/repositories/user.repository');
const bcrypt = require('bcrypt');

// Giả lập module repository để không gọi CSDL thật
jest.mock('../../src/repositories/user.repository');

describe('UserService - Register Logic (Unit Test with Mocks)', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Xóa sạch lịch sử gọi hàm sau mỗi test case
  });

  it('Ném lỗi 409 nếu email đã tồn tại trong hệ thống', async () => {
    // 1. Arrange: Giả lập repository tìm thấy user đã tồn tại
    userRepository.findByEmail.mockResolvedValue({ id: 1, email: 'existed@ct9.vn' });

    // 2. Act & Assert: Kỳ vọng hàm ném lỗi Conflict
    await expect(userService.registerUser({
      email: 'existed@ct9.vn',
      password: 'password123'
    })).rejects.toThrow('Email đã được đăng ký');

    expect(userRepository.findByEmail).toHaveBeenCalledWith('existed@ct9.vn');
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
    expect(userRepository.create).not.toHaveBeenCalled(); // Đảm bảo không lưu bậy
  });

  it('Tạo user mới và hash mật khẩu thành công khi email hợp lệ', async () => {
    userRepository.findByEmail.mockResolvedValue(null); // Chưa tồn tại
    userRepository.create.mockResolvedValue({ id: 99, email: 'new@ct9.vn', name: 'New Student' });

    const result = await userService.registerUser({
      name: 'New Student',
      email: 'new@ct9.vn',
      password: 'plainPassword'
    });

    expect(result).toHaveProperty('id', 99);
    expect(userRepository.create).toHaveBeenCalledTimes(1);
  });
});` }
    },

    {
      title: 'Integration Testing với Supertest cho Express REST API', kicker: 'B12 · Section 01: Testing',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Supertest hoạt động như thế nào?**',
        '• Thư viện kiểm thử HTTP cấp cao được xây dựng trên nền `superagent`.',
        '• Cho phép truyền trực tiếp đối tượng Express Application: `request(app)`.',
        '• **Không cần mở cổng mạng thật (No Port Listening)**: Supertest sử dụng cơ chế nội bộ của Node.js (`http.Server` ephemeral sockets) để truyền request ảo thẳng vào luồng xử lý của Express mà không bị xung đột cổng `EADDRINUSE`!',
        '**Phạm vi kiểm thử của Integration Test**:',
        '• Kiểm tra toàn bộ đường ống request: JSON Parser ➔ Auth Middleware ➔ Joi Validator ➔ Controller ➔ DB ➔ Error Handler.',
        '• Đo đạc chính xác: HTTP Status Code (`200`, `201`, `400`, `401`, `404`), Headers (`Content-Type`, `Set-Cookie`), và định dạng cấu trúc JSON trả về.'
      ],
      img: { src: 'supertest-integration-flow.svg', cap: 'Luồng kiểm thử tích hợp REST API với Supertest xuyên suốt pipeline', h: 320 },
      callout: { type: 'tip', t: 'Nguyên tắc vàng: Trong file `src/app.js` chỉ cấu hình routes và middleware, sau đó export `module.exports = app`. Việc gọi `app.listen(PORT)` phải nằm riêng ở `src/server.js` để Supertest có thể import `app` mà không kích hoạt server thật!' }
    },

    {
      title: 'Bộ Integration Test Suites Toàn Diện Cho REST API', badge: 'LIVE CODING',
      term: '$ npm test -- --runInBand',
      code: { file: 'tests/integration/auth.api.test.js', lang: 'javascript', size: 'xs', src: `const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/v1/auth/login (Integration Test)', () => {
  it('Trả về HTTP 200 và chuỗi JWT Token khi đăng nhập đúng', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@ct9.vn', password: 'SecretPassword123!' })
      .set('Accept', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(typeof res.body.data.accessToken).toBe('string');
    expect(res.body.data.user).not.toHaveProperty('password'); // An toàn bảo mật
  });

  it('Trả về HTTP 400 Bad Request nếu thiếu trường email hoặc mật khẩu', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@ct9.vn' }); // Thiếu password

    expect(res.statusCode).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.message).toMatch(/password/i);
  });

  it('Trả về HTTP 401 Unauthorized nếu sai thông tin đăng nhập', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@ct9.vn', password: 'WrongPassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });
});` }
    },

    {
      title: 'Đo Độ Bao Phủ Kiểm Thử (Code Coverage Report)', kicker: 'B12 · Section 01: Testing',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Code Coverage là gì?**',
        '• Chỉ số đo lường tỷ lệ phần trăm mã nguồn đã được thực thi trong quá trình chạy bộ test tự động.',
        '• Giúp phát hiện ngay những nhánh code rẽ nhánh (if/else), khối try/catch hoặc endpoint bị bỏ quên chưa được kiểm thử.',
        '**4 Chỉ số cốt lõi trong bảng báo cáo của Jest**:',
        '• **% Stmts (Statements)**: Tỷ lệ các câu lệnh trong file đã được chạy qua.',
        '• **% Branch (Branches)**: Tỷ lệ các nhánh điều kiện `if`, `else`, `switch case`, toán tử ba ngôi `? :` đã được kiểm thử.',
        '• **% Funcs (Functions)**: Tỷ lệ các hàm đã được gọi ít nhất một lần.',
        '• **% Lines**: Tỷ lệ các dòng code thực tế đã được thực thi.',
        '**Ngưỡng chuẩn mực trong các tập đoàn công nghệ**:',
        '• Mức tối thiểu yêu cầu cho CI/CD: **80% Coverage**. Mức xuất sắc: **90% - 95%**.'
      ],
      img: { src: 'code-coverage-report.svg', cap: 'Báo cáo độ bao phủ kiểm thử (Code Coverage Report) trực quan của Jest', h: 320 },
      callout: { type: 'tip', t: 'Chạy lệnh `npx jest --coverage`, Jest sẽ tự động sinh thư mục `coverage/lcov-report/index.html`. Mở file này trên trình duyệt để thấy từng dòng code chưa được test được đánh dấu màu đỏ!' }
    },

    /* ============================================================
       SECTION 02: CHUẨN HÓA & TÀI LIỆU HÓA API VỚI SWAGGER
       ============================================================ */
    { kind: 'section', no: '02', title: 'Chuẩn Hóa & Sinh Tài Liệu API với OpenAPI & Swagger', sub: 'Tạo bản hợp đồng giao tiếp chuẩn hóa (Living Contract) giữa Back-end và các đội ngũ Front-end, Mobile.' },

    {
      title: 'Nỗi Đau "API Drift" & Sức Mạnh Của Living Documentation', kicker: 'B12 · Section 02: Swagger & OpenAPI',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Căn bệnh kinh điển của các dự án phần mềm: "API Drift"**',
        '• Đội Back-end sửa tên trường `user_name` thành `username`, đổi mã lỗi từ 400 sang 422.',
        '• Nhưng tài liệu viết bằng Word, Notion, hay Google Sheet bị bỏ quên không ai cập nhật!',
        '• Hậu quả: Đội Front-end và Mobile App gọi API bị crash, hai bên đổ lỗi cho nhau, dự án chậm tiến độ.',
        '**Giải pháp: Living Documentation với OpenAPI 3.0 & Swagger UI**:',
        '• **Gắn liền với mã nguồn**: Viết chú thích chuẩn JSDoc ngay trên đầu từng Controller/Route. Sửa code tới đâu, tài liệu cập nhật ngay tới đó.',
        '• **Giao diện Web tương tác trực tiếp**: Truy cập `/api-docs` để xem toàn bộ danh mục endpoints, xem schema request/response, và bấm **"Try it out"** gửi request kiểm thử ngay trên trình duyệt.',
        '• **Tích hợp bảo mật Bearer JWT**: Nút Authorize 🔓 lưu trữ token trong phiên làm việc, tự động đính kèm header `Authorization` vào mọi request gửi đi.'
      ],
      img: { src: 'swagger-logo.svg', cap: 'Swagger UI — Tiêu chuẩn vàng tài liệu hóa API trên toàn cầu', h: 300 },
      notes: 'Giảng viên minh họa: Thay vì phải export Postman Collection rồi gửi file zip cho đối tác qua Zalo/Slack, ta chỉ cần gửi cho họ đường link https://api.devblog.vn/api-docs là đối tác có đầy đủ mọi thứ để tích hợp!'
    },

    {
      title: 'Kiến Trúc Kỹ Thuật Đặc Tả OpenAPI Specification (OAS 3.0)', kicker: 'B12 · Section 02: Swagger & OpenAPI',
      layout: 'split', ratio: '1fr 1fr',
      bullets: [
        '**OpenAPI Specification là gì?**',
        '• Định dạng tiêu chuẩn hóa độc lập với ngôn ngữ lập trình (Language-Agnostic) để mô tả chi tiết các RESTful API.',
        '• Có thể biểu diễn dưới dạng JSON hoặc YAML.',
        '**5 Khối Thành Phần Cốt Lõi Trong Cấu Trúc OpenAPI 3.0**:',
        '1. **`openapi`**: Phiên bản đặc tả kỹ thuật (ví dụ: `3.0.0` hoặc `3.1.0`).',
        '2. **`info`**: Tiêu đề dự án (`title`), phiên bản API (`version`), mô tả tổng quan, thông tin liên hệ và giấy phép bản quyền.',
        '3. **`servers`**: Danh sách URL của các môi trường máy chủ (Development, Staging, Production).',
        '4. **`paths`**: Bản đồ các đường dẫn URL endpoints (`/posts`, `/users`) kèm theo phương thức HTTP (`get`, `post`, `put`, `delete`).',
        '5. **`components`**: Thư viện dùng chung tái sử dụng: Schemas (cấu trúc dữ liệu), Parameters, SecuritySchemes (cấu hình JWT/OAuth2).'
      ],
      img: { src: 'openapi-logo.svg', cap: 'OpenAPI 3.0 — Chuẩn đặc tả giao diện máy chủ RESTful API', h: 280 }
    },

    {
      title: 'Cài Đặt & Cấu Hình swagger-ui-express & swagger-jsdoc', badge: 'LIVE CODING',
      term: '$ npm install swagger-ui-express swagger-jsdoc',
      code: { file: 'src/config/swagger.js', lang: 'javascript', size: 'xs', src: `const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'DevBlog REST API Documentation',
    version: '1.0.0',
    description: 'Hệ thống API hoàn chỉnh cho nền tảng xuất bản blog DevBlog (Express, Sequelize, MySQL & JWT)',
    contact: { name: 'Đội ngũ Kỹ thuật CT9', email: 'tech@ct9.vn' }
  },
  servers: [
    { url: 'http://localhost:3000/api/v1', description: 'Môi trường Cục bộ (Local Development)' },
    { url: 'https://api.devblog.vn/api/v1', description: 'Môi trường Thật (Production Cloud)' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Nhập chuỗi JWT Access Token nhận được sau khi đăng nhập: Bearer <token>'
      }
    }
  }
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.js', './src/models/*.js'] // Quét toàn bộ ghi chú JSDoc trong thư mục
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = (app) => {
  // Phục vụ giao diện tương tác Swagger UI tại URL /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'DevBlog API Docs · CT9'
  }));
};` }
    },

    {
      title: 'Viết Chú Thích OpenAPI JSDoc Cho Endpoint & RequestBody', badge: 'LIVE CODING',
      code: { file: 'src/routes/post.routes.js', lang: 'javascript', size: 'xs', src: `/**
 * @openapi
 * /posts:
 *   post:
 *     tags:
 *       - Posts (Bài viết)
 *     summary: Tạo một bài viết mới
 *     description: Yêu cầu đăng nhập với quyền User hoặc Admin. Tự động sinh slug và lưu vào CSDL.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 example: 'Học Lập Trình Node.js Chuyên Nghiệp'
 *               content:
 *                 type: string
 *                 example: 'Nội dung chi tiết bài viết với định dạng Markdown...'
 *               category_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Bài viết được tạo thành công
 *       400:
 *         description: Dữ liệu gửi lên không hợp lệ (Validation Error)
 *       401:
 *         description: Chưa đăng nhập hoặc Access Token không hợp lệ
 */
router.post('/posts', authMiddleware, postController.createPost);` },
      callout: { type: 'tip', t: 'Hãy chú thích các mã lỗi phổ biến (`400`, `401`, `403`, `404`) để các lập trình viên Front-end biết chính xác cấu trúc lỗi và xử lý hiển thị Toast thông báo cho người dùng.' }
    },

    {
      title: 'Bảo Vệ Thử Nghiệm API với Bearer JWT Authentication', kicker: 'B12 · Section 02: Swagger & OpenAPI',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Trải nghiệm tương tác với Swagger UI Security**:',
        '• Khi truy cập `/api-docs`, ở góc trên cùng bên phải màn hình sẽ xuất hiện nút **`Authorize 🔓`**.',
        '• Người dùng chỉ cần gọi endpoint `POST /auth/login` trong giao diện Swagger ➔ Copy chuỗi token ➔ Bấm Authorize ➔ Dán token vào ô giá trị.',
        '• Toàn bộ biểu tượng ổ khóa cạnh các endpoints được bảo vệ sẽ chuyển từ mở sang khóa đóng (🔒).',
        '• **Tự động gắn Header**: Khi bạn bấm "Try it out" và "Execute", Swagger UI sẽ tự động đính kèm header `Authorization: Bearer <token>` vào request ngầm gửi tới server Express.',
        '• Giúp kiểm tra trực tiếp các tầng phân quyền Role Admin vs Member trực quan mà không cần gõ lệnh cURL thủ công!'
      ],
      img: { src: 'swagger-bearer-auth.svg', cap: 'Hộp thoại Authorize nhập Bearer JWT Token trên giao diện Swagger UI', h: 300 }
    },

    {
      title: 'Tự Động Sinh Client SDK Từ OpenAPI Specification', kicker: 'B12 · Section 02: Swagger & OpenAPI',
      layout: 'split', ratio: '1fr 1fr',
      bullets: [
        '**OpenAPI Generator là gì?**',
        '• Công cụ tự động chuyển đổi file đặc tả `swagger.json` thành thư viện mã nguồn Client gọi API hoàn chỉnh cho hơn 50 ngôn ngữ lập trình khác nhau.',
        '**Lợi ích vượt trội cho hệ thống đa nền tảng**:',
        '• **Front-end Web (TypeScript/Axios)**: Tự động sinh đầy đủ TypeScript Interfaces và hàm API typed an toàn (`PostApi.createPost()`). Đội Front-end không cần gõ tay từng hàm fetch!',
        '• **Mobile App (Dart Flutter, Swift iOS, Kotlin Android)**: Tự sinh Model class và Network client với chuẩn hóa Type an toàn.',
        '• **Loại bỏ lỗi chính tả**: Bất kỳ sự thay đổi nào về kiểu dữ liệu (vd: số sang chuỗi) sẽ được TypeScript compiler phát hiện ngay lập tức tại thời điểm biên dịch.'
      ],
      img: { src: 'openapi-codegen-ecosystem.svg', cap: 'OpenAPI Generator tự động sinh mã nguồn Client SDK đa nền tảng', h: 300 },
      callout: { type: 'info', t: 'Lệnh sinh SDK TypeScript cực nhanh: `npx @openapitools/openapi-generator-cli generate -i http://localhost:3000/api-docs-json -g typescript-axios -o ./sdk/ts`' }
    },

    /* ============================================================
       SECTION 03: QUY TRÌNH GIT & CHUẨN BỊ DỰ ÁN CHUYÊN NGHIỆP
       ============================================================ */
    { kind: 'section', no: '03', title: 'Quy Trình Git & Chuẩn Bị Dự Án Chuyên Nghiệp', sub: 'Quản lý phiên bản mã nguồn, bảo mật thông tin nhạy cảm và tổ chức dự án sẵn sàng đưa lên môi trường sản xuất.' },

    {
      title: 'Quy Trình Hoạt Động Cốt Lõi Của Git: 4 Không Gian Lưu Trữ', kicker: 'B12 · Section 03: Git & Project Setup',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Git là gì & Vì sao bắt buộc phải thành thạo?**',
        '• Git là hệ thống quản lý phiên bản phân tán (Distributed Version Control System). Ghi lại lịch sử chỉnh sửa, cho phép quay ngược thời gian khi phát sinh lỗi.',
        '**4 Không gian lưu trữ (4 Zones) cốt lõi của Git**:',
        '1. **Working Tree (Thư mục làm việc)**: Nơi bạn đang gõ code và tạo mới file. File chưa được Git bảo vệ.',
        '2. **Staging Area (Index - Khu vực chờ)**: Nơi chọn lọc các file thay đổi sẽ đưa vào phiên bản kế tiếp bằng lệnh `git add`.',
        '3. **Local Repository (.git)**: Kho lưu trữ trên máy tính của bạn, ghi nhận commit vĩnh viễn với mã băm SHA-1 bằng lệnh `git commit`.',
        '4. **Remote Repository (GitHub/GitLab)**: Kho lưu trữ trên Internet để chia sẻ với đồng đội và kích hoạt tự động triển khai (Auto Deploy).'
      ],
      img: { src: 'git-workflow.svg', cap: '4 Không gian lưu trữ và luồng chuyển đổi trạng thái tập tin trong Git', h: 320 }
    },

    {
      title: 'Bảo Mật Dự Án: Tuyệt Đối Không Commit File .env Vào Git', kicker: 'B12 · Section 03: Git & Project Setup',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Thảm họa rò rỉ dữ liệu (Secret Leakage)**:',
        '• Nếu bạn lỡ commit file `.env` lên GitHub công khai, các con bot tự động của hacker sẽ quét thấy mật khẩu DB, khóa bí mật JWT, API key Stripe/AWS trong vòng chưa đầy 60 giây!',
        '• Hậu quả: Hacker chiếm quyền CSDL, xóa dữ liệu hoặc dùng tài nguyên của bạn để đào tiền mã hóa.',
        '**Giải pháp chuẩn công nghiệp: Bộ đôi .gitignore & .env.example**:',
        '• **`.gitignore`**: Danh sách các file và thư mục mà Git sẽ hoàn toàn phớt lờ, không bao giờ được phép theo dõi hay commit.',
        '• **`.env.example`**: File mẫu chứa danh sách tên các biến môi trường cùng giá trị gợi ý an toàn (không chứa mật khẩu thật), giúp đồng đội biết cần cấu hình những biến nào.'
      ],
      img: { src: 'git-logo.svg', cap: 'Git & GitHub — Nền tảng quản lý mã nguồn tiêu chuẩn toàn cầu', h: 260 },
      callout: { type: 'warning', t: 'Nguyên tắc vàng: File `.env` chứa mật khẩu thật ➔ PHẢI có trong `.gitignore`. File `.env.example` chứa tên biến mẫu ➔ BẮT BUỘC commit lên Git!' }
    },

    {
      title: 'Mẫu Cấu Hình .gitignore & .env.example Chuẩn Node.js', badge: 'CONFIG',
      code: { file: '.gitignore và .env.example', lang: 'bash', size: 'xs', src: `# ==========================================
# FILE 1: .gitignore (Đặt tại thư mục gốc)
# ==========================================
# 1. Thư mục thư viện cài đặt (rất nặng, tải lại bằng npm install)
node_modules/

# 2. File chứa biến môi trường và mật khẩu nhạy cảm
.env
.env.local
.env.production

# 3. Thư mục lưu file do người dùng upload và logs hệ thống
uploads/
logs/
*.log

# 4. Thư mục báo cáo kiểm thử Jest
coverage/

# 5. File rác của hệ điều hành và IDE
.DS_Store
Thumbs.db
.vscode/
.idea/

# ==========================================
# FILE 2: .env.example (Commit lên Git làm mẫu)
# ==========================================
PORT=3000
NODE_ENV=development

# Cấu hình kết nối MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_database_password_here
DB_NAME=devblog_db

# Bảo mật JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRES_IN=7d` },
      callout: { type: 'tip', t: 'Học viên chỉ cần copy file `.env.example` thành `.env` rồi điền mật khẩu cá nhân là dự án chạy được ngay!' }
    },

    {
      title: 'Quy Chuẩn Conventional Commits & Quản Lý Nhánh Git', kicker: 'B12 · Section 03: Git & Project Setup',
      table: {
        head: ['Tiền Tố Commit', 'Ý Nghĩa Nghiệp Vụ', 'Ví Dụ Cụ Thể'],
        rows: [
          ['`feat:`', 'Phát triển một tính năng mới (Feature)', '`feat: add swagger documentation at /api-docs`'],
          ['`fix:`', 'Sửa một lỗi phát sinh trong hệ thống (Bug fix)', '`fix: resolve duplicate email crash on register`'],
          ['`refactor:`', 'Tái cấu trúc mã nguồn nhưng không đổi tính năng', '`refactor: extract auth validation to middleware`'],
          ['`test:`', 'Bổ sung hoặc sửa đổi các ca kiểm thử', '`test: add unit test for slugify utility helper`'],
          ['`docs:`', 'Cập nhật tài liệu kỹ thuật, file README', '`docs: update README with API curl examples`'],
          ['`chore:`', 'Cập nhật cấu hình phụ, dependencies npm', '`chore: update jest and supertest to latest`']
        ]
      },
      callout: { type: 'tip', t: 'Viết thông điệp commit rõ ràng giúp bạn và đồng đội xem lại lịch sử thay đổi cực kỳ nhanh chóng và chuyên nghiệp!' }
    },

    {
      title: 'Viết File README.md Đẳng Cấp Thu Hút Nhà Tuyển Dụng', kicker: 'B12 · Section 03: Git & Project Setup',
      layout: 'split', ratio: '1fr 1fr',
      bullets: [
        '**File README.md là bộ mặt của dự án**:',
        '• Khi nhà tuyển dụng mở GitHub của bạn, họ chỉ dành 30 giây đầu tiên để lướt qua file `README.md`.',
        '• Một file README nghèo nàn sẽ khiến dự án dù code hay đến đâu cũng bị đánh giá thấp!',
        '**Cấu trúc 6 phần của một README chuẩn Senior**:',
        '1. **Header & Badges**: Tên dự án, logo, các huy hiệu phiên bản Node, giấy phép MIT, đường link live demo.',
        '2. **Tech Stack**: Danh sách công nghệ (Node.js, Express, MySQL, Sequelize, Jest, Swagger).',
        '3. **Kiến Trúc & Sơ Đồ ERD**: Ảnh chụp kiến trúc 4 tầng MVC và quan hệ các bảng CSDL.',
        '4. **Hướng Dẫn Cài Đặt (Quick Start)**: Từng bước `git clone`, `npm install`, cấu hình `.env`, chạy migration và khởi động server.',
        '5. **Tài Liệu API**: Đường dẫn Swagger UI và ví dụ gọi API bằng cURL/Postman.',
        '6. **Tác Giả & Liên Hệ**: Họ tên, email, link LinkedIn cá nhân.'
      ],
      img: { src: 'readme-architecture.svg', cap: 'Cấu trúc 6 khối chuẩn mực của file README.md dự án GitHub chuyên nghiệp', h: 300 }
    },

    {
      title: 'Xử Lý Xung Đột (Git Merge Conflicts) Bình Tĩnh & Chuẩn Xác', kicker: 'B12 · Section 03: Git & Project Setup',
      badge: 'PRO WORKFLOW',
      code: {
        file: 'src/server.js (Xung đột khi merge)', lang: 'javascript', size: 'xs',
        src: `<<<<<<< HEAD (Mã hiện tại của bạn trên nhánh main)
const PORT = process.env.PORT || 3000;
=======
const PORT = process.env.PORT || 8080;
>>>>>>> feature-auth (Mã từ nhánh đồng đội vừa merge)` },
      bullets: [
        '**Xung đột Git (Merge Conflict) phát sinh khi nào?**',
        '• Khi hai lập trình viên cùng sửa đổi trên **chính xác cùng một dòng code** trong một file và cố gắng gộp vào nhau.',
        '**Cách giải quyết 4 bước chuẩn mực bằng VS Code**:',
        '1. Đừng hoảng sợ! Mở file có dấu hiệu cảnh báo chấm than đỏ `!`.',
        '2. Quan sát các nút bấm hỗ trợ của VS Code: **Accept Current Change** (giữ code của bạn), **Accept Incoming Change** (lấy code của đồng đội), hoặc **Accept Both Changes**.',
        '3. Xóa bỏ các ký tự đánh dấu `<<<<<<<`, `=======`, `>>>>>>>` và lưu file.',
        '4. Chạy `npm test` để đảm bảo code hoạt động tốt ➔ gõ `git add .` ➔ `git commit -m "fix: resolve merge conflict in server.js"`.'
      ]
    },

    /* ============================================================
       SECTION 04: TRIỂN KHAI CLOUD CỰC DỄ DÀNG VỚI RENDER.COM
       ============================================================ */
    { kind: 'section', no: '04', title: 'Triển Khai Cloud Cực Dễ Dàng Với Render.com', sub: 'Đưa DevBlog API lên Internet miễn phí chỉ với một lệnh git push — Không cần cài đặt máy chủ phức tạp, không cần Docker.' },

    {
      title: 'Tại Sao Chọn Nền Tảng Cloud PaaS (Render / Railway)?', kicker: 'B12 · Section 04: Easy Cloud Deploy',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Nỗi sợ của người mới: Cài đặt máy chủ Linux truyền thống (VPS)**:',
        '• Mua VPS Ubuntu, cài đặt Nginx, cấu hình PM2, cài đặt chứng chỉ SSL Certbot, mở cổng tường lửa UFW... rất phức tạp và dễ gặp lỗi cấu hình hệ thống!',
        '**Giải pháp hiện đại: Cloud Platform as a Service (PaaS)**:',
        '• Các nền tảng hiện đại như **Render.com, Railway.app, Fly.io** hỗ trợ triển khai trực tiếp từ mã nguồn GitHub hoàn toàn tự động.',
        '• **Không cần Docker**: Nền tảng tự phát hiện file `package.json`, tự động cài đặt `npm install` và chạy `npm start`.',
        '• **Miễn phí chứng chỉ HTTPS (SSL)**: Tự động cấp tên miền `.onrender.com` bảo mật sẵn sàng.',
        '• **Auto-Deploy**: Bất cứ khi nào bạn chạy lệnh `git push origin main`, Render sẽ tự động kéo code mới và cập nhật tức thì!'
      ],
      img: { src: 'render-cloud-deploy.svg', cap: 'Quy trình triển khai đám mây cực dễ dàng: Từ Git push tới live API chỉ trong vài phút', h: 300 }
    },

    {
      title: '4 Bước Triển Khai DevBlog REST API Lên Render.com', kicker: 'B12 · Section 04: Easy Cloud Deploy',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Bước 1: Đẩy mã nguồn lên GitHub**',
        '• Khởi tạo repository trên GitHub (ví dụ: `devblog-api`).',
        '• Đẩy toàn bộ code lên nhánh `main`: `git push origin main`.',
        '**Bước 2: Tạo Web Service mới trên Render Dashboard**',
        '• Đăng ký tài khoản miễn phí tại `https://render.com` (đăng nhập nhanh bằng GitHub).',
        '• Bấm nút **New +** ➔ Chọn **Web Service** ➔ Chọn repository `devblog-api`.',
        '**Bước 3: Khai báo lệnh Build & Start**',
        '• **Runtime**: Chọn `Node`.',
        '• **Build Command**: `npm install` (Render sẽ cài toàn bộ dependencies).',
        '• **Start Command**: `node src/server.js` (Lệnh khởi động máy chủ).',
        '**Bước 4: Nhận đường link trực tuyến**',
        '• Render bắt đầu build. Sau 2-3 phút, bạn nhận được URL công khai dạng `https://devblog-api.onrender.com` sẵn sàng chia sẻ!'
      ],
      img: { src: 'render-pipeline-steps.svg', cap: 'Quy trình 4 bước triển khai tự động REST API lên Cloud Render.com', h: 300 }
    },

    {
      title: 'Cấu Hình Environment Variables Trên Cloud Dashboard', kicker: 'B12 · Section 04: Easy Cloud Deploy',
      layout: 'split', ratio: '1fr 1fr',
      bullets: [
        '**Làm sao để server Cloud đọc được cấu hình bảo mật?**',
        '• Nhắc lại: File `.env` không nằm trên GitHub, vậy làm sao Render biết mật khẩu DB và JWT Secret?',
        '• Truy cập tab **Environment** trong bảng điều khiển Web Service trên Render ➔ Bấm **Add Environment Variable** để nhập từng cặp Key - Value an toàn.',
        '**Danh sách các biến môi trường quan trọng cần cấu hình**:',
        '• `NODE_ENV` = `production`',
        '• `PORT` = `10000` (Render tự động gán biến PORT động, code của bạn dùng `process.env.PORT || 3000`)',
        '• `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME` = Thông tin kết nối MySQL Cloud',
        '• `JWT_SECRET` = Chuỗi khóa bí mật ngẫu nhiên bảo mật',
        '• `JWT_REFRESH_SECRET` = Khóa bí mật cho refresh token'
      ],
      img: { src: 'cloud-environment-secrets.svg', cap: 'Quản lý biến môi trường bảo mật trên Cloud Dashboard an toàn tuyệt đối', h: 300 },
      callout: { type: 'tip', t: 'Không bao giờ lo lắng mất mát biến môi trường: Bạn có thể cập nhật giá trị bất cứ lúc nào trên giao diện web, Render sẽ tự động khởi động lại service để nhận giá trị mới.' }
    },

    {
      title: 'Kết Nối Cơ Sở Dữ Liệu MySQL Cloud Miễn Phí (Aiven / TiDB Cloud)', kicker: 'B12 · Section 04: Easy Cloud Deploy',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Tại sao không dùng MySQL trên máy tính localhost khi đã deploy web?**',
        '• Máy tính của bạn ở nhà có địa chỉ IP riêng, máy chủ Render trên Internet không thể kết nối tới `localhost:3306` của bạn được!',
        '• Cần một CSDL chạy trực tiếp trên Cloud có địa chỉ Host công khai.',
        '**Các nhà cung cấp MySQL Cloud miễn phí tốt nhất hiện nay**:',
        '1. **Aiven.io**: Cung cấp MySQL 8 miễn phí trọn đời, hỗ trợ SSL connection đầy đủ.',
        '2. **TiDB Cloud**: Chuẩn tương thích 100% với cú pháp MySQL, dung lượng 5GB miễn phí.',
        '3. **Railway.app**: Khởi tạo database MySQL chỉ với 1 click chuột.',
        '**Cấu hình Sequelize kết nối MySQL Cloud với SSL**:',
        '• Thêm tùy chọn `dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }` vào cấu hình Sequelize để bảo mật đường truyền dữ liệu giữa Render và Database Cloud.'
      ],
      img: { src: 'mysql-logo.svg', cap: 'MySQL Cloud đảm bảo cơ sở dữ liệu luôn trực tuyến 24/7 độc lập với máy cá nhân', h: 260 }
    },

    {
      title: 'Kiểm Tra Nhật Ký Vận Hành (Logs) & Thử Nghiệm API Trực Tuyến', kicker: 'B12 · Section 04: Easy Cloud Deploy',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Theo dõi luồng Logs thời gian thực (Live Runtime Logs)**:',
        '• Trong tab **Logs** của Render, bạn sẽ nhìn thấy mọi dòng lệnh `console.log` được in ra khi ứng dụng chạy.',
        '• Dễ dàng quan sát thông báo: `🚀 Máy chủ DevBlog đang lắng nghe tại cổng 10000` và `✅ Đã kết nối MySQL Cloud thành công!`.',
        '• Nếu có lỗi ngoại lệ hoặc sai cú pháp SQL, tab Logs sẽ chỉ ra chính xác dòng code bị lỗi để bạn fix ngay.',
        '**Trải nghiệm thành quả trực tuyến với Swagger UI**:',
        '• Mở trình duyệt truy cập: `https://devblog-api.onrender.com/api-docs`.',
        '• Bấm "Try it out" ➔ Gọi endpoint `GET /api/v1/posts` để lấy dữ liệu thực tế từ Cloud Database.',
        '• Đính kèm đường link này vào CV xin việc để chứng minh sản phẩm của bạn đang hoạt động thật!'
      ],
      img: { src: 'cloud-runtime-monitoring.svg', cap: 'Theo dõi luồng Live Logs và giám sát trạng thái Health Check thời gian thực', h: 300 },
      callout: { type: 'tip', t: 'Tính năng Auto-Deploy: Khi bạn sửa code ở máy local ➔ gõ `git push origin main` ➔ Render sẽ tự động kéo code mới và build lại trong 1 phút mà không cần bạn bấm nút nào!' }
    },

    {
      title: 'Thiết Kế Health Check Endpoint Cho Nền Tảng Đám Mây', kicker: 'B12 · Section 04: Easy Cloud Deploy',
      badge: 'MONITORING',
      code: {
        file: 'src/routes/health.route.js', lang: 'javascript', size: 'xs',
        src: `const router = require('express').Router();
const { sequelize } = require('../models');

// Endpoint kiểm tra sức khỏe hệ thống: GET /api/v1/health
router.get('/health', async (req, res) => {
  try {
    // 1. Kiểm tra kết nối CSDL MySQL còn sống không
    await sequelize.authenticate();

    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: 'CONNECTED',
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    });
  } catch (error) {
    res.status(503).json({
      status: 'DOWN',
      database: 'DISCONNECTED',
      error: error.message
    });
  }
});

module.exports = router;` },
      bullets: [
        '**Cơ chế Zero-Downtime Rolling Deploy của Cloud**:',
        '• Render định kỳ gửi request tới `/api/v1/health` mỗi 10 giây.',
        '• Khi bạn deploy phiên bản mới, Render sẽ giữ nguyên máy chủ cũ đang chạy. Chỉ khi phiên bản mới trả về `200 UP`, Render mới chuyển traffic sang và tắt máy cũ!',
        '• Người dùng không bao giờ gặp tình trạng gián đoạn dịch vụ.'
      ]
    },

    {
      title: 'Cấu Hình CORS Production: Kết Nối Front-End Trực Tuyến An Toàn', kicker: 'B12 · Section 04: Easy Cloud Deploy',
      badge: 'CORS CONFIG',
      code: {
        file: 'src/app.js', lang: 'javascript', size: 'xs',
        src: `const cors = require('cors');

// Danh sách các tên miền Front-end được phép gọi API
const allowedOrigins = [
  'https://devblog.vn',
  'https://mrcodewalker.github.io',
  'http://localhost:5500' // Cho phép lập trình viên test ở máy local
];

app.use(cors({
  origin: function (origin, callback) {
    // Cho phép các request không có origin (như mobile app hoặc cURL)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Tên miền của bạn không được phép truy cập API (CORS Blocked)!'));
    }
  },
  credentials: true, // Cho phép truyền Cookie / Token
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));` },
      callout: { type: 'tip', t: 'Không bao giờ để `cors({ origin: \'*\' })` trên production vì bất kỳ trang web độc hại nào cũng có thể gửi request nặc danh mạo danh người dùng của bạn!' }
    },

    /* ============================================================
       SECTION 05: TỔNG KẾT TOÀN DIỆN KHÓA HỌC & BẢO VỆ ĐỒ ÁN
       ============================================================ */
    { kind: 'section', no: '05', title: 'Tổng Kết Toàn Diện Khóa Học & Bảo Vệ Đồ Án', sub: 'Nhìn lại chặng đường 12 buổi học từ cơ bản đến nâng cao và tự tin bước vào sự nghiệp lập trình viên Back-end.' },

    {
      title: 'Bản Đồ Tiến Hóa Kiến Thức: Hành Trình 12 Buổi Học CT9', kicker: 'B12 · Section 05: Final Review',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Chặng 1: Nền tảng & Cốt lõi (B01 - B04)**:',
        '• Làm chủ kiến trúc Node.js, V8, Event Loop, Libuv, Asynchronous JS, Streams & Buffer, HTTP Module, DNS & Web Server.',
        '**Chặng 2: Khung RESTful & Kiến Trúc MVC (B05 - B06)**:',
        '• Richardson Maturity Model, Express Router, Pipeline Middleware, 4-Tier Clean Architecture (Controller/Service/Repo), Error Handling.',
        '**Chặng 3: Cơ Sở Dữ Liệu & ORM (B07 - B08)**:',
        '• RDBMS, B-Tree Indexing, EXPLAIN query, ACID Transactions, Connection Pool, Sequelize ORM, 1-N & N-N Associations, N+1 Optimization.',
        '**Chặng 4: An Ninh Mạng & Tính Năng Thực Chiến (B09 - B11)**:',
        '• Bcrypt Password, JWT Stateless Auth, Refresh Token Rotation, RBAC/ABAC Authorization, Helmet, OWASP Top 10, Multer Upload, Sharp, CORS.',
        '**Chặng 5: Kiểm Thử, Tài Liệu & Triển Khai Cloud (B12)**:',
        '• Test Pyramid, Jest & Supertest, OpenAPI/Swagger 3.0, Quy trình Git chuẩn và Triển khai Cloud Render.com không cần Docker.'
      ],
      img: { src: 'clean-architecture.svg', cap: 'Hệ thống kiến trúc chuyên nghiệp được xây dựng vững chắc sau 12 buổi', h: 320 }
    },

    {
      title: 'Bảng Tiêu Chí Đánh Giá & Thang Điểm Đồ Án DevBlog API', kicker: 'B12 · Section 05: Final Review',
      table: {
        head: ['Hạng Mục Đánh Giá', 'Trọng Số', 'Tiêu Chí Chi Tiết Cần Đạt'],
        rows: [
          ['1. Chuẩn RESTful & Kiến Trúc MVC', '25%', 'Chia đủ 4 tầng phân tách rõ ràng. Dùng đúng mã trạng thái HTTP (200, 201, 400, 401, 403, 404, 409). Envelope response nhất quán.'],
          ['2. Thiết Kế CSDL & Tối Ưu ORM', '25%', 'Chuẩn hóa 3NF, quan hệ 1-N và N-N chính xác. Có đánh index cho các cột tìm kiếm. Không dính lỗi N+1 query (dùng eager loading).'],
          ['3. Bảo Mật Hệ Thống & Phân Quyền', '25%', 'Băm mật khẩu Bcrypt an toàn. Xác thực JWT ngắn hạn + Refresh Token rotation. Middleware RBAC phân quyền Admin/User. Chống BOLA và SQL Injection.'],
          ['4. Tính Năng Thực Tế & Tài Liệu', '15%', 'Upload ảnh có xử lý nén Sharp. Phân trang và tìm kiếm chuẩn. Có đầy đủ tài liệu Swagger UI tại `/api-docs` thử nghiệm được.'],
          ['5. Kiểm Thử & Triển Khai Cloud', '10%', 'Có tối thiểu 3 bộ Unit test & Integration test bằng Jest/Supertest. Đẩy code lên GitHub chuẩn .gitignore, README.md và deploy live lên Cloud Render/Railway.']
        ]
      },
      callout: { type: 'tip', t: 'Điểm cộng thưởng: Triển khai thành công API online lên Render.com hoặc Railway.app kèm đường link Swagger sống tương tác được!' }
    },

    {
      title: 'Lộ Trình Phát Triển Tiếp Theo: Trở Thành Middle/Senior Engineer', kicker: 'B12 · Section 05: Final Review',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**1. Nâng cấp lên TypeScript (Strongly Typed)**:',
        '• Chuyển từ JavaScript thuần sang TypeScript để code chặt chẽ, loại bỏ hoàn toàn các lỗi `undefined is not a function` ngay lúc viết code.',
        '• Khám phá các framework doanh nghiệp cao cấp như **NestJS** (sử dụng Dependency Injection và Decorators).',
        '**2. Bộ Nhớ Đệm Hiệu Năng Cao (In-Memory Caching)**:',
        '• Làm chủ **Redis / Dragonfly**: Caching dữ liệu đọc, Rate limiting phân tán, Pub/Sub và lưu trữ Session.',
        '**3. Kiến Trúc Hướng Sự Kiện & Xử Lý Tác Vụ Nặng (Message Queue)**:',
        '• Sử dụng **BullMQ, RabbitMQ, hoặc Apache Kafka** để xử lý các công việc bất đồng bộ ngầm: gửi hàng vạn email, xuất file báo cáo Excel nặng, xử lý video.',
        '**4. Microservices & Điện Toán Đám Mây (Cloud Computing)**:',
        '• Chia nhỏ monolith thành các microservices, làm quen với Docker cơ bản, AWS S3, Cloudflare CDN và CI/CD nâng cao.'
      ],
      img: { src: 'cloud-types.svg', cap: 'Bản đồ công nghệ tiếp theo trên con đường trở thành Senior Back-end Engineer', h: 320 }
    },

    {
      title: 'Câu Hỏi Trắc Nghiệm Tổng Kết Buổi 12 & Khóa Học', badge: 'QUIZ',
      quiz: {
        q: 'Khi triển khai ứng dụng Node.js lên nền tảng Cloud (như Render hoặc Railway), vì sao ta KHÔNG NÊN gán cứng cổng `const PORT = 3000;`?',
        opts: [
          'Vì cổng 3000 bị cấm hoàn toàn bởi giao thức bảo mật HTTPS.',
          'Vì các nền tảng đám mây (Render, Railway, Heroku) cấp phát cổng động ngẫu nhiên qua biến môi trường `process.env.PORT`. Nếu gán cứng cổng 3000, Load Balancer của Cloud không thể chuyển traffic tới server và báo lỗi Deploy!',
          'Vì các máy chủ Cloud chỉ chấp nhận duy nhất cổng 80 cho tất cả ứng dụng Web.',
          'Vì Node.js sẽ tự động crash nếu cổng lớn hơn 1024.'
        ],
        a: 1,
        why: 'Trên các nền tảng điện toán đám mây hiện đại, dịch vụ được khởi tạo với một cổng động được truyền qua biến môi trường process.env.PORT. Luôn sử dụng cú pháp: const PORT = process.env.PORT || 3000; để đảm bảo code chạy trơn tru ở cả localhost lẫn Production!'
      }
    },

    {
      title: 'Chúc Mừng Khóa Học CT9 Đã Về Đích Xuất Sắc!', kicker: 'B12 · Bế Mạc Khóa Học',
      layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**12 Buổi Học Đầy Nỗ Lực & Bản Lĩnh**:',
        '• Các bạn đã vượt qua một khối lượng kiến thức khổng lồ: từ những dòng code Node.js đầu tiên đến việc làm chủ kiến trúc 4 tầng MVC, CSDL quan hệ MySQL, tối ưu B-Tree index, bảo mật chuẩn OWASP, tài liệu hóa Swagger và triển khai Cloud thực tế.',
        '• Bạn không còn là người chỉ biết gõ theo hướng dẫn, mà đã sở hữu tư duy phân tích kiến trúc, bảo mật và hiệu năng của một kỹ sư Back-end thực thụ.',
        '**Gia Nhập Cộng Đồng Cựu Học Viên Lập Trình CT9**:',
        '• Hãy đưa dự án DevBlog API lên GitHub với file README đẹp mắt, video demo và link Swagger online để gây ấn tượng mạnh mẽ với nhà tuyển dụng.',
        '• Giảng viên và cộng đồng CT9 sẽ luôn đồng hành, hỗ trợ review code và giới thiệu cơ hội việc làm cho các bạn!',
        '• **Chúc các tân Kỹ sư Web Back-end luôn giữ ngọn lửa đam mê và gặt hái thật nhiều thành công rực rỡ! 🚀🎓**'
      ],
      img: { src: 'node-logo.svg', cap: 'Chúc mừng toàn thể học viên lớp CT9 đã hoàn thành xuất sắc đồ án!', h: 280 },
      callout: { type: 'tip', t: 'Hãy tự hào về sản phẩm các bạn đã xây dựng! Hãy tiếp tục viết code mỗi ngày, học hỏi công nghệ mới và xây dựng những hệ thống phục vụ hàng triệu người dùng!' }
    }
  ],
  recap: [
    '**Jest & Supertest** giúp tự động hóa kiểm thử từ Unit Test tới Integration Test với độ bao phủ >80%',
    '**OpenAPI 3.0 & Swagger UI** xây dựng bản hợp đồng tài liệu sống động, tương tác trực tiếp tại `/api-docs` và tự sinh SDK',
    '**Quy Trình Git Chuyên Nghiệp** quản lý mã nguồn bài bản, bảo mật tuyệt đối với bộ đôi `.gitignore` và `.env.example`',
    '**Render.com Cloud Deploy** đưa API lên Internet công khai chỉ với một lệnh git push, tự động cấp chứng chỉ HTTPS và Auto-Deploy',
    '**Cơ Sở Dữ Liệu MySQL Cloud** kết nối dữ liệu trực tuyến 24/7 độc lập với máy cá nhân thông qua SSL',
    'Chúc mừng toàn thể học viên **CT9** đã hoàn thành xuất sắc chương trình Lập trình Web Back-end với Node.js & Express!'
  ],
  exercises: [
    {
      level: 'warmup', time: 20, title: 'Cài đặt Jest và viết Unit Test cho Helper Functions',
      desc: 'Thiết lập môi trường kiểm thử tự động với Jest và viết Unit Test cho các hàm tiện ích xử lý chuỗi.',
      tasks: [
        'Cài đặt `jest` vào devDependencies (`npm i -D jest`)',
        'Thêm script `"test": "jest --detectOpenHandles --runInBand"` vào file `package.json`',
        'Tạo file `src/utils/string.util.js` chứa hàm `slugify(text)` chuyển đổi tiếng Việt có dấu thành slug không dấu',
        'Tạo file `tests/unit/string.test.js` kiểm tra 3 trường hợp: chuỗi thường, chuỗi có dấu tiếng Việt, chuỗi chứa ký tự đặc biệt nguy hiểm',
        'Chạy lệnh `npm test` và đảm bảo toàn bộ test case đều hiển thị màu xanh lá'
      ]
    },
    {
      level: 'core', time: 35, title: 'Viết Integration Test Toàn Diện Cho Luồng Xác Thực API',
      desc: 'Sử dụng Supertest gửi HTTP request ảo kiểm thử các mã trạng thái của endpoint đăng ký và đăng nhập.',
      tasks: [
        'Cài đặt `supertest` vào devDependencies',
        'Tách việc gọi `app.listen()` sang file `src/server.js`, đảm bảo file `src/app.js` chỉ export instance app',
        'Tạo file `tests/integration/auth.test.js`',
        'Viết Test Case 1: Đăng ký user mới thành công ➔ trả về status 201 và response body không được chứa trường password',
        'Viết Test Case 2: Đăng ký với email trùng lặp ➔ trả về status 409 Conflict',
        'Viết Test Case 3: Đăng nhập đúng ➔ trả về status 200 và chuỗi JWT accessToken',
        'Viết Test Case 4: Đăng nhập sai mật khẩu ➔ trả về status 401 Unauthorized'
      ],
      solution: { file: 'tests/integration/auth.test.js', lang: 'javascript', src: `const request = require('supertest');
const app = require('../../src/app');

describe('Auth API Integration Tests', () => {
  it('Đăng nhập sai mật khẩu trả về mã lỗi 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@ct9.vn', password: 'SaiMatKhau123' });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });
});` }
    },
    {
      level: 'core', time: 35, title: 'Tích hợp Swagger UI & OpenAPI 3.0 Cho DevBlog API',
      desc: 'Sinh giao diện tài liệu tương tác chuyên nghiệp tại đường dẫn /api-docs.',
      tasks: [
        'Cài đặt 2 thư viện `swagger-ui-express` và `swagger-jsdoc`',
        'Tạo file cấu hình `src/config/swagger.js` định nghĩa OpenAPI 3.0 với info, servers và Bearer Auth securityScheme',
        'Gắn middleware phục vụ tài liệu tại route `/api-docs` của Express app',
        'Viết chú thích JSDoc `@openapi` cho 2 endpoints: `POST /api/v1/auth/login` và `GET /api/v1/posts`',
        'Khởi chạy server, mở trình duyệt vào `http://localhost:3000/api-docs` và bấm nút **"Try it out"** test gửi request trực tiếp trên giao diện'
      ]
    },
    {
      level: 'core', time: 30, title: 'Thiết Lập Git Repository, .gitignore & .env.example',
      desc: 'Quản lý phiên bản mã nguồn bài bản và bảo mật thông tin nhạy cảm trước khi đưa lên GitHub.',
      tasks: [
        'Khởi tạo Git repo (`git init`), cấu hình `.gitignore` loại trừ `node_modules/`, `.env`, `coverage/`, `uploads/*`',
        'Tạo file `.env.example` chứa toàn bộ biến mẫu cần thiết mà không chứa mật khẩu thật',
        'Viết file `README.md` chuyên nghiệp gồm mô tả dự án, Tech stack, các bước cài đặt và hướng dẫn chạy test',
        'Tạo commit đầu tiên theo chuẩn Conventional Commits: `feat: initial project setup with auth and post APIs`'
      ]
    },
    {
      level: 'challenge', time: 40, title: 'Kết Nối CSDL MySQL Cloud và Cấu Hình Biến Môi Trường',
      desc: 'Khởi tạo cơ sở dữ liệu MySQL trên nền tảng Cloud và kết nối an toàn từ dự án Express.',
      tasks: [
        'Tạo một instance CSDL MySQL miễn phí trên dịch vụ Cloud (Aiven.io, TiDB Cloud, hoặc Railway)',
        'Lấy thông tin kết nối an toàn (Host, Port, User, Password, Database Name, SSL Certificate)',
        'Cập nhật cấu hình Sequelize hỗ trợ `dialectOptions.ssl` để bảo vệ đường truyền',
        'Chạy file SQL schema hoặc Sequelize migration để sinh đầy đủ cấu trúc bảng lên Cloud DB',
        'Chạy server ở máy local trỏ vào Cloud DB và kiểm tra gọi API thêm/sửa/xóa bài viết thành công'
      ]
    },
    {
      level: 'homework', time: 50, title: 'Triển Khai DevBlog API Lên Render.com (Auto Deploy)',
      desc: 'Đưa mã nguồn DevBlog API từ localhost chính thức chạy trên máy chủ Internet công khai.',
      tasks: [
        'Đẩy toàn bộ mã nguồn lên GitHub repository công khai hoặc riêng tư',
        'Đăng nhập Render.com, chọn New Web Service và liên kết GitHub repo vừa tạo',
        'Cấu hình Build Command: `npm install`, Start Command: `node src/server.js`',
        'Khai báo đầy đủ các Environment Variables trên Dashboard của Render: `NODE_ENV=production`, `PORT=10000`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`',
        'Bấm Deploy, theo dõi quá trình build trong tab Logs và truy cập đường link `https://xxx.onrender.com/api-docs` để kiểm tra kết quả trực tuyến'
      ]
    },
    {
      level: 'project', time: 60, title: 'Bảo Vệ Đồ Án Tốt Nghiệp DevBlog REST API (Final Defense)',
      desc: 'Thuyết trình và bảo vệ sản phẩm kết khóa trước hội đồng giảng viên và cả lớp.',
      tasks: [
        'Trình bày slide 5-7 phút: Tổng quan đề tài, Kiến trúc hệ thống 4 tầng MVC, Sơ đồ CSDL ERD, Giải pháp bảo mật',
        'Demo trực tiếp các luồng nghiệp vụ chính: Đăng ký ➔ Đăng nhập nhận JWT ➔ Upload ảnh bài viết ➔ Phân trang & Tìm kiếm ➔ Admin xóa bài viết',
        'Trình diễn tài liệu Swagger UI trực tuyến trên link Cloud sống và gửi request thử nghiệm thành công trước lớp',
        'Trình diễn kết quả kiểm thử tự động với Jest đạt coverage trên 80%',
        'Trả lời câu hỏi phản biện của giảng viên về xử lý lỗi tập trung, phòng chống SQL Injection, giải quyết N+1 query và quy trình CI/CD'
      ]
    }
  ],
  project: {
    lead: '**Cột mốc vinh quang cuối cùng**: Hoàn thiện Kiểm thử, Tài liệu Swagger UI, Triển khai Cloud và Bảo vệ thành công Đồ án DevBlog RESTful API!',
    tasks: [
      'Kiểm thử tự động với Jest & Supertest',
      'Tài liệu hóa trực quan với OpenAPI 3.0 & Swagger UI',
      'Quy chuẩn mã nguồn Git & Bảo mật với .gitignore, .env.example',
      'Triển khai Cloud Render.com tự động với HTTPS và MySQL Cloud',
      'Bảo vệ thành công đồ án tốt nghiệp khóa học Back-end CT9'
    ],
    callout: { type: 'tip', t: 'Xin chúc mừng toàn thể học viên lớp CT9 đã hoàn thành xuất sắc chặng đường 12 buổi học! Chúc các bạn tự tin bước vào sự nghiệp lập trình viên Back-end chuyên nghiệp! 🎓🚀' }
  }
};
