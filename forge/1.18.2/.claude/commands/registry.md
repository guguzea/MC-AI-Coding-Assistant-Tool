# Registry 注册系统（Forge 1.18.2）

## Decision: 选择注册方式

```
IF 注册方块/物品/实体 等
  → 使用 DeferredRegister<T> + RegistryObject<T>（推荐方式）

IF 注册自定义 Registry
  → 使用 DeferredRegister.create(ResourceKey) + makeRegistry()
```

## 常用注册表

| 注册内容 | ForgeRegistries 字段 |
|----------|---------------------|
| 方块 | `ForgeRegistries.BLOCKS` |
| 物品 | `ForgeRegistries.ITEMS` |
| 方块实体 | `ForgeRegistries.BLOCKENTITIES` |
| 实体类型 | `ForgeRegistries.ENTITYTYPES` |
| 生物群系 | `ForgeRegistries.BIOMES` |
| 声音事件 | `ForgeRegistries.SOUNDEVENTS` |

## 注册 ItemBlock

方块的 ItemBlock 与方块同名注册：

```java
public static final RegistryObject<Item> MY_BLOCK_ITEM = ITEMS.register("my_block",
    () -> new BlockItem(MY_BLOCK.get(), new Item.Properties())
);
```

## 常见错误

- ❌ 在 lambda 外引用 RegistryObject
- ❌ Registry 名称含大写或横杠
- ❌ mod ID 与 mods.toml 不一致

## 参考资料

参见 `01-registry.mdc`
