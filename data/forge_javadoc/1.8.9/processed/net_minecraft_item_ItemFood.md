# ItemFood

## Class signature

```java
public class ItemFood extends Item
```

## Constructors

- `public ItemFood(int amount, float saturation, boolean isWolfFood)`
- `public ItemFood(int amount, boolean isWolfFood)`

## Methods

- `public ItemStack onItemUseFinish( ItemStack stack, World worldIn, EntityPlayer playerIn)`
- `protected void onFoodEaten( ItemStack stack, World worldIn, EntityPlayer player)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public ItemStack onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)`
- `public int getHealAmount( ItemStack stack)`
- `public float getSaturationModifier( ItemStack stack)`
- `public boolean isWolfsFavoriteMeat()`
- `public ItemFood setPotionEffect(int id, int duration, int amplifier, float probability)`
- `public ItemFood setAlwaysEdible()`

## Description

Number of ticks to run while 'EnumAction'ing until result.