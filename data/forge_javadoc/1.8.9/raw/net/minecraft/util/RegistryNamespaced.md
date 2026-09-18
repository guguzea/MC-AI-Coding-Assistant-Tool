---
title: "RegistryNamespaced"
description: "Does this registry contain an entry for the given key?"
package: "net/minecraft/util"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/RegistryNamespaced.html"
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

- `public void register(int id, K p_177775_2_, V p_177775_3_)`
- `protected java.util.Map< K , V > createUnderlyingMap()`
- `public V getObject( K name)`
- `public K getNameForObject( V p_177774_1_)`
- `public boolean containsKey( K p_148741_1_)`
- `public int getIDForObject( V p_148757_1_)`
- `public V getObjectById(int id)`
- `public java.util.Iterator< V > iterator()`

## Description

Does this registry contain an entry for the given key?
