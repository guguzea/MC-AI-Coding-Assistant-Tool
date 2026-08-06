---
description: 05 — 事件系统
---

# 05 — 事件系统

> 适用版本：Fabric 1.14.4

---

## 约束

### 核心原则

- Fabric 1.14.4 的事件系统主要通过 **Fabric API 的 `fabric-event-api`** 提供
- 每个事件类型有自己的回调接口（如 `PlayerTickEvents.END`）
- 回调在 `onInitialize()` 中注册
- Fabric 事件系统是**静态单例**模式

### 与 Forge 事件系统的区别

| Forge | Fabric |
|-------|--------|
| `@SubscribeEvent` 注解 | `EventCallback` 注册或 `@EventHandler` 注解 |
| `MinecraftForge.EVENT_BUS` | 各事件类型的静态字段 |
| `EventPriority` | 事件回调通常按注册顺序执行 |
| `CanceledEvent` | 事件不自动传播取消 |

---

## Decision Flow

### Decision: 选择事件类型

```
IF 处理玩家每 tick 逻辑
  → PlayerTickEvents.END / START

IF 处理实体每 tick 逻辑
  → EntityTickEvents

IF 处理方块放置/破坏
  → BlockEvents.BLOCK_BREAK / BLOCK_PLACE

IF 处理物品使用
  → ItemEvents.USE_ITEM_ON_BLOCK / USE_ITEM

IF 处理实体死亡/伤害
  → LivingEntityEvents

IF 处理服务端启动/关闭
  → ServerLifecycleEvents.SERVER_STARTED / SERVER_STOPPING

IF 处理数据包加载
  → DataPackRegistry
```

---

## 常用 Fabric 事件

### PlayerTickEvents

```java
@Environment(EnvType.CLIENT)
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        PlayerTickEvents.END.register(player -> {
            // 每 tick 结束时执行（客户端）
        });
    }
}

// 服务端
public class ExampleMod implements ModInitializer {
    @Override
    public void onInitialize() {
        ServerTickEvents.END_SERVER_TICK.register(server -> {
            // 每 server tick 执行
        });
    }
}
```

### EntityEvents

```java
// 实体伤害
EntityEvents.ENTITY_HURT.register((entity, source, amount, flag) -> {
    if (entity instanceof PlayerEntity && amount > 1.0f) {
        // 玩家受伤逻辑
    }
    return amount;  // 返回修改后的伤害值
});

// 实体死亡
EntityEvents.ENTITY_DEATH.register((entity, source) -> {
    if (entity instanceof PlayerEntity) {
        // 玩家死亡逻辑
    }
});
```

### BlockEvents

```java
BlockEvents.BEFORE_BREAK.register((player, world, pos, state, blockEntity) -> {
    if (world.getBlockState(pos).getBlock() == Blocks.DIAMOND_ORE) {
        // 防止挖掘钻石矿
        return ActionResult.FAIL;  // 阻止破坏
    }
    return ActionResult.PASS;  // 允许破坏
});

BlockEvents.BEFORE_PLACE.register((world, pos, state, player, hand, itemStack, hitResult) -> {
    // 方块放置前逻辑
    return ActionResult.PASS;
});
```

### ItemEvents

```java
ItemEvents.USE_ITEM_ON_BLOCK.register((player, world, hand, hitResult) -> {
    ItemStack stack = player.getStackInHand(hand);
    if (stack.getItem() == Items.DIAMOND && !world.isRemote) {
        // 使用钻石右键方块
        return ActionResult.SUCCESS;
    }
    return ActionResult.PASS;
});
```

### ServerLifecycleEvents

```java
ServerLifecycleEvents.SERVER_STARTED.register(server -> {
    System.out.println("Server started: " + server.getWorld(World.OVERWORLD).getWorldInfo().getWorldName());
});

ServerLifecycleEvents.SERVER_STOPPING.register(server -> {
    System.out.println("Server stopping...");
});
```

## 常见错误

- ❌ `EventCallback` 注册在非 static 字段上 — 回调不会被注册
- ❌ 在 `onInitialize()` 外注册事件 — 不会生效
- ❌ 在客户端处理服务端逻辑 — 使用 `world.isRemote` 区分
- ❌忘记处理 `ActionResult` — 返回值决定事件是否被"消费"

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-registry` | 事件处理中引用已注册的对象 |
| `mc-item` | ItemEvents 用于物品交互逻辑 |
| `mc-entity` | EntityEvents 用于实体行为修改 |
| `mc-networking` | 事件中发送网络包 |
