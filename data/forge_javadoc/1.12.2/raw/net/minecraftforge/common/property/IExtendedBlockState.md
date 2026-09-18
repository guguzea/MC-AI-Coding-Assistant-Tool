---
title: "IExtendedBlockState"
description: "public interface IExtendedBlockState extends IBlockState"
package: "net/minecraftforge/common/property"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/property/IExtendedBlockState.html"
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
- `<any> getUnlistedProperties()`
- `IBlockState getClean()`
