---
title: "IForgeRegistry"
description: "public interface IForgeRegistry<V extends IForgeRegistryEntry<V>> extends java.lang.Iterable<V>"
package: "net/minecraftforge/registries"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/registries/IForgeRegistry.html"
sourceType: javadoc
---

# IForgeRegistry

## Class signature

```java
public interface IForgeRegistry<V extends IForgeRegistryEntry<V>> extends java.lang.Iterable<V>
```

## Methods

- `boolean containsKey(ResourceLocation key)`
- `boolean containsValue(V value)`
- `java.util.Set<java.util.Map.Entry<ResourceLocation, V>> getEntries()`
- `ResourceLocation getKey(V value)`
- `java.util.Set<ResourceLocation> getKeys()`
- `java.lang.Class<V> getRegistrySuperType()`
- `<T> T getSlaveMap(ResourceLocation slaveMapName, java.lang.Class<T> type)` — Retrieve the slave map of type T from the registry.
- `V getValue(ResourceLocation key)`
- `@Deprecated java.util.List<V> getValues()` — Deprecated. use getValuesCollection()
- `default java.util.Collection<V> getValuesCollection()`
- `void register(V value)`
- `void registerAll(V ... values)`
