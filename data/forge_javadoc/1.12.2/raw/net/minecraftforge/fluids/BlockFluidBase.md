---
title: "BlockFluidBase"
description: "public abstract class BlockFluidBase extends Block implements IFluidBlock"
package: "net/minecraftforge/fluids"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/BlockFluidBase.html"
sourceType: javadoc
---

# BlockFluidBase

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraftforge.fluids.BlockFluidBase

## Class signature

```java
public abstract class BlockFluidBase extends Block implements IFluidBlock
```

## Constructors

- `BlockFluidBase(Fluid fluid, Material material)`
- `BlockFluidBase(Fluid fluid, Material material, MapColor mapColor)`

## Methods

- `abstract boolean canCollideCheck(IBlockState state, boolean fullHit)`
- `boolean canDisplace(IBlockAccess world, BlockPos pos)` — Returns true if the block at (pos) is displaceable.
- `protected boolean causesDownwardCurrent(IBlockAccess world, BlockPos pos, EnumFacing face)`
- `protected BlockStateContainer createBlockState()`
- `boolean displaceIfPossible(World world, BlockPos pos)` — Attempt to displace the block at (pos), return true if it was displaced.
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `BlockRenderLayer getBlockLayer()`
- `float getBlockLiquidHeight(World world, BlockPos pos, IBlockState state, Material material)` — Called when entities are swimming in the given liquid and returns the relative height (used by EntityBoat )
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `int getDensity()`
- `static int getDensity(IBlockAccess world, BlockPos pos)`
- `IBlockState getExtendedState(IBlockState oldState, IBlockAccess world, BlockPos pos)` — Can return IExtendedBlockState
- `float getFilledPercentage(IBlockAccess world, BlockPos pos)`
- `float getFilledPercentage(World world, BlockPos pos)` — Returns the amount of a single block is filled.
- `static double getFlowDirection(IBlockAccess world, BlockPos pos)`
- `Vec3d getFlowVector(IBlockAccess world, BlockPos pos)`
- `Fluid getFluid()` — Returns the Fluid associated with this Block.
- `float getFluidHeightAverage(float... flow)`
- `float getFluidHeightForRender(IBlockAccess world, BlockPos pos, IBlockState up)`
- `Vec3d getFogColor(World world, BlockPos pos, IBlockState state, Entity entity, Vec3d originalColor, float partialTicks)` — Use this to change the fog color used when the entity is "inside" a material.
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getLightValue(IBlockState state, IBlockAccess world, BlockPos pos)` — Get a light value for this block, taking into account the given state and coordinates, normal ranges are between 0 and 15
- `abstract int getMaxRenderHeightMeta()`
- `int getMetaFromState(IBlockState state)`
- `int getPackedLightmapCoords(IBlockState state, IBlockAccess world, BlockPos pos)`
- `float getQuantaPercentage(IBlockAccess world, BlockPos pos)`
- `abstract int getQuantaValue(IBlockAccess world, BlockPos pos)`
- `int getQuantaValueAbove(IBlockAccess world, BlockPos pos, int aboveThis)`
- `int getQuantaValueBelow(IBlockAccess world, BlockPos pos, int belowThis)`
- `IBlockState getStateAtViewpoint(IBlockState state, IBlockAccess world, BlockPos pos, Vec3d viewpoint)` — Used to determine the state 'viewed' by an entity (see ActiveRenderInfo.getBlockStateAtEntityViewpoint(World, Entity, float) ).
- `@Deprecated IBlockState getStateFromMeta(int meta)`
- `int getTemperature()`
- `static int getTemperature(IBlockAccess world, BlockPos pos)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess world, BlockPos pos)`
- `Vec3d modifyAcceleration(World world, BlockPos pos, Entity entity, Vec3d vec)`
- `void neighborChanged(IBlockState state, World world, BlockPos pos, Block neighborBlock, BlockPos neighbourPos)`
- `void onBlockAdded(World world, BlockPos pos, IBlockState state)`
- `int quantityDropped(java.util.Random par1Random)`
- `boolean requiresUpdates()`
- `BlockFluidBase setDensity(int density)`
- `BlockFluidBase setMaxScaledLight(int maxScaledLight)`
- `BlockFluidBase setQuantaPerBlock(int quantaPerBlock)`
- `BlockFluidBase setRenderLayer(BlockRenderLayer renderLayer)`
- `BlockFluidBase setTemperature(int temperature)`
- `BlockFluidBase setTickRate(int tickRate)`
- `boolean shouldSideBeRendered(IBlockState state, IBlockAccess world, BlockPos pos, EnumFacing side)`
- `int tickRate(World world)`

## Fields

- `protected static java.util.Map<Block, java.lang.Boolean> defaultDisplacements`
- `protected Fluid definedFluid` — This is the fluid used in the constructor.
- `protected int density`
- `protected int densityDir`
- `protected java.util.Map<Block, java.lang.Boolean> displacements`
- `static PropertyFloat FLOW_DIRECTION`
- `static<any> FLUID_RENDER_PROPS`
- `protected java.lang.String fluidName`
- `static PropertyInteger LEVEL`
- `static PropertyFloat [] LEVEL_CORNERS`
- `protected int maxScaledLight`
- `protected float quantaFraction`
- `protected int quantaPerBlock`
- `protected float quantaPerBlockFloat`
- `protected BlockRenderLayer renderLayer`
- `static net.minecraftforge.fluids.BlockFluidBase.UnlistedPropertyBool[] SIDE_OVERLAYS`
- `protected int temperature`
- `protected int tickRate`
