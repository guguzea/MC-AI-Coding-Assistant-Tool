# FluidBucketWrapper

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.capability.wrappers.FluidBucketWrapper

## Class signature

```java
public class FluidBucketWrapper extends java.lang.Object implements IFluidHandlerItem, ICapabilityProvider
```

## Constructors

- `FluidBucketWrapper(ItemStack container)`

## Methods

- `boolean canFillFluidType(FluidStack fluidStack)`
- `FluidStack drain(FluidStack resource, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `FluidStack drain(int maxDrain, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `int fill(FluidStack resource, boolean doFill)` — Fills fluid into internal tanks, distribution is left entirely to the IFluidHandler.
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `ItemStack getContainer()` — Get the container currently acted on by this fluid handler.
- `FluidStack getFluid()`
- `IFluidTankProperties [] getTankProperties()` — Returns an array of objects which represent the internal tanks.
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `@Deprecated protected void setFluid(Fluid fluid)` — Deprecated. use the NBT-sensitive version setFluid(FluidStack)
- `protected void setFluid(FluidStack fluidStack)`

## Fields

- `protected ItemStack container`