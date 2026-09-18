---
title: "TileEntityLockable"
description: "Retrieves the handler for the capability requested on the specific side."
package: "net/minecraft/tileentity"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/tileentity/TileEntityLockable.html"
sourceType: javadoc
---

# TileEntityLockable

## Class signature

```java
public abstract class TileEntityLockable extends TileEntity implements ILockableContainer
```

## Constructors

- `public TileEntityLockable()`

## Methods

- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public boolean isLocked()`
- `public LockCode getLockCode()`
- `public void setLockCode( LockCode code)`
- `public ITextComponent getDisplayName()`
- `protected IItemHandler createUnSidedHandler()`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`
- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`

## Description

Retrieves the handler for the capability requested on the specific side.
