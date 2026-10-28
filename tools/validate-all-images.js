const fs = require('fs');
const path = require('path');

global.SESSION_DATA = {};
const files = fs.readdirSync('js/sessions').filter(f => f.endsWith('.js'));
for (const f of files) {
  eval(fs.readFileSync(path.join('js/sessions', f), 'utf8'));
}

console.log('Validating all sessions and images...');
let errors = 0;
let totalSlides = 0;
let missingImages = 0;

for (const [sId, sess] of Object.entries(global.SESSION_DATA)) {
  if (!sess || !sess.slides) {
    console.error('Session missing slides:', sId);
    errors++;
    continue;
  }
  totalSlides += sess.slides.length;
  sess.slides.forEach((sl, idx) => {
    if (sl.img) {
      const imgs = Array.isArray(sl.img) ? sl.img : [sl.img];
      imgs.forEach(item => {
        if (item.src) {
          const p = path.join('assets/img', item.src);
          if (!fs.existsSync(p)) {
            console.error(`Missing image file: ${item.src} in [${sId} S${idx + 1}]`);
            missingImages++;
          }
        }
      });
    }
  });
}

console.log(`Done. Total sessions: ${Object.keys(global.SESSION_DATA).length}, Total slides: ${totalSlides}`);
console.log(`Errors: ${errors}, Missing images: ${missingImages}`);
