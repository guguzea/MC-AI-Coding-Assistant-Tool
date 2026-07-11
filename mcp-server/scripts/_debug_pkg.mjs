import https from 'node:https';

async function main() {
  const url = 'https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/overview-summary.html';
  const r = await new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    }).on('error', reject);
  });
  console.log('Len:', r.length);

  // Try different patterns
  const pattern1 = /<a[^>]+href="(net\/[^"?#]+\.html)"[^>]*>([^<]+)<\/a>/gi;
  const pattern2 = /href="(net\/[^"?#]+\.html)"[^>]*>([^<]+)</gi;
  const pattern3 = /href="(net\/[^"]+\.html)">([^<]+)</gi;

  const m1 = r.match(pattern1) || [];
  const m2 = r.match(pattern2) || [];
  const m3 = r.match(pattern3) || [];

  console.log('Pattern1 (a href class):', m1.length);
  console.log('Pattern2 (href class):', m2.length);
  console.log('Pattern3 (href>class):', m3.length);

  if (m1.length > 0) m1.slice(0,3).forEach(m => console.log('  ', m));
  if (m2.length > 0) m2.slice(0,3).forEach(m => console.log('  ', m));
  if (m3.length > 0) m3.slice(0,3).forEach(m => console.log('  ', m));

  // Find actual href patterns in the HTML
  const netHrefs = r.match(/href="net[^"]{0,50}/g) || [];
  console.log('\nAll net hrefs:', netHrefs.length);
  netHrefs.slice(0, 10).forEach(h => console.log(' ', h));

  // Show context around a net href
  const idx = r.indexOf('href="net/');
  if (idx >= 0) console.log('\nContext around first net href:', r.slice(idx - 20, idx + 100));
}

main().catch(console.error);
