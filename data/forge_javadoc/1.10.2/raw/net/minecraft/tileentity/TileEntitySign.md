---
title: "TileEntitySign"
description: "public class TileEntitySign extends TileEntity"
package: "net/minecraft/tileentity"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/tileentity/TileEntitySign.html"
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
