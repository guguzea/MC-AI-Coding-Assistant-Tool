---
title: "MobEffectsPredicate"
description: "public class MobEffectsPredicate extends java.lang.Object"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/MobEffectsPredicate.html"
sourceType: javadoc
---

# MobEffectsPredicate

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.MobEffectsPredicate

## Class signature

```java
public class MobEffectsPredicate extends java.lang.Object
```

## Constructors

- `MobEffectsPredicate(java.util.Map<Potion, MobEffectsPredicate.InstancePredicate> effects)`

## Methods

- `static MobEffectsPredicate deserialize(JsonElement element)`
- `boolean test(Entity entityIn)`
- `boolean test(EntityLivingBase entityIn)`
- `boolean test(java.util.Map<Potion, PotionEffect> potions)`

## Fields

- `static MobEffectsPredicate ANY`
