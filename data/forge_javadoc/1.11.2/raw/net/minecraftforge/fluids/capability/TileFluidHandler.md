---
title: "TileFluidHandler"
description: "Retrieves the handler for the capability requested on the specific side."
package: "net/minecraftforge/fluids/capability"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fluids/capability/TileFluidHandler.html"
sourceType: javadoc
---

# TileFluidHandler

## Class signature

```java
public class TileFluidHandler extends TileEntity
```

## Constructors

- `public TileFluidHandler()`

## Methods

- `public void readFromNBT( NBTTagCompound tag)`
- `public NBTTagCompound writeToNBT( NBTTagCompound tag)`
- `public boolean hasCapability(@Nonnull Capability <?> capability, @Nullable EnumFacing facing)`
- `@Nullable public <T> T getCapability(@Nonnull Capability <T> capability, @Nullable EnumFacing facing)`

## Description

Retrieves the handler for the capability requested on the specific side.
