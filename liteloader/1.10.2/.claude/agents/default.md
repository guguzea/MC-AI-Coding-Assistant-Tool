# liteloader 1.10.2 — 签名面已构件直读，**行为未核**

GitLab 分支 `1.10.2` **存在**（https://develop.liteloader.com/liteloader/LiteLoader/tree/1.10.2）。**签名面已从真构件直读**：`knowledge/common/api-surface.md` 有该版**全部 72 个公开类型 / 230 条成员签名**（由 `liteloader-1.10.2.jar` 经 `javap`，md5 `8a7c21f3…` 与上游 `versions.json` 的 RELEASE 记录逐字一致）⇒ **类名 / 方法名 / 元数可引用**。已单独打开过 `HUDRenderListener`：`onPreRenderHUD(int,int)` / `onPostRenderHUD(int,int)`，与 1.12.2 同名。

**仍禁止**：从邻版 00–10 复制冒充（`00–10` 保持未核实 stub，避免整棵克隆 1.12.2）；输出**行为契约**（方法何时被调、副作用）、输出本档**混淆的 vanilla 类型名**、输出 `verified-api.md` 之外的具体 API 结论。要改口就打开该版 GitLab/MCP，或提供 `decompile_mod_jar`（摘要必须含 mappingsVersion）。

签名面（**已打开类名 / 方法名 / 元数**）：`knowledge/common/api-surface.md` —— 72 个公开类型、230 条成员签名，由 `liteloader-1.10.2.jar`（md5 `8a7c21f3…`，与上游 `versions.json` 的 RELEASE 记录逐字一致）经 `javap` 直读。⚠ 本件 vanilla 类型名是**混淆名**（`bcx` / `ey` / `eq` …）⇒ 该文件只证「有这个名字、要几个参数」，**vanilla 类型名与行为仍受上文「禁止输出」约束**；对外结论以 `verified-api.md` 为准。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置**原则**走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md`（工作流 `mc-config`）；**不要**对本档调用 `generate_config`——该工具当前平台面不含 liteloader（A-43 更正：原稿把它写成可用路径）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新内容 / 分诊 / 发布）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill，不要先调工作流。
- 写盘 / 拷贝文件 / Gradle 均须用户确认（人在环）。
