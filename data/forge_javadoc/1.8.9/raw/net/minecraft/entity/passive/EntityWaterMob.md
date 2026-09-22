---
title: "EntityWaterMob"
description: "public abstract class EntityWaterMob extends EntityLiving implements IAnimals"
package: "net/minecraft/entity/passive"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/passive/EntityWaterMob.html"
sourceType: javadoc
---

# EntityWaterMob

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.passive.EntityWaterMob

## Class signature

```java
public abstract class EntityWaterMob extends EntityLiving implements IAnimals
```

## Methods

- `boolean canBreatheUnderwater()`
- `protected boolean canDespawn()` — Determines if an entity can be despawned, used on idle far away entities
- `boolean getCanSpawnHere()` — Checks if the entity's current position is a valid location to spawn this entity.
- `protected int getExperiencePoints(EntityPlayer player)` — Get the experience points the entity currently has.
- `int getTalkInterval()` — Get number of ticks, at least during which the living entity will be silent.
- `boolean isNotColliding()` — Checks that the entity is not colliding with any blocks / liquids
- `boolean isPushedByWater()`
- `void onEntityUpdate()` — Gets called every tick from main Entity class

## Fields

- `EntityWaterMob`
