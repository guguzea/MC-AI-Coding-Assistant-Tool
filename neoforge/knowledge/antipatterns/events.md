# 事件系统反模式

## 事件订阅相关

### ❌ 在错误的事件总线监听事件

```java
// 错误
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.MOD)
public class MyEvents {
    @SubscribeEvent
    public static void onLivingDeath(LivingDeathEvent event) {
        // ❌ LivingDeathEvent 在 FORGE 总线上触发，但这里用了 Bus.MOD，永远不会执行
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
        // ✅ LivingDeathEvent 是 FORGE 总线事件，Bus.FORGE 正确
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
public void onRender(RenderLevelStageEvent event) {
    if (event.getStage() != RenderLevelStageEvent.Stage.AFTER_TRANSLUCENT_BLOCKS) return;
    world.setBlockState(pos, Blocks.DIRT.defaultBlockState()); // ❌ 禁止在渲染线程修改世界
}
```

**症状**：`IllegalStateException: Do not modify the game from the render thread`。

**正确方案**：将操作发送到服务端主线程。

```java
@SubscribeEvent
public void onRender(RenderLevelStageEvent event) {
    if (event.getStage() != RenderLevelStageEvent.Stage.AFTER_TRANSLUCENT_BLOCKS) return;
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

**正确方案**：`FMLClientSetupEvent` 只用于注册按键绑定（KeyMapping）和渲染器。

---

## Attachments 相关

### ❌ Capability 未检查 null

```java
// 错误
player.getData(ModAttachments.MY_DATA).setData(someData); // 如果 Attachment 未注册，可能 NPE
```

**正确方案**：

```java
var data = player.getData(ModAttachments.MY_DATA);
if (data != null) {
    data.setData(someData);
}
```

---

### ❌ 在 `RegisterCapabilitiesEvent` 中修改运行时数据

> 1.20.4 实测更正（出处：neoforge-20.4.251-merged.jar，`jar tf` 全表 + javap 2026-10-06）：
> 本节旧文本写的 `RegisterAttachmentsEvent` 在该版**不存在**（全表 0 命中）。注册事件是
> `net.neoforged.neoforge.capabilities.RegisterCapabilitiesEvent`，成员为
> registerBlock / registerBlockEntity / registerEntity / registerItem（均同一 javap 逐字核实）；
> `AttachmentType` 本身则经 `DeferredRegister.create(NeoForgeRegistries.Keys.ATTACHMENT_TYPES, MOD_ID)` 注册。

```java
// 错误
@SubscribeEvent
public static void registerCaps(RegisterCapabilitiesEvent event) {
    event.registerEntity(MY_CAP, EntityType.PLAYER, provider);
    player.getData(ModAttachments.MY_DATA).setData(123); // ❌ 注册期就碰运行时数据
}
```

**症状**：数据修改时机不对，可能被覆盖。

**正确方案**：注册事件只做注册（`RegisterCapabilitiesEvent` 挂能力 provider；`AttachmentType` 走 `ATTACHMENT_TYPES` 的 DeferredRegister）；运行时数据在实体创建或 `PlayerEvent` 等时机修改。
