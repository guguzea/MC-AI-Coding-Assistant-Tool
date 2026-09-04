# Quilt 1.21.1 — Agent 总纲

> 本规则集适用于 **Quilt 1.21.1**。检测 `quilt.mod.json` 或 `org.quiltmc.loom`（可同时有 `fabric.mod.json`）。
> **必须再读** `fabric/1.21.1/.cursor/rules/` 的 **02–04、07–08、10**（及缺的 09）。05/06 用本目录，不要 overlay Fabric 网络。
> 本目录只写 QSL / Quilt Loader **差异**（00 / 01 / 05 / 06）。禁止把整棵 Fabric 规则复制进来。

> ⚠️ **QSL 构件核实（maven 一手核实，截至 2026-09-04）**：`org.quiltmc:qsl` 的 maven `<release>` 停在 **`10.0.0-alpha.5+1.21.1`**（`qsl/maven-metadata.xml` lastUpdated 2025-09-21）；1.21 线只有 **4 个 alpha 构件**（`10.0.0-alpha.1+1.21` 1 个、`10.0.0-alpha.2/3/5+1.21.1` 3 个），均非正式版；maven 清单中最后一个不含 alpha 的构件是 **`6.3.0+1.20.1`**（1.20.1 制品）。旧横幅的 `11.0.0-alpha` / `11.0.0-alpha.3+0.102.0-1.21` 在 maven 上 0 命中（虚构，勿再写）；「Modrinth 全部 143 个发布」「QFAPI 7.7.0 终版 2024-12-02」「止于 2024-08-12」「仅 qsl_base + crash_info 模块」均未复核，已删。「QSL 2025-12 停更」原引 `https://quiltmc.org/en/faq/`（现返回 **404**，无法复核）→ `// TODO(未核实)`，不再作为依据。**本版本（1.21.1）不存在任何可用的 QSL/QFAPI 正式版构件**——注册与事件一律用 Vanilla `Registry.register` 或同版 Fabric API；本目录出现的 QSL API 表是源码树考据，**禁止当可编译 API 生成代码**。

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Quilt |
| Minecraft | 1.21.1 |
| Java | **Java 21** |
| Gradle | Quilt Loom（`id 'org.quiltmc.loom'`） |
| Mappings | Yarn / intermediary（与 Fabric 同层） |
| 元数据 | `quilt.mod.json`（`quilt_loader.id`） |
| 注册 | Vanilla `Registry.register` 或同版 Fabric API；**1.21.1 无可用 QSL/QFAPI 正式版构件（maven 实证，截至 2026-09-04）**（见顶部横幅），禁止生成 QSL API 当可用依赖 |

库 Skill：仍按 `fabric-only` + `all-platforms` 读 `knowledge/libs/`。

### 本规则集的 IDE 加载优先级

| AI 助手 | 读取路径 |
|---------|---------|
| Cursor | `.cursor/rules/*.mdc` + `.cursor/skills/` |
| OpenCode / Codex / ZCode | `AGENTS.md` |
| Pi | `.pi/rules/*.md`（+ `AGENTS.md`） |

当上述路径不存在时，降级读取本文件和 `.cursor/`。


## 规则文件

| 编号 | 本目录 | 说明 |
|------|--------|------|
| 00 | `00-project-setup.mdc` | Quilt Loom / quilt.mod.json |
| 01 | `01-registry.mdc` | QSL vs FAPI Registry（必读） |
| 05 | `05-events.mdc` | 仅 QSL 分叉 |
| 06 | `06-networking.mdc` | QSL ≠ FAPI；QFAPI 才对照 FAPI 网络 |
| 02–04, 07–08, 10 | overlay fabric | session 注入同版 Fabric（含缺的 09） |

`query_api` 仅当 1.21.1 落在 Parchment 窗口（约 1.16.5–1.20.4）。平台 API 用 `search_docs({platform:"quilt", version:"1.21.1"})`。QSL 专用查询禁止把 Fabric Registry 当命中。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 发布 / 反编译研究）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill + `search_*_docs`，不要先调工作流。

- 汉化：`localize_mod`（diff / draft_zh / jar extract / pack_draft；无机器翻译）。
- 崩溃分诊：`crash_analyze`。
- 发布：`mc-publish` 工作流 + `check_publish_ready`；不代跑 Gradle、不拷 jar、不上传。
- 写盘 / Gradle / 拷 jar / 上传均须用户确认（人在环）。
