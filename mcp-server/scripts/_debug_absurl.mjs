import https from 'node:https';

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8'), len: chunks.reduce((a, c) => a + c.length, 0) }));
    }).on('error', reject);
  });
}

async function main() {
  const baseUrl = 'https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/';
  const pkgSummaryUrl = `${baseUrl}net/minecraft/block/package-summary.html`;
  const href = '../../../net/minecraft/block/Block.html';

  // Resolve href against pkgSummaryUrl
  const absUrl = new URL(href, pkgSummaryUrl).href;
  console.log('pkgSummaryUrl:', pkgSummaryUrl);
  console.log('href:', href);
  console.log('absUrl:', absUrl);

  // Try fetching with absUrl
  console.log('\nFetching with absUrl:');
  const r1 = await fetchUrl(absUrl);
  console.log('Status:', r1.status, 'Len:', r1.len);

  // Try with baseUrl + href
  const classUrl = `${baseUrl}${href}`;
  console.log('\nFetching with baseUrl+href:', classUrl);
  const r2 = await fetchUrl(classUrl);
  console.log('Status:', r2.status, 'Len:', r2.len);
}

main().catch(console.error);
