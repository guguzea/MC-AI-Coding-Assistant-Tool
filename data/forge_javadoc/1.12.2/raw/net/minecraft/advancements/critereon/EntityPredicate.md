---
title: "EntityPredicate"
description: "public class EntityPredicate extends java.lang.Object"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/EntityPredicate.html"
sourceType: javadoc
---

# EntityPredicate

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.EntityPredicate

## Class signature

```java
public class EntityPredicate extends java.lang.Object
```

## Constructors

- `EntityPredicate(ResourceLocation type, DistancePredicate distance, LocationPredicate location, MobEffectsPredicate effects, NBTPredicate nbt)`

## Methods

- `static EntityPredicate deserialize(JsonElement element)`
- `boolean test(EntityPlayerMP player, Entity entity)`

## Fields

- `static EntityPredicate ANY`
