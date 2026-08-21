---
name: mc-networking
description: Minecraft Forge 网络通信。注册网络通道、发送数据包、C2S/S2C 消息、SimpleNetworkWrapper、IMessage。触发词：网络、消息、Network、SimpleNetworkWrapper、IMessage、ByteBuf、PacketBuffer
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# 网络通信（Forge 1.12.2）

## 快速开始

```java
public static final SimpleNetworkWrapper INSTANCE =
        NetworkRegistry.INSTANCE.newSimpleChannel(MOD_ID);

private static int disc = 0;

public static void register() {
    INSTANCE.registerMessage(MyMessage.Handler.class, MyMessage.class, disc++, Side.SERVER);
}
```

通道名用 **mod id** 短字符串。不要 `modid:main`，不要 1.13+ `SimpleChannel` lambda 注册。

## Decision: 选择数据包类型

```
IF 客户端 → 服务端（玩家发起）
  → 在客户端调用 INSTANCE.sendToServer(msg)
  → 对该消息 registerMessage(..., Side.SERVER)

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
    public void toBytes(ByteBuf buf) { buf.writeInt(value); }

    @Override
    public void fromBytes(ByteBuf buf) { this.value = buf.readInt(); }

    public static class Handler implements IMessageHandler<MyMessage, IMessage> {
        @Override
        public IMessage onMessage(MyMessage msg, MessageContext ctx) {
            EntityPlayerMP player = ctx.getServerHandler().playerEntity;
            player.getServerWorld().addScheduledTask(() -> {
                // 主线程游戏逻辑
            });
            return null;
        }
    }
}
```

官方文档用 **`ByteBuf`**。`PacketBuffer` 是 `ByteBuf` 子类，可以当参数用，但不要抄 1.17+ 的 `FriendlyByteBuf`。

## 服务端发送

```java
INSTANCE.sendTo(msg, playerMP);
INSTANCE.sendToAll(msg);
INSTANCE.sendToDimension(msg, world.provider.getDimension());
INSTANCE.sendToAllAround(msg, new NetworkRegistry.TargetPoint(dim, x, y, z, range));
INSTANCE.sendToAllTracking(msg, entity);
```

`sendTo` 参数顺序是 **(IMessage, EntityPlayerMP)**。玩家不会 track 自己，实体版 `sendToAllTracking` 不能代替 `sendTo`。

## 常见错误

- ❌ `registerMessage(0, Handler.class, encode, decode, handle)` — 本档四参数
- ❌ `EnumFacing.EnumFacingSide` / `NetworkDirection` / `PlayerEntity`
- ❌ 在 handler 里直接改世界（未用 `addScheduledTask`）
- ❌ 消息 discriminator 冲突
- ❌ `sendToServer` 在服务端调用
- ❌ 信任客户端坐标却不 `isBlockLoaded`

## 参考资料

- 详细示例：参见 `06-networking.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-registry` | 网络相关注册 |
| `mc-capability` | Capability 数据可通过数据包同步 |
| `mc-entity` | 实体数据同步基于网络消息机制 |
