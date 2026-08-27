---
name: mc-networking
description: Minecraft Forge 网络通信。SimpleChannel、PacketDistributor、NetworkRegistry.newSimpleChannel。触发词：网络、消息、Network、SimpleChannel、PacketDistributor、PacketBuffer
platform: forge
version: "1.13.2"
dependencies: []
mappings: mcp
---

# 网络通信（Forge 1.13.2）

## 快速开始

```java
private static final String PROTOCOL_VERSION = "1";
public static final SimpleChannel INSTANCE = NetworkRegistry.newSimpleChannel(
        new ResourceLocation(MOD_ID, "main"),
        () -> PROTOCOL_VERSION,
        PROTOCOL_VERSION::equals,
        PROTOCOL_VERSION::equals
);

private static int id = 0;

public static void register() {
    INSTANCE.registerMessage(
            id++,
            MyMessage.class,
            MyMessage::encode,
            MyMessage::new,
            (msg, ctx) -> msg.handle(ctx)
    );
}
```

`newSimpleChannel` 返回 **`SimpleChannel`**。不要 `SimpleNetworkWrapper`，不要 `IMessage`。decoder 必须是 `Function<PacketBuffer, MSG>`（`MyMessage(PacketBuffer)`）。

## Decision: 选择数据包类型

```
IF 客户端 → 服务端（玩家发起）
  → INSTANCE.sendToServer(msg)

IF 服务端 → 玩家（精准发送）
  → INSTANCE.send(PacketDistributor.PLAYER.with(() -> player), msg)

IF 服务端 → 全服广播
  → INSTANCE.send(PacketDistributor.ALL.noArg(), msg)

IF 服务端 → 追踪实体的玩家
  → INSTANCE.send(PacketDistributor.TRACKING_ENTITY.with(() -> entity), msg)
```

## 消息类结构

```java
public class MyMessage {
    private final int value;

    public MyMessage(int value) { this.value = value; }

    public MyMessage(PacketBuffer buf) { this.value = buf.readInt(); }

    public void encode(PacketBuffer buf) { buf.writeInt(value); }

    public void handle(Supplier<NetworkEvent.Context> ctx) {
        ctx.get().enqueueWork(() -> {
            EntityPlayerMP player = ctx.get().getSender();
            if (player != null) {
                // 服务端处理
            }
        });
        ctx.get().setPacketHandled(true);
    }
}
```

## 常见错误

- ❌ `SimpleNetworkWrapper` / `IMessageHandler`
- ❌ `sendToAll(msg)`（1.12）；本档用 `PacketDistributor.ALL.noArg()`
- ❌ 在网络线程直接修改世界：必须 `enqueueWork()`
- ❌ 消息 ID 冲突
- ❌ `sendToServer()` 在服务端调用

## 参考资料

- 详细示例：参见 `06-networking.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 注册表数据可通过网络同步 |
| `mc-capability` | Capability 数据可通过数据包同步 |
| `mc-entity` | 实体数据同步基于网络消息机制 |
