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
        .group(CreativeModeTab.TAB_MISC)
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
  → 使用 .tab() 设置 CreativeModeTab
```

## ITier

```java
public enum MyTier implements ITier {
    COPPER(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.fromItems(Items.DIAMOND));

    private final int level;
    private final int uses;
    private final float speed;
    private final float damage;
    private final int enchantment;
    private final Supplier<Ingredient> repair;

    MyTier(...) { ... }

    @Override public int getLevel() { return level; }
    @Override public int getUses() { return uses; }
    @Override public float getSpeed() { return speed; }
    @Override public float getAttackDamageBonus() { return damage; }
    @Override public int getEnchantmentValue() { return enchantment; }
    @Override public Ingredient getRepairMaterial() { return repair.get(); }
}
```

## 剑（SwordItem）

```java
// 正确：4 参数构造函数
// 参数：(ITier tier, float attackDamage, float attackSpeed, Item.Properties)
// 攻击伤害计算：attackDamage + 3.0f（剑的类型加成）
public static final RegistryObject<Item> COPPER_SWORD = ITEMS.register("copper_sword",
    () -> new SwordItem(MyTier.COPPER, 3.0f, -2.4f, new Item.Properties()
        .group(CreativeModeTab.TAB_COMBAT)
    )
);
```

## 挖掘工具（DiggerItem）

```java
// 镐：public DiggerItem(float attackDamage, float attackSpeed, ITier tier, IItemTier, Properties)
// 斧：同 DiggerItem
public static final RegistryObject<Item> COPPER_PICKAXE = ITEMS.register("copper_pickaxe",
    () -> new PickaxeItem(MyTier.COPPER, 1.0f, -2.8f, new Item.Properties()
        .group(CreativeModeTab.TAB_TOOLS)
    )
);
```

## 盔甲

```java
public enum MyArmorMaterial implements IArmorMaterial {
    COPPER("copper", 40, new int[]{4, 7, 9, 4}, 20,
        SoundEvents.ARMOR_EQUIP_IRON, 3.0f, 0.1f);

    // 格式：new int[]{ boots, leggings, chestplate, helmet }
    // getDurability(), getDamageReductionAmount(), getEnchantability()
    // getEquipSound(), getToughness(), getKnockbackResistance(), getRepairMaterial()
}

// 注册各部位
public static final RegistryObject<Item> COPPER_HELMET = ITEMS.register("copper_helmet",
    () -> new ArmorItem(MyArmorMaterial.COPPER, EquipmentSlotType.HEAD,
        new Item.Properties().group(CreativeModeTab.TAB_COMBAT))
);
```

## 食物

```java
public static final RegistryObject<Item> GOLDEN_APPLE = ITEMS.register("golden_apple",
    () -> new Item(new Item.Properties()
        .group(CreativeModeTab.TAB_FOOD)
        .food(new Food.Builder()
            .hunger(4)
            .saturation(1.2f)
            .effect(() -> new MobEffectInstance(MobEffects.ABSORPTION, 2400, 0), 1.0f)
            .alwaysEat()
            .fast()
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
- ❌ `MobEffects.JUMP_BOOST`（Fabric Yarn 名）→ Forge 用 `MobEffects.JUMP`

## 参考资料

- 详细示例：参见 `03-item.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 物品通过 DeferredRegister 注册，BlockItem 需要方块引用 |
| `mc-datagen` | 物品注册后可生成物品模型 JSON |
| `mc-capability` | 物品可附加 Capability |
