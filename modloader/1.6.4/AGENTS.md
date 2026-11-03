# Risugami's ModLoader 1.6.4 — Agent 总纲

> ⚠️ **历史背景**：Risugami 自 MC 1.6.2（2013 年）起停止更新 ModLoader，**1.6.4 无官方 ModLoader 发布物**。本档基于公开 API + MCP 1.6.4 named 整理，仅供维护既有 1.6.4 整合/魔改包；新工程请用 Forge。
>
> **「无官方发布物」的实物读数（2026-11-02 复核）**：本机留档 `F:\MC_GAME\_oracle-jars\modloader\` 里**只有三个 zip** —— `ModLoader-1.2.5.zip`(103 347 B) / `ModLoader-1.5.2.zip`(199 825 B) / `ModLoader-1.6.2.zip`(182 824 B)，**没有 1.6.4**；mcarchive 的官方版本清单最新也只到 1.6.2。⇒ 本档（1.6.4）的一切构件级结论**都借自 1.6.2 件**，引用时必须写明「按 1.6.2 件」。
>
> ⚠ **混淆名必须逐档取，不许跨档搬**（2026-11-02 实测）：`ats` 在 **1.6.2** 是 `Minecraft`，但在 **1.6.4** 的 srg 里 `ats`=`KeyBinding`、`atv`=`Minecraft` —— **同名不同物**。详见 [knowledge/common/safe-api.md](knowledge/common/safe-api.md) 文末「勘误」。

工程形态：**MCP + Eclipse**，通常无 Gradle。生成代码 **只能**用 [knowledge/common/safe-api.md](knowledge/common/safe-api.md) 内的名字。

- 表外名字 → 停止编造；返回「不在安全 API 表内」
- **不要**默认走 `get_minecraft_source` / 现场 MCP CSV
- `query_api` 禁用；不要用 Forge 1.7.10 Javadoc 冒充
- `diagnose_gradle` 对无 Gradle 工程拒绝

### 本规则集的 IDE 加载优先级

| AI 助手 | 读取路径 |
|---------|---------|
| Cursor | `.cursor/rules/*.mdc` + `.cursor/skills/` |
| OpenCode / Codex / ZCode | `AGENTS.md` |
| DSH | `AGENTS.md` + `.agents/skills/` |
| Pi | `.pi/rules/*.md`（+ `AGENTS.md`） |

当上述路径不存在时，降级读取本文件和 `.cursor/`。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置**原则**走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md`（工作流 `mc-config`）；**不要**对本档调用 `generate_config`——该工具当前平台面不含 LiteLoader / Rift / ModLoader（A-43 更正：原稿把它写成可用路径）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

<!-- MC_SKILL_WORKFLOW_NOTE -->

## 工作流提醒（人在环）

完整流程（从零建工程 / 完整新内容 / 分诊 / 发布）才调 `get_workflow_template`；改已有代码、补方法、查文档走规则 + Skill，不要先调工作流。
- 写盘 / 拷贝文件 / Gradle 均须用户确认（人在环）。
