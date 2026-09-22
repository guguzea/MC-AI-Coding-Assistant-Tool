---
title: "TileFluidHandler"
description: "public class TileFluidHandler extends TileEntity"
package: "net/minecraftforge/fluids/capability"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/capability/TileFluidHandler.html"
sourceType: javadoc
---

# TileFluidHandler

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraftforge.fluids.capability.TileFluidHandler

## Class signature

```java
public class TileFluidHandler extends TileEntity
```

## Constructors

- `TileFluidHandler()`

## Methods

- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `void readFromNBT(NBTTagCompound tag)`
- `NBTTagCompound writeToNBT(NBTTagCompound tag)`

## Fields

- `protected FluidTank tank`
