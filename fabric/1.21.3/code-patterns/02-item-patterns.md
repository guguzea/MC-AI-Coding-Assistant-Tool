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
    Identifier.of(MOD_ID, "my_item"),
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
    Identifier.of(MOD_ID, "my_golden_apple"),
    new Item(new Item.Settings()
        .food(new FoodComponent.Builder()
            .nutrition(4)
            .saturationModifier(1.2f)
            .alwaysEdible()
            .build())
        .maxCount(64))
);
```

本档 Yarn 的 `FoodComponent.Builder` 只有 `nutrition` / `saturationModifier` / `alwaysEdible` / `build` 四个具名方法（`yarn-1.21.3+build.2-tiny.gz` 的 `FoodComponent$Builder` 四条 METHOD 行），**没有** `hunger` 与 `statusEffect`；要挂加入餐效果，用 `Item.Settings.food(FoodComponent, ConsumableComponent)` 这个双参重载。

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
    Identifier.of(MOD_ID, "copper_sword"),
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
    Identifier.of(MOD_ID, "my_hammer"),
    new Item(new Item.Settings().maxDamage(100)) {
        @Override
        public boolean postHit(ItemStack stack, LivingEntity target, LivingEntity attacker) {
            if (attacker instanceof PlayerEntity player) {
                stack.damage(1, player);
            }
            return true;
        }
    }
);
```

本档 `ItemStack.damage` 的具名重载只有 `(int, ServerWorld, ServerPlayerEntity, Consumer)`（`method_7956`）/ `(int, LivingEntity, EquipmentSlot)`（`method_7970`）/ `(int, PlayerEntity)`（`method_61653`）/ `(int, ItemConvertible, LivingEntity, EquipmentSlot)`（`method_60986`）——1.18 的 `damage(int, LivingEntity, Consumer)` **三参 lambda 形态不存在**，`sendToolBreakStatus` 本档映射也没有。带槽位的那个重载写起来要先有 `EquipmentSlot` 常量：本档 Yarn 把 `EquipmentSlot` 的 7 个枚举常量全留成 `field_6173…field_48824`（未具名），**不要**顺手写 `EquipmentSlot.MAINHAND`。

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
    public ActionResult use(World world, PlayerEntity player, Hand hand) {
        if (!world.isClient) {
            // 服务端逻辑：消耗耐久、生成实体等
            player.getStackInHand(hand).damage(1, player);
        }
        return ActionResult.SUCCESS;
    }
}
```

本档 `Item#use` 返回 `ActionResult`（`net.minecraft.util`，**不带泛型**），具名常量只有 `CONSUME` / `FAIL` / `PASS` / `PASS_TO_DEFAULT_BLOCK_ACTION` / `SUCCESS` / `SUCCESS_SERVER`；Yarn 命名里**没有** `TypedActionResult`（1.21.1 的 `class_1271` 在 1.21.2 已并进 `class_1269`）。`StatusEffects` 的 40 个字段在本档只有 `DARKNESS_PADDING_DURATION` 是具名的，其余全是 `field_*` → **不要照抄 `StatusEffects.SPEED`**，要给状态效果就先按本档映射核具名（`convert_mapping` / `query_loader_api`）。
