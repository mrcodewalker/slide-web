const https = require('https');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'assets', 'img');

const filesToFetch = [
  { file: 'three-tier.svg', title: 'File:Overview of a three-tier application vectorVersion.svg' },
  { file: 'join-inner.svg', title: 'File:SQL Join - 07 A Inner Join B.svg' },
  { file: 'join-left.svg', title: 'File:SQL Join - 01 A Left Join B.svg' },
  { file: 'jwt-logo.svg', title: 'File:JWT-Logo.svg' },
  { file: 'nginx-logo.svg', title: 'File:Nginx-logo.svg' },
  { file: 'swagger-logo.svg', title: 'File:Swagger SmartBear logo.svg' },
  { file: 'callback-async.svg', title: 'File:Callback-async-notitle.svg' },
  { file: 'rbac.svg', title: 'File:Role-based access control.svg' },
  { file: 'openapi-logo.svg', title: 'File:OpenAPI Logo Pantone.svg' }
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'CT9WebCourse/1.0 (educational; bot)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    function get(u) {
      https.get(u, { headers: { 'User-Agent': 'CT9WebCourse/1.0 (educational; bot)' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location);
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }).on('error', err => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    }
    get(url);
  });
}

async function run() {
  for (const item of filesToFetch) {
    const outPath = path.join(imgDir, item.file);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 100) {
      console.log(`Already exists: ${item.file}`);
      continue;
    }
    console.log(`Fetching info for ${item.title}...`);
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(item.title)}&prop=imageinfo&iiprop=url|extmetadata&format=json`;
    const res = await fetchJson(apiUrl);
    if (!res || !res.query || !res.query.pages) {
      console.log(`Not found: ${item.title}`);
      continue;
    }
    const pages = Object.values(res.query.pages);
    if (!pages[0] || !pages[0].imageinfo || !pages[0].imageinfo[0]) {
      console.log(`No imageinfo for ${item.title}`);
      continue;
    }
    const imgInfo = pages[0].imageinfo[0];
    const dlUrl = imgInfo.url;
    console.log(`Downloading ${item.file} from ${dlUrl}...`);
    try {
      await downloadFile(dlUrl, outPath);
      console.log(`Saved ${item.file} (${fs.statSync(outPath).size} bytes)`);
    } catch (e) {
      console.error(`Failed ${item.file}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 1500));
  }
}

run();
