# BlockFluidFinite

## Class signature

```java
public class BlockFluidFinite extends BlockFluidBase
```

## Constructors

- `public BlockFluidFinite( Fluid fluid, Material material)`

## Methods

- `public int getQuantaValue( IBlockAccess world, BlockPos pos)`
- `public boolean canCollideCheck(@Nonnull IBlockState state, boolean fullHit)`
- `public int getMaxRenderHeightMeta()`
- `public void updateTick(@Nonnull World world, @Nonnull BlockPos pos, @Nonnull IBlockState state, @Nonnull java.util.Random rand)`
- `public int tryToFlowVerticallyInto( World world, BlockPos pos, int amtToInput)`
- `public int place( World world, BlockPos pos, @Nonnull FluidStack fluidStack, boolean doPlace)`
- `public FluidStack drain( World world, BlockPos pos, boolean doDrain)`
- `public boolean canDrain( World world, BlockPos pos)`

## Description

This is a cellular-automata based finite fluid block implementation. It is highly recommended that you use/extend this class for finite fluid blocks.