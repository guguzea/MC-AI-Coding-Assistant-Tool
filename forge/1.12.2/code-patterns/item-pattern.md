# 物品模式

## 基础物品

```java
public class MyItem extends Item {

    public MyItem() {
        super();
        setRegistryName(ExampleMod.MOD_ID, "my_item");
        setCreativeTab(CreativeTabs.MISC);
    }
}
```

## 工具类

```java
public enum MyToolTier implements IItemTier {
    COPPER(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.fromItems(Items.DIAMOND));

    private final int harvestLevel;
    private final int maxUses;
    private final float efficiency;
    private final float attackDamage;
    private final int enchantability;
    private final Supplier<Ingredient> repairMaterial;

    MyToolTier(int harvestLevel, int maxUses, float efficiency, float attackDamage,
               int enchantability, Supplier<Ingredient> repairMaterial) {
        this.harvestLevel = harvestLevel;
        this.maxUses = maxUses;
        this.efficiency = efficiency;
        this.attackDamage = attackDamage;
        this.enchantability = enchantability;
        this.repairMaterial = repairMaterial;
    }

    @Override public int getMaxUses() { return maxUses; }
    @Override public float getEfficiency() { return efficiency; }
    @Override public float getAttackDamage() { return attackDamage; }
    @Override public int getHarvestLevel() { return harvestLevel; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairMaterial() { return repairMaterial.get(); }
}

// 剑
public class MySword extends ItemSword {
    public MySword(ToolMaterial material) {
        super(material);
        setRegistryName(ExampleMod.MOD_ID, "my_sword");
    }
}

// 镐
public class MyPickaxe extends ItemPickaxe {
    public MyPickaxe(ToolMaterial material) {
        super(material);
        setRegistryName(ExampleMod.MOD_ID, "my_pickaxe");
    }
}
```

## 盔甲类

```java
public enum MyArmorMaterial implements IArmorMaterial {
    COPPER("copper", 15, new int[]{2, 5, 6, 2}, 9, SoundEvents.ITEM_ARMOR_EQUIP_IRON, 0.0f);

    private static final int[] MAX_DAMAGE = new int[]{11, 16, 15, 13};
    private final String name;
    private final int maxDamageFactor;
    private final int[] damageReductionAmounts;
    private final int enchantability;
    private final SoundEvent sound;
    private final float toughness;

    MyArmorMaterial(String name, int maxDamageFactor, int[] damageReduction,
                    int enchantability, SoundEvent sound, float toughness) {
        this.name = name;
        this.maxDamageFactor = maxDamageFactor;
        this.damageReductionAmounts = damageReduction;
        this.enchantability = enchantability;
        this.sound = sound;
        this.toughness = toughness;
    }

    @Override public String getName() { return name; }
    @Override public int getDurability(EquipmentSlotType slot) { return MAX_DAMAGE[slot.getIndex()] * maxDamageFactor; }
    @Override public int getDamageReductionAmount(EquipmentSlotType slot) { return damageReductionAmounts[slot.getIndex()]; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public SoundEvent getSoundEvent() { return sound; }
    @Override public float getToughness() { return toughness; }
}

// 头盔
public class MyHelmet extends ItemArmor {
    public MyHelmet(ArmorMaterial material, EquipmentSlotType slot) {
        super(material, slot);
        setRegistryName(ExampleMod.MOD_ID, "my_helmet");
    }
}
```

## 食物类

```java
public class MyFood extends Item {

    public MyFood() {
        super(new Item.Properties()
            .containerItem(Items.BOWL)
            .creativeTab(CreativeTabs.FOOD)
            .food(new Food.Builder()
                .hunger(6)
                .saturation(0.5f)
                .build()
            )
        );
        setRegistryName(ExampleMod.MOD_ID, "my_food");
    }
}
```
