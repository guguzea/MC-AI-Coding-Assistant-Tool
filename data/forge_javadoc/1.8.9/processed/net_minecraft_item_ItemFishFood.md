# ItemFishFood

## Class signature

```java
public class ItemFishFood extends ItemFood
```

## Constructors

- `public ItemFishFood(boolean cooked)`

## Methods

- `public int getHealAmount( ItemStack stack)`
- `public float getSaturationModifier( ItemStack stack)`
- `public java.lang.String getPotionEffect( ItemStack stack)`
- `protected void onFoodEaten( ItemStack stack, World worldIn, EntityPlayer player)`
- `public void getSubItems( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > subItems)`
- `public java.lang.String getUnlocalizedName( ItemStack stack)`

## Description

returns a list of items with the same ID, but different meta (eg: dye returns 16 items)