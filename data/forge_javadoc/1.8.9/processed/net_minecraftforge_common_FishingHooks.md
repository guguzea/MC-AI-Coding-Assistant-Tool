# FishingHooks

**Inheritance:** java.lang.Object → net.minecraftforge.common.FishingHooks

## Class signature

```java
public class FishingHooks extends java.lang.Object
```

## Constructors

- `FishingHooks()`

## Methods

- `static void addFish(WeightedRandomFishable item)`
- `static void addJunk(WeightedRandomFishable item)`
- `static void addTreasure(WeightedRandomFishable item)`
- `static FishingHooks.FishableCategory getFishableCategory(float chance, int luck, int speed)`
- `static ItemStack getRandomFishable(java.util.Random rand, float chance)`
- `static ItemStack getRandomFishable(java.util.Random rand, float chance, int luck, int speed)`
- `static void removeFish(<any> test)`
- `static void removeJunk(<any> test)`
- `static void removeTreasure(<any> test)`