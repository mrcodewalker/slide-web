const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'assets', 'img');
const svgsToCheck = [
  'client-server.svg',
  'jwt-logo.svg',
  'npm-logo.svg',
  'mdn-cors-overview.svg',
  'three-tier.svg',
  'mvc-process.svg',
  'relational-terms.svg',
  'er-mmorpg.svg',
  'join-inner.svg',
  'join-left.svg',
  'hash-function.svg',
  'cia-triad.svg',
  'owasp-logo.svg'
];

svgsToCheck.forEach(f => {
  const fullPath = path.join(imgDir, f);
  const content = fs.readFileSync(fullPath, 'utf8');
  console.log(`=== ${f} === (length: ${content.length})`);
  console.log(content.slice(0, 250).replace(/\r?\n/g, ' '));
  console.log('');
});
