const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'assets', 'img');
const existingImages = new Set(fs.readdirSync(imgDir));
console.log('Total files in assets/img:', existingImages.size);

// Check file sizes
const smallFiles = [];
for (const file of existingImages) {
  const stat = fs.statSync(path.join(imgDir, file));
  if (stat.size < 200) {
    const preview = fs.readFileSync(path.join(imgDir, file), 'utf8').slice(0, 80);
    smallFiles.push({ file, size: stat.size, preview });
  }
}
console.log('Small/suspicious files:', smallFiles);

global.window = {};
global.SESSION_DATA = {};

const sessionsDir = path.join(__dirname, '..', 'js', 'sessions');
let totalSlides = 0;
let slidesWithImg = [];
let missingImages = [];

for (let i = 1; i <= 12; i++) {
  const pad = String(i).padStart(2, '0');
  const filePath = path.join(sessionsDir, `s${pad}.js`);
  const code = fs.readFileSync(filePath, 'utf8');
  eval(code);
  const data = SESSION_DATA[i];
  if (!data) continue;

  data.slides.forEach((slide, sIdx) => {
    totalSlides++;
    const checkImg = (imgObj) => {
      if (!imgObj) return;
      const arr = Array.isArray(imgObj) ? imgObj : [imgObj];
      arr.forEach(im => {
        if (!im || !im.src) return;
        const exists = existingImages.has(im.src);
        const stat = exists ? fs.statSync(path.join(imgDir, im.src)) : null;
        const isCorrupt = stat && stat.size < 100;
        if (!exists) {
          missingImages.push({ session: i, slide: sIdx + 1, src: im.src, title: slide.title, reason: 'FILE_NOT_FOUND' });
        } else if (isCorrupt) {
          missingImages.push({ session: i, slide: sIdx + 1, src: im.src, title: slide.title, reason: 'CORRUPTED_OR_404' });
        }
        slidesWithImg.push({
          session: i,
          slide: sIdx + 1,
          title: slide.title,
          src: im.src,
          cap: im.cap,
          size: stat ? stat.size : 0,
          bullets: (slide.bullets || []).length,
          lead: !!slide.lead,
          exists,
          isCorrupt
        });
      });
    };

    if (slide.img) checkImg(slide.img);
    if (Array.isArray(slide.cols)) {
      slide.cols.forEach(col => {
        if (col.img) checkImg(col.img);
      });
    }
  });
}

console.log(`Audited ${totalSlides} slides across 12 sessions.`);
console.log(`Found ${slidesWithImg.length} image references.`);
console.log('Missing or corrupt images:', missingImages);
console.log('\n--- ALL SLIDES WITH IMAGES ---');
slidesWithImg.forEach(s => {
  console.log(`S${String(s.session).padStart(2, '0')} Slide #${s.slide}: "${s.title}" -> ${s.src} (${s.size} bytes) | bullets: ${s.bullets}${s.isCorrupt ? ' [CORRUPT!]' : ''}${!s.exists ? ' [MISSING!]' : ''}`);
});
