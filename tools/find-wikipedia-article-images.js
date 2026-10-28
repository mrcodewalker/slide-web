const https = require('https');

async function getArticleImages(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=images&format=json`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'NodeSlideDownloader/1.0 (education@example.com)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pid = Object.keys(pages)[0];
          resolve(pages[pid].images || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function getImageUrl(title) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|size|mime&format=json`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'NodeSlideDownloader/1.0 (education@example.com)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          const info = pages[pageId].imageinfo ? pages[pageId].imageinfo[0] : null;
          resolve(info);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

const articles = [
  'Asynchronous I/O',
  'Call stack',
  'Futures and promises',
  'Observer pattern',
  'Pipeline (Unix)',
  'Multitier architecture',
  'Database transaction',
  'Connection pool',
  'Object-relational mapping',
  'JSON Web Token',
  'OAuth',
  'Role-based access control',
  'Reverse proxy',
  'Load balancing (computing)',
  'Representational state transfer',
  'Chain-of-responsibility pattern'
];

async function run() {
  for (const art of articles) {
    console.log(`\n=== Article: "${art}" ===`);
    try {
      const imgs = await getArticleImages(art);
      for (const im of imgs) {
        if (!im.title.endsWith('.svg') && !im.title.endsWith('.png') && !im.title.endsWith('.jpg')) continue;
        const info = await getImageUrl(im.title);
        if (info) {
          console.log(`  * ${im.title} (${Math.round(info.size / 1024)} KB) -> ${info.url}`);
        }
      }
    } catch (e) {
      console.log('  Error:', e.message);
    }
  }
}

run();
