const http = require('http');
const fs = require('fs');
const path = require('path');

const sessionsDir = path.join(__dirname, '..', 'js', 'sessions');

// Gather all image filenames referenced in sessions
const referencedImages = new Set();
for (let i = 1; i <= 12; i++) {
  const padN = String(i).padStart(2, '0');
  const file = path.join(sessionsDir, `s${padN}.js`);
  const content = fs.readFileSync(file, 'utf8');
  const sandbox = { window: { SESSION_DATA: {} }, SESSION_DATA: {} };
  const fn = new Function('window', 'SESSION_DATA', content);
  fn(sandbox.window, sandbox.window.SESSION_DATA);
  const sessionObj = sandbox.window.SESSION_DATA[i];

  sessionObj.slides.forEach(s => {
    if (s.img) {
      if (Array.isArray(s.img)) s.img.forEach(im => im.src && referencedImages.add(im.src));
      else if (s.img.src) referencedImages.add(s.img.src);
    }
    if (s.imgs) s.imgs.forEach(im => im.src && referencedImages.add(im.src));
    if (s.logos) s.logos.forEach(src => src && referencedImages.add(src));
    if (Array.isArray(s.cols)) {
      s.cols.forEach(col => {
        if (col.img) {
          if (Array.isArray(col.img)) col.img.forEach(im => im.src && referencedImages.add(im.src));
          else if (col.img.src) referencedImages.add(col.img.src);
        }
      });
    }
  });
}

console.log(`Found ${referencedImages.size} unique referenced images.`);

function fetchImage(src) {
  return new Promise((resolve) => {
    const url = `http://localhost:3000/assets/img/${encodeURIComponent(src)}`;
    http.get(url, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        resolve({
          src,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          length: body.length,
          header: body.slice(0, 8).toString('hex'),
          headerText: body.slice(0, 100).toString('utf8')
        });
      });
    }).on('error', (err) => {
      resolve({ src, error: err.message });
    });
  });
}

async function testAll() {
  const results = [];
  for (const src of referencedImages) {
    const res = await fetchImage(src);
    results.push(res);
  }

  const errors = results.filter(r => r.error || r.status !== 200 || r.length === 0);
  console.log('\n--- ERRORS & FAILED HTTP LOADS ---');
  if (errors.length === 0) {
    console.log('None! All HTTP requests returned 200.');
  } else {
    console.error(errors);
  }

  console.log('\n--- ALL REFERENCED IMAGES HTTP TEST ---');
  results.forEach(r => {
    let warning = '';
    if (r.src.endsWith('.jpg') && r.header.startsWith('89504e47')) {
      warning = ' [WARNING: PNG magic in JPG file!]';
    }
    if (r.src.endsWith('.svg') && !r.headerText.includes('<svg')) {
      warning = ' [WARNING: SVG without <svg tag in header!]';
    }
    console.log(`${r.src}: ${r.status} (${r.contentType}, ${r.length} bytes)${warning}`);
  });
}

testAll();
