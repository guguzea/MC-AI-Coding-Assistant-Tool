# FluidBucketWrapper

## Class signature

```java
public class FluidBucketWrapper extends java.lang.Object implements IFluidHandlerItem , ICapabilityProvider
```

## Constructors

- `public FluidBucketWrapper(@Nonnull ItemStack container)`

## Methods

- `@Nonnull public ItemStack getContainer()`
- `public boolean canFillFluidType( FluidStack fluid)`
- `@Nullable public FluidStack getFluid()`
- `protected void setFluid(@Nullable Fluid fluid)`
- `public IFluidTankProperties [] getTankProperties()`
- `public int fill( FluidStack resource, boolean doFill)`
- `@Nullable public FluidStack drain( FluidStack resource, boolean doDrain)`
- `@Nullable public FluidStack drain(int maxDrain, boolean doDrain)`
- `public boolean hasCapability(@Nonnull Capability <?> capability, @Nullable EnumFacing facing)`
- `@Nullable public <T> T getCapability(@Nonnull Capability <T> capability, @Nullable EnumFacing facing)`

## Description

Wrapper for vanilla and forge buckets. Swaps between empty bucket and filled bucket of the correct type.