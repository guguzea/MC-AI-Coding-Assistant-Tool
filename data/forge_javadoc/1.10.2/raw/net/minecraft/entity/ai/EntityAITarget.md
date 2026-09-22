---
title: "EntityAITarget"
description: "public abstract class EntityAITarget extends EntityAIBase"
package: "net/minecraft/entity/ai"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/ai/EntityAITarget.html"
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

- `boolean continueExecuting()`
- `protected double getTargetDistance()`
- `protected boolean isSuitableTarget(EntityLivingBase target, boolean includeInvincibles)`
- `static boolean isSuitableTarget(EntityLiving attacker, EntityLivingBase target, boolean includeInvincibles, boolean checkSight)`
- `void resetTask()`
- `void startExecuting()`

## Fields

- `protected boolean shouldCheckSight`
- `protected EntityLivingBase target`
- `protected EntityCreature taskOwner`
- `protected int unseenMemoryTicks`
