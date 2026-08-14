---
name: mc-networking
description: NeoForge 26.1 mc-networking。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "26.1"
dependencies: []
mappings: mojmap
---

# mc-networking（NeoForge 26.1）

禁止从 Forge 或邻档复制。26.1 是独立档：Java 25、去混淆、ModContainer 构造参数、GatherDataEvent 拆分。官方 /docs/26.2/ 仍 404，禁止克隆本档冒充 26.2。

# 06 — 网络（NeoForge 26.1）

**本档不是 Forge SimpleChannel。** 26.1 是独立档：Java 25、去混淆、ModContainer 构造参数、GatherDataEvent 拆分。官方 /docs/26.2/ 仍 404，禁止克隆本档冒充 26.2。

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
        new CustomPacketPayload.Type<>(Identifier.fromNamespaceAndPath("mymod", "my_data"));
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
发送：PacketDistributor.sendTo*；HandlerThread.NETWORK + enqueueWork
来源：https://docs.neoforged.net/docs/networking/payload/

## 反面清单（写进本档即错）

- `SimpleChannel` / `IMessage` / `NetworkRegistry.newSimpleChannel`
- 顶层 `net.neoforged.neoforge.network.NetworkRegistry`（若存在 `NetworkRegistry` 也在 `.registration` 且多为 Internal）
- 把 1.20.4 的 RegisterPayloadHandlerEvent（单数） 抄进 NeoForge 26.1
- `NeoForgeAddonPlugin`

26.1 去混淆 + Identifier。禁止 Yarn。query_api 无本版索引。


触发词：Payload、CustomPacketPayload、PacketDistributor。禁止 SimpleChannel。
