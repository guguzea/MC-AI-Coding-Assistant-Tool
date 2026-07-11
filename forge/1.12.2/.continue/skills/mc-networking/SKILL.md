---
name: mc-networking
description: Forge 1.12.2 Networking skill (SimpleNetworkWrapper, IMessage, PacketBuffer)
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# 网络通信（Forge 1.12.2）

## 快速开始

```java
public static final SimpleNetworkWrapper INSTANCE =
    NetworkRegistry.INSTANCE.newSimpleChannel(MOD_ID + ":main");

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
public static void broadcast(MyMessage msg) {
    INSTANCE.sendToAll(msg);
}
```

## 常见错误

- ❌ 在消息处理器中直接修改世界（未用 `addScheduledTask`）
- ❌ 消息 ID 冲突
- ❌ `sendToServer` 在服务端调用

## Key Forge 1.12.2 Specs

- SimpleNetworkWrapper (not SimpleChannel)
- IMessage (not record classes)
- PacketBuffer (not ByteBuf)
- MessageContext (not Supplier<Context>)
- addScheduledTask() for main thread execution
