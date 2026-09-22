---
title: "TileEntityLockable"
description: "public abstract class TileEntityLockable extends TileEntity implements IInteractionObject, ILockableContainer"
package: "net/minecraft/tileentity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/tileentity/TileEntityLockable.html"
sourceType: javadoc
---

# TileEntityLockable

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityLockable

## Class signature

```java
public abstract class TileEntityLockable extends TileEntity implements IInteractionObject, ILockableContainer
```

## Methods

- `protected IItemHandler createUnSidedHandler()`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `IChatComponent getDisplayName()` — Get the formatted ChatComponent that will be used for the sender's username in chat
- `LockCode getLockCode()`
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `boolean isLocked()`
- `void readFromNBT(NBTTagCompound compound)`
- `void setLockCode(LockCode code)`
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityLockable`
