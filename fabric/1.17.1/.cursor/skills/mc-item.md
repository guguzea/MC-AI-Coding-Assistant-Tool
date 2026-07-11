---
name: mc-item
description: Fabric 物品开发。Item、FoodComponent、ToolMaterial。触发词：物品、Item、ItemStack、ToolMaterial、FoodComponent
platform: fabric
version: "1.17.1"
dependencies: []
mappings: yarn
---

# 物品开发（Fabric 1.17.1）

## 快速开始

```java
// ⚠️ 1.17.x 使用 Registry.ITEM，不是 Registries.ITEM
private static final Item MY_ITEM =
    Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_item"),
        new Item(new Item.Settings().maxCount(64)));
```

## Decision: 选择物品类型

```
IF 普通物品（无特殊行为）
  → new Item(new Item.Settings())

IF 食物
  → new Item(new Item.Settings().food(FoodComponent.Builder))

IF 工具（剑/镐）
  → 继承 SwordItem / PickaxeItem 等

IF 可耐久
  → 设置 maxDamage

IF 自定义行为
  → 继承 Item 并重写 use() 等方法
```

## 食物

```java
// ⚠️ 1.17.x FoodComponent 使用 .hunger(int) 和 .saturation(float)
private static final Item MY_APPLE =
    Registry.register(Registry.ITEM, new Identifier(MOD_ID, "golden_apple"),
        new Item(new Item.Settings()
            .food(new FoodComponent.Builder()
                .hunger(4)
                .saturation(1.2f)
                .alwaysEdible()
                .build())
            .maxCount(64)));
```

## 工具

```java
public enum MyToolMaterial implements ToolMaterial {
    COPPER(2, 250, 6.0f, 2.0f, 15,
        FabricToolTags.PICKAXES, () -> Items.COPPER_INGOT);

    private final int miningLevel;
    private final int itemDurability;
    private final float miningSpeed;
    private final float attackDamage;
    private final int enchantability;
    private final TagKey<Block> breakableBlocks;
    private final Supplier<Item> repairIngredient;

    MyToolMaterial(...) { ... }
    @Override public int getDurability() { return itemDurability; }
    @Override public float getMiningSpeed() { return miningSpeed; }
    @Override public float getAttackDamage() { return attackDamage + 1.0f; }
    @Override public int getMiningLevel() { return miningLevel; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairIngredient() { return Ingredient.of(repairIngredient.get()); }
}
```

## 自定义物品行为

```java
public class MySpecialItem extends Item {
    public MySpecialItem(Settings settings) {
        super(settings);
    }

    @Override
    public TypedActionResult<ItemStack> use(World world, PlayerEntity player, Hand hand) {
        if (!world.isClient) {
            player.getItemStack(hand).damage(1, player,
                (p) -> p.sendToolBreakStatus(hand));
        }
        return TypedActionResult.success(player.getItemStack(hand));
    }
}
```

## 常见错误

- ❌忘记注册 Item — 物品不会出现在游戏中
- ❌耐久物品忘记设置 `maxDamage` — 无法消耗耐久
- ❌ FoodComponent.Builder 忘记 `.hunger()` — 食物不会被消耗

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 物品通过 Registry.register() 注册 |
| `mc-datagen` | 手写物品模型 JSON |
| `mc-block` | BlockItem 关联方块 |
