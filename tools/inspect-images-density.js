const fs = require('fs');
const path = require('path');
const sessDir = path.join(__dirname, '..', 'js', 'sessions');

for (let i = 1; i <= 12; i++) {
  const pad = String(i).padStart(2, '0');
  const txt = fs.readFileSync(path.join(sessDir, 's' + pad + '.js'), 'utf8');
  const window = {};
  const SESSION_DATA = {};
  eval(txt);
  const data = SESSION_DATA[i];
  if (!data) continue;
  console.log(`\n=== BUỔI ${i}: ${data.slides ? data.slides.length : 0} slides ===`);
  data.slides.forEach((s, idx) => {
    if (s.img) {
      const bCnt = (s.bullets || []).length;
      const cCnt = (s.cards || []).length;
      const stCnt = (s.steps || []).length;
      const colCnt = Array.isArray(s.cols) ? s.cols.length : 0;
      const imgSrc = Array.isArray(s.img) ? s.img.map(x => x.src).join(', ') : s.img.src;
      console.log(`  Slide ${idx + 1}: "${s.title}" (layout: ${s.layout || 'split'})`);
      console.log(`    Img: ${imgSrc}`);
      console.log(`    Content: bullets=${bCnt}, lead=${!!s.lead}, callout=${!!s.callout}, steps=${stCnt}, cards=${cCnt}, cols=${colCnt}`);
    }
  });
}
