---
name: mc-networking
description: Minecraft Forge 网络通信。注册网络通道、发送数据包、C2S/S2C 消息、SimpleChannel。触发词：网络、消息、Network、SimpleChannel、PacketDistributor、IMessage
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
---

# 网络通信（Forge 1.20.1）

## 快速开始

```java
// 创建 SimpleChannel
public static final SimpleChannel CHANNEL = NetworkRegistry.newSimpleChannel(
    new ResourceLocation(MOD_ID, "main"),
    () -> PROTOCOL_VERSION,
    PROTOCOL_VERSION::equals,
    PROTOCOL_VERSION::equals
);

// 注册消息
private static int msgId = 0;
public static void register() {
    CHANNEL.registerMessage(msgId++, MyMessage.class,
        MyMessage::toBytes, MyMessage::new,
        MyMessage::handle);
}
```

## Decision: 选择数据包类型

```
IF 客户端 → 服务端（玩家发起）
  → 在客户端调用 CHANNEL.sendToServer(msg)

IF 服务端 → 玩家（精准发送）
  → CHANNEL.send(PacketDistributor.PLAYER.with(() -> player), msg)

IF 服务端 → 全服广播
  → CHANNEL.send(PacketDistributor.ALL.noArg(), msg)

IF 服务端 → 区域内所有玩家
  → CHANNEL.send(PacketDistributor.TRACKING_ENTITY.with(() -> entity), msg)
```

## 消息类结构

```java
import net.minecraft.network.FriendlyByteBuf;
import net.minecraft.resources.ResourceLocation;

public class MyMessage implements IMessage {
    private int value;
    private ResourceLocation targetId;

    public MyMessage() {}  // 必须有无参构造函数

    public MyMessage(int value, ResourceLocation targetId) {
        this.value = value;
        this.targetId = targetId;
    }

    @Override
    public void toBytes(FriendlyByteBuf buf) {
        buf.writeInt(value);
        buf.writeResourceLocation(targetId);
    }

    @Override
    public void fromBytes(FriendlyByteBuf buf) {
        this.value = buf.readInt();
        this.targetId = buf.readResourceLocation();
    }
}
```

## 消息处理器

```java
public static void handle(MyMessage msg, Supplier<NetworkEvent.Context> ctx) {
    ctx.get().enqueueWork(() -> {
        // 在主线程执行游戏逻辑
        ServerPlayer sender = ctx.get().getSender();
        if (sender != null) {
            // 服务端处理
        }
    });
    ctx.get().setPacketHandled(true);
}
```

## 服务端发送广播

```java
// 在 NetworkHandler 类中
public static void broadcast(MyBroadcastMessage msg) {
    CHANNEL.send(PacketDistributor.ALL.noArg(), msg);
}
```

## 常见错误

- ❌ `IMessageHandler` vs `IClientHandler`：确认方向（C2S 用 IMessageHandler，S2C 消息自动忽略）
- ❌ 在网络线程直接修改世界：所有游戏逻辑必须在 `enqueueWork()` 回调中执行
- ❌ 消息 ID 冲突：每个消息 ID 在同一 channel 中必须唯一
- ❌ `sendToServer()` 在服务端调用：检查 `LogicalSide`

## 参考资料

- 详细示例：参见 `06-networking.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 注册表数据可通过网络同步 |
| `mc-capability` | Capability 数据可通过数据包同步 |
| `mc-entity` | 实体数据同步基于网络消息机制 |
