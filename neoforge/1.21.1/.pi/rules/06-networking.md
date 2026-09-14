---
description: 06 — 网络（NeoForge 1.21.1）
---

# 06 — 网络（NeoForge 1.21.1）

**本档不是 Forge SimpleChannel。** 复数 Handlers 事件名的分界在 **1.20.5 / 1.20.6**，不是本档：本仓语料实测 1.20.4 仍是单数 `RegisterPayloadHandlerEvent`（`data/neoforge_1.20.4/neoforge-docs/1.20.4/processed/networking_payload.md:9`），1.20.6 已改复数 `RegisterPayloadHandlersEvent`（`data/neoforge_1.20.6/neoforge-docs/1.20.6/processed/networking_payload.md:9`，同页 :85 `registrar.playBidirectional(`）；本仓无 `data/neoforge_1.20.5` 主文档语料，故分界只钉到这一档距。本档 1.21.1 沿用复数形态。payload 用 CustomPacketPayload.Type + StreamCodec + playBidirectional/ToClient/ToServer。

## 核实骨架

```java
@SubscribeEvent // mod event bus
public static void register(final RegisterPayloadHandlersEvent event) {
    final PayloadRegistrar registrar = event.registrar("1");
    registrar.playBidirectional(
        MyData.TYPE,
        MyData.STREAM_CODEC,
        new DirectionalPayloadHandler<>(
            ClientPayloadHandler::handleDataOnMain,
            ServerPayloadHandler::handleDataOnMain));
}

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

public static void handleDataOnMain(final MyData data, final IPayloadContext context) {
    // 默认主线程；若 registrar.executesOn(HandlerThread.NETWORK) 则用 context.enqueueWork
}
```
发送：PacketDistributor.sendToServer / sendToPlayer / sendToPlayersTrackingChunk / sendToAllPlayers
来源：https://docs.neoforged.net/docs/1.21.1/networking/payload/

## 反面清单（写进本档即错）

- `SimpleChannel` / `IMessage` / `NetworkRegistry.newSimpleChannel`
- 顶层 `net.neoforged.neoforge.network.NetworkRegistry`（若存在 `NetworkRegistry` 也在 `.registration` 且多为 Internal）
- 把 1.20.4 的 RegisterPayloadHandlerEvent（单数） 抄进 NeoForge 1.21.1
- `NeoForgeAddonPlugin`

本档用 ResourceLocation.fromNamespaceAndPath，不是 new ResourceLocation，也不是 Identifier。
