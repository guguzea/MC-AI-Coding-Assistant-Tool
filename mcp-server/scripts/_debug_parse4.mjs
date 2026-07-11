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
  const regex = /<a[^>]+href="((?:\.\.[\\/])+(net\/[^"?#]+\.html))"[^>]*>/gi;
  let match;

  // 从 pkgSummaryUrl 提取基础 URL（去掉包路径）
  // e.g. https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/package-summary.html
  // -> https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/
  const baseMatch = pkgSummaryUrl.match(/^(https:\/\/[^\/]+\/[^\/]+\/[^\/]+\/[^\/]+\/[^\/]+\/)/);
  const docRoot = baseMatch ? baseMatch[1] : pkgSummaryUrl;

  while ((match = regex.exec(html)) !== null) {
    // 原始 href（可能含编码斜杠）
    let href = match[1].replace(/\\\//g, '/');

    if (href.includes('package-summary')) continue;
    if (href.includes('overview-summary')) continue;
    if (href.includes('index-all')) continue;
    if (href.includes('deprecated-list')) continue;

    const className = href.split('/').pop().replace(/\.html$/, '');
    if (!/^[A-Z]/.test(className)) continue;

    // 手动拼接：从 docRoot 解析 ../../
    // ../.. = 返回两级
    const upMatch = href.match(/^((?:\.\.\/)+)(net\/.+)/);
    let absUrl;
    if (upMatch) {
      const ups = upMatch[1]; // e.g. "../../../"
      const path = upMatch[2]; // e.g. "net/minecraft/block/Block.html"
      const upCount = (ups.match(/\.\.\//g) || []).length;
      // 从 docRoot 向上 upCount 级
      const baseParts = docRoot.replace(/\/$/, '').split('/');
      const targetParts = baseParts.slice(0, baseParts.length - upCount);
      absUrl = targetParts.join('/') + '/' + path;
    } else {
      // 已经是绝对路径或相对路径
      absUrl = docRoot + href;
    }

    classes.push({ href, name: className, absUrl });
  }

  return classes;
}

async function main() {
  const pkgSummaryUrl = 'https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/package-summary.html';

  const r = await fetchUrl(pkgSummaryUrl);
  console.log('HTML len:', r.body.length);

  const classes = parsePackageSummary(r.body, pkgSummaryUrl);
  console.log('Classes found:', classes.length);
  classes.slice(0, 5).forEach(c => console.log(' ', c.name, '->', c.absUrl));

  if (classes.length > 0) {
    console.log('\nFetching first class:', classes[0].absUrl);
    const r2 = await fetchUrl(classes[0].absUrl);
    console.log('HTTP', r2.status, 'len:', r2.body.length);
  }
}

main().catch(console.error);
