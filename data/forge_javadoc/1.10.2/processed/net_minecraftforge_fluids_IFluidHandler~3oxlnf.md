# IFluidHandler

## Class signature

```java
public interface IFluidHandler
```

## Methods

- `@Deprecated boolean canDrain(EnumFacing from, Fluid fluid)`
- `@Deprecated boolean canFill(EnumFacing from, Fluid fluid)`
- `@Deprecated FluidStack drain(EnumFacing from, FluidStack resource, boolean doDrain)`
- `@Deprecated FluidStack drain(EnumFacing from, int maxDrain, boolean doDrain)`
- `@Deprecated int fill(EnumFacing from, FluidStack resource, boolean doFill)`
- `@Deprecated FluidTankInfo [] getTankInfo(EnumFacing from)`