/* ============================================================
   BUỔI 2 — JavaScript bất đồng bộ & HTTP Server thuần
   ============================================================ */
SESSION_DATA[2] = {
  intro: 'Buổi này trang bị nền tảng bất đồng bộ vững chắc: Call Stack, Event Loop, Microtask Queue, Promise, async/await, Streams, EventEmitter và module http thuần để học viên thấu hiểu vì sao ngành công nghiệp chuyển dịch sang Express.',
  agenda: [
    { min: 10, t: 'Ôn buổi 1 & chữa bài tập', d: 'CommonJS, fs/path/os, kiến trúc Client-Server' },
    { min: 35, t: 'Bản chất Bất đồng bộ, Call Stack & Event Loop', d: 'Latency Gap, Non-blocking I/O, Microtask vs Macrotask' },
    { min: 35, t: 'Promise toàn diện: then, catch, all, allSettled', d: 'Vòng đời Promise, chaining, xử lý song song' },
    { min: 30, t: 'async / await & xử lý ngoại lệ chuyên sâu', d: 'try/catch/finally, unhandled rejection, sequential vs concurrent' },
    { min: 10, t: 'Giải lao', d: '' },
    { min: 25, t: 'ESM vs CJS, Streams & EventEmitter', d: 'Buffers, Streams pipeline, Observer pattern' },
    { min: 45, t: 'Tạo HTTP server thuần & Nỗi đau routing thủ công', d: 'req stream, res.end, URL parser, body buffer, curl' },
    { min: 10, t: 'Tổng kết & giao bài tập B02', d: 'Tiền đề chuyển dịch sang Express ở Buổi 3' }
  ],
  slides: [
    /* ---------- SECTION 01: BẤT ĐỒNG BỘ TRONG JS ---------- */
    { kind: 'section', no: '01', title: 'Bất đồng bộ trong JavaScript', sub: 'Giải phẫu Call Stack, Event Loop và động cơ non-blocking của Node.js.' },
    {
      title: 'Vì sao cần bất đồng bộ (Asynchronous)?',
      lead: 'Đọc file từ đĩa, truy vấn MySQL hay gọi API mạng đều là các thao tác **I/O tốn thời gian**. Chúng ta không thể để toàn bộ máy chủ bị "đóng băng" đứng chờ.',
      bullets: [
        '**Bài toán Độ trễ phần cứng (Latency Gap)**:',
        { t: 'CPU tính toán cực nhanh: 1 chu kỳ lệnh chỉ tốn **0.3 nano-giây**.', sub: ['Truy vấn Cơ sở dữ liệu hoặc chờ mạng tốn **10–100 mili-giây** (chậm hơn hàng chục TRIỆU lần!).', 'Nếu chạy đồng bộ (Blocking), CPU sẽ ngồi "chết đứng" lãng phí hàng triệu chu kỳ quý giá!'] },
        '**Mô hình Đồng bộ (Synchronous - Hình bên trái)**: Hàm gọi I/O $\\rightarrow$ luồng CPU bị chặn cứng $\\rightarrow$ không thể tiếp nhận bất kỳ kết nối nào khác.',
        '**Mô hình Bất đồng bộ (Asynchronous - Hình bên phải)**: Phát lệnh I/O rồi giải phóng ngay luồng chính tiếp tục phục vụ các kết nối khác $\\rightarrow$ khi I/O hoàn tất, hàm Callback được kích hoạt.',
        '**Sự tiến hóa của cú pháp trong JavaScript**: Trải qua 3 thế hệ để xử lý bất đồng bộ: **Callback** (ES5) $\\rightarrow$ **Promise** (ES6) $\\rightarrow$ **async / await** (ES8 hiện đại).'
      ],
      img: [
        { src: 'callback-flow.svg', cap: 'Mô hình Callback trong kiến trúc bất đồng bộ (Wikipedia)', h: 420 },
        { src: 'thread-pool.svg', cap: 'Hàng đợi tác vụ & Worker Thread Pool xử lý I/O nền (Wikipedia)', h: 420 }
      ],
      callout: { type: 'tip', t: 'Nhờ cơ chế Event-driven Non-blocking, một máy chủ Node.js đơn luồng (Single-thread) có thể phục vụ đồng thời hàng chục ngàn kết nối mà chỉ tốn một lượng nhỏ RAM!' },
      notes: 'Nhấn mạnh sự chênh lệch tốc độ giữa tính toán RAM/CPU và Disk/Network để học viên hiểu lý do ra đời của Node.'
    },
    {
      title: 'Vòng lặp sự kiện & Call Stack trong V8 Runtime', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Call Stack (Ngăn xếp cuộc gọi)**: Cấu trúc LIFO (Last In, First Out) chứa các khung hàm (stack frames) đang thực thi đồng bộ.',
        '**Web APIs / C++ Background Threads**: Nơi Node.js ủy thác các tác vụ I/O nặng (đọc đĩa qua threadpool của libuv, network socket của hệ điều hành).',
        '**Callback Queue & Microtask Queue**: Hàng đợi FIFO lưu trữ các hàm callback sẵn sàng được đưa trở lại Call Stack.',
        '**Event Loop (Vòng lặp sự kiện)**: Người điều phối liên tục kiểm tra: **Nếu Call Stack rỗng**, lấy hàm đầu tiên trong hàng đợi đưa lên Call Stack thực thi.',
        '**Quy tắc bất di bất dịch**: Code JavaScript của bạn LUÔN CHẠY TRÊN 1 LUỒNG DUY NHẤT. Chỉ có các tác vụ I/O ngầm của C++ mới chạy đa luồng.'
      ],
      img: { src: 'libuv-loop.png', cap: 'Vòng lặp sự kiện Node.js Event Loop & Call Stack (Wikimedia Commons)', h: 540 },
      callout: { type: 'info', t: 'Call Stack không bao giờ bị gián đoạn giữa chừng: Một hàm đang chạy trên Stack phải chạy xong hoàn toàn mới nhường quyền.' }
    },
    {
      title: 'Microtask Queue vs Macrotask Queue: Thứ tự ưu tiên', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'priority.js', lang: 'javascript', size: 'sm', src: `console.log('1. Đồng bộ');

setTimeout(() => {
  console.log('4. Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Microtask (Promise.then)');
});

process.nextTick(() => {
  console.log('2. NextTick (Ưu tiên số 1)');
});` },
      bullets: [
        '**Thứ tự ưu tiên thực thi của Node.js Runtime**:',
        '**1. Synchronous Code**: Code chạy thẳng trên Call Stack lập tức.',
        '**2. process.nextTick()**: Microtask đặc biệt của Node, chạy trước mọi microtask khác ngay sau khi hàm hiện tại thoát.',
        '**3. Microtask Queue**: Gồm các callback của `Promise.then()`, `Promise.catch()`, `queueMicrotask()`. Chạy vét cạn sạch sẽ trước khi chuyển pha!',
        '**4. Macrotask Queue (Task Queue)**: `setTimeout()`, `setInterval()`, `setImmediate()`, I/O events.'
      ],
      callout: { type: 'tip', t: 'Kết quả in ra đúng chuẩn: 1. Đồng bộ ➔ 2. NextTick ➔ 3. Microtask ➔ 4. Macrotask.' }
    },
    {
      title: 'Tránh làm nghẽn Event Loop (Event Loop Starvation)', kicker: 'B02 · Lỗi kiến trúc sống còn',
      layout: 'split', ratio: '1.1fr .9fr',
      code: { file: 'blocking-loop.js', lang: 'javascript', size: 'sm', src: `// ⛔ NGUY HIỂM: Tính toán CPU-heavy chặn toàn bộ server!
app.get('/hash-heavy', (req, res) => {
  let count = 0;
  for (let i = 0; i < 5e9; i++) {
    count += i; // Chặn cứng Call Stack trong 5 giây!
  }
  res.send({ count });
});

// Trong 5 giây này, KHÔNG AI có thể truy cập bất kỳ route nào khác!` },
      bullets: [
        '**Triết lý cốt lõi của Node.js**: *"Don\'t block the event loop"*.',
        '**Những tác vụ gây nghẽn Call Stack**:',
        { t: 'Vòng lặp hàng tỷ lần, thuật toán mã hóa nặng, Regular Expression thảm họa (ReDoS).', sub: ['Đọc file đồng bộ với `fs.readFileSync()` trên luồng chính.', 'Xử lý hình ảnh, video kích thước lớn bằng JS thuần thay vì thư viện C++ native.'] },
        '**Giải pháp kiến trúc**:',
        { t: 'Đẩy tác vụ nặng sang **Worker Threads** (`worker_threads`), **Child Process** hoặc chuyển sang Microservice chuyên biệt (Python, Go, Rust).' }
      ],
      callout: { type: 'danger', t: 'Một người dùng gửi request tính toán nặng có thể làm tê liệt website của tất cả 10.000 khách hàng còn lại nếu bạn block Call Stack!' }
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
      title: 'Callback hell 😱 (Kim tự tháp diệt vong)', kicker: 'B02 · Vấn đề của callback',
      layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'hell.js', lang: 'javascript', size: 'xs', src: `getUser(id, (err, user) => {
  if (err) return handle(err);
  getPosts(user.id, (err, posts) => {
    if (err) return handle(err);
    getComments(posts[0].id, (err, comments) => {
      if (err) return handle(err);
      getLikes(comments[0].id, (err, likes) => {
        if (err) return handle(err);
        console.log('Tác giả:', user.name);
        console.log('Bài viết:', posts.length);
        console.log('Bình luận:', comments.length);
        console.log('Lượt thích:', likes);
      });
    });
  });
});` },
      bullets: [
        '**Mã nguồn thụt lề vô tận (Pyramid of Doom)**: Càng nhiều tác vụ tuần tự, code càng thụt sang phải làm mất khả năng đọc hiểu.',
        '**Xử lý lỗi lặp lại mệt mỏi**: Ở mỗi tầng callback, lập trình viên đều phải sao chép `if (err) return handle(err)`.',
        '**Bất khả thi khi chạy song song**: Rất khó phối hợp kết quả khi cần tải 5 file cùng lúc xong xuôi mới làm tiếp bước sau.',
        '**Mất tính năng xử lý lỗi toàn cục**: Không thể dùng `try...catch` bao bọc bên ngoài callback bất đồng bộ!'
      ],
      callout: { type: 'warn', t: 'Chính vì những hạn chế trầm trọng này, ECMAScript 2015 (ES6) đã chính thức đưa **Promise** vào chuẩn ngôn ngữ.' }
    },

    /* ---------- SECTION 02: PROMISE TOÀN DIỆN ---------- */
    { kind: 'section', no: '02', title: 'Cuộc cách mạng Promise', sub: 'Chuyển đổi kim tự tháp lồng nhau thành chuỗi xử lý tuyến tính thanh lịch.' },
    {
      title: 'Bản chất & Vòng đời của Promise', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Khái niệm**: Promise là một đối tượng đại diện cho kết quả cuối cùng (thành công hoặc thất bại) của một tác vụ bất đồng bộ trong tương lai.',
        '**3 Trạng thái duy nhất của Promise**:',
        '• **PENDING (Đang chờ)**: Trạng thái khởi tạo ban đầu, tác vụ đang diễn ra trên background, kết quả chưa xác định (`undefined`).',
        '• **FULFILLED (Đã thành công)**: Tác vụ hoàn thành mỹ mãn qua hàm `resolve(value)`. Kích hoạt callback trong `.then()`.',
        '• **REJECTED (Bị từ chối / Lỗi)**: Tác vụ thất bại qua hàm `reject(error)`. Kích hoạt callback trong `.catch()`.',
        '**Tính chất Bất biến (Immutability)**: Khi Promise đã Settled (Fulfilled hoặc Rejected), trạng thái và dữ liệu của nó bị "đóng băng" vĩnh viễn, không thể chuyển đổi trạng thái lần 2.'
      ],
      img: { src: 'promise-lifecycle.png', cap: 'Vòng đời Promise: Pending ➔ Fulfilled / Rejected (MDN Web Docs chính thức)', h: 520 }
    },
    {
      title: 'Tự viết hàm bọc Promise từ Callback', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'promisify.js', lang: 'javascript', size: 'sm', src: `const fs = require('fs');

// Bọc hàm fs.readFile dạng callback thành hàm trả Promise
function readFilePromise(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err); // Thất bại ➔ kích hoạt .catch
      }
      resolve(data);        // Thành công ➔ kích hoạt .then
    });
  });
}

// Sử dụng gọn gàng:
readFilePromise('package.json')
  .then(content => console.log('Độ dài file:', content.length))
  .catch(err => console.error('Lỗi đọc:', err.message));` },
      bullets: [
        '**Constructor `new Promise(executor)`**: Nhận vào một hàm thực thi gồm 2 tham số điều khiển `(resolve, reject)`.',
        '**Quy tắc chuyển đổi**:',
        { t: 'Bên trong callback, khi gặp lỗi: gọi `reject(err)` kèm đối tượng `Error`.', sub: ['Khi thành công: gọi `resolve(data)` truyền kết quả ra ngoài.'] },
        '**Node.js built-in**: Node cung cấp sẵn `util.promisify(fn)` để tự động làm điều này với mọi hàm error-first callback mà không cần viết tay!'
      ]
    },
    {
      title: 'then / catch / finally — Chuỗi phẳng (Promise Chaining)', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'chain.js', lang: 'javascript', size: 'sm', src: `getUser(1)
  .then(user => {
    console.log('👤 User:', user.name);
    return getPosts(user.id); // Trả về Promise tiếp theo
  })
  .then(posts => {
    console.log('📝 Số bài:', posts.length);
    return getComments(posts[0].id);
  })
  .then(comments => {
    console.log('💬 Số bình luận:', comments.length);
  })
  .catch(err => {
    // 🛡️ Bắt MỌI lỗi xảy ra ở bất kỳ mắt xích nào phía trên!
    console.error('❌ Lỗi tập trung:', err.message);
  })
  .finally(() => {
    console.log('🏁 Hoàn tất phiên xử lý (dọn dẹp kết nối)');
  });` },
      bullets: [
        '**Khử phẳng kim tự tháp (Flattening)**: Thay vì lồng nhau, mỗi bước chỉ là một mắt xích `.then()` thẳng đứng.',
        '**Cơ chế luân chuyển giá trị**: Giá trị `return` bên trong `.then()` sẽ được tự động bọc thành Promise và truyền xuống tham số của `.then()` kế tiếp.',
        '**Bắt lỗi tập trung (Error Bubbling)**: Nếu bất kỳ bước nào bị `reject` hoặc `throw`, luồng thực thi lập tức nhảy thẳng xuống `.catch()` gần nhất, bỏ qua toàn bộ các `.then()` trung gian.'
      ]
    },
    {
      title: 'Chạy nhiều Promise cùng lúc: all vs allSettled',
      table: {
        head: ['Hàm', 'Hành vi hoàn thành', 'Xử lý khi có lỗi', 'Trường hợp ứng dụng thực tế'],
        rows: [
          ['`Promise.all([...])`', 'Tất cả Promise đều Fulfilled thành công', 'Fail-fast: 1 cái lỗi ➔ Hủy bỏ toàn bộ, ném lỗi ngay', 'Tải đủ dữ liệu bắt buộc: User Info + Quyền hạn + Token'],
          ['`Promise.allSettled([...])`', 'Chờ tất cả xong (bất kể thành công hay lỗi)', 'Không bao giờ reject! Trả mảng trạng thái `{ status, value / reason }`', 'Gửi email hàng loạt: Cái nào gửi hỏng thì ghi log, không dừng batch'],
          ['`Promise.race([...])`', 'Lấy kết quả của cái **đầu tiên** xong (nhanh nhất)', 'Nếu cái nhanh nhất bị lỗi ➔ Bị reject theo cái đó', 'Cơ chế Timeout mạng: Request API đua với setTimeout 5000ms'],
          ['`Promise.any([...])`', 'Lấy kết quả của cái **thành công đầu tiên**', 'Chỉ reject khi TẤT CẢ các promise đều lỗi (`AggregateError`)', 'Gọi nhiều máy chủ dự phòng (DNS mirrors), nguồn nào xong trước lấy nguồn đó']
        ]
      },
      code: { lang: 'javascript', size: 'sm', src: `const [users, posts, tags] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchTags()
]); // Cả 3 tác vụ mạng được gửi song song đồng thời!` },
      callout: { type: 'tip', t: 'Dùng `Promise.all` giúp rút ngắn thời gian phản hồi từ tổng thời gian (T1 + T2 + T3) xuống còn thời gian của tác vụ lâu nhất: max(T1, T2, T3)!' }
    },
    {
      title: 'Lỗi kinh điển: Quên return trong .then() & Broken Chain', kicker: 'B02 · Bẫy lập trình hay gặp',
      layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'broken-chain.js', lang: 'javascript', size: 'sm', src: `// ❌ LỖI NGHIÊM TRỌNG: Quên return Promise!
getUser(1)
  .then(user => {
    // Gọi hàm nhưng KHÔNG return ➔ Mắt xích bị đứt!
    getPosts(user.id);
  })
  .then(posts => {
    // posts sẽ là undefined! Vì .then trước không return gì!
    console.log(posts.length); // TypeError: Cannot read property 'length' of undefined
  });

// ✅ ĐÚNG CHUẨN:
getUser(1)
  .then(user => {
    return getPosts(user.id); // LUÔN RETURN PROMISE
  })
  .then(posts => {
    console.log(posts.length); // Hoạt động chính xác!
  });` },
      bullets: [
        '**Broken Promise Chain**: Nếu không `return`, mắt xích tiếp theo sẽ nhận giá trị `undefined` và chạy ngay lập tức mà không chờ đợi tác vụ hoàn tất.',
        '**Mất kiểm soát lỗi**: Lỗi sinh ra trong hàm không được return sẽ biến thành "lỗi mồ côi" không thể bắt được bởi khối `.catch()` cuối cùng.',
        '**Quy tắc ngón tay cái**: Trong thân hàm `{ ... }` của `.then()`, hãy luôn có lệnh `return`!'
      ]
    },

    /* ---------- SECTION 03: ASYNC / AWAIT HIỆN ĐẠI ---------- */
    { kind: 'section', no: '03', title: 'async / await hiện đại', sub: 'Cú pháp đồng bộ tuyệt mỹ cho các tác vụ bất đồng bộ của chuẩn ES2017.' },
    {
      title: 'async / await — Cú pháp đồng bộ cho tác vụ bất đồng bộ', badge: 'LIVE CODING',
      layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'async-await.js', lang: 'javascript', size: 'sm', src: `async function getArticleDetails(articleId) {
  // await tạm dừng hàm này cho đến khi Promise giải quyết xong
  const article = await db.findArticle(articleId);
  const author = await db.findUser(article.authorId);
  const comments = await db.findComments(article.id);

  return {
    title: article.title,
    authorName: author.name,
    commentsCount: comments.length
  };
}

// Gọi hàm async:
getArticleDetails(10)
  .then(result => console.log('Kết quả:', result))
  .catch(err => console.error('Lỗi:', err));` },
      bullets: [
        '**Bản chất Syntactic Sugar**: `async/await` được xây dựng trực tiếp trên nền tảng của Promise, không thay đổi mô hình thực thi của JS.',
        '**Từ khóa `async`**: Đặt trước một hàm, đảm bảo hàm đó **LUÔN LUÔN trả về một Promise** (nếu return giá trị thường, JS tự bọc thành `Promise.resolve(val)`).',
        '**Từ khóa `await`**: Chỉ được sử dụng bên trong hàm `async`. Tạm dừng việc thực thi hàm hiện tại cho đến khi Promise hoàn tất.',
        '**Non-blocking**: `await` chỉ tạm dừng hàm cục bộ, **HOÀN TOÀN KHÔNG CHẶN luồng chính** hay Event Loop của Node.js!'
      ]
    },
    {
      title: 'Xử lý lỗi toàn diện với try / catch / finally', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'error-handling.js', lang: 'javascript', size: 'sm', src: `const fs = require('fs/promises');

async function loadAppConfig(configPath) {
  let fileHandle;
  try {
    fileHandle = await fs.open(configPath, 'r');
    const content = await fileHandle.readFile('utf8');
    const parsed = JSON.parse(content);
    return parsed;
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn('⚠️ File không tồn tại, nạp cấu hình mặc định');
      return { port: 3000, env: 'development' };
    }
    // Lỗi nghiêm trọng khác (hỏng JSON, thiếu quyền) ➔ ném tiếp
    throw new Error(\`Không thể đọc cấu hình: \${err.message}\`);
  } finally {
    if (fileHandle) {
      await fileHandle.close(); // Luôn đóng file descriptor giải phóng tài nguyên
      console.log('🔒 Đã đóng an toàn file handle');
    }
  }
}` },
      bullets: [
        '**Bắt cả 2 loại lỗi**: Khối `catch (err)` đồng thời tóm được cả lỗi do Promise `reject` lẫn lỗi cú pháp `throw` đồng bộ (như `JSON.parse` hỏng).',
        '**Khối `finally`**: Bắt buộc chạy dù có lỗi hay thành công. Đây là nơi lý tưởng để đóng kết nối CSDL, giải phóng file descriptors, tắt cờ loading.',
        '**Nguyên tắc Fail-Safe**: Chỉ bắt các lỗi bạn có thể khắc phục (Fallback). Nếu không thể xử lý, hãy re-throw để tầng cao hơn (như Express Error Middleware) ghi log và báo cáo.'
      ]
    },
    {
      title: 'Lỗi chết người: Quên await & UnhandledPromiseRejection', kicker: 'B02 · Cảnh báo sập máy chủ',
      layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'unhandled.js', lang: 'javascript', size: 'sm', src: `// ❌ LỖI TAI HẠI: Quên await khi gọi hàm trả Promise!
async function saveUser(userData) {
  try {
    // Quên await! Hàm db.insertUser() chạy nền tách biệt
    db.insertUser(userData); 
    console.log('✅ Báo client tạo thành công!');
    return { success: true };
  } catch (err) {
    // KHỐI CATCH NÀY SẼ KHÔNG BAO GIỜ BẮT ĐƯỢC LỖI CỦA DB!
    console.error('Không bắt được lỗi:', err);
  }
}

// Khi db.insertUser bị lỗi (trùng email, rớt mạng DB):
// ➔ Sinh ra lỗi: [UnhandledPromiseRejection]
// ➔ Node.js v16+ mặc định TERMINATE (DỪNG NGAY TIẾN TRÌNH)!` },
      bullets: [
        '**UnhandledPromiseRejection**: Lỗi xảy ra khi một Promise bị reject nhưng không có bất kỳ bộ lắng nghe `.catch()` hoặc `await + try/catch` nào tiếp nhận.',
        '**Hậu quả trên Production**: Toàn bộ tiến trình máy chủ Node.js bị dừng ngay lập tức (Crash process, Exit Code 1), làm rớt kết nối của hàng ngàn người dùng khác.',
        '**Quy tắc sống còn**: Mọi Promise phải được `await` trong `try/catch` hoặc gắn `.catch()`!'
      ],
      callout: { type: 'danger', t: 'Từ Node.js 16 trở đi, Unhandled Promise Rejections không chỉ in cảnh báo nữa mà sẽ chính thức LÀM SẬP SERVER (Crash Process)!' }
    },
    {
      title: 'Tuần tự hay Song song trong async / await?', kicker: 'B02 · Tối ưu hiệu năng 300%',
      cols: [
        {
          h: '🐢 Tuần tự (Chậm gấp 3 lần)', cls: 'bad',
          code: { lang: 'javascript', size: 'sm', src: `console.time('seq');
// Phải chờ bài 1 xong mới gọi bài 2
const post1 = await fetchPost(1); // 1000ms
const post2 = await fetchPost(2); // 1000ms
const post3 = await fetchPost(3); // 1000ms

console.timeEnd('seq'); 
// ➔ TỔNG CỘNG: ~3000ms (3 giây lãng phí)` }
        },
        {
          h: '🚀 Song song (Tối ưu tối đa)', cls: 'good',
          code: { lang: 'javascript', size: 'sm', src: `console.time('par');
// Kích hoạt đồng thời cả 3 request mạng
const [post1, post2, post3] = await Promise.all([
  fetchPost(1),
  fetchPost(2),
  fetchPost(3)
]);

console.timeEnd('par'); 
// ➔ TỔNG CỘNG: ~1000ms (Chỉ tốn đúng 1 giây!)` }
        }
      ],
      callout: { type: 'tip', t: 'Nguyên tắc vàng: Chỉ chờ tuần tự khi Tác vụ B CẦN dữ liệu đầu ra của Tác vụ A (Dependency). Nếu chúng độc lập, LUÔN dùng `Promise.all`!' }
    },
    {
      title: 'Đố vui: Thứ tự chạy Event Loop & async/await', badge: 'QUIZ',
      code: { lang: 'javascript', size: 'sm', src: `async function foo() {
  console.log('B');
  await null; // Nhường quyền thực thi cho Call Stack!
  console.log('C');
}

console.log('A');
foo();
console.log('D');` },
      quiz: {
        q: 'Thứ tự các chữ cái được in ra màn hình console là gì?',
        opts: ['A ➔ B ➔ C ➔ D', 'A ➔ B ➔ D ➔ C', 'B ➔ A ➔ D ➔ C', 'A ➔ D ➔ B ➔ C'],
        a: 1,
        why: 'Hàm foo chạy đồng bộ từ đầu cho tới khi gặp await: in A rồi in B. Gặp await, phần còn lại của foo được đẩy vào Microtask Queue và trả quyền cho Call Stack in D. Khi Call Stack sạch, Microtask chạy in C.'
      }
    },

    /* ---------- SECTION 04: MODULE & FILE SYSTEM ---------- */
    { kind: 'section', no: '04', title: 'Hệ thống Module & File System Bất đồng bộ', sub: 'CommonJS vs ES Modules, và thư viện fs/promises hiện đại.' },
    {
      title: 'CommonJS (CJS) vs ES Modules (ESM)',
      table: {
        head: ['Tiêu chí so sánh', 'CommonJS (CJS)', 'ES Modules (ESM)'],
        rows: [
          ['Cú pháp Xuất (Export)', '`module.exports = { ... }` hoặc `exports.a = ...`', '`export const a = ...` hoặc `export default ...`'],
          ['Cú pháp Nhập (Import)', '`const pkg = require(\'./pkg\');`', '`import pkg from \'./pkg.js\';`'],
          ['Thời điểm nạp (Loading)', 'Đồng bộ tại thời điểm chạy (Runtime dynamic)', 'Bất đồng bộ tại thời điểm phân tích tĩnh (Parse static)'],
          ['Hỗ trợ Top-level await', '❌ Không hỗ trợ (phải bọc trong hàm async)', '✅ Hỗ trợ trực tiếp ở cấp cao nhất của file'],
          ['Biến ngữ cảnh có sẵn', '`__dirname`, `__filename`, `require`, `module`', '❌ Không có (phải dùng `import.meta.url`)'],
          ['Khai báo kích hoạt', 'Mặc định trong hệ sinh thái Node.js', 'Đặt `"type": "module"` trong `package.json` hoặc đuôi `.mjs`']
        ]
      },
      callout: { type: 'tip', t: 'Trong khóa học này, chúng ta sử dụng **CommonJS** vì tính ổn định cao nhất, độ tương thích 100% với toàn bộ hệ sinh thái Express và Sequelize.' }
    },
    {
      title: 'Cách dùng ES Modules trong dự án Node.js hiện đại', layout: 'split', ratio: '1fr 1fr',
      cols: [
        {
          h: '1. package.json',
          code: { lang: 'json', size: 'sm', src: `{
  "name": "modern-esm-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  }
}` }
        },
        {
          h: '2. index.js (ESM với Top-level await)',
          code: { lang: 'javascript', size: 'sm', src: `import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Tự tái tạo __dirname trong môi trường ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Top-level await không cần hàm bọc:
const data = await fs.readFile(
  path.join(__dirname, 'data.json'), 
  'utf8'
);
console.log('Dữ liệu:', JSON.parse(data));` }
        }
      ],
      callout: { type: 'warn', t: 'Lưu ý khi dùng ESM: Khi import các file nội bộ trong dự án, BẮT BUỘC phải ghi rõ đuôi file `.js` (vd: `import { helper } from \'./helper.js\';`).' }
    },
    {
      title: 'fs/promises — Tạm biệt Callback, đón chào Promise', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'fs-promises.js', lang: 'javascript', size: 'sm', src: `const fs = require('fs/promises');
const path = require('path');

async function processDirectory() {
  const dirPath = path.join(__dirname, 'reports');
  
  // Đọc danh sách file trong thư mục
  const files = await fs.readdir(dirPath);
  console.log('📂 Tìm thấy:', files.length, 'tập tin');

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = await fs.stat(fullPath);
    console.log(\`- \${file}: \${(stat.size / 1024).toFixed(1)} KB\`);
  }

  // Ghi kết quả tổng hợp ra file mới
  await fs.writeFile(
    path.join(__dirname, 'summary.json'), 
    JSON.stringify({ filesCount: files.length, timestamp: Date.now() }, null, 2)
  );
  console.log('✅ Đã ghi file summary.json');
}

processDirectory().catch(console.error);` },
      bullets: [
        '**Chuẩn mực mới**: Thay vì `require(\'fs\')` rồi dùng callback, luôn ưu tiên `require(\'fs/promises\')` (có sẵn từ Node.js 14+).',
        '**Toàn bộ hàm trả về Promise**: `fs.readFile()`, `fs.writeFile()`, `fs.mkdir()`, `fs.readdir()`, `fs.unlink()` đều dùng mượt mà với `await`.',
        '**Hiệu năng vượt trội**: Hoàn toàn bất đồng bộ, ủy thác đọc ghi xuống I/O thread pool của libuv, giải phóng Call Stack phục vụ mạng.'
      ]
    },
    {
      title: 'Kỹ thuật Ghi file JSON Nguyên tử (Atomic Write)', kicker: 'B02 · Bí kíp chống hỏng dữ liệu',
      layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'atomic-json.js', lang: 'javascript', size: 'sm', src: `const fs = require('fs/promises');
const path = require('path');

async function saveJsonSafely(filePath, data) {
  const tempPath = \`\${filePath}.\${Date.now()}.tmp\`;
  const content = JSON.stringify(data, null, 2);

  try {
    // 1. Ghi ra file tạm thời trước
    await fs.writeFile(tempPath, content, 'utf8');

    // 2. Đổi tên đè lên file chính (Hệ điều hành thực hiện Atomic Rename)
    await fs.rename(tempPath, filePath);
    console.log('💾 Lưu dữ liệu an toàn 100%!');
  } catch (err) {
    // Dọn dẹp file tạm nếu gặp sự cố
    await fs.unlink(tempPath).catch(() => {});
    throw err;
  }
}` },
      bullets: [
        '**Nguy cơ khi dùng `writeFile` trực tiếp**: Nếu server bị mất điện hoặc crash giữa chừng lúc đang ghi dở, file JSON sẽ bị rỗng hoặc cụt lửng (Corrupted JSON).',
        '**Nguyên lý Atomic Rename**: Hệ điều hành POSIX và NTFS đảm bảo lệnh `rename` diễn ra tức thời (Atomic). File cũ chỉ bị thay thế khi file mới đã ghi đĩa trọn vẹn.',
        '**Ứng dụng thực tế**: Đây là cách các cơ sở dữ liệu dựa trên file (như Lowdb, SQLite journal) bảo vệ toàn vẹn dữ liệu.'
      ]
    },

    /* ---------- SECTION 05: STREAMS, BUFFERS & EVENTS ---------- */
    { kind: 'section', no: '05', title: 'Streams, Buffers & EventEmitter', sub: 'Làm chủ dòng chảy dữ liệu nhị phân và kiến trúc hướng sự kiện.' },
    {
      title: 'Bản chất Buffer & Dữ liệu nhị phân trong Node.js', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'buffer-demo.js', lang: 'javascript', size: 'sm', src: `// Tạo Buffer trực tiếp từ chuỗi ký tự UTF-8
const buf = Buffer.from('Xin chào Node.js', 'utf8');

console.log(buf); 
// <Buffer 58 69 6e 20 63 68 c3 a0 6f 20 4e 6f 64 65 2e 6a 73>
console.log('Số bytes chiếm dụng:', buf.length); // 17 bytes (ký tự "à" chiếm 2 bytes)
console.log('Chuyển sang Hex:', buf.toString('hex'));
console.log('Chuyển sang Base64:', buf.toString('base64'));

// Cấp phát Buffer bộ nhớ thô kích thước 1024 bytes (1 KB)
const emptyBuf = Buffer.alloc(1024);
emptyBuf.write('CT9 Backend');
console.log(emptyBuf.toString('utf8', 0, 11)); // "CT9 Backend"` },
      bullets: [
        '**Buffer là gì?**: Là vùng nhớ cố định được cấp phát bên ngoài JavaScript V8 Heap (trực tiếp trên RAM hệ thống thông qua C++).',
        '**Vì sao cần Buffer?**: JavaScript gốc ban đầu chỉ xử lý chuỗi Unicode, không thể thao tác trực tiếp với byte nhị phân của file ảnh, video, nén zip hoặc network packet.',
        '**Các chuẩn mã hóa phổ biến**: `utf8`, `ascii`, `hex`, `base64` (chuẩn dùng cho Token JWT và truyền tải ảnh đính kèm).'
      ]
    },
    {
      title: 'Kiến trúc Streams & Backpressure trong Node.js', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Vấn đề khi đọc file dung lượng lớn**: Đọc một video 2GB bằng `fs.readFile()` sẽ load toàn bộ 2GB vào RAM ➔ Server lập tức sập vì lỗi Out of Memory (OOM).',
        '**Cơ chế Streams**: Dữ liệu được chia nhỏ thành các mảnh nhỏ (**Chunks 64KB**) và truyền tuần tự qua đường ống nối tiếp.',
        '**3 Loại Stream cốt lõi**:',
        '• **Readable Stream**: Nguồn phát dữ liệu (file trên đĩa, HTTP request từ client).',
        '• **Transform Stream**: Vừa nhận vừa biến đổi (nén gzip, mã hóa crypto, hash SHA256).',
        '• **Writable Stream**: Đích nhận dữ liệu (ghi file xuống đĩa, HTTP response gửi về client).',
        '**Hiện tượng Backpressure (Nghẽn ngược)**: Khi tốc độ đọc nhanh hơn tốc độ ghi, Stream tự động tạm dừng bên đọc để tránh làm tràn bộ đệm RAM!'
      ],
      img: { src: 'pipeline.svg', cap: 'Kiến trúc Unix & Stream Pipeline dòng chảy dữ liệu (Wikipedia)', h: 520 }
    },
    {
      title: 'Phương thức pipeline() — Chuẩn an toàn tuyệt đối', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'stream-safe.js', lang: 'javascript', size: 'sm', src: `const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream/promises');

async function compressHugeFile(inputPath, outputPath) {
  console.time('compress');
  
  // Nén file 500MB mà chỉ tiêu tốn đúng ~30MB RAM!
  await pipeline(
    fs.createReadStream(inputPath),       // 1. Đọc từng chunk 64KB
    zlib.createGzip(),                   // 2. Nén gzip trên luồng
    fs.createWriteStream(outputPath)     // 3. Ghi file nén xuống đĩa
  );

  console.timeEnd('compress');
  console.log('✅ Nén hoàn tất an toàn tuyệt đối!');
}

compressHugeFile('large-log.txt', 'large-log.txt.gz').catch(console.error);` },
      bullets: [
        '**Vì sao KHÔNG nên dùng `.pipe()` cũ?**: Lệnh `readable.pipe(writable)` cổ điển không tự động dọn dẹp bộ nhớ và không tự đóng các file streams khi có lỗi mạng.',
        '**Lợi thế vượt trội của `stream/promises.pipeline`**:',
        { t: 'Tương thích hoàn hảo với `async/await`.', sub: ['Tự động đóng tất cả các streams (Close file descriptors) khi hoàn tất hoặc khi gặp lỗi bất ngờ.', 'Ngăn chặn triệt để nguy cơ Memory Leak và File Descriptor Leak trên máy chủ.'] }
      ],
      callout: { type: 'tip', t: 'Trong các dự án Back-end thực tế, luôn luôn dùng pipeline() để truyền tải file tải về hoặc xử lý upload!' }
    },
    {
      title: 'Observer Pattern với EventEmitter', layout: 'split', ratio: '1.05fr .95fr',
      bullets: [
        '**Bản chất của Node.js**: Hầu như mọi thành phần cốt lõi trong Node (`http.Server`, `fs.ReadStream`, `net.Socket`, `process`) đều kế thừa từ lớp `EventEmitter`.',
        '**Mô hình Observer (Publish / Subscribe)**:',
        '• **Publisher (Người phát)**: Gọi `emitter.emit(event, data)` khi có sự việc xảy ra.',
        '• **Registry (Sổ đăng ký)**: Lưu giữ danh sách callback tương ứng với từng tên sự kiện.',
        '• **Subscribers (Người nghe)**: Đăng ký hàm đón đầu bằng `emitter.on(event, handler)`.',
        '**Lợi ích kiến trúc vô giá**: Khử ghép nối (Decoupling) triệt để giữa logic nghiệp vụ chính (tạo đơn hàng) và các tác vụ hậu xử lý phụ (gửi email, trừ kho, bắn noti).'
      ],
      img: { src: 'observer-pattern.svg', cap: 'Mô hình thiết kế Observer Pattern trong EventEmitter (Wikipedia)', h: 520 }
    },
    {
      title: 'Xây dựng Event Bus cho hệ thống thông báo', layout: 'split', ratio: '1.15fr .85fr',
      code: { file: 'event-bus.js', lang: 'javascript', size: 'sm', src: `const EventEmitter = require('events');

class NotificationBus extends EventEmitter {}
const bus = new NotificationBus();

// Module 1: Gửi email chào mừng
bus.on('user:registered', async (user) => {
  console.log(\`📧 [Email] Đang gửi thư kích hoạt tới \${user.email}...\`);
});

// Module 2: Thống kê Marketing
bus.on('user:registered', (user) => {
  console.log(\`📊 [Analytics] Người dùng mới ghi nhận: #\${user.id}\`);
});

// Module 3: Tặng quà người dùng mới (chỉ chạy 1 lần duy nhất)
bus.once('user:registered', (user) => {
  console.log(\`🎁 [Promo] Tặng mã giảm giá 50K cho \${user.name}\`);
});

// Khi Controller hoàn tất đăng ký:
bus.emit('user:registered', { id: 101, name: 'Lan', email: 'lan@ct9.vn' });` },
      bullets: [
        '**`emitter.on(event, fn)`**: Lắng nghe sự kiện không giới hạn số lần.',
        '**`emitter.once(event, fn)`**: Lắng nghe và tự động hủy đăng ký ngay sau lần phát đầu tiên.',
        '**`emitter.removeListener(event, fn)`**: Hủy đăng ký thủ công tránh rò rỉ bộ nhớ khi hủy object.'
      ]
    },

    /* ---------- SECTION 06: HTTP SERVER THUẦN ---------- */
    { kind: 'section', no: '06', title: 'Tạo Web Server với module http', sub: 'Tự dựng server từ đầu để thấu hiểu tường tận những gì Express làm hộ chúng ta.' },
    {
      title: 'Server đầu tiên trong 8 dòng mã', badge: 'LIVE CODING',
      code: { file: 'server.js', lang: 'javascript', src: `const http = require('http');

// Khởi tạo máy chủ HTTP
const server = http.createServer((req, res) => {
  // Thiết lập mã trạng thái và HTTP Header
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  // Gửi nội dung body và kết thúc phản hồi
  res.end('Xin chào từ máy chủ Node.js nguyên bản!');
});

// Lắng nghe tại cổng 3000
server.listen(3000, () => {
  console.log('🚀 Server đang lắng nghe tại http://localhost:3000');
});` },
      term: `$ node server.js
🚀 Server đang lắng nghe tại http://localhost:3000`,
      callout: { type: 'tip', t: 'Mở trình duyệt gõ http://localhost:3000 hoặc mở DevTools tab Network để kiểm tra mã 200 OK và Header trả về!' },
      notes: 'Mở trình duyệt demo trực tiếp cho cả lớp, nhấn F12 cho học viên xem request/response headers thật.'
    },
    {
      title: 'Giải phẫu req & res trong module http thuần', kicker: 'B02 · Hai đối tượng sống còn',
      cols: [
        {
          h: '📥 req (http.IncomingMessage)',
          bullets: [
            '`req.method`: Chuỗi HTTP verb (`GET`, `POST`, `PUT`, `DELETE`).',
            '`req.url`: Đường dẫn URL kèm query string (`/api/posts?page=2`).',
            '`req.headers`: Toàn bộ HTTP header gửi từ client (chữ thường).',
            '`req` là một **Readable Stream**: Dữ liệu body được truyền đến từng mảnh qua sự kiện `data` và `end`!'
          ]
        },
        {
          h: '📤 res (http.ServerResponse)',
          bullets: [
            '`res.writeHead(statusCode, headers)`: Gửi HTTP Status và Headers xuống socket.',
            '`res.setHeader(name, value)`: Thiết lập từng header riêng lẻ.',
            '`res.write(chunk)`: Ghi từng phần dữ liệu vào luồng phản hồi.',
            '`res.end(data)`: **BẮT BUỘC PHẢI GỌI** để đóng socket kết thúc phản hồi! Nếu quên, trình duyệt sẽ xoay tít vô tận!'
          ]
        }
      ],
      callout: { type: 'danger', t: 'Lỗi kinh điển của người mới học: Quên gọi res.end() khiến kết nối mạng bị treo cứng và cạn kiệt tài nguyên server.' }
    },
    {
      title: 'Routing thủ công bằng module http thuần', layout: 'split', ratio: '1.25fr .75fr',
      code: { file: 'manual-routes.js', lang: 'javascript', size: 'xs', src: `const http = require('http');
const { URL } = require('url');

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
};

http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, \`http://\${req.headers.host}\`);
  const { pathname, searchParams } = parsedUrl;

  // Route 1: GET Trang chủ
  if (req.method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<h1>Chào mừng đến với CT9 Blog</h1>');
  }

  // Route 2: GET Lời chào có query string (?name=Lan)
  if (req.method === 'GET' && pathname === '/api/hello') {
    const name = searchParams.get('name') || 'Bạn';
    return sendJson(res, 200, { message: \`Xin chào \${name}!\` });
  }

  // Route fallback: 404 Not Found
  sendJson(res, 404, { error: 'Tài nguyên không tồn tại' });
}).listen(3000);` },
      bullets: [
        '**Tự phân nhánh thủ công**: Phải viết hàng chục lệnh `if (method === ... && pathname === ...)` nối đuôi nhau.',
        '**Dùng module `URL` của Node**: Hỗ trợ bóc tách đường dẫn `pathname` và tham số `searchParams` an toàn.',
        '**Luôn có Route cuối cùng**: Đảm bảo mọi đường dẫn lạ đều nhận về mã lỗi HTTP 404 chuẩn format JSON.'
      ]
    },
    {
      title: 'Đọc Body của POST Request qua Data Stream', layout: 'split', ratio: '1.2fr .8fr',
      code: { file: 'body-parser-manual.js', lang: 'javascript', size: 'sm', src: `// Tự viết hàm bóc tách JSON body từ Readable Stream
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let rawData = '';

    // Lắng nghe từng chunk dữ liệu truyền qua mạng
    req.on('data', (chunk) => {
      rawData += chunk;
      // Chống tấn công làm tràn bộ nhớ (Payload Too Large):
      if (rawData.length > 1e6) { // Giới hạn 1MB
        req.destroy();
        reject(new Error('Dung lượng body vượt quá giới hạn 1MB'));
      }
    });

    // Khi client gửi xong toàn bộ dữ liệu:
    req.on('end', () => {
      try {
        const parsed = rawData ? JSON.parse(rawData) : {};
        resolve(parsed);
      } catch (err) {
        reject(new Error('Định dạng JSON gửi lên không hợp lệ'));
      }
    });

    req.on('error', reject);
  });
}` },
      bullets: [
        '**Bản chất truyền tải HTTP**: Dữ liệu gửi từ Client qua POST/PUT không xuất hiện ngay lập tức mà đi qua socket mạng theo từng gói tin (Packet/Chunk).',
        '**Cực nhọc khi viết tay**: Phải tự lắng nghe `req.on(\'data\')`, tự cộng chuỗi, tự bắt lỗi `JSON.parse` hỏng, tự canh gác kích thước chống tấn công từ chối dịch vụ (DoS).',
        '**Sự cứu rỗi của Express**: Express giải quyết toàn bộ sự vất vả này chỉ bằng 1 dòng khai báo duy nhất: `app.use(express.json());`!'
      ]
    },
    {
      title: 'Kiểm thử Server bằng lệnh cURL trên Terminal', badge: 'TERMINAL LAB',
      term: `$ # 1. Kiểm tra Route GET có query parameter:
$ curl http://localhost:3000/api/hello?name=Lan
{"message":"Xin chào Lan!"}

$ # 2. Kiểm tra Header và Status Code bằng cờ -i:
$ curl -i http://localhost:3000/duong-dan-khong-ton-tai
HTTP/1.1 404 Not Found
Content-Type: application/json; charset=utf-8
Content-Length: 46

{"error":"Tài nguyên không tồn tại"}

$ # 3. Gửi POST Request kèm JSON body bằng cờ -X và -d:
$ curl -X POST http://localhost:3000/api/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Bài viết đầu tiên","content":"Học Node.js cùng CT9"}'
{"id":1,"status":"created"}`,
      callout: { type: 'tip', t: 'cURL là công cụ kiểm thử API qua dòng lệnh cực nhanh. Buổi 3 chúng ta sẽ nâng cấp lên giao diện trực quan chuyên nghiệp của Postman!' }
    },
    {
      title: 'Nỗi đau của http thuần & Cánh cửa mở ra Express', kicker: 'B02 · Vì sao cần Express?',
      layout: 'split', ratio: '1.15fr .85fr',
      bullets: [
        '**1. Routing thủ công cực nhọc**: Chuỗi `if (req.method === "GET" && url.pathname === ...)` dài hàng trăm dòng, rất dễ gõ nhầm.',
        '**2. Đọc Request Body phức tạp**: Phải tự lắng nghe stream `req.on("data")`, ghép chuỗi nhị phân và `JSON.parse` trong try/catch.',
        '**3. Không có cơ chế Middleware**: Xử lý CORS, ghi log, kiểm tra token xác thực phải lặp lại ở từng route.',
        '**4. Thiếu các tiện ích chuẩn**: Tự đặt mã lỗi HTTP, tự set header `Content-Type: application/json; charset=utf-8` ở mọi nơi.',
        '**5. Giải pháp toàn diện Express.js**: Cung cấp bộ định tuyến tinh gọn `app.get()`, `app.post()`, tự động parse JSON `req.body` và kho middleware khổng lồ!'
      ],
      img: { src: 'express-logo.png', cap: 'Buổi sau: Express.js — Framework Web chuẩn mực hàng đầu cho Node.js', h: 280 },
      callout: { type: 'tip', t: 'Hiểu được nỗi đau của module http thuần giúp bạn thấu hiểu sâu sắc bản chất những gì Express làm thay cho lập trình viên!' }
    }
  ],
  recap: [
    'Callback ➔ **Promise** ➔ **async/await**; luôn xử lý lỗi triệt để (`try/catch`, `.catch`)',
    'Hiểu sâu kiến trúc **Call Stack**, **Event Loop** và thứ tự ưu tiên của **Microtask Queue**',
    '`Promise.all` để chạy song song; đừng `await` tuần tự các việc độc lập gây lãng phí CPU',
    'CommonJS (`require`) vs ESM (`import`); `fs/promises` thay thế hoàn toàn các hàm đồng bộ',
    'Bản chất **Streams & Buffers**: Xử lý dữ liệu lớn theo chunks 64KB tránh tràn RAM',
    '`http.createServer((req, res) => ...)` + `res.end()`; routing & parse body thủ công rất dài dòng ➔ **Chuyển dịch sang Express**'
  ],
  exercises: [
    {
      level: 'warmup', time: 15, title: 'Đoán thứ tự chạy Event Loop',
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
