const { spawn } = require('child_process');
const http = require('http');

async function getConsoleErrors(url) {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const proc = spawn(edgePath, [
    '--headless',
    '--remote-debugging-port=9223',
    '--no-first-run',
    '--no-default-browser-check',
    url
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const list = await new Promise((resolve) => {
    http.get('http://127.0.0.1:9223/json', (res) => {
      let data = ''; res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });

  const page = list.find(p => p.type === 'page');
  if (!page || !page.webSocketDebuggerUrl) {
    console.log('No websocket url found');
    proc.kill();
    return;
  }

  // Connect websocket using built-in or simple http upgrade
  // Or in Node 22+ WebSocket is global!
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  ws.onopen = () => {
    ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
    ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('EXCEPTION in', url, ':', JSON.stringify(msg.params.exceptionDetails, null, 2));
    } else if (msg.method === 'Console.messageAdded') {
      console.log('CONSOLE:', msg.params.message.text);
    }
  };

  await new Promise(r => setTimeout(r, 2500));
  ws.close();
  proc.kill();
}

async function run() {
  await getConsoleErrors('http://localhost:3000/present.html?s=11');
  await getConsoleErrors('http://localhost:3000/present.html?s=12');
}

run();
