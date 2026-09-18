---
title: "ExtendedBlockStorage"
description: "Returns the block for a location in a chunk, with the extended ID merged from a byte array and a NibbleArray to form a full 12-bit block ID."
package: "net/minecraft/world/chunk/storage"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/storage/ExtendedBlockStorage.html"
sourceType: javadoc
---

# ExtendedBlockStorage

## Class signature

```java
public class ExtendedBlockStorage extends java.lang.Object
```

## Constructors

- `public ExtendedBlockStorage(int y, boolean storeSkylight)`

## Methods

- `public IBlockState get(int x, int y, int z)`
- `public void set(int x, int y, int z, IBlockState state)`
- `public Block getBlockByExtId(int x, int y, int z)`
- `public int getExtBlockMetadata(int x, int y, int z)`
- `public boolean isEmpty()`
- `public boolean getNeedsRandomTick()`
- `public int getYLocation()`
- `public void setExtSkylightValue(int x, int y, int z, int value)`
- `public int getExtSkylightValue(int x, int y, int z)`
- `public void setExtBlocklightValue(int x, int y, int z, int value)`
- `public int getExtBlocklightValue(int x, int y, int z)`
- `public void removeInvalidBlocks()`
- `public char[] getData()`
- `public void setData(char[] dataArray)`
- `public NibbleArray getBlocklightArray()`
- `public NibbleArray getSkylightArray()`
- `public void setBlocklightArray( NibbleArray newBlocklightArray)`
- `public void setSkylightArray( NibbleArray newSkylightArray)`

## Description

Returns the block for a location in a chunk, with the extended ID merged from a byte array and a NibbleArray to form a full 12-bit block ID.
