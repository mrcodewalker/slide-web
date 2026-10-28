const fs = require('fs');
const path = require('path');

const sessionsDir = path.join(__dirname, '..', 'js', 'sessions');

for (let i = 1; i <= 12; i++) {
  const padN = String(i).padStart(2, '0');
  const file = path.join(sessionsDir, `s${padN}.js`);
  const content = fs.readFileSync(file, 'utf8');
  const sandbox = { window: { SESSION_DATA: {} }, SESSION_DATA: {} };
  const fn = new Function('window', 'SESSION_DATA', content);
  fn(sandbox.window, sandbox.window.SESSION_DATA);
  const sData = sandbox.window.SESSION_DATA[i];

  console.log(`\n========================================`);
  console.log(`SESSION ${i}: ${sData.title || ''} (${sData.slides.length} slides)`);
  console.log(`========================================`);

  sData.slides.forEach((s, idx) => {
    const n = idx + 1;
    const kind = s.kind || 'content';
    const layout = s.layout || 'auto';
    const title = s.title || s.h || '(no title)';
    let imgInfo = '';
    if (s.img) {
      if (Array.isArray(s.img)) {
        imgInfo = `[MULTI-IMG: ${s.img.map(x => `${x.src} (h:${x.h || 'def'})`).join(', ')}]`;
      } else {
        imgInfo = `[IMG: ${s.img.src} (h:${s.img.h || 'def'}, dark:${s.img.dark || false})]`;
      }
    }
    if (s.logos) {
      imgInfo += ` [LOGOS: ${s.logos.length} items]`;
    }
    if (Array.isArray(s.cols)) {
      const colImgs = s.cols.filter(c => c.img).map(c => c.img.src || 'img');
      if (colImgs.length) imgInfo += ` [COLS-IMG: ${colImgs.join(', ')}]`;
    }

    if (imgInfo) {
      console.log(`Slide ${n.toString().padStart(2, ' ')} [${kind}|layout:${layout}] ${title}`);
      console.log(`     ↳ ${imgInfo} | ratio:${s.ratio || '1.05fr .95fr'}`);
    }
  });
}
