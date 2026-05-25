# 物品代码模式（Forge 1.20.1）

```yaml
模式: 物品/工具注册
分类: item
```

## 普通物品

```java
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties()
        .tab(CreativeModeTab.TAB_MISC)
        .stacksTo(64)
    )
);
```

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

// 剑：4 参数构造函数
// SwordItem(Tier tier, int attackDamageModifier, float attackSpeedModifier, Item.Properties)
// 最终攻击伤害 = attackDamageModifier + 3.0f（剑类内置固定加成）
// 例如：attackDamageModifier=3 → 总伤害 = 3 + 3.0 = 6.0
public static final RegistryObject<Item> COPPER_SWORD = ITEMS.register("copper_sword",
    () -> new SwordItem(MyTier.COPPER, 3, 1.6f, new Item.Properties()
        .tab(CreativeModeTab.TAB_COMBAT)
        .durability(1561)
    )
);
```

## 镐

```java
// PickaxeItem(float attackDamageBonus, float attackSpeed, Tier, TagKey<Block>, Properties)
// attackDamageBonus：类型加成外额外增加的攻击伤害（镐通常为 1.0f）
public static final RegistryObject<Item> COPPER_PICKAXE = ITEMS.register("copper_pickaxe",
    () -> new PickaxeItem(MyTier.COPPER, 1.0f, -2.8f,
        new Item.Properties().tab(CreativeModeTab.TAB_TOOLS))
);
```

## 盔甲

```java
public enum MyArmorMaterial implements ArmorMaterial {
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
    () -> new ArmorItem(MyArmorMaterial.COPPER, ArmorItem.Type.HELMET, new Item.Properties()));
public static RegistryObject<Item> COPPER_CHESTPLATE = ITEMS.register("copper_chestplate",
    () -> new ArmorItem(MyArmorMaterial.COPPER, ArmorItem.Type.CHESTPLATE, new Item.Properties()));
public static RegistryObject<Item> COPPER_LEGGINGS   = ITEMS.register("copper_leggings",
    () -> new ArmorItem(MyArmorMaterial.COPPER, ArmorItem.Type.LEGGINGS, new Item.Properties()));
public static RegistryObject<Item> COPPER_BOOTS      = ITEMS.register("copper_boots",
    () -> new ArmorItem(MyArmorMaterial.COPPER, ArmorItem.Type.BOOTS, new Item.Properties()));
```

## 食物

```java
public static final RegistryObject<Item> GOLDEN_APPLE = ITEMS.register("golden_apple",
    () -> new Item(new Item.Properties()
        .tab(CreativeModeTab.TAB_FOOD)
        .food(new FoodProperties.Builder()
            .nutrition(4)
            .saturationMod(1.2f)
            .effect(() -> new MobEffectInstance(MobEffects.ABSORPTION, 2400, 0), 1.0f)
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
            .tab(CreativeModeTab.TAB_BREWING)
            .stacksTo(16)
        );
    }

    @Override
    public UseAnim getUseAnimation(ItemStack stack) {
        return UseAnim.DRINK;  // 饮用动画
    }

    @Override
    public int getUseDuration(ItemStack stack) {
        return 32;  // 32 ticks = 1.6秒
    }

    @Override
    public ItemStack finishUsingItem(ItemStack stack, Level level, LivingEntity entity) {
        super.finishUsingItem(stack, level, entity);
        entity.addEffect(new MobEffectInstance(MobEffects.SPEED, 600, 1));
        if (!level.isClientSide) {
            stack.shrink(1);
        }
        return stack;
    }
}
```

## 耐久处理（自定义武器）

```java
// 自定义剑可以直接继承 SwordItem 并覆盖方法
public class MySwordItem extends SwordItem {
    public MySwordItem(Tier tier, int attackDamageModifier, float attackSpeedModifier, Properties props) {
        super(tier, attackDamageModifier, attackSpeedModifier, props);
    }

    @Override
    public boolean hurtEnemy(ItemStack stack, LivingEntity target, LivingEntity attacker) {
        // ✅ 正确：lambda 回调传入装备槽位
        stack.hurtAndBreak(1, attacker, slot -> attacker.getItemBySlot(slot));
        return true;
    }

    @Override
    public boolean shouldCauseReequipAnimation(ItemStack oldStack, ItemStack newStack, boolean slotChanged) {
        // 快速切换时不重播动画
        return slotChanged || oldStack.getItem() != newStack.getItem();
    }
}
```
