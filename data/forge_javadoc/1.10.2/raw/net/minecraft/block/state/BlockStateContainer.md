---
title: "BlockStateContainer"
description: "Forge added class to make building things easier."
package: "net/minecraft/block/state"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/state/BlockStateContainer.html"
sourceType: javadoc
---

# BlockStateContainer

## Class signature

```java
public class BlockStateContainer extends java.lang.Object
```

## Constructors

- `public BlockStateContainer( Block blockIn, IProperty <?>... properties)`
- `protected BlockStateContainer( Block blockIn, IProperty <?>[] properties, com.google.common.collect.ImmutableMap< IUnlistedProperty <?>,com.google.common.base.Optional<?>> unlistedProperties)`

## Methods

- `protected BlockStateContainer.StateImplementation createState( Block block, com.google.common.collect.ImmutableMap< IProperty <?>,java.lang.Comparable<?>> properties, com.google.common.collect.ImmutableMap< IUnlistedProperty <?>,com.google.common.base.Optional<?>> unlistedProperties)`
- `public static <T extends java.lang.Comparable<T>> java.lang.String validateProperty( Block block, IProperty <T> property)`
- `public com.google.common.collect.ImmutableList< IBlockState > getValidStates()`
- `public IBlockState getBaseState()`
- `public Block getBlock()`
- `public java.util.Collection< IProperty <?>> getProperties()`
- `public java.lang.String toString()`
- `@Nullable public IProperty <?> getProperty(java.lang.String propertyName)`

## Description

Forge added class to make building things easier.
