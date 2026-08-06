---
description: 03 — 物品开发
---

# 03 — 物品开发

> 适用版本：Forge 1.13.2

---

## 约束

### Item 子类规范

- 基础物品类继承 `Item`（`net.minecraft.item.Item`）
- 禁止重写已废弃的方法
- 物品必须通过 `RegistryEvent.Register<Item>` 注册

### Item.Properties 配置

```java
new Item.Properties()
    .maxStackSize(int size)              // 默认 64
    .maxDamage(int maxDamage)            // 有耐久物品
    .addToolType(ToolType type, int level)  // 工具类型和挖掘等级
    .setTEISR(TESRItemStackHandler)     // 自定义渲染器
    .group(ItemGroup group)              // 创造模式标签
```

> **注意**：`Item.Properties` 在 Forge 1.13.2 中使用 `.group(ItemGroup)` 方法设置创造模式标签，不是 1.14+ 的 `.tab()` 方法。

### ItemTier（工具材料）规范

1.13.2 不支持 `Tier` 接口，使用工具类时需要手动处理：

```java
// 1.13.2 使用工具类
public class MyPickaxe extends PickaxeItem {
    public MyPickaxe() {
        super(ToolMaterial.STONE, -1.0f, new Item.Properties()
            .group(ItemGroup.TAB_TOOLS));
    }
}
```

### 食物属性（Food）

```java
new Item.Properties()
    .group(ItemGroup.TAB_FOOD)
    .effect(() -> new PotionEffect(MobEffects.JUMP_BOOST, 200), 1.0f)
    .saturation(0.3f)                      // 饱和度
    .setAlwaysEdible()                    // 总是可食用
```

### 注册约束

- ItemBlock 关联方块时，registry name 必须与方块完全相同
- **物品的创造模式标签通过 `Item.Properties.group(ItemGroup)` 设置**，不是通过事件

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
  → extends SwordItem / PickaxeItem / AxeItem / ShovelItem
  → 需要在构造中传入 ToolMaterial 和属性

IF 需要盔甲
  → extends ArmorItem
  → 需要在 constructor 传入：material, slot, properties

IF 需要食物（可食用物品）
  → extends Item + 设置 .group(ItemGroup.TAB_FOOD)
  → 或 extends Item 覆盖 onFoodEaten() 方法实现自定义食用逻辑

IF 需要可耐久物品
  → 设置 .maxDamage(maxDamage)
  → 覆盖 hitEntity() / onItemUse() 处理使用逻辑
```

### Decision: 物品放置在哪个 ItemGroup

```
IF 建筑方块 → ItemGroup.TAB_BUILDING_BLOCKS
IF 自然方块 → ItemGroup.TAB_SEARCH
IF 工具 → ItemGroup.TAB_TOOLS
IF 武器 → ItemGroup.TAB_COMBAT
IF 食物 → ItemGroup.TAB_FOOD
IF 材料 → ItemGroup.TAB_MATERIALS
IF 杂项 → ItemGroup.TAB_MISC
```

---

## 示例：基础物品

```java
// items/MyItem.java
public class MyItem extends Item {
    public MyItem() {
        super(new Item.Properties()
            .maxStackSize(64)
            .group(ItemGroup.TAB_MISC)
        );
    }

    @Override
    public ActionResultType onItemUse(ItemUseContext context) {
        // 右键点击方块时的逻辑
        return ActionResultType.SUCCESS;
    }
}
```

## 示例：工具（剑）

```java
// items/MyTier.java
public enum MyTier implements IItemTier {
    MY_MATERIAL(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.fromItems(Items.DIAMOND));

    private final int harvestLevel;
    private final int maxUses;
    private final float efficiency;
    private final float attackDamage;
    private final int enchantability;
    private final Ingredient repairMaterial;

    MyTier(int harvestLevel, int maxUses, float efficiency, float attackDamage,
           int enchantability, Supplier<Ingredient> repairMaterial) {
        this.harvestLevel = harvestLevel;
        this.maxUses = maxUses;
        this.efficiency = efficiency;
        this.attackDamage = attackDamage;
        this.enchantability = enchantability;
        this.repairMaterial = repairMaterial;
    }

    @Override public int getHarvestLevel() { return harvestLevel; }
    @Override public float getEfficiency() { return efficiency; }
    @Override public float getAttackDamage() { return attackDamage; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairMaterial() { return repairMaterial.get(); }
}
```

```java
// items/MySword.java
public class MySword extends SwordItem {
    public MySword() {
        super(MyTier.MY_MATERIAL, 3, 1.6f,
              new Item.Properties().group(ItemGroup.TAB_COMBAT));
    }
}
```

## 示例：盔甲

```java
// items/MyArmorMaterial.java
public enum MyArmorMaterial implements IArmorTier {
    MY_MATERIAL("my_material", 40, new int[]{4, 7, 9, 4}, 20,
        SoundEvents.BLOCK_ANVIL_PLACE, 3.0f, 0.1f);

    private final String name;
    private final int durability;
    private final int[] damageReduction;
    private final int enchantability;
    private final SoundEvent sound;
    private final float toughness;
    private final float knockbackResistance;

    MyArmorMaterial(String name, int durability, int[] damageReduction,
                    int enchantability, SoundEvent sound,
                    float toughness, float knockbackResistance) {
        this.name = name;
        this.durability = durability;
        this.damageReduction = damageReduction;
        this.enchantability = enchantability;
        this.sound = sound;
        this.toughness = toughness;
        this.knockbackResistance = knockbackResistance;
    }

    @Override public String getName() { return name; }
    @Override public int getDurability(EquipmentSlotType slot) { return durability; }
    @Override public int getDamageReductionAmount(EquipmentSlotType slot) { return damageReduction[slot.getIndex()]; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public SoundEvent getSoundEvent() { return sound; }
    @Override public float getToughness() { return toughness; }
    @Override public float getKnockbackResistance() { return knockbackResistance; }
}
```

```java
// items/MyArmorItem.java
public class MyArmorItem extends ArmorItem {
    public MyArmorItem(MyArmorMaterial material, EquipmentSlotType type) {
        super(material, type, new Item.Properties().group(ItemGroup.TAB_COMBAT));
    }
}
```

## 示例：食物

```java
// items/MyFoodItem.java
public class MyFoodItem extends Item {
    public MyFoodItem() {
        super(new Item.Properties()
            .group(ItemGroup.TAB_FOOD)
            .saturation(0.3f)
            .setAlwaysEdible()
            .effect(() -> new PotionEffect(MobEffects.JUMP_BOOST, 200, 1), 1.0f)
        );
    }

    @Override
    public ItemStack onItemUseFinish(ItemStack stack, World world, LivingEntity entity) {
        return super.onItemUseFinish(stack, world, entity);
    }
}
```

> 注：`effect()` 中的 `PotionEffect` 第一个参数是 `MobEffect`（如 `MobEffects.JUMP_BOOST`），不是 `int` ID。
