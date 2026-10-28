const fs = require('fs');
const path = require('path');
const sessDir = path.join(__dirname, '..', 'js', 'sessions');
const imgDir = path.join(__dirname, '..', 'assets', 'img');

const usedImgs = new Set();
for (let i = 1; i <= 12; i++) {
  const pad = String(i).padStart(2, '0');
  const txt = fs.readFileSync(path.join(sessDir, `s${pad}.js`), 'utf8');
  const reg = /src:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = reg.exec(txt)) !== null) {
    if (!m[1].startsWith('http')) usedImgs.add(m[1]);
  }
}

console.log('--- CHECKING CONTRAST / COLOR SCHEME OF ALL REFERENCED IMAGES ---');
usedImgs.forEach(f => {
  const p = path.join(imgDir, f);
  if (!fs.existsSync(p)) return;
  if (f.endsWith('.svg')) {
    const txt = fs.readFileSync(p, 'utf8');
    const hasWhiteFill = txt.includes('fill="#ffffff"') || txt.includes('fill="#fff"') || txt.includes('fill="white"');
    const hasBlackFill = txt.includes('fill="#000000"') || txt.includes('fill="#000"') || txt.includes('fill="black"');
    const hasBgRect = txt.includes('<rect width="100%"') || txt.includes('rx="') || txt.includes('fill="#0c1322"');
    console.log(`${f}: hasWhiteFill=${hasWhiteFill}, hasBlackFill=${hasBlackFill}, hasBgRect=${hasBgRect}`);
  } else {
    console.log(`${f}: bitmap (PNG/JPG)`);
  }
});
