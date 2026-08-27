# 事件模式

## 基础事件监听

```java
@Mod.EventBusSubscriber(modid = ExampleMod.MOD_ID)
public class ModEvents {

    @SubscribeEvent
    public static void onPlayerJoin(PlayerLoggedInEvent event) {
        ExampleMod.logger.info("Player joined: " + event.player.getName());
    }

    @SubscribeEvent
    public static void onLivingDeath(LivingDeathEvent event) {
        if (event.getEntity().getEntityWorld().isRemote) return;
        // 服务端逻辑
        ExampleMod.logger.info("Entity died: " + event.getEntity().getName());
    }

    @SubscribeEvent
    public static void onBlockBreak(BlockEvent.BreakEvent event) {
        if (event.getWorld().isRemote) return;
        // 检查条件等
    }
}
```

## RegistryEvent

```java
@Mod.EventBusSubscriber(modid = ExampleMod.MOD_ID)
public class ModRegistry {

    @SubscribeEvent
    public static void registerBlocks(RegistryEvent.Register<Block> event) {
        event.getRegistry().registerAll(
            new MyBlock().setRegistryName(ExampleMod.MOD_ID, "my_block")
        );
    }

    @SubscribeEvent
    public static void registerItems(RegistryEvent.Register<Item> event) {
        event.getRegistry().registerAll(
            new ItemBlock(RegistryHandler.MY_BLOCK)
                .setRegistryName(ExampleMod.MOD_ID, "my_block")
        );
    }
}
```

## PlayerTickEvent（用于周期性逻辑）

```java
@Mod.EventBusSubscriber(modid = ExampleMod.MOD_ID)
public class PlayerTracker {

    @SubscribeEvent
    public static void onPlayerTick(PlayerTickEvent event) {
        if (event.phase != TickEvent.Phase.END) return;
        if (event.player.getEntityWorld().isRemote) return;

        // 每秒检查一次
        if (event.player.ticksExisted % 20 == 0) {
            // 检查玩家状态等
        }
    }
}
```

## AttachCapabilitiesEvent

```java
@Mod.EventBusSubscriber(modid = ExampleMod.MOD_ID)
public class CapabilityEvents {

    public static final ResourceLocation CAP_ID = new ResourceLocation(ExampleMod.MOD_ID, "my_cap");

    @SubscribeEvent
    public static void attachCapability(AttachCapabilitiesEvent<Entity> event) {
        if (event.getObject() instanceof EntityPlayer) {
            event.addCapability(CAP_ID, new ICapabilityProvider() {
                private final ICapabilitySerializable<NBTTagCompound> provider =
                    new MyCapabilityProvider();

                @Override
                public boolean hasCapability(Capability<?> capability, EnumFacing facing) {
                    return capability == MyCapability.CAP;
                }

                @Override
                public <T> T getCapability(Capability<T> capability, EnumFacing facing) {
                    return hasCapability(capability, facing) ? MyCapability.CAP.cast(provider) : null;
                }
            });
        }
    }
}
```

## FMLInitializationEvent 中的事件注册

```java
@Mod.EventBusSubscriber(modid = ExampleMod.MOD_ID)
public class FMLEvents {

    @SubscribeEvent
    public static void onInit(FMLInitializationEvent event) {
        // 1.12.2 使用 FMLInitializationEvent 注册
        MinecraftForge.EVENT_BUS.register(new ModEvents());
    }
}
```

## TickEvent（服务端周期性任务）

```java
@Mod.EventBusSubscriber(modid = ExampleMod.MOD_ID)
public class ServerTickHandler {

    private static int tickCounter = 0;

    @SubscribeEvent
    public static void onServerTick(TickEvent.ServerTickEvent event) {
        if (event.phase != TickEvent.Phase.END) return;

        tickCounter++;
        if (tickCounter % 200 == 0) {  // 每 10 秒
            // 执行周期性任务
        }
    }
}
```
