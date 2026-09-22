---
title: "ObjectIntIdentityMap"
description: "public class ObjectIntIdentityMap<T> extends java.lang.Object implements IObjectIntIterable<T>"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/ObjectIntIdentityMap.html"
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

## Methods

- `int get(T key)`
- `T getByValue(int value)`
- `java.util.Iterator<T> iterator()`
- `void put(T key, int value)`

## Fields

- `protected java.util.IdentityHashMap<T, java.lang.Integer> identityMap`
- `protected java.util.List<T> objectList`
