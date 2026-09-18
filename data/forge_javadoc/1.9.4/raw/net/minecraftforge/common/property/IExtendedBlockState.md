---
title: "IExtendedBlockState"
description: "public interface IExtendedBlockState extends IBlockState"
package: "net/minecraftforge/common/property"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/common/property/IExtendedBlockState.html"
sourceType: javadoc
---

# IExtendedBlockState

## Class signature

```java
public interface IExtendedBlockState extends IBlockState
```

## Methods

- `java.util.Collection< IUnlistedProperty <?>> getUnlistedNames()`
- `<V> V getValue( IUnlistedProperty <V> property)`
- `<V> IExtendedBlockState withProperty( IUnlistedProperty <V> property, V value)`
- `com.google.common.collect.ImmutableMap< IUnlistedProperty <?>,com.google.common.base.Optional<?>> getUnlistedProperties()`
- `IBlockState getClean()`
