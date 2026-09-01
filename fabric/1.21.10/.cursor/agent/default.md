# Fabric 1.21.10 — Agent 总纲

> 只适用于 **Fabric 1.21.10**。文档：search_fabric_docs version=1.21.10（先 list_fabric_versions）。**禁止**复制 `fabric/1.21.11` 或邻版 wiki。

| 项 | 值 |
|---|---|
| 平台 | Fabric 1.21.10 |
| Java | **21** |
| 文档 mappings 示例 | 官方名（creating-a-project 页）。工程若用 Yarn 须自行对照，禁止把 class_ 中间名当 API |
| 注册 | Registry.register（search_fabric_docs query=registry version=1.21.10） |
| 网络 | PayloadTypeRegistry + CustomPayload |

核实表：knowledge/common/verified-api-1.21.10.md。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 发布 / 反编译研究）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill + `search_*_docs`，不要先调工作流。

- 汉化：`localize_mod`（diff / draft_zh / jar extract / pack_draft；无机器翻译）。
- 崩溃分诊：`crash_analyze`。
- 发布：`mc-publish` 工作流 + `check_publish_ready`；不代跑 Gradle、不拷 jar、不上传。
- 写盘 / Gradle / 拷 jar / 上传均须用户确认（人在环）。
