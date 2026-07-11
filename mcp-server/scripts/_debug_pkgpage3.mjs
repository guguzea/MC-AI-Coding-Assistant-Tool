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

function parsePackageSummary(html, baseUrl) {
  const classes = [];
  const regex = /<a[^>]+href="\.\.\/\.\.\/\.\.\/(net\/[^"?#]+\.html)"[^>]*>([^<]+)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    const fullName = match[2].trim();
    const className = href.split("/").pop().replace(/\.html$/, "");
    classes.push({ href, name: className, fullName });
  }
  console.log('  parsePackageSummary found:', classes.length, 'classes');
  if (classes.length > 0) console.log('  first few:', classes.slice(0,3).map(c=>c.name));
  return classes;
}

async function main() {
  const baseUrl = 'https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/';
  const pkg = 'net/minecraft/block';
  const pkgSummaryUrl = `${baseUrl}${pkg}/package-summary.html`;
  console.log('Fetching:', pkgSummaryUrl);

  const html = await fetchUrl(pkgSummaryUrl);
  const classes = parsePackageSummary(html, pkgSummaryUrl);
  console.log('Total classes:', classes.length);

  if (classes.length > 0) {
    const cls = classes[0];
    const classUrl = `${baseUrl}${cls.href}`;
    console.log('First class URL:', classUrl);
    const r = await fetchUrl(classUrl);
    console.log('Class page status:', r.status, 'len:', r.length);
  }
}

main().catch(console.error);
