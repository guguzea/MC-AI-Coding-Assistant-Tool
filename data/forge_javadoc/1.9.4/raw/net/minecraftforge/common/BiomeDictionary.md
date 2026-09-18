---
title: "BiomeDictionary"
description: "Checks to see if two biomes are registered as having the same type"
package: "net/minecraftforge/common"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/common/BiomeDictionary.html"
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

- `public static boolean registerBiomeType( Biome biome, BiomeDictionary.Type ... types)`
- `public static Biome [] getBiomesForType( BiomeDictionary.Type type)`
- `public static BiomeDictionary.Type [] getTypesForBiome( Biome biome)`
- `public static boolean areBiomesEquivalent( Biome biomeA, Biome biomeB)`
- `public static boolean isBiomeOfType( Biome biome, BiomeDictionary.Type type)`
- `public static boolean isBiomeRegistered( Biome biome)`
- `public static void registerAllBiomes()`
- `public static void registerAllBiomesAndGenerateEvents()`
- `public static void makeBestGuess( Biome biome)`

## Description

Checks to see if two biomes are registered as having the same type
