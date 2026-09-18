---
title: "EmptyChunk"
description: "public class EmptyChunk extends Chunk"
package: "net/minecraft/world/chunk"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/chunk/EmptyChunk.html"
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
- `public void generateHeightMap()`
- `public void generateSkylightMap()`
- `public IBlockState getBlockState( BlockPos pos)`
- `public int getBlockLightOpacity( BlockPos pos)`
- `public int getLightFor( EnumSkyBlock type, BlockPos pos)`
- `public void setLightFor( EnumSkyBlock type, BlockPos pos, int value)`
- `public int getLightSubtracted( BlockPos pos, int amount)`
- `public void addEntity( Entity entityIn)`
- `public void removeEntity( Entity entityIn)`
- `public void removeEntityAtIndex( Entity entityIn, int index)`
- `public boolean canSeeSky( BlockPos pos)`
- `public TileEntity getTileEntity( BlockPos pos, Chunk.EnumCreateEntityType p_177424_2_)`
- `public void addTileEntity( TileEntity tileEntityIn)`
- `public void addTileEntity( BlockPos pos, TileEntity tileEntityIn)`
- `public void removeTileEntity( BlockPos pos)`
- `public void onLoad()`
- `public void onUnload()`
- `public void markDirty()`
- `public void getEntitiesWithinAABBForEntity( Entity entityIn, AxisAlignedBB aabb, java.util.List< Entity > listToFill, <any> filter)`
- `public <T extends Entity > void getEntitiesOfTypeWithinAABB(java.lang.Class<? extends T> entityClass, AxisAlignedBB aabb, java.util.List<T> listToFill, <any> filter)`
- `public boolean needsSaving(boolean p_76601_1_)`
- `public java.util.Random getRandomWithSeed(long seed)`
- `public boolean isEmpty()`
- `public boolean isEmptyBetween(int startY, int endY)`
