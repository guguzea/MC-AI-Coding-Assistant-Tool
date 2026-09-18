# ItemShears

## Class signature

```java
public class ItemShears extends Item
```

## Constructors

- `public ItemShears()`

## Methods

- `public boolean onBlockDestroyed( ItemStack stack, World worldIn, IBlockState state, BlockPos pos, EntityLivingBase entityLiving)`
- `public boolean canHarvestBlock( IBlockState blockIn)`
- `public float getStrVsBlock( ItemStack stack, IBlockState state)`
- `public boolean itemInteractionForEntity( ItemStack itemstack, EntityPlayer player, EntityLivingBase entity, EnumHand hand)`
- `public boolean onBlockStartBreak( ItemStack itemstack, BlockPos pos, EntityPlayer player)`

## Description

Called before a block is broken.