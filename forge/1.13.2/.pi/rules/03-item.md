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
    .defaultMaxDamage(int maxDamage)     // javadoc 方法名是 defaultMaxDamage，没有 maxDamage()
    .containerItem(Item copyFrom)
    .addToolType(ToolType type, int level)
    .setTEISR(Supplier<Callable<TileEntityItemStackRenderer>>)  // 1.13.2 是 setTEISR，不是 setISTER
    .rarity(EnumRarity rarity)
    .setNoRepair()
    .group(ItemGroup group)              // 创造栏，字段是 ItemGroup.MISC 不是 TAB_MISC
```

> **注意**：`Item.Properties` 用 `.group(ItemGroup)`。1.13.2 **没有** `Food.Builder` / `.food()`。

### 工具材料（IItemTier）

1.13.2 **有** `IItemTier`（原版枚举 `ItemTier.WOOD/STONE/IRON/GOLD/DIAMOND`）。镐/剑 MCP 类名是 `ItemPickaxe` / `ItemSword`，不是 1.14+ 的 `PickaxeItem` / `SwordItem`。`ItemPickaxe` 构造函数是 **protected**。

```java
public class MyPickaxe extends ItemPickaxe {
    public MyPickaxe() {
        super(ItemTier.STONE, 1, -2.8f, new Item.Properties()
            .group(ItemGroup.TOOLS));
    }
}
```

### 食物

1.13.2 的 `Item.Properties` **没有** `food` / `hunger` / `saturation` / `effect` / `setAlwaysEdible`。可食用物品要自己子类化 `Item`，覆盖 `onItemUseFinish` / `getUseAction` 等（见 `Item` javadoc）。不要抄 1.14+ 的 `Food.Builder`。

### 注册约束

- ItemBlock 关联方块时，registry name 必须与方块完全相同（1.13.2 MCP 类名是 `ItemBlock`，不是 `BlockItem`）
- **物品的创造模式标签通过 `Item.Properties.group(ItemGroup)` 设置**，不是通过事件

---

## Decision Flow

### Decision: 需要什么类型的物品？

```
IF 需要可放置的基础方块物品
  → 注册 ItemBlock（关联已有的方块）
  → 不需要新建 Item 子类

IF 需要普通物品（无特殊功能）
  → extends Item，使用默认属性
  → 最简单的物品

IF 需要工具（剑、镐、斧、铲）
  → extends ItemSword / ItemPickaxe / ItemAxe / ItemSpade
  → ItemSword / ItemPickaxe：(IItemTier, int, float, Properties)
  → ItemAxe / ItemSpade：(IItemTier, float, float, Properties)（斧的伤害参数是 float）

IF 需要盔甲
  → extends ItemArmor
  → ItemArmor(IArmorMaterial, EntityEquipmentSlot, Item.Properties)

IF 需要食物（可食用物品）
  → 子类化 Item 并覆盖 onItemUseFinish 等；Properties 没有 .food()

IF 需要可耐久物品
  → 设置 .defaultMaxDamage(maxDamage)
  → 覆盖 hitEntity() / onItemUse() 处理使用逻辑
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

---

## 示例：基础物品

```java
// items/MyItem.java
public class MyItem extends Item {
    public MyItem() {
        super(new Item.Properties()
            .maxStackSize(64)
            .group(ItemGroup.MISC)
        );
    }

    @Override
    public EnumActionResult onItemUse(ItemUseContext context) {
        // 右键点击方块时的逻辑
        return EnumActionResult.SUCCESS;
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
    private final Supplier<Ingredient> repairMaterial;

    MyTier(int harvestLevel, int maxUses, float efficiency, float attackDamage,
           int enchantability, Supplier<Ingredient> repairMaterial) {
        this.harvestLevel = harvestLevel;
        this.maxUses = maxUses;
        this.efficiency = efficiency;
        this.attackDamage = attackDamage;
        this.enchantability = enchantability;
        this.repairMaterial = repairMaterial;
    }

    @Override public int getMaxUses() { return maxUses; }
    @Override public int getHarvestLevel() { return harvestLevel; }
    @Override public float getEfficiency() { return efficiency; }
    @Override public float getAttackDamage() { return attackDamage; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairMaterial() { return repairMaterial.get(); }
}
```

```java
// items/MySword.java
public class MySword extends ItemSword {
    public MySword() {
        super(MyTier.MY_MATERIAL, 3, -2.4f,
              new Item.Properties().group(ItemGroup.COMBAT));
    }
}
```

## 示例：盔甲

```java
public class MyArmorItem extends ItemArmor {
    public MyArmorItem(IArmorMaterial material, EntityEquipmentSlot slot) {
        super(material, slot, new Item.Properties().group(ItemGroup.COMBAT));
    }
}
```

自定义材料实现 `IArmorMaterial` 的 7 个方法（含 `getRepairMaterial`）。槽位类型是 `EntityEquipmentSlot`，不是 1.14 的 `EquipmentSlotType`。没有击退抗性方法。

## 示例：食物

1.13.2 不要在 `Item.Properties` 上链式 `.saturation()` / `.effect()` / `.setAlwaysEdible()`（这些方法不存在）。子类覆盖 `onItemUseFinish(ItemStack, World, EntityLivingBase)`。

```java
public class MyFoodItem extends Item {
    public MyFoodItem() {
        super(new Item.Properties().group(ItemGroup.FOOD));
    }

    @Override
    public ItemStack onItemUseFinish(ItemStack stack, World world, EntityLivingBase entity) {
        return super.onItemUseFinish(stack, world, entity);
    }
}
```
