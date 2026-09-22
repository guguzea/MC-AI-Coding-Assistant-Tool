---
title: "BiomeDictionary"
description: "public class BiomeDictionary extends java.lang.Object"
package: "net/minecraftforge/common"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/BiomeDictionary.html"
sourceType: javadoc
---

# BiomeDictionary

**Inheritance:** java.lang.Object → net.minecraftforge.common.BiomeDictionary

## Class signature

```java
public class BiomeDictionary extends java.lang.Object
```

## Constructors

- `BiomeDictionary()`

## Methods

- `static boolean areBiomesEquivalent(Biome biomeA, Biome biomeB)` — Checks to see if two biomes are registered as having the same type
- `static Biome [] getBiomesForType(BiomeDictionary.Type type)` — Returns a list of biomes registered with a specific type
- `static BiomeDictionary.Type [] getTypesForBiome(Biome biome)` — Gets a list of Types that a specific biome is registered with
- `static boolean isBiomeOfType(Biome biome, BiomeDictionary.Type type)` — Checks to see if the given biome is registered as being a specific type
- `static boolean isBiomeRegistered(Biome biome)` — Checks to see if the given biome has been registered as being of any type
- `static void makeBestGuess(Biome biome)` — Automatically looks for and registers a given biome with appropriate tags This method is called automatically if a biome has not been registered with any tags, And another method requests information about it
- `static void registerAllBiomes()`
- `static void registerAllBiomesAndGenerateEvents()` — Loops through the biome list and automatically adds tags to any biome that does not have any This is called by Forge at postinit time.
- `static boolean registerBiomeType(Biome biome, BiomeDictionary.Type ... types)` — Registers a biome with a specific biome type
