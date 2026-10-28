const fs = require('fs');
const path = require('path');
const imgDir = path.join(__dirname, '..', 'assets', 'img');
const files = fs.readdirSync(imgDir);

console.log('--- TESTING ALL SVGS IN ASSETS/IMG ---');
let svgErrors = 0;

for (const f of files) {
  if (f.endsWith('.svg')) {
    const p = path.join(imgDir, f);
    const content = fs.readFileSync(p, 'utf8');
    
    // Check if it has basic svg tags
    if (!content.includes('<svg') || !content.includes('</svg>')) {
      console.log(`[SVG ERROR] ${f}: Missing <svg> or </svg> tags`);
      svgErrors++;
      continue;
    }

    // Check for unclosed tags or XML errors by matching opening/closing tags or using vm/regex
    // Check for common XML errors: unescaped & (except &amp;, &lt;, &gt;, &quot;, &apos;, &#...)
    const badAmp = content.match(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g);
    if (badAmp) {
      console.log(`[SVG UNESCAPED AMPERSAND] ${f}: ${badAmp.length} unescaped & found!`);
      svgErrors++;
    }

    // Check if xmlns is present
    if (!content.includes('xmlns=')) {
      console.log(`[SVG WARNING] ${f}: Missing xmlns attribute`);
    }

    // Check viewBox
    if (!content.includes('viewBox=')) {
      console.log(`[SVG WARNING] ${f}: Missing viewBox attribute`);
    }
  }
}

console.log(`SVG test completed with ${svgErrors} errors.`);
