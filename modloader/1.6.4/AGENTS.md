# Risugami's ModLoader 1.6.4 — Agent 总纲

> ⚠️ **历史背景**：Risugami 自 MC 1.6.2（2013 年）起停止更新 ModLoader，**1.6.4 无官方 ModLoader 发布物**。本档基于公开 API + MCP 1.6.4 named 整理，仅供维护既有 1.6.4 整合/魔改包；新工程请用 Forge。

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
| Pi | `.pi/rules/*.md`（+ `AGENTS.md`） |

当上述路径不存在时，降级读取本文件和 `.cursor/`。

