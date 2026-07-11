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

function parsePackageSummary(html, pkgSummaryUrl) {
  const classes = [];

  // Strategy 1: Match href with ../../../net/xxx/yyy/ClassName.html" title="
  const regex1 = /<a[^>]+href="(\.\.\/[^"]*net\/[^"?#]+\.html)"[^>]*>/gi;
  let match;
  while ((match = regex1.exec(html)) !== null) {
    const href = match[1];
    // Extract class name from href: ../../../net/minecraft/block/Block.html
    const parts = href.split('/');
    const htmlIdx = parts.findIndex(p => p.endsWith('.html'));
    if (htmlIdx >= 0) {
      const className = parts[htmlIdx].replace(/\.html$/, '');
      const absUrl = new URL(href, pkgSummaryUrl).href;
      classes.push({ href, name: className, absUrl });
    }
  }

  console.log('  Strategy1 found:', classes.length);

  // Strategy 2: Match full path href (../../../net/minecraft/block/Block.html)
  if (classes.length === 0) {
    const regex2 = /href="(\.\.\/\.\.\/\.\.\/net\/[^"?#]+\.html)"/gi;
    while ((match = regex2.exec(html)) !== null) {
      const href = match[1];
      const parts = href.split('/');
      const className = parts[parts.length - 1].replace(/\.html$/, '');
      const absUrl = new URL(href, pkgSummaryUrl).href;
      classes.push({ href, name: className, absUrl });
    }
    console.log('  Strategy2 found:', classes.length);
  }

  // Strategy 3: Match all href with net/ prefix
  if (classes.length === 0) {
    const regex3 = /href="([^"]*net\/[^"?#]+\.html)"/gi;
    while ((match = regex3.exec(html)) !== null) {
      const href = match[1];
      const parts = href.split('/');
      const className = parts[parts.length - 1].replace(/\.html$/, '');
      const absUrl = new URL(href, pkgSummaryUrl).href;
      classes.push({ href, name: className, absUrl });
    }
    console.log('  Strategy3 found:', classes.length);
  }

  return classes;
}

async function main() {
  const baseUrl = 'https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/';
  const pkgSummaryUrl = `${baseUrl}net/minecraft/block/package-summary.html`;

  const html = await fetchUrl(pkgSummaryUrl);
  console.log('HTML len:', html.length);

  const classes = parsePackageSummary(html, pkgSummaryUrl);
  console.log('Total:', classes.length);
  classes.slice(0, 3).forEach(c => console.log(' ', c.name, '->', c.absUrl));

  // Test fetching first class
  if (classes.length > 0) {
    const r = await fetchUrl(classes[0].absUrl);
    console.log('\nFirst class status: HTTP', r.status, 'len:', r.length);
  }
}

main().catch(console.error);
