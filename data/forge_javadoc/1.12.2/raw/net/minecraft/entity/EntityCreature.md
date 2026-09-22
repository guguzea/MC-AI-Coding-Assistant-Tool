---
title: "EntityCreature"
description: "public abstract class EntityCreature extends EntityLiving"
package: "net/minecraft/entity"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/EntityCreature.html"
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
- `protected double followLeashSpeed()`
- `float getBlockPathWeight(BlockPos pos)`
- `boolean getCanSpawnHere()`
- `BlockPos getHomePosition()`
- `float getMaximumHomeDistance()`
- `boolean hasHome()`
- `boolean hasPath()`
- `boolean isWithinHomeDistanceCurrentPosition()`
- `boolean isWithinHomeDistanceFromPosition(BlockPos pos)`
- `protected void onLeashDistance(float p_142017_1_)`
- `void setHomePosAndDistance(BlockPos pos, int distance)`
- `protected void updateLeashedState()`

## Fields

- `static AttributeModifier FLEEING_SPEED_MODIFIER`
- `static java.util.UUID FLEEING_SPEED_MODIFIER_UUID`
