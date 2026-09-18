---
title: "RegistrySimple"
description: "public class RegistrySimple<K,V> extends java.lang.Object implements IRegistry <K,V>"
package: "net/minecraft/util/registry"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/util/registry/RegistrySimple.html"
sourceType: javadoc
---

# RegistrySimple

## Class signature

```java
public class RegistrySimple<K,V> extends java.lang.Object implements IRegistry <K,V>
```

## Constructors

- `public RegistrySimple()`

## Methods

- `protected java.util.Map< K , V > createUnderlyingMap()`
- `public V getObject( K name)`
- `public void putObject( K key, V value)`
- `public java.util.Set< K > getKeys()`
- `public V getRandomObject(java.util.Random random)`
- `public boolean containsKey( K key)`
- `public java.util.Iterator< V > iterator()`
