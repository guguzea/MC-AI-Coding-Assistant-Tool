---
title: "RegistryManager"
description: "public class RegistryManager extends java.lang.Object"
package: "net/minecraftforge/registries"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/registries/RegistryManager.html"
sourceType: javadoc
---

# RegistryManager

**Inheritance:** java.lang.Object → net.minecraftforge.registries.RegistryManager

## Class signature

```java
public class RegistryManager extends java.lang.Object
```

## Constructors

- `RegistryManager(java.lang.String name)`

## Methods

- `void clean()`
- `java.lang.String getName()`
- `<V extends IForgeRegistryEntry<V>> ResourceLocation getName(IForgeRegistry<V> reg)`
- `<V extends IForgeRegistryEntry<V>> IForgeRegistry<V> getRegistry(java.lang.Class<V> cls)`
- `<V extends IForgeRegistryEntry<V>> ForgeRegistry<V> getRegistry(ResourceLocation key)`
- `<V extends IForgeRegistryEntry<V>> ForgeRegistry<V> getRegistry(ResourceLocation key, RegistryManager other)`
- `<V extends IForgeRegistryEntry<V>> java.lang.Class<V> getSuperType(ResourceLocation key)`
- `java.util.Map<ResourceLocation, ForgeRegistry.Snapshot> takeSnapshot(boolean savingToDisc)`

## Fields

- `static RegistryManager ACTIVE`
- `static RegistryManager FROZEN`
- `static RegistryManager VANILLA`
