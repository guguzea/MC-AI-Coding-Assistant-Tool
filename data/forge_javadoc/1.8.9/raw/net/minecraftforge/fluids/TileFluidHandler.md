---
title: "TileFluidHandler"
description: "public class TileFluidHandler extends TileEntity implements IFluidHandler"
package: "net/minecraftforge/fluids"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fluids/TileFluidHandler.html"
sourceType: javadoc
---

# TileFluidHandler

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraftforge.fluids.TileFluidHandler

## Class signature

```java
public class TileFluidHandler extends TileEntity implements IFluidHandler
```

## Constructors

- `TileFluidHandler()`

## Methods

- `boolean canDrain(EnumFacing from, Fluid fluid)` — Returns true if the given fluid can be extracted from the given direction.
- `boolean canFill(EnumFacing from, Fluid fluid)` — Returns true if the given fluid can be inserted into the given direction.
- `FluidStack drain(EnumFacing from, FluidStack resource, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `FluidStack drain(EnumFacing from, int maxDrain, boolean doDrain)` — Drains fluid out of internal tanks, distribution is left entirely to the IFluidHandler.
- `int fill(EnumFacing from, FluidStack resource, boolean doFill)` — Fills fluid into internal tanks, distribution is left entirely to the IFluidHandler.
- `FluidTankInfo [] getTankInfo(EnumFacing from)` — Returns an array of objects which represent the internal tanks.
- `void readFromNBT(NBTTagCompound tag)`
- `void writeToNBT(NBTTagCompound tag)`

## Fields

- `protected FluidTank tank`
