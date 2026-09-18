---
title: "TileEntityFlowerPot"
description: "public class TileEntityFlowerPot extends TileEntity"
package: "net/minecraft/tileentity"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/tileentity/TileEntityFlowerPot.html"
sourceType: javadoc
---

# TileEntityFlowerPot

## Class signature

```java
public class TileEntityFlowerPot extends TileEntity
```

## Constructors

- `public TileEntityFlowerPot()`
- `public TileEntityFlowerPot( Item potItem, int potData)`

## Methods

- `public static void registerFixesFlowerPot( DataFixer fixer)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void readFromNBT( NBTTagCompound compound)`
- `@Nullable public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public void setItemStack( ItemStack stack)`
- `public ItemStack getFlowerItemStack()`
- `@Nullable public Item getFlowerPotItem()`
- `public int getFlowerPotData()`
