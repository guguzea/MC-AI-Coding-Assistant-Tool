---
title: "BlockState"
description: "public class BlockState extends java.lang.Object"
package: "net/minecraft/block/state"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/state/BlockState.html"
sourceType: javadoc
---

# BlockState

**Inheritance:** java.lang.Object → net.minecraft.block.state.BlockState

## Class signature

```java
public class BlockState extends java.lang.Object
```

## Constructors

- `BlockState(Block blockIn, IProperty ... properties)`
- `BlockState(Block blockIn, IProperty [] properties, <any> unlistedProperties)`

## Methods

- `protected BlockState.StateImplementation createState(Block block, <any> properties, <any> unlistedProperties)`
- `IBlockState getBaseState()`
- `Block getBlock()`
- `java.util.Collection<IProperty> getProperties()`
- `<any> getValidStates()`
- `java.lang.String toString()`
