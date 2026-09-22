---
title: "TileFluidHandler"
description: "public class TileFluidHandler extends TileEntity implements IFluidHandler"
package: "net/minecraftforge/fluids"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fluids/TileFluidHandler.html"
sourceType: javadoc
---

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
