# 版本迁移指南

## 从 1.19.x 迁移到 1.20.x

### RegistryObject → DeferredHolder

1.20.x 完全移除了 `RegistryObject`，统一使用 `DeferredHolder`：

```java
// 1.19.x
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item", Item::new);

// 1.20.x
public static final DeferredHolder<Item, Item> MY_ITEM = ITEMS.register("my_item", Item::new);
```

---

### BlockBehaviour 变化

`BlockBehaviour.Properties` 的链式调用 API 统一了：

```java
// 1.19.x
BlockBehaviour.Properties props = BlockBehaviour.Properties.of(Material.STONE)
    .strength(2.0f)
    .jumpFactor(1.5f);

// 1.20.x（完全相同）
BlockBehaviour.Properties props = BlockBehaviour.Properties.of(Material.STONE)
    .strength(2.0f)
    .jumpFactor(1.5f);
```

---

### Registry 变化

Vanilla 注册表位置变更：

```java
// 1.19.x
import net.minecraft.core.IRegistry;
IRegistry<SoundEvent> registry = IRegistry.SOUND_EVENT;

// 1.20.x
import net.minecraft.core.registries.Registries;
Holder<SoundEvent> holder =Registries.SOUND_EVENT.get(ResourceLocation.parse("minecraft:ambient.cave"));
```

---

## 从 1.18.x 迁移到 1.19.x

### Namespace 变化

数据包和资源包的 `namespace` 在 1.19.3 后改为严格检查小写：

```java
// 1.18.x（可能正常工作）
new ResourceLocation("MyMod:my_item")

// 1.19.x（必须小写）
new ResourceLocation("mymod:my_item")
```

---

### CreativeTab 变化

`CreativeModeTab` 重建为 Builder 模式：

```java
// 1.18.x
public static final CreativeModeTab MY_TAB = new CreativeModeTab("my_mod_tab") {
    @Override
    public ItemStack makeIcon() { return new ItemStack(MY_ITEM.get()); }
};

// 1.19.x+
public static final DeferredRegister<CreativeModeTab> CREATIVE_TABS =
    DeferredRegister.create(Registries.CREATIVE_MODE_TAB, MOD_ID);

public static final DeferredHolder<CreativeModeTab, CreativeModeTab> MY_TAB =
    CREATIVE_TABS.register("my_tab", () -> CreativeModeTab.builder()
        .title(Component.translatable("itemGroup." + MOD_ID + ".my_tab"))
        .icon(() -> new ItemStack(MY_ITEM.get()))
        .displayItems((parameters, output) -> {
            output.accept(MY_ITEM.get());
        })
        .build());
```

---

## 从 1.16.x 迁移到 1.18.x

### 注册系统变化

1.18 完全重建了注册系统：

```java
// 1.16.x
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Mod.EventBusSubscriber.Bus.MOD)
public static class Registry {
    @SubscribeEvent
    public static void registerBlocks(RegistryEvent.Register<Block> event) {
        event.getRegistry().register(new Block().setRegistryName(MOD_ID, "my_block"));
    }
}

// 1.18.x+
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(NeoForgeRegistries.BLOCKS, MOD_ID);

public static final DeferredHolder<Block, Block> MY_BLOCK =
    BLOCKS.register("my_block", () -> new Block(...));

public static void init(IEventBus modEventBus) {
    BLOCKS.register(modEventBus);
}
```

---

### 包名空间变化

1.18 将大量类移到了 `net.minecraft.*`：

```
// 1.16.x
net.minecraft.util.text.TextComponent
net.minecraft.util.math.BlockPos

// 1.18+
net.minecraft.network.chat.Component
net.minecraft.core.BlockPos
```

---

### 数据生成器完全重写

```java
// 1.16.x
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.MOD, value = Dist.DEDICATED_SERVER)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(new MyRecipeProvider(event.getGenerator()));
    }
}

// 1.18.x+
@Mod.EventBusSubscriber(modid = MOD_ID, bus = Bus.MOD, dist = Dist.DEDICATED_SERVER)
public class DataGenerators {
    @SubscribeEvent
    public static void gatherData(GatherDataEvent event) {
        event.getGenerator().addProvider(
            event.includeServer(),
            new MyRecipeProvider(event.getGenerator().getPackOutput())
        );
    }
}
```
