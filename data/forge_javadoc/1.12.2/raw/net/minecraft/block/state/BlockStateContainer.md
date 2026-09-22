---
title: "BlockStateContainer"
description: "public class BlockStateContainer extends java.lang.Object"
package: "net/minecraft/block/state"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/state/BlockStateContainer.html"
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
- `BlockStateContainer(Block blockIn, IProperty<?>[] properties, <any> unlistedProperties)`

## Methods

- `protected BlockStateContainer.StateImplementation createState(Block block, <any> properties, <any> unlistedProperties)`
- `IBlockState getBaseState()`
- `Block getBlock()`
- `java.util.Collection<IProperty<?>> getProperties()`
- `IProperty<?> getProperty(java.lang.String propertyName)`
- `<any> getValidStates()`
- `java.lang.String toString()`
- `static<T extends java.lang.Comparable<T>> java.lang.String validateProperty(Block block, IProperty<T> property)`
