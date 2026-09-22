---
title: "TileEntity"
description: "public class TileEntity extends java.lang.Object"
package: "net/minecraft/tileentity"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/tileentity/TileEntity.html"
sourceType: javadoc
---

# TileEntity

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity

## Class signature

```java
public class TileEntity extends java.lang.Object
```

## Constructors

- `TileEntity()`

## Methods

- `static void addMapping(java.lang.Class p_145826_0_, java.lang.String p_145826_1_)`
- `static TileEntity createAndLoadEntity(NBTTagCompound p_145827_0_)`
- `void func_145828_a(CrashReportCategory p_145828_1_)`
- `int getBlockMetadata()`
- `Block getBlockType()`
- `Packet getDescriptionPacket()`
- `double getDistanceFrom(double p_145835_1_, double p_145835_3_, double p_145835_5_)`
- `double getMaxRenderDistanceSquared()`
- `World getWorldObj()`
- `boolean hasWorldObj()`
- `void invalidate()`
- `boolean isInvalid()`
- `void markDirty()`
- `void readFromNBT(NBTTagCompound p_145839_1_)`
- `boolean receiveClientEvent(int p_145842_1_, int p_145842_2_)`
- `void setWorldObj(World p_145834_1_)`
- `void updateContainingBlockInfo()`
- `void updateEntity()`
- `void validate()`
- `void writeToNBT(NBTTagCompound p_145841_1_)`

## Fields

- `int blockMetadata`
- `Block blockType`
- `protected boolean tileEntityInvalid`
- `protected World worldObj`
- `int xCoord`
- `int yCoord`
- `int zCoord`
