---
description: 03 — 物品开发
---

# 03 — 物品开发

> 适用版本：Forge 1.12.2

---

## 约束

### Item 子类规范

- 基础物品类继承 `Item`（`net.minecraft.item.Item`）
- 物品必须通过 `RegistryEvent.Register<Item>` 注册

### Item setter 配置（没有 `Item.Properties`）

```java
new Item()
    .setMaxStackSize(int maxStackSize)           // 默认 64
    .setMaxDamage(int maxDamage)                 // 有耐久物品
    .setContainerItem(Item container)             // 消耗后保留物品
    .setCreativeTab(CreativeTabs tab)
    .setUnlocalizedName(String name)             // 不是 1.13 的 setTranslationKey
    .setHarvestLevel(String toolClass, int level) // 例如 "pickaxe"
```

> 本档 `Item` **没有** `setRarity()`、**没有** `setPotionEffect(String)`、**没有** `addToolClass`。稀有度走 `getRarity(ItemStack)`。食物效果在 `ItemFood.setPotionEffect(PotionEffect, float)`。

### ToolMaterial（工具材料）规范

```java
public static final Item.ToolMaterial MY_MATERIAL = EnumHelper.addToolMaterial(
    "MY_MATERIAL", 3, 1561, 8.0F, 3.0F, 15
);
```

`ToolMaterial` 是原版枚举，不要 `implements IItemTier`（1.14+）。自定义材料用 `EnumHelper.addToolMaterial(name, harvestLevel, maxUses, efficiency, damage, enchantability)`。

- harvestLevel：木=0，石=1，铁=2，钻=3
- maxUses：耐久
- efficiency：挖掘速度
- damage：附加攻击
- enchantability：附魔能力

### 注册约束

- ItemBlock 关联方块时，registry name 必须与方块完全相同
- 工具使用 `ToolMaterial` 时，需要在构造中传入材料

---

## Decision Flow

### Decision: 需要什么类型的物品？

```
IF 需要可放置的基础方块物品
  → 注册 ItemBlock（关联已有的方块）
  → 不需要新建 Item 子类

IF 需要普通物品（无特殊功能）
  → extends Item，使用默认属性

IF 需要工具（剑、镐、斧、铲）
  → extends ItemSword / ItemPickaxe / ItemAxe / ItemSpade / ItemHoe
  → 材料用 Item.ToolMaterial 枚举或 EnumHelper.addToolMaterial
  → 不要 extends ItemStack

IF 需要盔甲
  → extends ItemArmor
  → 材料用 ItemArmor.ArmorMaterial（可 EnumHelper.addArmorMaterial）
  → 构造：ItemArmor(ArmorMaterial, int renderIndex, EntityEquipmentSlot)

IF 需要食物（可食用物品）
  → extends ItemFood(int amount, float saturation, boolean isWolfFood)
  → 饱食也能吃：setAlwaysEdible()
  → 进食效果：setPotionEffect(PotionEffect, float) 或覆盖 onFoodEaten

IF 需要可耐久物品
  → 设置 setMaxDamage(maxDamage)
  → 覆盖 onItemUseFinish 处理使用逻辑
```

### Decision: ToolMaterial 定义

```
IF 自定义工具材料
  → EnumHelper.addToolMaterial(name, harvestLevel, maxUses, efficiency, damage, enchantability)
  → 修理物品用 setRepairItem(ItemStack) / getRepairItemStack()（不是 Ingredient）
  → 不要 implements IItemTier，也不要自己实现 ToolMaterial 接口（它是 enum）

IF 复用现有材料
  → Item.ToolMaterial.WOOD / STONE / IRON / GOLD / DIAMOND
```

---

## 示例：基础物品

```java
// items/ItemExample.java
public class ItemExample extends Item {
    public ItemExample() {
        setMaxStackSize(64);
    }

    @Override
    public ActionResult<ItemStack> onItemRightClick(World world, EntityPlayer player, EnumHand hand) {
        return new ActionResult<>(EnumActionResult.SUCCESS, player.getHeldItem(hand));
    }
}
```

## 示例：工具（剑）

```java
// items/ItemSwordExample.java
public class ItemSwordExample extends ItemSword {
    public ItemSwordExample(ToolMaterial material) {
        super(material);
    }
}
```

```java
// 注册剑
public static final Item EXAMPLE_SWORD = new ItemSwordExample(MY_MATERIAL)
        .setRegistryName(MODID, "example_sword")
        .setUnlocalizedName(MODID + ".example_sword");
```

## 示例：盔甲

```java
// items/ItemArmorExample.java
public class ItemArmorExample extends ItemArmor {
    public ItemArmorExample(ItemArmor.ArmorMaterial material, int renderIndex, EntityEquipmentSlot slot) {
        super(material, renderIndex, slot);
    }
}
```

```java
public static final ItemArmor.ArmorMaterial MY_ARMOR = EnumHelper.addArmorMaterial(
    "MY_MATERIAL",
    "mymod:my_armor",
    40,
    new int[]{4, 7, 9, 4},
    20,
    SoundEvents.ITEM_ARMOR_EQUIP_IRON,
    0.0F
);
```

## 示例：食物

```java
// items/ItemFoodExample.java
public class ItemFoodExample extends ItemFood {
    public ItemFoodExample(int amount, float saturation, boolean isWolfFood) {
        super(amount, saturation, isWolfFood);
    }

    @Override
    protected void onFoodEaten(ItemStack stack, World world, EntityPlayer player) {
        super.onFoodEaten(stack, world, player);
        // 食物效果逻辑
        player.addPotionEffect(new PotionEffect(MobEffects.JUMP_BOOST, 200, 1));
    }
}
```

```java
// 注册食物
public static final Item EXAMPLE_FOOD = new ItemFoodExample(4, 0.3f, false)
        .setRegistryName(MODID, "example_food")
        .setUnlocalizedName(MODID + ".example_food");
```

> 注：`ItemFood.setPotionEffect` 接受 `PotionEffect` + 概率。`PotionEffect` 第一个参数是 `Potion`（如 `MobEffects.JUMP_BOOST`），不是 `int` ID。
