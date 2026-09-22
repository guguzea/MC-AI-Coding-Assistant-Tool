---
title: "BlockStatePaletteHashMap"
description: "public class BlockStatePaletteHashMap extends java.lang.Object implements IBlockStatePalette"
package: "net/minecraft/world/chunk"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/chunk/BlockStatePaletteHashMap.html"
sourceType: javadoc
---

# BlockStatePaletteHashMap

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.BlockStatePaletteHashMap

## Class signature

```java
public class BlockStatePaletteHashMap extends java.lang.Object implements IBlockStatePalette
```

## Constructors

- `BlockStatePaletteHashMap(int bitsIn, net.minecraft.world.chunk.IBlockStatePaletteResizer paletteResizerIn)`

## Methods

- `IBlockState getBlockState(int indexKey)`
- `int getSerializedSize()`
- `int idFor(IBlockState state)`
- `void read(PacketBuffer buf)`
- `void write(PacketBuffer buf)`
