---
title: "BlockStatePaletteRegistry"
description: "public class BlockStatePaletteRegistry extends java.lang.Object implements IBlockStatePalette"
package: "net/minecraft/world/chunk"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/chunk/BlockStatePaletteRegistry.html"
sourceType: javadoc
---

# BlockStatePaletteRegistry

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.BlockStatePaletteRegistry

## Class signature

```java
public class BlockStatePaletteRegistry extends java.lang.Object implements IBlockStatePalette
```

## Constructors

- `BlockStatePaletteRegistry()`

## Methods

- `IBlockState getBlockState(int indexKey)`
- `int getSerializedState()`
- `int idFor(IBlockState state)`
- `void read(PacketBuffer buf)`
- `void write(PacketBuffer buf)`
