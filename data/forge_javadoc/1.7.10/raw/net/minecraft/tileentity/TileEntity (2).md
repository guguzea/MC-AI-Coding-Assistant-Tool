---
title: "TileEntity"
description: "public class TileEntity extends java.lang.Object"
package: "net/minecraft/tileentity"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/tileentity/TileEntity.html"
sourceType: javadoc
---

# TileEntity

## Class signature

```java
public class TileEntity extends java.lang.Object
```

## Constructors

- `public TileEntity()`

## Methods

- `public static void addMapping(java.lang.Class p_145826_0_, java.lang.String p_145826_1_)`
- `public World getWorldObj()`
- `public void setWorldObj( World p_145834_1_)`
- `public boolean hasWorldObj()`
- `public void readFromNBT( NBTTagCompound p_145839_1_)`
- `public void writeToNBT( NBTTagCompound p_145841_1_)`
- `public void updateEntity()`
- `public static TileEntity createAndLoadEntity( NBTTagCompound p_145827_0_)`
- `public int getBlockMetadata()`
- `public void markDirty()`
- `public double getDistanceFrom(double p_145835_1_, double p_145835_3_, double p_145835_5_)`
- `public double getMaxRenderDistanceSquared()`
- `public Block getBlockType()`
- `public Packet getDescriptionPacket()`
- `public boolean isInvalid()`
- `public void invalidate()`
- `public void validate()`
- `public boolean receiveClientEvent(int p_145842_1_, int p_145842_2_)`
- `public void updateContainingBlockInfo()`
- `public void func_145828_a( CrashReportCategory p_145828_1_)`
