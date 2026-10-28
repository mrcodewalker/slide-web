const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'assets', 'img');
const realFiles = fs.readdirSync(imgDir);
const realFilesSet = new Set(realFiles);

global.window = {};
global.SESSION_DATA = {};

console.log('=== AUDITING SESSIONS 1 TO 12 DETAILED SLIDE IMAGES ===');

const allIssues = [];

for (let s = 1; s <= 12; s++) {
  const pad = String(s).padStart(2, '0');
  const filePath = path.join(__dirname, '..', 'js', 'sessions', `s${pad}.js`);
  const code = fs.readFileSync(filePath, 'utf8');
  eval(code);
  const data = SESSION_DATA[s];
  if (!data) {
    allIssues.push(`B${pad}: SESSION_DATA not found!`);
    continue;
  }

  console.log(`\n--- BUỔI ${s}: ${data.slides.length} slides ---`);

  data.slides.forEach((sl, idx) => {
    const slideNo = idx + 1;
    // Extract images
    const imgs = [];
    if (sl.img) {
      if (Array.isArray(sl.img)) imgs.push(...sl.img);
      else imgs.push(sl.img);
    }
    if (Array.isArray(sl.cols)) {
      sl.cols.forEach(c => {
        if (c.img) {
          if (Array.isArray(c.img)) imgs.push(...c.img);
          else imgs.push(c.img);
        }
      });
    }
    if (sl.logos) {
      sl.logos.forEach(l => imgs.push({ src: l, isLogo: true }));
    }

    if (imgs.length > 0) {
      imgs.forEach(im => {
        const src = im.src;
        if (!src) {
          allIssues.push(`B${pad} Slide #${slideNo} "${sl.title}": img has NO src!`);
          return;
        }
        if (src.startsWith('http')) {
          console.log(`  Slide #${slideNo} "${sl.title}" has external URL: ${src}`);
          return;
        }
        if (!realFilesSet.has(src)) {
          allIssues.push(`[MISSING/BROKEN] B${pad} Slide #${slideNo} "${sl.title}": file "${src}" does NOT exist in assets/img!`);
        } else {
          // File exists, check size
          const p = path.join(imgDir, src);
          const stat = fs.statSync(p);
          if (stat.size < 100) {
            allIssues.push(`[CORRUPT/EMPTY] B${pad} Slide #${slideNo} "${sl.title}": file "${src}" is too small (${stat.size} bytes)`);
          }
          // Check small height restriction
          if (im.h && im.h < 260 && !im.isLogo) {
            console.log(`  ⚠️ [SMALL HEIGHT] B${pad} Slide #${slideNo} "${sl.title}": src="${src}", h=${im.h}px (may look too small)`);
          } else {
            console.log(`  ✓ Slide #${slideNo} "${sl.title}": src="${src}" (size: ${stat.size}b, h: ${im.h || 'auto'})`);
          }
        }
      });
    }
  });
}

console.log('\n================ SUMMARY OF ISSUES ================');
if (allIssues.length === 0) {
  console.log('✅ No broken file paths found!');
} else {
  allIssues.forEach(iss => console.log('❌ ' + iss));
}
