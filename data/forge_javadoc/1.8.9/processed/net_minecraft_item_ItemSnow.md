# ItemSnow

## Class signature

```java
public class ItemSnow extends ItemBlock
```

## Constructors

- `public ItemSnow( Block block)`

## Methods

- `public boolean onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public int getMetadata(int damage)`
- `public boolean canPlaceBlockOnSide( World world, BlockPos pos, EnumFacing side, EntityPlayer player, ItemStack stack)`

## Description

Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks).