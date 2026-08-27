---
id: authored/forge-simplechannel-networking
title: Forge SimpleChannel 网络（≤1.20.4 主流写法）
tags: [networking, simplechannel, NetworkRegistry, registerMessage, enqueueWork, forge, 1.20.1]
summary: 1.8–1.20.4 的 SimpleChannel 全套路（**非 26.x**）：NetworkRegistry.newSimpleChannel；enqueueWork；S2C 用 DistExecutor.runWhenOn 隔离客户端类。26.x 改 FMLLoader.getDist() / client 源集，不要把 DistExecutor 当 26.x 首选。
mcHint: Forge 1.13–1.20.4（官方文档 1.20.1 版原文核对）；1.12 及以前是 SimpleNetworkWrapper
sourceKind: authored
---

# Forge SimpleChannel 网络写法

自写短文。依据本仓库已入库的 Forge 官方文档 `networking_simpleimpl`（**1.20.1** 档，`search_forge_docs` 可直接调取）。适用于 Forge **≤1.20.4**（**非 26.x**）。1.20.5+ / 26.x 请改用 Payload；物理端判断用 `FMLLoader.getDist()` 或 client 源集，不要把 DistExecutor 当 26.x 首选（见 `authored/neoforge-payload-networking` 的对照表）。

## 建 Channel：版本握手

```java
private static final String PROTOCOL_VERSION = "1";
public static final SimpleChannel INSTANCE = NetworkRegistry.newSimpleChannel(
    new ResourceLocation("mymodid", "main"),
    () -> PROTOCOL_VERSION,
    PROTOCOL_VERSION::equals,   // 客户端侧接受什么版本
    PROTOCOL_VERSION::equals);  // 服务端侧接受什么版本
```

- 包结构变化必须 bump 协议号，否则 FML 直接拒绝登录。
- 允许对端没有本 mod 时，谓词要放行两个元版本：`NetworkRegistry.ABSENT`（对端有 Forge 但没装你）、`ACCEPTVANILLA`（对端是原版端）。这两个值还影响多人列表里的绿勾红叉。

## 注册消息：registerMessage 五参数

```java
int id = 0;
INSTANCE.registerMessage(id++, MyServerboundMsg.class,
    MyServerboundMsg::encode,                    // BiConsumer<MSG, FriendlyByteBuf>
    MyServerboundMsg::decode,                    // Function<FriendlyByteBuf, MSG>
    MyServerboundMsg::handle);                   // BiConsumer<MSG, Supplier<NetworkEvent.Context>>
// S2C 再传 Optional.<NetworkEvent.RegisterPayloadHandler>... 或方向标记的重载（按档确认）
```

- **discriminator 用局部变量自增**保证 channel 内唯一且顺序稳定——顺序变了旧客户端就解错包。
- 消息类保持不可变 POJO；encode/decode 字段顺序必须对称。

## Handler：线程与防御

```java
public static void handle(MyServerboundMsg msg, Supplier<NetworkEvent.Context> ctx) {
    ctx.get().enqueueWork(() -> {                // 从网络线程切回主线程！
        ServerPlayer sender = ctx.get().getSender();
        // 校验：距离/权限/冷却，禁止信任客户端参数
    });
    ctx.get().setPacketHandled(true);            // 不设会当未处理报错
}
```

- **1.8+ 默认在网络线程执行 handler**，直接碰 level/实体就是经典偶发崩溃源——一律 enqueueWork。
- 服务端 handler 必须重新校验一切（文档特别点名：任意区块生成漏洞就是这么来的——不要对客户端传来的坐标无脑 generate/加载）。

## S2C：隔离客户端类

```java
// 公共 handler 里
ctx.get().enqueueWork(() ->
    DistExecutor.runWhenOn(Dist.CLIENT, () -> () -> ClientPacketHandler.handlePacket(msg, ctx))); // ≤1.20.4；26.x 用 FMLLoader.getDist() / client 源集
ctx.get().setPacketHandled(true);
```

S2C 的处理逻辑放独立 client-only 类，避免专用服加载 `net.minecraft.client.*` 崩溃。发送侧常用值：

| 场景 | API |
|------|-----|
| 发给单个玩家 | `INSTANCE.send(PacketDistributor.PLAYER.with(() -> serverPlayer), msg)` |
| 广播 | `PacketDistributor.ALL.noArg()` |
| 追踪某实体的玩家 | `PacketDistributor.TRACKING_ENTITY.with(() -> entity)` |
| 发给服务端 | `INSTANCE.sendToServer(msg)` |

## 与 1.20.5+/NeoForge 对照速记

| SimpleChannel | Payload 新体系 |
|---------------|----------------|
| channel + discriminator int | 全局 TYPE（Identifier），无 channel |
| 手写 encode/decode 方法 | record + StreamCodec.composite |
| registerMessage | RegisterPayloadHandlersEvent + playToServer/playToClient |
| enqueueWork | executesOn(MAIN) 或 enqueueWork |
| 协议字符串谓词 | registrar("1") 版本号 |

## 自检

- 单人/集成服/专用服三态互通；故意不 bump 版本验证被拒登录的文案。
- 高频包压测看主线程 tick 是否稳定（enqueueWork 不是免费的）。
- 无 mod 的原版客户端连接时按 ABSENT/ACCEPTVANILLA 谓词行为符合预期。

## 不清楚时

- 本仓库官方文档：`search_forge_docs`（`get_forge_doc_full --version=1.20.1 --id=1.20.1/networking_simpleimpl`）
- 新体系对照：`authored/neoforge-payload-networking`
- 1.12 以前用 `SimpleNetworkWrapper`（同思路，签名更老），见 `authored/legacy-forge-1.7.10-1.12.2-practices`
