---
id: authored/neoforge-payload-networking
title: NeoForge 自定义网络包（CustomPacketPayload / PayloadRegistrar）
tags: [networking, payload, streamcodec, custompacketworkpayload, RegisterPayloadHandlersEvent, neoforge]
summary: 1.20.5+/26.x 包写法：record 实现 CustomPacketPayload + TYPE + StreamCodec.composite；RegisterPayloadHandlersEvent 注册 playToServer/playToClient 与版本号；IPayloadContext 处理端与 enqueueWork；与旧 SimpleChannel 的关系。
mcHint: NeoForge 1.20.5+（26.X 课程源码核实）
sourceKind: authored
---

# NeoForge 自定义网络包（Payload 写法）

自写短文。代码依据 Kaupenjoe NeoForge 26.X 课程分支 `30-networking-c2s`（MIT）逐行核对；概念与官方文档 networking/payload 章一致。

## 三件套：record + TYPE + STREAM_CODEC

```java
public record TestPacketC2S(String name, int value) implements CustomPacketPayload {
    public static final Type<TestPacketC2S> TYPE =
        new Type<>(Identifier.fromNamespaceAndPath(MOD_ID, "test_packet"));

    public static final StreamCodec<RegistryFriendlyByteBuf, TestPacketC2S> STREAM_CODEC =
        StreamCodec.composite(
            ByteBufCodecs.STRING_UTF8, TestPacketC2S::name,
            ByteBufCodecs.VAR_INT,     TestPacketC2S::value,
            TestPacketC2S::new);

    @Override public Type<? extends CustomPacketPayload> type() { return TYPE; }
}
```

- **方向命名**：`C2S`（客户端→服务端，serverbound）/ `S2C`（服务端→客户端，clientbound）后缀是社区惯例。
- 常用 `ByteBufCodecs`：`STRING_UTF8`、`VAR_INT`、`INT`、`BOOL`、`BYTE_BUF`（透传）、registry 化对象用 `ByteBufCodecs.registryCodec(...)` 或 `ResourceLocation` 配对。
- `composite` 最多约 6 个字段；更多字段用 `StreamCodec.ofMember` 手写 encode/decode。
- 需要 registry 对象（Item/Block 等）上下文的包用 `RegistryFriendlyByteBuf`；否则用 `FriendlyByteBuf`。

## 注册：RegisterPayloadHandlersEvent

```java
@SubscribeEvent
public static void registerPayloads(RegisterPayloadHandlersEvent event) {
    PayloadRegistrar registrar = event.registrar("1");   // 协议版本号，改包结构时 bump
    registrar.playToServer(TestPacketC2S.TYPE, TestPacketC2S.STREAM_CODEC, ServerboundPackets::handleTestPacket);
    // S2C：registrar.playToClient(MyS2CPacket.TYPE, MyS2CPacket.STREAM_CODEC, ClientPayloadHandler::handle);
    // 双向：registrar.playBidirectional(...)
}
```

- 这是**游戏总线事件**（`@EventBusSubscriber` 默认总线即可），不是 mod 总线。
- `registrar("1")` 的版本字符串参与握手兼容判断：字段增删必须 bump，否则旧客户端/服务端互连会被断开或告警。
- 可选链式配置：`.optional()`（对端不认识该包时不炸，用于软依赖场景）、`executesOn(...)` 指定网络线程/主线程。

## handler：注意线程

```java
// 服务端侧
public static void handleTestPacket(TestPacketC2S pkt, IPayloadContext context) {
    Player player = context.player();          // 已按方向解析成 ServerPlayer/LocalPlayer
    ServerLevel level = (ServerLevel) player.level();
    EntityType.COW.spawn(level, player.getOnPos(), EntitySpawnReason.TRIGGERED);   // 世界操作示例
    player.sendSystemMessage(Component.literal(pkt.name() + " said " + pkt.value()));
}
```

- `context.player()` 在 C2S 返回 ServerPlayer、在 S2C 返回 LocalPlayer——**同一个类按物理端判型**，不要 instanceof 客户端类。
- 改世界/开容器等**必须在主线程**：注册时用 `executesOn(NetworkHandler.Phase.MAIN)`，或 handler 里 `context.enqueueWork(() -> {...})`。直接在网络线程改 level 是经典崩溃源。
- `context.flow()` 判断包方向；`context.connection()` 拿连接做定向回包。

## 与旧版对照（1.20.1 SimpleChannel）

| 旧（≤1.20.1） | 新（1.20.5+） |
|---------------|---------------|
| `SimpleChannel` + `NetworkRegistry.newSimpleChannel` | 无 channel 概念，全局 payload 注册表 |
| `registerMessage(id, class, encode, decode, handler)` | record 自带 TYPE+STREAM_CODEC |
| `channel.sendToServer(packet)` | `PacketDistributor.sendToServer(pkt)` |
| `.sendToPlayer(pkt, player)` | `PacketDistributor.sendToPlayer(serverPlayer, pkt)` / `sendToAllPlayers` |
| 手写 `INSTANCE` 单例 encode/decode | `StreamCodec.composite` 声明式 |

迁移时保留「包不可变 record」思路即可；协议版本号替代了旧 channel version 字符串。

## 反模式

- ❌ handler 里直接 new 客户端 Screen 类（S2C handler 必须隔离在 client-only 类，用 DistExecutor/单独类加载保护）。
- ❌ 包字段塞大 NBT 整包库存同步；大数据走 Chunk/Batch 分帧或让原版容器同步机制处理。
- ❌ 用网络包做「远程方法调用」无校验：服务端 handler 必须重新验证位置/权限/冷却，禁止信任客户端参数。

## 自检

- 单人 + 集成服 + 专用服三态各连一次；故意不 bump 版本号验证握手报错文案。
- 主线程断点确认 handler 跑在期望的 phase。
- 客户端缺该 mod 时（optional 包）连接不被踢。

## 不清楚时

- 教程源码（分支 `30-networking-c2s`、`33-networking-s2c`，MIT）：https://github.com/Tutorials-By-Kaupenjoe/NeoForge-Course-26.X
- 官方文档：https://docs.neoforged.net/docs/networking/ （payload / streamcodecs 子页）
- API 细节：`search_neoforge_docs`（关键词 networking, payload）；本仓库规则 `06-networking`
