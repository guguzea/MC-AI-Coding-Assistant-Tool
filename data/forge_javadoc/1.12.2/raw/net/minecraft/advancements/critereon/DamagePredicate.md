---
title: "DamagePredicate"
description: "public class DamagePredicate extends java.lang.Object"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/DamagePredicate.html"
sourceType: javadoc
---

# DamagePredicate

## Class signature

```java
public class DamagePredicate extends java.lang.Object
```

## Constructors

- `public DamagePredicate()`
- `public DamagePredicate( MinMaxBounds dealt, MinMaxBounds taken, EntityPredicate sourceEntity, java.lang.Boolean blocked, DamageSourcePredicate type)`

## Methods

- `public boolean test( EntityPlayerMP player, DamageSource source, float dealt, float taken, boolean blocked)`
- `public static DamagePredicate deserialize(JsonElement element)`
