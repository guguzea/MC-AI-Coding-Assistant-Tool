---
title: "TileEntitySign"
description: "public class TileEntitySign extends TileEntity"
package: "net/minecraft/tileentity"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/tileentity/TileEntitySign.html"
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
- `protected void setWorldCreate(World worldIn)`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `int lineBeingEdited`
- `ITextComponent [] signText`
