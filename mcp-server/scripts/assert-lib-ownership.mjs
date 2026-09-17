/**
 * G1 · 库摘要的身份与归属门（S4 / F113 · F98）。
 *
 * 为什么这是「一旦坏了整条数据链就静默出错」的那一环：`mcp-server/data/lib-api-summaries/*.json`
 * 是 `library-catalog.ts` 里 `verifiedApi.packages` 的唯一上游，catalog 又直接决定模型写模组时
 * 引用哪个库的哪个类。反编译期只要有一个 jar 解不出 modId，产物就落进 `unknown-mod/unknown`，
 * 于是**同一棵目录被 N 个 slug 共用**，Bookshelf 的类被当成 GeckoLib 的类写进摘要，再顺着
 * `merge-verified-api` 流进 14 个非 Bookshelf 条目 —— 全程没有一环报错。
 * F113 的终裁：catalog 里 50 行外来包，**无一例外**来自 `unknown-mod` 坍缩。
 *
 * 断言分两层：
 *  A. 内容层（任何数据根都跑）
 *     A1 归属：每个类按 `packageRoot`（前 3 段，函数直接抽自 writer）判归属；被**他条目**凭证占有且本条目
 *        modIds 不「段级自有」= 冒领。冒领只允许落在 DEBT 台账里点名的文件+条数上，多一个/少一个/换包根都红。
 *     A2 身份：`source.dirs` 出现 `unknown-mod`、或同一目录被 >1 slug 共用 = 坍缩复发（DEBT 之外的目录一律红）。
 *     A3 版本键：`versions` 出现字面量 `unknown` 是同一坍缩的第二症状。
 *     A4 连接：每份摘要必须连得上 catalog 条目；连不上则本门对它整体失效 ⇒ 直接红。
 *     A5 同源：规则不另写一份 —— `normSeg / ROOT_SEGMENTS / ownsPackage / packageRoot / foreignPackages`
 *        从 `scripts/merge-verified-api.mjs` 原文抽出跑，并钉住 `buildRootOwnerIndex` 的凭证登记行。
 *  B. 台账层（只跑真数据根）：把今天的存量债务逐数钉死（385 类 / 5 文件 / 每份 77 / 单一包根 /
 *     6 份 unknown-mod / 1 个共用目录 / 42 个已证实包根 / 1830 组 verifiedApi / 0 处凭证缺失）。
 *     S5 联网重建把存量清零时，本层会红并要求显式改台账 —— 数据面收敛必须签字，不许悄悄漂移。
 *
 * 测试假根：MC_SKILL_LIB_OWN_TEST_ROOT 指向含 `data/lib-api-summaries` 的目录（B 层跳过，A 层照咬）。
 * A5 锚点自证：MC_SKILL_LIB_OWN_WRITER_SRC 可把规则抽取指到一份改过形的 writer 副本上。
 * 投毒自检在 test-scripts.mjs §S4。
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(HERE, "..");
const REPO_ROOT = path.resolve(SERVER_ROOT, "..");

const TEST_ROOT = process.env.MC_SKILL_LIB_OWN_TEST_ROOT;
const DATA_DIR = TEST_ROOT ? path.join(path.resolve(TEST_ROOT), "data") : path.join(SERVER_ROOT, "data");
const SUM_DIR = path.join(DATA_DIR, "lib-api-summaries");
const MERGE_SRC = process.env.MC_SKILL_LIB_OWN_WRITER_SRC
  ? path.resolve(process.env.MC_SKILL_LIB_OWN_WRITER_SRC)
  : path.join(REPO_ROOT, "scripts", "merge-verified-api.mjs");

/**
 * 存量债务（S5 联网重建后已排空，2026-09-12 磁盘实算）。
 * 这些清单**保留为空**而不是删掉检查：重建后的摘要再冒领一个类，就会以「不在台账」的形式红，
 * 而不是因为台账被删而没人管。清零当时的数：冒领 385 类 / 5 文件 / unknown-mod 6 目录 → 全 0。
 */
const DEBT_FOREIGN = { "pal.json": 120 };
const DEBT_FOREIGN_ROOTS = { "io.github.ladysnake": "authored/lib-impersonate" };
/**
 * catalog 侧存量债务：`verifiedApi[key].packages` 里冒领他方包根的行（键 `条目id|版本键|包名`）。
 * 摘要只是中段，这一层才是模型真正抄成 import 的地方，所以逐行钉死而不是只记总数。
 * S5b 补取件 + merge 覆盖后归零（历史上是 50 行 → 36 行 → 0，全是 `net.darkhax.bookshelf` 冒领）。
 * 空台账 = 零容忍：再出现任何一条即以「不在存量台账」红。KfF 剩余的键救不了，实测原因不是元数据缺，
 * 而是那些 jar 自己不含 `kotlinforforge` 路径段（`-all` 把 kotlin/kotlinx 摊平、新版只剩
 * `META-INF/jarjar/` 壳）——外部证据按定义不许替 jar 编造身份，故归「jarjar 发现」后续。
 */
// S5c 已落地：merge-verified-api 的 writer 侧剔除删掉了最后 8 行（全是 kotlin-for-forge 冒领
// net.darkhax.bookshelf）—— 那些 jar 自身不含 kotlinforforge 路径段（-all 把 kotlin/kotlinx 摊平、
// 1.20.5+ 只剩 META-INF/jarjar 壳），取件救不了，只能剔除。本清单必须保持空：新冒领行当场红。
const DEBT_CATALOG_FOREIGN = [];
const DEBT_UNKNOWN_MOD_DIRS = [];
/**
 * S5b 补取件带出的新残留：pehkui 的 `21w10a` 快照行 jar 内没解出 modVersion，
 * 摘要因此又出现 `versions.unknown` 键（源码 dirs 是干净的，只有版本键脏）。
 * 登记而非放宽：修 versionKeyOf/modVersion 之后必须把它删掉。
 *
 * 2026-09-15 drain：43 库重建批次里 pehkui 用显式上限重建（归属层同一轮修了 sha512
 * 全名目录的 join），`21w10a` 快照行正确归属 ⇒ `versions.unknown` 键消失。
 * 台账条目停止复现 ⇒ 按「清空而不删除」纪律撤登记（drain 检查双向对账）。
 */
const DEBT_UNKNOWN_VERSION_KEYS = [];
/**
 * 共用反编译目录的存量登记（口径：目录名被 >1 个 slug 引用即「共用」，键=目录名，值=引用方数）。
 * 2026-09-16 第五次签字（30 无树库重建批次）：`{ jei: 2 }` —— 新产物 `emi_jei_rei.json`
 * 与旧游离产物 `jei__emi__roughly-enough-items.json` 同引 `jei` 树。按 3 条判定
 * （temp/PLAN-2026-09-08-销账-3条判定-2026-09-15.md 第 3 条）：旧文件「重建产出新产物后
 * 按被替代处置」——本批次即该时点，**处置动作（删）待用户一句话**；在动作前先登记承认现状。
 */
const DEBT_SHARED_DIRS = { jei: 2 };

/**
 * 台账层数字：B 层只在真数据根比对。
 *
 * 2026-09-14 签字（B1 第四层落地，唯一一次类名合计变化）：`classes` 12583 → **16975**。
 * 成因是 KFF 摘要按「发布清单」重新归属 —— 旧态只认目录里 `meta.version` 单值，一个 jar 只出一个版本键；
 * 新态 = `meta.version` ∪ `lib-manifests` 里该 jar 的 `gameVersion` 集合，于是
 * `kotlin-for-forge.json` 从 1 个版本键（`1.14.4`）变成 **47** 个（1.14…26.2），同一个类的
 * 多版本重复计入是**预期**口径（`classes` 是「各版本键类名之和」，不是去重数）。
 * 同一批改动同时消掉了 `versions.unknown`（KFF 侧）——`DEBT_UNKNOWN_VERSION_KEYS` 保持只有 pehkui。
 * 其余数字未动，`foreignTotal` 仍 0（没有新冒领）。
 */
const LEDGER = {
  // 2026-09-16 第五次签字（30 无树库重建批次）：
  //   summaries 44 → **45**（+1 = 新产物 `emi_jei_rei`；旧游离产物仍计在实算里，
  //     其删除待用户一句话，期间共用目录走 DEBT_SHARED_DIRS 登记）。
  // 2026-09-16 第七次签字（3 缺口库补齐：libgui / server-translations / spruceui-obsidianui）：
  //   summaries 45 → **48**（+3 新产物）。
  //   过程：① `lib-manifests/all.json` 补 3 条目（45 → 48 slug；sha512 本地实算，
  //     ObsidianUI 与 Modrinth 返回逐字节一致）；② `batch-decompile --filter
  //     slug=libgui,server-translations,spruceui-obsidianui`（libgui 首跑 fetch failed——
  //     undici 拉 GitHub Releases 失败，本地 jar 预置 `<sha512>.jar` 后 cached 复用重跑 success）；
  //     ③ `build-api-summaries --only <modId> --write`（上限显式给足）。
  //   依据：`temp/PLAN-2026-09-08-销账-裁定落地与外部条件-2026-09-16.md` §9.2（三库原为「已知缺口」，本轮闭环）。
  summaries: 48,
  // 2026-09-15 第三处签字（B1：KFF 摘要重建两轮）：
  //   classes 16975 → 13097 → **13801**
  //   轮一 −3878：旧 `kotlin-for-forge.json` 把捆进本库的 `kotlin.*` / `kotlinx.*` 运行时类
  //     也记成了本库 API（旧 classCount 4577 里只有 699 是真 KFF 类）。
  //   轮二 +704：修 `scripts/build-api-summaries.mjs` 的两处 Kotlin 识别缺陷后补回的真类 ——
  //     ① **文件门面**：`Foo.kt` 的顶层 fun/val 编译成 JVM 类 `FooKt`，而这类文件里**没有类型声明**，
  //        旧的 `scanJavaFile` 一条都收不到（实测 kfflib 30 个文件只收到 1 个类，25 个是纯门面）。
  //        新增 facade 回退：无类型声明 + 有非 internal 顶层 fun/val ⇒ 按文件名登记成类。
  //     ② `KOTLIN_MARKER` 的 `\bfun\s+[A-Za-z_$]` 匹配不到**泛型**顶层函数 `fun <T> Foo.bar()`，
  //        整份文件被判成非 Kotlin ⇒ 既过不了 CLASS_RE 也走不到门面回退（`CapabilityUtilKt` 就是这样漏的）。
  //   依据：`scripts/build-api-summaries.mjs --only kotlin-for-forge --max-classes 20000
  //     --max-methods 80000 --max-versions 60 --max-files 20000 --write`
  //     ⇒ 47 版 / 1403 类 / 2972 方法 / 零截断 / Σ 非 thedarkcolour = 0 / 去重 KFF 类 26 → 57。
  //   覆盖度已闭合：与 6 个 `-all.jar` 内层件的真实类面逐名比对，剩余差集 26 条 = 24 个 `$` 内部类
  //     （本门摘要**按设计**只收顶层类）+ 2 个 `LoggerKt`（唯一声明是 `internal final val`，无公开 API）。
  //   注意：`catalogEntries` / `attestedRoots` / `verifiedApiKeys` **两轮均未变** ——
  //     `emit-verified-api-from-summaries` + `merge-verified-api --dry-run` 报「跳过 67 键、新增 0、覆盖 0」，
  //     因为 catalog 存的是 `packages`（已剔除运行时根），而两轮只动了 `classes` 侧。
  //   纪律提醒：默认上限重建会**倒退**（类 505、丢 7 版、跳过 9 版）—— `--max-*` 必须显式给足，
  //     见 `CONTRIBUTING.md` §验证纪律。
  //   未做：其余 43 个库没跟着重建 —— 本修法对任何 Kotlin 库都成立，但会改它们的摘要与台账，
  //     属独立批次（见 `temp/PLAN-2026-09-08-销账-B1与上游校验-2026-09-15.md` §六）。
  // 2026-09-15 第四次签字（43 库摘要重建批次）：
  //   classes 13801 → **36935**（+23134）。构成：
  //   ① **上限劣化存量清偿**（19 个有树库用 `--max-versions 200 --max-classes 50000
  //     --max-methods 200000 --max-files 50000 --max-methods-per-class 200 --max-file-kb 8192`
  //     显式重建，全部零截断）：architectury 503→10350 / balm 630→6548 / bookshelf 539→1333 /
  //     malilib 575→1914 / sophisticated-core 420→5316 / moonlight 384→430 等 ——
  //     旧文件全是默认上限（500/40）静默截断的产物，与 KFF 同一颗雷。
  //   ② **geckolib F46 同构清污**：5937 → **797**（−5140 = shadowed 3540 + example 319 +
  //     org.apache.commons 1281；797 与普查真类面 `software.bernie.geckolib3.*` 精确一致）。
  //     路径：emit 扩 shaded/示例**段级**判据 + catalog 84 键全量键值清洗
  //     （temp/_r43_clean_geckolib_keys.mjs → merge --force --write）。
  //     裸 `software.bernie` 父根（直下 0 类）按「冗余父根」判据删除 —— 它在前缀匹配里
  //     放行整个 bernie 子树，是 shadowed/example 被持续收进摘要的根因。
  //   ③ **归属层修复**（`manifestVersionsForDirName`）：balm 有 5 个 sha512 **全名**（64 hex）
  //     反编译目录，旧匹配只认 `…-<sha12>` 尾缀 ⇒ join 断 ⇒ 整串 hex 被当版本键成脏键。
  //     现按前 12 位 join 清单（5 个 sha12 全命中：balm 3.2.5→6.0.2 forge，gv 1.18–1.19.4）
  //     ⇒ balm 6075→6548（+473）且 28 键零 hex 残留。
  //   `foreignTotal` 仍 0（无新冒领）；`DEBT_UNKNOWN_VERSION_KEYS` 清空（pehkui 复现消失）。
  // 2026-09-16 第五次签字（30 无树库重建批次）：
  //   classes 36935 → **103834**（+66899）。构成 = 24 个「无树库」从 CDN 取件 + 反编译
  //   （batch-decompile 全绿：iceberg/resourceful/owo/playeranimator/terra/yacl/puzzles/
  //   fc-api/polymer/jei/emi/satin/cca 等）→ 全量大上限重建 + 全量 --write 落盘（44 产物 33.75MB）。
  //   旧产物全是 8/12 默认上限劣化件：**14 库类数撞死 500 上限**、跳过键普遍、polymer 为 0 类空壳；
  //   重建后全量 dry-run = 成功 44 / 跳过 6（无 manifest）/ 截断库 0 / 版本内截断 0。
  //   注：前批 43 库批次已在 36935 里；本批增量全部来自这 24 库（含版本覆盖率扩展）。
  // 2026-09-16 第六次签字（cloth-config 摘要重建 + 多目录组归并修复，窗口终态）：
  //   classes 103834 → **114567**（+10733）；verifiedApiKeys 2583 → **2629**（+46）。
  //   过程：① 首轮重建只进旧组（16 键，1.14–1.17.1）——根因 = `findModDir` 的 JSONL 短路只取
  //     「第一个存在的库级目录」，同一 slug 的第二组（`decompiled-mods/cloth-config`，1.18+ 的树）永久不参与；
  //   ② 修复（scripts/build-api-summaries.mjs）：JSONL 分支收集同父下的**全部**存在组并返回 `{dirs,names}`，
  //     `resolveSourceDirs` 识别该 shape 直接给出多组 dirs（`merged:true`）；单目录行为不变（向后兼容）。
  //   ③ 重建 = **56 键 / 10928 类 / 65255 方法**（1.14–26.2 + 22w43a / 23w13a_or_b / 24w14potato 等快照档；
  //     旧组 7 leaf + 新组 24 leaf 并集），emit 114 条（摘 shaded/runtime 包根 1150 项）→ merge --write **新增 34 键**
  //     → npm run build。
  //   依据：`batch-decompile --filter slug=cloth-config --filter loader=fabric`（33 唯一 jar）+ 上述多目录组修复。
  //   summaries 45 / catalogEntries 50 / attestedRoots 98 / foreignTotal 120 未变（G1 实跑仅 classes 与 verifiedApiKeys 两项变化）。
  // 2026-09-16 第七次签字（3 缺口库补齐，与 summaries 同轮）：
  //   classes 114567 → **114708**（+141 = libgui 64 + server-translations 5 + spruceui-obsidianui 72）。
  classes: 114708,
  catalogEntries: 50,
  // 2026-09-15 第四次签字（43 库重建批次，与 classes 同轮）：
  //   verifiedApiKeys 1893 → **2221**（+328 新增键 = architectury 232（58 版 × 4 loader）+
  //     balm 67（含归属修复带出的 1.18–1.19.4）+ cloth-config 8 + bookshelf 4 + midnightlib 4 +
  //     caelus/curios 各 3 + libz/malilib 各 2 + fabric-language-kotlin/moonlight/sophisticated-core 各 1）
  //   attestedRoots   47   → **62**  （+15 = 新键带出的自有包根，全部 `ownsPackage` 自证）
  // 依据：emit 全量（503 行）→ merge --write（328 新增 + 0 覆盖 + 0 剔除）。
  //   geckolib 的 84 键由一次性键值清洗另走 merge --force（键数不变，只洗 packages）。
  //   `multiOwnerRoots` / `badVerifiedAt` / `foreignTotal` 均未变。
  // 2026-09-16 第五次签字（30 无树库重建批次，与 classes 同轮）：
  //   verifiedApiKeys 2221 → **2583**（+362 = 全量 emit 1567 行 → merge --write
  //     **新增 378 键**（jei/emi 合并条目 emi_jei_rei 50 版 × 多 loader 为大头）
  //     **剔除 16 冒领键**（pal 的旧键在 catalog 侧含 ladysnake.pal 外来包，merge writer 侧按判据剔）
  //     —— 新增 378 − 剔除 16 = 净 +362。
  //   attestedRoots 62 → **98**（+36 = 新键带出的自有包根，全部 `ownsPackage` 自证）。
  //   foreignTotal 0 → **120**：`pal.json` 的 120 个 `io.github.ladysnake.pal.*` 类被判外来——
  //     根因 = `packageRoot` 取**前 3 段** ⇒ `io.github.ladysnake` 根已被 impersonate 的凭证占据
  //     （同作者 Ladysnake 的两库同根）。判据边界登记：`DEBT_FOREIGN_ROOTS` 记
  //     `io.github.ladysnake → authored/lib-impersonate`（与 G1 实算的「真主」对账一致）；
  //     pal 的 catalog modIds 同轮补入 `pal` 段（library-catalog.ts，附注释）。
  //     处置 = 登记不改摘要（pal 类本体归属无误，纯 3 段根粒度问题；未来若细化 packageRoot
  //     粒度可撤此登记）。
  // 2026-09-16 第七次签字（3 缺口库补齐，与 classes 同轮）：
  //   attestedRoots 98 → **99**（+1 = 3 条新 verifiedApi 键带出的自有包根，按 3 段根口径
  //     io.github.cottonmc.cotton.gui / xyz.nucleoid.server.translations.api /
  //     org.thinkingstudio.obsidianui 里只有 1 个是新根，其余 2 段已被既有条目占据；
  //     全部 `ownsPackage` 自证）。
  attestedRoots: 99,
  multiOwnerRoots: 0,
  // 2026-09-16 第七次签字（3 缺口库补齐，与 classes 同轮）：
  //   verifiedApiKeys 2629 → **2632**（+3 = libgui `26.3/fabric`、server-translations `1.21.5/fabric`、
  //     spruceui-obsidianui `1.21.5/fabric`）。过程：3 条 authored 条目原**无 verifiedApi 字段**
  //     （`extractEntries` 见无 `verifiedApi:` 即跳过）⇒ 先各补 `verifiedApi: {}`，再
  //     `merge-verified-api --input gap3-verified.jsonl --write`（匹配 3 / 新增 3 / 覆盖 0 / 剔除 0）。
  //   catalog `verifiedApi` 3 键值含 packages（io.github.cottonmc.cotton.gui.* / xyz.nucleoid.server.translations.api.* /
  //     org.thinkingstudio.obsidianui.*），notes 亦改为「已补建」口径。
  //   注：本条在 merge 写盘后、dist 重建前 G1 仍绿（G1 从 dist 读 catalog）——重建后才见 +3，属预期时序。
  verifiedApiKeys: 2632,
  badVerifiedAt: 0,
  foreignTotal: 120,
  foreignFiles: Object.keys(DEBT_FOREIGN).length,
};

const failures = [];
const fail = (m) => failures.push(m);
const rel = (p) => path.relative(REPO_ROOT, p).split(path.sep).join("/");
const sortedJson = (obj) => JSON.stringify(Object.fromEntries(Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]))));

if (!fs.existsSync(SUM_DIR)) {
  console.error(`assert-lib-ownership(G1): 摘要目录不存在 ${rel(SUM_DIR)}`);
  process.exit(1);
}

// ── A5：把 writer 的归属规则原样搬进本门（分叉即红，不放任两份规则各自演化）──
const wsrc = fs.readFileSync(MERGE_SRC, "utf8");
const grabFn = (header) => {
  const i = wsrc.indexOf(header);
  if (i < 0) {
    fail(`${rel(MERGE_SRC)}:1 找不到 ${header} —— writer 规则已改名/搬迁，本门必须同步改口径`);
    return null;
  }
  let depth = 0;
  for (let k = wsrc.indexOf("{", i); k < wsrc.length; k++) {
    if (wsrc[k] === "{") depth++;
    else if (wsrc[k] === "}") {
      depth--;
      if (depth === 0) return wsrc.slice(i, k + 1);
    }
  }
  fail(`${rel(MERGE_SRC)}:1 ${header} 大括号未配平，取不出函数体`);
  return null;
};
const normSegLit = /const normSeg = (\(s\) => [^\n]*?);/.exec(wsrc);
const rootSegLit = /const ROOT_SEGMENTS = (\d+);/.exec(wsrc);
if (!normSegLit || !rootSegLit) {
  fail(`${rel(MERGE_SRC)}:1 取不出 normSeg / ROOT_SEGMENTS，本门钉的就是这两个锚`);
}
const INDEX_LINE = "if (ownsPackage(e, p)) attestPackage(roots, e.id, p);";
if (!wsrc.includes(INDEX_LINE)) {
  fail(`${rel(MERGE_SRC)}:1 凭证索引行「${INDEX_LINE}」已不在 buildRootOwnerIndex 里，本门的索引构建失去同源保证`);
}
const parts = normSegLit && rootSegLit ? [
  `const normSeg = ${normSegLit[1]};`,
  `const ROOT_SEGMENTS = ${rootSegLit[1]};`,
  grabFn("function ownsPackage(entry, pkg)"),
  grabFn("function packageRoot(pkg)"),
  grabFn("function foreignPackages(entry, packages, rootOwners)"),
  "return { ownsPackage, packageRoot, foreignPackages };",
] : [];
const rule = parts.length && !parts.some((p) => p === null) ? new Function(parts.join("\n"))() : null;
if (!rule) {
  console.error(`assert-lib-ownership(G1): 抽不出 writer 归属规则，无法继续（${failures.length} 项）`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}

let LIBRARY_CATALOG;
/** 与 MC_SKILL_LIB_OWN_WRITER_SRC 同形态：A6 只看 catalog，不给覆盖口就永远只能对现值跑，投毒打不到它。 */
const CATALOG_SRC = process.env.MC_SKILL_LIB_OWN_CATALOG_SRC
  ? path.resolve(process.env.MC_SKILL_LIB_OWN_CATALOG_SRC)
  : path.join(SERVER_ROOT, "dist", "diagnostics", "library-catalog.js");
try {
  ({ LIBRARY_CATALOG } = await import(pathToFileURL(CATALOG_SRC).href));
} catch {
  console.error(
    "assert-lib-ownership(G1): 缺 dist/diagnostics/library-catalog.js —— 先 `npm run build`" +
      "（catalog 是编译产物，本门读现值，不另 parse .ts）",
  );
  process.exit(1);
}

// ── 凭证表：包根 → 自有条目（与 writer 同规则，全部由 catalog 现值推出）────
const rootOwners = new Map();
const attest = (entryId, pkg) => {
  const r = rule.packageRoot(pkg);
  if (!rootOwners.has(r)) rootOwners.set(r, new Set());
  rootOwners.get(r).add(entryId);
};
const vaStats = { keys: 0, badVerifiedAt: 0, badList: [] };
for (const e of LIBRARY_CATALOG) {
  const sites = new Set();
  for (const [k, v] of Object.entries(e.verifiedApi || {})) {
    vaStats.keys++;
    if (!/^\d{4}-\d{2}$/.test(String(v?.verifiedAt || ""))) {
      vaStats.badVerifiedAt++;
      if (vaStats.badList.length < 5) vaStats.badList.push(`${e.id}/${k}`);
    }
    for (const p of Array.isArray(v?.packages) ? v.packages : []) if (typeof p === "string" && p) sites.add(p);
  }
  for (const p of sites) if (rule.ownsPackage(e, p)) attest(e.id, p);
}
const byKey = new Map();
for (const e of LIBRARY_CATALOG) {
  for (const k of [e.modrinthSlug, ...(e.modIds || [])]) if (k && !byKey.has(k)) byKey.set(k, e);
}
const entryFor = (sum) => byKey.get(sum.id) || byKey.get(sum.slug) || byKey.get(sum.modId);

// ── A1–A4：逐摘要扫描 ──────────────────────────────────────────────────────
const files = fs.readdirSync(SUM_DIR).filter((f) => f.endsWith(".json")).sort();
const stats = {
  classes: 0,
  foreignTotal: 0,
  foreignFiles: new Map(),
  foreignRoots: new Map(),
  dirsToSlugs: new Map(),
  unknownModFiles: [],
  unknownVersionKeyFiles: [],
};
for (const file of files) {
  const abs = path.join(SUM_DIR, file);
  let j;
  try {
    j = JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch (err) {
    fail(`${rel(abs)}:1 摘要不是合法 JSON（${err.message}）`);
    continue;
  }
  const entry = entryFor(j);
  if (!entry) {
    fail(`${rel(abs)}:1 连不上 catalog 条目（id=${j.id} slug=${j.slug} modId=${j.modId}）⇒ 归属检查对它整体失效`);
    continue;
  }
  if (!Array.isArray(j.source?.dirs)) {
    fail(`${rel(abs)}:1 source.dirs 缺失或非数组，反编译输出身份无从核对`);
  } else if (!j.source.dirs.length) {
    fail(`${rel(abs)}:1 source.dirs 为空 = 身份不可解却仍出了摘要`);
  }
  const here = [];
  for (const [vk, leaf] of Object.entries(j.versions || {})) {
    if (vk === "unknown") stats.unknownVersionKeyFiles.push(file);
    for (const cls of leaf?.classes || []) {
      stats.classes++;
      const root = rule.packageRoot(cls);
      if (rule.ownsPackage(entry, root)) continue;
      const owners = rootOwners.get(root);
      if (owners && [...owners].some((o) => o !== entry.id)) {
        here.push({ cls, root, owner: [...owners].filter((o) => o !== entry.id).join("|") });
      }
    }
  }
  if (here.length) {
    stats.foreignTotal += here.length;
    stats.foreignFiles.set(file, here.length);
    for (const h of here) stats.foreignRoots.set(h.root, h.owner);
    const allow = DEBT_FOREIGN[file];
    if (allow === undefined) {
      fail(
        `${rel(abs)}: 冒领 ${here.length} 个他方类（首个 ${here[0].cls} → 真主 ${here[0].owner}）。` +
          "该文件不在存量台账里 = 新增污染，根因通常是反编译输出目录坍缩（修法在取件端，不是在这里删类名）",
      );
    } else if (allow !== here.length) {
      fail(`${rel(abs)}: 冒领 ${here.length} 个 ≠ 存量台账 ${allow} 个（回潮或换了包根都要重新点名复核：${here[0].cls} → ${here[0].owner}）`);
    }
  }
  for (const d of j.source?.dirs || []) {
    if (d === "unknown-mod") stats.unknownModFiles.push(file);
    if (!stats.dirsToSlugs.has(d)) stats.dirsToSlugs.set(d, new Set());
    stats.dirsToSlugs.get(d).add(j.slug || file);
  }
}
// 存量之外的 unknown-mod / 共用目录 / unknown 版本键一律视为新污染
for (const file of stats.unknownModFiles) {
  if (!DEBT_UNKNOWN_MOD_DIRS.includes(file)) {
    fail(`${rel(path.join(SUM_DIR, file))}:1 source.dirs 含 unknown-mod 且不在存量台账 —— 解不出 modId 必须失败，不许落进公共目录`);
  }
}
for (const file of stats.unknownVersionKeyFiles) {
  if (!DEBT_UNKNOWN_VERSION_KEYS.includes(file)) {
    fail(`${rel(path.join(SUM_DIR, file))}:1 versions 出现字面量键 "unknown" 且不在存量台账（坍缩的第二症状）`);
  }
}
for (const [d, slugs] of stats.dirsToSlugs) {
  const allow = DEBT_SHARED_DIRS[d];
  if (slugs.size > 1 && (allow === undefined || allow !== slugs.size)) {
    fail(`反编译输出目录「${d}」被 ${slugs.size} 个 slug 共用（${[...slugs].sort().join(", ")}），存量台账为 ${allow ?? "无该项"} ⇒ 同一棵产物被多方冒领`);
  }
}

// ── A6：catalog 每个包都要被分类（模型的 import 直接抄这里，F113 的最后一跳）──
// 判据不是「foreign 计数 = 0」，而是：own 由规则当场复核；非 own 必须有标签；
// bundled 必须带「外壳自己声明的捆绑件」证据；剩下的只能落 unresolved —— 只有 unresolved 才是债。
const catalogForeign = []; // unresolved 且不在台账 ⇒ 新增脏行
const catalogForeignAll = []; // 全部 unresolved 行（drain 对账用）
const tagProblems = [];
for (const e of LIBRARY_CATALOG) {
  for (const [k, v] of Object.entries(e.verifiedApi || {})) {
    const tags = v?.packageOwnership ?? {};
    for (const p of Array.isArray(v?.packages) ? v.packages : []) {
      if (typeof p !== "string" || !p) continue;
      const owned = rule.ownsPackage(e, p);
      const t = tags[p];
      const row = `${e.id}|${k}|${p}`;
      // own 不强制存标签（规则可当场推出，强推只会逼一次全量改写却不增加任何检出力）；
      // 非 own 没标签 = 说不清来源，按最保守的 unresolved 处理，并单独报缺标签。
      if (!owned && (!t || typeof t.ownership !== "string") && !DEBT_CATALOG_FOREIGN.includes(row)) {
        const owners2 = rootOwners.get(rule.packageRoot(p));
        if (owners2 && [...owners2].some((o) => o !== e.id)) {
          tagProblems.push(`${row} 缺 packageOwnership 标签（该包根由他条目证实，却不写来源 = 下一次并入就是冒领）`);
        }
      }
      if (t && typeof t.ownership === "string") {
        if (t.ownership === "own") {
          if (!owned) tagProblems.push(`${row} 标 own，但 modId 不在包路径里（冒标）`);
        } else if (t.ownership === "bundled") {
          if (typeof t.evidence !== "string" || !t.evidence || t.evidence === "none") {
            tagProblems.push(`${row} 标 bundled 但无证据 ⇒ 捆绑必须来自 jar 自己的声明，不是包名猜测`);
          }
        } else if (t.ownership !== "unresolved") {
          tagProblems.push(`${row} 的 ownership=「${t.ownership}」不在 own|bundled|unresolved 之内`);
        }
      }
      const isUnresolved = owned ? false : t ? t.ownership === "unresolved" : true;
      if (!isUnresolved) continue;
      // 「own = 包路径含 modId 段」单独用作债务判据会淹没真信号：实测 catalog 里有 866 行
      // 按该定义不是 own（GeckoLib 的真身就是 software.bernie、KubeJS 是 dev.latvian.mods，
      // 库名压根不在包里），把它们一律记成债会把 8 行真冒领冲掉。
      // 因此债务只算「该包根确由别条目证实自有」的那一类 —— 那才是 F113 的实际伤害。
      const owners = rootOwners.get(rule.packageRoot(p));
      if (!owners || ![...owners].some((o) => o !== e.id)) continue;
      catalogForeignAll.push(row);
      if (!DEBT_CATALOG_FOREIGN.includes(row)) catalogForeign.push(row);
    }
  }
}
if (catalogForeign.length) {
  fail(
    `catalog 冒领他方包根 ${catalogForeign.length} 行（unresolved：既不含本库 modId 段、也无捆绑声明证据）：\n  ` +
      catalogForeign.sort().join("\n  "),
  );
}
if (tagProblems.length) {
  fail(
    `catalog 归属标签不合规 ${tagProblems.length} 处（非 own 要有标签、bundled 要带证据、own 要能复核）：\n  ` +
      tagProblems.sort().slice(0, 12).join("\n  ") +
      (tagProblems.length > 12 ? `\n  …（另有 ${tagProblems.length - 12} 处）` : ""),
  );
}

// ── B. 台账层（只跑真数据根）──────────────────────────────────────────────
if (!TEST_ROOT) {
  const cmp = (label, got, want) => {
    if (got !== want) fail(`台账: ${label} = ${JSON.stringify(got)}，应为 ${JSON.stringify(want)}（数据面变了要显式改本门台账）`);
  };
  cmp("摘要份数", files.length, LEDGER.summaries);
  cmp("类名合计", stats.classes, LEDGER.classes);
  cmp("catalog 条目", LIBRARY_CATALOG.length, LEDGER.catalogEntries);
  cmp("已证实包根", rootOwners.size, LEDGER.attestedRoots);
  cmp("一包根多主", [...rootOwners].filter(([, s]) => s.size > 1).length, LEDGER.multiOwnerRoots);
  cmp("verifiedApi 组", vaStats.keys, LEDGER.verifiedApiKeys);
  cmp("verifiedAt 不合规组", vaStats.badVerifiedAt, LEDGER.badVerifiedAt);
  cmp("冒领类名合计", stats.foreignTotal, LEDGER.foreignTotal);
  cmp("冒领文件数", stats.foreignFiles.size, LEDGER.foreignFiles);
  cmp("冒领分布", sortedJson(Object.fromEntries(stats.foreignFiles)), sortedJson(DEBT_FOREIGN));
  cmp("冒领包根→真主", sortedJson(Object.fromEntries(stats.foreignRoots)), sortedJson(DEBT_FOREIGN_ROOTS));
  cmp("source.dirs=unknown-mod", stats.unknownModFiles.sort().join(","), DEBT_UNKNOWN_MOD_DIRS.join(","));
  cmp("版本键 unknown", stats.unknownVersionKeyFiles.sort().join(","), DEBT_UNKNOWN_VERSION_KEYS.join(","));
  cmp(
    "共用目录",
    sortedJson(Object.fromEntries([...stats.dirsToSlugs].filter(([, s]) => s.size > 1).map(([d, s]) => [d, s.size]))),
    sortedJson(DEBT_SHARED_DIRS),
  );
  // A6 的 drain 检查：只罚「新增行」的话，修好的行会把台账条目留在原地，谁也证明不了债已清。
  // 两边取集合差 ⇒ 清一行就必须显式删一行台账（KfF 那 8 行等的是 jarjar 身份那条修，修完这里会自动逼你收尾）。
  cmp("catalog 冒领行集", sortedJson(Object.fromEntries([...new Set(catalogForeignAll)].sort().map((r) => [r, 1]))),
    sortedJson(Object.fromEntries([...DEBT_CATALOG_FOREIGN].sort().map((r) => [r, 1]))));
}

const summary = {
  root: rel(SUM_DIR),
  summaries: files.length,
  classes: stats.classes,
  foreign: stats.foreignTotal,
  attestedRoots: rootOwners.size,
  ledger: TEST_ROOT ? "skipped(test-root)" : "checked",
};
if (failures.length) {
  console.error(`assert-lib-ownership(G1): ${failures.length} 项不通过 ${JSON.stringify(summary)}`);
  for (const f of failures.slice(0, 25)) console.error(`  ✗ ${f}`);
  if (failures.length > 25) console.error(`  …另有 ${failures.length - 25} 项`);
  process.exit(1);
}
console.log(
  `  assert-lib-ownership(G1): ${summary.summaries} 份摘要 · ${summary.classes} 类 · 冒领 ${summary.foreign}（${DEBT_CATALOG_FOREIGN.length ? `全在存量台账内 ${DEBT_CATALOG_FOREIGN.length} 行` : `台账已清空`}）· ` +
    `已证实包根 ${summary.attestedRoots} · 台账 ${summary.ledger}`,
);
