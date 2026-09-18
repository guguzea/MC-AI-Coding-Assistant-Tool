---
title: "GameData"
description: "Get the currently active block registry."
package: "net/minecraftforge/fml/common/registry"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/registry/GameData.html"
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

- `public static FMLControlledNamespacedRegistry < Block > getBlockRegistry()`
- `public static FMLControlledNamespacedRegistry < Item > getItemRegistry()`
- `public static FMLControlledNamespacedRegistry < Potion > getPotionRegistry()`
- `protected static GameData getMain()`
- `public static java.util.Map< Block , Item > getBlockItemMap()`
- `public static net.minecraftforge.fml.common.registry.GameData.ClearableObjectIntIdentityMap< IBlockState > getBlockStateIDMap()`
- `public <T> RegistryDelegate <T> makeDelegate(T obj, java.lang.Class<T> rootClass)`

## Description

Get the currently active block registry.
