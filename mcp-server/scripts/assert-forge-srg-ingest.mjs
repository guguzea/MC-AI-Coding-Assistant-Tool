#!/usr/bin/env node
/**
 * assert-forge-srg-ingest.mjs — 未做③（Forge 1.16.5–1.20.4 SRG 成员层）的**离线**门。
 *
 * 这道门管三件事，每件都可证伪：
 *   ① **削减件与上游件同答**：`ingest-forge-srg.mjs` 的 `reduce()` 只是丢行（参数层 / 修饰行 /
 *      `<init>` / 非 `m_/f_` 形状），不得改变「哪个类有哪些成员、SRG 名与可读名各是什么」。
 *      判据不是比字节，而是把两份文本各自灌进同一个 importer，比**逐行成员集合**。
 *      为什么必须有这条：reducer 与 importer 是**两个解析器**（上游空格形 vs 入库制表符形），
 *      单测任一边都会放过形状漂移（真踩过：早期 reducer 按「必须三段」解析，把 34,616 个字段全丢了，
 *      `字段 0 / 其它 40,378` 而门一片绿）。
 *   ② **入库形状**：`build-yarn-sqlite.mjs` 的 `kind === "srg-to-official"` 分支必须落
 *      `mappingEra=mcp-config-srg` + named 列 = SRG + official 列 = 可读名 + `searge_*` 有行
 *      （`resolveCsvMappingDbPath` 就是靠「mcp-csv 或 searge 有行」认这份库的）。
 *   ③ **消费面成行**：临时数据根里放一份该档库，`convert_mapping(accessLines)` 必须吐可粘贴的
 *      Forge AT 行（`public <类> <srg><描述符> #<可读名>`）且过自家解析器；库里没有的名字必须仍留
 *      `<TODO:SRG名>`。这一腿是**夹具**，不依赖那 238.9 MB 真库在不在盘 ⇒ 任何克隆上都会真跑。
 *
 * 另有一条**在盘自洽**腿（`--no-onDisk` 可关）：`data/forge_<v>/mappings/` 下若派生件已在盘，
 * 则 provenance 必须同在、其 `derived.sha256` 必须等于文件实算、其 classes/methods/fields 必须等于
 * 已建库的 meta。**半个都不在盘时不判红**（派生件是否入库由用户拍板），但会在汇总行打
 * `在盘对账：0 档 … 该腿本轮未判` —— 真库在盘与否的可用性由 `mcp-server/test-core.mjs` 的
 * `s2Srg1201` / `resolveCsvMappingDbPath` 腿负责判红，两道门分工见下。
 *
 * 用法
 *   node mcp-server/scripts/assert-forge-srg-ingest.mjs              # 真跑（零网络、只写 OS tmpdir）
 *   node mcp-server/scripts/assert-forge-srg-ingest.mjs --selftest   # 12 记真投毒（含 1 记真输入）+ 正对照
 *   node mcp-server/scripts/assert-forge-srg-ingest.mjs --no-onDisk  # 只跑夹具腿
 *
 * §分工：本门 = 「解析器自洽 + 形状 + 消费面（夹具）」；test-core = 「真库在盘时真数据可用」。
 * 所以「本门绿」不等于「五档真库已入库」，反之亦然 —— 两条都得跑。
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath, pathToFileURL } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { importSrgToOfficialStream } from "./_lib/import-srg-to-official.mjs";
import { buildYarnSqliteForDir, openYarnDb } from "./_lib/build-yarn-sqlite.mjs";
import { reduce } from "./ingest-forge-srg.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
/** 本文件在 `mcp-server/scripts/` 下 ⇒ 上溯两级即仓库根（三级会跑到根的父目录，`ingest-forge-srg.mjs` 里那个常量就是这么错的）。 */
const REPO_ROOT = path.resolve(HERE, "..", "..");
const FIX_VER = "1.90.0"; // 夹具专用档：不与任何真实档撞（判「库里没有」时才安全）

/**
 * 上游形状（空格分隔：字段行一般不带描述符、少数带方法形描述符）+ 四种要丢的行。
 * 条数比列按 2026-09-26 对 `~/.gradle/.../mcp_config/1.20.1-<ts>/srg_to_official_<…>.tsrg` 的实测形状：
 *   method:3=48,575 · field:2=31,003 · field:3=1,076 · `<init>`=7,043 · `<clinit>`=2,594 ·
 *   非 `m_/f_` 成员行（`toString`/`equals`…）=6,321
 */
const UPSTREAM_FIXTURE = [
  "tsrg2 left right",
  "net/minecraft/Util net/minecraft/Util",
  "\tm_137477_ (Ljava/lang/String;)Ljava/util/concurrent/ExecutorService; makeExecutor",
  "\t\tstatic",
  "\t\t0 p_137478_ name",
  "com/mojang/blaze3d/vertex/BufferBuilder$DrawState com/mojang/blaze3d/vertex/BufferBuilder$DrawState",
  "\tf_166797_ ()I indexCount",
  "\tf_166798_ ()Lcom/mojang/blaze3d/vertex/VertexFormat$IndexType; indexType",
  "\t<init> ()V <init>",
  "net/minecraft/client/Minecraft net/minecraft/client/Minecraft",
  "\tf_167842_ wireframe",
  "\tf_167842_ ()I wireframe",
  "\tm_205194_ ()V createProfiler",
  // ≤1.16.5 的老形状（实测 1.16.5 的 srg_to_official 全用这套）：同一个 importer 必须两种年代都收，
  // 否则 1.16.5 整档会被当成「无成员」而静默入库空库。
  "\tfunc_227860_a_ ()V legacyPush",
  "\tfield_227581_a_ legacyCounter",
  "\ttoString ()Ljava/lang/String; toString",
  // 实测形状之一：同一个 `m_<id>_` 在多个 owner 下各列一行（接口/内部类各自带一份），
  // 可读名与描述符逐字相同 ⇒ methods 存两行、searge_methods 因主键塌成一行。
  "net/minecraft/util/profiling/NoOpProfiler net/minecraft/util/profiling/NoOpProfiler",
  "\tm_137477_ (Ljava/lang/String;)Ljava/util/concurrent/ExecutorService; makeExecutor",
  "",
].join("\n");

const EXPECT = {
  classes: 4,
  methods: 4, // = methods 表行数（逐 owner 全量，不塌；含 1 个 ≤1.16.5 老形状 `func_` 成员）
  fields: 5,
  seargeMethodRows: 3, // = 唯一键数（塌行是设计，但 meta 必须记塌后值）：m_137477_ / m_205194_ / func_227860_a_
  seargeFieldRows: 4, // f_166797_ / f_166798_ / f_167842_ / field_227581_a_
  fieldsWithDescriptor: 3,
  dropped: { modifier: 1, param: 1, ctor: 1, other: 1 },
  members: [
    "M|net/minecraft/Util|m_137477_|(Ljava/lang/String;)Ljava/util/concurrent/ExecutorService;|makeExecutor",
    "M|net/minecraft/util/profiling/NoOpProfiler|m_137477_|(Ljava/lang/String;)Ljava/util/concurrent/ExecutorService;|makeExecutor",
    "M|net/minecraft/client/Minecraft|m_205194_|()V|createProfiler",
    "M|net/minecraft/client/Minecraft|func_227860_a_|()V|legacyPush",
    "F|com/mojang/blaze3d/vertex/BufferBuilder$DrawState|f_166797_|()I|indexCount",
    "F|com/mojang/blaze3d/vertex/BufferBuilder$DrawState|f_166798_|()Lcom/mojang/blaze3d/vertex/VertexFormat$IndexType;|indexType",
    "F|net/minecraft/client/Minecraft|f_167842_||wireframe",
    "F|net/minecraft/client/Minecraft|f_167842_|()I|wireframe",
    "F|net/minecraft/client/Minecraft|field_227581_a_||legacyCounter",
  ].sort(),
};

async function importText(text) {
  const db = new DatabaseSync(":memory:");
  db.exec(
    `CREATE TABLE meta(key TEXT PRIMARY KEY,value TEXT);
     CREATE TABLE classes(named TEXT,intermediary TEXT,official TEXT);
     CREATE TABLE methods(owner_named TEXT,name_named TEXT,descriptor_named TEXT,name_official TEXT,descriptor_official TEXT,name_intermediary TEXT);
     CREATE TABLE fields(owner_named TEXT,name_named TEXT,descriptor_named TEXT,name_official TEXT,descriptor_official TEXT,name_intermediary TEXT);
     CREATE TABLE searge_methods(searge TEXT PRIMARY KEY,name_named TEXT,descriptor_named TEXT);
     CREATE TABLE searge_fields(searge TEXT PRIMARY KEY,name_named TEXT,descriptor_named TEXT);`,
  );
  const r = await importSrgToOfficialStream(db, Readable.from([text]), {
    version: FIX_VER,
    source: "(fixture)",
  });
  const members = [
    ...db
      .prepare("SELECT owner_named o,name_named n,descriptor_named d,name_official f FROM methods")
      .all()
      .map((x) => `M|${x.o}|${x.n}|${x.d}|${x.f}`),
    ...db
      .prepare("SELECT owner_named o,name_named n,descriptor_named d,name_official f FROM fields")
      .all()
      .map((x) => `F|${x.o}|${x.n}|${x.d}|${x.f}`),
  ].sort();
  const count = (t) => Number(db.prepare(`SELECT COUNT(*) c FROM ${t}`).get().c);
  const out = {
    ...r,
    members,
    classRows: count("classes"),
    seargeMethodRows: count("searge_methods"),
    seargeFieldRows: count("searge_fields"),
  };
  db.close();
  return out;
}

/** 判据只有这一个纯函数：投毒改的是**观测值**，不改判据本体。 */
function judge(obs) {
  const problems = [];
  const want = (name, got, exp) => {
    if (got !== exp) problems.push(`[COUNT] ${name}: 实得 ${got}，期望 ${exp}`);
  };
  for (const [label, r] of [
    ["上游件", obs.upstream],
    ["入库件", obs.reduced],
  ]) {
    want(`${label} 类`, r.classCount, EXPECT.classes);
    want(`${label} 方法`, r.methodCount, EXPECT.methods);
    want(`${label} 字段`, r.fieldCount, EXPECT.fields);
    want(`${label} searge_methods 行数`, r.seargeMethodRows, EXPECT.seargeMethodRows);
    want(`${label} searge_fields 行数`, r.seargeFieldRows, EXPECT.seargeFieldRows);
    // 上游件必须**逐类丢干净**：入库件那侧的丢行计数必须恒为 0 —— 非零就说明 reducer 漏了行，
    // 把参数层/修饰行/构造器带了进库（本轮实测第一版就是把这四项当等式钉，结果被门自己抓到
    // 「入库件 0 / 期望 1」，正说明这条判据有牙）。
    const exp = label === "上游件" ? EXPECT.dropped : { param: 0, modifier: 0, ctor: 0, other: 0 };
    want(`${label} 丢参数行`, r.droppedParamLines, exp.param);
    want(`${label} 丢修饰行`, r.droppedModifierLines, exp.modifier);
    want(`${label} 丢构造器`, r.droppedCtorLines, exp.ctor);
    want(`${label} 未采纳成员行`, r.unparsedMemberLines, exp.other);
    const a = r.members.join("\n");
    const b = EXPECT.members.join("\n");
    if (a !== b) {
      const missing = EXPECT.members.filter((m) => !r.members.includes(m));
      const extra = r.members.filter((m) => !EXPECT.members.includes(m));
      problems.push(
        `[MEMBERS] ${label} 成员集合不符（缺 ${missing.length} / 多 ${extra.length}）：${[...missing, ...extra]
          .slice(0, 3)
          .join(" ; ")}`,
      );
    }
  }
  want("削减件 fieldsWithDescriptor", obs.reduce_.fieldsWithDescriptor, EXPECT.fieldsWithDescriptor);
  if (obs.upstream.members.join("|") !== obs.reduced.members.join("|")) {
    problems.push("[MEMBERS] 上游件与入库件不同答 ⇒ 削减过程改了成员名或描述符");
  }
  // ② 库形状
  want("库 meta.mappingEra", obs.built.era, "mcp-config-srg");
  want("库 meta.format", obs.built.format, "mcpconfig-srg-to-official");
  want("库 methods 行", obs.built.methodRows, EXPECT.methods);
  want("库 fields 行", obs.built.fieldRows, EXPECT.fields);
  want("库 searge_methods 行", obs.built.seargeMethodRows, EXPECT.seargeMethodRows);
  want("库 searge_fields 行", obs.built.seargeFieldRows, EXPECT.seargeFieldRows);
  want("库 classes 行", obs.built.classRows, EXPECT.classes);
  // meta 必须记**表内实数**，不许照抄源文件行数：`DEBT_MAPPING_COUNT` 那条债就是这个形状
  // （读侧直接信 meta ⇒ 覆盖数虚报）。夹具里 methods 3 行 / searge 2 行，照抄就会红。
  want("meta.seargeMethodCount = 表内行数", obs.built.metaSeargeMethodCount, obs.built.seargeMethodRows);
  want("meta.seargeFieldCount = 表内行数", obs.built.metaSeargeFieldCount, obs.built.seargeFieldRows);
  want("meta.methodCount = 表内行数", obs.built.metaMethodCount, obs.built.methodRows);
  want("meta.fieldCount = 表内行数", obs.built.metaFieldCount, obs.built.fieldRows);
  if (obs.built.intermediaryNonNull > 0) {
    problems.push(
      `[MEMBERS] intermediary 列必须留空（Forge 侧没有 intermediary 层），实得 ${obs.built.intermediaryNonNull} 行非空`,
    );
  }
  // ③ 消费面
  if (!obs.consumer.line || !obs.consumer.line.includes("m_137477_")) {
    problems.push(`[AT-LINE] Forge AT 成员行没拿到 SRG 名：${obs.consumer.line}`);
  }
  if (obs.consumer.complete !== true) {
    problems.push(`[AT-LINE] 该行必须判为完整（有库、有名字、有描述符）：${JSON.stringify(obs.consumer)}`);
  }
  if (obs.consumer.selfCheckOk !== true) {
    problems.push(`[AT-LINE] 完整行必须过自家 AT 解析器，实得 ${obs.consumer.selfCheckOk}`);
  }
  if (obs.consumer.ghostComplete !== false) {
    problems.push(
      `[AT-LINE] 库里没有的名字必须仍留 <TODO:SRG名>，实得 complete=${obs.consumer.ghostComplete} 行=${obs.consumer.ghostLine}`,
    );
  }
  // ③′ era 归属：无平台查询不得选中这份库（否则 Fabric 侧既有契约被悄悄改掉）
  if (obs.consumer.csvForNoPlatform !== null) {
    problems.push(`[ERA-GATE] 未声明平台的查询选中了 mcp-config-srg 库 ⇒ ${obs.consumer.csvForNoPlatform}`);
  }
  if (typeof obs.consumer.csvForForge !== "string") {
    problems.push(`[ERA-GATE] 显式 prefer="forge" 必须选中该档库，实得 ${obs.consumer.csvForForge}`);
  }
  for (const p of obs.onDisk ?? []) problems.push(p);
  return problems;
}

async function collect(tmpRoot) {
  const upstream = await importText(UPSTREAM_FIXTURE);
  const reduce_ = reduce(UPSTREAM_FIXTURE);
  const reduced = await importText(reduce_.body);

  // 真跑 build-yarn-sqlite 的 srg-to-official 分支（夹具档，不碰 data/）
  const mappingsDir = path.join(tmpRoot, `forge_${FIX_VER}`, "mappings");
  fs.mkdirSync(mappingsDir, { recursive: true });
  fs.writeFileSync(path.join(mappingsDir, `srg_to_official-${FIX_VER}.tsrg`), reduce_.body, "utf8");
  await buildYarnSqliteForDir(mappingsDir, { version: FIX_VER });
  const dbPath = path.join(mappingsDir, "yarn-mappings.sqlite");
  const db = openYarnDb(dbPath, { readonly: true });
  const meta = Object.fromEntries(db.prepare("SELECT key,value FROM meta").all().map((r) => [r.key, r.value]));
  const count = (t) => Number(db.prepare(`SELECT COUNT(*) c FROM ${t}`).get().c);
  const built = {
    era: meta.mappingEra,
    format: meta.format,
    classRows: count("classes"),
    methodRows: count("methods"),
    fieldRows: count("fields"),
    seargeMethodRows: count("searge_methods"),
    seargeFieldRows: count("searge_fields"),
    metaMethodCount: Number(meta.methodCount),
    metaFieldCount: Number(meta.fieldCount),
    metaSeargeMethodCount: Number(meta.seargeMethodCount),
    metaSeargeFieldCount: Number(meta.seargeFieldCount),
    intermediaryNonNull: count("methods WHERE name_intermediary IS NOT NULL"),
  };
  db.close();

  // 消费面：把夹具档当作某个「只有 forge 库」的版本喂给 dist（与 MCP/CLI 同一条 convertMappingEx）
  process.env.MC_SKILL_DATA = path.join(tmpRoot, "data");
  const destDir = path.join(process.env.MC_SKILL_DATA, `forge_${FIX_VER}`, "mappings");
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(dbPath, path.join(destDir, "yarn-mappings.sqlite"));
  const dist = `${pathToFileURL(path.join(REPO_ROOT, "mcp-server/dist")).href.replace(/\/$/, "")}/`;
  let convertMappingEx;
  let resolveCsvMappingDbPath;
  try {
    ({ convertMappingEx } = await import(`${dist}mappings/convert-extras.js`));
    ({ resolveCsvMappingDbPath } = await import(`${dist}mappings/yarn-sqlite.js`));
  } catch (e) {
    // 新克隆只 `npm ci` 不 `npm run build` 时 dist 不存在 —— 报错要指着修法，别让人以为门坏了
    throw new Error(`消费面需要已编译的 dist（跑 \`cd mcp-server && npm run build\`）：${e.message}`);
  }
  const hit = convertMappingEx({
    from: "mojang",
    to: "mcp",
    ownerClass: "net/minecraft/Util",
    memberName: "makeExecutor",
    memberKind: "method",
    version: FIX_VER,
    accessLines: true,
    platform: "forge",
  });
  const ghost = convertMappingEx({
    from: "mojang",
    to: "mcp",
    ownerClass: "net/minecraft/Util",
    memberName: "zzGhostName",
    memberKind: "method",
    version: FIX_VER,
    accessLines: true,
    platform: "forge",
  });
  const consumer = {
    line: hit?.accessLines?.entries?.[0]?.line ?? null,
    complete: hit?.accessLines?.entries?.[0]?.complete,
    selfCheckOk: hit?.accessLines?.entries?.[0]?.selfCheckOk,
    ghostLine: ghost?.accessLines?.entries?.[0]?.line ?? null,
    ghostComplete: ghost?.accessLines?.entries?.[0]?.complete,
    csvForNoPlatform: resolveCsvMappingDbPath(FIX_VER, null),
    csvForForge: resolveCsvMappingDbPath(FIX_VER, "forge"),
  };
  return { upstream, reduced, reduce_, built, consumer };
}

/** 在盘自洽腿：派生件 ↔ provenance ↔ 已建库三方对账（不在盘不判，但如实报数）。 */
function onDiskProblems() {
  const problems = [];
  const found = [];
  const dataRoot = path.join(REPO_ROOT, "data");
  for (const dir of fs.readdirSync(dataRoot)) {
    if (!/^forge_/.test(dir)) continue;
    const md = path.join(dataRoot, dir, "mappings");
    if (!fs.existsSync(md)) continue;
    let names;
    try {
      names = fs.readdirSync(md);
    } catch {
      continue;
    }
    for (const name of names) {
      if (!/^srg_to_official-.*\.tsrg$/.test(name)) continue;
      const version = name.replace(/^srg_to_official-/, "").replace(/\.tsrg$/, "");
      found.push(version);
      const provFile = names
        .filter((n) => /^mcp_config-.*\.provenance\.json$/.test(n))
        .find((n) => n.startsWith(`mcp_config-${version}-`));
      if (!provFile) {
        problems.push(
          `[ON-DISK] ${dir}/mappings/${name} 没有同档 provenance（在册 ${names.filter((n) => /provenance\.json$/.test(n)).length} 份）⇒ 派生件不得无凭据入库`,
        );
        continue;
      }
      let prov;
      try {
        prov = JSON.parse(fs.readFileSync(path.join(md, provFile), "utf8"));
      } catch (e) {
        problems.push(`[ON-DISK] ${provFile} 解析失败：${e.message}`);
        continue;
      }
      const sha = createHash("sha256").update(fs.readFileSync(path.join(md, name))).digest("hex");
      if (prov.derived?.sha256 !== sha) {
        problems.push(
          `[ON-DISK] ${dir}: 派生件 sha256 与 provenance 不符（文件 ${sha.slice(0, 12)}… 记的 ${String(prov.derived?.sha256).slice(0, 12)}…）`,
        );
      }
      const sqlite = path.join(md, "yarn-mappings.sqlite");
      if (!fs.existsSync(sqlite)) {
        problems.push(`[ON-DISK] ${dir}: 有派生件但没有已建映射库 ⇒ 消费面拿不到`);
        continue;
      }
      const db = openYarnDb(sqlite, { readonly: true });
      const meta = Object.fromEntries(db.prepare("SELECT key,value FROM meta").all().map((r) => [r.key, r.value]));
      const rows = {};
      for (const t of ["methods", "fields", "searge_methods", "searge_fields"]) {
        rows[t] = Number(db.prepare(`SELECT COUNT(*) c FROM ${t}`).get().c);
      }
      db.close();
      for (const [pk, mk] of [
        ["classes", "classCount"],
        ["methods", "methodCount"],
        ["fields", "fieldCount"],
      ]) {
        if (String(prov.derived?.[pk]) !== String(meta[mk])) {
          problems.push(
            `[ON-DISK] ${dir}: provenance.derived.${pk}=${prov.derived?.[pk]} 与库 meta ${mk}=${meta[mk]} 不同源`,
          );
        }
      }
      // meta 计数必须等于表内实数（`DEBT_MAPPING_COUNT` 同源病；searge 侧尤其：同名的跨 owner 副本
      // 会按主键塌行 ⇒ 照抄源行数就是虚报）
      for (const [mk, t] of [
        ["methodCount", "methods"],
        ["fieldCount", "fields"],
        ["seargeMethodCount", "searge_methods"],
        ["seargeFieldCount", "searge_fields"],
      ]) {
        if (Number(meta[mk]) !== rows[t]) {
          problems.push(`[ON-DISK] ${dir}: meta.${mk}=${meta[mk]} ≠ 表 ${t} 实扫 ${rows[t]} ⇒ 覆盖数虚报`);
        }
      }
      if (meta.mappingEra !== "mcp-config-srg") {
        problems.push(`[ON-DISK] ${dir}: 库 mappingEra=${meta.mappingEra}，不是该派生件应产出的 mcp-config-srg`);
      }
    }
  }
  return { problems, found };
}

const mkTmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "forge-srg-gate-"));
const cloneObs = (o) => structuredClone(o);

/**
 * 收临时根。dist 的 `openDbCached` 按 LRU 持有只读句柄（`MAPPING_DB_CAP`），Windows 上
 * 句柄没放开的 sqlite 文件删不掉 ⇒ 先 `closeAllYarnDbs()`，再退避重试（OneDrive/杀软抖动同形）。
 */
async function removeTmp(root) {
  try {
    const { closeAllYarnDbs } = await import(
      `${pathToFileURL(path.join(REPO_ROOT, "mcp-server/dist/mappings/yarn-sqlite.js")).href}`
    );
    closeAllYarnDbs();
  } catch {
    /* dist 未编译时本来就没打开过库 */
  }
  for (let i = 0; i < 6; i++) {
    try {
      fs.rmSync(root, { recursive: true, force: true });
      return;
    } catch (e) {
      if (e.code !== "EBUSY" && e.code !== "EPERM") throw e;
      const until = Date.now() + 150;
      while (Date.now() < until) {
        /* 短退避 */
      }
    }
  }
  console.error(`assert-forge-srg-ingest: 临时根未删净，遗留 ${root}（句柄未释放；不影响判定）`);
}

// ── selftest：投毒改的是观测值，判据本体一个字不动 ─────────────────────────────
if (process.argv.includes("--selftest")) {
  const t0 = Date.now();
  const cases = [
    {
      name: "上游件少一条方法行（reducer 吃行）⇒ 方法数 + 成员集合必红",
      run: (o) => {
        o.upstream.methodCount -= 1;
        o.upstream.members = o.upstream.members.filter((m) => !m.includes("m_137477_"));
      },
      want: /\[COUNT\] 上游件 方法|\[MEMBERS\] 上游件/,
    },
    {
      name: "reducer 把字段行吃了 ⇒ 入库件字段数 + 集合必红",
      run: (o) => {
        o.reduced.fieldCount = 0;
        o.reduced.members = o.reduced.members.filter((m) => !m.startsWith("F|"));
      },
      want: /\[COUNT\] 入库件 字段|\[MEMBERS\] 入库件/,
    },
    {
      name: "入库件里还留着该丢的行（reducer 漏丢参数层）⇒ 「丢参数行必须为 0」必红",
      run: (o) => {
        o.reduced.droppedParamLines = 1;
      },
      want: /\[COUNT\] 入库件 丢参数行/,
    },
    {
      name: "两侧成员集合互不等（同数不同名）⇒ 同答腿必红",
      run: (o) => {
        o.reduced.members = o.reduced.members.map((m) => m.replace("m_137477_", "m_999999_"));
      },
      want: /\[MEMBERS\]/,
    },
    {
      name: "库 meta 被人改成 yarn-tiny ⇒ era 必红",
      run: (o) => {
        o.built.era = "yarn-tiny";
      },
      want: /\[COUNT\] 库 meta\.mappingEra/,
    },
    {
      name: "searge 表没行（resolveCsvMappingDbPath 认不出该库）⇒ 必红",
      run: (o) => {
        o.built.seargeMethodRows = 0;
      },
      want: /\[COUNT\] 库 searge_methods 行/,
    },
    {
      name: "AT 行退回 <TODO:SRG名> ⇒ 成行腿必红",
      run: (o) => {
        o.consumer.line = "public net.minecraft.Util <TODO:SRG名> #makeExecutor";
      },
      want: /\[AT-LINE\]/,
    },
    {
      name: "无平台查询选中了这份 SRG 库 ⇒ era 归属门必红",
      run: (o) => {
        o.consumer.csvForNoPlatform = "/tmp/leaked.sqlite";
      },
      want: /\[ERA-GATE\]/,
    },
    {
      name: "库里没有的名字被判成完整行 ⇒ 反证腿必红",
      run: (o) => {
        o.consumer.ghostComplete = true;
      },
      want: /\[AT-LINE\] 库里没有的名字/,
    },
    {
      name: "meta.seargeMethodCount 照抄源行数（真踩过的虚报）⇒ 必红",
      run: (o) => {
        o.built.metaSeargeMethodCount = o.built.methodRows;
      },
      want: /\[COUNT\] meta\.seargeMethodCount = 表内行数/,
    },
    {
      name: "intermediary 列被灌了值 ⇒ 形状腿必红",
      run: (o) => {
        o.built.intermediaryNonNull = 2;
      },
      want: /\[MEMBERS\] intermediary/,
    },
  ];
  let missed = 0;
  const root = mkTmp();
  try {
    const base = await collect(root);
    // 真输入投毒（走真解析器，不只改快照）：抽掉一行成员的可读名 ⇒ 该条必须整个不被采纳
    const realPoison = await importText(
      UPSTREAM_FIXTURE.replace(
        "\tm_137477_ (Ljava/lang/String;)Ljava/util/concurrent/ExecutorService; makeExecutor",
        "\tm_137477_ (Ljava/lang/String;)Ljava/util/concurrent/ExecutorService;",
      ),
    );
    cases.push({
      name: "真输入投毒：上游行缺可读名 ⇒ 解析器不得采纳（方法数 + 未采纳计数 + 集合同时红）",
      run: (o) => {
        o.upstream = realPoison;
      },
      want: /\[COUNT\] 上游件 方法|\[MEMBERS\] 上游件/,
    });
    for (const c of cases) {
      const obs = cloneObs(base);
      c.run(obs);
      const got = judge(obs);
      if (!c.want.test(got.join("\n"))) {
        missed++;
        console.error(`  ✗ 投毒「${c.name}」未红在该当的判据上：${got.join(" | ") || "(零条)"}`);
      } else {
        console.log(`  ✓ 投毒「${c.name}」→ ${got[0].slice(0, 76)}`);
      }
    }
    const clean = judge(cloneObs(base));
    if (clean.length) {
      missed++;
      console.error(`  ✗ 正对照：同一份夹具本应绿，实得 ${clean.length} 条：\n    ${clean.join("\n    ")}`);
    }
    console.log(
      `\nassert-forge-srg-ingest(selftest): ${missed === 0 ? "OK" : `${missed} 例不符`}（${cases.length} 记投毒 + 1 正对照 · 夹具 ${EXPECT.classes} 类/${EXPECT.methods} 方法/${EXPECT.fields} 字段 · ${Date.now() - t0}ms）`,
    );
    await removeTmp(root); // 必须在 process.exit 之前：exit 是同步终止，finally 不会跑
  } catch (e) {
    missed++;
    console.error(`  ✗ selftest 执行体抛错：${e.message}`);
    await removeTmp(root);
  }
  process.exit(missed === 0 ? 0 : 1);
}

const t0 = Date.now();
const root = mkTmp();
let problems = [];
let onDisk = { problems: [], found: [] };
try {
  const obs = await collect(root);
  if (!process.argv.includes("--no-onDisk")) onDisk = onDiskProblems();
  problems = judge({ ...obs, onDisk: onDisk.problems });
  console.log(
    `  夹具：类 ${obs.built.classRows} · methods ${obs.built.methodRows} · fields ${obs.built.fieldRows} · searge ${obs.built.seargeMethodRows}/${obs.built.seargeFieldRows} · era=${obs.built.era}`,
  );
  console.log(
    `  AT 行：${obs.consumer.line}（complete=${obs.consumer.complete} selfCheck=${obs.consumer.selfCheckOk}）`,
  );
  console.log(`  反例：${obs.consumer.ghostLine}（complete=${obs.consumer.ghostComplete}）`);
} finally {
  await removeTmp(root);
}
console.log(
  `  在盘对账：${onDisk.found.length ? onDisk.found.join(", ") : "0 档"}（派生件未入库时该腿本轮未判；真库可用性由 test-core 的 s2Srg1201 腿判红）· 问题 ${onDisk.problems.length} 条`,
);
if (problems.length) {
  console.error(`assert-forge-srg-ingest: RED（${problems.length} 条）`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(
  `assert-forge-srg-ingest: OK（夹具 ${EXPECT.classes} 类/${EXPECT.methods} 方法/${EXPECT.fields} 字段 · 上游件↔入库件逐行同答 · ${Date.now() - t0}ms）`,
);
