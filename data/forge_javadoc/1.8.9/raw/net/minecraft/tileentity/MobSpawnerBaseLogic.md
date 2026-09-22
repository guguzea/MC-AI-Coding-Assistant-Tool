---
title: "MobSpawnerBaseLogic"
description: "public abstract class MobSpawnerBaseLogic extends java.lang.Object"
package: "net/minecraft/tileentity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/tileentity/MobSpawnerBaseLogic.html"
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

- `Entity func_180612_a(World worldIn)`
- `abstract void func_98267_a(int id)`
- `double getMobRotation()`
- `double getPrevMobRotation()`
- `abstract BlockPos getSpawnerPosition()`
- `abstract World getSpawnerWorld()`
- `void readFromNBT(NBTTagCompound nbt)`
- `boolean setDelayToMin(int delay)` — Sets the delay to minDelay if parameter given is 1, else return false.
- `void setEntityName(java.lang.String name)`
- `void setRandomEntity(MobSpawnerBaseLogic.WeightedRandomMinecart p_98277_1_)`
- `void updateSpawner()`
- `void writeToNBT(NBTTagCompound nbt)`
