---
title: "BiomeDictionary"
description: "public class BiomeDictionary extends java.lang.Object"
package: "net/minecraftforge/common"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/BiomeDictionary.html"
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

- `static boolean areBiomesEquivalent(BiomeGenBase biomeA, BiomeGenBase biomeB)` — Checks to see if two biomes are registered as having the same type
- `static BiomeGenBase [] getBiomesForType(BiomeDictionary.Type type)` — Returns a list of biomes registered with a specific type
- `static BiomeDictionary.Type [] getTypesForBiome(BiomeGenBase biome)` — Gets a list of Types that a specific biome is registered with
- `static boolean isBiomeOfType(BiomeGenBase biome, BiomeDictionary.Type type)` — Checks to see if the given biome is registered as being a specific type
- `static boolean isBiomeRegistered(BiomeGenBase biome)` — Checks to see if the given biome has been registered as being of any type
- `static boolean isBiomeRegistered(int biomeID)`
- `static void makeBestGuess(BiomeGenBase biome)` — Automatically looks for and registers a given biome with appropriate tags This method is called automatically if a biome has not been registered with any tags, And another method requests information about it
- `static void registerAllBiomes()`
- `static void registerAllBiomesAndGenerateEvents()` — Loops through the biome list and automatically adds tags to any biome that does not have any This is called by Forge at postinit time.
- `static boolean registerBiomeType(BiomeGenBase biome, BiomeDictionary.Type ... types)` — Registers a biome with a specific biome type
