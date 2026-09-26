# NeoForge 1.20.6 — Agent 总纲

> 只适用于 **NeoForge 1.20.6**。禁止读取邻档 00–10 或扁平 `neoforge/.cursor/rules` 来填本档类名。
> 文档工具用 `list_neoforge_versions` / `search_neoforge_docs`（version=1.20.6）。

## 基本信息

| 项 | 值 |
|---|---|
| 平台 | NeoForge 1.20.6 |
| Java | **21** |
| Mappings | mojmap |
| 入口 | `@Mod` + `public ExampleMod(IEventBus modEventBus)` |
| 元数据 | neoforge.mods.toml |
| 资源 id | `ResourceLocation` |
| 网络 | networking 页 Payload（本档该页正文逐字用复数 `RegisterPayloadHandlersEvent`，实测 verbatim:true；出处 `06-networking:5` / `06-networking:7`） |
| 文档 | https://docs.neoforged.net/docs/1.20.6/ |

类名必须能在 `knowledge/common/verified-api-1.20.6.md` 或 `search_neoforge_docs` 该版页面找到。

pack-status: ready

`generate_network_packet` **没有** `neoforge_1.20.6` 模板 —— 缺的是模板，不是文档页：实测 `search_neoforge_docs version=1.20.6 query=networking/payload` → `ok:true` / `total:10` / 首选 id `networking/payload` / `versionFallback:false`（本档**有** payload 页，签名清单见 `06-networking:7`）。该页正文逐字用复数 `RegisterPayloadHandlersEvent`（×3，逐字支撑 verbatim:true）；单数 `RegisterPayloadHandlerEvent` 在本档该页 verbatim:false ⇒ 本档事件名 = 复数。网络代码改口 `search_neoforge_docs` version=1.20.6 + 规则 06。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`。
<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新方块 / GUI / 崩溃分诊 / 移植 / 真机循环 / 汉化 / 发布 / 反编译研究）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill + `search_*_docs`，不要先调工作流。

- 汉化：`localize_mod`（diff / draft_zh / jar extract / pack_draft；无机器翻译）。
- 崩溃分诊：`crash_analyze`。
- 发布：`mc-publish` 工作流 + `check_publish_ready`；不代跑 Gradle、不拷 jar、不上传。
- 写盘 / Gradle / 拷 jar / 上传均须用户确认（人在环）。
