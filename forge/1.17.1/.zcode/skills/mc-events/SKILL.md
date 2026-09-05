---
name: mc-events
description: Minecraft Forge 事件系统。监听 Forge/FML 事件、@SubscribeEvent、物理端判断。触发词：事件、Event、@SubscribeEvent、FMLCommonSetupEvent、PlayerInteractEvent、LivingDeathEvent
platform: forge
version: "1.17.1"
dependencies: []
mappings: mcp
---

# 事件系统（Forge 1.17.1）

## 快速开始

所有事件处理方法必须标注 `@SubscribeEvent`：

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.FORGE)
public class ModEvents {

    @SubscribeEvent
    public static void onPlayerInteract(PlayerInteractEvent.RightClickBlock event) {
        // 玩家右键方块
        if (event.getLevel().isClientSide) return; // 确保服务端
    }
}
```

## Decision: 选择事件总线

```
IF 监听 Forge 原生事件（Registry、LivingDrops 等）
  → @Mod.EventBusSubscriber(bus = Bus.FORGE)

IF 监听 Mod 自定义事件
  → 手动 event.addListener(this::method)

IF 需要在 Mod 初始化时执行一次
  → FMLCommonSetupEvent（Bus.MOD）
```

## Decision: 选择正确的事件类

根据触发场景选择事件：

```
IF 监听玩家右键点击方块
  → PlayerInteractEvent.RightClickBlock
  → 注意：此事件仅在服务端触发

IF 监听生物死亡
  → LivingDeathEvent
  → 注意：此事件仅在服务端触发

IF 监听物品被使用完成（食物吃完等）
  → LivingEntityUseItemEvent.Stop / Finish

IF 监听实体掉落物品
  → LivingDropsEvent
  → 仅服务端

IF 监听玩家登录/登出
  → PlayerEvent.PlayerLoggedInEvent
  → PlayerEvent.PlayerLoggedOutEvent
  → PlayerEvent.PlayerRespawnEvent

IF 监听配方解锁（合成/烧炼/烟熏等）
  → ItemCraftedEvent（玩家完成合成时）
  → FurnaceSmeltEvent（物品被烧炼时）
  → 优先使用数据生成器注册配方，而非监听事件

IF 监听数据包加载
  → GatherDataEvent
  → 仅在 DataGenerator 运行期间

IF 监听 Tick（每帧逻辑）
  → TickEvent.ServerTickEvent / WorldTickEvent
  → 注意：不要在 Tick 中做重操作，会导致卡顿

IF 监听 Capability 附加
  → AttachCapabilitiesEvent<Entity / Block / Item / Chunk>

IF 监听服务端/客户端启动
  → FMLCommonSetupEvent
  → FMLClientSetupEvent

IF 监听 Registry 注册
  → RegistryEvent.Register<T>
  → 参考 01-registry.mdc
```

## 物理端判断（Dist）

**首选方案：使用 `DistExecutor` 判断物理端**

```java
// 客户端执行
DistExecutor.unsafeRunWhenOn(Dist.CLIENT, () -> () -> clientMethod());

// 服务端执行
DistExecutor.unsafeRunWhenOn(Dist.DEDICATED_SERVER, () -> () -> serverMethod());
```

**次选方案：`FMLEnvironment#dist`**

```java
if (FMLEnvironment.dist == Dist.CLIENT) {
    // 仅在客户端运行
}
```

> **注意**：`safe*` 变体在 Java 9+ 环境中有问题，**推荐始终使用 `unsafe*`**。

## 常用事件对照

| 需求 | 推荐事件 | 注意事项 |
|------|----------|----------|
| 玩家右键触发动作 | `PlayerInteractEvent` | 注意 `use` 方法的返回值 |
| 实体死亡时处理掉落 | `LivingDeathEvent` | 与 `LivingDropsEvent` 区分 |
| 修改方块掉落物 | `BlockEvent.BreakEvent` | 可用 `setExpToDrop()` 改变经验值 |
| 修改方块掉落列表 | `LivingDropsEvent` | 可操作 `getDrops()` 列表 |
| 添加合成配方 | `ItemCraftedEvent` 或数据生成器 | 优先用数据生成器 |
| 监听烧炼 | `FrmaceSmeltEvent` | 熔炉/烟熏炉烧炼时触发 |
| 监听药水效果 | `PotionEvent` | 多个子事件 |
| 监听实体生成 | `EntityJoinLevelEvent` | 注意不要做重操作 |
| 修改物品 NBT | `ItemCraftedEvent` 或 `AnvilUpdateEvent` | |

## 示例：FMLCommonSetupEvent（服务端初始化）

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.MOD)
public class ModSetup {
    @SubscribeEvent
    public static void onCommonSetup(FMLCommonSetupEvent event) {
        // 在这里注册属性（不是 Entity 构造函数）
        ModAttributes.registerAll();

        // 在这里设置网络消息
        NetworkHandler.register();

        // 任何仅运行一次的初始化逻辑
    }
}
```

## 示例：FMLClientSetupEvent（客户端初始化）

```java
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.MOD, value = Dist.CLIENT)
public class ClientSetup {
    @SubscribeEvent
    public static void onClientSetup(FMLClientSetupEvent event) {
        // KeyBinding 在 RegisterKeyMappingsEvent 中注册
    }

    @SubscribeEvent
    public static void registerBindings(RegisterKeyMappingsEvent event) {
        event.register(EXAMPLE_KEY_MAPPING.get());
    }
}
```

## 示例：Capability 附加事件

```java
@SubscribeEvent
public static void onAttachEntityCapabilities(AttachCapabilitiesEvent<Entity> event) {
    if (event.getObject() instanceof Player) {
        event.addCapability(
            new ResourceLocation(MOD_ID, "my_capability"),
            // ICapabilityProvider 是非泛型接口（addCapability 的第二参数就是裸类型）；要落盘就实现
            // ICapabilitySerializable<T extends Tag>，这里把类型实参取成 CompoundTag
            new ICapabilitySerializable<CompoundTag>() {
                private final MyCapability instance = new MyCapability();
                private final LazyOptional<MyCapability> opt = LazyOptional.of(() -> this.instance);

                // 双参 getCapability 是唯一的抽象方法；单参重载是 default，不用覆写
                @Override
                public <T> LazyOptional<T> getCapability(Capability<T> cap, Direction side) {
                    return cap == ExampleMod.MY_CAPABILITY ? this.opt.cast() : LazyOptional.empty();
                }

                @Override
                public CompoundTag serializeNBT() {
                    return this.instance.saveNBT();
                }

                @Override
                public void deserializeNBT(CompoundTag nbt) {
                    this.instance.loadNBT(nbt);
                }
            }
        );
    }
}
```

> **关键点**：`AttachCapabilitiesEvent` 的泛型只有 Entity / BlockEntity / ItemStack / Level / LevelChunk 五种，且不能更具体（要给 `Player` 附加也得订阅 `<Entity>` 再 `instanceof` 收窄）；每个只能附加一次（ID 唯一）。provider 生命周期结束时必须 `LazyOptional#invalidate`。

## 常见错误

- ❌ 在错误的事件总线监听：Forge 事件用 `Bus.FORGE`，Mod 事件用 `Bus.MOD`
- ❌ 在客户端线程修改服务端数据：始终检查 `isClientSide`
- ❌ 在 Tick 事件中做重操作：会导致游戏卡顿
- ❌ 忘记 `@SubscribeEvent` 注解：方法不会被调用

## 参考资料

- 详细示例：参见 `05-events.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | RegistryEvent 在总线注册阶段触发 |
| `mc-entity` | 实体事件（EntityJoinLevelEvent 等） |
| `mc-datagen` | GatherDataEvent 触发数据生成 |
| `mc-networking` | 事件可用于触发网络消息发送 |
