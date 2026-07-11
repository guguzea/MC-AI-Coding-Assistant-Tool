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

function resolveRelativeHref(href, pkgSummaryUrl) {
  // 统计 ../ 的数量
  const upMatch = href.match(/^((?:\.\.\/)+)(net\/.+)/);
  if (!upMatch) return null;
  const upCount = (upMatch[1].match(/\.\.\//g) || []).length;
  const path = upMatch[2];

  // 从 pkgSummaryUrl 提取 javadoc 根目录
  // pkgSummaryUrl = https://host/javadoc/forge/version/net/minecraft/block/package-summary.html
  // 去掉最后3段（net/minecraft/block/package-summary.html）
  const baseParts = pkgSummaryUrl.replace(/\/$/, '').split('/');
  // [...protocol, host, javadoc, forge, version, net, minecraft, block, package-summary.html]
  // 索引:  0        1     2        3      4        5    6         7      8
  // 去掉最后3段（net/minecraft/block/），保留到 version/
  const javadocRoot = baseParts.slice(0, baseParts.length - 3).join('/') + '/';
  // javadocRoot = https://host/javadoc/forge/version/
  // 向上 upCount 级
  const parts = javadocRoot.replace(/\/$/, '').split('/');
  const targetParts = parts.slice(0, parts.length - upCount);
  return targetParts.join('/') + '/' + path;
}

function parsePackageSummary(html, pkgSummaryUrl) {
  const classes = [];
  const regex = /<a[^>]+href="((?:\.\.[\\/])+(net\/[^"?#]+\.html))"[^>]*>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    let href = match[1].replace(/\\\//g, '/');

    if (href.includes('package-summary')) continue;
    if (href.includes('overview-summary')) continue;
    if (href.includes('index-all')) continue;
    if (href.includes('deprecated-list')) continue;

    const className = href.split('/').pop().replace(/\.html$/, '');
    if (!/^[A-Z]/.test(className)) continue;

    const absUrl = resolveRelativeHref(href, pkgSummaryUrl);
    if (!absUrl) continue;

    classes.push({ href, name: className, absUrl });
  }

  return classes;
}

async function main() {
  const pkgSummaryUrl = 'https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/package-summary.html';
  console.log('pkgSummaryUrl:', pkgSummaryUrl);

  const javadocRoot = pkgSummaryUrl.replace(/\/$/, '').split('/').slice(0, -3).join('/') + '/';
  console.log('javadocRoot:', javadocRoot);

  const testCases = [
    '../../../net/minecraft/block/IGrowable.html',
    '../../../net/minecraft/block/ITileEntityProvider.html',
    '../../../net/minecraft/block/Block.html',
  ];
  for (const href of testCases) {
    const abs = resolveRelativeHref(href, pkgSummaryUrl);
    console.log(href, '->', abs);
  }

  const r = await fetchUrl(pkgSummaryUrl);
  const classes = parsePackageSummary(r.body, pkgSummaryUrl);
  console.log('\nClasses found:', classes.length);
  classes.slice(0, 5).forEach(c => console.log(' ', c.name, '->', c.absUrl.slice(-60)));

  if (classes.length > 0) {
    console.log('\nFetching:', classes[0].absUrl);
    const r2 = await fetchUrl(classes[0].absUrl);
    console.log('HTTP', r2.status, 'len:', r2.body.length);
  }
}

main().catch(console.error);
