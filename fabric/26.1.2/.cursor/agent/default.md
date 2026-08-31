# Fabric 26.1.2 — Agent 总纲

> 文档 fallback 仅限查询 API，不代表规则树可用。
> 只适用于 **Minecraft / Fabric 26.1.2**。游戏已去混淆。
> **禁止**读取 `fabric/1.21.11/.cursor/rules` 或任何邻版 01–10。
> **禁止**把 `fabric-wiki` / 1.21.x wiki 当本版全文。
> 先 `list_fabric_versions`，再用 `search_fabric_docs`（version=26.1.2）。
> **查 API 分工**：`query_api` / `get_method_params` 对 26.1+ **无 Parchment 索引**（游戏已去混淆，直接用 **Mojang 官方名**）。`convert_mapping` **拒绝 Yarn**。Vanilla / Fabric API → `search_fabric_docs`（version=26.1.2）+ `query_loader_api` + IDE `genSources`；**勿**把 `query_api` 当 Yarn 或 Parchment 签名工具。

## 硬约束（来自入库文档，不是邻版记忆）

| 项 | 口径 | 文档 id |
|----|------|---------|
| 移植起点 | 入库 porting 是 **1.21.11 → 26.1** | `26.1.2/develop_porting_index` |
| 映射 | 去掉 `mappings` 依赖；用官方名 | 同上 |
| Java | **25**（porting：不要再用 21） | 同上 |
| Loom 插件 id | `id "net.fabricmc.fabric-loom"`（不要旧的 `id "fabric-loom"`） | 同上 |
| 依赖配置 | `implementation` / `compileOnly` / `api`，不要 `modImplementation` | 同上 |
| 任务名 | `jar` 取代 `remapJar` | 同上 |
| AW | header `named` → `official` | 同上 |
| 26.2 | 不要建 `data/fabric_26.2` 树；移植页旁路见 `search_fabric_docs` `porting/26.2` | 计划 2 |

线上 https://docs.fabricmc.net/develop/porting/index 当前可能是 26.1→26.2，与本树入库的 1.21.11→26.1 **不是同一页**。

## 规则文件

00–10 只引用 `data/fabric_26.1.2` 能核到的 id。核不到的编号是「未核实、禁止输出」stub，**不是缺文件**。

本档知识在 **rules + `search_fabric_docs`(version=26.1.2)**。`knowledge/` **有意为空**，禁止克隆 `fabric/1.21.11/knowledge`。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 发布 / 反编译研究）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill + `search_*_docs`，不要先调工作流。

- 汉化：`localize_mod`（diff / draft_zh / jar extract / pack_draft；无机器翻译）。
- 崩溃分诊：`crash_analyze`。
- 发布：`mc-publish` 工作流 + `check_publish_ready`；不代跑 Gradle、不拷 jar、不上传。
- 写盘 / Gradle / 拷 jar / 上传均须用户确认（人在环）。
