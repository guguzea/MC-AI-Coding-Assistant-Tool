---
title: "MobSpawnerBaseLogic"
description: "public abstract class MobSpawnerBaseLogic extends java.lang.Object"
package: "net/minecraft/tileentity"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/tileentity/MobSpawnerBaseLogic.html"
sourceType: javadoc
---

# MobSpawnerBaseLogic

**Inheritance:** java.lang.Object → net.minecraft.tileentity.MobSpawnerBaseLogic

## Class signature

```java
public abstract class MobSpawnerBaseLogic extends java.lang.Object
```

## Constructors

- `MobSpawnerBaseLogic()`

## Methods

- `abstract void broadcastEvent(int id)`
- `Entity getCachedEntity()`
- `double getMobRotation()`
- `double getPrevMobRotation()`
- `abstract BlockPos getSpawnerPosition()`
- `abstract World getSpawnerWorld()`
- `void readFromNBT(NBTTagCompound nbt)`
- `boolean setDelayToMin(int delay)`
- `void setEntityId(ResourceLocation id)`
- `void setNextSpawnData(WeightedSpawnerEntity p_184993_1_)`
- `void updateSpawner()`
- `NBTTagCompound writeToNBT(NBTTagCompound p_189530_1_)`
