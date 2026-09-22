# ChestGenHooks

**Inheritance:** java.lang.Object → net.minecraftforge.common.ChestGenHooks

## Class signature

```java
public class ChestGenHooks extends java.lang.Object
```

## Constructors

- `ChestGenHooks(java.lang.String category)`
- `ChestGenHooks(java.lang.String category, java.util.List<WeightedRandomChestContent> items, int min, int max)`

## Methods

- `static void addItem(java.lang.String category, WeightedRandomChestContent item)`
- `void addItem(WeightedRandomChestContent item)` — Adds a new entry into the possible items to generate.
- `static ItemStack [] generateStacks(java.util.Random rand, ItemStack source, int min, int max)` — Generates an array of items based on the input min/max count.
- `int getCount(java.util.Random rand)` — Gets a random number between countMin and countMax.
- `static int getCount(java.lang.String category, java.util.Random rand)`
- `static ChestGenHooks getInfo(java.lang.String category)` — Retrieves, or creates the info class for the specified category.
- `java.util.List<WeightedRandomChestContent> getItems(java.util.Random rnd)` — Gets an array of all random objects that are associated with this category.
- `static java.util.List<WeightedRandomChestContent> getItems(java.lang.String category, java.util.Random rnd)`
- `int getMax()`
- `int getMin()`
- `ItemStack getOneItem(java.util.Random rand)` — Returns a single ItemStack from the possible items in this registry, Useful if you just want a quick and dirty random Item.
- `static ItemStack getOneItem(java.lang.String category, java.util.Random rand)`
- `static void init(java.lang.String category, java.util.List<WeightedRandomChestContent> items, int min, int max)`
- `void removeItem(ItemStack item)` — Removes all items that match the input item stack, Only metadata and item ID are checked.
- `static void removeItem(java.lang.String category, ItemStack item)`
- `void setMax(int value)`
- `void setMin(int value)`

## Fields

- `static java.lang.String BONUS_CHEST`
- `static java.lang.String DUNGEON_CHEST`
- `static java.lang.String MINESHAFT_CORRIDOR`
- `static java.lang.String NETHER_FORTRESS`
- `static java.lang.String PYRAMID_DESERT_CHEST`
- `static java.lang.String PYRAMID_JUNGLE_CHEST`
- `static java.lang.String PYRAMID_JUNGLE_DISPENSER`
- `static java.lang.String STRONGHOLD_CORRIDOR`
- `static java.lang.String STRONGHOLD_CROSSING`
- `static java.lang.String STRONGHOLD_LIBRARY`
- `static java.lang.String VILLAGE_BLACKSMITH`