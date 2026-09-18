---
title: "ExtendedBlockState.ExtendedStateImplementation"
description: ""
package: "net/minecraftforge/common/property"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/property/ExtendedBlockState.ExtendedStateImplementation.html"
sourceType: javadoc
---

# ExtendedBlockState.ExtendedStateImplementation

## Constructors

- `protected ExtendedStateImplementation( Block block, com.google.common.collect.ImmutableMap< IProperty <?>,java.lang.Comparable<?>> properties, com.google.common.collect.ImmutableMap< IUnlistedProperty <?>,com.google.common.base.Optional<?>> unlistedProperties, com.google.common.collect.ImmutableTable< IProperty <?>,java.lang.Comparable<?>, IBlockState > table)`

## Methods

- `public <T extends java.lang.Comparable<T>,V extends T> IBlockState withProperty( IProperty <T> property, V value)`
- `public <V> IExtendedBlockState withProperty( IUnlistedProperty <V> property, V value)`
- `public java.util.Collection< IUnlistedProperty <?>> getUnlistedNames()`
- `public <V> V getValue( IUnlistedProperty <V> property)`
- `public com.google.common.collect.ImmutableMap< IUnlistedProperty <?>,com.google.common.base.Optional<?>> getUnlistedProperties()`
- `public void buildPropertyValueTable(java.util.Map<java.util.Map< IProperty <?>,java.lang.Comparable<?>>, BlockStateContainer.StateImplementation > map)`
- `public IBlockState getClean()`
