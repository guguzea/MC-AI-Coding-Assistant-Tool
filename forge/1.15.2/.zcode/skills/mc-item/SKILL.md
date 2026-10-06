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
  → SwordItem / PickaxeItem / AxeItem / ShovelItem

IF 盔甲
  → ArmorItem + IArmorMaterial

IF 可食用
  → Item + .food()

IF 可在创造模式标签中找到
  → 使用 .tab(ItemGroup) 设置创造栏（本档 scaffold official 层名；.group/.maxStackSize 是 1.14.4 及更早 MCP 名）
```

## IItemTier

```java
public enum MyTier implements IItemTier {
    COPPER(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.of(Items.DIAMOND));

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
    @Override public Ingredient getRepairIngredient() { return repair.get(); }
}
```

## 剑（SwordItem）

```java
// 正确：4 参数构造函数
// 参数：(IItemTier tier, int attackDamageIn, float attackSpeedIn, Item.Properties)
// 攻击伤害计算：attackDamageIn + 3.0f（剑的类型加成）
public static final RegistryObject<Item> COPPER_SWORD = ITEMS.register("copper_sword",
    () -> new SwordItem(MyTier.COPPER, 3, -2.4f, new Item.Properties()
        .tab(ItemGroup.TAB_COMBAT)
    )
);
```

## 挖掘工具（PickaxeItem）

```java
// official 构件实证（javap @1.15.2 official 2026-10-05）：PickaxeItem(IItemTier, int, float, Item.Properties)；❌ ITier = MCP 层名
// 镐斧铲父类是 ToolItem，没有 Mojmap DiggerItem
public static final RegistryObject<Item> IRON_LIKE_PICKAXE = ITEMS.register("iron_like_pickaxe",
    () -> new PickaxeItem(MyTier.COPPER, 1, -2.8f, new Item.Properties()
        .tab(ItemGroup.TAB_TOOLS)
    )
);
```

## 盔甲

```java
public enum MyArmorMaterial implements IArmorMaterial {
    COPPER("copper", 40, new int[]{4, 7, 9, 4}, 20,
        SoundEvents.ARMOR_EQUIP_IRON, 3.0f);

    // getDurabilityForSlot(), getDefenseForSlot(), getEnchantmentValue()
    // getEquipSound(), getToughness(), getRepairIngredient(), getName()
    // 1.15.2 没有 getKnockbackResistance
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
            .effect(() -> new EffectInstance(Effects.ABSORPTION, 2400, 0), 1.0f)
            .alwaysEat()
            .fast()
            .meat()
            .build())
        )
    )
);
```

## hurtAndBreak（工具耐久损耗）

在 `hurtEnemy()` 或 `useOn()` 中正确处理耐久：

```java
@Override
public boolean hurtEnemy(ItemStack stack, LivingEntity target, LivingEntity attacker) {
    // ✅ 本档 official 构件实证面：hurtAndBreak + broadcastBreakEvent
    stack.hurtAndBreak(1, attacker, entity -> entity.broadcastBreakEvent(EquipmentSlotType.MAINHAND));
    return true;
}
```

## 常见错误

- ❌ `SwordItem(Tier, Item.Properties)` — Forge 1.15.2 只有 4 参数版本，不存在 2 参数版本
- ❌ `Tier` 用法：本档 1.15.2 用 `IItemTier`（`Tier` 是 1.17+ mojmap 名；165 official 构件仍为 `IItemTier`——2026-10-05 javap 实证），不是 Fabric 的 `ToolMaterial`
- ❌ `MobEffects` / `StatusEffects` / `Effects.JUMP_BOOST` → 本档 official 构件用 `Effects.JUMP`（类 `net.minecraft.potion.Effects`；`JUMP_BOOST` 是 1.16.5+ MCP/parchment 字段名，`MobEffects` 是 1.17+ mojmap 类名）
- ❌ `.group(ItemGroup.MISC)` / `.maxStackSize()` — 那是 1.14.4 及更早 MCP 层名；本档 scaffold official 用 `.tab(ItemGroup.TAB_MISC)` / `.stacksTo()`（真构件 javap 实证）
- ❌ `Food.Builder.setAlwaysEdible()` / `fastToEat()` / `hunger()` / `saturation()` — 那是 1.12–1.14 MCP 名；本档 official 构件是 `alwaysEat()` / `fast()` / `nutrition()` / `saturationMod()`（javap 实证）
- ❌ `stack.damageItem(...)` / `entity.sendBreakAnimation(...)` / `item.getUseAction(...)` / `onItemUse/onItemUseFinish` — 本档 official 构件分别是 `hurtAndBreak` / `broadcastBreakEvent` / `getUseAnimation` / `useOn` / `finishUsingItem`（javap 实证）

## 参考资料

- 详细示例：参见 `03-item.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 物品通过 DeferredRegister 注册，BlockItem 需要方块引用 |
| `mc-datagen` | 物品注册后可生成物品模型 JSON |
| `mc-capability` | 物品可附加 Capability |
