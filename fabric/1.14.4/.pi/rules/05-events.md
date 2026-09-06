---
description: 05 — 事件系统
---

# 05 — 事件系统

> 适用版本：Fabric 1.14.4

---

## 约束

### 核心原则

- Fabric 使用**事件回调**（Event Callback）而非 Forge 的 `@SubscribeEvent`
- 每个事件类型有自己的回调接口（如 `ServerTickCallback.EVENT`、`UseItemCallback`）
- 在 `onInitialize()` / `onInitializeClient()` 里对静态 `Event` 调用 `.register(lambda)`
- Fabric 事件是**静态 `Event` 字段**（单例），**没有** `@EventHandler` 注解

### 与 Forge 事件系统的区别

| Forge | Fabric |
|-------|--------|
| `@SubscribeEvent` 注解 | `SomeCallback.EVENT.register(lambda)`（或 `PlayerBlockBreakEvents.BEFORE.register`） |
| `MinecraftForge.EVENT_BUS` | 各事件类型上的静态 `Event` 字段 |
| `EventPriority` | Fabric **Phase**（`Event.DEFAULT_PHASE`），不是 Forge 的优先级枚举 |
| `event.setCanceled(true)` | 返回 `ActionResult` / `boolean`；不是 `CanceledEvent` |

不要编造 `ItemEvents` / `BlockEvents` / `EntityEvents` / `PlayerTickEvents` / `EntityTickEvents` / `AttackEvents`。

---

## Decision Flow

### Decision: 选择事件类型

```
IF 处理玩家每 tick 逻辑
  → 客户端 ClientTickCallback.EVENT
  → 服务端 ServerTickCallback.EVENT（再遍历 playerManager）
  → 不要 PlayerTickEvents（不是 Fabric API）

IF 处理实体每 tick 逻辑
  → 重写实体 tick()，或 ServerTickCallback.EVENT 里遍历世界实体
  → 不要 EntityTickEvents

IF 处理方块破坏
  → PlayerBlockBreakEvents.BEFORE / AFTER / CANCELED
  → 空手打方块：AttackBlockCallback.EVENT（官方 events 页示例）

IF 处理方块右键（含尝试放置）
  → UseBlockCallback.EVENT
  → 真正「方块已放置」后逻辑通常要 Mixin Block.place，没有 BlockEvents.BLOCK_PLACE

IF 处理物品使用（不对准方块）
  → UseItemCallback.EVENT

IF 处理实体死亡/伤害
  → AttackEntityCallback；死亡用 Mixin / 实体 onDeath

IF 处理服务端启动/关闭
  → ServerLifecycleEvents.SERVER_STARTED / SERVER_STOPPING / SERVER_STOPPED

IF 处理数据包加载/重载
  → loader-api 索引有 `ServerLifecycleEvents$StartDataPackReload` 等嵌套类型，但**字段表为空**，未用 1.14 FAPI javadoc 钉死静态字段名
  → 优先 `SERVER_STARTED`；不要编造 CallbackEvaluator、DataPackRegistry
```

---

## 常用 Fabric 事件

### 每 tick（客户端 / 服务端）

没有 `PlayerTickEvents`。客户端用 `ClientTickCallback.EVENT`，服务端用 `ServerTickCallback.EVENT`，需要「每个玩家」时自己遍历。

```java
@Environment(EnvType.CLIENT)
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        ClientTickCallback.EVENT.register(client -> {
            if (client.player == null) return;
            // 每客户端 tick 结束（可访问 client.player）
        });
    }
}

public class ExampleMod implements ModInitializer {
    @Override
    public void onInitialize() {
        ServerTickCallback.EVENT.register(server -> {
            for (ServerPlayerEntity player : server.getPlayerManager().getPlayerList()) {
                // 每 server tick、每个在线玩家
            }
        });
    }
}
```

### 实体攻击（1.14.4 没有 `ServerLivingEntityEvents`）

不要编造 `EntityEvents.ENTITY_HURT` / `LivingEntityEvents` / `EntityEvent.TICK`。
死亡/受伤改数值用实体方法或 Mixin；交互用 `AttackEntityCallback`。

```java
AttackEntityCallback.EVENT.register((player, world, hand, entity, hitResult) -> {
    if (entity instanceof PlayerEntity && !world.isClient) {
        // 玩家攻击其他实体
    }
    return ActionResult.PASS;
});

```

### 方块破坏 / 右键方块

`PlayerBlockBreakEvents.BEFORE` 返回 **boolean**（`false` 取消破坏），不是 `ActionResult`。

```java
PlayerBlockBreakEvents.BEFORE.register((world, player, pos, state, blockEntity) -> {
    if (state.getBlock() == Blocks.DIAMOND_ORE) {
        // 防止挖掘钻石矿
        return false;
    }
    return true;
});

PlayerBlockBreakEvents.AFTER.register((world, player, pos, state, blockEntity) -> {
    // 方块已被破坏
});

// 官方文档示例同款：左键方块
AttackBlockCallback.EVENT.register((player, world, hand, pos, direction) -> {
    return ActionResult.PASS;
});

// 右键方块（放置/交互）
UseBlockCallback.EVENT.register((player, world, hand, hitResult) -> {
    return ActionResult.PASS;
});
```

### 物品使用（`UseItemCallback`）

对准方块的右键走 `UseBlockCallback`，不对准方块走这里。
本档返回 `ActionResult`。
不要返回不存在的 `ActionResult.PISTON`。

```java
UseItemCallback.EVENT.register((player, world, hand) -> {
    ItemStack stack = player.getStackInHand(hand);
    if (stack.getItem() == Items.DIAMOND && !world.isClient) {
        // 使用钻石时的服务端逻辑
        return ActionResult.SUCCESS;
    }
    return ActionResult.PASS;
});
```

### ServerLifecycleEvents

```java
ServerLifecycleEvents.SERVER_STARTED.register(server -> {
    LOGGER.info("Server started: " + server.getName());
});

ServerLifecycleEvents.SERVER_STOPPING.register(server -> {
    LOGGER.info("Server stopping...");
});

ServerLifecycleEvents.SERVER_STOPPED.register(server -> {
    LOGGER.info("Server stopped");
});

ServerLifecycleEvents.END_DATA_PACK_RELOAD.register((server, resourceManager, success) -> {
    if (success) {
        // 数据包重载完成
    }
});
```

## Fabric API 事件模块

交互/生命周期事件已包含在 **`fabric-api`** 里（`fabric-events-interaction-v0`、`fabric-lifecycle-events-v1` 等）。
不要写 `net.fabric.sdk`，也不要编造 `fabric-events-attack-v0` 或随手填模块版本号。

```groovy
modImplementation "net.fabricmc.fabric-api:fabric-api:${project.fabric_api_version}"
```

需要给原版没有钩子的位置加事件时：自己 `EventFactory.createArrayBacked`，再在 Mixin 里 `EVENT.invoker()`（见官方 `develop/events`「Custom Events」；⚠️ 本版 fabric-docs 离线索引为空：上游 fabric-docs versions/ 无本版 develop/* 快照，search_fabric_docs 查不到该页，以线上版为准）。不要编造 `AttackEvents.AFTER_DAMAGE`。

## 常见错误

- ❌ 使用 `@EventHandler` / `@SubscribeEvent` — Fabric 没有这些注解，回调不会被注册
- ❌ 在 `onInitialize()` 外、或条件分支里「有时才 register」— 容易漏注册；应在初始化时注册，逻辑放进 lambda
- ❌ 把 1.16+ 的 `ClientTickEvents` / `ServerTickEvents` 抄到 1.14.4 — 本档是 `ClientTickCallback` / `ServerTickCallback`
- ❌ 在客户端 lambda 里改服务端世界数据 — 用 `world.isClient` 区分，写世界只在服务端
- ❌ 忘记处理返回值 — `ActionResult` / `TypedActionResult` / `boolean` 决定是否取消或消费
- ❌ 把 `PlayerBlockBreakEvents.BEFORE` 当成 `ActionResult` — 它是 `boolean`
- ❌ 用 `ItemEvents` / `BlockEvents` / `PlayerTickEvents` — 不是本档 Fabric API

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 事件处理中引用已注册的方块/物品/实体 |
| `mc-item` | `UseItemCallback` / `UseBlockCallback` 做物品交互 |
| `mc-entity` | 实体 tick / 属性；死亡用本页的 Living/Combat 事件或 Mixin |
| `mc-networking` | 事件里给玩家发自定义包（API 见 `06-networking.mdc`） |
| `mc-gui` | 客户端 tick 里打开 Screen；容器同步走 ScreenHandler/Container |
