---
title: "BlockLiquid"
description: "public abstract class BlockLiquid extends Block"
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockLiquid.html"
sourceType: javadoc
---

# BlockLiquid

## Class signature

```java
public abstract class BlockLiquid extends Block
```

## Constructors

- `protected BlockLiquid( Material materialIn)`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, World worldIn, BlockPos pos)`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public static float getLiquidHeightPercent(int meta)`
- `protected int getDepth( IBlockState p_189542_1_)`
- `protected int getRenderedDepth( IBlockState p_189545_1_)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean canCollideCheck( IBlockState state, boolean hitIfLiquid)`
- `public boolean isBlockSolid( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `protected Vec3d getFlow( IBlockAccess p_189543_1_, BlockPos p_189543_2_, IBlockState p_189543_3_)`
- `public Vec3d modifyAcceleration( World worldIn, BlockPos pos, Entity entityIn, Vec3d motion)`
- `public int tickRate( World worldIn)`
- `public boolean shouldRenderSides( IBlockAccess blockAccess, BlockPos pos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `public int getPackedLightmapCoords( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public BlockRenderLayer getBlockLayer()`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public static float getSlopeAngle( IBlockAccess p_189544_0_, BlockPos p_189544_1_, Material p_189544_2_, IBlockState p_189544_3_)`
- `public boolean checkForMixing( World worldIn, BlockPos pos, IBlockState state)`
- `protected void triggerMixEffects( World worldIn, BlockPos pos)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public static BlockDynamicLiquid getFlowingBlock( Material materialIn)`
- `public static BlockStaticLiquid getStaticBlock( Material materialIn)`
