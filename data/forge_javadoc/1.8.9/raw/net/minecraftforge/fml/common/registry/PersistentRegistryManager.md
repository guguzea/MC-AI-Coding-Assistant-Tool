---
title: "PersistentRegistryManager"
description: "Persistent registry manager. Manages the registries loading from disk, and from network. Handles staging registry data before loading uniformly into the active registry, and keeps a frozen registry in"
package: "net/minecraftforge/fml/common/registry"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/registry/PersistentRegistryManager.html"
sourceType: javadoc
---

# PersistentRegistryManager

## Class signature

```java
public class PersistentRegistryManager extends java.lang.Object
```

## Constructors

- `public PersistentRegistryManager()`

## Methods

- `public static <T> FMLControlledNamespacedRegistry <T> createRegistry( ResourceLocation registryName, java.lang.Class<T> registryType, ResourceLocation optionalDefaultKey, int maxId, int minId, boolean hasDelegates, FMLControlledNamespacedRegistry.AddCallback <T> addCallback)`
- `public static <T> FMLControlledNamespacedRegistry <T> createRegistry( ResourceLocation registryName, java.lang.Class<T> registryType, ResourceLocation optionalDefaultKey, int maxId, int minId, boolean hasDelegates)`
- `public static java.util.List<java.lang.String> injectSnapshot( PersistentRegistryManager.GameDataSnapshot snapshot, boolean injectFrozenData, boolean isLocalWorld)`
- `public static boolean isFrozen( FMLControlledNamespacedRegistry <?> registry)`
- `public static void revertToFrozen()`
- `public static void freezeData()`
- `public static java.util.List<java.lang.String> processIdRematches(java.lang.Iterable< FMLMissingMappingsEvent.MissingMapping > missedMappings, boolean isLocalWorld, java.util.Map< ResourceLocation ,java.lang.Integer[]> remapBlocks, java.util.Map< ResourceLocation ,java.lang.Integer[]> remapItems)`
- `public static PersistentRegistryManager.GameDataSnapshot takeSnapshot()`
- `public static <T> RegistryDelegate <T> makeDelegate(T obj, java.lang.Class<T> rootClass)`

## Description

Persistent registry manager. Manages the registries loading from disk, and from network. Handles staging registry data before loading uniformly into the active registry, and keeps a frozen registry in
