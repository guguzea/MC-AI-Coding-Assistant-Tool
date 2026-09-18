---
title: "RegistryNamespacedDefaultedByKey"
description: "public class RegistryNamespacedDefaultedByKey<K,V> extends RegistryNamespaced <K,V>"
package: "net/minecraft/util/registry"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/util/registry/RegistryNamespacedDefaultedByKey.html"
sourceType: javadoc
---

# RegistryNamespacedDefaultedByKey

## Class signature

```java
public class RegistryNamespacedDefaultedByKey<K,V> extends RegistryNamespaced <K,V>
```

## Constructors

- `public RegistryNamespacedDefaultedByKey( K defaultValueKeyIn)`

## Methods

- `public void register(int id, K key, V value)`
- `public void validateKey()`
- `public int getIDForObject( V value)`
- `public K getNameForObject( V value)`
- `public V getObject( K name)`
- `public V getObjectById(int id)`
- `public V getRandomObject(java.util.Random random)`
