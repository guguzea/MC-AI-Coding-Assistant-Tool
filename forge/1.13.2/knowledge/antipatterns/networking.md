# 网络通信相关反模式

## ❌ 在消息处理器中直接修改世界（未用 enqueueWork）

```java
// 错误
public void onMessage(MyMessage message, Supplier<NetworkEvent.Context> ctx) {
    EntityPlayerMP player = ctx.get().getSender();
    player.getEntityWorld().setBlockState(pos, Blocks.AIR.getDefaultState()); // ❌ 不安全
}
```

**错误症状**：异步修改世界导致数据损坏或崩溃

**正确方案**：

```java
public void onMessage(MyMessage message, Supplier<NetworkEvent.Context> ctx) {
    ctx.get().enqueueWork(() -> {
        EntityPlayerMP player = ctx.get().getSender();
        if (player != null) {
            player.getEntityWorld().setBlockState(pos, Blocks.AIR.getDefaultState());
        }
    });
    ctx.get().setPacketHandled(true);
}
```

---

## ❌ 消息 ID 冲突

```java
// 错误：同一 channel 中 ID 重复
INSTANCE.registerMessage(0, MyMessage1.class, ...);
INSTANCE.registerMessage(0, MyMessage2.class, ...); // ❌ ID 冲突
```

**正确方案**：每个消息使用唯一 ID

```java
private static int nextId = 0;
private static final int MSG1 = nextId++;
private static final int MSG2 = nextId++;

INSTANCE.registerMessage(MSG1, MyMessage1.class, ...);
INSTANCE.registerMessage(MSG2, MyMessage2.class, ...);
```
