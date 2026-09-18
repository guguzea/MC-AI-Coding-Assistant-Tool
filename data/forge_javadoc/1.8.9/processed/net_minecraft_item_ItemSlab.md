# ItemSlab

## Class signature

```java
public class ItemSlab extends ItemBlock
```

## Constructors

- `public ItemSlab( Block block, BlockSlab singleSlab, BlockSlab doubleSlab)`

## Methods

- `public int getMetadata(int damage)`
- `public java.lang.String getUnlocalizedName( ItemStack stack)`
- `public boolean onItemUse( ItemStack stack, EntityPlayer playerIn, World worldIn, BlockPos pos, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side, EntityPlayer player, ItemStack stack)`

## Description

Converts the given ItemStack damage value into a metadata value to be placed in the world when this Item is placed as a Block (mostly used with ItemBlocks).