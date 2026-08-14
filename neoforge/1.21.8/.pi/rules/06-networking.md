---
description: 06 — 网络（NeoForge 1.21.8）
---

# 06 — 网络（NeoForge 1.21.8）

**本档不是 Forge SimpleChannel。** 1.21.8 的关键分界是 DataGen 拆成 GatherDataEvent.Client 与 Server，以及 createDatapackRegistryObjects / createProvider。

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
发送：PacketDistributor + CustomPacketPayload
来源：https://docs.neoforged.net/docs/1.21.8/networking/payload/

## 反面清单（写进本档即错）

- `SimpleChannel` / `IMessage` / `NetworkRegistry.newSimpleChannel`
- 顶层 `net.neoforged.neoforge.network.NetworkRegistry`（若存在 `NetworkRegistry` 也在 `.registration` 且多为 Internal）
- 把 1.20.4 的 RegisterPayloadHandlerEvent（单数） 抄进 NeoForge 1.21.8
- `NeoForgeAddonPlugin`

1.21.8 文档 resources 页已用 GatherDataEvent.Client；网络配置任务仍见 ResourceLocation.fromNamespaceAndPath。
