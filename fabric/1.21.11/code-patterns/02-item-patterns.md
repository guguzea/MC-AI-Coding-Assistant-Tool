# 物品模式（Fabric 1.21.11）

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
扩展点: [FoodComponent]
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

本档 Yarn 的 `FoodComponent.Builder` 只有 `nutrition` / `saturationModifier` / `alwaysEdible` / `build` 四个方法，**没有** `hunger` 与 `statusEffect`。

## 模式 3：工具（剑）

```yaml
模式: Sword Tool
平台: Fabric
分类: item
依赖: []
扩展点: [ToolMaterial]
---
private static final Item COPPER_SWORD = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "copper_sword"),
    new Item(new Item.Settings().sword(ToolMaterial.IRON, 3.0f, -2.4f))
);

// 镐 / 斧 / 锄 / 铲同理：pickaxe / axe / hoe / shovel
private static final Item COPPER_PICKAXE = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "copper_pickaxe"),
    new Item(new Item.Settings().pickaxe(ToolMaterial.IRON, 1.0f, -2.8f))
);
```

`ToolMaterial` 在本档是 **record**（具名常量 `IRON` / `COPPER` / `DIAMOND` / `GOLD` / `NETHERITE` / `STONE` / `WOOD`）→ **不能 `implements`，也没有 `SwordItem` / `PickaxeItem` 可继承**。自定义材质用 `new ToolMaterial(incorrectBlocksForDrops, durability, speed, attackDamageBonus, enchantmentValue, repairItems)`，参数含义与顺序见官方 `develop_items_custom-tools`（`get_fabric_doc_full`，`version=1.21.11`）。

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
        public void postHit(ItemStack stack, LivingEntity target, LivingEntity attacker) {
            stack.damage(1, attacker, attacker.getActiveHand());
        }
    }
);
```

本档 `Item.postHit(ItemStack, LivingEntity, LivingEntity)` 返回 **void**（不是 `boolean`）；`ItemStack.damage` 只有 `(int, LivingEntity, Hand)` / `(int, LivingEntity, EquipmentSlot)` / `(int, PlayerEntity)` 等形态，Yarn 命名里**没有** `sendToolBreakStatus`。

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
    public ActionResult use(World world, PlayerEntity user, Hand hand) {
        if (!world.isClient) {
            // 服务端逻辑：消耗耐久、生成实体等
            user.getStackInHand(hand).damage(1, user, hand);
        }
        return ActionResult.SUCCESS;
    }
}
```

本档 `Item#use` 返回 `ActionResult`（`net.minecraft.util`），具名常量只有 `CONSUME` / `FAIL` / `PASS` / `PASS_TO_DEFAULT_BLOCK_ACTION` / `SUCCESS` / `SUCCESS_SERVER`；Yarn 命名里**没有** `TypedActionResult`，`use` 也不带泛型。`StatusEffects` 的 41 个字段在本档只有 `DARKNESS_PADDING_DURATION` 是具名的，其余全是 `field_*` → **不要照抄 `StatusEffects.SPEED`**，要给状态效果就先按本档映射核具名（`convert_mapping` / `query_loader_api`）。
