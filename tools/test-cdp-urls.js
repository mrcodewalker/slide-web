const { spawn } = require('child_process');
const http = require('http');

async function inspectUrl(url) {
  console.log(`\n================ INSPECTING: ${url} ================`);
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const proc = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9222',
    '--no-first-run',
    '--no-default-browser-check',
    url
  ]);

  await new Promise(r => setTimeout(r, 2500));

  await new Promise((resolve) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', async () => {
        try {
          const list = JSON.parse(data);
          const page = list.find(p => p.type === 'page');
          console.log('Page Title:', page ? page.title : 'None');
          console.log('Page URL:', page ? page.url : 'None');
        } catch (e) {
          console.log('Error:', e.message);
        }
        proc.kill();
        resolve();
      });
    }).on('error', err => {
      console.log('CDP Error:', err.message);
      proc.kill();
      resolve();
    });
  });
}

async function run() {
  await inspectUrl('http://localhost:3000/present.html?session=11');
  await inspectUrl('http://localhost:3000/present.html?session=12');
  await inspectUrl('http://localhost:3000/exercises.html?session=11');
  await inspectUrl('http://localhost:3000/exercises.html?session=12');
}
run();
