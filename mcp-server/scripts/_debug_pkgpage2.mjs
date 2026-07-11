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
  const url = 'https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/package-summary.html';
  const html = await fetchUrl(url);

  // Find the class table
  // Look for class="colFirst" (standard javadoc class table)
  const tableSection = html.match(/class="[^"]*colFirst[^"]*"[\s\S]{1,5000}/i);
  if (tableSection) {
    console.log('Table section found, len:', tableSection[0].length);
    console.log('First 1000:', tableSection[0].slice(0, 1000));
  } else {
    console.log('No colFirst table found');
    // Search for Block.class links
    const blockLinks = html.match(/Block\.html[^"]{0,100}/g) || [];
    console.log('Block links with context:', blockLinks.length);
    blockLinks.forEach(l => console.log(' ', l));
  }

  // Find all .html hrefs (excluding nav)
  const allLinks = html.match(/href="([^"]+\.html)"[^>]*>[^<]{0,50}/gi) || [];
  console.log('\nAll .html hrefs:', allLinks.length);
  // Filter to non-navigation, non-overview links
  const classLinks = allLinks.filter(l => {
    const href = l.match(/href="([^"]+)"/)?.[1] || '';
    return !href.startsWith('#') &&
           !href.startsWith('..') &&
           !href.match(/overview|summary|tree|deprecated|index|help|frames/i) &&
           (href.endsWith('.html') || href.match(/^[A-Z][\w]*\.html/));
  });
  console.log('Class-like links:', classLinks.length);
  classLinks.slice(0, 20).forEach(l => console.log(' ', l));
}

main().catch(console.error);
