---
name: mc-worldgen
description: NeoForge 1.20.4 mc-worldgen。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.20.4"
dependencies: []
mappings: mojmap
---

> ⚠️ **W5-2 裁定（2026-09-19）**：本仓 07 规则正文未核实 worldgen（全树 0 个 worldgen token），本技能**不含已核实签名**——一律改口 `search_forge_docs` / `search_neoforge_docs` / `search_fabric_docs`（worldgen_* 页，如 neoforge_1.21.10 的 `worldgen_biomemodifier.md`）核实后再写；禁止把本技能当已核实 API 白名单。

# mc-worldgen（NeoForge 1.20.4）

Java 17。资源 id 类型：`ResourceLocation`。禁止从扁平 neoforge/.agents/skills 或邻档复制旧 API。

文档入口常见 id：worldgen/biomemodifier（以该版 l0 为准）。

网络不要用 SimpleChannel。payload 事件：RegisterPayloadHandlerEvent（以该版 networking 页为准）。核不到则 search_neoforge_docs version=1.20.4，禁止输出。
