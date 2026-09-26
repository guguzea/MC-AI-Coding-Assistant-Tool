/**
 * assert-scaffold-mixin-shape.mjs —— scaffold 里「注入 void 方法却声明 CallbackInfoReturnable」的形状门
 * （story S1 / 审计 P0-1，2026-09-22 裁定 R3 扩面 + R4 判据）。
 *
 * 为什么需要门：三处 scaffold mixin 的写法**编译期合法**（`CallbackInfoReturnable` 只出现在形参类型上），
 * 只在运行期 Mixin 做 injector 描述符匹配时抛 `InvalidInjectionException`，而三档 `pack.meta.json`
 * 都是 `buildVerified:true` ⇒ 现有构建检查抓不到。
 *
 * 判据（R4：**被注入方法的返回类型**，不是方法名字符串）：
 *   - 目标方法描述符以 `)V` 结尾 ⇒ 形参必须是 `CallbackInfo`；出现 `CallbackInfoReturnable` ⇒ 红。
 *   - 描述符非 `V` 结尾 ⇒ 形参必须是 `CallbackInfoReturnable`；只写 `CallbackInfo` ⇒ 红。
 *   - `@Inject(method = "name(DESC)RET")` 里的显式描述符 = **一手证据**，直接判，不回查映射。
 *
 * 签名从**该档自己的** `data/<平台>_<版本>/mappings/yarn-mappings.sqlite` 取
 * （`methods.owner_named` 尾段 == `@Mixin` 目标类简名 && `name_named` == 注入方法名 → `descriptor_named`）。
 * 映射层四态**互不相同、不得混读**：
 *   OK                库在、`meta.mappingEra` ∈ {yarn, yarn-tiny}、`methods` 真有行 ⇒ 可判
 *   NO_MAPPING_LAYER  该档根本没有 yarn-mappings.sqlite（如 `fabric_26.1.2`：26.1+ 已去混淆）
 *   BAD_MAPPING_LAYER 库在但 mappingEra 不是 yarn（AGENTS 第 5 条：forge 档 mappings 目录下的同名
 *                     sqlite 实为 forge-srg / tsrg / mcp-csv）**或**三表零行 ⇒ **红**（不许拿假名字背书）
 *   UNRESOLVED        库可用但该方法名查无 ⇒ 「未判定」，**既不判红也不判绿**，只点名
 *
 * 扫描面 1（注入形状）= 全仓「scaffold/」下的所有 .java（各平台，不只 fabric），按**内容**
 * （`@Mixin(` / `@Inject(`）筛选，不按文件名。非 fabric/quilt 平台出现注入 ⇒ `NO_YARN_PLATFORM` 未判定（今日实测 0 处）。
 * 平台根 scaffold（`<平台>/scaffold/`，如 `neoforge/scaffold/`）没有版本档：version=null，
 * 其注入点落 `PLATFORM_ROOT_SCAFFOLD` 未判定（S1b 修复：此前 version 被误解成字符串 "scaffold"）。
 * 扫描面 2（mixins 注册面，S1b 新增 / S1d 改双链采集）= 每个 scaffold 根下的 mixin 配置文件，
 * 由两条链去重合并（见下「S1d 采集广度」），守卫平台 = fabric / quilt（R29 ③ 裁定，见「守卫平台」段）：
 *   规则A 条目可解析 —— package + client/server/mixins 条目拼出的类，必须对上同一 scaffold 的
 *     **java 索引**里真实存在的 .java（`${...}` 占位段按 ≥1 段目录匹配）。S1d：java 索引与 java 腿采集器
 *     同一个采集器、同一口径，覆盖 src/main/java、src/<其它>/java、顶层 java/、子模块/src/main/java 全部源码集。
 *     对不上 = VIOLATION（这类不可解析条目编译期无声，只在 Mixin apply 期才炸）。
 *     索引为空但采集器明明采到了 .java ⇒ 单独判 `COLLECTOR_GAP`（采集器退化，不是让 A/B/C 全体误判）。
 *   规则B package 落点存在 —— package 的字面量或占位形态须对应实际目录形状；无落点 = VIOLATION。
 *   规则C 双前缀 —— 条目带 `${...}` 前缀（fabric/1.21.11 修掉的 `${mod_id}.mixin.client.X` 即此形状），
 *     或重复 package 尾段（package 以 `mixin` 结尾而条目又以 `mixin.` 开头）= VIOLATION；条目必须是相对名。
 *   规则D 引用可解析（S1d 主链）—— `fabric.mod.json` 的 `mixins[]`（Quilt 档 = 现读该文件里含 mixin 的
 *     数组键，键名核不到就标 `QUILT_MIXIN_KEY_UNVERIFIED` 不猜）逐条到同棵 resources 下解析实际文件：
 *     1 候选 = 解析，0 候选 = VIOLATION（`MIXIN_CONFIG_ABSENT`：注册面指向不存在的配置），
 *     ≥2 候选 = UNRESOLVED（歧义不猜）。占位段按该根 gradle.properties 的非占位真值优先、否则按「一段」通配。
 *   本面**不判定 client/server 归属**：门没有 client/server 类分类法，宁可少判，不可误判。
 * 守卫平台（R29 ③，2026-09-24 裁定）：只有 fabric / quilt 的 mixin 注册面是「元数据 + resources」形状；
 *   neoforge / forge 的注册面是 build.gradle 的 `mixin.config`（交 S15 对账），liteloader / rift / modloader
 *   按该裁定无 mixin 面。采集器**全平台照采**（采到 ≠ 静默跳过），面外平台的配置在汇总点名为「面外」，
 *   不判 A/B/C/D。⇒ 缺陷② 的 java 索引口径修复在判分红线面上今日 0 样本（真树带 mixin 配置的只有 fabric），
 *   故由 selftest 的多源码集夹具钉住（⑰h）。
 * 语料面排除（R49 口径）：`data/` 子树是上游原文语料，**永不参与守卫**；平台树里的 `reference/` 工程是
 *   文档示例、没有注册面 —— 本门只认平台目录下的 `scaffold/` 子树，两处都天然排除，采集器另显式挡一道。
 * 静默跳过是不存在的状态：每张扫到的注入点/注册条目/引用都会落进某一类并被打印。
 * 分支行为证明：NO_MAPPING_LAYER / NO_YARN_PLATFORM / PLATFORM_ROOT_SCAFFOLD 若真树 0 样本，
 * 汇总行必须点名「仅夹具覆盖、真树 0 样本」——有分支代码 ≠ 有行为证明。
 *
 * 采集面地板（S1c，2026-09-23；S1d 换口径重扫，2026-09-24）：**绿门 ≠ 全普查**。本门开发期真撞上过一次形状缺陷——
 * mixins 发现器正则要求路径中间多一层目录，真树实际扫到 **0** 个 `mixins.json`，而门照样报绿，
 * 是人工读出汇总里的 `mixins.json 10` 才发现的。那只钉「点」，本段钉「形状类」：
 *   COLLECTOR_RETURNED_ZERO  ①腿任一环（文件 / 内容筛后 / 判定条数）为 0；②腿三段链（元数据引用 /
 *                            配置采集 / 条目判定）任一环为 0 ⇒ 判红，点名是哪条腿哪一环，
 *                            并声明「这是采集器失效，不是代码干净」。
 *   REFS_RETURNED_ZERO       ②腿主链（元数据 mixins[]）解析到 0 条引用 ⇒ 判红。S1d 缺陷①的形状级补位：
 *                            只靠辅链时「主链整个瞎掉」曾经是静默的。
 *   COVERAGE_BELOW_FLOOR     非 0 但低于写死地板（注入点 20 / mixin 配置 10 / 注册条目 20 / 元数据引用 10）⇒ 判红。
 * 地板口径 = runScan() 的 records.length（①）/ entryRecords.length + cfg.files.length + cfg.refs（②），
 * **不是**文件数。地板是**下界**：实扫值随真树长高只增不减，判红消息永远回显当前实扫值，
 * 所以长高不会假红，地板只挡「退化 / 被绕过」。
 * S1d 地板重扫（as-of 2026-09-24 工作树，HEAD 9141eed5 + 并发未提交面）：
 *   注入点 20（95 个 scaffold java → 20 个含注入 → 20 条判定，①腿口径未变）
 *   mixin 配置 10（全部 fabric 档 examplemod.mixins.json，主链 10 引用 ∪ 辅链 10 命中 → 去重 10）
 *   注册条目 20（10 个配置 × client/server/mixins 展开 2 条）· 元数据引用 10
 *   面外配置（neoforge 档 mixins.json / client.json / server.json）与未引用配置只作事实打印，不入地板。
 * 汇总另打一行采集普查（两腿各自 扫 / 判 / 拒 + 地板），地板与实扫同屏可比。
 *

 * 用法：
 *   node scripts/assert-scaffold-mixin-shape.mjs              # 真树扫描
 *   node scripts/assert-scaffold-mixin-shape.mjs --selftest   # 自建夹具证明本门真会红
 *   MC_SKILL_MIXIN_SHAPE_ROOT=<dir> 覆写仓库根（selftest 与人工投毒演练用；演练件只放 temp/）。
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
let ROOT = process.env.MC_SKILL_MIXIN_SHAPE_ROOT
  ? path.resolve(process.env.MC_SKILL_MIXIN_SHAPE_ROOT)
  : REPO_ROOT;

/** 只有这两个时代的名字才是 Yarn 名（抄 assert-skill-yarn-attest.mjs:168）。 */
const YARN_ERAS = new Set(["yarn-tiny", "yarn"]);
/** 有 yarn 映射层的平台；其余平台的 scaffold 注入点无法用本门判定。 */
const YARN_PLATFORMS = new Set(["fabric", "quilt"]);
const SKIP_DIRS = new Set([".git", "node_modules", "dist", ".gradle", "build", "temp", ".qoder"]);

const legCache = new Map();
const dbCache = new Map();

function setRoot(dir) {
  ROOT = path.resolve(dir);
  for (const db of dbCache.values()) {
    try {
      db.close();
    } catch {}
  }
  dbCache.clear();
  legCache.clear();
  javaIndexCache = null;
  walkCache = null;
}

/** 打开某档的 yarn 映射层，返回 {exists, era, usable, why, kind}。 */
function mappingLeg(platform, version) {
  const key = `${platform}_${version}`;
  if (legCache.has(key)) return legCache.get(key);
  const leg = { exists: false, era: null, usable: false, kind: "NO_MAPPING_LAYER", why: "无 yarn-mappings.sqlite" };
  legCache.set(key, leg);
  const file = path.join(ROOT, "data", key, "mappings", "yarn-mappings.sqlite");
  if (!fs.existsSync(file)) return leg;
  leg.exists = true;
  let db;
  try {
    db = new DatabaseSync(file, { readOnly: true });
  } catch {
    leg.kind = "BAD_MAPPING_LAYER";
    leg.why = "yarn-mappings.sqlite 打不开";
    return leg;
  }
  try {
    leg.era = db.prepare("select value from meta where key='mappingEra'").get()?.value ?? null;
  } catch {
    leg.era = null;
  }
  if (!YARN_ERAS.has(leg.era)) {
    db.close();
    leg.kind = "BAD_MAPPING_LAYER";
    leg.why = `mappingEra=${leg.era ?? "(无 meta)"}，不是 yarn 名，不得当签名来源`;
    return leg;
  }
  let rows = 0;
  try {
    rows = db.prepare("select count(*) c from methods").get().c;
  } catch {
    rows = 0;
  }
  if (!rows) {
    db.close();
    leg.kind = "BAD_MAPPING_LAYER";
    leg.why = `yarn 档但 methods 表 ${rows} 行 ⇒ 映射层空转，不得据此判签名`;
    return leg;
  }
  dbCache.set(key, db);
  leg.usable = true;
  leg.kind = "OK";
  leg.why = `yarn 映射（methods ${rows} 行）`;
  return leg;
}

/** 查目标类简名 owner + 方法名 → 描述符数组（可能重载）。null = 未判定；[] = 库里确实没这个名。 */
function descriptors(platform, version, simpleClass, methodName) {
  const db = dbCache.get(`${platform}_${version}`);
  if (!db) return null;
  const rows = db
    .prepare("select distinct descriptor_named from methods where name_named = ? and owner_named like ?")
    .all(methodName, `%${simpleClass}`);
  return rows.map((r) => String(r.descriptor_named ?? ""));
}

/** 从 @Mixin(...) 参数里解目标类简名。支持 X.class / value={A.class,B.class} / targets="a.b.C"。 */
function mixinTargets(src) {
  const out = [];
  for (const m of src.matchAll(/@Mixin\s*\(([^)]*(?:\{[^}]*\})[^)]*|[^)]*)\)/g)) {
    const arg = m[1];
    const names = [...arg.matchAll(/([A-Za-z_$][\w$]*)\s*\.\s*class\b/g)].map((c) => c[1]);
    if (!names.length) {
      for (const s of arg.matchAll(/"([\w$.]+)"/g)) names.push(s[1].split(".").pop());
    }
    for (const simple of names) if (simple && !out.includes(simple)) out.push(simple);
  }
  return out;
}

/** 返回类型字母：`()V` → V；`()Lcom/x/Y;` → L；`(I)I` → I。 */
function returnKind(desc) {
  const i = desc.lastIndexOf(")");
  if (i < 0) return null;
  return desc.slice(i + 1)[0] || null;
}

/** 扫一个 java 文件里的 @Inject 注入点。 */
function scanFile(rel) {
  const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const parts = rel.split("/");
  const platform = parts[0];
  // S1b：平台根 scaffold（<平台>/scaffold/...）没有版本档。旧代码把 version 解成字符串
  // "scaffold"（潜伏 bug，今日被 NO_YARN_PLATFORM 早退掩盖）⇒ 置 null，由 judge() 落 PLATFORM_ROOT_SCAFFOLD。
  const version = parts[1] === "scaffold" ? null : parts[1];
  const res = { rel, platform, version, targets: [], injects: [], shape: "mixin-file" };
  if (!/@Mixin\s*\(/.test(src) && !/@Inject\s*\(/.test(src)) {
    res.shape = "no-mixin-target";
    return res;
  }
  res.targets = mixinTargets(src);
  const lines = src.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (!/@Inject\s*\(/.test(lines[i])) continue;
    // 注解可能跨行：累加到括号配平
    let depth = 0;
    let j = i;
    let buf = "";
    for (; j < lines.length; j++) {
      buf += lines[j] + "\n";
      for (const ch of lines[j]) {
        if (ch === "(") depth++;
        else if (ch === ")") depth--;
      }
      if (depth <= 0) break;
    }
    const methods = [];
    const mm = buf.match(/method\s*=\s*(\{[^}]*\}|"(?:[^"\\]|\\.)*")/);
    if (mm) {
      for (const s of mm[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)) methods.push(s[1]);
    }
    // 方法声明体：注解之后到下一个 { 之间
    const after = lines.slice(j).join("\n");
    const body = after.split("{")[0] || "";
    res.injects.push({
      line: i + 1,
      declLine: j + 1,
      methods,
      // S1b：死字段 ci 删除 —— judge() 只读 cbir，ci 从未参与判定，留着装点违反「不留死代码」。
      cbir: /CallbackInfoReturnable/.test(body),
      raw: body.replace(/\s+/g, " ").trim(),
    });
    i = j;
  }
  return res;
}

/** 判定：返回 {verdict, detail}；verdict ∈ OK | VIOLATION | UNRESOLVED | NO_MAPPING_LAYER | BAD_MAPPING_LAYER | NO_YARN_PLATFORM | PLATFORM_ROOT_SCAFFOLD（+ 旧清单里的 NO_MIXIN_METHODS 从未产生，已删名） */
function judge(scan) {
  const out = [];
  if (scan.shape === "no-mixin-target") return out;
  // S1b：平台根 scaffold 无版本档，根本不查映射层（查了也是拿 "scaffold" 当版本拼数据目录名）。
  const leg = scan.version ? mappingLeg(scan.platform, scan.version) : { exists: false, usable: false, kind: "PLATFORM_ROOT_SCAFFOLD", why: "平台根 scaffold，无版本档" };
  for (const inj of scan.injects) {
    const rec = { rel: scan.rel, version: scan.version, line: inj.line, methods: inj.methods, cbir: inj.cbir };
    if (!inj.methods.length) {
      out.push({ ...rec, verdict: "UNRESOLVED", detail: "该 @Inject 未写出 method= 目标名，本门无法判定" });
      continue;
    }
    if (!scan.targets.length) {
      out.push({ ...rec, verdict: "UNRESOLVED", detail: "文件里解不出 @Mixin 目标类，无法定位 owner" });
      continue;
    }
    let verdict = null;
    const notes = [];
    for (const m of inj.methods) {
      const dot = m.indexOf("(");
      const name = dot < 0 ? m : m.slice(0, dot);
      const explicitDesc = dot < 0 ? null : m.slice(dot);
      let descs;
      let srcKind;
      if (explicitDesc) {
        descs = [explicitDesc];
        srcKind = "显式描述符";
      } else {
        // S1b：version 检查在平台检查之前 —— 平台根 scaffold 的「无版本档」比「非 yarn 平台」更根本，
        // 不得再被 NO_YARN_PLATFORM 早退掩盖。
        if (!scan.version) {
          verdict = "PLATFORM_ROOT_SCAFFOLD";
          notes.push("平台根 scaffold（<平台>/scaffold/，非 <平台>/<版本>/scaffold/）⇒ 无版本档可查，未判定（S1b：此前被误解成 version=\"scaffold\"）");
          break;
        }
        if (!YARN_PLATFORMS.has(scan.platform)) {
          verdict = "NO_YARN_PLATFORM";
          notes.push(`${scan.platform} 平台无 yarn 映射层，未判定`);
          break;
        }
        if (!leg.exists) {
          verdict = "NO_MAPPING_LAYER";
          notes.push(leg.why);
          break;
        }
        if (!leg.usable) {
          verdict = "BAD_MAPPING_LAYER";
          notes.push(leg.why);
          break;
        }
        const all = scan.targets.flatMap((t) => descriptors(scan.platform, scan.version, t, name) ?? []);
        if (!all.length) {
          verdict = "UNRESOLVED";
          notes.push(`本档 yarn 映射查无 ${scan.targets.join("/")}.${name} ⇒ 未判定（不判红也不判绿）`);
          break;
        }
        descs = all;
        srcKind = "本档 yarn 映射";
      }
      const kinds = new Set(descs.map(returnKind).filter(Boolean));
      if (!kinds.size) {
        verdict = "UNRESOLVED";
        notes.push(`描述符 ${descs.join("|")} 解不出返回类型 ⇒ 未判定`);
        break;
      }
      const isVoid = [...kinds].every((k) => k === "V");
      if (isVoid && inj.cbir) {
        verdict = "VIOLATION";
        notes.push(`目标 ${name} 返回 void（${descs.join("|")}，来源 ${srcKind}），注入点必须用 CallbackInfo，实写 CallbackInfoReturnable`);
      } else if (!isVoid && !inj.cbir) {
        verdict = "VIOLATION";
        notes.push(`目标 ${name} 返回 ${[...kinds].join("/")}（${descs.join("|")}，来源 ${srcKind}），注入点必须用 CallbackInfoReturnable，实写 CallbackInfo`);
      } else {
        notes.push(`${name} → ${descs.join("|")}（${srcKind}）注入类型一致`);
      }
    }
    out.push({ ...rec, verdict: verdict ?? "OK", detail: notes.join("；") });
  }
  return out;
}

/* ───────────────────────── S1d 采集器：一条文件采集腿 + 双链注册面 ───────────────────────── */

/** 守卫平台（R29 ③，2026-09-24 裁定）：只有 fabric / quilt 的 mixin 注册面是「元数据 mixins 键 + resources 配置文件」。
 *  neoforge / forge 走 build.gradle 的 mixin.config 声明面（S15 对账），liteloader / rift / modloader 按裁定无 mixin 面。
 *  采集器全平台采集（采到 ≠ 静默跳过），面外平台**不判** A/B/C/D，只在汇总点名为「面外」。 */
const MIXIN_PLATFORMS = new Set(["fabric", "quilt"]);
/** mixin 配置里会被展开成注册条目的三个集合键（client / server / mixins）。 */
const MIXIN_LISTS = ["client", "server", "mixins"];

/** R49 口径：data 子树是上游原文语料，永不参与守卫；平台树里的 reference 工程是文档示例、没有注册面
 *  （采集只认平台目录下的 scaffold 子树）。这里显式再挡一道，防「语料里一个同名文件」把守卫带偏。 */
function inCorpusFace(rel) {
  return rel === "data" || rel.startsWith("data/") || rel.includes("/data/");
}

/** 仓库根下参与扫描的平台目录（排除 .git / dist / data 语料面等）。 */
function rootDirs() {
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !SKIP_DIRS.has(e.name) && !inCorpusFace(e.name))
    .map((e) => e.name + "/");
}

let walkCache = null;
/** 全仓唯一的文件采集器：java 腿与 mixin 腿共用同一个 walk、同一份排除表。
 *  （S1d 缺陷② 的根因正是两条腿各走各的口径：mixin 腿的 java 索引比 java 腿窄一层源码集。） */
function walkScaffoldFiles() {
  if (walkCache) return walkCache;
  const out = [];
  const isWin = process.platform === "win32";
  const rootList = rootDirs();
  const rootsRe = new RegExp("^(?:" + rootList.map(reEsc).join("|") + ")");
  (function walk(dir, relDir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === "." || e.name === "..") continue;
      const abs = path.join(dir, e.name);
      const rel = (relDir ? relDir + "/" : "") + (isWin ? e.name.replace(/\\/g, "/") : e.name);
      if (e.isDirectory()) {
        if (SKIP_DIRS.has(e.name) || inCorpusFace(rel)) continue;
        walk(abs, rel);
      } else if (/(^|\/)scaffold\//.test(rel) && rootsRe.test(rel) && /\.(java|json)$/.test(rel)) {
        out.push(rel);
      }
    }
  })(ROOT, "");
  const uniq = [...new Set(out)];
  if (uniq.length !== out.length) throw new Error("采集器对同一路径命中两次（roots 前缀重叠）——普查口径不可信，必须修");
  walkCache = uniq.sort();
  return walkCache;
}

/** 列出全仓 scaffold 下的 java 文件：**走与 mixin 腿同一个采集器**（S1d 缺陷②）。 */
function listScaffoldJava() {
  return walkScaffoldFiles().filter((f) => f.endsWith(".java"));
}

/** scaffold 根（形如 平台/版本/scaffold）；不在 scaffold 下 ⇒ null。 */
function scaffoldRootOf(rel) {
  const i = rel.indexOf("/scaffold/");
  return i < 0 ? null : rel.slice(0, i + "/scaffold".length);
}

/** 平台根 scaffold（平台/scaffold/...）没有版本档 ⇒ version=null（S1b 口径，两条腿共用）。 */
function versionOfRoot(rel) {
  const parts = rel.split("/");
  return parts[1] === "scaffold" ? null : parts[1];
}

const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** package → 目录正则源：整段 ${...} 占位 = ≥1 段目录（${maven_group}→com/example）；字面段精确。 */
function pkgRegexSrc(pkg) {
  return pkg.split(".").map((seg) => (/^\$\{[^}]*\}$/.test(seg) ? "(?:[^/]+/)+" : reEsc(seg) + "/")).join("");
}

/** java 文件 → 索引项：cls = 包限定的斜杠类路径（含 .java），srcSet = 该文件所属源码集形状。 */
function javaIndexEntry(rel) {
  const root = scaffoldRootOf(rel);
  if (!root) return null;
  const segs = rel.slice(root.length + 1).split("/");
  const j = segs.lastIndexOf("java");
  return {
    root,
    cls: (j < 0 ? segs : segs.slice(j + 1)).join("/"),
    srcSet: j < 0 ? "(无 java 段)" : (segs.slice(0, j).join("/") || "(顶层 java)"),
  };
}

let javaIndexCache = null;
/** 每个 scaffold 根 → **全部源码集**的类路径集合（S1d：与 listScaffoldJava 同一采集器、同一口径）。 */
function scaffoldJavaIndex() {
  if (javaIndexCache) return javaIndexCache;
  const byRoot = new Map();
  const srcSets = new Map();
  for (const rel of listScaffoldJava()) {
    const e = javaIndexEntry(rel);
    if (!e) continue;
    if (!byRoot.has(e.root)) {
      byRoot.set(e.root, new Set());
      srcSets.set(e.root, new Set());
    }
    byRoot.get(e.root).add(e.cls);
    srcSets.get(e.root).add(e.srcSet);
  }
  javaIndexCache = { byRoot, srcSets };
  return javaIndexCache;
}

/** 辅链（S1d 结构式探测）：内容含非空 package 且含 client/server/mixins 任一**数组**键 ⇒ 视为 mixin 配置。 */
function isMixinConfigShape(o) {
  return (
    !!o &&
    typeof o === "object" &&
    typeof o.package === "string" &&
    o.package.length > 0 &&
    MIXIN_LISTS.some((k) => Array.isArray(o[k]))
  );
}

function readJson(rel) {
  try {
    return { o: JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8")) };
  } catch (err) {
    return { err: err.message };
  }
}

/** 占位符真值：只取该 scaffold 根 gradle.properties 里**非占位**的值（fabric scaffold 自己的 id 也是占位）。 */
function gradleProps(root) {
  const p = path.join(ROOT, root, "gradle.properties");
  if (!fs.existsSync(p)) return {};
  const out = {};
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Za-z_][\w.]*)\s*=\s*(.+?)\s*$/.exec(line);
    if (m && !/\$\{/.test(m[2])) out[m[1]] = m[2];
  }
  return out;
}

/** 主链（S1d 引用解析）：引用相对 resources 根定位配置文件；含占位的段按 gradle.properties 真值优先、否则按「一段」通配。
 *  ok = 唯一候选；missing = 盘上没有（真缺陷，规则D 判红）；ambiguous = 多候选（不猜）；invalid = 形态非法。 */
function resolveRef(ref, resDir, props) {
  const norm = String(ref).replace(/^\.\//, "").replace(/\\/g, "/");
  if (!norm || norm.startsWith("/") || norm.split("/").some((s) => s === "..")) return { kind: "invalid", paths: [] };
  const pool = walkScaffoldFiles()
    .filter((f) => f.endsWith(".json") && f.startsWith(resDir + "/"))
    .map((f) => f.slice(resDir.length + 1));
  if (!/\$\{[^}]*\}/.test(norm)) return { kind: pool.includes(norm) ? "ok" : "missing", paths: pool.includes(norm) ? [resDir + "/" + norm] : [] };
  let re;
  try {
    re = new RegExp(
      "^" +
        norm
          .split("/")
          .map((seg) =>
            seg
              .split(/(\$\{[^}]*\})/)
              .map((p) => {
                if (!/^\$\{[^}]*\}$/.test(p)) return reEsc(p);
                const v = props[p.slice(2, -1)];
                return v ? reEsc(v) : "[^/]+";
              })
              .join(""),
          )
          .join("/") +
        "$",
    );
  } catch {
    return { kind: "invalid", paths: [] };
  }
  const cands = pool.filter((r) => re.test(r)).map((r) => resDir + "/" + r);
  if (cands.length === 1) return { kind: "ok", paths: cands };
  return { kind: cands.length ? "ambiguous" : "missing", paths: cands };
}

/** 元数据里的 mixin 引用键：fabric 档 = mixins 键；quilt 档**现读**含 mixin 的数组键名，读不到就上未核实名单（不猜键名）。 */
function metaMixinRefs(metaRel, o) {
  const base = path.posix.basename(metaRel);
  if (base === "fabric.mod.json") {
    if (o.mixins === undefined) return { found: [], absent: null };
    if (!Array.isArray(o.mixins)) return { found: [], absent: "fabric.mod.json 的 mixins 不是数组 ⇒ 主链未判定" };
    return { found: [{ key: "mixins", where: "fabric.mod.json", list: o.mixins.filter((x) => typeof x === "string") }], absent: null };
  }
  const found = [];
  for (const k of Object.keys(o)) if (/mixin/i.test(k) && Array.isArray(o[k])) found.push({ key: k, where: k, list: o[k].filter((x) => typeof x === "string") });
  const ql = o.quilt_loader;
  if (ql && typeof ql === "object" && !Array.isArray(ql))
    for (const k of Object.keys(ql)) if (/mixin/i.test(k) && Array.isArray(ql[k])) found.push({ key: k, where: "quilt_loader." + k, list: ql[k].filter((x) => typeof x === "string") });
  return found.length
    ? { found, absent: null }
    : { found, absent: "quilt.mod.json 内未发现任何 mixin 引用键 ⇒ 键名未在本仓核实，不猜（QUILT_MIXIN_KEY_UNVERIFIED）" };
}

/**
 * 双链合并的 mixin 配置采集（S1d 缺陷①）。返回：
 *   files         守卫面（fabric/quilt）纳入 A/B/C 判定的配置文件（主链解析 ∪ 辅链结构探测，去重）
 *   refRecords    主链每条引用的判定记录（规则D，含悬空引用判红）
 *   refs          守卫面解析到的引用条数（地板口径之一）
 *   auxFiles      辅链结构探测命中数（汇总回显，证明「不靠后缀名单」）
 *   unverified    未核实事实（quilt 键名核不到等）—— 不猜、不判、但必须打印
 *   offFace       面外平台采到的配置（只点名，不判）
 *   unreferenced  在盘、结构上像 mixin 配置、却无任何元数据引用（事实点名，不判红）
 */
function scaffoldMixinConfigs() {
  const all = walkScaffoldFiles();
  const byRoot = new Map();
  for (const f of all) {
    const r = scaffoldRootOf(f);
    if (!r) continue;
    if (!byRoot.has(r)) byRoot.set(r, []);
    byRoot.get(r).push(f);
  }
  const files = [];
  const refRecords = [];
  const offFace = [];
  const unreferenced = [];
  const unverified = [];
  let refs = 0;
  let auxFiles = 0;
  for (const root of [...byRoot.keys()].sort()) {
    const platform = root.split("/")[0];
    const inFace = MIXIN_PLATFORMS.has(platform);
    const props = gradleProps(root);
    const resolved = new Set();
    // 主链：mod 元数据的 mixin 引用
    if (inFace) {
      for (const mf of byRoot.get(root).filter((f) => /\/(fabric|quilt)\.mod\.json$/.test(f))) {
        const { o, err } = readJson(mf);
        if (err || !o || typeof o !== "object") {
          refRecords.push({ kind: "ref", rel: mf, platform, version: versionOfRoot(root), list: "ref", entry: null, verdict: "UNRESOLVED", detail: "mod 元数据 JSON 解析失败 ⇒ 主链未判定" });
          continue;
        }
        const { found, absent } = metaMixinRefs(mf, o);
        if (absent) unverified.push(mf + "：" + absent);
        const resDir = mf.slice(0, mf.lastIndexOf("/"));
        for (const { key, where, list } of found) {
          for (const ref of list) {
            refs++;
            const rec = { kind: "ref", rel: mf, platform, version: versionOfRoot(root), list: "ref:" + key, entry: ref, verdict: "OK", detail: "" };
            const r = resolveRef(ref, resDir, props);
            if (r.kind === "ok") {
              resolved.add(r.paths[0]);
              rec.detail = "规则D：" + where + " 的引用 " + JSON.stringify(ref) + " 解析到 " + r.paths[0];
            } else if (r.kind === "missing") {
              rec.verdict = "VIOLATION";
              rec.detail = "规则D [MIXIN_CONFIG_ABSENT]：" + where + " 引用 " + JSON.stringify(ref) + "，在 " + resDir + " 下解析不到任何配置文件 ⇒ 注册面指向不存在的 mixin 配置（ghost 引用）";
            } else if (r.kind === "ambiguous") {
              for (const p of r.paths) resolved.add(p);
              rec.verdict = "UNRESOLVED";
              rec.detail = "规则D：" + JSON.stringify(ref) + " 命中 " + r.paths.length + " 个候选 ⇒ 歧义不猜";
            } else {
              rec.verdict = "UNRESOLVED";
              rec.detail = "规则D：引用 " + JSON.stringify(ref) + " 形态非法（绝对路径 / 越界 / 空）⇒ 未判定";
            }
            refRecords.push(rec);
          }
        }
      }
    }
    // 辅链：结构式探测（覆盖「文件在盘但没人引用」的孤儿形状 + 任意配置文件名）
    const aux = [];
    for (const rel of byRoot.get(root).filter((f) => f.endsWith(".json") && /(^|\/)resources\//.test(f) && !/\/(fabric|quilt)\.mod\.json$/.test(f))) {
      const base = rel.slice(rel.lastIndexOf("/") + 1);
      const named = /\.mixins\.json$/.test(base);
      const { o, err } = readJson(rel);
      if (err) {
        if (named) aux.push(rel);
        continue;
      }
      if (isMixinConfigShape(o) || named) aux.push(rel);
    }
    if (inFace) auxFiles += aux.length;
    const guarded = new Set([...aux, ...resolved]);
    if (!inFace) {
      for (const f of [...guarded].sort()) offFace.push(f);
      continue;
    }
    for (const f of [...guarded].sort()) {
      if (!resolved.has(f)) unreferenced.push(f);
      files.push(f);
    }
  }
  return { files, refRecords, refs, auxFiles, unverified, offFace, unreferenced };
}

/**
 * mixin 配置内容判定（S1b 规则 A/B/C + S1d 索引口径与采集器前置）。
 * **不判定 client/server 归属** —— 门没有 client/server 类分类法，宁可少判，不可误判。
 * 非字符串条目（对象形态 mixin）判 UNRESOLVED，不判红。
 */
function judgeMixinsFile(rel) {
  const out = [];
  const parts = rel.split("/");
  const platform = parts[0];
  const version = parts[1] === "scaffold" ? null : parts[1];
  const rec = (list, entry, verdict, detail) => out.push({ kind: "mixins-json", rel, platform, version, list, entry, verdict, detail });
  let o;
  try {
    o = JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
  } catch (err) {
    rec("file", null, "UNRESOLVED", "JSON 解析失败：" + err.message + "（注册面未判定，只点名）");
    return out;
  }
  if (typeof o.package !== "string" || !o.package) {
    rec("package", o.package ?? null, "UNRESOLVED", "package 缺失或非字符串 ⇒ 注册面未判定");
    return out;
  }
  const scaffold = scaffoldRootOf(rel);
  const idx = scaffoldJavaIndex();
  const javaSet = idx.byRoot.get(scaffold) || new Set();
  const collectedJava = listScaffoldJava().filter((f) => scaffoldRootOf(f) === scaffold).length;
  if (javaSet.size === 0 && collectedJava > 0) {
    rec("java-index", null, "COLLECTOR_GAP", "采集器缺口：该 scaffold 根下采到 " + collectedJava + " 个 .java、java 索引却出 0 个类 ⇒ 索引口径退化（S1d 缺陷②），A/B/C 未判");
    return out;
  }
  const pkgSrc = pkgRegexSrc(o.package);
  const lastSeg = o.package.split(".").pop();
  const tail = /^\$\{/.test(lastSeg) ? null : lastSeg;
  const srcSetTxt = [...(idx.srcSets.get(scaffold) || [])].sort().join(" + ");
  let pkgDirHit = false;
  const pkgDirRe = new RegExp("^" + pkgSrc + ".+$");
  for (const p of javaSet) if (pkgDirRe.test(p)) { pkgDirHit = true; break; }
  if (!pkgDirHit)
    rec("package", o.package, "VIOLATION", "规则B：package " + JSON.stringify(o.package) + " 在该 scaffold 的 java 索引里无落点目录（源码集 " + srcSetTxt + " 共 " + javaSet.size + " 类）");
  for (const list of MIXIN_LISTS) {
    const arr = o[list];
    if (arr === undefined) continue;
    if (!Array.isArray(arr)) {
      rec(list, null, "UNRESOLVED", "该集合不是数组 ⇒ 未判定");
      continue;
    }
    for (const e of arr) {
      if (typeof e !== "string") {
        rec(list, e, "UNRESOLVED", "条目非字符串 ⇒ 未判定（宁可少判）");
        continue;
      }
      if (/\$\{/.test(e)) {
        rec(list, e, "VIOLATION", "规则C双前缀：条目必须是相对名，却带占位前缀 —— package=" + o.package + " 已含此前缀，正是 fabric/1.21.11 修掉的形状");
        continue;
      }
      if (tail && (e === tail || e.startsWith(tail + "."))) {
        rec(list, e, "VIOLATION", "规则C双前缀：package 尾段 \"" + tail + "\" 在条目 " + JSON.stringify(e) + " 中重复 ⇒ 拼出多一层 " + tail + "/ 的路径；条目必须是相对名");
        continue;
      }
      const entryRe = new RegExp("^" + pkgSrc + e.split(".").map(reEsc).join("/") + "[.]java$");
      let hit = false;
      for (const p of javaSet) if (entryRe.test(p)) { hit = true; break; }
      if (hit) rec(list, e, "OK", "规则A：条目可解析");
      else rec(list, e, "VIOLATION", "规则A：package " + o.package + " + 条目 " + JSON.stringify(e) + " 拼出的类在本 scaffold java 索引（源码集 " + srcSetTxt + "）里无对应 .java（Mixin apply 才炸，编译期无声）");
    }
  }
  return out;
}

function runScan() {
  const files = listScaffoldJava();
  const cfg = scaffoldMixinConfigs();
  const records = [];
  const jsonRecords = [...cfg.refRecords];
  let mixinFiles = 0;
  let platformRootJava = 0;
  for (const f of files) {
    const scan = scanFile(f);
    if (scan.version === null) platformRootJava++;
    if (scan.shape === "no-mixin-target") continue;
    mixinFiles++;
    records.push(...judge(scan));
  }
  for (const j of cfg.files) jsonRecords.push(...judgeMixinsFile(j));
  // 地板口径：①腿 = records.length；②腿 = 内容判定条数（不含引用/未引用两类）+ 配置数 + 引用数，各自一条地板。
  const entryRecords = jsonRecords.filter((r) => r.kind === "mixins-json").length;
  const refRecords = jsonRecords.filter((r) => r.kind === "ref").length;
  const javaIndexed = [...scaffoldJavaIndex().byRoot.values()].reduce((n, s) => n + s.size, 0);
  return { files, mixinFiles, platformRootJava, records, jsonRecords, cfg, entryRecords, refRecords, javaIndexed };
}

const RED_VERDICTS = new Set(["VIOLATION", "BAD_MAPPING_LAYER", "COLLECTOR_GAP"]);
/** 「分支样本」点名单：真树 0 样本 ⇒ 汇总行声明「仅夹具覆盖」；有分支代码 ≠ 有行为证明。 */
const BRANCH_TRACKED = ["NO_MAPPING_LAYER", "NO_YARN_PLATFORM", "PLATFORM_ROOT_SCAFFOLD"];

/* ───────────────────────── 采集面地板（S1c：绿门 ≠ 全普查；S1d 换双链口径） ───────────────────────── */

/** 地板口径与实扫值的时间戳；判红消息里的实扫数永远当场重算，AS_OF 只是这组地板的来处。 */
const AS_OF = "2026-09-24 工作树（HEAD 9141eed5，S1d 双链口径实扫）";
/** ①注入形状腿地板 = runScan().records.length（判定出的 @Inject 条数，**不是** java 文件数）。 */
const FLOOR_INJECT_POINTS = 20;
/** ②腿·配置数地板 = runScan().cfg.files.length（主链 ∪ 辅链去重后的守卫面配置文件数）。 */
const FLOOR_MIXIN_CONFIGS = 10;
/** ②腿·注册条目地板 = runScan().entryRecords.length（package + client/server/mixins 展开出的内容判定条数）。 */
const FLOOR_MIXIN_ENTRIES = 20;
/** ②腿·主链引用地板 = runScan().cfg.refs.length（fabric.mod.json mixins 数组解析出的引用条数，S1d 新增）。 */
const FLOOR_MIXIN_REFS = 10;

const LEG1 = "①注入形状腿(listScaffoldJava)";
const LEG2 = "②mixins注册面腿(scaffoldMixinConfigs：主链 mixins 引用 ∪ 辅链结构式探测)";
const CLEAN_IS_NOT_THE_POINT = "这是采集器失效，不是代码干净。";

/**
 * 采集面审计：①腿三环（文件 / 内容筛后 / 判定条数）+ ②腿三段链（元数据引用 / 配置采集 / 条目判定）
 * 各自的「扫到 0」与「低于地板」。返回 [{code, detail}]；非空 ⇒ main 必须 exit 非 0 且**不得**打 ok 行。
 */
function collectorAudit(s) {
  const problems = [];
  const zero = (leg, stage, actual, extra, code) =>
    problems.push({
      code: code || "COLLECTOR_RETURNED_ZERO",
      detail: leg + "：" + stage + " 扫到 0（" + actual + "）⇒ " + CLEAN_IS_NOT_THE_POINT + (extra ? " " + extra : ""),
    });
  const below = (leg, caliber, floor, actual) =>
    problems.push({
      code: "COVERAGE_BELOW_FLOOR",
      detail: leg + "：" + caliber + " 地板 " + floor + " ⇒ 当前实扫 " + actual + "（口径见文件头 S1c/S1d 段；地板 by " + AS_OF + " 实扫 " + floor + "）——采集面退化到地板以下就是普查没做完。",
    });
  if (s.files.length === 0) zero(LEG1, "scaffold java 文件", "walkScaffoldFiles → 0");
  else if (s.mixinFiles === 0)
    zero(LEG1, "内容筛 @Mixin(|@Inject( 后文件", "scaffold java " + s.files.length + " → 含注入 " + s.mixinFiles, "多半是内容正则或文件正则退化。");
  else if (s.records.length === 0) zero(LEG1, "judge() 产出的注入点", "含注入文件 " + s.mixinFiles + " → 注入点 " + s.records.length, "多半是 @Inject 注解解析退化。");
  else if (s.records.length < FLOOR_INJECT_POINTS) below(LEG1, "注入点条数", FLOOR_INJECT_POINTS, s.records.length);
  // ②腿三段链（S1d）：元数据引用 → 配置采集 → 内容判定，任何一环退化都必须被抓，不得由后一环掩盖前一环。
  if (s.cfg.refs === 0)
    zero(LEG2, "元数据 mixins 引用（主链）", "主链 refs → 0", "注册面一条引用都没解析到 ⇒ 主链失明；配置文件名后缀不是采集依据（S1d 缺陷①）。", "REFS_RETURNED_ZERO");
  else if (s.cfg.refs < FLOOR_MIXIN_REFS) below(LEG2, "元数据引用条数", FLOOR_MIXIN_REFS, s.cfg.refs);
  if (s.cfg.files.length === 0)
    zero(LEG2, "mixin 配置文件（主链 ∪ 辅链）", "scaffoldMixinConfigs → 0", "当年真缺陷形状：后缀名单 + 路径正则 ⇒ 全盘 0 命中而门照样报绿。");
  else if (s.entryRecords === 0) zero(LEG2, "展开的注册条目", s.cfg.files.length + " 个配置 → 条目 0", "文件在但 package/client/server/mixins 没解析出条目。");
  else if (s.entryRecords < FLOOR_MIXIN_ENTRIES) below(LEG2, "注册条目数", FLOOR_MIXIN_ENTRIES, s.entryRecords);
  else if (s.cfg.files.length < FLOOR_MIXIN_CONFIGS) below(LEG2, "配置文件数", FLOOR_MIXIN_CONFIGS, s.cfg.files.length);
  if (s.javaIndexed === 0 && s.files.length > 0)
    zero(LEG2, "java 索引（规则A 的可解析性依据）", "scaffold java " + s.files.length + " → 索引 0 类", "S1d 缺陷②形状：索引口径比采集口径窄 ⇒ 全体条目会假红/假绿。");
  return problems;
}

/** 两腿「扫了几 / 判了几 / 拒了几」+ 地板，同屏可比（拒 = RED_VERDICTS 命中的判定条数）。 */
function censusLine(s) {
  const rejected = (arr) => arr.filter((r) => RED_VERDICTS.has(r.verdict)).length;
  return (
    "采集普查 " + LEG1 + "：扫 " + s.files.length + " 个 scaffold java / " + s.mixinFiles + " 个含注入（java 索引 " + s.javaIndexed + " 类） · 判 " + s.records.length +
    " 注入点 · 拒 " + rejected(s.records) + " （地板 " + FLOOR_INJECT_POINTS + "，by " + AS_OF + " 实扫 " + FLOOR_INJECT_POINTS + "）｜" +
    LEG2 + "：采 " + s.cfg.files.length + " 个配置（主链 " + s.cfg.refs + " 引用 · 辅链 " + s.cfg.auxFiles + " 命中）· 判 " +
    s.entryRecords + " 条 + " + s.refRecords + " 引用判定 · 拒 " + rejected(s.jsonRecords) +
    " （地板 条目 " + FLOOR_MIXIN_ENTRIES + " / 配置 " + FLOOR_MIXIN_CONFIGS + " / 引用 " + FLOOR_MIXIN_REFS + "，by " + AS_OF +
    " 实扫 " + FLOOR_MIXIN_ENTRIES + "/" + FLOOR_MIXIN_CONFIGS + "/" + FLOOR_MIXIN_REFS + "）"
  );
}

const loc = (r) => (r.list === undefined ? r.rel + ":" + r.line : r.rel + " [" + r.list + ":" + JSON.stringify(r.entry) + "]");
const tally = (arr) =>
  Object.entries(
    arr.reduce((m, r) => {
      m[r.verdict] = (m[r.verdict] || 0) + 1;
      return m;
    }, {}),
  )
    .map(([k, v]) => k + ":" + v)
    .join(" · ") || "无";

function main() {
  const stats = runScan();
  const { files, mixinFiles, platformRootJava, records, jsonRecords, cfg } = stats;
  const all = [...records, ...jsonRecords];
  const red = all.filter((r) => RED_VERDICTS.has(r.verdict));
  const undetermined = all.filter((r) => r.verdict !== "OK" && !RED_VERDICTS.has(r.verdict));
  console.log("assert-scaffold-mixin-shape: " + censusLine(stats));
  const gaps = collectorAudit(stats);
  for (const g of gaps) console.error("assert-scaffold-mixin-shape: [" + g.code + "] " + g.detail);
  if (cfg.offFace.length)
    console.log(
      "assert-scaffold-mixin-shape: 面外 mixin 配置 " + cfg.offFace.length + " 个（R29 ③：注册面是 build.gradle 的 mixin.config，交 S15 对账；本门采到但**不判** A/B/C/D）：" + cfg.offFace.join(" · "),
    );
  if (cfg.unreferenced.length)
    console.log(
      "assert-scaffold-mixin-shape: 未引用配置 " + cfg.unreferenced.length + " 个（在盘、结构上是 mixin 配置，却无任何元数据引用 ⇒ 事实点名，**不判红**：Fabric 只加载 mixins 引用到的配置，但该不该引用需人核）：" +
        cfg.unreferenced.join(" · "),
    );
  if (red.length) {
    console.error(
      "assert-scaffold-mixin-shape: " + red.length + " 处违规（注入形状 " + records.filter((r) => RED_VERDICTS.has(r.verdict)).length +
        " / mixins注册面 " + jsonRecords.filter((r) => RED_VERDICTS.has(r.verdict)).length +
        "；共扫 " + files.length + " 个 scaffold java / " + mixinFiles + " 个含 @Mixin|@Inject / " + cfg.files.length + " 个 mixin 配置）：",
    );
    for (const r of red) console.error("  - [" + r.verdict + "] " + loc(r) + " " + r.detail);
    process.exit(1);
  }
  if (undetermined.length) {
    console.error("assert-scaffold-mixin-shape: 另有 " + undetermined.length + " 处**未判定**（既不判红也不判绿，须人工核）：");
    for (const r of undetermined) console.error("  ~ [" + r.verdict + "] " + loc(r) + " " + r.detail);
  }
  for (const u of cfg.unverified) console.error("assert-scaffold-mixin-shape: 未核实 [UNVERIFIED] " + u);
  if (gaps.length) {
    console.error(
      "assert-scaffold-mixin-shape: 采集面地板判红（" + gaps.length + " 条：" + [...new Set(gaps.map((g) => g.code))].join(" / ") + "），**未打 ok 行**——判定条数不成立时「0 违规」没有意义。",
    );
    process.exit(1);
  }
  console.log(
    "assert-scaffold-mixin-shape: ok（scaffold java " + files.length + " · 含注入 " + mixinFiles + " · 注入点 " + records.length + " [" + tally(records) +
      "] · mixin 配置 " + cfg.files.length + "（主链 " + cfg.refs + " 引用 / 辅链 " + cfg.auxFiles + " 命中 / 未引用 " + cfg.unreferenced.length + " / 面外 " + cfg.offFace.length +
      "）· 注册条目 " + stats.entryRecords + " [" + tally(jsonRecords) + "] · java 索引 " + stats.javaIndexed + " 类 · 平台根 scaffold java " + platformRootJava +
      "（version=null）· 未判定 " + undetermined.length + "）",
  );
  const vcount = {};
  for (const r of all) vcount[r.verdict] = (vcount[r.verdict] || 0) + 1;
  const zero = BRANCH_TRACKED.filter((v) => !vcount[v]);
  console.log(
    "assert-scaffold-mixin-shape: 分支样本（真树）" + BRANCH_TRACKED.map((v) => v + "=" + (vcount[v] || 0)).join(" · ") +
      " ⇒ 仅夹具覆盖、真树 0 样本：" + (zero.join(" ") || "无") +
      "；mixins 注册面判 A/B/C + D（引用可解析），**不判定 client/server 归属**；守卫平台 fabric/quilt",
  );
}

function selftest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mixin-shape-selftest-"));
  setRoot(tmp);
  const writeJava = (rel, body) => {
    const p = path.join(tmp, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, body, "utf8");
    return rel;
  };
  const mkDb = (key, era, rows, root = tmp) => {
    const dir = path.join(root, "data", key, "mappings");
    fs.mkdirSync(dir, { recursive: true });
    const db = new DatabaseSync(path.join(dir, "yarn-mappings.sqlite"));
    db.exec(
      "create table meta (key text primary key, value text);" +
        "create table classes (named text, intermediary text, official text);" +
        "create table methods (owner_named text, name_named text, descriptor_named text, name_official text, descriptor_official text, name_intermediary text);" +
        "create table fields (owner_named text, name_named text, descriptor_named text, name_official text, descriptor_official text, name_intermediary text);",
    );
    if (era) db.prepare("insert into meta values ('mappingEra',?)").run(era);
    for (const [owner, name, desc] of rows) {
      db.prepare("insert into methods values (?,?,?,?,?,?)").run(owner, name, desc, "a", desc, "method_1");
    }
    db.close();
  };
  const VOID_DESC = "(Ljava/util/function/BooleanSupplier;)V";
  mkDb("fabric_9.9.9", "yarn-tiny", [
    ["net/minecraft/server/MinecraftServer", "tick", VOID_DESC],
    ["net/minecraft/server/MinecraftServer", "tickWorlds", VOID_DESC],
    ["net/minecraft/client/MinecraftClient", "tick", "()V"],
    ["net/minecraft/server/MinecraftServer", "getRank", "()I"],
  ]);
  mkDb("fabric_7.7.7", "forge-srg", [["net/minecraft/server/MinecraftServer", "tick", VOID_DESC]]);
  mkDb("fabric_6.6.6", "yarn-tiny", []);

  const java = (cbType, method = "tick") =>
    `package com.example.examplemod.mixin;\n\nimport net.minecraft.server.MinecraftServer;\nimport org.spongepowered.asm.mixin.Mixin;\nimport org.spongepowered.asm.mixin.injection.At;\nimport org.spongepowered.asm.mixin.injection.Inject;\n\n@Mixin(MinecraftServer.class)\npublic class ExampleMixin {\n    @Inject(at = @At("HEAD"), method = "${method}")\n    private void onTick(${cbType}) {\n        // x\n    }\n}\n`;

  const cases = [];
  const push = (name, got, want) => cases.push([name, got, want]);
  const verdictOf = (rel) => runScanOn(rel);
  const runScanOn = (rel) => {
    const scan = scanFile(rel);
    return judge(scan);
  };

  // ① 正确写法（CallbackInfo 注 void）仍绿
  push(
    "① 正确写法 CallbackInfo 注 void ⇒ 0 红",
    verdictOf(writeJava("fabric/9.9.9/scaffold/src/main/java/com/example/examplemod/mixin/ExampleMixin.java", java("CallbackInfo ci"))).every((r) => r.verdict === "OK"),
    true,
  );
  // ② 把一行改回 CallbackInfoReturnable<Integer> 立即红
  const poison = verdictOf(
    writeJava("fabric/9.9.9/scaffold/src/main/java/com/example/examplemod/mixin/Poison.java", java("CallbackInfoReturnable<Integer> cir")),
  );
  push("② 投毒 CallbackInfoReturnable 注 void ⇒ 恰 1 红", poison.length === 1 && poison[0].verdict === "VIOLATION", true);
  push("② 红消息点名 void 描述符与 CallbackInfo", /void/.test(poison[0]?.detail || "") && /CallbackInfo/.test(poison[0]?.detail || "") && /BooleanSupplier/.test(poison[0]?.detail || ""), true);
  const poisonName = writeJava("fabric/9.9.9/scaffold/src/main/java/com/example/examplemod/mixin/PoisonWorlds.java", java("CallbackInfoReturnable<Integer> cir", "tickWorlds"));
  push("②b 真缺陷原形 tickWorlds + CIR<Integer> ⇒ 红", verdictOf(poisonName)[0].verdict === "VIOLATION", true);
  // ③ 无映射层的档 ⇒ NO_MAPPING_LAYER，而不是「解析失败」
  const nolib = verdictOf(
    writeJava("fabric/8.8.8/scaffold/src/main/java/com/example/examplemod/mixin/NoLayer.java", java("CallbackInfo ci")),
  );
  push("③ 无 yarn-mappings.sqlite ⇒ NO_MAPPING_LAYER", nolib.length === 1 && nolib[0].verdict === "NO_MAPPING_LAYER", true);
  push("③b 无映射层 ≠ UNRESOLVED", nolib[0].verdict !== "UNRESOLVED", true);
  // ④ 库可用但方法名查无 ⇒ UNRESOLVED（不判红）
  const unres = verdictOf(
    writeJava("fabric/9.9.9/scaffold/src/main/java/com/example/examplemod/mixin/Unknown.java", java("CallbackInfoReturnable<Boolean> cir", "notAMethodAnywhere")),
  );
  push("④ 映射查无名 ⇒ UNRESOLVED 且不为红", unres.length === 1 && unres[0].verdict === "UNRESOLVED", true);
  // ⑤ 非 void 目标：CBIR 绿 / CallbackInfo 红
  const nonVoidOk = verdictOf(writeJava("fabric/9.9.9/scaffold/src/main/java/x/NV1.java", java("CallbackInfoReturnable<Integer> cir", "getRank")));
  push("⑤ 非 void + CBIR ⇒ 绿", nonVoidOk[0].verdict === "OK", true);
  const nonVoidBad = verdictOf(writeJava("fabric/9.9.9/scaffold/src/main/java/x/NV2.java", java("CallbackInfo ci", "getRank")));
  push("⑤b 非 void + CallbackInfo ⇒ 红", nonVoidBad[0].verdict === "VIOLATION", true);
  // ⑥ 显式描述符当一手证据，不回查映射
  const explicit = verdictOf(
    writeJava("fabric/8.8.8/scaffold/src/main/java/x/Explicit.java", java("CallbackInfoReturnable<Boolean> cir", "tick(Ljava/util/function/BooleanSupplier;)V")),
  );
  push("⑥ method 带显式 )V 描述符 ⇒ 无库也判红", explicit[0].verdict === "VIOLATION", true);
  // ⑦ 错 mappingEra / 零行库 ⇒ 判红（不得拿假名背书）
  push("⑦ forge-srg 时代的库 ⇒ BAD_MAPPING_LAYER 红", verdictOf(writeJava("fabric/7.7.7/scaffold/src/main/java/x/Srg.java", java("CallbackInfo ci")))[0].verdict === "BAD_MAPPING_LAYER", true);
  const zero = verdictOf(writeJava("fabric/6.6.6/scaffold/src/main/java/x/Zero.java", java("CallbackInfoReturnable<Boolean> cir", "tick")));
  push("⑦b 零行 yarn 库 ⇒ BAD_MAPPING_LAYER 红（不得静默放行投毒）", zero[0].verdict === "BAD_MAPPING_LAYER", true);
  const writeMixins = (rel, obj) => {
    const p = path.join(tmp, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
    return rel;
  };
  // ⑨–⑯ mixins.json 注册面（S1b）：正确形状绿 + A/B/C 三条投毒必红 + 保守不判
  const goodMx = "fabric/9.9.9/scaffold/src/main/resources/examplemod.mixins.json";
  writeMixins(goodMx, { package: "${maven_group}.${mod_id}.mixin", client: [], server: [], mixins: ["ExampleMixin", "PoisonWorlds"] });
  push("⑨ mixins.json 现值形状（占位 package + 相对条目）⇒ 全 OK", judgeMixinsFile(goodMx).length === 2 && judgeMixinsFile(goodMx).every((r) => r.verdict === "OK"), true);
  const badA = judgeMixinsFile(writeMixins("fabric/9.9.9/scaffold/src/main/resources/badA.mixins.json", { package: "${maven_group}.${mod_id}.mixin", client: ["client.NoSuchMixin"], mixins: ["ExampleMixin"] }));
  push("⑩ 投毒不可解析条目 ⇒ 规则A 恰 1 红", badA.filter((r) => r.verdict === "VIOLATION").length === 1 && badA.some((r) => r.verdict === "VIOLATION" && /规则A/.test(r.detail) && r.entry === "client.NoSuchMixin"), true);
  const badC1 = judgeMixinsFile(writeMixins("fabric/9.9.9/scaffold/src/main/resources/badC1.mixins.json", { package: "${maven_group}.${mod_id}.mixin", client: ["${mod_id}.mixin.client.ExampleMixin"] }));
  push("⑪ 投毒 fabric/1.21.11 原缺陷双前缀 ⇒ 规则C 红", badC1.length === 1 && badC1[0].verdict === "VIOLATION" && /规则C/.test(badC1[0].detail), true);
  const badC2 = judgeMixinsFile(writeMixins("fabric/9.9.9/scaffold/src/main/resources/badC2.mixins.json", { package: "com.example.examplemod.mixin", client: ["mixin.ExampleMixin"] }));
  push("⑫ 字面量 package + 条目重复尾段 ⇒ 规则C 红", badC2.length === 1 && badC2[0].verdict === "VIOLATION" && /规则C/.test(badC2[0].detail), true);
  const badB = judgeMixinsFile(writeMixins("fabric/9.9.9/scaffold/src/main/resources/badB.mixins.json", { package: "com.nowhere.absent.mixin", client: [], server: [], mixins: [] }));
  push("⑬ package 无落点目录 ⇒ 规则B 红", badB.length === 1 && badB[0].verdict === "VIOLATION" && /规则B/.test(badB[0].detail), true);
  const objE = judgeMixinsFile(writeMixins("fabric/9.9.9/scaffold/src/main/resources/objEntry.mixins.json", { package: "${maven_group}.${mod_id}.mixin", mixins: [{ mixinClass: "ExampleMixin" }] }));
  push("⑭ 对象条目 ⇒ UNRESOLVED（宁可少判，不判红）", objE.length === 1 && objE[0].verdict === "UNRESOLVED", true);
  // ⑮ NO_YARN_PLATFORM：真树 0 样本 ⇒ 夹具必须走到该分支
  const noYarn = verdictOf(writeJava("forge/5.5.5/scaffold/src/main/java/x/ForgeInject.java", java("CallbackInfo ci")));
  push("⑮ 非 yarn 平台注入 ⇒ NO_YARN_PLATFORM 未判定（真树 0 样本，夹具覆盖）", noYarn.length === 1 && noYarn[0].verdict === "NO_YARN_PLATFORM", true);
  // ⑯ 平台根 scaffold：version=null 独立态，不再被解成 "scaffold"、不被 NO_YARN_PLATFORM 掩盖
  const rootScan = scanFile(writeJava("neoforge/scaffold/src/main/java/x/RootInject.java", java("CallbackInfo ci")));
  push("⑯a 平台根 scaffold 的 version=null（非 \"scaffold\"）", rootScan.version === null, true);
  const rootV = judge(rootScan);
  push("⑯b 平台根注入 ⇒ PLATFORM_ROOT_SCAFFOLD 未判定", rootV.length === 1 && rootV[0].verdict === "PLATFORM_ROOT_SCAFFOLD" && rootV[0].version === null, true);
  // ⑧ 全树跑一遍：真树有违规时 main 走 exit 1 的那条分支
  const all = runScan();
  push("⑧ 假根整体扫描 ≥5 条红（② ②b ⑤b ⑥ ⑦ ⑦b + mixins 投毒 ⑩⑪⑫⑬）", all.records.filter((r) => RED_VERDICTS.has(r.verdict)).length + all.jsonRecords.filter((r) => RED_VERDICTS.has(r.verdict)).length >= 5, true);

  /* ⑰–⑲ 采集面地板（S1c）：证明「发现器退化成扫 0 ⇒ 门立刻非 0」「低于地板 ⇒ 判红」，
   * 并留一条「正好落在地板上 ⇒ 仍绿」的对照组，防地板自己造出假红。
   * 三组各铺**独立假根**并跑**子进程 main()**（真 rc + 真 stderr/stdout），不是只调函数。 */
  const SELF = fileURLToPath(import.meta.url);
  const extraRoots = [];
  const wJavaIn = (root, rel, body) => {
    const p = path.join(root, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, body, "utf8");
  };
  const wJsonIn = (root, rel, obj) => {
    const p = path.join(root, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
  };
  const countOnDisk = (root, pred) => {
    let n = 0;
    (function w(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) w(p);
        else if (pred(e.name)) n++;
      }
    })(root);
    return n;
  };
  /** 铺假根（S1d 版）。mode：
   *   flat     —— 10 个 cfg<k>.json（**不带 .mixins.json 后缀**，形状全合法）+ fabric.mod.json 引用它们
   *   nest     —— 同上，但配置在 src/main/resources/mixin/ 子目录（旧 S1c「多一层目录」形状，新口径仍须采到）
   *   ghost    —— 配置在盘且形状合法，但**没有任何元数据引用** ⇒ 主链 refs=0（缺陷①投毒形状）
   *   blind    —— 配置连 package 键都没有 ⇒ 主链与辅链都采不到（COLLECTOR_RETURNED_ZERO 兜底形状）
   *   dangling —— 10 个配置 + fabric.mod.json 多引用一个盘上没有的文件 ⇒ 规则D 判红
   *   multisrc —— 10 个配置 + 类分布在 src/main/java、src/client/java、顶层 java/ 三个源码集 ⇒ 期望 rc 0（缺陷②）
   *  nEntries 是**注册条目总数**（均摊到 10 个配置里）；nRefs 条引用（flat/nest 用 10）。 */
  const mkShapeRoot = (label, nInj, nEntries, mode) => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "mixin-shape-selftest-" + label + "-"));
    extraRoots.push(root);
    mkDb("fabric_9.9.9", "yarn-tiny", [["net/minecraft/server/MinecraftServer", "tick", VOID_DESC]], root);
    const javaAt = (srcSet, cls, i) => wJavaIn(root, "fabric/9.9.9/scaffold/" + srcSet + "/com/example/examplemod/mixin/" + cls + ".java", java("CallbackInfo ci", i % 2 ? "tick" : "tick"));
    if (mode === "multisrc") {
      // 18 个在主源码集、1 个在 src/client/java、1 个在顶层 java/ ⇒ 旧口径只能索引到 18 个
      for (let i = 1; i <= 18; i++) javaAt("src/main/java", "M" + i, i);
      javaAt("src/client/java", "ClientMixin", 19);
      javaAt("java", "TopMixin", 20);
    } else {
      for (let i = 1; i <= nInj; i++) javaAt("src/main/java", "M" + i, i);
    }
    const res = "fabric/9.9.9/scaffold/src/main/resources";
    const names = [];
    const cfgEntries = [];
    for (let k = 1; k <= 10; k++) {
      const from = Math.floor(((k - 1) * nEntries) / 10);
      const to = Math.floor((k * nEntries) / 10);
      const list = [];
      for (let i = from; i < to; i++) list.push(mode === "multisrc" ? (i === 18 ? "ClientMixin" : i === 19 ? "TopMixin" : "M" + (i + 1)) : "M" + (i + 1));
      cfgEntries.push(list);
      names.push("cfg" + k + ".json");
    }
    const dir = res + (mode === "nest" ? "/mixin" : "");
    if (mode === "blind") {
      for (const n of names) wJsonIn(root, dir + "/" + n, { client: [] });
      return root;
    }
    for (let k = 0; k < 10; k++)
      wJsonIn(root, dir + "/" + names[k], { package: "com.example.examplemod.mixin", client: [], server: [], mixins: cfgEntries[k] });
    if (mode === "ghost") return root;
    const refsList = names.slice();
    if (mode === "nest") for (let i = 0; i < refsList.length; i++) refsList[i] = "mixin/" + refsList[i];
    if (mode === "dangling") refsList.push("no-such-config.json");
    wJsonIn(root, res + "/fabric.mod.json", { schemaVersion: 1, id: "examplemod", mixins: refsList });
    return root;
  };
  const runMainOn = (root) =>
    spawnSync(process.execPath, [SELF], {
      env: { ...process.env, MC_SKILL_MIXIN_SHAPE_ROOT: root },
      encoding: "utf8",
      windowsHide: true,
      timeout: 120000,
    });
  const codesIn = (txt, code) => (txt || "").split("[" + code + "]").length - 1;
  /** 在假根上跑**进程内**采集（口径探针；setRoot 负责清缓存）。 */
  const probeIn = (root, fn) => {
    const keep = ROOT;
    setRoot(root);
    let r;
    try {
      r = fn();
    } finally {
      setRoot(keep);
    }
    return r;
  };
  const countStructOnDisk = (root) => {
    let n = 0;
    (function w(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) w(p);
        else if (e.name.endsWith(".json")) {
          try {
            if (isMixinConfigShape(JSON.parse(fs.readFileSync(p, "utf8")))) n++;
          } catch {}
        }
      }
    })(root);
    return n;
  };

  /* ⑰（S1d 重写）双链采集口径：旧 ⑰a/⑰b/⑰c 钉的是「单链正则扫 0」，单链已被双链取代 ——
   * 旧夹具（把配置塞进 resources/mixin/ 子目录）在新口径下是**合法形状**（主链引用 + 辅链探测都命中），
   * 所以三条断言按新口径重写：ghost 文件（旧口径整类逃检）现在必须被辅链守卫，而主链归零必须判红。 */
  const fGhost = mkShapeRoot("ghost", FLOOR_INJECT_POINTS, FLOOR_MIXIN_ENTRIES, "ghost");
  const probeGhost = probeIn(fGhost, () => {
    const c = scaffoldMixinConfigs();
    return { files: c.files.length, refs: c.refs, unref: c.unreferenced.length, structOnDisk: countStructOnDisk(fGhost) };
  });
  const rGhost = runMainOn(fGhost);
  push(
    "⑰a 主链引用扫 0（10 个配置在盘、无人引用）⇒ 子进程 main() rc 非 0（实得 rc=" + rGhost.status + "）",
    rGhost.status !== 0 && rGhost.status !== null,
    true,
  );
  push(
    "⑰b 判红点名 ②腿 [REFS_RETURNED_ZERO] 恰 1 条 + 「采集器失效，不是代码干净」+ 未打 ok 行，且不冤枉 ①腿",
    codesIn(rGhost.stderr, "REFS_RETURNED_ZERO") === 1 &&
      /②mixins注册面腿/.test(rGhost.stderr || "") &&
      !/①注入形状腿/.test(rGhost.stderr || "") &&
      /采集器失效，不是代码干净/.test(rGhost.stderr || "") &&
      /未打 ok 行/.test(rGhost.stderr || ""),
    true,
  );
  push(
    "⑰c 缺陷①辅链补位：盘上 10 个结构合法配置（主链 refs=0）仍被采到并守卫（旧口径此处全盲），未引用只作事实",
    probeGhost.refs === 0 && probeGhost.files === 10 && probeGhost.structOnDisk === 10 && probeGhost.unref === 10,
    true,
  );
  // ⑰d 双链全盲兜底：配置连 package 键都没有 ⇒ 主链 0 引用 + 辅链 0 命中 ⇒ 仍判红（旧 COLLECTOR_RETURNED_ZERO 环没被删）
  const fBlind = mkShapeRoot("blind", FLOOR_INJECT_POINTS, 0, "blind");
  const probeBlind = probeIn(fBlind, () => ({ byGate: scaffoldMixinConfigs().files.length, onDisk: countOnDisk(fBlind, (n) => n.endsWith(".json")) }));
  const rBlind = runMainOn(fBlind);
  push("⑰d 夹具盘上确有 10 个 json 而双链采集 0 命中（形状 = 当年真缺陷的等价类）", probeBlind.byGate === 0 && probeBlind.onDisk >= 10, true);
  push(
    "⑰e 双链全盲 ⇒ COLLECTOR_RETURNED_ZERO 判红（实得 rc=" + rBlind.status + "）",
    rBlind.status !== 0 && codesIn(rBlind.stderr, "COLLECTOR_RETURNED_ZERO") === 1 && /②mixins注册面腿/.test(rBlind.stderr || ""),
    true,
  );
  /* ⑰f/⑰g 真树体检（S1d 二次修正）：只钉**不随并发漂移**的不变量 —— 采集面健康、两腿口径同屏、
   * 每个采到的 java 都进得了索引。真树此刻判不判红取决于别的代理有没有补齐映射层 / 配置（实测会漂），
   * 那不是本门该钉的东西，钉了就成了别人手里的假红源。 */
  const rReal = runMainOn(REPO_ROOT);
  push(
    "⑰f 真树采集面健康：两腿判定非零 + 三种地板判红码一个都不出现（采集退化才是本门要抓的）",
    /采集普查 ①注入形状腿[^\n]*判 [1-9]\d* 注入点/.test(rReal.stdout || "") &&
      /②mixins注册面腿[^\n]*采 [1-9]\d* 个配置（主链 [1-9]\d* 引用 · 辅链 [1-9]\d* 命中）· 判 [1-9]\d* 条/.test(rReal.stdout || "") &&
      !/COLLECTOR_RETURNED_ZERO|REFS_RETURNED_ZERO|COVERAGE_BELOW_FLOOR/.test((rReal.stdout || "") + "\n" + (rReal.stderr || "")),
    true,
  );
  push(
    "⑰g 缺陷②口径统一的真树证明：每个采到的 java 都落进所属 scaffold 根的 java 索引 + 汇总同屏报索引类数与守卫平台",
    probeIn(REPO_ROOT, () => {
      const idx = scaffoldJavaIndex();
      const miss = listScaffoldJava().filter((f) => !idx.byRoot.has(scaffoldRootOf(f)));
      return miss.length === 0 && idx.byRoot.size > 0;
    }) === true &&
      /java 索引 [1-9]\d* 类/.test(rReal.stdout || "") &&
      /守卫平台 fabric\/quilt/.test(rReal.stdout || ""),
    true,
  );
  // ⑰h 投毒（S1d 必做）：ghost 命名的配置带双前缀条目 ⇒ 必须 rc=1 并点名规则 C
  const fPoison = fs.mkdtempSync(path.join(os.tmpdir(), "mixin-shape-selftest-poison-"));
  extraRoots.push(fPoison);
  wJsonIn(fPoison, "fabric/9.9.9/scaffold/src/main/resources/mixins.ghost.json", { package: "com.example.examplemod.mixin", client: ["${mod_id}.mixin.ExampleMixin"] });
  const rPoison = runMainOn(fPoison);
  push(
    "⑰h 投毒 ghost.json（双前缀条目，旧口径整类逃检）⇒ rc 非 0（实得 " + rPoison.status + "）且点名 mixins.ghost.json + 规则C",
    rPoison.status !== 0 && /mixins\.ghost\.json/.test(rPoison.stderr || "") && /规则C/.test(rPoison.stderr || "") && /\[VIOLATION\]/.test(rPoison.stderr || ""),
    true,
  );
  // ⑰i 投毒（S1d 必做）：fabric.mod.json 的 mixins 引用一个盘上没有的配置 ⇒ 必须 rc=1（规则D 悬空引用）
  const fDangling = mkShapeRoot("dangling", FLOOR_INJECT_POINTS, FLOOR_MIXIN_ENTRIES, "dangling");
  const rDangling = runMainOn(fDangling);
  push(
    "⑰i 投毒悬空引用（mixins 指向不存在的配置）⇒ rc 非 0（实得 " + rDangling.status + "）且点名规则D + MIXIN_CONFIG_ABSENT + 文件名",
    rDangling.status !== 0 &&
      /规则D/.test(rDangling.stderr || "") &&
      /MIXIN_CONFIG_ABSENT/.test(rDangling.stderr || "") &&
      /no-such-config\.json/.test(rDangling.stderr || "") &&
      codesIn(rDangling.stderr, "REFS_RETURNED_ZERO") === 0,
    true,
  );
  // ⑰j 缺陷②投毒反面：多源码集 scaffold（条目对上 src/client/java 与顶层 java/ 的类）⇒ 必须 rc 0（旧口径假红）
  const fMulti = mkShapeRoot("multisrc", 0, FLOOR_MIXIN_ENTRIES, "multisrc");
  const rMulti = runMainOn(fMulti);
  const probeMulti = probeIn(fMulti, () => {
    const idx = scaffoldJavaIndex();
    const set = idx.byRoot.get("fabric/9.9.9/scaffold") || new Set();
    const narrowMissed = listScaffoldJava().filter((f) => !/^(.*\/scaffold)\/src\/main\/java\/(.+)$/.test(f)).length;
    return { indexed: set.size, srcSets: [...(idx.srcSets.get("fabric/9.9.9/scaffold") || [])].sort().join("+"), narrowMissed, java: listScaffoldJava().length };
  });
  push(
    "⑰j 多源码集夹具（20 类分布在 src/main/java + src/client/java + 顶层 java/，条目对得上）⇒ rc 0（实得 " + rMulti.status + "）",
    rMulti.status === 0 && !/VIOLATION|COLLECTOR_GAP|REFS_RETURNED_ZERO|COVERAGE_BELOW_FLOOR/.test((rMulti.stdout || "") + "\n" + (rMulti.stderr || "")),
    true,
  );
  push(
    "⑰k 缺陷②口径统一：采到 " + probeMulti.java + " 个 java、索引出 " + probeMulti.indexed + " 类（旧窄口径漏 " + probeMulti.narrowMissed + " 个），源码集 " + probeMulti.srcSets,
    probeMulti.java === 20 && probeMulti.indexed === 20 && probeMulti.narrowMissed === 2 && /src\/client/.test(probeMulti.srcSets) && /\(顶层 java\)/.test(probeMulti.srcSets),
    true,
  );
  // ⑰l R49 / R29 ③：语料面永不守卫、面外平台采到不判
  const fOff = fs.mkdtempSync(path.join(os.tmpdir(), "mixin-shape-selftest-offface-"));
  extraRoots.push(fOff);
  wJsonIn(fOff, "data/fabric_9.9.9/scaffold/src/main/resources/leak.mixins.json", { package: "com.corpus.only", client: ["#corpusleak#"] });
  wJsonIn(fOff, "knowledge/libs/fabric-only/scaffold/src/main/resources/leak2.mixins.json", { package: "com.corpus.only", client: ["#corpusleak2#"] });
  wJsonIn(fOff, "neoforge/9.9.9/scaffold/src/main/resources/mixins.json", { package: "com.neoforge.only", mixins: ["#offface#"] });
  const probeOff = probeIn(fOff, () => {
    const c = scaffoldMixinConfigs();
    const jr = c.files.map((f) => judgeMixinsFile(f)).flat();
    return { files: c.files.join(","), off: c.offFace.join(","), corpus: c.files.some((f) => /^(data|knowledge)\//.test(f)), judged: JSON.stringify(jr) };
  });
  push(
    "⑰l 语料面（data/ 与 knowledge/ 下的同名 scaffold 形状）不进守卫、面外（neoforge）配置只采不判",
    probeOff.corpus === false && /neoforge\/9\.9\.9\/scaffold\/src\/main\/resources\/mixins\.json/.test(probeOff.off) && !probeOff.files.includes("neoforge") && !/#corpusleak#/.test(probeOff.judged) && !/#offface#/.test(probeOff.judged),
    true,
  );

  // ⑱ 低于地板：注入点与注册条目各 1 条（>0，故不是零判定；配置数与引用数仍在地板上）
  const fLow = mkShapeRoot("floor-low", 1, 1, "flat");
  const rLow = runMainOn(fLow);
  push(
    "⑱a 注入点/条目各 1 条 < 地板 20 ⇒ 恰 2 条 COVERAGE_BELOW_FLOOR 且 rc 非 0（实得 rc=" + rLow.status + "）",
    rLow.status !== 0 && codesIn(rLow.stderr, "COVERAGE_BELOW_FLOOR") === 2 && codesIn(rLow.stderr, "COLLECTOR_RETURNED_ZERO") === 0 && codesIn(rLow.stderr, "REFS_RETURNED_ZERO") === 0,
    true,
  );
  push(
    "⑱b 判红消息回显「地板 20 ⇒ 当前实扫 1」（两腿口径各自点名）",
    /注入点条数 地板 20 ⇒ 当前实扫 1/.test(rLow.stderr || "") && /注册条目数 地板 20 ⇒ 当前实扫 1/.test(rLow.stderr || ""),
    true,
  );

  // ⑲ 对照组：两腿都正好落在地板上 ⇒ 必须绿，且采集普查行把 扫/判/拒 + 地板 同屏打出来
  const fAt = mkShapeRoot("floor-at", FLOOR_INJECT_POINTS, FLOOR_MIXIN_ENTRIES, "flat");
  const rAt = runMainOn(fAt);
  push(
    "⑲ 对照组：地板口径（注入点 20 / 配置 10 / 条目 20 / 引用 10）⇒ rc 0（实得 rc=" + rAt.status + "）且采集普查行同屏含 扫/判/拒+地板，无地板判红码",
    rAt.status === 0 &&
      /采集普查 ①注入形状腿.*扫 20 个 scaffold java \/ 20 个含注入（java 索引 20 类） · 判 20 注入点 · 拒 0/.test(rAt.stdout || "") &&
      /②mixins注册面腿.*采 10 个配置（主链 10 引用 · 辅链 10 命中）· 判 20 条 \+ 10 引用判定 · 拒 0/.test(rAt.stdout || "") &&
      !/COLLECTOR_RETURNED_ZERO|COVERAGE_BELOW_FLOOR|REFS_RETURNED_ZERO/.test((rAt.stdout || "") + "\n" + (rAt.stderr || "")),
    true,
  );

  let missed = 0;
  for (const [name, got, want] of cases) {
    if (got === want) console.log(`  ok  ${name}`);
    else {
      console.error(`  RED ${name}（got ${got}, want ${want}）`);
      missed++;
    }
  }
  setRoot(REPO_ROOT);
  fs.rmSync(tmp, { recursive: true, force: true });
  for (const r of extraRoots) fs.rmSync(r, { recursive: true, force: true });
  console.log(`selftest: ${cases.length - missed}/${cases.length} 通过`);
  process.exitCode = missed === 0 ? 0 : 1;
}

const argv = process.argv.slice(2);
if (argv.includes("--selftest")) selftest();
else main();
