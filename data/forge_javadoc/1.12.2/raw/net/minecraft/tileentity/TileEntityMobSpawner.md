---
title: "TileEntityMobSpawner"
description: "public class TileEntityMobSpawner extends TileEntity implements ITickable"
package: "net/minecraft/tileentity"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/tileentity/TileEntityMobSpawner.html"
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

- `public static void registerFixesMobSpawner( DataFixer fixer)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public NBTTagCompound writeToNBT( NBTTagCompound compound)`
- `public void update()`
- `public SPacketUpdateTileEntity getUpdatePacket()`
- `public NBTTagCompound getUpdateTag()`
- `public boolean receiveClientEvent(int id, int type)`
- `public boolean onlyOpsCanSetNbt()`
- `public MobSpawnerBaseLogic getSpawnerBaseLogic()`
