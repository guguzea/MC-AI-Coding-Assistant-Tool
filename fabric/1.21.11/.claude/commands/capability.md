# Fabric Attachment API / 实体事件命令参考

> 本文件描述 Fabric 1.21.11 平台上的 Attachment API 和实体事件系统。
> ⚠️ **1.21.x 已移除旧版 Capability API，统一使用 Attachment API。**

## Attachment API 概述

**Attachment** 是 Minecraft 1.21 / Fabric 1.21.x 引入的官方 API，用于为实体、物品等附加自定义数据。它完全替代了旧的 Capability 系统。

### 注册 Attachment

```java
// Attachment Key 在 static 初始化中注册
public static final Key<MyData> MY_DATA = Key.create(
    Registries.ATTACHMENT_TYPE,
    new Identifier(MOD_ID, "my_data")
);

// 直接存储简单类型
public static final Key<Integer> KILL_COUNT = Key.create(
    Registries.ATTACHMENT_TYPE,
    new Identifier(MOD_ID, "kill_count")
);

public static final Key<Boolean> HAS_SPECIAL_EFFECT = Key.create(
    Registries.ATTACHMENT_TYPE,
    new Identifier(MOD_ID, "has_special_effect")
);
```

### 使用 Attachment

```java
// 读取数据
MyData data = entity.getData(MyAttachments.MY_DATA);

// 写入数据
entity.setData(MyAttachments.MY_DATA, newData);

// 简单类型
int kills = entity.getData(MyAttachments.KILL_COUNT);
entity.setData(MyAttachments.KILL_COUNT, kills + 1);
```

## 实体事件系统

Fabric 事件使用 `Event` 回调模式，在 `onInitialize()` 阶段注册。

### EntityEvent 实体事件

```java
// 实体 Tick 事件
EntityEvents.TICK.register((entity) -> {
    if (entity instanceof PlayerEntity player) {
        // 每 tick 执行
    }
    return EntityEvents.TickResult.CONTINUE;
});

// 实体死亡事件
EntityEvents.DEATH.register((entity, source) -> {
    if (entity instanceof PlayerEntity) {
        LOGGER.info("Player died");
    }
    return EntityEvents.DeathResult.ALLOW;
});

// 实体受伤事件
EntityEvents.ENTITY_HURT.register((entity, source, amount, flag) -> {
    if (entity instanceof PlayerEntity && amount > 5.0f) {
        // 玩家受伤超过5点时触发
    }
    return amount;  // 可以修改返回值改变伤害值
});
```

### PlayerBlockBreakEvents 方块破坏事件

```java
PlayerBlockBreakEvents.BEFORE.register((world, player, pos, state, blockEntity) -> {
    if (state.isOf(Blocks.DIAMOND_ORE)) {
        return false;  // 阻止挖掘钻石矿
    }
    return true;  // 允许破坏
});

PlayerBlockBreakEvents.AFTER.register((world, player, pos, state, blockEntity) -> {
    if (state.isOf(Blocks.GRASS)) {
        world.setBlockState(pos, Blocks.DIRT.getDefaultState());
    }
});
```

### EntityMountEvents 实体骑乘事件

```java
EntityMountEvents.MOUNTING.register((entity, vehicle, world) -> {
    // 实体开始骑乘
    return true;  // 返回 false 阻止骑乘
});

EntityMountEvents.DISMOUNTING.register((entity, vehicle, world) -> {
    // 实体卸载
});
```

### LivingEntityEvents 生命实体事件

```java
LivingEntityEvents.USE_ITEM_START.register((entity, stack, hand, duration) -> {
    // entity 开始使用 stack（持续性物品如弓）
});

LivingEntityEvents.USE_ITEM_STOP.register((entity, stack, hand, duration) -> {
    // entity 停止使用 stack
});

LivingEntityEvents.USE_ITEM_TICK.register((entity, stack, hand, duration) -> {
    // 每 tick 调用，用于弓的拉弓逻辑
});
```

## 方块事件

### BlockEvents 方块事件

```java
BlockEvents.BEFORE_PLACE.register((world, pos, state, player, hand, itemStack, hitResult) -> {
    if (pos.getY() < world.getBottomY()) {
        return false;  // 阻止在世界底部以下放置
    }
    return true;
});

BlockEvents.BLOCK_NEIGHBOR_UPDATE.register((world, pos, state, sourceBlock, sourcePos, notify) -> {
    // 邻居方块变化时触发
});
```

### BlockInteractionEvents 方块交互

```java
BlockInteractionEvents.RIGHT_CLICK_BLOCK.register((player, world, hand, hitResult) -> {
    BlockPos pos = hitResult.getBlockPos();
    BlockState state = world.getBlockState(pos);
    if (state.isOf(Blocks.CHEST)) {
        return ActionResult.SUCCESS;  // 消耗右键
    }
    return ActionResult.PASS;  // 不处理
});
```

## 物品事件

### ItemEvents 物品事件

```java
ItemEvents.USE_ON_ENTITY.register((player, entity, world, hand, itemStack) -> {
    if (entity instanceof ZombieEntity && !world.isClient) {
        // 对僵尸使用物品
    }
    return ActionResult.PASS;
});

ItemEvents.USE_BLOCK.register((player, world, hand, hitResult) -> {
    return ActionResult.PASS;
});

ItemEvents.USE_ITEM.register((player, world, hand) -> {
    ItemStack stack = player.getStackInHand(hand);
    if (stack.isOf(Items.DIAMOND)) {
        return ActionResult.SUCCESS;
    }
    return ActionResult.PASS;
});
```

## 服务端生命周期

### ServerLifecycleEvents 服务端事件

```java
ServerLifecycleEvents.SERVER_STARTING.register(server -> {
    LOGGER.info("Server starting: " + server.getName());
});

ServerLifecycleEvents.SERVER_STARTED.register(server -> {
    // 服务端完全启动
});

ServerLifecycleEvents.SERVER_STOPPING.register(server -> {
    // 服务端正在关闭
});

ServerLifecycleEvents.SERVER_STOPPED.register(server -> {
    // 服务端完全关闭
});
```

### ServerTickEvents 服务端 tick

```java
ServerTickEvents.END_SERVER_TICK.register(server -> {
    // 每服务端 tick 结束时执行
});
```

## 世界事件

### WorldEvents 世界事件

```java
WorldEvents.LOAD.register(world -> {
    if (!world.isClient) {
        // 服务端世界
    }
});

WorldEvents.UNLOAD.register(world -> {
    // 世界即将卸载
});
```

### ChunkEvents Chunk 事件

```java
ChunkEvents.CHUNK_LOAD.register((world, chunk) -> {
    // 区块加载
});

ChunkEvents.CHUNK_UNLOAD.register((world, chunk) -> {
    // 区块卸载
});
```

## 自定义事件

```java
public class MyCustomEvent {
    public static final Event<Callback> EVENT = EventFactory.createArrayBacked(
        Callback.class,
        callbacks -> (arg1, arg2) -> {
            for (Callback callback : callbacks) {
                callback.invoke(arg1, arg2);
            }
        }
    );
    
    @FunctionalInterface
    public interface Callback {
        void invoke(Arg1 arg1, Arg2 arg2);
    }
}

// 触发事件
MyCustomEvent.EVENT.invoker().invoke(arg1, arg2);
```

## 常见错误

- ❌ 使用旧的 `Capability<T>` 接口 — 1.21.x 已移除，改用 `Key.create()`
- ❌ 使用 `CapabilityProvider` 和 `getCapability()` — 改用 `entity.getData(KEY)`
- ❌ 在非主线程处理实体事件 — Minecraft 服务端是单线程
- ❌ 忘记 `return` 事件结果 — 部分事件需要返回 `ActionResult`
