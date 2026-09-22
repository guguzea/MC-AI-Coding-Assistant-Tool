---
title: "ObjectIntIdentityMap"
description: "public class ObjectIntIdentityMap<T> extends java.lang.Object implements IObjectIntIterable<T>"
package: "net/minecraft/util"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/util/ObjectIntIdentityMap.html"
sourceType: javadoc
---

# ObjectIntIdentityMap

**Inheritance:** java.lang.Object → net.minecraft.util.ObjectIntIdentityMap<T>

## Class signature

```java
public class ObjectIntIdentityMap<T> extends java.lang.Object implements IObjectIntIterable<T>
```

## Constructors

- `ObjectIntIdentityMap()`
- `ObjectIntIdentityMap(int expectedSize)`

## Methods

- `int get(T key)`
- `T getByValue(int value)`
- `java.util.Iterator<T> iterator()`
- `void put(T key, int value)`
- `int size()`

## Fields

- `protected java.util.IdentityHashMap<T, java.lang.Integer> identityMap`
- `protected java.util.List<T> objectList`
