---
description: 03 — 物品开发
---

# 03 — 物品开发

> 适用版本：Fabric 1.14.4
> Yarn：[`Item.mapping`](https://github.com/FabricMC/yarn/blob/1.14.4/mappings/net/minecraft/item/Item.mapping)、[`FoodComponent.mapping`](https://github.com/FabricMC/yarn/blob/1.14.4/mappings/net/minecraft/item/FoodComponent.mapping)、[`ToolMaterial.mapping`](https://github.com/FabricMC/yarn/blob/1.14.4/mappings/net/minecraft/item/ToolMaterial.mapping)

---

## 约束

### 核心原则

- 物品必须在 `Registry.register(Registry.ITEM, id, item)` 中注册
- mod ID 使用 `new Identifier(MOD_ID, "name")` 构造
- **禁止**通过 `new Item()` 后不注册的方式使用
- Yarn `Item.Settings` 默认 `maxCount(64)`、`maxDamage` 为 0（不可损坏）。不要写 MCP `Item.Properties` / `maxStackSize`，也不要说默认耐久是 `Integer.MAX_VALUE`

---

## Decision Flow

### Decision: 选择物品类型

```
IF 只是手持物品（无特殊行为）
  → new Item(new Item.Settings())

IF 是工具（剑/镐/斧/铲）
  → SwordItem / PickaxeItem / AxeItem / ShovelItem（镐斧铲的公共父类是 MiningToolItem）
  → 不要 DiggerItem（那是后期 Yarn 名）

IF 是盔甲
  → 使用 ArmorItem + ArmorMaterial

IF 是食物
  → Item.Settings.food(FoodComponent)

IF 是可耐久工具
  → Settings.maxDamage(...)；工具材质实现 ToolMaterial（含 getRepairIngredient）

IF 需要自定义行为
  → 继承 Item 并重写 use()、useOnBlock()、useOnEntity() 等
```

---

## 基本物品

```java
private static final Item MY_ITEM = Registry.register(
    Registry.ITEM,
    new Identifier(MOD_ID, "my_item"),
    new Item(new Item.Settings()
        .maxCount(64)
        .maxDamageIfAbsent(100))  // 设了 maxDamage 的物品不能再设堆叠上限
);
```

## 食物

Yarn 1.14.4 是 `FoodComponent.Builder`（`hunger` / `saturationModifier` / `statusEffect` / `alwaysEdible` / `snack`），不是 Mojmap `Food.Builder`。

```java
private static final Item MY_APPLE = Registry.register(
    Registry.ITEM,
    new Identifier(MOD_ID, "golden_apple"),
    new Item(new Item.Settings()
        .food(new FoodComponent.Builder()
            .hunger(4)
            .saturationModifier(1.2f)
            .statusEffect(new StatusEffectInstance(StatusEffects.REGENERATION, 100, 1), 1.0f)
            .alwaysEdible()  // 饱食时也能吃，不是「不消耗饱食度」
            .build())
        .maxCount(64))
);
```

## 燃料（官方 wiki）

1.21.2 之前用 Fabric API [`FuelRegistry.INSTANCE.add`](https://wiki.fabricmc.net/tutorial:items)（本档 loader-api 有该类；接口方法表常为空，以 wiki 为准）：

```java
FuelRegistry.INSTANCE.add(MY_ITEM, 300);
```

## 工具（以剑为例）

Yarn `ToolMaterial` 方法是 `getDurability` / `getMiningSpeed` / `getAttackDamage` / `getMiningLevel` / `getEnchantability` / `getRepairIngredient`。1.14 没有铜锭，示例用铁锭。`Ingredient.ofItems`（不是后期的 `Ingredient.of`）。

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
    @Override public float getMiningSpeed() { return miningSpeed; }
    @Override public float getAttackDamage() { return attackDamage; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairIngredient() { return repairIngredient; }
}
```

```java
private static final SwordItem IRON_LIKE_SWORD = Registry.register(
    Registry.ITEM,
    new Identifier(MOD_ID, "iron_like_sword"),
    new SwordItem(MyToolMaterial.IRON_LIKE, 3, -2.4f,
        new Item.Settings())
);

private static final PickaxeItem IRON_LIKE_PICKAXE = Registry.register(
    Registry.ITEM,
    new Identifier(MOD_ID, "iron_like_pickaxe"),
    new PickaxeItem(MyToolMaterial.IRON_LIKE, 1, -2.8f,
        new Item.Settings())
);
```

自定义镐要进 Fabric 工具标签才对其他模组的 `breakByTool` 生效：数据包 `data/fabric/tags/items/pickaxes.json`（[wiki mining_levels 1.1x–1.17](https://wiki.fabricmc.net/tutorial:1.1x-1.17:mining_levels)）。`FabricToolTags` 是 **物品标签**，不是 `ToolMaterial` 的接口方法。

## 耐久损耗

Yarn `Item#postHit`（不是 MCP `hitEntity`）；`ItemStack#damage`；`LivingEntity#sendToolBreakStatus`。

```java
@Override
public boolean postHit(ItemStack stack, LivingEntity target, LivingEntity attacker) {
    stack.damage(1, attacker, (entity) -> {
        entity.sendToolBreakStatus(attacker.getActiveHand());
    });
    return true;
}
```

## 自定义物品行为

Yarn `Item#use` 返回 `TypedActionResult<ItemStack>`。`World.isClient`（不是 MCP `isRemote`）；`getStackInHand`（不是 `getItemStack`）。

`TypedActionResult.success` 与 1.15.2 Yarn 的 `method_22427` 同 intermediary；1.14.4 官方 mapping 可能未列出该名。也可用构造：`new TypedActionResult<>(ActionResult.SUCCESS, stack)`。

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

- ❌忘记注册 `Item` — 物品不会出现在游戏中
- ❌ `BlockItem` 与 `Block` 使用不同的 registry name — 导致物品形态缺失
- ❌ 耐久物品忘记设置 `maxDamage` — 物品无法消耗耐久
- ❌ 在 `onInitialize()` 外注册 — 注册不会生效
- ❌ `FoodComponent.Builder` 中忘记 `.hunger()` — 食物不会被消耗
- ❌ 抄 MCP：`Item.Properties`、`onItemRightClick`、`world.isRemote`、`DiggerItem`

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-registry` | 物品通过 Registry.register() 注册 |
| `mc-datagen` | 物品注册后可生成物品模型 JSON |
| `mc-block` | BlockItem 需要先有注册的 Block |
| `mc-capability` | 1.14 原版没有 Forge Capability；第三方能力库另见对应 Skill |
