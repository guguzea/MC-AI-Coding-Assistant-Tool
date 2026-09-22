---
title: "EntityAINearestAttackableTarget"
description: "public class EntityAINearestAttackableTarget<T extends EntityLivingBase> extends EntityAITarget"
package: "net/minecraft/entity/ai"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/ai/EntityAINearestAttackableTarget.html"
sourceType: javadoc
---

# EntityAINearestAttackableTarget

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAITarget → net.minecraft.entity.ai.EntityAINearestAttackableTarget<T>

## Class signature

```java
public class EntityAINearestAttackableTarget<T extends EntityLivingBase> extends EntityAITarget
```

## Constructors

- `EntityAINearestAttackableTarget(EntityCreature creature, java.lang.Class<T> classTarget, boolean checkSight)`
- `EntityAINearestAttackableTarget(EntityCreature creature, java.lang.Class<T> classTarget, boolean checkSight, boolean onlyNearby)`
- `EntityAINearestAttackableTarget(EntityCreature creature, java.lang.Class<T> classTarget, int chance, boolean checkSight, boolean onlyNearby, <any> targetSelector)`

## Methods

- `boolean shouldExecute()` — Returns whether the EntityAIBase should begin execution.
- `void startExecuting()` — Execute a one shot task or start executing a continuous task

## Fields

- `protected java.lang.Class<T> targetClass`
- `protected EntityLivingBase targetEntity`
- `protected<any> targetEntitySelector`
- `protected EntityAINearestAttackableTarget.Sorter theNearestAttackableTargetSorter` — Instance of EntityAINearestAttackableTargetSorter.
