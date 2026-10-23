#!/usr/bin/env node
/**
 * assert-signature-face-integrity —— **服务端面签名层（Javadoc）** 的出处 / 索引差 / 孤儿留痕门。
 *
 * ## 为什么不复用 `assert-javadoc-*.mjs` 那三道（读了源码，不是偷懒）
 * 那三道的**每一处定位与判据都绑死 Forge 约定**，直接套到本面会**全线误红**：
 *  - `assert-javadoc-build-provenance.mjs:253` 硬编码 `join(DATA_ROOT,"forge_javadoc")`；`:264` 只收 `/^\d/`
 *    开头的版本目录 ⇒ 本面目录名是 `stable`（伪版本），**扫不到**。
 *  - 同文件 `:144` 只扫 `raw/*.md`、把非 `.md` 判成「写盘残件」⇒ 本面 **raw 是 `.html`**，
 *    会被判成「零页 + 全是残件」。
 *  - 同文件 `:114-116` 的 `fmValue` **只认双引号** `key:"..."` ⇒ 本面 `source:` / `fetchedWith:` 无引号，**读成 null**。
 *  - 同文件 `:84` 的判据②从 `fetch-forge-javadoc.js` 取 `JAVADOC_VERSIONS` 钉表 —— 那是 **`<mc>-<build>`** 概念，
 *    本面上游 javadoc URL **没有版本段**（`/spigot/1.21.4/` 实测 404）⇒ **没有可钉的 build**。
 *  - `assert-javadoc-index-parity.mjs:55-57` 的 `idToStem` = 砍首段 + `/`→`_`，而 `:49` 的 `walkMd` **只回 basename**
 *    ⇒ 本面 id 是 `stable/org/bukkit/Advancement`、processed 是**嵌套** `org/bukkit/Advancement.md`，映射**不成立**。
 *  - `assert-javadoc-orphan-record.mjs:76-77` 要求报告里是 `files` 数组，本面用的是 `orphans`。
 *
 * ⇒ 结论：Forge 那套（`<mc>-<build>` 钉表 + 扁平 processed）与签名面（伪版本 + 嵌套包路径）是**两套语义**，
 * 硬合会把两边都改坏。本门**自洽覆盖同类三件事**，判据按本面口径写死。
 *
 * ## 判据（逐面）
 *  ① **出处可核**：每页 frontmatter 必有 `source:`，形状 `<base>/<pkgPath>/<Class>.html`（**禁 `#` 禁 `?`**）；
 *     且 `sourceType: javadoc`。URL 的包路径必须**等于**页面所在目录（错档即红）。
 *  ② **档内一致**：`asOfVersion` 与 `fetchedWith` 在**同档内各自唯一**（防混版本 / 混生产者）；
 *     `asOfVersion` 非空（空 = 自造版本，正是本仓明禁的不可核档）。
 *  ③ **索引差双向空**：`index-l0.json` 的每个 `id` → `processed/<id 去 `stable/` 前缀>.md` **必须存在**；
 *     反向，每个 `processed/**.md` 必须能在 index 里找到 id。两侧不等即红（**双向**，防"索引里有、盘上没有"）。
 *  ④ **raw ↔ processed 1:1**：`raw/**.html` 与 `processed/**.md` 按相对路径去扩展名必须一一对应。
 *  ⑤ **孤儿留痕自洽**：`_orphan-report.json` 必存在；`count === orphans.length`；`version === 档目录名`；
 *     `rawTotal` / `processedTotal` 与**磁盘实扫**一致；`orphans` 里列出的路径**必须真不在** processed 侧。
 *
 * 退出码：0 = 全过；1 = 有问题。`--list N` 附带前 N 条问题样本。
 *
 * `--selftest`：**投毒自证**（干净必绿 + 4 臂畸形必红 + 真实面正对照）。
 * 实现走**子进程**：在临时目录合成两面最小快照，再用本文件自己跑一遍（判据与真跑逐字相同），
 * 只断言退出码 —— 零改动主流程，顺带把「缺面降级」也一起验了。**不碰仓库 `data/`**。
 * 为什么要有它：`test-scripts.mjs:2240` 声称本门「4/4 畸形必红、干净必绿」；没有这段自证，
 * 那句声称就大于可自证强度（2026-10-20 全仓审查 F-1）。
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..");
const DATA_ROOT = process.env.MC_SKILL_DATA ?? join(REPO_ROOT, "data");
const LIST_N = Number((process.argv.find((a) => a.startsWith("--list")) || "").split("=")[1] ?? 0) || 0;

/**
 * 面清单。**`PRODUCER_REV` 必须与取数器里的常量逐字一致** —— 这是「语料 ↔ 代码双向钉」的那一钉：
 * 改了取数器输出格式而忘了 bump rev，本门不会红（rev 仍是旧值、语料也是旧格式）；但**改了页的
 * `fetchedWith` 而没同步这里，立刻红** —— 正是我们要防的「换过生产者却装作同一批」。
 */
const FACES = [
  {
    name: "spigot",
    versionDir: "spigot_stable/spigot-javadoc/stable",
    base: "https://hub.spigotmc.org/javadocs/spigot",
    producerRev: "fetch-spigot-javadoc.mjs@1",
  },
  {
    name: "paper",
    versionDir: "paper-api_stable/paper-javadoc/stable",
    base: "https://jd.papermc.io/paper/26.3",
    producerRev: "fetch-spigot-javadoc.mjs@1",
  },
  // 2026-10-23：paper-api 五个**按真 MC 版本**分的历史档（用户点名：必选 1.21.4/1.20.1 + 建议 1.21.1/1.16.5/1.12.2）。
  // 不登记进 FACES 就没有出处门罩着 —— index↔盘双向、raw↔proc 1:1、asOfVersion 这些判据全落在 `stable` 上而已。
  ...["1.21.4", "1.21.1", "1.20.1", "1.16.5", "1.12.2"].map((v) => ({
    name: `paper-${v}`,
    versionDir: `paper-api_${v}/paper-javadoc/${v}`,
    base: `https://jd.papermc.io/paper/${v}`,
    producerRev: "fetch-spigot-javadoc.mjs@1",
  })),
];

const problems = [];
const push = (face, msg) => problems.push(`${face}: ${msg}`);

/** 读 frontmatter 的原始行（**不假设引号**：本面 `source:`/`fetchedWith:` 无引号，也有带引号的字段）。 */
function readFm(md) {
  const t = md.charCodeAt(0) === 0xfeff ? md.slice(1) : md;
  const m = t.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!kv) continue;
    out[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1").trim();
  }
  return out;
}

/** 递归列文件，返回**相对路径**（带 `/`），与本面的嵌套 processed 同口径。 */
function walk(root, ext) {
  const out = [];
  if (!existsSync(root)) return out;
  const go = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, e.name);
      if (e.isDirectory()) go(full);
      else if (e.name.endsWith(ext)) out.push(relative(root, full).split("\\").join("/"));
    }
  };
  go(root);
  return out.sort();
}

/**
 * **缺面 ≠ 失败，也 ≠ 通过**（照 `assert-playtest-driver-compiles.mjs` 的既定范式）：
 * 本门的依赖是**可选的语料包**（`data/` 不进 git，CI / 只装了部分平台的用户上没有）——
 * 硬要求两面都在会让本门在那些环境**恒红**，从而根本挂不进链（S4 门链普查要求每道门可达）。
 * ⇒ 默认：只查**存在的**面；一个面都不在就打「本次未验证」并 rc=0。`--require` 走强口径（缺面即红）。
 */
// `--selftest` 必须在**缺面早退之前**：否则没装 data 的机器上 `--selftest` 会走「两面都不在 ⇒ 未验证 rc=0」，
// 自证根本不跑（那正是「声称大于可自证强度」的成因）。
if (process.argv.includes("--selftest")) {
  process.exit(runSelftest());
}

const REQUIRE = process.argv.includes("--require");
const present = FACES.filter((f) => existsSync(join(DATA_ROOT, f.versionDir)));
const missing = FACES.filter((f) => !present.includes(f));
if (present.length === 0) {
  if (REQUIRE) {
    console.log(`❌ --require：方案要求的面一个都不在（${FACES.map((f) => f.versionDir).join(" | ")}）`);
    process.exit(2);
  }
  console.log(
    `⚠ 两个签名面都不在（${FACES.map((f) => f.versionDir).join(" | ")}）⇒ 本次**未验证**，不是通过；` +
      `强口径请加 --require`,
  );
  process.exit(0);
}
if (missing.length > 0) {
  const names = missing.map((f) => `${f.name}(${f.versionDir})`).join(" | ");
  if (REQUIRE) {
    push("--require", `以下面缺失即红：${names}`);
  } else {
    console.log(`⚠ 跳过不存在的面：${names} —— **未验证**，不是通过`);
  }
}

/**
 * 合成一面最小快照（判据需要的四件：index-l0 / processed 页 / raw 页 / _orphan-report）。
 * `mutate(files, ctx)` 就地改文件表以投毒；不传 = 干净。
 */
function selftestWriteFace(rootDir, spec, mutate) {
  const d = join(rootDir, spec.versionDir);
  rmSync(d, { recursive: true, force: true });
  const page = {
    source: `${spec.base}/org/example/Foo.html`,
    sourceType: "javadoc",
    asOfVersion: "1.0.0",
    fetchedWith: spec.producerRev,
  };
  const fm = (o) => `---\n${Object.entries(o).map(([k, v]) => `${k}: ${v}`).join("\n")}\n---\n\nbody\n`;
  // 夹具的 pseudo 前缀必须跟 spec 走（`stable` / `1.21.4`）：FACES 现在混着伪版本档与真版本档，
  // 写死 `stable` 会让后者的正对照假红（2026-10-23 扩档时实测）。
  const pseudo = spec.versionDir.split("/").pop();
  const files = {
    // id 形状 = `<pseudo>/<包路径把 . 与 / 都换成 _>_<Class>`（实测 spigot 档：`stable/org_bukkit_advancement_Advancement`）
    "index-l0.json": JSON.stringify([{ id: `${pseudo}/org_example_Foo` }]),
    "processed/org_example_Foo.md": fm(page),
    "raw/org_example_Foo.html": "<html></html>",
    "_orphan-report.json": JSON.stringify({
      version: pseudo,
      producerRev: spec.producerRev,
      count: 0,
      orphans: [],
      rawTotal: 1,
      processedTotal: 1,
    }),
  };
  if (mutate) mutate(files, { spec, page, fm });
  for (const [rel, text] of Object.entries(files)) {
    const p = join(d, rel);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, text, "utf8");
  }
}

/** 跑本文件一次（子进程），只取退出码。 */
function selftestRun(dataRoot) {
  const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url)], {
    env: { ...process.env, MC_SKILL_DATA: dataRoot },
    encoding: "utf8",
  });
  return { status: r.status, stderr: (r.stderr ?? "").split("\n").filter((l) => l.trim()).slice(-2).join(" | ") };
}

function runSelftest() {
  const base = process.env.TEMP || process.env.TMP || tmpdir();
  const rootDir = mkdtempSync(join(base, "sig-face-selftest-"));
  const poison = (files, { spec, page, fm }) => {
    // ③ 盘上有、索引里没有
    files["processed/org_example_Baz.md"] = fm({ ...page, source: page.source.replace(/Foo\.html$/, "Baz.html") });
    files["raw/org_example_Baz.html"] = "<html></html>";
    files["_orphan-report.json"] = JSON.stringify({
      version: "stable",
      producerRev: spec.producerRev,
      count: 0,
      orphans: [],
      rawTotal: 2,
      processedTotal: 2,
    });
  };
  const cases = [
    ["干净（正对照）", null, 0],
    [
      "① 索引里有、盘上没有",
      (files) => {
        files["index-l0.json"] = JSON.stringify([{ id: "stable/org_example_Foo" }, { id: "stable/org_example_Bar" }]);
      },
      1,
    ],
    ["③ 盘上有、索引里没有", poison, 1],
    [
      "① source 包路径与文件名不符",
      (files, { page, fm }) => {
        files["processed/org_example_Foo.md"] = fm({ ...page, source: page.source.replace(/Foo\.html$/, "Wrong.html") });
      },
      1,
    ],
    [
      "⑤ 孤儿报告 count 与 orphans 不符",
      (files, { spec }) => {
        files["_orphan-report.json"] = JSON.stringify({
          version: "stable",
          producerRev: spec.producerRev,
          count: 3,
          orphans: [],
          rawTotal: 1,
          processedTotal: 1,
        });
      },
      1,
    ],
  ];
  let missed = 0;
  let poisoned = 0;
  for (const [name, mutate, want] of cases) {
    // 两面都写：两面齐 ⇒ 不触发「缺面降级」，干净臂才是真绿
    for (const spec of FACES) selftestWriteFace(rootDir, spec, spec.name === "spigot" ? mutate : null);
    const { status, stderr } = selftestRun(rootDir);
    const ok = want === 0 ? status === 0 : status !== 0;
    if (want !== 0) poisoned++;
    if (!ok) {
      missed++;
      console.error(`  ✗ selftest「${name}」应${want === 0 ? "绿" : "红"}实${status === 0 ? "绿" : "红"}${stderr ? " · " + stderr : ""}`);
    }
  }
  // 真实数据正对照：面在盘时，真跑本应绿
  let realChecked = 0;
  if (FACES.some((f) => existsSync(join(DATA_ROOT, f.versionDir)))) {
    realChecked = 1;
    const { status, stderr } = selftestRun(DATA_ROOT);
    if (status !== 0) {
      missed++;
      console.error(`  ✗ selftest 正对照：真实签名面本应绿，实得 rc=${status}${stderr ? " · " + stderr : ""}`);
    }
  }
  rmSync(rootDir, { recursive: true, force: true });
  console.log(
    `\nassert-signature-face-integrity(selftest): ` +
      (missed === 0
        ? `OK（${poisoned}/${poisoned} 畸形必红 + 干净必绿${realChecked ? " + 真实面正对照绿" : ""}）`
        : `${missed} 例不符`),
  );
  return missed === 0 ? 0 : 1;
}

for (const face of present) {
  const dir = join(DATA_ROOT, face.versionDir);
  const idxPath = join(dir, "index-l0.json");
  if (!existsSync(idxPath)) {
    push(face.name, "缺 index-l0.json");
    continue;
  }

  const rawFiles = walk(join(dir, "raw"), ".html");
  const procFiles = walk(join(dir, "processed"), ".md");

  // ── 判据① ②：逐页出处与档内一致 ─────────────────────────────────────────
  const asOfSet = new Set();
  const revSet = new Set();
  let pageCount = 0;
  for (const rel of procFiles) {
    const fm = readFm(readFileSync(join(dir, "processed", rel), "utf8"));
    if (!fm) {
      push(face.name, `processed/${rel}：读不到 frontmatter`);
      continue;
    }
    pageCount++;
    const src = fm.source ?? "";
    if (!src) {
      push(face.name, `processed/${rel}：缺 source:`);
      continue;
    }
    if (src.includes("#") || src.includes("?")) {
      push(face.name, `processed/${rel}：source 带锚点/查询串（${src.slice(-40)}）`);
    }
    if (!src.startsWith(`${face.base}/`)) {
      push(face.name, `processed/${rel}：source 不在本面 base 下（${src.slice(0, 70)}）`);
    } else {
      // 文件名 == URL 的包路径（**本面扁平口径**：包路径 `/`→`_`）
      // 为什么不是嵌套：`assert-corpus-faithfulness` 的 A2 要求 processed 的 basename **全局唯一**，
      // 而 Java 包里有同名类（Bukkit 真有三个 `Bed`）⇒ 嵌套必违反；扁平同时让
      // `audit-data-consistency` 的 `l0ProcessedStem`（`/`→`_`）与 store 的 id→路径解析**同源**。
      const urlRel = src.slice(face.base.length + 1); // 形如 org/bukkit/Bukkit.html
      const expect = urlRel.replace(/\.html$/, "").split("/").join("_") + ".md";
      if (expect !== rel) {
        push(face.name, `processed/${rel}：文件名与 URL 包路径不符（URL 推得 ${expect}）`);
      }
    }
    if ((fm.sourceType ?? "") !== "javadoc") {
      push(face.name, `processed/${rel}：sourceType≠javadoc（${fm.sourceType ?? "缺"}）`);
    }
    if (!fm.asOfVersion) {
      push(face.name, `processed/${rel}：缺 asOfVersion（空 = 自造版本，不可核）`);
    } else {
      asOfSet.add(fm.asOfVersion);
    }
    if (fm.fetchedWith) revSet.add(fm.fetchedWith);
  }
  if (asOfSet.size > 1) {
    push(face.name, `档内 asOfVersion 不唯一（${[...asOfSet].join(" | ")}）—— 混版本`);
  }
  if (revSet.size > 1) {
    push(face.name, `档内 fetchedWith 不唯一（${[...revSet].join(" | ")}）—— 混生产者`);
  }
  for (const rev of revSet) {
    if (rev !== face.producerRev) {
      push(face.name, `fetchedWith=${rev} 与代码钉值 ${face.producerRev} 不一致`);
    }
  }

  // ── 判据③：索引差**双向**空 ─────────────────────────────────────────────
  // id 前缀 = **该档的 pseudo 版本**，取 `versionDir` 最后一段（`stable` / `1.21.4`），不再写死 `stable`。
  // 2026-10-23 加真版本档时踩到：此门原先把前缀硬编码成 `stable/`，五个新档 index id 是 `1.21.4/...`
  // ⇒ 判据③对它们必然全红。改成按面取前缀（判据本身没收紧也没放松，只是不再假设「只有 stable」）。
  const pseudo = face.versionDir.split("/").pop();
  const pseudoRe = new RegExp(`^${pseudo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/`);
  const entries = JSON.parse(readFileSync(idxPath, "utf8"));
  const procSet = new Set(procFiles);
  const idToProc = new Map();
  for (const e of entries) {
    const bare = String(e.id ?? "").replace(pseudoRe, "");
    if (!bare || bare === e.id) {
      push(face.name, `index 条目 id 形状不符（应以 ${pseudo}/ 开头）：${e.id}`);
      continue;
    }
    const want = `${bare}.md`;
    idToProc.set(e.id, want);
    if (!procSet.has(want)) {
      push(face.name, `索引里有、盘上没有：${e.id} → processed/${want}`);
    }
  }
  const idSet = new Set(entries.map((e) => e.id));
  for (const rel of procFiles) {
    const id = `${pseudo}/${rel.replace(/\.md$/, "")}`;
    if (!idSet.has(id)) {
      push(face.name, `盘上有、索引里没有：processed/${rel} → id ${id}`);
    }
  }

  // ── 判据④：raw ↔ processed 1:1 ──────────────────────────────────────────
  const rawSet = new Set(rawFiles);
  for (const rel of procFiles) {
    const want = `${rel.replace(/\.md$/, "")}.html`;
    if (!rawSet.has(want)) push(face.name, `raw 缺对应页：raw/${want}`);
  }
  for (const rel of rawFiles) {
    const want = `${rel.replace(/\.html$/, "")}.md`;
    if (!procSet.has(want)) push(face.name, `processed 缺对应页：processed/${want}`);
  }

  // ── 判据⑤：孤儿留痕自洽 ────────────────────────────────────────────────
  const op = join(dir, "_orphan-report.json");
  if (!existsSync(op)) {
    push(face.name, "缺 _orphan-report.json（有 raw/ 必须有它）");
  } else {
    const rep = JSON.parse(readFileSync(op, "utf8"));
    const orphans = Array.isArray(rep.orphans) ? rep.orphans : null;
    if (!orphans) {
      push(face.name, "_orphan-report.json 缺 orphans 数组");
    } else {
      if (rep.count !== orphans.length) {
        push(face.name, `_orphan-report.count=${rep.count} ≠ orphans.length=${orphans.length}`);
      }
      if (rep.version !== pseudo) {
        push(face.name, `_orphan-report.version=${rep.version} ≠ 档目录名 ${pseudo}`);
      }
      if (rep.producerRev !== face.producerRev) {
        push(face.name, `_orphan-report.producerRev=${rep.producerRev} ≠ 代码钉值 ${face.producerRev}`);
      }
      if (rep.rawTotal !== rawFiles.length) {
        push(face.name, `_orphan-report.rawTotal=${rep.rawTotal} ≠ 磁盘 ${rawFiles.length}`);
      }
      if (rep.processedTotal !== procFiles.length) {
        push(face.name, `_orphan-report.processedTotal=${rep.processedTotal} ≠ 磁盘 ${procFiles.length}`);
      }
      for (const o of orphans) {
        if (procSet.has(`${o}.md`)) {
          push(face.name, `孤儿报告点名 ${o}，但它其实有对应 processed 页（报告失实）`);
        }
        if (!rawSet.has(`${o}.html`)) {
          push(face.name, `孤儿报告点名 ${o}，但 raw 里也没有（凭空条目）`);
        }
      }
    }
  }

  console.log(
    `[${face.name}] 页 ${pageCount} · index ${entries.length} · raw ${rawFiles.length} · processed ${procFiles.length}` +
      ` · asOf=${[...asOfSet].join(",") || "-"} · rev=${[...revSet].join(",") || "-"}`,
  );
  void statSync; // 保留 import（后续加体积判据时用）
}

if (problems.length > 0) {
  console.log(`\n❌ ${problems.length} 条问题：`);
  for (const p of (LIST_N ? problems.slice(0, LIST_N) : problems)) console.log("  - " + p);
  if (LIST_N && problems.length > LIST_N) console.log(`  … 其余 ${problems.length - LIST_N} 条（--list=N 调大）`);
  process.exit(1);
}
console.log("\n✅ 两个签名面：出处 / 档内一致 / 索引差双向空 / raw↔processed 1:1 / 孤儿留痕自洽 —— 全过");
process.exit(0);
