---
title: "TileEntityLockable"
description: "public abstract class TileEntityLockable extends TileEntity implements ILockableContainer"
package: "net/minecraft/tileentity"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/tileentity/TileEntityLockable.html"
sourceType: javadoc
---

# TileEntityLockable

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable

## Class signature

```java
public abstract class TileEntityLockable extends TileEntity implements ILockableContainer
```

## Methods

- `protected IItemHandler createUnSidedHandler()`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `ITextComponent getDisplayName()`
- `LockCode getLockCode()`
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `boolean isLocked()`
- `void readFromNBT(NBTTagCompound compound)`
- `void setLockCode(LockCode code)`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityLockable`
