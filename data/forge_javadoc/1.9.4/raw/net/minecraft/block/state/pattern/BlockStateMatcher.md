---
title: "BlockStateMatcher"
description: "public class BlockStateMatcher extends java.lang.Object implements com.google.common.base.Predicate<IBlockState>"
package: "net/minecraft/block/state/pattern"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/state/pattern/BlockStateMatcher.html"
sourceType: javadoc
---

# BlockStateMatcher

**Inheritance:** java.lang.Object → net.minecraft.block.state.pattern.BlockStateMatcher

## Class signature

```java
public class BlockStateMatcher extends java.lang.Object implements com.google.common.base.Predicate<IBlockState>
```

## Methods

- `boolean apply(IBlockState p_apply_1_)`
- `static BlockStateMatcher forBlock(Block blockIn)`
- `protected<T extends java.lang.Comparable<T>> boolean matches(IBlockState blockState, IProperty<T> property, com.google.common.base.Predicate<T> predicate)`
- `<V extends java.lang.Comparable<V>> BlockStateMatcher where(IProperty<V> property, com.google.common.base.Predicate<? extends V> is)`

## Fields

- `static com.google.common.base.Predicate<IBlockState> ANY`
