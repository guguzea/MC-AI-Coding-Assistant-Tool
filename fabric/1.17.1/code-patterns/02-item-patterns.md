# 物品模式（Fabric 1.17.1）

## ⚠️ 1.17.x 关键差异

- **没有 `Registries` 类！** 使用 `Registry.ITEM` 静态字段
- **没有 `RegistrySupplier`！** 直接用静态字段持有注册后的对象
- **FoodComponent API**：使用 `.hunger(int)` 和 `.saturation(float)`，不是 `.saturationModifier()`

## 模式 1：基础物品

```yaml
模式: Basic Item
平台: Fabric 1.17.1
分类: item
依赖: []
扩展点: [BlockItem]
---
private static final Item MY_ITEM = Registry.register(
    Registry.ITEM,
    new Identifier(MOD_ID, "my_item"),
    new Item(new Item.Settings().maxCount(64))
);
```

## 模式 2：食物

```yaml
模式: Food Item
平台: Fabric 1.17.1
分类: item
依赖: []
扩展点: [StatusEffect]
---
private static final Item MY_APPLE = Registry.register(
    Registry.ITEM,
    new Identifier(MOD_ID, "my_golden_apple"),
    new Item(new Item.Settings()
        .food(new FoodComponent.Builder()
            .hunger(4)
            .saturation(1.2f)
            .statusEffect(
                new StatusEffectInstance(StatusEffects.REGENERATION, 100, 1),
                1.0f)
            .alwaysEdible()
            .build())
        .maxCount(64))
);
```

## 模式 3：工具（剑）

```yaml
模式: Sword Tool
平台: Fabric 1.17.1
分类: item
依赖: []
扩展点: [ToolMaterial]
---
public enum MyToolMaterial implements ToolMaterial {
    COPPER(2, 250, 6.0f, 2.0f, 15);

    // ... getDurability, getMiningSpeedMultiplier, getAttackDamage, etc.
}

private static final Item COPPER_SWORD = Registry.register(
    Registry.ITEM,
    new Identifier(MOD_ID, "copper_sword"),
    new SwordItem(MyToolMaterial.COPPER, 3, -2.4f,
        new Item.Settings().maxDamage(250))
);
```

## 模式 4：耐久物品

```yaml
模式: Durable Item
平台: Fabric 1.17.1
分类: item
依赖: []
扩展点: [Custom behavior]
---
private static final Item MY_HAMMER = Registry.register(
    Registry.ITEM,
    new Identifier(MOD_ID, "my_hammer"),
    new Item(new Item.Settings().maxDamage(100)) {
        @Override
        public boolean postHit(ItemStack stack, LivingEntity target, LivingEntity attacker) {
            stack.damage(1, attacker, (entity) ->
                entity.sendToolBreakStatus(attacker.getActiveHand()));
            return true;
        }
    }
);
```

## 模式 5：自定义行为物品

```yaml
模式: Custom Use Item
平台: Fabric 1.17.1
分类: item
依赖: []
扩展点: [World interaction]
---
public class MyWandItem extends Item {
    public MyWandItem(Settings settings) {
        super(settings);
    }

    @Override
    public TypedActionResult<ItemStack> use(World world, PlayerEntity player, Hand hand) {
        if (!world.isClient) {
            player.addStatusEffect(
                new StatusEffectInstance(StatusEffects.SPEED, 600, 0));
            player.getStackInHand(hand).damage(1, player,
                (p) -> p.sendToolBreakStatus(hand));
        }
        return TypedActionResult.success(player.getStackInHand(hand));
    }
}
```
