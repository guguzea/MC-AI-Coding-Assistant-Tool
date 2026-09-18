# BlockFluidClassic

## Class signature

```java
public class BlockFluidClassic extends BlockFluidBase
```

## Constructors

- `public BlockFluidClassic( Fluid fluid, Material material)`

## Methods

- `public BlockFluidClassic setFluidStack( FluidStack stack)`
- `public BlockFluidClassic setFluidStackAmount(int amount)`
- `public int getQuantaValue( IBlockAccess world, BlockPos pos)`
- `public boolean canCollideCheck( IBlockState state, boolean fullHit)`
- `public int getMaxRenderHeightMeta()`
- `public int getLightValue( IBlockState state, IBlockAccess world, BlockPos pos)`
- `public void updateTick( World world, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean isFlowingVertically( IBlockAccess world, BlockPos pos)`
- `public boolean isSourceBlock( IBlockAccess world, BlockPos pos)`
- `protected boolean[] getOptimalFlowDirections( World world, BlockPos pos)`
- `protected int calculateFlowCost( World world, BlockPos pos, int recurseDepth, int side)`
- `protected void flowIntoBlock( World world, BlockPos pos, int meta)`
- `protected boolean canFlowInto( IBlockAccess world, BlockPos pos)`
- `protected int getLargerQuanta( IBlockAccess world, BlockPos pos, int compare)`
- `public FluidStack drain( World world, BlockPos pos, boolean doDrain)`
- `public boolean canDrain( World world, BlockPos pos)`

## Description

This is a fluid block implementation which emulates vanilla Minecraft fluid behavior. It is highly recommended that you use/extend this class for "classic" fluid blocks.