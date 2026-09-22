---
title: "EntitySelectors"
description: "public final class EntitySelectors extends java.lang.Object"
package: "net/minecraft/util"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/util/EntitySelectors.html"
sourceType: javadoc
---

# EntitySelectors

**Inheritance:** java.lang.Object → net.minecraft.util.EntitySelectors

## Class signature

```java
public final class EntitySelectors extends java.lang.Object
```

## Constructors

- `EntitySelectors()`

## Methods

- `static<T extends Entity> com.google.common.base.Predicate<T> getTeamCollisionPredicate(Entity entityIn)`
- `static<T extends Entity> com.google.common.base.Predicate<T> withinRange(double x, double y, double z, double range)`

## Fields

- `static com.google.common.base.Predicate<Entity> CAN_AI_TARGET`
- `static com.google.common.base.Predicate<Entity> HAS_INVENTORY`
- `static com.google.common.base.Predicate<Entity> IS_ALIVE`
- `static com.google.common.base.Predicate<Entity> IS_SHULKER`
- `static com.google.common.base.Predicate<Entity> IS_STANDALONE`
- `static com.google.common.base.Predicate<Entity> NOT_SPECTATING`
