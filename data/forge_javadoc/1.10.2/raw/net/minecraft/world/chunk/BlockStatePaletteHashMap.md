---
title: "BlockStatePaletteHashMap"
description: "public class BlockStatePaletteHashMap extends java.lang.Object implements IBlockStatePalette"
package: "net/minecraft/world/chunk"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/chunk/BlockStatePaletteHashMap.html"
sourceType: javadoc
---

# BlockStatePaletteHashMap

## Class signature

```java
public class BlockStatePaletteHashMap extends java.lang.Object implements IBlockStatePalette
```

## Constructors

- `public BlockStatePaletteHashMap(int bitsIn, net.minecraft.world.chunk.IBlockStatePaletteResizer p_i47089_2_)`

## Methods

- `public int idFor( IBlockState state)`
- `@Nullable public IBlockState getBlockState(int indexKey)`
- `public void read( PacketBuffer buf)`
- `public void write( PacketBuffer buf)`
- `public int getSerializedState()`
