---
title: "EntityAITarget"
description: "public abstract class EntityAITarget extends EntityAIBase"
package: "net/minecraft/entity/ai"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/ai/EntityAITarget.html"
sourceType: javadoc
---

# EntityAITarget

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAITarget

## Class signature

```java
public abstract class EntityAITarget extends EntityAIBase
```

## Constructors

- `EntityAITarget(EntityCreature creature, boolean checkSight)`
- `EntityAITarget(EntityCreature creature, boolean checkSight, boolean onlyNearby)`

## Methods

- `boolean continueExecuting()` — Returns whether an in-progress EntityAIBase should continue executing
- `protected double getTargetDistance()`
- `protected boolean isSuitableTarget(EntityLivingBase target, boolean includeInvincibles)` — A method used to see if an entity is a suitable target through a number of checks.
- `static boolean isSuitableTarget(EntityLiving attacker, EntityLivingBase target, boolean includeInvincibles, boolean checkSight)` — A static method used to see if an entity is a suitable target through a number of checks.
- `void resetTask()` — Resets the task
- `void startExecuting()` — Execute a one shot task or start executing a continuous task

## Fields

- `protected boolean shouldCheckSight` — If true, EntityAI targets must be able to be seen (cannot be blocked by walls) to be suitable targets.
- `protected EntityCreature taskOwner` — The entity that this task belongs to
