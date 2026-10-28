const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'assets', 'img');
const existingImgs = new Set(fs.readdirSync(imgDir));

global.window = {};
global.SESSION_DATA = {};

let hasErrors = false;

for (let i = 1; i <= 12; i++) {
  const pad = String(i).padStart(2, '0');
  const filePath = path.join(__dirname, '..', 'js', 'sessions', `s${pad}.js`);
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    eval(code);
    const data = SESSION_DATA[i];
    if (!data) {
      console.error(`Session ${i}: SESSION_DATA[${i}] is undefined!`);
      hasErrors = true;
      continue;
    }
    console.log(`Session ${i} OK: ${data.slides.length} slides, ${data.exercises ? data.exercises.length : 0} exercises`);

    // Check images
    const regex = /src:\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = regex.exec(code)) !== null) {
      const src = m[1];
      if (!existingImgs.has(src) && !src.startsWith('http')) {
        console.warn(`  Missing image in Session ${i}: ${src}`);
      }
    }
  } catch (err) {
    console.error(`Error in Session ${i}:`, err.message);
    hasErrors = true;
  }
}

if (!hasErrors) {
  console.log('ALL 12 SESSIONS VALIDATED SUCCESSFULLY!');
}
