---
id: authored/fabric-networking-payloads
title: Fabric 网络包（CustomPacketPayload / PayloadTypeRegistry）
tags: [fabric, networking, payload, ServerPlayNetworking, ClientPlayNetworking, PacketCodec, PlayerLookup]
summary: Fabric 侧网络：record 实现 CustomPacketPayload（与 NeoForge 同构）；PayloadTypeRegistry 注册编解码；ServerPlayNetworking/ClientPlayNetworking 收发；PlayPayloadHandler 的 context.player().server 判端；PlayerLookup 按追踪发 S2C；服务端校验惯例。
mcHint: Fabric API ≥0.92 / MC 1.20.5+（官方文档当前版核对）；旧 ChannelBuf 风格见存档版文档
sourceKind: authored
---

# Fabric 网络包写法

自写短文。依据 Fabric 官方文档 `docs.fabricmc.net/develop/networking`（原文已核对）。1.20.5 起 Fabric 与 NeoForge 的包定义**共用原版的 CustomPacketPayload 抽象**，record 写法一致，差异在注册与收发入口。

## 定义 Payload（与 NeoForge 同构）

```java
public record SummonLightningPayload(Vec3 pos) implements CustomPacketPayload {
    public static final Type<SummonLightningPayload> TYPE =
        new Type<>(Identifier.fromNamespaceAndPath(MOD_ID, "summon_lightning"));

    public static final StreamCodec<RegistryFriendlyByteBuf, SummonLightningPayload> CODEC =
        StreamCodec.composite(
            BlockPos.STREAM_CODEC, p -> BlockPos.containing(p.pos()),   // 或自定 codec
            SummonLightningPayload::new);

    @Override public Type<? extends CustomPacketPayload> type() { return TYPE; }
}
```

## 注册编解码（common initializer）

```java
// C2S（clientbound play 不用管方向名——按流向选 registry）
PayloadTypeRegistry.serverboundPlay().register(MyC2SPayload.TYPE, MyC2SPayload.CODEC);
// S2C
PayloadTypeRegistry.clientboundPlay().register(MyS2CPayload.TYPE, MyS2CPayload.CODEC);
```

- 只注册**编解码器**；接收逻辑另走 receiver（见下）。
- 还有 `play` 之外的配置阶段 registry（login/config 包），常规玩法数据用 play 即可。

## 发送

```java
// C2S：客户端 → 服务端
ClientPlayNetworking.send(new GiveGlowingEffectServerboundPayload(entityId));

// S2C：服务端 → 客户端
ServerPlayNetworking.send(player, new ClientboundSummonLightningPayload(pos));
PlayerLookup.level((ServerLevel) level).forEach(p -> ServerPlayNetworking.send(p, payload)); // 广播给某维度全部玩家
```

- **S2C 用 `PlayerLookup` 按需发**：`tracking(entity)`、`trackingChunk(pos)`、`world(level)`——只发给需要知道的客户端，别无脑 ALL 广播。

## 接收

```java
// 服务端（common initializer）
ServerPlayNetworking.registerGlobalReceiver(GiveGlowingEffectServerboundPayload.TYPE, (payload, context) -> {
    ServerPlayer player = context.player();
    player.server.execute(() -> {                       // 回主线程
        Entity e = player.level().getEntity(payload.entityId());
        if (e instanceof LivingEntity living && living.closerThan(player, 5)) {  // 校验距离！
            living.addEffect(...);
        }
    });
});

// 客户端（client initializer）
ClientPlayNetworking.registerGlobalReceiver(ClientboundSummonLightningPayload.TYPE, (payload, context) -> {
    context.client().execute(() -> { /* 客户端世界操作 */ });
});
```

- receiver 在**网络线程**触发：动世界一律 `context.player().server.execute(...)` / `context.client().execute(...)` 回主线程。
- `context.player()` 两端都有（类型按物理端）；文档示例强调的防御要点：按 entityId 取实体后先判存在、判 LivingEntity、判距离。

## 版本注意

- 本篇是 **1.20.5+ 风格**。更老的 Fabric 教程用「字符串 channel + PacketByteBuf」风格（`ServerPlayNetworking.registerGlobalReceiver(channelString, ...)`），API 已换代——读老教程时按工程版本切 docs 左上角下拉对照。
- Yarn 工程里类名是 `net.fabricmc.fabric.api.networking.v1.*` + Yarn 命名（如 `PacketByteBuf`）；Mojmap 工程 buf 类名不同，抄码前确认 mappings。

## 自检

- 单人 + LAN 开放 + 专用服三态互通。
- C2S 传非法 entityId/超远坐标被拒（校验生效）。
- S2C 只有追踪该实体的玩家收到（抓包或日志确认）。

## 不清楚时

- 官方原文：https://docs.fabricmc.net/develop/networking （版本下拉切到工程精确版本）
- 对照 NeoForge 新体系：`authored/neoforge-payload-networking`
- API：`search_fabric_docs`
