---
title: "BlockStateContainer"
description: "Forge added class to make building things easier."
package: "net/minecraft/block/state"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/state/BlockStateContainer.html"
sourceType: javadoc
---

# BlockStateContainer

## Class signature

```java
public class BlockStateContainer extends java.lang.Object
```

## Constructors

- `public BlockStateContainer( Block blockIn, IProperty <?>... properties)`
- `protected BlockStateContainer( Block blockIn, IProperty <?>[] properties, <any> unlistedProperties)`

## Methods

- `protected BlockStateContainer.StateImplementation createState( Block block, <any> properties, <any> unlistedProperties)`
- `public static <T extends java.lang.Comparable<T>> java.lang.String validateProperty( Block block, IProperty <T> property)`
- `public <any> getValidStates()`
- `public IBlockState getBaseState()`
- `public Block getBlock()`
- `public java.util.Collection< IProperty <?>> getProperties()`
- `public java.lang.String toString()`
- `public IProperty <?> getProperty(java.lang.String propertyName)`

## Description

Forge added class to make building things easier.
