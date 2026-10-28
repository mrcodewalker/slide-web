const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'assets', 'img');
const files = fs.readdirSync(imgDir);

console.log(`Checking ${files.length} files in assets/img/...\n`);

files.forEach(f => {
  const fullPath = path.join(imgDir, f);
  const stats = fs.statSync(fullPath);
  if (stats.size === 0) {
    console.error(`[EMPTY FILE 0 BYTES] ${f}`);
    return;
  }
  if (f.endsWith('.svg')) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const hasXmlns = /xmlns\s*=\s*["']http:\/\/www\.w3\.org\/2000\/svg["']/i.test(content);
    const hasViewBox = /viewBox\s*=\s*["'][^"']+["']/i.test(content);
    const vbMatch = content.match(/viewBox\s*=\s*["']([^"']+)["']/i);
    const widthMatch = content.match(/<svg[^>]*\bwidth\s*=\s*["']([^"']+)["']/i);
    const heightMatch = content.match(/<svg[^>]*\bheight\s*=\s*["']([^"']+)["']/i);

    // Basic XML check (check unclosed root or error text)
    if (content.includes('404 Not Found') || content.includes('<!DOCTYPE html>')) {
      console.error(`[HTML 404 IN SVG] ${f}`);
    }
    if (!hasXmlns) {
      console.warn(`[MISSING XMLNS] ${f}`);
    }
    if (!hasViewBox) {
      console.warn(`[MISSING VIEWBOX] ${f} (w=${widthMatch ? widthMatch[1] : 'none'}, h=${heightMatch ? heightMatch[1] : 'none'})`);
    } else {
      // Check if viewBox has 0 0 w h
      const parts = vbMatch[1].trim().split(/[\s,]+/);
      if (parts.length === 4) {
        const [x, y, w, h] = parts.map(Number);
        if (w <= 0 || h <= 0 || isNaN(w) || isNaN(h)) {
          console.error(`[INVALID VIEWBOX DIMS] ${f}: ${vbMatch[1]}`);
        }
      }
    }
  } else if (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')) {
    const buf = Buffer.alloc(16);
    const fd = fs.openSync(fullPath, 'r');
    fs.readSync(fd, buf, 0, 16, 0);
    fs.closeSync(fd);
    const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47;
    const isJpg = buf[0] === 0xFF && buf[1] === 0xD8;
    if (f.endsWith('.png') && !isPng) {
      console.error(`[INVALID PNG HEADER] ${f}`);
    }
    if ((f.endsWith('.jpg') || f.endsWith('.jpeg')) && !isJpg) {
      console.error(`[INVALID JPG HEADER] ${f} (isPng=${isPng})`);
    }
  }
});
