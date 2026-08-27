---
name: mc-networking
description: NeoForge 1.21.1 mc-networking。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.1"
dependencies: []
mappings: mojmap
---

# mc-networking（NeoForge 1.21.1）

> 本档为**主档 neoforge 根下的子档**；主档同题 skill（neoforge 根 `mc-networking`）是 Payload 时代完整稿，本档给 1.21.1 入口快照；差异一律以本档 `search_neoforge_docs`（platform=neoforge, version=1.21.1）为准。**本档不是 Forge SimpleChannel。** 1.21.1 起事件名是**复数** `RegisterPayloadHandlersEvent`。

## 入口（已核实：页 id `networking_payload`）

payload = `CustomPacketPayload.Type` + `StreamCodec` + 处理器，三者缺一不可；发送走 `PacketDistributor`。

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
    // 默认主线程；若 registrar.executesOn(HandlerThread.NETWORK) 则用 context.enqueueWork 回主线程
}
```

- `registrar("1")`：设定当前网络版本。
- 阶段：`play*`；`configuration*`（配置阶段）/ `common*`（配置 + play 同时）同规则。
- 方向：`*Bidirectional`（`DirectionalPayloadHandler` 分侧处理）/ `*ToClient` / `*ToServer`。
- 线程：处理器默认主线程；`executesOn(HandlerThread.NETWORK)` 切网络线程——**配置方法返回新实例，用 `registrar = registrar.executesOn(...)` 接住**。
- 发送：`PacketDistributor.sendToServer` / `sendToPlayer` / `sendToPlayersTrackingChunk` / `sendToAllPlayers`（页 id `networking_payload` 已核实）。
- 尺寸：clientbound ≤ 1 MiB；serverbound < 32 KiB（已核实）。

## 已核实页清单（1.21.1 树）

| 页 id | URL | 覆盖 |
|-------|-----|------|
| `networking` | https://docs.neoforged.net/docs/1.21.1/networking/ | 总览与目标 |
| `networking_payload` | https://docs.neoforged.net/docs/1.21.1/networking/payload/ | 自定义 payload、注册、发送、线程 |
| `networking_streamcodecs` | https://docs.neoforged.net/docs/1.21.1/networking/streamcodecs/ | `ByteBufCodecs` / `composite` / 集合 / 注册表对象 |
| `networking_configuration_tasks` | https://docs.neoforged.net/docs/1.21.1/networking/configuration-tasks/ | `RegisterConfigurationTasksEvent` / `ICustomConfigurationTask` / ack |

配置阶段要点（已核实）：`ICustomConfigurationTask`（`run(Consumer<CustomPacketPayload> sender)` + `type()`）；捕获 listener 用 `finishCurrentTask` 直接确认，或客户端 `context.reply(ackPayload)` 后服务端 `context.finishCurrentTask(type)`；**不确认则登录被卡死**。

## 边界（写进本档即错 / 需注）

- `SimpleChannel` / `IMessage` / `NetworkRegistry.newSimpleChannel` — 禁
- 1.20.4 单数 `RegisterPayloadHandlerEvent` 抄进 1.21.1 — 禁；`NeoForgeAddonPlugin` — 禁
- 本档用 `ResourceLocation.fromNamespaceAndPath`，不是 `new ResourceLocation`，也不是 `Identifier`。
- Java 21 / mojmap；1.21.1 专属 API 异动以本档 `search_neoforge_docs` 为准，禁止从 Forge 或邻档复制。
