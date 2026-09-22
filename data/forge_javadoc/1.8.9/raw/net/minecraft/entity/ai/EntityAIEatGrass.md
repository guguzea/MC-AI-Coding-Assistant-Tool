---
title: "EntityAIEatGrass"
description: "public class EntityAIEatGrass extends EntityAIBase"
package: "net/minecraft/entity/ai"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/ai/EntityAIEatGrass.html"
sourceType: javadoc
---

# EntityAIEatGrass

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIEatGrass

## Class signature

```java
public class EntityAIEatGrass extends EntityAIBase
```

## Constructors

- `EntityAIEatGrass(EntityLiving grassEaterEntityIn)`

## Methods

- `boolean continueExecuting()` — Returns whether an in-progress EntityAIBase should continue executing
- `int getEatingGrassTimer()` — Number of ticks since the entity started to eat grass
- `void resetTask()` — Resets the task
- `boolean shouldExecute()` — Returns whether the EntityAIBase should begin execution.
- `void startExecuting()` — Execute a one shot task or start executing a continuous task
- `void updateTask()` — Updates the task
