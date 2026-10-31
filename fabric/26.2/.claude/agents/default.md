# Fabric 26.2 — Agent 总纲

> 文档 fallback 仅限查询 API，不代表规则树可用。
> 只适用于 **Minecraft / Fabric 26.2**。游戏已去混淆（26.1 起），直接写 Mojang 官方名。
> **禁止**把 `fabric/26.1.2` 的 01–10 当本版：26.2 有实删实改（开屏、截图、id 类三分、Vulkan），照抄 26.1.2 会写出编不过的代码。
> 先 `list_fabric_versions`，再用 `search_fabric_docs`（version=26.2）。
> **查 API 分工**：`query_api` / `get_method_params` 对 26.x 无 Parchment 索引（已去混淆）。`convert_mapping` 对 26.x 一律 `UNOBFUSCATED_NO_YARN`。Vanilla / Fabric API → `search_fabric_docs`(26.2) + `query_loader_api`(platform=fabric, minecraftVersion=26.2) + `ingest_loader_api`（自备 jar）。

## 语料与取数（可核）

| 项 | 值 |
|---|---|
| docs 树 | `data/fabric_26.2/fabric-docs/26.2/`（**105 页**，pin commit `238533d819fcb5ec9405acb58fb0ac7655df63b1`，2026-10-29） |
| 参考源码 | `data/fabric_26.2/reference/latest/`（443 文本件）＋档根 `reference/build.gradle` |
| loader-api 摘要 | `mcp-server/data/loader-api-summaries/26.2-fabric-api.json`（**1636 类**；由 fabric-api `0.161.0+26.2` 的 44 个模块 jar 合并后反编译抽取） |
| 自证 | `upstream-tree.json`（`layout: latest-unprefixed` + `commitSha` + 105 页清单）、`reference.provenance.json`（逐文件 `blobSha`/`sha256`） |

⚠️ 上游**没有** `versions/26.2` 目录：26.2 是「最新面」（站点 `/develop/...`，无版本前缀）。取数脚本 `mcp-server/scripts/provision-fabric-latest.mjs`（必须 `--sha` pin）。禁止把本档当「26.1.2 克隆树」。

## 硬约束（26.2 语料 + 本机实测编译，不是邻版记忆）

| 项 | 口径 | 出处 |
|---|---|---|
| Java | **25** | `26.2/develop_getting-started_setting-up:24-26` |
| Gradle | **9.8.1 实测可编**（官方模板 wrapper 钉 9.8.2） | 2026-10-31 本机 `F:\MOD_TEST\fabric262-probe` BUILD SUCCESSFUL |
| Loom | **`1.18.2`（稳定版）实测可解析 MC 26.2**；官方 26.2 分支写 `1.19-SNAPSHOT` | 同上 |
| Loader | **`0.20.1`** | `meta.fabricmc.net/v2/versions/loader/26.2` 唯一 `stable:true` |
| Fabric API | **`0.161.0+26.2`** | `fabric-example-mod@26.2:gradle.properties` |
| Loom 插件 id | `net.fabricmc.fabric-loom`（不是旧 `fabric-loom`） | `26.2/develop_porting_index` |
| 依赖配置 | `implementation` / `compileOnly` / `api`，**不要** `modImplementation` | 同上 |
| 任务名 | `jar` 取代 `remapJar` | 同上 |
| 开屏 | `Minecraft.getInstance().gui.setScreen(...)` | `26.2/develop_rendering_gui_custom-screens:43` |
| 截图 | `Screenshot.grab(Minecraft, boolean)`（`getMainRenderTarget()` 已删） | javap 实测，`mcp-server/src/generators/playtest-driver.ts:565-570` |
| 渲染后端 | 必须走 `Blaze3D`；26.2 起有可选 Vulkan，raw OpenGL 不受支持 | `26.2/develop_rendering_basic-concepts:15` |
| id 类 | `ModItemIds` / `ModBlockIds` / `ModBlockItemIds` **三分** | `26.2/develop_items_first-item:25`、`26.2/develop_blocks_first-block:30,45` |
| 事件 | `Event.register`；`BlockEvents`/`ItemEvents` 存在但**无方法** | `26.2/develop_events_index:28` + 26.2 摘要 |

## 规则文件

00–10 只引用 `data/fabric_26.2` 能核到的 id。核不到的编号是「未核实、禁止输出」stub，**不是缺文件**。

本档知识 = **rules + `search_fabric_docs`(version=26.2)**，外加一份逐名可核清单 **`knowledge/common/verified-api-26.2.md`**（表 A 名称来源 / 表 B 已核实签名 / 表 C 26.1.2→26.2 迁移 / 表 D 编译实测 / 表 E 未核实清单）。除该文件外 `knowledge/` **有意为空**，禁止克隆 `fabric/26.1.2/knowledge` 或 `fabric/1.21.11/knowledge`。

**版本折叠：** 本档只认精确 `26.2`。Fabric Meta 的 26.2 是独立 stable，本仓没有 `26.2.1` 补丁档 —— 工程写 `26.2.1` / `26.2.x` 一律拒，**不要**折到本档。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 发布 / 反编译研究）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill + `search_*_docs`。

- 汉化：`localize_mod`（无机器翻译）。
- 崩溃分诊：`crash_analyze`。
- 发布：`mc-publish` 工作流 + `check_publish_ready`；不代跑 Gradle、不拷 jar、不上传。
- 写盘 / Gradle / 拷 jar / 上传均须用户确认（人在环）。
