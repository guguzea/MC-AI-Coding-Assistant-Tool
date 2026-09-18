---
title: "ExtendedBlockStorage"
description: "public class ExtendedBlockStorage extends java.lang.Object"
package: "net/minecraft/world/chunk/storage"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/chunk/storage/ExtendedBlockStorage.html"
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
- `public boolean isEmpty()`
- `public boolean getNeedsRandomTick()`
- `public int getYLocation()`
- `public void setExtSkylightValue(int x, int y, int z, int value)`
- `public int getExtSkylightValue(int x, int y, int z)`
- `public void setExtBlocklightValue(int x, int y, int z, int value)`
- `public int getExtBlocklightValue(int x, int y, int z)`
- `public void removeInvalidBlocks()`
- `public BlockStateContainer getData()`
- `public NibbleArray getBlocklightArray()`
- `public NibbleArray getSkylightArray()`
- `public void setBlocklightArray( NibbleArray newBlocklightArray)`
- `public void setSkylightArray( NibbleArray newSkylightArray)`
