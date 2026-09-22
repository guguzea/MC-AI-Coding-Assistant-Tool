---
title: "EntityCreature"
description: "public abstract class EntityCreature extends EntityLiving"
package: "net/minecraft/entity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/EntityCreature.html"
sourceType: javadoc
---

# EntityCreature

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature

## Class signature

```java
public abstract class EntityCreature extends EntityLiving
```

## Constructors

- `EntityCreature(World worldIn)`

## Methods

- `void detachHome()`
- `protected void func_142017_o(float p_142017_1_)`
- `float getBlockPathWeight(BlockPos pos)`
- `boolean getCanSpawnHere()` — Checks if the entity's current position is a valid location to spawn this entity.
- `BlockPos getHomePosition()`
- `float getMaximumHomeDistance()`
- `boolean hasHome()` — Returns whether a home area is defined for this entity.
- `boolean hasPath()` — if the entity got a PathEntity it returns true, else false
- `boolean isWithinHomeDistanceCurrentPosition()`
- `boolean isWithinHomeDistanceFromPosition(BlockPos pos)`
- `void setHomePosAndDistance(BlockPos pos, int distance)` — Sets home position and max distance for it
- `protected void updateLeashedState()` — Applies logic related to leashes, for example dragging the entity or breaking the leash.

## Fields

- `static AttributeModifier FLEEING_SPEED_MODIFIER`
- `static java.util.UUID FLEEING_SPEED_MODIFIER_UUID`
