import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

// 机械护栏：状态文件里引用的每个 scratch 产物必须真在盘上。
// 用法：node mcp-server/docs/evidence/anchor-lint.mjs [被检文件 ...]
const dir = dirname(fileURLToPath(import.meta.url));
const state = join(dir, "PLAN-STATE-r2.md");
const targets = process.argv.length > 2 ? process.argv.slice(2) : [state];

const RE =
  /(?:temp\/ralph-20260922\/)?((?:anchor|round|verify|scout|evidence)-[A-Za-z0-9._-]+\.(?:md|log|json|txt)|_?r[0-9]+-[A-Za-z0-9._-]+\.(?:log|md|json|txt|mjs)|_[A-Za-z0-9._-]+-probe\.(?:mjs|log))/g;

// 第二类：任何**显式写出**的 `temp/ralph-20260922/<路径>.<ext>`。上面那套词表只认
// anchor|round|verify|scout|evidence|rNN-|_rN-|*-probe 这些形状，自取名（curated-ids.txt 之类）
// 会从缝里漏掉 —— 第 9 轮回报的聊天侧就出现过一次这种引用。显式路径没有词表问题。
const PATH_RE =
  /temp\/ralph-20260922\/([A-Za-z0-9._\/-]+?\.(?:md|log|json|txt|mjs|csv|sqlite|ya?ml|bak))/g;

// 豁免只走显式清单（词级推断会连带放过同行真实引用，实测把 28 项引用误放到 19）：
// `_lint-exempt.txt` 每行一个名字，`#` 开头为注释；豁免必须写理由，否则等于没有护栏。
const exemptFile = join(dir, "_lint-exempt.txt");
const exempt = new Map();
if (existsSync(exemptFile)) {
  for (const l of readFileSync(exemptFile, "utf8").split("\n")) {
    const t = l.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("#");
    exempt.set(i > 0 ? t.slice(0, i).trim() : t, i > 0 ? t.slice(i + 1).trim() : "(未写理由)");
  }
}

let checked = 0;
const hits = new Set();
const missing = [];
for (const t of targets) {
  if (!existsSync(t)) {
    console.log("TARGET MISSING: " + t);
    process.exit(2);
  }
  const s = readFileSync(t, "utf8");
  for (const line of s.split("\n")) {
    for (const m of line.matchAll(RE)) {
      const name = m[1];
      if (/\{\{|<|\.\.\./.test(name)) continue;
      checked++;
      // 裸名分支的落点：scratch 目录、它的 logs/ 子目录，以及 evidence-* 这类**正文证据件**实际住的
      // `mcp-server/docs/`。漏掉后者会把「引用写了 mcp-server/docs/evidence-x.md」误报成 MISSING，
      // 因为 RE 只捕获 basename。局限照旧：这四处之外若真有同名件，本 lint 认不出「引错了目录」。
      const roots = [dir, join(dir, "logs"), join(dir, "..", "..", "mcp-server", "docs"), join(dir, "..", "..")];
      const cands = roots.map((r) => join(r, name));
      const p = cands.find((c) => existsSync(c)) ?? cands[0];
      if (existsSync(p) && statSync(p).size > 0) continue;
      if (exempt.has(name)) {
        hits.add(name);
        continue;
      }
      missing.push(name + "  (被引用于 " + basename(t) + (existsSync(p) ? "，0 字节空产物" : "") + ")");
    }
    for (const m of line.matchAll(PATH_RE)) {
      const rel = m[1];
      if (/\{\{|<|\.\.\./.test(rel)) continue;
      checked++;
      const p = join(dir, rel);
      if (existsSync(p) && statSync(p).size > 0) continue;
      if (exempt.has(rel)) {
        hits.add(rel);
        continue;
      }
      missing.push(rel + "  (显式路径引用于 " + basename(t) + (existsSync(p) ? "，0 字节空产物" : "") + ")");
    }
  }
}
// 第三类：**story id 合法性**。前两类别只核「文件在不在盘上」，可我自己造过一个计划里根本没有的
// story 号（S28，被 R89/R109/R111/R115/R116 抄了 5 次）—— 假产物名会被 PATH_RE 抓到，**假任务号不会**。
// 判据：台账里出现的每个 `S<数字>` 必须在 `temp/plan-20260921-fix.json` 的 stories[].id 集合里。
// `§S4` 这类是 harness **小节号**（test-scripts/test-core 的段名），与 story 不是一个 namespace ⇒ 跳过。
const PLAN_RE = /\bS(\d+)\b/g;
let storyIds = null;
const planPath = join(dir, "..", "plan-20260921-fix.json");
if (existsSync(planPath)) {
  try {
    const p = JSON.parse(readFileSync(planPath, "utf8"));
    storyIds = new Set((p.stories || []).map((s) => String(s.id).toUpperCase()));
  } catch { storyIds = null; }
}
const badStory = new Set();
if (storyIds && storyIds.size) {
  for (const t of targets) {
    const s = readFileSync(t, "utf8");
    for (const line of s.split("\n")) {
      for (const m of line.matchAll(PLAN_RE)) {
        if (line[(m.index ?? 0) - 1] === "§") continue;   // harness 小节号，非 story
        const id = "S" + m[1];
        if (!storyIds.has(id) && !exempt.has(id)) badStory.add(id);
        else if (!storyIds.has(id)) hits.add(id);
      }
    }
  }
  for (const b of [...badStory].sort((a, x) => Number(a.slice(1)) - Number(x.slice(1)))) {
    missing.push("FAKE-STORY-ID " + b + "（计划共 " + storyIds.size + " 个 id：" + [...storyIds].join(" ") + "）");
  }
} else {
  // fail-closed：计划读不到就**必须红** —— 否则「storyIds 为 null ⇒ 整类静默不判」正是我给自己记过
  // 的那类伪门（缺前提时放行）。投毒证明见 R117③：把 plan 改名后这一行必红、rc=1。
  missing.push("PLAN_UNREADABLE 读不到 " + planPath + " ⇒ story-id 判据没有判面，按红处理");
}

const uniq = [...new Set(missing)];
const unused = [...exempt.keys()].filter((k) => !hits.has(k));
console.log("lint: 引用名 " + checked + " 个（去重后缺失 " + uniq.length + "）· 豁免清单 " + exempt.size + " 条（本跑命中 " + hits.size + "）");
for (const u of uniq) console.log("  MISSING " + u);
for (const u of unused) console.log("  豁免未命中（清单该清）：" + u + "  理由=" + exempt.get(u));
if (checked === 0) {
  console.log("  [FLOOR-COLLECTOR] 引用名采到 0 —— 是采集器失效，不是真的没有引用");
  process.exit(1);
}
process.exit(uniq.length ? 1 : 0);
