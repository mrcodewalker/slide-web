const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const imgDir = path.join(__dirname, '..', 'assets', 'img');

const items = [
  { file: 'three-tier.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Overview_of_a_three-tier_application_vectorVersion.svg' },
  { file: 'join-inner.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/SQL_Join_-_07_A_Inner_Join_B.svg' },
  { file: 'join-left.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/SQL_Join_-_01_A_Left_Join_B.svg' },
  { file: 'join-right.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/SQL_Join_-_03_A_Right_Join_B.svg' },
  { file: 'callback-async.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Callback-async-notitle.svg' },
  { file: 'nginx-logo.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Nginx-logo.svg' },
  { file: 'openapi-logo.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/6/61/OpenAPI_Logo_Pantone.svg' },
  { file: 'rbac.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Role-based_access_control.svg' },
  { file: 'oauth-flow.svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Abstract-flow.svg' },
  { file: 'dns.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Domain_Name_System_RR.png/800px-Domain_Name_System_RR.png' },
  { file: 'jwt-structure.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Json_web_token.svg/800px-Json_web_token.svg.png' },
  { file: 'swagger-ui.png', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Swagger-Petstore.png/800px-Swagger-Petstore.png' }
];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

for (const it of items) {
  const dest = path.join(imgDir, it.file);
  console.log(`Downloading ${it.file}...`);
  try {
    const cmd = `curl.exe -A "${UA}" -s -L "${it.url}" -o "${dest}"`;
    execSync(cmd, { stdio: 'inherit' });
    const sz = fs.statSync(dest).size;
    console.log(`OK: ${it.file} (${sz} bytes)`);
  } catch (err) {
    console.error(`Error downloading ${it.file}:`, err.message);
  }
}
console.log('All downloads finished.');
