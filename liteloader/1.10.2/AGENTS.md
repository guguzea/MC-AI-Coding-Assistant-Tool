# liteloader 1.10.2 — 未核实

GitLab 分支 `1.10.2` **存在**（http://develop.liteloader.com/liteloader/LiteLoader/tree/1.10.2）。已打开该分支 `HUDRenderListener`：`onPreRenderHUD(int,int)` / `onPostRenderHUD(int,int)`，与 1.12.2 同名。**其余接口未在本树打开**，00–10 保持未核实 stub，避免整棵克隆 1.12.2。

**禁止**从邻版 00–10 复制冒充。源码/MCP named 未逐方法打开前：**禁止输出具体 API**。改口打开该版 GitLab/MCP 或提供 `decompile_mod_jar`（摘要必须含 mappingsVersion）。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新内容 / 分诊 / 发布）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill，不要先调工作流。
- 写盘 / 拷贝文件 / Gradle 均须用户确认（人在环）。
