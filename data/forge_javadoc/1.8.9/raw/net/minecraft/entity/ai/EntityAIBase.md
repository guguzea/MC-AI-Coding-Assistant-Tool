---
title: "EntityAIBase"
description: "Returns whether an in-progress EntityAIBase should continue executing"
package: "net/minecraft/entity/ai"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/ai/EntityAIBase.html"
sourceType: javadoc
---

# EntityAIBase

## Class signature

```java
public abstract class EntityAIBase extends java.lang.Object
```

## Constructors

- `public EntityAIBase()`

## Methods

- `public abstract boolean shouldExecute()`
- `public boolean continueExecuting()`
- `public boolean isInterruptible()`
- `public void startExecuting()`
- `public void resetTask()`
- `public void updateTask()`
- `public void setMutexBits(int mutexBitsIn)`
- `public int getMutexBits()`

## Description

Returns whether an in-progress EntityAIBase should continue executing
