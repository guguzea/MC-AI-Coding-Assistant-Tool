---
title: "DamagePredicate"
description: "public class DamagePredicate extends java.lang.Object"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/DamagePredicate.html"
sourceType: javadoc
---

# DamagePredicate

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.DamagePredicate

## Class signature

```java
public class DamagePredicate extends java.lang.Object
```

## Constructors

- `DamagePredicate()`
- `DamagePredicate(MinMaxBounds dealt, MinMaxBounds taken, EntityPredicate sourceEntity, java.lang.Boolean blocked, DamageSourcePredicate type)`

## Methods

- `static DamagePredicate deserialize(JsonElement element)`
- `boolean test(EntityPlayerMP player, DamageSource source, float dealt, float taken, boolean blocked)`

## Fields

- `static DamagePredicate ANY`
