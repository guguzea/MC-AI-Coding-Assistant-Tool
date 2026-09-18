# IFluidBlock

## Class signature

```java
public interface IFluidBlock
```

## Methods

- `Fluid getFluid()`
- `int place( World world, BlockPos pos, @Nonnull FluidStack fluidStack, boolean doPlace)`
- `@Nullable FluidStack drain( World world, BlockPos pos, boolean doDrain)`
- `boolean canDrain( World world, BlockPos pos)`
- `float getFilledPercentage( World world, BlockPos pos)`

## Description

Implement this interface on Block classes which represent world-placeable Fluids. NOTE: Using/extending the reference implementations BlockFluidBase is encouraged.