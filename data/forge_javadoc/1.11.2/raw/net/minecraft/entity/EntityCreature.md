---
title: "EntityCreature"
description: "public abstract class EntityCreature extends EntityLiving"
package: "net/minecraft/entity"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/EntityCreature.html"
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
- `protected double followLeashSpeed()`
- `protected void onLeashDistance(float p_142017_1_)`
