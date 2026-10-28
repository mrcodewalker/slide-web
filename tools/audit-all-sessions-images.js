const fs = require('fs');
const path = require('path');

const sessionFiles = [
  { id: 'fe1', file: 'js/sessions/sfe1.js' },
  { id: 'fe2', file: 'js/sessions/sfe2.js' },
  { id: 'fe3', file: 'js/sessions/sfe3.js' },
  ...Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const pad = String(num).padStart(2, '0');
    return { id: String(num), file: `js/sessions/s${pad}.js` };
  })
];

const imageUsage = {};

sessionFiles.forEach(({ id, file }) => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('src:') && (l.includes('.svg') || l.includes('.png') || l.includes('.jpg'))) {
      const match = l.match(/src:\s*['"]([^'"]+)['"]/);
      if (match) {
        const src = match[1];
        if (!imageUsage[src]) imageUsage[src] = [];
        imageUsage[src].push({ session: id, line: idx + 1, text: l.trim() });
      }
    }
  });
});

console.log('Unique images used:', Object.keys(imageUsage).length);
Object.entries(imageUsage).sort((a, b) => b[1].length - a[1].length).forEach(([src, uses]) => {
  console.log(`- ${src} (${uses.length} uses) in sessions: ${uses.map(u => u.session).join(', ')}`);
});
