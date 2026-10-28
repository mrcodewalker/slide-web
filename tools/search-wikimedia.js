const https = require('https');
const fs = require('fs');
const path = require('path');

const userAgent = 'SlideWebEduBot/1.0 (https://slideweb.edu.vn; contact@slideweb.edu.vn) Node/20';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': userAgent } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function searchWikimedia(query) {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json`;
  const buf = await fetchUrl(apiUrl);
  const data = JSON.parse(buf.toString('utf8'));
  return (data.query && data.query.search) || [];
}

async function getImageUrl(title) {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|mime|size&format=json`;
  const buf = await fetchUrl(apiUrl);
  const data = JSON.parse(buf.toString('utf8'));
  const pages = data.query && data.query.pages;
  if (!pages) return null;
  const p = Object.values(pages)[0];
  if (p && p.imageinfo && p.imageinfo[0]) {
    return p.imageinfo[0];
  }
  return null;
}

(async () => {
  console.log('Testing Wikimedia search for DNS resolution...');
  const results = await searchWikimedia('DNS resolution filetype:svg');
  console.log('Found:', results.slice(0, 5).map(r => r.title));
  if (results.length > 0) {
    const info = await getImageUrl(results[0].title);
    console.log('URL for top result:', info && info.url);
  }
})();
