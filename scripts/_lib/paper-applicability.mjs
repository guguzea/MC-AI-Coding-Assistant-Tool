/**
 * paper 版本档「适用性核查」的纯函数库（生成器与门共用同一份实现）。
 *
 * 判据来源：`paper/26.3/rules/*.md` 里的 `<name>.md:<line>` 指针；
 * 对每个目标版本，核「26.3 引用的类/成员在本版签名面里还在不在」。
 *
 * 写作纪律（与 `paper/<ver>/rules/00-applicability.md` 自述一致）：
 *  - 只写**能机核**的：类在不在、成员名在不在；
 *  - **抽不出成员名**（声明行 / 纯 `**Interface X**` 行）记 `memberUnresolved`，
 *    **不得**并进 `memberMissing`（那等于把「解析失败」说成「成员被删」）；
 *  - 教程面（`paper_stable`）指针不随版本变，记 `tutorial`，不判「该版有没有」。
 *
 * 抽名规则（2026-10-30 修）：
 *  - 只接受**成员行**形态 `- \`<signature>\``；`**Interface X**`、裸 `` `public interface X …` ``
 *    这类**声明行**一律 null（它们没有成员名可抽）；
 *  - 方法：取**最后一个**「标识符 + `(`」的标识符（跳过注解）；
 *  - 字段/常量：取清理后的**最后一个标识符**（`public static final PermissionDefault TRUE` → `TRUE`）。
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** 三个稳定语料面（相对 data/），顺序即解析优先级。 */
export const PAPER_CORPUS_FACES = [
  ["spigot", "spigot_stable/spigot-javadoc/stable/processed"],
  ["paperStable", "paper-api_stable/paper-javadoc/stable/processed"],
  ["tut", "paper_stable/paper-docs/stable/processed"],
];

/** 版本签名面（相对 data/）。 */
export function versionFaceDir(dataRoot, version) {
  return join(dataRoot, `paper-api_${version}/paper-javadoc/${version}/processed`);
}

export function listMd(dir) {
  return new Set(existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")) : []);
}

/** 短名 → 扁平文件名（支持后缀匹配，如 `PluginManager` → `org_bukkit_plugin_PluginManager.md`）。 */
export function findPage(bare, index) {
  for (const f of index) {
    if (f === `${bare}.md` || f.endsWith(`_${bare}.md`)) return f;
  }
  return null;
}

/**
 * 从一行语料正文里抽成员名；抽不出返回 null（调用方记 `memberUnresolved`，不得当成员缺失）。
 * 只接受成员行 `- \`…\`` 形态。
 */
export function memberOf(line) {
  const trimmed = (line ?? "").trim();
  // 枚举常量合并行（1.12.2 语料形态）：`- 枚举常量：`A` · `B` · `C``。
  // 这类行一条含多个常量名，按「最后一个标识符」抽只会抽到第一个常量 ⇒ 目标版把常量拆成多行时
  // 必然找不到（实测：1.12.2 的 EventPriority/PermissionDefault 报 LOWEST/TRUE「不在本版」，
  // 而它们在 1.21.4 页面里逐行都在）。⇒ 返回 sentinel，由 computeForVersion 按「任一 token 命中」核。
  if (/枚举常量/.test(trimmed)) {
    const toks = [...trimmed.matchAll(/`([A-Za-z_$][\w$]*)`/g)].map((x) => x[1]);
    return toks.length ? { any: toks } : null;
  }
  const m = trimmed.match(/^-\s+`(.+)`$/);
  if (!m) return null; // 声明行（`**Interface X**` / 裸 `` `public interface X …` ``）没有成员名
  const sig = m[1].trim();
  if (/@interface|^\s*(public|protected|private)?\s*(abstract\s+|final\s+)*(class|interface|enum|record)\b/.test(sig)) {
    return null; // 类型声明行
  }
  const calls = [...sig.matchAll(/(?:^|[^\w$@])([A-Za-z_$][\w$]*)\s*\(/g)];
  if (calls.length) return calls[calls.length - 1][1];
  const ids = [...sig.matchAll(/([A-Za-z_$][\w$]*)/g)];
  return ids.length ? ids[ids.length - 1][1] : null;
}

/** 成员名的展示形态（`{any:[...]}` 取第一个代表 + 标记多值）。 */
export function memberLabel(member) {
  if (!member) return null;
  if (typeof member === "string") return member;
  return member.any?.[0] ?? null;
}

/**
 * 收集 `paper/26.3/rules/*.md` 里的语料指针。
 * @param rulesDir 规则目录
 * @param indexes  `{ [faceKey]: Set<文件名> }`（`PAPER_CORPUS_FACES` 的键）
 * @param dirs     `{ [faceKey]: 绝对目录 }`
 * @returns [{rule, bare, line, srcKey, srcFile, text, member}]
 */
export function collectPointers(rulesDir, indexes, dirs) {
  const out = [];
  if (!existsSync(rulesDir)) return out;
  for (const f of readdirSync(rulesDir).filter((x) => x.endsWith(".md"))) {
    const t = readFileSync(join(rulesDir, f), "utf8");
    for (const m of t.matchAll(/([A-Za-z0-9_-]+)\.md:(\d+)(?:-(\d+))?/g)) {
      const bare = m[1];
      const line = Number(m[2]);
      let srcKey = null;
      let srcFile = null;
      for (const [key] of PAPER_CORPUS_FACES) {
        const hit = findPage(bare, indexes[key] ?? new Set());
        if (hit) {
          srcKey = key;
          srcFile = hit;
          break;
        }
      }
      if (!srcFile) continue;
      const lines = readFileSync(join(dirs[srcKey], srcFile), "utf8").split(/\r?\n/);
      const text = (lines[line - 1] ?? "").trim();
      // 范围描述指针（"X.md:71 之后的行" / "X.md:31-70 各成员"）不是成员指针：
      // 它指向「从这里往后的一整段」，抽取同行末尾的标识符只会得到误报
      // （实测：26.3 的 03-inventory-gui.md:53 写 "ItemMeta.md:71 之后的行" ⇒ 抽到同句的 setDamageType，
      //  5 个版本档全被误判为「成员不在本版」）。判据 = 指针后紧跟范围词。
      const tail = t.slice(m.index + m[0].length, m.index + m[0].length + 12);
      const isRange = /^\s*(?:[-~]\s*\d+)?\s*(?:之后|以上|以前|之前|起|往后|后面的行|以后)/.test(tail);
      out.push({ rule: f, bare, line, srcKey, srcFile, text, member: isRange ? null : memberOf(text) });
    }
  }
  return out;
}

/** 去重：同一 (srcFile, srcLine, member) 只留一行（规则文件里重复引用同一行很常见）。 */
export function dedupePointers(pointers) {
  const seen = new Set();
  const out = [];
  for (const p of pointers) {
    const k = `${p.srcFile}:${p.line}:${p.member ?? ""}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(p);
  }
  return out;
}

/**
 * 对单个版本核一遍。
 * @returns {{rows, counts, pages, shell}}
 */
export function computeForVersion(version, { dataRoot, pointers, verFace }) {
  const dir = verFace ?? versionFaceDir(dataRoot, version);
  if (!existsSync(dir)) return null;
  const index = listMd(dir);
  const pages = [...index];
  let shell = 0;
  for (const p of pages) {
    if (readFileSync(join(dir, p), "utf8").includes("只输出类型声明")) shell++;
  }
  const rows = [];
  for (const p of pointers) {
    if (p.srcKey === "tut") {
      rows.push({ ...p, status: "tutorial", note: "教程面不分版本（同一份当前文档）" });
      continue;
    }
    const hit = findPage(p.bare, index);
    if (!hit) {
      rows.push({ ...p, status: "no-class" });
      continue;
    }
    if (!p.member) {
      rows.push({ ...p, status: "member-unresolved", newFile: hit });
      continue;
    }
    const lines = readFileSync(join(dir, hit), "utf8").split(/\r?\n/);
    // 多值形态（枚举常量合并行）：任一 token 命中即算「在」
    const names = typeof p.member === "string" ? [p.member] : p.member.any ?? [];
    let newLine = 0;
    let hitName = null;
    for (const nm of names) {
      const at = lines.findIndex((l) => l.includes(`${nm}(`) || new RegExp(`\\b${escapeRe(nm)}\\b`).test(l)) + 1;
      if (at > 0) {
        newLine = at;
        hitName = nm;
        break;
      }
    }
    // 「目标页根本不列这一类成员」≠「成员被删」。实测：paper-api_1.12.2 的
    // EventPriority / PermissionDefault 页只有 getSlot/valueOf/values —— 上游那一版 javadoc
    // 不列枚举常量（同页在 1.16.5+ 都列 LOWEST/TRUE）。这种页面对枚举常量只能记「未核」。
    if (newLine === 0 && isEnumConstantPointer(p, lines)) {
      // member-unresolved 契约：member 必须为 null（门的 ⑨ 判据），把原 token 挪到 note 留痕
      const raw = typeof p.member === "string" ? p.member : (p.member.any ?? [])[0];
      rows.push({ ...p, member: null, status: "member-unresolved", newFile: hit, note: `目标页不列枚举常量（上游 javadoc 边界）；原 token: ${raw}` });
      continue;
    }
    rows.push({
      ...p,
      member: typeof p.member === "string" ? p.member : hitName,
      memberMatchedAny: typeof p.member === "string" ? undefined : hitName !== null,
      status: newLine > 0 ? "ok" : "no-member",
      newLine,
      newFile: hit,
    });
  }
  const sig = rows.filter((r) => r.srcKey !== "tut");
  const counts = {
    signaturePointers: sig.length,
    memberStillPresent: sig.filter((r) => r.status === "ok").length,
    classMissing: sig.filter((r) => r.status === "no-class").length,
    memberMissing: sig.filter((r) => r.status === "no-member").length,
    memberUnresolved: sig.filter((r) => r.status === "member-unresolved").length,
    tutorialPointers: rows.filter((r) => r.status === "tutorial").length,
  };
  return { rows, counts, pages: pages.length, shell };
}

/**
 * 该指针是否是「枚举常量」且目标页整页没有任何枚举常量行。
 * 形态判据：源行含 枚举常量 / public static final <Type> NAME；目标页无任何 public static final 行。
 */
function isEnumConstantPointer(p, targetLines) {
  const src = (p.text ?? "").trim();
  // 源行形态（去反引号后判）：- `public static final EventPriority LOWEST`
  const bare = src.replace(/`/g, "").trim();
  const looksEnum =
    /枚举常量/.test(bare) ||
    /public\s+static\s+final\s+[A-Z][\w.$]*(<[^>]*>)?\s+[A-Z_][A-Z0-9_]*\s*$/.test(bare);
  if (!looksEnum) return false;
  return !targetLines.some((l) => /public\s+static\s+final\s/.test(l));
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 机读件（`paper/<ver>/applicability.json`）。 */
export function buildApplicabilityJson(version, { asOf, pages, shell, rows, counts, checkedFrom }) {
  return {
    version,
    generatedBy: "scripts/gen-paper-version-packs.mjs",
    checkedFrom,
    asOfVersion: asOf,
    typesInSignatureFace: pages,
    typeShellPages: shell,
    counts,
    rows: rows.map((r) => ({
      rule: r.rule,
      bare: r.bare,
      srcKey: r.srcKey,
      srcFile: r.srcFile,
      srcLine: r.line,
      member: r.member ?? null,
      status: r.status,
      ...(r.newFile ? { newFile: r.newFile } : {}),
      ...(r.newLine ? { newLine: r.newLine } : {}),
      ...(r.note ? { note: r.note } : {}),
    })),
  };
}

/** 由机读件渲染 md（**单一来源**：md 必须是 json 的函数，门按此复核）。 */
export function renderApplicabilityMd(version, data) {
  const { counts, rows } = data;
  const ok = rows.filter((r) => r.status === "ok");
  const noMember = rows.filter((r) => r.status === "no-member");
  const noClass = rows.filter((r) => r.status === "no-class");
  const unresolved = rows.filter((r) => r.status === "member-unresolved");
  const shellPct = data.typesInSignatureFace ? ((data.typeShellPages / data.typesInSignatureFace) * 100).toFixed(1) : "0.0";
  return `# 00 · Paper ${version} 档的适用性核查（**不是** 26.3 规则正文）

**本档不含独立的 10 条规则正文。** 服务端面的规则正文只有 \`paper/26.3/rules/\` 一份（00–09），
本档给它加的是**版本适用性**：26.3 每条出处指向的 API，在 Paper ${version} 的签名面里还在不在。

> 为什么不复制那 10 条：Paper 的**教程正文**上游不按 MC 版本分（只有一份当前文档），
> 26.3 的结论直接搬到 ${version} 就是「没核过却声称适用」= 编造。本档只写能机核的部分。

本文件由 \`scripts/gen-paper-version-packs.mjs\` 从 \`paper/${version}/applicability.json\` 渲染；
机读数据以该 json 为准，本 md 不得手工改（改 json 后重跑）。

## 本版事实（机核，非推断）

| 项 | 值 | 出处 |
|---|---|---|
| 签名面 | \`data/paper-api_${version}/paper-javadoc/${version}/\` | \`meta.json\` |
| \`asOfVersion\` | \`${data.asOfVersion}\` | 上游 \`index.html\` 的 \`<title>\`，取数器双向对钉 |
| 类页 | **${data.typesInSignatureFace}** 篇 | \`type-search-index.js\` |
| 纯类型声明页（无成员签名） | **${data.typeShellPages}** 篇（${shellPct}%） | 页内含 \`只输出类型声明\` |

## 26.3 的签名面指针在本版的存活

| 状态 | 条数 |
|---|---|
| ✅ 类在 + 成员名在（行号已按本版重定位） | **${counts.memberStillPresent}** |
| ⚠ 类在、成员名找不到（该成员在本版被删/改名） | ${counts.memberMissing} |
| ❓ 类在、**抽不出成员名**（来源行是类型声明，未核） | ${counts.memberUnresolved} |
| ❌ 类不在（本版没有这个类） | ${counts.classMissing} |
| — 教程面指针（不分版本，未核） | ${counts.tutorialPointers} |

${ok.length ? `### ✅ 成员仍在（可直接沿用 26.3 的对应条款）\n\n| 26.3 出处 | 本版出处（已重定位） |\n|---|---|\n${ok.slice(0, 40).map((r) => `| \`${r.srcFile}:${r.srcLine}\` | \`${r.newFile}:${r.newLine}\` |`).join("\n")}\n` : ""}
${noMember.length ? `### ⚠ 成员名不在本版（**不得**照用 26.3 的对应条款）\n\n${noMember.map((r) => `- \`${r.srcFile}:${r.srcLine}\` —— 成员 \`${r.member}\` 在 Paper ${version} 的 \`${r.bare}\` 页面里找不到`).join("\n")}\n` : ""}
${unresolved.length ? `### ❓ 抽不出成员名（未核，**不是**成员缺失）\n\n这些指针的**来源行是类型声明**（如 \`**Interface X**\` / \`public interface X …\`），没有成员名可抽 ⇒ 本档只核到「类在」。\n\n${unresolved.map((r) => `- \`${r.srcFile}:${r.srcLine}\` —— \`${r.bare}\`（来源行非成员行）`).join("\n")}\n` : ""}
${noClass.length ? `### ❌ 类不在本版\n\n${noClass.map((r) => `- \`${r.srcFile}:${r.srcLine}\` —— Paper ${version} 没有 \`${r.bare}\``).join("\n")}\n` : ""}
## 怎么写

1. **规则正文读 \`paper/26.3/rules/\`**（00–09 十篇），那里每条都带出处。
2. 动笔前先查本档上面两张表：命中「⚠ 成员名不在」或「❌ 类不在」的条款，**不许照用**。
3. 要用本版才有的 API：查 \`get_doc_full platform=paper-api id=${version}/<fqcn 扁平化>\`。

## 未核实（明写，别当已核）

- **没有**在 Paper ${version} 上真机跑过任何插件（本档零真机；26.3 档的 JDK/classpath/api-version 实测结论不自动继承）。
- **没有**逐方法比对成员签名（只核「这个方法名还在不在」，不核参数表是否变化）。
- 教程面指针（${counts.tutorialPointers} 处）指向的是**当前文档**，其正文可能已按新版改写，未按 ${version} 复核。
- 「抽不出成员名」${counts.memberUnresolved} 处只核到类级（来源行是类型声明），未逐个找成员。
- 「纯类型声明页」${data.typeShellPages} 篇是上游页面本身没有成员签名（注解/嵌套 record/纯继承接口），不是抓取失败；但也意味着这些类的成员本档没有证据。
`;
}
