---
title: "BlockFluidBase"
description: "public abstract class BlockFluidBase extends Block implements IFluidBlock"
package: "net/minecraftforge/fluids"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fluids/BlockFluidBase.html"
sourceType: javadoc
---

# BlockFluidBase

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraftforge.fluids.BlockFluidBase

## Class signature

```java
public abstract class BlockFluidBase extends Block implements IFluidBlock
```

## Constructors

- `BlockFluidBase(Fluid fluid, Material material)`

## Methods

- `abstract boolean canCollideCheck(IBlockState state, boolean fullHit)`
- `boolean canDisplace(IBlockAccess world, BlockPos pos)` — Returns true if the block at (pos) is displaceable.
- `protected BlockState createBlockState()`
- `boolean displaceIfPossible(World world, BlockPos pos)` — Attempt to displace the block at (pos), return true if it was displaced.
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World world, BlockPos pos, IBlockState state)`
- `static int getDensity(IBlockAccess world, BlockPos pos)`
- `IBlockState getExtendedState(IBlockState oldState, IBlockAccess worldIn, BlockPos pos)` — Can return IExtendedBlockState
- `float getFilledPercentage(World world, BlockPos pos)` — Returns the amount of a single block is filled.
- `static double getFlowDirection(IBlockAccess world, BlockPos pos)`
- `Vec3 getFlowVector(IBlockAccess world, BlockPos pos)`
- `Fluid getFluid()` — Returns the Fluid associated with this Block.
- `float getFluidHeightAverage(float... flow)`
- `float getFluidHeightForRender(IBlockAccess world, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getLightValue(IBlockAccess world, BlockPos pos)` — Get a light value for the block at the specified coordinates, normal ranges are between 0 and 15
- `abstract int getMaxRenderHeightMeta()`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `int getMixedBrightnessForBlock(IBlockAccess world, BlockPos pos)`
- `float getQuantaPercentage(IBlockAccess world, BlockPos pos)`
- `abstract int getQuantaValue(IBlockAccess world, BlockPos pos)`
- `int getQuantaValueAbove(IBlockAccess world, BlockPos pos, int aboveThis)`
- `int getQuantaValueBelow(IBlockAccess world, BlockPos pos, int belowThis)`
- `static int getTemperature(IBlockAccess world, BlockPos pos)`
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean isPassable(IBlockAccess world, BlockPos pos)`
- `Vec3 modifyAcceleration(World world, BlockPos pos, Entity entity, Vec3 vec)`
- `void onBlockAdded(World world, BlockPos pos, IBlockState state)`
- `void onNeighborBlockChange(World world, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `int quantityDropped(java.util.Random par1Random)` — Returns the quantity of items to drop on block destruction.
- `boolean requiresUpdates()`
- `BlockFluidBase setDensity(int density)`
- `BlockFluidBase setMaxScaledLight(int maxScaledLight)`
- `BlockFluidBase setQuantaPerBlock(int quantaPerBlock)`
- `BlockFluidBase setRenderLayer(EnumWorldBlockLayer renderLayer)`
- `BlockFluidBase setTemperature(int temperature)`
- `BlockFluidBase setTickRate(int tickRate)`
- `boolean shouldSideBeRendered(IBlockAccess world, BlockPos pos, EnumFacing side)`
- `int tickRate(World world)` — How many world ticks before ticking

## Fields

- `protected static java.util.Map<Block, java.lang.Boolean> defaultDisplacements`
- `protected Fluid definedFluid` — This is the fluid used in the constructor.
- `protected int density`
- `protected int densityDir`
- `protected java.util.Map<Block, java.lang.Boolean> displacements`
- `static PropertyFloat FLOW_DIRECTION`
- `static IUnlistedProperty<java.lang.Float>[] FLUID_RENDER_PROPS`
- `protected java.lang.String fluidName`
- `static PropertyInteger LEVEL`
- `static PropertyFloat [] LEVEL_CORNERS`
- `protected int maxScaledLight`
- `protected int quantaPerBlock`
- `protected float quantaPerBlockFloat`
- `protected EnumWorldBlockLayer renderLayer`
- `protected int temperature`
- `protected int tickRate`
