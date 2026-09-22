---
title: "EntityMoveHelper"
description: "public class EntityMoveHelper extends java.lang.Object"
package: "net/minecraft/entity/ai"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/ai/EntityMoveHelper.html"
sourceType: javadoc
---

# EntityMoveHelper

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityMoveHelper

## Class signature

```java
public class EntityMoveHelper extends java.lang.Object
```

## Constructors

- `EntityMoveHelper(EntityLiving entitylivingIn)`

## Methods

- `double getSpeed()`
- `double getX()`
- `double getY()`
- `double getZ()`
- `boolean isUpdating()`
- `protected float limitAngle(float p_75639_1_, float p_75639_2_, float p_75639_3_)` — Limits the given angle to a upper and lower limit.
- `void onUpdateMoveHelper()`
- `void setMoveTo(double x, double y, double z, double speedIn)` — Sets the speed and location to move to

## Fields

- `protected EntityLiving entity` — The EntityLiving that is being moved
- `protected double posX`
- `protected double posY`
- `protected double posZ`
- `protected double speed` — The speed at which the entity should move
- `protected boolean update`
