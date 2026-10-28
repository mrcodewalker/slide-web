const { execSync } = require('child_process');
const https = require('https');
const path = require('path');
const fs = require('fs');

const imgDir = path.join(__dirname, '..', 'assets', 'img');

const files = [
  { file: 'nginx-logo.svg', title: 'File:Nginx-logo.svg' },
  { file: 'openapi-logo.svg', title: 'File:OpenAPI Logo Pantone.svg' },
  { file: 'rbac.svg', title: 'File:Role-based access control.svg' },
  { file: 'oauth-flow.svg', title: 'File:Abstract-flow.svg' },
  { file: 'dns.jpg', title: 'File:Domain Name System RR.png' },
  { file: 'jwt-structure.png', title: 'File:Json web token.svg' },
  { file: 'swagger-ui.png', title: 'File:Swagger-Petstore.png' },
  { file: 'mysql-workbench.jpg', title: 'File:MySQL Workbench editor screenshot.jpg' }
];

function getUrl(title) {
  return new Promise(resolve => {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
    https.get(api, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          const p = Object.values(j.query.pages)[0];
          resolve(p.imageinfo[0].url.split('?')[0]);
        } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  for (const f of files) {
    const directUrl = await getUrl(f.title);
    if (!directUrl) { console.log('Could not resolve:', f.title); continue; }
    console.log(`URL for ${f.file}: ${directUrl}`);
    const dest = path.join(imgDir, f.file);
    try {
      execSync(`curl.exe -A "${UA}" -H "Referer: https://commons.wikimedia.org/" -s -L "${directUrl}" -o "${dest}"`);
      console.log(`Saved ${f.file}: ${fs.statSync(dest).size} bytes`);
    } catch(e) {
      console.error(e.message);
    }
  }
}
main();
