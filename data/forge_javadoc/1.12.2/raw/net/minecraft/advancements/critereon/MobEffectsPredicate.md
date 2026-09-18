---
title: "MobEffectsPredicate"
description: "public class MobEffectsPredicate extends java.lang.Object"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/MobEffectsPredicate.html"
sourceType: javadoc
---

# MobEffectsPredicate

## Class signature

```java
public class MobEffectsPredicate extends java.lang.Object
```

## Constructors

- `public MobEffectsPredicate(java.util.Map< Potion , MobEffectsPredicate.InstancePredicate > effects)`

## Methods

- `public boolean test( Entity entityIn)`
- `public boolean test( EntityLivingBase entityIn)`
- `public boolean test(java.util.Map< Potion , PotionEffect > potions)`
- `public static MobEffectsPredicate deserialize(JsonElement element)`
