# 物品模式（Fabric 1.21.3）

## 模式 1：基础物品

```yaml
模式: Basic Item
平台: Fabric
分类: item
依赖: []
扩展点: [BlockItem]
---
private static final Item MY_ITEM = Registry.register(
    Registries.ITEM,
    new Identifier(MOD_ID, "my_item"),
    new Item(new Item.Settings().maxCount(64))
);
```

## 模式 2：食物

```yaml
模式: Food Item
平台: Fabric
分类: item
依赖: []
扩展点: [StatusEffect]
---
private static final Item MY_APPLE = Registry.register(
    Registries.ITEM,
    new Identifier(MOD_ID, "my_golden_apple"),
    new Item(new Item.Settings()
        .food(new FoodComponent.Builder()
            .hunger(4)
            .saturationModifier(1.2f)
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
平台: Fabric
分类: item
依赖: []
扩展点: [ToolMaterial]
---
public enum MyToolMaterial implements ToolMaterial {
    COPPER(2, 250, 6.0f, 2.0f, 15,
        FabricToolTags.PICKAXES, () -> Items.COPPER_INGOT);

    // ... getDurability, getMiningSpeed, getAttackDamage, etc.
}

private static final Item COPPER_SWORD = Registry.register(
    Registries.ITEM,
    new Identifier(MOD_ID, "copper_sword"),
    new SwordItem(MyToolMaterial.COPPER, 3, 1.6f,
        new Item.Settings().maxDamage(250))
);
```

## 模式 4：耐久物品

```yaml
模式: Durable Item
平台: Fabric
分类: item
依赖: []
扩展点: [Custom behavior]
---
private static final Item MY_HAMMER = Registry.register(
    Registries.ITEM,
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
平台: Fabric
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
            // 服务端逻辑：给予效果、生成实体等
            player.addStatusEffect(
                new StatusEffectInstance(StatusEffects.SPEED, 600, 0));
            player.getItemStack(hand).damage(1, player,
                (p) -> p.sendToolBreakStatus(hand));
        }
        return TypedActionResult.success(player.getItemStack(hand));
    }
}
```
