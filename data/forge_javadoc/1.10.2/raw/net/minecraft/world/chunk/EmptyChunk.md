---
title: "EmptyChunk"
description: "public class EmptyChunk extends Chunk"
package: "net/minecraft/world/chunk"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/chunk/EmptyChunk.html"
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
- `boolean getAreLevelsEmpty(int startY, int endY)`
- `int getBlockLightOpacity(BlockPos pos)`
- `IBlockState getBlockState(BlockPos pos)`
- `<T extends Entity> void getEntitiesOfTypeWithinAAAB(java.lang.Class<? extends T> entityClass, AxisAlignedBB aabb, java.util.List<T> listToFill, com.google.common.base.Predicate<? super T> filter)`
- `void getEntitiesWithinAABBForEntity(Entity entityIn, AxisAlignedBB aabb, java.util.List<Entity> listToFill, com.google.common.base.Predicate<? super Entity> p_177414_4_)`
- `int getHeightValue(int x, int z)`
- `int getLightFor(EnumSkyBlock p_177413_1_, BlockPos pos)`
- `int getLightSubtracted(BlockPos pos, int amount)`
- `java.util.Random getRandomWithSeed(long seed)`
- `TileEntity getTileEntity(BlockPos pos, Chunk.EnumCreateEntityType p_177424_2_)`
- `boolean isAtLocation(int x, int z)`
- `boolean isEmpty()`
- `boolean needsSaving(boolean p_76601_1_)`
- `void onChunkLoad()`
- `void onChunkUnload()`
- `void removeEntity(Entity entityIn)`
- `void removeEntityAtIndex(Entity entityIn, int index)`
- `void removeTileEntity(BlockPos pos)`
- `void setChunkModified()`
- `void setLightFor(EnumSkyBlock p_177431_1_, BlockPos pos, int value)`

## Fields

- `EmptyChunk`
