---
title: "BlockStateContainer"
description: "public class BlockStateContainer extends java.lang.Object"
package: "net/minecraft/block/state"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/state/BlockStateContainer.html"
sourceType: javadoc
---

# BlockStateContainer

**Inheritance:** java.lang.Object → net.minecraft.block.state.BlockStateContainer

## Class signature

```java
public class BlockStateContainer extends java.lang.Object
```

## Constructors

- `BlockStateContainer(Block blockIn, IProperty<?>... properties)`
- `BlockStateContainer(Block blockIn, IProperty<?>[] properties, com.google.common.collect.ImmutableMap<IUnlistedProperty<?>, com.google.common.base.Optional<?>> unlistedProperties)`

## Methods

- `protected BlockStateContainer.StateImplementation createState(Block block, com.google.common.collect.ImmutableMap<IProperty<?>, java.lang.Comparable<?>> properties, com.google.common.collect.ImmutableMap<IUnlistedProperty<?>, com.google.common.base.Optional<?>> unlistedProperties)`
- `IBlockState getBaseState()`
- `Block getBlock()`
- `java.util.Collection<IProperty<?>> getProperties()`
- `IProperty<?> getProperty(java.lang.String propertyName)`
- `com.google.common.collect.ImmutableList<IBlockState> getValidStates()`
- `java.lang.String toString()`
- `static<T extends java.lang.Comparable<T>> java.lang.String validateProperty(Block block, IProperty<T> property)`
