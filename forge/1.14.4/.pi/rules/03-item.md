---
description: 03 — 物品开发
---

# 03 — 物品开发

> 适用版本：Forge 1.14.4

---

## 约束

### Item 子类规范

- 基础物品类继承 `Item`（`net.minecraft.item.Item`）
- 禁止重写已废弃的 `onCreated()` 等方法
- 物品必须通过 `DeferredRegister<Item>` 注册

### Item.Properties 配置

```java
new Item.Properties()
    .group(ItemGroup group)                        // 创造栏（官方 1.14.x items 页）
    .maxStackSize(int maxStackSize)                // 默认 64
    .maxDamage(int maxDamage)
    .defaultMaxDamage(int maxDamage)
    .containerItem(Item copyFrom)
    .rarity(Rarity rarity)                         // COMMON, UNCOMMON, RARE, EPIC
    .setNoRepair()
    .addToolType(ToolType type, int harvestLevel)
    .food(Food food)
```

> 1.14.4 **没有** `fireResistant()`。创造栏用 `.group(ItemGroup)`，不是 `.tab()`。

### ItemTier（工具材料）规范

```java
public enum MyItemTier implements IItemTier {
    MY_MATERIAL(3, 2000, 10.0f, 4.0f, 20, () -> Ingredient.fromItems(Items.DIAMOND));

    // getHarvestLevel(), getMaxUses(), getEfficiency(), getAttackDamage(), getEnchantability(), getRepairMaterial()
}
```

- `getHarvestLevel()`：挖掘等级（木=0，石=1，铁=2，金=3，钻=4）
- `getMaxUses()`：耐久值
- `getEfficiency()`：挖掘速度
- `getAttackDamage()`：附加攻击伤害
- `getEnchantability()`：附魔能力值

### 食物属性（Food）

```java
new Item.Properties()
    .food(new Food.Builder()
        .hunger(int hunger)
        .saturation(float modifier)
        .meat()
        .setAlwaysEdible()              // 饱食也能吃（不是 alwaysEat）
        .fastToEat()
        .effect(new EffectInstance(Effects.JUMP_BOOST, 200), 1.0f)
        .build()
    )
```

### 注册约束

- BlockItem 关联方块时，registry name 必须与方块完全相同
- 工具/盔甲使用 `IItemTier`；剑构造是 `SwordItem(IItemTier, int, float, Properties)`
- **创造栏通过 `.group(ItemGroup)` 设置**（官方文档方法名是 `group`）

---

## Decision Flow

### Decision: 需要什么类型的物品？

```
IF 需要可放置的基础方块物品
  → 注册 BlockItem（关联已有的方块）
  → 不需要新建 Item 子类

IF 需要普通物品（无特殊功能）
  → extends Item，使用默认属性
  → 最简单的物品

IF 需要工具（剑、镐、斧、铲）
  → extends PickaxeItem / AxeItem / SwordItem / ShovelItem
  → 需要定义 IItemTier
  → 剑构造：SwordItem(IItemTier, int attackDamageIn, float attackSpeed, Properties)

IF 需要盔甲
  → extends ArmorItem
  → 需要定义 IArmorMaterial（没有 getKnockbackResistance）
  → 构造：ArmorItem(IArmorMaterial, EquipmentSlotType, Properties)

IF 需要食物（可食用物品）
  → extends Item + 设置 .food()
  → 或 extends Item 覆盖 onItemUseFinish() 方法实现自定义食用逻辑

IF 需要可耐久物品
  → 设置 .maxDamage(maxDamage)
  → 覆盖 hitEntity() 处理使用逻辑
  → 覆盖 onBlockDestroyed() 处理方块交互

IF 需要自定义附魔
  → 注册 Enchantment；不要说「只能用附魔台」
```

### Decision: IItemTier 定义

```
IF 自定义工具材料
  → 定义枚举实现 IItemTier 接口
  → 6 个必需方法全部实现
  → getRepairMaterial() 必须返回有效的 Ingredient
  → 工具构造传入 IItemTier + 攻击参数 + Item.Properties，不要抄错参序

IF 复用现有材料
  → ItemTier.WOOD / ItemTier.STONE / ItemTier.IRON / ItemTier.GOLD / ItemTier.DIAMOND
```

### Decision: 物品放置在哪个 ItemGroup

```
IF 建筑方块 → ItemGroup.BUILDING_BLOCKS
IF 装饰 → ItemGroup.DECORATIONS
IF 工具 → ItemGroup.TOOLS
IF 武器 → ItemGroup.COMBAT
IF 食物 → ItemGroup.FOOD
IF 材料 → ItemGroup.MATERIALS
IF 红石 → ItemGroup.REDSTONE
IF 交通 → ItemGroup.TRANSPORTATION
IF 杂项 → ItemGroup.MISC
```

创造栏写在 `Item.Properties.group(...)`，不要用伪造的 `FMLSetupEvent` 去改标签。

---

## 示例：基础物品

```java
// items/MyItem.java
public class MyItem extends Item {
    public MyItem() {
        super(new Item.Properties()
            .maxStackSize(64)
            .group(ItemGroup.MISC)
            .rarity(Rarity.COMMON)
        );
    }

    @Override
    public ActionResultType onItemUse(ItemUseContext context) {
        return ActionResultType.SUCCESS;
    }
}
```

## 示例：工具（剑）

```java
// items/MyTier.java
public enum MyTier implements IItemTier {
    MY_MATERIAL(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.fromItems(Items.DIAMOND));

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
```

```java
// 注册剑：构造函数参数
// IItemTier.getAttackDamage() + 1.0f（剑的类型加成）= 总攻击伤害
// 例如：damage=3.0f → 总攻击伤害 = 3.0f + 1.0f = 4.0f
public static final RegistryObject<Item> MY_SWORD = ITEMS.register("my_sword",
    () -> new SwordItem(MyTier.MY_MATERIAL, 3, -2.4f, new Item.Properties())
);
//                           ^^^ IItemTier   ^^^ int: 攻击伤害加成   ^^^^ float: 攻击速度
```

## 示例：盔甲

```java
// items/MyArmorMaterial.java
public enum MyArmorMaterial implements IArmorMaterial {
    MY_MATERIAL("my_material", 40, new int[]{4, 7, 9, 4}, 20,
        SoundEvents.ITEM_ARMOR_EQUIP_DIAMOND, 3.0f);

    // getDurability(EquipmentSlotType), getDamageReductionAmount, getEnchantability,
    // getSoundEvent, getRepairMaterial, getName, getToughness
    // 1.14.4 IArmorMaterial 没有 getKnockbackResistance
}
```

```java
// items/MyArmorItem.java
public class MyArmorItem extends ArmorItem {
    public MyArmorItem(MyArmorMaterial material, EquipmentSlotType slot, Item.Properties properties) {
        super(material, slot, properties);
    }
}
```

## 示例：食物

```java
// items/MyFoodItem.java
public class MyFoodItem extends Item {
    public MyFoodItem() {
        super(new Item.Properties()
            .food(new Food.Builder()
                .hunger(4)
                .saturation(0.3f)
                .meat()
                .effect(new EffectInstance(Effects.JUMP_BOOST, 200, 1), 1.0f)
                .build())
        );
    }

    @Override
    public ItemStack onItemUseFinish(ItemStack stack, World world, LivingEntity entity) {
        super.onItemUseFinish(stack, world, entity);
        return stack;
    }
}
```

> 注：1.14.4 `Food.Builder.effect` 签名是 `effect(EffectInstance, float)`（**没有** Supplier 重载，那是 1.15.2）。效果字段用 `Effects.JUMP_BOOST`。
