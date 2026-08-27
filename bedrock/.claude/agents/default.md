# 基岩版 Add-On — Agent 总纲

与 Java 模组 **零共享**：无 Gradle、无 Mixin、无 `query_api`、无 Yarn。规则编号 **不是** Java 的 DeferredRegister 系列。

打开含 `manifest.json`（`format_version` + `modules`）的包 → 本目录。

| 编号 | 文件 | 主题 |
|------|------|------|
| 00 | 工程目录 RP/BP/SP（SP = 脚本包，manifest `script` 模块）、UUID、min_engine_version |
| 01 | manifest |
| 02 | 资源包 |
| 03 | 行为包 |
| 04 | 实体成对 |
| 05 | 方块/物品 JSON |
| 06 | Molang |
| 07 | Script API（实验开关分层） |
| 08 | 世界生成 JSON |
| 09 | 反模式 |
| 10 | 发布 mcpack |

文档：`search_bedrock_docs`（带 `docsStatus`）。`id` 必须来自搜索结果（如 `stable/custom-block`），不要用网站 URL 当 `get_bedrock_doc_full` 的 id。`diagnose_gradle` / `convert_mapping` / `query_api` / `mixin_analyze` / **`crash_analyze`（Java 向）** 必须拒绝并改口。content-log / `content_log.txt` 分诊用 **`analyze_bedrock_log`**，不要喂 Java 崩溃报告工具。

规则 00–10 在 `.cursor/rules/`（决策流 + 已核实 Learn 约束）。平台 Skill 在 `.cursor/skills/`；库 Skill 另见 `knowledge/libs/bedrock-only/`。禁止 CCA/Trinkets/GeckoLib。不要为本档新写 Java `mc-config`；基岩配置走 pack JSON / Script，不是 Cloth / ForgeConfigSpec。

### 本规则集的 IDE 加载优先级

| AI 助手 | 读取路径 |
|---------|---------|
| Cursor | `.cursor/rules/*.mdc` + `.cursor/skills/` |
| OpenCode / Codex / ZCode | `AGENTS.md` |
| Pi | `.pi/rules/*.md`（+ `AGENTS.md`） |

当上述路径不存在时，降级读取本文件和 `.cursor/`。

