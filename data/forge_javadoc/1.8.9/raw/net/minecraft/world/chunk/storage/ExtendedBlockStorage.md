---
title: "ExtendedBlockStorage"
description: "public class ExtendedBlockStorage extends java.lang.Object"
package: "net/minecraft/world/chunk/storage"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/storage/ExtendedBlockStorage.html"
sourceType: javadoc
---

# ExtendedBlockStorage

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.storage.ExtendedBlockStorage

## Class signature

```java
public class ExtendedBlockStorage extends java.lang.Object
```

## Constructors

- `ExtendedBlockStorage(int y, boolean storeSkylight)`

## Methods

- `IBlockState get(int x, int y, int z)`
- `Block getBlockByExtId(int x, int y, int z)` — Returns the block for a location in a chunk, with the extended ID merged from a byte array and a NibbleArray to form a full 12-bit block ID.
- `NibbleArray getBlocklightArray()` — Returns the NibbleArray instance containing Block-light data.
- `char[] getData()`
- `int getExtBlocklightValue(int x, int y, int z)` — Gets the saved Block-light value in the extended block storage structure.
- `int getExtBlockMetadata(int x, int y, int z)` — Returns the metadata associated with the block at the given coordinates in this ExtendedBlockStorage.
- `int getExtSkylightValue(int x, int y, int z)` — Gets the saved Sky-light value in the extended block storage structure.
- `boolean getNeedsRandomTick()` — Returns whether or not this block storage's Chunk will require random ticking, used to avoid looping through random block ticks when there are no blocks that would randomly tick.
- `NibbleArray getSkylightArray()` — Returns the NibbleArray instance containing Sky-light data.
- `int getYLocation()` — Returns the Y location of this ExtendedBlockStorage.
- `boolean isEmpty()` — Returns whether or not this block storage's Chunk is fully empty, based on its internal reference count.
- `void removeInvalidBlocks()`
- `void set(int x, int y, int z, IBlockState state)`
- `void setBlocklightArray(NibbleArray newBlocklightArray)` — Sets the NibbleArray instance used for Block-light values in this particular storage block.
- `void setData(char[] dataArray)`
- `void setExtBlocklightValue(int x, int y, int z, int value)` — Sets the saved Block-light value in the extended block storage structure.
- `void setExtSkylightValue(int x, int y, int z, int value)` — Sets the saved Sky-light value in the extended block storage structure.
- `void setSkylightArray(NibbleArray newSkylightArray)` — Sets the NibbleArray instance used for Sky-light values in this particular storage block.
