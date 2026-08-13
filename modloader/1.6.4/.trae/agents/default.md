# Risugami's ModLoader 1.6.4 — Agent 总纲

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

