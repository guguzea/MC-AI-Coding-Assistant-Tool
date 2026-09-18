---
title: "WeightedRandom"
description: "Returns the total weight of all items in a collection."
package: "net/minecraft/util"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/WeightedRandom.html"
sourceType: javadoc
---

# WeightedRandom

## Class signature

```java
public class WeightedRandom extends java.lang.Object
```

## Constructors

- `public WeightedRandom()`

## Methods

- `public static int getTotalWeight(java.util.Collection<? extends WeightedRandom.Item > collection)`
- `public static <T extends WeightedRandom.Item > T getRandomItem(java.util.Random random, java.util.Collection<T> collection, int totalWeight)`
- `public static <T extends WeightedRandom.Item > T getRandomItem(java.util.Collection<T> collection, int weight)`
- `public static <T extends WeightedRandom.Item > T getRandomItem(java.util.Random random, java.util.Collection<T> collection)`

## Description

Returns the total weight of all items in a collection.
