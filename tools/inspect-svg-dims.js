const fs = require('fs');
const path = require('path');

const list = [
  'client-server.svg',
  'cookie-exchange.svg',
  'docker-logo.svg',
  'er-mmorpg.svg',
  'hash-function.svg',
  'jwt-logo.svg',
  'mdn-http-message.svg',
  'mvc-process.svg',
  'relational-terms.svg',
  'three-tier.svg'
];

list.forEach(f => {
  const c = fs.readFileSync(path.join(__dirname, '..', 'assets', 'img', f), 'utf8');
  const svgStart = c.slice(0, 1000);
  const wMatch = svgStart.match(/width="([^"]+)"/);
  const hMatch = svgStart.match(/height="([^"]+)"/);
  console.log(`${f}: width=${wMatch ? wMatch[1] : 'none'}, height=${hMatch ? hMatch[1] : 'none'}`);
});
