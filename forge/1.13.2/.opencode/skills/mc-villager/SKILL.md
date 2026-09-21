---
name: mc-villager
description: 村民交易 VillagerTrades。触发词：villager、trade、POI
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# mc-villager

> Wave D 技能骨架（forge 1.13.2）。详细规则见对应 `.cursor/rules/` 与 MCP `search_forge_docs` / 专题工具。

### ⚠️ 映射口径：本档 = Forge 映射（Yarn 对照不适用）

本件仍是**技能骨架**（forge 1.13.2）。本档工程不走 Yarn 映射，因此本仓的 mojmap ↔ Yarn 对照表**对本件不适用**（不要把 Fabric 档的 Yarn 名当 Forge 名写）。本件触发词：`villager` / `trade`（小写主题词）。
本档 frontmatter 现声明 `mappings: mcp`。

- 本件触发词在本档语料 0 命中 = **该面在本档没有一手教程正文**（原因随主题与版本不同：能量/村民交易这类 Forge 官方教程本就不写，GameTest 这类是该版本还没有该系统）。需要签名时 `search_forge_docs version=1.13.2 query=…`，或用户自备 jar 走 `query_loader_api` / 反编译；0 命中就留 `// TODO(未核实)`。


## 快速入口

- 注册与生命周期：`mc-registry`、`01-registry.mdc`
- 数据与资源：`mc-datagen`、`mc-datapack`、`generate_*` MCP 工具
- 反模式：`forge/1.13.2/knowledge/antipatterns/`

## 下一步

根据任务打开官方文档全文（`get_doc_full`）或社区短文（遵守 `community_knowledge/AGENT_USAGE.md`）。
