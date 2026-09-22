---
title: "RegistryNamespaced"
description: "public class RegistryNamespaced<K, V> extends RegistrySimple<K, V> implements IObjectIntIterable<V>"
package: "net/minecraft/util/registry"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/util/registry/RegistryNamespaced.html"
sourceType: javadoc
---

# RegistryNamespaced

**Inheritance:** java.lang.Object → net.minecraft.util.registry.RegistrySimple<K, V> → net.minecraft.util.registry.RegistryNamespaced<K, V>

## Class signature

```java
public class RegistryNamespaced<K, V> extends RegistrySimple<K, V> implements IObjectIntIterable<V>
```

## Constructors

- `RegistryNamespaced()`

## Methods

- `boolean containsKey(K key)`
- `protected java.util.Map<K, V> createUnderlyingMap()`
- `int getIDForObject(V value)`
- `K getNameForObject(V value)`
- `V getObject(K name)`
- `V getObjectById(int id)`
- `java.util.Iterator<V> iterator()`
- `void register(int id, K key, V value)`

## Fields

- `protected java.util.Map<V, K> inverseObjectRegistry`
- `protected IntIdentityHashBiMap<V> underlyingIntegerMap`
