/**
 * S20 判据共享库（从 test-core.mjs 抽出，2026-09-21 链位收口）。
 *
 * 为什么抽出来：S20 原先只内联在 `test-core.mjs` 里被调用，而根 `AGENTS.md:387` 规定
 * 「改了 `mcp-server/scripts/**` 或 `scripts/**` 后，收口**必须**跑第 8 步（`node test-scripts.mjs`）——
 * `npm test` 抽跑几道门**不能**代替它」。于是「管 scripts 写盘的闸」挂在一条改 scripts 的人不会跑的链上：
 * 两个已提交的门（assert-skill-yarn-attest / assert-skill-mappings-key）就让 S20 静默红着进了库。
 * 判据抽到本模块后，`test-core.mjs` 与 `scripts/assert-script-write-guard.mjs` 共用同一份实现
 * （判据唯一），后者挂在 test-scripts 的第 8 步链上。
 *
 * 语义一字未动：
 *  - 覆盖范围 = `scripts/` 与 `mcp-server/scripts/` 下全部 .mjs / .js（递归）；
 *  - 例外只有两张在册清单：已核实不写仓库正文的 NON_WRITERS，与本轮不可改的 DEBT；
 *    每条都必须仍存在且其依据正则仍成立，依据一断即门禁失败 —— 例外不许静默扩张。
 *  - 纯函数：输入 [{ rel, text }]，输出 { problems, stats }；本模块不读不写磁盘。
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** 本模块在 `mcp-server/scripts/_lib/` 下 ⇒ 上溯三级即仓库根（rel 以仓库根为基准）。 */
export const SCRIPT_WRITE_GUARD_REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

export const SCRIPT_WRITE_GUARD_REL = "scripts/_lib/write-guard.mjs";
/** 递归扫描根：这两棵子树下全部 .mjs / .js（S4 扩面——mcp-server/scripts 是真·语料生产者，旧扫描看不见）。 */
export const SCRIPT_WRITE_GUARD_SCAN_DIRS = ["scripts", "mcp-server/scripts"];
export const SCRIPT_WRITE_GUARD_SCAN_EXTS = [".mjs", ".js"];
/** 目录前缀即要求 guard：这些脚本的存在意义就是改仓库文件，哪怕此刻还没落笔。 */
export const SCRIPT_WRITE_GUARD_ALWAYS_DIRS = ["scripts/_oneoff"];
/** 已改道 write-guard 的顶层仓库写盘脚本：改名/删除必须显式改本清单，否则静默脱离扫描。 */
export const SCRIPT_WRITE_GUARD_FILES = [
  "scripts/index-qsl-verified.mjs",
  "scripts/fetch-neoforge-primers.mjs",
  // S17：这三个以前挂在 DEBT（默认就写 / 裸 join(repo, rel)），现已全量走 emit。
  "mcp-server/scripts/plan4-write-fabric-hollow.mjs",
  "mcp-server/scripts/plan4-write-packs.mjs",
  "mcp-server/scripts/repair-fabric-version-headers.mjs",
  // S17 第二轮：rift 抓取器与 community 索引器已从「默认就写」改成 wantWrite 语义。
  "mcp-server/scripts/fetch-rift-wiki.js",
  "mcp-server/scripts/build-community-index.mjs",
];
/** 已核实不写仓库正文：只写 $MC_SKILL_CACHE / .gitignore 的 temp/ / 由调用方给的 dest。值为依据正则。 */
export const SCRIPT_WRITE_GUARD_NON_WRITERS = new Map([
  ["scripts/fetch-loader-api-jars.mjs", /join\(CACHE/],
  ["scripts/batch-decompile.mjs", /join\(REPO_ROOT, "temp"/],
  ["scripts/_lib/fetch-with-ua.mjs", /export async function downloadWithFallback/],
  // 递归复制原语：目标由调用方给（同步卷上不能用 fs.cpSync 的 recursive 形态，
  // 见 scripts/_lib/copy-tree.mjs 头注释）；写仓库的调用点各自带 wantWrite 闸门。
  ["scripts/_lib/copy-tree.mjs", /export function copyTree\(/],
  // ── S4 扩面：mcp-server/scripts/**（逐条对活文本复验过依据正则）──────────
  ["mcp-server/scripts/assert-powershell.mjs", /mkdtempSync\(join\(tmpdir\(\), "mcskill-ps-"/], // 全部落笔在 OS tmpdir 的 workDir；仓库根只读（MC_SKILL_PS_TEST_ROOT 可换根）
  // 未做③（2026-09-26）：SRG 入库门的夹具根（削减件 .tsrg + 建出的 sqlite + 假数据根）全落
  // OS tmpdir 的 "forge-srg-gate-" 前缀下，finally/exit 前用 removeTmp 收；对 data/** 全程只读
  // （在盘对账腿用 readOnly 打开真库）。依据正则一断（改落到仓库内）本豁免即失效。
  ["mcp-server/scripts/assert-forge-srg-ingest.mjs", /mkdtempSync\(path\.join\(os\.tmpdir\(\), "forge-srg-gate-"/],
  ["mcp-server/scripts/assert-parser-availability.mjs", /mkdtempSync\(path\.join\(os\.tmpdir\(\), "mcskill-g2-"/], // 夹具 jar 只落 OS tmpdir；rmSync 收的就是那个目录，仓库源码全程只读
  // 2026-09-19 N3 裁定「补投毒」：--selftest 的 8 例夹具（tiny.gz / upstream *.bak / provenance / 假基线）
  // 全部落 OS tmpdir 下一个一次目录，finally 里 rmSync 收掉；门模式与 --measure-zero-member 全程不写盘。
  // 依据正则咬住那个 mkdtemp 前缀 —— 夹具落点一旦改到仓库内，本豁免即失效（重签或改道 write-guard）。
  ["mcp-server/scripts/assert-yarn-named-integrity.mjs", /mkdtempSync\(path\.join\(os\.tmpdir\(\), "mc-yarn-gate-selftest-"/],
  ["mcp-server/scripts/assert-cli-quick.mjs", /mkdtempSync\(path\.join\(os\.tmpdir\(\), "cli-quick-"/], // R3（NP-10 防回归）：新增夹具（薄壳拷贝 / mdk 树 / 锁根 / 数据根）全部落 OS tmpdir，仓库只读
  // story S1 的 mixin 形状门：夹具（假根 scaffold 树 + 自建 yarn sqlite）全落 OS tmpdir 的
  // "mixin-shape-selftest-" 前缀下；仓库 data/** 与 */scaffold/** 全程只读（readOnly:true 打开真库）。
  ["mcp-server/scripts/assert-scaffold-mixin-shape.mjs", /fs\.mkdtempSync\(path\.join\(os\.tmpdir\(\), "mixin-shape-selftest-"/],
  ["mcp-server/scripts/assert-sync-normalizers.mjs", /mkdtempSync\(join\(tmpdir\(\), "mcskill-norm-"/], // 同上：workDir 在 tmpdir，PS_FILE/JS_FILE 只作输入
  ["mcp-server/scripts/release-smoke.mjs", /mkdtempSync\(join\(tmpdir\(\), "mc-skill-release-smoke-"/], // 装配 staging 在 tmpdir，仓库 dist/package.json 只读
  ["mcp-server/scripts/_lib/build-yarn-mappings.test.mjs", /mkdtempSync\(path\.join\(tmpdir\(\), "yarnpacks-"/], // 测试根全在 tmpdir
  ["mcp-server/scripts/_lib/build-yarn-sqlite.test.mjs", /fs\.mkdtempSync\(path\.join\(os\.tmpdir\(\), "yarn-sqlite-"/], // 同上
  ["mcp-server/scripts/_lib/import-legacy.test.mjs", /fs\.mkdtempSync\(path\.join\(os\.tmpdir\(\), "tsrg-"/], // 同上
  ["mcp-server/scripts/_lib/pipeline-helpers.test.mjs", /mkdtempSync\(join\(tmpdir\(\), "ph-test-"/], // 同上
  ["mcp-server/scripts/_lib/thin-docs-wiki.test.mjs", /mkdtempSync\(join\(tmpdir\(\), "thin-wiki-"/], // 同上
  ["mcp-server/scripts/_lib/repair-yarn-named.test.mjs", /mkdtempSync\(path\.join\(tmpdir\(\), "yarncache/], // N-11.2 单测：三个 cacheDir 夹具根全在 OS tmpdir（yarncache*/bad*/fb*），仓库只读
  ["mcp-server/scripts/audit-all-tools.mjs", /"_audit-findings\.json"/], // 唯一产物 mcp-server/_audit-findings.json 已 gitignore
  ["mcp-server/scripts/sweep-similar-traps.mjs", /"_sweep-findings\.json"/], // 产物 gitignore；它代跑的写盘工具一律传 dryRun:true
  ["mcp-server/scripts/snapshot-sha256.mjs", /const OUT_DIR = join\(REPO, "agent-tools", "audit-snapshots"/], // 落 gitignore 的 agent-tools/；「豁免定义允许 gitignore 输出目录而非仅 temp」这一口径已登记在 S4 销账台账
  ["mcp-server/scripts/audit-data-consistency.mjs", /openSync\(abs, "r"/], // 假阳性：唯一原语命中是 mode "r" 的只读探头
  ["mcp-server/scripts/_lib/pipeline-helpers.mjs", /export async function downloadFileAtomic/], // 纯库，destPath 由调用方给；.tmp 只在 destPath 同目录
  ["mcp-server/scripts/_lib/thin-docs-wiki.mjs", /export function writeWikiProcessed\(processedDir, filename, markdown/], // indexPath/processedDir 都是函数参数
  ["mcp-server/scripts/_lib/build-yarn-mappings.mjs", /fs\.writeFileSync\(out, renderYarnMappingJson/], // out = CLI 位置参数（build <tiny.gz> <outJson>）
  ["mcp-server/scripts/_lib/repair-yarn-named.mjs", /process\.env\.TEMP \?\? "\/tmp", "yarn-v2-cache"/], // N-11.2 纯库：唯一 fs 落笔是 fetchV2Tiny 的 OS tmpdir jar 缓存；对仓库的写盘全在 CLI 侧（build-yarn-mappings repairNamedCli）走 write-guard
  ["mcp-server/scripts/_debug_article.mjs", /_debug_raw\.html/], // 只写 scripts/_debug*（gitignore）；该文件本身未入库
  ["mcp-server/scripts/_test_fetch.mjs", /_test_curl_output\.txt/], // 只写 scripts/_test_*（gitignore）；该文件本身未入库，url 由 argv 给
  // ── B1 转换器（2026-09-15 用户裁定登记豁免，不 adopt）─────────────────────
  // 缺省只写 gitignore 的 temp/verified-api-from-summaries.jsonl，不碰跟踪文件；
  // --out 由调用方给（同 batch-decompile 的 destPath 先例）。未来若改成写跟踪文件 ⇒ 必须改道 emit 并撤本条。
  ["scripts/emit-verified-api-from-summaries.mjs", /out: "temp\/verified-api-from-summaries\.jsonl"/],
  // 2026-09-21 链位收口：本模块是 S20 的**判据库本身**（纯函数，不读不写磁盘）。
  // 它的文本里必然出现原语名与豁免正则（那是判据数据，不是落笔），所以必须登记；
  // 依据锚定「判据函数仍在」这一事实本身 —— 函数改名/删除则本豁免失效，逼重签。
  ["mcp-server/scripts/_lib/script-write-guard-check.mjs", /export function diffScriptWriteGuard\(files\)/],
  // 2026-09-21 链位收口：S20 的**第 8 步链入口门**。它是只读门（喂合成文本给纯函数做投毒自证，
  // 不落任何盘），但源码里必然出现原语名与 `emit(` 形态（那是自证夹具），所以登记。
  // 依据锚定「投毒原语名仍是拆开拼的」这一事实：有人改回字面（= 门会被自己判红）即豁免失效。
  ["mcp-server/scripts/assert-script-write-guard.mjs", /const W = "writeFile" \+ "Sync";/],
  // ── 2026-09-21 链位收口：S20 终于跑上第 8 步链后**第一次**暴露的三个 selftest 门 ────────────
  // 它们与上面 assert-powershell / assert-yarn-named-integrity / assert-cli-quick 是**同一范式**：
  // --selftest 夹具全部落 OS tmpdir 的一次性目录，仓库全程只读。此前没登记，只因 S20 从未被
  // 改 scripts 的人跑到 —— 这正是链位缺陷的实证（静默红）。依据正则一律锚定那个 mkdtemp 前缀：
  // 夹具落点一旦改到仓库内，本豁免即失效（重签或改道 write-guard 的 scratch* 出口）。
  ["mcp-server/scripts/assert-skill-yarn-attest.mjs", /fs\.mkdtempSync\(path\.join\(os\.tmpdir\(\), "yarn-attest-selftest-"/], // selftest 的 fabric/forge 假 data 树全在 tmp；门模式（不传 --selftest）全程只读
  ["mcp-server/scripts/assert-skill-mappings-key.mjs", /fs\.mkdtempSync\(path\.join\(os\.tmpdir\(\), "mappings-key-"/], // 10 组 FM/围栏夹具逐例 rmSync+mkdirSync 重建在同一个 tmp 根
  // §6.8 缺口②（2026-09-25）：跨层名门（覆盖 leg2 之外的面）**全部**写盘只在 --selftest 的
  // OS tmpdir 合成根（`mkdtempSync(path.join(os.tmpdir(), "xlayer-"))`：假 data/ 映射源 + 假 pairs + 夹具件），
  // 末尾 rmSync 收掉；门模式与 --dump/--strict 全程零写盘。依据正则咬住那个 mkdtemp 前缀 ——
  // 夹具落点一旦改到仓库内，本豁免即失效（重签或改道 write-guard）。
  ["mcp-server/scripts/assert-cross-layer-names.mjs", /fs\.mkdtempSync\(path\.join\(os\.tmpdir\(\), "xlayer-"/],
  ["mcp-server/scripts/assert-upstream-chapters.mjs", /mkdtempSync\(join\(tmpdir\(\), "mc-skill-upstream-"/], // 快照夹具搭假 fabric 树验 checkSnapshotTree 真会红，搭在 tmp
  // A8（2026-09-24）：盘上 *.test.mjs ↔ node --test 链的覆盖门。门模式（不带 --selftest）全程只读；
  // --selftest 的假仓库（mcp-server/scripts/_lib/*.test.mjs + package.json）全搭在 OS tmpdir 的一次性目录里。
  // 依据正则锚定那个 mkdtemp 前缀：夹具落点一旦改到仓库内，本豁免即失效（重签或改道 write-guard）。
  ["mcp-server/scripts/assert-test-chain-coverage.mjs", /mkdtempSync\(path\.join\(os\.tmpdir\(\), "testchain-"/],
  // A7（2026-09-24）：Yarn↔Mojmap 对照产物的生产者（台账 `skill-mappings-value-matches-code` 的第二腿数据源）。
  // 它**从不写仓库**：产物落 `$MC_SKILL_CACHE/yarn-mojmap-pairs`，无该环境变量则落 OS tmpdir 的一次性目录；
  // 缺 client.txt 时现拉的 mojmap 也只进产物目录。依据正则锚定那个 out 解析 —— 落点若改成仓库内，本豁免即失效。
  ["mcp-server/scripts/build-yarn-mojmap-pairs.mjs", /process\.env\.MC_SKILL_CACHE[\s\S]{0,200}?path\.join\(os\.tmpdir\(\), "mc-skill-yarn-mojmap-pairs"\)/],
  // fetch-bedrock-script-api.mjs：落笔目标是 gitignore 的 mcp-server/scripts/_temp/（.gitignore:37），
  // 与 snapshot-sha256 的 agent-tools/ 同类（「豁免允许 gitignore 输出目录而非仅 temp」已登记在 S4 销账台账）。
  ["mcp-server/scripts/fetch-bedrock-script-api.mjs", /const TEMP = join\(REPO_ROOT, "mcp-server", "scripts", "_temp"\)/],
]);
/**
 * 会写仓库但本轮不收口的债务（并发代理 owns / 自带显式 --write 闸门未改道 / 新文件只靠 --force）。
 * 值 = 依据正则：闸门或契约一消失门禁即失败，逼重新签字；脚本收口后删掉本条即回到默认要求。
 */
export const SCRIPT_WRITE_GUARD_DEBT = new Map([
  ["scripts/decompile-loader-apis.mjs", /"--write"/],
  ["scripts/build-api-summaries.mjs", /--write/],
  ["scripts/merge-verified-api.mjs", /--write/],
  ["scripts/pin-mdk-checksums.mjs", /--apply/],
  ["scripts/build-lib-manifest.mjs", /wantWrite\(\)/],
  ["scripts/scaffold-version.mjs", /--force/],
  // ── S4 扩面 ①：闸门方向反了（默认就写，除非 --dry-run）——与 write-guard 的 wantWrite(argv) 相反 ──
  ["mcp-server/scripts/fetch-bedrock-docs.js", /const dry = process\.argv\.includes\("--dry-run"/],
  ["mcp-server/scripts/fetch-fabric-docs.js", /const DRY_RUN = CLI\.flags\.has\("dry-run"/],
  ["mcp-server/scripts/fetch-fabric-wiki.js", /const DRY_RUN = process\.argv\.includes\("--dry-run"/],
  ["mcp-server/scripts/fetch-forge-docs.js", /dryRun = parsedArgs\.flags\["dry-run"\]/], // 重签（2026-09-21 链位收口）：抓取器重构后旧依据 `const dryRun = parsedArgs.flags` 已不成立；闸门本身仍在（默认 dry-run，--dry-run 显式给）
  // 2026-09-22 复核（「落地后要不要改道」）⇒ **结论：不改道**；本行由「过渡登记」转为**长期登记**。
  // 三条依据（均亲验）：
  //   ① 改道动力已消失：原先它会因 rename 被抖动挡下而把 `*.tmp-<pid>` 留在 raw/（实测一轮 3 份整页正文），
  //      现已在文件内自清（本体 :84 `rmSync(tmp)`）；盘上 `data/bedrock_stable/**` 实测 .tmp 残留 = 0。
  //   ② 两种写盘语义**分工不同、不该强行统一**：`emitAtomic` 走「原子性优先」（rename 失败 ⇒ 清 tmp 抛），
  //      `writeWithRetry` 走「可用性优先」（rename 失败 ⇒ **直写兜底**保住正文，再清 tmp）。
  //      语料抓取一页很贵，可用性优先才对 —— 改道到 emitAtomic 反而会删掉这条兜底（能力倒退）。
  //   ③ 真正该收口的点在**调用方**：fetch-bedrock-docs.js / fetch-bedrock-script-api.mjs 仍是反方向闸门
  //      （`--dry-run` 才停、默认就写），属 DEBT 里十来个 .js 抓取器的**批次性**改造，不塞进这一波。
  // 本库是纯库（路径由调用方给）、闸门在调用方 —— 与 _lib/thin-docs-wiki / build-yarn-mappings 的既有口径同构。
  // 依据锚定「它仍自带退避 + 原子写」这一事实：该能力被删或改名即失效，逼重新签字。
  ["mcp-server/scripts/_lib/bedrock-corpus.mjs", /export async function writeWithRetry\(filePath, text, delays/],
  ["mcp-server/scripts/fetch-forge-javadoc.js", /const dryRun = args\.includes\("--dry-run"/],
  ["mcp-server/scripts/fetch-liteloader-wiki.js", /unlinkSync\(join\(dir, name\)\)/], // 写盘已走 emit；只剩这一处仓库删除口，守卫真源无仓库删除出口
  ["mcp-server/scripts/fetch-neoforge-docs.js", /const dryRun = args\.includes\("--dry-run"/],
  ["mcp-server/scripts/fetch-neoforge-primers.js", /const dryRun = args\.includes\("--dry-run"/], // 仓库根孪生 scripts/fetch-neoforge-primers.mjs 已改道，本 .js 是未转换的副本
  ["mcp-server/scripts/fetch-quilt-docs.js", /const dry = argv\.includes\("--dry-run"/],
  ["mcp-server/scripts/forge-javadoc-indexer.js", /const dryRun = args\.includes\("--dry-run"/],
  ["mcp-server/scripts/probe-forge-versions.js", /const OUT_FILE = join\(OUT_DIR, "forge-versions-manifest\.json"/],
  ["mcp-server/scripts/probe-neoforge-versions.js", /const OUT_FILE = join\(OUT_DIR, "neoforge-versions-manifest\.json"/],
  ["mcp-server/scripts/repair-quilt-indexes.js", /const dry = argv\.includes\("--dry-run"/],
  ["mcp-server/scripts/update-architectury-examples.js", /const DRY_RUN = process\.argv\.includes\("--dry-run"/],
  // ── S4 扩面 ②：只有 --force / 范围选择器，不是写盘闸门（缺索引时默认照写）────────
  ["mcp-server/scripts/_lib/build-semantic-index.mjs", /a === "--force"/],
  ["mcp-server/scripts/fetch-vanilla-registries.mjs", /if \(a === "--force"\) force = true/],
  ["mcp-server/scripts/process-neoforge-docs.js", /const force = args\.includes\("--force"/],
  // ── S4 扩面 ③：完全无闸门（F96/F139/F140 的实身位）。依据 = 仓库出口常量：
  //     出口一改（改道 cache / write-guard）或文件一删，本豁免即失效，逼重新签字。
  ["mcp-server/scripts/_debug_fetch_full.mjs", /OUT_DIR = join\(__dirname, "\.\.", "\.\.", "data"/], // 未入库探针脚本，建议删除而非收口
  ["mcp-server/scripts/_debug_final.mjs", /OUT_DIR = join\(__dirname, "\.\.", "\.\.", "data"/], // 同上
  ["mcp-server/scripts/_repair-broken-italic.mjs", /writeFileSync\(p, next, "utf8"/], // 未入库，就地改写 data/**/*.md
  ["mcp-server/scripts/_lib/build-yarn-sqlite.mjs", /const reportPath = path\.join\(__dirname, "mapping-sqlite-build-report\.json"/], // outPath=data/**/yarn-mappings.sqlite + 报告落在 scripts/ 且已入库
  ["mcp-server/scripts/_lib/ensure-mojang-mappings.mjs", /const dest = join\(versionDir, "client\.txt"/],
  ["mcp-server/scripts/build-library-catalog-from-authored.mjs", /const OUT_FILE = join\(__dirname, "\.\.", "src", "diagnostics", "library-catalog\.ts"/], // 覆盖的是 TS 源码而非 data/；S5 重生成 catalog 走的就是它
  ["mcp-server/scripts/fetch-forge-mappings.js", /const versionDir = join\(OUT_ROOT,/],
  ["mcp-server/scripts/forge-srg-extractor.js", /const EXTRACTED = join\(DATA_ROOT, "extracted"/],
  ["mcp-server/scripts/generate-porting-breakdown.js", /const outDir = join\(DATA_DIR, "forge-porting", "breaking-changes"/],
  ["mcp-server/scripts/link-forge-1.20.4-from-1.20.1.js", /const destForgeDocs = join\(DATA_DIR,/], // F139：无闸门整棵 1.20.1 语料拷成 1.20.4 再就地改版本号
  ["mcp-server/scripts/mcp-csv-extractor.js", /function writeOutputs\(outDir, outputs/],
  ["mcp-server/scripts/parchment-extractor.js", /const OUT_DIR = join\(__dirname, "\.\.", "\.\.", "data",/],
  // 重签（NP-6，2026-09-17）：数据根改走 scripts/_lib/data-root.js（--data-root > MC_SKILL_DATA > <repo>/data）
  // ⇒ 旧依据 `join(MC_SKILL_ROOT, "data",` 已不成立，锚点改钉「由解析器决定根」这一事实本身。
  ["mcp-server/scripts/process-fabric-docs.js", /const DATA_DIR = join\(resolveDataRoot\(\)/],
  ["mcp-server/scripts/process-fabric-wiki.js", /const DATA_DIR = join\(MC_SKILL_ROOT, "data",/],
  ["mcp-server/scripts/process-forge-docs.js", /const DATA_DIR = join\(__dirname, "\.\.", "\.\.", "data"/],
  ["mcp-server/scripts/tsrg-extractor.js", /const EXTRACTED = join\(__dirname, "\.\.", "\.\.", "data",/],
  ["mcp-server/scripts/fetch-embedding-model.mjs", /const cacheDir = join\(dataRoot, "_models"/],
]);
export const FS_MUTATION_PRIMITIVES = [
  "writeFileSync",
  "appendFileSync",
  "copyFileSync",
  // 2026-09-15 加固（write-guard 全扫批次）：两词补入后对 159 个脚本零新违例（预扫实证）——
  // cpSync 真调用仅 release-smoke（写 tmpdir，NW 豁免成立）；writeSync 真调用仅
  // repair-quilt-indexes（该文件已被 openSync 命中 + DEBT 登记）。补入是为了让「用这两个
  // 原语写仓库」的未来脚本也被抓住，而不是只依赖 openSync 的连带命中。
  "cpSync",
  "writeSync",
  "mkdirSync",
  "rmSync",
  "unlinkSync",
  "renameSync",
  "createWriteStream",
  "openSync",
  "truncateSync",
];

export function fsMutationPrimitiveRe(fn) {
  return new RegExp(`\\b(?:fs\\.)?${fn}\\s*\\(`);
}

/**
 * C-3（sweep81）：异步 / promise 化 / 回调式写盘原语。
 * 旧表只认 `*Sync` ⇒ 实测 11/11 种异步写入形态**完全不可见**（promise 化的 `fs.promises` 调用、
 * 从 `"node:fs/promises"` 具名 import 进来的原语、回调式的 `fs.` 前缀调用、`fs.promises` 的删除原语 …）。
 * 只收**高置信**形态，避免把同名本地 helper 误判成写盘（sweep80 活体扫描里 12 处异步形态全是同名的本地函数）。
 * 注：本注释刻意不写「原语名紧跟左括号」的连写示例 —— 本文件在 S20 扫描面内，写出来会自伤。
 */
export const FS_ASYNC_MUTATION_PRIMITIVES = [
  "writeFile",
  "appendFile",
  "copyFile",
  "cp",
  "rm",
  "unlink",
  "rename",
  "mkdir",
  "truncate",
  "open",
  "createWriteStream",
];

/** promise 限定名（`fs.promises` / `fsp` / `fsPromises` 前缀 + 原语名 + 左括号）—— 无需 import 推断。 */
export function fsPromiseQualifiedRe(fn) {
  return new RegExp(`\\b(?:fs\\.promises|fsp|fsPromises)\\.${fn}\\s*\\(`);
}

/** 回调式（`fs.` 前缀 + 原语名 + 左括号）—— 旧表只认 `*Sync`，这一族同样不可见。 */
export function fsCallbackRe(fn) {
  return new RegExp(`\\bfs\\.${fn}\\s*\\(`);
}

/** 从 `"node:fs/promises"`（或 `"fs/promises"`）具名 import 进来的写盘原语名。 */
export function promiseImportedPrimitives(text) {
  const out = new Set();
  for (const m of text.matchAll(/import\s*\{([^}]*)\}\s*from\s*["'](?:node:)?fs\/promises["']/g)) {
    for (const raw of m[1].split(",")) {
      const name = raw.trim().split(/\s+as\s+/)[0].trim();
      if (FS_ASYNC_MUTATION_PRIMITIVES.includes(name)) out.add(name);
    }
  }
  return out;
}

/** 单行是否命中「异步写盘」：限定名 / 回调式 / 该文件从 fs/promises 具名导入的原语。 */
export function lineHasAsyncWritePrimitive(line, fn, importedPromiseNames) {
  if (fsPromiseQualifiedRe(fn).test(line) || fsCallbackRe(fn).test(line)) return true;
  if (!importedPromiseNames.has(fn)) return false;
  return new RegExp(`\\b${fn}\\s*\\(`).test(line);
}

/** 文本里是否出现任何 fs 写盘原语（= 该脚本「能写文件」）。 */
export function scriptWritesFiles(text) {
  if (FS_MUTATION_PRIMITIVES.some((fn) => fsMutationPrimitiveRe(fn).test(text))) return true;
  if (FS_ASYNC_MUTATION_PRIMITIVES.some((fn) => fsPromiseQualifiedRe(fn).test(text))) return true;
  if (FS_ASYNC_MUTATION_PRIMITIVES.some((fn) => fsCallbackRe(fn).test(text))) return true;
  const imported = promiseImportedPrimitives(text);
  for (const fn of imported) if (new RegExp(`\\b${fn}\\s*\\(`).test(text)) return true;
  return false;
}

/** 在册豁免：NON_WRITERS / DEBT 两张清单之一（依据正则在 testScriptWriteGuardFunnel 里逐条复核）。 */
export function scriptGuardExempt(rel) {
  return SCRIPT_WRITE_GUARD_NON_WRITERS.has(rel) || SCRIPT_WRITE_GUARD_DEBT.has(rel);
}

/**
 * 是否要求 write-guard：_oneoff 目录无条件；其余看内容 —— 会写文件，或已经在用 guard 的 API
 * （后者重要：把 import 摘掉但 emit() 调用点还在，必须当场被抓，否则闸门可以悄悄摘）。
 */
export function scriptRequiresGuard(rel, text) {
  if (rel === SCRIPT_WRITE_GUARD_REL || scriptGuardExempt(rel)) return false;
  if (SCRIPT_WRITE_GUARD_ALWAYS_DIRS.some((dir) => rel.startsWith(`${dir}/`))) return true;
  return scriptWritesFiles(text) || /\b(?:emit|emitCopy|emitAtomic|wantWrite|logDryRunBanner)\s*\(/.test(text);
}

export function diffScriptWriteGuard(files) {
  const problems = [];
  let guardAdopted = 0;
  let primitiveHits = 0;
  let outsideGuardHits = 0;
  let exemptPrimitiveHits = 0;
  let emitCallSites = 0;
  for (const file of files) {
    const isGuard = file.rel === SCRIPT_WRITE_GUARD_REL;
    const exempt = scriptGuardExempt(file.rel);
    const importedPromiseNames = promiseImportedPrimitives(file.text); // C-3
    const importsGuard = /(?:^|\n)\s*(?:import|export)[^;\n]*from\s+["'][^"']*write-guard\.mjs["']/.test(file.text);
    if (importsGuard) guardAdopted++;
    if (!isGuard && scriptRequiresGuard(file.rel, file.text) && !importsGuard) {
      problems.push(`${file.rel}:1 未 import write-guard，会写仓库文件的脚本必须默认 dry-run`);
    }
    const exemptBasis = SCRIPT_WRITE_GUARD_NON_WRITERS.get(file.rel) ?? SCRIPT_WRITE_GUARD_DEBT.get(file.rel);
    if (exemptBasis && !exemptBasis.test(file.text)) {
      problems.push(
        `${file.rel}:1 在册豁免依据 ${String(exemptBasis)} 已不成立（不再「只写 cache / 自带闸门」），要么改道 write-guard，要么重签清单`,
      );
    }
    file.text.split(/\r?\n/).forEach((line, idx) => {
      if (
        /\b(?:emit|emitCopy|emitAtomic)\s*\(/.test(line) &&
        !/\bimport\b/.test(line) &&
        !/\bfunction\s+(?:emit|emitCopy|emitAtomic)\b/.test(line)
      ) {
        emitCallSites++;
      }
      for (const fn of FS_MUTATION_PRIMITIVES) {
        if (!fsMutationPrimitiveRe(fn).test(line)) continue;
        primitiveHits++;
        if (isGuard) continue;
        if (exempt) {
          exemptPrimitiveHits++;
          continue;
        }
        outsideGuardHits++;
        problems.push(`${file.rel}:${idx + 1} 直接调用 ${fn}()，写盘必须走 write-guard 的 emit / emitCopy`);
      }
      // C-3：旧表只认 `*Sync` ⇒ 异步 / promise 化 / 回调式写入者此前完全不在扫描面（实测 11/11 不可见）。
      // 注意豁免口径的收窄：两张在册清单只为旧表的 `*Sync` 原语签过字，
      // 「某文件是 NON_WRITER」不等于「它可以用 fs.promises 写盘」⇒ 豁免文件里出现即算问题。
      for (const fn of FS_ASYNC_MUTATION_PRIMITIVES) {
        if (!lineHasAsyncWritePrimitive(line, fn, importedPromiseNames)) continue;
        primitiveHits++;
        if (isGuard) continue;
        if (exempt) {
          exemptPrimitiveHits++;
          problems.push(
            `${file.rel}:${idx + 1} 在册豁免文件出现异步/回调式写盘原语 ${fn}( —— 豁免只覆盖旧表 *Sync 原语，请改道 write-guard 或重签豁免`,
          );
          continue;
        }
        outsideGuardHits++;
        problems.push(
          `${file.rel}:${idx + 1} 异步/回调式写盘原语 ${fn}( 未经 write-guard（C-3：旧表只认 *Sync，这类写入者此前完全不可见）`,
        );
      }
    });
    if (isGuard) {
      if (!file.text.includes('"--write"')) {
        problems.push(`${SCRIPT_WRITE_GUARD_REL}:1 缺 "--write" 判定，emit 不再受 dryRun 保护`);
      }
      if (!file.text.includes("DRYRUN")) {
        problems.push(`${SCRIPT_WRITE_GUARD_REL}:1 缺 DRYRUN 输出，dry-run 无从取证`);
      }
      if (!/function assertScratch\(/.test(file.text) || !/不许落在仓库内/.test(file.text)) {
        problems.push(
          `${SCRIPT_WRITE_GUARD_REL}:1 缺 scratch 仓库路径检查（assertScratch 或其 throw），scratch* 就成了绕过 --write 写仓库的后门`,
        );
      }
    }
  }
  return {
    problems,
    stats: {
      scanned: files.length,
      guardAdopted,
      primitiveHits,
      outsideGuardHits,
      exemptPrimitiveHits,
      offenders: new Set(problems.map((p) => p.split(":")[0])).size,
      emitCallSites,
    },
  };
}

/**
 * 扫描面 / 清单覆盖自证（纯函数，2026-09-21 收口——辅助 agent 指出「DEBT 只能进不能出」）。
 *
 * 为什么必须做成**反向腿**：本门的扫描面是**走盘**枚举的（含未跟踪文件），
 * 而豁免只在「文件被枚举到」时才逐条复核 ⇒ 文件一删、锚就静默失效，没有任何一方会报僵尸项。
 * 这条把「清单条目必须命中一个真实存在的文件」钉死：条目一旦成为僵尸，本函数当场返回问题。
 * 顺带把「扫描根非空 / 点名脚本仍在 / 不得双挂两张清单」一并收口，供 test-core 与第 8 步链共用。
 *
 * 2026-09-22 与 ignored 过滤的接口：判据腿只跑非 ignored 的文件（见 `dropGitIgnored`），
 * 但**僵尸判据问的是「文件还在不在」，不是「归不归本门判」** ⇒ 被 git 判为 ignored 的登记条目
 * 仍算在盘上。否则 `mcp-server/scripts/_debug_*.mjs` 这类「登记过、还在盘上、只是被 gitignore」的
 * 三条会被误报成僵尸（实测：加过滤后本函数一上来就红这三条）。
 */
export function checkGuardScopeCoverage(files) {
  const problems = [];
  const ignored = new Set(SCRIPT_WRITE_GUARD_IGNORED.rels);
  const has = (rel) => files.some((f) => f.rel === rel) || ignored.has(rel);
  if (!has(SCRIPT_WRITE_GUARD_REL)) {
    problems.push(`扫描范围必须含 ${SCRIPT_WRITE_GUARD_REL} 本身（否则唯一出口失控也查不出来）`);
  }
  if (!files.some((f) => f.rel.startsWith("scripts/_oneoff/"))) {
    problems.push("扫描范围必须含 scripts/_oneoff/ 脚本（该目录无条件要求 guard）");
  }
  for (const rel of SCRIPT_WRITE_GUARD_FILES) {
    if (!has(rel)) problems.push(`扫描范围必须含点名的写仓库 data/ 脚本 ${rel}（改名或删文件要显式改本清单）`);
  }
  for (const dir of SCRIPT_WRITE_GUARD_SCAN_DIRS) {
    if (!files.some((f) => f.rel.startsWith(`${dir}/`))) {
      problems.push(`扫描根 ${dir} 一个文件都没列到（扩面被回退 / 目录改名），本门禁已不再覆盖它`);
    }
  }
  for (const rel of [...SCRIPT_WRITE_GUARD_NON_WRITERS.keys(), ...SCRIPT_WRITE_GUARD_DEBT.keys()]) {
    if (!has(rel)) {
      problems.push(`清单条目 ${rel} 已不在扫描范围内（改名或删除要显式改清单；僵尸豁免不许静默留着）`);
    }
    if (SCRIPT_WRITE_GUARD_NON_WRITERS.has(rel) && SCRIPT_WRITE_GUARD_DEBT.has(rel)) {
      problems.push(`${rel} 不得同时挂在 NON_WRITERS 与 DEBT 两张清单`);
    }
  }
  return problems;
}

/** 扫描根缺失记录：缺失即清单失效，由调用方断言为空。 */
export const SCRIPT_WRITE_GUARD_SCAN_ERRORS = [];

/** 递归列扫描根下全部 .mjs / .js；跳过 node_modules 与点开头目录。 */
export function listScriptModuleFiles(dir, acc = []) {
  const abs = join(SCRIPT_WRITE_GUARD_REPO_ROOT, dir);
  if (!existsSync(abs)) {
    SCRIPT_WRITE_GUARD_SCAN_ERRORS.push(`扫描根 ${dir} 不存在（改目录要显式改 SCRIPT_WRITE_GUARD_SCAN_DIRS）`);
    return acc;
  }
  for (const e of readdirSync(abs, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const childRel = `${dir}/${e.name}`;
    if (e.isDirectory()) listScriptModuleFiles(childRel, acc);
    else if (e.isFile() && SCRIPT_WRITE_GUARD_SCAN_EXTS.some((ext) => e.name.endsWith(ext))) acc.push(childRel);
  }
  return acc;
}

export function listWriteGuardScope() {
  SCRIPT_WRITE_GUARD_SCAN_ERRORS.length = 0; // 每次重扫从零计错误，便于调用方断言「空」
  const rels = SCRIPT_WRITE_GUARD_SCAN_DIRS.flatMap((dir) => listScriptModuleFiles(dir)).sort();
  const kept = dropGitIgnored(rels);
  const keptSet = new Set(kept);
  SCRIPT_WRITE_GUARD_IGNORED.count = rels.length - kept.length;
  SCRIPT_WRITE_GUARD_IGNORED.rels = rels.filter((r) => !keptSet.has(r));
  return kept.map((rel) => ({ rel, text: readFileSync(join(SCRIPT_WRITE_GUARD_REPO_ROOT, rel), "utf8") }));
}

/**
 * 上一次扫描被 git 判为 ignored 的文件数 + 路径（可变模块态，与 SCRIPT_WRITE_GUARD_SCAN_ERRORS 同风格）。
 * 调用方必须在 ok 行里把 count 念出来 —— 「跳过了 N 个」和「一个都没跳」是两种状态。
 * `rels` 另有一份：清单覆盖自证要按**盘上是否存在**判僵尸，而不是按是否被忽略判
 * （否则「登记过、文件还在、只是被 gitignore」会被误报成条目失效）。
 */
export const SCRIPT_WRITE_GUARD_IGNORED = { count: 0, rels: [] };

/**
 * 丢掉 git 认为被忽略的文件。
 *
 * 为什么要有这一步：`mcp-server/scripts/_temp/` 是 `.gitignore`（第 37 行）在册的本地暂存根，
 * 而本机只要跑过一次 `tsc --outDir scripts/_temp/tsdist`，第 8 步链上的 S20 就会为那批**不入库的
 * 编译产物**报「未走 write-guard」—— 门红在仓库之外的文件上，谁也没法"修"它，只能整链红着。
 * 实测 2026-09-22 就是这个形状：153 个 tsdist 文件把 assert-script-write-guard 判成 rc=1。
 *
 * 这只缩范围、不放宽判据：入库文件永远不会被 git 判成 ignored ⇒ 真·仓库脚本一条都逃不掉，
 * 而被跳过的文件本来就不在库里，谈不上"收口"。
 * （这条安全性靠的是 `check-ignore` 的默认口径：**已跟踪文件一律不算 ignored**，
 *   只有加 `--no-index` 才会把跟踪文件也报出来 —— 本门刻意不加。）
 *
 * 失败姿态 = **不跳**（fail closed）：git 不可用 / rc 异常 ⇒ 原样返回，宁可假红也不要假绿。
 *
 * @param {string[]} rels 相对仓库根的路径（posix 分隔）
 * @param {(paths: string[]) => { status: number | null, stdout: string }} [runCheckIgnore] 注入点，供自证
 * @returns {string[]}
 */
export function dropGitIgnored(rels, runCheckIgnore = defaultCheckIgnore) {
  if (!rels.length) return rels;
  const r = runCheckIgnore(rels);
  // 裸 `check-ignore --stdin` 只回**被忽略**的路径，一行一条：
  // rc=0 有命中、rc=1 全不命中，两者都是正常答复；其余（128 / null ⇒ git 缺失）按"不跳"处理。
  if (!r || (r.status !== 0 && r.status !== 1)) return rels;
  const known = new Set(rels);
  const ignored = new Set(
    String(r.stdout)
      .split(/\r?\n/)
      .map((line) => line.trim().split("\\").join("/"))
      .filter((p) => known.has(p)),   // 只认输入里列过的路径，绝不凭输出删掉没列过的东西
  );
  return rels.filter((rel) => !ignored.has(rel));
}

function defaultCheckIgnore(paths) {
  try {
    return spawnSync("git", ["check-ignore", "--stdin"], {
      cwd: SCRIPT_WRITE_GUARD_REPO_ROOT,
      encoding: "utf8",
      input: paths.join("\n"),
      windowsHide: true,
    });
  } catch {
    return { status: null, stdout: "" };
  }
}
