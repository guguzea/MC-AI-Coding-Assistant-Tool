---
name: mc-networking
description: NeoForge 1.21.8 mc-networking。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.8"
dependencies: []
mappings: mojmap
---

# mc-networking（NeoForge 1.21.8）

禁止从 Forge 或邻档复制。

# 06 — 网络（NeoForge 1.21.8）

来源：https://docs.neoforged.net/docs/1.21.8/networking/payload/

**本档不是 Forge SimpleChannel，也不是 1.21.5 的 `DirectionalPayloadHandler` 双向注册。**

双向包拆成两边：
- 公共：`RegisterPayloadHandlersEvent` 里 `registrar.playBidirectional(TYPE, STREAM_CODEC, ServerPayloadHandler::handleDataOnMain)`（只传服务端 handler）
- 物理客户端：`RegisterClientPayloadHandlersEvent` 里 `event.register(MyData.TYPE, ClientPayloadHandler::handleDataOnMain)`

TYPE 用 `ResourceLocation.fromNamespaceAndPath`。默认主线程；网络线程：服务端侧 `registrar.executesOn(HandlerThread.NETWORK)`（必须接住返回值）；客户端侧 `event.register(TYPE, HandlerThread.NETWORK, handler)`。

```java
public record MyData(String name, int age) implements CustomPacketPayload {
    public static final CustomPacketPayload.Type<MyData> TYPE =
        new CustomPacketPayload.Type<>(ResourceLocation.fromNamespaceAndPath("mymod", "my_data"));
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

触发词：Payload、CustomPacketPayload、RegisterClientPayloadHandlersEvent、ClientPacketDistributor。禁止 SimpleChannel。
