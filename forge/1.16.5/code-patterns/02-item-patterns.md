# 物品代码模式（Forge 1.16.5）

```yaml
模式: 物品/工具注册
分类: item
```

## 普通物品

```java
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties()
        .tab(ItemGroup.TAB_MISC)
        .stacksTo(64)
    )
);
```

## 剑（完整示例）

```java
// Tier 枚举（1.16.5 签名）
public enum MyTier implements IItemTier { // ❌ ITier = Fabric 名；165 official 构件（2026-10-05 javap）= net.minecraft.item.IItemTier
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

    @Override public int getLevel() { return level; } // ❌ getTierLevel = MCP 层名；165 official IItemTier 方法 = getLevel（构件实证）
    @Override public int getUses() { return uses; }
    @Override public float getSpeed() { return speed; }
    @Override public float getAttackDamageBonus() { return damage; }
    @Override public int getEnchantmentValue() { return enchantment; }
    @Override public Ingredient getRepairIngredient() { return repair.get(); }
}

// 剑：4 参数构造函数
// SwordItem(IItemTier tier, int attackDamageModifier, float attackSpeedModifier, Item.Properties) ——165 official 构件实证（javap 2026-10-05）
// 最终攻击伤害 = attackDamageModifier + 3.0f（剑类内置固定加成）
// 例如：attackDamageModifier=3 → 总伤害 = 3 + 3.0 = 6.0
public static final RegistryObject<Item> COPPER_SWORD = ITEMS.register("copper_sword",
    () -> new SwordItem(MyTier.COPPER, 3, 1.6f, new Item.Properties()
        .tab(ItemGroup.TAB_COMBAT)
        .maxDamage(1561)
    )
);
```

## 镐

```java
// PickaxeItem(IItemTier tier, int attackDamageModifier, float attackSpeedModifier, Item.Properties) ——165 official 构件实证（javap 2026-10-05）；(float,float,ITier,TagKey) 是 1.20.1/Forge47 形，本档编不过
// attackDamageModifier：类型加成外额外增加的攻击伤害（镐通常为 1）
public static final RegistryObject<Item> COPPER_PICKAXE = ITEMS.register("copper_pickaxe",
    () -> new PickaxeItem(MyTier.COPPER, 1, -2.8f,
        new Item.Properties().tab(ItemGroup.TAB_TOOLS))
);
```

## 盔甲

```java
public enum MyArmorMaterial implements IArmorMaterial {
    COPPER("copper", 40,
        new int[]{4, 7, 9, 4},   // boots, leggings, chestplate, helmet
        20, SoundEvents.ARMOR_EQUIP_IRON,
        0.0f, 0.0f,
        () -> Ingredient.of(Items.COPPER_INGOT)
    );
    // getDurability(), getDefenseForType(), getEnchantmentValue()
    // getEquipSound(), getToughness(), getKnockbackResistance(), getRepairIngredient()
}

public static RegistryObject<Item> COPPER_HELMET    = ITEMS.register("copper_helmet",
    () -> new ArmorItem(MyArmorMaterial.COPPER, EquipmentSlotType.HEAD, new Item.Properties()));
public static RegistryObject<Item> COPPER_CHESTPLATE = ITEMS.register("copper_chestplate",
    () -> new ArmorItem(MyArmorMaterial.COPPER, EquipmentSlotType.CHEST, new Item.Properties()));
public static RegistryObject<Item> COPPER_LEGGINGS   = ITEMS.register("copper_leggings",
    () -> new ArmorItem(MyArmorMaterial.COPPER, EquipmentSlotType.LEGS, new Item.Properties()));
public static RegistryObject<Item> COPPER_BOOTS      = ITEMS.register("copper_boots",
    () -> new ArmorItem(MyArmorMaterial.COPPER, EquipmentSlotType.FEET, new Item.Properties()));
```

## 食物

```java
public static final RegistryObject<Item> GOLDEN_APPLE = ITEMS.register("golden_apple",
    () -> new Item(new Item.Properties()
        .tab(ItemGroup.TAB_FOOD)
        .food(new Food.Builder()
            .nutrition(4)
            .saturationMod(1.2f)
            .effect(() -> new EffectInstance(Effects.ABSORPTION, 2400, 0), 1.0f)
            .alwaysEat()
            .build())
    )
);
```

## 自定义使用效果物品

```java
public class MyUseItem extends Item {
    public MyUseItem() {
        super(new Item.Properties()
            .tab(ItemGroup.TAB_BREWING)
            .stacksTo(16)
        );
    }

    @Override
    public UseAction getUseAnimation(ItemStack stack) {
        // 构件实证（2026-10-05 javap @1.16.5 official 映射 jar）：方法名 = getUseAnimation；❌ getUseAction 是 1.14/1.15 MCP 名
        return UseAction.DRINK;  // 饮用动画（UseAction.EAT/DRINK/BLOCK/SHIELD/BOW/CROSSBOW/SPEARS 构件点名）
    }

    @Override
    public int getUseDuration(ItemStack stack) {
        return 32;  // 32 ticks = 1.6秒
    }

    @Override
    // 构件实证（2026-10-05 javap @1.16.5 official 映射 jar）：食用完成 = Item#finishUsingItem；
    // ❌ onItemUseFinish 是 MCP/1.14 名，本包编不过。LivingEntity#addEffect（❌ addPotionEffect 为 1.17+/MCP 层）
    public ItemStack finishUsingItem(ItemStack stack, World world, LivingEntity entity) {
        super.finishUsingItem(stack, world, entity);
        entity.addEffect(new EffectInstance(Effects.SPEED, 600, 1));
        if (!world.isClientSide) {
            stack.shrink(1);
        }
        return stack;
    }
}
```

## 耐久处理（自定义武器）

```java
// 自定义剑可以直接继承 SwordItem 并覆盖方法
// 构件实证（2026-10-05 javap @1.16.5 official 映射 jar）：
// SwordItem(IItemTier, int, float, Properties) 4 参在构件；命中回调 = Item#hurtEnemy；
// 扣耐久 = ItemStack#hurtAndBreak(int, T, Consumer<T>)；破坏动画 = LivingEntity#broadcastBreakEvent(EquipmentSlotType)。
// ❌ ITier（Fabric 名）、hitEntity / damageItem / sendBreakAnimation（MCP 层名）本包都编不过。
public class MySwordItem extends SwordItem {
    public MySwordItem(IItemTier tier, int attackDamageModifier, float attackSpeedModifier, Properties props) {
        super(tier, attackDamageModifier, attackSpeedModifier, props);
    }

    @Override
    public boolean hurtEnemy(ItemStack stack, LivingEntity target, LivingEntity attacker) {
        stack.hurtAndBreak(1, attacker, i -> i.broadcastBreakEvent(EquipmentSlotType.MAINHAND));
        return true;
    }
}
```
