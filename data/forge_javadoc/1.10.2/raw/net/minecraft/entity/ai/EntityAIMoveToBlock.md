---
title: "EntityAIMoveToBlock"
description: "public abstract class EntityAIMoveToBlock extends EntityAIBase"
package: "net/minecraft/entity/ai"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/ai/EntityAIMoveToBlock.html"
sourceType: javadoc
---

# EntityAIMoveToBlock

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIMoveToBlock

## Class signature

```java
public abstract class EntityAIMoveToBlock extends EntityAIBase
```

## Constructors

- `EntityAIMoveToBlock(EntityCreature creature, double speedIn, int length)`

## Methods

- `boolean continueExecuting()`
- `protected boolean getIsAboveDestination()`
- `void resetTask()`
- `boolean shouldExecute()`
- `protected abstract boolean shouldMoveTo(World worldIn, BlockPos pos)`
- `void startExecuting()`
- `void updateTask()`

## Fields

- `protected BlockPos destinationBlock`
- `protected int runDelay`
