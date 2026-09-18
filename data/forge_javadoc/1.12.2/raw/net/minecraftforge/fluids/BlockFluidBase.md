---
title: "BlockFluidBase"
description: "This is a base implementation for Fluid blocks. It is highly recommended that you extend this class or one of the Forge-provided child classes."
package: "net/minecraftforge/fluids"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/BlockFluidBase.html"
sourceType: javadoc
---

# BlockFluidBase

## Class signature

```java
public abstract class BlockFluidBase extends Block implements IFluidBlock
```

## Constructors

- `public BlockFluidBase( Fluid fluid, Material material, MapColor mapColor)`
- `public BlockFluidBase( Fluid fluid, Material material)`

## Methods

- `protected BlockStateContainer createBlockState()`
- `public int getMetaFromState( IBlockState state)`
- `@Deprecated public IBlockState getStateFromMeta(int meta)`
- `public BlockFluidBase setQuantaPerBlock(int quantaPerBlock)`
- `public BlockFluidBase setDensity(int density)`
- `public BlockFluidBase setTemperature(int temperature)`
- `public BlockFluidBase setTickRate(int tickRate)`
- `public BlockFluidBase setRenderLayer( BlockRenderLayer renderLayer)`
- `public BlockFluidBase setMaxScaledLight(int maxScaledLight)`
- `public final int getDensity()`
- `public final int getTemperature()`
- `public boolean canDisplace( IBlockAccess world, BlockPos pos)`
- `public boolean displaceIfPossible( World world, BlockPos pos)`
- `public abstract int getQuantaValue( IBlockAccess world, BlockPos pos)`
- `public abstract boolean canCollideCheck( IBlockState state, boolean fullHit)`
- `public abstract int getMaxRenderHeightMeta()`
- `public void onBlockAdded( World world, BlockPos pos, IBlockState state)`
- `public void neighborChanged( IBlockState state, World world, BlockPos pos, Block neighborBlock, BlockPos neighbourPos)`
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
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `public boolean shouldSideBeRendered( IBlockState state, IBlockAccess world, BlockPos pos, EnumFacing side)`
- `public IBlockState getExtendedState( IBlockState oldState, IBlockAccess world, BlockPos pos)`
- `public static int getDensity( IBlockAccess world, BlockPos pos)`
- `public static int getTemperature( IBlockAccess world, BlockPos pos)`
- `public static double getFlowDirection( IBlockAccess world, BlockPos pos)`
- `public final int getQuantaValueBelow( IBlockAccess world, BlockPos pos, int belowThis)`
- `public final int getQuantaValueAbove( IBlockAccess world, BlockPos pos, int aboveThis)`
- `public final float getQuantaPercentage( IBlockAccess world, BlockPos pos)`
- `public float getFluidHeightAverage(float... flow)`
- `public float getFluidHeightForRender( IBlockAccess world, BlockPos pos, IBlockState up)`
- `public Vec3d getFlowVector( IBlockAccess world, BlockPos pos)`
- `protected boolean causesDownwardCurrent( IBlockAccess world, BlockPos pos, EnumFacing face)`
- `public Fluid getFluid()`
- `public float getFilledPercentage( World world, BlockPos pos)`
- `public float getFilledPercentage( IBlockAccess world, BlockPos pos)`
- `public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public Vec3d getFogColor( World world, BlockPos pos, IBlockState state, Entity entity, Vec3d originalColor, float partialTicks)`
- `public IBlockState getStateAtViewpoint( IBlockState state, IBlockAccess world, BlockPos pos, Vec3d viewpoint)`
- `public float getBlockLiquidHeight( World world, BlockPos pos, IBlockState state, Material material)`

## Description

This is a base implementation for Fluid blocks. It is highly recommended that you extend this class or one of the Forge-provided child classes.
