---
name: mc-item
description: Forge 1.12.2 Item skill (Item.Properties, IItemTier, no Tier, FoodStats)
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# 物品开发（Forge 1.12.2）

## 快速开始

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModItems {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<Item> event) {
        event.getRegistry().register(
            new Item(new Item.Properties().maxStackSize(64))
                .setRegistryName(MOD_ID, "my_item")
        );
    }
}
```

## Decision: 选择物品类型

```
IF 只是手持物品（无特殊行为）
  → Item

IF 剑/工具
  → 继承 ItemSword 或自定义 Item

IF 盔甲
  → 继承 ItemArmor + IArmorMaterial

IF 可食用
  → 继承 Item + onItemRightClick() 中使用 player.getFoodStats()

IF 可在创造模式标签中找到
  → 使用 .setCreativeTab()
```

## IItemTier 枚举（工具材料）

```java
public enum MyTier implements IItemTier {
    MY_MATERIAL(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.fromItems(Items.DIAMOND));

    @Override public int getMaxUses() { return 1561; }
    @Override public float getEfficiency() { return 8.0f; }
    @Override public float getAttackDamage() { return 3.0f; }
    @Override public int getHarvestLevel() { return 3; }
    @Override public int getEnchantability() { return 15; }
    @Override public Ingredient getRepairMaterial() { return Ingredient.fromItems(Items.DIAMOND); }
}
```

## 剑（Sword）

```java
public class MySword extends ItemSword {
    public MySword(ToolMaterial material) {
        super(material);
        this.setRegistryName(MOD_ID, "my_sword");
        this.setUnlocalizedName("my_sword");
    }
}
```

## 食物（FoodStats）

```java
@Override
public ActionResult<ItemStack> onItemRightClick(World world, EntityPlayer player, EnumHand hand) {
    if (!player.getFoodStats().needFood()) {
        return ActionResult.newActionResult(EnumActionResult.FAIL, stack);
    }
    player.getFoodStats().addStats(4, 0.3f);  // hunger, saturation
    stack.shrink(1);
    return ActionResult.newActionResult(EnumActionResult.SUCCESS, stack);
}
```

## 常见错误

- ❌ 使用 `Tier` 接口（1.12.2 用 `IItemTier`）
- ❌ 忘记 `setRegistryName`
- ❌ 工具材料接口方法不完整

## Key Forge 1.12.2 Specs

- IItemTier (not Tier)
- Item.Properties (not default maxStackSize)
- FoodStats (not FoodComponent)
- NBTTagCompound (not CompoundTag)
- @SideOnly(Side.CLIENT)
