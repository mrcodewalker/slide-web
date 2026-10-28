const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'assets', 'img');
const existingFiles = fs.readdirSync(imgDir);

console.log('Total files in assets/img:', existingFiles.length);

const broken = [];
for (const f of existingFiles) {
  const p = path.join(imgDir, f);
  const sz = fs.statSync(p).size;
  if (sz < 50) {
    broken.push({ file: f, reason: 'Too small (' + sz + 'b)' });
    continue;
  }
  const buf = fs.readFileSync(p);
  const str = buf.slice(0, 150).toString('utf8');
  if (str.includes('<!DOCTYPE html>') || str.includes('Wikimedia Error') || str.includes('Error 404')) {
    broken.push({ file: f, reason: 'HTML error page' });
  }
}
console.log('Corrupted files in assets/img:', JSON.stringify(broken, null, 2));

const sessionDir = path.join(__dirname, '..', 'js', 'sessions');
const missingBySession = {};
const allReferenced = new Set();

for (let i = 1; i <= 12; i++) {
  const pad = String(i).padStart(2, '0');
  const txt = fs.readFileSync(path.join(sessionDir, `s${pad}.js`), 'utf8');
  const regex = /src:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = regex.exec(txt)) !== null) {
    const src = m[1];
    allReferenced.add(src);
    if (!src.startsWith('http')) {
      const fullPath = path.join(imgDir, src);
      if (!fs.existsSync(fullPath)) {
        missingBySession[`s${pad}`] = missingBySession[`s${pad}`] || [];
        missingBySession[`s${pad}`].push(src);
      }
    }
  }
}

console.log('Total referenced images across 12 sessions:', allReferenced.size);
console.log('Missing referenced images:', JSON.stringify(missingBySession, null, 2));

// Also check logos referenced in slides
const logoRegex = /logos:\s*\[([^\]]+)\]/g;
for (let i = 1; i <= 12; i++) {
  const pad = String(i).padStart(2, '0');
  const txt = fs.readFileSync(path.join(sessionDir, `s${pad}.js`), 'utf8');
  let m;
  while ((m = logoRegex.exec(txt)) !== null) {
    const raw = m[1];
    const items = raw.split(',').map(s => s.trim().replace(/['"]/g, ''));
    for (const item of items) {
      if (item && !fs.existsSync(path.join(imgDir, item))) {
        console.warn(`Missing logo in s${pad}: ${item}`);
      }
    }
  }
}
