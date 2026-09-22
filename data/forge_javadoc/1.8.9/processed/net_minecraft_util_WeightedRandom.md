# WeightedRandom

**Inheritance:** java.lang.Object → net.minecraft.util.WeightedRandom

## Class signature

```java
public class WeightedRandom extends java.lang.Object
```

## Constructors

- `WeightedRandom()`

## Methods

- `static<T extends WeightedRandom.Item> T getRandomItem(java.util.Collection<T> collection, int weight)`
- `static<T extends WeightedRandom.Item> T getRandomItem(java.util.Random random, java.util.Collection<T> collection)`
- `static<T extends WeightedRandom.Item> T getRandomItem(java.util.Random random, java.util.Collection<T> collection, int totalWeight)`
- `static int getTotalWeight(java.util.Collection<? extends WeightedRandom.Item> collection)` — Returns the total weight of all items in a collection.