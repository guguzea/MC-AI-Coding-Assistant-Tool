# BlockFluidClassic

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraftforge.fluids.BlockFluidBase → net.minecraftforge.fluids.BlockFluidClassic

## Class signature

```java
public class BlockFluidClassic extends BlockFluidBase
```

## Constructors

- `BlockFluidClassic(Fluid fluid, Material material)`
- `BlockFluidClassic(Fluid fluid, Material material, MapColor mapColor)`

## Methods

- `protected int calculateFlowCost(World world, BlockPos pos, int recurseDepth, int side)`
- `boolean canCollideCheck(IBlockState state, boolean fullHit)`
- `boolean canDrain(World world, BlockPos pos)` — Check to see if a block can be drained.
- `protected boolean canFlowInto(IBlockAccess world, BlockPos pos)`
- `FluidStack drain(World world, BlockPos pos, boolean doDrain)` — Attempt to drain the block.
- `protected void flowIntoBlock(World world, BlockPos pos, int meta)`
- `protected int getLargerQuanta(IBlockAccess world, BlockPos pos, int compare)`
- `int getMaxRenderHeightMeta()`
- `protected boolean[] getOptimalFlowDirections(World world, BlockPos pos)`
- `int getQuantaValue(IBlockAccess world, BlockPos pos)`
- `protected boolean hasDownhillFlow(IBlockAccess world, BlockPos pos, EnumFacing direction)`
- `boolean isFlowingVertically(IBlockAccess world, BlockPos pos)`
- `boolean isSourceBlock(IBlockAccess world, BlockPos pos)`
- `int place(World world, BlockPos pos, FluidStack fluidStack, boolean doPlace)` — Attempts to place the block at a given position.
- `BlockFluidClassic setFluidStack(FluidStack stack)`
- `BlockFluidClassic setFluidStackAmount(int amount)`
- `void updateTick(World world, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected boolean canCreateSources`
- `protected int[] flowCost`
- `protected boolean[] isOptimalFlowDirection`
- `protected static java.util.List<EnumFacing> SIDES`
- `protected FluidStack stack`