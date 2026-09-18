---
title: "EntityAIAttackOnCollide"
description: "Returns whether an in-progress EntityAIBase should continue executing"
package: "net/minecraft/entity/ai"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/ai/EntityAIAttackOnCollide.html"
sourceType: javadoc
---

# EntityAIAttackOnCollide

## Class signature

```java
public class EntityAIAttackOnCollide extends EntityAIBase
```

## Constructors

- `public EntityAIAttackOnCollide( EntityCreature creature, java.lang.Class<? extends Entity > targetClass, double speedIn, boolean useLongMemory)`
- `public EntityAIAttackOnCollide( EntityCreature creature, double speedIn, boolean useLongMemory)`

## Methods

- `public boolean shouldExecute()`
- `public boolean continueExecuting()`
- `public void startExecuting()`
- `public void resetTask()`
- `public void updateTask()`
- `protected double func_179512_a( EntityLivingBase attackTarget)`

## Description

Returns whether an in-progress EntityAIBase should continue executing
