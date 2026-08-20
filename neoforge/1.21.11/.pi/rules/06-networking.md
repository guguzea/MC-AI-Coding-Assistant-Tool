---
description: 06 — 网络（NeoForge 1.21.11）
---

# 06 — 网络（NeoForge 1.21.11）

来源：https://docs.neoforged.net/docs/1.21.11/networking/payload/

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

禁止：`SimpleChannel`；把 1.21.5 的 `DirectionalPayloadHandler` 当本档双向注册；漏掉 `RegisterClientPayloadHandlersEvent`；把 1.20.4 的 RegisterPayloadHandlerEvent（单数）抄进本档；`NeoForgeAddonPlugin`。

1.21.11 文档已用 Identifier.fromNamespaceAndPath，不要再写 ResourceLocation.fromNamespaceAndPath。
