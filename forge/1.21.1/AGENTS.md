# Forge 1.21.1 — 无教程树（draft）

本目录 **不是** 完整 00–10。`list_forge_versions` **不含** 1.21.1；`search_forge_docs version=1.21.1` 返回 VERSION_NOT_FOUND（当前仅到 1.20.4）。

改口：`list_forge_versions` 后再 `search_forge_docs`（不要假定 1.21.1 页）。**禁止**把 NeoForge 1.21.1 的 00–10 / DeferredHolder / PayloadHandlers 当 Forge 教程。
`detect_mod_project` / session 对本版规则树返回 `PACK_NOT_FOUND`。
不要用 1.20.4 规则改版本号冒充本档。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 发布 / 反编译研究）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill + `search_*_docs`，不要先调工作流。

- 汉化：`localize_mod`（diff / draft_zh / jar extract / pack_draft；无机器翻译）。
- 崩溃分诊：`crash_analyze`。
- 发布：`mc-publish` 工作流 + `check_publish_ready`；不代跑 Gradle、不拷 jar、不上传。
- 写盘 / Gradle / 拷 jar / 上传均须用户确认（人在环）。
