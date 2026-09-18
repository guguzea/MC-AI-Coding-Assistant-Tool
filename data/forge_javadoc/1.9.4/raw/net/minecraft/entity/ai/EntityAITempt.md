---
title: "EntityAITempt"
description: "public class EntityAITempt extends EntityAIBase"
package: "net/minecraft/entity/ai"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/ai/EntityAITempt.html"
sourceType: javadoc
---

# EntityAITempt

## Class signature

```java
public class EntityAITempt extends EntityAIBase
```

## Constructors

- `public EntityAITempt( EntityCreature temptedEntityIn, double speedIn, Item temptItemIn, boolean scaredByPlayerMovementIn)`
- `public EntityAITempt( EntityCreature temptedEntityIn, double speedIn, boolean scaredByPlayerMovementIn, java.util.Set< Item > temptItemIn)`

## Methods

- `public boolean shouldExecute()`
- `protected boolean isTempting(@Nullable ItemStack stack)`
- `public boolean continueExecuting()`
- `public void startExecuting()`
- `public void resetTask()`
- `public void updateTask()`
- `public boolean isRunning()`
