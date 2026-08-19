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

官方 SimpleImpl：`NetworkRegistry.INSTANCE.newSimpleChannel` 返回 **`SimpleNetworkWrapper`**（不是 1.13+ 的 `SimpleChannel`）。

```java
public static final SimpleNetworkWrapper INSTANCE =
        NetworkRegistry.INSTANCE.newSimpleChannel(MODID);

private static int disc = 0;

public static void registerMessages() {
    // registerMessage(handler, message, discriminator, 接收端)
    INSTANCE.registerMessage(MyMessage.Handler.class, MyMessage.class, disc++, Side.SERVER);
    INSTANCE.registerMessage(MyClientMessage.Handler.class, MyClientMessage.class, disc++, Side.CLIENT);
}
```

- 通道名用短字符串，通常就是 **mod id**（不要 `modid:main` 这种 1.13+ ResourceLocation 通道）
- **不要** lambda `encode`/`decode`、**不要** `NetworkDirection`、**不要** `sendTo(msg, networkManager, direction)`

### 消息类规范

- 实现 **`IMessage`**：`toBytes(ByteBuf)` / `fromBytes(ByteBuf)`
- **必须**有无参构造函数（反序列化要用）
- 无需实现别的接口
- **禁止**在消息类中存储对世界或实体的直接引用（序列化后引用会断开）

### 注册时机

- `SimpleNetworkWrapper` 实例创建在 `preInit` / `init` 阶段
- `registerMessage` 在 `init` 阶段（与通道创建同一处即可）

---

## Decision Flow

### Decision: 选择同步需求类型

```
IF 需要服务端主动推送给客户端（服务器通知客户端）
  → 使用 SimpleNetworkWrapper.sendTo()（服务端发送给指定 EntityPlayerMP）
  → 或使用 SimpleNetworkWrapper.sendToAll()（服务端广播）
  → 或 sendToDimension / sendToAllAround / sendToAllTracking

IF 需要客户端主动请求服务端（客户端触发服务端逻辑）
  → 使用 SimpleNetworkWrapper.sendToServer()（客户端发送给服务端）
  → 验证客户端发送的数据（永远不要信任客户端！）

IF 需要双向同步（游戏内实时同步）
  → 同一消息类要对 Side.SERVER 和 Side.CLIENT 各 registerMessage 一次
```

### Decision: 消息方向

```
┌─────────────────────┐
│      服务端 Mod       │
│                     │
│  INSTANCE.sendTo()   │──────────→ 客户端（指定 EntityPlayerMP）
│                     │
│  INSTANCE.sendToAll()│──────────→ 所有客户端（服务器广播）
│                     │
│  客户端发来消息 ────────→│ sendToServer
└─────────────────────┘
```

- `sendTo(msg, playerMP)` — 服务端发送给指定玩家（参数顺序是 **消息在前、玩家在后**）
- `sendToAll(msg)` — 服务端广播给所有玩家
- `sendToDimension(msg, dimId)` — 当前维度
- `sendToAllAround(msg, TargetPoint)` — 球形范围
- `sendToAllTracking(msg, entity)` / `sendToAllTracking(msg, TargetPoint)`
- `sendToServer(msg)` — 客户端发送给服务端

### Decision: 什么时候用网络包

```
IF 实现 GUI 打开/关闭同步
  → 客户端发送打开请求 → 服务端回复确认 → 打开 GUI

IF 实现实体状态同步（属性修改）
  → 服务端修改 → 发送数据给客户端 → 客户端更新渲染

IF 实现方块实体数据同步
  → 优先 SPacketUpdateTileEntity（getUpdatePacket / onDataPacket）
  → 数据量大或需定向同步时再用自定义 IMessage

IF 需要玩家交互确认（如打开门）
  → 使用 PlayerInteractEvent（在服务端自然处理，无需网络包）
```

---

## 示例：消息类定义

```java
// messages/MyMessage.java
public class MyMessage implements IMessage {
    private int value;

    public MyMessage() {}

    public MyMessage(int value) {
        this.value = value;
    }

    @Override
    public void fromBytes(ByteBuf buf) {
        this.value = buf.readInt();
    }

    @Override
    public void toBytes(ByteBuf buf) {
        buf.writeInt(value);
    }

    public static class Handler implements IMessageHandler<MyMessage, IMessage> {
        @Override
        public IMessage onMessage(MyMessage message, MessageContext ctx) {
            EntityPlayerMP player = ctx.getServerHandler().player;
            int amount = message.value;
            player.getServerWorld().addScheduledTask(() -> {
                player.inventory.addItemStackToInventory(new ItemStack(Items.DIAMOND, amount));
            });
            return null;
        }
    }
}
```

## 示例：注册和发送

```java
// network/NetworkHandler.java
public class NetworkHandler {
    public static final SimpleNetworkWrapper INSTANCE =
            NetworkRegistry.INSTANCE.newSimpleChannel(MODID);
    private static int disc = 0;

    public static void registerMessages() {
        INSTANCE.registerMessage(MyMessage.Handler.class, MyMessage.class, disc++, Side.SERVER);
    }

    public static void sendTo(EntityPlayerMP player, MyMessage message) {
        INSTANCE.sendTo(message, player);
    }

    public static void sendToAll(MyMessage message) {
        INSTANCE.sendToAll(message);
    }
}
```

## 示例：客户端发送消息

```java
NetworkHandler.INSTANCE.sendToServer(new MyMessage(value));
```

> 重要：1.8+ 默认在**网络线程**收包。收到消息后**永远不要**直接修改世界或实体。必须用 `IThreadListener.addScheduledTask()`（服务端从 `EntityPlayerMP#getServerWorld()`，客户端从 `Minecraft.getMinecraft()`）排到主线程。

> 官方 SimpleImpl 示例仍写 `playerEntity`（旧 MCP 名）。**14.23.5.2854 javadoc** 字段是 `NetHandlerPlayServer#player`。本档 MCP 用 `player`。

> 服务端处理客户端包时不要信任坐标：先 `world.isBlockLoaded(pos)`，避免任意区块加载攻击。

## 常见错误

- ❌ `SimpleChannel` / `NetworkDirection` / `FriendlyByteBuf` — 那是 1.13+ / 1.17+
- ❌ `registerMessage(id, Class, encode, decode, handler)` lambda 五段式 — 本档是四参数 `(handler, message, id, Side)`
- ❌ `sendTo(msg, networkManager, NetworkDirection)` / `PlayerEntity`
- ❌ `ctx.side == EnumFacing.*` — 用 `net.minecraftforge.fml.relauncher.Side`
- ❌ 通道名写成 `modid:main`
- ❌ 在 handler 里直接改世界（未 `addScheduledTask`）
- ❌ discriminator 冲突；双向包必须对两个 `Side` 各注册一次

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 网络通道与消息在 init 注册 |
| `mc-capability` | Capability 数据可通过 IMessage 同步 |
| `mc-entity` | 实体额外生成数据见 `IEntityAdditionalSpawnData` |
