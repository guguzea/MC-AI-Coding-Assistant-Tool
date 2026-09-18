---
title: "BlockLiquid"
description: "Called when entities are swimming in the given liquid and returns the relative height (used by EntityBoat )"
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockLiquid.html"
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
- `public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public static float getLiquidHeightPercent(int meta)`
- `protected int getDepth( IBlockState state)`
- `protected int getRenderedDepth( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean canCollideCheck( IBlockState state, boolean hitIfLiquid)`
- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `protected Vec3d getFlow( IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `public Vec3d modifyAcceleration( World worldIn, BlockPos pos, Entity entityIn, Vec3d motion)`
- `public int tickRate( World worldIn)`
- `public boolean shouldRenderSides( IBlockAccess blockAccess, BlockPos pos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public int getPackedLightmapCoords( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean checkForMixing( World worldIn, BlockPos pos, IBlockState state)`
- `public BlockRenderLayer getBlockLayer()`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public static float getSlopeAngle( IBlockAccess worldIn, BlockPos pos, Material materialIn, IBlockState state)`
- `protected void triggerMixEffects( World worldIn, BlockPos pos)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public static BlockDynamicLiquid getFlowingBlock( Material materialIn)`
- `public static BlockStaticLiquid getStaticBlock( Material materialIn)`
- `public static float getBlockLiquidHeight( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public static float getLiquidHeight( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public float getBlockLiquidHeight( World world, BlockPos pos, IBlockState state, Material material)`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `public Vec3d getFogColor( World world, BlockPos pos, IBlockState state, Entity entity, Vec3d originalColor, float partialTicks)`

## Description

Called when entities are swimming in the given liquid and returns the relative height (used by EntityBoat )
