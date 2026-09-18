---
title: "TileFluidHandler"
description: "Retrieves the handler for the capability requested on the specific side."
package: "net/minecraftforge/fluids/capability"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fluids/capability/TileFluidHandler.html"
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
- `public boolean hasCapability( Capability <?> capability, EnumFacing facing)`
- `public <T> T getCapability( Capability <T> capability, EnumFacing facing)`

## Description

Retrieves the handler for the capability requested on the specific side.
