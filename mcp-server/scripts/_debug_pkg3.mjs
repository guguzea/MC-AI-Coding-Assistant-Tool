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
  const url = 'https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/overview-summary.html';
  const html = await fetchUrl(url);

  // Look for Block.html class links (should exist somewhere)
  const blockLinks = html.match(/Block\.html[^"]{0,50}/g) || [];
  console.log('Block.html context:', blockLinks.length);
  blockLinks.forEach(l => console.log(' ', l));

  // Look for any .html href with Block or Entity
  const allHtmlLinks = html.match(/href="[^"]*\.(?:html|HTM)"[^>]*>[^<]{0,30}/gi) || [];
  console.log('\nAll HTML hrefs with text:', allHtmlLinks.length);
  allHtmlLinks.slice(0, 10).forEach(l => console.log(' ', l));

  // Check if there are class links like net/minecraft/block/Block.html
  const classLinks = html.match(/href="net\/minecraft\/[^"]*\/[^"]*\.html"[^>]*>[^<]+/gi) || [];
  console.log('\nClass links (net/minecraft/x/y/Class.html):', classLinks.length);
  classLinks.slice(0, 5).forEach(l => console.log(' ', l));

  // What about packages that are in overview-summary?
  // Maybe the package listing contains both the package name AND class summary?
  // Let me look for the table structure
  const tableRows = html.match(/<td[^>]*>[\s\S]{1,200}?<\/td>/gi) || [];
  console.log('\nTable cells:', tableRows.length);
  tableRows.slice(0, 5).forEach(r => console.log(' ', r.replace(/\n/g, ' ').slice(0, 150)));
}

main().catch(console.error);
