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