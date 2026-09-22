---
title: "RegistryNamespacedDefaultedByKey"
description: "public class RegistryNamespacedDefaultedByKey<K, V> extends RegistryNamespaced<K, V>"
package: "net/minecraft/util/registry"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/util/registry/RegistryNamespacedDefaultedByKey.html"
sourceType: javadoc
---

# RegistryNamespacedDefaultedByKey

**Inheritance:** java.lang.Object → net.minecraft.util.registry.RegistrySimple<K, V> → net.minecraft.util.registry.RegistryNamespaced<K, V> → net.minecraft.util.registry.RegistryNamespacedDefaultedByKey<K, V>

## Class signature

```java
public class RegistryNamespacedDefaultedByKey<K, V> extends RegistryNamespaced<K, V>
```

## Methods

- `int getIDForObject(V value)`
- `K getNameForObject(V value)`
- `V getObject(K name)`
- `V getObjectById(int id)`
- `V getRandomObject(java.util.Random random)`
- `void register(int id, K key, V value)`
- `void validateKey()`

## Fields

- `RegistryNamespacedDefaultedByKey`
