# DeferredRegister 方块 + BlockItem（示范）

平台：Forge 1.20.1 · 依赖：mc-registry

```java
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);
public static final RegistryObject<Block> EXAMPLE = BLOCKS.register("example",
    () -> new Block(BlockBehaviour.Properties.of().mapColor(MapColor.STONE)));
public static final DeferredRegister<Item> ITEMS =
    DeferredRegister.create(ForgeRegistries.ITEMS, MOD_ID);
public static final RegistryObject<Item> EXAMPLE_ITEM = ITEMS.register("example",
    () -> new BlockItem(EXAMPLE.get(), new Item.Properties()));
```

常见坑：静态字段间互相 `.get()` → 见 `knowledge/antipatterns/registry.md`。
