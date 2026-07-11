---
name: mc-networking
description: Minecraft Forge 网络通信。注册网络通道、发送数据包、C2S/S2C 消息、SimpleNetworkWrapper。触发词：网络、消息、Network、SimpleNetworkWrapper、PacketBuffer、IMessage
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# 网络通信（Forge 1.12.2）

## 快速开始

```java
// 创建 SimpleNetworkWrapper
public static final SimpleNetworkWrapper INSTANCE =
    NetworkRegistry.INSTANCE.newSimpleChannel(MOD_ID + ":main");

// 注册消息
public static void register() {
    INSTANCE.registerMessage(
        0, MyMessageHandler.class, MyMessage::encode, MyMessage::new, MyMessage::handle
    );
}
```

## Decision: 选择数据包类型

```
IF 客户端 → 服务端（玩家发起）
  → 在客户端调用 INSTANCE.sendToServer(msg)

IF 服务端 → 玩家（精准发送）
  → INSTANCE.sendTo(msg, playerMP)

IF 服务端 → 全服广播
  → INSTANCE.sendToAll(msg)
```

## 消息类结构

```java
public class MyMessage implements IMessage {
    private int value;

    public MyMessage() {}

    public MyMessage(int value) { this.value = value; }

    @Override
    public void toBytes(PacketBuffer buf) { buf.writeInt(value); }

    @Override
    public void fromBytes(PacketBuffer buf) { this.value = buf.readInt(); }
}
```

## 消息处理器

```java
public class MyMessageHandler implements IMessageHandler<MyMessage, IMessage> {
    @Override
    public IMessage onMessage(MyMessage msg, MessageContext ctx) {
        if (ctx.side == EnumFacing.EnumFacingSide.SERVER) {
            EntityPlayerMP player = ctx.getServerHandler().player;
            // 处理逻辑...
            // 如果需要主线程执行：
            ctx.getServerHandler().player.getServerWorld().addScheduledTask(() -> { ... });
        }
        return null;
    }
}
```

## 服务端发送广播

```java
// 在 NetworkHandler 类中
public static void broadcast(MyMessage msg) {
    INSTANCE.sendToAll(msg);
}
```

## 常见错误

- ❌ 在消息处理器中直接修改世界（未用 `addScheduledTask`）
- ❌ 消息 ID 冲突
- ❌ `sendToServer` 在服务端调用

## 参考资料

- 详细示例：参见 `06-networking.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-registry` | 网络相关注册 |
| `mc-capability` | Capability 数据可通过数据包同步 |
| `mc-entity` | 实体数据同步基于网络消息机制 |
