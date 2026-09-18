# WeightedRandomChestContent

## Class signature

```java
public class WeightedRandomChestContent extends WeightedRandom.Item
```

## Constructors

- `public WeightedRandomChestContent( Item p_i45311_1_, int p_i45311_2_, int minimumChance, int maximumChance, int itemWeightIn)`
- `public WeightedRandomChestContent( ItemStack stack, int minimumChance, int maximumChance, int itemWeightIn)`

## Methods

- `public static void generateChestContents(java.util.Random random, java.util.List< WeightedRandomChestContent > listIn, IInventory inv, int max)`
- `protected ItemStack [] generateChestContent(java.util.Random random, IInventory newInventory)`
- `public static void generateDispenserContents(java.util.Random random, java.util.List< WeightedRandomChestContent > listIn, TileEntityDispenser dispenser, int max)`
- `public static java.util.List< WeightedRandomChestContent > func_177629_a(java.util.List< WeightedRandomChestContent > p_177629_0_, WeightedRandomChestContent ... p_177629_1_)`

## Description

The maximum stack size of generated item.