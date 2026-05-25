# 事件系统反模式

## 事件订阅相关

### ❌ 在错误的事件总线监听事件

```java
// 错误
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.MOD)
public class MyEvents {
    @SubscribeEvent
    public static void onLivingDeath(LivingDeathEvent event) { // ❌ 这个事件在 FORGE 总线上
        // 永远不会触发
    }
}
```

**症状**：事件处理器永远不触发。

**正确方案**：

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.FORGE)
public class MyEvents {
    @SubscribeEvent
    public static void onLivingDeath(LivingDeathEvent event) {
        // FORGE 总线正确
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
        for (Entity entity : world.getAllEntities()) { // ❌ 每 tick 遍历所有实体
            processHeavy(entity);
        }
    }
}
```

**症状**：服务端严重卡顿，TPS 下降。

**正确方案**：使用计数器分散负载。

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

### ❌ 在渲染线程中修改服务端数据

```java
// 错误（客户端代码）
@SubscribeEvent
public void onRender(RenderGameOverlayEvent.Post event) {
    world.setBlockState(pos, Blocks.DIRT.defaultBlockState()); // ❌ 禁止在渲染线程修改世界
}
```

**症状**：`IllegalStateException: Do not modify the game from the render thread`。

**正确方案**：将操作发送到服务端主线程。

```java
@SubscribeEvent
public void onRender(RenderGameOverlayEvent.Post event) {
    NetworkHandler.INSTANCE.sendToServer(new ModifyBlockMessage(pos));
}
```

---

### ❌ 在 `FMLClientSetupEvent` 中执行游戏逻辑

```java
// 错误
@SubscribeEvent
public static void onClientSetup(FMLClientSetupEvent event) {
    world.setBlockState(pos, Blocks.DIRT.defaultBlockState()); // ❌ 禁止在客户端修改世界数据
}
```

**症状**：游戏崩溃或数据不同步。

**正确方案**：`FMLClientSetupEvent` 只用于注册 KeyBinding 和渲染器。

---

## Capability 相关

### ❌ Capability 未检查 null

```java
// 错误
player.getCapability(ModCapabilities.MY_CAP).ifPresent(cap -> {
    cap.setData(someData); // 如果 Capability 未附加，数据可能丢失
});
```

**症状**：数据写入后丢失，或逻辑不执行。

**正确方案**：主动检查 Capability 是否存在。

```java
player.getCapability(ModCapabilities.MY_CAP).ifPresent(cap -> {
    cap.setData(someData);
});

// 或使用 orElse
IMyCapability cap = player.getCapability(ModCapabilities.MY_CAP).orElse(null);
if (cap != null) {
    cap.setData(someData);
}
```

---

### ❌ `LazyOptional` 泄漏

```java
// 错误
@Override
public void setRemoved() {
    super.setRemoved();
    // ❌ 没有 invalidate LazyOptional
}
```

**症状**：内存泄漏，World 不释放，卸载区块后大量对象无法 GC。

**正确方案**：

```java
private final LazyOptional<IExampleData> opt = LazyOptional.of(() -> instance);

@Override
public void setRemoved() {
    opt.invalidate();  // 关键：必须调用
    super.setRemoved();
}
```

---

### ❌ 在 `AttachCapabilitiesEvent` 中修改数据

```java
// 错误
@SubscribeEvent
public static void attachToPlayer(AttachCapabilitiesEvent<Entity> event) {
    if (event.getObject() instanceof Player player) {
        player.getCapability(CAP).ifPresent(cap -> cap.setData(123)); // ❌ 只注册 Provider
    }
}
```

**症状**：数据修改时机不对，可能被覆盖。

**正确方案**：`AttachCapabilitiesEvent` 只负责附加 Provider，不做数据修改。
