# NeoForge 建档面（根纲「检查 NeoForge」的详细内容）

> 本文件是根 [`AGENTS.md`](../AGENTS.md)「第一步 · 3. 检查 NeoForge」的**详细内容落点**。
> 判档与决策仍以根纲那句话为准；这里存逐档读数、1.20.1 取数说明与 Forge 侧对照。

**NeoForge 建档面（实测 `ls -d neoforge/*/` 对 `ls -d data/neoforge_*/`，2026-09-05）：**

- 规则树 10 档、每档 **11 条** `00–10`：`1.20.1` / `1.20.4` / `1.20.6` / `1.21.1` / `1.21.3` / `1.21.5` / `1.21.8` / `1.21.10` / `1.21.11` / `26.1`。语料 9 档（`data/neoforge_<ver>`）。
- **唯一差额 `data/neoforge_1.20.1` 缺失 = 按设计，不是半档**：`search_neoforge_docs version=1.20.1` → `ok:true` + `forgeCompatible:true` + `versionFallback:false` + `sourceNote` 指「使用 Forge 1.20.1 文档数据（API 语义兼容）」（走的是 `data/forge_1.20.1`，不是邻近 NeoForge 版冒充）⇒ **不计入**「有树无数据」缺陷，也**不要**为凑数建 `data/neoforge_1.20.1` 克隆树。取数说明见 `CORPUS_PROVENANCE.md` §3。
- **26.2 / 26.3 上游现状（2026-10-31 实测）：构件先行、主文档滞后、primer 已到 26.3。**
  - maven `net.neoforged:neoforge` 的 `latest=release=26.1.2.125`，但正式版里已有 **`26.2.0.93`** 与 **`26.3.0.99`**（`26.3.0.76` 起脱离 `-beta`）。
  - 官方主文档（`docs.neoforged.net/docs/gettingstarted/`）版本选择器当前选中 **26.1**，正文里 26.2/26.3 零出现；`/docs/26.3/...` 直接 **404** ⇒ **主文档仍只到 26.1**（本仓 `data/neoforge_26.1` 与之对齐）。
  - 但 primer 已到 26.3 且**本仓已入库**：`data/neoforge_primers/26.2.md`（26.1→26.2）、`26.3.md`（26.2→26.3，`fetchedAt 2026-09-21`）。
  - ⇒ 讲 26.2/26.3 的**游戏侧迁移**只能走 primer（`get_migration_guide route=26.1->26.2` / `26.2->26.3`），**不得**拿 26.1 的 00–10 当 26.2/26.3 规则。
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
