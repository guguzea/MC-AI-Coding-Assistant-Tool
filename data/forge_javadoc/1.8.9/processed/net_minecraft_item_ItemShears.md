# ItemShears

## Class signature

```java
public class ItemShears extends Item
```

## Constructors

- `public ItemShears()`

## Methods

- `public boolean onBlockDestroyed( ItemStack stack, World worldIn, Block blockIn, BlockPos pos, EntityLivingBase playerIn)`
- `public boolean canHarvestBlock( Block blockIn)`
- `public float getStrVsBlock( ItemStack stack, Block block)`
- `public boolean itemInteractionForEntity( ItemStack itemstack, EntityPlayer player, EntityLivingBase entity)`
- `public boolean onBlockStartBreak( ItemStack itemstack, BlockPos pos, EntityPlayer player)`

## Description

Check whether this Item can harvest the given Block