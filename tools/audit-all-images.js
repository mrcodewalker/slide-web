const fs = require('fs');

const files = fs.readdirSync('assets/img');

// Scan sessions
const usage = {};
for (let i = 1; i <= 12; i++) {
  const pad = String(i).padStart(2, '0');
  const code = fs.readFileSync(`js/sessions/s${pad}.js`, 'utf8');
  files.forEach(f => {
    if (code.includes(f)) {
      if (!usage[f]) usage[f] = [];
      usage[f].push(`S${pad}`);
    }
  });
}

console.log('=== AUDIT OF ALL IMAGES IN assets/img ===');
const customList = [];
const officialList = [];

files.forEach(f => {
  const stat = fs.statSync(`assets/img/${f}`);
  const used = (usage[f] || []).join(', ');
  if (f.endsWith('.svg')) {
    const text = fs.readFileSync(`assets/img/${f}`, 'utf8');
    const isCustom = text.includes('fill="#0f172a"') || text.includes('stroke="#334155"') || text.includes('MÔ HÌNH') || text.includes('linearGradient id=');
    if (isCustom) {
      customList.push({ file: f, size: stat.size, used });
    } else {
      officialList.push({ file: f, size: stat.size, used });
    }
  } else {
    officialList.push({ file: f, size: stat.size, used });
  }
});

console.log(`\nCUSTOM DRAWN SVGs (${customList.length}):`);
customList.forEach(c => console.log(`  - ${c.file.padEnd(30, ' ')} [${c.used || 'UNUSED'}] (${c.size} bytes)`));

console.log(`\nOFFICIAL / DOWNLOADED / REAL (${officialList.length}):`);
officialList.forEach(o => console.log(`  + ${o.file.padEnd(30, ' ')} [${o.used || 'UNUSED'}] (${o.size} bytes)`));
