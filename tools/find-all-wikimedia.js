const https = require('https');

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json&srlimit=8`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'NodeSlideDownloader/1.0 (education@example.com)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
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

const queries = [
  { key: 'async-io', q: 'asynchronous I/O diagram OR non-blocking I/O' },
  { key: 'sync-vs-async', q: 'synchronous asynchronous execution' },
  { key: 'call-stack', q: 'call stack diagram' },
  { key: 'streams-pipe', q: 'pipeline architecture OR unix pipeline' },
  { key: 'observer', q: 'observer pattern uml diagram' },
  { key: 'connection-pool', q: 'connection pool diagram OR object pool' },
  { key: 'orm', q: 'object-relational mapping diagram' },
  { key: 'chain-of-resp', q: 'chain of responsibility pattern diagram' },
  { key: 'oauth-token', q: 'oauth2 flow OR token authentication' },
  { key: 'reverse-proxy', q: 'reverse proxy load balancer diagram' },
  { key: 'rest-api', q: 'RESTful API architecture' },
  { key: 'middleware', q: 'middleware architecture diagram' },
  { key: 'client-server-http', q: 'HTTP client server request response' }
];

async function run() {
  for (const item of queries) {
    console.log(`\n=== QUERY: [${item.key}] "${item.q}" ===`);
    try {
      const res = await searchCommons(item.q);
      if (res.query && res.query.search) {
        for (const s of res.query.search.slice(0, 4)) {
          const info = await getImageUrl(s.title);
          if (info && (info.mime.includes('image') || info.url.endsWith('.svg') || info.url.endsWith('.png') || info.url.endsWith('.jpg'))) {
            console.log(`  * ${s.title} (${info.mime}, ${Math.round(info.size / 1024)} KB)`);
            console.log(`    URL: ${info.url}`);
          }
        }
      }
    } catch (err) {
      console.error(`  Error: ${err.message}`);
    }
  }
}

run();
