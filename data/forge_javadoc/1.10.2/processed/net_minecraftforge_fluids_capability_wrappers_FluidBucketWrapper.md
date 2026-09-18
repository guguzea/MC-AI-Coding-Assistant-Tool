# FluidBucketWrapper

## Class signature

```java
public class FluidBucketWrapper extends java.lang.Object implements IFluidHandler , ICapabilityProvider
```

## Constructors

- `public FluidBucketWrapper( ItemStack container)`

## Methods

- `public boolean canFillFluidType( FluidStack fluid)`
- `@Nullable public FluidStack getFluid()`
- `protected void setFluid( Fluid fluid)`
- `public IFluidTankProperties [] getTankProperties()`
- `public int fill( FluidStack resource, boolean doFill)`
- `@Nullable public FluidStack drain( FluidStack resource, boolean doDrain)`
- `@Nullable public FluidStack drain(int maxDrain, boolean doDrain)`
- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`

## Description

Wrapper for vanilla and forge buckets. Swaps between empty bucket and filled bucket of the correct type.