# 物品相关反模式

## ❌ ItemBlock 与方块 registry name 不一致

```java
// 方块注册
event.getRegistry().register(MY_BLOCK.setRegistryName(
    new ResourceLocation(MOD_ID, "my_block")
));

// ItemBlock 注册（错误）
event.getRegistry().register(MY_BLOCK_ITEM.setRegistryName(
    new ResourceLocation(MOD_ID, "my_block_item") // ❌ 名称不一致
));
```

**正确方案**：ItemBlock 与方块使用相同的 registry name

```java
event.getRegistry().register(MY_BLOCK_ITEM.setRegistryName(
    new ResourceLocation(MOD_ID, "my_block") // ✅ 相同名称
));
```

---

## ❌ 忘记 `.group()` 导致物品不在任何标签页

```java
// 错误
new Item.Properties()  // ❌ 没有 group，物品不会出现在创造模式
```

**正确方案**：始终设置 ItemGroup

```java
new Item.Properties()
    .group(ItemGroup.TAB_MISC)
```
