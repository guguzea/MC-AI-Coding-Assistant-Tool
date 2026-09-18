---
title: "TileEntityPiston"
description: "removes a piston's tile entity (and if the piston is moving, stops it)"
package: "net/minecraft/tileentity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/tileentity/TileEntityPiston.html"
sourceType: javadoc
---

# TileEntityPiston

## Class signature

```java
public class TileEntityPiston extends TileEntity implements ITickable
```

## Constructors

- `public TileEntityPiston()`
- `public TileEntityPiston( IBlockState pistonStateIn, EnumFacing pistonFacingIn, boolean extendingIn, boolean shouldHeadBeRenderedIn)`

## Methods

- `public IBlockState getPistonState()`
- `public int getBlockMetadata()`
- `public boolean isExtending()`
- `public EnumFacing getFacing()`
- `public boolean shouldPistonHeadBeRendered()`
- `public float getProgress(float ticks)`
- `public float getOffsetX(float ticks)`
- `public float getOffsetY(float ticks)`
- `public float getOffsetZ(float ticks)`
- `public void clearPistonTileEntity()`
- `public void update()`
- `public void readFromNBT( NBTTagCompound compound)`
- `public void writeToNBT( NBTTagCompound compound)`

## Description

removes a piston's tile entity (and if the piston is moving, stops it)
