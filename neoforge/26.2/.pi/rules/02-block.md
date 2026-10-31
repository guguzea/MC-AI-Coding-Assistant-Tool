---
description: 02 — 方块（NeoForge 26.2）
---

# 02 — 方块（NeoForge 26.2）

> 证据类型：官方 MDK 模板源码 + NeoForge 26.2 sources jar（不是 docs 正文）。

## 简单方块（`MDK-26.2-ModDevGradle@f31f90e7:ExampleMod.java:49`）

```java
public static final DeferredBlock<Block> EXAMPLE_BLOCK =
    BLOCKS.registerSimpleBlock("example_block", p -> p.mapColor(MapColor.STONE));
```

`DeferredRegister.Blocks.registerSimpleBlock(String, UnaryOperator<BlockBehaviour.Properties>)` —— 第二参是**属性修改器**（`p -> p.mapColor(...)`），不是 `Properties` 实例。

## 自定义方块类（`DeferredRegister.java` 的 Blocks javadoc 示例）

```java
public static final DeferredBlock<SpecialRockBlock> SPECIAL_ROCK_BLOCK =
    BLOCKS.registerBlock("special_rock", p -> new SpecialRockBlock(p));
```

`registerBlock(String, Function<BlockBehaviour.Properties, ? extends Block>)`：要自己的 `Block` 子类时用它，不是 `registerSimpleBlock`。

> ⚠ 上面这段来自 sources jar 里 `DeferredRegister.Blocks` 的 **javadoc 示例**，不是 MDK 实际代码；`SpecialRockBlock(p)` 的构造器形态请以你自己的类为准。

## 方块实体（同 javadoc，**未在 MDK 实践**）

```java
public static final Supplier<BlockEntityType<RockBlockEntity>> ROCK_BLOCK_ENTITY =
    BLOCK_ENTITIES.register("rock", () -> BlockEntityType.Builder.of(RockBlockEntity::new, ROCK_BLOCK.get()).build());
```

- 该段同样是 javadoc 示例，`BlockEntityType.Builder.of(...)` 在 26.2 的实际签名**未单独核**（`BlockEntityType$Builder` 用 `javap` 可查，但本档没做）
- `BLOCK_ENTITIES` 是 `DeferredRegister.create(Registries.BLOCK_ENTITY_TYPE, MODID)`

## 方块物品（`ExampleMod.java:51`）

```java
public static final DeferredItem<BlockItem> EXAMPLE_BLOCK_ITEM =
    ITEMS.registerSimpleBlockItem("example_block", EXAMPLE_BLOCK);
```

## 属性面

MDK 只演示了 `p.mapColor(MapColor.STONE)`。其他 `BlockBehaviour.Properties` 方法（`strength` / `requiresCorrectToolForDrops` / `sound` …）本档**没有本版正文**可引，写之前用 IDE 补全或 `javap` 核 `BlockBehaviour$Properties`，不要按 1.21 记忆填。

## 禁止

- Forge 的 `Block.Properties.create(Material.ROCK)`（那是 javadoc 里残留的旧示例，26.2 的 MDK 用 `registerSimpleBlock` + 属性修改器）
- 只写 `BLOCKS.registerSimpleBlock(...)` 而忘记 `BLOCKS.register(modEventBus)`（见 01）
