---
title: "EntityPredicate"
description: "public class EntityPredicate extends java.lang.Object"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/EntityPredicate.html"
sourceType: javadoc
---

# EntityPredicate

## Class signature

```java
public class EntityPredicate extends java.lang.Object
```

## Constructors

- `public EntityPredicate( ResourceLocation type, DistancePredicate distance, LocationPredicate location, MobEffectsPredicate effects, NBTPredicate nbt)`

## Methods

- `public boolean test( EntityPlayerMP player, Entity entity)`
- `public static EntityPredicate deserialize(JsonElement element)`
