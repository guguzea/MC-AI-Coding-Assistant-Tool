---
title: "LocationPredicate"
description: "public class LocationPredicate extends java.lang.Object"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/LocationPredicate.html"
sourceType: javadoc
---

# LocationPredicate

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.LocationPredicate

## Class signature

```java
public class LocationPredicate extends java.lang.Object
```

## Constructors

- `LocationPredicate(MinMaxBounds x, MinMaxBounds y, MinMaxBounds z, Biome biome, java.lang.String feature, DimensionType dimension)`

## Methods

- `static LocationPredicate deserialize(JsonElement element)`
- `boolean test(WorldServer world, double x, double y, double z)`
- `boolean test(WorldServer world, float x, float y, float z)`

## Fields

- `static LocationPredicate ANY`
