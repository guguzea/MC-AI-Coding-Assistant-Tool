---
title: "IForgeRegistry"
description: "public interface IForgeRegistry<V extends IForgeRegistryEntry<V>> extends java.lang.Iterable<V>"
package: "net/minecraftforge/fml/common/registry"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/registry/IForgeRegistry.html"
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
- `java.util.List<V> getValues()`
- `void register(V value)`
- `void registerAll(V ... values)`
