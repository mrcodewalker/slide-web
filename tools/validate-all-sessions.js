const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'assets', 'img');
const existingImgs = new Set(fs.readdirSync(imgDir));

global.window = {};
global.SESSION_DATA = {};

let hasErrors = false;

const sessionKeys = ['fe1', 'fe2', 'fe3', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

for (const key of sessionKeys) {
  const pad = typeof key === 'number' ? String(key).padStart(2, '0') : key;
  const filePath = path.join(__dirname, '..', 'js', 'sessions', `s${pad}.js`);
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    eval(code);
    const data = SESSION_DATA[key];
    if (!data) {
      console.error(`Session ${key}: SESSION_DATA[${key}] is undefined!`);
      hasErrors = true;
      continue;
    }
    console.log(`Session ${key} OK: ${data.slides.length} slides, ${data.exercises ? data.exercises.length : 0} exercises`);

    // Check images
    const regex = /src:\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = regex.exec(code)) !== null) {
      const src = m[1];
      if (!existingImgs.has(src) && !src.startsWith('http')) {
        console.warn(`  Missing image in Session ${key}: ${src}`);
      }
    }
  } catch (err) {
    console.error(`Error in Session ${key}:`, err.message);
    hasErrors = true;
  }
}

if (!hasErrors) {
  console.log('ALL 15 SESSIONS (3 FE + 12 BE) VALIDATED SUCCESSFULLY!');
}
