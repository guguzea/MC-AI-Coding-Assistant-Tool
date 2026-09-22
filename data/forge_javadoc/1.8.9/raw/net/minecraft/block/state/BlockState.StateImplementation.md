---
title: "BlockState.StateImplementation"
description: "public static class BlockState.StateImplementation extends BlockStateBase"
package: "net/minecraft/block/state"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/state/BlockState.StateImplementation.html"
sourceType: javadoc
---

# BlockState.StateImplementation

**Inheritance:** java.lang.Object → net.minecraft.block.state.BlockStateBase → net.minecraft.block.state.BlockState.StateImplementation

## Class signature

```java
public static class BlockState.StateImplementation extends BlockStateBase
```

## Constructors

- `StateImplementation(Block blockIn, <any> propertiesIn)`
- `StateImplementation(Block blockIn, <any> propertiesIn, <any> propertyValueTable)`

## Methods

- `void buildPropertyValueTable(java.util.Map<java.util.Map<IProperty, java.lang.Comparable>, BlockState.StateImplementation> map)`
- `boolean equals(java.lang.Object p_equals_1_)`
- `Block getBlock()`
- `<any> getProperties()`
- `java.util.Collection<IProperty> getPropertyNames()`
- `<any> getPropertyValueTable()`
- `<T extends java.lang.Comparable<T>> T getValue(IProperty<T> property)`
- `int hashCode()`
- `<T extends java.lang.Comparable<T>, V extends T> IBlockState withProperty(IProperty<T> property, V value)`

## Fields

- `protected<any> propertyValueTable`
