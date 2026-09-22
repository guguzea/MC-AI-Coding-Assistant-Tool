---
title: "EntityAIBase"
description: "public abstract class EntityAIBase extends java.lang.Object"
package: "net/minecraft/entity/ai"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/ai/EntityAIBase.html"
sourceType: javadoc
---

# EntityAIBase

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase

## Class signature

```java
public abstract class EntityAIBase extends java.lang.Object
```

## Constructors

- `EntityAIBase()`

## Methods

- `boolean continueExecuting()` — Returns whether an in-progress EntityAIBase should continue executing
- `int getMutexBits()` — Get a bitmask telling which other tasks may not run concurrently.
- `boolean isInterruptible()` — Determine if this AI Task is interruptible by a higher (= lower value) priority task.
- `void resetTask()` — Resets the task
- `void setMutexBits(int mutexBitsIn)` — Sets a bitmask telling which other tasks may not run concurrently.
- `abstract boolean shouldExecute()` — Returns whether the EntityAIBase should begin execution.
- `void startExecuting()` — Execute a one shot task or start executing a continuous task
- `void updateTask()` — Updates the task
