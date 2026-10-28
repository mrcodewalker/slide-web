const { spawn } = require('child_process');
const http = require('http');

async function checkPdfColors() {
  const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const args = [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--no-sandbox',
    'http://localhost:3000/exercises.html?s=11'
  ];
  const proc = spawn(edge, args);
  await new Promise(r => setTimeout(r, 2200));

  try {
    const json = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9226/json', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });

    const page = json.find(p => p.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    // Open PDF Modal and evaluate computed style of code tags
    const evalRes = await new Promise(res => {
      const expr = `(() => {
        document.querySelector('#btnPdfPreview')?.click();
        const codeEls = [...document.querySelectorAll('#pdfPaper code')];
        return codeEls.slice(0, 10).map(c => ({
          text: c.textContent,
          color: window.getComputedStyle(c).color,
          bg: window.getComputedStyle(c).backgroundColor,
          border: window.getComputedStyle(c).borderColor
        }));
      })()`;
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true }
      }));
      ws.onmessage = m => {
        const p = JSON.parse(m.data);
        if (p.id === 1) res(p.result.result.value);
      };
    });

    console.log('PDF Paper code tags computed styles:', JSON.stringify(evalRes, null, 2));
    ws.close();
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    proc.kill();
  }
}
checkPdfColors();
