---
title: "TileEntityMobSpawner"
description: "public class TileEntityMobSpawner extends TileEntity implements ITickable"
package: "net/minecraft/tileentity"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/tileentity/TileEntityMobSpawner.html"
sourceType: javadoc
---

# TileEntityMobSpawner

## Class signature

```java
public class TileEntityMobSpawner extends TileEntity implements ITickable
```

## Constructors

- `public TileEntityMobSpawner()`

## Methods

- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void update()`
- `@Nullable public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public boolean receiveClientEvent(int id, int type)`
- `public boolean onlyOpsCanSetNbt()`
- `public MobSpawnerBaseLogic getSpawnerBaseLogic()`
