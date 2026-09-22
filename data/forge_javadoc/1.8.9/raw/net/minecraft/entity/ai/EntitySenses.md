---
title: "EntitySenses"
description: "public class EntitySenses extends java.lang.Object"
package: "net/minecraft/entity/ai"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/ai/EntitySenses.html"
sourceType: javadoc
---

# EntitySenses

**Inheritance:** java.lang.Object → net.minecraft.entity.ai.EntitySenses

## Class signature

```java
public class EntitySenses extends java.lang.Object
```

## Constructors

- `EntitySenses(EntityLiving entityObjIn)`

## Methods

- `boolean canSee(Entity entityIn)` — Checks, whether 'our' entity can see the entity given as argument (true) or not (false), caching the result.
- `void clearSensingCache()` — Clears canSeeCachePositive and canSeeCacheNegative.
