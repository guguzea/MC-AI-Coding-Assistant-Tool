---
title: "EntityAITarget"
description: "public abstract class EntityAITarget extends EntityAIBase"
package: "net/minecraft/entity/ai"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/ai/EntityAITarget.html"
sourceType: javadoc
---

# EntityAITarget

## Class signature

```java
public abstract class EntityAITarget extends EntityAIBase
```

## Constructors

- `public EntityAITarget( EntityCreature creature, boolean checkSight)`
- `public EntityAITarget( EntityCreature creature, boolean checkSight, boolean onlyNearby)`

## Methods

- `public boolean continueExecuting()`
- `protected double getTargetDistance()`
- `public void startExecuting()`
- `public void resetTask()`
- `public static boolean isSuitableTarget( EntityLiving attacker, @Nullable EntityLivingBase target, boolean includeInvincibles, boolean checkSight)`
- `protected boolean isSuitableTarget(@Nullable EntityLivingBase target, boolean includeInvincibles)`
- `public EntityAITarget setUnseenMemoryTicks(int p_190882_1_)`
