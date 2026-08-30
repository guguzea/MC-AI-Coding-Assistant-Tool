[DONOR_SKILL 禁止直接抄写]
本 Skill 正文为本地维护的结构/流程草稿，未经官方 API 核验（无外部捐入源版本：fabric/1.21.3 无同名技能；fabric/1.21.8 与 fabric/1.21.10 的同名 Skill 均由本档派生）。不得直接使用正文里的类名/方法。先 search_fabric_docs(version=1.21.4) 核对类名/方法签名（不要用 version=1.21.3），对不上就改口官方文档、禁止照抄。Yarn 档互捐，禁止把 26.1.2 mojmap 当本档。

---

---
name: mc-dimension
description: 自定义维度、DimensionType、传送与跨维度逻辑。触发词：dimension、DimensionType、teleport
platform: fabric
version: "1.21.4"
dependencies: []
mappings: yarn
---

# mc-dimension

> Wave D 技能骨架（fabric 1.21.4）。详细规则见对应 `.cursor/rules/` 与 MCP `search_fabric_docs` / 专题工具。

## 快速入口

- 世界生成：`mc-worldgen`、`mc-structure`
- 注册表 ID：`query_registry`（dimensions）
- 网络/同步：`mc-networking`、`generate_network_packet`

## 下一步

根据任务打开官方文档全文（`get_doc_full`）或社区短文（遵守 `community_knowledge/AGENT_USAGE.md`）。
