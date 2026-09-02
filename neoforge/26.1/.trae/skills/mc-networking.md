---
name: mc-networking
description: NeoForge 26.1 mc-networking。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "26.1"
dependencies: []
mappings: mojmap
---

# mc-networking（NeoForge 26.1）

禁止从 Forge 或邻档复制。26.1 是独立档：Java 25、去混淆、ModContainer 构造参数。26.2 不是「未发布」：maven 26.2 线已构建到 26.2.0.75（2026-09-02 实读 maven.neoforged.net），官方 Primer 也有 26.2 迁移页（/primer/docs/26.2/ 返回 200，本仓已入库 data/neoforge_primers/26.2.md）。但官方主文档站不按版本分线——/docs/26.2/ 与 /docs/26.1/ 同样 404，现行主文档是未版本化的 /docs/；本仓也没有 26.2 规则树与主文档语料，禁止把本档克隆成 26.2。

# 06 — 网络（NeoForge 26.1）

来源：https://docs.neoforged.net/docs/networking/payload/

**本档不是 Forge SimpleChannel，也不是 1.21.5 的 `DirectionalPayloadHandler` 双向注册。**

双向包拆成两边：
- 公共：`RegisterPayloadHandlersEvent` 里 `registrar.playBidirectional(TYPE, STREAM_CODEC, ServerPayloadHandler::handleDataOnMain)`（只传服务端 handler）
- 物理客户端：`RegisterClientPayloadHandlersEvent` 里 `event.register(MyData.TYPE, ClientPayloadHandler::handleDataOnMain)`

TYPE 用 `Identifier.fromNamespaceAndPath`。默认主线程；网络线程：服务端侧 `registrar.executesOn(HandlerThread.NETWORK)`（必须接住返回值）；客户端侧 `event.register(TYPE, HandlerThread.NETWORK, handler)`。

```java
public record MyData(String name, int age) implements CustomPacketPayload {
    public static final CustomPacketPayload.Type<MyData> TYPE =
        new CustomPacketPayload.Type<>(Identifier.fromNamespaceAndPath("mymod", "my_data"));
    public static final StreamCodec<ByteBuf, MyData> STREAM_CODEC = StreamCodec.composite(
        ByteBufCodecs.STRING_UTF8, MyData::name,
        ByteBufCodecs.VAR_INT, MyData::age,
        MyData::new);
    @Override
    public CustomPacketPayload.Type<? extends CustomPacketPayload> type() { return TYPE; }
}
```

发送：客户端 **`ClientPacketDistributor.sendToServer`**（不是 `PacketDistributor.sendToServer`）。服务端仍用 `PacketDistributor.sendToPlayer` / `sendToPlayersTrackingChunk` / `sendToAllPlayers`。

禁止：`SimpleChannel`；把 1.21.5 的 `DirectionalPayloadHandler` 当本档双向注册；漏掉 `RegisterClientPayloadHandlersEvent`。

26.1 去混淆 + Identifier。禁止 Yarn。query_api 无本版索引。

触发词：Payload、CustomPacketPayload、RegisterClientPayloadHandlersEvent、ClientPacketDistributor。禁止 SimpleChannel。
