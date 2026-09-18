---
title: "BlockVine"
description: "Check whether this Block can be placed on the given side"
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockVine.html"
sourceType: javadoc
---

# BlockVine

## Class signature

```java
public class BlockVine extends Block implements IShearable
```

## Constructors

- `public BlockVine()`

## Methods

- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public void setBlockBoundsForItemRender()`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public boolean isReplaceable( World worldIn, BlockPos pos)`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side)`
- `public int getBlockColor()`
- `public int getRenderColor( IBlockState state)`
- `public int colorMultiplier( IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`
- `public IBlockState getStateFromMeta(int meta)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public static PropertyBool getPropertyFor( EnumFacing side)`
- `public static int getNumGrownFaces( IBlockState state)`
- `public boolean isLadder( IBlockAccess world, BlockPos pos, EntityLivingBase entity)`
- `public boolean isShearable( ItemStack item, IBlockAccess world, BlockPos pos)`
- `public java.util.List< ItemStack > onSheared( ItemStack item, IBlockAccess world, BlockPos pos, int fortune)`

## Description

Check whether this Block can be placed on the given side
