---
name: mc-item
description: Minecraft Forge 物品开发。创建物品、工具（剑/镐/斧）、盔甲、食物、附魔。触发词：物品、Item、ItemStack、Properties、Tier、SwordItem、DiggerItem、ArmorItem
platform: forge
version: "1.18.2"
dependencies: []
mappings: parchment
---

# 物品开发（Forge 1.18.2）

## 快速开始

```java
// 注册（参见 mc-registry Skill）
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Properties()
        .tab(CreativeModeTab.TAB_MISC)
        .stacksTo(64)
    )
);
```

## Decision: 选择物品类型

```
IF 只是手持物品（无特殊行为）
  → Item

IF 剑/工具（影响挖掘速度、攻击伤害）
  → SwordItem / PickaxeItem / AxeItem / ShovelItem（镐斧铲父类 DiggerItem）

IF 盔甲
  → ArmorItem + ArmorMaterial

IF 可食用
  → Item + .food(FoodProperties.Builder)

IF 可在创造模式标签中找到
  → 注册到 CreativeModeTab
```

## 工具层级 Tier

```java
public enum MyTier implements Tier {
    COPPER(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.of(Items.COPPER_INGOT));

    private final int level;
    private final int uses;          // 耐久度
    private final float speed;        // 挖掘速度
    private final float damage;       // 攻击伤害加成（不含类型加成）
    private final int enchantment;
    private final Supplier<Ingredient> repair;

    MyTier(...) { ... }

    @Override public int getLevel() { return level; }
    @Override public int getUses() { return uses; }
    @Override public float getSpeed() { return speed; }
    @Override public float getAttackDamageBonus() { return damage; }
    @Override public int getEnchantmentValue() { return enchantment; }
    @Override public Ingredient getRepairIngredient() { return repair.get(); }
}
```

## 剑（SwordItem）

```java
// 正确：4 参数构造函数
// 参数：(Tier tier, int attackDamageModifier, float attackSpeedModifier, Properties)
public static final RegistryObject<Item> COPPER_SWORD = ITEMS.register("copper_sword",
    () -> new SwordItem(MyTier.COPPER, 3, -2.4f, new Properties()
        .tab(CreativeModeTab.TAB_COMBAT)
        .durability(1561)
    )
);
```

**攻击伤害计算：**
- `attackDamageModifier` 是基础加成（内部转为 float）
- **最终攻击伤害 = attackDamageModifier + 3.0f（剑类内置固定加成）**
- 例如：传 `3` → 最终伤害 = 3 + 3.0 = **6.0**

**攻击速度构造参数：** 原版铁/钻石剑是 `-2.4f`（HUD 显示约 1.6 次/秒，不要把显示值写进构造函数）

## 镐（PickaxeItem；父类是 DiggerItem）

```java
// PickaxeItem(Tier, int attackDamageModifier, float attackSpeedModifier, Properties)
public static final RegistryObject<Item> COPPER_PICKAXE = ITEMS.register("copper_pickaxe",
    () -> new PickaxeItem(MyTier.COPPER, 1, -2.8f,
        new Properties().tab(CreativeModeTab.TAB_TOOLS))
);
```

## 盔甲

```java
public enum MyArmorMaterial implements ArmorMaterial {
    COPPER("copper", 40, new int[]{4, 7, 9, 4}, 20,
        SoundEvents.ARMOR_EQUIP_IRON, 0.0f, 0.0f, () -> Ingredient.of(Items.COPPER_INGOT));

    // 格式：new int[]{ boots, leggings, chestplate, helmet }
}

// 注册各部位
public static final RegistryObject<Item> COPPER_HELMET = ITEMS.register("copper_helmet",
    () -> new ArmorItem(MyArmorMaterial.COPPER, EquipmentSlot.HEAD,
        new Properties().tab(CreativeModeTab.TAB_COMBAT))
);
```

## 食物

```java
public static final RegistryObject<Item> GOLDEN_APPLE = ITEMS.register("golden_apple",
    () -> new Item(new Properties()
        .tab(CreativeModeTab.TAB_FOOD)
        .food(new FoodProperties.Builder()
            .nutrition(4)
            .saturationMod(1.2f)
            .effect(new MobEffectInstance(MobEffects.REGENERATION, 100, 1), 1.0f)
            .effect(new MobEffectInstance(MobEffects.ABSORPTION, 2400, 0), 1.0f)
            .alwaysEat()       // 饱食也能吃
            .fast()            // 快速食用
            .meat()            // 肉类（可喂食狼）
            .build())
        )
    )
);
```

## hurtAndBreak（工具耐久损耗）

在 `hurtEnemy()` 或 `inventoryTick()` 中正确处理耐久：

```java
@Override
public boolean hurtEnemy(ItemStack stack, LivingEntity target, LivingEntity attacker) {
    // ✅ Parchment：hurtAndBreak(int, LivingEntity, Consumer<LivingEntity>)
    stack.hurtAndBreak(1, attacker, e -> e.broadcastBreakEvent(EquipmentSlot.MAINHAND));
    return true;
}
```

## 常见错误

- ❌ `SwordItem(Tier, Properties)` — Forge 1.18.2 **只有 4 参数版本**，不存在 2 参数版本
- ❌ `SwordItem(Tier, float attackDamage, float attackSpeed, Properties)` — `attackDamage` 类型应为 `int`，不是 `float`
- ❌ `Tier.getAttackDamageBonus()` 返回值含工具类型加成（剑已内置 +3.0f）
- ❌ 忘记 `durability` 在 Properties 中设置（默认 Integer.MAX_VALUE）
- ❌ `hurtAndBreak` 第三参是 `Consumer<LivingEntity>`，不要写成槽位 lambda；破碎回调用 `broadcastBreakEvent`

## 参考资料

- 详细示例：参见 `03-item.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 物品通过 DeferredRegister 注册，BlockItem 需要方块引用 |
| `mc-datagen` | 物品注册后可生成物品模型 JSON |
| `mc-capability` | 物品可附加 Capability（initCapabilities） |
