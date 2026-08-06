---
description: 06 — 网络通信
---

# 06 — 网络通信

> 适用版本：Forge 1.16.5

---

## 约束

### 物理端约束（最重要）

- **所有网络包只能在物理端分隔的类中使用**
- 服务端 mod 的网络包发送给客户端时，客户端收到的是**反序列化后的数据对象**，不是完整类
- 禁止在客户端包类中直接访问服务端独有类（如 `ServerWorld`）
- 使用 `DistExecutor` 或 `FMLEnvironment.dist` 判断当前物理端
- 使用 `world.isRemote` 判断当前逻辑端

### NetworkInstance 配置

```java
private static final String PROTOCOL_VERSION = "1.0";
public static final NetworkInstance INSTANCE = NetworkRegistry.newSimpleChannel(
    new ResourceLocation(MOD_ID, "main"),
    () -> PROTOCOL_VERSION,
    PROTOCOL_VERSION::equals,
    PROTOCOL_VERSION::equals
);
```

### 消息类（IMessage）规范

- 实现 `IMessage`（含 `toBytes`/`fromBytes`）
- 处理器通过 `registerMessage` 的第 5 参数（`BiConsumer<MSG, Supplier<NetworkEvent.Context>>`）注入
- 消息类必须有无参构造函数（用于反序列化）
- **禁止**在消息类中存储对世界或实体的直接引用（序列化后引用会断开）
- 使用 `PacketBuffer`（继承自 `ByteBuf`）手动读写基础类型和 `ResourceLocation`

### 注册时机

- `NetworkInstance` 实例创建在 `FMLCommonSetupEvent` 中
- 消息注册在 `FMLCommonSetupEvent` 中
- 处理器注册在 `FMLCommonSetupEvent` 中

---

## Decision Flow

### Decision: 选择同步需求类型

```
IF 需要服务端主动推送给客户端（服务器通知客户端）
  → 使用带 Reply 的 Request 模式（服务端发送，客户端回复）
  → 或使用 ServerToClientPacket（单向）

IF 需要客户端主动请求服务端（客户端触发服务端逻辑）
  → 使用 ClientToServerPacket（单向）
  → 验证客户端发送的数据（永远不要信任客户端！）

IF 需要双向同步（游戏内实时同步）
  → 使用带 Reply 的 Request 模式
  → Reply 消息作为服务端对客户端的响应

IF 同步大量数据
  → ❌ 不要逐字段发送（高网络开销）
  → 使用 `CompoundNBT` 或自定义 `PacketBuffer` 批量序列化
  → 或考虑用 `SynchedEntityData`（实体数据同步）
```

### Decision: 消息方向

```
┌─────────────────────┐
│      服务端 Mod       │
│                     │
│  INSTANCE.sendTo()   │──────────→ 客户端（指定 Player）
│                     │
│  INSTANCE.send()      │──────────→ 所有客户端（服务器广播）
│                     │
│  客户端发来消息 ────────→│ 客户端发来消息
└─────────────────────┘
```

- `sendTo(ServerPlayerEntity, msg)` — 服务端发送给指定玩家
- `send(PacketDistributor.ALL.noArg(), msg)` — 服务端广播给所有玩家
- `send(PacketDistributor.TRACKING_ENTITY_AND_SELF.with(() -> entity), msg)` — 发送给追踪该实体的玩家
- 客户端直接调用 `sendToServer(msg)` — 客户端发送给服务端

---

## 示例：消息类定义

```java
// messages/MyMessage.java
public class MyMessage implements IMessage {
    private int value;
    private ResourceLocation targetId;

    public MyMessage() {}  // 必须有无参构造函数

    public MyMessage(int value, ResourceLocation targetId) {
        this.value = value;
        this.targetId = targetId;
    }

    @Override
    public void toBytes(PacketBuffer buf) {
        buf.writeInt(value);
        buf.writeResourceLocation(targetId);
    }

    @Override
    public void fromBytes(PacketBuffer buf) {
        this.value = buf.readInt();
        this.targetId = buf.readResourceLocation();
    }
}
```

## 示例：消息处理器（服务端→客户端，单向）

```java
// messages/MyMessageHandler.java
// 处理器是 BiConsumer<MSG, Supplier<NetworkEvent.Context>>，无需实现接口
public static void handle(MyMessage msg, Supplier<NetworkEvent.Context> ctx) {
    // 从网络上下文获取逻辑端
    ctx.get().enqueueWork(() -> {
        // 始终检查逻辑端
        if (ctx.get().getDirection().getReceptionSide().isServer()) {
            // 这是服务端收到消息的处理器
            ServerPlayerEntity sender = ctx.get().getSender();
            if (sender != null) {
                // 服务端处理逻辑
            }
        }
    });
    ctx.get().setPacketHandled(true);
}
```

## 示例：注册和发送

```java
// network/NetworkHandler.java
public class NetworkHandler {
    public static final int OPEN_GUI_ID = 0;
    public static final int SYNC_DATA_ID = 1;

    public static NetworkInstance INSTANCE;
    public static final String PROTOCOL_VERSION = "1.0";

    public static void register() {
        INSTANCE = NetworkRegistry.newSimpleChannel(
            new ResourceLocation(ExampleMod.MOD_ID, "main"),
            () -> PROTOCOL_VERSION,
            PROTOCOL_VERSION::equals,
            PROTOCOL_VERSION::equals
        );

        // 注册消息，指定消息类、处理器类、消息方向
        INSTANCE.registerMessage(
            OPEN_GUI_ID,
            MyOpenGuiMessage.class,
            MyOpenGuiMessage::toBytes,
            MyOpenGuiMessage::new,
            MyOpenGuiHandler::handle
        );
    }

    // 服务端发送消息给指定玩家
    public static void sendTo(ServerPlayerEntity player, MyOpenGuiMessage message) {
        INSTANCE.sendTo(message, player.connection.getConnection(), NetworkDirection.PLAY_TO_CLIENT);
    }

    // 服务端广播消息给所有玩家
    public static void broadcast(MyOpenGuiMessage message) {
        INSTANCE.send(PacketDistributor.ALL.noArg(), new S2CMessage(message));
    }
}
```

## 示例：客户端发送消息

```java
// 在客户端代码中（玩家输入等触发）
NetworkHandler.INSTANCE.sendToServer(new MyOpenGuiMessage(targetId, value));
```

## 示例：服务端广播消息

```java
// 在服务端逻辑中广播给所有玩家
INSTANCE.send(PacketDistributor.ALL.noArg(), new MyBroadcastMessage(data));
```

> 重要：收到消息后**永远不要**直接修改世界或实体。必须用 `enqueueWork()` 将操作排队到主线程执行。
> 注意：`DistExecutor.unsafeRunWhenOn` 用于服务端发往客户端的单向消息。
