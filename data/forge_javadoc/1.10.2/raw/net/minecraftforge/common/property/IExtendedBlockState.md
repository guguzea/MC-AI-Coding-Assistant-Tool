---
title: "IExtendedBlockState"
description: "public interface IExtendedBlockState extends IBlockState"
package: "net/minecraftforge/common/property"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/common/property/IExtendedBlockState.html"
sourceType: javadoc
---

# IExtendedBlockState

## Class signature

```java
public interface IExtendedBlockState extends IBlockState
```

## Methods

- `IBlockState getClean()`
- `java.util.Collection<IUnlistedProperty<?>> getUnlistedNames()`
- `com.google.common.collect.ImmutableMap<IUnlistedProperty<?>, com.google.common.base.Optional<?>> getUnlistedProperties()`
- `<V> V getValue(IUnlistedProperty<V> property)`
- `<V> IExtendedBlockState withProperty(IUnlistedProperty<V> property, V value)`
