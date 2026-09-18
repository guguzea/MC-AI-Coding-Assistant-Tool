---
title: "TileEntitySign"
description: "public class TileEntitySign extends TileEntity"
package: "net/minecraft/tileentity"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/tileentity/TileEntitySign.html"
sourceType: javadoc
---

# TileEntitySign

## Class signature

```java
public class TileEntitySign extends TileEntity
```

## Constructors

- `public TileEntitySign()`

## Methods

- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void readFromNBT( NBTTagCompound compound)`
- `@Nullable public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public boolean onlyOpsCanSetNbt()`
- `public boolean getIsEditable()`
- `public void setEditable(boolean isEditableIn)`
- `public void setPlayer( EntityPlayer playerIn)`
- `public EntityPlayer getPlayer()`
- `public boolean executeCommand( EntityPlayer playerIn)`
- `public CommandResultStats getStats()`
