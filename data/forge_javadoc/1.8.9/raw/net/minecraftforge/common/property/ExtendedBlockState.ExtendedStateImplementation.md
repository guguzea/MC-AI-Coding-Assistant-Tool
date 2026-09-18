---
title: "ExtendedBlockState.ExtendedStateImplementation"
description: ""
package: "net/minecraftforge/common/property"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/property/ExtendedBlockState.ExtendedStateImplementation.html"
sourceType: javadoc
---

# ExtendedBlockState.ExtendedStateImplementation

## Constructors

- `protected ExtendedStateImplementation( Block block, <any> properties, <any> unlistedProperties, <any> table)`

## Methods

- `public <T extends java.lang.Comparable<T>,V extends T> IBlockState withProperty( IProperty <T> property, V value)`
- `public <V> IExtendedBlockState withProperty( IUnlistedProperty <V> property, V value)`
- `public java.util.Collection< IUnlistedProperty <?>> getUnlistedNames()`
- `public <V> V getValue( IUnlistedProperty <V> property)`
- `public <any> getUnlistedProperties()`
- `public void buildPropertyValueTable(java.util.Map<java.util.Map< IProperty ,java.lang.Comparable>, BlockState.StateImplementation > map)`
- `public IBlockState getClean()`
