# 方块开发命令

适用版本：Fabric 1.21.1

## 创建简单方块

### 基本方块注册

```java
private static final RegistrySupplier<Block> MY_BLOCK = Registry.register(
    Registries.BLOCK,
    new Identifier(MOD_ID, "my_block"),
    new Block(FabricBlockSettings.copyOf(Blocks.STONE).strength(1.5f))
);

private static final RegistrySupplier<Item> MY_BLOCK_ITEM = Registry.register(
    Registries.ITEM,
    new Identifier(MOD_ID, "my_block"),
    new BlockItem(MY_BLOCK.get(), new Item.Settings())
);
```

## 常见问题

### Q: 方块有模型但物品没有显示
A: 检查 BlockItem 是否注册，registry name 是否与方块完全一致。

### Q: 方块在世界中不显示
A: 检查是否在 onInitialize() 中注册，mod ID 是否正确。

### Q: 方块破坏不掉落物品
A: 检查是否需要 tool（如 .requiresTool()），或使用 dropsLike()。

## 相关文件

- rules/02-block.mdc
- rules/01-registry.mdc
