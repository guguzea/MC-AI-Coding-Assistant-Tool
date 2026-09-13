/**
 * G1 · 库摘要的身份与归属门（S4 / F113 · F98）。
 *
 * 为什么这是「一旦坏了整条数据链就静默出错」的那一环：`mcp-server/data/lib-api-summaries/*.json`
 * 是 `library-catalog.ts` 里 `verifiedApi.packages` 的唯一上游，catalog 又直接决定模型写模组时
 * 引用哪个库的哪个类。反编译期只要有一个 jar 解不出 modId，产物就落进 `unknown-mod/unknown`，
 * 于是**同一棵目录被 N 个 slug 共用**，Bookshelf 的类被当成 GeckoLib 的类写进摘要，再顺着
 * `merge-verified-api` 流进 14 个非 Bookshelf 条目 —— 全程没有一环报错。
 * F113 的终裁：catalog 里 50 行外来包，**无一例外**来自 `unknown-mod` 坍缩。
 *
 * 断言分两层：
 *  A. 内容层（任何数据根都跑）
 *     A1 归属：每个类按 `packageRoot`（前 3 段，函数直接抽自 writer）判归属；被**他条目**凭证占有且本条目
 *        modIds 不「段级自有」= 冒领。冒领只允许落在 DEBT 台账里点名的文件+条数上，多一个/少一个/换包根都红。
 *     A2 身份：`source.dirs` 出现 `unknown-mod`、或同一目录被 >1 slug 共用 = 坍缩复发（DEBT 之外的目录一律红）。
 *     A3 版本键：`versions` 出现字面量 `unknown` 是同一坍缩的第二症状。
 *     A4 连接：每份摘要必须连得上 catalog 条目；连不上则本门对它整体失效 ⇒ 直接红。
 *     A5 同源：规则不另写一份 —— `normSeg / ROOT_SEGMENTS / ownsPackage / packageRoot / foreignPackages`
 *        从 `scripts/merge-verified-api.mjs` 原文抽出跑，并钉住 `buildRootOwnerIndex` 的凭证登记行。
 *  B. 台账层（只跑真数据根）：把今天的存量债务逐数钉死（385 类 / 5 文件 / 每份 77 / 单一包根 /
 *     6 份 unknown-mod / 1 个共用目录 / 38 个已证实包根 / 1836 组 verifiedApi / 0 处凭证缺失）。
 *     S5 联网重建把存量清零时，本层会红并要求显式改台账 —— 数据面收敛必须签字，不许悄悄漂移。
 *
 * 测试假根：MC_SKILL_LIB_OWN_TEST_ROOT 指向含 `data/lib-api-summaries` 的目录（B 层跳过，A 层照咬）。
 * A5 锚点自证：MC_SKILL_LIB_OWN_WRITER_SRC 可把规则抽取指到一份改过形的 writer 副本上。
 * 投毒自检在 test-scripts.mjs §S4。
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(SERVER_ROOT, "..");

const TEST_ROOT = process.env.MC_SKILL_LIB_OWN_TEST_ROOT;
const DATA_DIR = TEST_ROOT ? path.join(path.resolve(TEST_ROOT), "data") : path.join(SERVER_ROOT, "data");
const SUM_DIR = path.join(DATA_DIR, "lib-api-summaries");
const MERGE_SRC = process.env.MC_SKILL_LIB_OWN_WRITER_SRC
  ? path.resolve(process.env.MC_SKILL_LIB_OWN_WRITER_SRC)
  : path.join(REPO_ROOT, "scripts", "merge-verified-api.mjs");

/**
 * 存量债务（S5 联网重建后已排空，2026-09-12 磁盘实算）。
 * 这些清单**保留为空**而不是删掉检查：重建后的摘要再冒领一个类，就会以「不在台账」的形式红，
 * 而不是因为台账被删而没人管。清零当时的数：冒领 385 类 / 5 文件 / unknown-mod 6 目录 → 全 0。
 */
const DEBT_FOREIGN = {};
const DEBT_FOREIGN_ROOTS = {};
/**
 * catalog 侧存量债务：`verifiedApi[key].packages` 里冒领他方包根的行（键 `条目id|版本键|包名`）。
 * 摘要只是中段，这一层才是模型真正抄成 import 的地方，所以逐行钉死而不是只记总数。
 * S5b 补取件 + merge 覆盖后归零（历史上是 50 行 → 36 行 → 0，全是 `net.darkhax.bookshelf` 冒领）。
 * 空台账 = 零容忍：再出现任何一条即以「不在存量台账」红。KfF 剩余的键救不了，实测原因不是元数据缺，
 * 而是那些 jar 自己不含 `kotlinforforge` 路径段（`-all` 把 kotlin/kotlinx 摊平、新版只剩
 * `META-INF/jarjar/` 壳）——外部证据按定义不许替 jar 编造身份，故归「jarjar 发现」后续。
 */
// S5b：36 行 → 8 行。剩下的 8 行全是 kotlin-for-forge，且**不是**「还没取件」而是「取件救不了」：
// 实测这些 jar 自身条目里没有 `kotlinforforge` 这一段（`-all` 把 kotlin/kotlinx 摊平成顶层、
// 1.20.5+ 只剩 `META-INF/jarjar/` 壳），而外部证据按定义不许替 jar 编造身份 ⇒ 硬闸拒绝。
// 正解是剔除这些已确定为假的键（走 merge-verified-api 的覆盖/剔除路，不手改生成物）；
// 登记在此是为了让它成为可见的 8 行而不是悄悄消失。prune 落地后必须清空本清单。
const DEBT_CATALOG_FOREIGN = [
  "authored/lib-kotlin-for-forge|1.18/forge|net.darkhax.bookshelf",
  "authored/lib-kotlin-for-forge|1.19.3/forge|net.darkhax.bookshelf",
  "authored/lib-kotlin-for-forge|1.19.3/neoforge|net.darkhax.bookshelf",
  "authored/lib-kotlin-for-forge|1.20.5/neoforge|net.darkhax.bookshelf",
  "authored/lib-kotlin-for-forge|1.20.6/forge|net.darkhax.bookshelf",
  "authored/lib-kotlin-for-forge|1.20.6/neoforge|net.darkhax.bookshelf",
  "authored/lib-kotlin-for-forge|1.21.10/forge|net.darkhax.bookshelf",
  "authored/lib-kotlin-for-forge|1.21.10/neoforge|net.darkhax.bookshelf",
];
const DEBT_UNKNOWN_MOD_DIRS = [];
/**
 * S5b 补取件带出的新残留：pehkui 的 `21w10a` 快照行 jar 内没解出 modVersion，
 * 摘要因此又出现 `versions.unknown` 键（源码 dirs 是干净的，只有版本键脏）。
 * 登记而非放宽：修 versionKeyOf/modVersion 之后必须把它删掉。
 */
const DEBT_UNKNOWN_VERSION_KEYS = ["pehkui.json"];
const DEBT_SHARED_DIRS = {};

/** 台账层数字：B 层只在真数据根比对。 */
const LEDGER = {
  summaries: 44,
  classes: 12583,
  catalogEntries: 50,
  attestedRoots: 42,
  multiOwnerRoots: 0,
  verifiedApiKeys: 1838,
  badVerifiedAt: 0,
  foreignTotal: 0,
  foreignFiles: Object.keys(DEBT_FOREIGN).length,
};

const failures = [];
const fail = (m) => failures.push(m);
const rel = (p) => path.relative(REPO_ROOT, p).split(path.sep).join("/");
const sortedJson = (obj) => JSON.stringify(Object.fromEntries(Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]))));

if (!fs.existsSync(SUM_DIR)) {
  console.error(`assert-lib-ownership(G1): 摘要目录不存在 ${rel(SUM_DIR)}`);
  process.exit(1);
}

// ── A5：把 writer 的归属规则原样搬进本门（分叉即红，不放任两份规则各自演化）──
const wsrc = fs.readFileSync(MERGE_SRC, "utf8");
const grabFn = (header) => {
  const i = wsrc.indexOf(header);
  if (i < 0) {
    fail(`${rel(MERGE_SRC)}:1 找不到 ${header} —— writer 规则已改名/搬迁，本门必须同步改口径`);
    return null;
  }
  let depth = 0;
  for (let k = wsrc.indexOf("{", i); k < wsrc.length; k++) {
    if (wsrc[k] === "{") depth++;
    else if (wsrc[k] === "}") {
      depth--;
      if (depth === 0) return wsrc.slice(i, k + 1);
    }
  }
  fail(`${rel(MERGE_SRC)}:1 ${header} 大括号未配平，取不出函数体`);
  return null;
};
const normSegLit = /const normSeg = (\(s\) => [^\n]*?);/.exec(wsrc);
const rootSegLit = /const ROOT_SEGMENTS = (\d+);/.exec(wsrc);
if (!normSegLit || !rootSegLit) {
  fail(`${rel(MERGE_SRC)}:1 取不出 normSeg / ROOT_SEGMENTS，本门钉的就是这两个锚`);
}
const INDEX_LINE = "if (ownsPackage(e, p)) attestPackage(roots, e.id, p);";
if (!wsrc.includes(INDEX_LINE)) {
  fail(`${rel(MERGE_SRC)}:1 凭证索引行「${INDEX_LINE}」已不在 buildRootOwnerIndex 里，本门的索引构建失去同源保证`);
}
const parts = normSegLit && rootSegLit ? [
  `const normSeg = ${normSegLit[1]};`,
  `const ROOT_SEGMENTS = ${rootSegLit[1]};`,
  grabFn("function ownsPackage(entry, pkg)"),
  grabFn("function packageRoot(pkg)"),
  grabFn("function foreignPackages(entry, packages, rootOwners)"),
  "return { ownsPackage, packageRoot, foreignPackages };",
] : [];
const rule = parts.length && !parts.some((p) => p === null) ? new Function(parts.join("\n"))() : null;
if (!rule) {
  console.error(`assert-lib-ownership(G1): 抽不出 writer 归属规则，无法继续（${failures.length} 项）`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}

let LIBRARY_CATALOG;
/** 与 MC_SKILL_LIB_OWN_WRITER_SRC 同形态：A6 只看 catalog，不给覆盖口就永远只能对现值跑，投毒打不到它。 */
const CATALOG_SRC = process.env.MC_SKILL_LIB_OWN_CATALOG_SRC
  ? path.resolve(process.env.MC_SKILL_LIB_OWN_CATALOG_SRC)
  : path.join(SERVER_ROOT, "dist", "diagnostics", "library-catalog.js");
try {
  ({ LIBRARY_CATALOG } = await import(pathToFileURL(CATALOG_SRC).href));
} catch {
  console.error(
    "assert-lib-ownership(G1): 缺 dist/diagnostics/library-catalog.js —— 先 `npm run build`" +
      "（catalog 是编译产物，本门读现值，不另 parse .ts）",
  );
  process.exit(1);
}

// ── 凭证表：包根 → 自有条目（与 writer 同规则，全部由 catalog 现值推出）────
const rootOwners = new Map();
const attest = (entryId, pkg) => {
  const r = rule.packageRoot(pkg);
  if (!rootOwners.has(r)) rootOwners.set(r, new Set());
  rootOwners.get(r).add(entryId);
};
const vaStats = { keys: 0, badVerifiedAt: 0, badList: [] };
for (const e of LIBRARY_CATALOG) {
  const sites = new Set();
  for (const [k, v] of Object.entries(e.verifiedApi || {})) {
    vaStats.keys++;
    if (!/^\d{4}-\d{2}$/.test(String(v?.verifiedAt || ""))) {
      vaStats.badVerifiedAt++;
      if (vaStats.badList.length < 5) vaStats.badList.push(`${e.id}/${k}`);
    }
    for (const p of Array.isArray(v?.packages) ? v.packages : []) if (typeof p === "string" && p) sites.add(p);
  }
  for (const p of sites) if (rule.ownsPackage(e, p)) attest(e.id, p);
}
const byKey = new Map();
for (const e of LIBRARY_CATALOG) {
  for (const k of [e.modrinthSlug, ...(e.modIds || [])]) if (k && !byKey.has(k)) byKey.set(k, e);
}
const entryFor = (sum) => byKey.get(sum.id) || byKey.get(sum.slug) || byKey.get(sum.modId);

// ── A1–A4：逐摘要扫描 ──────────────────────────────────────────────────────
const files = fs.readdirSync(SUM_DIR).filter((f) => f.endsWith(".json")).sort();
const stats = {
  classes: 0,
  foreignTotal: 0,
  foreignFiles: new Map(),
  foreignRoots: new Map(),
  dirsToSlugs: new Map(),
  unknownModFiles: [],
  unknownVersionKeyFiles: [],
};
for (const file of files) {
  const abs = path.join(SUM_DIR, file);
  let j;
  try {
    j = JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch (err) {
    fail(`${rel(abs)}:1 摘要不是合法 JSON（${err.message}）`);
    continue;
  }
  const entry = entryFor(j);
  if (!entry) {
    fail(`${rel(abs)}:1 连不上 catalog 条目（id=${j.id} slug=${j.slug} modId=${j.modId}）⇒ 归属检查对它整体失效`);
    continue;
  }
  if (!Array.isArray(j.source?.dirs)) {
    fail(`${rel(abs)}:1 source.dirs 缺失或非数组，反编译输出身份无从核对`);
  } else if (!j.source.dirs.length) {
    fail(`${rel(abs)}:1 source.dirs 为空 = 身份不可解却仍出了摘要`);
  }
  const here = [];
  for (const [vk, leaf] of Object.entries(j.versions || {})) {
    if (vk === "unknown") stats.unknownVersionKeyFiles.push(file);
    for (const cls of leaf?.classes || []) {
      stats.classes++;
      const root = rule.packageRoot(cls);
      if (rule.ownsPackage(entry, root)) continue;
      const owners = rootOwners.get(root);
      if (owners && [...owners].some((o) => o !== entry.id)) {
        here.push({ cls, root, owner: [...owners].filter((o) => o !== entry.id).join("|") });
      }
    }
  }
  if (here.length) {
    stats.foreignTotal += here.length;
    stats.foreignFiles.set(file, here.length);
    for (const h of here) stats.foreignRoots.set(h.root, h.owner);
    const allow = DEBT_FOREIGN[file];
    if (allow === undefined) {
      fail(
        `${rel(abs)}: 冒领 ${here.length} 个他方类（首个 ${here[0].cls} → 真主 ${here[0].owner}）。` +
          "该文件不在存量台账里 = 新增污染，根因通常是反编译输出目录坍缩（修法在取件端，不是在这里删类名）",
      );
    } else if (allow !== here.length) {
      fail(`${rel(abs)}: 冒领 ${here.length} 个 ≠ 存量台账 ${allow} 个（回潮或换了包根都要重新点名复核：${here[0].cls} → ${here[0].owner}）`);
    }
  }
  for (const d of j.source?.dirs || []) {
    if (d === "unknown-mod") stats.unknownModFiles.push(file);
    if (!stats.dirsToSlugs.has(d)) stats.dirsToSlugs.set(d, new Set());
    stats.dirsToSlugs.get(d).add(j.slug || file);
  }
}
// 存量之外的 unknown-mod / 共用目录 / unknown 版本键一律视为新污染
for (const file of stats.unknownModFiles) {
  if (!DEBT_UNKNOWN_MOD_DIRS.includes(file)) {
    fail(`${rel(path.join(SUM_DIR, file))}:1 source.dirs 含 unknown-mod 且不在存量台账 —— 解不出 modId 必须失败，不许落进公共目录`);
  }
}
for (const file of stats.unknownVersionKeyFiles) {
  if (!DEBT_UNKNOWN_VERSION_KEYS.includes(file)) {
    fail(`${rel(path.join(SUM_DIR, file))}:1 versions 出现字面量键 "unknown" 且不在存量台账（坍缩的第二症状）`);
  }
}
for (const [d, slugs] of stats.dirsToSlugs) {
  const allow = DEBT_SHARED_DIRS[d];
  if (slugs.size > 1 && (allow === undefined || allow !== slugs.size)) {
    fail(`反编译输出目录「${d}」被 ${slugs.size} 个 slug 共用（${[...slugs].sort().join(", ")}），存量台账为 ${allow ?? "无该项"} ⇒ 同一棵产物被多方冒领`);
  }
}

// ── A6：catalog 每个包都要被分类（模型的 import 直接抄这里，F113 的最后一跳）──
// 判据不是「foreign 计数 = 0」，而是：own 由规则当场复核；非 own 必须有标签；
// bundled 必须带「外壳自己声明的捆绑件」证据；剩下的只能落 unresolved —— 只有 unresolved 才是债。
const catalogForeign = []; // unresolved 且不在台账 ⇒ 新增脏行
const catalogForeignAll = []; // 全部 unresolved 行（drain 对账用）
const tagProblems = [];
for (const e of LIBRARY_CATALOG) {
  for (const [k, v] of Object.entries(e.verifiedApi || {})) {
    const tags = v?.packageOwnership ?? {};
    for (const p of Array.isArray(v?.packages) ? v.packages : []) {
      if (typeof p !== "string" || !p) continue;
      const owned = rule.ownsPackage(e, p);
      const t = tags[p];
      const row = `${e.id}|${k}|${p}`;
      // own 不强制存标签（规则可当场推出，强推只会逼一次全量改写却不增加任何检出力）；
      // 非 own 没标签 = 说不清来源，按最保守的 unresolved 处理，并单独报缺标签。
      if (!owned && (!t || typeof t.ownership !== "string") && !DEBT_CATALOG_FOREIGN.includes(row)) {
        const owners2 = rootOwners.get(rule.packageRoot(p));
        if (owners2 && [...owners2].some((o) => o !== e.id)) {
          tagProblems.push(`${row} 缺 packageOwnership 标签（该包根由他条目证实，却不写来源 = 下一次并入就是冒领）`);
        }
      }
      if (t && typeof t.ownership === "string") {
        if (t.ownership === "own") {
          if (!owned) tagProblems.push(`${row} 标 own，但 modId 不在包路径里（冒标）`);
        } else if (t.ownership === "bundled") {
          if (typeof t.evidence !== "string" || !t.evidence || t.evidence === "none") {
            tagProblems.push(`${row} 标 bundled 但无证据 ⇒ 捆绑必须来自 jar 自己的声明，不是包名猜测`);
          }
        } else if (t.ownership !== "unresolved") {
          tagProblems.push(`${row} 的 ownership=「${t.ownership}」不在 own|bundled|unresolved 之内`);
        }
      }
      const isUnresolved = owned ? false : t ? t.ownership === "unresolved" : true;
      if (!isUnresolved) continue;
      // 「own = 包路径含 modId 段」单独用作债务判据会淹没真信号：实测 catalog 里有 866 行
      // 按该定义不是 own（GeckoLib 的真身就是 software.bernie、KubeJS 是 dev.latvian.mods，
      // 库名压根不在包里），把它们一律记成债会把 8 行真冒领冲掉。
      // 因此债务只算「该包根确由别条目证实自有」的那一类 —— 那才是 F113 的实际伤害。
      const owners = rootOwners.get(rule.packageRoot(p));
      if (!owners || ![...owners].some((o) => o !== e.id)) continue;
      catalogForeignAll.push(row);
      if (!DEBT_CATALOG_FOREIGN.includes(row)) catalogForeign.push(row);
    }
  }
}
if (catalogForeign.length) {
  fail(
    `catalog 冒领他方包根 ${catalogForeign.length} 行（unresolved：既不含本库 modId 段、也无捆绑声明证据）：\n  ` +
      catalogForeign.sort().join("\n  "),
  );
}
if (tagProblems.length) {
  fail(
    `catalog 归属标签不合规 ${tagProblems.length} 处（非 own 要有标签、bundled 要带证据、own 要能复核）：\n  ` +
      tagProblems.sort().slice(0, 12).join("\n  ") +
      (tagProblems.length > 12 ? `\n  …（另有 ${tagProblems.length - 12} 处）` : ""),
  );
}

// ── B. 台账层（只跑真数据根）──────────────────────────────────────────────
if (!TEST_ROOT) {
  const cmp = (label, got, want) => {
    if (got !== want) fail(`台账: ${label} = ${JSON.stringify(got)}，应为 ${JSON.stringify(want)}（数据面变了要显式改本门台账）`);
  };
  cmp("摘要份数", files.length, LEDGER.summaries);
  cmp("类名合计", stats.classes, LEDGER.classes);
  cmp("catalog 条目", LIBRARY_CATALOG.length, LEDGER.catalogEntries);
  cmp("已证实包根", rootOwners.size, LEDGER.attestedRoots);
  cmp("一包根多主", [...rootOwners].filter(([, s]) => s.size > 1).length, LEDGER.multiOwnerRoots);
  cmp("verifiedApi 组", vaStats.keys, LEDGER.verifiedApiKeys);
  cmp("verifiedAt 不合规组", vaStats.badVerifiedAt, LEDGER.badVerifiedAt);
  cmp("冒领类名合计", stats.foreignTotal, LEDGER.foreignTotal);
  cmp("冒领文件数", stats.foreignFiles.size, LEDGER.foreignFiles);
  cmp("冒领分布", sortedJson(Object.fromEntries(stats.foreignFiles)), sortedJson(DEBT_FOREIGN));
  cmp("冒领包根→真主", sortedJson(Object.fromEntries(stats.foreignRoots)), sortedJson(DEBT_FOREIGN_ROOTS));
  cmp("source.dirs=unknown-mod", stats.unknownModFiles.sort().join(","), DEBT_UNKNOWN_MOD_DIRS.join(","));
  cmp("版本键 unknown", stats.unknownVersionKeyFiles.sort().join(","), DEBT_UNKNOWN_VERSION_KEYS.join(","));
  cmp(
    "共用目录",
    sortedJson(Object.fromEntries([...stats.dirsToSlugs].filter(([, s]) => s.size > 1).map(([d, s]) => [d, s.size]))),
    sortedJson(DEBT_SHARED_DIRS),
  );
  // A6 的 drain 检查：只罚「新增行」的话，修好的行会把台账条目留在原地，谁也证明不了债已清。
  // 两边取集合差 ⇒ 清一行就必须显式删一行台账（KfF 那 8 行等的是 jarjar 身份那条修，修完这里会自动逼你收尾）。
  cmp("catalog 冒领行集", sortedJson(Object.fromEntries([...new Set(catalogForeignAll)].sort().map((r) => [r, 1]))),
    sortedJson(Object.fromEntries([...DEBT_CATALOG_FOREIGN].sort().map((r) => [r, 1]))));
}

const summary = {
  root: rel(SUM_DIR),
  summaries: files.length,
  classes: stats.classes,
  foreign: stats.foreignTotal,
  attestedRoots: rootOwners.size,
  ledger: TEST_ROOT ? "skipped(test-root)" : "checked",
};
if (failures.length) {
  console.error(`assert-lib-ownership(G1): ${failures.length} 项不通过 ${JSON.stringify(summary)}`);
  for (const f of failures.slice(0, 25)) console.error(`  ✗ ${f}`);
  if (failures.length > 25) console.error(`  …另有 ${failures.length - 25} 项`);
  process.exit(1);
}
console.log(
  `  assert-lib-ownership(G1): ${summary.summaries} 份摘要 · ${summary.classes} 类 · 冒领 ${summary.foreign}（全在存量台账内）· ` +
    `已证实包根 ${summary.attestedRoots} · 台账 ${summary.ledger}`,
);
