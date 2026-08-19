---
name: mc-item
description: Minecraft Forge 物品开发。创建物品、工具（剑/镐/斧）、盔甲、食物、附魔。触发词：物品、Item、ItemStack、Item.Properties、IItemTier、SwordItem、PickaxeItem、ArmorItem
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# 物品开发（Forge 1.14.4）

MCP。没有铜锭。镐斧铲父类是 `ToolItem`，不要抄后期 Mojmap `DiggerItem`。创造栏用 `ItemGroup` + `Item.Properties.group()`。

## 快速开始

```java
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
  → SwordItem / PickaxeItem / AxeItem / ShovelItem（父类 ToolItem）

IF 盔甲
  → ArmorItem + IArmorMaterial

IF 可食用
  → Item + .food(Food.Builder)

IF 可在创造模式标签中找到
  → .group(ItemGroup)
```

## 工具层级 IItemTier

MCP 六方法：`getHarvestLevel` / `getMaxUses` / `getEfficiency` / `getAttackDamage` / `getEnchantability` / `getRepairMaterial`。修复用 `Ingredient.fromItems`。

```java
public enum MyTier implements IItemTier {
    IRON_LIKE(2, 250, 6.0f, 2.0f, 14, () -> Ingredient.fromItems(Items.IRON_INGOT));

    private final int harvestLevel;
    private final int maxUses;
    private final float efficiency;
    private final float attackDamage;
    private final int enchantability;
    private final Supplier<Ingredient> repair;

    MyTier(int harvestLevel, int maxUses, float efficiency, float attackDamage,
           int enchantability, Supplier<Ingredient> repair) {
        this.harvestLevel = harvestLevel;
        this.maxUses = maxUses;
        this.efficiency = efficiency;
        this.attackDamage = attackDamage;
        this.enchantability = enchantability;
        this.repair = repair;
    }

    @Override public int getHarvestLevel() { return harvestLevel; }
    @Override public int getMaxUses() { return maxUses; }
    @Override public float getEfficiency() { return efficiency; }
    @Override public float getAttackDamage() { return attackDamage; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairMaterial() { return repair.get(); }
}
```

## 剑（SwordItem）

```java
// MCP：SwordItem(IItemTier, int attackDamage, float attackSpeed, Item.Properties)
public static final RegistryObject<Item> IRON_LIKE_SWORD = ITEMS.register("iron_like_sword",
    () -> new SwordItem(MyTier.IRON_LIKE, 3, -2.4f, new Item.Properties()
        .group(ItemGroup.COMBAT)
        .defaultMaxDamage(250)
    )
);
```

## 挖掘工具（PickaxeItem）

```java
public static final RegistryObject<Item> IRON_LIKE_PICKAXE = ITEMS.register("iron_like_pickaxe",
    () -> new PickaxeItem(MyTier.IRON_LIKE, 1, -2.8f,
        new Item.Properties().group(ItemGroup.TOOLS))
);
```

## 盔甲

MCP 用 `IArmorMaterial` + `ArmorItem(..., EquipmentSlotType, Properties)`。不要抄 1.19+ 的 `ArmorItem.Type`。构造参数以 `03-item.mdc` 和 MCP `IArmorMaterial` 为准（1.14 还没有击退抗性那一档）。

## 食物

见 `03-item.mdc` 的 `Food.Builder`。饱食也能吃用 `setAlwaysEdible()`（不是 `alwaysEat()`）。效果用 `effect(EffectInstance, float)`，没有 Supplier 重载。

## 耐久

1.14.4 用 `ItemStack.damageItem`，不要抄后期 `hurtAndBreak`。

```java
@Override
public boolean hitEntity(ItemStack stack, LivingEntity target, LivingEntity attacker) {
    stack.damageItem(1, attacker, entity -> entity.sendBreakAnimation(EquipmentSlotType.MAINHAND));
    return true;
}
```

## 常见错误

- ❌ 抄 1.19+ `Item.Properties.stacksTo` / `CreativeModeTab` / `DiggerItem` / `ArmorItem.Type`
- ❌ `Items.COPPER_INGOT`（1.14.4 没有铜）
- ❌ `Ingredient.of`（本档 MCP 用 `fromItems`）
- ❌ Yarn `ToolMaterial` / `getStackInHand`

## 扩展点

| 配合 Skill | 协作说明 |
|-------------|-----------|
| `mc-registry` | 物品通过 DeferredRegister 注册，BlockItem 需要方块引用 |
| `mc-datagen` | 物品注册后可生成物品模型 JSON |
| `mc-capability` | 物品可附加 Capability |
