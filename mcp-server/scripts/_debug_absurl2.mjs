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
  // Key: the full href including ../../../ prefix
  const regex = /<a[^>]+href="(\.\.\/\.\.\/\.\.\/(net\/[^"?#]+\.html))"[^>]*>([^<]+)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const href = match[2];
    const fullName = match[3].trim();
    const className = href.split("/").pop().replace(/\.html$/, "");
    const absUrl = new URL(href, pkgSummaryUrl).href;
    classes.push({ href, name: className, fullName, absUrl });
  }
  console.log('  regex found:', classes.length, 'classes, first:', classes[0]?.absUrl || 'none');
  return classes;
}

async function main() {
  const baseUrl = 'https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/';
  const pkg = 'net/minecraft/block';
  const pkgSummaryUrl = `${baseUrl}${pkg}/package-summary.html`;
  console.log('pkgSummaryUrl:', pkgSummaryUrl);

  const html = await fetchUrl(pkgSummaryUrl);
  const classes = parsePackageSummary(html, pkgSummaryUrl);
  console.log('Total:', classes.length);

  // Try fetching the first class
  if (classes.length > 0) {
    console.log('\nTrying first class:', classes[0].absUrl);
    const r = await fetchUrl(classes[0].absUrl);
    console.log('Status:', r.status, 'Len:', r.body.length);
  }
}

main().catch(console.error);
