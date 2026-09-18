---
title: "IBlockStatePalette"
description: "public interface IBlockStatePalette"
package: "net/minecraft/world/chunk"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/chunk/IBlockStatePalette.html"
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
