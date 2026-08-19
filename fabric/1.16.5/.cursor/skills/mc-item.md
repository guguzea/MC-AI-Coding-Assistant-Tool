---
name: mc-item
description: Fabric 物品开发。Item.Settings、Item、FoodComponent、ToolMaterial。触发词：物品、Item、ItemStack、ToolMaterial、FoodComponent
platform: fabric
version: "1.16.5"
dependencies: []
mappings: yarn
---

# 物品开发（Fabric 1.16.5）

Yarn 工具父类是 `MiningToolItem`。`ToolMaterial#getMiningSpeedMultiplier`。1.16.5 没有铜锭、没有 `DiggerItem`、没有 `TagKey`。

## 快速开始

```java
private static final Item MY_ITEM = Registry.register(
    Registry.ITEM,
    new Identifier(MOD_ID, "my_item"),
    new Item(new Item.Settings().maxCount(64))
);
```

## Decision: 选择物品类型

```
IF 普通物品（无特殊行为）
  → new Item(new Item.Settings())

IF 食物
  → new Item(new Item.Settings().food(new FoodComponent.Builder()...build()))

IF 工具（剑/镐）
  → SwordItem / PickaxeItem（父类 MiningToolItem）

IF 可耐久
  → 设置 maxDamage

IF 自定义行为
  → 继承 Item 并重写 use()、useOnBlock()、useOnEntity()
```

## 食物

```java
private static final Item MY_APPLE = Registry.register(
    Registry.ITEM,
    new Identifier(MOD_ID, "golden_apple"),
    new Item(new Item.Settings()
        .food(new FoodComponent.Builder()
            .hunger(4)
            .saturationModifier(1.2f)
            .statusEffect(
                new StatusEffectInstance(StatusEffects.REGENERATION, 100, 1),
                1.0f
            )
            .alwaysEdible()
            .snack()
            .build())
        .maxCount(64))
);
```

## 工具

```java
public enum MyToolMaterial implements ToolMaterial {
    IRON_LIKE(2, 250, 6.0f, 2.0f, 14, Ingredient.ofItems(Items.IRON_INGOT));

    private final int miningLevel;
    private final int itemDurability;
    private final float miningSpeed;
    private final float attackDamage;
    private final int enchantability;
    private final Ingredient repairIngredient;

    MyToolMaterial(int miningLevel, int itemDurability, float miningSpeed,
                   float attackDamage, int enchantability, Ingredient repairIngredient) {
        this.miningLevel = miningLevel;
        this.itemDurability = itemDurability;
        this.miningSpeed = miningSpeed;
        this.attackDamage = attackDamage;
        this.enchantability = enchantability;
        this.repairIngredient = repairIngredient;
    }

    @Override public int getMiningLevel() { return miningLevel; }
    @Override public int getDurability() { return itemDurability; }
    @Override public float getMiningSpeedMultiplier() { return miningSpeed; }
    @Override public float getAttackDamage() { return attackDamage; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairIngredient() { return repairIngredient; }
}
```

镐加入 `data/fabric/tags/items/pickaxes.json`（[wiki](https://wiki.fabricmc.net/tutorial:1.1x-1.17:mining_levels)）。

## 自定义物品行为

```java
public class MySpecialItem extends Item {
    public MySpecialItem(Settings settings) {
        super(settings);
    }

    @Override
    public TypedActionResult<ItemStack> use(World world, PlayerEntity player, Hand hand) {
        if (!world.isClient) {
            player.getStackInHand(hand).damage(1, player,
                (p) -> p.sendToolBreakStatus(hand));
        }
        return TypedActionResult.success(player.getStackInHand(hand));
    }
}
```

## 常见错误

- ❌忘记注册 Item — 物品不会出现在游戏中
- ❌耐久物品忘记设置 `maxDamage` — 无法消耗耐久
- ❌ FoodComponent.Builder 忘记 `.hunger()` — 食物不会被消耗
- ❌ `DiggerItem` / `getItemStack` / `Ingredient.of` / `TagKey` / 铜锭

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 物品通过 Registry.register() 注册 |
| `mc-datagen` | DataGen 生成物品模型 JSON |
| `mc-block` | BlockItem 关联方块 |
