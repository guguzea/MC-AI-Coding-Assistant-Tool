# IFluidBlock

## Class signature

```java
public interface IFluidBlock
```

## Methods

- `boolean canDrain(World world, BlockPos pos)` — Check to see if a block can be drained.
- `FluidStack drain(World world, BlockPos pos, boolean doDrain)` — Attempt to drain the block.
- `float getFilledPercentage(World world, BlockPos pos)` — Returns the amount of a single block is filled.
- `Fluid getFluid()` — Returns the Fluid associated with this Block.