---
title: "EmptyChunk"
description: "public class EmptyChunk extends Chunk"
package: "net/minecraft/world/chunk"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/chunk/EmptyChunk.html"
sourceType: javadoc
---

# EmptyChunk

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.Chunk → net.minecraft.world.chunk.EmptyChunk

## Class signature

```java
public class EmptyChunk extends Chunk
```

## Methods

- `void addEntity(Entity entityIn)`
- `void addTileEntity(BlockPos pos, TileEntity tileEntityIn)`
- `void addTileEntity(TileEntity tileEntityIn)`
- `boolean canSeeSky(BlockPos pos)`
- `void generateHeightMap()`
- `void generateSkylightMap()`
- `int getBlockLightOpacity(BlockPos pos)`
- `IBlockState getBlockState(BlockPos pos)`
- `<T extends Entity> void getEntitiesOfTypeWithinAABB(java.lang.Class<? extends T> entityClass, AxisAlignedBB aabb, java.util.List<T> listToFill, <any> filter)`
- `void getEntitiesWithinAABBForEntity(Entity entityIn, AxisAlignedBB aabb, java.util.List<Entity> listToFill, <any> filter)`
- `int getHeightValue(int x, int z)`
- `int getLightFor(EnumSkyBlock type, BlockPos pos)`
- `int getLightSubtracted(BlockPos pos, int amount)`
- `java.util.Random getRandomWithSeed(long seed)`
- `TileEntity getTileEntity(BlockPos pos, Chunk.EnumCreateEntityType p_177424_2_)`
- `boolean isAtLocation(int x, int z)`
- `boolean isEmpty()`
- `boolean isEmptyBetween(int startY, int endY)`
- `void markDirty()`
- `boolean needsSaving(boolean p_76601_1_)`
- `void onLoad()`
- `void onUnload()`
- `void removeEntity(Entity entityIn)`
- `void removeEntityAtIndex(Entity entityIn, int index)`
- `void removeTileEntity(BlockPos pos)`
- `void setLightFor(EnumSkyBlock type, BlockPos pos, int value)`

## Fields

- `EmptyChunk`
