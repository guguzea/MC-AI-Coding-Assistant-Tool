---
name: networking
description: Minecraft Forge 网络通信（Forge 1.13.2）。SimpleNetworkWrapper、IMessage、IMessageHandler。触发词：网络、消息、SimpleNetworkWrapper、IMessage
---

# 网络通信（Forge 1.13.2）

## 快速开始

```java
public static final SimpleNetworkWrapper INSTANCE =
    NetworkRegistry.newSimpleChannel(
        new ResourceLocation(MOD_ID, "main"),
        () -> PROTOCOL_VERSION,
        PROTOCOL_VERSION::equals,
        PROTOCOL_VERSION::equals
    );

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

## 发送消息

- `INSTANCE.sendToServer(msg)` — 客户端发送
- `INSTANCE.sendTo(msg, player)` — 服务端发送
- `INSTANCE.sendToAll(msg)` — 服务端广播

## 常见错误

- ❌ 在网络线程修改世界 → 使用 `enqueueWork()`

## 参考资料

- 详细示例：参见 `06-networking.mdc`
