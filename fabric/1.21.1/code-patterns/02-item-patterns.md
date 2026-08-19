# 物品代码模式

适用版本：Fabric 1.21.1

## 基本物品

```java
// 注册物品
private static final Item MY_ITEM = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "my_item"),
    new Item(new Item.Settings()
        .maxCount(64)
        .maxDamageIfAbsent(100))  // 耐久（非工具）
);
```

## 食物

```java
// 食物物品
private static final Item MY_FOOD = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "my_food"),
    new Item(new Item.Settings()
        .food(new FoodComponent.Builder()
            .hunger(4)                              // 饱食度恢复
            .saturationModifier(1.2f)               // 饱和度
            .statusEffect(
                new StatusEffectInstance(StatusEffects.REGENERATION, 100, 1),
                1.0f                                 // 触发概率
            )
            .alwaysEdible()                         // 不消耗饱食度即可食用
            .snack()                                // 快速食用
            .meat()                                 // 肉类（狗会吃）
            .build())
        .maxCount(64))
);
```

## 工具材质

```java
public enum MyToolMaterial implements ToolMaterial {
    COPPER(2, 250, 6.0f, 2.0f, 15,
        FabricToolTags.PICKAXES,                    // 可挖掘方块
        () -> Items.COPPER_INGOT);                  // 修复材料

    private final int miningLevel;
    private final int itemDurability;
    private final float miningSpeed;
    private final float attackDamage;
    private final int enchantability;
    private final TagKey<Block> breakableBlocks;
    private final Supplier<Item> repairIngredient;

    MyToolMaterial(int miningLevel, int itemDurability, float miningSpeed,
                   float attackDamage, int enchantability,
                   TagKey<Block> breakableBlocks, Supplier<Item> repairIngredient) {
        this.miningLevel = miningLevel;
        this.itemDurability = itemDurability;
        this.miningSpeed = miningSpeed;
        this.attackDamage = attackDamage;
        this.enchantability = enchantability;
        this.breakableBlocks = breakableBlocks;
        this.repairIngredient = repairIngredient;
    }

    @Override public int getDurability() { return itemDurability; }
    @Override public float getMiningSpeed() { return miningSpeed; }
    @Override public float getAttackDamage() { return attackDamage; }
    @Override public int getMiningLevel() { return miningLevel; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairIngredient() {
        return Ingredient.of(repairIngredient.get());
    }
}
```

## 工具类物品

```java
// 剑
private static final SwordItem COPPER_SWORD = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "copper_sword"),
    new SwordItem(MyToolMaterial.COPPER, 3, 1.6f,
        new Item.Settings().maxDamage(250))
);

// 镐
private static final PickaxeItem COPPER_PICKAXE = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "copper_pickaxe"),
    new PickaxeItem(MyToolMaterial.COPPER, 1.0f, -2.8f,
        new Item.Settings().maxDamage(250))
);

// 斧头
private static final AxeItem COPPER_AXE = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "copper_axe"),
    new AxeItem(MyToolMaterial.COPPER, 5.0f, -3.0f,
        new Item.Settings().maxDamage(250))
);

// 铲子
private static final ShovelItem COPPER_SHOVEL = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "copper_shovel"),
    new ShovelItem(MyToolMaterial.COPPER, 1.5f, -3.0f,
        new Item.Settings().maxDamage(250))
);

// 锄头
private static final HoeItem COPPER_HOE = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "copper_hoe"),
    new HoeItem(MyToolMaterial.COPPER, -1.0f, -3.0f,
        new Item.Settings().maxDamage(250))
);
```

## 盔甲

```java
// 盔甲材质
public enum MyArmorMaterial implements ArmorMaterial {
    COPPER("copper", 15, new int[]{2, 5, 6, 2}, 9,
        SoundEvents.ITEM_ARMOR_EQUIP_GENERIC, 0.0f, 0.0f,
        () -> Ingredient.ofItems(Items.COPPER_INGOT));

    private final String name;
    private final int durability;
    private final int[] protection;
    private final int enchantability;
    private final SoundEvent equipSound;
    private final float toughness;
    private final float knockbackResistance;
    private final Supplier<Ingredient> repairIngredientSupplier;

    MyArmorMaterial(String name, int durability, int[] protection,
                   int enchantability, SoundEvent equipSound,
                   float toughness, float knockbackResistance,
                   Supplier<Ingredient> repairIngredientSupplier) {
        this.name = name;
        this.durability = durability;
        this.protection = protection;
        this.enchantability = enchantability;
        this.equipSound = equipSound;
        this.toughness = toughness;
        this.knockbackResistance = knockbackResistance;
        this.repairIngredientSupplier = repairIngredientSupplier;
    }

    @Override public String getName() { return name; }
    @Override public int getDurability(ArmorItem.Type type) { return durability; }
    @Override public int getProtection(ArmorItem.Type type) { return protection[type.ordinal()]; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public SoundEvent getEquipSound() { return equipSound; }
    @Override public float getToughness() { return toughness; }
    @Override public float getKnockbackResistance() { return knockbackResistance; }
    @Override public Ingredient getRepairIngredient() {
        return repairIngredientSupplier.get();
    }
}

// 盔甲物品
private static final ArmorItem COPPER_HELMET = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "copper_helmet"),
    new ArmorItem(MyArmorMaterial.COPPER, ArmorItem.Type.HELMET,
        new Item.Settings().maxDamage(ArmorItem.Type.HELMET.getMaxDamage(15)))
);
```

## 自定义物品行为

```java
public class MyItem extends Item {
    public MyItem(Settings settings) {
        super(settings);
    }

    @Override
    public TypedActionResult<ItemStack> use(World world, PlayerEntity player, Hand hand) {
        if (!world.isClient) {
            // 服务端逻辑
            player.sendMessage(Text.literal("Used item!"));
            player.getStackInHand(hand).damage(1, player,
                (p) -> p.sendToolBreakStatus(hand));
        }
        return TypedActionResult.success(player.getStackInHand(hand));
    }

    @Override
    public boolean postHit(ItemStack stack, LivingEntity target, LivingEntity attacker) {
        // 攻击命中时调用
        return true;
    }

    @Override
    public void inventoryTick(ItemStack stack, World world, Entity entity,
                             int slot, boolean selected) {
        // 物品在玩家物品栏中时每 tick 调用
    }
}
```
