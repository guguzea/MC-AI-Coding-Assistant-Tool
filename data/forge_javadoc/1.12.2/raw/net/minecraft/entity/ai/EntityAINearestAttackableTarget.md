---
title: "EntityAINearestAttackableTarget"
description: "public class EntityAINearestAttackableTarget<T extends EntityLivingBase> extends EntityAITarget"
package: "net/minecraft/entity/ai"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/ai/EntityAINearestAttackableTarget.html"
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

- `protected AxisAlignedBB getTargetableArea(double targetDistance)`
- `boolean shouldExecute()`
- `void startExecuting()`

## Fields

- `protected EntityAINearestAttackableTarget.Sorter sorter`
- `protected java.lang.Class<T> targetClass`
- `protected T targetEntity`
- `protected<any> targetEntitySelector`
