const fs = require('fs');
const path = require('path');

const dir = 'd:/slide-web/js/sessions';
const imgDir = 'd:/slide-web/assets/img';
const existingImgs = new Set(fs.readdirSync(imgDir));
const missing = {};
const allReferenced = new Set();

for (let i = 1; i <= 8; i++) {
  const f = path.join(dir, 's0' + i + '.js');
  const txt = fs.readFileSync(f, 'utf8');
  const regex = /src:\s*['"]([^'"]+)['"]/g;
  let m;
  const miss = [];
  while ((m = regex.exec(txt)) !== null) {
    const src = m[1];
    allReferenced.add(src);
    if (!existingImgs.has(src) && !src.startsWith('http')) {
      miss.push(src);
    }
  }
  if (miss.length) missing['s0' + i] = miss;
}

console.log('Missing images in s01-s08:', JSON.stringify(missing, null, 2));
console.log('Total referenced in s01-s08:', allReferenced.size);
