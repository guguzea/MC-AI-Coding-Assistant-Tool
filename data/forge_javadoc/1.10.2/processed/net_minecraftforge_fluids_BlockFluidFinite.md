# BlockFluidFinite

## Class signature

```java
public class BlockFluidFinite extends BlockFluidBase
```

## Constructors

- `public BlockFluidFinite( Fluid fluid, Material material)`

## Methods

- `public int getQuantaValue( IBlockAccess world, BlockPos pos)`
- `public boolean canCollideCheck( IBlockState state, boolean fullHit)`
- `public int getMaxRenderHeightMeta()`
- `public void updateTick( World world, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public int tryToFlowVerticallyInto( World world, BlockPos pos, int amtToInput)`
- `public FluidStack drain( World world, BlockPos pos, boolean doDrain)`
- `public boolean canDrain( World world, BlockPos pos)`

## Description

This is a cellular-automata based finite fluid block implementation. It is highly recommended that you use/extend this class for finite fluid blocks.