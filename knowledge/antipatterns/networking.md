# 网络通信反模式

## 消息处理相关

### ❌ 在消息处理器中直接修改世界（未用 enqueueWork）

```java
// 错误
@SubscribeEvent
public static void onMessage(MyMessage message, Supplier<NetworkEvent.Context> ctx) {
    ServerPlayer player = ctx.get().getSender();
    player.getLevel().setBlock(player.blockPosition(), Blocks.AIR.defaultBlockState()); // ❌ 不安全
}
```

**症状**：异步修改世界导致数据损坏或崩溃。

**正确方案**：

```java
@SubscribeEvent
public static void onMessage(MyMessage message, Supplier<NetworkEvent.Context> ctx) {
    ctx.get().enqueueWork(() -> {
        ServerPlayer player = ctx.get().getSender();
        if (player != null) {
            player.getLevel().setBlock(player.blockPosition(), Blocks.AIR.defaultBlockState());
        }
    });
    ctx.get().setPacketHandled(true);
}
```

---

### ❌ 逐字段发送大量网络数据

```java
// 错误
channel.sendToServer(new SyncFieldMessage("field1", value1));
channel.sendToServer(new SyncFieldMessage("field2", value2));
channel.sendToServer(new SyncFieldMessage("field3", value3)); // ❌ 高网络开销
```

**症状**：网络阻塞，服务器卡顿，玩家感受到明显延迟。

**正确方案**：使用 `CompoundTag` 或自定义 `PacketByteBuf` 批量序列化。

```java
public class SyncAllDataMessage implements IMessage {
    private CompoundTag data;

    public void toBytes(PacketByteBuf buf) {
        buf.writeNbt(data);
    }

    public void fromBytes(PacketByteBuf buf) {
        data = buf.readNbt();
    }
}
```

---

## 消息方向相关

### ❌ 在客户端消息处理器中访问服务端独有类

```java
// 错误（客户端收到消息时）
public void onMessage(MyMessage message, Supplier<NetworkEvent.Context> ctx) {
    ServerWorld world = ctx.get().getSender().getLevel(); // ❌ 客户端没有 ServerWorld
}
```

**症状**：运行时崩溃（`ClassCastException`）。

**正确方案**：始终在 `enqueueWork` 中执行，使用 `LogicalSide` 确认端。

```java
ctx.get().enqueueWork(() -> {
    if (ctx.get().getDirection().getReachingSide() == LogicalSide.SERVER) {
        // 服务端逻辑
    }
});
```

---

## 协议版本相关

### ❌ 忘记处理协议版本不兼容

```java
// 错误：没有版本检查
private static final String PROTOCOL_VERSION = "1.0";
```

**症状**：不同版本的客户端/服务端连接时数据解析错误。

**正确方案**：始终使用版本比较函数。

```java
public static final SimpleChannel INSTANCE = NetworkRegistry.newSimpleChannel(
    new ResourceLocation(MOD_ID, "main"),
    () -> PROTOCOL_VERSION,
    PROTOCOL_VERSION::equals,  // 客户端协议版本
    PROTOCOL_VERSION::equals   // 服务端协议版本
);
```

---

## 注册相关

### ❌ 网络包 ID 冲突

```java
// 在多个类中使用相同的 ID
INSTANCE.registerMessage(0, MyMessage1.class, ...);
INSTANCE.registerMessage(0, MyMessage2.class, ...); // ❌ ID 冲突
```

**症状**：消息被错误处理或崩溃。

**正确方案**：使用统一的 ID 管理器。

```java
public static int id(String name) {
    return NetworkRegistry.chooseIdealPayloadId(id("main"), name);
}
```
