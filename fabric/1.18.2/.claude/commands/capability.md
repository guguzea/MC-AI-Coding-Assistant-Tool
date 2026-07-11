# Fabric 实体事件/Capability 命令参考

本文件描述 Fabric 1.18.2 平台上进行实体事件处理和 Capability 系统开发时所需掌握的核心 API 和常用命令。

## Fabric 事件系统概述

Fabric 使用**事件回调**（Event Callback）模式，而非 Forge 的 `@SubscribeEvent` 注解模式。每个事件类型有自己独立的静态字段，开发者通过 `EventType.register()` 或 `EventType.register(callback)` 方法注册回调。事件回调在 `onInitialize()` 阶段注册，运行时由 Fabric 事件调度器调用。

## 玩家事件命令

### PlayerTickEvents 玩家 tick 命令

每游戏 tick 执行一次回调：

```java
// 在 onInitialize() 中注册
PlayerTickEvents.END.register(player -> {
    // 每个玩家每 tick 结束时执行
    if (player.isSprinting()) {
        // 疾跑时逻辑
    }
});

PlayerTickEvents.START.register(player -> {
    // 每个玩家每 tick 开始时执行
});
```

`START` 和 `END` 的区别在于执行时机，`END` 适合读取状态后的逻辑处理。

### PlayerBlockBreakEvents 方块破坏命令

监听玩家破坏方块的事件：

```java
PlayerBlockBreakEvents.BEFORE.register((world, player, pos, state, blockEntity) -> {
    // 方块破坏前
    // 返回 false 阻止破坏
    if (state.isOf(Blocks.DIAMOND_ORE)) {
        return false;  // 阻止挖掘钻石矿
    }
    return true;  // 允许破坏
});

PlayerBlockBreakEvents.AFTER.register((world, player, pos, state, blockEntity) -> {
    // 方块破坏后
    if (state.isOf(Blocks.GRASS)) {
        world.setBlockState(pos, Blocks.DIRT.getDefaultState());
    }
});
```

### PlayerChangedHandEvents 手切换命令

玩家切换主手/副手时触发：

```java
PlayerChangedHandEvents.register((player, hand) -> {
    // hand 是切换到的手（Hand.MAIN_HAND 或 Hand.OFF_HAND）
    ItemStack stack = player.getStackInHand(hand);
    // 处理切换逻辑
});
```

## 实体事件命令

### EntityEvents 实体事件命令

实体伤害和死亡事件：

```java
// 实体受伤事件
EntityEvents.ENTITY_HURT.register((entity, source, amount, flag) -> {
    if (entity instanceof PlayerEntity && amount > 5.0f) {
        // 玩家受伤超过5点时触发
    }
    return amount;  // 可以修改返回值改变伤害值
});

// 实体死亡事件
EntityEvents.ENTITY_DEATH.register((entity, source) -> {
    if (entity instanceof PlayerEntity) {
        // 玩家死亡时的逻辑
    }
    // 无返回值
});
```

### EntityMountEvents 实体骑乘命令

实体骑乘和卸载事件：

```java
EntityMountEvents.MOUNTING.register((entity, vehicle, world) -> {
    // 实体开始骑乘
    // entity: 骑乘者, vehicle: 被骑乘的实体
    return true;  // 返回 false 阻止骑乘
});

EntityMountEvents.DISMOUNTING.register((entity, vehicle, world) -> {
    // 实体卸载
});
```

### LivingEntityEvents 生命实体事件命令

`LivingEntityEvents` 提供更精细的实体事件：

```java
// 实体开始使用物品
LivingEntityEvents.USE_ITEM_START.register((entity, stack, hand, duration) -> {
    // entity 开始使用 stack（持续性物品如弓）
});

// 实体停止使用物品
LivingEntityEvents.USE_ITEM_STOP.register((entity, stack, hand, duration) -> {
    // entity 停止使用 stack
});

// 实体使用物品每 tick
LivingEntityEvents.USE_ITEM_TICK.register((entity, stack, hand, duration) -> {
    // 每 tick 调用，用于弓的拉弓逻辑
});
```

## 方块事件命令

### BlockEvents 方块事件命令

方块交互和放置/破坏事件：

```java
// 方块放置前
BlockEvents.BEFORE_PLACE.register((world, pos, state, player, hand, itemStack, hitResult) -> {
    if (pos.getY() < world.getBottomY()) {
        return false;  // 阻止在世界底部以下放置
    }
    return true;
});

// 方块更新
BlockEvents.BLOCK_NEIGHBOR_UPDATE.register((world, pos, state, sourceBlock, sourcePos, notify) -> {
    // 邻居方块变化时触发
});

// 方块实体创建
BlockEvents.BLOCK_ENTITY_READ.register((blockEntity, state, reader, offset, version) -> {
    // 从 NBT 读取 BlockEntity 时
});
```

### BlockInteractionEvents 方块交互命令

玩家与方块交互的事件（右键点击）：

```java
BlockInteractionEvents.RIGHT_CLICK_BLOCK.register((player, world, hand, hitResult) -> {
    BlockPos pos = hitResult.getBlockPos();
    BlockState state = world.getBlockState(pos);
    // 返回 ActionResult
    if (state.isOf(Blocks.CHEST)) {
        return ActionResult.SUCCESS;  // 消耗右键
    }
    return ActionResult.PASS;  // 不处理
});
```

## 物品事件命令

### ItemEvents 物品事件命令

物品使用相关事件：

```java
// 物品对实体使用
ItemEvents.USE_ON_ENTITY.register((player, entity, world, hand, itemStack) -> {
    if (entity instanceof ZombieEntity && !world.isClient) {
        // 对僵尸使用物品
    }
    return ActionResult.PASS;
});

// 物品对区块使用（右键空气时）
ItemEvents.USE_BLOCK.register((player, world, hand, hitResult) -> {
    return ActionResult.PASS;
});

// 物品使用
ItemEvents.USE_ITEM.register((player, world, hand) -> {
    ItemStack stack = player.getStackInHand(hand);
    if (stack.isOf(Items.DIAMOND)) {
        return ActionResult.SUCCESS;
    }
    return ActionResult.PASS;
});
```

## 服务端生命周期命令

### ServerLifecycleEvents 服务端事件命令

服务端启动和关闭事件：

```java
ServerLifecycleEvents.SERVER_STARTING.register(server -> {
    // 服务端正在启动
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

### ServerTickEvents 服务端 tick 命令

服务端每 tick 执行：

```java
ServerTickEvents.END_SERVER_TICK.register(server -> {
    // 每服务端 tick 结束时执行
    // 可以用于定时任务
});
```

## 世界事件命令

### WorldEvents 世界事件命令

世界加载和卸载事件：

```java
WorldEvents.LOAD.register(world -> {
    // 世界加载完成
    if (!world.isClient) {
        // 服务端世界
    }
});

WorldEvents.UNLOAD.register(world -> {
    // 世界即将卸载
});
```

### ChunkEvents Chunk 事件命令

区块加载和卸载事件：

```java
ChunkEvents.CHUNK_LOAD.register((world, chunk) -> {
    // 区块加载
});

ChunkEvents.CHUNK_UNLOAD.register((world, chunk) -> {
    // 区块卸载
});
```

## Fabric Capability 系统命令

Fabric 使用 `fabric-capability-api-v0` 提供类似 Forge Capability 的组件系统。

### CapabilityProvider 注册命令

实现 `CapabilityProvider` 接口为实体添加 Capability：

```java
public class MyCapabilityProvider implements CapabilityProvider<Entity> {
    private final MyData data = new MyData();
    
    @Override
    public <T> T getCapability(Capability<T> capability, Direction side) {
        if (capability == MY_CAPABILITY) {
            return MY_CAPABILITY.cast(data);
        }
        return null;
    }
    
    @Override
    public <T> boolean invalidateCapability(Capability<T> capability, Direction side) {
        return capability == MY_CAPABILITY;
    }
}
```

### Capability 声明命令

定义 Capability：

```java
public interface MyData {
    int getValue();
    void setValue(int value);
}

public static final Capability<MyData> MY_CAPABILITY = Capability.get(
    new Identifier(MOD_ID, "my_data")
);
```

### 附加 Capability 命令

通过 Mixin 或事件将 CapabilityProvider 附加到实体：

```java
// 在实体初始化时调用
entity.getDataTracker().startPatching(new MyCapabilityProvider());
```

## 自定义事件创建命令

Fabric 允许创建自定义事件类型：

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

## 事件优先级命令

Fabric 事件系统不直接支持优先级。如果需要按顺序执行，可以在回调内部使用计数器或状态机控制执行顺序。

## 事件取消命令

某些事件支持取消操作。返回 `ActionResult.FAIL` 或 `false` 通常表示取消操作。查看具体事件的返回类型确认是否支持取消。
