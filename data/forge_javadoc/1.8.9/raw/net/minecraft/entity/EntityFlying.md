---
title: "EntityFlying"
description: "returns true if this entity is by a ladder, false otherwise"
package: "net/minecraft/entity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/EntityFlying.html"
sourceType: javadoc
---

# EntityFlying

## Class signature

```java
public abstract class EntityFlying extends EntityLiving
```

## Constructors

- `public EntityFlying( World worldIn)`

## Methods

- `public void fall(float distance, float damageMultiplier)`
- `protected void updateFallState(double y, boolean onGroundIn, Block blockIn, BlockPos pos)`
- `public void moveEntityWithHeading(float strafe, float forward)`
- `public boolean isOnLadder()`

## Description

returns true if this entity is by a ladder, false otherwise
