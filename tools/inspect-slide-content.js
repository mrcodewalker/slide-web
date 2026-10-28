const fs = require('fs');
const path = require('path');

global.window = {};
global.SESSION_DATA = {};

const sessionsDir = path.join(__dirname, '..', 'js', 'sessions');

for (let i = 1; i <= 12; i++) {
  const pad = String(i).padStart(2, '0');
  const filePath = path.join(sessionsDir, `s${pad}.js`);
  const code = fs.readFileSync(filePath, 'utf8');
  eval(code);
  const data = SESSION_DATA[i];
  if (!data) continue;

  console.log(`\n================== SESSION ${i}: ${data.title || ('Buổi ' + i)} ==================`);
  data.slides.forEach((s, idx) => {
    const hasImg = !!s.img;
    const bulletsLen = (s.bullets || []).length;
    const hasCode = !!s.code;
    const hasCards = !!s.cards;
    const hasCols = !!s.cols;
    const hasSteps = !!s.steps;
    const isSection = s.kind === 'section';

    if (isSection) return;

    if (hasImg || bulletsLen < 3 || (!hasCode && !hasCards && !hasCols && !hasSteps)) {
      console.log(`[Slide ${idx + 1}] "${s.title}" (layout: ${s.layout || 'auto'})`);
      if (hasImg) {
        const arr = Array.isArray(s.img) ? s.img : [s.img];
        console.log(`   🖼️ Image:`, arr.map(im => `${im.src} (cap: "${im.cap || ''}")`).join(', '));
      }
      if (s.lead) console.log(`   📌 Lead: "${s.lead.slice(0, 60)}..."`);
      if (bulletsLen > 0) {
        console.log(`   • Bullets (${bulletsLen}):`);
        s.bullets.forEach(b => console.log(`      - ${typeof b === 'string' ? b.slice(0, 70) : b.t.slice(0, 70)}`));
      } else {
        console.log(`   ⚠️ ZERO BULLETS!`);
      }
      if (hasCards) console.log(`   🃏 Cards: ${(s.cards || []).length}`);
      if (hasCols) console.log(`   Columns: ${(s.cols || []).length || s.cols}`);
      if (hasCode) console.log(`   💻 Code: present`);
    }
  });
}
