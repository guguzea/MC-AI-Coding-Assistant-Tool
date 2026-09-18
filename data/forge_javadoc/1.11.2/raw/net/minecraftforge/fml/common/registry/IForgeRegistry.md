---
title: "IForgeRegistry"
description: "Main interface for the registry system. Use this to query the registry system."
package: "net/minecraftforge/fml/common/registry"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/registry/IForgeRegistry.html"
sourceType: javadoc
---

# IForgeRegistry

## Class signature

```java
public interface IForgeRegistry<V extends IForgeRegistryEntry <V>> extends java.lang.Iterable<V>
```

## Methods

- `java.lang.Class< V > getRegistrySuperType()`
- `void register( V value)`
- `void registerAll( V ... values)`
- `boolean containsKey( ResourceLocation key)`
- `boolean containsValue( V value)`
- `@Nullable V getValue( ResourceLocation key)`
- `@Nullable ResourceLocation getKey( V value)`
- `@Nonnull java.util.Set< ResourceLocation > getKeys()`
- `@Nonnull java.util.List< V > getValues()`
- `@Nonnull java.util.Set<java.util.Map.Entry< ResourceLocation , V >> getEntries()`
- `<T> T getSlaveMap( ResourceLocation slaveMapName, java.lang.Class<T> type)`

## Description

Main interface for the registry system. Use this to query the registry system.
