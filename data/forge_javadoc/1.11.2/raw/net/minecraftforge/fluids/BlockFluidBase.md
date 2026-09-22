---
title: "BlockFluidBase"
description: "public abstract class BlockFluidBase extends Block implements IFluidBlock"
package: "net/minecraftforge/fluids"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/BlockFluidBase.html"
sourceType: javadoc
---

# BlockFluidBase

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraftforge.fluids.BlockFluidBase

## Class signature

```java
public abstract class BlockFluidBase extends Block implements IFluidBlock
```

## Constructors

- `BlockFluidBase(Fluid fluid, Material material)`

## Methods

- `abstract boolean canCollideCheck(IBlockState state, boolean fullHit)`
- `boolean canDisplace(IBlockAccess world, BlockPos pos)` — Returns true if the block at (pos) is displaceable.
- `protected BlockStateContainer createBlockState()`
- `boolean displaceIfPossible(World world, BlockPos pos)` — Attempt to displace the block at (pos), return true if it was displaced.
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `static int getDensity(IBlockAccess world, BlockPos pos)`
- `IBlockState getExtendedState(IBlockState oldState, IBlockAccess worldIn, BlockPos pos)` — Can return IExtendedBlockState
- `float getFilledPercentage(World world, BlockPos pos)` — Returns the amount of a single block is filled.
- `static double getFlowDirection(IBlockAccess world, BlockPos pos)`
- `Vec3d getFlowVector(IBlockAccess world, BlockPos pos)`
- `Fluid getFluid()` — Returns the Fluid associated with this Block.
- `float getFluidHeightAverage(float... flow)`
- `float getFluidHeightForRender(IBlockAccess world, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getLightValue(IBlockState state, IBlockAccess world, BlockPos pos)` — Get a light value for the block at the specified coordinates, normal ranges are between 0 and 15
- `abstract int getMaxRenderHeightMeta()`
- `int getMetaFromState(IBlockState state)`
- `int getPackedLightmapCoords(IBlockState state, IBlockAccess world, BlockPos pos)`
- `float getQuantaPercentage(IBlockAccess world, BlockPos pos)`
- `abstract int getQuantaValue(IBlockAccess world, BlockPos pos)`
- `int getQuantaValueAbove(IBlockAccess world, BlockPos pos, int aboveThis)`
- `int getQuantaValueBelow(IBlockAccess world, BlockPos pos, int belowThis)`
- `@Deprecated IBlockState getStateFromMeta(int meta)`
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
- `static com.google.common.collect.ImmutableList<IUnlistedProperty<java.lang.Float>> FLUID_RENDER_PROPS`
- `protected java.lang.String fluidName`
- `static PropertyInteger LEVEL`
- `static PropertyFloat [] LEVEL_CORNERS`
- `protected int maxScaledLight`
- `protected int quantaPerBlock`
- `protected float quantaPerBlockFloat`
- `protected BlockRenderLayer renderLayer`
- `protected int temperature`
- `protected int tickRate`
