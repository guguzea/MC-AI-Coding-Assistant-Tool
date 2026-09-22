---
title: "EntityAIDoorInteract"
description: "public abstract class EntityAIDoorInteract extends EntityAIBase"
package: "net/minecraft/entity/ai"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/ai/EntityAIDoorInteract.html"
sourceType: javadoc
---

# EntityAIDoorInteract

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIDoorInteract

## Class signature

```java
public abstract class EntityAIDoorInteract extends EntityAIBase
```

## Constructors

- `EntityAIDoorInteract(EntityLiving entityIn)`

## Methods

- `boolean continueExecuting()` — Returns whether an in-progress EntityAIBase should continue executing
- `boolean shouldExecute()` — Returns whether the EntityAIBase should begin execution.
- `void startExecuting()` — Execute a one shot task or start executing a continuous task
- `void updateTask()` — Updates the task

## Fields

- `protected BlockDoor doorBlock` — The wooden door block
- `protected BlockPos doorPosition`
- `protected EntityLiving theEntity`
