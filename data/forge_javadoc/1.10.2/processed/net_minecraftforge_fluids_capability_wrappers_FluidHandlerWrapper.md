# FluidHandlerWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.capability.wrappers.FluidHandlerWrapper

## Class signature

```java
public class FluidHandlerWrapper extends java.lang.Object implements IFluidHandler
```

## Constructors

- `@Deprecated FluidHandlerWrapper(IFluidHandler handler, EnumFacing side)`

## Methods

- `@Deprecated FluidStack drain(FluidStack resource, boolean doDrain)`
- `@Deprecated FluidStack drain(int maxDrain, boolean doDrain)`
- `@Deprecated int fill(FluidStack resource, boolean doFill)`
- `@Deprecated IFluidTankProperties [] getTankProperties()`

## Fields

- `protected IFluidHandler handler`
- `protected EnumFacing side`