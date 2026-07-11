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

async function main() {
  // Test net/minecraft/block/package-summary.html
  const url = 'https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/package-summary.html';
  const html = await fetchUrl(url);
  console.log('Len:', html.length, 'First 500:', html.slice(0, 500));

  // Find all links
  const links = html.match(/<a[^>]+href="[^"]*"[^>]*>[^<]*<\/a>/gi) || [];
  console.log('\nLinks found:', links.length);
  links.slice(0, 10).forEach(l => console.log(' ', l));

  // Find Block.html links
  const blockLinks = html.match(/Block\.html[^"]{0,50}/g) || [];
  console.log('\nBlock links:', blockLinks.length);
  blockLinks.slice(0, 5).forEach(l => console.log(' ', l));

  // Find all href="net/ links
  const netLinks = html.match(/href="net\/[^"]{0,80}/g) || [];
  console.log('\nAll net/ hrefs:', netLinks.length);
  netLinks.slice(0, 10).forEach(l => console.log(' ', l));

  // Try our regex
  const regex = /<a[^>]+href="(net\/[^"?#]+\.html)"[^>]*>([^<]+)<\/a>/gi;
  const matches = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    matches.push({ href: m[1], text: m[2] });
  }
  console.log('\nRegex matches:', matches.length);
  matches.slice(0, 5).forEach(m => console.log(' ', JSON.stringify(m)));
}

main().catch(console.error);
