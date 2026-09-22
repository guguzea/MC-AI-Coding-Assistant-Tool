---
title: "EntityAIAttackMelee"
description: "public class EntityAIAttackMelee extends EntityAIBase"
package: "net/minecraft/entity/ai"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/ai/EntityAIAttackMelee.html"
sourceType: javadoc
---

# EntityAIAttackMelee

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIAttackMelee

## Class signature

```java
public class EntityAIAttackMelee extends EntityAIBase
```

## Constructors

- `EntityAIAttackMelee(EntityCreature creature, double speedIn, boolean useLongMemory)`

## Methods

- `protected void checkAndPerformAttack(EntityLivingBase p_190102_1_, double p_190102_2_)`
- `boolean continueExecuting()`
- `protected double getAttackReachSqr(EntityLivingBase attackTarget)`
- `void resetTask()`
- `boolean shouldExecute()`
- `void startExecuting()`
- `void updateTask()`

## Fields

- `protected EntityCreature attacker`
- `protected int attackInterval`
- `protected int attackTick`
