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