/**
 * Fabric「API 名跟丢版本」门的共用采集/判据库（纯函数 + 三类只读 I/O）。
 *
 * 为什么单独成库：规划稿 temp/新门问题与建议/规划稿.md §18 裁定 —— 本门与
 * `assert-skill-yarn-attest.mjs` 共用「围栏提取 / 注释剥离 / 映射腿四态」这三件事，
 * 但判据各自独立（那道门管技能源稿的 Yarn/mojmap 口径，本库管规则树的改名跟丢）。
 * 切片 1（2026-09-27）**不动现门**：这里的 isCommentLine / blankLine / partsOf / NEG / STOP
 * 是逐字从 `assert-skill-yarn-attest.mjs:76-137,148-156` 搬来的副本，两份实现等价由
 * `assert-rules-api-names.mjs --selftest` 的「现门等价臂」钉（同一棵合成 pack 同时喂两边）。
 *
 * 只读约定：本模块任何函数都不写盘。写盘（豁免表/队列/基线）一律归调用方与用户。
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export const NEG = /未核实|禁止|不得|零命中|没有|无源|不写|另一套|别的版本|勿抄/;
export const STOP = new Set([
  "TODO", "SKILL", "AGENTS", "AGENT_USAGE", "CONTRIBUTING", "README", "IF", "ELSE", "TRUE", "FALSE",
  "NULL", "MCP", "CLI", "API", "JSON", "YARN", "MOJMAP", "PARCHMENT", "MOD_ID", "IDE", "PNG", "JDK",
  "Gradle", "Fabric", "Forge", "NeoForge", "Quilt", "Minecraft", "Override", "Deprecated",
]);

/** 规则树里的「Decision-Flow 简写行」（`→ 该用什么`）—— 不是可编译代码，红腿不收。 */
export const ARROW_LINE = /^\s*(→|->|⇒|=>)/;

/** 强类型位置集合（规划稿 §14；decl/array/return 在规则树面本轮实测 0 例，仍保留）。 */
export const STRONG = new Set([
  "decl", "new", "extends", "anno", "generic", "instanceof", "lparen", "array", "methodref", "return",
]);

export function isCommentLine(ext, line) {
  if (ext === "java" || ext === "gradle" || ext === "kts") return /^\s*(\/\/|\/?\*)/.test(line);
  return /^\s*(\/\/|\/\*|\*\/|<!--|-->)/.test(line);
}

export function blankLine(line) {
  return line.replace(/\S/g, " ");
}

/** 现门 idsOf 的「一行取哪些标识符」内层逻辑，逐字沿用（含 SCREAMING 之外的全部剔除规则）。 */
export function partsOf(line) {
  const ids = new Set();
  for (const raw of line.split(/[^A-Za-z0-9_.$#()/]+/)) {
    for (const part of raw.split(/[.$#()/]+/)) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(part)) continue;
      if (!/[A-Z]/.test(part)) continue;
      if (part.length < 4) continue;
      if (STOP.has(part)) continue;
      if (/^[A-Z0-9_]+$/.test(part) && part.includes("_")) continue; // SCREAMING_SNAKE = 示例常量
      ids.add(part);
    }
  }
  return [...ids];
}

/**
 * 围栏内取标识符，带行文本（判上下文要用）。
 * 与现门 idsOf(text,{scope:"fence"}) 的取舍规则一致，只多了「返回 line」和「.mdc 也当代码注释处理」。
 * 返回 { id, at, line }；奇偶围栏不闭合 ⇒ fenceOdd=true（由调用方判红，不在此静默）。
 * ⚠️ 规划稿 §18 还写着「`.md`/`.mdc` 再抹 `<!-- -->` 段」——**本面未实现，因为人群实测为 0**
 * （2026-09-27 16:23Z 逐文件扫 14 档 / 154 件：围栏内**含 `<!--` 的物理行 = 0**，因此 token 行 0、只因注释行而存在的站点 0）。
 * ⇒ 加剥除器今天不改一个判定，只会给共享采集器添一条无判据的分支。**本面若将来出现围栏内 HTML 注释行**（技能面已有），
 * 先按上面三个数复测再决定，别照文档直接补 —— 那会把「注释里的名字」从判定面摘掉，方向是少判，不是多判。
 */
export function fenceIds(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  let inB = false;
  let opens = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^```/.test(l)) { inB = !inB; opens++; continue; }
    if (!inB) continue;
    if (/^\s*(\/\/|\*|\/\*)/.test(l)) continue;
    if (NEG.test(l)) continue;
    for (const id of partsOf(l)) out.push({ id, at: i + 1, line: l });
  }
  return { ids: out, fenceOdd: opens % 2 === 1 };
}

/**
 * 逐 occurrence 的上下文 flag（规划稿 §14 那张表就是这份实现的本面实测）。
 * 同一行里同名出现多次时，每个位置都算一次 —— 早先用 line.indexOf(id) 首现定位会把
 * `X / Y`、`Owner.Right` 这类形状读成 bare，是假象。
 */
export function occContexts(line, id) {
  const esc = id.replace(/[$]/g, "\\$&");
  const re = new RegExp(`(?<![A-Za-z0-9_$])${esc}(?![A-Za-z0-9_$])`, "g");
  const flags = new Set();
  let m;
  while ((m = re.exec(line))) {
    const prev = line.slice(0, m.index);
    const next = line.slice(m.index + id.length);
    if (/\b(class|interface|enum|record)\s+[\w$]*$/.test(prev)) flags.add("decl");
    if (/\bnew\s+[\w$]*$/.test(prev)) flags.add("new");
    if (/\b(extends|implements|permits)\s+[\w$]*$/.test(prev)) flags.add("extends");
    if (/@[\w$]*$/.test(prev)) flags.add("anno");
    if (/<$/.test(prev.trim()) || (prev.lastIndexOf("<") > prev.lastIndexOf(">") && /[,<\s]$/.test(prev))) flags.add("generic");
    if (/\binstanceof\s+[\w$]*$/.test(prev)) flags.add("instanceof");
    if (/\($/.test(prev)) flags.add("lparen");
    if (/[A-Za-z0-9_]\s*\[\]\s*$/.test(prev) || /^\s*\[/.test(next)) flags.add("array");
    if (/::$/.test(prev) || /^\s*::/.test(next)) flags.add("methodref");
    if (/\breturn\s+[\w$]*$/.test(prev)) flags.add("return");
    if (/\.\s*$/.test(prev) && !/::\s*$/.test(prev)) flags.add("rightseg");
    if (/^\s*\./.test(next)) flags.add("owner");
    if (/[-/+*/]\s*$/.test(prev)) flags.add("sep");
    if (ARROW_LINE.test(line)) flags.add("ARROWLINE");
  }
  if (!flags.size) flags.add("bare");
  return flags;
}

/** 版本数值序：1.21.8 < 1.21.10 < 1.21.11 < 26.1.2（按 . 切段比整数，禁止字典序）。 */
export function verCmp(a, b) {
  const pa = String(a).split(/[._-]/).map((x) => (/^\d+$/.test(x) ? Number(x) : -1));
  const pb = String(b).split(/[._-]/).map((x) => (/^\d+$/.test(x) ? Number(x) : -1));
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] ?? -1, y = pb[i] ?? -1;
    if (x !== y) return x - y;
  }
  return 0;
}

/**
 * 映射腿：五态（absent / unreadable / era / zero-rows / ok）。
 * 语义照现门 mappingLeg：读失败**不得**塌成「查无此名」；这里再加一步 ——
 * 腿里同时产出等价类锚要用的 intermediary↔named。
 * @param packDir 形如 <root>/data/fabric_<v>
 */
export function mappingLeg(pack, packDir, opts = {}) {
  const file = path.join(packDir, "mappings", "yarn-mappings.sqlite");
  const leg = {
    pack, state: "absent", era: null, why: "无 yarn-mappings.sqlite（等价类腿不适用）",
    rows: 0, nested: 0, tails: new Set(), fqcnByTail: new Map(), interToNamed: new Map(),
    namedToFqcn: new Map(), memberTails: new Set(), proven: new Set(), usable: false, ioError: null,
  };
  // 「整档没有库」有两种，规划稿 §13 第 3 类歧义明令不得合并：
  //   26.x = 去混淆按设计无 yarn 库（等价类腿不适用、语料腿仍跑）；其余 = 档被搬走/摄入漏，按 absent 计。
  if (!existsSync(file)) {
    if (/^fabric_26\./.test(pack)) {
      leg.state = "no-lib-by-design";
      leg.why = "26.x 去混淆档按设计无 yarn-mappings.sqlite（AGENTS 裁定禁止转 yarn）⇒ 等价类腿不适用，桶 2 语料腿仍适用";
    }
    return leg;
  }
  const retries = opts.retries ?? 3;
  let db = null, lastErr = null;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      db = new DatabaseSync(file, { readOnly: true });
      leg.era = db.prepare("select value from meta where key='mappingEra'").get()?.value ?? null;
      lastErr = null;
      break;
    } catch (err) {
      try { db?.close(); } catch {}
      db = null; lastErr = err;
      if (attempt < retries - 1) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150 << attempt);
    }
  }
  if (!db) {
    leg.state = "unreadable";
    leg.ioError = lastErr?.message ?? "open/query 失败";
    leg.why = `yarn-mappings.sqlite 存在但 ${retries} 次读不动（最后一次：${leg.ioError}）`;
    return leg;
  }
  try {
    if (leg.era !== "yarn-tiny" && leg.era !== "yarn") {
      leg.state = "era";
      leg.why = `meta.mappingEra=${leg.era} 不是 yarn（文件名里的 yarn 会骗人，见根 AGENTS 第 5 条）`;
      return leg;
    }
    for (const r of db.prepare("select named, intermediary from classes").all()) {
      const fq = String(r.named ?? "");
      if (!fq) continue;
      const i = fq.lastIndexOf("/");
      const tail = i < 0 ? fq : fq.slice(i + 1);
      leg.rows++;
      if (tail.includes("$")) leg.nested++;
      leg.tails.add(tail);
      if (!leg.fqcnByTail.has(tail)) leg.fqcnByTail.set(tail, new Set());
      leg.fqcnByTail.get(tail).add(fq);
      const it = String(r.intermediary ?? "").trim();
      if (it) {
        leg.interToNamed.set(it, tail);
        leg.namedToFqcn.set(fq, it);
      }
    }
    for (const t of ["methods", "fields"]) {
      try {
        for (const r of db.prepare(`select name_named as n from ${t}`).all()) {
          const s = String(r.n ?? "").split("/").pop();
          if (s) leg.memberTails.add(s);
        }
      } catch {}
    }
    if (leg.rows === 0) { leg.state = "zero-rows"; leg.why = "classes 表 0 行（库被清空或摄入失败）"; return leg; }
    leg.proven = new Set([...leg.tails, ...leg.memberTails]);
    leg.state = "ok";
    leg.usable = true;
    leg.why = `ok（类行 ${leg.rows}，intermediary 覆盖 ${leg.interToNamed.size}）`;
    return leg;
  } catch (err) {
    leg.state = "unreadable";
    leg.ioError = err?.message ?? String(err);
    leg.why = `表读取失败：${leg.ioError}`;
    return leg;
  } finally {
    try { db.close(); } catch {}
  }
}

/**
 * 等价类图（锚 = intermediary 全串）。
 * 本轮实测：同档内 intermediary 与 named 一对一（distinct==类行），所以「一 inter 多 named」
 * 只可能发生在跨档 = 改名事件本身；同档简单名→多 inter 每档 7–15 例 ⇒ 锚不唯一要让位。
 * ⚠️ 规划稿 §13 尾段那条「反向索引额外登记内层 id」**已量过、裁定不做**（2026-09-27 16:07Z，
 * 探针 slice10-inner-id-flip.mjs，Run-A 与生产门普查逐键相等才可读）：inter 末段的内层 id 在规则树面
 * 只命中 2/3,981 判名（Builder、Type），收益≈0；改按 named 内层尾段登记则 +2,489 键、**13 个假红**
 * （围栏里的 `@Environment(EnvType.CLIENT)` 被 anchor 到 vanilla `RealmsClient$Environment`）、CLASS-OR-FAPI 4→81。
 * 兜不住是因为否决面只有 vanilla + 语料 FQCN + fabric-api 摘要件，**不含 fabric-loader 类名**（实测 11 份
 * `<档>-fabric-api.json` 的 `net.fabricmc.*` 末段里 Environment / EnvType 0 命中，仓内没有 `<档>-fabric-loader.json`）
 * ⇒ 谁要补这条，先给否决面加 fabric-loader 来源，否则红腿一开就是 13 条张冠李戴。
 * @param legs Iterable<mappingLeg>（只有 state==="ok" 参与）
 * @param verOf (pack) => 版本串
 */
export function buildEquivalence(legs, verOf) {
  const byVer = new Map();
  for (const leg of legs) if (leg.state === "ok") byVer.set(verOf(leg.pack), leg);
  const vers = [...byVer.keys()].sort(verCmp);
  const E = new Map();            // inter → Map<ver, {named, fqcn}>
  const tailToInter = new Map();  // 简单名 → Set<inter>
  const interOf = new Map();      // `${ver}|${fqcn}` → inter
  const ambiguous = [];           // 同档 inter→多named（实扫恒 0；一旦 >0 就是坏库，调用方判红）
  for (const ver of vers) {
    const leg = byVer.get(ver);
    // 以 namedToFqcn（FQCN → inter）为遍历面：一条类行一次，简单名从 FQCN 现切，不做任何反查
    for (const [fq, inter] of leg.namedToFqcn) {
      const i = fq.lastIndexOf("/");
      const named = i < 0 ? fq : fq.slice(i + 1);
      if (!E.has(inter)) E.set(inter, new Map());
      const atVer = E.get(inter);
      // 同档内一个 intermediary 对两个 named ⇒ 不是改名，是**摄入出错**（规划稿 §13 第 1 类歧义的裁定：判红不许绿，
      // 也绝不允许静默覆盖 —— 原来这里 `set` 会把先读到的那条直接顶掉，等于把坏库洗成看不见的丢行）。
      if (atVer.has(ver) && atVer.get(ver).named !== named) {
        ambiguous.push(`${ver}｜${inter} 同档两个 named（${atVer.get(ver).named} / ${named}）`);
      } else atVer.set(ver, { named, fqcn: fq });
      if (!tailToInter.has(named)) tailToInter.set(named, new Set());
      tailToInter.get(named).add(inter);
      interOf.set(`${ver}|${fq}`, inter);
    }
  }
  let renamedOnce = 0, renamedMulti = 0;
  for (const byv of E.values()) {
    const names = new Set([...byv.values()].map((x) => x.named));
    if (names.size === 2) renamedOnce++;
    else if (names.size > 2) renamedMulti++;
  }
  /** 本档该叫什么：按数值序取 ≤ ver 的最近一名；多跳链给全链（不猜）。 */
  function nameAt(inter, ver) {
    const byv = E.get(inter);
    if (!byv) return null;
    return byv.get(ver) ?? null;
  }
  function chain(inter) {
    const byv = E.get(inter);
    if (!byv) return [];
    return [...byv.keys()].sort(verCmp).map((v) => ({ ver: v, named: byv.get(v).named }));
  }
  return { E, vers, tailToInter, interOf, byVer, ambiguous, classTotal: E.size, nameTotal: tailToInter.size, renamedOnce, renamedMulti, nameAt, chain };
}

/** 语料 token 集（本档语料逐字 = 桶 2 的那道证明；注释行不算出处）。 */
export function corpusTokens(packDir, opts = {}) {
  const set = new Set();
  let files = 0, bytes = 0;
  const stack = [packDir];
  const exts = /\.(md|java|json|gradle|kts|mcfunction|toml|txt)$/;
  while (stack.length) {
    const cur = stack.pop();
    let es = [];
    try { es = readdirSync(cur, { withFileTypes: true }); } catch { continue; }
    for (const e of es) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) { if (e.name !== "mappings") stack.push(full); continue; }
      if (!exts.test(e.name)) continue;
      let t = "";
      try { t = readFileSync(full, "utf8"); } catch { continue; }
      files++; bytes += t.length;
      const ext = e.name.slice(e.name.lastIndexOf(".") + 1);
      for (const line of t.split(/\r?\n/)) {
        if (isCommentLine(ext, line)) continue;
        const l = ext === "java" || ext === "gradle" || ext === "kts"
          ? line.replace(/\/\/.*$/, "").replace(/\/\*.*?\*\//g, "")
          : line;
        for (const m of l.matchAll(/[A-Za-z_][A-Za-z0-9_$]*/g)) {
          set.add(m[0]);
          for (const p of m[0].split("$")) if (p) set.add(p);
        }
      }
    }
  }
  return { tokens: set, files, bytes };
}

/**
 * Fabric API 归属名单（规划稿 §17）。只当**否决位**用：此名归 FAPI 管 ⇒ 不由 vanilla 等价类判红。
 * 多包歧义不消歧（实测 3 例都是 FAPI 内部的包代际并存，强行选一个就是编造）。
 */
export function fapiRoster(dataRoot, packs) {
  const names = new Map();
  let files = 0, bytes = 0, unreadable = 0;
  const stack = packs.map((p) => path.join(dataRoot, p)).filter((p) => existsSync(p));
  if (!stack.length) return { names, files: 0, bytes: 0, state: "absent", ambiguous: [] };
  while (stack.length) {
    const cur = stack.pop();
    let es = [];
    try { es = readdirSync(cur, { withFileTypes: true }); } catch { unreadable++; continue; }
    for (const e of es) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) { if (e.name !== "mappings") stack.push(full); continue; }
      if (!/\.(md|java|gradle|kts|txt|json)$/.test(e.name)) continue;
      let t = "";
      try { t = readFileSync(full, "utf8"); } catch { unreadable++; continue; }
      files++; bytes += t.length;
      for (const m of t.matchAll(/net[/.]fabricmc[/.][A-Za-z0-9_./$]+/g)) {
        const segs = m[0].replace(/\.$/, "").replace(/\./g, "/").split("/").filter(Boolean);
        const tail = segs[segs.length - 1];
        if (!tail || !/^[A-Z]/.test(tail)) continue;
        if (!names.has(tail)) names.set(tail, new Set());
        names.get(tail).add(segs.slice(0, -1).join("/"));
      }
    }
  }
  const ambiguous = [...names].filter(([, s]) => s.size > 1).map(([n, s]) => `${n}(${[...s].join(",")})`).sort();
  return { names, files, bytes, state: "ok", ambiguous, unreadable };
}

/**
 * Fabric API 归属名单的**第二来源**（规划稿 §27 ① 登记的那条洞）。
 * 语料正文从不写 FAPI 的限定名（实测 `data/fabric_1.18.2|1.19.4|1.20.1` 里 `net[/.]fabricmc.*TagProvider` = 0 串），
 * 于是 `FabricTagProvider$BlockTagProvider` 这种「与 vanilla 历史名同名的 FAPI 嵌套类」进不了上面的名单 ——
 * 今天 6 条 `BlockTagProvider` 只靠「非强类型位 + 箭头简写行」两道挡着，作者一旦把它写进真代码位就假红。
 * 这里读的是维护侧从 fabric-api jar 抽出的**逐档类清单** `mcp-server/data/loader-api-summaries/<档>-fabric-api.json`：
 * 只当否决位、只认 `net.fabricmc.*` 包、**按档取**（不跨档并集），某档没有该件 ⇒ 该档不获得新增否决并在汇总里点名。
 */
export function fapiSummaries(dir, vers) {
  return readNetFabricmcSummaries(dir, vers, "-fabric-api");
}

/**
 * 归属名单的**第三来源**：加载器本体的摘要件 `mcp-server/data/loader-api-summaries/<档>-fabric.json`
 * （2026-09-28 由 scripts/decompile-loader-apis.mjs 从各档 scaffold 钉的 fabric-loader -sources.jar 生成）。
 * 为什么要单独一路：`ClientModInitializer` / `DedicatedServerModInitializer` / `Environment` / `EnvType`
 * 是 **loader 类**，既不在本档 yarn 映射（那是 vanilla 的映射表）、也不在语料 FQCN 与 fabric-api 摘要里
 * ⇒ 前两路都挡不住它们，规则树/技能稿里正常的加载器入口点写法会被判成 RENAME-STALE。
 * 判据与 fapiSummaries 同尺：只认 `net.fabricmc.*`、只取末段、按档取（不跨档并集）、缺席与读不动分别记账。
 * ⚠️ quilt 侧没有对应件（loader 摘要本仓只生成了 fabric 的 14 档），所以这一路只对 fabric 档有意义。
 */
export function loaderSummaries(dir, vers) {
  return readNetFabricmcSummaries(dir, vers, "-fabric");
}

function readNetFabricmcSummaries(dir, vers, suffix) {
  const byVer = new Map();
  const absent = [];
  const unreadable = [];
  let namesTotal = 0;
  const union = new Set();
  if (!dir || !existsSync(dir)) return { byVer, absent: vers.slice(), unreadable, namesTotal: 0, unionSize: 0, dir: dir ?? null, state: "absent" };
  for (const v of vers) {
    const f = path.join(dir, `${v}${suffix}.json`);
    if (!existsSync(f)) { absent.push(v); continue; }
    let j;
    try {
      j = JSON.parse(readFileSync(f, "utf8"));
    } catch {
      unreadable.push(v);
      absent.push(v);
      continue;
    }
    const tails = new Set();
    for (const c of j?.classes ?? []) {
      const fq = typeof c?.fqcn === "string" ? c.fqcn : "";
      if (!/^net\.fabricmc\./.test(fq)) continue; // 只认 FAPI 自己的包：摘要件里还混着别的来源的类名，不得进否决面
      const inner = fq.split(".").pop().split("$").pop(); // 嵌套类 FabricTagProvider$BlockTagProvider ⇒ BlockTagProvider
      if (/^[A-Z]/.test(inner)) tails.add(inner);
    }
    byVer.set(v, tails);
    namesTotal += tails.size;
    for (const t of tails) union.add(t); // 逐档人次与并集是两个口径：11 档人次 10,566，去重后 2,455（跨档重名极多）
  }
  return { byVer, absent, unreadable, namesTotal, unionSize: union.size, dir, state: "ok" };
}

/** 豁免表：TAB 六列 relPath / line / simpleName / newName / basis / addedRound。 */
export function loadExemptions(text) {
  const rows = [], bad = [];
  const lines = String(text ?? "").split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!l.trim() || l.trimStart().startsWith("#")) continue;
    const c = l.split("\t");
    if (c.length !== 6) { bad.push(`第 ${i + 1} 行：列数 ${c.length}（须 TAB 六列）`); continue; }
    const [relPath, lineNo, simpleName, newName, basis, addedRound] = c;
    if (!/^\d+$/.test(lineNo)) { bad.push(`第 ${i + 1} 行：line 不是整数`); continue; }
    if (!/^(corpus:.+:\d+|mapping:.+|fapi-roster|user-approved:L?\d+)$/.test(basis)) {
      bad.push(`第 ${i + 1} 行：basis 不合形态（须 corpus:<路径>:<行> / mapping:<档> / fapi-roster / user-approved:<L号>）`);
      continue; // 不合形态的豁免**不得**同时生效，否则拼错的 basis 照样能洗白一个红点
    }
    rows.push({ relPath, line: Number(lineNo), simpleName, newName, basis, addedRound, at: i + 1 });
  }
  return { rows, bad };
}

/**
 * 唯一判据出口（规划稿 §15 的八步序列）。纯函数。
 * @param site {ver, relPath, id, flags(并集), at, line}
 * @param ctx  {leg, eq, roster, corpusTokens, presentElsewhere, exemptions, equivOf}
 */
export function classify(site, ctx) {
  const { leg, eq, roster, tokens } = ctx;
  const { id, flags } = site;
  const anchors = eq.tailToInter.get(id) ?? new Set();
  // 桶 1 的证出面 = 类名 ∪ 成员名（与现门 leg.ids 同口径；等价类锚仍只认类名 tails）
  const c1 = leg.state === "ok" && leg.proven.has(id);
  const c2 = tokens.has(id);
  // 等价类锚：找「在别的档叫 id、在本档另有名」的那个 inter
  let staleInter = null;
  for (const it of anchors) {
    const here = eq.nameAt(it, site.ver);
    if (here && here.named !== id) { staleInter = it; break; }
  }
  const c3 = !!staleInter && !c1;
  const out = { bucket: 0, verdict: null, red: false, why: "", candidates: [], anchor: staleInter };
  if (c1) {
    // 冲突哨兵（规划稿 §15 第 8 步）—— 本轮真树把它从「判红」降级成「只计数」，两条实测理由写死在这里：
    //   ① 桶 1 的证出面按 §26 是「类名 ∪ 成员名」，于是 `ItemTagProvider` 这类**成员名撞 vanilla 历史类名**
    //      会在真树上稳定命中 3 条（1.19.4 / 1.20.1 / 1.20.4 的 `07-datagen.mdc:39`）⇒ 按红做就是门比库坏时更绿的反面：健康数据大面积红；
    //   ② 若把判据收窄到「类名级证出 ∧ 锚唯一」，它反而**不可满足**（同档内 id 是类名 ⇒ 它自己的 inter 必在锚集里且本档名就是 id）⇒ 变成装饰。
    // 所以真·摄入错由 buildEquivalence 的 ambiguous（同档 inter→多named，§13 第 1 类）判红承担；这里只把 c1∧c3 的规模**印出来**当哨兵。
    if (staleInter) {
      out.bucket = 1; out.verdict = "BUCKET-CONFLICT"; out.red = false;
      out.candidates = eq.chain(staleInter);
      out.why = `本档映射证出 ${id}（类名或成员名），而锚 ${staleInter} 说本档另有其名 ${eq.nameAt(staleInter, site.ver)?.named} ⇒ 只计数不判红（见上两条）`;
      return out;
    }
    out.bucket = 1; out.verdict = "MAPPING"; out.why = "本档 yarn 映射证出"; return out;
  }
  if (c2) {
    out.bucket = 2; out.verdict = "CORPUS-ONLY";
    if (staleInter) { out.verdict = "CLASS-OR-FAPI"; out.why = "本档语料逐字有此名，但等价类说它该叫别的名 ⇒ 多半是 Fabric API 名撞了 vanilla 历史名"; }
    else out.why = "仅本档语料证出（映射查无）";
    out.candidates = staleInter ? eq.chain(staleInter) : [];
    return out;
  }
  if (c3) {
    out.bucket = 3;
    out.candidates = eq.chain(staleInter);
    const here = eq.nameAt(staleInter, site.ver).named;
    const strong = [...flags].some((f) => STRONG.has(f));
    const veto = [];
    if (!strong) veto.push("非强类型位");
    if (flags.has("rightseg")) veto.push("限定名右段");
    if (flags.has("ARROWLINE")) veto.push("箭头简写行");
    if (anchors.size >= 2) veto.push(`锚不唯一(${anchors.size} 个 intermediary)`);
    if (roster.names.has(id) && eq.tailToInter.has(id)) veto.push("FAPI 碰撞名");
    else if (ctx.fapiSum?.byVer.get(site.ver)?.has(id) && eq.tailToInter.has(id)) veto.push("FAPI 摘要件名"); // 第二来源单独点名，判词形状与上面那条不混（老断言按「FAPI 碰撞名」匹配，改串会假红）
    else if (ctx.loaderSum?.byVer.get(site.ver)?.has(id) && eq.tailToInter.has(id)) veto.push("loader 摘要件名"); // 第三来源：加载器本体的类（ClientModInitializer / Environment / EnvType 这类），前两路都不含
    if (veto.length === 0) {
      out.red = true; out.verdict = "RENAME-STALE";
      out.why = `本档该叫 ${here}（锚 ${staleInter}）`;
    } else {
      out.verdict = "RENAME-UNRESOLVED";
      out.why = `改名跟丢候选，被 ${veto.join(" + ")} 挡下（本档正解 ${here}）`;
    }
    return out;
  }
  const elsewhere = ctx.presentElsewhere ?? [];
  if (elsewhere.length) {
    out.bucket = 4; out.verdict = "ADDED-LATER";
    out.why = `仅见于 ${elsewhere.slice(0, 4).join(",")}${elsewhere.length > 4 ? "…" : ""}（本档映射与语料都查无）`;
    return out;
  }
  out.bucket = 5; out.verdict = "UNKNOWN-ALL-PACKS";
  out.why = "全档映射与语料皆查无（含切词器噪音，只登记不判红）";
  return out;
}

/**
 * 基线**必须**具备的键。存在的理由：compareFloors 是按「基线里有哪些键」循环的 ⇒
 * 从基线**删掉**一条 floors/ceilings 键 = 那条棘轮静默消失而门全绿（「删键做绿」比写个 0 更省事，
 * 所以必须有一处把键集钉死）。requireKeys 由调用方给：真跑（含 --pack）给 true，
 * 单元夹具传自己缩小的基线，默认 false 不受影响。
 */
export const REQUIRED_FLOOR_KEYS = [
  "packsMin", "packsWithLibMin", "classRowsMin", "rulesFilesMin", "judgedNamesMin",
  "bucket1Min", "equivClassesMin", "equivNamesMin", "rosterNamesMin", "corpusPacksMin",
];
export const REQUIRED_CEILING_KEYS = [
  "renameStaleRedMax", "classOrFapiMax", "exemptionsMax", "ambiguousRosterMax", "multiAnchorRedMax", "fenceOddFilesMax",
];

/** 地板（下界 <）与上界（ceiling，只许降）比较。照抄 assert-rule-ban-vs-example R47 的两类红。 */
export function compareFloors(measured, baseline, registered, requireKeys = false) {
  const trips = [];
  const keyOf = (k) => k.replace(/(Min|Max)$/, "");
  if (requireKeys) {
    const have = new Set([...Object.keys(baseline?.floors ?? {}), ...Object.keys(baseline?.ceilings ?? {})]);
    for (const k of [...REQUIRED_FLOOR_KEYS, ...REQUIRED_CEILING_KEYS]) {
      if (!have.has(k)) trips.push({ kind: "BASELINE", msg: `[BASELINE-KEY-LOSS] ${k} 不在基线里 ⇒ 这条棘轮等于被删掉了（门按「基线有哪些键」循环，删键比写 0 更安静）；要撤销请附理由并同步 --measure-floors 与本门夹具` });
    }
  }
  for (const [k, min] of Object.entries(baseline.floors ?? {})) {
    const v = measured[keyOf(k)];
    if (v === undefined) { trips.push({ kind: "COLLECTOR", msg: `[FLOOR-COLLECTOR] 基线要求量 ${k}，本门没测 ${keyOf(k)} 这个数 ⇒ 门与基线失步` }); continue; }
    if (v === 0 && registered > 0) {
      trips.push({ kind: "COLLECTOR", msg: `[FLOOR-COLLECTOR] ${k}=0 而登记面非空 —— 采集器失效（换错根 / 档被搬走），不是内容干净（地板 ${min}；口径见 baseline.basis.${keyOf(k)}）` });
    } else if (v < min) {
      trips.push({ kind: "LOW", msg: `[FLOOR-LOW] ${k}=${v} < 地板 ${min}（口径：${baseline.basis?.[keyOf(k)] ?? "见基线注释"}；as-of ${baseline.asOf}）` });
    }
  }
  for (const [k, max] of Object.entries(baseline.ceilings ?? {})) {
    const v = measured[keyOf(k)];
    if (v === undefined) { trips.push({ kind: "COLLECTOR", msg: `[FLOOR-COLLECTOR] 基线要求上界 ${k}，本门没测 ${keyOf(k)} 这个数` }); continue; }
    if (v > max) trips.push({ kind: "CEILING", msg: `[CEILING] ${k}=${v} > 上界 ${max}（红条数与例外只许降；口径：${baseline.basis?.[keyOf(k)] ?? "见基线注释"}）` });
  }
  return trips;
}

export function statSize(p) {
  try { return statSync(p).size; } catch { return 0; }
}
