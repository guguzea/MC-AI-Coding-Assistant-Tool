# liteloader 1.8.9 — 未核实

GitLab 分支 `1.8.9` **存在**。已打开 `HUDRenderListener` 方法名与 1.12.2 相同。其余未打开 → stub；`knowledge/common/verified-api.md` 的构件 javap 表内 9 类接口可引用。禁止把 1.12.2 整树复制过来。

**禁止**从邻版 00–10 复制冒充。源码/MCP named 未逐方法打开前：**禁止输出具体 API**。改口打开该版 GitLab/MCP 或提供 `decompile_mod_jar`（摘要必须含 mappingsVersion）。

签名面（**已打开类名 / 方法名 / 元数**）：`knowledge/common/api-surface.md` —— 70 个公开类型、209 条成员签名，由 `liteloader-1.8.9-20160414.153538-10.jar`（md5 `12cbdc8c…`，与本档 `verified-api.md` 登记值逐字一致）经 `javap` 直读；本件 MCP 可读。该文件仍**不是**可对外输出的已核实名单，对外结论以 `verified-api.md` 为准。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置**原则**走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md`（工作流 `mc-config`）；**不要**对本档调用 `generate_config`——该工具当前平台面不含 LiteLoader / Rift / ModLoader（A-43 更正：原稿把它写成可用路径）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新内容 / 分诊 / 发布）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill，不要先调工作流。
- 写盘 / 拷贝文件 / Gradle 均须用户确认（人在环）。
