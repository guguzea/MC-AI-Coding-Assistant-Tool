# WeightedRandomChestContent

**Inheritance:** java.lang.Object → net.minecraft.util.WeightedRandom.Item → net.minecraft.util.WeightedRandomChestContent

## Class signature

```java
public class WeightedRandomChestContent extends WeightedRandom.Item
```

## Constructors

- `WeightedRandomChestContent(Item p_i45311_1_, int p_i45311_2_, int minimumChance, int maximumChance, int itemWeightIn)`
- `WeightedRandomChestContent(ItemStack stack, int minimumChance, int maximumChance, int itemWeightIn)`

## Methods

- `static java.util.List<WeightedRandomChestContent> func_177629_a(java.util.List<WeightedRandomChestContent> p_177629_0_, WeightedRandomChestContent ... p_177629_1_)`
- `protected ItemStack [] generateChestContent(java.util.Random random, IInventory newInventory)` — Allow a mod to submit a custom implementation that can delegate item stack generation beyond simple stack lookup
- `static void generateChestContents(java.util.Random random, java.util.List<WeightedRandomChestContent> listIn, IInventory inv, int max)`
- `static void generateDispenserContents(java.util.Random random, java.util.List<WeightedRandomChestContent> listIn, TileEntityDispenser dispenser, int max)`

## Fields

- `int maxStackSize` — The maximum stack size of generated item.
- `int minStackSize` — The minimum stack size of generated item.
- `ItemStack theItemId` — The Item/Block ID to generate in the Chest.