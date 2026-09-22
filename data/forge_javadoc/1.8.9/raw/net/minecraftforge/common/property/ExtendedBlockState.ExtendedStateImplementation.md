---
title: "ExtendedBlockState.ExtendedStateImplementation"
description: "protected static class ExtendedBlockState.ExtendedStateImplementation extends BlockState.StateImplementation implements IExtendedBlockState"
package: "net/minecraftforge/common/property"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/common/property/ExtendedBlockState.ExtendedStateImplementation.html"
sourceType: javadoc
---

# ExtendedBlockState.ExtendedStateImplementation

**Inheritance:** java.lang.Object → net.minecraft.block.state.BlockStateBase → net.minecraft.block.state.BlockState.StateImplementation → net.minecraftforge.common.property.ExtendedBlockState.ExtendedStateImplementation

## Class signature

```java
protected static class ExtendedBlockState.ExtendedStateImplementation extends BlockState.StateImplementation implements IExtendedBlockState
```

## Methods

- `void buildPropertyValueTable(java.util.Map<java.util.Map<IProperty, java.lang.Comparable>, BlockState.StateImplementation> map)`
- `IBlockState getClean()`
- `java.util.Collection<IUnlistedProperty<?>> getUnlistedNames()`
- `<any> getUnlistedProperties()`
- `<V> V getValue(IUnlistedProperty<V> property)`
- `<T extends java.lang.Comparable<T>, V extends T> IBlockState withProperty(IProperty<T> property, V value)`
- `<V> IExtendedBlockState withProperty(IUnlistedProperty<V> property, V value)`

## Fields

- `protected ExtendedStateImplementation`
