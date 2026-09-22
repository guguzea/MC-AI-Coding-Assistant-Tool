---
title: "IBlockState"
description: "public interface IBlockState"
package: "net/minecraft/block/state"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/state/IBlockState.html"
sourceType: javadoc
---

# IBlockState

## Class signature

```java
public interface IBlockState
```

## Methods

- `<T extends java.lang.Comparable<T>> IBlockState cycleProperty(IProperty<T> property)`
- `Block getBlock()`
- `<any> getProperties()`
- `java.util.Collection<IProperty> getPropertyNames()`
- `<T extends java.lang.Comparable<T>> T getValue(IProperty<T> property)`
- `<T extends java.lang.Comparable<T>, V extends T> IBlockState withProperty(IProperty<T> property, V value)`
