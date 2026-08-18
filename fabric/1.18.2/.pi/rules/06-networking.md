---
description: 06 — 网络通信
---

# 06 — 网络通信

> 适用版本：Fabric 1.18.2

## 约束

- 使用 `fabric-networking-api-v1`：`ServerPlayNetworking` / `ClientPlayNetworking` + `PacketByteBufs`
- 不要用已移除的 `ClientSidePacketRegistry` / `ServerSidePacketRegistry`
- S2C 接收器必须在 `ClientModInitializer.onInitializeClient()`
- 网络线程不要改世界：用 `server.execute` / `client.execute`
- 不要写 `net.fabric.sdk` 坐标（正确是 `net.fabricmc.fabric-api`）

## Decision Flow

```
IF S2C
  → 客户端 ClientPlayNetworking.registerGlobalReceiver
  → 服务端 ServerPlayNetworking.send(player, id, buf)
IF C2S
  → 服务端 ServerPlayNetworking.registerGlobalReceiver
  → 客户端 ClientPlayNetworking.send(id, buf)
```

## 示例

```java
import net.fabricmc.fabric.api.networking.v1.PacketByteBufs;
import net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking;
import net.fabricmc.fabric.api.networking.v1.ClientPlayNetworking;
import net.minecraft.util.Identifier;

public static final Identifier MY_PACKET_ID = new Identifier(MOD_ID, "my_packet");

// C2S：ModInitializer.onInitialize
ServerPlayNetworking.registerGlobalReceiver(MY_PACKET_ID, (server, player, handler, buf, responseSender) -> {
    int value = buf.readInt();
    server.execute(() -> { /* 主线程 */ });
});

// S2C：ClientModInitializer.onInitializeClient
ClientPlayNetworking.registerGlobalReceiver(MY_PACKET_ID, (client, handler, buf, responseSender) -> {
    int value = buf.readInt();
    client.execute(() -> { /* 主线程 */ });
});

var buf = PacketByteBufs.create();
buf.writeInt(value);
ServerPlayNetworking.send(player, MY_PACKET_ID, buf);
ClientPlayNetworking.send(MY_PACKET_ID, buf);
```

## 常见错误

- 在网络线程改世界
- 在 `onInitialize()` 注册 S2C 接收器
- 包 ID 两端不一致
- 仍使用 `ClientSidePacketRegistry`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | GUI 槽位/进度同步 |
| `mc-entity` | 实体状态同步 |
