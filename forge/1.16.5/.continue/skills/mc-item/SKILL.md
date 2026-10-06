---
name: mc-item
description: Minecraft Forge 物品开发。创建物品、工具（剑/镐/斧）、盔甲、食物、附魔。触发词：物品、Item、ItemStack、Item.Properties、IItemTier、SwordItem、PickaxeItem、ArmorItem
platform: forge
version: "1.16.5"
dependencies: []
mappings: official
---

# 物品开发（Forge 1.16.5）

## 快速开始

```java
// 注册（参见 mc-registry Skill）
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties()
        .stacksTo(64)
        .tab(ItemGroup.TAB_MISC)
    )
);
```

## Decision: 选择物品类型

```
IF 只是手持物品（无特殊行为）
  → Item

IF 剑/工具（影响挖掘速度、攻击伤害）
  → SwordItem / PickaxeItem / AxeItem / ShovelItem（父类 ToolItem，不要 DiggerItem）

IF 盔甲
  → ArmorItem + IArmorTier

IF 可食用
  → Item + .food(Food.Builder)

IF 可在创造模式标签中找到
  → 注册到 ItemGroup（参见 mc-registry Skill）
```

## 工具层级 IItemTier

```java
public enum MyTier implements IItemTier {
    IRON_LIKE(2, 250, 6.0f, 2.0f, 14, () -> Ingredient.of(Items.IRON_INGOT)); // Ingredient.of：构件实证；❌ fromItems 是 1.14 MCP 名

    private final int level;
    private final int uses;          // 耐久度
    private final float speed;       // 挖掘速度
    private final float damage;      // 攻击伤害加成（不含类型加成）
    private final int enchantability;
    private final Supplier<Ingredient> repair;

    MyTier(...) { ... }

    @Override public int getLevel() { return level; }
    @Override public int getUses() { return uses; }
    @Override public float getSpeed() { return speed; }
    @Override public float getAttackDamageBonus() { return damage; }
    @Override public int getEnchantmentValue() { return enchantability; }
    @Override public Ingredient getRepairIngredient() { return repair.get(); }
}
```

## 剑（SwordItem）

```java
// 正确：4 参数构造函数（official 1.16.5 构件实证）
// 参数：(IItemTier tier, float attackSpeed, float damage, Item.Properties)
public static final RegistryObject<Item> IRON_LIKE_SWORD = ITEMS.register("iron_like_sword",
    () -> new SwordItem(MyTier.IRON_LIKE, 3, -2.4f, new Item.Properties()
        .tab(ItemGroup.TAB_COMBAT)
        .durability(250)
    )
);
```

**攻击伤害计算：**
- **最终攻击伤害 = SwordItem 内部基础伤害 + IItemTier.getAttackDamageBonus()**
- SwordItem 的 base damage 为 3.0f（剑类内置）
- 例如：`damage=3.0f` → 最终伤害 = 3.0f + 3.0f = **6.0**

## 挖掘工具（PickaxeItem）

```java
// official 1.16.5：PickaxeItem(IItemTier, int attackDamage, float attackSpeed, Item.Properties)
// 镐斧铲父类是 ToolItem（构件实证：ToolItem(float, float, IItemTier, Set<Block>, Properties)）
public static final RegistryObject<Item> IRON_LIKE_PICKAXE = ITEMS.register("iron_like_pickaxe",
    () -> new PickaxeItem(MyTier.IRON_LIKE, 1, -2.8f,
        new Item.Properties().tab(ItemGroup.TAB_TOOLS))
);
```

## 盔甲

```java
// 接口 = IArmorMaterial（构件实证点名；❌ IArmorTier 是 1.17+ 名，165 构件没有）。8 个实现方法：
// getDurabilityForSlot(EquipmentSlotType)/getDefenseForSlot(EquipmentSlotType)/getEnchantmentValue()/
// getEquipSound()/getRepairIngredient()/getName()/getToughness()/getKnockbackResistance()
public enum MyArmorMaterial implements IArmorMaterial {
    COPPER("copper", 40, new int[]{4, 7, 9, 4}, 20,
        SoundEvents.ARMOR_EQUIP_IRON, 3.0f, 0.1f, () -> Ingredient.of(Items.IRON_INGOT));

    // format: new int[]{ boots, leggings, chestplate, helmet }
    // durability multiplier, enchantability, toughness, knockback resistance
}

// 注册各部位
public static final RegistryObject<Item> COPPER_HELMET = ITEMS.register("copper_helmet",
    () -> new ArmorItem(MyArmorMaterial.COPPER, EquipmentSlotType.HEAD,
        new Item.Properties().tab(ItemGroup.TAB_COMBAT))
);
```

## 食物

```java
public static final RegistryObject<Item> GOLDEN_APPLE = ITEMS.register("golden_apple",
    () -> new Item(new Item.Properties()
        .tab(ItemGroup.TAB_FOOD)
        .food(new Food.Builder()
            .nutrition(4)
            .saturationMod(1.2f)
            // 类 = net.minecraft.potion.EffectInstance/Effects（构件实证；165 没有 MobEffectInstance/MobEffects，那是 1.17+ 改名）
            .effect(() -> new EffectInstance(Effects.ABSORPTION, 2400, 0), 1.0f)
            .alwaysEat()       // 不消耗饱食度
            .fast()            // 快速食用
            .meat()            // 肉类（可喂食狼）
            .build())
        )
    )
);
```

## hurtAndBreak（工具耐久损耗）

攻击命中时扣耐久。构件实证（javap Item/ItemStack/LivingEntity @1.16.5 official，2026-10-05）：
覆盖点是 `Item.hurtEnemy(ItemStack, LivingEntity, LivingEntity)`；`hurtAndBreak(int, T extends LivingEntity, Consumer<T>)` 与
`broadcastBreakEvent(EquipmentSlotType)` 在构件中。❌ `hurtItem(...DamageSource...)` 165 没有该覆盖点（1.17+ 才改名 `hurt`），
`getEquippedStack`/`hitEntity`/`damageItem` 同为错层名（本档槽位读法 = `getItemBySlot`）。

```java
@Override
public boolean hurtEnemy(ItemStack stack, LivingEntity target, LivingEntity attacker) {
    stack.hurtAndBreak(1, attacker, e -> e.broadcastBreakEvent(EquipmentSlotType.MAINHAND));
    return true;
}
```

## 常见错误

- ❌ `SwordItem(IItemTier, Item.Properties)` — Forge 1.16.5 **只有 4 参数版本**，不存在 2 参数版本
- ❌ `IItemTier.getAttackDamageBonus()` 返回值含工具类型加成（剑已内置 3.0f）
- ❌ 忘记 `.durability()` 在 Item.Properties 中设置（默认 Integer.MAX_VALUE）
- ❌ `MobEffects.JUMP_BOOST`（Fabric Yarn 名）→ Forge 1.16.5 用 `Effects.JUMP`（类 = `net.minecraft.potion.Effects`；构件实证：165 没有 `MobEffects`，那是 1.17+ 改名）

## 参考资料

- 详细示例：参见 `03-item.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 物品通过 DeferredRegister 注册，BlockItem 需要方块引用 |
| `mc-datagen` | 物品注册后可生成物品模型 JSON |
| `mc-capability` | 物品可附加 Capability |
