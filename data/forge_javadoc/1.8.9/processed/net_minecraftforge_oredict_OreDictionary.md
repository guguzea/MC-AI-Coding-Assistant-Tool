# OreDictionary

## Class signature

```java
public class OreDictionary extends java.lang.Object
```

## Constructors

- `public OreDictionary()`

## Methods

- `public static void initVanillaEntries()`
- `public static int getOreID(java.lang.String name)`
- `public static java.lang.String getOreName(int id)`
- `public static int[] getOreIDs( ItemStack stack)`
- `public static java.util.List< ItemStack > getOres(java.lang.String name)`
- `public static java.util.List< ItemStack > getOres(java.lang.String name, boolean alwaysCreateEntry)`
- `public static boolean doesOreNameExist(java.lang.String name)`
- `public static java.lang.String[] getOreNames()`
- `public static boolean containsMatch(boolean strict, java.util.List< ItemStack > inputs, ItemStack ... targets)`
- `public static boolean itemMatches( ItemStack target, ItemStack input, boolean strict)`
- `public static void registerOre(java.lang.String name, Item ore)`
- `public static void registerOre(java.lang.String name, Block ore)`
- `public static void registerOre(java.lang.String name, ItemStack ore)`
- `public static void rebakeMap()`

## Description

Minecraft changed from -1 to Short.MAX_VALUE in 1.5 release for the "block wildcard".