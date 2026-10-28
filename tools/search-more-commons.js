const https = require('https');

function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json&srlimit=5`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'NodeJsCurriculumSlides/1.0 (https://slide-deck.edu; admin@slide-deck.edu)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function getImageUrl(title) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|size|mime&format=json`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'NodeJsCurriculumSlides/1.0 (https://slide-deck.edu; admin@slide-deck.edu)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          resolve(pages[pageId].imageinfo ? pages[pageId].imageinfo[0] : null);
        } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

const queries = [
  'object-relational mapping',
  'database pooling',
  'RESTful web API',
  'JSON Web Token',
  'file upload architecture'
];

async function run() {
  for (const q of queries) {
    console.log(`\n=== Query: ${q} ===`);
    const res = await searchCommons(q);
    if (res.query && res.query.search) {
      for (const item of res.query.search) {
        const info = await getImageUrl(item.title);
        if (info && (info.url.endsWith('.svg') || info.url.endsWith('.png') || info.url.endsWith('.jpg'))) {
          console.log(`  * ${item.title} (${Math.round(info.size / 1024)} KB) -> ${info.url}`);
        }
      }
    }
  }
}

run();
