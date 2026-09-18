---
title: "MobSpawnerBaseLogic"
description: "public abstract class MobSpawnerBaseLogic extends java.lang.Object"
package: "net/minecraft/tileentity"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/tileentity/MobSpawnerBaseLogic.html"
sourceType: javadoc
---

# MobSpawnerBaseLogic

## Class signature

```java
public abstract class MobSpawnerBaseLogic extends java.lang.Object
```

## Constructors

- `public MobSpawnerBaseLogic()`

## Methods

- `public void setEntityId( ResourceLocation id)`
- `public void updateSpawner()`
- `public void readFromNBT( NBTTagCompound nbt)`
- `public NBTTagCompound writeToNBT( NBTTagCompound p_189530_1_)`
- `public boolean setDelayToMin(int delay)`
- `public Entity getCachedEntity()`
- `public void setNextSpawnData( WeightedSpawnerEntity p_184993_1_)`
- `public abstract void broadcastEvent(int id)`
- `public abstract World getSpawnerWorld()`
- `public abstract BlockPos getSpawnerPosition()`
- `public double getMobRotation()`
- `public double getPrevMobRotation()`
- `public Entity getSpawnerEntity()`
