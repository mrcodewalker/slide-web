const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'NodeSlideDownloader/1.0 (education@example.com)' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchBuffer(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
  });
}

async function testMdn() {
  const urls = [
    // MDN Promise
    'https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/javascript/reference/global_objects/promise/promises.png',
    // Node.js Event Loop official docs
    'https://raw.githubusercontent.com/nodejs/nodejs.org/main/public/static/images/event-loop.svg',
    // Node.js Streams
    'https://raw.githubusercontent.com/nodejs/nodejs.org/main/public/static/images/docs/guides/backpressuring-in-streams/backpressure-overview.png'
  ];

  for (const u of urls) {
    try {
      console.log('Testing: ' + u);
      const buf = await fetchBuffer(u);
      console.log('  -> SUCCESS: ' + buf.length + ' bytes');
    } catch (e) {
      console.log('  -> FAILED: ' + e.message);
    }
  }
}

testMdn();
