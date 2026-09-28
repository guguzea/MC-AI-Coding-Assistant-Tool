#!/usr/bin/env node
/**
 * L76② 门：`query_registry` 的取件窗修法 + limit schema 钳制（立案见 CONTRIBUTING L76，落地登记在 L81）
 *
 * 判什么（四条腿，全部真跑 dist/cli.js 与生产函数，不自写解析器）：
 *  A 钳制：limit=0 / -5 / 2.7 / 1000 必须在入口被拒（errorKind=validation + 机读 fieldErrors.code）。
 *    修前实测：limit=0 ⇒ found:false + NOT_FOUND（池真有 222 条，纯假否定）；-5 ⇒ 比默认档多回；2.7 静默截；1e9 全池。
 *  B 披露：载荷必带 totalMatches / truncated，且 totalMatches 与**另一把尺子**（node:sqlite 现算的
 *    同条件 union COUNT）相等 —— 不许拿生产自述当自证。
 *  C 序 + 甲′：默认档 top-N 必须与 limit=200 的前 N **逐位相同**（修前 query=block 错位 20/25）。
 *  D 正控：查不到的串 ⇒ totalMatches=0 且 found:false（防 B/C 腿在空集上 vacuous 通过）。
 *
 * --selftest：喂合成载荷给判据函数，证明四条腿都能红（含一条全绿正控）。
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), ".."); // mcp-server/
const CLI = join(ROOT, "dist", "cli.js");
const DATA = process.env.MC_SKILL_DATA ?? join(ROOT, "..", "data");
const VERSION = "1.20.1";

function cli(tool, args) {
  try {
    const out = execFileSync(process.execPath, [CLI, tool, ...args], { encoding: "utf8", maxBuffer: 1 << 26, cwd: ROOT });
    return JSON.parse(out.slice(out.indexOf("{")));
  } catch (e) {
    /**
     * 校验类失败会让 CLI 以非 0 退出 ⇒ execFileSync 抛错，载荷在 e.stdout。
     * 先只解析 stdout（CLI 还会往 stderr 打告警行，拼起来就破坏 JSON 尾部），
     * 解析不动才退回拼接串；两级都不行才算「没跑起来」，不得当作「拒绝」放行。
     */
    for (const s of [String(e.stdout ?? ""), String(e.stdout ?? "") + String(e.stderr ?? "")]) {
      const i = s.indexOf("{");
      if (i < 0) continue;
      try {
        return JSON.parse(s.slice(i));
      } catch {
        /* 试下一级 */
      }
    }
    const s = String(e.stdout ?? "") + String(e.stderr ?? "");
    return { __spawnFail: s.split("\n").filter(Boolean)[0]?.slice(0, 90) ?? String(e.message).slice(0, 90) };
  }
}
const payload = (j) => j.result ?? j;
const keyOf = (m) => `${m.registry}:${m.id}`;

/** A 腿判据：坏 limit 必须被入口拒绝，且机读码在册 */
export function checkClamp(rows) {
  const errors = [];
  const expect = { "--limit=0": "TOO_SMALL", "--limit=-5": "TOO_SMALL", "--limit=2.7": "INVALID_TYPE", "--limit=1000": "TOO_BIG" };
  for (const [flag, code] of Object.entries(expect)) {
    const j = rows[flag];
    if (j?.__spawnFail) {
      errors.push(`钳制 ${flag}：CLI 没跑起来（${j.__spawnFail}）`);
      continue;
    }
    if (j.success !== false) {
      errors.push(`钳制 ${flag}：应当入口拒绝，实际 success≠false（载荷键=${Object.keys(payload(j)).join(",")}）⇒ 又回到「limit=0 报 found:false」那类假否定`);
      continue;
    }
    if (j.errorKind !== "validation") errors.push(`钳制 ${flag}：errorKind=${j.errorKind ?? "缺位"}，期望 validation`);
    const fe = (j.fieldErrors ?? [])[0] ?? {};
    if (fe.field !== "limit") errors.push(`钳制 ${flag}：fieldErrors 没点名 limit（实际 ${fe.field ?? "缺位"}）`);
    if (fe.code !== code) errors.push(`钳制 ${flag}：机读码 ${fe.code ?? "缺位"}，期望 ${code}`);
  }
  return { ok: errors.length === 0, errors, judged: Object.keys(expect).length };
}

/** B 腿判据：披露位存在 + 与独立 SQL 计数相等 + 与 matches.length 自洽 */
export function checkDisclosure(r, sqlCount) {
  const errors = [];
  const rows = r.matches ?? [];
  if (typeof r.totalMatches !== "number") errors.push(`载荷缺 totalMatches（键=${Object.keys(r).join(",")}）⇒ 消费方又只能把窗口当池读`);
  if (typeof r.truncated !== "boolean") errors.push("载荷缺 truncated（必须显式 true/false，缺位=未判）");
  if (typeof r.totalMatches === "number" && typeof sqlCount === "number" && r.totalMatches !== sqlCount) {
    errors.push(`totalMatches=${r.totalMatches} ≠ 独立 SQL 同条件计数 ${sqlCount} ⇒ 计数位与真池不符`);
  }
  if (typeof r.totalMatches === "number" && r.truncated !== rows.length < r.totalMatches) {
    errors.push(`truncated=${r.truncated} 与 ${rows.length}<${r.totalMatches} 不符`);
  }
  return { ok: errors.length === 0, errors };
}

/** C 腿判据：默认 top-N 与放大档前 N 逐位相同（甲′ 的强化形 = 序没被窗劫持） */
export function checkPrefix(def, big) {
  const a = (def.matches ?? []).map(keyOf);
  const b = (big.matches ?? []).map(keyOf);
  const n = Math.min(a.length, b.length);
  const errors = [];
  if (n === 0) return { ok: false, errors: ["两档都 0 条 ⇒ 判据未跑，禁止当合格"] };
  let firstDiff = -1;
  for (let i = 0; i < n; i++) if (a[i] !== b[i]) { firstDiff = i; break; }
  if (firstDiff >= 0) errors.push(`query=${def.query ?? "?"} 第 ${firstDiff + 1} 位起错位：默认档 ${a[firstDiff]} vs 放大档 ${b[firstDiff]} ⇒ 排序又被取件窗劫持`);
  return { ok: errors.length === 0, errors, compared: n };
}

/** D 腿判据：空结果必须报 totalMatches=0 + found:false（防 A/B/C 在空集上假绿） */
export function checkNegativeControl(r) {
  const errors = [];
  if (r.found !== false) errors.push("空集正控 found 应为 false");
  if (r.totalMatches !== 0) errors.push(`空集正控 totalMatches=${r.totalMatches ?? "缺位"}，期望 0`);
  return { ok: errors.length === 0, errors };
}

async function independentCount(query) {
  const { openDatabaseSync } = await import(pathToFileURL(join(ROOT, "dist", "utils", "sqlite-runtime.js")).href);
  const path = join(DATA, `vanilla_${VERSION}`, "registries", "registry-index.sqlite");
  if (!existsSync(path)) return undefined;
  const db = openDatabaseSync(path, { readOnly: true });
  try {
    const q = query.trim().toLowerCase();
    const like = `%${q.replace(/%/g, "").replace(/_/g, "\\_")}%`;
    const exactNs = q.includes(":") ? q : `minecraft:${q}`;
    const row = db
      .prepare(
        `SELECT COUNT(*) AS c FROM entries
         WHERE (LOWER(id) = ? OR LOWER(id) = ?)
            OR (LOWER(id) LIKE ? ESCAPE '\\' OR LOWER(COALESCE(translation_key,'')) LIKE ? ESCAPE '\\')`,
      )
      .get(q, exactNs, like, like);
    return row?.c;
  } finally {
    db.close();
  }
}

/**
 * argv 白名单（2026-09-27 用户裁定「做」）：本门原先只判 `--selftest`，其余 argv 一律忽略 ⇒
 * 给它传一个不存在的 `--census` 时它不报错、直接又跑了一遍真跑（实测）。旗标打错必须响，
 * 不得「替用户做一件它以为你想做的事」—— 与本轮主题同型：披露位与实际行为不符。
 */
export function parseFlags(argv) {
  const KNOWN = new Set(["--selftest"]);
  return { selftest: argv.includes("--selftest"), unknown: argv.filter((a) => typeof a === "string" && a.startsWith("-") && !KNOWN.has(a)) };
}

async function realRun() {
  const errors = [];
  if (!existsSync(CLI)) return [`dist/cli.js 不在 ⇒ 先 npm run build（${CLI}）`];
  const clampRows = {};
  for (const flag of ["--limit=0", "--limit=-5", "--limit=2.7", "--limit=1000"]) {
    clampRows[flag] = cli("query_registry", ["--query=stone", "--version=1.20.1", flag]);
  }
  const a = checkClamp(clampRows);
  if (!a.ok) errors.push(...a.errors);

  const def = payload(cli("query_registry", ["--query=block", "--version=1.20.1"]));
  // C 腿的参照物：--limit=200 是本面 schema 的**接受面上界**（不是给用户挑档位用的旋钮），
  // 取它当「全池前 N」参照是因为 L76② 之后取件窗=整批（1.20.1 entries 全表 3963 < REGISTRY_FULL_POOL_CAP=20000）。
  // ⚠️ 谁改 .max(200) 必须同改本腿与 :150 那条，且**新上界必须 ≥ 被查询的真池**，否则本腿比的已经不是全池前 N ⇒ 假绿。
  const big = payload(cli("query_registry", ["--query=block", "--version=1.20.1", "--limit=200"]));
  const sqlCount = await independentCount("block");
  const b = checkDisclosure(def, sqlCount);
  if (!b.ok) errors.push(...b.errors);
  const c = checkPrefix(def, { ...big, query: "block" });
  if (!c.ok) errors.push(...c.errors);
  const c2 = checkPrefix(
    payload(cli("query_registry", ["--query=minecraft", "--version=1.20.1"])),
    payload(cli("query_registry", ["--query=minecraft", "--version=1.20.1", "--limit=200"])),
  );
  if (!c2.ok) errors.push(...c2.errors);

  const neg = payload(cli("query_registry", ["--query=zzqqxx-nonexistent", "--version=1.20.1"]));
  const d = checkNegativeControl(neg);
  if (!d.ok) errors.push(...d.errors);

  console.log(
    `  真跑：钳制 ${a.judged}/4 档全拒 ✓ · query=block 默认 n=${(def.matches ?? []).length} totalMatches=${def.totalMatches}（独立 SQL=${sqlCount}）truncated=${def.truncated} ` +
      `· 前缀比对 ${c.compared} 位 ✓ · minecraft 前缀 ${c2.compared} 位 ✓ · 空集正控 totalMatches=${neg.totalMatches} ✓`,
  );
  return errors;
}

function selfTest() {
  const cases = [];
  const good = { found: true, matches: [{ registry: "blocks", id: "minecraft:stone" }], totalMatches: 222, truncated: true };
  cases.push(["正控：披露齐全 ⇒ 应绿", checkDisclosure(good, 222).ok === true]);
  cases.push(["投毒①：摘掉 totalMatches ⇒ 应红", checkDisclosure({ ...good, totalMatches: undefined }, 222).ok === false]);
  cases.push(["投毒②：totalMatches 报成窗口条数（25）⇒ 应红", checkDisclosure({ ...good, totalMatches: 1, truncated: false }, 222).ok === false]);
  cases.push(["投毒③：truncated 与实数不符 ⇒ 应红", checkDisclosure({ ...good, truncated: false }, 222).ok === false]);
  const pre = { matches: [{ registry: "blocks", id: "a" }, { registry: "blocks", id: "b" }] };
  const post = { matches: [{ registry: "blocks", id: "a" }, { registry: "blocks", id: "z" }] };
  cases.push(["正控：两档前缀一致 ⇒ 应绿", checkPrefix(pre, pre).ok === true]);
  cases.push(["投毒④：第 2 位被窗劫持 ⇒ 应红", checkPrefix(pre, post).ok === false]);
  cases.push(["投毒⑤：两档全空（判据没跑）⇒ 应红", checkPrefix({ matches: [] }, { matches: [] }).ok === false]);
  cases.push(["正控：空集负判据齐 ⇒ 应绿", checkNegativeControl({ found: false, totalMatches: 0 }).ok === true]);
  cases.push(["投毒⑥：空集却报 totalMatches=5 ⇒ 应红", checkNegativeControl({ found: false, totalMatches: 5 }).ok === false]);
  cases.push([
    "投毒⑦：坏 limit 被放行（success 不为 false）⇒ 应红",
    checkClamp({
      "--limit=0": { success: true, result: { found: false, matches: [] } },
      "--limit=-5": { success: false, errorKind: "validation", fieldErrors: [{ field: "limit", code: "TOO_SMALL" }] },
      "--limit=2.7": { success: false, errorKind: "validation", fieldErrors: [{ field: "limit", code: "INVALID_TYPE" }] },
      "--limit=1000": { success: false, errorKind: "validation", fieldErrors: [{ field: "limit", code: "TOO_BIG" }] },
    }).ok === false,
  ]);
  cases.push([
    "正控：四档各归其码 ⇒ 应绿",
    checkClamp({
      "--limit=0": { success: false, errorKind: "validation", fieldErrors: [{ field: "limit", code: "TOO_SMALL" }] },
      "--limit=-5": { success: false, errorKind: "validation", fieldErrors: [{ field: "limit", code: "TOO_SMALL" }] },
      "--limit=2.7": { success: false, errorKind: "validation", fieldErrors: [{ field: "limit", code: "INVALID_TYPE" }] },
      "--limit=1000": { success: false, errorKind: "validation", fieldErrors: [{ field: "limit", code: "TOO_BIG" }] },
    }).ok === true,
  ]);
  let bad = 0;
  for (const [label, pass] of cases) {
    console.log(`  ${pass ? "✓" : "✗"} ${label}`);
    if (!pass) bad++;
  }
  cases.push(["正控：旗标解析认 --selftest ⇒ 绿", parseFlags(["--selftest"]).selftest === true && parseFlags(["--selftest"]).unknown.length === 0]);
  cases.push(["投毒：不认识的旗标必须进 unknown（不得静默走默认模式）", parseFlags(["--census"]).unknown.join(",") === "--census"]);
  // 正控/投毒的分母按标签现数，不写死 —— 本门自己的「披露位 ≠ 实测量」教训不能在自己尾巴上复发。
  const pos = cases.filter(([l]) => l.startsWith("正控")).length;
  console.log(`自检 ${cases.length - bad}/${cases.length} 通过（${pos} 正控 + ${cases.length - pos} 投毒，分母现数）`);
  return bad;
}

const flags = parseFlags(process.argv.slice(2));
if (flags.unknown.length) {
  console.error(`FAIL：本门只认 --selftest，收到不认识的旗标 ⇒ 拒绝执行（不猜你想干什么）：${flags.unknown.join(" ")}`);
  process.exit(1);
}
if (flags.selftest) {
  const bad = selfTest();
  process.exit(bad ? 1 : 0);
}
const errors = await realRun();
if (errors.length) {
  console.error("FAIL：query_registry 取件窗/钳制/披露回归\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log("OK：limit 钳制在入口、披露与独立计数相符、默认序不再被字母窗劫持");
