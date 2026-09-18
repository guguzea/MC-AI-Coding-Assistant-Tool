# ItemBow

## Class signature

```java
public class ItemBow extends Item
```

## Constructors

- `public ItemBow()`

## Methods

- `public void onPlayerStoppedUsing( ItemStack stack, World worldIn, EntityPlayer playerIn, int timeLeft)`
- `public ItemStack onItemUseFinish( ItemStack stack, World worldIn, EntityPlayer playerIn)`
- `public int getMaxItemUseDuration( ItemStack stack)`
- `public EnumAction getItemUseAction( ItemStack stack)`
- `public ItemStack onItemRightClick( ItemStack itemStackIn, World worldIn, EntityPlayer playerIn)`
- `public int getItemEnchantability()`

## Description

Return the enchantability factor of the item, most of the time is based on material.