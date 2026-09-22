---
title: "OreDictionary"
description: "public class OreDictionary extends java.lang.Object"
package: "net/minecraftforge/oredict"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/oredict/OreDictionary.html"
sourceType: javadoc
---

# OreDictionary

**Inheritance:** java.lang.Object → net.minecraftforge.oredict.OreDictionary

## Class signature

```java
public class OreDictionary extends java.lang.Object
```

## Constructors

- `OreDictionary()`

## Methods

- `static boolean containsMatch(boolean strict, NonNullList<ItemStack> inputs, ItemStack ... targets)`
- `static boolean doesOreNameExist(java.lang.String name)` — Returns whether or not an oreName exists in the dictionary.
- `static int getOreID(java.lang.String name)` — Gets the integer ID for the specified ore name.
- `static int[] getOreIDs(ItemStack stack)` — Gets all the integer ID for the ores that the specified item stack is registered to.
- `static java.lang.String getOreName(int id)` — Reverse of getOreID, will not create new entries.
- `static java.lang.String[] getOreNames()` — Retrieves a list of all unique ore names that are already registered.
- `static NonNullList<ItemStack> getOres(java.lang.String name)` — Retrieves the ArrayList of items that are registered to this ore type.
- `static NonNullList<ItemStack> getOres(java.lang.String name, boolean alwaysCreateEntry)` — Retrieves the List of items that are registered to this ore type at this instant.
- `static boolean itemMatches(ItemStack target, ItemStack input, boolean strict)`
- `static void rebakeMap()`
- `static void registerOre(java.lang.String name, Block ore)`
- `static void registerOre(java.lang.String name, Item ore)`
- `static void registerOre(java.lang.String name, ItemStack ore)`

## Fields

- `static NonNullList<ItemStack> EMPTY_LIST`
- `static int WILDCARD_VALUE` — Minecraft changed from -1 to Short.MAX_VALUE in 1.5 release for the "block wildcard".
