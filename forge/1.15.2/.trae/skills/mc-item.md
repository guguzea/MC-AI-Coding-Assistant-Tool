---
name: mc-item
description: Minecraft Forge 物品开发。创建物品、工具（剑/镐/斧）、盔甲、食物。触发词：物品、Item、ItemStack、Item.Properties、ITier、SwordItem、PickaxeItem、ArmorItem
platform: forge
version: "1.15.2"
dependencies: []
mappings: mcp
---

# 物品开发（Forge 1.15.2）

## 快速开始

```java
// 注册（参见 mc-registry Skill）
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties()
        .maxStackSize(64)
        .group(ItemGroup.MISC)
    )
);
```

## Decision: 选择物品类型

```
IF 只是手持物品（无特殊行为）
  → Item

IF 剑/工具（影响挖掘速度、攻击伤害）
  → SwordItem / PickaxeItem / AxeItem / ShovelItem

IF 盔甲
  → ArmorItem + IArmorMaterial

IF 可食用
  → Item + .food()

IF 可在创造模式标签中找到
  → 使用 .group(ItemGroup) 设置创造栏（官方文档方法名是 group，不是 tab）
```

## ITier

```java
public enum MyTier implements IItemTier {
    COPPER(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.fromItems(Items.DIAMOND));

    private final int level;
    private final int uses;
    private final float speed;
    private final float damage;
    private final int enchantment;
    private final Supplier<Ingredient> repair;

    MyTier(...) { ... }

    @Override public int getHarvestLevel() { return level; }
    @Override public int getMaxUses() { return uses; }
    @Override public float getEfficiency() { return speed; }
    @Override public float getAttackDamage() { return damage; }
    @Override public int getEnchantability() { return enchantment; }
    @Override public Ingredient getRepairMaterial() { return repair.get(); }
}
```

## 剑（SwordItem）

```java
// 正确：4 参数构造函数
// 参数：(IItemTier tier, int attackDamageIn, float attackSpeedIn, Item.Properties)
// 攻击伤害计算：attackDamageIn + 3.0f（剑的类型加成）
public static final RegistryObject<Item> COPPER_SWORD = ITEMS.register("copper_sword",
    () -> new SwordItem(MyTier.COPPER, 3, -2.4f, new Item.Properties()
        .group(ItemGroup.COMBAT)
    )
);
```

## 挖掘工具（PickaxeItem）

```java
// MCP：PickaxeItem(ITier, int attackDamage, float attackSpeed, Item.Properties)
// 镐斧铲父类是 ToolItem，没有 Mojmap DiggerItem
public static final RegistryObject<Item> IRON_LIKE_PICKAXE = ITEMS.register("iron_like_pickaxe",
    () -> new PickaxeItem(MyTier.COPPER, 1, -2.8f, new Item.Properties()
        .group(ItemGroup.TOOLS)
    )
);
```

## 盔甲

```java
public enum MyArmorMaterial implements IArmorMaterial {
    COPPER("copper", 40, new int[]{4, 7, 9, 4}, 20,
        SoundEvents.ITEM_ARMOR_EQUIP_IRON, 3.0f);

    // getDurability(), getDamageReductionAmount(), getEnchantability()
    // getSoundEvent(), getToughness(), getRepairMaterial(), getName()
    // 1.15.2 没有 getKnockbackResistance
}

// 注册各部位
public static final RegistryObject<Item> COPPER_HELMET = ITEMS.register("copper_helmet",
    () -> new ArmorItem(MyArmorMaterial.COPPER, EquipmentSlotType.HEAD,
        new Item.Properties().group(ItemGroup.COMBAT))
);
```

## 食物

```java
public static final RegistryObject<Item> GOLDEN_APPLE = ITEMS.register("golden_apple",
    () -> new Item(new Item.Properties()
        .group(ItemGroup.FOOD)
        .food(new Food.Builder()
            .hunger(4)
            .saturation(1.2f)
            .effect(() -> new EffectInstance(Effects.ABSORPTION, 2400, 0), 1.0f)
            .setAlwaysEdible()
            .fastToEat()
            .meat()
            .build())
        )
    )
);
```

## hurtAndBreak（工具耐久损耗）

在 `hitEntity()` 或 `onItemUse()` 中正确处理耐久：

```java
@Override
public boolean hitEntity(ItemStack stack, LivingEntity target, LivingEntity attacker) {
    // ✅ 正确：使用 lambda 接受装备槽位回调
    stack.damageItem(1, attacker, entity -> entity.sendBreakAnimation(EquipmentSlotType.MAINHAND));
    return true;
}
```

## 常见错误

- ❌ `SwordItem(Tier, Item.Properties)` — Forge 1.15.2 只有 4 参数版本，不存在 2 参数版本
- ❌ `Tier` 用法：Forge 用 `ITier`，不是 Fabric 的 `ToolMaterial`
- ❌ `MobEffects.JUMP` / `StatusEffects.JUMP_BOOST` → 1.15.2 MCP 用 `Effects.JUMP_BOOST`
- ❌ `.tab(CreativeModeTab)` → 官方文档是 `.group(ItemGroup)`
- ❌ `Food.Builder.alwaysEat()` / `fast()` → `setAlwaysEdible()` / `fastToEat()`

## 参考资料

- 详细示例：参见 `03-item.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 物品通过 DeferredRegister 注册，BlockItem 需要方块引用 |
| `mc-datagen` | 物品注册后可生成物品模型 JSON |
| `mc-capability` | 物品可附加 Capability |
