---
title: "EmptyChunk"
description: "public class EmptyChunk extends Chunk"
package: "net/minecraft/world/chunk"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/EmptyChunk.html"
sourceType: javadoc
---

# EmptyChunk

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.Chunk → net.minecraft.world.chunk.EmptyChunk

## Class signature

```java
public class EmptyChunk extends Chunk
```

## Methods

- `void addEntity(Entity entityIn)` — Adds an entity to the chunk.
- `void addTileEntity(BlockPos pos, TileEntity tileEntityIn)`
- `void addTileEntity(TileEntity tileEntityIn)`
- `boolean canSeeSky(BlockPos pos)`
- `void generateHeightMap()` — Generates the height map for a chunk from scratch
- `void generateSkylightMap()` — Generates the initial skylight map for the chunk upon generation or load.
- `boolean getAreLevelsEmpty(int startY, int endY)` — Returns whether the ExtendedBlockStorages containing levels (in blocks) from arg 1 to arg 2 are fully empty (true) or not (false).
- `Block getBlock(BlockPos pos)`
- `int getBlockLightOpacity(BlockPos pos)`
- `int getBlockMetadata(BlockPos pos)`
- `<T extends Entity> void getEntitiesOfTypeWithinAAAB(java.lang.Class<? extends T> entityClass, AxisAlignedBB aabb, java.util.List<T> listToFill, <any> p_177430_4_)`
- `void getEntitiesWithinAABBForEntity(Entity entityIn, AxisAlignedBB aabb, java.util.List<Entity> listToFill, <any> p_177414_4_)` — Fills the given list of all entities that intersect within the given bounding box that aren't the passed entity.
- `int getHeightValue(int x, int z)` — Returns the value in the height map at this x, z coordinate in the chunk
- `int getLightFor(EnumSkyBlock p_177413_1_, BlockPos pos)`
- `int getLightSubtracted(BlockPos pos, int amount)`
- `java.util.Random getRandomWithSeed(long seed)`
- `TileEntity getTileEntity(BlockPos pos, Chunk.EnumCreateEntityType p_177424_2_)`
- `boolean isAtLocation(int x, int z)` — Checks whether the chunk is at the X/Z location specified
- `boolean isEmpty()`
- `boolean needsSaving(boolean p_76601_1_)` — Returns true if this Chunk needs to be saved
- `void onChunkLoad()` — Called when this Chunk is loaded by the ChunkProvider
- `void onChunkUnload()` — Called when this Chunk is unloaded by the ChunkProvider
- `void removeEntity(Entity entityIn)` — removes entity using its y chunk coordinate as its index
- `void removeEntityAtIndex(Entity entityIn, int p_76608_2_)` — Removes entity at the specified index from the entity array.
- `void removeTileEntity(BlockPos pos)`
- `void setChunkModified()` — Sets the isModified flag for this Chunk
- `void setLightFor(EnumSkyBlock p_177431_1_, BlockPos pos, int value)`

## Fields

- `EmptyChunk`
