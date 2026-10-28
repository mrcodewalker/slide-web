const { execSync } = require('child_process');
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const url = 'http://localhost:3000/present.html?s=12';
const out = execSync(`"${edge}" --headless --disable-gpu --virtual-time-budget=3000 --dump-dom "${url}"`, { encoding: 'utf8' });
const mCounter = out.match(/id="counter"[^>]*>([^<]+)</);
console.log('Session 12 counter:', mCounter ? mCounter[1].trim() : 'none');
if (out.includes('id="empty" class="empty on"')) console.log('EMPTY ON!');
const mSlides = out.match(/class="slide-wrap[^"]*"/g);
console.log('Slide wraps count in DOM:', mSlides ? mSlides.length : 0);
