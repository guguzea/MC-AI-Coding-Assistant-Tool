---
name: mc-networking
description: Fabric 1.14.4 网络。ClientSidePacketRegistry、ServerSidePacketRegistry、PacketByteBuf。触发词：网络、Networking、PacketByteBuf、ClientSidePacketRegistry
platform: fabric
version: "1.14.4"
dependencies: []
mappings: yarn
---

# 网络通信（Fabric 1.14.4）

默认用 networking **v0**（`net.fabricmc.fabric.api.network`）。
[FAPI javadoc](https://maven.fabricmc.net/docs/fabric-api-0.74.1+1.19.4/net/fabricmc/fabric/api/network/ClientSidePacketRegistry.html)：
客户端 registry **接收 S2C**、**发送 C2S**；服务端 registry **接收 C2S**、**发送 S2C**。
不要抄 Skill 旧稿里对调的 `register`，也不要用 `ServerPlayNetworking` / `packetContext.queue()` / `PacketByteBuf.createUnpooled()`。

## 快速开始

```java
public static final Identifier MY_PACKET_ID = new Identifier(MOD_ID, "my_packet");

// C2S：服务端接收
public static void registerServerReceivers() {
    ServerSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, (packetContext, buf) -> {
        int value = buf.readInt();
        packetContext.getTaskQueue().execute(() -> {
            PlayerEntity player = packetContext.getPlayer();
        });
    });
}

// S2C：客户端接收
public static void registerClientReceivers() {
    ClientSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, (packetContext, buf) -> {
        packetContext.getTaskQueue().execute(() -> {
        });
    });
}
```

## Decision: 选择通信方向

```
IF 客户端 → 服务端
  → ServerSidePacketRegistry.register（收）+ ClientSidePacketRegistry.sendToServer（发）

IF 服务端 → 客户端
  → ClientSidePacketRegistry.register（收）+ ServerSidePacketRegistry.sendToPlayer（发）

IF 需要双向
  → 两端分别注册，不要混用 networking.v1
```

## 发送数据包

```java
PacketByteBuf buf = new PacketByteBuf(Unpooled.buffer());
buf.writeInt(value);
ServerSidePacketRegistry.INSTANCE.sendToPlayer(player, MY_PACKET_ID, buf);
ClientSidePacketRegistry.INSTANCE.sendToServer(MY_PACKET_ID, buf);
```

## 常见错误

- ❌ C2S 接收写在 `ClientSidePacketRegistry.register` — 那是 S2C
- ❌ `packetContext.queue()` — 用 `getTaskQueue().execute`
- ❌ `ServerPlayNetworking.send` / `PacketByteBuf.createUnpooled()`
- ❌ 忘记在 `ClientModInitializer` 注册 S2C
- ❌ 包 ID 两端不一致

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | 网络用于 GUI 数据同步 |
| `mc-entity` | 网络用于实体状态同步 |
