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
  // Strategy: 找到所有 href 包含 net/ 且是 .html 的链接
  // 然后过滤并提取类名
  const regex = /<a[^>]+href="([^"]*net\/[^"?#]+\.html)"[^>]*>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    let href = match[1];
    // 跳过 package-summary 和导航链接
    if (href.includes('package-summary')) continue;
    if (href.includes('overview-summary')) continue;
    if (href.includes('index-all')) continue;
    if (href.includes('deprecated-list')) continue;
    if (href.includes('help-doc')) continue;
    if (href.includes('overview-tree')) continue;

    // 提取类名：从 href 路径中倒数第二个段
    // e.g. ../../../net/minecraft/block/Block.html -> ["", "..", "..", "net", "minecraft", "block", "Block.html"]
    const parts = href.split('/');
    const htmlIdx = parts.findIndex(p => p.endsWith('.html'));
    if (htmlIdx < 0) continue;

    const fileName = parts[htmlIdx];
    const className = fileName.replace(/\.html$/, '');

    // 过滤掉非类名（数字、内联类等）
    // 有效类名：首字母大写，包含字母，可能包含 $（内部类）
    if (!/^[A-Z]/.test(className)) continue;

    const absUrl = new URL(href, pkgSummaryUrl).href;
    classes.push({ href, name: className, absUrl });
  }

  return classes;
}

async function main() {
  const pkgSummaryUrl = 'https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/package-summary.html';

  const r = await fetchUrl(pkgSummaryUrl);
  const html = r.body || r;
  console.log('HTML len:', html.length);

  const classes = parsePackageSummary(html, pkgSummaryUrl);
  console.log('Classes found:', classes.length);
  classes.slice(0, 5).forEach(c => console.log(' ', c.name, '->', c.absUrl.slice(-60)));

  if (classes.length > 0) {
    console.log('\nTesting first class...');
    const r2 = await fetchUrl(classes[0].absUrl);
    const body2 = r2.body || r2;
    console.log('HTTP', r2.status, 'len:', body2.length);
    console.log('First 200:', body2.slice(0, 200));
  }
}

main().catch(console.error);
