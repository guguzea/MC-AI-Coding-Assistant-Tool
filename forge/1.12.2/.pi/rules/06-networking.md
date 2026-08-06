---
description: 06 — 网络通信
---

# 06 — 网络通信

> 适用版本：Forge 1.12.2

---

## 约束

### 物理端约束（最重要）

- **所有网络包只能在物理端分隔的类中使用**
- 服务端 mod 的网络包发送给客户端时，客户端收到的是**反序列化后的数据对象**，不是完整类
- 禁止在客户端包类中直接访问服务端独有类
- 使用 `@SideOnly(Side.CLIENT)` 标注客户端代码

### SimpleNetworkWrapper 配置

```java
private static final SimpleNetworkWrapper INSTANCE = NetworkRegistry.INSTANCE
        .newSimpleChannel(MODID)
        .registerMessage(id, MessageClass.class, MessageClass::toBytes, MessageClass::new, MessageClass::handle);
```

### 消息类规范

- 消息类必须有 `toBytes(ByteBuf)` 和构造函数（用于 `PacketBuffer` 反序列化）
- 无需实现接口
- 消息类必须有无参构造函数（用于反序列化）
- **禁止**在消息类中存储对世界或实体的直接引用（序列化后引用会断开）

### 注册时机

- `SimpleNetworkWrapper` 实例创建在 `init` 阶段
- 消息注册在 `init` 阶段

---

## Decision Flow

### Decision: 选择同步需求类型

```
IF 需要服务端主动推送给客户端（服务器通知客户端）
  → 使用 SimpleNetworkWrapper.sendTo()（服务端发送给指定玩家）
  → 或使用 SimpleNetworkWrapper.sendToAll()（服务端广播）

IF 需要客户端主动请求服务端（客户端触发服务端逻辑）
  → 使用 SimpleNetworkWrapper.sendToServer()（客户端发送给服务端）
  → 验证客户端发送的数据（永远不要信任客户端！）

IF 需要双向同步（游戏内实时同步）
  → 组合使用 C2S 和 S2C 消息
```

### Decision: 消息方向

```
┌─────────────────────┐
│      服务端 Mod       │
│                     │
│  INSTANCE.sendTo()   │──────────→ 客户端（指定 Player）
│                     │
│  INSTANCE.sendToAll()│──────────→ 所有客户端（服务器广播）
│                     │
│  客户端发来消息 ────────→│ 客户端发来消息
└─────────────────────┘
```

- `sendTo(player, msg)` — 服务端发送给指定玩家
- `sendToAll(msg)` — 服务端广播给所有玩家
- `sendToServer(msg)` — 客户端发送给服务端

### Decision: 什么时候用网络包

```
IF 实现 GUI 打开/关闭同步
  → 客户端发送打开请求 → 服务端回复确认 → 打开 GUI

IF 实现实体状态同步（属性修改）
  → 服务端修改 → 发送数据给客户端 → 客户端更新渲染

IF 实现方块实体数据同步
  → 使用 TileEntity.syncData 或自定义网络包

IF 需要玩家交互确认（如打开门）
  → 使用 PlayerInteractEvent（在服务端自然处理，无需网络包）
```

---

## 示例：消息类定义

```java
// messages/MessageExample.java
public class MessageExample implements IMessage {
    private int value;
    private ResourceLocation targetId;

    public MessageExample() {}

    public MessageExample(int value, ResourceLocation targetId) {
        this.value = value;
        this.targetId = targetId;
    }

    @Override
    public void fromBytes(PacketBuffer buf) {
        this.value = buf.readInt();
        this.targetId = buf.readResourceLocation();
    }

    @Override
    public void toBytes(PacketBuffer buf) {
        buf.writeInt(value);
        buf.writeResourceLocation(targetId);
    }
}
```

## 示例：消息处理器

```java
// messages/MessageExampleHandler.java
public static class MessageExampleHandler implements IMessageHandler<MessageExample, IMessage> {
    @Override
    public IMessage onMessage(MessageExample message, MessageContext ctx) {
        // 从网络上下文获取逻辑端
        EntityPlayer player = ctx.getServerHandler().player;
        if (player != null) {
            // 服务端处理逻辑
            player.getServerWorld().addScheduledTask(() -> {
                // 在主线程执行游戏逻辑
            });
        }
        return null;
    }
}
```

## 示例：注册和发送

```java
// network/NetworkHandler.java
public class NetworkHandler {
    public static SimpleNetworkWrapper INSTANCE;
    private static int id = 0;

    public static void registerMessages() {
        INSTANCE = NetworkRegistry.INSTANCE.newSimpleChannel(MODID);
        INSTANCE.registerMessage(id++, MessageExample.class,
                MessageExample::toBytes,
                MessageExample::new,
                MessageExampleHandler::onMessage);
    }

    // 服务端发送消息给指定玩家
    public static void sendTo(PlayerEntity player, MessageExample message) {
        INSTANCE.sendTo(message, player.connection.getNetworkManager(),
                NetworkDirection.PLAY_TO_CLIENT);
    }

    // 服务端广播消息给所有玩家
    public static void sendToAll(MessageExample message) {
        INSTANCE.sendToAll(message);
    }
}
```

## 示例：客户端发送消息

```java
// 在客户端代码中（玩家输入等触发）
NetworkHandler.INSTANCE.sendToServer(new MessageExample(value, targetId));
```

> 重要：收到消息后**永远不要**直接修改世界或实体。必须用 `addScheduledTask()` 将操作排队到主线程执行。
