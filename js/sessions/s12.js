/* ============================================================
   BUỔI 12 — Testing, Tài liệu & Deploy
   ============================================================ */
SESSION_DATA[12] = {
  intro: 'Buổi cuối cùng hoàn thiện bức tranh của một lập trình viên Back-end chuyên nghiệp: kiểm thử tự động với Jest & Supertest để tự tin refactor code, sinh tài liệu API trực quan với Swagger/OpenAPI, đóng gói ứng dụng với Docker, và đưa API lên Internet thông qua các nền tảng đám mây (Cloud). Tổng kết toàn khóa và bảo vệ đồ án DevBlog API!',
  agenda: [
    { min: 10, t: 'Ôn B11 & Bức tranh Production Ready', d: 'Sự khác biệt giữa code đồ án và code chạy thật' },
    { min: 35, t: 'Kiểm thử tự động: Jest & Supertest', d: 'Unit test vs Integration test, viết test cho endpoint' },
    { min: 30, t: 'Tài liệu API chuyên nghiệp với Swagger', d: 'OpenAPI 3.0, swagger-ui-express, thử nghiệm trực tiếp' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 25, t: 'Đóng gói ứng dụng: Docker căn bản', d: 'Dockerfile, .dockerignore, containerization' },
    { min: 35, t: 'Deploy lên Cloud (Render / Railway)', d: 'Cấu hình biến môi trường production, database cloud' },
    { min: 25, t: 'Tổng kết khóa học & Bảo vệ đồ án', d: 'Hành trình 12 buổi, định hướng nghề nghiệp' },
    { min: 10, t: 'Chụp ảnh kỷ niệm & Trao chứng chỉ', d: '' }
  ],
  slides: [
    { kind: 'section', no: '01', title: 'Kiểm thử tự động với Jest & Supertest', sub: 'Tự tin nâng cấp code mà không sợ làm hỏng các tính năng cũ.' },
    {
      title: 'Các cấp độ Kiểm thử phần mềm',
      cols: [
        { h: '🧪 Unit Test (Đơn vị)', bullets: ['Kiểm tra một hàm logic cô lập (ví dụ hàm băm password, tính tiền)', 'Chạy cực nhanh (vài mili-giây)', 'Không kết nối DB hay mạng thật (dùng Mock)'] },
        { h: '🔗 Integration Test (Tích hợp)', cls: 'good', bullets: ['Kiểm tra sự phối hợp: Route → Middleware → Controller → DB', 'Gửi HTTP request ảo vào Express bằng **Supertest**', 'Đo đúng status code và cấu trúc JSON trả về'] },
        { h: '🌐 E2E Test (Đầu cuối)', bullets: ['Kiểm tra toàn bộ luồng từ giao diện Front-end đến Database', 'Mô phỏng thao tác click, gõ phím của người dùng thật'] }
      ]
    },
    {
      title: 'Cài đặt và viết Test đầu tiên', badge: 'LIVE CODING',
      term: `$ npm install --save-dev jest supertest`,
      code: { file: 'tests/auth.test.js', lang: 'javascript', size: 'xs', src: `const request = require('supertest');
const app = require('../src/app');

describe('API Xác thực (Authentication)', () => {
  it('GET /api/health phải trả về status 200 và ok: true', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('Đăng ký tài khoản mới thành công trả về 201', async () => {
    const uniqueEmail = \`test_\${Date.now()}@ct9.vn\`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Học viên CT9', email: uniqueEmail, password: 'password123' });

    expect(res.statusCode).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).not.toHaveProperty('password_hash'); // Đảm bảo không lộ hash
  });

  it('Đăng nhập sai mật khẩu phải trả về 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@ct9.vn', password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.ok).toBe(false);
  });
});` }
    },

    { kind: 'section', no: '02', title: 'Tài liệu API chuẩn OpenAPI & Swagger', sub: 'Giao diện tương tác để đối tác và Front-end dễ dàng thử nghiệm API.' },
    {
      title: 'Tại sao cần Swagger thay vì file Word / PDF?', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        'File Word/PDF tài liệu viết xong là... lạc hậu ngay khi code sửa.',
        '**OpenAPI / Swagger** sinh tài liệu trực tiếp từ code hoặc file YAML.',
        'Cho phép bấm nút **"Try it out"** để gửi request trực tiếp trên trình duyệt.',
        'Hỗ trợ nhập Token Bearer để test các endpoint yêu cầu đăng nhập.',
        'Tiêu chuẩn chung toàn cầu của ngành công nghiệp phần mềm.'
      ],
      img: { src: 'swagger-logo.svg', cap: 'Swagger — Công cụ tài liệu API số 1 thế giới', h: 180 }
    },
    {
      title: 'Tích hợp swagger-ui-express', badge: 'LIVE CODING',
      term: `$ npm install swagger-ui-express swagger-jsdoc`,
      code: { file: 'src/config/swagger.js', lang: 'javascript', size: 'xs', src: `const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DevBlog API · Khóa học CT9',
      version: '1.0.0',
      description: 'Tài liệu API hoàn chỉnh cho nền tảng blog DevBlog với Express, MySQL và JWT'
    },
    servers: [{ url: 'http://localhost:3000/api', description: 'Development server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Đọc chú thích JSDoc trong các file route
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};` }
    },

    { kind: 'section', no: '03', title: 'Đóng gói Docker & Triển khai lên Cloud', sub: 'Đưa mã nguồn từ localhost lên máy chủ trên Internet.' },
    {
      title: 'Đóng gói ứng dụng với Docker', layout: 'split', ratio: '.95fr 1.05fr',
      bullets: [
        '**Vấn đề**: "Trên máy tôi chạy bình thường, sao lên server lại lỗi?"',
        '**Docker** đóng gói toàn bộ: Node runtime, thư viện npm, biến môi trường và code vào một **Container**.',
        'Chạy nhất quán trên mọi máy tính: Windows, Mac, Linux server.',
        '`Dockerfile` là bản công thức hướng dẫn cách dựng Container.'
      ],
      img: { src: 'docker-logo.svg', cap: 'Docker Container Platform', h: 180 }
    },
    {
      title: 'File cấu hình Dockerfile cho Node.js',
      code: { file: 'Dockerfile', lang: 'dockerfile', size: 'xs', src: `# 1. Sử dụng Node image chính thức nhẹ (alpine)
FROM node:20-alpine

# 2. Tạo thư mục làm việc trong container
WORKDIR /app

# 3. Copy file package trước để tận dụng Docker cache layer
COPY package*.json ./

# 4. Cài đặt dependencies chỉ cho production
RUN npm ci --only=production

# 5. Copy toàn bộ mã nguồn
COPY . .

# 6. Mở cổng kết nối
EXPOSE 3000

# 7. Lệnh khởi chạy server
CMD ["node", "src/server.js"]` },
      callout: { type: 'tip', t: 'Luôn tạo file `.dockerignore` chứa `node_modules`, `.env`, `.git` để giảm kích thước image từ hàng GB xuống chỉ còn vài chục MB!' }
    },
    {
      title: 'Quy trình Deploy lên Cloud (Render / Railway)',
      steps: [
        { h: '1. Git Push', p: 'Đẩy mã nguồn sạch lên GitHub repository (nhớ check kỹ không lộ file .env)' },
        { h: '2. Tạo MySQL Cloud', p: 'Tạo database miễn phí trên Railway / Aiven / Supabase' },
        { h: '3. Chạy Schema', p: 'Kết nối và chạy file schema.sql để tạo sẵn bảng' },
        { h: '4. Kết nối Web Service', p: 'Trên Render, chọn "New Web Service" nối với GitHub repo' },
        { h: '5. Cấu hình Env Vars', p: 'Điền `PORT`, `DB_HOST`, `DB_PASS`, `JWT_SECRET` trên dashboard Render' }
      ]
    },
    {
      title: 'Bảo vệ Đồ án & Định hướng Tương lai',
      cards: [
        { icon: '🎯', h: 'Tiêu chí Đánh giá Đồ án', p: '1. Đúng chuẩn RESTful & HTTP status code.<br>2. Bảo mật mật khẩu & JWT đầy đủ.<br>3. Phân quyền và xử lý lỗi tập trung.<br>4. Có tài liệu Swagger và có thể chạy online.' },
        { icon: '🚀', h: 'Bước tiếp theo trên lộ trình Back-end', p: '• Tìm hiểu TypeScript để viết code chặt chẽ hơn.<br>• Học Redis để làm Caching và Session.<br>• Message Queue (RabbitMQ / Kafka) cho xử lý bất đồng bộ nặng.<br>• Microservices kiến trúc và CI/CD nâng cao.' }
      ], cols: 2
    },
    {
      title: 'Câu hỏi tổng kết cuối khóa', badge: 'QUIZ',
      quiz: {
        q: 'Khi đưa ứng dụng Node.js lên môi trường Production, biến môi trường `PORT` nên được xử lý thế nào?',
        opts: [
          'Luôn gán cứng `const PORT = 3000;`.',
          'Sử dụng `const PORT = process.env.PORT || 3000;` để nhận cổng do dịch vụ Cloud tự động cấp phát.',
          'Bắt buộc dùng cổng 80 cho HTTP và 443 cho HTTPS trong code Node.',
          'Không cần cổng vì Docker tự giải quyết.'
        ],
        a: 1,
        why: 'Các nền tảng đám mây như Render, Heroku, Railway cấp phát cổng động cho từng container qua biến môi trường `process.env.PORT`. Nếu bạn gán cứng số 3000, dịch vụ Cloud sẽ không thể route traffic tới ứng dụng và báo lỗi deploy!'
      }
    }
  ],
  recap: [
    '**Jest & Supertest** giúp kiểm thử tự động từ Unit test tới Integration test API',
    '**Swagger / OpenAPI** cung cấp tài liệu tương tác chuyên nghiệp cho các đội nhóm',
    '**Docker** đóng gói ứng dụng đồng nhất, giải quyết triệt để lỗi khác biệt môi trường',
    'Deploy ứng dụng lên **Cloud** (Render/Railway) sử dụng biến môi trường bảo mật',
    'Chúc mừng lớp **CT9** đã hoàn thành xuất sắc 12 buổi lập trình Back-end với Node.js & Express!'
  ],
  exercises: [
    {
      level: 'warmup', time: 20, title: 'Cài đặt Jest và viết test Health Check',
      desc: 'Thiết lập môi trường kiểm thử tự động.',
      tasks: [
        'Cài đặt `jest` và `supertest` vào devDependencies',
        'Thêm script `"test": "jest --detectOpenHandles --runInBand"` vào `package.json`',
        'Tạo route `GET /api/health` trả về `{ ok: true, uptime: process.uptime() }`',
        'Viết file `tests/health.test.js` kiểm tra status 200 và trường `ok` là true',
        'Chạy lệnh `npm test` và xem kết quả xanh lá'
      ]
    },
    {
      level: 'core', time: 35, title: 'Viết Integration Test cho Authentication',
      desc: 'Tự động kiểm thử luồng đăng ký và đăng nhập.',
      tasks: [
        'Tạo file `tests/auth.test.js`',
        'Test case 1: Đăng ký thành công trả về mã 201 và data user không có `password_hash`',
        'Test case 2: Đăng ký với email đã tồn tại trả về mã 409',
        'Test case 3: Đăng nhập thành công trả về mã 200 kèm chuỗi token',
        'Test case 4: Đăng nhập sai password trả về mã 401'
      ],
      solution: { file: 'tests/auth.test.js', lang: 'javascript', src: `const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  it('Login sai mật khẩu trả về 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@test.com',
      password: 'wrong'
    });
    expect(res.statusCode).toBe(401);
  });
});` }
    },
    {
      level: 'core', time: 35, title: 'Tích hợp Swagger UI cho API DevBlog',
      desc: 'Sinh giao diện tài liệu API tại đường dẫn /api-docs.',
      tasks: [
        'Cài đặt `swagger-ui-express` và `swagger-jsdoc`',
        'Tạo file cấu hình `src/config/swagger.js`',
        'Gắn Swagger UI vào route `/api-docs` của Express app',
        'Viết chú thích OpenAPI JSDoc cho route `POST /api/auth/login` và `GET /api/posts`',
        'Mở trình duyệt vào `http://localhost:3000/api-docs` và test gửi request thành công trên giao diện Swagger'
      ]
    },
    {
      level: 'core', time: 30, title: 'Tạo Dockerfile và .dockerignore cho dự án',
      desc: 'Đóng gói ứng dụng Express vào Docker image.',
      tasks: [
        'Tạo file `.dockerignore` bỏ qua `node_modules`, `.env`, `.git`, `tests`',
        'Tạo file `Dockerfile` sử dụng base image `node:20-alpine`',
        'Copy `package*.json`, chạy `npm ci --only=production`',
        'Thử build docker image bằng lệnh `docker build -t devblog-api .` (nếu máy có cài Docker)'
      ]
    },
    {
      level: 'challenge', time: 40, title: 'Thiết lập GitHub Actions CI tự động chạy test',
      desc: 'Tự động kiểm tra chất lượng code mỗi khi tạo Pull Request.',
      tasks: [
        'Tạo thư mục `.github/workflows/` trong project',
        'Tạo file `ci.yml` kích hoạt mỗi khi có `push` hoặc `pull_request` vào nhánh `main`',
        'Cấu hình job chạy trên `ubuntu-latest`, cài đặt Node.js v20, chạy `npm ci` và `npm test`',
        'Push lên GitHub và theo dõi tab **Actions** xem quy trình CI chạy thành công'
      ],
      solution: { file: '.github/workflows/ci.yml', lang: 'yaml', src: `name: Node.js CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm ci
      - run: npm test` }
    },
    {
      level: 'homework', time: 50, title: 'Deploy ứng dụng lên Render / Railway',
      desc: 'Đưa DevBlog API chính thức chạy trên Internet.',
      tasks: [
        'Tạo tài khoản Render.com hoặc Railway.app',
        'Khởi tạo một database MySQL trên cloud',
        'Chạy các câu lệnh schema và seed dữ liệu mẫu',
        'Kết nối GitHub repository của DevBlog với Render Web Service',
        'Thiết lập các biến môi trường: `NODE_ENV=production`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`',
        'Lấy URL public (ví dụ `https://devblog-ct9.onrender.com`) và test gọi API qua Postman'
      ]
    },
    {
      level: 'project', time: 60, title: 'Bảo vệ Đồ án DevBlog API (Final Presentation)',
      desc: 'Trình bày và bảo vệ sản phẩm trước giảng viên và cả lớp.',
      tasks: [
        'Chuẩn bị slide thuyết trình 5 phút: Giới thiệu đề tài, Kiến trúc MVC, Thiết kế CSDL ERD, Các giải pháp bảo mật đã áp dụng',
        'Demo trực tiếp các luồng chính: Đăng ký → Đăng nhập nhận JWT → Đăng bài viết có ảnh bìa → Phân trang → Đăng nhập với quyền Admin xóa bài',
        'Trình diễn tài liệu Swagger API tại đường link online',
        'Trả lời các câu hỏi phản biện của giảng viên về xử lý lỗi, chống SQL Injection và tối ưu hiệu năng'
      ]
    }
  ],
  project: {
    lead: '**Cột mốc cuối cùng**: Hoàn thiện, Triển khai và Bảo vệ đồ án DevBlog API.',
    tasks: ['Kiểm thử tự động với Jest', 'Tài liệu API tương tác với Swagger', 'Triển khai cloud online và bảo vệ đồ án'],
    callout: { type: 'tip', t: 'Chúc các bạn lớp CT9 tự tin bước vào con đường lập trình viên Web Back-end chuyên nghiệp! 🎓' }
  }
};
