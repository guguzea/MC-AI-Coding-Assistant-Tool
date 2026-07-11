import https from 'node:https';

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    }).on('error', reject);
  });
}

function parsePackageSummary(html) {
  const classes = [];
  const regex = /<a[^>]+href="(net\/[^"?#]+\.html)"[^>]*>([^<]+)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    const name = match[2].trim();
    if (href.endsWith("package-summary.html")) continue;
    if (href.endsWith(".html") && !href.includes("package-")) {
      classes.push({ href, name });
    }
  }
  return classes;
}

async function main() {
  const url = 'https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/overview-summary.html';
  const html = await fetchUrl(url);
  console.log('HTML len:', html.length);

  const classes = parsePackageSummary(html);
  console.log('Classes found:', classes.length);
  classes.slice(0, 5).forEach(c => console.log(' ', JSON.stringify(c)));
}

main().catch(console.error);
