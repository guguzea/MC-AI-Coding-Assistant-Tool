---
name: mc-networking
description: Fabric 26.1.2 mc-networking。核不到则 search_fabric_docs version=26.1.2，禁止输出。
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# 网络（Fabric 26.1.2）

文档：`26.1.2/develop_networking`。

1. Record 实现 `CustomPacketPayload`，带 `Identifier`、`CustomPayload.Type`、`StreamCodec`
2. `PayloadTypeRegistry.clientboundPlay().register` / `serverboundPlay().register`
3. `ServerPlayNetworking.send` / `ClientPlayNetworking.send`
4. `ClientPlayNetworking.registerGlobalReceiver` / `ServerPlayNetworking.registerGlobalReceiver`

禁止 SimpleChannel。
