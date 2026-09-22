---
title: "RegistrySimple"
description: "public class RegistrySimple<K, V> extends java.lang.Object implements IRegistry<K, V>"
package: "net/minecraft/util/registry"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/util/registry/RegistrySimple.html"
sourceType: javadoc
---

# RegistrySimple

**Inheritance:** java.lang.Object → net.minecraft.util.registry.RegistrySimple<K, V>

## Class signature

```java
public class RegistrySimple<K, V> extends java.lang.Object implements IRegistry<K, V>
```

## Constructors

- `RegistrySimple()`

## Methods

- `boolean containsKey(K key)`
- `protected java.util.Map<K, V> createUnderlyingMap()`
- `java.util.Set<K> getKeys()`
- `V getObject(K name)`
- `V getRandomObject(java.util.Random random)`
- `java.util.Iterator<V> iterator()`
- `void putObject(K key, V value)`

## Fields

- `protected java.util.Map<K, V> registryObjects`
