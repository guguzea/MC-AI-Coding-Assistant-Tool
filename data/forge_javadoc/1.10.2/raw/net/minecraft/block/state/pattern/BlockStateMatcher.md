---
title: "BlockStateMatcher"
description: "public class BlockStateMatcher extends java.lang.Object implements com.google.common.base.Predicate< IBlockState >"
package: "net/minecraft/block/state/pattern"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/state/pattern/BlockStateMatcher.html"
sourceType: javadoc
---

# BlockStateMatcher

## Class signature

```java
public class BlockStateMatcher extends java.lang.Object implements com.google.common.base.Predicate< IBlockState >
```

## Methods

- `public static BlockStateMatcher forBlock( Block blockIn)`
- `public boolean apply(@Nullable IBlockState p_apply_1_)`
- `protected <T extends java.lang.Comparable<T>> boolean matches( IBlockState blockState, IProperty <T> property, com.google.common.base.Predicate<T> predicate)`
- `public <V extends java.lang.Comparable<V>> BlockStateMatcher where( IProperty <V> property, com.google.common.base.Predicate<? extends V> is)`
