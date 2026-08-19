---
name: mc-item
description: Fabric 物品开发。Item.Settings、Item、FoodComponent、ToolMaterial。触发词：物品、Item、ItemStack、ToolMaterial、FoodComponent
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---

# 物品开发（Fabric 1.21.11）

## 快速开始

```java
private static final Item MY_ITEM = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "my_item"),
    new Item(new Item.Settings().maxCount(64))
);
```

## Decision: 选择物品类型

```
IF 普通物品（无特殊行为）
  → new Item(new Item.Settings())

IF 食物
  → new Item(new Item.Settings().food(...))

IF 是工具（剑/镐）
  → new Item(ToolMaterial.IRON.applySwordSettings / applyToolSettings)
  → 不要 DiggerItem、不要编造 DurableToolItem、不要抄已删除的 SwordItem 类

IF 可耐久
  → 设置 maxDamage

IF 自定义行为
  → 继承 Item 并重写 use()、useOnBlock()、useOnEntity()
```

## 食物

`FoodComponent` 在 `net.minecraft.component.type`。Yarn 此档 Builder 有 `nutrition` / `saturationModifier` / `alwaysEdible` / `build`，**没有** `hunger`、`snack`、`statusEffect`。

```java
private static final Item MY_APPLE = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "golden_apple"),
    new Item(new Item.Settings()
        .food(new FoodComponent.Builder()
            .nutrition(4)
            .saturationModifier(1.2f)
            .alwaysEdible()
            .build())
        .maxCount(64))
);
```

## 工具

Yarn 1.21.11 **没有** `SwordItem.mapping`。`ToolMaterial` 是 record（`ToolMaterial.IRON` / `COPPER` 等）。用 `applySwordSettings` / `applyToolSettings` 配 `new Item(...)`。

```java
private static final Item IRON_SWORD = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "example_sword"),
    new Item(ToolMaterial.IRON.applySwordSettings(new Item.Settings(), 3.0f, -2.4f))
);

private static final Item IRON_PICKAXE = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "example_pickaxe"),
    new Item(ToolMaterial.IRON.applyToolSettings(
        new Item.Settings(), BlockTags.PICKAXE_MINEABLE, 1.0f, -2.8f, 0.0f))
);
```

自定义材质：`new ToolMaterial(incorrectBlocksForDrops, durability, speed, attackDamageBonus, enchantmentValue, repairItems)`，其中 `repairItems` 是 `TagKey<Item>`，不是 `Ingredient`。

## 自定义物品行为

Yarn 1.21.11 `Item#use` 返回 `ActionResult`（不再是 `TypedActionResult`）。

```java
public class MySpecialItem extends Item {
    public MySpecialItem(Settings settings) {
        super(settings);
    }

    @Override
    public ActionResult use(World world, PlayerEntity user, Hand hand) {
        return ActionResult.SUCCESS;
    }
}
```

## 常见错误

- ❌忘记注册 Item — 物品不会出现在游戏中
- ❌耐久物品忘记设置 `maxDamage` — 无法消耗耐久
- ❌ 食物 Builder 用错方法名
- ❌ `DiggerItem` / `getItemStack` / `Ingredient.of`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 物品通过 Registry.register() 注册 |
| `mc-datagen` | DataGen 生成物品模型 JSON |
| `mc-block` | BlockItem 关联方块 |
