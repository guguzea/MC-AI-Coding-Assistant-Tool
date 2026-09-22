# FluidTank

**Inheritance:** java.lang.Object → net.minecraftforge.fluids.FluidTank

## Class signature

```java
public class FluidTank extends java.lang.Object implements IFluidTank
```

## Constructors

- `FluidTank(Fluid fluid, int amount, int capacity)`
- `FluidTank(FluidStack stack, int capacity)`
- `FluidTank(int capacity)`

## Methods

- `FluidStack drain(int maxDrain, boolean doDrain)`
- `int fill(FluidStack resource, boolean doFill)`
- `int getCapacity()`
- `FluidStack getFluid()`
- `int getFluidAmount()`
- `FluidTankInfo getInfo()` — Returns a wrapper object FluidTankInfo containing the capacity of the tank and the FluidStack it holds.
- `FluidTank readFromNBT(NBTTagCompound nbt)`
- `void setCapacity(int capacity)`
- `void setFluid(FluidStack fluid)`
- `NBTTagCompound writeToNBT(NBTTagCompound nbt)`

## Fields

- `protected int capacity`
- `protected FluidStack fluid`
- `protected TileEntity tile`