---
title: "RegistrySimple"
description: "public class RegistrySimple<K, V> extends java.lang.Object implements IRegistry<K, V>"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/RegistrySimple.html"
sourceType: javadoc
---

# RegistrySimple

**Inheritance:** java.lang.Object → net.minecraft.util.RegistrySimple<K, V>

## Class signature

```java
public class RegistrySimple<K, V> extends java.lang.Object implements IRegistry<K, V>
```

## Constructors

- `RegistrySimple()`

## Methods

- `boolean containsKey(K p_148741_1_)` — Does this registry contain an entry for the given key?
- `protected java.util.Map<K, V> createUnderlyingMap()`
- `java.util.Set<K> getKeys()`
- `V getObject(K name)`
- `java.util.Iterator<V> iterator()`
- `void putObject(K key, V value)` — Register an object on this registry.

## Fields

- `protected java.util.Map<K, V> registryObjects`
