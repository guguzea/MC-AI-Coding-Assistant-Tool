#!/usr/bin/env node
/**
 * ingest-forge-srg — 把 **MCPConfig 的 `srg_to_official` / `srg_to_parchment` tsrg** 削减成
 * 本仓可入库的「Forge 1.17+ SRG 成员名」来源，落到 `data/forge_<v>/mappings/`。
 *
 * 为什么要它（未做清单③的答案）：Forge 1.17 起 FG 把 named 层换成 Mojang 官方映射，AT 成员行
 * 的 SRG 位置上变成哈希形状 `m_<数字>_` / `f_<数字>_`。本仓六档（1.16.5 / 1.17.1 / 1.18.2 /
 * 1.19.4 / 1.20.1 / 1.20.4）此前**任何库里都没有可用的成员名** —— 实测：
 *   · `data/forge_1.17.1/mappings/client.txt`（6,437,531 B）含 `m_\d+_` / `f_\d+_` 行 = **0**
 *     （mojmap 只给可读名 + 行尾 obf 短名）；
 *   · `data/forge_<v>/mappings/parchment.json`（10.0–14.7 MB，五档）含 `m_\d+_` / `f_\d+_` /
 *     `func_\d+_` = **0**（Parchment 1.1.0 schema 只有 `name`/`descriptor`/`parameters`/`javadoc`）。
 * 唯一带这套名字的成品 = MCPConfig 的 `srg_to_*.tsrg`（ForgeGradle 每次构建都会解到本机缓存）。
 *
 * 来源与许可姿态：上游 = `de.oceanlabs.mcp:mcp_config`（maven.neoforged.net），本机落点
 * `~/.gradle/caches/forge_gradle/minecraft_user_repo/de/oceanlabs/mcp/mcp_config/<v>-<ts>/`，
 * 同目录 `<名字>.input` 带 MCPConfig 的两个 commit SHA（`mapping=` / `mcp=`），原样抄进 provenance。
 * **入库的不是那份文件逐字节**：本脚本丢掉参数层行（`\t\t0 p_… pName`）、修饰行（`static` /
 * `final`）、`<init>` / `<clinit>`，只留「类行 + `m_/f_` + 描述符 + 可读名」，并在 provenance 里
 * 记删了多少行。这与仓内既有先例同类（`data/forge_1.16.5/mappings/obf_to_srg.tsrg` 就是 MCPConfig
 * 产物、tracked；`client.txt` 才是被 .gitignore 排除的那一件）。
 *
 * 用法：
 *   node scripts/ingest-forge-srg.mjs                       # 默认五档，DRYRUN 只打印落点
 *   node scripts/ingest-forge-srg.mjs --write               # 真落盘（data/** 与 provenance）
 *   node scripts/ingest-forge-srg.mjs --versions=1.20.1 --cache=<dir>
 * 之后重建映射库：node scripts/_lib/build-yarn-sqlite.mjs --dir=../data/forge_1.20.1/mappings --write
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { emitAtomic, logDryRunBanner, wantWrite } from "../../scripts/_lib/write-guard.mjs";

const DEFAULT_VERSIONS = ["1.16.5", "1.17.1", "1.18.2", "1.19.4", "1.20.1", "1.20.4"];
/** 同名候选并存时的取序：official 层是 AT 行要的可读名口径，parchment 只作回落。 */
const FLAVOR_RANK = ["srg_to_official", "srg_to_parchment", "srg_to_snapshot"];

function argVal(name) {
  const p = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(p));
  return hit ? hit.slice(p.length) : null;
}

const cacheRoot = argVal("cache")
  ? path.resolve(String(argVal("cache")))
  : path.join(os.homedir(), ".gradle", "caches", "forge_gradle", "minecraft_user_repo", "de", "oceanlabs", "mcp", "mcp_config");
const versions = (argVal("versions") ?? "").split(",").map((s) => s.trim()).filter(Boolean).length
  ? (argVal("versions") ?? "").split(",").map((s) => s.trim()).filter(Boolean)
  : DEFAULT_VERSIONS;

/** 归一化本机路径：provenance 是要入库的文本，钉盘符 = 把「我这台机器」写进仓库历史。 */
function Tilde(p) {
  const home = os.homedir();
  return String(p).startsWith(home) ? `~/${String(p).slice(home.length).replace(/^[\\/]/, "").replace(/\\/g, "/")}` : p;
}

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function findSource(version) {
  if (!existsSync(cacheRoot)) return null;
  const dirs = readdirSync(cacheRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.startsWith(`${version}-`))
    .map((e) => e.name)
    .sort();
  for (const dir of dirs.reverse()) {
    const abs = path.join(cacheRoot, dir);
    let names;
    try {
      names = readdirSync(abs).filter((n) => /^srg_to_.*\.tsrg$/.test(n));
    } catch {
      continue;
    }
    names.sort((a, b) => {
      const ra = FLAVOR_RANK.findIndex((f) => a.startsWith(f));
      const rb = FLAVOR_RANK.findIndex((f) => b.startsWith(f));
      return (ra === -1 ? 99 : ra) - (rb === -1 ? 99 : rb);
    });
    const pick = names[0];
    if (!pick) continue;
    const tsrgPath = path.join(abs, pick);
    let inputShas = null;
    try {
      const raw = readFileSync(`${tsrgPath}.input`, "utf8");
      inputShas = Object.fromEntries(
        [...raw.matchAll(/^(\w+)=([0-9a-f]{40})$/gm)].map(([, k, v]) => [k, v]),
      );
    } catch {
      /* MCPConfig 某些档没有 .input：记 null，不猜 */
    }
    return { version, mcpConfigVersion: dir, file: pick, abs: tsrgPath, bytes: statSync(tsrgPath).size, inputShas };
  }
  return null;
}

/**
 * 削减：类行 + 成员行（只收四种 SRG 形状：1.17+ 的 `m_\d+_`/`f_\d+_`，与 ≤1.16.5 的
 * `func_\d+_x`/`field_\d+_x`）留下；其余按原因计数。
 * 形状判据用整行正则，不用「行首有缩进就算成员」——MCPConfig 的参数行也是缩进的。
 *
 * ⚠️ 成员行的描述符**可有可无**，且方法/字段只能靠名字前缀分（实测 1.20.4）：
 *   \tm_166118_ (Lcom/mojang/blaze3d/pipeline/RenderPipeline;F)V process   ← 方法带描述符
 *   \tf_167842_ wireframe                                                  ← 字段**没有**描述符
 * 早期版本按「必须三段」解析，把 34,616 个字段全当垃圾丢了（`字段 0 / 其它 40,378`），
 * 而 Forge AT 的字段行本来就不需要描述符（`access-lines.ts` 的 complete 判据：
 * field 只要求有 SRG 名）⇒ 字段形状必须收，描述符留空。
 */
const MEMBER_LINE =
  /^(func_\d+_[A-Za-z0-9_$]+|field_\d+_[A-Za-z0-9_$]+|[mf]_\d+_)\s+(\S+)(?:\s+(\S+))?$/;
const METHOD_PREFIX_RE = /^(?:m_|func_)/;

/** 解析一行成员：返回 {srg, descriptor, readable} 或 null（非成员形状）。 */
function parseMember(trimmed) {
  const m = MEMBER_LINE.exec(trimmed);
  if (!m) return null;
  const [, srg, second, third] = m;
  if (second.startsWith("(")) {
    // 有描述符 ⇒ 第三段必须存在（可读名），否则这行读不懂，交给 other 计数
    return third ? { srg, descriptor: second, readable: third } : null;
  }
  // 没括号：`f_xxx wireframe` 形态 ⇒ 第二段就是可读名，描述符上游没给
  return { srg, descriptor: "", readable: second };
}

/** 削减（导出给 `assert-forge-srg-ingest.mjs` 做「上游件 ↔ 入库件同答」对账，不复制第二份判据）。 */
export function reduce(text) {
  const lines = text.split(/\r?\n/);
  const kept = [];
  const dropped = { param: 0, modifier: 0, ctor: 0, other: 0 };
  let classes = 0;
  let methods = 0;
  let fields = 0;
  let fieldsWithDescriptor = 0;
  for (const line of lines) {
    if (!line.trim()) continue;
    if (!line.startsWith("\t")) {
      if (/^tsrg2\b/.test(line)) continue; // 我们自己写头，不搬上游头
      const t = line.trim().split(/\s+/);
      if (t.length < 2) {
        dropped.other++;
        continue;
      }
      kept.push(`${t[0]} ${t[1]}`);
      classes++;
      continue;
    }
    const t = line.trim();
    if (/^\t\t/.test(line)) {
      // 两级缩进里：修饰行（`static`）与参数行（`0 p_166119_ pPipeline`）都要丢，但分开计
      if (/^(static|final|static final|public|private|protected)\b/.test(t)) dropped.modifier++;
      else dropped.param++;
      continue;
    }
    if (t.startsWith("<")) {
      dropped.ctor++;
      continue;
    }
    const parsed = parseMember(t);
    if (!parsed) {
      dropped.other++;
      continue;
    }
    const isMethod = METHOD_PREFIX_RE.test(parsed.srg);
    if (isMethod) methods++;
    else {
      fields++;
      if (parsed.descriptor) fieldsWithDescriptor++;
    }
    kept.push(`\t${parsed.srg}\t${parsed.descriptor}\t${parsed.readable}`);
  }
  return { body: `tsrg2 srg official\n${kept.join("\n")}\n`, classes, methods, fields, fieldsWithDescriptor, dropped, readLines: lines.length };
}


/** 只在作为脚本直接跑时执行；被门 import（`reduce`）时不得触发缓存发现与落盘。 */
const IS_MAIN =
  !!process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) main();

function main() {
  const write = wantWrite();
  if (!write) logDryRunBanner("ingest-forge-srg");
  if (!existsSync(cacheRoot)) {
    console.error(
      `ingest-forge-srg: 找不到 MCPConfig 缓存根 ${Tilde(cacheRoot)}\n` +
        `  ⇒ 该根来自本机 ForgeGradle 构建产物。跑过对应版本的 gradle 后重试，或 --cache=<dir> 指过去。`,
    );
    process.exit(2);
  }

  const report = [];
  let missing = [];
  for (const v of versions) {
    const src = findSource(v);
    if (!src) {
      missing.push(v);
      console.error(`  ${v}: ${Tilde(cacheRoot)} 下没有 ${v}-* 目录或没有 srg_to_*.tsrg ⇒ 未取到，不猜`);
      continue;
    }
    const buf = readFileSync(src.abs);
    const r = reduce(buf.toString("utf8"));
    const destRel = `data/forge_${v}/mappings/srg_to_official-${v}.tsrg`;
    const provenanceRel = `data/forge_${v}/mappings/mcp_config-${src.mcpConfigVersion}.provenance.json`;
    const prov = {
      publishedAt: new Date().toISOString().slice(0, 10),
      generator: "mcp-server/scripts/ingest-forge-srg.mjs",
      kind: "mcpconfig-srg-to-official/reduced",
      upstream: {
        coordinate: `de.oceanlabs.mcp:mcp_config:${src.mcpConfigVersion}`,
        repository: "https://maven.neoforged.net/releases/de/oceanlabs/mcp/mcp_config/",
        mcpConfigCommits: src.inputShas ?? null,
        commitKeys: src.inputShas ? Object.keys(src.inputShas) : [],
        note:
          "commits 抄自 ForgeGradle 留下的 <文件>.input（mapping= / mcp=）；无该文件时为 null，不猜 SHA。",
      },
      sourceOnThisMachine: {
        path: Tilde(src.abs),
        bytes: src.bytes,
        sha256: sha256(buf),
        flavor: src.file.startsWith("srg_to_official")
          ? "official"
          : src.file.startsWith("srg_to_parchment")
            ? "parchment（official 件不在该目录时的回落）"
            : "snapshot",
      },
      derived: {
        file: destRel,
        bytes: Buffer.byteLength(r.body, "utf8"),
        sha256: sha256(Buffer.from(r.body, "utf8")),
        headerLine: "tsrg2 srg official",
        columns: "类行 `<srgClass> <officialClass>`；成员行 `\\t<srgName>\\t<descriptor>\\t<officialName>`",
        classes: r.classes,
        methods: r.methods,
        fields: r.fields,
        /// 上游字段行本来就不带描述符（实测 1.20.4 的 `f_167842_ wireframe`）⇒ 这里的非零值
        /// 只在该档 MCPConfig 换了形状时才会出现，是形状漂移的探针，不是「多存了什么」。
        fieldsWithDescriptor: r.fieldsWithDescriptor,
        sourceLines: r.readLines,
        droppedLines: r.dropped,
        reduction:
          "丢参数层行（\\t\\t…）、修饰行（static/final）、`<init>`/`<clinit>` 与一切非 `m_/f_` 形状的成员行 ⇒ 入库件不是上游件的原样副本",
      },
      consumedBy: [
        "mcp-server/scripts/_lib/build-yarn-sqlite.mjs（候选 kind=srg-to-official → mappingEra=mcp-config-srg）",
        "convert_mapping / generate_* 的 Forge AT 成员行（access-lines.ts 读 named 列并核 SRG_SHAPE_RE）",
      ],
      licenseNote:
        "Mojang 映射许可禁的是「完整且未修改地再分发」（仓根 AGENTS.md §Mappings / data/**/client.txt 头部原文）。本件是削减后的派生表，与既有 tracked 的 data/forge_1.16.5/mappings/obf_to_srg.tsrg 同类；原始 client.txt 继续由 .gitignore 排除、不入库。",
    };
    const okA = emitAtomic(destRel, r.body);
    const okB = emitAtomic(provenanceRel, `${JSON.stringify(prov, null, 2)}\n`);
    report.push({
      version: v,
      flavor: prov.sourceOnThisMachine.flavor,
      srcBytes: src.bytes,
      outBytes: prov.derived.bytes,
      classes: r.classes,
      methods: r.methods,
      fields: r.fields,
      dropped: r.dropped,
      wrote: Boolean(okA && okB),
    });
    console.log(
      `  ${v}: 源 ${src.file} ${src.bytes} B → 派生 ${prov.derived.bytes} B · 类 ${r.classes} 方法 ${r.methods} 字段 ${r.fields} · 丢参 ${r.dropped.param}/修饰 ${r.dropped.modifier}/构造 ${r.dropped.ctor}/其它 ${r.dropped.other}`,
    );
  }

  const tot = report.reduce(
    (a, x) => ({
      bytes: a.bytes + x.outBytes,
      src: a.src + x.srcBytes,
      methods: a.methods + x.methods,
      fields: a.fields + x.fields,
      classes: a.classes + x.classes,
    }),
    { bytes: 0, src: 0, methods: 0, fields: 0, classes: 0 },
  );
  console.log(
    `合计：${report.length}/${versions.length} 档 · 源 ${tot.src} B → 派生 ${tot.bytes} B（削减率 ${(100 * (1 - tot.bytes / Math.max(1, tot.src))).toFixed(1)}%）· ` +
      `类 ${tot.classes} · 方法 ${tot.methods} · 字段 ${tot.fields} · 模式 ${write ? "WRITE" : "DRYRUN"}`,
  );
  if (missing.length) {
    console.error(`ingest-forge-srg: ${missing.length} 档未取到来源（${missing.join(", ")}）⇒ 非零退出，禁止静默少做`);
    process.exit(1);
  }
}
