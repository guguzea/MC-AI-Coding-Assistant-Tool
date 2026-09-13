/**
 * G2 · 解析器可用性门（S4 / F92 · F95 · F113 · S1 收尾）。
 *
 * 这一环坏掉的样子：解析器遇到不认识的 TOML 形态就整行丢、丢完不留痕迹，或者解不出 modId
 * 就兜一个 `"unknown"` 写进 `status:"success"` 行。两者都**不报错**——批处理继续、JSONL 继续、
 * 下游摘要继续，只有数据已经错了（`unknown-mod` 塌缩目录 = F113 里 50 行外来包根的唯一来源；
 * 依赖块蒸发 = 下游据此断言「该库不约束 MC 版本」）。
 *
 * 门分三层：
 *  A. 行为层（任何运行都跑，打真 dist + 自建 store-only zip 夹具）
 *     A1 每种元数据形态（mods.toml / 三引号 / fabric / quilt / mcmod.info / 无元数据）
 *        的 analyzeModJar 判定逐一钉死：found、modId、loaders、警告文本、以及随后
 *        resolveModIdSegment 的裁决。**「解不出身份」必须永远不是成功**。
 *     A2 不支持的语法必须留下痕迹：内联表被跳过的行要出现在 warnings 里（以前是裸 `continue`）。
 *     A3 抛出型判据仍然抛出：`parseTomlValue("{…}")` → TOML_INLINE_UNSUPPORTED，
 *        未闭合三引号 → TOML_MULTILINE_UNTERMINATED（S1 删掉的旧码不许复活，见 C 层）。
 *     A4 工具边界：`decompileModJar()` / `decompileModJar({})` 必须返回结构化 INVALID_INPUT，
 *        不许裸抛 TypeError（宿主只会看到一次没有诊断的内部错误）。
 *     A5 jar 内容身份：`jarContentIdentity` = 12 位小写十六进制，且夹具两两不同（F92 的判据根基）。
 *     A6 resolveModIdSegment 真值表：空/空白/null → MOD_ID_UNKNOWN；`.`/`..`/含 `..` → INVALID_INPUT；
 *        路径分隔符必须被吃掉（`a/b` → `a_b`）。
 *  B. 源文笔钉（读 PIN_ROOT，可被投毒副本替换）：规则写在哪就得从哪读，不另抄一份口径。
 *     B1 `scripts/batch-decompile.mjs` 的成功行 modId 只能来自 `requireModId(...)`，
 *        且 `?? "unknown"` 这种兜底字面量不得复活（两处成功行 = 两处调用）。
 *     B2 `toml-parse.ts` 的内联表分支必须记账（`inlineSkipped.push`），不得退回裸 `continue`。
 *     B3 `mod-analyzer.ts` 必须把 `inlineSkipped` 转成 warning（否则记账等于没记）。
 *     B4 `mod-decompile.ts` 的缺参守卫必须是可选链（`!args?.jarPath`）。
 *  C. 死码层（只跑真仓库根）：`TOML_MULTILINE_UNSUPPORTED` 在活源码里 0 命中（S1 已把它换成
 *     真正支持三引号 + 两个新码）；同时 `TOML_MULTILINE_UNTERMINATED` 必须仍然在源码里活着。
 *
 * 投毒假根：MC_SKILL_PARSER_TEST_ROOT 指向放了被改形的源文件副本的目录（B 层读它，A/C 层照旧）。
 * 投毒自检在 test-scripts.mjs §S4。
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(SERVER_ROOT, "..");
const TEST_ROOT = process.env.MC_SKILL_PARSER_TEST_ROOT;
const PIN_ROOT = TEST_ROOT ? path.resolve(TEST_ROOT) : REPO_ROOT;

const DIST = (rel) => pathToFileURL(path.join(SERVER_ROOT, "dist", rel)).href;
const rel = (p) => path.relative(REPO_ROOT, p).split(path.sep).join("/");
const failures = [];
const fail = (m) => failures.push(m);

// ── store-only zip（零依赖，CI 可跑；解压程序不校验 CRC，反编译侧只读条目名）──
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ b) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}
function storeZip(files) {
  const parts = [];
  const central = [];
  let offset = 0;
  for (const f of files) {
    const name = Buffer.from(f.name, "utf8");
    const data = Buffer.from(f.data, "utf8");
    const crc = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 文件名
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    parts.push(local, name, data);
    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0);
    cen.writeUInt16LE(20, 4);
    cen.writeUInt16LE(20, 6);
    cen.writeUInt16LE(0x0800, 8);
    cen.writeUInt32LE(crc, 16);
    cen.writeUInt32LE(data.length, 20);
    cen.writeUInt32LE(data.length, 24);
    cen.writeUInt16LE(name.length, 28);
    cen.writeUInt32LE(offset, 42);
    central.push(cen, name);
    offset += local.length + name.length + data.length;
  }
  const body = Buffer.concat(parts);
  const cd = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(cd.length, 12);
  eocd.writeUInt32LE(body.length, 16);
  return Buffer.concat([body, cd, eocd]);
}

// ── 夹具（2026-09-11 行为实算钉死；期望值全部来自 s4_g2_probe2 的实测输出）─────────
const TOML_PLAIN = 'modLoader="javafml"\n[[mods]]\nmodId="caelus"\nversion="3.2.0"\n';
const TOML_TRIPLE = 'modLoader="javafml"\n[[mods]]\nmodId="""caelus"""\nversion="1.0"\ndescription="""line1\nline2"""\n';
const TOML_UNTERMINATED = 'modLoader="javafml"\n[[mods]]\nmodId="caelus"\ndescription="""never closed\nstill going\n';
const TOML_INLINE_TOP = 'modLoader="javafml"\ndependencies = { foo = { mandatory = true } }\n[[mods]]\nmodId="caelus"\n';
const TOML_INLINE_DEP = 'modLoader="javafml"\n[[mods]]\nmodId="caelus"\n[[dependencies.caelus]]\nmodId="minecraft"\nmandatory=true\nversionRange="[10.0,)"\nextra = { a = 1 }\n';
const TOML_INLINE_ARRAY = 'modLoader="javafml"\n[[mods]]\nmodId="caelus"\ndependencies=[{modId="minecraft",versionRange="[10,)"}]\n';

const CASES = [
  { name: "toml-plain", file: "META-INF/mods.toml", body: TOML_PLAIN, modId: "caelus", loaders: ["forge"], ok: true, noWarning: "内联表" },
  { name: "toml-triple", file: "META-INF/mods.toml", body: TOML_TRIPLE, modId: "caelus", loaders: ["forge"], ok: true },
  {
    name: "toml-unterminated", file: "META-INF/mods.toml", body: TOML_UNTERMINATED, modId: null, loaders: [], ok: false,
    code: "MOD_ID_UNKNOWN", warn: ["TOML_MULTILINE_UNTERMINATED", "未识别 loader"],
  },
  {
    name: "toml-inline-top", file: "META-INF/mods.toml", body: TOML_INLINE_TOP, modId: "caelus", loaders: ["forge"], ok: true,
    warn: ["1 行内联表", "dependencies"], code0: "TOML_INLINE_UNSUPPORTED",
  },
  {
    name: "toml-inline-dep", file: "META-INF/mods.toml", body: TOML_INLINE_DEP, modId: "caelus", loaders: ["forge"], ok: true,
    warn: ["dependencies.caelus.extra"], deps: 1,
  },
  {
    name: "toml-inline-array", file: "META-INF/mods.toml", body: TOML_INLINE_ARRAY, modId: "caelus", loaders: ["forge"], ok: true,
    warn: ["mods.dependencies"],
  },
  { name: "fabric-null", file: "fabric.mod.json", body: JSON.stringify({ schemaVersion: 1, id: null, version: "1" }), modId: null, loaders: ["fabric"], ok: false, code: "MOD_ID_UNKNOWN" },
  { name: "fabric-empty", file: "fabric.mod.json", body: JSON.stringify({ schemaVersion: 1, id: "", version: "1" }), modId: "", loaders: ["fabric"], ok: false, code: "MOD_ID_UNKNOWN" },
  { name: "fabric-blank", file: "fabric.mod.json", body: JSON.stringify({ schemaVersion: 1, id: "   ", version: "1" }), modId: "   ", loaders: ["fabric"], ok: false, code: "MOD_ID_UNKNOWN" },
  { name: "fabric-ok", file: "fabric.mod.json", body: JSON.stringify({ schemaVersion: 1, id: "caelus", version: "3.2.0" }), modId: "caelus", loaders: ["fabric"], ok: true },
  { name: "quilt-ok", file: "quilt.mod.json", body: JSON.stringify({ schema_version: 1, id: "qmod", version: "1.0" }), modId: "qmod", loaders: ["quilt"], ok: true },
  { name: "mcmod-ok", file: "mcmod.info", body: JSON.stringify([{ modid: "bookshelf", version: "1.3" }]), modId: "bookshelf", loaders: ["forge"], ok: true },
  { name: "no-meta", file: null, body: null, modId: null, loaders: [], ok: false, code: "MOD_ID_UNKNOWN", warn: ["未识别 loader"] },
];

const SEGMENT_CASES = [
  { input: undefined, ok: false, code: "MOD_ID_UNKNOWN" },
  { input: null, ok: false, code: "MOD_ID_UNKNOWN" },
  { input: "", ok: false, code: "MOD_ID_UNKNOWN" },
  { input: "   ", ok: false, code: "MOD_ID_UNKNOWN" },
  { input: "..", ok: false, code: "INVALID_INPUT" },
  { input: "../evil", ok: false, code: "INVALID_INPUT" },
  { input: "a..b", ok: false, code: "INVALID_INPUT" },
  { input: "caelus", ok: true, modId: "caelus" },
  { input: "1.20.1", ok: true, modId: "1.20.1" },
  { input: "a/b", ok: true, modId: "a_b" },
  { input: "exa\tble", ok: true, modId: "exa_ble" },
];

const PIN_FILES = {
  batch: "scripts/batch-decompile.mjs",
  toml: "mcp-server/src/decompile/services/toml-parse.ts",
  analyzer: "mcp-server/src/decompile/services/mod-analyzer.ts",
  decompile: "mcp-server/src/decompile/services/mod-decompile.ts",
};
const DEAD_CODE = "TOML_MULTILINE_UNSUPPORTED";
const LIVE_CODE = "TOML_MULTILINE_UNTERMINATED";
const DEAD_SCAN_DIRS = ["mcp-server/src", "mcp-server/scripts", "scripts"];
const DEAD_SCAN_EXTS = [".ts", ".js", ".mjs"];

// ── A 层：真 dist + 夹具的行为取证────────────────────────────────────────────
const { analyzeModJar } = await import(DIST(path.join("decompile", "services", "mod-analyzer.js")));
const { resolveModIdSegment, jarContentIdentity, decompileModJar } = await import(
  DIST(path.join("decompile", "services", "mod-decompile.js"))
);
const { parseModsToml, parseTomlValue } = await import(DIST(path.join("decompile", "services", "toml-parse.js")));

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "mcskill-g2-"));
const identities = new Map();
let checks = 0;
try {
  for (const c of CASES) {
    const entries = [];
    if (c.file) entries.push({ name: c.file, data: c.body });
    entries.push({ name: "dummy.class", data: "cafebabecafebabe" });
    const jarPath = path.join(workDir, `${c.name}.jar`);
    fs.writeFileSync(jarPath, storeZip(entries));
    checks++;

    const r = analyzeModJar(jarPath);
    const warns = Array.isArray(r.warnings) ? r.warnings : [];
    if (r.found !== true) fail(`A1 ${c.name}: analyzeModJar found=${r.found}（夹具 jar 必然可读）`);
    if ((r.modId ?? null) !== c.modId) fail(`A1 ${c.name}: modId=${JSON.stringify(r.modId ?? null)}，应为 ${JSON.stringify(c.modId)}`);
    if ((r.loaders ?? []).join(",") !== c.loaders.join(",")) {
      fail(`A1 ${c.name}: loaders=${JSON.stringify(r.loaders ?? [])}，应为 ${JSON.stringify(c.loaders)}`);
    }
    for (const w of c.warn ?? []) if (!warns.some((x) => x.includes(w))) fail(`A1 ${c.name}: warnings 缺「${w}」→ ${JSON.stringify(warns)}`);
    if (c.noWarning && warns.some((x) => x.includes(c.noWarning))) fail(`A2 ${c.name}: 正常夹具被误报「${c.noWarning}」→ ${JSON.stringify(warns)}`);
    if (c.deps !== undefined && (r.dependencies ?? []).filter((d) => d.id === "minecraft").length !== c.deps) {
      fail(`A2 ${c.name}: minecraft 依赖块 ${JSON.stringify(r.dependencies ?? [])}，应为 ${c.deps} 条`);
    }

    const seg = resolveModIdSegment(r.modId);
    if (c.ok) {
      if (!seg.ok) fail(`A1 ${c.name}: 可解析夹具被判 ${JSON.stringify(seg)} —— 判据过严会把好 jar 全打成 failed`);
      else if (seg.modId !== c.modId) fail(`A1 ${c.name}: 目录段 ${seg.modId} 与 modId ${c.modId} 不一致`);
    } else {
      if (seg.ok) fail(`A1 ${c.name}: modId=${JSON.stringify(r.modId)} 竟然解析成目录段 ${JSON.stringify(seg.modId)} —— 解不出身份必须不是成功`);
      else if (seg.code !== c.code) fail(`A1 ${c.name}: 判据 ${seg.code}，应为 ${c.code}`);
    }
    // 全局不变量：found:true 且 segment.ok:true ⇒ 目录段必须是非空可见字符
    if (r.found === true && seg.ok === true && !/^[^./]/.test(seg.modId)) {
      fail(`A1 ${c.name}: 成功目录段以分隔符/点开头（${seg.modId}）`);
    }
    if (!r.loaders?.length && !warns.some((x) => x.includes("未识别 loader"))) {
      fail(`A1 ${c.name}: loaders 为空却没有「未识别 loader」警告 = 静默降级`);
    }

    const id = jarContentIdentity(jarPath);
    if (!/^[0-9a-f]{12}$/.test(String(id))) fail(`A5 ${c.name}: jarContentIdentity=${JSON.stringify(id)} 不是 12 位小写十六进制`);
    const prev = identities.get(String(id));
    if (prev) fail(`A5 ${c.name} 与 ${prev} 内容不同却算出同一身份 ${id} —— 身份不再由字节决定（F92）`);
    else identities.set(String(id), c.name);
  }

  for (const t of SEGMENT_CASES) {
    const got = resolveModIdSegment(t.input);
    checks++;
    const want = t.ok ? { ok: true, modId: t.modId } : { ok: false, code: t.code };
    const same = t.ok ? got.ok === true && got.modId === t.modId : got.ok === false && got.code === t.code;
    if (!same) fail(`A6 resolveModIdSegment(${JSON.stringify(t.input)}) = ${JSON.stringify(got)}，应为 ${JSON.stringify(want)}`);
  }

  // A3：抛出型判据仍然抛出
  try {
    parseTomlValue("{ a = 1 }");
    fail("A3 parseTomlValue(内联表) 未抛 TOML_INLINE_UNSUPPORTED —— 不支持的语法被猜了语义");
  } catch (err) {
    if (err.message !== "TOML_INLINE_UNSUPPORTED") fail(`A3 parseTomlValue 抛的是 ${err.message}，应为 TOML_INLINE_UNSUPPORTED`);
  }
  try {
    parseModsToml(TOML_UNTERMINATED);
    fail("A3 parseModsToml(未闭合三引号) 未抛 TOML_MULTILINE_UNTERMINATED —— 半截字符串会被当完整值写进摘要");
  } catch (err) {
    if (err.message !== LIVE_CODE) fail(`A3 抛的是 ${err.message}，应为 ${LIVE_CODE}`);
  }
  const triped = parseModsToml(TOML_TRIPLE);
  if (triped.mods[0]?.modId !== "caelus") fail(`A3 三引号 modId 解析失败：${JSON.stringify(triped.mods[0] ?? null)}`);
  if (triped.inlineSkipped.length !== 0) fail(`A3 三引号夹具被判内联表跳过：${JSON.stringify(triped.inlineSkipped)}`);
  checks += 2;

  // A2：跳过必须记账（键名与来源段都要对得上）
  const inlineExpect = {
    [TOML_INLINE_TOP]: ["dependencies"],
    [TOML_INLINE_DEP]: ["dependencies.caelus.extra"],
    [TOML_INLINE_ARRAY]: ["mods.dependencies"],
  };
  for (const [body, want] of Object.entries(inlineExpect)) {
    const got = parseModsToml(body).inlineSkipped;
    if (got.join(",") !== want.join(",")) fail(`A2 inlineSkipped=${JSON.stringify(got)}，应为 ${JSON.stringify(want)} —— 记账口径漂移（丢了哪行都没记录）`);
    checks++;
  }

  // A4：工具边界缺参不得裸崩
  for (const [label, call] of [["decompileModJar()", () => decompileModJar()], ["decompileModJar({})", () => decompileModJar({})]]) {
    let v;
    try {
      v = await call();
    } catch (err) {
      fail(`A4 ${label} 裸抛 ${err.constructor.name}：${err.message} —— 缺参必须回 INVALID_INPUT，否则宿主只看到无诊断的内部错误`);
      continue;
    }
    if (v?.found !== false || v?.error !== "INVALID_INPUT") fail(`A4 ${label} = ${JSON.stringify({ found: v?.found, error: v?.error })}，应为 found:false + INVALID_INPUT`);
    checks++;
  }
} finally {
  fs.rmSync(workDir, { recursive: true, force: true });
  if (fs.existsSync(workDir)) fail(`清理未生效：${workDir} 仍然存在（后面的计数会把它当夹具目录扫到）`);
}

// ── B 层：源文笔钉（PIN_ROOT 可替换 = 投毒面）──────────────────────────────────
const pins = {};
for (const [key, relPath] of Object.entries(PIN_FILES)) {
  const abs = path.join(PIN_ROOT, relPath.replace(/\//g, path.sep));
  if (!fs.existsSync(abs)) {
    fail(`B ${key}: 钉点文件不存在 ${rel(abs)}（改路径要显式改 PIN_FILES，否则本门永远放它过去）`);
    continue;
  }
  pins[key] = fs.readFileSync(abs, "utf8");
}
const pin = (key, re, why, want = 1) => {
  const text = pins[key];
  if (text === undefined) return;
  const n = text.split(re).length - 1;
  if (n !== want) fail(`${PIN_FILES[key]}: ${why}（命中 ${n} 处，应为 ${want} 处）`);
  else checks++;
};

pin("batch", /modId:[^\n]*\?\?[^\n]*"unknown"/g, "B1 成功行仍用 `?? \"unknown\"` 兜底 modId —— 解不出身份的行会被 merge 照收（F113）", 0);
pin("batch", /[=:] requireModId\(state, result\.modId \?\? meta\.modId, jarPath,/g, "B1 两处成功行的 modId 必须走 requireModId（`= ` 与三元分支 `: ` 两种写法都计入；少一处即该行退回兜底）", 2);
pin("batch", /modIdEvidence:/g, "B1 每条产出行必须记身份来源（jar / manifest）：两条成功行 + outcome 行透传 = 3 处，少一处即来源链断开", 3);
pin("batch", /if \(ext\.ok && state\.decompiler\.packagesOwnModId\(pkgs, ext\.modId\)\)/g, "B1 外部证据必须归归属判据裁决：manifest 的 modId 若不在 jar 自身包路径里就照旧判 failed（S5b 硬闸；摘掉它这条通道就退化成兜底）");
pin("decompile", /if \(ext\.ok && packagesOwnModId\(namesOf\(\), ext\.modId\)\) externalId = \{ modId: ext\.modId, evidence: "external" \};/g,
  "B3 身份决策处的外部证据必须由 jar 自身条目证实（摘掉它 ⇒ 调用方可给任意 jar 命名，unknown-mod 换个入口回来）");
pin("batch", /const identity = state\.decompiler\.resolveModIdSegment\(candidate\);/g, "B1 requireModId 必须复用 dist 的 resolveModIdSegment（判据只有一份）");
pin("batch", /if \(!identity\.ok\) \{/g, "B1 requireModId 解析不出必须抛错（判 failed），不许 return 兜底值");
pin("toml", /inlineSkipped\.push\(/g, "B2 内联表跳过必须记账；退回裸 `continue` = 依赖块静默蒸发");
pin("toml", /TOML_INLINE_UNSUPPORTED"\) \{/g, "B2 内联表分支必须是带花括号的记账分支");
pin("toml", /return \{ sections, inlineSkipped \};/g, "B2 parseTomlRows 必须把账目返回给上层");
pin("analyzer", /if \(toml\.inlineSkipped\.length\) \{/g, "B3 analyzer 必须在有跳过时消费 inlineSkipped");
pin("analyzer", /行内联表（本解析器不支持，已跳过）/g, "B3 记账必须转成 warning，否则等于没记");
pin("decompile", /if \(!args\?\.jarPath\) \{/g, "B4 缺参守卫必须是可选链（裸 `args.jarPath` 会 TypeError）");

// ── C 层：真仓库死码扫描（TEST_ROOT 下跳过：假根只放钉点副本）──────────────────
if (!TEST_ROOT) {
  let dead = 0;
  let live = 0;
  let scanned = 0;
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) walk(abs);
      else if (DEAD_SCAN_EXTS.some((ext) => e.name.endsWith(ext)) && path.resolve(abs) !== fileURLToPath(import.meta.url)) {
        scanned++;
        const text = fs.readFileSync(abs, "utf8");
        dead += text.split(DEAD_CODE).length - 1;
        live += text.split(LIVE_CODE).length - 1;
      }
    }
  };
  for (const dir of DEAD_SCAN_DIRS) {
    const abs = path.join(REPO_ROOT, dir.replace(/\//g, path.sep));
    if (!fs.existsSync(abs)) {
      fail(`C 扫描根 ${dir} 不存在（改目录要显式改 DEAD_SCAN_DIRS，否则死码检查形同虚设）`);
      continue;
    }
    walk(abs);
  }
  if (dead !== 0) fail(`C: 活源码里出现 ${dead} 处 ${DEAD_CODE} —— S1 已删除该码（真三引号支持取代它），复活即解析器回潮`);
  if (live < 1) fail(`C: 活源码里 ${LIVE_CODE} 0 命中 —— 未闭合三引号的判据消失 = 半截字符串被静默接受`);
  if (scanned < 200) fail(`C: 只扫了 ${scanned} 个源码文件（${DEAD_SCAN_DIRS.join(", ")}）—— 扫描面缩水即自检无效`);
  checks += 3;
}

if (failures.length > 0) {
  console.error(`assert-parser-availability(G2): ${failures.length} 项不通过`);
  for (const f of failures.slice(0, 25)) console.error(`  ✗ ${f}`);
  if (failures.length > 25) console.error(`  …另有 ${failures.length - 25} 项`);
  process.exit(1);
}

console.log(
  `  assert-parser-availability(G2): ${CASES.length} 个 jar 夹具 · ${checks} 项行为/钉点全过 · ` +
    `身份 ${identities.size}/${CASES.length} 唯一 · 死码扫描 ${TEST_ROOT ? "skipped(test-root)" : DEAD_SCAN_DIRS.join(", ")}`,
);
