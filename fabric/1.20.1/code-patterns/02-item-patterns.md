# 物品模式（Fabric 1.20.1）

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

> ℹ️ oracle 口径（2026-09-18）：`FabricToolTags` 已从 fabric-api **移除**——≤1.17.1 摘要在、1.18.2/1.20.1/1.21.3 摘要 0 命中；旧包 0.45.0+1.18 起 @Deprecated。官方文档口径：工具类别归**原版物品标签**（ItemTags.SWORDS/AXES 例）。下面是**示意**草图：`ToolMaterial` 的参数形态本仓无可核 oracle（fabric-api 摘要无该类条目），抄前用自备 jar 走 `ingest_loader_api` 核实签名；**禁止凭记忆补**。

```yaml
模式: Sword Tool
平台: Fabric
分类: item
依赖: []
扩展点: [ToolMaterial]
---
public enum MyToolMaterial implements ToolMaterial {
    // 参数形态示意（无仓内 oracle）；挖掘类别归原版物品标签，不得引用已移除的 FabricToolTags
    COPPER(2, 250, 6.0f, 2.0f, 15, () -> Items.COPPER_INGOT);

    // ... getDurability, getMiningSpeed, getAttackDamage, etc.
}

private static final Item COPPER_SWORD = Registry.register(
    Registries.ITEM,
    new Identifier(MOD_ID, "copper_sword"),
    new SwordItem(MyToolMaterial.COPPER, 3, -2.4f,
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
            player.getStackInHand(hand).damage(1, player,
                (p) -> p.sendToolBreakStatus(hand));
        }
        return TypedActionResult.success(player.getStackInHand(hand));
    }
}
```
