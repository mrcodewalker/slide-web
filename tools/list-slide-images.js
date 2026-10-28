const fs = require('fs');
const path = require('path');

const sessionDir = path.join(__dirname, '..', 'js', 'sessions');
const imgDir = path.join(__dirname, '..', 'assets', 'img');

global.window = {};
global.SESSION_DATA = {};

for (let i = 1; i <= 12; i++) {
  const pad = String(i).padStart(2, '0');
  const filePath = path.join(sessionDir, `s${pad}.js`);
  const code = fs.readFileSync(filePath, 'utf8');
  eval(code);
  const data = SESSION_DATA[i];
  console.log(`\n=== BUỔI ${i}: ${data.slides.length} slides ===`);
  data.slides.forEach((s, idx) => {
    if (s.img) {
      const arr = Array.isArray(s.img) ? s.img : [s.img];
      arr.forEach(im => {
        const full = path.join(imgDir, im.src);
        const exists = fs.existsSync(full);
        const size = exists ? fs.statSync(full).size : 0;
        console.log(`  Slide ${idx + 1} [${s.title}]: src='${im.src}' (exists=${exists}, size=${size})`);
      });
    }
  });
}
