---
description: 03 — 物品开发
---

# 03 — 物品开发

> 适用版本：Fabric 1.21.1

---

## 约束

### 核心原则

- 物品必须在 `Registry.register(Registries.ITEM, id, item)` 中注册
- mod ID 使用 `Identifier.of(MOD_ID, "name")` 构造
- **禁止**通过 `new Item()` 后不注册的方式使用
- Yarn `Item.Settings` 默认 maxCount=64、maxDamage=0（不可损坏），不是 Integer.MAX_VALUE

---

## Decision Flow

### Decision: 选择物品类型

```
IF 只是手持物品（无特殊行为）
  → new Item(new Item.Settings())

IF 是工具（剑/镐）
  → SwordItem(material, Settings) + createAttributeModifiers
  → 镐斧铲父类 MiningToolItem。不要 DiggerItem

IF 是盔甲
  → 使用 ArmorItem + ArmorMaterial

IF 是食物
  → Item.Settings.food(FoodComponent)

IF 是可耐久工具
  → Settings.maxDamage(...) 或走 ToolMaterial 的耐久

IF 需要自定义行为
  → 继承 Item 并重写 use()、useOnBlock()、useOnEntity()、inventoryTick()
```

---

## 基本物品

```java
private static final Item MY_ITEM = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "my_item"),
    new Item(new Item.Settings().maxCount(64))
);
```

## 食物

`FoodComponent` 在 `net.minecraft.component.type`。Builder 用 `.nutrition(int)`（不是 hunger）。`alwaysEdible()` 是饱食时也能吃。

```java
private static final Item MY_APPLE = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "golden_apple"),
    new Item(new Item.Settings()
        .food(new FoodComponent.Builder()
            .nutrition(4)
            .saturationModifier(1.2f)
            .statusEffect(new StatusEffectInstance(StatusEffects.REGENERATION, 100, 1), 1.0f)
            .alwaysEdible()
            .snack()
            .build())
        .maxCount(64))
);
```

## 工具

Yarn 1.21.1 镐斧铲父类仍是 `MiningToolItem`（无 DiggerItem）。`SwordItem(ToolMaterial, Settings)`；攻击力走 `SwordItem.createAttributeModifiers(material, int, float)`。`PickaxeItem(ToolMaterial, Settings)`。`ToolMaterial` 接口 **没有** `getMiningLevel()`，有 `getInverseTag()`。原版常量在 `ToolMaterials`。

```java
private static final Item IRON_SWORD = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "example_sword"),
    new SwordItem(ToolMaterials.IRON, new Item.Settings().attributeModifiers(
        SwordItem.createAttributeModifiers(ToolMaterials.IRON, 3, -2.4f)))
);

private static final Item IRON_PICKAXE = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "example_pickaxe"),
    new PickaxeItem(ToolMaterials.IRON, new Item.Settings().attributeModifiers(
        MiningToolItem.createAttributeModifiers(ToolMaterials.IRON, 1.0f, -2.8f)))
);
```

## 自定义物品行为

Yarn 1.21.1/1.21.3 `Item#use` 仍返回 `TypedActionResult<ItemStack>`。手持是 `getStackInHand`。`ItemStack.damage` 签名已改，不要抄 1.18 的三参 lambda。

```java
public class MySpecialItem extends Item {
    public MySpecialItem(Settings settings) {
        super(settings);
    }

    @Override
    public TypedActionResult<ItemStack> use(World world, PlayerEntity player, Hand hand) {
        return TypedActionResult.success(player.getStackInHand(hand));
    }
}
```

## 常见错误

- ❌忘记注册 `Item` — 物品不会出现在游戏中
- ❌ `BlockItem` 与 `Block` 使用不同的 registry name — 导致物品形态缺失
- ❌ 耐久物品忘记设置 `maxDamage` — 物品无法消耗耐久
- ❌ 在 `onInitialize()` 外注册 — 注册不会生效
- ❌ 食物 Builder 用错 `hunger`/`nutrition`（按本档上方示例）
- ❌ `DiggerItem` / `DurableToolItem` / `getItemStack` / `Ingredient.of`（Yarn 用 `ofItems`）

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 物品通过 Registry.register() 注册 |
| `mc-datagen` | 物品注册后可生成物品模型 JSON |
| `mc-block` | BlockItem 需要先有注册的 Block |
| `mc-capability` | 原版没有 Forge Capability；第三方库另见对应 Skill |
