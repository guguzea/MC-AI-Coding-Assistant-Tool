---
name: mc-networking
description: NeoForge 1.21.10 mc-networking。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.10"
dependencies: []
mappings: mojmap
---

# mc-networking（NeoForge 1.21.10）

禁止从邻档复制。Java 21。`ResourceLocation`。

对照 `neoforge/1.21.10/knowledge/common/verified-api-1.21.10.md` 与 search_neoforge_docs version=1.21.10。
网络：`RegisterPayloadHandlersEvent`（服务端 handler）+ `RegisterClientPayloadHandlersEvent`；客户端发包 `ClientPacketDistributor.sendToServer`。禁止 SimpleChannel，禁止本档抄 `PacketDistributor.sendToServer`。
