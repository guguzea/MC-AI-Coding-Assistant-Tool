# 事件系统反模式

## 事件订阅相关

### ❌ 忘记 `@Mod.EventBusSubscriber`

```java
// 错误
public class MyEvents {
    @SubscribeEvent
    public static void onLivingDeath(LivingDeathEvent event) {
        // ❌ 永远不会执行
    }
}
```

**症状**：事件处理器永远不触发。

**正确方案**：

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class MyEvents {
    @SubscribeEvent
    public static void onLivingDeath(LivingDeathEvent event) {
        // ✅ 会执行
    }
}
```

---

### ❌ 在 TickEvent 中执行重操作

```java
// 错误
@SubscribeEvent
public void onServerTick(TickEvent.ServerTickEvent event) {
    if (event.phase == TickEvent.Phase.END) {
        for (Entity entity : world.getEntities(Entity.class, predicate)) { // ❌ 每 tick 遍历
            processHeavy(entity);
        }
    }
}
```

**症状**：服务端严重卡顿，TPS 下降。

**正确方案**：

```java
private int tickCounter = 0;

@SubscribeEvent
public void onServerTick(TickEvent.ServerTickEvent event) {
    if (event.phase == TickEvent.Phase.END) {
        tickCounter++;
        if (tickCounter % 20 == 0) {  // 每秒处理一次
            scheduleProcessing();
        }
    }
}
```

---

## 线程安全相关

### ❌ 在 `FMLInitializationEvent` 中执行游戏逻辑修改世界

```java
// 错误
@Mod.EventHandler
public void init(FMLInitializationEvent event) {
    world.setBlockState(pos, Blocks.DIRT.getDefaultState()); // ❌ 禁止
}
```

**症状**：游戏崩溃或数据不同步。

**正确方案**：使用事件驱动的逻辑。
