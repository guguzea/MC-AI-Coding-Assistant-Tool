# ItemFishFood

**Inheritance:** java.lang.Object → net.minecraft.item.Item → net.minecraft.item.ItemFood → net.minecraft.item.ItemFishFood

## Class signature

```java
public class ItemFishFood extends ItemFood
```

## Methods

- `int getHealAmount(ItemStack stack)`
- `java.lang.String getPotionEffect(ItemStack stack)`
- `float getSaturationModifier(ItemStack stack)`
- `void getSubItems(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> subItems)` — returns a list of items with the same ID, but different meta (eg: dye returns 16 items)
- `java.lang.String getUnlocalizedName(ItemStack stack)` — Returns the unlocalized name of this item.
- `protected void onFoodEaten(ItemStack stack, World worldIn, EntityPlayer player)`

## Fields

- `ItemFishFood`