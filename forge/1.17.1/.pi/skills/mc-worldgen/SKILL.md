---
name: mc-worldgen
description: configured/placed feature、biome modifier。触发词：worldgen、placed_feature
platform: forge
version: "1.17.1"
dependencies: []
mappings: official
---

> ⚠️ **W5-2 裁定（2026-09-19）**：本仓 07 规则正文未核实 worldgen（全树 0 个 worldgen token），本技能**不含已核实签名**——一律改口 `search_forge_docs` / `search_neoforge_docs` / `search_fabric_docs`（worldgen_* 页，如 neoforge_1.21.10 的 `worldgen_biomemodifier.md`）核实后再写；禁止把本技能当已核实 API 白名单。

# mc-worldgen

> Wave D 技能骨架（forge 1.17.1）。详细规则见对应 `.cursor/rules/` 与 MCP `search_forge_docs` / 专题工具。

## 快速入口

- 注册与生命周期：`mc-registry`、`01-registry.mdc`
- 数据与资源：`mc-datagen`、`mc-datapack`、`generate_*` MCP 工具
- 反模式：`forge/1.17.1/knowledge/antipatterns/`

## 下一步

根据任务打开官方文档全文（`get_doc_full`）或社区短文（遵守 `community_knowledge/AGENT_USAGE.md`）。
