---
title: "EntityAINearestAttackableTarget"
description: "public class EntityAINearestAttackableTarget<T extends EntityLivingBase> extends EntityAITarget"
package: "net/minecraft/entity/ai"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/ai/EntityAINearestAttackableTarget.html"
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
- `EntityAINearestAttackableTarget(EntityCreature creature, java.lang.Class<T> classTarget, int chance, boolean checkSight, boolean onlyNearby, com.google.common.base.Predicate<? super T> targetSelector)`

## Methods

- `protected AxisAlignedBB getTargetableArea(double targetDistance)`
- `boolean shouldExecute()`
- `void startExecuting()`

## Fields

- `protected java.lang.Class<T> targetClass`
- `protected T targetEntity`
- `protected com.google.common.base.Predicate<? super T> targetEntitySelector`
- `protected EntityAINearestAttackableTarget.Sorter theNearestAttackableTargetSorter`
