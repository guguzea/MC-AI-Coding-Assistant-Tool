---
title: "IBlockStatePalette"
description: "public interface IBlockStatePalette"
package: "net/minecraft/world/chunk"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/chunk/IBlockStatePalette.html"
sourceType: javadoc
---

# IBlockStatePalette

## Class signature

```java
public interface IBlockStatePalette
```

## Methods

- `int idFor( IBlockState state)`
- `@Nullable IBlockState getBlockState(int indexKey)`
- `void read( PacketBuffer buf)`
- `void write( PacketBuffer buf)`
- `int getSerializedState()`
