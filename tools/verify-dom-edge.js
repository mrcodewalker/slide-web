const { execSync } = require('child_process');
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const sessions = ['fe1', 'fe2', 'fe3', '12'];
sessions.forEach(s => {
  const url = `http://localhost:3000/present.html?session=${s}`;
  try {
    const out = execSync(`"${edge}" --headless --disable-gpu --virtual-time-budget=3500 --dump-dom "${url}"`, { encoding: 'utf8', timeout: 20000 });
    const mCounter = out.match(/id="counter"[^>]*>([^<]+)</);
    const mTotal = mCounter ? mCounter[1].trim() : 'null';
    const mTitle = out.match(/class="title">([^<]+)</);
    const mImg = out.match(/src="assets\/img\/([^"]+)"/);
    console.log(`Session ${s}: Counter = ${mTotal} | First Img = ${mImg ? mImg[1] : 'none'}`);
  } catch (err) {
    console.error(`Session ${s} ERROR:`, err.message);
  }
});
