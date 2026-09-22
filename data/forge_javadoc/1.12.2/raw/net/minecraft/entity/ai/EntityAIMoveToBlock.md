---
title: "EntityAIMoveToBlock"
description: "public abstract class EntityAIMoveToBlock extends EntityAIBase"
package: "net/minecraft/entity/ai"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/ai/EntityAIMoveToBlock.html"
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

- `protected boolean getIsAboveDestination()`
- `boolean shouldContinueExecuting()`
- `boolean shouldExecute()`
- `protected abstract boolean shouldMoveTo(World worldIn, BlockPos pos)`
- `void startExecuting()`
- `void updateTask()`

## Fields

- `protected BlockPos destinationBlock`
- `protected int runDelay`
