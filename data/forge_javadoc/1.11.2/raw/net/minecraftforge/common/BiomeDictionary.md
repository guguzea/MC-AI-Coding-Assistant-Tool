---
title: "BiomeDictionary"
description: "Adds the given types to the biome."
package: "net/minecraftforge/common"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/BiomeDictionary.html"
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

- `public static void addTypes( Biome biome, BiomeDictionary.Type ... types)`
- `@Nonnull public static java.util.Set< Biome > getBiomes( BiomeDictionary.Type type)`
- `@Nonnull public static java.util.Set< BiomeDictionary.Type > getTypes( Biome biome)`
- `public static boolean areSimilar( Biome biomeA, Biome biomeB)`
- `public static boolean hasType( Biome biome, BiomeDictionary.Type type)`
- `public static boolean hasAnyType( Biome biome)`
- `public static void makeBestGuess( Biome biome)`

## Description

Adds the given types to the biome.
