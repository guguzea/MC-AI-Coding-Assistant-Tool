---
title: "EntityMoveHelper"
description: "public class EntityMoveHelper extends java.lang.Object"
package: "net/minecraft/entity/ai"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/ai/EntityMoveHelper.html"
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
- `protected float limitAngle(float p_75639_1_, float p_75639_2_, float p_75639_3_)`
- `void onUpdateMoveHelper()`
- `void read(EntityMoveHelper that)`
- `void setMoveTo(double x, double y, double z, double speedIn)`
- `void strafe(float forward, float strafe)`

## Fields

- `protected EntityMoveHelper.Action action`
- `protected EntityLiving entity`
- `protected float moveForward`
- `protected float moveStrafe`
- `protected double posX`
- `protected double posY`
- `protected double posZ`
- `protected double speed`
