---
title: "EntityAIAvoidEntity"
description: "public class EntityAIAvoidEntity<T extends Entity > extends EntityAIBase"
package: "net/minecraft/entity/ai"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/ai/EntityAIAvoidEntity.html"
sourceType: javadoc
---

# EntityAIAvoidEntity

## Class signature

```java
public class EntityAIAvoidEntity<T extends Entity > extends EntityAIBase
```

## Constructors

- `public EntityAIAvoidEntity( EntityCreature entityIn, java.lang.Class< T > classToAvoidIn, float avoidDistanceIn, double farSpeedIn, double nearSpeedIn)`
- `public EntityAIAvoidEntity( EntityCreature entityIn, java.lang.Class< T > classToAvoidIn, <any> avoidTargetSelectorIn, float avoidDistanceIn, double farSpeedIn, double nearSpeedIn)`

## Methods

- `public boolean shouldExecute()`
- `public boolean shouldContinueExecuting()`
- `public void startExecuting()`
- `public void resetTask()`
- `public void updateTask()`
