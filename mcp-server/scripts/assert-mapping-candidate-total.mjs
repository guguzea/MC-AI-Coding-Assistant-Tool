#!/usr/bin/env node
/**
 * L77①+② 门：歧义候选清单必须自带「同条件真池条数」且样本次序可复现
 * （立案见 CONTRIBUTING `L77`；修法由 2026-09-27 用户裁定「①+② 合并」）
 *
 * 判什么：
 *  1 真池位：`candidates.length < candidatesTotal` 时 `candidatesTotal` 必存在，且等于**另一把尺子**
 *    （门自己用 node:sqlite 现算的同条件 COUNT）—— 不许拿生产自述当自证。
 *  2 次序：窗口样本必须按 descriptor 升序 ⇒ 同一查询两次跑逐位相同（修前三处 SQL 都没有 ORDER BY）。
 *  3 措辞：notes 必须同时点名「前 N 条」与「真池 M 条」，否则人读不出被截。
 *  4 正控：真池 ≤ 窗口 的组（gate 现扫 db 找一组）⇒ 两数恒等、不带「已截断」。
 *  5 棘轮：**全 `src/mappings/*.ts` 面**的 `ambiguous: true` 发射点（`classifyAmbiguousSites` 按对象字面量
 *    分块，`;` 收尾的类型声明不计），缺真池位的必须**逐条**配上一个具名豁免（NAMED_EXEMPT 给理由）；
 *    反向也判：在册豁免配不上任何站点 ⇒ 红（豁免只许减，不许躺着）。
 *    ⚠️ 本判据第一版**只读 yarn-sqlite.ts 一个文件**，而标题写着「src 里发射点」⇒ 同形缺陷
 *    （拿 LIMIT 20 截断的 rows 当 candidates 吐出去）在 convert.ts／lookup-obfuscated.ts 各有一条，
 *    门照样印「豁免 3 ≤ 3 ✓」。2026-09-27 用户裁定「先修门自己的口径洞」后端改成现在这样。
 *  6 全局反查腿：`lookupByObfuscated` 两条 `LIMIT 20`（UNION 腿 + SRG CSV 腿）必须自己报 rowsTotal，
 *    独立尺子 = 门把两分支全量取回后**整行去重**计数（与 UNION 语义同、机制不同源），并核升序 + 二次一致。
 *    ⚠️ 本腿第一版是 **skip 形**的：现扫取不到候选 token 时只把 banner 写成「未跑」而不 push error ⇒ rc 仍 0，
 *    于是「新腿在盘上但没点火」与「新腿验过了」在链上不可区分（同函数的正控腿从一开始就带这条地板）。
 *    2026-09-27 用户裁定：**取不到即判红**，且**不为盘上不存在的形状造合成 sqlite**（那买的是「夹具能红」，
 *    不是「线上会走到」；UNION「被截」臂已有 selftest 投毒 ⑯⑰⑱，真库一旦出现 >20 的池，
 *    `checkObfWindow` 的「被截却不点名真池」腿会自己红）。
 *
 * --selftest：把合成载荷喂给判据函数，证明 1/2/3/4/5/6/7/8 各能红（含正控与「豁免躺着」新形状）。
 *
 * 判据 7/8 是 2026-09-27 用户裁定追加的两条「引线」，共同点：**都不为盘上不存在的形状造合成夹具**。
 *  · 7 —— 那条「classes.official 命中多条」腿今天结构上不可达（13 库逐库 GROUP BY HAVING c>1 = 0 组，
 *    且 official 列对被混淆的类存 Tiny 混淆短名 —— 13 档 100 985 行里可读全路径只占 675 行 = 0.67%），所以豁免它的理由写成可重量的数；任何一库冒出 >1 组 ⇒ 门红并要求删豁免。
 *  · 8 —— `from=mojang` 的第二档出处（派生对照表 data/_yarn-mojmap-pairs/）**在盘可达**：三发行为全走生产
 *    `convertMapping`（hit／ambiguous／答不了），加 index 自述条数 ↔ 门实读行数的对账 ⇒ 「表在但接不上」能红。
 */
import { existsSync, readFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = process.env.MC_SKILL_DATA ?? join(ROOT, "..", "data");
const dist = (p) => pathToFileURL(join(ROOT, "dist", p)).href;

/**
 * 旧口径遗留的数值上界：现在**只给 inline 合成夹具用**（selftest 的字符串面没有文件名，配不上具名豁免）。
 * 真跑面走 NAMED_EXEMPT 逐条在册 + 「在册必须配得上」的反向腿。
 * 历史：2026-09-27 上午数到 3 条 JS 聚合腿（yarn-sqlite 的 CSV 联合两条 + uniqueObf 一条）；
 * 当天下午用户裁定补腿，三条连同 convert.ts 的 probe rows 三条、lookup-obfuscated 两条已补 rowsTotal/candidatesTotal。
 */
const EXEMPT_MAX = 3;

function countRows(db, table, where, params) {
  return db.prepare(`SELECT COUNT(*) AS c FROM ${table} WHERE ${where}`).get(...params).c;
}

/** 判据 1+3：真池位与措辞 */
export function checkDisclosure(r, independentTotal) {
  const errors = [];
  const cand = r.candidates ?? [];
  if (!r.ambiguous) return { ok: false, errors: [`该查询本应歧义，实际 found=${r.found} ⇒ 判据未跑，禁止当合格`] };
  if (typeof r.candidatesTotal !== "number") errors.push(`载荷缺 candidatesTotal（candidates=${cand.length} 条，会被读成全量清单）`);
  else {
    if (independentTotal !== undefined && r.candidatesTotal !== independentTotal) {
      errors.push(`candidatesTotal=${r.candidatesTotal} ≠ 独立 SQL 同条件 COUNT=${independentTotal}`);
    }
    if (r.candidatesTotal < cand.length) errors.push(`candidatesTotal=${r.candidatesTotal} < 样本 ${cand.length} ⇒ 池比样本还小，计数位坏了`);
  }
  const notes = (r.notes ?? []).join(" ");
  if (typeof r.candidatesTotal === "number" && r.candidatesTotal > cand.length) {
    if (!notes.includes(String(r.candidatesTotal))) errors.push(`notes 没点名真池 ${r.candidatesTotal} 条：${notes.slice(0, 80) || "(无 notes)"}`);
    if (!notes.includes("已截断")) errors.push("notes 没写「已截断」⇒ 消费者无从知道少了 102 条");
  }
  return { ok: errors.length === 0, errors };
}

/** 判据 2：样本升序 + 可复现 */
export function checkOrder(descriptors, secondRun) {
  const errors = [];
  if (descriptors.length === 0) return { ok: false, errors: ["样本为空 ⇒ 次序判据没跑"] };
  for (let i = 1; i < descriptors.length; i++) {
    if (descriptors[i - 1] > descriptors[i]) {
      errors.push(`第 ${i + 1} 条不按 descriptor 升序：${descriptors[i - 1].slice(0, 28)} > ${descriptors[i].slice(0, 28)}`);
      break;
    }
  }
  if (secondRun && descriptors.join("|") !== secondRun.join("|")) errors.push("两次跑样本序列不同 ⇒ 无 ORDER BY 时留下的窗");
  return { ok: errors.length === 0, errors };
}

/** 判据 4：正控（真池 ≤ 窗口 ⇒ 两数恒等且不该出现「已截断」） */
export function checkControl(r) {
  const errors = [];
  const cand = r.candidates ?? [];
  if (!r.ambiguous) return { ok: false, errors: ["正控查询没回到歧义态 ⇒ 换一条（需要 2..20 条的组）"] };
  if (r.candidatesTotal !== cand.length) errors.push(`正控：candidatesTotal=${r.candidatesTotal} 应等于样本 ${cand.length}（池 ≤ 窗口）`);
  if ((r.notes ?? []).join(" ").includes("已截断")) errors.push("正控：池未超窗口却报「已截断」");
  return { ok: errors.length === 0, errors };
}

/**
 * 判据 5 的**扫描面**（2026-09-27 用户裁定「先修门自己的口径洞」）：
 * 本判据原**只读 `src/mappings/yarn-sqlite.ts` 一个文件**，而判据标题与登记都写着「src 里 ambiguous 发射点」
 * —— 那是一句门兑不了的话：`convert.ts` 与 `lookup-obfuscated.ts` 的同形腿（拿被 LIMIT 20 截断的
 * rows 直接当 candidates 吐出去）根本不在判面里，门照样印「豁免 3 ≤ 3 ✓」。
 * 现在按 `src/mappings/*.ts` 全扫，分母现取，且**每条缺位必须逐条在册**（见 NAMED_EXEMPT）。
 */
export const MAPPINGS_DIR = join(ROOT, "src", "mappings");

/**
 * 具名豁免：这些发射点**不该**有真池位（硬凑一个数只会是个假数），逐条给理由。
 * 「只许减不许增」= 每条都必须真配上一个站点，配不上即红（防修好了还把豁免留着）。
 */
export const NAMED_EXEMPT = [
  {
    file: "convert.ts",
    token: "candidates: methods.map(",
    why: "methods 是按类整表取出的、无 LIMIT ⇒ candidates 本身就是全池，再发一个 total 只会等于 length",
  },
  {
    file: "convert.ts",
    token: "classes.official 命中多条",
    why:
      "该腿不发候选清单，且**结构上不可达**：classes.official 每库唯一（2026-09-27 现扫 13 库、逐库 GROUP BY official HAVING c>1 ⇒ 0 组；" +
      "1.21.11 distinct(official)=10274=行数；该列对**被混淆的类**存 Tiny 混淆短名（a／fac／ccv），只有本来不混淆的少数类带可读全路径" +
      "（13 档 100 985 行实测：短名 100 310 ／含斜杠可读路径 675 = 0.67%）⇒ 拿 mojmap 可读名点查这一列必然未命中）" +
      "⇒ 要清单先要有能撞出多条的数据；判据 7 就是那条「一旦真出现 >1 组就响并要求删本豁免」的引线",
  },
];

/**
 * 判据 7（2026-09-27 用户裁定）：死腿的「活过来就响」引线。
 * 不为盘上不存在的形状造合成夹具（那买的是「夹具能红」不是「线上会走到」）——只把「现在仍然唯一」这件事
 * 变成每次真跑都重量的地板：任何一库冒出 official >1 的组 ⇒ 豁免 #2 立刻失效，那条腿必须真发 candidates。
 */
export function checkOfficialUniqueness(perDb) {
  const errors = [];
  if (!Array.isArray(perDb) || perDb.length === 0) {
    return { ok: false, errors: ["判据 7 未跑：一个库都没扫到（采集面塌）⇒ 不得按「零组」放行"], libs: 0, groups: 0 };
  }
  let groups = 0;
  for (const d of perDb) {
    if (typeof d.groups !== "number") {
      errors.push(`判据 7 采集缺口：${d.db} 没数出 groups ⇒ 该库不算被验过`);
      continue;
    }
    groups += d.groups;
    if (d.groups > 0) {
      errors.push(
        `classes.official 出现 >1 的组：${d.db} 有 ${d.groups} 组（样本 ${String(d.sample ?? "?")} 出现 ${String(d.sampleCount ?? "?")} 次）` +
          `⇒ 那条「命中多条」腿已在盘上可达，必须真发 candidates 并**删掉 NAMED_EXEMPT 第 2 条**（豁免的理由是结构不可达，理由没了豁免就得没）`,
      );
    }
  }
  return { ok: errors.length === 0, errors, libs: perDb.length, groups };
}

/**
 * 判据 8（同日裁定 乙）：`from=mojang` 的第二档出处必须**在盘可达**，且派生件自述条数与真行数对得上。
 * 三发行为一律走生产入口 `convertMapping`（消费者看到的那张脸），门自己只另取一把尺子读表文件的实际行数；
 * 「表在但接不上」「接上了但表漂了」「答不了的那档静默 miss」「outward 格式两套」都能红。
 */
export function checkPairsFace(m) {
  const errors = [];
  if (!m || !m.indexVersions) {
    return { ok: false, errors: ["判据 8 未跑：index.json 里一个版本都没有 ⇒ 第二档整张面不存在（被删？改名？）"], tables: 0, sum: 0 };
  }
  if (m.missing.length) errors.push(`index 声明但不在盘/不可读的表：${m.missing.join(", ")}`);
  for (const d of m.drift) errors.push(`表自述条数 ≠ 门实读行数：${d.table} index.count=${d.declared} 实读=${d.actual} ⇒ 派生件过期，按 provenance 的 refreshHint 重生成`);
  if (m.hit.status !== "hit") errors.push(`第二档没接上：convertMapping(from=mojang,to=yarn,${m.hit.name}) 得到 status=${String(m.hit.status)}（期望 hit）`);
  else {
    if (typeof m.hit.converted !== "string" || !m.hit.converted) errors.push("第二档命中却没给出 converted");
    if (m.hit.converted && m.hit.converted.includes("/")) {
      errors.push(`第二档吐出的 yarn 名是斜杠形（${m.hit.converted}）⇒ 与 SQLite 那条路的点分 outward 形不一致，同一工具会吐两种格式`);
    }
    if (!m.hit.notes.some((s) => s.includes("第二档出处"))) errors.push("命中未披露第二档出处 ⇒ 消费者会以为这是 SQLite 里的名字");
    if (!m.hit.notes.some((s) => s.includes("混淆短名"))) errors.push("命中未带层披露（official 存混淆短名）⇒ 与本判据要修的原始缺陷同类");
  }
  if (m.amb.status !== "ambiguous" || !(m.amb.total >= 2)) {
    errors.push(`歧义腿没撞通：${m.amb.name} 得到 status=${String(m.amb.status)} 条数=${String(m.amb.total)}（期望 ambiguous 且 ≥2）⇒ 「绝不猜」那条分支在盘上不可达`);
  } else if (m.amb.listed !== m.amb.total) {
    errors.push(`歧义腿候选清单少列：真 ${m.amb.total} 条只列了 ${m.amb.listed} 条 ⇒ 又变成「窗口当全量」`);
  }
  if (m.refuse.status !== "no-table" || !m.refuse.notes.some((s) => s.includes("to=intermediary"))) {
    errors.push(`答不了的那档必须明说：to=intermediary 得到 status=${String(m.refuse.status)} notes=${JSON.stringify(m.refuse.notes.map((s) => s.slice(0, 40)))} ⇒ 静默 miss 会被读成「该版本没有这个类」`);
  }
  return { ok: errors.length === 0, errors, tables: m.indexVersions, sum: m.declaredSum };
}

/** 发射点分块：`ambiguous: true,` 算发射点，`ambiguous: true;` 是类型声明成员（不计）。 */
export function classifyAmbiguousSites(text) {
  const lines = String(text ?? "").split(/\r?\n/);
  const marks = [];
  lines.forEach((l, i) => {
    const m = /ambiguous:\s*true\s*([,;])/.exec(l);
    if (m) marks.push({ i, kind: m[1] });
  });
  const out = [];
  for (let k = 0; k < marks.length; k++) {
    if (marks[k].kind === ";") continue;
    const i = marks[k].i;
    const indent = (lines[i].match(/^\s*/) ?? [""])[0].length;
    const hardEnd = k + 1 < marks.length ? marks[k + 1].i : Math.min(lines.length - 1, i + 80);
    let end = i;
    for (let j = i + 1; j <= hardEnd; j++) {
      const l = lines[j];
      const li = (l.match(/^\s*/) ?? [""])[0].length;
      if (/^\s*[}\)]\s*[,;]?\s*$/.test(l) && li <= indent) { end = j; break; }
      end = j;
    }
    const block = lines.slice(i, end + 1).join("\n");
    out.push({ line: i + 1, hasTotal: /candidatesTotal|rowsTotal/.test(block), block });
  }
  return out;
}

/** 采集面：`src/mappings/*.ts` 逐文件读（文件数下界防「采集器塌了当干净」）。 */
export function scanMappingSources(dir = MAPPINGS_DIR, minFiles = 5) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts")).sort();
  if (files.length < minFiles) {
    return { sources: [], error: `扫描面只采到 ${files.length} 个 .ts（下界 ${minFiles}）⇒ 目录被改名或判面塌陷，禁止按「零缺位」放行` };
  }
  return { sources: files.map((f) => ({ file: f, text: readFileSync(join(dir, f), "utf8") })), error: null };
}

/** 判据 5：棘轮 —— 缺位必须逐条在册，在册必须逐条配得上 */
export function checkRatchet(input, opts = {}) {
  const asString = typeof input === "string";
  const sources = asString ? [{ file: "<inline>", text: input }] : input;
  const strictNamed = opts.strictNamed ?? !asString;
  // 「每条豁免必须配得上站点」只在**真扫描面**上判：合成夹具天然只覆盖某一条豁免，按全量判会把正控做红
  const requireAllNamed = opts.requireAllNamed ?? false;
  const exemptMax = opts.exemptMax ?? EXEMPT_MAX;
  const errors = [];
  let sites = 0;
  let withTotal = 0;
  const missing = [];
  for (const s of sources) {
    for (const site of classifyAmbiguousSites(s.text)) {
      sites++;
      if (site.hasTotal) withTotal++;
      else missing.push({ file: s.file, line: site.line, block: site.block });
    }
  }
  if (sites === 0) errors.push("一个 ambiguous 发射点都没扫到 ⇒ 判据没跑（文件改名了？还是只喂进来了类型声明？）");
  if (strictNamed) {
    // 锚必须唯一（2026-09-27 用户裁定「小一条」）：本判据原先按 file + token **子串**匹配、不要求一对一，
    // 于是同形第二条腿会被第一条豁免整段洗白 —— 而豁免表读起来仍是「逐条在册」。先例：assert-rules-api-names
    // 的「锚唯一」。两个方向都判：一座被多条豁免认领 = 理由不成立；一条豁免认领多座 = 后那座没人解释。
    const claimsPerSite = new Map(); // `${file}:${line}` -> exemption tokens
    const claimsPerToken = new Map(); // token -> 站点数
    for (const m of missing) {
      const hits = NAMED_EXEMPT.filter((e) => e.file === m.file && m.block.includes(e.token));
      const key = `${m.file}:${m.line}`;
      claimsPerSite.set(key, hits.map((h) => h.token));
      for (const h of hits) claimsPerToken.set(h.token, (claimsPerToken.get(h.token) ?? 0) + 1);
    }
    const unregistered = missing.filter((m) => (claimsPerSite.get(`${m.file}:${m.line}`) ?? []).length === 0);
    if (unregistered.length) {
      errors.push(
        `未在册的缺位发射点 ${unregistered.length} 处：${unregistered.map((m) => `${m.file}:${m.line}`).join(", ")} ` +
          `⇒ 新增了「只回窗口清单不报真池」的腿（要么补 rowsTotal/candidatesTotal，要么给出理由进 NAMED_EXEMPT）`,
      );
    }
    for (const m of missing) {
      const toks = claimsPerSite.get(`${m.file}:${m.line}`) ?? [];
      if (toks.length > 1) {
        errors.push(`缺位 ${m.file}:${m.line} 同时被 ${toks.length} 条豁免认领（${toks.join(" ／ ")}）⇒ 锚不唯一，理由不成立，按逐条各写一条`);
      }
    }
    if (requireAllNamed) {
      for (const e of NAMED_EXEMPT) {
        const used = claimsPerToken.get(e.token) ?? 0;
        if (used === 0) errors.push(`豁免在册却配不上任何站点：${e.file} 的「${e.token}」⇒ 该腿已修好，豁免必须一起删（只许减）`);
        else if (used > 1) {
          errors.push(
            `豁免「${e.token}」一条配了 ${used} 座缺位 ⇒ 除第一座外都在被同一条理由洗白（要豁免多条须各自写清楚，锚唯一口径同 assert-rules-api-names）`,
          );
        }
      }
    }
  } else if (missing.length > exemptMax) {
    errors.push(`(inline 口径) 未带真池位的发射点 ${missing.length} > 数值上界 ${exemptMax} ⇒ 有人新开了不报池的腿`);
  }
  return { ok: errors.length === 0, errors, sites, withTotal, exempt: missing.length, named: NAMED_EXEMPT.length };
}

/** 判据 6：全局反查（lookupByObfuscated）的 LIMIT 20 腿 —— 独立尺子换成「两条分支全量取回后整行去重」 */
export function checkObfWindow(got, independentPool, again) {
  const errors = [];
  const rows = got?.rows ?? [];
  if (!got?.found || rows.length === 0) {
    return { ok: false, errors: ["该 token 一条都没命中 ⇒ 本腿未跑，禁止当合格（换一个能命中的）"], pool: independentPool, got: 0, truncated: false };
  }
  if (typeof got.rowsTotal !== "number") {
    errors.push(`缺 rowsTotal（rows=${rows.length} 会被消费侧读成全量清单）`);
  } else if (got.rowsTotal !== independentPool) {
    errors.push(`rowsTotal=${got.rowsTotal} ≠ 独立整行去重池 ${independentPool} ⇒ 计数位与真池不符`);
  }
  if (rows.length > 20) errors.push(`rows ${rows.length} > 窗口上界 20 ⇒ LIMIT 没生效`);
  const truncated = independentPool > rows.length;
  const notes = (got.notes ?? []).join(" ");
  if (truncated && !/真池/.test(notes)) errors.push(`被截（池 ${independentPool} > 本条 ${rows.length}）而 notes 没点名真池条数`);
  if (!truncated && /已截断/.test(notes)) errors.push("池未超窗口却报「已截断」");
  const tup = (r) => JSON.stringify([r.ownerClass ?? "", r.yarn ?? "", r.descriptor ?? ""]);
  for (let i = 1; i < rows.length; i++) {
    if (tup(rows[i - 1]) > tup(rows[i])) {
      errors.push(`样本第 ${i} 位比第 ${i - 1} 位「小」⇒ 没按 owner/name/descriptor 升序，两次跑可能给不同 20 条`);
      break;
    }
  }
  if (again && tup((again.rows ?? [])[0] ?? {}) !== tup(rows[0])) errors.push("同参二次跑首行不同 ⇒ 次序不可复现");
  return { ok: errors.length === 0, errors, pool: got.rowsTotal, got: rows.length, truncated };
}

/**
 * 判据 7 的取数（真跑与 --census 共用一把尺子，不留第二套判据）：
 * 逐档 `data/(fabric|quilt)_<ver>/mappings/yarn-mappings.sqlite` 数「official 出现 >1 的组数」。
 * 无 classes 表 / 读不动 ⇒ 记成**缺 groups 字段**的条目（判据会按采集缺口响，绝不塌成「该库零组」）。
 */
export async function measureOfficialGroups(dataDir = DATA) {
  const { openDatabaseSync } = await import(dist("utils/sqlite-runtime.js"));
  const out = [];
  for (const d of readdirSync(dataDir).filter((x) => /^(fabric|quilt)_\d+(\.\d+)+$/.test(x)).sort()) {
    const p = join(dataDir, d, "mappings", "yarn-mappings.sqlite");
    if (!existsSync(p)) continue;
    let db = null;
    try {
      db = openDatabaseSync(p, { readOnly: true });
      if (!db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='classes'`).get()) {
        out.push({ db: d + "（无 classes 表）" });
        continue;
      }
      const groups = db
        .prepare(
          `SELECT COUNT(*) c FROM (SELECT official FROM classes WHERE official IS NOT NULL AND official <> '' GROUP BY official HAVING COUNT(*) > 1)`,
        )
        .get().c;
      const top = db
        .prepare(
          `SELECT official, COUNT(*) c FROM classes WHERE official IS NOT NULL AND official <> '' GROUP BY official HAVING COUNT(*) > 1 ORDER BY c DESC LIMIT 1`,
        )
        .get();
      out.push({ db: d, groups, sample: top?.official, sampleCount: top?.c });
    } catch (e) {
      out.push({ db: d + "（读不动：" + String(e?.message ?? e).slice(0, 40) + "）" });
    } finally {
      if (db) db.close();
    }
  }
  return out;
}

async function realRun() {
  const errors = [];
  const { lookupMethod, lookupByObfuscated } = await import(dist("mappings/yarn-sqlite.js"));
  const { openDatabaseSync } = await import(dist("utils/sqlite-runtime.js"));
  const dbPath = join(DATA, "fabric_1.21.11", "mappings", "yarn-mappings.sqlite");
  if (!existsSync(dbPath)) return [`映射库不在：${dbPath}`];

  const owner = "net/minecraft/network/listener/ClientPlayPacketListener";
  const r = lookupMethod("1.21.11", { ownerClass: owner, memberName: "a", from: "obfuscated" });
  const db = openDatabaseSync(dbPath, { readOnly: true });
  let sqlTotal;
  let controlCase = null;
  try {
    sqlTotal = countRows(db, "methods", "owner_named = ? AND name_official = ?", ["net/minecraft/network/listener/ClientPlayPacketListener", "a"]);
    const group = db
      .prepare(
        `SELECT owner_named o, name_official n, COUNT(*) c FROM methods
         WHERE name_official IS NOT NULL GROUP BY owner_named, name_official HAVING c BETWEEN 2 AND 20 ORDER BY c DESC LIMIT 1`,
      )
      .get();
    if (group) controlCase = { owner: group.o, name: group.n, c: group.c };
  } finally {
    db.close();
  }
  const d1 = checkDisclosure(r, sqlTotal);
  if (!d1.ok) errors.push(...d1.errors);
  const descs = (r.candidates ?? []).map((c) => c.descriptor);
  const again = lookupMethod("1.21.11", { ownerClass: owner, memberName: "a", from: "obfuscated" });
  const d2 = checkOrder(descs, (again.candidates ?? []).map((c) => c.descriptor));
  if (!d2.ok) errors.push(...d2.errors);

  let ctrlNote = "没找到 2..20 的组（正控腿未跑）";
  if (controlCase) {
    const rc = lookupMethod("1.21.11", { ownerClass: controlCase.owner, memberName: controlCase.name, from: "obfuscated" });
    const dc = checkControl(rc);
    if (!dc.ok) errors.push(...dc.errors.map((e) => `正控 ${controlCase.owner}#${controlCase.name}（${controlCase.c} 条）：${e}`));
    ctrlNote = `正控 ${controlCase.owner.split("/").pop()}#${controlCase.name} 组 ${controlCase.c} 条 ⇒ total=${rc.candidatesTotal} 恒等 ✓`;
  } else {
    errors.push("正控腿未跑：现扫没找到 2..20 条的组 ⇒ 不能只凭截断腿判绿");
  }

  // 判据 6（本轮新增，L77 续趟）：全局反查 lookupByObfuscated 的 LIMIT 20 腿自己也得报真池数。
  // 独立尺子 = 门自己取两条分支的全量行、在 JS 里按整行去重（UNION 的语义），不共用生产那条 SQL。
  let obfNote = "未跑（现扫不到候选 token ⇒ 本门按判红处理）";
  {
    const db2 = openDatabaseSync(dbPath, { readOnly: true });
    try {
      const pick = db2
        .prepare(
          `SELECT name_intermediary t, COUNT(*) c FROM methods WHERE name_intermediary IS NOT NULL AND name_intermediary <> ''
           GROUP BY t ORDER BY c DESC LIMIT 1`,
        )
        .get();
      if (pick?.t) {
        const token = pick.t;
        const cols = "owner_named, name_named, descriptor_named, name_official, name_intermediary";
        const a = db2.prepare(`SELECT ${cols} FROM methods WHERE name_intermediary = ?`).all(token);
        const b = db2.prepare(`SELECT ${cols} FROM methods WHERE name_official = ?`).all(token);
        const indep = new Set([...a, ...b].map((x) => JSON.stringify(x))).size;
        const got = lookupByObfuscated("1.21.11", token, "method");
        const again = lookupByObfuscated("1.21.11", token, "method");
        const od = checkObfWindow(got, indep, again);
        if (!od.ok) errors.push(...od.errors.map((e) => `全局反查腿 token=${token}（独立池 ${indep}）：${e}`));
        obfNote = `全局反查 token=${token.length > 3 ? `${token.slice(0, 3)}…` : token} 池 ${od.pool} 取 ${od.got} ⇒ rowsTotal ✓${od.truncated ? " + 已截断披露 ✓" : "（未截断，两数恒等 ✓）"}`;
      } else {
        // 地板（2026-09-27 用户裁定：本腿原是 skip 形的 —— 不跑也 rc=0，而同函数上面的正控腿有这条地板）：
        // 「没数据」不是一种通过。不建合成库去点亮它（那是买「夹具能红」不是买「线上会走到」），只让它响。
        errors.push("判据 6 未跑：现扫 methods 没有一个非空 name_intermediary 可当候选 token ⇒ 全局反查腿没点火，禁止只凭其余腿判绿");
      }
    } finally {
      db2.close();
    }
  }

  // 判据 7（死腿引线）：逐库现扫 classes.official 是否有 >1 的组（取数函数与 --census 共用同一把尺子）
  const perDb = await measureOfficialGroups();
  const d7 = checkOfficialUniqueness(perDb);
  if (!d7.ok) errors.push(...d7.errors);

  // 判据 8（第二档在盘可达）：三发行为全走生产 convertMapping；表文件行数由门自己另读一把尺子核 index 自述。
  const pm = {
    indexVersions: 0,
    declaredSum: 0,
    missing: [],
    drift: [],
    hit: { name: "Container", status: null, converted: null, notes: [] },
    amb: { name: "BlockPredicate", status: null, total: 0, listed: 0, notes: [] },
    refuse: { status: null, notes: [] },
  };
  {
    const pdir = join(DATA, "_yarn-mojmap-pairs");
    const ip = join(pdir, "index.json");
    if (existsSync(ip)) {
      try {
        const vers = JSON.parse(readFileSync(ip, "utf8")).versions ?? {};
        const entries = Object.entries(vers);
        pm.indexVersions = entries.length;
        for (const [v, e] of entries) {
          const file = String(e?.file ?? "");
          const p = join(pdir, file);
          if (!file || !existsSync(p)) {
            pm.missing.push(`${v}:${file || "?"}`);
            continue;
          }
          pm.declaredSum += Number(e?.count) || 0;
          let actual = -1;
          try {
            actual = (JSON.parse(readFileSync(p, "utf8")).pairs ?? []).length;
          } catch {
            actual = -1;
          }
          if (actual !== Number(e?.count)) pm.drift.push({ table: file, declared: e?.count, actual });
        }
      } catch {
        pm.missing.push("index.json 不可解析");
      }
    }
    const { convertMapping } = await import(dist("mappings/convert.js"));
    const read = (args) => {
      const r = convertMapping(args) ?? {};
      const notes = (r.notes ?? []).map(String);
      let status = "miss";
      if (r.found && notes.some((s) => s.includes("第二档出处"))) status = "hit";
      else if (r.found) status = "sqlite-hit";
      else if (r.ambiguous) status = "ambiguous";
      else if (notes.some((s) => s.includes("to=intermediary"))) status = "no-table";
      return { status, notes, converted: r.converted, total: r.candidatesTotal, listed: Array.isArray(r.candidates) ? r.candidates.length : 0 };
    };
    const h = read({ from: "mojang", to: "yarn", memberName: pm.hit.name, version: "1.21.11", memberKind: "class" });
    pm.hit.status = h.status;
    pm.hit.converted = h.converted;
    pm.hit.notes = h.notes;
    const a = read({ from: "mojang", to: "yarn", memberName: pm.amb.name, version: "1.21.11", memberKind: "class" });
    pm.amb.status = a.status;
    pm.amb.total = a.total ?? 0;
    pm.amb.listed = a.listed;
    pm.amb.notes = a.notes;
    const rf = read({ from: "mojang", to: "intermediary", memberName: "Container", version: "1.21.11", memberKind: "class" });
    pm.refuse.status = rf.status;
    pm.refuse.notes = rf.notes;
  }
  const d8 = checkPairsFace(pm);
  if (!d8.ok) errors.push(...d8.errors);

  const face = scanMappingSources();
  if (face.error) errors.push(face.error);
  const dr = checkRatchet(face.sources, { requireAllNamed: true });
  if (!dr.ok) errors.push(...dr.errors);

  console.log(
    `  真跑：截断腿 样本 ${(r.candidates ?? []).length} / 真池 ${r.candidatesTotal}（独立 SQL=${sqlTotal}）notes 点名 ✓ · ` +
      `次序升序 + 两次一致 ✓ · ${ctrlNote} · ${obfNote} · ` +
      `棘轮（全 src/mappings 面 ${face.sources?.length ?? 0} 文件）发射点 ${dr.sites} 带数 ${dr.withTotal} 缺位 ${dr.exempt}（在册具名豁免 ${dr.named}，逐条点名）· ` +
      `判据7 ${d7.libs} 库 classes.official 现扫 >1 组 = ${d7.groups}（引线未响）· ` +
      `判据8 ${d8.tables} 张派生表 Σ${d8.sum} 条 · hit=${pm.hit.status}/${pm.hit.converted} · amb=${pm.amb.total} 条列全 ${pm.amb.listed} · refuse=${pm.refuse.status}`,
  );
  return errors;
}

function selfTest() {
  const cases = [];
  const trunc = { ambiguous: true, candidates: Array.from({ length: 20 }, (_, i) => ({ descriptor: `d${i}` })), candidatesTotal: 122, notes: ["存在多个重载，请传入 descriptor（本条列出按 descriptor 排序的前 20 条，同条件真池 122 条，已截断）"] };
  cases.push(["正控：齐全 ⇒ 绿", checkDisclosure(trunc, 122).ok]);
  cases.push(["投毒①：摘 candidatesTotal ⇒ 红", checkDisclosure({ ...trunc, candidatesTotal: undefined }, 122).ok === false]);
  cases.push(["投毒②：total 报成窗口条数（20）⇒ 红（措辞随即失去真池）", checkDisclosure({ ...trunc, candidatesTotal: 20, notes: ["前 20 条，真池 20 条，已截断"] }, 122).ok === false]);
  cases.push(["投毒③：total 比样本还小 ⇒ 红", checkDisclosure({ ...trunc, candidatesTotal: 3 }, 122).ok === false]);
  cases.push(["投毒④：notes 不点名 122 ⇒ 红", checkDisclosure({ ...trunc, notes: ["请传 descriptor"] }, 122).ok === false]);
  cases.push(["投毒⑤：found:false 但没标 ambiguous（判据未跑）⇒ 红", checkDisclosure({ ambiguous: false, found: false }, 122).ok === false]);
  cases.push(["正控：升序样本 ⇒ 绿", checkOrder(["a", "b", "c"], ["a", "b", "c"]).ok]);
  cases.push(["投毒⑥：乱序 ⇒ 红", checkOrder(["b", "a"], ["b", "a"]).ok === false]);
  cases.push(["投毒⑦：两次不同 ⇒ 红", checkOrder(["a", "b"], ["a", "z"]).ok === false]);
  cases.push(["投毒⑧：空样本（判据没跑）⇒ 红", checkOrder([], []).ok === false]);
  const ctrl = { ambiguous: true, candidates: [{ descriptor: "a" }, { descriptor: "b" }], candidatesTotal: 2, notes: ["前 2 条，同条件真池 2 条"] };
  cases.push(["正控：池≤窗口两数恒等 ⇒ 绿", checkControl(ctrl).ok]);
  cases.push(["投毒⑨：正控两数不等 ⇒ 红", checkControl({ ...ctrl, candidatesTotal: 9 }).ok === false]);
  cases.push(["投毒⑩：正控却写已截断 ⇒ 红", checkControl({ ...ctrl, notes: ["已截断"] }).ok === false]);
  const srcGood = "ambiguous: true,\n candidatesTotal,\n".repeat(8);
  const srcBad = "ambiguous: true,\n mappingEra: era,\n".repeat(9);
  cases.push(["正控：全部发射点带数 ⇒ 绿", checkRatchet(srcGood).ok]);
  cases.push(["投毒⑪：发射点全不带数 ⇒ 红", checkRatchet(srcBad).ok === false]);
  cases.push(["投毒⑫：一个发射点都没扫到 ⇒ 红", checkRatchet("const x = 1;").ok === false]);
  // —— 下面四例钉的是「扩面之后」的新形状（inline 字符串走数值上界，文件列表走逐条在册）——
  cases.push([
    "正控：缺位但逐条配得上具名豁免 ⇒ 绿",
    checkRatchet([{ file: "convert.ts", text: "ambiguous: true,\n candidates: methods.map((m) => ({\n" }]).ok,
  ]);
  cases.push([
    "投毒⑬：缺位且未在册（新开了不报池的腿）⇒ 红",
    checkRatchet([{ file: "yarn-sqlite.ts", text: "ambiguous: true,\n candidates: hits.map(\n" }]).ok === false,
  ]);
  cases.push([
    "投毒⑭：豁免在册却配不上任何站点（腿已修好、豁免没删）⇒ 红",
    checkRatchet([{ file: "convert.ts", text: "ambiguous: true,\n candidatesTotal: 7,\n" }], { requireAllNamed: true }).ok === false,
  ]);
  cases.push([
    "投毒⑮：面里只剩类型声明（分号形）⇒ 红，不得读成零缺位",
    checkRatchet([{ file: "lookup-obfuscated.ts", text: "  ambiguous: true;\n  rows: X[];\n" }]).ok === false,
  ]);
  // 锚唯一两面（2026-09-27「小一条」裁定）：豁免按 file+token 子串匹配 ⇒ 不判唯一时，第二条同形腿会被第一条洗白
  cases.push([
    "投毒⑳：一条豁免配两座缺位 ⇒ 红（后那座没人解释）",
    checkRatchet(
      [
        { file: "convert.ts", text: "ambiguous: true,\n candidates: methods.map((m) => ({\n" },
        { file: "convert.ts", text: "ambiguous: true,\n candidates: methods.map((n) => ({\n" },
      ],
      { requireAllNamed: true },
    ).ok === false,
  ]);
  cases.push([
    "投毒㉑：一座缺位同时被两条豁免认领 ⇒ 红（锚不唯一，理由不成立）",
    checkRatchet([{ file: "convert.ts", text: "ambiguous: true,\n candidates: methods.map((m) => ({\n // classes.official 命中多条\n" }])
      .ok === false,
  ]);
  // 判据 7 / 8 的夹具（合成分母，不碰磁盘）：一条「引线」和一条「第二档在盘可达」都必须能红
  const pfOk = () => ({
    indexVersions: 15,
    declaredSum: 1000,
    missing: [],
    drift: [],
    hit: { name: "Container", status: "hit", converted: "net.minecraft.inventory.Inventory", notes: ["第二档出处 = 派生对照表", "official 列存的是混淆短名"] },
    amb: { name: "BlockPredicate", status: "ambiguous", total: 3, listed: 3, notes: [] },
    refuse: { status: "no-table", notes: ["答不了 to=intermediary"] },
  });
  cases.push(["正控：判据 7 逐库 0 组 ⇒ 绿", checkOfficialUniqueness([{ db: "fabric_1.21.11", groups: 0 }, { db: "quilt_1.20.1", groups: 0 }]).ok]);
  cases.push([
    "投毒㉒：某库冒出 >1 组 ⇒ 红并点名「删豁免 #2」",
    /豁免 第?2|NAMED_EXEMPT 第 2/.test(checkOfficialUniqueness([{ db: "fabric_1.21.11", groups: 2, sample: "abc", sampleCount: 2 }]).errors.join(" ")),
  ]);
  cases.push(["投毒㉓：判据 7 一库都没扫到 ⇒ 红（采集面塌不得读成零组）", checkOfficialUniqueness([]).ok === false]);
  cases.push(["投毒㉔：某库没数出 groups（无表/读不动）⇒ 红", checkOfficialUniqueness([{ db: "fabric_1.14.4（无 classes 表）" }]).ok === false]);
  cases.push(["正控：判据 8 三发行为齐全 ⇒ 绿", checkPairsFace(pfOk()).ok]);
  cases.push(["投毒㉕：index 自述条数 ≠ 门实读 ⇒ 红", checkPairsFace({ ...pfOk(), drift: [{ table: "yarn-mojmap-1.21.11.json", declared: 9686, actual: 9685 }] }).ok === false]);
  cases.push(["投毒㉖：第二档没接上（sqlite-hit，未走派生表）⇒ 红", checkPairsFace({ ...pfOk(), hit: { ...pfOk().hit, status: "sqlite-hit" } }).ok === false]);
  cases.push(["投毒㉗：命中吐斜杠形 ⇒ 红（同一工具两套 outward 格式）", checkPairsFace({ ...pfOk(), hit: { ...pfOk().hit, converted: "net/minecraft/inventory/Inventory" } }).ok === false]);
  cases.push(["投毒㉘：命中却不披露第二档 ⇒ 红", checkPairsFace({ ...pfOk(), hit: { ...pfOk().hit, notes: ["未找到类: Container"] } }).ok === false]);
  cases.push(["投毒㉙：歧义 3 条只列 2 条 ⇒ 红（又变成窗口当全量）", checkPairsFace({ ...pfOk(), amb: { ...pfOk().amb, listed: 2 } }).ok === false]);
  cases.push(["投毒㉚：to=intermediary 静默 miss ⇒ 红（会被读成「该版本没有这个类」）", checkPairsFace({ ...pfOk(), refuse: { status: "miss", notes: [] } }).ok === false]);
  // ⚠️ 夹具的 owner 必须**按字符串升序**（o01…o20）：写成 o0..o19 时 "o9" > "o10" ⇒ 正控会被自己的排序腿做红
  const pad = (i) => String(i + 1).padStart(2, "0");
  const obf = {
    found: true,
    rowsTotal: 122,
    rows: Array.from({ length: 20 }, (_, i) => ({ ownerClass: `o${pad(i)}`, yarn: "a", descriptor: `d${pad(i)}` })),
    notes: ["同条件真池 122 条，已截断"],
  };
  cases.push(["正控：全局反查腿两数与去重池相符 ⇒ 绿", checkObfWindow(obf, 122, obf).ok]);
  cases.push(["投毒⑯：全局反查缺 rowsTotal ⇒ 红", checkObfWindow({ ...obf, rowsTotal: undefined }, 122, obf).ok === false]);
  cases.push(["投毒⑰：rowsTotal 报成窗口条数（20）⇒ 红", checkObfWindow({ ...obf, rowsTotal: 20 }, 122, obf).ok === false]);
  cases.push(["投毒⑱：被截却不点名真池 ⇒ 红", checkObfWindow({ ...obf, notes: [] }, 122, obf).ok === false]);
  cases.push(["投毒⑲：乱序样本 ⇒ 红", checkObfWindow({ ...obf, rows: [...obf.rows].reverse() }, 122, obf).ok === false]);
  let bad = 0;
  for (const [label, pass] of cases) {
    console.log(`  ${pass ? "✓" : "✗"} ${label}`);
    if (!pass) bad++;
  }
  // 分母按标签现数（本门若写死「4 + 12」，将来加一例删一例都不会自报）
  const pos = cases.filter(([l]) => l.startsWith("正控")).length;
  console.log(`自检 ${cases.length - bad}/${cases.length} 通过（${pos} 正控 + ${cases.length - pos} 投毒，四腿各有红形，分母现数）`);
  return bad;
}

/**
 * 逐点表（`--census`）：把「本门到底扫到了什么」打印出来，供登记分母用。
 * ⚠️ 这里**不设 import 守卫**：上一版为了让外部探针 import 分类器而加了 `import.meta.url === argv[1]` 判断，
 * 结果在 Windows 上路径口径不符 ⇒ 门被 spawn 时一条腿都没跑、什么都不印、退出码还是 0 ——
 * 而 test-scripts 的 rc 来自管道尾部的话更是假绿。判面塌了必须**响**，所以本门永远直接执行；
 * 要分母请跑 `--census`（同一份分类器，不存在第二套判据）。
 */
async function printCensus() {
  const face = scanMappingSources();
  if (face.error) {
    console.error(`FAIL：${face.error}`);
    return 1;
  }
  const missing = [];
  for (const s of face.sources) {
    for (const site of classifyAmbiguousSites(s.text)) {
      if (!site.hasTotal) {
        const named = NAMED_EXEMPT.find((e) => e.file === s.file && site.block.includes(e.token));
        missing.push(`${s.file}:${site.line}${named ? `  [在册: ${named.token}]` : "  [未在册]"}`);
      }
    }
  }
  const r = checkRatchet(face.sources, { requireAllNamed: true });
  const d7 = checkOfficialUniqueness(await measureOfficialGroups());
  console.log(`扫描面 ${face.sources.length} 个 src/mappings/*.ts · 发射点 ${r.sites} · 带真池位 ${r.withTotal} · 缺位 ${r.exempt} · 具名豁免 ${r.named}`);
  console.log(
    `official 唯一性引线（判据 7）：${d7.libs} 库现扫 · >1 组 = ${d7.groups}` +
      (d7.ok ? " ⇒ 那条「命中多条」腿结构上不可达，豁免 #2 的理由此刻成立" : " ⇒ 引线已响"),
  );
  for (const m of missing) console.log(`  缺位 ${m}`);
  for (const e of [...r.errors, ...d7.errors]) console.log(`  RED ${e}`);
  return r.ok && d7.ok ? 0 : 1;
}

if (process.argv.includes("--selftest")) {
  process.exit(selfTest() ? 1 : 0);
}
if (process.argv.includes("--census")) {
  process.exit(await printCensus());
}
const errs = await realRun();
if (errs.length) {
  console.error("FAIL：歧义候选的真池位/次序/棘轮/全局反查腿回归\n" + errs.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log("OK：candidatesTotal 与独立 COUNT 相符、样本有序可复现、正控恒等、豁免逐条在册、全局反查腿自报真池");
