---
title: "BlockStateBase"
description: "public abstract class BlockStateBase extends java.lang.Object implements IBlockState"
package: "net/minecraft/block/state"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/state/BlockStateBase.html"
sourceType: javadoc
---

# BlockStateBase

## Class signature

```java
public abstract class BlockStateBase extends java.lang.Object implements IBlockState
```

## Constructors

- `public BlockStateBase()`

## Methods

- `public <T extends java.lang.Comparable<T>> IBlockState cycleProperty( IProperty <T> property)`
- `protected static <T> T cyclePropertyValue(java.util.Collection<T> values, T currentValue)`
- `public java.lang.String toString()`
- `public com.google.common.collect.ImmutableTable< IProperty <?>,java.lang.Comparable<?>, IBlockState > getPropertyValueTable()`
