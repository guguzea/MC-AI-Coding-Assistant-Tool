# NeoForge 1.21.10 — Agent 总纲

> 只适用于 **NeoForge 1.21.10**。禁止读取邻档 00–10 或扁平 `neoforge/.cursor/rules` 来填本档类名。
> 文档工具用 `list_neoforge_versions` / `search_neoforge_docs`（version=1.21.10）。

## 基本信息

| 项 | 值 |
|---|---|
| 平台 | NeoForge 1.21.10 |
| Java | **21** |
| Mappings | mojmap |
| 入口 | `@Mod` + `public ExampleMod(IEventBus modEventBus)` |
| 元数据 | neoforge.mods.toml |
| 资源 id | `ResourceLocation` |
| 网络 | RegisterPayloadHandlersEvent + PayloadRegistrar（以 networking 页为准） |
| 文档 | https://docs.neoforged.net/docs/1.21.10/ |

类名必须能在 `knowledge/common/verified-api-1.21.10.md` 或 `search_neoforge_docs` 该版页面找到。

pack-status: ready

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 发布 / 反编译研究）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill + `search_*_docs`，不要先调工作流。

- 汉化：`localize_mod`（diff / draft_zh / jar extract / pack_draft；无机器翻译）。
- 崩溃分诊：`crash_analyze`。
- 发布：`mc-publish` 工作流 + `check_publish_ready`；不代跑 Gradle、不拷 jar、不上传。
- 写盘 / Gradle / 拷 jar / 上传均须用户确认（人在环）。
