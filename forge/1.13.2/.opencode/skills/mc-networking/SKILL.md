---
name: mc-networking
description: Minecraft Forge 网络通信。注册网络通道、发送数据包、C2S/S2C 消息、SimpleNetworkWrapper。触发词：网络、消息、Network、SimpleNetworkWrapper、PacketDistributor、IMessage
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# 网络通信（Forge 1.13.2）

## 快速开始

```java
// 创建 SimpleNetworkWrapper
public static final SimpleNetworkWrapper INSTANCE =
    NetworkRegistry.newSimpleChannel(
        new ResourceLocation(MOD_ID, "main"),
        () -> PROTOCOL_VERSION,
        PROTOCOL_VERSION::equals,
        PROTOCOL_VERSION::equals
    );

// 注册消息
public static void register() {
    INSTANCE.registerMessage(
        MESSAGE_ID,
        MyMessage.class,
        MyMessage::toBytes,
        MyMessage::new,
        MyMessageHandler::onMessage
    );
}
```

## Decision: 选择数据包类型

```
IF 客户端 → 服务端（玩家发起）
  → 在客户端调用 INSTANCE.sendToServer(msg)

IF 服务端 → 玩家（精准发送）
  → INSTANCE.sendTo(msg, player)

IF 服务端 → 全服广播
  → INSTANCE.sendToAll(msg)

IF 服务端 → 区域内所有玩家
  → INSTANCE.sendToAllTracking(msg, entity)
```

## 消息类结构

```java
public class MyMessage implements IMessage {
    private int value;

    public MyMessage() {}  // 必须有无参构造函数

    public MyMessage(int value) {
        this.value = value;
    }

    @Override
    public void toBytes(PacketBuffer buf) {
        buf.writeInt(value);
    }

    @Override
    public void fromBytes(PacketBuffer buf) {
        this.value = buf.readInt();
    }
}
```

## 消息处理器

```java
public class MyMessageHandler implements IMessageHandler<MyMessage, IMessage> {
    @Override
    public IMessage onMessage(MyMessage msg, Supplier<NetworkEvent.Context> ctx) {
        ctx.get().enqueueWork(() -> {
            EntityPlayerMP player = ctx.get().getSender();
            if (player != null) {
                // 服务端处理
            }
        });
        ctx.get().setPacketHandled(true);
        return null;
    }
}
```

## 常见错误

- ❌ 在网络线程直接修改世界：所有游戏逻辑必须在 `enqueueWork()` 回调中执行
- ❌ 消息 ID 冲突：每个消息 ID 在同一 channel 中必须唯一
- ❌ `sendToServer()` 在服务端调用

## 参考资料

- 详细示例：参见 `06-networking.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 注册表数据可通过网络同步 |
| `mc-capability` | Capability 数据可通过数据包同步 |
| `mc-entity` | 实体数据同步基于网络消息机制 |
