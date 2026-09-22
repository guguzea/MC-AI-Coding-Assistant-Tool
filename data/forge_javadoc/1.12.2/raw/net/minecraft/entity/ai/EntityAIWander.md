---
title: "EntityAIWander"
description: "public class EntityAIWander extends EntityAIBase"
package: "net/minecraft/entity/ai"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/ai/EntityAIWander.html"
sourceType: javadoc
---

# EntityAIWander

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntityAIBase → net.minecraft.entity.ai.EntityAIWander

## Class signature

```java
public class EntityAIWander extends EntityAIBase
```

## Constructors

- `EntityAIWander(EntityCreature creatureIn, double speedIn)`
- `EntityAIWander(EntityCreature creatureIn, double speedIn, int chance)`

## Methods

- `protected Vec3d getPosition()`
- `void makeUpdate()`
- `void setExecutionChance(int newchance)`
- `boolean shouldContinueExecuting()`
- `boolean shouldExecute()`
- `void startExecuting()`

## Fields

- `protected EntityCreature entity`
- `protected int executionChance`
- `protected boolean mustUpdate`
- `protected double speed`
- `protected double x`
- `protected double y`
- `protected double z`
