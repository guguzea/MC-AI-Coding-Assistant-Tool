---
title: "GameData"
description: "public class GameData extends java.lang.Object"
package: "net/minecraftforge/fml/common/registry"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/registry/GameData.html"
sourceType: javadoc
---

# GameData

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.GameData

## Class signature

```java
public class GameData extends java.lang.Object
```

## Constructors

- `GameData()`

## Methods

- `static java.util.Map<Block, Item> getBlockItemMap()`
- `static FMLControlledNamespacedRegistry<Block> getBlockRegistry()` — Get the currently active block registry.
- `static net.minecraftforge.fml.common.registry.GameData.ClearableObjectIntIdentityMap<IBlockState> getBlockStateIDMap()`
- `static FMLControlledNamespacedRegistry<Item> getItemRegistry()` — Get the currently active item registry.
- `protected static GameData getMain()`
- `static FMLControlledNamespacedRegistry<Potion> getPotionRegistry()` — Get the currently active potion registry.
- `<T> RegistryDelegate<T> makeDelegate(T obj, java.lang.Class<T> rootClass)`

## Fields

- `static int MAX_POTION_ID`
- `static int MIN_POTION_ID`
