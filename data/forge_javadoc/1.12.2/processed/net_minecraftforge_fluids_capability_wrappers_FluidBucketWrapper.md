# FluidBucketWrapper

## Class signature

```java
public class FluidBucketWrapper extends java.lang.Object implements IFluidHandlerItem , ICapabilityProvider
```

## Constructors

- `public FluidBucketWrapper( ItemStack container)`

## Methods

- `public ItemStack getContainer()`
- `public boolean canFillFluidType( FluidStack fluidStack)`
- `public FluidStack getFluid()`
- `@Deprecated protected void setFluid( Fluid fluid)`
- `protected void setFluid( FluidStack fluidStack)`
- `public IFluidTankProperties [] getTankProperties()`
- `public int fill( FluidStack resource, boolean doFill)`
- `public FluidStack drain( FluidStack resource, boolean doDrain)`
- `public FluidStack drain(int maxDrain, boolean doDrain)`
- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`

## Description

Wrapper for vanilla and forge buckets. Swaps between empty bucket and filled bucket of the correct type.