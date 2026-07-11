# 物品代码模式（Forge 1.14.4）

```yaml
模式: 物品/工具注册
分类: item
```

## 普通物品

```java
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties()
        .group(ItemGroup.MISC)
        .maxStackSize(64)
    )
);
```

## 剑（完整示例）

```java
// IItemTier 枚举
public enum MyTier implements IItemTier {
    COPPER(3, 1561, 8.0f, 2.0f, 15, () -> Ingredient.fromItems(Items.DIAMOND));

    private final int level;
    private final int uses;
    private final float speed;
    private final float damage;
    private final int enchantability;
    private final Supplier<Ingredient> repairMaterial;

    MyTier(int level, int uses, float speed, float damage, int enchantability, Supplier<Ingredient> repairMaterial) {
        this.level = level;
        this.uses = uses;
        this.speed = speed;
        this.damage = damage;
        this.enchantability = enchantability;
        this.repairMaterial = repairMaterial;
    }

    @Override public int getMaxUses() { return uses; }
    @Override public float getEfficiency() { return speed; }
    @Override public float getAttackDamage() { return damage; }
    @Override public int getHarvestLevel() { return level; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairMaterial() { return repairMaterial.get(); }
}

// 剑：4 参数构造函数
// SwordItem(IItemTier tier, float attackDamageIn, float attackSpeedIn, Item.Properties)
public static final RegistryObject<Item> COPPER_SWORD = ITEMS.register("copper_sword",
    () -> new SwordItem(MyTier.COPPER, 3.0f, -2.4f, new Item.Properties()
        .group(ItemGroup.COMBAT)
    )
);
```

## 镐

```java
// PickaxeItem(float attackDamageIn, float attackSpeedIn, IItemTier tier, ToolType toolType, Item.Properties)
public static final RegistryObject<Item> COPPER_PICKAXE = ITEMS.register("copper_pickaxe",
    () -> new PickaxeItem(MyTier.COPPER, 1.0f, -2.8f, ToolType.PICKAXE,
        new Item.Properties().group(ItemGroup.TOOLS))
);
```

## 盔甲

```java
public enum MyArmorMaterial implements IArmorMaterial {
    COPPER("copper", 40,
        new int[]{4, 7, 9, 4},   // boots, leggings, chestplate, helmet
        20, SoundEvents.ITEM_ARMOR_EQUIP_DIAMOND, 3.0f, 0.1f);

    // getDurability(), getDamageReductionAmounts(), getEnchantability()
    // getSoundEvent(), getToughness(), getKnockbackResistance()
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
        .group(ItemGroup.FOOD)
        .food(new Food.Builder()
            .hunger(4)
            .saturation(1.2f)
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
            .group(ItemGroup.BREWING)
            .maxStackSize(16)
        );
    }

    @Override
    public UseAction getUseAction(ItemStack stack) {
        return UseAction.DRINK;  // 饮用动画
    }

    @Override
    public int getUseDuration(ItemStack stack) {
        return 32;  // 32 ticks = 1.6秒
    }

    @Override
    public ItemStack onItemUseFinish(ItemStack stack, World world, LivingEntity entity) {
        super.onItemUseFinish(stack, world, entity);
        entity.addEffect(new MobEffectInstance(MobEffects.SPEED, 600, 1));
        if (!world.isRemote) {
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
    public MySwordItem(IItemTier tier, float attackDamageIn, float attackSpeedIn, Properties props) {
        super(tier, attackDamageIn, attackSpeedIn, props);
    }

    @Override
    public boolean hitEntity(ItemStack stack, LivingEntity target, LivingEntity attacker) {
        stack.damageItem(1, attacker, entity -> entity.sendBreakAnimation(EquipmentSlotType.MAINHAND));
        return true;
    }
}
```
