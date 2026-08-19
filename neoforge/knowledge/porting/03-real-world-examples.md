# 真实世界移植案例

## 案例 1：基础物品移植（Forge → NeoForge）

### Forge 版本

```java
package com.example.examplemod;

import net.minecraft.world.item.Item;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.event.fml.common.Mod;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    public static final String MOD_ID = "examplemod";

    public static final DeferredRegister<Item> ITEMS =
        DeferredRegister.create(ForgeRegistries.ITEMS, MOD_ID);

    public static final RegistryObject<Item> COPPER_INGOT = ITEMS.register("copper_ingot",
        () -> new Item(new Item.Properties().tab(CreativeModeTab.TAB_MISC)));

    public ExampleMod() {
        MinecraftForge.EVENT_BUS.register(this);
    }

    @SubscribeEvent
    public void commonSetup(net.minecraftforge.fml.event.lifecycle.FMLCommonSetupEvent event) {
        System.out.println("ExampleMod initialized");
    }
}
```

### NeoForge 版本

```java
package com.example.examplemod;

import net.minecraft.world.item.Item;
import net.minecraft.world.item.CreativeModeTab;
import net.neoforged.neoforge.common.NeoForge;
import net.neoforged.neoforge.eventbus.api.SubscribeEvent;
import net.neoforged.neoforge.registries.DeferredHolder;
import net.neoforged.neoforge.registries.DeferredRegister;
import net.neoforged.neoforge.registries.NeoForgeRegistries;

public class ExampleMod {
    public static final String MOD_ID = "examplemod";

    public static final DeferredRegister<Item> ITEMS =
        DeferredRegister.create(NeoForgeRegistries.ITEMS, MOD_ID);

    public static final DeferredHolder<Item, Item> COPPER_INGOT = ITEMS.register("copper_ingot",
        () -> new Item(new Item.Properties().stacksTo(64).tab(CreativeModeTab.TAB_MISC)));

    // 无 @Mod 注解，使用静态初始化方法
    public static void init(IEventBus modEventBus) {
        ITEMS.register(modEventBus);
        NeoForge.EVENT_BUS.register(ExampleMod.class);
    }

    @SubscribeEvent
    public static void commonSetup(net.neoforged.fml.event.lifecycle.FMLCommonSetupEvent event) {
        System.out.println("ExampleMod initialized");
    }
}
```

---

## 案例 2：方块 + BlockEntity（Forge → NeoForge）

### Forge 版本

```java
@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    // ... DeferredRegister setup ...

    public static final DeferredRegister<Block> BLOCKS =
        DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

    public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
        () -> new Block(BlockBehaviour.Properties.of(Material.STONE)));

    public static final RegistryObject<BlockEntityType<?>> MY_BLOCK_ENTITY =
        BlockEntities.register("my_block", () ->
            BlockEntityType.Builder.of(MyBlockEntity::new, MY_BLOCK.get()).build(null));
}
```

### NeoForge 版本

```java
public class ExampleMod {
    public static final String MOD_ID = "examplemod";

    public static final DeferredRegister<Block> BLOCKS =
        DeferredRegister.create(NeoForgeRegistries.BLOCKS, MOD_ID);

    public static final DeferredHolder<Block, Block> MY_BLOCK = BLOCKS.register("my_block",
        () -> new Block(BlockBehaviour.Properties.of(Material.STONE)));

    // 使用 NeoForgeRegistries.BLOCK_ENTITIES
    public static final DeferredRegister<BlockEntityType<?>> BLOCK_ENTITIES =
        DeferredRegister.create(NeoForgeRegistries.BLOCK_ENTITIES, MOD_ID);

    public static final DeferredHolder<BlockEntityType<?>, BlockEntityType<MyBlockEntity>> MY_BLOCK_ENTITY =
        BLOCK_ENTITIES.register("my_block", () ->
            BlockEntityType.Builder.of(MyBlockEntity::new, MY_BLOCK.get()).build(null));

    public static void init(IEventBus modEventBus) {
        BLOCKS.register(modEventBus);
        BLOCK_ENTITIES.register(modEventBus);
    }
}
```

---

## 案例 3：网络消息（Forge → NeoForge）

### Forge 版本

```java
public class MyMessage {
    private int value;
    // 构造函数、toBytes、fromBytes...
}

// 注册
private static final SimpleChannel CHANNEL = NetworkRegistry.newSimpleChannel(
    new ResourceLocation(MOD_ID, "main"),
    () -> VERSION,
    VERSION::equals,
    VERSION::equals
);

CHANNEL.registerMessage(0, MyMessage.class, MyMessage::toBytes, MyMessage::new,
    (msg, ctx) -> {
        ctx.get().enqueueWork(() -> handleMessage(msg, ctx.get()));
        ctx.get().setPacketHandled(true);
    });

// 发送
CHANNEL.sendToServer(new MyMessage(42));
```

### NeoForge 版本

**不要**只改包名继续用 `SimpleChannel`。1.21.1 官方是 `RegisterPayloadHandlersEvent` + `CustomPacketPayload`（https://docs.neoforged.net/docs/1.21.1/networking/payload/）。按 `neoforge/<精确版本>/.cursor/rules/06-networking.mdc` 写。

---

## 案例 4：Capability（Forge → NeoForge）

### Forge 版本

```java
public interface IEnergyStorage {
    int receiveEnergy(int maxReceive, boolean simulate);
    int extractEnergy(int maxExtract, boolean simulate);
    int getEnergyStored();
    int getMaxEnergyStored();
}

public static final Capability<IEnergyStorage> ENERGY_CAPABILITY = CapabilityManager.get(
    new ResourceLocation(MOD_ID, "energy"),
    () -> new EnergyStorage()
);

MinecraftForge.EVENT_BUS.addGenericListener(Entity.class, AttachCapabilitiesEvent.class, ...);
```

### NeoForge 版本

```java
// API 完全相同，仅包名变更
public interface IEnergyStorage { ... }

public static final Capability<IEnergyStorage> ENERGY_CAPABILITY = CapabilityManager.get(
    new ResourceLocation(MOD_ID, "energy"),
    () -> new EnergyStorage()
);

NeoForge.EVENT_BUS.addGenericListener(Entity.class, AttachCapabilitiesEvent.class, ...);
```

---

## 案例 5：数据生成器（Forge → NeoForge）

### Forge 版本

```java
public class ModRecipeProvider extends DataProvider {
    public ModRecipeProvider(PackOutput output) {
        super(output);
    }

    @Override
    protected void buildRecipes() {
        ShapedRecipeBuilder.shaped(ExampleMod.COPPER_INGOT.get(), 1)
            .pattern("###")
            .pattern("#X#")
            .define('#', Items.COPPER_INGOT)
            .define('X', Items.DIAMOND)
            .save(consumer);
    }
}

@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.MOD, dist = Dist.DEDICATED_SERVER)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeServer(),
            new ModRecipeProvider(event.getGenerator().getPackOutput())
        );
    }
}
```

### NeoForge 版本

```java
// API 完全相同，仅包名变更
public class ModRecipeProvider extends DataProvider {
    public ModRecipeProvider(PackOutput output) {
        super(output);
    }

    @Override
    protected void buildRecipes() {
        ShapedRecipeBuilder.shaped(ExampleMod.COPPER_INGOT.get(), 1)
            .pattern("###")
            .pattern("#X#")
            .define('#', Items.COPPER_INGOT)
            .define('X', Items.DIAMOND)
            .save(consumer);
    }
}

@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.MOD, dist = Dist.DEDICATED_SERVER)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeServer(),
            new ModRecipeProvider(event.getGenerator().getPackOutput())
        );
    }
}
```
