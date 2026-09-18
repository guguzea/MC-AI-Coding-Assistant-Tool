---
title: "GameData"
description: "Deprecated."
package: "net/minecraftforge/fml/common/registry"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/registry/GameData.html"
sourceType: javadoc
---

# GameData

## Class signature

```java
public class GameData extends java.lang.Object
```

## Constructors

- `public GameData()`

## Methods

- `@Deprecated public static FMLControlledNamespacedRegistry < Block > getBlockRegistry()`
- `@Deprecated public static FMLControlledNamespacedRegistry < Item > getItemRegistry()`
- `@Deprecated public static FMLControlledNamespacedRegistry < Potion > getPotionRegistry()`
- `@Deprecated public static FMLControlledNamespacedRegistry < Biome > getBiomeRegistry()`
- `@Deprecated public static FMLControlledNamespacedRegistry < SoundEvent > getSoundEventRegistry()`
- `@Deprecated public static FMLControlledNamespacedRegistry < PotionType > getPotionTypesRegistry()`
- `@Deprecated public static FMLControlledNamespacedRegistry < Enchantment > getEnchantmentRegistry()`
- `protected static GameData getMain()`
- `public static com.google.common.collect.BiMap< Block , Item > getBlockItemMap()`
- `public static ObjectIntIdentityMap < IBlockState > getBlockStateIDMap()`
- `public static void vanillaSnapshot()`
- `public <T extends IForgeRegistryEntry <T>> RegistryDelegate <T> makeDelegate(T obj, java.lang.Class<T> rootClass)`

## Description

Deprecated.
