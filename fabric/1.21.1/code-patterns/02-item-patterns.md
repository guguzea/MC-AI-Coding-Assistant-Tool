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
            .nutrition(4)                             // 饱食度恢复（tiny: FoodComponent$Builder.nutrition(I)；1.20.x 的 hunger() 已无）
            .saturationModifier(1.2f)               // 饱和度
            .statusEffect(
                new StatusEffectInstance(StatusEffects.REGENERATION, 100, 1),
                1.0f                                 // 触发概率
            )
            .alwaysEdible()                         // 不消耗饱食度即可食用
            .snack()                                // 快速食用
            // 1.20.x 的 .meat() 本档 Builder 已无（tiny 实测成员只有 nutrition / saturationModifier /
            //   statusEffect / alwaysEdible / snack / usingConvertsTo / build）
            .build())
        .maxCount(64))
);
```

## 工具材质

```java
public enum MyToolMaterial implements ToolMaterial {
    COPPER(250, 6.0f, 2.0f, 15,
        () -> Items.COPPER_INGOT);                  // 修复材料

    private final int itemDurability;
    private final float miningSpeed;
    private final float attackDamage;
    private final int enchantability;
    private final Supplier<Item> repairIngredient;

    MyToolMaterial(int itemDurability, float miningSpeed,
                   float attackDamage, int enchantability,
                   Supplier<Item> repairIngredient) {
        this.itemDurability = itemDurability;
        this.miningSpeed = miningSpeed;
        this.attackDamage = attackDamage;
        this.enchantability = enchantability;
        this.repairIngredient = repairIngredient;
    }

    @Override public int getDurability() { return itemDurability; }
    @Override public float getMiningSpeedMultiplier() { return miningSpeed; }
    @Override public float getAttackDamage() { return attackDamage; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairIngredient() {
        return Ingredient.ofItems(repairIngredient.get());
    }
    // 1.21.1 的 ToolMaterial 没有 getMiningLevel()，也没有「可挖掘方块」构造参数：
    //   tiny 实测 cwi / class_1832 成员 = getDurability / getMiningSpeedMultiplier / getAttackDamage /
    //   getInverseTag()→TagKey / getEnchantability / getRepairIngredient()→Ingredient；
    //   同档 .cursor/rules/03-item.mdc:77 同口径。采集门槛改由方块侧 tag 决定：
    //   data/minecraft/tags/block/mineable/pickaxe.json + needs_iron_tool.json
    //   （fabric-wiki/1.21.1/processed/tutorial_blocks.md:301、
    //    fabric-docs/1.21.1/processed/develop_blocks_first-block.md:143,160）。
    // TODO(未核实): 接口另有 getInverseTag() 返回 TagKey，泛型实参与原版取值本档未核实，
    //   待 ingest_loader_api 入库后补 @Override；照抄本块会缺一个实现方法。
}
```

## 工具类物品

```java
// 剑
private static final SwordItem COPPER_SWORD = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "copper_sword"),
    new SwordItem(MyToolMaterial.COPPER,
        new Item.Settings().attributeModifiers(
            SwordItem.createAttributeModifiers(MyToolMaterial.COPPER, 3, 1.6f)).maxDamage(250))
);

// 镐
private static final PickaxeItem COPPER_PICKAXE = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "copper_pickaxe"),
    new PickaxeItem(MyToolMaterial.COPPER,
        new Item.Settings().attributeModifiers(
            MiningToolItem.createAttributeModifiers(MyToolMaterial.COPPER, 1.0f, -2.8f)).maxDamage(250))
);

// 斧头
private static final AxeItem COPPER_AXE = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "copper_axe"),
    new AxeItem(MyToolMaterial.COPPER,
        new Item.Settings().attributeModifiers(
            MiningToolItem.createAttributeModifiers(MyToolMaterial.COPPER, 5.0f, -3.0f)).maxDamage(250))
);

// 铲子
private static final ShovelItem COPPER_SHOVEL = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "copper_shovel"),
    new ShovelItem(MyToolMaterial.COPPER,
        new Item.Settings().attributeModifiers(
            MiningToolItem.createAttributeModifiers(MyToolMaterial.COPPER, 1.5f, -3.0f)).maxDamage(250))
);

// 锄头
private static final HoeItem COPPER_HOE = Registry.register(
    Registries.ITEM,
    Identifier.of(MOD_ID, "copper_hoe"),
    new HoeItem(MyToolMaterial.COPPER,
        // TODO(未核实): 本档 tiny 只有 SwordItem.createAttributeModifiers(ToolMaterial,int,float) 与
        //   MiningToolItem.createAttributeModifiers(ToolMaterial,float,float)；HoeItem 无具名静态工厂，
        //   且 rules/03-item.mdc:28 明确「镐斧铲」父类才是 MiningToolItem（不含锄）→ 不臆造写法。
        new Item.Settings().maxDamage(250))
);
```

## 盔甲

```java
// 盔甲材质
// ⚠️ 1.21.1 起 ArmorMaterial 是 record：tiny 实测 csg / class_1741 只剩 getProtection(ArmorItem.Type)、
//   enchantability() 与 comp_2298..comp_2304，没有 getName() / getDurability(ArmorItem.Type)。
// TODO(未核实): 下面这份 1.20.x enum 实现本档不成立；record 规范构造器的参数名与顺序本档无可核实语料，
//   待 ingest_loader_api / 用户自备 yarn 反编译后整块重写（本次只标注，不动正文）。
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
            // TODO(未核实): 1.20.x 的 damage(int, PlayerEntity, Consumer) 在 Yarn 1.21.1 已不存在，
            //   sendToolBreakStatus 在 PlayerEntity(cmx) 全成员中 0 命中。tiny 实测 ItemStack(cuq)#damage
            //   只剩 (int, ServerWorld, ServerPlayerEntity, Consumer)V / (int, LivingEntity, EquipmentSlot)V /
            //   (int, ItemConvertible, LivingEntity, EquipmentSlot)→ItemStack 三个重载，而 EquipmentSlot
            //   常量名在 yarn-1.21.1+build.3 tiny 里仍是 field_61xx 未具名 → 不臆造消耗耐久的写法。
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
