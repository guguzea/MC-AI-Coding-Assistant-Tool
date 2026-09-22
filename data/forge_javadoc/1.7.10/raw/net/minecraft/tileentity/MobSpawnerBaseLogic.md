---
title: "MobSpawnerBaseLogic"
description: "public abstract class MobSpawnerBaseLogic extends java.lang.Object"
package: "net/minecraft/tileentity"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/tileentity/MobSpawnerBaseLogic.html"
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

- `Entity func_98265_a(Entity p_98265_1_)`
- `abstract void func_98267_a(int p_98267_1_)`
- `Entity func_98281_h()`
- `java.lang.String getEntityNameToSpawn()`
- `MobSpawnerBaseLogic.WeightedRandomMinecart getRandomEntity()`
- `abstract World getSpawnerWorld()`
- `abstract int getSpawnerX()`
- `abstract int getSpawnerY()`
- `abstract int getSpawnerZ()`
- `boolean isActivated()`
- `void readFromNBT(NBTTagCompound p_98270_1_)`
- `boolean setDelayToMin(int p_98268_1_)`
- `void setEntityName(java.lang.String p_98272_1_)`
- `void setRandomEntity(MobSpawnerBaseLogic.WeightedRandomMinecart p_98277_1_)`
- `void updateSpawner()`
- `void writeToNBT(NBTTagCompound p_98280_1_)`

## Fields

- `double field_98284_d`
- `double field_98287_c`
- `int spawnDelay`
