---
title: "TileEntitySign"
description: "public class TileEntitySign extends TileEntity"
package: "net/minecraft/tileentity"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/tileentity/TileEntitySign.html"
sourceType: javadoc
---

# TileEntitySign

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntitySign

## Class signature

```java
public class TileEntitySign extends TileEntity
```

## Constructors

- `TileEntitySign()`

## Methods

- `boolean executeCommand(EntityPlayer playerIn)`
- `boolean getIsEditable()`
- `EntityPlayer getPlayer()`
- `CommandResultStats getStats()`
- `SPacketUpdateTileEntity getUpdatePacket()`
- `NBTTagCompound getUpdateTag()`
- `boolean onlyOpsCanSetNbt()`
- `void readFromNBT(NBTTagCompound compound)`
- `void setEditable(boolean isEditableIn)`
- `void setPlayer(EntityPlayer playerIn)`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `int lineBeingEdited`
- `ITextComponent [] signText`
