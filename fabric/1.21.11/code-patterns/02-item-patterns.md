# 物品模式（Fabric 1.21.11）

> ⚠ **1.21.2+ 起：物品注册必须先有 `RegistryKey`**。`new Item(new Item.Settings())` 这类"先构造、再交给 `Registry.register(Registries.ITEM, …)`"的写法在**运行期**会抛
> `java.lang.NullPointerException: Item id not set`（本仓 2026-09-29 真机复现，崩溃报告 `run/crash-reports/crash-2026-09-29_12.54.10-client.txt`；**编译期不报错**，只在进世界/加载物品时炸）。
> 正确形态（官方 wiki `tutorial_items.md`「Creating Items in 1.21.2+」）＝
> **`Items.register(RegistryKey.of(RegistryKeys.ITEM, Identifier.of(MOD_ID, "…")), 工厂, Item.Settings)`**。
> 下面 5 个模式已按此改正；老写法 `Registry.register(Registries.ITEM, …)` 只适用于 **1.21.1 及更早**。

## 模式 1：基础物品

```yaml
模式: Basic Item
平台: Fabric
分类: item
依赖: []
扩展点: [BlockItem]
---
private static final Item MY_ITEM = Items.register(
    RegistryKey.of(RegistryKeys.ITEM, Identifier.of(MOD_ID, "my_item")),
    Item::new,
    new Item.Settings().maxCount(64)
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
private static final Item MY_APPLE = Items.register(
    RegistryKey.of(RegistryKeys.ITEM, Identifier.of(MOD_ID, "my_golden_apple")),
    Item::new,
    new Item.Settings()
        .food(new FoodComponent.Builder()
            .nutrition(4)
            .saturationModifier(1.2f)
            .alwaysEdible()
            .build())
        .maxCount(64)
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
private static final Item COPPER_SWORD = Items.register(
    RegistryKey.of(RegistryKeys.ITEM, Identifier.of(MOD_ID, "copper_sword")),
    Item::new,
    new Item.Settings().sword(ToolMaterial.IRON, 3.0f, -2.4f)
);

// 镐 / 斧 / 锄 / 铲同理：pickaxe / axe / hoe / shovel
private static final Item COPPER_PICKAXE = Items.register(
    RegistryKey.of(RegistryKeys.ITEM, Identifier.of(MOD_ID, "copper_pickaxe")),
    Item::new,
    new Item.Settings().pickaxe(ToolMaterial.IRON, 1.0f, -2.8f)
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
private static final Item MY_HAMMER = Items.register(
    RegistryKey.of(RegistryKeys.ITEM, Identifier.of(MOD_ID, "my_hammer")),
    // 工厂参数形如 Function<Item.Settings, Item>：匿名子类用 lambda 包一层（不能直接 new 后注册）
    settings -> new Item(settings) {
        @Override
        public void postHit(ItemStack stack, LivingEntity target, LivingEntity attacker) {
            stack.damage(1, attacker, attacker.getActiveHand());
        }
    },
    new Item.Settings().maxDamage(100)
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

// 注册（同上：1.21.2+ 必须由 Items.register 传入 RegistryKey；自定义类用构造器引用）
private static final Item MY_WAND = Items.register(
    RegistryKey.of(RegistryKeys.ITEM, Identifier.of(MOD_ID, "my_wand")),
    MyWandItem::new,
    new Item.Settings().maxCount(1)
);
```

本档 `Item#use` 返回 `ActionResult`（`net.minecraft.util`），具名常量只有 `CONSUME` / `FAIL` / `PASS` / `PASS_TO_DEFAULT_BLOCK_ACTION` / `SUCCESS` / `SUCCESS_SERVER`；Yarn 命名里**没有** `TypedActionResult`，`use` 也不带泛型。`StatusEffects` 的 41 个字段在本档只有 `DARKNESS_PADDING_DURATION` 是具名的，其余全是 `field_*` → **不要照抄 `StatusEffects.SPEED`**，要给状态效果就先按本档映射核具名（`convert_mapping` / `query_loader_api`）。
