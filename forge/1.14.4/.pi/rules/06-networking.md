---
description: 06 — 网络通信
---

# 06 — 网络通信

> 适用版本：Forge 1.14.4

---

## 约束

### 物理端约束（最重要）

- **所有网络包只能在物理端分隔的类中使用**
- 服务端 mod 的网络包发送给客户端时，客户端收到的是**反序列化后的数据对象**，不是完整类
- 禁止在客户端包类中直接访问服务端独有类（如 `WorldServer`）
- 使用 `DistExecutor` 或 `FMLEnvironment.dist` 判断当前物理端
- 使用 `world.isRemote` 判断当前逻辑端（1.14.4 使用 `isRemote`，不是 `isClientSide`）

### SimpleChannel 配置

1.13 起类名是 **`SimpleChannel`**（`NetworkRegistry.newSimpleChannel` 的返回值）。**不要** `SimpleNetworkWrapper`（那是 1.12）。

```java
private static final String PROTOCOL_VERSION = "1";
public static final SimpleChannel INSTANCE = NetworkRegistry.newSimpleChannel(
        new ResourceLocation(MOD_ID, "main"),
        () -> PROTOCOL_VERSION,
        PROTOCOL_VERSION::equals,
        PROTOCOL_VERSION::equals
);
```

### 消息类规范

- **不要** `IMessage` / `IMessageHandler`（1.12 SimpleImpl）
- 普通类 + `registerMessage(id, Class, encoder, decoder, consumer)`
- encoder：`BiConsumer<MSG, PacketBuffer>`
- decoder：`Function<PacketBuffer, MSG>`（不要无参 `MyMessage::new`，除非构造函数吃 `PacketBuffer`）
- consumer：`BiConsumer<MSG, Supplier<NetworkEvent.Context>>`
- **禁止**在消息类中存储对世界或实体的直接引用

### 注册时机

- `SimpleChannel` 实例可在类加载时创建
- `registerMessage` 放在 `FMLCommonSetupEvent`

---

## Decision Flow

### Decision: 选择同步需求类型

```
IF 需要服务端主动推送给客户端（服务器通知客户端）
  → 使用 S2C 消息 + PacketDistributor

IF 需要客户端主动请求服务端（客户端触发服务端逻辑）
  → 使用 C2S 消息（客户端 sendToServer，服务端处理）

IF 需要双向同步（游戏内实时同步）
  → 同一消息可在 handler 里 reply，或注册两条消息

IF 同步大量数据
  → ❌ 不要逐字段发送（高网络开销）
  → 使用 NBTTagCompound 批量序列化
```

### Decision: 消息方向

```
┌─────────────────────┐
│      服务端 Mod       │
│                     │
│  INSTANCE.send(      │
│    PacketDistributor │──────────→ 客户端
│      .PLAYER.with()) │
│                     │
│  PacketDistributor   │──────────→ 所有客户端
│      .ALL.noArg()    │
│                     │
│  sendToServer ────────→│ 客户端发来消息
└─────────────────────┘
```

- `INSTANCE.sendToServer(msg)` — 客户端发送给服务端
- `INSTANCE.send(PacketDistributor.PLAYER.with(() -> player), msg)` — 指定 `EntityPlayerMP`
- `INSTANCE.send(PacketDistributor.ALL.noArg(), msg)` — 全服广播
- `INSTANCE.send(PacketDistributor.TRACKING_ENTITY.with(() -> entity), msg)` — 追踪该实体的玩家
- `INSTANCE.sendTo(msg, networkManager, NetworkDirection)` — 低层重载，一般用 `PacketDistributor`

**不要** `sendTo(player, msg)` / `sendToAll(msg)`（1.12 `SimpleNetworkWrapper`）。

---

## 示例：消息类定义

```java
public class MyMessage {
    private int value;

    public MyMessage(int value) {
        this.value = value;
    }

    public MyMessage(PacketBuffer buf) {
        this.value = buf.readInt();
    }

    public void encode(PacketBuffer buf) {
        buf.writeInt(value);
    }

    public void handle(Supplier<NetworkEvent.Context> ctx) {
        ctx.get().enqueueWork(() -> {
            EntityPlayerMP player = ctx.get().getSender();
            if (player != null) {
                // 服务端处理逻辑
            }
        });
        ctx.get().setPacketHandled(true);
    }
}
```

## 示例：注册和发送

```java
public class NetworkHandler {
    private static final String PROTOCOL_VERSION = "1";
    public static final SimpleChannel INSTANCE = NetworkRegistry.newSimpleChannel(
            new ResourceLocation(ExampleMod.MOD_ID, "main"),
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

    public static void sendTo(EntityPlayerMP player, MyMessage message) {
        INSTANCE.send(PacketDistributor.PLAYER.with(() -> player), message);
    }

    public static void sendToAll(MyMessage message) {
        INSTANCE.send(PacketDistributor.ALL.noArg(), message);
    }
}
```

## 示例：客户端发送消息

```java
NetworkHandler.INSTANCE.sendToServer(new MyMessage(value));
```

> 重要：收到消息后**永远不要**直接修改世界或实体。必须用 `ctx.get().enqueueWork()` 排到主线程，并 `setPacketHandled(true)`。

## 常见错误

- ❌ `SimpleNetworkWrapper` / `IMessage` / `IMessageHandler` — 1.12
- ❌ `sendTo(msg, player)` / `sendToAll(msg)` — 本档用 `PacketDistributor`
- ❌ decoder 写成无参 `MyMessage::new`
- ❌ 在网络线程直接改世界
- ❌ 同一 channel 内 discriminator 冲突

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-capability` | Capability 数据可通过数据包同步 |
| `mc-entity` | 实体额外生成数据走网络 |
