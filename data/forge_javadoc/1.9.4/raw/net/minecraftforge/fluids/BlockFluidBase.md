---
title: "BlockFluidBase"
description: "This is a base implementation for Fluid blocks. It is highly recommended that you extend this class or one of the Forge-provided child classes."
package: "net/minecraftforge/fluids"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fluids/BlockFluidBase.html"
sourceType: javadoc
---

# BlockFluidBase

## Class signature

```java
public abstract class BlockFluidBase extends Block implements IFluidBlock
```

## Constructors

- `public BlockFluidBase( Fluid fluid, Material material)`

## Methods

- `protected BlockStateContainer createBlockState()`
- `public int getMetaFromState( IBlockState state)`
- `public BlockFluidBase setQuantaPerBlock(int quantaPerBlock)`
- `public BlockFluidBase setDensity(int density)`
- `public BlockFluidBase setTemperature(int temperature)`
- `public BlockFluidBase setTickRate(int tickRate)`
- `public BlockFluidBase setRenderLayer( BlockRenderLayer renderLayer)`
- `public BlockFluidBase setMaxScaledLight(int maxScaledLight)`
- `public boolean canDisplace( IBlockAccess world, BlockPos pos)`
- `public boolean displaceIfPossible( World world, BlockPos pos)`
- `public abstract int getQuantaValue( IBlockAccess world, BlockPos pos)`
- `public abstract boolean canCollideCheck( IBlockState state, boolean fullHit)`
- `public abstract int getMaxRenderHeightMeta()`
- `public void onBlockAdded( World world, BlockPos pos, IBlockState state)`
- `public void neighborChanged( IBlockState state, World world, BlockPos pos, Block neighborBlock)`
- `public boolean requiresUpdates()`
- `public boolean isPassable( IBlockAccess world, BlockPos pos)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random par1Random)`
- `public int tickRate( World world)`
- `public Vec3d modifyAcceleration( World world, BlockPos pos, Entity entity, Vec3d vec)`
- `public int getLightValue( IBlockState state, IBlockAccess world, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public int getPackedLightmapCoords( IBlockState state, IBlockAccess world, BlockPos pos)`
- `public BlockRenderLayer getBlockLayer()`
- `public boolean shouldSideBeRendered( IBlockState state, IBlockAccess world, BlockPos pos, EnumFacing side)`
- `public IBlockState getExtendedState( IBlockState oldState, IBlockAccess worldIn, BlockPos pos)`
- `public static final int getDensity( IBlockAccess world, BlockPos pos)`
- `public static final int getTemperature( IBlockAccess world, BlockPos pos)`
- `public static double getFlowDirection( IBlockAccess world, BlockPos pos)`
- `public final int getQuantaValueBelow( IBlockAccess world, BlockPos pos, int belowThis)`
- `public final int getQuantaValueAbove( IBlockAccess world, BlockPos pos, int aboveThis)`
- `public final float getQuantaPercentage( IBlockAccess world, BlockPos pos)`
- `public float getFluidHeightAverage(float... flow)`
- `public float getFluidHeightForRender( IBlockAccess world, BlockPos pos)`
- `public Vec3d getFlowVector( IBlockAccess world, BlockPos pos)`
- `public Fluid getFluid()`
- `public float getFilledPercentage( World world, BlockPos pos)`
- `public AxisAlignedBB getSelectedBoundingBox( IBlockState blockState, World worldIn, BlockPos pos)`

## Description

This is a base implementation for Fluid blocks. It is highly recommended that you extend this class or one of the Forge-provided child classes.
