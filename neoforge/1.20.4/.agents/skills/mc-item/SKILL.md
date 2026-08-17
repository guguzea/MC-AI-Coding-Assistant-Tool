---
name: mc-item
description: NeoForge 1.20.4 mc-item。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.20.4"
dependencies: []
mappings: mojmap
---

# mc-item（NeoForge 1.20.4）

Java 21。资源 id 类型：`ResourceLocation`。禁止从扁平 neoforge/.agents/skills 或邻档复制旧 API。

已核入口：`DeferredRegister.createItems/createBlocks`（search_neoforge_docs items/blocks，version=1.20.4）。

网络不要用 SimpleChannel。payload 事件：RegisterPayloadHandlerEvent（以该版 networking 页为准）。核不到则 search_neoforge_docs version=1.20.4，禁止输出。
