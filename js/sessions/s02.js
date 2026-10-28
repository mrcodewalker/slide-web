/* ============================================================
   BUỔI 2 — JavaScript bất đồng bộ & HTTP Server thuần
   ============================================================ */
SESSION_DATA[2] = {
  intro: 'Buổi này "khó thở" nhất phần Node nền tảng. Dành thời gian cho Promise/async-await vì toàn bộ Express, Sequelize, bcrypt, JWT đều trả Promise. Cuối buổi cho học viên tự cảm nhận nỗi đau của http thuần để háo hức với Express.',
  agenda: [
    { min: 10, t: 'Ôn buổi 1 & chữa bài tập', d: '' },
    { min: 30, t: 'Vì sao cần bất đồng bộ? Callback & callback hell', d: 'error-first callback' },
    { min: 30, t: 'Promise: then / catch / all', d: '' },
    { min: 30, t: 'async / await & xử lý lỗi', d: 'try/catch, song song vs tuần tự' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 20, t: 'CommonJS vs ES Modules, fs/promises, EventEmitter', d: '' },
    { min: 40, t: 'Tạo HTTP server bằng module http', d: 'req, res, routing thủ công, JSON, đọc body' },
    { min: 10, t: 'Tổng kết: nỗi đau → Express', d: '' }
  ],
  slides: [
    { kind: 'section', no: '01', title: 'Bất đồng bộ trong JavaScript', sub: 'Callback → Promise → async/await: ba thế hệ cùng một ý tưởng.' },
    {
      title: 'Vì sao cần bất đồng bộ (Asynchronous)?',
      lead: 'Đọc file từ ổ cứng, gửi truy vấn MySQL hoặc gọi API mạng đều là các thao tác **I/O tốn thời gian**. Chúng ta không thể để toàn bộ server bị "đóng băng" đứng chờ.',
      bullets: [
        '**Mô hình Đồng bộ (Synchronous - Hình bên trái)**: Hàm gọi I/O $\\rightarrow$ luồng CPU bị chặn (blocking) $\\rightarrow$ không thể tiếp nhận thêm bất kỳ kết nối nào khác cho đến khi xong việc.',
        '**Mô hình Bất đồng bộ (Asynchronous - Hình bên phải)**: Hàm phát lệnh I/O kèm một hàm gọi lại (**Callback**) $\\rightarrow$ luồng chính quay lại phục vụ ngay các request tiếp theo $\\rightarrow$ khi I/O hoàn tất, callback được kích hoạt để trả kết quả.',
        '**Sự tiến hóa của cú pháp trong JavaScript**: Trải qua 3 thế hệ để xử lý bất đồng bộ: **Callback** (ES5) $\\rightarrow$ **Promise** (ES6) $\\rightarrow$ **async / await** (ES8 hiện đại).'
      ],
      img: [{ src: 'callback-sync.svg', cap: 'Đồng bộ: Luồng bị chặn cứng chờ kết quả', h: 180 }, { src: 'callback-async.svg', cap: 'Bất đồng bộ: Giải phóng luồng, kích hoạt callback khi xong', h: 180 }],
      callout: { type: 'info', t: 'Event Loop lo việc điều phối các sự kiện này. Nhiệm vụ của lập trình viên là viết code xử lý kết quả sao cho sạch sẽ, không lỗi và dễ bảo trì.' }
    },
    {
      title: 'Thế hệ 1: Callback & Quy ước Error-First', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'callback.js', lang: 'javascript', size: 'sm', src: `const fs = require('fs');

console.log('1. Bắt đầu đọc file');

// Truyền hàm callback ẩn danh làm tham số cuối cùng
fs.readFile('data.json', 'utf8', (err, text) => {
  if (err) {
    console.error('❌ Có lỗi xảy ra:', err.message);
    return;
  }
  const data = JSON.parse(text);
  console.log('3. Đọc thành công:', data.length, 'bản ghi');
});

console.log('2. Dòng này được thực thi NGAY LẬP TỨC!');` },
      bullets: [
        '**Hàm gọi lại (Callback)**: Là hàm được truyền như một đối số vào hàm khác để được gọi thực thi vào thời điểm sau.',
        '**Chuẩn Error-First Callback của Node.js**: Tham số đầu tiên LUÔN LUÔN là đối tượng lỗi `err` (nếu không có lỗi thì `err = null`), các tham số tiếp theo là dữ liệu kết quả.',
        '**Quy tắc bắt buộc**: Luôn kiểm tra `if (err)` trước tiên! Nếu có lỗi thì `return` ngay để tránh crash ứng dụng.'
      ]
    },
    {
      title: 'Callback hell 😱', kicker: 'B02 · Vấn đề của callback',
      layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'hell.js', lang: 'javascript', size: 'xs', src: `getUser(id, (err, user) => {\n  if (err) return handle(err);\n  getPosts(user.id, (err, posts) => {\n    if (err) return handle(err);\n    getComments(posts[0].id, (err, comments) => {\n      if (err) return handle(err);\n      getLikes(comments[0].id, (err, likes) => {\n        if (err) return handle(err);\n        console.log(likes);\n      });\n    });\n  });\n});` },
      bullets: ['Lồng nhau sâu → khó đọc, khó sửa', 'Xử lý lỗi **lặp lại** ở mỗi tầng', 'Khó chạy **song song**'],
      callout: { type: 'warn', t: 'Còn gọi là “**pyramid of doom**”. Promise ra đời để giải quyết chuyện này.' }
    },
    {
      title: 'Thế hệ 2: Promise', kicker: 'B02 · “Lời hứa” sẽ có kết quả',
      steps: [
        { h: 'pending', p: 'Đang chờ — chưa có kết quả' },
        { h: 'fulfilled', p: 'Thành công → có **giá trị** (`resolve`)' },
        { h: 'rejected', p: 'Thất bại → có **lý do** (`reject`)' }
      ],
      code: { file: 'promise.js', lang: 'javascript', size: 'sm', src: `const wait = (ms) => new Promise((resolve, reject) => {\n  if (ms < 0) return reject(new Error('ms phải >= 0'));\n  setTimeout(() => resolve(\`Đã chờ \${ms}ms\`), ms);\n});\n\nwait(500).then(console.log); // Đã chờ 500ms` }
    },
    {
      title: 'then / catch / finally — chuỗi Promise', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'chain.js', lang: 'javascript', size: 'sm', src: `fetchUser(1)\n  .then(user => fetchPosts(user.id))   // trả Promise → nối tiếp\n  .then(posts => posts.length)\n  .then(n => console.log('Số bài:', n))\n  .catch(err => console.error('Lỗi:', err.message))\n  .finally(() => console.log('Xong!'));` },
      bullets: ['`then` trả về Promise mới → **nối chuỗi phẳng**', 'Một `catch` ở cuối bắt **mọi lỗi** phía trên', '`finally` luôn chạy (dọn dẹp, tắt loading)']
    },
    {
      title: 'Chạy nhiều Promise cùng lúc',
      table: {
        head: ['Hàm', 'Hoàn thành khi…', 'Dùng khi'],
        rows: [
          ['`Promise.all([...])`', 'Tất cả xong (1 cái lỗi → lỗi hết)', 'Cần **đủ** kết quả: user + posts + tags'],
          ['`Promise.allSettled([...])`', 'Tất cả xong, kể cả lỗi', 'Muốn biết cái nào thành công / thất bại'],
          ['`Promise.race([...])`', 'Cái **đầu tiên** xong', 'Timeout, lấy từ nguồn nhanh nhất'],
          ['`Promise.any([...])`', 'Cái đầu tiên **thành công**', 'Thử nhiều mirror']
        ]
      },
      code: { lang: 'javascript', size: 'sm', src: `const [users, posts] = await Promise.all([getUsers(), getPosts()]); // chạy song song` }
    },
    {
      title: 'Thế hệ 3: async / await', badge: 'LIVE CODING', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'async.js', lang: 'javascript', size: 'sm', src: `async function main() {\n  const user = await getUser(1);\n  const posts = await getPosts(user.id);\n  const comments = await getComments(posts[0].id);\n  console.log(comments);\n}\n\nmain();` },
      bullets: ['Code bất đồng bộ nhưng **đọc như đồng bộ**', '`async` function **luôn trả Promise**', '`await` chỉ dùng trong hàm `async` (hoặc top-level của ES Module)', '`await` **không chặn** event loop — chỉ tạm dừng hàm này'],
      notes: 'Viết lại ví dụ callback hell bằng async/await để học viên thấy sự khác biệt.'
    },
    {
      title: 'Xử lý lỗi với try / catch', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'errors.js', lang: 'javascript', size: 'sm', src: `async function loadConfig() {\n  try {\n    const text = await fs.promises.readFile('config.json', 'utf8');\n    return JSON.parse(text);\n  } catch (err) {\n    if (err.code === 'ENOENT') return {};  // file chưa có → mặc định\n    throw err;                              // lỗi khác → ném tiếp\n  } finally {\n    console.log('Đã thử đọc config');\n  }\n}` },
      bullets: ['`try/catch` bắt cả lỗi **throw** lẫn Promise **reject**', 'Chỉ bắt lỗi bạn **xử lý được**, còn lại `throw` tiếp', 'Quên `await` → lỗi **không** bị catch!'],
      callout: { type: 'danger', t: 'Promise bị reject mà không ai bắt → `UnhandledPromiseRejection` → **Node có thể sập**.' }
    },
    {
      title: 'Tuần tự hay song song?', kicker: 'B02 · Lỗi hiệu năng phổ biến',
      cols: [
        { h: '🐢 Tuần tự: ~3 giây', cls: 'bad', code: { lang: 'javascript', size: 'sm', src: `console.time('seq');\nconst a = await wait(1000);\nconst b = await wait(1000);\nconst c = await wait(1000);\nconsole.timeEnd('seq'); // ~3000ms` } },
        { h: '🚀 Song song: ~1 giây', cls: 'good', code: { lang: 'javascript', size: 'sm', src: `console.time('par');\nconst [a, b, c] = await Promise.all([\n  wait(1000), wait(1000), wait(1000)\n]);\nconsole.timeEnd('par'); // ~1000ms` } }
      ],
      callout: { type: 'tip', t: 'Nếu các việc **không phụ thuộc nhau** (kết quả A không cần cho B) → dùng `Promise.all`.' }
    },
    {
      title: 'Đố vui: async + await', badge: 'QUIZ',
      code: { lang: 'javascript', size: 'sm', src: `async function f() {\n  console.log(1);\n  await null;\n  console.log(2);\n}\nconsole.log(0);\nf();\nconsole.log(3);` },
      quiz: { q: 'In ra theo thứ tự nào?', opts: ['0 1 2 3', '0 1 3 2', '0 3 1 2', '1 0 2 3'], a: 1, why: 'Phần code của `f` **trước** `await` chạy đồng bộ (in 1). `await` nhường quyền → in 3. Phần **sau** await chạy như microtask → in 2.' }
    },
    {
      title: 'fs/promises & util.promisify', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'fs-promises.js', lang: 'javascript', size: 'sm', src: `const fs = require('fs/promises');\nconst path = require('path');\n\nasync function main() {\n  const dir = path.join(__dirname, 'data');\n  const files = await fs.readdir(dir);\n  for (const f of files) {\n    const text = await fs.readFile(path.join(dir, f), 'utf8');\n    console.log(f, text.length);\n  }\n  await fs.writeFile('out.json', JSON.stringify(files));\n}\nmain().catch(console.error);` },
      bullets: ['`require(\'fs/promises\')` → **mọi hàm trả Promise**', 'Hàm cũ dùng callback? → `util.promisify(fn)`', 'Quy tắc: **async + fs/promises** thay cho `*Sync`']
    },

    { kind: 'section', no: '02', title: 'Module hiện đại & Events', sub: 'CommonJS vs ES Modules, và mẫu thiết kế EventEmitter nằm khắp Node.' },
    {
      title: 'CommonJS vs ES Modules',
      table: {
        head: ['', 'CommonJS (CJS)', 'ES Modules (ESM)'],
        rows: [
          ['Xuất', '`module.exports = { a }`', '`export const a` · `export default`'],
          ['Nhập', '`const { a } = require(\'./x\')`', '`import { a } from \'./x.js\'`'],
          ['Nạp', 'Đồng bộ', 'Bất đồng bộ (hỗ trợ top-level `await`)'],
          ['Bật bằng', 'Mặc định', '`"type": "module"` hoặc đuôi `.mjs`'],
          ['Biến `__dirname`', '✅ Có sẵn', '❌ Dùng `import.meta.url`'],
          ['Hệ sinh thái', 'Rất phổ biến, nhiều tài liệu', 'Chuẩn của JS, xu hướng tương lai']
        ]
      },
      callout: { type: 'tip', t: 'Khóa học dùng **CommonJS** cho Express (nhiều tài liệu, ít rắc rối). Bạn chỉ cần **nhận ra** ESM khi đọc code khác.' }
    },
    {
      title: 'Dùng ES Modules trong Node', layout: 'split', ratio: '1fr 1fr',
      cols: [
        { h: 'package.json', code: { lang: 'json', size: 'sm', src: `{\n  "type": "module"\n}` } },
        { h: 'app.js', code: { lang: 'javascript', size: 'sm', src: `import fs from 'node:fs/promises';\nimport { fileURLToPath } from 'node:url';\nimport path from 'node:path';\n\nconst __dirname = path.dirname(\n  fileURLToPath(import.meta.url)\n);\nconst text = await fs.readFile(\n  path.join(__dirname, 'a.txt'), 'utf8'\n);` } }
      ],
      callout: { type: 'warn', t: 'ESM **bắt buộc** ghi đuôi `.js` khi import file nội bộ: `import x from \'./x.js\'`.' }
    },
    {
      title: 'EventEmitter — lập trình hướng sự kiện', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'events.js', lang: 'javascript', size: 'sm', src: `const EventEmitter = require('events');\nconst bus = new EventEmitter();\n\nbus.on('user:created', (user) => {\n  console.log('📧 Gửi mail chào mừng cho', user.email);\n});\nbus.on('user:created', (user) => {\n  console.log('📊 Ghi thống kê đăng ký');\n});\n\nbus.emit('user:created', { email: 'lan@ct9.vn' });` },
      bullets: ['`on(sự kiện, handler)` — đăng ký lắng nghe', '`emit(sự kiện, dữ liệu)` — phát sự kiện', 'Nhiều handler cho một sự kiện', 'Hầu hết object của Node (**http server, stream, process**) đều là EventEmitter']
    },

    { kind: 'section', no: '03', title: 'HTTP Server thuần', sub: 'Tự dựng web server chỉ với module có sẵn — để hiểu Express đang làm gì hộ chúng ta.' },
    {
      title: 'Server đầu tiên trong 8 dòng', badge: 'LIVE CODING',
      code: { file: 'server.js', lang: 'javascript', src: `const http = require('http');\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });\n  res.end('Xin chào từ Node.js server!');\n});\n\nserver.listen(3000, () => {\n  console.log('🚀 Server chạy tại http://localhost:3000');\n});` },
      term: `$ node server.js\n🚀 Server chạy tại http://localhost:3000`,
      notes: 'Mở trình duyệt gõ localhost:3000 — khoảnh khắc "wow". Sau đó F12 → Network cho học viên xem request/response thật (nối lại B1).'
    },
    {
      title: 'req & res — hai đối tượng quan trọng nhất', kicker: 'B02 · Request / Response',
      cols: [
        { h: '📥 req (IncomingMessage)', bullets: ['`req.method` — GET, POST…', '`req.url` — `/api/posts?page=2`', '`req.headers` — object headers', '`req` là **stream**: đọc body qua sự kiện `data` / `end`'] },
        { h: '📤 res (ServerResponse)', bullets: ['`res.statusCode` / `res.writeHead(code, headers)`', '`res.setHeader(name, value)`', '`res.write(chunk)` — ghi từng phần', '`res.end(data)` — **kết thúc** response (bắt buộc!)'] }
      ],
      callout: { type: 'danger', t: 'Quên gọi `res.end()` → trình duyệt **quay mãi không thôi**. Đây là lỗi kinh điển của người mới.' }
    },
    {
      title: 'Routing thủ công', layout: 'split', ratio: '1.25fr .75fr',
      code: { file: 'routes.js', lang: 'javascript', size: 'xs', src: `const http = require('http');\nconst { URL } = require('url');\n\nconst json = (res, code, data) => {\n  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });\n  res.end(JSON.stringify(data));\n};\n\nhttp.createServer((req, res) => {\n  const url = new URL(req.url, \`http://\${req.headers.host}\`);\n\n  if (req.method === 'GET' && url.pathname === '/') {\n    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });\n    return res.end('<h1>Trang chủ</h1>');\n  }\n  if (req.method === 'GET' && url.pathname === '/api/hello') {\n    const name = url.searchParams.get('name') || 'bạn';\n    return json(res, 200, { message: \`Xin chào \${name}\` });\n  }\n  json(res, 404, { error: 'Not Found' });\n}).listen(3000);` },
      bullets: ['Phân nhánh theo **method + pathname**', '`URL` giúp tách query string', 'Luôn có nhánh cuối trả **404**']
    },
    {
      title: 'Đọc body của POST — thủ công', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'body.js', lang: 'javascript', size: 'sm', src: `function readJson(req) {\n  return new Promise((resolve, reject) => {\n    let raw = '';\n    req.on('data', (chunk) => (raw += chunk));\n    req.on('end', () => {\n      try { resolve(raw ? JSON.parse(raw) : {}); }\n      catch (e) { reject(new Error('JSON không hợp lệ')); }\n    });\n    req.on('error', reject);\n  });\n}\n\n// dùng:\nconst body = await readJson(req);` },
      bullets: ['Body đến theo **từng mảnh** (chunk)', 'Phải tự **ghép** và `JSON.parse`', 'Phải tự bắt **JSON hỏng**', 'Tự giới hạn dung lượng nếu muốn an toàn…']
    },
    {
      title: 'Thử server bằng curl', badge: 'LIVE DEMO',
      term: `$ curl http://localhost:3000/api/hello?name=Lan\n{"message":"Xin chào Lan"}\n\n$ curl -i http://localhost:3000/khong-co\nHTTP/1.1 404 Not Found\nContent-Type: application/json; charset=utf-8\n\n{"error":"Not Found"}\n\n$ curl -X POST -H "Content-Type: application/json" -d "{\\"title\\":\\"Bai 1\\"}" http://localhost:3000/api/posts`,
      callout: { type: 'tip', t: '`-i` hiện cả headers, `-X` chọn method, `-H` thêm header, `-d` gửi body. Từ buổi sau ta chuyển sang **Postman** cho tiện.' }
    },
    {
      title: 'Nỗi đau của http thuần', kicker: 'B02 · Vì sao cần Express?',
      cols: [
        { h: '😫 Phải tự làm', cls: 'bad', bullets: ['Chuỗi `if/else` routing dài vô tận', 'Tự parse query, body, cookie', 'Tự set `Content-Type`, status', 'Tự phục vụ file tĩnh', 'Tự xử lý lỗi, log, CORS…'] },
        { h: '😍 Mong muốn', cls: 'good', bullets: ['`app.get(\'/posts\', handler)`', '`req.query`, `req.body`, `req.params` có sẵn', '`res.json(data)`, `res.status(404)`', '`express.static(\'public\')`', 'Middleware cắm-và-chạy'] }
      ],
      img: { src: 'express-logo.png', cap: 'Buổi sau: Express — framework web tối giản cho Node.js', h: 110 },
      layout: 'stack'
    }
  ],
  recap: [
    'Callback → **Promise** → **async/await**; luôn xử lý lỗi (`try/catch`, `.catch`)',
    '`Promise.all` để chạy song song; đừng `await` tuần tự các việc độc lập',
    'CommonJS (`require`) vs ESM (`import`); `fs/promises`; `EventEmitter`',
    '`http.createServer((req, res) => …)` + `res.end()`; routing & body parsing thủ công rất dài dòng → **Express**'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Đoán thứ tự chạy',
      desc: 'Không chạy code! Viết ra giấy thứ tự in ra của từng đoạn, sau đó chạy để kiểm chứng.',
      tasks: ['Đoạn 1: `console.log(1); setTimeout(()=>console.log(2),0); console.log(3);`', 'Đoạn 2: `Promise.resolve().then(()=>console.log("a")); setTimeout(()=>console.log("b"),0); console.log("c");`', 'Đoạn 3: hàm `async` có `await` ở giữa, gọi giữa hai `console.log`', 'Giải thích **vì sao** bằng 1–2 câu cho mỗi đoạn'],
      expected: 'Đoạn 1: 1 3 2\nĐoạn 2: c a b',
      hints: ['Thứ tự ưu tiên: **code đồng bộ → microtask (Promise) → macrotask (setTimeout)**']
    },
    {
      level: 'core', time: 20, title: 'sleep() và đo thời gian',
      desc: 'Viết hàm `sleep(ms)` trả Promise rồi đo sự khác biệt giữa chạy tuần tự và song song.',
      tasks: ['Viết `sleep(ms)`', 'Chạy 3 lần `sleep(500)` **tuần tự** và đo bằng `console.time`', 'Chạy lại bằng `Promise.all` và so sánh', 'Viết thêm `withTimeout(promise, ms)`: reject nếu quá thời gian (dùng `Promise.race`)'],
      expected: 'tuan-tu: 1506ms\nsong-song: 502ms',
      hints: ['`console.time("x")` … `console.timeEnd("x")`', '`withTimeout`: race giữa `promise` và một Promise tự reject sau `ms`'],
      solution: { file: 'sleep.js', lang: 'javascript', src: `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));\n\nconst withTimeout = (p, ms) =>\n  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout')), ms))]);\n\n(async () => {\n  console.time('tuan-tu');\n  await sleep(500); await sleep(500); await sleep(500);\n  console.timeEnd('tuan-tu');\n\n  console.time('song-song');\n  await Promise.all([sleep(500), sleep(500), sleep(500)]);\n  console.timeEnd('song-song');\n\n  try { await withTimeout(sleep(2000), 500); }\n  catch (e) { console.log('Lỗi:', e.message); }\n})();` }
    },
    {
      level: 'core', time: 25, title: 'Đọc nhiều file JSON song song',
      desc: 'Có thư mục `data/` gồm `users.json`, `posts.json`, `tags.json`. Đọc cả ba cùng lúc và in thống kê.',
      tasks: ['Tạo 3 file JSON mẫu (mảng object)', 'Dùng `fs/promises` + `Promise.all` để đọc song song', 'In: “Có X users, Y posts, Z tags”', 'File nào **không tồn tại** → coi như mảng rỗng (dùng `Promise.allSettled` hoặc try/catch)'],
      hints: ['`path.join(__dirname, "data", name)`', 'Viết hàm nhỏ `readJson(name)` rồi map qua danh sách tên'],
      solution: { file: 'stats.js', lang: 'javascript', src: `const fs = require('fs/promises');\nconst path = require('path');\n\nasync function readJson(name) {\n  try {\n    const text = await fs.readFile(path.join(__dirname, 'data', name + '.json'), 'utf8');\n    return JSON.parse(text);\n  } catch (e) {\n    if (e.code === 'ENOENT') return [];\n    throw e;\n  }\n}\n\n(async () => {\n  const [users, posts, tags] = await Promise.all(['users', 'posts', 'tags'].map(readJson));\n  console.log(\`Có \${users.length} users, \${posts.length} posts, \${tags.length} tags\`);\n})();` }
    },
    {
      level: 'core', time: 20, title: 'EventEmitter: hệ thống đơn hàng',
      desc: 'Tạo lớp `OrderService extends EventEmitter`. Khi tạo đơn hàng sẽ phát sự kiện để các module khác phản ứng.',
      tasks: ['`createOrder(order)` phát `order:created`', 'Listener 1: in “Gửi email xác nhận”', 'Listener 2: trừ tồn kho (giả lập bằng console.log)', '`pay(id)` phát `order:paid`; thêm listener ghi log vào file'],
      hints: ['`class OrderService extends EventEmitter { … this.emit(...) }`', 'Mỗi listener nên là một hàm riêng, đăng ký bằng `service.on(...)`'],
      solution: { file: 'orders.js', lang: 'javascript', src: `const EventEmitter = require('events');\n\nclass OrderService extends EventEmitter {\n  constructor() { super(); this.orders = []; }\n  createOrder(order) {\n    const o = { id: this.orders.length + 1, ...order, paid: false };\n    this.orders.push(o);\n    this.emit('order:created', o);\n    return o;\n  }\n  pay(id) {\n    const o = this.orders.find((x) => x.id === id);\n    if (!o) throw new Error('Không có đơn ' + id);\n    o.paid = true;\n    this.emit('order:paid', o);\n  }\n}\n\nconst svc = new OrderService();\nsvc.on('order:created', (o) => console.log('📧 Gửi email xác nhận đơn #' + o.id));\nsvc.on('order:created', (o) => console.log('📦 Trừ kho:', o.item));\nsvc.on('order:paid', (o) => console.log('💰 Đơn #' + o.id + ' đã thanh toán'));\n\nconst o = svc.createOrder({ item: 'Sách Node.js' });\nsvc.pay(o.id);` }
    },
    {
      level: 'core', time: 30, title: 'Server 3 route bằng http thuần',
      desc: 'Dựng server `http` thuần với 3 route và trang 404 dạng JSON.',
      tasks: ['`GET /` → trả HTML “Xin chào”', '`GET /api/time` → JSON `{ now: "<ISO time>" }`', '`GET /api/hello?name=Lan` → JSON lời chào (mặc định “bạn”)', 'Route khác → **404** JSON `{ "error": "Not Found" }`', 'Kiểm tra bằng trình duyệt **và** `curl -i`'],
      expected: '$ curl http://localhost:3000/api/hello?name=Lan\n{"message":"Xin chào Lan"}',
      hints: ['`new URL(req.url, "http://" + req.headers.host)`', '`url.searchParams.get("name")`', 'Đừng quên `Content-Type` và `res.end()`'],
      solution: { file: 'server.js', lang: 'javascript', src: `const http = require('http');\nconst { URL } = require('url');\n\nconst send = (res, code, type, body) => {\n  res.writeHead(code, { 'Content-Type': type + '; charset=utf-8' });\n  res.end(body);\n};\nconst json = (res, code, data) => send(res, code, 'application/json', JSON.stringify(data));\n\nhttp.createServer((req, res) => {\n  const url = new URL(req.url, \`http://\${req.headers.host}\`);\n  if (req.method === 'GET' && url.pathname === '/') return send(res, 200, 'text/html', '<h1>Xin chào từ Node!</h1>');\n  if (req.method === 'GET' && url.pathname === '/api/time') return json(res, 200, { now: new Date().toISOString() });\n  if (req.method === 'GET' && url.pathname === '/api/hello') {\n    return json(res, 200, { message: 'Xin chào ' + (url.searchParams.get('name') || 'bạn') });\n  }\n  json(res, 404, { error: 'Not Found' });\n}).listen(3000, () => console.log('http://localhost:3000'));` }
    },
    {
      level: 'challenge', time: 40, title: 'To-do API thuần (in-memory)',
      desc: 'Xây API quản lý công việc **không dùng framework**. Đây là bản “nặng nhọc” để buổi sau bạn thấy Express nhẹ nhàng thế nào.',
      tasks: ['`GET /todos` — danh sách', '`POST /todos` — body `{ "title": "..." }` → trả **201** + todo mới; thiếu `title` → **400**', '`DELETE /todos/:id` — xóa (parse id từ URL thủ công); không thấy → **404**', 'Lưu trong mảng ở bộ nhớ', 'JSON hỏng → **400** thay vì sập server'],
      expected: '$ curl -X POST -H "Content-Type: application/json" -d "{\\"title\\":\\"Học Node\\"}" localhost:3000/todos\n{"id":1,"title":"Học Node","done":false}',
      hints: ['Tách `readJson(req)` thành hàm Promise riêng', 'Parse id: `url.pathname.match(/^\\/todos\\/(\\d+)$/)`', 'Bọc toàn bộ handler trong `try/catch`'],
      solution: { file: 'todos.js', lang: 'javascript', size: 'sm', src: `const http = require('http');\nlet todos = [], nextId = 1;\n\nconst json = (res, code, data) => {\n  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });\n  res.end(JSON.stringify(data));\n};\nconst readJson = (req) => new Promise((ok, fail) => {\n  let raw = '';\n  req.on('data', (c) => (raw += c));\n  req.on('end', () => { try { ok(raw ? JSON.parse(raw) : {}); } catch { fail(new Error('JSON không hợp lệ')); } });\n});\n\nhttp.createServer(async (req, res) => {\n  try {\n    const { pathname } = new URL(req.url, 'http://localhost');\n    if (req.method === 'GET' && pathname === '/todos') return json(res, 200, todos);\n    if (req.method === 'POST' && pathname === '/todos') {\n      const body = await readJson(req);\n      if (!body.title) return json(res, 400, { error: 'Thiếu title' });\n      const todo = { id: nextId++, title: body.title, done: false };\n      todos.push(todo);\n      return json(res, 201, todo);\n    }\n    const m = pathname.match(/^\\/todos\\/(\\d+)$/);\n    if (req.method === 'DELETE' && m) {\n      const id = Number(m[1]);\n      if (!todos.some((t) => t.id === id)) return json(res, 404, { error: 'Không tìm thấy' });\n      todos = todos.filter((t) => t.id !== id);\n      res.writeHead(204); return res.end();\n    }\n    json(res, 404, { error: 'Not Found' });\n  } catch (e) {\n    json(res, 400, { error: e.message });\n  }\n}).listen(3000);` }
    },
    {
      level: 'homework', time: 45, title: 'Static file server tự viết',
      desc: 'Viết server phục vụ thư mục `public/` (html, css, js, ảnh) — chính là việc `express.static` làm hộ bạn.',
      tasks: ['`/` trả `public/index.html`', 'Đặt `Content-Type` đúng theo đuôi file (html, css, js, json, png, jpg, svg)', 'File không tồn tại → 404', '**Chống path traversal**: `/../../etc/passwd` phải bị chặn (403)', 'Dùng `fs/promises` và `async/await`'],
      hints: ['Bảng MIME là object: `{ ".html": "text/html", … }`', 'Sau `path.join(PUBLIC, rel)`, kiểm tra kết quả **bắt đầu bằng** `PUBLIC + path.sep`', '`decodeURIComponent` đường dẫn trước khi xử lý'],
      solution: { file: 'static.js', lang: 'javascript', size: 'sm', src: `const http = require('http');\nconst fs = require('fs/promises');\nconst path = require('path');\n\nconst PUBLIC = path.resolve(__dirname, 'public');\nconst MIME = {\n  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',\n  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml'\n};\n\nhttp.createServer(async (req, res) => {\n  const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);\n  const file = path.join(PUBLIC, pathname === '/' ? 'index.html' : pathname);\n  if (!file.startsWith(PUBLIC + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }\n  try {\n    const data = await fs.readFile(file);\n    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });\n    res.end(data);\n  } catch {\n    res.writeHead(404); res.end('Not Found');\n  }\n}).listen(3000, () => console.log('http://localhost:3000'));` }
    },
    {
      level: 'project', time: 20, title: 'Đồ án DevBlog: dữ liệu mẫu',
      desc: 'Chuẩn bị dữ liệu giả cho API ở buổi 5.',
      tasks: ['Tạo `scripts/seed-posts.js` dùng `fs/promises`', 'Sinh `data/posts.json` với **5 bài viết** mẫu: `id`, `title`, `slug`, `content`, `author`, `createdAt`', 'Tái sử dụng hàm `slugify` từ B1', 'Chạy được bằng `npm run seed`'],
      hints: ['Thêm vào package.json: `"seed": "node scripts/seed-posts.js"`', 'Tạo thư mục `data/` nếu chưa có (`mkdir` với `recursive`)']
    }
  ],
  project: {
    lead: 'Chuẩn bị “nguyên liệu” cho API ở buổi 5.',
    tasks: ['Script `seed-posts.js` tạo 5 bài viết mẫu', 'Thêm script `npm run seed`', 'Commit: “feat: seed script for sample posts”'],
    callout: { type: 'tip', t: 'Message commit nên theo dạng `feat: …`, `fix: …`, `docs: …` (Conventional Commits).' }
  }
};
