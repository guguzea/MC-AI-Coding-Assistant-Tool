# 网络通信反模式

## 消息处理相关

### ❌ 在消息处理器中直接修改世界（未用 enqueueWork）

```java
// 错误
@SubscribeEvent
public static void onMessage(MyMessage message, Supplier<NetworkEvent.Context> ctx) {
    ServerPlayerEntity player = ctx.get().getSender();
    player.getEntityWorld().setBlockState(player.getPosition(), Blocks.AIR.getDefaultState()); // ❌ 不安全
}
```

**症状**：异步修改世界导致数据损坏或崩溃。

**正确方案**：

```java
@SubscribeEvent
public static void onMessage(MyMessage message, Supplier<NetworkEvent.Context> ctx) {
    ctx.get().enqueueWork(() -> {
        ServerPlayerEntity player = ctx.get().getSender();
        if (player != null) {
            player.getEntityWorld().setBlockState(player.getPosition(), Blocks.AIR.getDefaultState());
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

**正确方案**：使用 `NBTTagCompound` 批量序列化。

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
