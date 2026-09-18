---
title: "BlockFurnace"
description: "public class BlockFurnace extends BlockContainer"
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockFurnace.html"
sourceType: javadoc
---

# BlockFurnace

## Class signature

```java
public class BlockFurnace extends BlockContainer
```

## Constructors

- `protected BlockFurnace(boolean isBurning)`

## Methods

- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public static void setState(boolean active, World worldIn, BlockPos pos)`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean hasComparatorInputOverride( IBlockState state)`
- `public int getComparatorInputOverride( IBlockState blockState, World worldIn, BlockPos pos)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
