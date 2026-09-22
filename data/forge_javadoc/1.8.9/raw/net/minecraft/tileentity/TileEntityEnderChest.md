---
title: "TileEntityEnderChest"
description: "public class TileEntityEnderChest extends TileEntity implements ITickable"
package: "net/minecraft/tileentity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/tileentity/TileEntityEnderChest.html"
sourceType: javadoc
---

# TileEntityEnderChest

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityEnderChest

## Class signature

```java
public class TileEntityEnderChest extends TileEntity implements ITickable
```

## Constructors

- `TileEntityEnderChest()`

## Methods

- `boolean canBeUsed(EntityPlayer p_145971_1_)`
- `void closeChest()`
- `void invalidate()` — invalidates a tile entity
- `void openChest()`
- `boolean receiveClientEvent(int id, int type)`
- `void update()` — Like the old updateEntity(), except more generic.

## Fields

- `float lidAngle`
- `int numPlayersUsing`
- `float prevLidAngle` — The angle of the ender chest lid last tick
