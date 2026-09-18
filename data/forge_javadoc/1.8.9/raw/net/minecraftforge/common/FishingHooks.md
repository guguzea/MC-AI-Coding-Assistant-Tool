---
title: "FishingHooks"
description: "public class FishingHooks extends java.lang.Object"
package: "net/minecraftforge/common"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/FishingHooks.html"
sourceType: javadoc
---

# FishingHooks

## Class signature

```java
public class FishingHooks extends java.lang.Object
```

## Constructors

- `public FishingHooks()`

## Methods

- `public static void addFish( WeightedRandomFishable item)`
- `public static void addJunk( WeightedRandomFishable item)`
- `public static void addTreasure( WeightedRandomFishable item)`
- `public static void removeFish(<any> test)`
- `public static void removeJunk(<any> test)`
- `public static void removeTreasure(<any> test)`
- `public static ItemStack getRandomFishable(java.util.Random rand, float chance)`
- `public static ItemStack getRandomFishable(java.util.Random rand, float chance, int luck, int speed)`
- `public static FishingHooks.FishableCategory getFishableCategory(float chance, int luck, int speed)`
