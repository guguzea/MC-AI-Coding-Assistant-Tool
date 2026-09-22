---
title: "EntityAIAvoidEntity"
description: "public class EntityAIAvoidEntity<T extends Entity> extends EntityAIBase"
package: "net/minecraft/entity/ai"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/ai/EntityAIAvoidEntity.html"
sourceType: javadoc
---

# EntityAIAvoidEntity

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIAvoidEntity<T>

## Class signature

```java
public class EntityAIAvoidEntity<T extends Entity> extends EntityAIBase
```

## Constructors

- `EntityAIAvoidEntity(EntityCreature p_i46405_1_, java.lang.Class<T> p_i46405_2_, <any> p_i46405_3_, float p_i46405_4_, double p_i46405_5_, double p_i46405_7_)`
- `EntityAIAvoidEntity(EntityCreature p_i46404_1_, java.lang.Class<T> p_i46404_2_, float p_i46404_3_, double p_i46404_4_, double p_i46404_6_)`

## Methods

- `boolean continueExecuting()` — Returns whether an in-progress EntityAIBase should continue executing
- `void resetTask()` — Resets the task
- `boolean shouldExecute()` — Returns whether the EntityAIBase should begin execution.
- `void startExecuting()` — Execute a one shot task or start executing a continuous task
- `void updateTask()` — Updates the task

## Fields

- `protected T closestLivingEntity`
- `protected EntityCreature theEntity` — The entity we are attached to
