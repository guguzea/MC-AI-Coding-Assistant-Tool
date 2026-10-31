---
description: 01 — 注册（NeoForge 26.2）
---

# 01 — 注册（NeoForge 26.2）

> 证据类型：**官方 MDK 模板源码 + NeoForge 26.2 官方 sources jar**，不是 docs 正文（上游 `/docs/26.2/` 仍 404）。逐段出处见文内标注。

## DeferredRegister 工厂（`neoforge-26.2.0.93-sources.jar:net/neoforged/neoforge/registries/DeferredRegister.java` 实读）

| 工厂 | 返回 |
|---|---|
| `DeferredRegister.createBlocks(String modid)` | `DeferredRegister.Blocks` |
| `DeferredRegister.createItems(String modid)` | `DeferredRegister.Items` |
| `DeferredRegister.createEntities(String modid)` | `DeferredRegister.Entities` |
| `DeferredRegister.create(ResourceKey<? extends Registry<T>>, String)` | `DeferredRegister<T>` |
| `DeferredRegister.createDataComponents(ResourceKey<Registry<DataComponentType<?>>>, String)` | `DataComponents` |

注册本体两个重载：

```java
public <I extends T> DeferredHolder<T, I> register(String name, Supplier<? extends I> sup)
public <I extends T> DeferredHolder<T, I> register(String name, Function<Identifier, ? extends I> func)
```

## 三件套（`MDK-26.2-ModDevGradle@f31f90e7:ExampleMod.java:42-46`）

```java
public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(MODID);
public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(MODID);
public static final DeferredRegister<CreativeModeTab> CREATIVE_MODE_TABS =
    DeferredRegister.create(Registries.CREATIVE_MODE_TAB, MODID);
```

## 必须逐条挂到 mod 事件总线（同文件 `:73-77`）

```java
BLOCKS.register(modEventBus);
ITEMS.register(modEventBus);
CREATIVE_MODE_TABS.register(modEventBus);
```

漏挂 = 注册静默不生效（MDK 注释写「Register the Deferred Register to the mod event bus so blocks get registered」）。

## 方块 + 方块物品（同文件 `:49-51`）

```java
public static final DeferredBlock<Block> EXAMPLE_BLOCK =
    BLOCKS.registerSimpleBlock("example_block", p -> p.mapColor(MapColor.STONE));
public static final DeferredItem<BlockItem> EXAMPLE_BLOCK_ITEM =
    ITEMS.registerSimpleBlockItem("example_block", EXAMPLE_BLOCK);
```

`registerSimpleBlock` 的第二参是**属性修改器**（`Function<BlockBehaviour.Properties, ? extends Block>`），不是 `BlockBehaviour.Properties` 实例。

## 创造栏（同文件 `:58-64`）

```java
public static final DeferredHolder<CreativeModeTab, CreativeModeTab> EXAMPLE_TAB =
    CREATIVE_MODE_TABS.register("example_tab", () -> CreativeModeTab.builder()
        .title(Component.translatable("itemGroup.examplemod"))
        .withTabsBefore(CreativeModeTabs.COMBAT)
        .icon(() -> EXAMPLE_ITEM.get().getDefaultInstance())
        .displayItems((parameters, output) -> output.accept(EXAMPLE_ITEM.get()))
        .build());
```

自有 tab 用 `displayItems`；往**原版** tab 加东西用事件（见 05 的 `BuildCreativeModeTabContentsEvent`）。

## 禁止

- Forge 的 `DeferredRegister.create(ForgeRegistries.X, ID)` / `RegistryEvent.Register`
- `ResourceLocation`（26.x mojmap 是 `Identifier`；`register(String, Function<Identifier, …>)` 的入参就是它）
- 忘记 `X.register(modEventBus)`
