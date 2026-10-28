const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const sleep = ms => new Promise(r => setTimeout(r, ms));

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'NodeJsCurriculumSlides/1.0 (https://slide-deck.edu; admin@slide-deck.edu)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const u = new URL(url);
          redirectUrl = `${u.protocol}//${u.host}${redirectUrl}`;
        }
        return resolve(downloadFile(redirectUrl, dest));
      }
      if (res.statusCode === 429) {
        return reject(new Error('RATE_LIMITED'));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        const stat = fs.statSync(dest);
        console.log(`[OK] Downloaded: ${path.basename(dest)} (${Math.round(stat.size / 1024)} KB)`);
        resolve(stat.size);
      });
      fileStream.on('error', err => {
        fs.unlink(dest, () => {});
        reject(err);
      });
    });
    req.on('error', reject);
    req.setTimeout(25000, () => {
      req.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function downloadWithRetry(url, dest, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await downloadFile(url, dest);
      return;
    } catch (err) {
      if (err.message === 'RATE_LIMITED' && attempt < maxRetries) {
        console.log(`Rate limited on ${path.basename(dest)}, waiting ${attempt * 3}s before retry...`);
        await sleep(attempt * 3000);
      } else if (attempt === maxRetries) {
        console.error(`[FAIL] ${path.basename(dest)}: ${err.message}`);
      } else {
        await sleep(1500);
      }
    }
  }
}

const targets = [
  // 1. Wikipedia Callback Mechanism (Official Wikipedia)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Callback-notitle.svg',
    dest: 'assets/img/callback-flow.svg'
  },
  // 2. Wikipedia Thread Pool & Worker Architecture (Official Wikipedia)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Thread_pool.svg',
    dest: 'assets/img/thread-pool.svg'
  },
  // 3. Wikipedia Call Stack Layout (Official Wikipedia)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Call_stack_layout.svg',
    dest: 'assets/img/call-stack.svg'
  },
  // 4. Wikipedia Unix Pipeline Architecture (Official Wikipedia)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Pipeline.svg',
    dest: 'assets/img/pipeline.svg'
  },
  // 5. Wikipedia Observer Pattern Class & Sequence Diagram (Official Wikipedia)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Observer-pattern-class-diagram.svg',
    dest: 'assets/img/observer-pattern.svg'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Observer_w_update.svg',
    dest: 'assets/img/observer-sequence.svg'
  },
  // 6. Wikipedia Three-Tier Enterprise Web Architecture (Official Wikipedia)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Overview_of_a_three-tier_application_vectorVersion.svg',
    dest: 'assets/img/three-tier-enterprise.svg'
  },
  // 7. Wikipedia Database Transaction Atomicity / ACID (Official Wikipedia)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Database_transaction_atomicity_simple.svg',
    dest: 'assets/img/database-transaction.svg'
  },
  // 8. Wikipedia Role-Based Access Control (Official Wikipedia)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Role-based_access_control.svg',
    dest: 'assets/img/rbac-model.svg'
  },
  // 9. Wikipedia OAuth 2.0 / Token Authentication Flow (Official Wikipedia)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Abstract-flow.svg',
    dest: 'assets/img/oauth-token-flow.svg'
  },
  // 10. Wikipedia Chain of Responsibility Pattern (Official UML)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/W3sDesign_Chain_of_Responsibility_Design_Pattern_UML.jpg',
    dest: 'assets/img/chain-of-responsibility.jpg'
  },
  // 11. Wikipedia Client Server Web Model
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Client-server_model.svg',
    dest: 'assets/img/client-server-model.svg'
  },
  // 12. Wikipedia MVC Pattern Architecture
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Model-View-Controller_Pattern.svg',
    dest: 'assets/img/mvc-pattern.svg'
  }
];

async function run() {
  console.log(`Starting spaced download of ${targets.length} authentic internet diagrams...`);
  for (const t of targets) {
    if (fs.existsSync(t.dest) && fs.statSync(t.dest).size > 1000) {
      console.log(`[SKIP] Already exists: ${path.basename(t.dest)}`);
      continue;
    }
    await downloadWithRetry(t.url, path.resolve(t.dest));
    await sleep(2000); // 2 second pause between downloads to respect Wikimedia API guidelines
  }
  console.log('All downloads finished.');
}

run();
