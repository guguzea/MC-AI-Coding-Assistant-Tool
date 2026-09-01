/**
 * Static gate：docs-platform 每个 store 的 Map 缓存都必须有硬条数上界。
 *
 * 背景（A-32）：FabricDocStore 的 indexCache / fileCache / symbolIndexCache 只有 TTL，
 * TTL 只挡「读到过期条目」，不挡「条目数无限增长」。长驻 MCP 进程查 70 个版本 →
 * 缓存里就永远挂着 70 份全文。修法是 ttlCacheSet（自带 max）或 trimOldest（插入序淘汰）。
 *
 * 规则：
 *  - 裸写入 `this.X.set(` / `setCache(this.X,`（X 是本文件声明的 `private XCache = new Map`）
 *    之后 6 行内必须出现 `trimOldest(this.X`。只比较全文件条数会漏：另一处 trim
 *    能把漏写的那条抵掉，所以按写入点逐条配对。
 *  - `ttlCacheSet(this.X, ...)` 自带 max 参数（内部 while 淘汰），不需要额外 trim。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const storesDir = path.join(root, "src", "docs-platform");

const files = fs
  .readdirSync(storesDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => path.join(storesDir, e.name, "store.ts"))
  .filter((f) => fs.existsSync(f))
  .sort();

if (files.length === 0) {
  console.error(`assert-doc-cache-bounds: 没找到任何 ${storesDir}/*/store.ts（路径变了？）`);
  process.exit(1);
}

const FIELD_RE = /private\s+(?:readonly\s+)?(\w*Cache)\s*(?::[^=;]*)?=\s*new Map/;
const WRITE_RE = /this\.(\w*Cache)\.set\(|setCache\(this\.(\w*Cache)/;
const TRIM_WINDOW = 6;
const failures = [];
let cacheCount = 0;
let trimCount = 0;
let ttlCount = 0;
let writeCount = 0;

for (const file of files) {
  const rel = path.relative(root, file).replace(/\\/g, "/");
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const caches = new Set();
  for (const line of lines) {
    const m = FIELD_RE.exec(line);
    if (m) caches.add(m[1]);
  }
  cacheCount += caches.size;
  for (const name of caches) {
    trimCount += lines.filter((l) => l.includes(`trimOldest(this.${name}`)).length;
    ttlCount += lines.filter((l) => l.includes(`ttlCacheSet(this.${name}`)).length;
  }
  lines.forEach((line, i) => {
    const m = WRITE_RE.exec(line);
    if (!m) return;
    const name = m[1] ?? m[2];
    if (!caches.has(name)) return; // 注释里的别名 / 非本 store 的 Map
    writeCount += 1;
    const window = lines.slice(i + 1, i + 1 + TRIM_WINDOW);
    if (window.some((l) => l.includes(`trimOldest(this.${name}`))) return;
    const trims = lines
      .map((l, n) => (l.includes(`trimOldest(this.${name}`) ? n + 1 : 0))
      .filter(Boolean);
    failures.push(
      `${rel}:${i + 1} ${name}.set 后 ${TRIM_WINDOW} 行内没有 trimOldest(this.${name})` +
        `（该 store 现有淘汰点：${trims.length ? `行 ${trims.join(", ")}` : "无"}）` +
        ` —— 无界写入点，长驻进程会一直攒条目`,
    );
  });
}

if (writeCount === 0) {
  console.error(
    `assert-doc-cache-bounds: 一个裸写入点都没扫到（caches=${cacheCount}）——正则或 store 结构变了，门已失效`,
  );
  process.exit(1);
}

if (failures.length) {
  console.error("assert-doc-cache-bounds: 缓存缺条数上界：");
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}

console.log(
  `assert-doc-cache-bounds: ok (${files.length} stores / ${cacheCount} caches / ${writeCount} writes, ${trimCount} trims + ${ttlCount} ttlCacheSet)`,
);
