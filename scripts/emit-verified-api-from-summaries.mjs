#!/usr/bin/env node
/**
 * emit-verified-api-from-summaries.mjs — 把 `data/lib-api-summaries/*.json`（**已按发布清单归属过**的产物）
 * 转成 `merge-verified-api.mjs` 能吃的 JSONL 记录。
 *
 * 为什么需要这个转换器（打通 catalog 的那一跳）：
 *   `scripts/batch-decompile.mjs` 是「verified API 记录」的既有生产者，但它只按 **Modrinth 文件条目**
 *   （= jar 外壳）产记录；而库的真 API 常被拆在一层 `META-INF/jarjar/*.jar` 里
 *   （实测 KFF：`thedarkcolour.kfflib` / `kfflang` / `kffmod`，外壳自身 0 个 .class）。
 *   内层件不是 Modrinth 上的独立文件 ⇒ 不会有行 ⇒ `merge-verified-api` 永远收不到它们的包根
 *   （KFF 重建出的 47 个版本键因此进不了 `library-catalog.ts`，dry-run 只会显示「跳过已存在键」）。
 *
 * 本转换器补的就是这一环：摘要侧已经解决了「一个 jar 覆盖哪些 MC 版本」的归属
 * （`build-api-summaries.mjs` 用 `lib-manifests` 按 sha12 / 发布版本号 join），
 * 这里把每个 `versions.<mcVersion>` 展开成 `<mcVersion>/<loader>` 记录（loader 同样取自清单），
 * 交给既有写入器 —— 归属/剔除/重排缩进那些逻辑一行不改，避免第二份实现。
 *
 * 用法：
 *   node scripts/emit-verified-api-from-summaries.mjs --slug kotlin-for-forge
 *   node scripts/emit-verified-api-from-summaries.mjs --slug a,b --out temp/verified-api-from-summaries.jsonl
 *   # 随后（先 dry-run 看差异）：
 *   node scripts/merge-verified-api.mjs --input temp/verified-api-from-summaries.jsonl --dry-run
 *   node scripts/merge-verified-api.mjs --input temp/verified-api-from-summaries.jsonl --force
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const SUMMARY_DIR = path.join(ROOT, "mcp-server", "data", "lib-api-summaries");
const MANIFEST = path.join(ROOT, "mcp-server", "data", "lib-manifests", "all.json");

const USAGE = `用法：
  node scripts/emit-verified-api-from-summaries.mjs [--slug <slug[,slug...]>] [--out <file>] [--dry-run]

  --slug    只处理这些库（按摘要文件名或 summary.slug 匹配）；缺省 = 全部摘要
  --out     输出 JSONL（缺省 temp/verified-api-from-summaries.jsonl）
  --dry-run 只打印统计，不写文件`;

function parseArgs(argv) {
  const opt = { slug: null, out: "temp/verified-api-from-summaries.jsonl", dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") { console.log(USAGE); process.exit(0); }
    else if (a === "--slug") opt.slug = argv[++i];
    else if (a === "--out") opt.out = argv[++i];
    else if (a === "--dry-run") opt.dryRun = true;
  }
  return opt;
}

/**
 * 「捆绑运行时」包根黑名单（F46 残余的修法）。
 *
 * 背景：`-all` 类 jar 会把运行时摊平进外壳（实测 `kotlinforforge-1.17.0-obf.jar`
 * 4041 个 `.class` 里 3982 个含 `kotlin/`），摘要据此把它们算成本库的 `packages`，
 * 于是 catalog 里 KFF 的 67 个键会列出 `kotlinx.coroutines.*`（12 个）等**不是任何模组 API** 的包根，
 * 而 catalog 正是模型抄 import 的地方 —— 这就是「185 类里真名只 13」那条结论的实体。
 *
 * **红线（用户 2026-09-15 明示）**：不许改成「只留 modId 段」——那会误伤合法非 modId 包根
 * （例：cloth-config 的 `me.shedaniel.*`）。所以这里用**显式命名空间黑名单**，只删
 * 「任何模组都不可能把它当自己 API 发布」的运行时/平台命名空间。
 *
 * 只影响**本转换器**产出的记录；不重跑就没动过的库一行不受影响。
 */
const RUNTIME_ROOTS = [
  // Kotlin 运行时（KFF/任何 Kotlin 库的捆绑物）
  "kotlin",
  "kotlinx",
  "org.jetbrains",
  "org.intellij.lang",
  "org.intellij",
  // MC / 加载器自身
  "net.minecraft",
  "net.minecraftforge",
  "net.neoforged",
  "cpw.mods",
  "com.mojang",
  // 通用第三方/运行时
  "org.spongepowered",
  "it.unimi.dsi",
  "org.objectweb.asm",
  "org.apache",
  "org.slf4j",
  "com.google",
  "io.netty",
  "javax",
  "java",
  "jdk",
  "sun",
];

/** 该包是否属于运行时/平台命名空间（等于黑名单项或以 `<项>.` 开头）。 */
function isRuntimePackage(pkg) {
  return RUNTIME_ROOTS.some((r) => pkg === r || pkg.startsWith(`${r}.`));
}

/**
 * shaded / 示例**区段**判据（按完整段匹配，不是命名空间黑名单）：
 *  - `shadowed` / `shadow` 整段 = 重定位 shaded 区（实测 geckolib：`software.bernie.shadowed.*`
 *    3540 类，是把第三方库整体搬进自家包名下的惯例位置）。安全边界：placebo 的
 *    `dev.shadowsoffire.*` 是作者名（整段 `shadowsoffire`），不命中；
 *  - `example` / `examples` 整段 = jar 自带示例 mod 代码（实测 geckolib：`software.bernie.example.*`
 *    319 类），不是库 API。
 * 实测 19 个有树库包根普查（2026-09-15）：只有 geckolib 命中这两条，对其余库零影响。
 */
const SHADED_SEGMENT = /^(?:shadowed?|examples?)$/;

/** 该包路径任一整段是 shaded/示例区段 ⇒ 非本库 API。 */
function isBundledNonApiPackage(pkg) {
  return String(pkg)
    .split(".")
    .some((s) => SHADED_SEGMENT.test(s));
}

/** 清单：slug → { bySha12, byVerNum }、以及 (slug, gameVersion) → loaders。 */
function loadManifest() {
  const raw = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const libs = Array.isArray(raw) ? raw : Object.values(raw);
  const bySlug = new Map();
  for (const lib of libs) {
    const slug = String(lib?.slug || "").trim();
    if (!slug) continue;
    const byVerNum = new Map(); // versionNumber → Set(gameVersion)
    const loadersByGv = new Map(); // gameVersion → Set(loader)
    const allLoaders = new Set();
    for (const e of lib.entries || []) {
      if (e?.versionNumber) {
        const s = byVerNum.get(e.versionNumber) ?? new Set();
        if (e.gameVersion) s.add(e.gameVersion);
        byVerNum.set(e.versionNumber, s);
      }
      if (e?.gameVersion && e?.loader) {
        const s = loadersByGv.get(e.gameVersion) ?? new Set();
        s.add(e.loader);
        loadersByGv.set(e.gameVersion, s);
        allLoaders.add(e.loader);
      }
    }
    bySlug.set(slug, { byVerNum, loadersByGv, allLoaders: [...allLoaders] });
  }
  return bySlug;
}

function main() {
  const opt = parseArgs(process.argv.slice(2));
  const manifest = loadManifest();
  const want = opt.slug ? new Set(opt.slug.split(",").map((s) => s.trim()).filter(Boolean)) : null;
  if (!fs.existsSync(SUMMARY_DIR)) {
    console.error(`[emit] 摘要目录不存在：${SUMMARY_DIR}`);
    process.exit(1);
  }
  const files = fs.readdirSync(SUMMARY_DIR).filter((f) => f.endsWith(".json")).sort();
  const records = [];
  const skipped = [];
  const droppedBySlug = new Map();
  const droppedSamples = new Set();
  for (const f of files) {
    let sum;
    try { sum = JSON.parse(fs.readFileSync(path.join(SUMMARY_DIR, f), "utf8")); } catch { continue; }
    const slug = String(sum.slug || f.replace(/\.json$/, ""));
    if (want && !want.has(slug) && !want.has(f.replace(/\.json$/, ""))) continue;
    const man = manifest.get(slug);
    if (!man) { skipped.push(`${f}: 清单里没有 slug=${slug}`); continue; }
    for (const [mcVersion, v] of Object.entries(sum.versions || {})) {
      const rawPkgs = Array.isArray(v?.packages) ? v.packages : [];
      // F46 残余：摘掉捆绑运行时/平台命名空间（黑名单见文件头；**不是**「只留 modId 段」）；
      // 2026-09-15 扩：shaded/示例区段（shadowed|shadow|example|examples 整段）同摘（geckolib 实测）。
      const packages = rawPkgs.filter((p) => !isRuntimePackage(p) && !isBundledNonApiPackage(p));
      const droppedHere = rawPkgs.filter((p) => isRuntimePackage(p) || isBundledNonApiPackage(p));
      if (droppedHere.length) {
        droppedBySlug.set(slug, (droppedBySlug.get(slug) ?? 0) + droppedHere.length);
        for (const d of droppedHere) droppedSamples.add(d);
      }
      if (!packages.length) { skipped.push(`${f} @ ${mcVersion}: packages 为空（原 ${rawPkgs.length} 项全是运行时）`); continue; }
      // loader 一律取自清单：`<mcVersion>/<loader>` 是 catalog 的键形态，猜不得。
      let loaders = [...(man.loadersByGv.get(mcVersion) ?? [])];
      if (loaders.length === 0) loaders = man.allLoaders;
      if (loaders.length === 0) { skipped.push(`${f} @ ${mcVersion}: 清单里没有该版本的 loader`); continue; }
      for (const loader of loaders) {
        records.push({
          status: "success",
          slug,
          modId: sum.modId || "",
          modVersion: "",
          gameVersion: mcVersion,
          loader,
          packages,
          entrypoints: [],
          outputDir: "",
          source: "summaries(按发布清单归属)",
        });
      }
    }
  }
  const bySlugCount = new Map();
  for (const r of records) bySlugCount.set(r.slug, (bySlugCount.get(r.slug) ?? 0) + 1);
  console.log(`[emit] 记录 ${records.length} 条：`);
  for (const [s, n] of [...bySlugCount.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${s}: ${n} 条`);
  if (droppedBySlug.size) {
    const total = [...droppedBySlug.values()].reduce((a, b) => a + b, 0);
    console.log(`[emit] 摘掉捆绑运行时包根 ${total} 项（按库：${[...droppedBySlug.entries()].map(([s, n]) => `${s}=${n}`).join(", ")}）`);
    console.log(`[emit]   样例：${[...droppedSamples].slice(0, 8).join(", ")}${droppedSamples.size > 8 ? " …" : ""}`);
  }
  if (skipped.length) {
    console.log(`[emit] 跳过 ${skipped.length} 项：`);
    for (const s of skipped.slice(0, 10)) console.log(`  - ${s}`);
  }
  if (opt.dryRun) { console.log("[emit] dry-run：未写文件"); return; }
  const outPath = path.resolve(process.cwd(), opt.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, records.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");
  console.log(`[emit] 已写 ${outPath}`);
}

main();
