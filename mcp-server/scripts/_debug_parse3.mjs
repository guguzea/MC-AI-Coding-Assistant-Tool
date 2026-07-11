import https from 'node:https';

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    }).on('error', reject);
  });
}

function parsePackageSummary(html, pkgSummaryUrl) {
  const classes = [];
  const regex = /<a[^>]+href="((?:\.\.[\\/])+(net\/[^"?#]+\.html))"[^>]*>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    let href = match[1].replace(/\\\//g, '/');

    if (href.includes('package-summary')) continue;
    if (href.includes('overview-summary')) continue;
    if (href.includes('index-all')) continue;
    if (href.includes('deprecated-list')) continue;

    const className = href.split('/').pop().replace(/\.html$/, '');
    if (!/^[A-Z]/.test(className)) continue;

    const absUrl = new URL(href, pkgSummaryUrl).href;
    classes.push({ href, name: className, absUrl });
  }

  return classes;
}

async function main() {
  const pkgSummaryUrl = 'https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/package-summary.html';

  const r = await fetchUrl(pkgSummaryUrl);
  const html = r.body;
  console.log('HTML len:', html.length);

  const classes = parsePackageSummary(html, pkgSummaryUrl);
  console.log('Classes found:', classes.length);
  classes.slice(0, 5).forEach(c => console.log(' ', c.name, '->', c.absUrl.slice(-60)));

  if (classes.length > 0) {
    console.log('\nFetching first class:', classes[0].absUrl);
    const r2 = await fetchUrl(classes[0].absUrl);
    console.log('HTTP', r2.status, 'len:', r2.body.length);
  }
}

main().catch(console.error);
