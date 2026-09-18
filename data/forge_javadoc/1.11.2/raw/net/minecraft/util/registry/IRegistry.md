---
title: "IRegistry"
description: "public interface IRegistry<K,V> extends java.lang.Iterable<V>"
package: "net/minecraft/util/registry"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/util/registry/IRegistry.html"
sourceType: javadoc
---

# IRegistry

## Class signature

```java
public interface IRegistry<K,V> extends java.lang.Iterable<V>
```

## Methods

- `@Nullable V getObject( K name)`
- `void putObject( K key, V value)`
- `java.util.Set< K > getKeys()`
