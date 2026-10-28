const https = require('https');

function searchGithubMdn(query) {
  const url = `https://api.github.com/search/code?q=${encodeURIComponent(query)}+repo:mdn/content+path:files/en-us`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'NodeSlideDownloader/1.0', 'Accept': 'application/vnd.github.v3+json' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const res = await searchGithubMdn('extension:png OR extension:svg');
  if (res.items) {
    res.items.slice(0, 15).forEach(item => {
      console.log(`* ${item.name} -> ${item.path}`);
    });
  } else {
    console.log('Result:', res);
  }
}

run();
