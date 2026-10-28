const fs = require('fs');
const path = require('path');
const sessDir = path.join(__dirname, '..', 'js', 'sessions');
const imgDir = path.join(__dirname, '..', 'assets', 'img');
const realImgs = new Set(fs.readdirSync(imgDir));

console.log('--- SCANNING ALL IMAGE FILENAME STRINGS IN ALL SESSION FILES ---');
let foundMissing = 0;
for (let s = 1; s <= 12; s++) {
  const pad = String(s).padStart(2, '0');
  const txt = fs.readFileSync(path.join(sessDir, `s${pad}.js`), 'utf8');
  const matches = txt.match(/['"][a-zA-Z0-9_\-]+\.(png|jpg|jpeg|svg|webp)['"]/g) || [];
  matches.forEach(m => {
    const fn = m.replace(/['"]/g, '');
    if (!realImgs.has(fn)) {
      console.log(`[MISSING IMAGE in s${pad}]: "${fn}"`);
      foundMissing++;
    }
  });
}

// Also check index.html, exercises.html, present.html
['index.html', 'exercises.html', 'present.html', 'js/curriculum.js', 'js/present.js', 'js/exercises.js'].forEach(f => {
  const p = path.join(__dirname, '..', f);
  if (fs.existsSync(p)) {
    const txt = fs.readFileSync(p, 'utf8');
    const matches = txt.match(/['"][a-zA-Z0-9_\-]+\.(png|jpg|jpeg|svg|webp)['"]/g) || [];
    matches.forEach(m => {
      const fn = m.replace(/['"]/g, '');
      if (!realImgs.has(fn)) {
        console.log(`[MISSING IMAGE in ${f}]: "${fn}"`);
        foundMissing++;
      }
    });
  }
});

console.log(`Scan completed. Found ${foundMissing} missing image references.`);
