# 网络通信反模式

## 消息处理相关

### ❌ 在消息处理器中直接修改世界（未用 addScheduledTask）

```java
// 错误
public static void onMessage(MyMessage msg, MessageContext ctx) {
    ctx.getServerHandler().player.getEntityWorld().setBlockState(pos, Blocks.AIR.getDefaultState()); // ❌ 不安全
}
```

**症状**：异步修改世界导致数据损坏或崩溃。

**正确方案**：

```java
public static void onMessage(MyMessage msg, MessageContext ctx) {
    if (ctx.side == EnumFacing.EnumFacingSide.SERVER) {
        ctx.getServerHandler().player.getServerWorld().addScheduledTask(() -> {
            // 修改世界的操作
        });
    }
}
```

---

### ❌ 网络包 ID 冲突

```java
// 在多个地方使用相同的 ID
INSTANCE.registerMessage(0, MyMessage1.class, ...);
INSTANCE.registerMessage(0, MyMessage2.class, ...); // ❌ ID 冲突
```

**症状**：消息被错误处理或崩溃。

**正确方案**：使用统一的 ID 计数器。

```java
private static int nextId = 0;
public static final int MY_MESSAGE_ID = nextId++;
```
