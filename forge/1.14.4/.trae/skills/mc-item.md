---
name: mc-item
description: Minecraft Forge 物品开发。创建物品、工具（剑/镐/斧）、盔甲、食物、附魔。触发词：物品、Item、ItemStack、Item.Properties、ToolType、SwordItem、DiggerItem、ArmorItem
platform: forge
version: "1.14.4"
dependencies: []
mappings: mcp
---

# 物品开发（Forge 1.14.4）

## 快速开始

```java
// 注册（参见 mc-registry Skill）
public static final Item MY_ITEM = new Item(
    new Item.Properties()
        .maxStackSize(64)
        .group(ItemGroup.MISC)
);

// 注册方式（RegistryEvent）
@SubscribeEvent
public static void onItemsRegistry(final RegistryEvent.Register<Item> event) {
    event.getRegistry().register(
        MY_ITEM.setRegistryName(new ResourceLocation(MOD_ID, "my_item"))
    );
}
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
  → 使用 .group(ItemGroup.XXX)
```

## 工具层级 ToolType / ITier

```java
public enum MyTier implements ITier {
    COPPER(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.fromItems(Items.DIAMOND));

    private final int harvestLevel;
    private final int maxUses;
    private final float efficiency;
    private final float attackDamage;
    private final int enchantability;
    private final Ingredient repairMaterial;

    MyTier(...) { ... }

    @Override public int getHarvestLevel() { return harvestLevel; }
    @Override public float getEfficiency() { return efficiency; }
    @Override public float getAttackDamage() { return attackDamage; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairMaterial() { return repairMaterial; }
}
```

## 剑（SwordItem）

```java
// 参数：(Tier tier, float attackDamage, float attackSpeed, Item.Properties)
public static final Item COPPER_SWORD = new SwordItem(
    MyTier.COPPER, 3.0f, 1.6f,
    new Item.Properties().group(ItemGroup.COMBAT).maxDamage(1561)
);
```

**攻击伤害计算：**
- SwordItem 的 `attackDamage` 参数是**最终伤害**，不是加成
- 例如：传 `3.0f` → 最终伤害 = **3.0**（剑无内置加成）

**攻击速度参考值：** 钻石剑默认 1.6f

## 挖掘工具（DiggerItem）

```java
// 镐：public DiggerItem(float attackDamage, float attackSpeed, ITier, ToolType, Item.Properties)
public static final Item COPPER_PICKAXE = new PickaxeItem(
    MyTier.COPPER, 1.0f, -2.8f,
    ToolType.PICKAXE,
    new Item.Properties().group(ItemGroup.TOOLS)
);
```

## 盔甲

```java
public enum MyArmorMaterial implements IArmorMaterial {
    COPPER("copper", 40, new int[]{4, 7, 9, 4}, 20,
        SoundEvents.ITEM_ARMOR_EQUIP_IRON, 0.0f, 0.0f, () -> Ingredient.fromItems(Items.COPPER_INGOT));

    // getDurability(SlotType), getDamageReductionAmount(SlotType), getEnchantability(),
    // getEquipSound(), getToughness(), getKnockbackResistance(), getRepairMaterial()
}

// 注册各部位
public static final Item COPPER_HELMET = new ArmorItem(
    MyArmorMaterial.COPPER, EquipmentSlotType.HEAD,
    new Item.Properties().group(ItemGroup.COMBAT)
);
```

## 食物

```java
public static final Item GOLDEN_APPLE = new Item(
    new Item.Properties()
        .group(ItemGroup.FOOD)
        .food(new Food.Builder()
            .hunger(4)
            .saturation(1.2f)
            .effect(new EffectInstance(Effects.REGENERATION, 100, 1), 1.0f)
            .effect(new EffectInstance(Effects.ABSORPTION, 2400, 0), 1.0f)
            .alwaysEat()       // 不消耗饱食度
            .fast()            // 快速食用
            .meat()            // 肉类（可喂食狼）
            .build())
        )
);
```

## 常见错误

- ❌ `ToolType.PICKAXE` vs `ToolType.get("pickaxe")`：使用静态字段
- ❌ `SwordItem(Tier, Item.Properties)`：Forge 1.14.4 只有 3 参数版本（无内置加成）
- ❌ `Item.Properties.group()`：1.14.4 使用 `.group()`，不是 1.20.1 的 `BuildCreativeModeTabContentsEvent`
- ❌ `Effects.JUMP_BOOST`（1.20.1 名称）→ Forge 1.14.4 用 `Effects.JUMP`
- ❌ `MobEffects` vs `Effects`：注意包名不同

## 参考资料

- 详细示例：参见 `03-item.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 物品通过 RegistryEvent 注册，BlockItem 需要方块引用 |
| `mc-datagen` | 物品注册后可生成物品模型 JSON（手动） |
| `mc-capability` | 物品可附加 Capability |
