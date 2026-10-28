const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'assets', 'img');
const sessionsDir = path.join(__dirname, '..', 'js', 'sessions');

const missing = [];
const headerMismatches = [];
const svgNoViewBox = [];
const smallImages = [];
const allImagesBySession = {};

for (let i = 1; i <= 12; i++) {
  const padN = String(i).padStart(2, '0');
  const file = path.join(sessionsDir, `s${padN}.js`);
  allImagesBySession[i] = [];
  
  const content = fs.readFileSync(file, 'utf8');
  const sandbox = { window: { SESSION_DATA: {} }, SESSION_DATA: {} };
  const fn = new Function('window', 'SESSION_DATA', content);
  fn(sandbox.window, sandbox.window.SESSION_DATA);
  const sessionObj = sandbox.window.SESSION_DATA[i];

  sessionObj.slides.forEach((s, idx) => {
    const slideNum = idx + 1;
    const images = [];

    if (s.img) {
      if (Array.isArray(s.img)) s.img.forEach(im => images.push({ ...im, context: 'img[]' }));
      else images.push({ ...s.img, context: 'img' });
    }
    if (s.imgs) s.imgs.forEach(im => images.push({ ...im, context: 'imgs[]' }));
    if (s.logos) s.logos.forEach(src => images.push({ src, context: 'logos' }));
    if (Array.isArray(s.cols)) {
      s.cols.forEach((col, cIdx) => {
        if (col.img) {
          if (Array.isArray(col.img)) col.img.forEach(im => images.push({ ...im, context: `col[${cIdx}].img[]` }));
          else images.push({ ...col.img, context: `col[${cIdx}].img` });
        }
      });
    }

    images.forEach(im => {
      const src = im.src;
      if (!src) return;
      const fullPath = path.join(imgDir, src);
      const exists = fs.existsSync(fullPath);
      let size = 0;
      let isSvg = src.endsWith('.svg');
      let svgHasViewBox = false;
      let headerCheck = 'OK';

      if (exists) {
        const stats = fs.statSync(fullPath);
        size = stats.size;
        if (isSvg) {
          const svgContent = fs.readFileSync(fullPath, 'utf8');
          svgHasViewBox = /viewBox\s*=/i.test(svgContent);
          if (!svgHasViewBox) svgNoViewBox.push({ session: i, slide: slideNum, src });
        } else {
          const buf = Buffer.alloc(16);
          const fd = fs.openSync(fullPath, 'r');
          fs.readSync(fd, buf, 0, 16, 0);
          fs.closeSync(fd);
          const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47;
          const isJpg = buf[0] === 0xFF && buf[1] === 0xD8;
          if (src.endsWith('.jpg') || src.endsWith('.jpeg')) {
            if (isPng) {
              headerCheck = 'PNG_MAGIC_IN_JPG';
              headerMismatches.push({ session: i, slide: slideNum, src, issue: headerCheck });
            } else if (!isJpg) {
              headerCheck = 'NOT_JPG';
              headerMismatches.push({ session: i, slide: slideNum, src, issue: headerCheck });
            }
          } else if (src.endsWith('.png')) {
            if (!isPng) {
              headerCheck = 'NOT_PNG';
              headerMismatches.push({ session: i, slide: slideNum, src, issue: headerCheck });
            }
          }
        }
      } else {
        missing.push({ session: i, slide: slideNum, src });
      }

      const item = {
        session: i,
        slide: slideNum,
        slideTitle: s.title || s.h || '',
        src,
        height: im.h || null,
        exists,
        size,
        headerCheck,
        svgHasViewBox: isSvg ? svgHasViewBox : null
      };

      if (im.h && im.h < 250) {
        smallImages.push(item);
      }
      allImagesBySession[i].push(item);
    });
  });
}

console.log('--- MISSING FILES ---', missing);
console.log('--- HEADER MISMATCHES ---', headerMismatches);
console.log('--- SVG WITHOUT VIEWBOX ---', svgNoViewBox);
console.log('--- SMALL HEIGHT IMAGES (< 250px) ---', smallImages);
console.log('\n--- TOTAL IMAGES BY SESSION ---');
for (let i = 1; i <= 12; i++) {
  console.log(`Session ${i}: ${allImagesBySession[i].length} images`, allImagesBySession[i].map(x => `Slide ${x.slide}: ${x.src} (h:${x.height})`).join(' | '));
}
