---
title: "BlockStateContainer"
description: "public class BlockStateContainer extends java.lang.Object"
package: "net/minecraft/world/chunk"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/chunk/BlockStateContainer.html"
sourceType: javadoc
---

# BlockStateContainer

## Class signature

```java
public class BlockStateContainer extends java.lang.Object
```

## Constructors

- `public BlockStateContainer()`

## Methods

- `public int onResize(int bits, IBlockState state)`
- `public void set(int x, int y, int z, IBlockState state)`
- `protected void set(int index, IBlockState state)`
- `public IBlockState get(int x, int y, int z)`
- `protected IBlockState get(int index)`
- `public void read( PacketBuffer buf)`
- `public void write( PacketBuffer buf)`
- `public NibbleArray getDataForNBT(byte[] blockIds, NibbleArray data)`
- `public void setDataFromNBT(byte[] blockIds, NibbleArray data, NibbleArray blockIdExtension)`
- `public int getSerializedSize()`
