const { spawn } = require('child_process');
const http = require('http');

async function testPage(url) {
  console.log(`\n=== Testing: ${url} ===`);
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const proc = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9222',
    '--no-first-run',
    '--no-default-browser-check',
    url
  ]);

  await new Promise(r => setTimeout(r, 2000));

  return new Promise((resolve) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', async () => {
        try {
          const list = JSON.parse(data);
          const page = list.find(p => p.type === 'page');
          console.log('Target Page:', page ? page.title : 'None');
        } catch (e) {
          console.log('Error parsing CDP target:', e.message);
        }
        proc.kill();
        resolve();
      });
    }).on('error', (err) => {
      console.log('CDP error:', err.message);
      proc.kill();
      resolve();
    });
  });
}

async function run() {
  await testPage('http://localhost:3000/present.html?s=11');
  await testPage('http://localhost:3000/present.html?s=12');
}
run();
