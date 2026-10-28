const fs = require('fs');
const path = require('path');
const sessDir = path.join(__dirname, '..', 'js', 'sessions');

for (let i = 1; i <= 12; i++) {
  const pad = String(i).padStart(2, '0');
  const txt = fs.readFileSync(path.join(sessDir, `s${pad}.js`), 'utf8');
  const window = {};
  const SESSION_DATA = {};
  eval(txt);
  const data = SESSION_DATA[i];
  if (!data) continue;
  data.slides.forEach((s, idx) => {
    if (['section', 'title', 'agenda', 'end', 'exercises'].includes(s.kind)) return;
    const bCnt = (s.bullets || []).length;
    const hasImg = !!s.img;
    const hasCode = !!s.code;
    const hasCards = !!s.cards;
    const hasCols = !!s.cols;
    const hasSteps = !!s.steps;
    
    // Check if it's an image slide with sparse content
    if (hasImg) {
      if (bCnt <= 4 && !hasCode && !hasCols) {
        console.log(`[Sparse Img Slide] B${pad} #${idx+1} "${s.title}": img=${Array.isArray(s.img)?s.img.map(x=>x.src).join(','):s.img.src}, bullets=${bCnt}, lead=${!!s.lead}, callout=${!!s.callout}`);
      }
    } else if (bCnt === 0 && !hasCode && !hasCards && !hasCols && !hasSteps && !s.quiz) {
      console.log(`[Empty Content Slide] B${pad} #${idx+1} "${s.title}" has virtually NO structured content!`);
    }
  });
}
