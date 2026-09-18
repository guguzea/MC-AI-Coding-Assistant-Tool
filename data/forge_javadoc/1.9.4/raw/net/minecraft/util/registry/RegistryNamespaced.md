---
title: "RegistryNamespaced"
description: "public class RegistryNamespaced<K,V> extends RegistrySimple <K,V> implements IObjectIntIterable <V>"
package: "net/minecraft/util/registry"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/util/registry/RegistryNamespaced.html"
sourceType: javadoc
---

# RegistryNamespaced

## Class signature

```java
public class RegistryNamespaced<K,V> extends RegistrySimple <K,V> implements IObjectIntIterable <V>
```

## Constructors

- `public RegistryNamespaced()`

## Methods

- `public void register(int id, K key, V value)`
- `protected java.util.Map< K , V > createUnderlyingMap()`
- `@Nullable public V getObject(@Nullable K name)`
- `@Nullable public K getNameForObject( V value)`
- `public boolean containsKey( K key)`
- `public int getIDForObject( V value)`
- `@Nullable public V getObjectById(int id)`
- `public java.util.Iterator< V > iterator()`
