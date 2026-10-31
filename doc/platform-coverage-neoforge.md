# NeoForge 建档面（根纲「检查 NeoForge」的详细内容）

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「第一步 · 3. 检查 NeoForge」的**详细内容落点**。
> 判档与决策仍以根纲那句话为准；这里存逐档读数、1.20.1 取数说明与 Forge 侧对照。

**NeoForge 建档面（实测 `ls -d neoforge/*/` 对 `ls -d data/neoforge_*/`，2026-09-05）：**

- 规则树 **12 档**：10 档每档 **11 条** `00–10`（`1.20.1` / `1.20.4` / `1.20.6` / `1.21.1` / `1.21.3` / `1.21.5` / `1.21.8` / `1.21.10` / `1.21.11` / `26.1`）+ **`26.2` / `26.3` 各 11 条**（2026-10-31 建；证据是**官方 MDK 模板 + NeoForge 26.2.0.93 / 26.3.0.99 sources jar**，不是 docs 正文；未核处逐条写在规则内，`pack.meta.json` 的 `gaps.rules` 也记了）。语料 9 档（`data/neoforge_<ver>`）。⇒ 「有树无语料」的档有 `26.2` / `26.3` 两档，它们**有 11 条规则但没有本版 docs 语料**。
- **唯一差额 `data/neoforge_1.20.1` 缺失 = 按设计，不是半档**：`search_neoforge_docs version=1.20.1` → `ok:true` + `forgeCompatible:true` + `versionFallback:false` + `sourceNote` 指「使用 Forge 1.20.1 文档数据（API 语义兼容）」（走的是 `data/forge_1.20.1`，不是邻近 NeoForge 版冒充）⇒ **不计入**「有树无数据」缺陷，也**不要**为凑数建 `data/neoforge_1.20.1` 克隆树。取数说明见 `CORPUS_PROVENANCE.md` §3。
- **26.2 / 26.3 上游现状（2026-10-31 实测）：构件先行、MDK 已出、主文档滞后、primer 已到 26.3。**
  - maven `net.neoforged:neoforge` 的 `latest=release=26.1.2.125`，但正式版里已有 **`26.2.0.93`** 与 **`26.3.0.99`**（`26.3.0.76` 起脱离 `-beta`）。
  - 官方主文档（`docs.neoforged.net/docs/gettingstarted/`）版本选择器当前选中 **26.1**，正文里 26.2/26.3 零出现；`/docs/26.3/...` 直接 **404**。三处硬证据（2026-10-31）：`neoforged/Documentation` 的 `version_labels.json` 里 `current.label="26.1"`、`versions.json` 只有 9 个历史档（`1.20.4`–`1.21.11`）、仓库全树 **898 文件里 `26.x` 零匹配**（`versioned_docs/` 只有 `version-1.20.4`…`version-1.21.11`）⇒ 主文档确实只到 26.1（本仓 `data/neoforge_26.1` 与之对齐）。
  - **本仓 manifest 的 probe 结论与上面一致**（`data/neoforge-versions-manifest.json`）：`versions["26.2"].available=false` / `httpStatus=404` / `note:"If /docs/26.2/ missing, use primer 26.2 + main-docs fallback 26.1"`；**`versions["26.3"]` 没有条目**（probe 只探到 26.2）。实测检索行为：`search_neoforge_docs version=26.2` → `resolvedVersion:"26.1"` / `total:20` / `source:primer`；`version=26.3` → `resolvedVersion:"26.3"` / `total:1` / `source:primer`（只有 primer 那一条）。
  - ⚠ **已知漂移风险**：`26.1` 的 `route` 是**空串**（其余 9 档都有 route）⇒ 抓 `docs.neoforged.net/docs/` 根，而根正是 Docusaurus 的 `current`。`version_labels.json` 现在写 `current.label="26.1"`，所以今天对齐；**一旦上游把 current 切到 26.2，`fetch-neoforge-docs.js --version=26.1` 会静默把 26.2 正文写进 `data/neoforge_26.1`** —— 抓取器不校验 `current.label`。改动前需给 route 钉值或加 label 断言。
  - 但 primer 已到 26.3 且**本仓已入库**：`data/neoforge_primers/26.2.md`（26.1→26.2）、`26.3.md`（26.2→26.3，`fetchedAt 2026-09-21`）。
  - ⇒ 26.2/26.3 的**游戏侧迁移**走 primer（`get_migration_guide route=26.1->26.2` / `26.2->26.3`）；loader/API 侧的 00–10 目前没有本版正文可引（26.1 的 00–10 是 26.1 的写法，不是 26.2/26.3 的证据）。
- **官方 MDK（2026-10-31 新找到，此前漏采）**：`https://github.com/neoforgemdks` 有 43 个 MDK 仓库，26.x 在列且已更新到 26.3 ——

  | MDK | 最近更新 | 真值（readme 级实读） |
  |---|---|---|
  | `MDK-26.3-ModDevGradle` | 2026-10-28 | `neo_version=26.3.0.99` / `minecraft_version_range=[26.3]`；plugin `net.neoforged.moddev` **2.0.148**；`java.toolchain.languageVersion = JavaLanguageVersion.of(25)`（注释原文「Mojang ships Java 25 to end users in 26.3」）；`neoForge { runs { client / server / gameTestServer } }`；`generateModMetadata` 把 `src/main/templates` 展开到 `build/generated/sources/modMetadata` |
  | `MDK-26.3-NeoGradle` | 2026-10-28 | plugin `net.neoforged.gradle.userdev` **7.1.39**；`implementation "net.neoforged:neoforge:${neo_version}"` |
  | `MDK-26.2-ModDevGradle` | 2026-10-18 | `minecraft_version=26.2` / `minecraft_version_range=[26.2]` / `neo_version=26.2.0.93` |
  | `MDK-26.2-NeoGradle` | 2026-10-17 | 同 26.2 线（NeoGradle 变体） |

  ⇒ 26.2/26.3 的**工程口径**（00 条：plugin、`neo_version`、Java 25、runs、modMetadata）已有官方一手源，不必靠 javap 反推；01–10 仍无正文。
- **被官方首页点名但当前不可用**：Modding Wiki = `https://forge.gemwire.uk`（`neoforged.net` 首页正文与页脚都指向它）—— 2026-10-31 探针 root / `/sitemap.xml` / 具体页面**全部 500**，属站点故障，不是路径写错。
- **静态抓不到的入口**：`projects.neoforged.net`（NeoForged Project Listing）是 SPA，HTML 只有 `<div id="app">` + JS 包，版本数据要执行 JS 才出；`jd.neoforged.net` 与 `docs.neoforged.net/javadoc/` 均 **404**。
  - **取证路径（2026-10-31 实跑：primer 给改动清单 + jar 给签名）**：
    - 建 26.3 探针工程（`F:\MOD_TEST\fabric263-probe`，loom 1.18.2 + loader 0.20.1 + `minecraft_version=26.3`）→ **`BUILD SUCCESSFUL in 2m 4s`**，顺带把 **26.3 的 `minecraft-merged.jar`（37.7 MB）** 落到 `caches/fabric-loom/26.3/`；
    - `javap -cp <26.3 merged jar>` 逐类核 primer 的说法，结果见下表；
    - NeoForge 侧另有 `neoforge-26.3.0.99-universal.jar`（maven `releases`，6.83 MB / 3116 条目）可核 `net.neoforged.*`。
  - **primer ↔ 26.3 jar 互证（2026-10-31）**：

    | primer 说 | 26.3 jar 实测 | 结论 |
    |---|---|---|
    | 输入改用 SDL，绑定 `InputConstants` / `SDLScancode` | `com.mojang.blaze3d.platform.InputConstants` 在（`public static final int KEY_*`）；**MC jar 里没有 `SDLScancode`** | `SDLScancode` / `SDLKeycode` / `SDLMouse` 在 **`org.lwjgl.sdl`**（`lwjgl-sdl-3.4.3.jar` 实测）⇒ import 要写 `org.lwjgl.sdl.SDLScancode`，别当 MC 类 |
    | `KeyEvent#key` 取 `SDLScancode`，`keycode`（原 `scancode`）取 `SDLKeycode` | `net.minecraft.client.input.KeyEvent` 是 **record**：`KeyEvent(int,int,int)` + `key()` / `keycode()` / `modifiers()` / `input()` / `shortcutKey()` | 一致；相对 GLFW 时代 `key` 与 `keycode` 语义**对调** |
    | 文本输入必须调 `TextInputManager#onTextInputFocusChange` | `TextInputManager`：`startTextInput(Object)` / `stopTextInput()` / `onTextInputFocusChange(Object, boolean)`；`Minecraft`：`textInputManager()` / `onTextInputFocusChange(GuiEventListener, boolean)` | 一致 |
- 对比：Forge 侧 `forge/1.21.1` 实测 `.cursor/rules` 内 `00–10` 数 = **0**（draft，见步骤 5）；`1.7.10` / `1.8.9` / `1.9.4` / `1.10.2` / `1.11.2` 是 **3 条短规则树**且各自有 `data/forge_<ver>` 语料——短不是漏，禁止用 1.12.2 的 00–10 顶替。
