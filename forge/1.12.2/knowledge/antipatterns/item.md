# 物品/工具反模式

## 错误：把 1.14+ 的 `IItemTier` 抄进 1.12.2

**症状：** 找不到 `IItemTier` / `Ingredient.fromItems`

```java
// ❌ 本档没有 IItemTier
public enum MyTier implements IItemTier { ... }
```

**正确方案：** `Item.ToolMaterial` 是原版枚举；自定义用 `EnumHelper.addToolMaterial`

```java
public static final Item.ToolMaterial COPPER = EnumHelper.addToolMaterial(
    "COPPER", 2, 200, 5.0F, 1.5F, 10
);
```

---

## 错误：食物效果忘记调用 FoodStats

**症状：** 食物不恢复饥饿值

```java
// ❌ 错误
@Override
public ActionResult<ItemStack> onItemRightClick(...) {
    return new ActionResult<>(EnumActionResult.SUCCESS, stack); // 没有操作 FoodStats
}
```

**正确方案：**

```java
@Override
public ActionResult<ItemStack> onItemRightClick(World world, EntityPlayer player, EnumHand hand) {
    ItemStack stack = player.getHeldItem(hand);
    if (!player.getFoodStats().needFood()) {
        return new ActionResult<>(EnumActionResult.FAIL, stack);
    }
    player.getFoodStats().addStats(4, 0.3f);  // hunger, saturation
    stack.shrink(1);
    return new ActionResult<>(EnumActionResult.SUCCESS, stack);
}
```

---

## 错误：ItemBlock 未正确关联方块

**症状：** 物品栏显示物品但放置后不是对应方块

```java
// ❌ 方块和 ItemBlock 注册了不同的 registry name
event.getRegistry().register(new ItemBlock(Blocks.my_block)
    .setRegistryName(MOD_ID, "my_block_item")); // ❌ 名称不同

// ✅ 相同 registry name 自动关联
event.getRegistry().register(new ItemBlock(Blocks.my_block)
    .setRegistryName(MOD_ID, "my_block"));  // ✅ 相同名称
```
