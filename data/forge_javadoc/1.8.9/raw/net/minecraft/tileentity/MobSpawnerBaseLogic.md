---
title: "MobSpawnerBaseLogic"
description: "Sets the delay to minDelay if parameter given is 1, else return false."
package: "net/minecraft/tileentity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/tileentity/MobSpawnerBaseLogic.html"
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

- `public void setEntityName(java.lang.String name)`
- `public void updateSpawner()`
- `public void readFromNBT( NBTTagCompound nbt)`
- `public void writeToNBT( NBTTagCompound nbt)`
- `public boolean setDelayToMin(int delay)`
- `public Entity func_180612_a( World worldIn)`
- `public void setRandomEntity( MobSpawnerBaseLogic.WeightedRandomMinecart p_98277_1_)`
- `public abstract void func_98267_a(int id)`
- `public abstract World getSpawnerWorld()`
- `public abstract BlockPos getSpawnerPosition()`
- `public double getMobRotation()`
- `public double getPrevMobRotation()`

## Description

Sets the delay to minDelay if parameter given is 1, else return false.
