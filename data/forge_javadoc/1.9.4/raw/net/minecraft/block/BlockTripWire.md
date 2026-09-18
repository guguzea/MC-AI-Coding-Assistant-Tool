---
title: "BlockTripWire"
description: "public class BlockTripWire extends Block"
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockTripWire.html"
sourceType: javadoc
---

# BlockTripWire

## Class signature

```java
public class BlockTripWire extends Block
```

## Constructors

- `public BlockTripWire()`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, World worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public BlockRenderLayer getBlockLayer()`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public static boolean isConnectedTo( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing direction)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
