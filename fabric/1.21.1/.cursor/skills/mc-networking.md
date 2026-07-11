---
name: mc-networking
description: Fabric 网络通信。FabricNetworkConstants、PacketByteBuf、ClientSidePacketRegistry。触发词：网络、Networking、PacketByteBuf、ServerPlayNetworking
platform: fabric
version: "1.21.1"
dependencies: []
mappings: yarn
---

# 网络通信（Fabric 1.21.1）

## 快速开始

```java
// 定义包 ID
public static final Identifier MY_PACKET_ID = new Identifier(MOD_ID, "my_packet");

// 服务端接收（客户端发送）
public static void registerServerReceivers() {
    ClientSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, (packetContext, buf) -> {
        packetContext.queue(() -> {
            int value = buf.readInt();
            PlayerEntity player = packetContext.getPlayer();
            // 处理
        });
    });
}

// 服务端发送（客户端接收）
public static void registerClientReceivers() {
    ServerSidePacketRegistry.INSTANCE.register(MY_PACKET_ID, (packetContext, buf) -> {
        packetContext.queue(() -> {
            // 处理
        });
    });
}
```

## Decision: 选择通信方向

```
IF 客户端 → 服务端
  → ClientSidePacketRegistry.register()

IF 服务端 → 客户端
  → ServerSidePacketRegistry.INSTANCE.register()

IF 需要双向
  → 两端分别注册
```

## 发送数据包

```java
// 服务端向客户端发送
ServerPlayNetworking.send(player, MY_PACKET_ID,
    PacketByteBuf.createUnpooled().writeInt(value));

// 客户端向服务端发送
ClientPlayNetworking.send(MY_PACKET_ID,
    PacketByteBuf.createUnpooled().writeInt(value));
```

## 常见错误

- ❌在非主线程处理数据 — 使用 `packetContext.queue()`
- ❌忘记在客户端 entrypoint 注册 — 客户端接收器不生效
- ❌包 ID 命名空间不一致 — 两端必须完全相同

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | 网络用于 GUI 数据同步 |
| `mc-entity` | 网络用于实体状态同步 |
