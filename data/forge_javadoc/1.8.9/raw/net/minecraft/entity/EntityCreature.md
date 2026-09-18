---
title: "EntityCreature"
description: "Checks if the entity's current position is a valid location to spawn this entity."
package: "net/minecraft/entity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/EntityCreature.html"
sourceType: javadoc
---

# EntityCreature

## Class signature

```java
public abstract class EntityCreature extends EntityLiving
```

## Constructors

- `public EntityCreature( World worldIn)`

## Methods

- `public float getBlockPathWeight( BlockPos pos)`
- `public boolean getCanSpawnHere()`
- `public boolean hasPath()`
- `public boolean isWithinHomeDistanceCurrentPosition()`
- `public boolean isWithinHomeDistanceFromPosition( BlockPos pos)`
- `public void setHomePosAndDistance( BlockPos pos, int distance)`
- `public BlockPos getHomePosition()`
- `public float getMaximumHomeDistance()`
- `public void detachHome()`
- `public boolean hasHome()`
- `protected void updateLeashedState()`
- `protected void func_142017_o(float p_142017_1_)`

## Description

Checks if the entity's current position is a valid location to spawn this entity.
