---
title: "EntityHasScore"
description: "public class EntityHasScore extends java.lang.Object implements LootCondition"
package: "net/minecraft/world/storage/loot/conditions"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/storage/loot/conditions/EntityHasScore.html"
sourceType: javadoc
---

# EntityHasScore

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.conditions.EntityHasScore

## Class signature

```java
public class EntityHasScore extends java.lang.Object implements LootCondition
```

## Constructors

- `EntityHasScore(java.util.Map<java.lang.String, RandomValueRange> scoreIn, LootContext.EntityTarget targetIn)`

## Methods

- `protected boolean entityScoreMatch(Entity entityIn, Scoreboard scoreboardIn, java.lang.String objectiveStr, RandomValueRange rand)`
- `boolean testCondition(java.util.Random rand, LootContext context)`
