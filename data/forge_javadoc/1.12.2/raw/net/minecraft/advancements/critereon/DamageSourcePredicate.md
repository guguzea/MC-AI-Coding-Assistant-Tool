---
title: "DamageSourcePredicate"
description: "public class DamageSourcePredicate extends java.lang.Object"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/DamageSourcePredicate.html"
sourceType: javadoc
---

# DamageSourcePredicate

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.DamageSourcePredicate

## Class signature

```java
public class DamageSourcePredicate extends java.lang.Object
```

## Constructors

- `DamageSourcePredicate()`
- `DamageSourcePredicate(java.lang.Boolean isProjectile, java.lang.Boolean isExplosion, java.lang.Boolean bypassesArmor, java.lang.Boolean bypassesInvulnerability, java.lang.Boolean bypassesMagic, java.lang.Boolean isFire, java.lang.Boolean isMagic, EntityPredicate directEntity, EntityPredicate sourceEntity)`

## Methods

- `static DamageSourcePredicate deserialize(JsonElement element)`
- `boolean test(EntityPlayerMP player, DamageSource source)`

## Fields

- `static DamageSourcePredicate ANY`
