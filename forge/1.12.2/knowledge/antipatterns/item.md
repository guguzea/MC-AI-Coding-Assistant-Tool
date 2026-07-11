# 物品/工具反模式

## 错误：ToolMaterial 接口方法不完整

**症状：** 编译错误，找不到方法

```java
// ❌ 错误
public enum MyTier implements IItemTier {
    COPPER(3, 1561, 8.0f, 3.0f, 15);

    @Override public int getMaxUses() { return durability; }
    // 缺少其他方法
}
```

**正确方案：** 实现所有 6 个方法

```java
public enum MyTier implements IItemTier {
    COPPER(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.fromItems(Items.DIAMOND));

    private final int harvestLevel;
    private final int maxUses;
    private final float efficiency;
    private final float damage;
    private final int enchantability;
    private final Supplier<Ingredient> repair;

    MyTier(...) { ... }

    @Override public int getMaxUses() { return maxUses; }
    @Override public float getEfficiency() { return efficiency; }
    @Override public float getAttackDamage() { return damage; }
    @Override public int getHarvestLevel() { return harvestLevel; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairMaterial() { return repair.get(); }
}
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
