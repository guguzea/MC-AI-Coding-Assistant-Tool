---
title: "ExtendedBlockState.ExtendedStateImplementation"
description: ""
package: "net/minecraftforge/common/property"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/property/ExtendedBlockState.ExtendedStateImplementation.html"
sourceType: javadoc
---

# ExtendedBlockState.ExtendedStateImplementation

## Constructors

- `protected ExtendedStateImplementation( Block block, <any> properties, <any> unlistedProperties, <any> table, IBlockState clean)`

## Methods

- `public <T extends java.lang.Comparable<T>,V extends T> IBlockState withProperty( IProperty <T> property, V value)`
- `public <V> IExtendedBlockState withProperty( IUnlistedProperty <V> property, V value)`
- `public java.util.Collection< IUnlistedProperty <?>> getUnlistedNames()`
- `public <V> V getValue( IUnlistedProperty <V> property)`
- `public <any> getUnlistedProperties()`
- `public IBlockState getClean()`
