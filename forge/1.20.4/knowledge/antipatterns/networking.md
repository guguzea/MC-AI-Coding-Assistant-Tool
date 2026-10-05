# 网络通信反模式

## 消息处理相关

### ❌ 把 1.20.1 的处理器签名搬进 1.20.4

```java
// 错误：1.20.4 没有 NetworkEvent
public static void handle(MyMessage message, Supplier<NetworkEvent.Context> ctx) {
    ServerPlayer player = ctx.get().getSender();
    player.level().setBlockAndUpdate(player.blockPosition(), Blocks.AIR.defaultBlockState());
}
```

**症状**：编译期报「找不到符号: 类 NetworkEvent」。

**正确方案**：本档处理器签名是 `(MSG, CustomPayloadEvent.Context)`，且注册时用 `.consumerMainThread(...)` 保证主线程。

```java
CHANNEL.messageBuilder(MyMessage.class)
    .encoder(MyMessage::encode)
    .decoder(MyMessage::new)
    .consumerMainThread(ModNetwork::handle)   // 主线程回调
    .add();

public static void handle(MyMessage message, CustomPayloadEvent.Context ctx) {
    ServerPlayer player = ctx.getSender();
    if (player != null) {
        player.level().setBlockAndUpdate(player.blockPosition(), Blocks.AIR.defaultBlockState());
    }
    ctx.setPacketHandled(true);
}
```

### ❌ 逐字段发送大量网络数据

```java
// 错误（本档 C2S 写法，逐字段发就是问题所在）
CHANNEL.send(new SyncFieldMessage("field1", value1), PacketDistributor.SERVER.noArg());
CHANNEL.send(new SyncFieldMessage("field2", value2), PacketDistributor.SERVER.noArg());
CHANNEL.send(new SyncFieldMessage("field3", value3), PacketDistributor.SERVER.noArg()); // ❌ 高网络开销
```

**症状**：网络阻塞，服务器卡顿，玩家感受到明显延迟。

**正确方案**：使用 `CompoundTag` 或自定义 `FriendlyByteBuf` 批量序列化。

```java
public class SyncAllDataMessage {
    private CompoundTag data;

    public void encode(FriendlyByteBuf buf) {
        buf.writeNbt(data);
    }

    public SyncAllDataMessage(FriendlyByteBuf buf) {
        data = buf.readNbt();
    }
}
```

---

## 消息方向相关

### ❌ 在客户端消息处理器中访问服务端独有类

```java
// 错误（客户端收到消息时）
public static void handle(MyMessage message, CustomPayloadEvent.Context ctx) {
    // ❌ 客户端没有 ServerLevel；ctx.getSender() 在客户端为 null
    ServerLevel world = (ServerLevel) ctx.getSender().getLevel();
}
```

**症状**：运行时崩溃（`NullPointerException` / `ClassCastException`）。

**正确方案**：先判空再按逻辑端分支；本档用 `CustomPayloadEvent.Context#getSender()` 取发送者，客户端侧为空即跳过。

```java
public static void handle(MyMessage message, CustomPayloadEvent.Context ctx) {
    ServerPlayer sender = ctx.getSender();
    if (sender != null) {
        // 仅服务端侧有发送者
    }
    ctx.setPacketHandled(true);
}
```

## 协议版本相关

### ❌ 忘记处理协议版本不兼容

```java
// 错误：只给出协议号，没有版本判定
public static final SimpleChannel CHANNEL = ChannelBuilder
    .named(new ResourceLocation(MOD_ID, "main"))
    .networkProtocolVersion(PROTOCOL_VERSION)
    .simpleChannel();   // ❌ 没有设置 acceptedVersions
```

**症状**：不同版本的客户端/服务端连接时数据解析错误。

**正确方案**：用 `ChannelBuilder#acceptedVersions(VersionTest)`（或 `clientAcceptedVersions` / `serverAcceptedVersions` 分端设置）显式给出可接受版本。

```java
public static final SimpleChannel CHANNEL = ChannelBuilder
    .named(new ResourceLocation(MOD_ID, "main"))
    .networkProtocolVersion(PROTOCOL_VERSION)
    .acceptedVersions(Channel.VersionTest.exact(PROTOCOL_VERSION))   // 需 import net.minecraftforge.network.Channel
    .simpleChannel();
```

## 注册相关

### ❌ 显式 discriminator 冲突

```java
// 在两个类中给同一个显式 discriminator
CHANNEL.messageBuilder(MyMessage1.class, 0).encoder(...).decoder(...).consumerMainThread(...).add();
CHANNEL.messageBuilder(MyMessage2.class, 0).encoder(...).decoder(...).consumerMainThread(...).add(); // ❌ 冲突
```

**症状**：消息被错误处理或崩溃。

**正确方案**：本档可以不传 discriminator，由 `messageBuilder(Class)` 自动分配；确实要显式指定时，用统一的自增分配器。

```java
CHANNEL.messageBuilder(MyMessage1.class).encoder(...).decoder(...).consumerMainThread(...).add();
CHANNEL.messageBuilder(MyMessage2.class).encoder(...).decoder(...).consumerMainThread(...).add();
```
