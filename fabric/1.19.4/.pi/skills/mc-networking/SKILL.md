---
name: mc-networking
description: Fabric 网络通信。ServerPlayNetworking、ClientPlayNetworking、PacketByteBufs。触发词：网络、Networking、PacketByteBuf、ServerPlayNetworking
platform: fabric
version: "1.19.4"
dependencies: []
mappings: yarn
---

# 网络通信（Fabric 1.19.4）

使用 Fabric API `fabric-networking-api-v1`。不要用已移除的 `ClientSidePacketRegistry` / `ServerSidePacketRegistry`。

## 快速开始

```java
import net.fabricmc.fabric.api.networking.v1.PacketByteBufs;
import net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking;
import net.fabricmc.fabric.api.networking.v1.ClientPlayNetworking;
import net.minecraft.util.Identifier;

public static final Identifier MY_PACKET_ID = new Identifier(MOD_ID, "my_packet");

// 服务端：接收 C2S（ModInitializer.onInitialize）
ServerPlayNetworking.registerGlobalReceiver(MY_PACKET_ID, (server, player, handler, buf, responseSender) -> {
    int value = buf.readInt();
    server.execute(() -> {
        // 主线程处理
    });
});

// 客户端：接收 S2C（ClientModInitializer.onInitializeClient）
ClientPlayNetworking.registerGlobalReceiver(MY_PACKET_ID, (client, handler, buf, responseSender) -> {
    int value = buf.readInt();
    client.execute(() -> {
        // 主线程处理
    });
});
```

## 发送

```java
var buf = PacketByteBufs.create();
buf.writeInt(value);
ServerPlayNetworking.send(player, MY_PACKET_ID, buf); // S2C
ClientPlayNetworking.send(MY_PACKET_ID, buf);         // C2S
```

## 常见错误

- 在网络线程改世界：必须 `server.execute` / `client.execute`
- 只在 common 注册客户端接收器：S2C 必须放在 `ClientModInitializer`
- 包 ID 两端不一致

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | GUI 槽位/进度同步 |
| `mc-entity` | 实体状态同步 |
