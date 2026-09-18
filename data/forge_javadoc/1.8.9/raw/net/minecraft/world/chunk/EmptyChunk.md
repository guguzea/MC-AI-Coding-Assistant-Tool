---
title: "EmptyChunk"
description: "Adds an entity to the chunk."
package: "net/minecraft/world/chunk"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/chunk/EmptyChunk.html"
sourceType: javadoc
---

# EmptyChunk

## Class signature

```java
public class EmptyChunk extends Chunk
```

## Constructors

- `public EmptyChunk( World worldIn, int x, int z)`

## Methods

- `public boolean isAtLocation(int x, int z)`
- `public int getHeightValue(int x, int z)`
- `public void generateSkylightMap()`
- `public void generateHeightMap()`
- `public Block getBlock( BlockPos pos)`
- `public int getBlockLightOpacity( BlockPos pos)`
- `public int getBlockMetadata( BlockPos pos)`
- `public int getLightFor( EnumSkyBlock p_177413_1_, BlockPos pos)`
- `public void setLightFor( EnumSkyBlock p_177431_1_, BlockPos pos, int value)`
- `public int getLightSubtracted( BlockPos pos, int amount)`
- `public void addEntity( Entity entityIn)`
- `public void removeEntity( Entity entityIn)`
- `public void removeEntityAtIndex( Entity entityIn, int p_76608_2_)`
- `public boolean canSeeSky( BlockPos pos)`
- `public TileEntity getTileEntity( BlockPos pos, Chunk.EnumCreateEntityType p_177424_2_)`
- `public void addTileEntity( TileEntity tileEntityIn)`
- `public void addTileEntity( BlockPos pos, TileEntity tileEntityIn)`
- `public void removeTileEntity( BlockPos pos)`
- `public void onChunkLoad()`
- `public void onChunkUnload()`
- `public void setChunkModified()`
- `public void getEntitiesWithinAABBForEntity( Entity entityIn, AxisAlignedBB aabb, java.util.List< Entity > listToFill, <any> p_177414_4_)`
- `public <T extends Entity > void getEntitiesOfTypeWithinAAAB(java.lang.Class<? extends T> entityClass, AxisAlignedBB aabb, java.util.List<T> listToFill, <any> p_177430_4_)`
- `public boolean needsSaving(boolean p_76601_1_)`
- `public java.util.Random getRandomWithSeed(long seed)`
- `public boolean isEmpty()`
- `public boolean getAreLevelsEmpty(int startY, int endY)`

## Description

Adds an entity to the chunk.
