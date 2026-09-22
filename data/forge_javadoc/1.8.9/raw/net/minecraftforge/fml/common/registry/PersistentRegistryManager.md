---
title: "PersistentRegistryManager"
description: "public class PersistentRegistryManager extends java.lang.Object"
package: "net/minecraftforge/fml/common/registry"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/registry/PersistentRegistryManager.html"
sourceType: javadoc
---

# PersistentRegistryManager

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.PersistentRegistryManager

## Class signature

```java
public class PersistentRegistryManager extends java.lang.Object
```

## Constructors

- `PersistentRegistryManager()`

## Methods

- `static<T> FMLControlledNamespacedRegistry<T> createRegistry(ResourceLocation registryName, java.lang.Class<T> registryType, ResourceLocation optionalDefaultKey, int maxId, int minId, boolean hasDelegates)`
- `static<T> FMLControlledNamespacedRegistry<T> createRegistry(ResourceLocation registryName, java.lang.Class<T> registryType, ResourceLocation optionalDefaultKey, int maxId, int minId, boolean hasDelegates, FMLControlledNamespacedRegistry.AddCallback<T> addCallback)`
- `static void freezeData()`
- `static java.util.List<java.lang.String> injectSnapshot(PersistentRegistryManager.GameDataSnapshot snapshot, boolean injectFrozenData, boolean isLocalWorld)`
- `static boolean isFrozen(FMLControlledNamespacedRegistry<?> registry)`
- `static<T> RegistryDelegate<T> makeDelegate(T obj, java.lang.Class<T> rootClass)`
- `static java.util.List<java.lang.String> processIdRematches(java.lang.Iterable<FMLMissingMappingsEvent.MissingMapping> missedMappings, boolean isLocalWorld, java.util.Map<ResourceLocation, java.lang.Integer[]> remapBlocks, java.util.Map<ResourceLocation, java.lang.Integer[]> remapItems)`
- `static void revertToFrozen()`
- `static PersistentRegistryManager.GameDataSnapshot takeSnapshot()`

## Fields

- `static ResourceLocation BLOCKS`
- `static ResourceLocation ITEMS`
- `static ResourceLocation POTIONS`
