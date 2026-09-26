#!/usr/bin/env node
/**
 * assert-lib-session-resolve-parity.mjs — 库 Skill 的「双链路同答」一致性门（S22 步1，2026-09-24 立门）。
 *
 * 立门缘由（本仓两条链路读同一批 `knowledge/libs` 下的 `SKILL.md`，但各读各的）：
 *   - resolve 链路 = `scripts/resolve-lib-skills.mjs`（`--platform/--version` 与 `--validate`），
 *     :172 解析 `mcVersionsByPlatform`、:217-218 让它**整组替换** `mcVersions`；
 *   - session 链路 = `mcp-server/src/platform-pack/catalog.ts` 的 `listLibSkillIndex()`
 *     （`activate_platform_pack action=session` 吐 `skillBodies` / 库 Skill 索引的那条腿；
 *      本门按编译产物 `mcp-server/dist/platform-pack/catalog.js` 调用它，故同时钉住「改了 src 没 build」。）
 * W0-1（2026-09-19）引入按平台收窄时只改了 resolve 侧 ⇒ session 侧对该键 **0 处**读取，
 * 收窄在 session 链路上静默失效。本门立门前的实测反证（`temp/ralph-20260922/logs/r14-04-pre-fix-baseline.log`）：
 * `(fabric, 1.20.1)` resolve=29 / session=30，差集正是 `mc-caelus`
 * （其 `mcVersionsByPlatform` 把 fabric 窗口收到 `1.16.4-1.17.1`，而 union `mcVersions` 到 1.21.5）。
 *
 * 三条判据（任一不满足即红）
 *   ① 采集面自证：`knowledge/libs 下的 SKILL.md` 实扫数必须 > 0，且**声明了 `mcVersionsByPlatform`
 *      的份数**必须 > 0 —— 该键没人写时本门是装饰，必须当场红，不得静默绿（R47）。
 *   ② 双链路同答：COMBOS 里每个 `(platform, version)`，resolve 侧 skillId 集合与 session 侧
 *      库索引 name 集合必须**逐元素相等**（差集双向都算红）。
 *      COMBOS 覆盖 `(quilt, 1.21.1)`（该档无 QSL 正式版构件，是「库面按平台收窄」最吃紧的档）
 *      与 `(quilt, 1.20.1)`（有 QSL 正式版构件），二者是真实分歧面，缺一即判据变薄。
 *   ③ 编译面新鲜度：session 侧读的是 `dist/`（不是 `src/`），故必须核 dist 不比 src 旧，
 *      否则「改了 catalog.ts 不 build」会让本门核到旧行为却报绿（同族先例：
 *      `assert-bedrock-genre-demote.mjs` 的 dist 腿）。
 *
 * 下界地板（只用 `<`，禁止等式棘轮；数值由 2026-09-24 实扫得出并注明口径）：
 *   `SKILL.md` 份数 < 30 → 红；带 `mcVersionsByPlatform` 的份数 < 1 → 红；COMBOS < 4 → 红。
 *
 * 用法
 *   node mcp-server/scripts/assert-lib-session-resolve-parity.mjs
 *   node mcp-server/scripts/assert-lib-session-resolve-parity.mjs --selftest   # 纯内存投毒，不写盘
 *
 * 判据⑤（S22 步4，第 33 轮 2026-09-25 纳入）：「SKILL.platforms ↔ library-catalog.loaders ↔
 *   all.json 构件面」三方一致性 —— 口径 = 构建面（2026-09-22 裁定④），**过度声明方向判红**，
 *   欠账方向（构件面有行而某面没点名）与 `platforms`↔`loaders` 直接差集只列 INFO、不进退出码。
 *   `modrinthSlug` 桥落在**解析侧**四档（手填 `SKILL_TO_SLUG` → 生成物 `skillId` → `authored/lib-<名>`
 *   → **构件面正名**，第 35 轮补），未给 36 份 SKILL.md 新增 `modrinthSlug` 键（那要动库面 frontmatter + 7 个宿主镜像，另轮裁定）。
 *   ⚠️ 桥不通 = 该份 `platforms` **一条都不被腿 B 判**，且过去是 `noSlug += 1; continue` 静默跳过
 *   （第 35 轮 `mc-libgui` 案：`platforms`=[fabric,quilt] 而构件面 slug `libgui` 只有 1 行 fabric，
 *    本该判红却因生成物行 `modrinthSlug: ""` 无桥 ⇒ 未进债务表也未进 INFO）。
 *   现由 `bridgeCoverageCheck` 钉住：未通桥**逐名**登记在 `BRIDGE_BLINDSPOTS`，新增未登记 / 登记了却通了 / 条数越界都判红。
 * 仍不覆盖：本门只核「两条链路是否同答」与「三方是否互相打架」，**不**核「答案对不对」——
 *   窗口终点取值由 `mcVersionsByPlatform` + 判据④a/④b 负责；快照本身是否滞后由 `all.json` 的
 *   as-of（2026-09-16）与上游复核（`query_upstream_releases`）负责，本门不得据「快照无该行」断言「上游没有」。
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL, fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const LIBS_ROOT = path.join(ROOT, "knowledge", "libs");
const RESOLVE_SCRIPT = path.join(ROOT, "scripts", "resolve-lib-skills.mjs");
const DIST_CATALOG = path.join(ROOT, "mcp-server", "dist", "platform-pack", "catalog.js");
const SRC_CATALOG = path.join(ROOT, "mcp-server", "src", "platform-pack", "catalog.ts");

/** 判据②的覆盖面。quilt 两档是 story 点名必测；其余三档是既有的 VALIDATE_COMBOS Java 腿（床板对齐）。 */
export const COMBOS = [
  ["quilt", "1.21.1"],
  ["quilt", "1.20.1"],
  ["fabric", "1.20.1"],
  ["fabric", "1.16.5"],
  ["forge", "1.20.1"],
  ["neoforge", "1.20.4"],
];

/** 地板（as-of 2026-09-24 实扫：SKILL.md 36 份 / 带该键 1 份；**第 33 轮复扫 = 带该键 9 份**（S22 步2 的八份平台窗口已落 frontmatter）⇒ 地板仍取 1 不动（只许 `<`，不许等式），但别再按 1 读现状 / COMBOS 6）。只许 `<`，不许等式。 */
export const FLOOR_SKILLS = 30;
export const FLOOR_PLATFORM_SCOPED = 1;
export const FLOOR_COMBOS = 4;

/* ------------------------------- 采集 ------------------------------- */

/** 逐份读 frontmatter：只取本门关心的两件事 —— 声明了哪些平台窗口、union 窗口写了什么。 */
export function collectSkills(libsRoot = LIBS_ROOT) {
  const groups = ["all-platforms", "fabric-only", "neo-only", "forge-only", "bedrock-only"];
  const skills = [];
  for (const g of groups) {
    const dir = path.join(libsRoot, g);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!/^mc-/.test(name)) continue;
      const file = path.join(dir, name, "SKILL.md");
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
      const text = fs.readFileSync(file, "utf8");
      const fm = text.startsWith("---") ? text.slice(3, text.indexOf("\n---", 3)) : "";
      const keyLine = /^mcVersionsByPlatform:\s*(.*)$/m.exec(fm);
      skills.push({
        skillId: name,
        path: path.relative(ROOT, file).replace(/\\/g, "/"),
        platformScoped: Boolean(keyLine && keyLine[1].trim() !== ""),
      });
    }
  }
  return skills;
}

/* ------------------------------ 两条链路 ------------------------------ */

function runResolveChain(platform, version) {
  const r = spawnSync(process.execPath, [RESOLVE_SCRIPT, `--platform=${platform}`, `--version=${version}`], {
    encoding: "utf8",
    windowsHide: true,
    cwd: ROOT,
  });
  if (r.status !== 0) {
    throw new Error(`resolve 链路 rc=${r.status} (${platform},${version})：${String(r.stderr || r.stdout).slice(0, 300)}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(r.stdout);
  } catch {
    throw new Error(`resolve 链路输出不是 JSON (${platform},${version})：${String(r.stdout).slice(0, 200)}`);
  }
  if (!Array.isArray(parsed)) throw new Error(`resolve 链路输出不是数组 (${platform},${version})`);
  return parsed.map((x) => x.skillId).sort();
}

async function runSessionChain(platform, version) {
  if (!fs.existsSync(DIST_CATALOG)) {
    throw new Error(`session 链路缺编译产物 ${path.relative(ROOT, DIST_CATALOG)} —— 先 cd mcp-server && npm run build`);
  }
  const mod = await import(pathToFileURL(DIST_CATALOG).href);
  if (typeof mod.listLibSkillIndex !== "function") {
    throw new Error("dist/platform-pack/catalog.js 未导出 listLibSkillIndex（session 链路入口漂移）");
  }
  return mod.listLibSkillIndex(platform, version, ROOT).map((x) => x.name).sort();
}

/* ------------------------------ 判据（可投毒） ------------------------------ */

/** 双向差集。返回 null = 同答；否则返回可读的差集描述。 */
export function diffSets(label, resolveIds, sessionIds) {
  const onlyResolve = resolveIds.filter((x) => !sessionIds.includes(x));
  const onlySession = sessionIds.filter((x) => !resolveIds.includes(x));
  if (onlyResolve.length === 0 && onlySession.length === 0) return null;
  const parts = [];
  if (onlyResolve.length) parts.push(`仅 resolve 有: ${onlyResolve.join(",")}`);
  if (onlySession.length) parts.push(`仅 session 有: ${onlySession.join(",")}`);
  return `(${label}) resolve=${resolveIds.length} / session=${sessionIds.length} —— ${parts.join(" | ")}`;
}

/** 采集面自证 + 地板（R47）。返回错误数组，空 = 过。 */
export function coverageSelfCheck(skills, combos) {
  const errors = [];
  if (skills.length === 0) {
    errors.push(`COLLECTOR_RETURNED_ZERO：${path.relative(ROOT, LIBS_ROOT)}/**/SKILL.md 实扫 0 份（发现器或路径已失效，本门此刻什么也没在看）`);
  } else if (skills.length < FLOOR_SKILLS) {
    errors.push(`COVERAGE_BELOW_FLOOR：SKILL.md 实扫 ${skills.length} 份 < 地板 ${FLOOR_SKILLS}（地板 as-of 2026-09-24 实扫 36 份）`);
  }
  const scoped = skills.filter((s) => s.platformScoped).length;
  if (scoped < FLOOR_PLATFORM_SCOPED) {
    errors.push(`COVERAGE_BELOW_FLOOR：声明 mcVersionsByPlatform 的源稿 ${scoped} 份 < 地板 ${FLOOR_PLATFORM_SCOPED} ⇒ 判据②在该键上退化成「两边都不读」，本门是装饰`);
  }
  if (combos.length < FLOOR_COMBOS) {
    errors.push(`COVERAGE_BELOW_FLOOR：COMBOS ${combos.length} 组 < 地板 ${FLOOR_COMBOS}（含 quilt 两档？缺即判据变薄）`);
  }
  if (!combos.some(([p]) => p === "quilt")) {
    errors.push("COVERAGE_MISSING_QUILT：COMBOS 里没有 quilt 档 ⇒ S22 的分歧面（1.21.1 无 QSL 正式版 / 1.20.1 有）不再被覆盖");
  }
  return errors;
}

/** dist 不比 src 旧（否则 session 链路核的是旧编译产物）。 */
export function distFreshnessCheck() {
  if (!fs.existsSync(DIST_CATALOG)) return [`DIST_MISSING：${path.relative(ROOT, DIST_CATALOG)} 不存在`];
  if (!fs.existsSync(SRC_CATALOG)) return [`SRC_MISSING：${path.relative(ROOT, SRC_CATALOG)} 不存在（目录漂移）`];
  const src = fs.statSync(SRC_CATALOG).mtimeMs;
  const dist = fs.statSync(DIST_CATALOG).mtimeMs;
  return dist >= src ? [] : [`DIST_STALE：dist/platform-pack/catalog.js (${new Date(dist).toISOString()}) 比 src (${new Date(src).toISOString()}) 旧 ⇒ 改了 src 没 npm run build，本门会核到旧行为`];
}

/* ---------- 判据④（=④a）：库窗口的 release/beta 口径（第 14 轮遗留收口，2026-09-24 主代理裁定）
 *            ④b = 第 16 轮扩面：按 `platforms` 逐 loader 判 —— 有窗口按窗口终点（④a），
 *            没窗口则该 loader 退回 union `mcVersions`，拿 union 上界比其 release 上界。 ---------- */

/**
 * 裁定原文（写入本门的那两条）：
 *   ① `mcVersionsByPlatform` 的**窗口终点一律取该 loader 的 release 构件上界**；
 *      终点只被 beta/alpha 构件支撑 ⇒ 窗口不成立（要么删该 loader 键，要么收到 release 上界）。
 *   ② 同 loader 存在**越界**（> 窗口终点）的 beta/alpha 构件时，该库 SKILL.md **正文**必须有一句
 *      同点名该 loader + `beta`/`alpha` + 越界上界版本号的披露（frontmatter 是机器解析串，不放散文）。
 * 构件面 = `mcp-server/data/lib-manifests/all.json`（本仓 2026-09-16 快照，结构
 * `[{slug, entries:[{gameVersion, loader, versionType, ...}]}]`；**没有 `files` 键**）。
 * 快照口径：某 loader **完全没有 release 行** 且**也没有非 release 行** ⇒ 本仓没抓到，
 * 不据此断言上游没有（计入 skipped，判据不成立），要核上游用 `query_upstream_releases`。
 */
const MANIFEST = path.join(ROOT, "mcp-server", "data", "lib-manifests", "all.json");

/** skill ↔ Modrinth slug 桥（手填；这是 PLAN-STATE-r2.md:107「modrinthSlug 桥落点」未决项在本门内的最小落点）。 */
export const SKILL_TO_SLUG = {
  "mc-playeranimator": "playeranimator",
  "mc-terrablender": "terrablender",
  "mc-patchouli": "patchouli",
  "mc-geckolib": "geckolib",
  "mc-modern-ui": "modern-ui",
  "mc-architectury": "architectury-api",
  "mc-yacl": "yacl",
  "mc-kubejs": "kubejs",
  "mc-caelus": "caelus",
  // 第 45 轮：mc-owo / mc-pehkui 补了 mcVersionsByPlatform ⇒ 判据④ 必须能桥到构件面，
  // 否则 BRIDGE_MISSING 判红（该两家的 slug 在生成物 library-catalog.ts 里本就非空：
  // authored/lib-owo → owo-lib（构件面 70 行）、authored/lib-pehkui → pehkui（83 行））。
  "mc-owo": "owo-lib",
  "mc-pehkui": "pehkui",
};

/** 地板（as-of 2026-09-24 实扫：9 份源稿声明该键 / 判到的 (skill,loader) 组见运行输出）。只许 `<`。 */
export const FLOOR_WINDOW_SKILLS = 8;
export const FLOOR_WINDOW_PAIRS = 12;
/**
 * 判据④b 地板（as-of 2026-09-24 实扫 6 组，见 `temp/ralph-20260922/logs/r16-14-gate4b-run.log`）：
 * 带 ≥1 平台窗口的源稿里，`platforms` 声明了但**没有可判窗口**的 loader 共 6 组 ——
 * `mc-geckolib` 的 fabric/forge/neoforge（其 `fabric=1.16.5+` / `neoforge=1.20+` 是开放形，
 * `parseWindowTokens` 只收 `A-B` 形 ⇒ 三组都拿不到窗口终点）、`mc-architectury/fabric`（`forge=…-…` 里没 fabric）、
 * `mc-modern-ui/forge`、`mc-yacl/fabric`。其中 union 写成 `1.16.5+` / `1.12.2+` 开放形的 4 组**不判**（不可比），
 * 实判 2 组（modern-ui/forge、yacl/fabric，两组 union 上界 = 该 loader release 上界 ⇒ 绿）。
 * `mc-playeranimator` 的 fabric 本轮已补 `fabric=1.16.4-1.21.4` 窗口，不再是无窗口组。地板取 3（留余量，禁止等式棘轮）。
 */
export const FLOOR_UNION_ELIGIBLE = 3;
/** 判据④d 地板（as-of 2026-09-24 实扫 9 份带窗口源稿全部正向对称）。只许 `<`，禁止等式棘轮。 */
export const FLOOR_WINDOW_SYM = 8;

/* ---------- 判据④b：`platforms` 逐 loader —— 无窗口者按 union `mcVersions` 判（第 16 轮扩面，2026-09-24） ---------- */

/**
 * 为什么要有这条腿：判据④（=④a）只遍历写进 `mcVersionsByPlatform` 的 loader，而
 * `scripts/resolve-lib-skills.mjs:217-218` 的语义是「该平台**有**窗口才整组替换，否则退回 union `mcVersions`」
 * ⇒ 一个源稿只要 `platforms` 里点名了某 loader 却没给它窗口，该 loader 拿到的就是 **union 上界**，
 * 而 union 是各端上界的并（常常由 beta 撑起）⇒ 对那个 loader over-claim。2026-09-24 实测：
 * 8 份带窗口的源稿里 7 份 `platforms` ↔ 窗口键不对称，真高估 1 例
 * （`mc-playeranimator` fabric union 上界 1.21.7 > fabric release 上界 1.21.4）⇒ 本轮已补窗口修掉。
 *
 * 判面口径（与④a 同构件面 `all.json`，但**只取纯点分版本号**的 release 行）：
 * `all.json` 的 `gameVersion` 里混着 snapshot / 玩笑版 / snapshot 尾巴串（实测 playeranimator fabric
 * 有一条 `versionType:"release"` 的 `23w13a_or_b`、yacl fabric 有 `26.3-snapshot-1`），
 * 按 `verTuple` 的前导数字取法会把它们排到 1.21.x / 26.x 之上 ⇒ 用全量 release 行取上界会**永远不比 union 高**，
 * 本腿就此退化。故 release 上界 = `versionType === "release"` **且** `gameVersion` 形如 `^\d+(\.\d+)*$` 的最大值。
 * 这条过滤只服务本腿；④a 的「终点是否在 release 集内」判面未改动。
 *
 * 不判的形状（显式计数、不静默）：
 *   - union 写成开放形（`X+` / 单个裸版本号）⇒ 无上界可比，计入 `openForm`；
 *   - 该 loader 在快照里 0 条纯点分 release 行 ⇒ 判面缺失，计入 `noFace`（同 caelus/fabric 那类快照缺口）；
 *   - 源稿一个窗口都没写（`mcVersionsByPlatform: ""`，2026-09-24 实测 1 份 `mc-terrablender`）⇒ **④b 不介入，但判据④c 判红**：
 *     那里没有「按平台收窄」这回事，④a/④b 两条腿对它零覆盖，写了键却不给窗口 = 收窄形同没写 ⇒ 该形状从
 *     「单列计数打印（`noWindowSkills`）」升为判红（第 17 轮，任务 A 把 terrablender 三端窗口补上后落地）。
 *     **压根没写该键的源稿仍不判**（`union mcVersions` 就是它唯一的声明面，硬判等于把④a 的裁定平推到没收窄的库上）。
 */

/**
 * 判据④c（第 17 轮，2026-09-24 由计数升判红）。纯函数、可投毒。errors 空 = 过。
 * 判面 = 「`mcVersionsByPlatform` 这一行在 frontmatter 里出现且值非空（门的 `platformScoped` 同口径）」
 * 但 `parseWindowTokens` 解析出 **0** 个 `A-B` 窗口的源稿。两类形状都算：值为 `""` / 全写成开放形。
 * `declaresKey: false` 的行必须放行 —— 那是「压根没写该键」，本判据不介入（selftest 有对照例钉这条腿）。
 */
export function zeroWindowKeyCheck(decls) {
  return decls
    .filter((d) => d.declaresKey && d.windowCount === 0)
    .map((d) => `${d.skillId}: 声明了 mcVersionsByPlatform 却解析出 0 个平台窗口（值为空串或全是开放形 ⇒ parseWindowTokens 只认 A-B）⇒ 判据④a/④b 对它零覆盖，「按平台收窄」形同没写。修法：按该 loader 的 release 上界补 \`loader=L-B\` 窗口（越界 beta 另按④a 在正文逐 loader 披露），或整行删掉该键并说明它走 union`);
}

/**
 * 判据④d（第 18 轮，2026-09-24 由普查升判红）。纯函数、可投毒。**只管正向不对称**：
 * `mcVersionsByPlatform` 里写了 `loader=…` 窗口键，但 `platforms` 白名单没点名该 loader。
 * 后果：resolve/session 两条链路都先按 `platforms` 过滤，未点名的 loader 窗口**永不生效**
 * （Quilt 用户拿不到该库），是「写了却静默丢」的 bug 面。R115⑨ 普查到 9 份带窗口源稿里 7 份这样。
 * 方向裁定（主代理已定，逐库现算 `all.json` 里 loader=quilt 的 release 条数）：
 *   ≥1 release ⇒ 把该 loader 加进 `platforms`（放宽行为面）；0 release ⇒ 删该窗口段。
 * 本轮 7 份全部 quilt release ≥1 ⇒ 全部放宽，正向不对称数 = 0，据此升红。
 * **反向不对称（platforms 点名了 loader 却没给窗口 ⇒ 退回 union）不在本判据**（那是 ④b 的活，本轮只普查不改）。
 * 放行腿（对照，不是装饰）：`declaresKey:false`（压根没写该键）或 `windowLoaders` 为空 ⇒ 没有「窗口键」可判，
 * 不得逼所有库都写该键（同 `zeroWindowKeyCheck` 的 `declaresKey:false` 放行）。
 */
export function parseWindowKeys(value) {
  const out = [];
  for (const seg of String(value ?? "").split(";")) {
    const m = /^([\w-]+)\s*=/.exec(seg.trim());
    if (m && !out.includes(m[1])) out.push(m[1]);
  }
  return out;
}

export function platformWindowSymmetryCheck(rows) {
  return rows
    .filter((r) => r.declaresKey && Array.isArray(r.windowLoaders) && r.windowLoaders.length > 0)
    .flatMap((r) => r.windowLoaders
      .filter((L) => !(r.platforms || []).includes(L))
      .map((L) => `${r.skillId}: mcVersionsByPlatform 声明了窗口键 ${L}，但 platforms 白名单没有它（platforms=[${(r.platforms || []).join(",")}]）⇒ resolve/session 两条链路先按 platforms 过滤，${L} 窗口永不生效（该 loader 用户静默丢该库）。修法（方向裁定：现算 all.json 里 ${L} 的 release 条数）：≥1 release 就把 ${L} 加进 platforms；0 release 就删掉 ${L}=… 窗口段并在正文留口径注。`));
}

export function parsePlatformList(fm) {
  const m = /^platforms:\s*(.*)$/m.exec(fm);
  if (!m) return [];
  return m[1]
    .replace(/[\[\]"']/g, "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/** union `mcVersions` 形状：`["1.16.4-1.21.7"]` 有上界；`["1.16.5+"]` / `["1.20"]` 是开放形（不可比）。 */
export function parseUnionFace(raw) {
  const value = String(raw ?? "").replace(/^["']|["']$/g, "").replace(/[\[\]"]/g, "");
  let upper = null;
  let upperRaw = null;
  let openForm = false;
  for (const tok of value.split(",").map((x) => x.trim()).filter(Boolean)) {
    const w = /^([^-]+)-([^-]+)$/.exec(tok);
    if (w) {
      const t = verTuple(w[2]);
      if (!upper || cmpVer(t, upper) > 0) { upper = t; upperRaw = w[2]; }
      continue;
    }
    openForm = true; // X+ / 裸版本 ⇒ 该串没有可比上界
  }
  return { upper, upperRaw, openForm: openForm || !upper };
}

/** 纯点分版本（排除 `22w42a` / `23w13a_or_b` / `26.3-snapshot-1` 这类快照/占位串）。 */
export function plainDotted(v) {
  return /^\d+(\.\d+)*$/.test(String(v).trim());
}

/** 单 (skill,loader) 的 union 判据（纯函数，可投毒）。errors 空 = 过。 */
export function unionFaceCheck({ skillId, loader, upperRaw, upper, releases }) {
  const rel = releases.filter((x) => plainDotted(x.raw) && x.tuple.length);
  if (rel.length === 0) return []; // 判面缺失由驱动计数，不在此判
  const maxRel = rel.sort((a, b) => cmpVer(b.tuple, a.tuple))[0];
  if (cmpVer(upper, maxRel.tuple) <= 0) return [];
  return [
    `${skillId}/${loader}: 该平台在 mcVersionsByPlatform 里**没有窗口** ⇒ 解析退回 union 上界 ${upperRaw}，但本仓快照里该 loader 的 release 上界只有 ${maxRel.raw} ⇒ 对 ${loader} over-claim。修法：给 ${loader} 补窗口并收到 ${maxRel.raw}（越界 beta 另按④a 在正文披露），或把 union 上界降为 ${maxRel.raw}`,
  ];
}


/**
 * 快照冲突豁免表（判据④唯一允许的"不判"通道，逐条必须带非空 basis，否则本门自己红）。
 * 为什么需要：`all.json` 是本仓 2026-09-16 的**截断快照**（同仓库正文口径：「快照无该版本行」只证本仓没抓到，
 * 不证上游没有）。而 `query_upstream_releases` 的 modrinth 摘要**不含 version_type**
 * （实测 `logs/r15-15-upstream-probe.log`：只回 version/gameVersions/loaders），
 * 所以对「快照该 loader 零 release 行、上游却有同名构件行」的组合，本门拿不到可靠的 release/beta 判面。
 * - `decision: "unverified-snapshot"` —— 本门**不判**该 (slug,loader)，但计入 `unverified` 计数并要求 basis；
 * - `decision: "strip-window"` —— 裁定已定：该 loader 窗口必须不在 `mcVersionsByPlatform` 里（在 ⇒ 判红）。
 */
export const SNAPSHOT_EXEMPTIONS = [
  {
    slug: "terrablender", loader: "quilt", decision: "strip-window",
    basis: "2026-09-24 主代理裁定（第 14 轮遗留收口）：quilt 构件共 1 条且是 beta（1.20.1），0 release ⇒ 窗口移出该键，正文写「无 release 支撑，禁止按 Quilt 生成」。构件面 logs/v14-05-lib-bounds.log + 本轮 r15-12",
  },
  {
    slug: "caelus", loader: "fabric", decision: "unverified-snapshot",
    basis: "快照 caelus/fabric 0 条 release 行（只有 1.16.4/1.16.5/1.17.1 三条非 release），但上游探针 r15-15 显示 1.17.1 有 `0.0.18-1.17.1[fabric]` 构件行；CLI 摘要无 version_type ⇒ 判不了 release/beta，留账不判（要判需重抓 all.json 的 fabric 腿）。该窗口是 S22 为收窄 fabric 过称而写，**不得**据本快照零 release 行反推删除（那会复活 W0-1 的 over-claim）",
  },
];

/** 版本串 → 前导数字点分tuple（"1.19.4-rc2" 与 "1.19.4" 同键；"22w42a" → [22]）。 */
function verTuple(s) {
  const m = /^(\d+(?:\.\d+)*)/.exec(String(s).trim());
  return m ? m[1].split(".").map(Number) : [];
}
/** tuple 比较（短的一侧右侧补 0）：a>b 返正、a<b 返负、相等返 0；空 tuple 排最后。 */
export function cmpVer(a, b) {
  const ta = a.length ? a : [Infinity];
  const tb = b.length ? b : [Infinity];
  const n = Math.max(ta.length, tb.length);
  for (let i = 0; i < n; i++) {
    const d = (ta[i] ?? 0) - (tb[i] ?? 0);
    if (d) return d;
  }
  return 0;
}

/** "forge=1.13.2-1.21.1; fabric=1.16.4-1.17.1" → [{loader,start,end}]；只收有显式终点的 A-B 形（X+ / ≤X 不判）。 */
export function parseWindowTokens(value) {
  const out = [];
  for (const seg of String(value ?? "").split(";")) {
    const m = /^([\w-]+)\s*=\s*(.+)$/.exec(seg.trim());
    if (!m) continue;
    for (const tok of m[2].split(",")) {
      const t = tok.trim();
      const w = /^([^-]+)-([^-]+)$/.exec(t);
      if (w) out.push({ loader: m[1], token: t, start: w[1].trim(), end: w[2].trim() });
    }
  }
  return out;
}

/** 单 (skill,loader) 窗口判据（纯函数，可投毒）。errors 空 = 过。 */
export function windowFaceCheck({ slug, skillId, loader, end, releases, nonReleases, body }) {
  const tag = `${skillId}(${slug})/${loader}`;
  const errors = [];
  const relSet = releases.map((r) => r.tuple);
  const endTuple = verTuple(end);
  const overNonRel = nonReleases
    .filter((x) => x.tuple.length && cmpVer(x.tuple, endTuple) > 0)
    .sort((a, b) => cmpVer(b.tuple, a.tuple));
  if (releases.length === 0) {
    if (nonReleases.length > 0) {
      errors.push(`${tag}: 窗口终点 ${end} 不成立 —— 本仓快照里该 loader 只有 ${nonReleases.length} 条非 release 构件（${[...new Set(nonReleases.map((x) => x.raw))].join(",")}），0 条 release ⇒ 按裁定须把 ${loader} 从 mcVersionsByPlatform 移出，并在正文写明「无 release 支撑，禁止按 ${loader} 生成」`);
    }
    return errors;
  }
  if (!relSet.some((t) => cmpVer(t, endTuple) === 0)) {
    const maxRel = releases.sort((a, b) => cmpVer(b.tuple, a.tuple))[0];
    const kind = nonReleases.find((x) => cmpVer(x.tuple, endTuple) === 0);
    errors.push(`${tag}: 窗口终点 ${end} 不在该 loader 的 release 构件集内${kind ? `（该版本只有 ${kind.type} 构件）` : ""}；release 上界 = ${maxRel.raw} ⇒ 窗口终点必须收在 release 上界`);
    return errors;
  }
  if (overNonRel.length > 0) {
    const maxBeta = overNonRel[0].raw;
    const disclosed = body.split(/\r?\n/).some(
      (line) => new RegExp(loader, "i").test(line) && /beta|alpha/i.test(line) && line.includes(maxBeta),
    );
    if (!disclosed) {
      errors.push(`${tag}: 存在越界非 release 构件（至 ${maxBeta}）但正文没有披露句 —— 须在同段落写「（beta 构件至 ${maxBeta}，无 release 支撑）」并点名 ${loader}`);
    }
  }
  return errors;
}

/** 驱动：扫声明了 mcVersionsByPlatform 的库源稿 + 读 all.json，返回 {errors, scanned, judged, skipped}。 */
export function libWindowFace() {
  const errors = [];
  if (!fs.existsSync(MANIFEST)) {
    return { errors: [`MANIFEST_MISSING：${path.relative(ROOT, MANIFEST)} 不在盘上 ⇒ 判据④无构件面可核`], scanned: 0, judged: 0, skipped: 0, union: { eligible: 0, judged: 0, openForm: 0, noFace: 0 }, noWindowSkills: [], sym: { scanned: 0, asymmetric: 0 } };
  }
  const manifest = new Map(JSON.parse(fs.readFileSync(MANIFEST, "utf8")).map((s) => [s.slug, s.entries || []]));
  const groups = ["all-platforms", "fabric-only", "neo-only", "forge-only", "bedrock-only"];
  let scanned = 0;
  let judged = 0;
  let skipped = 0;
  /** 判据④b 计数面（逐形状可核，禁止静默丢组）。 */
  const unionStats = { eligible: 0, judged: 0, openForm: 0, noFace: 0 };
  const noWindowSkills = [];
  /** 判据④c 的判面（第 17 轮）：**每份源稿一行**，含「压根没写该键」的行 —— 该行的 `declaresKey:false` 必须放行，
   *  否则④c 会退化成「所有库都得写键」的假判据。 */
  const keyDecls = [];
  /** 判据④d 的判面：每份「声明了该键」的源稿一行（正向不对称：窗口键 ∉ platforms）。 */
  const symRows = [];
  for (const g of groups) {
    const dir = path.join(LIBS_ROOT, g);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!/^mc-/.test(name)) continue;
      const file = path.join(dir, name, "SKILL.md");
      if (!fs.existsSync(file)) continue;
      const text = fs.readFileSync(file, "utf8");
      const fm = text.startsWith("---") ? text.slice(3, text.indexOf("\n---", 3)) : "";
      const keyLine = /^mcVersionsByPlatform:\s*(.*)$/m.exec(fm);
      const rec = { skillId: name, declaresKey: Boolean(keyLine && keyLine[1].trim() !== ""), windowCount: 0 };
      keyDecls.push(rec);
      if (!keyLine || keyLine[1].trim() === "") continue;
      scanned += 1;
      // frontmatter 值是带引号的一整串（`mcVersionsByPlatform: "fabric=…; quilt=…"`）；
      // 不去引号会让**每个键的第一个平台窗口**因 `"fabric=` 不以 [\w-] 开头而被静默丢掉（2026-09-24 首跑实测漏判 9 个窗口）。
      const rawValue = keyLine[1].trim().replace(/^["'](.*)["']$/, "$1");
      const windows = parseWindowTokens(rawValue);
      rec.windowCount = windows.length;
      symRows.push({ skillId: name, declaresKey: true, windowLoaders: parseWindowKeys(rawValue), platforms: parsePlatformList(fm) });
      const slug = SKILL_TO_SLUG[name];
      if (!slug || !manifest.has(slug)) {
        skipped += windows.length;
        errors.push(`BRIDGE_MISSING：${name} 声明了 ${windows.length} 个平台窗口，但 SKILL_TO_SLUG 桥没有该 skill 或 all.json 没有该 slug ⇒ 判据④对它零覆盖（补桥或删除该条）`);
        continue;
      }
      const entries = manifest.get(slug);
      const body = text.slice(text.indexOf("\n---", 3) + 4);
      const declared = new Set(windows.map((w) => w.loader));
      for (const ex of SNAPSHOT_EXEMPTIONS.filter((x) => x.slug === slug && x.decision === "strip-window")) {
        if (declared.has(ex.loader)) {
          errors.push(`${name}(${slug})/${ex.loader}: 豁免表裁定 strip-window（窗口必须移出 mcVersionsByPlatform），但该键仍声明 ${ex.loader} ⇒ 判红。依据：${ex.basis}`);
        }
      }
      for (const w of windows) {
        const ex = SNAPSHOT_EXEMPTIONS.find((x) => x.slug === slug && x.loader === w.loader) || null;
        const mine = entries.filter((e) => String(e.loader) === w.loader);
        const releases = mine.filter((e) => e.versionType === "release").map((e) => ({ raw: String(e.gameVersion), tuple: verTuple(e.gameVersion) }));
        const nonReleases = mine
          .filter((e) => e.versionType !== "release")
          .map((e) => ({ raw: String(e.gameVersion), tuple: verTuple(e.gameVersion), type: String(e.versionType) }));
        if (releases.length === 0) {
          if (ex && ex.decision === "unverified-snapshot") {
            if (!ex.basis) errors.push(`EXEMPTION_ENTRY_INVALID：${slug}/${w.loader} 记了 unverified-snapshot 却没写 basis ⇒ 豁免不是免检牌`);
            skipped += 1; // 判面缺失（快照零 release 行 + 上游探针给不了 version_type）⇒ 不判，计入 skipped
            continue;
          }
          if (nonReleases.length === 0) { skipped += 1; continue; } // 整条 loader 零构件：不判
        }
        judged += 1;
        errors.push(...windowFaceCheck({ slug, skillId: name, loader: w.loader, end: w.end, releases, nonReleases, body }));
      }
      if (windows.length === 0) {
        noWindowSkills.push(name); // 该键写了但一个窗口都没有 ⇒ ④a/④b 都不介入，单列计数
      } else {
        const union = parseUnionFace((/^mcVersions:\s*(.*)$/m.exec(fm) || [])[1]);
        for (const L of parsePlatformList(fm)) {
          if (declared.has(L)) continue; // ④a 已按窗口终点判过
          unionStats.eligible += 1;
          if (union.openForm) { unionStats.openForm += 1; continue; } // `X+` / 裸版本：无上界可比
          const rel = entries
            .filter((e) => String(e.loader) === L && e.versionType === "release")
            .map((e) => ({ raw: String(e.gameVersion), tuple: verTuple(e.gameVersion) }));
          if (!rel.some((x) => plainDotted(x.raw))) { unionStats.noFace += 1; continue; } // 快照无纯点分 release 行：判面缺失
          unionStats.judged += 1;
          errors.push(...unionFaceCheck({ skillId: name, loader: L, upperRaw: union.upperRaw, upper: union.upper, releases: rel }));
        }
      }
    }
  }
  if (scanned < FLOOR_WINDOW_SKILLS) {
    errors.push(`COVERAGE_BELOW_FLOOR：声明 mcVersionsByPlatform 的源稿 ${scanned} 份 < 地板 ${FLOOR_WINDOW_SKILLS} ⇒ 判据④覆盖面变薄`);
  }
  if (judged < FLOOR_WINDOW_PAIRS) {
    errors.push(`COVERAGE_BELOW_FLOOR：判据④a 实际判到的 (skill,loader) 组数 ${judged} < 地板 ${FLOOR_WINDOW_PAIRS}（地板 as-of 2026-09-24 实扫）`);
  }
  /* 判据④b 自证采集面（R47）：零覆盖 / 组数变薄 / 计数不闭合都算红 */
  if (unionStats.eligible === 0) {
    errors.push("COLLECTOR_RETURNED_ZERO：判据④b 的 (skill,loader) 组集为 0 —— 没有任何「platforms 点名但窗口没给」的组可判 ⇒ 要么发现器失效，要么所有源稿已补齐窗口（补齐后请显式改本腿口径，不得让它静默变装饰）");
  }
  if (unionStats.eligible < FLOOR_UNION_ELIGIBLE) {
    errors.push(`COVERAGE_BELOW_FLOOR：判据④b 的无窗口 (skill,loader) 组数 ${unionStats.eligible} < 地板 ${FLOOR_UNION_ELIGIBLE}（地板 as-of 2026-09-24 实扫 4 组）⇒ 覆盖面变薄`);
  }
  const accounted = unionStats.judged + unionStats.openForm + unionStats.noFace;
  if (accounted !== unionStats.eligible) {
    errors.push(`UNION_LEG_ACCOUNTING：④b 组集不闭合 —— eligible=${unionStats.eligible} 但 judged+openForm+noFace=${accounted}（判/不判的形状必须逐组归类，漏一类就等于静默少判）`);
  }
  /* 判据④c（第 17 轮，2026-09-24）：「写了该键却零窗口」由计数升为判红。
   * 判面取 keyDecls（每份源稿一行）而不是 noWindowSkills —— 后者会被 SKILL_TO_SLUG 缺桥那条 continue 吞掉，
   * 按它判红会漏掉「没桥 + 又没窗口」的源稿（那种情况 BRIDGE_MISSING 会一起红，不重复计）。 */
  /* 判据④d（第 18 轮，2026-09-24 由普查升判红）：窗口键 ∉ platforms 的正向不对称。
   * 现算 9 份带窗口源稿全部对称（本轮把 7 份的 quilt 加进 platforms 后 = 0 组不对称）⇒ 判红成立。 */
  const symErrors = platformWindowSymmetryCheck(symRows);
  errors.push(...symErrors);
  if (symRows.length < FLOOR_WINDOW_SYM) {
    errors.push(`COVERAGE_BELOW_FLOOR：判据④d 的带窗口源稿 ${symRows.length} 份 < 地板 ${FLOOR_WINDOW_SYM}（as-of 2026-09-24 实扫 9 份）⇒ 覆盖面变薄`);
  }
  const zeroWindow = zeroWindowKeyCheck(keyDecls);
  errors.push(...zeroWindow);
  return { errors, scanned, judged, skipped, union: unionStats, noWindowSkills, zeroWindow, sym: { scanned: symRows.length, asymmetric: symErrors.length } };
}

/** 判据④的 selftest 例（纯内存投毒，不读盘）。 */
export function windowSelfCases() {
  const cases = [];
  const rel = ["1.16.4", "1.19.4"].map((r) => ({ raw: r, tuple: verTuple(r) }));
  const nonRel = ["1.19.3-rc3", "1.19.4-rc2", "1.20", "1.20.1"].map((r) => ({ raw: r, tuple: verTuple(r), type: "beta" }));
  const disclosed = "Quilt 侧 release 上界止 1.19.4（beta 构件至 1.20.1，无 release 支撑，禁止按 Quilt 生成更新窗口）";
  // 正对照：终点 = release 上界 + 正文已披露越界 beta
  cases.push({
    name: "CONTROL 窗口口径合规（release 终点 + beta 披露齐全）",
    red: false,
    err: windowFaceCheck({ slug: "playeranimator", skillId: "mc-playeranimator", loader: "quilt", end: "1.19.4", releases: rel, nonReleases: nonRel, body: disclosed }).join(";"),
  });
  // 投毒①：窗口终点写成 beta 版本（第 14 轮 playeranimator 实况 quilt=…-1.20.1）
  cases.push({
    name: "投毒①：窗口终点只被 beta 构件支撑",
    red: true,
    err: windowFaceCheck({ slug: "playeranimator", skillId: "mc-playeranimator", loader: "quilt", end: "1.20.1", releases: rel, nonReleases: nonRel, body: disclosed }).join(";"),
  });
  // 投毒①b：该 loader 一条 release 都没有（第 14 轮 terrablender 实况：quilt 仅 1 条 beta）
  cases.push({
    name: "投毒①b：零 release + 只有 beta 却仍声明窗口",
    red: true,
    err: windowFaceCheck({ slug: "terrablender", skillId: "mc-terrablender", loader: "quilt", end: "1.20.1", releases: [], nonReleases: [{ raw: "1.20.1", tuple: verTuple("1.20.1"), type: "beta" }], body: "随便一句" }).join(";"),
  });
  // 投毒②：窗口终点合法但删掉 beta 披露句（第 14 轮 patchouli 实况：release 上界 ✓、26.1.2 是 beta 未披露）
  cases.push({
    name: "投毒②：越界 beta 存在而正文无披露",
    red: true,
    err: windowFaceCheck({ slug: "patchouli", skillId: "mc-patchouli", loader: "quilt", end: "1.21.1", releases: [{ raw: "1.21.1", tuple: verTuple("1.21.1") }], nonReleases: [{ raw: "26.1.2", tuple: verTuple("26.1.2"), type: "beta" }], body: "本库支持 Quilt 1.18.2-1.21.1。" }).join(";"),
  });
  // 投毒②b：披露句写了 beta 与版本号，但没点名该 loader（按 loader 点名的要求）
  cases.push({
    name: "投毒②b：披露句没点名 loader",
    red: true,
    err: windowFaceCheck({ slug: "patchouli", skillId: "mc-patchouli", loader: "quilt", end: "1.21.1", releases: [{ raw: "1.21.1", tuple: verTuple("1.21.1") }], nonReleases: [{ raw: "26.1.2", tuple: verTuple("26.1.2"), type: "beta" }], body: "另有 beta 构件至 26.1.2，无 release 支撑。" }).join(";"),
  });
  // 正对照：无越界 beta 时不要求披露（终点 1.20.1 本身是 release；1.19.4-rc2 是**界内** alpha）
  cases.push({
    name: "CONTROL 无越界构件 ⇒ 不要求披露",
    red: false,
    err: windowFaceCheck({
      slug: "geckolib",
      skillId: "mc-geckolib",
      loader: "quilt",
      end: "1.20.1",
      releases: [{ raw: "1.19.4", tuple: verTuple("1.19.4") }, { raw: "1.20.1", tuple: verTuple("1.20.1") }],
      nonReleases: [{ raw: "1.19.4-rc2", tuple: verTuple("1.19.4-rc2"), type: "alpha" }],
      body: "无披露也合规",
    }).join(";"),
  });
  return cases;
}

/** 判据④b 的 selftest 例（纯内存投毒，不读盘；R47「新子腿自证采集面」）。 */
export function unionSelfCases() {
  const cases = [];
  const rel = (arr) => arr.map((r) => ({ raw: r, tuple: verTuple(r) }));
  const up = (s) => parseUnionFace(s);
  // 投毒③：无窗口的 loader，union 上界越过该 loader 的 release 上界（第 16 轮 mc-playeranimator/fabric 实况形状）
  cases.push({
    name: "投毒③：无窗口 loader 的 union 上界越过 release 上界",
    red: true,
    err: unionFaceCheck({ skillId: "mc-playeranimator", loader: "fabric", upperRaw: up('["1.16.4-1.21.7"]').upperRaw, upper: up('["1.16.4-1.21.7"]').upper, releases: rel(["1.16.4", "1.21.4", "1.19.4"]) }).join(";"),
  });
  // 投毒③b：同一 union 上界，但该 loader 只有 snapshot 形 release 行（`23w13a_or_b` 按 verTuple 会排到 1.21 之上）
  //          ⇒ 纯点分过滤生效，仍须判红（去掉过滤本例会假绿，这条就是钉住过滤器的）
  cases.push({
    name: "投毒③b：release 行混有 23w13a_or_b，纯点分过滤后仍判红",
    red: true,
    err: unionFaceCheck({ skillId: "mc-playeranimator", loader: "fabric", upperRaw: "1.21.7", upper: verTuple("1.21.7"), releases: rel(["23w13a_or_b", "1.21.4"]) }).join(";"),
  });
  // 正对照：补了窗口后不该再有组进来；这里核「union 上界 == release 上界」合规
  cases.push({
    name: "CONTROL：union 上界恰等于该 loader release 上界",
    red: false,
    err: unionFaceCheck({ skillId: "mc-yacl", loader: "fabric", upperRaw: "26.2", upper: verTuple("26.2"), releases: rel(["26.2", "26.1.2", "1.21.11"]) }).join(";"),
  });
  // 正对照：开放形 union（`X+`）不判 —— 靠 parseUnionFace 的 openForm，不靠 unionFaceCheck
  cases.push({ name: "CONTROL：开放形 union `1.16.5+` 判为不可比", red: false, err: parseUnionFace('["1.16.5+"]').openForm ? "" : "开放形未被识别为不可比" });
  // 投毒④：驱动层漏归类（组集不闭合）——直接跑 libWindowFace 的闭合式，用内存形状复算
  cases.push({
    name: "投毒④：④b 计数不闭合（eligible 与 judged+openForm+noFace 不等）",
    red: true,
    err: (() => {
      const u = { eligible: 4, judged: 1, openForm: 1, noFace: 0 };
      const acc = u.judged + u.openForm + u.noFace;
      return acc !== u.eligible ? `UNION_LEG_ACCOUNTING：eligible=${u.eligible} 但 judged+openForm+noFace=${acc}` : "";
    })(),
  });
  // 正对照：闭合的计数面
  cases.push({
    name: "CONTROL：④b 计数闭合",
    red: false,
    err: (() => {
      const u = { eligible: 4, judged: 2, openForm: 2, noFace: 0 };
      const acc = u.judged + u.openForm + u.noFace;
      return acc !== u.eligible ? "UNION_LEG_ACCOUNTING" : "";
    })(),
  });
  // 投毒⑤：补了窗口但终点写成 beta（④a 的既有形状，随本轮一起复跑，防「④b 上线把④a 判据挤掉」）
  cases.push({
    name: "投毒⑤：补窗口但终点写成 beta 构件",
    red: true,
    err: windowFaceCheck({
      slug: "playeranimator",
      skillId: "mc-playeranimator",
      loader: "fabric",
      end: "1.21.7",
      releases: rel(["1.16.4", "1.21.4"]),
      nonReleases: rel(["1.21.5", "1.21.6", "1.21.7"]).map((x) => ({ ...x, type: "beta" })),
      body: "fabric 窗口终点 = release 上界 1.21.4（1.21.5–1.21.7 仅 beta 构件）",
    }).join(";"),
  });
  // 投毒⑥（判据④c，第 17 轮由计数升判红）：写了 mcVersionsByPlatform 却解析出零窗口 ⇒ 必须红
  cases.push({
    name: "投毒⑥：声明 mcVersionsByPlatform 但值为空 ⇒ 零窗口判红",
    red: true,
    err: zeroWindowKeyCheck([{ skillId: "mc-terrablender", declaresKey: true, windowCount: parseWindowTokens("").length }]).join(";"),
  });
  // 投毒⑥b：键值全写成开放形（parseWindowTokens 只认 A-B）⇒ 同样零窗口 ⇒ 同红
  cases.push({
    name: "投毒⑥b：键值全为开放形 quilt=1.20+ ⇒ 零窗口判红",
    red: true,
    err: zeroWindowKeyCheck([{ skillId: "mc-x", declaresKey: true, windowCount: parseWindowTokens("quilt=1.20+").length }]).join(";"),
  });
  // 正对照（④c 的放行腿，不是装饰）：判面每份源稿一行，压根没写该键者 declaresKey=false ⇒ 不判
  cases.push({
    name: "CONTROL：压根没写该键的源稿不判（declaresKey=false 放行）",
    red: false,
    err: zeroWindowKeyCheck([
      { skillId: "mc-lib-catalog", declaresKey: false, windowCount: 0 },
      { skillId: "mc-geckolib", declaresKey: true, windowCount: 1 },
    ]).join(";"),
  });
  return cases;
}

/* ---------------- 判据⑤（S22 步4，第 33 轮 2026-09-25 落地）：三方一致性 ----------------
 *
 * S22 task 原文（`temp/plan-20260921-fix.json` · stories[id=S22].tasks 最后一条）要求的是：
 *   「加一条『SKILL.platforms ↔ catalog.loaders ↔ manifest 构件面』三方一致性断言
 *    （口径既然是构建面，三方不一致即缺陷），并按门禁铁律配投毒用例」。
 *
 * 口径（2026-09-22 裁定 ④，本门沿用）：**构建面 = `mcp-server/data/lib-manifests/all.json`
 * 逐发布文件行**（49 slug / 3,003 行，as-of 2026-09-25 第 47 轮现扫 = 第 44 轮翻页重抓后的完整面；
 * 旧值 48 slug / 2,870 行是重抓前的首页截断面，两处口径不得互抄）。`platforms` 与 `loaders`
 * 一律读作「该 loader 有发布构件」⇒ **声明了构件面没有的 loader = 过度声明 = 缺陷**（判红）。
 *
 * 三个面各自是谁：
 *   ① 声明面 `knowledge/libs/<组>/mc-<名>/SKILL.md` 的 `platforms:`（36 份，as-of 2026-09-25）
 *   ② 生成物 `mcp-server/src/diagnostics/library-catalog.ts` 的 `loaders:`（50 行；生产者
 *      `scripts/build-library-catalog-from-authored.mjs`，头注「勿手改」⇒ 本门只读不写）
 *   ③ 构件面 `all.json` 的 `entries[].loader`
 *
 * `modrinthSlug` 桥的落点（= 本门此前自述的未决项，第 33 轮裁定为**解析侧**；第 35 轮补 4°）：
 *   1° 手填表 `SKILL_TO_SLUG`（判据④已在用，9 条）
 *   2° 生成物行 `skillId === SKILL 名`（48/50 行带该字段）→ 取该行 `modrinthSlug`
 *   3° 生成物行 `id === authored/lib-<去 mc- 前缀名>` → 取该行 `modrinthSlug`
 *   4° **构件面正名（第 35 轮新增）**：2°/3° 都要求那行的 `modrinthSlug` **非空**，而生成物有
 *      **6 行 `modrinthSlug: ""`**（实测：`authored/lib-libgui`、`authored/lib-server-translations`、
 *      `authored/lib-spruceui-obsidianui`、`authored/lib-config-legacy`、`authored/lib-traps-2026`、
 *      `authored/library-integration`）⇒ 那三份**构件面明明有同名 slug**（`libgui` / `server-translations` /
 *      `spruceui-obsidianui`）却被静默判成「无桥」。4° = 只按**逐字等于构件面 slug** 的名字认桥
 *      （候选取自该 skill 自己那行的 `authored/lib-<X>` 之 X，或 SKILL 裸名），禁止子串/模糊匹配。
 *   ⇒ 覆盖率的真实分母（现扫复算，as-of 2026-09-25）：**桥通 29 份 / 36 份**（第 33 轮 CONTRIBUTING `L41`
 *      已记 29，本文件旧注写的「33/36」是**错的**，第 35 轮改口）；补 4° 后 = **32 / 36**；
 *      第 36 轮让桥吃**多值 slug 串**（`splitSlugList` + `mergedFace`：把 1°–4° 拿到的串按逗号拆开逐个判，
 *      构件口径取这些 slug 的 loader **并集**；仍只认构件面逐字存在的 slug，不猜名字）后 = **33 / 36**，未通桥逐名登记在 `BRIDGE_BLINDSPOTS`（新增未登记 /
 *      登记了却通了 ⇒ 判红，不许静默跳过）。
 *      余 3 份是「**本就不该有桥**」，各自的理由写在该表逐条 `basis` 里：`mc-lib-catalog`（索引稿）、
 *      `mc-script-server` / `mc-script-ui`（基岩 Script API，构件面是 Java 库）。
 *      `mc-compat-jei` **已不在该表**：它的生成物 `modrinthSlug` 是多值串 `"emi,jei,rei"`，
 *      拆开后 `emi`（fabric/quilt/forge/neoforge 4 个 loader）与 `jei`（forge/fabric/neoforge 3 个）
 *      都是构件面真 slug ⇒ 该份的 fabric/forge/neoforge 三组自本轮起**真被判**（腿 B 85 → 88 组）。
 *      给 36 份 SKILL.md 新增 `modrinthSlug` 键这条欠账仍在（那要动库面 frontmatter + 7 个宿主镜像树，
 *      `sync-skills.ps1` 要重跑），登记在 `CONTRIBUTING.md` 未排期清单 L41/L43，不在本门代裁。
 *   ⚠️ 2°/3° 会**分叉**：`authored/lib-cloth-config` 那行的 `skillId` 是 `mc-config`，
 *      而真正写 `platforms: [fabric, quilt]` 的是 `fabric-only/mc-cloth-config` ⇒ 两档桥
 *      命中同一生成物行。本门按「两档都判」处理（判面更宽），并把这类歧义行进 INFO 计数。
 *
 * 不判的形状（显式 INFO 计数、**不进退出公式**，与判红腿分开）：
 *   - **欠账方向**（构件面有该 loader 行、而 catalog.loaders / SKILL.platforms 没点名）：
 *     那是「少推荐」不是「过度声明」，修它要动 authored 源稿并重跑生产者，属另一轮数据活。
 *   - `platforms` ↔ `loaders` 的**直接差集**（不经构件面）：两侧各自对构件面判过，
 *     直接比两侧会把上面两组欠账/豁免重复计一遍，故只列数不判。
 *   - 桥不通（该 SKILL 无 slug 可解析）⇒ 计入 `noSlug`，不据此断言「该库无构件」。
 */

const LIBRARY_CATALOG_TS = path.join(ROOT, "mcp-server", "src", "diagnostics", "library-catalog.ts");
// 生产者在 mcp-server/scripts/ 下（第 33 轮实测：仓库根 `scripts/` **没有**这个文件）。
const CATALOG_PRODUCER = path.join(ROOT, "mcp-server", "scripts", "build-library-catalog-from-authored.mjs");

/** 地板（as-of 2026-09-25 现扫：all.json **49 slug / 3,003 行**（第 47 轮复算；旧注写的 48 / 2870 = 第 44 轮翻页重抓**前**的首页截断面，地板本身按 `<` 判、两面值都过）、catalog 50 行、SKILL 36 份；桥通 **29** 份（第 33 轮，`L41` 实况）、补 4° 后 **32** 份、第 36 轮吃多值 slug 串后 **33** 份。旧注误写 33。只许 `<`，禁止等式棘轮。 */
export const FLOOR_TRIAD_SLUGS = 40;
export const FLOOR_TRIAD_ROWS = 2500;
export const FLOOR_TRIAD_CATALOG_ROWS = 45;
export const FLOOR_TRIAD_BRIDGED = 25;
export const FLOOR_TRIAD_JUDGED = 40;
/** 覆盖下界腿的分母（第 35 轮，as-of 2026-09-25 现扫 = `all-platforms` 12 + `fabric-only` 18 = 30 份）。只许 `<`。 */
export const FLOOR_DECLARE_FABRIC_FACE = 25;
/** 未通桥名单的上界（第 35 轮补 4° 后现扫 4 份；**第 36 轮桥吃多值 slug 串后现扫 3 份**）。只许 `<`（越过才红），含义 = 「未通桥的份数不得越过登记线」。 */
export const FLOOR_TRIAD_UNBRIDGED_MAX = 5;

/**
 * 未通桥的**逐名登记**（判据⑤腿 B 的「静默跳过」禁令落地，第 35 轮；第 36 轮改成**显式「本该无桥」理由表**）。
 * 为什么必须逐名而不是只数条数：`skillOverclaimCheck` 对无桥的源稿是 `noSlug += 1; continue` ——
 * 只数条数时「`mc-libgui` 这类桥塌了」与「本来就有一份基岩稿没桥」长得一模一样，
 * 债务表清到 0 会给读出「全仓无过称」的错觉，而这正是本仓反复点名的「采集面塌了还报 ok」形状。
 * 失步即红（**双向**）：新出现一个未登记的未通桥 ⇒ 红；登记了但它其实通了 ⇒ 红。
 *
 * 第 36 轮本表由 4 条收到 **3 条**：`mc-compat-jei` **不再是本表的一员** —— 它的生成物 `modrinthSlug`
 * 是多值串 `"emi,jei,rei"`，桥现在按逗号拆开逐个判（见 `splitSlugList` / `mergedFace`），故它已能解析到
 * 构件面真 slug（`emi` 4 loader / `jei` 3 loader）⇒ 若继续留在本表，**「登记了但其实通了」那条腿当场红**。
 * 余下 3 份属**本就不该有桥**（不是覆盖缺陷），逐份的「为什么」写在自己的 `basis` 里，不得只留一个计数。
 */
export const BRIDGE_BLINDSPOTS = [
  {
    skill: "mc-lib-catalog",
    basis: "库索引稿（`all-platforms/mc-lib-catalog`），本身不对应任何上游构件；其 `platforms` 写满 5 个 loader 是「读物范围」而非构件声明 ⇒ 构件面永远无行、桥永远不通。禁止为了让它有桥去改正文。as-of 2026-09-25",
  },
  {
    skill: "mc-script-server",
    basis: "bedrock-only 的 Script API 稿；构件面 `all.json` 是 Java 库快照（Modrinth / GitHub Releases），按设计没有基岩面 ⇒ 无桥是设计边界，不是覆盖缺陷。as-of 2026-09-25",
  },
  {
    skill: "mc-script-ui",
    basis: "同 `mc-script-server`：基岩 Script API 稿，Java 构件面无对应 slug。as-of 2026-09-25",
  },
];

/**
 * 已登记的过度声明债务。**第 35 轮 0 → 6**：不是新造债，是**桥补通后本腿第一次真判到的 6 组**
 * （`mc-libgui` 案，定性 = 写单 §2 四可能里的第 3 种「桥根本没通」，成因见上方 4° 注）。
 * 逐条 basis 都写明「上游未复核 ⇒ 快照无行 ≠ 上游没有」，**没有改任何源稿的 `platforms` / 正文**。
 * 这 6 条若被修掉（补抓构件面或上游复核后确有行），失步腿当场红。
 *
 * ⚠️ **清债必跑的两次数（第 35 轮机制化，写在这里而不是只写在 error 文本里）**：摘一个 `platforms` 条目
 *   = 直接改变解析面。**动 `platforms` / `mcVersionsByPlatform` 前后各跑一次**
 *   `node scripts/resolve-lib-skills.mjs --platform=<被摘的 loader> --version=<精确档>` 与
 *   `--platform=fabric`（同档），把**两个数 + 差**如实贴进本轮报告。
 *   为什么强制：第 34 轮清 `mc-cloth-config` / `mc-fabric-language-kotlin` 的 quilt 后
 *   `quilt/1.21.4` 从 12 → **10**（第 35 轮复跑实测，见 `logs/r35-resolve.log`；两份在 quilt 下都已不在、
 *   在 fabric/1.21.4 下都还在 = 23 份内），而该轮报告**没有这个数** —— 「债务清零」被读成「无副作用」，
 *   实际是一次解析面收缩。error 文本里也有同一句，但**留账（走债务通道）时那句永远不打印** ⇒ 此注释才是
 *   清债人必然读到的落点。
 */
export const TRIAD_OVERCLAIM_DEBT = [
  {
    skill: "mc-libgui", loader: "quilt",
    basis: "第 35 轮桥补通（4° 构件面正名 slug `libgui`）后本腿首次判到：`platforms`=[fabric,quilt] 而构件面 `libgui` 仅 **1 行 fabric**（`LibGui-18.0.1+26.3-rc-2.jar`，快照 as-of 2026-09-16）。⚠️ 该 slug 的**判面天然残缺**：SKILL.md 正文自述「Modrinth 已下架（slug 空），分发走 Cotton maven / GitHub Releases」⇒ 快照里那 1 行只是抓到的一个 GitHub release 文件，不是全量发布史。**禁止**据「快照 0 行 quilt」断言 LibGui 无 Quilt 构建（`CONTRIBUTING.md` L42 已记「欠一次 all.json 构件面重抓」）。修法 = 重抓非 Modrinth 源后复跑本腿，或拿到 Cotton 发布清单原文；本轮 `data/**` 零写、未动 platforms ⇒ 留账。as-of 2026-09-25",
  },
  {
    skill: "mc-server-translations", loader: "forge",
    basis: "第 35 轮桥补通（4°：`authored/lib-server-translations` → slug `server-translations`）后判到：`platforms`=[fabric,forge,neoforge] 而构件面该 slug 仅 fabric 行。上游未复核（同 L42 构件面重抓欠账）⇒ 留账不判红，禁止据此改正文。as-of 2026-09-25",
  },
  {
    skill: "mc-server-translations", loader: "neoforge",
    basis: "同上一条同一 slug、同一判面缺失方向（`server-translations` 快照只有 fabric 行）。上游未复核 ⇒ 留账。as-of 2026-09-25",
  },
  {
    skill: "mc-spruceui", loader: "forge",
    basis: "第 35 轮桥补通（4°：`authored/lib-spruceui-obsidianui` → slug `spruceui-obsidianui`，裸名 `spruceui` **不在**构件面，靠的是行 id）后判到：`platforms`=[fabric,forge,neoforge,quilt] 而构件面该 slug 仅 fabric 行。SpruceUI 是 Cotton 系（同 libgui 的 Modrinth 下架情形），快照口径对它覆盖度低 ⇒ 只留账、不改语料。as-of 2026-09-25",
  },
  {
    skill: "mc-spruceui", loader: "neoforge",
    basis: "同 `mc-spruceui`/forge 条：同一 slug、同一仅 fabric 行的快照面，上游未复核 ⇒ 留账。as-of 2026-09-25",
  },
  {
    skill: "mc-spruceui", loader: "quilt",
    basis: "同 `mc-spruceui`/forge 条（该档 `platforms` 三条全部未被构件面支撑，快照只 fabric）。⚠️ 本条与 §「`platforms` 语义」待裁项**无关**：按构建面读法它判红、按读物读法它不判 ⇒ 裁定前只留账，禁止摘 quilt（那会把一条未裁的语义问题当成已定案写进语料）。as-of 2026-09-25",
  },
];

/**
 * 判据⑤ 的 **INFO「已定案」表**（第 38 轮）。
 *
 * 为什么要有它：「少推荐」欠账（构件面有行、`catalog.loaders` 没点名）按 2026-09-22 裁定④**不判红**，
 * 只以 INFO 长印。第 37 轮把 6 条定性后剩 2 条**已定案「不补」**，但那 2 条仍会永久打印 ——
 * 一条永远有噪音的清单，下一个人会整片跳过（同 `CONTRIBUTING.md` `L13` 那条「靠人读打印语句」的教训）。
 * 本表给「已定案」一条通道：命中 ⇒ 措辞改打「已定案（见 basis）」，并与未定案**分开计数**；未命中 ⇒ 仍打未定案。
 *
 * 三条铁律（形状沿用 `TRIAD_OVERCLAIM_DEBT` / `BRIDGE_BLINDSPOTS` 的「豁免不是免检牌」）：
 *  1. 本表**只改打印措辞与计数分桶**。`info` / `infoSettled` 都**永不进 `errors`、永不进退出码** —— INFO 恒不判，
 *     这条是既有裁定（见本文件 `:36` 与 `:718` 的「不进退出公式」），加通道不得破。
 *  2. 每条必须带非空 `basis` 且 `verdict === "not-add"`，否则本门自己红（定案也要有出处，禁止只留一个计数）。
 *  3. **双向失步判红**：表里记了、现盘判面却不是这条 INFO ⇒ 红（该删没删 / 快照变了）；
 *     表指向不存在的源稿 ⇒ 红（发现器塌了）。⇒ 定案 ≠ 免检，构件面重抓后若真出现 release 行，本表会当场咬。
 *
 * 反证开关 `S22_INFO_DECIDED=off`（只作用于现盘 `main()` 取表那一行，不改本表内容）：让现盘按「空表」读 ⇒
 * 已定案的几条**重新以未定案 INFO 现形**，证明抑制不是吞掉。它只会更吵、**不会更静** ⇒ 不是消音通道。
 */
export const INFO_DEBT_DECIDED = [
  {
    skill: "mc-compat-jei", loader: "quilt", verdict: "not-add",
    basis: "第 37 轮逐 slug 定案「不补」，第 51 轮据构件面复核改点名（判定不变、依据变硬）：该档桥到合并串 `emi,jei,rei`，quilt 的 13 行 release **全部来自 `emi` 一家**（`jei` quilt **0 行**；`rei` **在面**、84 行里 **quilt 也是 0 行** —— fabric 51 行含 45 release（上界 26.2）/ rift 2 行含 2 release（1.13.2）/ forge 13 与 neoforge 18 全 beta ⇒ 原先那句「`rei` 该 slug 根本不在构件面」是**错的**，正确说法是「rei 在面但没有 quilt 行」）⇒ 给 `mc-compat-jei` 点名 quilt 就是让一家替另一家背书。反向局限同时成立：`jei` 自己 fabric 19 行 / neoforge 15 行都是 **0 release**。分母口径 = `mcp-server/data/lib-manifests/all.json`（as-of mtime 2026-09-25T06:21Z，49 slug / Σentries 3,003）逐 slug 逐 loader 的行数与 `versionType` 分解（探针 `temp/ralph-20260922/_r37-probe-slug-loader.mjs` + `_r37-probe-rows.mjs`，输出 `logs/r37-probe1.log` / `r37-probe2.log`；第 51 轮复算探针 `temp/ralph-20260922/_r51-rei-probe.mjs`）。正文已逐 slug 披露 = `community_knowledge/authored/library-integration-jei-emi.md`「## 构件面逐 slug 实测」。复核 as-of 2026-09-26",
  },
  {
    skill: "mc-curios", loader: "fabric", verdict: "not-add",
    basis: "第 37 轮定案「不补」：`curios` 的 fabric 在构件面只有 **1 行且 `versionType=beta`**（`1.16.5` / `curios-fabric-0.0.13-1.16.5.jar`，release **0**）⇒ 按 2026-09-24 裁定「只有 beta ⇒ 不点名」（同一条裁定当年把 `terrablender` 的 quilt 移出窗口，方向反过来同样适用）。正文已披露并写明「不点名 ≠ 上游没有」= `community_knowledge/authored/lib-curios.md`「## 构件面逐 loader 实测」。⚠️ 若日后重抓构件面出现 fabric release 行，本条**不再**是 INFO 欠账 ⇒ 第 3 条双向失步腿会当场红，届时删本行即可。as-of 2026-09-25",
  },
];


/** ③ 构件面：slug → { loader → {rows, releases} }（顶层是数组，逐发布文件行在 `entries` 里）。 */
export function readBuildFace(manifestArr) {
  const face = new Map();
  let rows = 0;
  for (const rec of manifestArr ?? []) {
    const slug = rec?.slug;
    const entries = Array.isArray(rec?.entries) ? rec.entries : [];
    if (!slug) continue;
    const m = new Map();
    for (const e of entries) {
      rows += 1;
      const L = String(e?.loader ?? "?");
      if (!m.has(L)) m.set(L, { rows: 0, releases: 0 });
      m.get(L).rows += 1;
      if (e?.versionType === "release") m.get(L).releases += 1;
    }
    face.set(slug, m);
  }
  return { face, rows };
}

/** ② 生成物：从 `library-catalog.ts` 文本抽 `loaders` / `modrinthSlug` / `skillId` / `id`。 */
export function readCatalogFace(text) {
  const rows = [];
  for (const blk of String(text ?? "").split(/\n(?=  \{)/).slice(1)) {
    const id = /(?:^|\s)id:\s*"([^"]*)"/.exec(blk)?.[1];
    if (!id) continue;
    const arr = (s) => (s ?? "").replace(/^\[|\]$/g, "").split(",").map((x) => x.trim().replace(/^"|"$/g, "")).filter(Boolean);
    rows.push({
      id,
      modIds: arr(/(?:^|\s)modIds:\s*(\[[^\]]*\])/.exec(blk)?.[1]),
      loaders: arr(/(?:^|\s)loaders:\s*(\[[^\]]*\])/.exec(blk)?.[1]),
      modrinthSlug: /(?:^|\s)modrinthSlug:\s*"([^"]*)"/.exec(blk)?.[1] ?? "",
      skillId: /(?:^|\s)skillId:\s*"([^"]*)"/.exec(blk)?.[1] ?? "",
    });
  }
  return rows;
}

/** ① 声明面：每份 SKILL.md 一行 `{skillId, group, platforms}`。 */
export function readDeclareFace(libsRoot = LIBS_ROOT) {
  const groups = ["all-platforms", "fabric-only", "neo-only", "forge-only", "bedrock-only"];
  const out = [];
  for (const g of groups) {
    const dir = path.join(libsRoot, g);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!/^mc-/.test(name)) continue;
      const file = path.join(dir, name, "SKILL.md");
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
      const text = fs.readFileSync(file, "utf8");
      const fm = text.startsWith("---") ? text.slice(3, text.indexOf("\n---", 3)) : "";
      out.push({ skillId: name, group: g, platforms: parsePlatformList(fm) });
    }
  }
  return out;
}

/** 桥（解析侧，四档优先级）。返回 `{slug, slugs, mech}`；mech = hand|skillId|rowId|faceName|null。
 *  第 4 档必须显式给 `buildFace`（构件面 slug 表）才生效 —— selftest 的两档旧例按三档读，不因此改判。
 *  ⚠️ **第 36 轮**：`modrinthSlug` 可以是**多值串**（实况 = 生成物行 `authored/library-integration-jei-emi`
 *  的 `"emi,jei,rei"`）。此前桥按单 slug 解析 ⇒ `buildFace.has("emi,jei,rei")` 恒 false ⇒
 *  `mc-compat-jei` 的 fabric/forge/neoforge **三组永久不被判**（第 35 轮登记在 `BRIDGE_BLINDSPOTS` 的那条）。
 *  现按逗号拆开后**逐个**参与判据，构件口径 = `mergedFace` 的 loader **并集**（任一 slug 有该 loader 即算有构件）。
 *  边界不变：只认逐字出现在构件面的 slug，**禁止猜名字**（4° 的「不猜」线不放宽）。 */
export function bridgeSkillToSlug(skillId, catalogRows, buildFace = null) {
  if (SKILL_TO_SLUG[skillId]) return { slug: SKILL_TO_SLUG[skillId], slugs: splitSlugList(SKILL_TO_SLUG[skillId]), mech: "hand" };
  const bare = skillId.replace(/^mc-/, "");
  const bySkill = catalogRows.find((r) => r.skillId === skillId && r.modrinthSlug);
  if (bySkill) return { slug: bySkill.modrinthSlug, slugs: splitSlugList(bySkill.modrinthSlug), mech: "skillId" };
  const byId = catalogRows.find((r) => r.id === `authored/lib-${bare}` && r.modrinthSlug);
  if (byId) return { slug: byId.modrinthSlug, slugs: splitSlugList(byId.modrinthSlug), mech: "rowId" };
  if (buildFace) {
    // 4° 构件面正名：只认**逐字等于某个构件面 slug** 的名字（候选 = 该 skill 自己那行的 `authored/lib-<X>` 之 X、
    // 或 SKILL 裸名）。生成物有 6 行 `modrinthSlug: ""`，其中 3 行的 slug 名其实就在构件面里 ——
    // 不补这一档，那 3 份源稿的 platforms 会被 `noSlug += 1; continue` 静默跳过（第 35 轮 mc-libgui 案）。
    const own = catalogRows.find((r) => r.skillId === skillId) ?? catalogRows.find((r) => r.id === `authored/lib-${bare}`);
    const m = own ? /^authored\/lib-(.+)$/.exec(own.id) : null;
    for (const cand of m ? [m[1], bare] : [bare]) {
      if (cand && buildFace.has(cand)) return { slug: cand, slugs: [cand], mech: "faceName" };
    }
  }
  return { slug: null, slugs: [], mech: null };
}

/** 多值 slug 串 → 数组（按逗号拆、去空白、去重、丢空项）。单值时长度 1，语义与拆之前逐字相同。 */
export function splitSlugList(raw) {
  const out = [];
  for (const piece of String(raw ?? "").split(",")) {
    const t = piece.trim();
    if (t && !out.includes(t)) out.push(t);
  }
  return out;
}

/** 若干 slug 在构件面的 loader **并集**（`{loader → {rows, releases}}`）；**没有一个是真 slug ⇒ null**。
 *  null 的含义要说清：不是「该库无构件」，而是「构件面没有这些 slug 的行 ⇒ 判面缺失」（R47 口径）。 */
export function mergedFace(buildFace, slugs) {
  let merged = null;
  for (const s of slugs ?? []) {
    const m = buildFace.get(s);
    if (!m) continue;
    if (!merged) merged = new Map();
    for (const [L, v] of m) {
      const cur = merged.get(L) || { rows: 0, releases: 0 };
      cur.rows += v.rows;
      cur.releases += v.releases;
      merged.set(L, cur);
    }
  }
  return merged;
}


/** 腿 A（纯函数，可投毒）：生成物 `loaders` 不得声明构件面 0 行的 loader。 */
export function catalogOverclaimCheck(catalogRows, buildFace, debt = TRIAD_OVERCLAIM_DEBT) {
  const errors = [];
  let judged = 0;
  let noSlug = 0;
  const rowDebt = debt.filter((d) => d && d.row);
  for (const ex of rowDebt) {
    if (!ex.basis || !String(ex.basis).trim()) errors.push(`⑤A 债务表条目失效：${ex.row}/${ex.loader} 没有 basis ⇒ 豁免不是免检牌`);
  }
  const seenViol = new Set();
  for (const r of catalogRows) {
    // 第 36 轮：与腿 B 同口径吃多值 slug 串（生成物确实有 `"emi,jei,rei"` 这种行）。
    const slugs = splitSlugList(r.modrinthSlug);
    if (!slugs.length) { noSlug += 1; continue; }
    const byLoader = mergedFace(buildFace, slugs);
    if (!byLoader) { noSlug += 1; continue; } // 快照没这些 slug：判面缺失，不据此判红
    for (const L of r.loaders) {
      judged += 1;
      if (!byLoader.has(L)) {
        seenViol.add(`${r.id}:${L}`);
        if (rowDebt.some((d) => d.row === r.id && d.loader === L)) continue; // 已登记债务
        errors.push(`⑤A ${r.id}: catalog.loaders 声明 loader=${L}，但构件面 slug \`${slugs.join("`/\`")}\` 该 loader **0 条发布文件行** ⇒ 过度声明（口径 2026-09-22 裁定④：loaders 一律读作「该 loader 有发布构件」）。修法：改 authored 源稿后重跑 ${path.relative(ROOT, CATALOG_PRODUCER).replace(/\\/g, "/")}，禁止手改生成物。要留账就在 TRIAD_OVERCLAIM_DEBT 加 {row, loader, basis}`);
      }
    }
  }
  const knownRows = new Set(catalogRows.map((r) => r.id));
  for (const ex of rowDebt) {
    if (!knownRows.has(ex.row)) {
      errors.push(`⑤A 债务指向不存在的生成物行：${ex.row}/${ex.loader} 不在 catalog 里（生产者改过没重跑？债务该删？）⇒ 判面与账失步`);
      continue;
    }
    if (!seenViol.has(`${ex.row}:${ex.loader}`)) {
      errors.push(`⑤A 债务表失步：${ex.row}/${ex.loader} 登记的过度声明在当前判面已不存在（构件面补了行、或 loaders 已改）⇒ 删该条或重开上游复核。原 basis：${String(ex.basis).slice(0, 80)}`);
    }
  }
  return { errors, judged, noSlug, seenViol };
}

/** 腿 B（纯函数，可投毒）：SKILL.platforms 不得声明构件面 0 行的 loader；债务表是唯一不判通道。
 *  ⚠️ 本腿**必须**跑 `lib resolve` 前后对照（见下方 error 文本的收口要求）：清一条债 = 摘一个 loader = 直接改解析面。
 *  第 38 轮加 `decided`（= `INFO_DEBT_DECIDED`）：只决定 INFO 的**措辞与分桶**（未定案 / 已定案分开计数），
 *  两桶都**永不进 `errors`** ⇒ 退出码与 INFO 条数无关（既有裁定，不得破）。
 *  ⚠️ 默认值**必须**是 `[]` 而不是真表：本函数同时被 selftest 的小夹具调用（夹具的声明面里没有 `mc-curios` /
 *  `mc-compat-jei`），拿真表进夹具会被「指向不存在的源稿」腿误咬。⇒ 真盘驱动在 `libTriadFace()` 里**显式**传表，
 *  并由 selftest 的「现盘接线对照」钉住「驱动漏传表 ⇒ 定案数对不上 ⇒ 红」这条腿。 */
export function skillOverclaimCheck(declareRows, buildFace, catalogRows, debt = TRIAD_OVERCLAIM_DEBT, decided = []) {
  const errors = [];
  const info = [];
  const infoSettled = [];
  const infoBucket = new Map();
  let judged = 0;
  let bridged = 0;
  let noSlug = 0;
  const unbridged = [];
  const mechCounts = {};
  const seenViol = new Set();
  const seenInfo = new Set();
  const skillDebt = debt.filter((d) => d && d.skill);
  for (const ex of skillDebt) {
    if (!ex.basis || !String(ex.basis).trim()) {
      errors.push(`⑤B 债务表条目失效：${ex.skill}/${ex.loader} 没有 basis ⇒ 豁免不是免检牌`);
    }
  }
  const infoDecided = Array.isArray(decided) ? decided : [];
  for (const ex of infoDecided) {
    if (!ex || !ex.skill || !ex.loader) {
      errors.push("⑤C INFO 定案表条目形状失效：每条必须同时给 `skill` 与 `loader` ⇒ 否则它匹配不上任何 INFO，成了隐形豁免");
      continue;
    }
    if (!ex.basis || !String(ex.basis).trim()) {
      errors.push(`⑤C INFO 定案表条目失效：${ex.skill}/${ex.loader} 记了 not-add 却没写 basis ⇒ 定案不是免检牌`);
    }
    if (ex.verdict !== "not-add") {
      errors.push(`⑤C INFO 定案表 verdict 未知：${ex.skill}/${ex.loader} verdict=${JSON.stringify(ex.verdict)}（本表只认 "not-add"；要新增定案种类得先配判据与反证，禁止顺手加）`);
    }
  }
  for (const s of declareRows) {
    const { slugs, mech } = bridgeSkillToSlug(s.skillId, catalogRows, buildFace);
    const slug = slugs.join(",");
    const byLoader = mergedFace(buildFace, slugs);
    if (!byLoader) {
      noSlug += 1;
      unbridged.push(s.skillId); // 逐名，不静默（消费方 = bridgeCoverageCheck + main 的打印腿）
      continue;
    }
    bridged += 1;
    mechCounts[mech] = (mechCounts[mech] || 0) + 1;
    for (const L of s.platforms) {
      judged += 1;
      if (byLoader.has(L)) continue;
      const key = `${s.skillId}:${L}`;
      seenViol.add(key);
      if (skillDebt.some((d) => d.skill === s.skillId && d.loader === L)) continue; // 已登记债务
      errors.push(`⑤B ${s.skillId}(${slug})/${L}: \`platforms\` 点名 ${L}，但构件面该 slug **0 条 ${L} 发布文件行** ⇒ 对该 loader 过度声明（桥=${mech}）。修法二选一：上游复核后确有构件 → 补抓 all.json；确无 → 从 platforms 摘掉 ${L} 并在正文写明。要留账就进 TRIAD_OVERCLAIM_DEBT 并写 basis。⚠️ 无论走哪条：摘 ${L} 会**同步改变解析面**，动 \`platforms\` / \`mcVersionsByPlatform\` 前后各跑一次 \`node scripts/resolve-lib-skills.mjs --platform=${L} --version=<精确档>\` 与 \`--platform=fabric\`（同档），把**两个数 + 差**贴进本轮报告（第 34 轮清了 cloth-config / fabric-language-kotlin 的 quilt 后 quilt/1.21.4 从 12 掉到 10，报告里没这个数 ⇒ 本句就是那条欠账的机制化）。`);
    }
    // 生成物与本档指向同一 slug 却 loader 集不同 ⇒ 只列 INFO（欠账/豁免方向，不判）
    const bareName = s.skillId.replace(/^mc-/, "");
    const row = catalogRows.find((r) =>
      splitSlugList(r.modrinthSlug).some((x) => slugs.includes(x)) &&
      (r.skillId === s.skillId || r.id === `authored/lib-${bareName}`));
    if (row) {
      const onlyBuild = [...byLoader.keys()].filter((L) => !row.loaders.includes(L));
      // 第 38 轮：逐 (skill,loader) 一条 INFO（原先按 skill 合并成一行），才能与 INFO_DEBT_DECIDED 的键对齐。
      // 按 key 入 Map ⇒ 「未定案 + 已定案 = INFO 总面」是**精确等式**，抑制不可能吞掉条目。
      for (const L of onlyBuild) {
        const key = `${s.skillId}:${L}`;
        seenInfo.add(key);
        const dec = infoDecided.find((d) => d.skill === s.skillId && d.loader === L);
        infoBucket.set(key, {
          settled: Boolean(dec),
          line: dec
            ? `⑤INFO 已定案 ${key}: 构件面 ${slug} 有 ${L} 行而 catalog.loaders=[${row.loaders.join(",")}] 未点名 ⇒ **不补**（定案依据见 INFO_DEBT_DECIDED.basis：${String(dec.basis).replace(/\s+/g, " ").slice(0, 120)}…）｜仍逐名打印、不静默、不进退出码`
            : `⑤INFO 欠账 ${key}: 构件面 ${slug} 有 [${L}] 行而 catalog.loaders=[${row.loaders.join(",")}] 未点名（少推荐，不判；修它要动 authored 源稿 + 重跑生产者）`,
        });
      }
    }
  }
  const declared = new Set(declareRows.map((s) => s.skillId));
  for (const ex of infoDecided) {
    if (!ex || !ex.skill) continue;
    if (!declared.has(ex.skill)) {
      errors.push(`⑤C INFO 定案表指向不存在的源稿：INFO_DEBT_DECIDED 记了 ${ex.skill}/${ex.loader}，但声明面里没有这份 SKILL.md ⇒ 要么该档被删（定案条目该一起删），要么发现器失效（本腿就此失去覆盖）`);
      continue;
    }
    if (!seenInfo.has(`${ex.skill}:${ex.loader}`)) {
      errors.push(`⑤C INFO 定案表失步：${ex.skill}/${ex.loader} 定案「不补」的少推荐欠账在当前判面已不存在（构件面删了行、或 catalog.loaders 已点名）⇒ 删该条或重开上游复核。原 basis：${String(ex.basis).slice(0, 80)}`);
    }
  }
  for (const ex of skillDebt) {
    if (!declared.has(ex.skill)) {
      errors.push(`⑤B 债务指向不存在的源稿：TRIAD_OVERCLAIM_DEBT 记了 ${ex.skill}/${ex.loader}，但声明面里没有这份 SKILL.md ⇒ 要么该档被删（债务该一起删），要么发现器失效（本门就此失去覆盖）`);
      continue;
    }
    if (!seenViol.has(`${ex.skill}:${ex.loader}`)) {
      errors.push(`⑤B 债务表失步：${ex.skill}/${ex.loader} 登记的过度声明在当前判面已不存在（要么已修、要么快照变了）⇒ 删该条或重开上游复核。原 basis：${String(ex.basis).slice(0, 80)}`);
    }
  }
  // INFO 分桶落定：未定案进 `info`，已定案进 `infoSettled`（两者都不进 errors ⇒ 恒不进退出码）
  for (const v of infoBucket.values()) (v.settled ? infoSettled : info).push(v.line);
  if (info.length + infoSettled.length !== seenInfo.size) {
    errors.push(`⑤C INFO_SPLIT：INFO 面 ${seenInfo.size} 个 (skill,loader) 键，分桶后只有 ${info.length} 未定案 + ${infoSettled.length} 已定案 ⇒ 有欠账在分桶时被丢掉（抑制变成了吞掉，本表就失去意义）`);
  }
  return { errors, info, infoSettled, judged, bridged, noSlug, unbridged, mechCounts, seenViol, seenInfo };
}

/**
 * 判据⑤腿 B 的**覆盖下界腿**（第 35 轮）：桥通性本身必须在判面内，不得只数一个总数。
 * 立这条腿的直接起因 = `mc-libgui`：它 `platforms`=[fabric,quilt]、构件面 slug `libgui` 只有 1 行 fabric，
 * 按 ⑤B 的自述规则**应当报红**，却因为生成物行 `modrinthSlug: ""` 让 2°/3° 两档桥都返回 null，
 * 被 `noSlug += 1; continue` 静默跳过 —— 债务表清到 0 时会给出「全仓无过称」的假结论。
 * 四条断言：采集 0 份 ⇒ `COLLECTOR_RETURNED_ZERO`；未通桥未逐名登记 ⇒ 红；登记了却通了 ⇒ 红；
 * 未通桥份数越过登记线上界 ⇒ 红。
 */
export function bridgeCoverageCheck(declareRows, unbridged, blindspots = BRIDGE_BLINDSPOTS) {
  const errors = [];
  if (declareRows.length === 0) {
    return { errors: ["⑤ COLLECTOR_RETURNED_ZERO：腿 B 的声明面采集 0 份 SKILL.md ⇒ 桥覆盖判断什么也没在看（发现器或 libs 路径失效）"], declared: 0, unbridged: unbridged.length, silent: [] };
  }
  if (declareRows.length < FLOOR_DECLARE_FABRIC_FACE) {
    errors.push(`⑤ COVERAGE_BELOW_FLOOR：腿 B 声明面 ${declareRows.length} 份 < 地板 ${FLOOR_DECLARE_FABRIC_FACE}（地板 as-of 2026-09-25 现扫 36 份总 / fabric-only+all-platforms 30 份）⇒ 分母塌了，桥通率再高也没意义`);
  }
  const registered = new Set(blindspots.map((b) => b.skill));
  const silent = unbridged.filter((s) => !registered.has(s));
  const stale = [...registered].filter((s) => !unbridged.includes(s));
  for (const s of silent) {
    errors.push(`⑤ BRIDGE_BLINDSPOT（未登记，静默跳过 = 采集面塌了还报 ok）：${s} 无桥可解析 ⇒ 它的 \`platforms\` 一条都没被腿 B 判过。要么补桥（手填 \`SKILL_TO_SLUG\` 或让 4° 的构件面正名命中），要么在 \`BRIDGE_BLINDSPOTS\` 逐名写清 basis（说明确实没有构件面可判，禁止只写「无」）`);
  }
  for (const s of stale) {
    errors.push(`⑤ BRIDGE_BLINDSPOT 失步：${s} 登记为无桥，但当前判面它已能解析到构件面 slug ⇒ 桥通性变了而账没跟上（现在它应当被腿 B 真判到，过称就判红）`);
  }
  for (const b of blindspots) {
    if (!b.basis || !String(b.basis).trim()) errors.push(`⑤ BRIDGE_BLINDSPOT 条目失效：${b.skill} 没有 basis ⇒ 登记不是免检牌`);
  }
  if (unbridged.length > FLOOR_TRIAD_UNBRIDGED_MAX) {
    errors.push(`⑤ COVERAGE_BELOW_FLOOR：未通桥 ${unbridged.length} 份 > 上界 ${FLOOR_TRIAD_UNBRIDGED_MAX}（as-of 2026-09-25 现扫 3 份；第 36 轮桥吃多值 slug 串之前是 4 份）⇒ 腿 B 的覆盖面在变薄（逐名 = ${unbridged.join(",")}）`);
  }
  return { errors, declared: declareRows.length, unbridged: unbridged.length, silent };
}

/**
 * 判据⑤的采集面自证（纯函数，可投毒）：三个面任一分母为 0 ⇒ 本门此刻什么也没在看，
 * 必须当场红，禁止静默绿（R47；同 `coverageSelfCheck` 的做法）。
 */
export function triadCollectorCheck(c) {
  const e = [];
  if (!c || typeof c !== "object") return ["⑤ COLLECTOR_RETURNED_ZERO：计数对象缺失"];
  if (c.slugs === 0 || c.rows === 0) e.push(`⑤ COLLECTOR_RETURNED_ZERO：构件面 all.json 采到 ${c.slugs} slug / ${c.rows} 行 ⇒ 判据⑤没有分母`);
  if (c.catalogRows === 0) e.push("⑤ COLLECTOR_RETURNED_ZERO：library-catalog.ts 解析出 0 个目录行（生成物形状漂移？发现器失效？）⇒ 腿 A 零覆盖");
  if (c.declareRows === 0) e.push("⑤ COLLECTOR_RETURNED_ZERO：SKILL.md 实扫 0 份 ⇒ 腿 B 零覆盖");
  return e;
}

/** 判据⑤驱动。 */
export function libTriadFace() {
  const errors = [];
  const info = [];
  const counts = { slugs: 0, rows: 0, catalogRows: 0, declareRows: 0, judgedA: 0, judgedB: 0, bridged: 0, noSlugA: 0, noSlugB: 0 };
  if (!fs.existsSync(MANIFEST)) {
    return { errors: [`⑤ MANIFEST_MISSING：${path.relative(ROOT, MANIFEST)} 不在盘上 ⇒ 三方一致性没有构件面`], info, counts };
  }
  if (!fs.existsSync(LIBRARY_CATALOG_TS)) {
    return { errors: [`⑤ CATALOG_MISSING：${path.relative(ROOT, LIBRARY_CATALOG_TS)} 不在盘上 ⇒ 生成物面不可读（目录漂移？）`], info, counts };
  }
  const { face: buildFace, rows } = readBuildFace(JSON.parse(fs.readFileSync(MANIFEST, "utf8")));
  const catalogRows = readCatalogFace(fs.readFileSync(LIBRARY_CATALOG_TS, "utf8"));
  const declareRows = readDeclareFace();
  counts.slugs = buildFace.size;
  counts.rows = rows;
  counts.catalogRows = catalogRows.length;
  counts.declareRows = declareRows.length;

  // 采集面自证（R47）：任一面采 0 即本门什么也没在看 —— 纯函数，selftest 可投毒
  const c0 = triadCollectorCheck({ slugs: buildFace.size, rows, catalogRows: catalogRows.length, declareRows: declareRows.length });
  errors.push(...c0);

  const a = catalogOverclaimCheck(catalogRows, buildFace, TRIAD_OVERCLAIM_DEBT);
  // S22_INFO_DECIDED=off ⇒ 现盘按「空定案表」读，已定案的几条重新以**未定案** INFO 现形（反证③；只会更吵，不会更静）
  const decidedFace = process.env.S22_INFO_DECIDED === "off" ? [] : INFO_DEBT_DECIDED;
  const b = skillOverclaimCheck(declareRows, buildFace, catalogRows, TRIAD_OVERCLAIM_DEBT, decidedFace);
  errors.push(...a.errors, ...b.errors);
  info.push(...b.info);
  counts.infoSettled = b.infoSettled.length;
  counts.infoDecidedTotal = decidedFace.length;
  counts.infoDecidedApplied = decidedFace.filter((d) => b.seenInfo.has(`${d.skill}:${d.loader}`)).length;
  counts.infoFaceTotal = b.seenInfo.size;
  counts.judgedA = a.judged;
  counts.noSlugA = a.noSlug;
  counts.judgedB = b.judged;
  counts.bridged = b.bridged;
  counts.noSlugB = b.noSlug;
  counts.unbridged = b.unbridged;
  counts.mech = b.mechCounts;
  counts.declareGroups = {
    fabricFace: declareRows.filter((d) => d.group === "fabric-only" || d.group === "all-platforms").length,
    total: declareRows.length,
  };
  /** 覆盖下界腿（第 35 轮）：桥通性本身进判面。 */
  const cov = bridgeCoverageCheck(declareRows, b.unbridged, BRIDGE_BLINDSPOTS);
  errors.push(...cov.errors);
  counts.covUnbridgedMax = FLOOR_TRIAD_UNBRIDGED_MAX;

  // 生成物与 authored 源稿的先后（生产者存在性 + 生成物不比源稿新反了）
  if (!fs.existsSync(CATALOG_PRODUCER)) {
    errors.push(`⑤ PRODUCER_MISSING：${path.relative(ROOT, CATALOG_PRODUCER)} 不在盘上 ⇒ 生成物无法重建，「改 catalog 走生产者」这条修法失效`);
  } else if (fs.statSync(CATALOG_PRODUCER).mtimeMs > fs.statSync(LIBRARY_CATALOG_TS).mtimeMs) {
    errors.push(`⑤ CATALOG_STALE：生成物 library-catalog.ts 比它自己的生产者 ${path.basename(CATALOG_PRODUCER)} 旧 ⇒ 生产侧改过没重跑，本门核到的是旧 loaders（只报，不代跑）`);
  }

  if (counts.slugs < FLOOR_TRIAD_SLUGS) errors.push(`⑤ COVERAGE_BELOW_FLOOR：构件面 ${counts.slugs} slug < 地板 ${FLOOR_TRIAD_SLUGS}（地板钉自旧面 48 slug；现面 as-of 2026-09-25 = 49，口径见 mcp-server/README.md §数据来源与边界）`);
  if (counts.rows < FLOOR_TRIAD_ROWS) errors.push(`⑤ COVERAGE_BELOW_FLOOR：构件面 ${counts.rows} 发布文件行 < 地板 ${FLOOR_TRIAD_ROWS}（地板钉自旧面 2,870 行；现面 as-of 2026-09-25 = 3,003，口径见 mcp-server/README.md §数据来源与边界）`);
  if (counts.catalogRows < FLOOR_TRIAD_CATALOG_ROWS) errors.push(`⑤ COVERAGE_BELOW_FLOOR：catalog ${counts.catalogRows} 行 < 地板 ${FLOOR_TRIAD_CATALOG_ROWS}（as-of 2026-09-25 实扫 50）`);
  if (counts.bridged < FLOOR_TRIAD_BRIDGED) errors.push(`⑤ COVERAGE_BELOW_FLOOR：桥通（SKILL→slug 可解析）${counts.bridged} 份 < 地板 ${FLOOR_TRIAD_BRIDGED}（as-of 2026-09-25 现扫：三档桥 29 份命中 / 36 份总，补 4° 构件面正名后 32 份，第 36 轮桥吃多值 slug 串后 33 份；门头注旧写的「33/36」是错的，第 35 轮改口）⇒ 腿 B 覆盖面变薄`);
  if (counts.judgedA + counts.judgedB === 0) {
    errors.push("⑤ COLLECTOR_RETURNED_ZERO：两条腿合计判 0 个 (面,loader) 组 ⇒ 判据⑤是装饰（桥全断 / loaders 与 platforms 全空都会是这个形状）");
  } else if (counts.judgedA + counts.judgedB < FLOOR_TRIAD_JUDGED) {
    errors.push(`⑤ COVERAGE_BELOW_FLOOR：判据⑤实判 ${counts.judgedA + counts.judgedB} 组 (面,loader) < 地板 ${FLOOR_TRIAD_JUDGED} ⇒ 覆盖面变薄`);
  }
  counts.debtTotal = TRIAD_OVERCLAIM_DEBT.length;
  counts.debtApplied = TRIAD_OVERCLAIM_DEBT.filter((d) =>
    (d.row ? a.seenViol.has(`${d.row}:${d.loader}`) : b.seenViol.has(`${d.skill}:${d.loader}`))).length;
  if (counts.debtTotal !== counts.debtApplied) {
    errors.push(`⑤ DEBT_STALE_COUNT：债务表 ${counts.debtTotal} 条里只有 ${counts.debtApplied} 条正被用作豁免 ⇒ 有条目对应的过称已不存在（该删没删，或判面形状变了）；逐条 = ${JSON.stringify(TRIAD_OVERCLAIM_DEBT.map((d) => `${d.row ?? d.skill}/${d.loader}`))}`);
  }
  return { errors, info, infoSettled: b.infoSettled, counts };
}

/* ------------------------------- selftest ------------------------------- */

/**
 * 纯内存投毒（R47 惯例；不落盘、不碰 data/）。每条都必须让**指定判据**变红，
 * 另配干净正对照，防「判据永远红」这种反向退化。
 */
export function selfTest() {
  const cases = [];
  const A = ["mc-a", "mc-b"];
  // 正对照：两边相等
  cases.push({ name: "CONTROL 同答", red: false, err: diffSets("fabric/1.20.1", A, ["mc-a", "mc-b"]) });
  // ① session 多吐（= 立门前 mc-caelus 的真实形状：union 窗口放行、平台窗口应拒绝）
  cases.push({ name: "session 多吐 mc-caelus 型", red: true, err: diffSets("fabric/1.20.1", A, ["mc-a", "mc-b", "mc-caelus"]) });
  // ② resolve 多吐（反向：session 侧收窄过头）
  cases.push({ name: "resolve 多吐", red: true, err: diffSets("quilt/1.21.1", ["mc-a", "mc-b", "mc-owo"], ["mc-a", "mc-b"]) });
  // ③ 两边同数不同名（集合差集必须抓到，不得只比长度）
  cases.push({ name: "同数不同名", red: true, err: diffSets("forge/1.20.1", ["mc-a", "mc-x"], ["mc-a", "mc-y"]) });
  // ④ 采集 0 份
  cases.push({ name: "采集 0 份", red: true, err: coverageSelfCheck([], COMBOS).join(";") });
  // ⑤ 该键没人写（判据退化成装饰）
  const noScoped = COMBOS.map((_, i) => ({ skillId: `mc-x${i}`, path: "p", platformScoped: false }));
  cases.push({ name: "mcVersionsByPlatform 零声明", red: true, err: coverageSelfCheck(noScoped, COMBOS).join(";") });
  // ⑥ COMBOS 被砍到只剩一组
  cases.push({ name: "COMBOS 掉到 1 组", red: true, err: coverageSelfCheck(collectSkills(), [["quilt", "1.21.1"]]).join(";") });
  // ⑦ COMBOS 里没有 quilt（长度仍达地板也必须红）
  cases.push({
    name: "COMBOS 无 quilt",
    red: true,
    err: coverageSelfCheck(collectSkills(), [["forge", "1.20.1"], ["fabric", "1.20.1"], ["neoforge", "1.20.4"], ["fabric", "1.16.5"]]).join(";"),
  });
  // ⑧+ 判据④a（release/beta 窗口口径）的投毒例：见 windowSelfCases()
  cases.push(...windowSelfCases());
  // ⑨+ 判据④b（platforms 逐 loader / 无窗口退回 union）：见 unionSelfCases()
  cases.push(...unionSelfCases());
  // ⑩+ 判据④d（platforms ↔ 窗口键正向对称，第 18 轮由普查升判红）：投毒必红 + 两个不判对照
  cases.push({ name: "投毒④d：窗口键 quilt 不在 platforms", red: true, err: platformWindowSymmetryCheck([{ skillId: "mc-x", declaresKey: true, windowLoaders: ["forge", "quilt"], platforms: ["forge", "neoforge"] }]).join(";") });
  cases.push({ name: "CONTROL④d：窗口键全在 platforms（本轮 7 份放宽后实况形状）", red: false, err: platformWindowSymmetryCheck([{ skillId: "mc-yacl", declaresKey: true, windowLoaders: ["forge", "neoforge", "quilt"], platforms: ["fabric", "forge", "neoforge", "quilt"] }]).join(";") });
  cases.push({ name: "CONTROL④d：压根没写该键 ⇒ 无窗口键可判（放行）", red: false, err: platformWindowSymmetryCheck([{ skillId: "mc-config", declaresKey: false, windowLoaders: [], platforms: ["fabric", "forge", "neoforge"] }]).join(";") });

  /* ---- 判据⑤（三方：SKILL.platforms ↔ catalog.loaders ↔ 构件面）投毒 + 不判对照 ---- */
  // 内存构件面：architectury-api 有 fabric+quilt，cloth-config 只有 fabric（无 quilt 行）
  const { face: TF } = readBuildFace([
    { slug: "architectury-api", entries: [{ loader: "fabric", versionType: "release" }, { loader: "quilt", versionType: "release" }] },
    { slug: "cloth-config", entries: [{ loader: "fabric", versionType: "release" }] },
  ]);
  const TROWS = [
    { id: "authored/lib-architectury", modIds: ["architectury"], loaders: ["fabric", "quilt"], modrinthSlug: "architectury-api", skillId: "mc-architectury" },
    { id: "authored/lib-cloth-config", modIds: ["cloth-config"], loaders: ["fabric"], modrinthSlug: "cloth-config", skillId: "mc-config" },
  ];
  cases.push({ name: "CONTROL⑤A 三方一致（loaders 都有构件行）", red: false, err: catalogOverclaimCheck(TROWS, TF, []).errors.join(";") });
  cases.push({ name: "投毒⑤A catalog.loaders 声明构件面 0 行的 quilt", red: true,
    err: catalogOverclaimCheck([{ ...TROWS[1], loaders: ["fabric", "quilt"] }], TF).errors.join(";") });
  cases.push({ name: "CONTROL⑤A slug 不在快照 ⇒ 判面缺失、不判红", red: false,
    err: catalogOverclaimCheck([{ id: "authored/lib-x", modIds: [], loaders: ["quilt"], modrinthSlug: "no-such-slug", skillId: "mc-x" }], TF, []).errors.join(";") });
  cases.push({ name: "CONTROL⑤A catalog 行没有 modrinthSlug ⇒ 计入 noSlug、不判红", red: false,
    err: catalogOverclaimCheck([{ id: "authored/lib-noslug", modIds: [], loaders: ["quilt"], modrinthSlug: "", skillId: "mc-noslug" }], TF, []).errors.join(";") });
  cases.push({ name: "CONTROL⑤A 同一过度声明但已进债务表（带 basis）⇒ 放行", red: false,
    err: catalogOverclaimCheck([{ id: "authored/lib-x", modIds: [], loaders: ["fabric", "quilt"], modrinthSlug: "cloth-config", skillId: "mc-x" }], TF,
      [{ row: "authored/lib-x", loader: "quilt", basis: "上游未核" }]).errors.join(";") });
  cases.push({ name: "投毒⑤A 债务表失步（登记的违规已不在判面）", red: true,
    err: catalogOverclaimCheck([{ id: "authored/lib-x", modIds: [], loaders: ["fabric"], modrinthSlug: "cloth-config", skillId: "mc-x" }], TF,
      [{ row: "authored/lib-x", loader: "quilt", basis: "已修的旧账" }]).errors.join(";") });
  cases.push({ name: "CONTROL⑤B platforms 都有构件行（空债务表 ⇒ 也不触发失步腿）", red: false,
    err: skillOverclaimCheck([{ skillId: "mc-architectury", group: "all-platforms", platforms: ["fabric", "quilt"] }], TF, TROWS, []).errors.join(";") });
  cases.push({ name: "投毒⑤B 债务指向声明面里不存在的源稿", red: true,
    err: skillOverclaimCheck([{ skillId: "mc-architectury", group: "all-platforms", platforms: ["fabric"] }], TF, TROWS,
      [{ skill: "mc-gone-away", loader: "quilt", basis: "该档已不存在" }]).errors.join(";") });
  cases.push({ name: "投毒⑤B platforms 点名构件面 0 行的 quilt（且无债务登记）", red: true,
    err: skillOverclaimCheck([{ skillId: "mc-cloth-config", group: "fabric-only", platforms: ["fabric", "quilt"] }], TF, TROWS, []).errors.join(";") });
  cases.push({ name: "CONTROL⑤B 同一违规但已进债务表（带 basis）⇒ 放行", red: false,
    err: skillOverclaimCheck([{ skillId: "mc-cloth-config", group: "fabric-only", platforms: ["fabric", "quilt"] }], TF, TROWS,
      [{ skill: "mc-cloth-config", loader: "quilt", basis: "上游复核未做，快照无行 ≠ 上游没有" }]).errors.join(";") });
  cases.push({ name: "投毒⑤B 债务表条目失效（没写 basis）", red: true,
    err: skillOverclaimCheck([{ skillId: "mc-cloth-config", group: "fabric-only", platforms: ["fabric", "quilt"] }], TF, TROWS,
      [{ skill: "mc-cloth-config", loader: "quilt", basis: "" }]).errors.join(";") });
  cases.push({ name: "投毒⑤B 债务失步：登记的违规已不在判面上（该删没删）", red: true,
    err: skillOverclaimCheck([{ skillId: "mc-architectury", group: "all-platforms", platforms: ["fabric"] }], TF, TROWS,
      [{ skill: "mc-architectury", loader: "quilt", basis: "已修的旧账" }]).errors.join(";") });
  cases.push({ name: "投毒⑤B 无桥 ⇒ 计入 noSlug、且生产侧形状漂移不得静默", red: true,
    err: (() => {
      const r = skillOverclaimCheck([{ skillId: "mc-nonexistent", group: "all-platforms", platforms: ["quilt"] }], TF, TROWS, []);
      // 无桥本身是 INFO 级（不判红），所以这里判的是「同一驱动里桥数为 0 时地板必须红」
      const cov = r.bridged < FLOOR_TRIAD_BRIDGED ? "COVERAGE_BELOW_FLOOR" : "";
      return cov;
    })() });
  cases.push({ name: "CONTROL⑤ 桥三档优先级：手填表 > skillId 行 > authored/lib-<名> 行 > 无桥", red: false,
    err: (() => {
      // 第 45 轮改动说明：`mc-owo` / `mc-pehkui` 升进了手填表（补了 mcVersionsByPlatform ⇒ 判据④ 必须桥得到），
      // 所以 2° skillId 这条腿**不能再借 mc-owo 当样例**（它会命中 1°）。改用纯内存夹具名，不依赖盘上有无该 skill。
      const rows2 = [...TROWS, { id: "authored/lib-fake-owo", modIds: ["owo"], loaders: ["fabric"], modrinthSlug: "owo-lib", skillId: "mc-fake-window" }];
      const h = bridgeSkillToSlug("mc-playeranimator", rows2); // 1° SKILL_TO_SLUG 手填表有它
      const o45 = bridgeSkillToSlug("mc-owo", rows2);          // 1° 第 45 轮新增腿：mc-owo 必须走手填表且桥到 owo-lib
      const p45 = bridgeSkillToSlug("mc-pehkui", rows2);       // 1° 同上：mc-pehkui → pehkui
      const s = bridgeSkillToSlug("mc-fake-window", rows2);    // 2° skillId 命中（手填表没有该名字）
      const r = bridgeSkillToSlug("mc-cloth-config", rows2);   // 3° authored/lib-cloth-config 命中
      const no = bridgeSkillToSlug("mc-nope", rows2);
      const bad = !(h.mech === "hand" && h.slug === "playeranimator"
        && o45.mech === "hand" && o45.slug === "owo-lib"
        && p45.mech === "hand" && p45.slug === "pehkui"
        && s.mech === "skillId" && s.slug === "owo-lib"
        && r.mech === "rowId" && r.slug === "cloth-config"
        && no.slug === null);
      return bad ? `桥分档失效：hand=${h.mech}/${h.slug} owo=${o45.mech}/${o45.slug} pehkui=${p45.mech}/${p45.slug} skillId=${s.mech}/${s.slug} rowId=${r.mech}/${r.slug} none=${no.slug}` : "";
    })() });
  cases.push({ name: "CONTROL⑤ 生成物解析器：真夹具文本必须解析出 loaders/slug", red: false,
    err: (() => {
      const parsed = readCatalogFace('export const LIBRARY_CATALOG = [\n  {\n    id: \"authored/lib-y\",\n    modIds: [\"y\"],\n    loaders: [\"fabric\", \"quilt\"],\n    modrinthSlug: \"y-lib\",\n    skillId: \"mc-y\",\n  },\n];\n');
      const r0 = parsed[0];
      return !(parsed.length === 1 && r0 && r0.modrinthSlug === "y-lib" && r0.loaders.join(",") === "fabric,quilt" && r0.skillId === "mc-y")
        ? `生成物解析器失效：${JSON.stringify(parsed).slice(0, 160)}` : "";
    })() });
  cases.push({ name: "投毒⑤ 采集面自证：三个分母任意为 0 ⇒ COLLECTOR_RETURNED_ZERO", red: true,
    err: triadCollectorCheck({ slugs: 48, rows: 2870, catalogRows: 0, declareRows: 36 }).join(";") });
  cases.push({ name: "投毒⑤b 采集面自证：构件面 0 行 ⇒ 同红", red: true,
    err: triadCollectorCheck({ slugs: 0, rows: 0, catalogRows: 50, declareRows: 36 }).join(";") });
  cases.push({ name: "CONTROL⑤c 采集面自证：三个分母都非 0 ⇒ 绿", red: false,
    err: triadCollectorCheck({ slugs: 48, rows: 2870, catalogRows: 50, declareRows: 36 }).join(";") });
  cases.push({ name: "CONTROL⑤ 生产侧实况：现盘三方判面非空（跑一次驱动，只看计数不为 0）", red: false,
    err: (() => {
      const t = libTriadFace();
      if (t.counts.rows === 0 || t.counts.catalogRows === 0 || t.counts.declareRows === 0) return "现盘判面为 0 ⇒ 本 selftest 例失去意义";
      return t.errors.some((e) => /COLLECTOR_RETURNED_ZERO|COVERAGE_BELOW_FLOOR/.test(e)) ? `现盘采集面已退化：${t.errors.filter((e) => /COLLECTOR|FLOOR/.test(e)).join(" | ").slice(0, 200)}` : "";
    })() });

  /* ---- 第 35 轮：桥通性本身进判面（`mc-libgui` 案的三记反证 + 两条对照） ---- */
  // 现盘真实形状：生成物行 authored/lib-libgui 的 modrinthSlug 是空串，而构件面**有** slug libgui（1 行 fabric）
  const { face: GF } = readBuildFace([{ slug: "libgui", entries: [{ gameVersion: "26.3", loader: "fabric", versionType: "release" }] }]);
  const GROW = [{ id: "authored/lib-libgui", modIds: ["libgui"], loaders: ["fabric"], modrinthSlug: "", skillId: "mc-libgui" }];
  const GDECL = [{ skillId: "mc-libgui", group: "fabric-only", platforms: ["fabric", "quilt"] }];
  // 反证①：桥通性真在被检查 —— 补 4° 后该形状**必红**，且红在 mc-libgui/quilt（第 35 轮定性 = 写单 §2 第 3 种「桥根本没通」）
  cases.push({ name: "反证⑤-libgui 真实形状：4° 桥通 + 构件面 quilt 0 行 ⇒ 必红", red: true,
    err: (() => {
      const br = bridgeSkillToSlug("mc-libgui", GROW, GF);
      if (br.slug !== "libgui" || br.mech !== "faceName") return "";
      const r = skillOverclaimCheck(GDECL, GF, GROW, []);
      return r.errors.some((x) => x.includes("mc-libgui(libgui)/quilt")) ? "⑤B mc-libgui(libgui)/quilt" : "";
    })() });
  // 反证②：把 quilt 从 platforms 摘掉 ⇒ 同一桥、同一构件面 ⇒ 必绿（钉「红只来自过称，不来自桥本身」）
  cases.push({ name: "反证⑤-libgui 摘掉 quilt ⇒ 必绿", red: false,
    err: skillOverclaimCheck([{ skillId: "mc-libgui", group: "fabric-only", platforms: ["fabric"] }], GF, GROW, []).errors.join(";") });
  /* ---- 第 38 轮：判据⑤ 的 INFO「已定案」表（⑤C）—— 三记投毒必红 + 一记「清空表 ⇒ 欠账现形」+ 一记分桶对照 ---- */
  // 夹具：构件面 fabric + quilt 都有 release 行，catalog.loaders 只点名 fabric，platforms 也只点名两个 loader
  //      ⇒ 腿 B **不判红**（无过称），但产生一条「少推荐」INFO 欠账 `mc-libgui:quilt` —— 正是第 37 轮之后长印的那两条的形状。
  const CFACE = readBuildFace([{ slug: "libgui", entries: [
    { gameVersion: "26.3", loader: "fabric", versionType: "release" },
    { gameVersion: "1.21.1", loader: "quilt", versionType: "release" },
  ] }]).face;
  const CROW = [{ id: "authored/lib-libgui", modIds: ["libgui"], loaders: ["fabric"], modrinthSlug: "libgui", skillId: "mc-libgui" }];
  const CDECL = [{ skillId: "mc-libgui", group: "fabric-only", platforms: ["fabric", "quilt"] }];
  const DEC_OK = [{ skill: "mc-libgui", loader: "quilt", verdict: "not-add", basis: "夹具定案：quilt 行的 release 全属另一家" }];
  cases.push({ name: "CONTROL⑤C 夹具正形：不判红且产生 1 条未定案 INFO", red: false,
    err: (() => {
      const r = skillOverclaimCheck(CDECL, CFACE, CROW, [], []);
      if (r.errors.length) return `不该红：${r.errors.join(";").slice(0, 120)}`;
      return r.info.length === 1 && r.infoSettled.length === 0 && r.info[0].includes("⑤INFO 欠账 mc-libgui:quilt") ? "" : `INFO 面没成型 info=${r.info.length} settled=${r.infoSettled.length}`;
    })() });
  cases.push({ name: "CONTROL⑤C 同一欠账已进定案表（带 basis）⇒ 不红且改打「已定案」", red: false,
    err: (() => {
      const r = skillOverclaimCheck(CDECL, CFACE, CROW, [], DEC_OK);
      if (r.errors.length) return `不该红：${r.errors.join(";").slice(0, 120)}`;
      return r.info.length === 0 && r.infoSettled.length === 1 && r.infoSettled[0].includes("⑤INFO 已定案 mc-libgui:quilt") ? "" : `分桶错 info=${r.info.length} settled=${r.infoSettled.length}`;
    })() });
  cases.push({ name: "投毒⑤C 定案条目 basis 留空 ⇒ 红（定案不是免检牌）", red: true,
    err: (() => {
      const r = skillOverclaimCheck(CDECL, CFACE, CROW, [], [{ skill: "mc-libgui", loader: "quilt", verdict: "not-add", basis: "  " }]);
      return r.errors.some((x) => x.includes("⑤C INFO 定案表条目失效") && x.includes("mc-libgui/quilt")) ? "⑤C 无 basis 已红" : "";
    })() });
  cases.push({ name: "投毒⑤C 定案表记了一条现盘不存在的欠账 ⇒ 红（双向失步）", red: true,
    err: (() => {
      const r = skillOverclaimCheck(CDECL, CFACE, CROW, [], [{ skill: "mc-libgui", loader: "fabric", verdict: "not-add", basis: "fabric 其实已被 catalog 点名 ⇒ 无欠账可定案" }]);
      return r.errors.some((x) => x.includes("⑤C INFO 定案表失步") && x.includes("mc-libgui/fabric")) ? "⑤C 失步已红" : "";
    })() });
  cases.push({ name: "投毒⑤C 定案表指向不存在的源稿 ⇒ 红（发现器塌了要当场知道）", red: true,
    err: (() => {
      const r = skillOverclaimCheck(CDECL, CFACE, CROW, [], [{ skill: "mc-gone-away", loader: "quilt", verdict: "not-add", basis: "该档不存在" }]);
      return r.errors.some((x) => x.includes("⑤C INFO 定案表指向不存在的源稿") && x.includes("mc-gone-away")) ? "⑤C 指向失效已红" : "";
    })() });
  cases.push({ name: "投毒⑤C verdict 写了未定义的种类 ⇒ 红（本表只认 not-add）", red: true,
    err: (() => {
      const r = skillOverclaimCheck(CDECL, CFACE, CROW, [], [{ skill: "mc-libgui", loader: "quilt", verdict: "wontfix-maybe", basis: "随手写的" }]);
      return r.errors.some((x) => x.includes("⑤C INFO 定案表 verdict 未知")) ? "⑤C verdict 形状已红" : "";
    })() });
  cases.push({ name: "反证⑤C 清空定案表 ⇒ 已定案那条以未定案现形（抑制 ≠ 吞掉）", red: false,
    err: (() => {
      const withTable = skillOverclaimCheck(CDECL, CFACE, CROW, [], DEC_OK);
      const without = skillOverclaimCheck(CDECL, CFACE, CROW, [], []);
      if (withTable.info.length + withTable.infoSettled.length !== without.info.length + without.infoSettled.length) return "条数不等 ⇒ 定案表吞了欠账";
      return without.info.length === 1 && without.infoSettled.length === 0 ? "" : "清空表后欠账没回到未定案桶";
    })() });
  // 现盘接线对照（第 38 轮）：真盘驱动**必须**把表传进腿 B —— 漏传 = 定案数对不上 = 本例红。
  cases.push({ name: "CONTROL⑤C 现盘接线：定案表条数 == 驱动收到的条数，且分桶守恒", red: false,
    err: (() => {
      const t = libTriadFace();
      const off = process.env.S22_INFO_DECIDED === "off";
      if (!off && t.counts.infoDecidedTotal !== INFO_DEBT_DECIDED.length) return `驱动漏传定案表（收到 ${t.counts.infoDecidedTotal} / 表 ${INFO_DEBT_DECIDED.length}）`;
      if (t.counts.infoFaceTotal !== t.info.length + t.counts.infoSettled) return `分桶不守恒 面 ${t.counts.infoFaceTotal} != ${t.info.length}+${t.counts.infoSettled}`;
      if (t.counts.infoSettled !== t.counts.infoDecidedApplied) return `已定案计数 ${t.counts.infoSettled} 与实际命中的定案条目 ${t.counts.infoDecidedApplied} 不等`;
      return "";
    })() });
  // 反证③：桥通性**退化**（4° 不生效时 `bridgeSkillToSlug` 返回 null，实测该形状在下方第一条断言里核）
  //          ⇒ 该份源稿落进未通桥 ⇒ 覆盖腿当场红（它**不在** `BRIDGE_BLINDSPOTS` 里）。
  //          这条钉的就是「第 33 轮那种静默跳过」：判面少一份源稿时必须红，不得只把条数记进 noSlug。
  cases.push({ name: "反证⑤-桥退化（4° 不生效 ⇒ slug=null）后该份落进未通桥 ⇒ 覆盖腿必红", red: true,
    err: (() => {
      const legacy = bridgeSkillToSlug("mc-libgui", GROW, null); // 第 33 轮的三档行为
      if (legacy.slug !== null) return ""; // 前提：三档确实解析不到（否则本例失去意义）
      const cov = bridgeCoverageCheck(GDECL, ["mc-libgui"], BRIDGE_BLINDSPOTS);
      return cov.errors.some((x) => /BRIDGE_BLINDSPOT（未登记/.test(x)) ? "⑤ BRIDGE_BLINDSPOT：mc-libgui 无桥可解析（未登记）" : "";
    })() });
  // 反证③b：桥**指错**（或构件面补了行）导致 `mc-libgui/quilt` 不再现形 ⇒ 债务表失步腿必须咬住
  //          ⇒ 错桥不会让它安静变绿，只会把红挪到「账与判面失步」这一腿。
  cases.push({ name: "反证⑤-桥指错 / 过称不再现形 ⇒ 债务失步必红", red: true,
    err: (() => {
      const { face: WRONG } = readBuildFace([{ slug: "libgui", entries: [{ gameVersion: "26.3", loader: "fabric", versionType: "release" }, { gameVersion: "26.3", loader: "quilt", versionType: "release" }] }]);
      const r = skillOverclaimCheck(GDECL, WRONG, GROW, TRIAD_OVERCLAIM_DEBT);
      return r.errors.some((x) => /债务表失步/.test(x)) ? "⑤B 债务表失步：mc-libgui/quilt 在当前判面已不存在" : "";
    })() });
  // 对照：4° 只认逐字命中构件面 —— 名字不在构件面就绝不硬凑（防「模糊桥」把 A 库判到 B 库头上）
  cases.push({ name: "CONTROL⑤ 4° 不猜名字：裸名不在构件面 ⇒ slug 仍为 null", red: false,
    err: (() => {
      const b1 = bridgeSkillToSlug("mc-nope-not-in-face", [], GF);
      const b2 = bridgeSkillToSlug("mc-libgui", GROW, null); // 不给构件面 ⇒ 4° 不生效（两档旧例的形状）
      return b1.slug === null && b2.slug === null ? "" : `4° 越界命中：${b1.slug} / ${b2.slug}`;
    })() });
  // 对照：现盘的未通桥必须**全部**已在 `BRIDGE_BLINDSPOTS` 里逐名登记（漏一名 / 多一名都让这条红）
  cases.push({ name: "CONTROL⑤ 现盘未通桥已逐名登记（失步即红）", red: false,
    err: (() => {
      const t = libTriadFace();
      const miss = t.errors.filter((x) => /BRIDGE_BLINDSPOT|腿 B 的声明面采集 0 份/.test(x));
      return miss.length ? miss.join(" | ").slice(0, 240) : "";
    })() });
  // 投毒：声明面采集 0 份 ⇒ 覆盖腿自身 COLLECTOR_RETURNED_ZERO
  cases.push({ name: "投毒⑤ 腿B 声明面 0 份 ⇒ COLLECTOR_RETURNED_ZERO", red: true,
    err: bridgeCoverageCheck([], ["mc-x"], []).errors.join(";") });
  // 投毒：登记了却其实通了 ⇒ 失步红（防「登记变成永久豁免」）
  cases.push({ name: "投毒⑤ BRIDGE_BLINDSPOT 失步（登记了但已能解析）", red: true,
    err: bridgeCoverageCheck(GDECL, [], [{ skill: "mc-libgui", basis: "已补桥的旧账" }]).errors.join(";") });
  // 投毒：登记条目没有 basis ⇒ 红（豁免不是免检牌）
  cases.push({ name: "投毒⑤ BRIDGE_BLINDSPOT 无 basis", red: true,
    err: bridgeCoverageCheck(GDECL, ["mc-libgui"], [{ skill: "mc-libgui", basis: "" }]).errors.join(";") });
  // 现盘实况：腿 B 必须真判到 mc-libgui（4° 生效）且现盘 6 条债务全部在判面上被豁免用到
  cases.push({ name: "CONTROL⑤ 现盘实况：4° 生效 + 债务逐条真被用作豁免", red: false,
    err: (() => {
      const t = libTriadFace();
      const bad = [];
      if (!t.counts.mech?.faceName) bad.push("4° 构件面正名桥一份都没命中 ⇒ mc-libgui 这类形状又回到静默跳过");
      if (t.counts.debtTotal !== t.counts.debtApplied) bad.push(`债务表 ${t.counts.debtTotal} 条只有 ${t.counts.debtApplied} 条在用`);
      if (!t.errors.some((x) => /DEBT_STALE_COUNT/.test(x)) && t.counts.debtTotal === 0) bad.push("债务表空且无 DEBT_STALE ⇒ 需人工确认腿 B 覆盖面没塌（看未通桥名单）");
      return bad.join("; ");
    })() });

  /* ---- 第 36 轮：桥吃**多值 slug 串**（`mc-compat-jei` 的 `"emi,jei,rei"`）+ 无桥理由表扩到逐名 ---- */
  // 内存构件面：emi 有 4 个 loader（含 quilt）、jei 只有 3 个（无 quilt）、rei 根本不在快照。
  const { face: MF } = readBuildFace([
    { slug: "emi", entries: [{ loader: "fabric", versionType: "release" }, { loader: "quilt", versionType: "release" }, { loader: "forge", versionType: "release" }, { loader: "neoforge", versionType: "release" }] },
    { slug: "jei", entries: [{ loader: "forge", versionType: "release" }, { loader: "fabric", versionType: "release" }, { loader: "neoforge", versionType: "release" }] },
  ]);
  const MROW = [{ id: "authored/library-integration-jei-emi", modIds: ["jei"], loaders: ["fabric", "forge", "neoforge"], modrinthSlug: "emi,jei,rei", skillId: "mc-compat-jei" }];
  const MDECL = [{ skillId: "mc-compat-jei", group: "all-platforms", platforms: ["fabric", "forge", "neoforge"] }];
  // 正对照①：拆分的口径本身（多值 → 3 项 / 单值 → 1 项 / 空串与空白 → 0 项 / 重复项去重）
  cases.push({ name: "CONTROL 拆分口径：splitSlugList 的四态", red: false,
    err: (() => {
      const a = splitSlugList("emi,jei,rei").join(",");
      const b = splitSlugList("emi").join(",");
      const c = splitSlugList("  ,  ").length;
      const d = splitSlugList(" emi , emi ,").join(",");
      const e = splitSlugList(null).length;
      return a === "emi,jei,rei" && b === "emi" && c === 0 && d === "emi" && e === 0 ? "" : `拆分口径失效：${a}|${b}|${c}|${d}|${e}`;
    })() });
  // 正对照②：多值串 → loader **并集**（任一 slug 有该 loader 即算有构件）；quilt 只由 emi 支撑
  cases.push({ name: "CONTROL mergedFace：并集含 emi 独有的 quilt、不含任何 slug 都没有的 bedrock", red: false,
    err: (() => {
      const m = mergedFace(MF, splitSlugList("emi,jei,rei"));
      if (!m) return "多值串没并出构件面";
      const bad = !(m.has("quilt") && m.has("fabric") && m.has("forge") && m.has("neoforge") && !m.has("bedrock"));
      return bad ? `并集错形：${[...m.keys()].join(",")}` : "";
    })() });
  // 反证①：拆分腿**恒假**（退回第 35 轮的「整串当一个 slug」）⇒ `mc-compat-jei` 现形为未通桥，
  //         而它**已不在** `BRIDGE_BLINDSPOTS` ⇒ 覆盖腿当场红（这一记钉的就是「拆了没生效」的形状）。
  cases.push({ name: "反证⑤ 拆分腿恒假（整串当单 slug）⇒ mc-compat-jei 落进未通桥 ⇒ 覆盖腿必红", red: true,
    err: (() => {
      const legacy = mergedFace(MF, ["emi,jei,rei"]); // 不拆的旧行为：构件面没有这个 slug
      if (legacy) return ""; // 前提自证：拆前确实解析不到
      const cov = bridgeCoverageCheck(MDECL, ["mc-compat-jei"], BRIDGE_BLINDSPOTS);
      return cov.errors.some((x) => /BRIDGE_BLINDSPOT（未登记/.test(x) && x.includes("mc-compat-jei")) ? "⑤ BRIDGE_BLINDSPOT：mc-compat-jei 无桥可解析（未登记）" : "";
    })() });
  // 反证②：拆分生效后同一形状**必须被真判**（fabric/forge/neoforge 三组进 judged）⇒ 摘掉 platforms 里
  //         构件面没有的 loader 才绿；这里钉「桥通了但一条都没判」不可能静默发生。
  cases.push({ name: "反证⑤ 多值桥真判 3 组；构件面缺 loader 的 platforms ⇒ 必红", red: true,
    err: (() => {
      const r = skillOverclaimCheck([{ skillId: "mc-compat-jei", group: "all-platforms", platforms: ["fabric", "forge", "neoforge", "bedrock"] }], MF, MROW, []);
      return r.judged === 4 && r.errors.some((x) => x.includes("mc-compat-jei(emi,jei,rei)/bedrock")) ? `⑤B mc-compat-jei/bedrock（构件面无 bedrock 行）` : "";
    })() });
  // 不判对照：多值串里**一个真 slug 都没有** ⇒ 仍按「判面缺失」计入未通桥，禁止据此判红（也不硬凑桥）
  cases.push({ name: "CONTROL 多值串全不在构件面 ⇒ 未通桥、不判红、不猜名字", red: false,
    err: skillOverclaimCheck(MDECL, MF, [{ ...MROW[0], modrinthSlug: "no-a,no-b" }], []).errors.join(";") });
  // 现盘真数据正对照：mc-compat-jei 在**真** all.json + 真生成物上确实拆出 3 个 slug 并解析到构件面
  cases.push({ name: "CONTROL 现盘真数据：mc-compat-jei 的多值桥已通（拆完命中 emi/jei）", red: false,
    err: (() => {
      const dface = readBuildFace(JSON.parse(fs.readFileSync(MANIFEST, "utf8"))).face;
      const drows = readCatalogFace(fs.readFileSync(LIBRARY_CATALOG_TS, "utf8"));
      const b = bridgeSkillToSlug("mc-compat-jei", drows, dface);
      const m = mergedFace(dface, b.slugs);
      if (!m) return `现盘桥未通：slugs=${JSON.stringify(b.slugs)} mech=${b.mech}`;
      const miss = ["fabric", "forge", "neoforge"].filter((L) => !m.has(L));
      return miss.length ? `现盘并集缺 loader ${miss.join(",")} ⇒ 该份的三组本应被真判` : "";
    })() });
  // 理由表的两记失步（双向）：摘掉整张表 ⇒ 未登记红；表里名字写错 ⇒ 同时「未登记」+「登记了却通了」两向红
  const realUnbridged = libTriadFace().counts.unbridged;
  cases.push({ name: "投毒⑤ 摘掉无桥理由表 ⇒ 现盘未通桥逐名现形（未登记必红）", red: true,
    err: realUnbridged.length ? bridgeCoverageCheck(readDeclareFace(), realUnbridged, []).errors.filter((x) => /BRIDGE_BLINDSPOT（未登记/.test(x)).length === realUnbridged.length
      ? `未登记 ${realUnbridged.length} 份：${realUnbridged.join(",")}` : "" : "skip-no-unbridged" });
  cases.push({ name: "投毒⑤ 理由表名字写错 ⇒ 双向红（未登记 + 登记了却通了）", red: true,
    err: (() => {
      const wrong = BRIDGE_BLINDSPOTS.map((b, i) => (i === 0 ? { ...b, skill: "mc-typo-in-table" } : b));
      const cov = bridgeCoverageCheck(readDeclareFace(), realUnbridged, wrong);
      const hasSilent = cov.errors.some((x) => /BRIDGE_BLINDSPOT（未登记/.test(x) && x.includes(realUnbridged[0]));
      const hasStale = cov.errors.some((x) => /BRIDGE_BLINDSPOT 失步/.test(x) && x.includes("mc-typo-in-table"));
      return hasSilent && hasStale ? `双向红：未登记 ${realUnbridged[0]} + 登记了却通了 mc-typo-in-table` : "";
    })() });
  // 现盘对照：未通桥份数必须**恰好**等于理由表条数（多了未登记 ⇒ 红；少了失步 ⇒ 红）
  cases.push({ name: "CONTROL 现盘：未通桥逐名 == 理由表逐名（第 36 轮 3 份）", red: false,
    err: (() => {
      const t = libTriadFace();
      const names = [...t.counts.unbridged].sort().join(",");
      const reg = BRIDGE_BLINDSPOTS.map((b) => b.skill).sort().join(",");
      if (names !== reg) return `未通桥 ${names} ↔ 理由表 ${reg} 不同名`;
      if (t.counts.unbridged.includes("mc-compat-jei")) return "mc-compat-jei 仍在未通桥里 ⇒ 多值拆分未生效";
      return t.errors.some((x) => /BRIDGE_BLINDSPOT/.test(x)) ? t.errors.filter((x) => /BRIDGE_BLINDSPOT/.test(x)).join(" | ") : "";
    })() });

  const failed = cases.filter((c) => Boolean(c.err) !== c.red);
  for (const c of cases) {
    const got = c.err ? "RED" : "green";
    console.log(`  selftest ${c.red ? "应红" : "应绿"}=${got}  ${c.name}${c.err ? " :: " + String(c.err).slice(0, 160) : ""}`);
  }
  if (failed.length > 0) {
    console.error(`SELFTEST_FAILED ${failed.length}/${cases.length} 例判据失灵：\n${failed.map((f) => " - " + f.name).join("\n")}`);
    return 1;
  }
  console.log(`  §S22 parity selftest: ${cases.length} 例（${cases.filter((c) => c.red).length} 投毒必红 + ${cases.filter((c) => !c.red).length} 正对照）全按预期`);
  return 0;
}

/* ---------------------------------- main ---------------------------------- */

async function main() {
  if (process.argv.includes("--selftest")) process.exit(selfTest());

  const skills = collectSkills();
  const scanned = skills.length;
  const scoped = skills.filter((s) => s.platformScoped).length;

  const errors = [...coverageSelfCheck(skills, COMBOS), ...distFreshnessCheck()];
  let judged = 0;
  for (const [platform, version] of COMBOS) {
    const resolveIds = runResolveChain(platform, version);
    const sessionIds = await runSessionChain(platform, version);
    judged += 1;
    const err = diffSets(`${platform}/${version}`, resolveIds, sessionIds);
    if (err) errors.push(err);
    else console.log(`  ok ${platform}/${version}: resolve=session=${resolveIds.length} 库`);
  }

  const win = libWindowFace();
  errors.push(...win.errors);
  const triad = libTriadFace();
  errors.push(...triad.errors);

  console.log(
    `  §S22 双链路同答: 扫 ${scanned} 份 SKILL.md（其中 ${scoped} 份声明 mcVersionsByPlatform）/ 判 ${judged} 组 (platform,version) / 拒 ${errors.length} 项`,
  );
  console.log(
    `  §S22 判据④a release/beta 窗口口径: 扫 ${win.scanned} 份带平台窗口的源稿 / 判 ${win.judged} 组 (skill,loader) / 快照零构件跳过 ${win.skipped} 组 / 拒 ${win.errors.length} 项`,
  );
  console.log(
    `  §S22 判据④b platforms 逐 loader: 无窗口可判组 ${win.union.eligible}（union 判 ${win.union.judged} + 开放形不判 ${win.union.openForm} + 快照无纯点分 release 不判 ${win.union.noFace}）/ ④c 该键写了但零窗口的源稿 ${(win.zeroWindow ?? win.noWindowSkills).length} 份${(win.zeroWindow ?? win.noWindowSkills).length ? " ⇒ 判红（" + win.noWindowSkills.join(",") + "）" : "（已升判红，非仅计数）"}`,
  );
  console.log(
    `  §S22 判据④d platforms ↔ 窗口键对称: 扫 ${win.sym.scanned} 份带窗口源稿 / 正向不对称 ${win.sym.asymmetric} 组${win.sym.asymmetric ? " ⇒ 判红" : "（0 ⇒ 已升判红，非仅计数）"}`,
  );
  const tc = triad.counts;
  console.log(
    `  §S22 判据⑤ 三方一致性(构建面口径): 构件面 ${tc.slugs} slug / ${tc.rows} 发布文件行 · 生成物 ${tc.catalogRows} 行 · 声明面 ${tc.declareRows} 份 · 桥通 ${tc.bridged} 份（无桥 ${tc.noSlugB} 份）· 实判 腿A ${tc.judgedA} 组 + 腿B ${tc.judgedB} 组 · 债务表剩余 ${tc.debtTotal} 条（其中 ${tc.debtApplied} 条正被用作豁免）· 拒 ${triad.errors.length} 项`,
  );
  // 覆盖下界腿的三分母（第 35 轮）：声明面份数 / 桥通份数 / 本腿真判到的组数 —— **未通桥逐名打印，不许静默跳过**。
  const mechLine = Object.entries(tc.mech ?? {}).map(([k, v]) => `${k} ${v}`).join(" / ");
  console.log(
    `  §S22 判据⑤ 腿B 覆盖分母: 声明面 ${tc.declareGroups.total} 份（其中 fabric-only+all-platforms ${tc.declareGroups.fabricFace} 份）· 桥通 ${tc.bridged} 份（桥档: ${mechLine || "无"}）· 腿B 真判到 ${tc.judgedB} 组 (skill,loader) · 未通桥 ${tc.unbridged.length} 份（上界 ${tc.covUnbridgedMax}）`,
  );
  console.log(`  §S22 判据⑤ 未通桥逐名: ${(tc.unbridged ?? []).join(", ") || "（无）"}`);
  console.log(`  §S22 判据⑤ 债务表逐名: ${TRIAD_OVERCLAIM_DEBT.map((d) => `${d.row ?? d.skill}/${d.loader}`).join(", ") || "（空表 ⇒ 腿 A/B 现判面无过称；⚠️ 空表也可能是腿 B 覆盖面塌了 ⇒ 看上一行的未通桥名单）"}`);
  // 记录类（欠账方向 / 不判形状）：**不进退出公式**，只显式打印条数（禁止糊成 PASS）
  // 第 38 轮：未定案 / 已定案**分开计数**并逐名打印（定案只是换了措辞，一条都不许从清单里消失）
  console.log(
    `  §S22 判据⑤ INFO（不判、不计入退出码）: 总面 ${tc.infoFaceTotal} 条 = 未定案 ${triad.info.length} + 已定案 ${tc.infoSettled}${process.env.S22_INFO_DECIDED === "off" ? "（⚠️ 本进程 S22_INFO_DECIDED=off ⇒ 定案表按空表读，已定案的条目全数回落到未定案）" : `（定案表 ${tc.infoDecidedTotal} 条 / ${tc.infoDecidedApplied} 条正对应现盘 INFO）`}`,
  );
  for (const x of triad.info) console.log(`   · ${x}`);
  for (const x of triad.infoSettled) console.log(`   · ${x}`);
  if (errors.length > 0) {
    console.error(`assert-lib-session-resolve-parity: FAILED（${errors.length} 项）\n${errors.map((e) => " - " + e).join("\n")}`);
    process.exit(1);
  }
  console.log(`assert-lib-session-resolve-parity: ok（${judged} 组双链路同答 + ${win.judged} 组窗口口径；地板 ${FLOOR_SKILLS}/${FLOOR_PLATFORM_SCOPED}/${FLOOR_COMBOS}/${FLOOR_WINDOW_SKILLS}/${FLOOR_WINDOW_PAIRS}）`);
}

main().catch((e) => {
  console.error(`assert-lib-session-resolve-parity: ERROR ${e && e.message ? e.message : e}`);
  process.exit(1);
});
