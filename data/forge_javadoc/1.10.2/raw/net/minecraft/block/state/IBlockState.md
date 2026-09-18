---
title: "IBlockState"
description: "public interface IBlockState extends IBlockBehaviors , IBlockProperties"
package: "net/minecraft/block/state"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/state/IBlockState.html"
sourceType: javadoc
---

# IBlockState

## Class signature

```java
public interface IBlockState extends IBlockBehaviors , IBlockProperties
```

## Methods

- `java.util.Collection< IProperty <?>> getPropertyNames()`
- `<T extends java.lang.Comparable<T>> T getValue( IProperty <T> property)`
- `<T extends java.lang.Comparable<T>,V extends T> IBlockState withProperty( IProperty <T> property, V value)`
- `<T extends java.lang.Comparable<T>> IBlockState cycleProperty( IProperty <T> property)`
- `com.google.common.collect.ImmutableMap< IProperty <?>,java.lang.Comparable<?>> getProperties()`
- `Block getBlock()`
