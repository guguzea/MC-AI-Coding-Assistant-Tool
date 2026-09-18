---
title: "BiomeDictionary"
description: "Checks to see if two biomes are registered as having the same type"
package: "net/minecraftforge/common"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/BiomeDictionary.html"
sourceType: javadoc
---

# BiomeDictionary

## Class signature

```java
public class BiomeDictionary extends java.lang.Object
```

## Constructors

- `public BiomeDictionary()`

## Methods

- `public static boolean registerBiomeType( BiomeGenBase biome, BiomeDictionary.Type ... types)`
- `public static BiomeGenBase [] getBiomesForType( BiomeDictionary.Type type)`
- `public static BiomeDictionary.Type [] getTypesForBiome( BiomeGenBase biome)`
- `public static boolean areBiomesEquivalent( BiomeGenBase biomeA, BiomeGenBase biomeB)`
- `public static boolean isBiomeOfType( BiomeGenBase biome, BiomeDictionary.Type type)`
- `public static boolean isBiomeRegistered( BiomeGenBase biome)`
- `public static boolean isBiomeRegistered(int biomeID)`
- `public static void registerAllBiomes()`
- `public static void registerAllBiomesAndGenerateEvents()`
- `public static void makeBestGuess( BiomeGenBase biome)`

## Description

Checks to see if two biomes are registered as having the same type
