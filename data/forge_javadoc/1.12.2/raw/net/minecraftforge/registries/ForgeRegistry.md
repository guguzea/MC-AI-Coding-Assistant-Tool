---
title: "ForgeRegistry"
description: "public class ForgeRegistry<V extends IForgeRegistryEntry<V>> extends java.lang.Object implements IForgeRegistryInternal<V>, IForgeRegistryModifiable<V>"
package: "net/minecraftforge/registries"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/registries/ForgeRegistry.html"
sourceType: javadoc
---

# ForgeRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.registries.ForgeRegistry<V>

## Class signature

```java
public class ForgeRegistry<V extends IForgeRegistryEntry<V>> extends java.lang.Object implements IForgeRegistryInternal<V>, IForgeRegistryModifiable<V>
```

## Methods

- `void clear()`
- `boolean containsKey(ResourceLocation key)`
- `boolean containsValue(V value)`
- `void freeze()` — Used to control the times where people can modify this registry.
- `java.util.Set<java.util.Map.Entry<ResourceLocation, V>> getEntries()`
- `int getID(ResourceLocation name)`
- `int getID(V value)`
- `ResourceLocation getKey(V value)`
- `java.util.Set<ResourceLocation> getKeys()`
- `RegistryEvent.MissingMappings<?> getMissingEvent(ResourceLocation name, java.util.Map<ResourceLocation, java.lang.Integer> map)`
- `@Deprecated V getRaw(int id)`
- `java.lang.Class<V> getRegistrySuperType()`
- `<T> T getSlaveMap(ResourceLocation name, java.lang.Class<T> type)` — Retrieve the slave map of type T from the registry.
- `V getValue(int id)`
- `V getValue(ResourceLocation key)`
- `@Deprecated java.util.List<V> getValues()` — Deprecated. use getValuesCollection() to avoid copying
- `java.util.Collection<V> getValuesCollection()`
- `boolean isLocked()`
- `java.util.Iterator<V> iterator()`
- `void loadIds(java.util.Map<ResourceLocation, java.lang.Integer> ids, java.util.Map<ResourceLocation, java.lang.String> overrides, java.util.Map<ResourceLocation, java.lang.Integer> missing, java.util.Map<ResourceLocation, java.lang.Integer[]> remapped, ForgeRegistry<V> old, ResourceLocation name)`
- `ForgeRegistry.Snapshot makeSnapshot()`
- `void register(V value)`
- `void registerAll(V ... values)`
- `V remove(ResourceLocation key)`
- `void setSlaveMap(ResourceLocation name, java.lang.Object obj)`
- `void unfreeze()`

## Fields

- `static boolean DEBUG`
