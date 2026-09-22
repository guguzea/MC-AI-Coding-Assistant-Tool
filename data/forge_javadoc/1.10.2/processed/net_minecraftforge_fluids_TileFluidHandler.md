# TileFluidHandler

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraftforge.fluids.TileFluidHandler

## Class signature

```java
public class TileFluidHandler extends TileEntity implements IFluidHandler
```

## Constructors

- `@Deprecated TileFluidHandler()`

## Methods

- `@Deprecated boolean canDrain(EnumFacing from, Fluid fluid)`
- `@Deprecated boolean canFill(EnumFacing from, Fluid fluid)`
- `@Deprecated FluidStack drain(EnumFacing from, FluidStack resource, boolean doDrain)`
- `@Deprecated FluidStack drain(EnumFacing from, int maxDrain, boolean doDrain)`
- `@Deprecated int fill(EnumFacing from, FluidStack resource, boolean doFill)`
- `@Deprecated <T> T getCapability(Capability<T> capability, EnumFacing facing)`
- `@Deprecated FluidTankInfo [] getTankInfo(EnumFacing from)`
- `@Deprecated boolean hasCapability(Capability<?> capability, EnumFacing facing)`
- `@Deprecated void readFromNBT(NBTTagCompound tag)`
- `@Deprecated NBTTagCompound writeToNBT(NBTTagCompound tag)`

## Fields

- `protected FluidTank tank`