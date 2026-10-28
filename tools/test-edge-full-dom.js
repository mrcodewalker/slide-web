const { spawn } = require('child_process');

async function testEdgeFull(url) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const proc = spawn(edgePath, [
    '--headless',
    '--dump-dom',
    url
  ]);

  let stdout = '';
  proc.stdout.on('data', c => stdout += c);
  await new Promise(r => proc.on('close', r));

  const count = (stdout.match(/class="slide-wrap/g) || []).length;
  console.log(`${url.padEnd(45, ' ')} -> ${count} slides`);
}

async function run() {
  await testEdgeFull('http://localhost:3000/present.html?s=fe1');
  await testEdgeFull('http://localhost:3000/present.html?s=fe2');
  await testEdgeFull('http://localhost:3000/present.html?s=fe3');
  await testEdgeFull('http://localhost:3000/present.html?s=1');
  await testEdgeFull('http://localhost:3000/present.html?s=11');
  await testEdgeFull('http://localhost:3000/present.html?s=12');

  async function testEx(url) {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const proc = spawn(edgePath, ['--headless', '--dump-dom', url]);
    let stdout = '';
    proc.stdout.on('data', c => stdout += c);
    await new Promise(r => proc.on('close', r));
    const count = (stdout.match(/class="ex-card/g) || []).length;
    console.log(`${url.padEnd(45, ' ')} -> ${count} exercise cards`);
  }
  await testEx('http://localhost:3000/exercises.html?s=fe1');
  await testEx('http://localhost:3000/exercises.html?s=fe2');
  await testEx('http://localhost:3000/exercises.html?s=fe3');
  await testEx('http://localhost:3000/exercises.html?s=11');
  await testEx('http://localhost:3000/exercises.html?s=12');

  // Test home page
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const proc = spawn(edgePath, ['--headless', '--dump-dom', 'http://localhost:3000/index.html']);
  let homeOut = '';
  proc.stdout.on('data', c => homeOut += c);
  await new Promise(r => proc.on('close', r));
  const cardCount = (homeOut.match(/class="s-card/g) || []).length;
  console.log(`Homepage session cards: ${cardCount}`);
}

run();
