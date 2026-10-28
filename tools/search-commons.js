const https = require('https');
const fs = require('fs');
const path = require('path');

function searchCommons(q) {
  return new Promise((resolve, reject) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=5&srsearch=${encodeURIComponent(q)}&format=json`;
    https.get(url, { headers: { 'User-Agent': 'CT9Course/1.0 (educational; nodejs)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.query.search.map(s => s.title));
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function test() {
  const queries = ['three tier architecture', 'domain name system', 'SQL join inner', 'JSON Web Token', 'Nginx logo', 'Swagger logo'];
  for (const q of queries) {
    const results = await searchCommons(q);
    console.log(`Q: ${q} ->`, results.slice(0, 3));
  }
}
test();
