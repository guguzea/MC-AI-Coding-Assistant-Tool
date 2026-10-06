# 物品代码模式（Forge 1.15.2）

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
// IItemTier 枚举
public enum MyTier implements IItemTier {
    COPPER(2, 1561, 8.0f, 3.0f, 15, () -> Ingredient.of(Items.COPPER_INGOT));

    private final int level;
    private final int uses;
    private final float speed;
    private final float damage;
    private final int enchantmentValue;
    private final Supplier<Ingredient> repairIngredient;

    MyTier(int level, int uses, float speed, float damage, int enchantmentValue, Supplier<Ingredient> repairIngredient) {
        this.level = level;
        this.uses = uses;
        this.speed = speed;
        this.damage = damage;
        this.enchantmentValue = enchantmentValue;
        this.repairIngredient = repairIngredient;
    }

    // 方法名 = 1.15.2 official 构件实证（getMaxUses/getEfficiency/getAttackDamage/getHarvestLevel/getEnchantability/getRepairMaterial 是 MCP 旧名，本档编不过）
    @Override public int getUses() { return uses; }
    @Override public float getSpeed() { return speed; }
    @Override public float getAttackDamageBonus() { return damage; }
    @Override public int getLevel() { return level; }
    @Override public int getEnchantmentValue() { return enchantmentValue; }
    @Override public Ingredient getRepairIngredient() { return repairIngredient.get(); }
}

// 剑
public static final RegistryObject<Item> COPPER_SWORD = ITEMS.register("copper_sword",
    () -> new SwordItem(MyTier.COPPER, 3, 1.6f, new Item.Properties()
        .tab(ItemGroup.TAB_COMBAT)
        .defaultDurability(1561)
    )
);
```

## 镐

```java
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

    // 方法名 = 1.15.2 official 构件实证（getDurability/getDamageReductionAmount/getEnchantability/getSoundEvent/getRepairMaterial 是 MCP 旧名）
    @Override public int getDurabilityForSlot(EquipmentSlotType slot) { ... }
    @Override public int getDefenseForSlot(EquipmentSlotType slot) { ... }
    @Override public int getEnchantmentValue() { ... }
    @Override public SoundEvent getEquipSound() { ... }
    @Override public Ingredient getRepairIngredient() { ... }
}

public static RegistryObject<Item> COPPER_HELMET    = ITEMS.register("copper_helmet",
    () -> new ArmorItem(MyArmorMaterial.COPPER, EquipmentSlotType.HEAD, new Item.Properties()));
// ... 其他盔甲部位
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
    public UseAction getUseAnimation(ItemStack stack) {  // 构件实证名 getUseAnimation（getUseAction 是 MCP 旧名）
        return UseAction.DRINK;  // 饮用动画
    }

    @Override
    public int getUseDuration(ItemStack stack) {
        return 32;  // 32 ticks = 1.6秒
    }

    @Override
    public ItemStack finishUsingItem(ItemStack stack, World world, LivingEntity entity) {  // 构件实证名 finishUsingItem（onItemUseFinish 是 MCP 旧名）
        entity.addEffect(new EffectInstance(Effects.MOVEMENT_SPEED, 600, 1));  // 构件实证：addEffect；Effects 字段 1.15.2 叫 MOVEMENT_SPEED（SPEED 是 1.17+ 名）
        if (!world.isClientSide) {
            stack.shrink(1);
        }
        return stack;
    }
}
```

## 耐久处理（自定义武器）

```java
public class MySwordItem extends SwordItem {
    public MySwordItem(IItemTier tier, int attackDamage, float attackSpeed, Properties props) {  // SwordItem 第二参是 int（构件实证）
        super(tier, attackDamage, attackSpeed, props);
    }

    @Override
    public boolean hurtEnemy(ItemStack stack, LivingEntity target, LivingEntity attacker) {  // 构件实证名 hurtEnemy（hitEntity 是 MCP 旧名）
        stack.hurtAndBreak(1, attacker, i -> i.broadcastBreakEvent(EquipmentSlotType.MAINHAND));
        return true;
    }
}
```
