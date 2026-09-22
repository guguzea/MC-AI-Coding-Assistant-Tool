---
title: "EntityAIWatchClosest"
description: "public class EntityAIWatchClosest extends EntityAIBase"
package: "net/minecraft/entity/ai"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/ai/EntityAIWatchClosest.html"
sourceType: javadoc
---

# EntityAIWatchClosest

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIWatchClosest

## Class signature

```java
public class EntityAIWatchClosest extends EntityAIBase
```

## Constructors

- `EntityAIWatchClosest(EntityLiving entityIn, java.lang.Class<? extends Entity> watchTargetClass, float maxDistance)`
- `EntityAIWatchClosest(EntityLiving entityIn, java.lang.Class<? extends Entity> watchTargetClass, float maxDistance, float chanceIn)`

## Methods

- `void resetTask()`
- `boolean shouldContinueExecuting()`
- `boolean shouldExecute()`
- `void startExecuting()`
- `void updateTask()`

## Fields

- `protected Entity closestEntity`
- `protected EntityLiving entity`
- `protected float maxDistanceForPlayer`
- `protected java.lang.Class<? extends Entity> watchedClass`
