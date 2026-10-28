const fs = require('fs');

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

const results = [];

sessionFiles.forEach(({ id, file }) => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const sessionData = eval(`(function() {
    const SESSION_DATA = {};
    const COURSE = { sessions: [] };
    ${content}
    return SESSION_DATA['${id}'] || SESSION_DATA[${id}];
  })()`);

  if (!sessionData || !sessionData.slides) return;

  sessionData.slides.forEach((s, idx) => {
    if (s.img) {
      const imgs = Array.isArray(s.img) ? s.img : [s.img];
      imgs.forEach(im => {
        results.push({
          session: id,
          slideIndex: idx + 1,
          title: s.title || s.kind,
          src: im.src,
          cap: im.cap,
          dark: im.dark
        });
      });
    }
  });
});

console.log(`Total slide images found: ${results.length}`);
results.forEach(r => {
  const isLogo = r.src.includes('logo') || r.src.includes('icon');
  console.log(`[${r.session.toUpperCase()} S${r.slideIndex}] ${r.src} | "${r.title}" ${isLogo ? '★ LOGO' : ''} ${r.dark ? '★ DARK' : ''}`);
});
