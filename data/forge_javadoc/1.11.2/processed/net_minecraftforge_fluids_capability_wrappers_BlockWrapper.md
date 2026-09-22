# BlockWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.capability.templates.VoidFluidHandler → net.minecraftforge.fluids.capability.wrappers.BlockWrapper

## Class signature

```java
public class BlockWrapper extends VoidFluidHandler
```

## Constructors

- `BlockWrapper(Block block, World world, BlockPos blockPos)`

## Methods

- `int fill(FluidStack resource, boolean doFill)` — Fills fluid into internal tanks, distribution is left entirely to the IFluidHandler.

## Fields

- `protected Block block`
- `protected BlockPos blockPos`
- `protected World world`