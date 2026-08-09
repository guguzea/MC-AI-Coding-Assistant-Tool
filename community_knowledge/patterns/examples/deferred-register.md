# DeferredRegister：方块 + BlockItem

- **平台**：Forge 1.20.1（MCP/Parchment）
- **Skill**：`mc-registry` / `mc-block`
- **MCP**：`search_forge_docs`（DeferredRegister）、`generate_datagen`

```java
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MODID);
public static final DeferredRegister<Item> ITEMS =
    DeferredRegister.create(ForgeRegistries.ITEMS, MODID);

public static final RegistryObject<Block> EXAMPLE =
    BLOCKS.register("example_block", () -> new Block(BlockBehaviour.Properties.of()));
public static final RegistryObject<Item> EXAMPLE_ITEM =
    ITEMS.register("example_block", () -> new BlockItem(EXAMPLE.get(), new Item.Properties()));

// 主类构造：BLOCKS.register(bus); ITEMS.register(bus);
```

## 坑

- 禁止构造函数里 `new` 直接塞进原版 Registry
- BlockItem 注册名通常与方块同名
