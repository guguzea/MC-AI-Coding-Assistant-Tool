# 物品代码模式（Forge 1.19.4）

```yaml
模式: 物品/工具注册
分类: item
```

> **1.19.4 关键差异**：`Item.Properties` **没有 `tab()`**（1.18.2 有，参数名 `category`）。
> 创造模式标签改为 `CreativeModeTabEvent.BuildContents` + `CreativeModeTabs.*`，见文末同名章节。

## 普通物品

```java
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties()
        .stacksTo(64)
    )
);
// 创造标签：注册后在 CreativeModeTabEvent.BuildContents 里 accept（见本文末章节）
```

1.19.4 已核实的 `Item.Properties` 链式方法：`stacksTo(int)`、`durability(int)`、
`food(FoodProperties)`、`rarity(Rarity)`；另有 `craftRemainder(Item)`、`fireResistant()`、
`requiredFeatures(FeatureFlags...)`（依据 `../.cursor/rules/03-item.mdc:18-25`）。

## 剑（完整示例）

```java
// Tier 枚举
public enum MyTier implements Tier {
    COPPER(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.of(Items.COPPER_INGOT));

    private final int level;
    private final int uses;
    private final float speed;
    private final float damage;
    private final int enchantment;
    private final Supplier<Ingredient> repair;

    MyTier(int level, int uses, float speed, float damage, int enchantment, Supplier<Ingredient> repair) {
        this.level = level; this.uses = uses; this.speed = speed;
        this.damage = damage; this.enchantment = enchantment; this.repair = repair;
    }

    @Override public int getLevel() { return level; }
    @Override public int getUses() { return uses; }
    @Override public float getSpeed() { return speed; }
    @Override public float getAttackDamageBonus() { return damage; }
    @Override public int getEnchantmentValue() { return enchantment; }
    @Override public Ingredient getRepairIngredient() { return repair.get(); }
}

// 剑：4 参数构造函数（1.19.4 索引签名 SwordItem(Tier, int, float, Item$Properties)）
// 最终攻击伤害 = attackDamageModifier + 3.0f（剑类内置固定加成）
// 例如：attackDamageModifier=3 → 总伤害 = 3 + 3.0 = 6.0
// 注意：第二个参数是 int，不是 float
public static final RegistryObject<Item> COPPER_SWORD = ITEMS.register("copper_sword",
    () -> new SwordItem(MyTier.COPPER, 3, -2.4f, new Item.Properties()
        .durability(1561)
    )
);
```

## 镐

```java
// 1.19.4 索引签名：PickaxeItem(Tier, int attackDamageModifier, float attackSpeedModifier, Properties)
// 镐的 attackDamageModifier 通常为 1（int）
public static final RegistryObject<Item> COPPER_PICKAXE = ITEMS.register("copper_pickaxe",
    () -> new PickaxeItem(MyTier.COPPER, 1, -2.8f, new Item.Properties())
);
```

## 盔甲

```java
// 枚举构造参数序与 03-item.mdc:223-224 一致：
// (name, durability, int[] defense, enchantmentValue, equipSound, toughness, knockbackResistance, repairSupplier)
public enum MyArmorMaterial implements ArmorMaterial {
    COPPER("copper", 40,
        new int[]{4, 7, 9, 4},   // boots, leggings, chestplate, helmet
        20, SoundEvents.ARMOR_EQUIP_DIAMOND,
        0.0f, 0.0f,
        () -> Ingredient.of(Items.COPPER_INGOT)
    );
    // 需实现：getDurability / getDefenseForType(ArmorItem.Type) / getEnchantmentValue
    //        / getEquipSound / getToughness / getKnockbackResistance / getRepairIngredient
    //（1.19.4 索引证实 ArmorMaterial#getDefenseForType 的参数已是 ArmorItem$Type）
}

// ⚠️ 1.19.4 起 ArmorItem 构造函数的槽位参数是 ArmorItem.Type，不再是 EquipmentSlot
//    （1.19.4 移植 primer 明确记载：“ArmorItem now take in a delegate to the
//      EquipmentSlot called ArmorItem$Type within their constructors”）
public static RegistryObject<Item> COPPER_HELMET     = ITEMS.register("copper_helmet",
    () -> new ArmorItem(MyArmorMaterial.COPPER, ArmorItem.Type.HELMET, new Item.Properties()));
public static RegistryObject<Item> COPPER_CHESTPLATE = ITEMS.register("copper_chestplate",
    () -> new ArmorItem(MyArmorMaterial.COPPER, ArmorItem.Type.CHESTPLATE, new Item.Properties()));
public static RegistryObject<Item> COPPER_LEGGINGS   = ITEMS.register("copper_leggings",
    () -> new ArmorItem(MyArmorMaterial.COPPER, ArmorItem.Type.LEGGINGS, new Item.Properties()));
public static RegistryObject<Item> COPPER_BOOTS      = ITEMS.register("copper_boots",
    () -> new ArmorItem(MyArmorMaterial.COPPER, ArmorItem.Type.BOOTS, new Item.Properties()));
// ArmorItem#getType() -> ArmorItem.Type；ArmorItem.Type#getSlot() -> EquipmentSlot（1.19.4 索引证实）
```

## 食物

```java
public static final RegistryObject<Item> GOLDEN_APPLE = ITEMS.register("golden_apple",
    () -> new Item(new Item.Properties()
        .food(new FoodProperties.Builder()
            .nutrition(4)
            .saturationMod(1.2f)
            .effect(new MobEffectInstance(MobEffects.ABSORPTION, 2400, 0), 1.0f)
            .alwaysEat()
            .build())
    )
);

// 肉类标记（狗可食用）：1.19.4 索引存在 FoodProperties.Builder#meat()
// .meat() 可按需追加
```

## 自定义使用效果物品

```java
public class MyUseItem extends Item {
    public MyUseItem() {
        super(new Item.Properties()
            .stacksTo(16)
        );
    }

    @Override
    public UseAnim getUseAnimation(ItemStack stack) {   // 1.19.4：形参为 ItemStack
        return UseAnim.DRINK;
    }

    @Override
    public int getUseDuration(ItemStack stack) {        // 1.19.4：形参为 ItemStack
        return 32;  // 32 ticks = 1.6 秒
    }

    @Override
    public ItemStack finishUsingItem(ItemStack stack, Level level, LivingEntity entity) {
        super.finishUsingItem(stack, level, entity);
        entity.addEffect(new MobEffectInstance(MobEffects.MOVEMENT_SPEED, 600, 1));
        if (!level.isClientSide) {
            stack.shrink(1);
        }
        return stack;
    }
}
// 创造标签通过 CreativeModeTabEvent.BuildContents 注册到 CreativeModeTabs.FOOD_AND_DRINKS
```

## 耐久处理（自定义武器）

```java
public class MySwordItem extends SwordItem {
    public MySwordItem(Tier tier, int attackDamageModifier, float attackSpeedModifier, Properties props) {
        super(tier, attackDamageModifier, attackSpeedModifier, props);
    }

    @Override
    public boolean hurtEnemy(ItemStack stack, LivingEntity target, LivingEntity attacker) {
        // ✅ 已核实签名：ItemStack#hurtAndBreak(int, LivingEntity, Consumer<LivingEntity>)
        stack.hurtAndBreak(1, attacker, e -> e.broadcastBreakEvent(EquipmentSlot.MAINHAND));
        return true;
    }

    // TODO(未核实)：shouldCauseReequipAnimation(ItemStack, ItemStack, boolean)
    //   —— forge/1.20.1/code-patterns/02-item-patterns.md:159 有该覆写示例，但
    //   get_method_params net.minecraft.world.item.Item#shouldCauseReequipAnimation --version=1.19.4 返回 MISS，
    //   且 query_api 对 Item 的方法列表被截断（n=60），既不能证实也不能证伪 → 请勿照抄，先反编译核实。
}
```

## 创造模式标签注册（1.19.3+ 变更）

```java
// 1.18.2 写法（本档 ❌ 不可用）：new Item.Properties().tab(CreativeModeTab.TAB_MISC)

// 1.19.4：在 modEventBus 上监听 CreativeModeTabEvent.BuildContents
public ExampleMod(FMLJavaModLoadingContext context) {
    context.getModEventBus().addListener(MyMod::onBuildContents);
}

public static void onBuildContents(CreativeModeTabEvent.BuildContents event) {
    if (event.getTab() == CreativeModeTabs.BUILDING_BLOCKS) {
        event.accept(MY_BLOCK_ITEM);   // 接受 ItemLike / RegistryObject
        event.accept(MY_ITEM);
    }
}
```

| 内容归类 | 1.19.4 常量（本档规则表 `03-item.mdc:125-134`） |
|----------|-----------------------------------------------|
| 建筑方块 | `CreativeModeTabs.BUILDING_BLOCKS` |
| 自然方块 | `CreativeModeTabs.NATURAL_BLOCKS` |
| 工具 / 交通 | `CreativeModeTabs.TOOLS_AND_UTILITIES`（1.19.3+ 已并入） |
| 武器 | `CreativeModeTabs.COMBAT` |
| 食物 | `CreativeModeTabs.FOOD_AND_DRINKS` |
| 材料 / 杂项 | `CreativeModeTabs.INGREDIENTS`（Mojmap 没有 `TAB_MISC`） |
| 红石 | `CreativeModeTabs.REDSTONE_BLOCKS` |
| 搜索 | `CreativeModeTabs.SEARCH`（不推荐） |

自定义标签页：`CreativeModeTabEvent.Register#registerCreativeModeTab`
（官方文档 `search_forge_docs --query=CreativeModeTab --version=1.19.4` → 页 `1.19.4/items`）。
