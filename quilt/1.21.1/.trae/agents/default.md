# Quilt 1.21.1 — Agent 总纲

> 本规则集适用于 **Quilt 1.21.1**。检测 `quilt.mod.json` 或 `org.quiltmc.loom`（可同时有 `fabric.mod.json`）。
> **必须再读** `fabric/1.21.1/.cursor/rules/` 的 **02–04、07–08、10**（及缺的 09）。05/06 用本目录，不要 overlay Fabric 网络。
> 本目录只写 QSL / Quilt Loader **差异**（00 / 01 / 05 / 06）。禁止把整棵 Fabric 规则复制进来。

> ⚠️ **QSL 停更警告（2026-08 一手核实）**：QSL 已于 **2025-12 停更**（quiltmc.org FAQ，页面版本 2026-02-03，原文 "Quilt Standard Libraries … was discontinued in December 2025"）。Modrinth 全部 143 个发布中终版为 **2024-12-02 的 QFAPI 7.7.0 + QSL 6.3.0，仅 MC 1.20.1**；1.21 线只有 4 个 QSL 11.0.0-alpha 构建（最新 11.0.0-alpha.3+0.102.0-1.21）（止于 2024-08-12，仅 qsl_base + crash_info 模块）。**本版本（1.21.1）不存在任何可用 QSL/QFAPI 构件**——注册与事件一律用 Vanilla `Registry.register` 或同版 Fabric API；本目录出现的 QSL API 表是源码树考据，**禁止当可编译 API 生成代码**。

## 基本信息

| 项目 | 值 |
|------|-----|
| 平台 | Quilt |
| Minecraft | 1.21.1 |
| Java | **Java 21** |
| Gradle | Quilt Loom（`id 'org.quiltmc.loom'`） |
| Mappings | Yarn / intermediary（与 Fabric 同层） |
| 元数据 | `quilt.mod.json`（`quilt_loader.id`） |
| 注册 | Vanilla `Registry.register` 或同版 Fabric API；**QSL 已停更且 1.21.1 无可用构件**（见顶部横幅），禁止生成 QSL API 当可用依赖 |

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

