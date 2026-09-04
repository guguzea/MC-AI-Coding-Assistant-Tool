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
import net.minecraft.core.registries.Registries;
import net.neoforged.fml.common.Mod;
import net.neoforged.bus.api.IEventBus;

@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    public static final String MOD_ID = "examplemod";

    public static final DeferredRegister<Item> ITEMS =
        DeferredRegister.create(Registries.ITEM, MOD_ID);

    public static final DeferredHolder<Item, Item> COPPER_INGOT = ITEMS.register("copper_ingot",
        () -> new Item(new Item.Properties()));

    // 创造模式标签：NeoForge 用 BuildCreativeModeTabContentsEvent，不要用 Item.Properties().tab(...)

    public ExampleMod(IEventBus modBus) {
        ITEMS.register(modBus);
        NeoForge.EVENT_BUS.register(this);
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
@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    public static final String MOD_ID = "examplemod";

    public static final DeferredRegister<Block> BLOCKS =
        DeferredRegister.create(Registries.BLOCK, MOD_ID);

    public static final DeferredHolder<Block, Block> MY_BLOCK = BLOCKS.register("my_block",
        () -> new Block(BlockBehaviour.Properties.of().strength(1.5f)));

    public static final DeferredRegister<BlockEntityType<?>> BLOCK_ENTITIES =
        DeferredRegister.create(Registries.BLOCK_ENTITY_TYPE, MOD_ID);

    public static final DeferredHolder<BlockEntityType<?>, BlockEntityType<MyBlockEntity>> MY_BLOCK_ENTITY =
        BLOCK_ENTITIES.register("my_block", () ->
            BlockEntityType.Builder.of(MyBlockEntity::new, MY_BLOCK.get()).build(null));

    public ExampleMod(IEventBus modBus) {
        BLOCKS.register(modBus);
        BLOCK_ENTITIES.register(modBus);
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

### NeoForge 版本（1.20.4+ Data Attachments）

```java
public static final DeferredRegister<AttachmentType<EnergyStorage>> ENERGY =
    DeferredRegister.create(Registries.ATTACHMENT_TYPE, MOD_ID);

public static final Supplier<AttachmentType<EnergyStorage>> ENERGY_TYPE =
    ENERGY.register("energy", () -> AttachmentType.serializable(EnergyStorage::new));

// 读写
EnergyStorage storage = entity.getData(ENERGY_TYPE.get());
entity.setData(ENERGY_TYPE.get(), new EnergyStorage());
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

@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD, value = Dist.DEDICATED_SERVER)
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
public class ModRecipeProvider extends RecipeProvider {
    public ModRecipeProvider(HolderLookup.Provider registries, RecipeOutput output) {
        super(registries, output);
    }

    @Override
    protected void buildRecipes(RecipeOutput output) {
        ShapedRecipeBuilder.shaped(ExampleMod.COPPER_INGOT.get(), 1)
            .pattern("###")
            .pattern("#X#")
            .define('#', Items.COPPER_INGOT)
            .define('X', Items.DIAMOND)
            .save(output);
    }
}

@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.MOD, value = Dist.DEDICATED_SERVER)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeServer(),
            output -> new ModRecipeProvider(event.getLookupProvider(), output)
        );
    }
}
```
