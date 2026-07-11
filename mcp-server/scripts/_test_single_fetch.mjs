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

  // Javadoc 根目录：去掉最后 4 段
  const parts = pkgSummaryUrl.replace(/\/$/, '').split('/');
  const javadocRoot = parts.slice(0, parts.length - 4).join('/') + '/';

  // 提取所有 href 属性值
  const hrefValues = html.match(/href="([^"]+)"/g) || [];
  for (const raw of hrefValues) {
    // href="VALUE" -> VALUE
    let href = raw.slice(6, -1);

    // 标准化斜杠：所有 ../.. 变成 ../
    let normalized = href.replace(/\\\//g, '/').replace(/\.\.\\+/g, '../');

    // 跳过导航链接
    if (normalized.includes('package-summary')) continue;
    if (normalized.includes('overview-summary')) continue;
    if (normalized.includes('index-all')) continue;
    if (normalized.includes('deprecated-list')) continue;
    if (normalized.startsWith('#')) continue;
    if (!normalized.includes('net/')) continue;

    // 去掉 ../ 前缀
    const relPath = normalized.replace(/^(?:\.\.\/)+/, '');
    if (!relPath.startsWith('net/') || !relPath.endsWith('.html')) continue;

    // 提取类名
    const className = relPath.split('/').pop().replace(/\.html$/, '');
    if (!/^[A-Z]/.test(className)) continue;

    const absUrl = javadocRoot + relPath;
    classes.push({ name: className, absUrl });
  }

  return classes;
}

async function main() {
  const pkgSummaryUrl = 'https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/package-summary.html';

  const r = await fetchUrl(pkgSummaryUrl);
  console.log('Status:', r.status, 'Len:', r.body.length);

  const classes = parsePackageSummary(r.body, pkgSummaryUrl);
  console.log('Classes found:', classes.length);
  classes.slice(0, 5).forEach(c => console.log(' ', c.name, '->', c.absUrl));

  if (classes.length > 0) {
    console.log('\nFetching first class:', classes[0].absUrl);
    const r2 = await fetchUrl(classes[0].absUrl);
    console.log('HTTP', r2.status, 'Len:', r2.body.length);
    if (r2.status === 200) {
      const title = r2.body.match(/<title>([^<]+)<\/title>/)?.[1] || 'unknown';
      console.log('Title:', title);
    }
  }
}

main().catch(console.error);
