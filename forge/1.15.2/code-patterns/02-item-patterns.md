# 物品代码模式（Forge 1.15.2）

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
    COPPER(2, 1561, 8.0f, 3.0f, 15, () -> Ingredient.fromItems(Items.COPPER_INGOT));

    private final int level;
    private final int maxUses;
    private final float efficiency;
    private final float damage;
    private final int enchantability;
    private final Supplier<Ingredient> repairMaterial;

    MyTier(int level, int maxUses, float efficiency, float damage, int enchantability, Supplier<Ingredient> repairMaterial) {
        this.level = level;
        this.maxUses = maxUses;
        this.efficiency = efficiency;
        this.damage = damage;
        this.enchantability = enchantability;
        this.repairMaterial = repairMaterial;
    }

    @Override public int getMaxUses() { return maxUses; }
    @Override public float getEfficiency() { return efficiency; }
    @Override public float getAttackDamage() { return damage; }
    @Override public int getHarvestLevel() { return level; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairMaterial() { return repairMaterial.get(); }
}

// 剑
public static final RegistryObject<Item> COPPER_SWORD = ITEMS.register("copper_sword",
    () -> new SwordItem(MyTier.COPPER, 3, 1.6f, new Item.Properties()
        .group(ItemGroup.TAB_COMBAT)
        .defaultDurability(1561)
    )
);
```

## 镐

```java
public static final RegistryObject<Item> COPPER_PICKAXE = ITEMS.register("copper_pickaxe",
    () -> new PickaxeItem(MyTier.COPPER, 1.0f, -2.8f,
        new Item.Properties().group(ItemGroup.TOOLS))
);
```

## 盔甲

```java
public enum MyArmorMaterial implements IArmorMaterial {
    COPPER("copper", 40,
        new int[]{4, 7, 9, 4},   // boots, leggings, chestplate, helmet
        20, SoundEvents.ITEM_ARMOR_EQUIP_IRON,
        0.0f, 0.0f,
        () -> Ingredient.fromItems(Items.COPPER_INGOT)
    );

    @Override public int getDurability(EquipmentSlotType slot) { ... }
    @Override public int getDamageReductionAmount(EquipmentSlotType slot) { ... }
    @Override public int getEnchantability() { ... }
    @Override public SoundEvent getSoundEvent() { ... }
    @Override public Ingredient getRepairMaterial() { ... }
}

public static RegistryObject<Item> COPPER_HELMET    = ITEMS.register("copper_helmet",
    () -> new ArmorItem(MyArmorMaterial.COPPER, EquipmentSlotType.HEAD, new Item.Properties()));
// ... 其他盔甲部位
```

## 食物

```java
public static final RegistryObject<Item> GOLDEN_APPLE = ITEMS.register("golden_apple",
    () -> new Item(new Item.Properties()
        .group(ItemGroup.FOOD)
        .food(new Food.Builder()
            .hunger(4)
            .saturation(1.2f)
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
        entity.addPotionEffect(new EffectInstance(Effects.SPEED, 600, 1));
        if (!world.isRemote) {
            stack.shrink(1);
        }
        return stack;
    }
}
```

## 耐久处理（自定义武器）

```java
public class MySwordItem extends SwordItem {
    public MySwordItem(IItemTier tier, float attackDamage, float attackSpeed, Properties props) {
        super(tier, attackDamage, attackSpeed, props);
    }

    @Override
    public boolean hitEntity(ItemStack stack, LivingEntity target, LivingEntity attacker) {
        stack.damageItem(1, attacker, i -> i.sendBreakAnimation(EquipmentSlotType.MAINHAND));
        return true;
    }
}
```
