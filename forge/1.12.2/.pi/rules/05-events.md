---
description: 05 — 事件系统
---

# 05 — 事件系统

> 适用版本：Forge 1.12.2

---

## 约束

### @SubscribeEvent 基础规范

- 所有事件处理方法必须标注 `@SubscribeEvent`
- 事件类必须在 `@EventBusSubscriber` 或手动注册到事件总线
- `bus` 属性决定事件总线：`EventBusSubscriber.Bus.FORGE`（默认）或 `EventBusSubscriber.Bus.MOD`

### 生命周期事件

| 事件 | 说明 |
|------|------|
| `FMLPreInitializationEvent` | 预初始化，加载配置 |
| `FMLInitializationEvent` | 初始化，注册物品方块 |
| `FMLPostInitializationEvent` | 后初始化，模组间交互 |

### @SideOnly 约束

**使用 Proxy 模式处理物理端分离**：

```java
@SideOnly(Side.CLIENT)
public class ClientProxy extends CommonProxy {
    @Override
    public void init() {
        // 客户端初始化
    }
}

public class CommonProxy {
    public void init() {
        // 通用初始化
    }
}
```

---

## Decision Flow

### Decision: 选择正确的事件类

根据触发场景选择事件：

```
IF 监听玩家右键点击方块
  → PlayerInteractEvent 右键变体
  → 注意：此事件仅在服务端触发

IF 监听生物死亡
  → LivingDeathEvent
  → 注意：此事件仅在服务端触发

IF 监听物品被使用完成（食物吃完等）
  → EntityJoinWorldEvent 或覆盖 Item 的 onFoodEaten

IF 监听实体掉落物品
  → LivingDropsEvent
  → 仅服务端

IF 监听玩家登录/登出
  → PlayerLoggedInEvent
  → PlayerLoggedOutEvent
  → PlayerRespawnEvent

IF 监听方块放置/破坏
  → BlockEvent.BreakEvent
  → BlockEvent.PlaceEvent

IF 监听配方解锁（合成/烧炼/烟熏等）
  → RegistryEvent.NewRegistry 或 RegistryEvent.Register<Recipe>

IF 监听 Tick（每帧逻辑）
  → TickEvent

IF 监听 Capability 附加
  → AttachCapabilitiesEvent<Entity / Block / Item>

IF 监听服务端/客户端启动
  → FMLPreInitializationEvent / FMLInitializationEvent / FMLPostInitializationEvent

IF 监听 Registry 注册
  → RegistryEvent.Register<T>
```

### Decision: 事件应在哪个物理端监听

```
IF 事件涉及世界修改（放置方块、生成实体）
  → 服务端处理
  → 确保在服务端线程

IF 事件涉及渲染、输入
  → 客户端处理
  → 使用 @SideOnly(Side.CLIENT)

IF 不确定
  → 优先考虑服务端处理（更安全）
```

### Decision: 常用事件选择对照

| 需求 | 推荐事件 | 注意事项 |
|------|----------|----------|
| 玩家右键触发动作 | `PlayerInteractEvent` | 注意 `use` 方法的返回值 |
| 实体死亡时处理掉落 | `LivingDeathEvent` | 与 `LivingDropsEvent` 区分 |
| 修改方块掉落物 | `BlockEvent.BreakEvent` | 可用 `setExpToDrop()` 改变经验值 |
| 修改方块掉落列表 | `LivingDropsEvent` | 可操作 `getDrops()` 列表 |
| 添加合成配方 | `RegistryEvent.Register<Recipe>` | 或在 @Init 中直接注册 |
| 监听烧炼 | `FurnaceFuelBurnTimeEvent` | 熔炉燃料燃烧时间 |
| 监听药水效果 | `PotionEvent` | 多个子事件 |
| 监听实体生成 | `LivingSpawnEvent` | |

---

## 示例：事件订阅类结构

```java
// init/ModEventSubscriber.java
@EventBusSubscriber(modid = ExampleMod.MODID, bus = EventBusSubscriber.Bus.FORGE)
public class ModEventSubscriber {

    @SubscribeEvent
    public static void onPlayerInteract(PlayerInteractEvent.RightClickBlock event) {
        // 玩家右键方块
        if (event.getWorld().isRemote) return; // 确保服务端
        // ...
    }

    @SubscribeEvent
    public static void onLivingDeath(LivingDeathEvent event) {
        // 生物死亡
        if (event.getEntity().world.isRemote) return;
        // ...
    }

    @SubscribeEvent
    public static void onPlayerLogin(PlayerLoggedInEvent event) {
        // 玩家登录
        // ...
    }
}
```

## 示例：生命周期事件（@Mod 类中）

```java
// ExampleMod.java
@Mod(ExampleMod.MODID)
public class ExampleMod {
    public static final String MODID = "examplemod";

    @Instance(ExampleMod.MODID)
    public static ExampleMod instance;

    @SidedProxy(clientSide = "com.example.mod.proxy.ClientProxy",
                 serverSide = "com.example.mod.proxy.CommonProxy")
    public static CommonProxy proxy;

    @EventHandler
    public void preInit(FMLPreInitializationEvent event) {
        // 预初始化：加载配置
        proxy.preInit(event);
    }

    @EventHandler
    public void init(FMLInitializationEvent event) {
        // 初始化：注册物品方块
        proxy.init(event);
    }

    @EventHandler
    public void postInit(FMLPostInitializationEvent event) {
        // 后初始化：模组间交互
        proxy.postInit(event);
    }
}
```

## 示例：Proxy 模式

```java
// proxy/CommonProxy.java
public class CommonProxy {
    public void preInit(FMLPreInitializationEvent event) {}

    public void init(FMLInitializationEvent event) {}

    public void postInit(FMLPostInitializationEvent event) {}
}
```

```java
// proxy/ClientProxy.java
@SideOnly(Side.CLIENT)
public class ClientProxy extends CommonProxy {
    @Override
    public void preInit(FMLPreInitializationEvent event) {
        super.preInit(event);
        // 客户端特有预初始化
    }

    @Override
    public void init(FMLInitializationEvent event) {
        super.init(event);
        // 客户端渲染器注册等
    }
}
```

## 示例：Capability 附加事件

```java
@SubscribeEvent
public static void onAttachEntityCapabilities(AttachCapabilitiesEvent<Entity> event) {
    if (event.getObject() instanceof EntityPlayer) {
        event.addCapability(
            new ResourceLocation(ExampleMod.MODID, "my_capability"),
            new ICapabilityProvider() {
                private final MyCapability instance = new MyCapability();

                @Override
                public boolean hasCapability(Capability<?> capability, EnumFacing facing) {
                    return capability == MY_CAPABILITY;
                }

                @Override
                public <T> T getCapability(Capability<T> capability, EnumFacing facing) {
                    if (capability == MY_CAPABILITY) {
                        return (T) instance;
                    }
                    return null;
                }

                @Override
                public NBTTagCompound serializeNBT() {
                    return instance.saveNBT();
                }

                @Override
                public void deserializeNBT(NBTTagCompound nbt) {
                    instance.loadNBT(nbt);
                }
            }
        );
    }
}
```

> 关键点：`AttachCapabilitiesEvent` 可以在 Entity、Block、Item 上附加 Capability，每个只能附加一次（ID 唯一）。
