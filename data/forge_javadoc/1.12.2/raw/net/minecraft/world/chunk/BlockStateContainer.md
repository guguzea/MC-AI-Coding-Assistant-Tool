---
title: "BlockStateContainer"
description: "public class BlockStateContainer extends java.lang.Object"
package: "net/minecraft/world/chunk"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/chunk/BlockStateContainer.html"
sourceType: javadoc
---

# BlockStateContainer

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.BlockStateContainer

## Class signature

```java
public class BlockStateContainer extends java.lang.Object
```

## Constructors

- `BlockStateContainer()`

## Methods

- `protected IBlockState get(int index)`
- `IBlockState get(int x, int y, int z)`
- `NibbleArray getDataForNBT(byte[] blockIds, NibbleArray data)`
- `int getSerializedSize()`
- `int onResize(int bits, IBlockState state)`
- `void read(PacketBuffer buf)`
- `protected void set(int index, IBlockState state)`
- `void set(int x, int y, int z, IBlockState state)`
- `void setDataFromNBT(byte[] blockIds, NibbleArray data, NibbleArray blockIdExtension)`
- `void write(PacketBuffer buf)`

## Fields

- `protected static IBlockState AIR_BLOCK_STATE`
- `protected IBlockStatePalette palette`
- `protected BitArray storage`
