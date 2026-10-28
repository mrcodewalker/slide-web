const fs = require('fs');
const path = require('path');
const imgDir = path.join(__dirname, '..', 'assets', 'img');

const files = fs.readdirSync(imgDir);

files.forEach(f => {
  if (!f.endsWith('.svg')) return;
  const p = path.join(imgDir, f);
  let content = fs.readFileSync(p, 'utf8');

  // Check if viewBox is missing
  if (!content.includes('viewBox=')) {
    console.log(`Fixing viewBox for: ${f}`);
    // Find width and height in <svg ...> tag
    const svgTagMatch = content.match(/<svg\b([^>]*)>/);
    if (svgTagMatch) {
      const attrs = svgTagMatch[1];
      const wMatch = attrs.match(/\bwidth="([^"]+)"/) || attrs.match(/\bwidth='([^']+)'/);
      const hMatch = attrs.match(/\bheight="([^"]+)"/) || attrs.match(/\bheight='([^']+)'/);
      
      if (wMatch && hMatch) {
        const w = parseFloat(wMatch[1]);
        const h = parseFloat(hMatch[1]);
        if (!isNaN(w) && !isNaN(h)) {
          const viewBoxStr = ` viewBox="0 0 ${w} ${h}"`;
          const newSvgTag = `<svg${attrs}${viewBoxStr}>`;
          content = content.replace(svgTagMatch[0], newSvgTag);
          fs.writeFileSync(p, content, 'utf8');
          console.log(`  -> Added viewBox="0 0 ${w} ${h}" to ${f}`);
        }
      }
    }
  }
});
console.log('Done fixing SVG viewBox.');
