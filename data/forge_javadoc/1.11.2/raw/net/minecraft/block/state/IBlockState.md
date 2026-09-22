---
title: "IBlockState"
description: "public interface IBlockState extends IBlockBehaviors, IBlockProperties"
package: "net/minecraft/block/state"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/state/IBlockState.html"
sourceType: javadoc
---

# IBlockState

## Class signature

```java
public interface IBlockState extends IBlockBehaviors, IBlockProperties
```

## Methods

- `<T extends java.lang.Comparable<T>> IBlockState cycleProperty(IProperty<T> property)`
- `Block getBlock()`
- `com.google.common.collect.ImmutableMap<IProperty<?>, java.lang.Comparable<?>> getProperties()`
- `java.util.Collection<IProperty<?>> getPropertyKeys()`
- `<T extends java.lang.Comparable<T>> T getValue(IProperty<T> property)`
- `<T extends java.lang.Comparable<T>, V extends T> IBlockState withProperty(IProperty<T> property, V value)`
