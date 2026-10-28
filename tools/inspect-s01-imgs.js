const fs = require('fs');
const content = fs.readFileSync('js/sessions/s01.js', 'utf8');

const matches = [];
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('src:') && (l.includes('.svg') || l.includes('.png') || l.includes('.jpg'))) {
    matches.push({ line: idx + 1, content: l.trim() });
  }
});
console.log('BE 1 image references:');
console.log(matches);
