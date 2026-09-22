---
title: "EntityAIWatchClosest"
description: "public class EntityAIWatchClosest extends EntityAIBase"
package: "net/minecraft/entity/ai"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/ai/EntityAIWatchClosest.html"
sourceType: javadoc
---

# EntityAIWatchClosest

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIWatchClosest

## Class signature

```java
public class EntityAIWatchClosest extends EntityAIBase
```

## Constructors

- `EntityAIWatchClosest(EntityLiving entitylivingIn, java.lang.Class<? extends Entity> watchTargetClass, float maxDistance)`
- `EntityAIWatchClosest(EntityLiving entitylivingIn, java.lang.Class<? extends Entity> watchTargetClass, float maxDistance, float chanceIn)`

## Methods

- `boolean continueExecuting()`
- `void resetTask()`
- `boolean shouldExecute()`
- `void startExecuting()`
- `void updateTask()`

## Fields

- `protected Entity closestEntity`
- `protected float maxDistanceForPlayer`
- `protected EntityLiving theWatcher`
- `protected java.lang.Class<? extends Entity> watchedClass`
